document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Show loading state
    document.getElementById('spotlight-slider').innerHTML = '<div class="loading">Loading...</div>';
    
    // Fetch home data
    const data = await fetchData('/home');
    
    // Check if data exists - modified to not use optional chaining
    if (!data || !data.data) {
      throw new Error('Invalid API response structure');
    }

    // Render spotlight
    const spotlightSlider = document.getElementById('spotlight-slider');
    spotlightSlider.innerHTML = '';
    if (data.data.spotlightAnimes) {
      data.data.spotlightAnimes.forEach(anime => {
        spotlightSlider.innerHTML += createAnimeCard(anime);
      });
    }

    // Render latest episodes
    const latestEpisodes = document.getElementById('latest-episodes');
    latestEpisodes.innerHTML = '';
    if (data.data.latestEpisodeAnimes) {
      data.data.latestEpisodeAnimes.forEach(anime => {
        latestEpisodes.innerHTML += createAnimeCard(anime);
      });
    }

    // Add click handlers
    document.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `/anime.html?id=${card.dataset.id}`;
      });
    });

  } catch (error) {
    console.error('Home page initialization error:', error);
    document.getElementById('spotlight-slider').innerHTML = 
      `<div class="error">Failed to load content: ${error.message}</div>`;
  }
});
