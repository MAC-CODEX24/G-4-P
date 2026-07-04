// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('nav ul');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// ===== SEARCH FILTER =====
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.media-card').forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      card.classList.toggle('hidden', !title.includes(query));
    });
  });
}

// ===== GENRE / CATEGORY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const genre = btn.getAttribute('data-filter');
    document.querySelectorAll('.media-card').forEach(card => {
      if (genre === 'all') {
        card.classList.remove('hidden');
      } else {
        const cardGenre = card.getAttribute('data-genre') || '';
        card.classList.toggle('hidden', !cardGenre.includes(genre));
      }
    });
  });
});

// ===== CONTACT FORM (AJAX to PHP) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formMsg = document.getElementById('formMsg');
    const data = new FormData(contactForm);

    try {
      const res = await fetch('php/contact.php', { method: 'POST', body: data });
      const json = await res.json();
      formMsg.className = json.success ? 'success' : 'error';
      formMsg.textContent = json.message;
      if (json.success) contactForm.reset();
    } catch {
      formMsg.className = 'error';
      formMsg.textContent = 'Something went wrong. Please try again.';
    }
  });
}
