/**
 * Apex Talent Partners - Pro 3D Animations & Dynamic 3D Canvas Background Renderer
 * Renders interactive 3D WebGL / Canvas particle constellation, floating 3D geometry nodes,
 * mouse parallax tracking, GSAP ScrollTrigger reveals, and 3D card tilt tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DCanvasBackground();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('User prefers reduced motion. Advanced motion effects paused.');
    return;
  }

  initAOS();
  initGSAPScrollTrigger();
  init3DTiltCards();
});

/* --------------------------------------------------------------------------
   1. Interactive 3D Canvas Background Renderer (Particles + 3D Geometry Nodes)
   -------------------------------------------------------------------------- */
function init3DCanvasBackground() {
  let canvas = document.getElementById('bg-3d-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-3d-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse parallax interaction coordinates
  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Particle Node Class for 3D simulation
  class Particle3D {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 800 + 100; // 3D depth layer
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.vz = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 2.5 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(37, 99, 235, ' : 'rgba(13, 148, 136, ';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      // Mouse subtle push
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.z < 100 || this.z > 900) {
        this.reset();
      }
    }

    draw() {
      const scale = 500 / this.z; // Perspective scaling projection
      const projX = (this.x - width / 2) * scale + width / 2;
      const projY = (this.y - height / 2) * scale + height / 2;
      const projRadius = this.radius * scale;

      ctx.beginPath();
      ctx.arc(projX, projY, Math.max(projRadius, 0.5), 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  // Create 3D particle pool
  const particleCount = Math.min(Math.floor((width * height) / 14000), 90);
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle3D());
  }

  // Draw 3D Connecting Beams between close particles
  function drawConstellationBeams() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const scale1 = 500 / p1.z;
        const x1 = (p1.x - width / 2) * scale1 + width / 2;
        const y1 = (p1.y - height / 2) * scale1 + height / 2;

        const scale2 = 500 / p2.z;
        const x2 = (p2.x - width / 2) * scale2 + width / 2;
        const y2 = (p2.y - height / 2) * scale2 + height / 2;

        const dx = x1 - x2;
        const dy = y1 - y2;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  // Main 60 FPS animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle ambient gradient background depth
    const grad = ctx.createRadialGradient(mouseX, mouseY, 50, width / 2, height / 2, width);
    grad.addColorStop(0, 'rgba(37, 99, 235, 0.04)');
    grad.addColorStop(0.5, 'rgba(13, 148, 136, 0.02)');
    grad.addColorStop(1, 'rgba(11, 15, 25, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConstellationBeams();

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Initialize AOS (Animate On Scroll)
   -------------------------------------------------------------------------- */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120
    });
  }
}

/* --------------------------------------------------------------------------
   3. GSAP ScrollTrigger & Parallax Animations
   -------------------------------------------------------------------------- */
function initGSAPScrollTrigger() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from(heroContent.children, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      stagger: 0.18,
      ease: 'power4.out'
    });
  }

  const heroImage = document.querySelector('.hero-image-inner');
  if (heroImage) {
    gsap.from(heroImage, {
      opacity: 0,
      scale: 0.9,
      rotationY: 15,
      rotationX: -10,
      duration: 1.5,
      delay: 0.3,
      ease: 'power3.out'
    });
  }

  const floatingBadge = document.querySelector('.floating-stat-card');
  if (floatingBadge) {
    gsap.to(floatingBadge, {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.card-3d').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%'
        },
        opacity: 0,
        y: 50,
        rotationX: 10,
        duration: 0.8,
        delay: (i % 3) * 0.15,
        ease: 'power3.out'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Interactive 3D Tilt Card Mouse Tracking
   -------------------------------------------------------------------------- */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.card-3d, .candidate-card, .process-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}
