// ============================================================
//  SPORTS PAGE — sports.js
// ============================================================

// ===== LIVE SCORE SIMULATION =====
// Randomly nudge live scores every 30 seconds to simulate live updates
const liveCards = document.querySelectorAll('.score-card.live');

function nudgeScore() {
  liveCards.forEach(card => {
    const scores = card.querySelectorAll('.team-score');
    if (Math.random() > 0.7) {
      const idx = Math.floor(Math.random() * scores.length);
      const current = parseInt(scores[idx].textContent) || 0;
      scores[idx].textContent = current + 1;
      scores[idx].style.color = '#00c850';
      scores[idx].style.transform = 'scale(1.3)';
      setTimeout(() => {
        scores[idx].style.color = '#fff';
        scores[idx].style.transform = 'scale(1)';
      }, 600);
      showToast('⚽ Goal! Score updated');
    }
  });
}
setInterval(nudgeScore, 30000);

// ===== SEARCH FILTER =====
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.news-card').forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      card.classList.toggle('hidden', !title.includes(q));
    });
    checkNoResults();
  });
}

// ===== CATEGORY FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.news-card').forEach(card => {
      const genre = card.getAttribute('data-genre') || '';
      card.classList.toggle('hidden', filter !== 'all' && !genre.includes(filter));
    });
    checkNoResults();
  });
});

function checkNoResults() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  let noRes = grid.querySelector('.no-results');
  if (!noRes) {
    noRes = document.createElement('p');
    noRes.className = 'no-results';
    noRes.style.cssText = 'text-align:center;padding:3rem;color:#555;grid-column:1/-1;';
    noRes.textContent = '😕 No results found. Try a different search or category.';
    grid.appendChild(noRes);
  }
  const visible = [...grid.querySelectorAll('.news-card')].filter(c => !c.classList.contains('hidden'));
  noRes.style.display = visible.length === 0 ? 'block' : 'none';
}

// ===== STAR RATING =====
const stars    = document.querySelectorAll('.star');
const ratingVal = document.getElementById('ratingVal');

stars.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = +star.getAttribute('data-val');
    stars.forEach(s => s.classList.toggle('active', +s.getAttribute('data-val') <= val));
  });
  star.addEventListener('mouseleave', () => {
    const selected = +(ratingVal?.value || 0);
    stars.forEach(s => s.classList.toggle('active', +s.getAttribute('data-val') <= selected));
  });
  star.addEventListener('click', () => {
    const val = +star.getAttribute('data-val');
    if (ratingVal) ratingVal.value = val;
    stars.forEach(s => s.classList.toggle('active', +s.getAttribute('data-val') <= val));
  });
});

// ===== CHARACTER COUNTER =====
const sPrediction = document.getElementById('sPrediction');
const sCharCount  = document.getElementById('sCharCount');
if (sPrediction) {
  sPrediction.addEventListener('input', () => {
    const len = sPrediction.value.length;
    if (sCharCount) {
      sCharCount.textContent = `${len} / 400`;
      sCharCount.style.color = len > 360 ? '#e50914' : '#444';
    }
    if (len > 400) sPrediction.value = sPrediction.value.substring(0, 400);
  });
}

// ===== REAL-TIME FIELD VALIDATION =====
const sName  = document.getElementById('sName');
const sEmail = document.getElementById('sEmail');

sName?.addEventListener('input', () => {
  sName.classList.toggle('valid',   sName.value.trim().length >= 2);
  sName.classList.toggle('invalid', sName.value.trim().length < 2);
});
sEmail?.addEventListener('input', () => {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmail.value);
  sEmail.classList.toggle('valid',   ok);
  sEmail.classList.toggle('invalid', !ok);
});

// ===== FORM SUBMIT =====
const sportsForm  = document.getElementById('sportsForm');
const sSubmitBtn  = document.getElementById('sSubmitBtn');
const sFormMsg    = document.getElementById('sFormMsg');

if (sportsForm) {
  sportsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameOk  = sName?.value.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmail?.value);
    const msgOk   = sPrediction?.value.trim().length >= 5;

    if (!nameOk || !emailOk || !msgOk) {
      showFormMsg('error', '⚠️ Please fill in all required fields correctly.');
      return;
    }

    if (sSubmitBtn) {
      sSubmitBtn.disabled = true;
      sSubmitBtn.textContent = '⏳ Submitting...';
    }

    const data = new FormData(sportsForm);

    try {
      const res  = await fetch('php/contact.php', { method: 'POST', body: data });
      const json = await res.json();
      showFormMsg(json.success ? 'success' : 'error', json.message);
      if (json.success) {
        sportsForm.reset();
        stars.forEach(s => s.classList.remove('active'));
        if (ratingVal) ratingVal.value = 0;
        if (sCharCount) sCharCount.textContent = '0 / 400';
        [sName, sEmail].forEach(f => f?.classList.remove('valid', 'invalid'));
      }
    } catch {
      showFormMsg('error', '❌ Connection error. Please try again.');
    } finally {
      if (sSubmitBtn) {
        sSubmitBtn.disabled = false;
        sSubmitBtn.textContent = '🏅 Submit';
      }
    }
  });
}

function showFormMsg(type, text) {
  if (!sFormMsg) return;
  sFormMsg.className = type;
  sFormMsg.textContent = text;
  sFormMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

[...document.querySelectorAll('.score-card, .news-card, .athlete-card')].forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s, box-shadow 0.3s`;
  revealObserver.observe(el);
});

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:#0a1a0a; border:1px solid #00c850; color:#f5f5f5;
      padding:0.7rem 1.4rem; border-radius:50px; font-size:0.83rem;
      box-shadow:0 8px 24px rgba(0,200,80,0.25); z-index:9999;
      opacity:0; transition:all 0.3s ease; white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}
