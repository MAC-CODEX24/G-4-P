// ===== CONTACT / ABOUT PAGE JS =====

// ===== REAL-TIME FIELD VALIDATION =====
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const msgInput     = document.getElementById('message');

function validateField(input, condition) {
  if (!input) return;
  input.classList.toggle('valid',   condition);
  input.classList.toggle('invalid', !condition);
}

nameInput?.addEventListener('input', () =>
  validateField(nameInput, nameInput.value.trim().length >= 2)
);

emailInput?.addEventListener('input', () =>
  validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value))
);

subjectInput?.addEventListener('input', () =>
  validateField(subjectInput, subjectInput.value.trim().length >= 3)
);

// ===== CHARACTER COUNTER FOR MESSAGE =====
const charCount = document.getElementById('charCount');
msgInput?.addEventListener('input', () => {
  const len = msgInput.value.length;
  if (charCount) {
    charCount.textContent = `${len} / 500`;
    charCount.style.color = len > 450 ? '#e50914' : '#555';
  }
  validateField(msgInput, len >= 10);
  if (len > 500) msgInput.value = msgInput.value.substring(0, 500);
});

// ===== CONTACT FORM SUBMIT =====
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formMsg     = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side check before sending
    const allValid =
      nameInput?.value.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput?.value) &&
      subjectInput?.value.trim().length >= 3 &&
      msgInput?.value.trim().length >= 10;

    if (!allValid) {
      showMsg('error', '⚠️ Please fill in all fields correctly before submitting.');
      return;
    }

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    }

    const data = new FormData(contactForm);

    try {
      const res  = await fetch('php/contact.php', { method: 'POST', body: data });
      const json = await res.json();
      showMsg(json.success ? 'success' : 'error', json.message);
      if (json.success) {
        contactForm.reset();
        [nameInput, emailInput, subjectInput, msgInput].forEach(f => {
          f?.classList.remove('valid', 'invalid');
        });
        if (charCount) charCount.textContent = '0 / 500';
      }
    } catch {
      showMsg('error', '❌ Connection error. Please try again later.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✉️ Send Message';
      }
    }
  });
}

function showMsg(type, text) {
  if (!formMsg) return;
  formMsg.className = type;
  formMsg.textContent = text;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== TEAM CARD FLIP TOOLTIP =====
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = '#0070f3';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '#2a2a2a';
  });
});

// ===== SCROLL REVEAL FOR TEAM CARDS =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.team-card, .form-group').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
  observer.observe(el);
});
