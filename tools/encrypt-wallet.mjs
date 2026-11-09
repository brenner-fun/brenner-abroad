// Encrypts a private HTML page into a password-locked static page.
// Usage: node tools/encrypt-wallet.mjs <source.html> <out/index.html> <passphrase>
// The output is a small shell page: the browser derives a key from the passphrase (PBKDF2-SHA256, 310k rounds)
// and decrypts the embedded AES-256-GCM payload. Without the passphrase the content is unreadable.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomBytes, pbkdf2Sync, createCipheriv } from "node:crypto";

const [src, out, pass] = process.argv.slice(2);
if (!src || !out || !pass) { console.error("usage: node tools/encrypt-wallet.mjs <source.html> <out.html> <passphrase>"); process.exit(1); }

const ITER = 310000;
const salt = randomBytes(16), iv = randomBytes(12);
const key = pbkdf2Sync(pass, salt, ITER, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
const plain = readFileSync(src);
const enc = Buffer.concat([cipher.update(plain), cipher.final(), cipher.getAuthTag()]);
const b64 = (b) => Buffer.from(b).toString("base64");

const shell = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive"><title>Brenner Abroad</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
:root{color-scheme:dark}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0D0F1F;color:#EEF0FA;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:max(16px,env(safe-area-inset-left,0px))}
.box{width:min(380px,100%);text-align:center}
h1{font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:900;font-size:clamp(44px,12vw,64px);line-height:.9;letter-spacing:.01em;text-transform:uppercase;margin:0 0 6px}
p{color:#8F93B4;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 26px}
form{display:flex;flex-direction:column;gap:12px}
input{font:inherit;font-size:18px;padding:12px 14px;border-radius:6px;border:1px solid #3B4672;background:#161935;color:#EEF0FA;text-align:center;letter-spacing:.04em}
input:focus{outline:3px solid #3CC3F0;outline-offset:2px}
button{font:inherit;font-weight:600;font-size:16px;padding:12px;border-radius:6px;border:0;background:#FFC83D;color:#14152B;cursor:pointer}
button[disabled]{opacity:.6;cursor:default}
label{display:flex;gap:8px;justify-content:center;align-items:center;font-size:13px;color:#C3C7E1}
.msg{min-height:1.4em;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12px;color:#FF7A5E}
</style></head><body>
<div class="box">
  <h1>Brenner Abroad</h1>
  <p>Trip wallet · private</p>
  <form id="f">
    <label for="pw" style="display:none">Passphrase</label>
    <input id="pw" type="password" autocomplete="current-password" placeholder="Passphrase" autofocus required>
    <button id="go" type="submit">Unlock</button>
    <label><input type="checkbox" id="keep"> Stay unlocked on this device</label>
    <div class="msg" id="msg" role="status"></div>
  </form>
</div>
<script>
const SALT="${b64(salt)}",IV="${b64(iv)}",DATA="${b64(enc)}",ITER=${ITER};
const u8=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function keyFor(pw){const km=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"PBKDF2",salt:u8(SALT),iterations:ITER,hash:"SHA-256"},km,{name:"AES-GCM",length:256},true,["decrypt"])}
async function open(key){const buf=await crypto.subtle.decrypt({name:"AES-GCM",iv:u8(IV)},key,u8(DATA));
  const html=new TextDecoder().decode(buf);document.open();document.write(html);document.close()}
const f=document.getElementById("f"),pw=document.getElementById("pw"),msg=document.getElementById("msg"),go=document.getElementById("go"),keep=document.getElementById("keep");
f.addEventListener("submit",async e=>{e.preventDefault();go.disabled=true;msg.textContent="Unlocking…";
  try{const key=await keyFor(pw.value);const raw=await crypto.subtle.exportKey("raw",key);await open(key);
    if(keep.checked)try{localStorage.setItem("wallet-key",btoa(String.fromCharCode(...new Uint8Array(raw))))}catch(err){}}
  catch(err){msg.textContent="That passphrase didn't unlock it.";go.disabled=false;pw.select()}});
(async()=>{try{const saved=localStorage.getItem("wallet-key");if(!saved)return;const key=await crypto.subtle.importKey("raw",u8(saved),{name:"AES-GCM"},false,["decrypt"]);await open(key)}catch(err){try{localStorage.removeItem("wallet-key")}catch(e){}}})();
</script></body></html>`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, shell);
console.log(`wrote ${out}: ${plain.length} bytes of HTML encrypted into ${enc.length} bytes`);
