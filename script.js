// Typing Effect
const roles = ["Backend Engineer", "Java Developer", "Cloud Enthusiast"];
let i = 0, j = 0, current = "", isDeleting = false;

function type() {
  current = roles[i];
  document.getElementById("typing")?.textContent = current.substring(0, j);
  if (!isDeleting && j < current.length) j++;
  else if (isDeleting && j > 0) j--;
  else {
    isDeleting = !isDeleting;
    if (!isDeleting) i = (i + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 100 : 200);
}
type();

// Parallax Scroll Effect
window.addEventListener("scroll", () => {
  const bg = document.querySelector(".parallax-bg");
  bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

// Corner Glow Animation
document.querySelectorAll(".section").forEach(section => {
  section.addEventListener("mouseenter", () => {
    section.style.boxShadow = "0 0 30px rgba(0,207,255,0.7)";
  });
  section.addEventListener("mouseleave", () => {
    section.style.boxShadow = "none";
  });
});
