document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('anime');
  const epNumber = urlParams.get('ep');
  const type = urlParams.get('type');
  
  // Fetch episode sources
  const { data } = await fetchData(`/episode/sources?animeEpisodeId=${animeId}-${epNumber}&server=hd-1&category=${type}`);
  const video = document.getElementById('video-player');
  
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(data.sources[0].proxiedUrl);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = data.sources[0].proxiedUrl;
  }
  
  // Update UI
  document.getElementById('episode-title').textContent = `Episode ${epNumber}`;
});
