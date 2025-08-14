document.addEventListener('DOMContentLoaded', async () => {
  // Fetch home data
  const { data } = await fetchData('/home');
  
  // Render spotlight
  const spotlightSlider = document.getElementById('spotlight-slider');
  data.spotlightAnimes.forEach(anime => {
    spotlightSlider.innerHTML += createAnimeCard(anime);
  });

  // Render latest episodes
  const latestEpisodes = document.getElementById('latest-episodes');
  data.latestEpisodeAnimes.forEach(anime => {
    latestEpisodes.innerHTML += createAnimeCard(anime);
  });

  // Add click handlers
  document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/anime.html?id=${card.dataset.id}`);
    });
  });
});
