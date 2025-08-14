const API_BASE = '/api/v2/hianime';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    
}

function navigateTo(url) {
  window.location.href = url;
}

function createAnimeCard(anime) {
  return `
    <div class="anime-card" data-id="${anime.id}">
      <img src="${anime.poster}" alt="${anime.name}">
      <h3>${anime.name}</h3>
      <div class="episode-badge">
        Sub: ${anime.episodes.sub} | Dub: ${anime.episodes.dub}
      </div>
    </div>
  `;
}
