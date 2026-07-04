// ===== TYPING EFFECT =====
const words = ['Cinema.', 'Music.', 'Education.', 'Entertainment.'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typedEl = document.getElementById('typedText');

function type() {
  const current = words[wordIndex];

  if (!deleting) {
    typedEl.textContent = current.substring(0, charIndex);
    charIndex++;

    if (charIndex > current.length) {
      deleting = true;
      setTimeout(type, 1500); // pause before deleting
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex);
    charIndex--;

    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400); // pause before next word
      return;
    }
  }

  setTimeout(type, deleting ? 60 : 100);
}

type();

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  const text = "Hello Omara, welcome to coding!";
let index = 0;

function typeEffect() {
    if (index < text.length) {
        document.getElementById("text").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 100); // speed of typing
    }
}


typeEffect();
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,9,20,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===== STATS COUNTER =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.getAttribute('data-target');
    const step   = Math.ceil(target / 80);
    let current  = 0;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString();
    }, 20);
  });
}

// Trigger counter when stats strip is visible
const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(statsStrip);
}

// ===== NEWSLETTER FORM =====
const nlForm = document.getElementById('newsletterForm');
if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('nlMsg');
    msg.textContent = '🎉 You\'re subscribed! Welcome to MAC Media.';
    nlForm.reset();
  });
}
