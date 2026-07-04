// ===== MUSIC PAGE JS =====

// Track list for the now-playing bar
const tracks = [
  { title: 'Blinding Lights', artist: 'The Weeknd', icon: '🌃' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', icon: '🎤' },
  { title: 'Lose Yourself', artist: 'Eminem', icon: '🎧' },
  { title: 'Levitating', artist: 'Dua Lipa', icon: '🪐' },
  { title: 'Hotel California', artist: 'Eagles', icon: '🌴' },
];
let currentTrack = 0;
let playing = false;

const npTitle  = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const npIcon   = document.getElementById('npIcon');
const playBtn  = document.getElementById('playBtn');

function loadTrack(index) {
  if (!npTitle) return;
  const t = tracks[index];
  npTitle.textContent  = t.title;
  npArtist.textContent = t.artist;
  npIcon.textContent   = t.icon;
}

if (playBtn) {
  playBtn.addEventListener('click', () => {
    playing = !playing;
    playBtn.textContent = playing ? '⏸' : '▶';
  });
}

document.getElementById('prevBtn')?.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
});

// Click a card to load it into the now-playing bar
document.querySelectorAll('.media-card').forEach(card => {
  card.addEventListener('click', () => {
    const title  = card.getAttribute('data-title');
    const artist = card.querySelector('p')?.textContent.split('|')[0].trim() || '';
    const icon   = card.querySelector('.media-thumb')?.textContent || '🎵';
    if (npTitle)  npTitle.textContent  = title;
    if (npArtist) npArtist.textContent = artist;
    if (npIcon)   npIcon.textContent   = icon;
    playing = true;
    if (playBtn) playBtn.textContent = '⏸';
    showToast(`▶ Now Playing: ${title}`);
  });
});

loadTrack(0);

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:#1a0035; border:1px solid #a855f7; color:#f5f5f5;
      padding:0.75rem 1.5rem; border-radius:50px; font-size:0.85rem;
      box-shadow:0 8px 24px rgba(168,85,247,0.3); z-index:9999;
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

// ===== NO RESULTS =====
const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', checkNoResults);
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
    noRes.textContent = '🎵 No tracks found. Try a different search or genre.';
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
