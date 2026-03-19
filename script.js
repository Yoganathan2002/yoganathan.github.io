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
/* =========================================
   SCROLL-DRIVEN ELEMENTAL DATA STORY
   Dark Mode: Milky White/Blue Evaporation
   Light Mode: Heavy Black Ink Evaporation
========================================= */
class ElementalStoryCloud {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.particles = [];
        this.mistParticles = [];
        this.upperClouds = [];
        this.coreSmoke = [];

        this.time = 0;

        // Scroll & Parallax Tracking
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.targetMouseX = this.mouseX;
        this.targetMouseY = this.mouseY;

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = e.clientY;
        });
        window.addEventListener('scroll', () => this.handleScroll());

        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.targetScrollProgress = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
    }

    init() {
        this.resize();
        this.particles = [];
        this.mistParticles = [];
        this.upperClouds = [];
        this.coreSmoke = [];

        // 1. Data Particles (The Lake -> Drop -> Core)
        const numParticles = 2500;
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                index: i,
                radius: Math.random() * 900,
                baseAngle: Math.random() * Math.PI * 2,
                yOffset: (Math.random() - 0.5) * 80,
                baseSize: Math.random() * 1.5 + 0.5
            });
        }

        // 2. Morning Mist (Lower water surface smoke - 0% Scroll)
        const numMist = 80;
        for (let i = 0; i < numMist; i++) {
            this.resetMistParticle(i, true);
        }

        // 3. Upper Storm Clouds
        const numUpperClouds = 85;
        for (let i = 0; i < numUpperClouds; i++) {
            this.upperClouds.push({
                index: i,
                baseAngle: Math.random() * Math.PI * 2,
                orbitRadius: 400 + Math.random() * 300,
                xOffset: (Math.random() - 0.5) * 2500,
                yOffset: -350 + Math.random() * 150,
                zOffset: (Math.random() - 0.5) * 1500,
                size: Math.random() * 300 + 200,
                baseAlpha: Math.random() * 0.05 + 0.02,
                speed: Math.random() * 0.002 + 0.001,
                flash: 0
            });
        }

        // 4. Core Evaporation Smoke (100% Scroll Ending)
        // Increased count to 100 for a denser, more realistic morning vapor effect
        const numCoreSmoke = 100;
        for (let i = 0; i < numCoreSmoke; i++) {
            this.resetCoreSmokeParticle(i, true);
        }
    }

    resetMistParticle(index, randomStart = false) {
        this.mistParticles[index] = {
            x: (Math.random() - 0.5) * 2500,
            y: 120 + (Math.random() * 60 - 30),
            z: (Math.random() - 0.5) * 1500,
            size: Math.random() * 250 + 150,
            speedX: Math.random() * 1.2 + 0.3,
            life: randomStart ? Math.random() * 400 : 0,
            maxLife: Math.random() * 300 + 400
        };
    }

    resetCoreSmokeParticle(index, randomStart = false) {
        this.coreSmoke[index] = {
            x: (Math.random() - 0.5) * 2000, // Wide spread across the bottom
            y: 350 + Math.random() * 150, // Spawns at the very bottom
            z: (Math.random() - 0.5) * 1200,
            size: Math.random() * 250 + 150, // Large, soft vapor clouds
            speedY: Math.random() * 0.8 + 0.3, // Drifts UPWARDS slowly like cold morning smoke
            speedX: (Math.random() - 0.5) * 0.5,
            life: randomStart ? Math.random() * 300 : 0,
            maxLife: Math.random() * 200 + 250
        };
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;

        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 1.5;
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.time += 0.015;

        this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        const parallaxX = (this.mouseX - this.centerX) * 0.03;
        const parallaxY = (this.mouseY - this.centerY) * 0.03;

        // =========================================
        // PERFECTED THEME COLORS
        // =========================================
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // 1. Data Particle Colors
        const pR = isDark ? 255 : 20, pG = isDark ? 255 : 20, pB = isDark ? 255 : 30;

        // 2. Initial Morning Mist Colors
        const mR = isDark ? 255 : 12,  mG = isDark ? 255 : 12,  mB = isDark ? 255 : 15;

        // 3. Upper Storm Cloud Colors
        const ucR = isDark ? 160 : 15, ucG = isDark ? 200 : 15, ucB = isDark ? 255 : 18;

        // 4. Core Evaporation Smoke Colors (The Realistic Ending)
        // Dark Mode: Bright Milky White/Blue | Light Mode: Deep Black Ink
        const csR = isDark ? 200 : 12, csG = isDark ? 230 : 12, csB = isDark ? 255 : 15;

        const focalLength = 500;
        const cameraZ = 600;

        let phase = 0; let blend = 0;
        if (this.scrollProgress < 0.5) {
            phase = 1; blend = this.scrollProgress / 0.5;
        } else {
            phase = 2; blend = (this.scrollProgress - 0.5) / 0.5;
        }

        // FADE CONTROLS FOR THE STORY
        let mistScrollFade = Math.max(0, 1 - (this.scrollProgress * 2.5)); // Mist fades out fast
        let upperCloudFade = Math.max(0, 1 - Math.max(0, (this.scrollProgress - 0.7) * 3.33)); // Upper clouds fade out at the very end
        let coreSmokeFade = Math.max(0, (this.scrollProgress - 0.6) * 2.5); // Bottom smoke fades IN at the end

        /* =========================================
           SPATIAL THUNDER ENGINE
        ========================================= */
        if (Math.random() < 0.02 && upperCloudFade > 0) {
            const strikeX = (Math.random() - 0.5) * 2500;
            const strikeZ = (Math.random() - 0.5) * 1500;
            const strikeRadius = Math.random() * 500 + 300;

            for (let i = 0; i < this.upperClouds.length; i++) {
                let c = this.upperClouds[i];
                const dx = c.xOffset - strikeX;
                const dz = c.zOffset - strikeZ;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < strikeRadius) {
                    const intensity = 1 - (dist / strikeRadius);
                    c.flash = Math.max(c.flash, Math.random() * intensity + 0.3);
                }
            }
        }

        /* =========================================
           DRAW UPPER STORM CLOUDS (Fades out at bottom)
        ========================================= */
        if (upperCloudFade > 0.001) {
            for (let i = 0; i < this.upperClouds.length; i++) {
                let c = this.upperClouds[i];

                const cx1 = c.xOffset + Math.cos(this.time * c.speed * 10) * 100;
                const cy1 = c.yOffset;
                const cz1 = c.zOffset;

                const angle2 = c.baseAngle + this.time * 0.3;
                const cx2 = Math.cos(angle2) * c.orbitRadius;
                const cz2 = Math.sin(angle2) * c.orbitRadius;
                const cy2 = -280 + Math.sin(c.baseAngle * 3) * 60;

                const angle3 = c.baseAngle - this.time * 0.1;
                const haloRadius = 450 + Math.sin(c.index) * 50;
                const cx3 = Math.cos(angle3) * haloRadius;
                const cz3 = Math.sin(angle3) * haloRadius;
                const cy3 = -250 + (Math.sin(c.index) * 50);

                let finalCX, finalCY, finalCZ;
                if (phase === 1) {
                    finalCX = this.lerp(cx1, cx2, blend);
                    finalCY = this.lerp(cy1, cy2, blend);
                    finalCZ = this.lerp(cz1, cz2, blend);
                } else {
                    finalCX = this.lerp(cx2, cx3, blend);
                    finalCY = this.lerp(cy2, cy3, blend);
                    finalCZ = this.lerp(cz2, cz3, blend);
                }

                const actualX = finalCX - parallaxX * (finalCZ * 0.005);
                const actualY = finalCY + parallaxY * (finalCZ * 0.005);
                const actualZ = finalCZ + cameraZ;

                if (actualZ <= 0) continue;

                const scale = focalLength / actualZ;
                const screenX = this.centerX + actualX * scale;
                const screenY = this.centerY + actualY * scale;

                c.flash *= 0.88;

                const currentR = Math.min(255, ucR + (c.flash * 255));
                const currentG = Math.min(255, ucG + (c.flash * 255));
                const currentB = Math.min(255, ucB + (c.flash * 255));

                // Apply the upperCloudFade to gracefully clear the sky
                const cloudAlpha = (c.baseAlpha + (c.flash * 0.15)) * upperCloudFade;

                this.ctx.save();
                this.ctx.translate(screenX, screenY);

                const squashY = this.lerp(0.35, 0.7, this.scrollProgress);
                this.ctx.scale(1, squashY);

                const radius = c.size * scale;

                const gradOuter = this.ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
                gradOuter.addColorStop(0, `rgba(${currentR}, ${currentG}, ${currentB}, ${cloudAlpha})`);
                gradOuter.addColorStop(1, `rgba(${currentR}, ${currentG}, ${currentB}, 0)`);

                this.ctx.beginPath();
                this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradOuter;
                this.ctx.fill();

                const gradInner = this.ctx.createRadialGradient(0, -radius*0.1, 0, 0, -radius*0.1, radius * 0.5);
                gradInner.addColorStop(0, `rgba(${currentR}, ${currentG}, ${currentB}, ${cloudAlpha * 1.5})`);
                gradInner.addColorStop(1, `rgba(${currentR}, ${currentG}, ${currentB}, 0)`);

                this.ctx.beginPath();
                this.ctx.arc(0, -radius*0.1, radius * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = gradInner;
                this.ctx.fill();

                this.ctx.restore();
            }
        }

        /* =========================================
           DRAW THE INITIAL MORNING MIST (Fades out early)
        ========================================= */
        if (mistScrollFade > 0.01) {
            for (let i = 0; i < this.mistParticles.length; i++) {
                let m = this.mistParticles[i];

                m.x += m.speedX;
                m.size += 0.1;
                m.life++;

                if (m.life > m.maxLife) {
                    this.resetMistParticle(i, false);
                    continue;
                }

                const actualX = m.x - parallaxX * (m.z * 0.005);
                const actualY = m.y + parallaxY * (m.z * 0.005);
                const actualZ = m.z + cameraZ;

                if (actualZ <= 0) continue;

                const scale = focalLength / actualZ;
                const screenX = this.centerX + actualX * scale;
                const screenY = this.centerY + actualY * scale - (this.scrollProgress * 500);

                let mistAlpha = Math.sin((m.life / m.maxLife) * Math.PI) * 0.06 * mistScrollFade;
                if (mistAlpha <= 0.001) continue;

                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.scale(1, 0.25);

                const radius = m.size * scale;
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                gradient.addColorStop(0, `rgba(${mR}, ${mG}, ${mB}, ${mistAlpha})`);
                gradient.addColorStop(1, `rgba(${mR}, ${mG}, ${mB}, 0)`);

                this.ctx.beginPath();
                this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                this.ctx.restore();
            }
        }

        /* =========================================
           DRAW THE DATA CLOUD (Lake -> Drop -> Sphere)
        ========================================= */
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            const angle1 = p.baseAngle + (this.time * 0.2);
            const x1 = Math.cos(angle1) * p.radius;
            const z1 = Math.sin(angle1) * p.radius;
            const wave1 = Math.sin(p.radius * 0.005 - this.time) * 40;
            const y1 = p.yOffset + wave1 + 100;

            const dropRadius = 400;
            const phi = (p.radius / 900) * Math.PI;
            const theta = p.baseAngle + (this.time * 0.4);

            let sy = dropRadius * Math.cos(phi);
            let normalizedY = (sy + dropRadius) / (2 * dropRadius);

            let pinchFactor = Math.sin(normalizedY * Math.PI * 0.8) * Math.pow(normalizedY, 0.5);
            const wobble = Math.sin(this.time * 4 + sy * 0.015) * 18 * normalizedY;

            const x2 = (dropRadius * Math.sin(phi) * Math.cos(theta) * pinchFactor) + Math.cos(theta) * wobble;
            const z2 = (dropRadius * Math.sin(phi) * Math.sin(theta) * pinchFactor) + Math.sin(theta) * wobble;
            const y2 = sy - 150;

            const sphereRadius = 250 + Math.sin(this.time * 3 + p.radius) * 10;
            const angle3 = p.baseAngle + this.time;

            const x3 = sphereRadius * Math.sin(phi) * Math.cos(angle3);
            const z3 = sphereRadius * Math.sin(phi) * Math.sin(angle3);
            const y3 = sphereRadius * Math.cos(phi) + p.yOffset * 0.1 - 100;

            let finalX, finalY, finalZ;
            if (phase === 1) {
                finalX = this.lerp(x1, x2, blend);
                finalY = this.lerp(y1, y2, blend);
                finalZ = this.lerp(z1, z2, blend);
            } else {
                finalX = this.lerp(x2, x3, blend);
                finalY = this.lerp(y2, y3, blend);
                finalZ = this.lerp(z2, z3, blend);
            }

            const actualX = finalX - parallaxX * (finalZ * 0.005);
            const actualY = finalY + parallaxY * (finalZ * 0.005);
            const actualZ = finalZ + cameraZ;

            if (actualZ <= 0) continue;

            const scale = focalLength / actualZ;
            const screenX = this.centerX + actualX * scale;
            const screenY = this.centerY + actualY * scale;

            const size = Math.max(0.1, p.baseSize * scale);
            const alpha = Math.max(0, Math.min(1, 1.2 - (actualZ / 1500)));

            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${pR}, ${pG}, ${pB}, ${alpha})`;
            this.ctx.fill();
        }

        /* =========================================
           DRAW CORE EVAPORATION SMOKE (The Ending Vapor)
        ========================================= */
        if (coreSmokeFade > 0.01) {
            for (let i = 0; i < this.coreSmoke.length; i++) {
                let cs = this.coreSmoke[i];

                cs.x += cs.speedX;
                cs.y -= cs.speedY; // Evaporates upward
                cs.size += 0.15;
                cs.life++;

                if (cs.life > cs.maxLife) {
                    this.resetCoreSmokeParticle(i, false);
                    continue;
                }

                const actualX = cs.x - parallaxX * (cs.z * 0.005);
                const actualY = cs.y + parallaxY * (cs.z * 0.005);
                const actualZ = cs.z + cameraZ;

                if (actualZ <= 0) continue;

                const scale = focalLength / actualZ;
                const screenX = this.centerX + actualX * scale;
                const screenY = this.centerY + actualY * scale;

                let smokeAlpha = Math.sin((cs.life / cs.maxLife) * Math.PI) * 0.08 * coreSmokeFade;
                if (smokeAlpha <= 0.001) continue;

                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.scale(1, 0.4);

                const radius = cs.size * scale;
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                gradient.addColorStop(0, `rgba(${csR}, ${csG}, ${csB}, ${smokeAlpha})`);
                gradient.addColorStop(1, `rgba(${csR}, ${csG}, ${csB}, 0)`);

                this.ctx.beginPath();
                this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }
}

/* =========================================
   UI, THEME & ZEN MODE LOGIC
========================================= */
document.addEventListener('DOMContentLoaded', () => {

    new ElementalStoryCloud('waveCanvas');

    const modeToggle = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    const htmlEl = document.documentElement;

    if (modeToggle) {
        modeToggle.addEventListener('click', (e) => {
            const currentTheme = htmlEl.getAttribute('data-theme');

            if (currentTheme === 'dark') {
                htmlEl.setAttribute('data-theme', 'light');
                modeLabel.textContent = 'Admin';
            } else {
                htmlEl.setAttribute('data-theme', 'dark');
                modeLabel.textContent = 'User';
            }
        });
    }

    document.addEventListener('click', (e) => {
        const isClickingContent = e.target.closest('a, button, input, textarea, .panel, .top-nav, .control-dock, .resume-card, .project-card');
        if (isClickingContent) return;

        document.body.classList.toggle('zen-mode');
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
particle.x += particle.vx
particle.y += particle.vy

if(mouseDist < 120){
particle.vx += (mouseX - particle.x) * 0.002
}const links = document.querySelectorAll(".nav-link");
 const indicator = document.querySelector(".nav-indicator");

 function moveIndicator(el){
 const rect = el.getBoundingClientRect();
 const parentRect = el.parentElement.parentElement.getBoundingClientRect();

 indicator.style.left = (rect.left - parentRect.left) + "px";
 indicator.style.width = rect.width + "px";
 }

 links.forEach(link=>{
 link.addEventListener("click",()=>{
 links.forEach(l=>l.classList.remove("active"));
 link.classList.add("active");
 moveIndicator(link);
 });
 });

 window.addEventListener("load",()=>{
 const active = document.querySelector(".nav-link.active");
 moveIndicator(active);
 });
