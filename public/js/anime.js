// Replace your existing code with this:

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  
  // Fetch anime details
  const { data } = await fetchData(`/anime/${animeId}`);
  const anime = data.anime.info;
  
  // Update page with anime details
  document.getElementById('anime-title').textContent = anime.name;
  document.getElementById('anime-name').textContent = anime.name;
  document.getElementById('anime-poster').src = anime.poster;
  document.getElementById('anime-description').textContent = anime.description;
  
  // Fetch episodes list
  const episodesRes = await fetchData(`/anime/${animeId}/episodes`);
  const episodes = episodesRes.data.episodes;
  
  // Render episodes
  const episodeList = document.getElementById('episode-list');
  episodes.forEach(episode => {
    const episodeEl = document.createElement('div');
    episodeEl.className = 'episode-item';
    episodeEl.innerHTML = `
      <span>Episode ${episode.number}</span>
      <span>${episode.title}</span>
    `;
    
    // Add click handler for each episode
    episodeEl.addEventListener('click', async () => {
      // Get available servers for this episode
      const serversRes = await fetchData(`/episode/servers?animeEpisodeId=${episode.episodeId}`);
      const servers = serversRes.data;
      
      // Determine default category (sub if available, otherwise dub)
      const defaultCategory = servers.sub.length > 0 ? 'sub' : 'dub';
      
      // Navigate to watch page
      window.location.href = `/watch.html?episodeId=${encodeURIComponent(episode.episodeId)}&server=hd-1&category=${defaultCategory}`;
    });
    
    episodeList.appendChild(episodeEl);
  });
});
