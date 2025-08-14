// api/v2/hianime/proxy-m3u8.js

export const config = {
  api: {
    bodyParser: false, // Required to handle raw streams
  },
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': '*, Accept, Origin, Referer, User-Agent, Range',
};

// Handle OPTIONS (preflight)
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).setHeaders(CORS_HEADERS).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, referer } = req.query;

  if (!url || !referer) {
    return res.status(400).json({ error: 'Missing url or referer' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const refererUrl = decodeURIComponent(referer);

    const response = await fetch(targetUrl, {
      headers: {
        'Referer': refererUrl,
        'Origin': new URL(refererUrl).origin,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'identity',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${targetUrl}: ${response.status} ${response.statusText}`);
      return res.status(502).json({
        status: 502,
        error: `Proxy failed (origin returned ${response.status})`,
      });
    }

    // Forward response headers
    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    res.status(200);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    Object.assign(CORS_HEADERS, { 'Content-Type': contentType });
    res.setHeaders(CORS_HEADERS);

    // Stream the response
    const reader = response.body.getReader();
    const pump = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        pump();
      }).catch((err) => {
        console.error('Stream error:', err);
        res.end();
      });
    };

    pump();
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({
      status: 502,
      error: 'Proxy failed (blocked by origin)',
    });
  }
}
