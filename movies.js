// ===== MOVIES PAGE JS =====

// Card click — show a quick detail toast
document.querySelectorAll('.media-card').forEach(card => {
  card.addEventListener('click', () => {
    const title  = card.getAttribute('data-title');
    const genre  = card.getAttribute('data-genre') || '';
    const rating = card.querySelector('.badge')?.textContent || '';
    showToast(`🎬 ${title} &nbsp;|&nbsp; ${genre.split(' ')[0].toUpperCase()} &nbsp;|&nbsp; ${rating}`);
  });
});

// ===== TOAST NOTIFICATION =====
function showToast(html) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:#1e1e1e; border:1px solid #333; color:#f5f5f5;
      padding:0.75rem 1.5rem; border-radius:50px; font-size:0.85rem;
      box-shadow:0 8px 24px rgba(0,0,0,0.5); z-index:9999;
      opacity:0; transition:all 0.3s ease; white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = html;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

// ===== NO RESULTS MESSAGE =====
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', checkNoResults);
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setTimeout(checkNoResults, 50));
});

function checkNoResults() {
  const grid = document.querySelector('.grid');
  if (!grid) return;
  let noRes = grid.querySelector('.no-results');
  if (!noRes) {
    noRes = document.createElement('p');
    noRes.className = 'no-results';
    noRes.textContent = '😕 No movies found. Try a different search or filter.';
    grid.appendChild(noRes);
  }
  const visible = [...grid.querySelectorAll('.media-card')].filter(c => !c.classList.contains('hidden'));
  noRes.classList.toggle('show', visible.length === 0);
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.media-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s, box-shadow 0.3s`;
  observer.observe(card);
});
