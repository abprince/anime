document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  
  // Fetch anime details
  const { data } = await fetchData(`/anime/${animeId}`);
  const anime = data.anime.info;
  
  // Update page
  document.getElementById('anime-title').textContent = anime.name;
  document.getElementById('anime-name').textContent = anime.name;
  document.getElementById('anime-poster').src = anime.poster;
  document.getElementById('anime-description').textContent = anime.description;
  
  // Watch button
  document.getElementById('watch-now').addEventListener('click', () => {
    const firstEpisode = anime.stats.episodes.sub > 0 ? 'sub' : 'dub';
    navigateTo(`/watch.html?anime=${animeId}&ep=1&type=${firstEpisode}`);
  });
});
