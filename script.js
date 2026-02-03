const stage = document.getElementById("stage");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const success = document.getElementById("success");
const note = document.getElementById("note");

let noAttempts = 0;
let noScale = 1;

const rand = (min, max) => Math.random() * (max - min) + min;

function showNote(text) {
  note.textContent = text;
  note.classList.add("show");
  clearTimeout(showNote._t);
  showNote._t = setTimeout(() => note.classList.remove("show"), 1200);
}

function moveNoButton(pointerX = null, pointerY = null) {
  const rect = stage.getBoundingClientRect();
  const pad = 12;

  const rotate = rand(-12, 12);
  noBtn.style.transform = `scale(${noScale.toFixed(2)}) rotate(${rotate}deg)`;

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = rect.width - btnW - pad;
  const maxY = rect.height - btnH - pad;

  let x, y;

  if (pointerX !== null && pointerY !== null) {
    const localX = pointerX - rect.left;
    const localY = pointerY - rect.top;

    let tries = 0;
    do {
      x = rand(pad, Math.max(pad, maxX));
      y = rand(pad, Math.max(pad, maxY));
      tries++;
    } while (tries < 25 && Math.hypot(x - localX, y - localY) < 150);
  } else {
    x = rand(pad, Math.max(pad, maxX));
    y = rand(pad, Math.max(pad, maxY));
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function shrinkNoIfNeeded() {
  noAttempts++;

  if (noAttempts === 2) showNote("Hey… don’t run from love 😌💞");
  if (noAttempts === 4) showNote("I’m not accepting ‘No’ today 🥺");
  if (noAttempts === 6) showNote("Okay… last chance 😳💗");

  if (noAttempts >= 4) noScale *= 0.78;
  else noScale *= 0.92;

  if (noScale < 0.28) {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    showNote("Only ‘Yes’ is allowed 💘");
  }
}

// No button behavior
noBtn.addEventListener("mouseenter", (e) => {
  shrinkNoIfNeeded();
  moveNoButton(e.clientX, e.clientY);
});

noBtn.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  shrinkNoIfNeeded();
  moveNoButton(t.clientX, t.clientY);
  e.preventDefault();
}, { passive: false });

noBtn.addEventListener("click", (e) => {
  shrinkNoIfNeeded();
  moveNoButton(e.clientX, e.clientY);
  e.preventDefault();
});

// Yes button
yesBtn.addEventListener("click", () => {
  success.classList.add("show");

  // opzionale: scroll dolce alla gif
  success.scrollIntoView({ behavior: "smooth", block: "start" });

  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.style.opacity = "0.75";
  noBtn.style.opacity = "0.55";
  yesBtn.style.cursor = "default";
  noBtn.style.cursor = "default";

  showNote("YAY! 💖");
});

// Floating hearts
const heartsWrap = document.getElementById("hearts");
const heartEmojis = ["💗","💖","💘","💞","💓","💕"];

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = `${rand(0, 100)}vw`;
  h.style.bottom = `-20px`;
  h.style.animationDuration = `${rand(6, 12)}s`;
  h.style.fontSize = `${rand(14, 22)}px`;
  heartsWrap.appendChild(h);
  setTimeout(() => h.remove(), 13000);
}

setInterval(spawnHeart, 420);
for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 250);

// init
window.addEventListener("load", () => {
  moveNoButton();
});
