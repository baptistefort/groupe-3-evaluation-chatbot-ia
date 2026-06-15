const progress = document.querySelector("[data-progress]");
const reveals = document.querySelectorAll(".reveal");
const scoreSection = document.querySelector("#notes");
const chatButton = document.querySelector("[data-chat-button]");
const chatPanel = document.querySelector("[data-chat-panel]");
const liveLine = document.querySelector("[data-live-line]");
const cursorDot = document.querySelector("[data-cursor-dot]");
const signalCanvas = document.querySelector("[data-signal-canvas]");

function updateProgress() {
  const root = document.documentElement;
  const max = root.scrollHeight - root.clientHeight;
  progress.style.transform = `scaleX(${max <= 0 ? 0 : root.scrollTop / max})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.14 });

reveals.forEach((item) => observer.observe(item));

window.addEventListener("pointermove", (event) => {
  if (!cursorDot) return;
  cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
}, { passive: true });

if (chatButton && chatPanel) {
  chatButton.addEventListener("click", () => {
    chatPanel.classList.toggle("open");
    chatButton.setAttribute("aria-expanded", chatPanel.classList.contains("open") ? "true" : "false");
  });
}

const liveMessages = [
  "Utilisateur : Je cherche une offre IA pour automatiser mes demandes client.",
  "RAG : récupération du bon contexte dans la base.",
  "Agent : réponse cadrée, utile, connectée au besoin.",
  "Démo : bouton flottant visible, test en direct, pas juste une slide.",
  "Verdict : franchement, c'était carré."
];

let liveIndex = 0;
function rotateLiveLine() {
  if (!liveLine) return;
  liveLine.textContent = liveMessages[liveIndex % liveMessages.length];
  liveIndex += 1;
}
rotateLiveLine();
setInterval(rotateLiveLine, 2300);

function setupSignalCanvas() {
  if (!signalCanvas) return;
  const ctx = signalCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let tick = 0;

  function resize() {
    const rect = signalCanvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
    height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    signalCanvas.width = width;
    signalCanvas.height = height;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function draw() {
    const cssWidth = width / devicePixelRatio;
    const cssHeight = height / devicePixelRatio;
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    for (let x = -40; x < cssWidth + 40; x += 32) {
      const y = cssHeight / 2 + Math.sin((x + tick) * 0.025) * 55;
      ctx.strokeStyle = x % 64 === 0 ? "#E50914" : "#FFFFFF";
      ctx.lineWidth = x % 64 === 0 ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(x, cssHeight);
      ctx.lineTo(x + 24, y);
      ctx.lineTo(x + 48, cssHeight * .25);
      ctx.stroke();
      ctx.fillStyle = "#E50914";
      ctx.fillRect(x + 20, y - 6, 12, 12);
    }

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, cssWidth - 28, cssHeight - 28);
    ctx.fillStyle = "#E50914";
    ctx.fillRect(28 + (tick % Math.max(1, cssWidth - 86)), 26, 48, 8);

    tick += 2;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}
setupSignalCanvas();

function setupScratchCard(card) {
  const canvas = card.querySelector("canvas");
  const score = card.querySelector(".score-pop");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let drawing = false;
  let revealed = false;

  function resize() {
    const rect = card.getBoundingClientRect();
    canvas.width = Math.ceil(rect.width * devicePixelRatio);
    canvas.height = Math.ceil(rect.height * devicePixelRatio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    paintCover(rect.width, rect.height);
  }

  function paintCover(width, height) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = card.dataset.dark === "true" ? "#050505" : "#E50914";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    for (let x = -width; x < width * 2; x += 58) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(-0.18);
      ctx.strokeRect(0, 16, 118, 34);
      ctx.restore();
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 28px Impact, Arial Black, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(card.dataset.cover || "NOTE", width / 2, height / 2);
    ctx.font = "900 13px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText("GRATTE POUR VOIR", width / 2, height / 2 + 42);
    ctx.globalCompositeOperation = "destination-out";
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches && event.touches[0];
    const clientX = touch ? touch.clientX : event.clientX;
    const clientY = touch ? touch.clientY : event.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function scratch(event) {
    if (!drawing) return;
    event.preventDefault();
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
    score.textContent = card.dataset.score || "";
    revealed = true;
    checkProgress();
  }

  function checkProgress() {
    if (!revealed) return;
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < sample.length; i += 32) {
      if (sample[i] < 60) transparent += 1;
    }
    if (transparent / (sample.length / 32) > .48) {
      card.classList.add("scratched");
      if ([...document.querySelectorAll(".score-card")].every((item) => item.classList.contains("scratched"))) {
        scoreSection.classList.add("score-finished");
      }
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    scratch(event);
  });
  window.addEventListener("pointerup", () => {
    drawing = false;
  });
  canvas.addEventListener("pointermove", scratch);
  canvas.addEventListener("touchstart", (event) => {
    drawing = true;
    scratch(event);
  }, { passive: false });
  canvas.addEventListener("touchmove", scratch, { passive: false });
  window.addEventListener("touchend", () => {
    drawing = false;
  });

  resize();
  window.addEventListener("resize", resize);
}

document.querySelectorAll(".score-card").forEach(setupScratchCard);

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n") scoreSection?.scrollIntoView({ behavior: "smooth" });
  if (event.key.toLowerCase() === "d") chatPanel?.classList.toggle("open");
});
