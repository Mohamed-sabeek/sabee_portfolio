/* ===============================
   NEURAL NETWORK BACKGROUND (HERO)
   =============================== */

const canvas = document.getElementById("spider-hero-canvas");
const heroSection = document.querySelector(".hero");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
const particleCount = 80;
const connectionDistance = 150;
const mouseRadius = 150;

let mouse = { x: null, y: null };

class Particle {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;

    // Mouse interaction (repel)
    if (mouse.x !== null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.hypot(dx, dy);
      if (distance < mouseRadius) {
        let force = (mouseRadius - distance) / mouseRadius;
        this.x += dx / distance * force * 2;
        this.y += dy / distance * force * 2;
      }
    }
  }

  draw() {
    ctx.fillStyle = "rgba(0, 212, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  w = canvas.width = heroSection.offsetWidth;
  h = canvas.height = heroSection.offsetHeight;
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.hypot(dx, dy);

      if (distance < connectionDistance) {
        let opacity = 1 - (distance / connectionDistance);
        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  init();
});

heroSection.addEventListener("mousemove", (e) => {
  const rect = heroSection.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

heroSection.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

init();
animate();
