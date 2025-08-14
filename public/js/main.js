const API_BASE = '/api/v2/hianime';

// Shared functions
window.fetchData = async function(endpoint) {
  const API_BASE = '/api/v2/hianime';
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('fetchData error:', error);
    throw error;
  }
};

window.createAnimeCard = function(anime) {
  return `
    <div class="anime-card" data-id="${anime.id}">
      <img src="${anime.poster}" alt="${anime.name}" loading="lazy">
      <h3>${anime.name}</h3>
      <div class="episode-badge">
        ${anime.episodes?.sub || 0} Sub | ${anime.episodes?.dub || 0} Dub
      </div>
    </div>
  `;
};

// Error handling
window.showError = function(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'global-error';
  errorEl.innerHTML = `
    <p>${message}</p>
    <button onclick="this.parentElement.remove()">Dismiss</button>
  `;
  document.body.prepend(errorEl);
};

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
