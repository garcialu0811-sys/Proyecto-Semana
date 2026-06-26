// Minecraft-style Square Pixel Particles system

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 4; // square pixels
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * -4 - 1; // fly up
    this.color = color;
    this.opacity = 1;
    this.decay = Math.random() * 0.03 + 0.015;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= this.decay;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const particles = [];
let canvas, ctx;

function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'particles-container';
    document.body.appendChild(div);
  }

  canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  
  document.getElementById('particles-container').appendChild(canvas);
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].opacity <= 0) {
        particles.splice(i, 1);
      } else {
        particles[i].draw(ctx);
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function spawnParticles(x, y, color = '#10b981', count = 20) {
  if (!canvas) initParticles();
  
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// Sparkle on click elements
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList && (target.classList.contains('mc-btn') || target.tagName === 'BUTTON')) {
    let color = '#34d399'; // green default
    if (target.classList.contains('red')) color = '#ef4444';
    if (target.classList.contains('gold')) color = '#fbbf24';
    
    spawnParticles(e.clientX, e.clientY, color, 12);
  }
});
