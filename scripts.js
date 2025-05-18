const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = canvas.height;
    this.radius = 2;
    this.color = `hsl(${Math.floor(random(0, 360))}, 100%, 50%)`;
    this.speed = random(2, 7);
    this.angle = -Math.PI / 2;
    this.particles = [];
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.y += this.speed * Math.sin(this.angle);
      if (this.speed <= 0.5) this.explode();
      this.speed *= 0.98;
    } else {
      for (let p of this.particles) {
        p.update();
      }
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      for (let p of this.particles) {
        p.draw();
      }
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.color = color;
    this.speed = random(1, 5);
    this.angle = random(0, 2 * Math.PI);
    this.alpha = 1;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle) + 0.5;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) {
    fireworks.push(new Firework());
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();

    if (fireworks[i].exploded && fireworks[i].particles.every(p => p.alpha <= 0)) {
      fireworks.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
