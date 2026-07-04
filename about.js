// ============================================================
//  ABOUT PAGE — about.js
// ============================================================

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

[
  ...document.querySelectorAll('.about-block'),
  ...document.querySelectorAll('.value-card'),
  ...document.querySelectorAll('.team-card'),
  ...document.querySelectorAll('.contact-detail-item'),
].forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
  revealObserver.observe(el);
});

// ===== TEAM CARD — click to expand bio =====
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('click', () => {
    const bio = card.querySelector('.bio');
    if (!bio) return;
    const isOpen = bio.style.maxHeight && bio.style.maxHeight !== '0px';
    // collapse all
    document.querySelectorAll('.team-card .bio').forEach(b => {
      b.style.maxHeight = '0px';
      b.style.opacity = '0';
    });
    if (!isOpen) {
      bio.style.maxHeight = '100px';
      bio.style.opacity = '1';
    }
  });
});

// Init bio collapse
document.querySelectorAll('.team-card .bio').forEach(b => {
  b.style.overflow = 'hidden';
  b.style.maxHeight = '0px';
  b.style.opacity = '0';
  b.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
});

// ===== REAL-TIME FORM VALIDATION =====
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const msgInput     = document.getElementById('message');
const charCount    = document.getElementById('charCount');

function validate(input, condition) {
  if (!input) return;
  input.classList.toggle('valid',   condition);
  input.classList.toggle('invalid', !condition && input.value.length > 0);
}

nameInput?.addEventListener('input',    () => validate(nameInput,    nameInput.value.trim().length >= 2));
emailInput?.addEventListener('input',   () => validate(emailInput,   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)));
subjectInput?.addEventListener('input', () => validate(subjectInput, subjectInput.value.trim().length >= 3));

msgInput?.addEventListener('input', () => {
  const len = msgInput.value.length;
  if (charCount) {
    charCount.textContent = `${len} / 500`;
    charCount.style.color = len > 450 ? '#e50914' : '#444';
  }
  if (len > 500) msgInput.value = msgInput.value.substring(0, 500);
  validate(msgInput, len >= 10);
});

// ===== CONTACT FORM SUBMIT =====
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formMsg     = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const ok =
      nameInput?.value.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput?.value || '') &&
      subjectInput?.value.trim().length >= 3 &&
      msgInput?.value.trim().length >= 10;

    if (!ok) {
      showMsg('error', '⚠️ Please fill in all fields correctly.');
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Sending...'; }

    try {
      const res  = await fetch('php/contact.php', { method: 'POST', body: new FormData(contactForm) });
      const json = await res.json();
      showMsg(json.success ? 'success' : 'error', json.message);
      if (json.success) {
        contactForm.reset();
        [nameInput, emailInput, subjectInput, msgInput].forEach(f => f?.classList.remove('valid','invalid'));
        if (charCount) charCount.textContent = '0 / 500';
      }
    } catch {
      showMsg('error', '❌ Connection error. Please try again.');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '✉️ Send Message'; }
    }
  });
}

function showMsg(type, text) {
  if (!formMsg) return;
  formMsg.className = type;
  formMsg.textContent = text;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== COUNTER ANIMATION (team stats if present) =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.getAttribute('data-count');
    const step   = Math.ceil(target / 60);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString();
    }, 20);
  });
}

const statsEl = document.querySelector('[data-count]');
if (statsEl) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); }
  }, { threshold: 0.3 }).observe(statsEl);
}
