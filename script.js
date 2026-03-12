// Smooth scroll for nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: "smooth",
    });
  });
});

// Active nav on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.pageYOffset >= top) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// THEME TOGGLE WITH HYBRID LAMP
const lampToggle = document.getElementById("lampToggle");
const htmlEl = document.documentElement;

lampToggle.addEventListener("click", () => {
  lampToggle.classList.add("lamp-anim");
  setTimeout(() => lampToggle.classList.remove("lamp-anim"), 450);

  const currentTheme = htmlEl.getAttribute("data-theme") || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-theme", nextTheme);
});

// PARTICLE FIELD
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles(count = 60) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    });
  }
}
createParticles();

function getParticleColor() {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue("--particle-color").trim() || "rgba(0,174,239,0.8)";
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  const color = getParticleColor();
  ctx.fillStyle = color;

  particles.forEach((p) => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > width) p.dx *= -1;
    if (p.y < 0 || p.y > height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// WATER SURFACE + REFLECTIVE MOTION
const waterMain = document.querySelector(".water-surface-main");
const waterDeep = document.querySelector(".water-surface-deep");
const bgWaves = document.querySelector(".bg-waves");

let lastScrollY = window.scrollY;
let lastTime = performance.now();
let smoothedSpeed = 0;
let smoothedDirection = 0;

function updateWaterAndReflection() {
  const now = performance.now();
  const dt = now - lastTime || 16;
  const currentY = window.scrollY;
  const dy = currentY - lastScrollY;
  const speed = Math.abs(dy) / dt; // px per ms
  const direction = Math.sign(dy); // -1 up, 1 down

  // Smooth speed & direction
  smoothedSpeed = smoothedSpeed * 0.9 + speed * 0.1;
  smoothedDirection = smoothedDirection * 0.9 + direction * 0.1;

  // Map speed to reflection intensity
  const intensity = Math.min(0.6, 0.18 + smoothedSpeed * 1.2);
  document.documentElement.style.setProperty("--reflect-intensity", intensity.toFixed(3));

  // Map direction to angle
  const angleDeg = 90 + smoothedDirection * 25; // tilt reflection
  document.documentElement.style.setProperty("--reflect-angle", angleDeg.toFixed(1) + "deg");

  // Water parallax + ripple
  const offsetYMain = currentY * 0.12;
  const offsetYDeep = currentY * 0.06;
  const scaleMain = 1 + smoothedSpeed * 0.15;
  const scaleDeep = 1 + smoothedSpeed * 0.08;

  waterMain.style.transform = `translate3d(0, ${offsetYMain}px, 0) scale(${scaleMain})`;
  waterDeep.style.transform = `translate3d(0, ${offsetYDeep}px, 0) scale(${scaleDeep})`;

  // Waves parallax
  const wavesOffsetY = currentY * 0.04;
  bgWaves.style.transform = `translate3d(0, ${wavesOffsetY}px, 0)`;

  lastScrollY = currentY;
  lastTime = now;
  requestAnimationFrame(updateWaterAndReflection);
}
requestAnimationFrame(updateWaterAndReflection);

// CURSOR RIPPLE
const cursorRipple = document.querySelector(".cursor-ripple");
let rippleTimeout;

window.addEventListener("mousemove", (e) => {
  const xPercent = (e.clientX / window.innerWidth) * 100;
  const yPercent = (e.clientY / window.innerHeight) * 100;
  cursorRipple.style.setProperty("--ripple-x", `${xPercent}%`);
  cursorRipple.style.setProperty("--ripple-y", `${yPercent}%`);
  cursorRipple.style.opacity = "1";

  clearTimeout(rippleTimeout);
  rippleTimeout = setTimeout(() => {
    cursorRipple.style.opacity = "0";
  }, 200);
});
// --- USER/ADMIN TOGGLE LOGIC ---
const modeToggle = document.getElementById("modeToggle");
const modeLabel = document.getElementById("modeLabel");

modeToggle.addEventListener("click", () => {
  if (modeLabel.textContent === "User") {
    const key = prompt("Enter admin access key:");
    if (key === "admin123") {
      modeLabel.textContent = "Admin";
      localStorage.setItem("adminAuth", "true");
      window.location.href = "dashboard.html?admin=true";
    } else {
      alert("Invalid key");
    }
  } else {
    modeLabel.textContent = "User";
    localStorage.removeItem("adminAuth");
  }
});

// --- LIVE CHAT BUTTON LOGIC ---
const liveChatBtn = document.getElementById("liveChatBtn");
liveChatBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html?view=true";
});


// LAMP STYLE SELECTOR
const styleButtons = document.querySelectorAll(".control-btn[data-style]");
function setLampStyle(style) {
  htmlEl.setAttribute("data-lamp-style", style);
  styleButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.style === style);
  });
}
styleButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLampStyle(btn.dataset.style));
});
// init
setLampStyle(htmlEl.getAttribute("data-lamp-style") || "hybrid");

// AMBIENT SOUND TOGGLE
const soundToggle = document.getElementById("soundToggle");
const ambientAudio = document.getElementById("ambientAudio");
let soundOn = false;

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  if (soundOn) {
    ambientAudio.volume = 0.25;
    ambientAudio.play().catch(() => {});
    soundToggle.textContent = "Sound On";
    soundToggle.classList.add("active");
  } else {
    ambientAudio.pause();
    soundToggle.textContent = "Sound Off";
    soundToggle.classList.remove("active");
  }
});

// CONTACT FORM VALIDATION + BUTTON ANIMATION
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  let valid = true;

  function setError(id, msg) {
    const span = document.querySelector(`.error-msg[data-for="${id}"]`);
    if (span) span.textContent = msg;
  }

  function clearError(id) {
    const span = document.querySelector(`.error-msg[data-for="${id}"]`);
    if (span) span.textContent = "";
  }

  if (!name.value.trim()) {
    setError("name", "Name is required");
    valid = false;
  } else clearError("name");

  const emailVal = email.value.trim();
  if (!emailVal) {
    setError("email", "Email is required");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    setError("email", "Enter a valid email");
    valid = false;
  } else clearError("email");

  if (!subject.value.trim()) {
    setError("subject", "Subject is required");
    valid = false;
  } else clearError("subject");

  if (!message.value.trim()) {
    setError("message", "Message is required");
    valid = false;
  } else clearError("message");

  if (!valid) return;

  const btn = contactForm.querySelector(".send-btn");
  const ripple = btn.querySelector(".btn-ripple");
  const check = btn.querySelector(".btn-check");
  const text = btn.querySelector(".btn-text");

  const rect = btn.getBoundingClientRect();
  ripple.style.left = rect.width / 2 + "px";
  ripple.style.top = rect.height / 2 + "px";
  ripple.style.width = ripple.style.height = "0px";
  ripple.style.opacity = "1";

  let size = Math.max(rect.width, rect.height) * 2;
  ripple.style.transition = "none";
  requestAnimationFrame(() => {
    ripple.style.transition = "width 0.4s ease, height 0.4s ease, opacity 0.4s ease";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.opacity = "0";
  });

  text.textContent = "Sent";
  check.style.opacity = "1";
  check.style.transform = "translateY(0)";

  setTimeout(() => {
    text.textContent = "Send Message";
    check.style.opacity = "0";
    check.style.transform = "translateY(4px)";
    contactForm.reset();
  }, 1500);
});
