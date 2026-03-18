/**
 * Cloudflare Worker — ESPN API Proxy for Sharpshooter
 *
 * Forwards requests to ESPN's unofficial NCAAM basketball API
 * and adds CORS headers so the browser app can fetch live data.
 *
 * Allowed ESPN endpoints (whitelist for safety):
 *   /scoreboard   → scoreboard?groups=50&limit=100
 *   /summary      → summary?event=<id>
 *
 * Deploy at: https://dash.cloudflare.com → Workers & Pages → Create Worker
 */

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball";

// Only allow these two ESPN paths through
const ALLOWED_PATHS = ["/scoreboard", "/summary"];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-cache",
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;  // e.g. /scoreboard or /summary

    // Validate path is one we allow
    if (!ALLOWED_PATHS.some(p => path.startsWith(p))) {
      return new Response("Not found", { status: 404, headers: CORS_HEADERS });
    }

    // Forward query params as-is (e.g. groups=50&limit=100 or event=<id>)
    const espnUrl = `${ESPN_BASE}${path}${url.search}`;

    try {
      const espnResponse = await fetch(espnUrl, {
        headers: {
          // Mimic a browser request so ESPN doesn't reject us
          "User-Agent": "Mozilla/5.0 (compatible; Sharpshooter/1.0)",
          "Accept": "application/json",
        },
      });

      if (!espnResponse.ok) {
        return new Response(`ESPN returned ${espnResponse.status}`, {
          status: espnResponse.status,
          headers: CORS_HEADERS,
        });
      }

      const data = await espnResponse.text();

      return new Response(data, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      return new Response(`Proxy error: ${err.message}`, {
        status: 502,
        headers: CORS_HEADERS,
      });
    }
  },
};
