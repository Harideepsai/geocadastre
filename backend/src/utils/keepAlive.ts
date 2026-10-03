import http from 'http';
import https from 'https';

/**
 * Self-ping Keep-Alive service for Render Free Tier hosting.
 * Render automatically spins down free-tier web services after 15 minutes of inactivity.
 * This background task sends an HTTP GET request to the application's public URL every 14 minutes,
 * preventing server sleep and eliminating cold start latency for users.
 */
export function startKeepAlivePing() {
  const isProd = process.env.NODE_ENV === 'production';
  const forceEnable = process.env.ENABLE_KEEP_ALIVE === 'true';

  // Only run in production unless explicitly forced for testing
  if (!isProd && !forceEnable) {
    return;
  }

  // Render automatically provides RENDER_EXTERNAL_URL (e.g. https://your-app.onrender.com)
  const rawUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;

  if (!rawUrl) {
    console.warn(
      '[Keep-Alive] Self-ping disabled: Neither APP_URL nor RENDER_EXTERNAL_URL is set in environment variables.'
    );
    return;
  }

  // Ensure standard protocol prefix
  const baseUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/health`;
  const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes (840,000 ms)

  console.log(`[Keep-Alive] Initialized self-ping task. Target: ${targetUrl} (Frequency: 14 mins)`);

  const sendPing = () => {
    try {
      const urlObj = new URL(targetUrl);
      const client = urlObj.protocol === 'https:' ? https : http;

      const req = client.get(targetUrl, (res) => {
        const statusCode = res.statusCode || 0;
        if (statusCode >= 200 && statusCode < 400) {
          console.log(`[Keep-Alive Ping] ${new Date().toISOString()} - Ping successful (Status: ${statusCode})`);
        } else {
          console.warn(`[Keep-Alive Ping] ${new Date().toISOString()} - Ping returned status ${statusCode}`);
        }
        // Consume response data to free memory
        res.resume();
      });

      req.on('error', (err) => {
        console.error(`[Keep-Alive Ping Error] ${new Date().toISOString()} - Ping request failed:`, err.message);
      });

      req.end();
    } catch (err: any) {
      console.error(`[Keep-Alive Ping Error] ${new Date().toISOString()} - Invalid ping URL:`, err?.message || err);
    }
  };

  // Perform initial ping after 1 minute, then repeat every 14 minutes
  setTimeout(sendPing, 60 * 1000);
  setInterval(sendPing, PING_INTERVAL_MS);
}
