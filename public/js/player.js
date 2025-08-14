document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const animeEpisodeId = urlParams.get('episodeId');
  const server = urlParams.get('server') || 'hd-1';
  const category = urlParams.get('category') || 'sub';

  const video = document.getElementById('video-player');
  video.poster = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="#151518"/><text x="50%" y="50%" fill="#d5b3ff" font-family="sans-serif" font-size="24" text-anchor="middle">Loading...</text></svg>';

  try {
    // First fetch episode sources
    const sourcesResponse = await fetch(`/api/v2/hianime/episode/sources?animeEpisodeId=${animeEpisodeId}&server=${server}&category=${category}`);
    
    if (!sourcesResponse.ok) {
      throw new Error(`HTTP error! status: ${sourcesResponse.status}`);
    }

    const { data } = await sourcesResponse.json();
    
    if (!data?.sources?.[0]?.proxiedUrl) {
      throw new Error('No valid video source found');
    }

    const hlsUrl = data.sources[0].proxiedUrl;
    
    // Initialize player
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false, // Disable worker due to CSP
        lowLatencyMode: true
      });
      
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay blocked:', e));
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error encountered');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error encountered');
              break;
            default:
              console.error('Fatal error encountered');
          }
        }
      });
      
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay blocked:', e));
      });
    }
    
  } catch (error) {
    console.error('Player error:', error);
    video.poster = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="#151518"/><text x="50%" y="50%" fill="#ff0000" font-family="sans-serif" font-size="24" text-anchor="middle">Error: ' + error.message + '</text></svg>';
  }
});
