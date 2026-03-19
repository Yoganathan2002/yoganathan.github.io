document.addEventListener("DOMContentLoaded", () => {
  const waveCanvas = document.getElementById("waveCanvas");
  if (!waveCanvas) return;

  const ctx = waveCanvas.getContext("2d");

  function resizeCanvas() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = window.innerHeight * 0.5; // half page height
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let t = 0;
  let scrollSpeed = 0;
  let lastScrollY = window.scrollY;
  let mouseX = window.innerWidth / 2;

  // Track scroll speed
  window.addEventListener("scroll", () => {
    const dy = Math.abs(window.scrollY - lastScrollY);
    scrollSpeed = Math.min(40, dy);
    lastScrollY = window.scrollY;
  });

  // Track mouse position
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
  });

  function drawDotWaves() {
    ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    // Dark/light mode detection
    const theme = document.documentElement.getAttribute("data-theme");
    const baseColor = theme === "dark" ? "#ffffff" : "#000000";

    const spacing = 18;       // more dots (closer spacing)
    const baseAmplitude = 16; // base wave height
    const frequency = 0.025;  // slightly tighter wave frequency
    const dotRadius = 1.0;    // smaller dots

    // Dynamic amplitude: reacts to scroll + hover
    const amplitudeBoost = scrollSpeed * 0.4 + (mouseX / window.innerWidth) * 8;
    const amplitude = baseAmplitude + amplitudeBoost;

    // Multiple shimmering layers
    const layers = [
      { offset: 30, speed: 0.05 },
      { offset: 70, speed: 0.035 },
      { offset: 110, speed: 0.025 }
    ];

    layers.forEach(({ offset, speed }) => {
      for (let x = 0; x < waveCanvas.width; x += spacing) {
        const y = waveCanvas.height / 2 + offset + Math.sin(x * frequency + t * speed) * amplitude;

        // Glow effect
        const glow = ctx.createRadialGradient(x, y, 0, x, y, dotRadius * 5);
        glow.addColorStop(0, baseColor);
        glow.addColorStop(1, theme === "dark" ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)");
        ctx.fillStyle = glow;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    scrollSpeed *= 0.9;
    t += 1;
    requestAnimationFrame(drawDotWaves);
  }

  drawDotWaves();
});
