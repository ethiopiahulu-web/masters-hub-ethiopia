const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyZ7OacV-r4FJFESbg9bLT11nGoRpjlG5oJZFIURBObG_ZoQllRckcUXJd9Ldh7oqVb/exec";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // API PROXY
    // =====================================================

    if (url.pathname === "/api") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: request.method,
          headers: {
            "Content-Type":
              request.headers.get("Content-Type") ||
              "text/plain;charset=utf-8",
          },
          body:
            request.method === "GET" || request.method === "HEAD"
              ? undefined
              : await request.text(),
          redirect: "follow",
        });

        const body = await response.text();

        return new Response(body, {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get("Content-Type") ||
              "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "API proxy failed",
            message: error.message,
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // =====================================================
    // STATIC MINI APP
    // =====================================================

    return env.ASSETS.fetch(request);
  },
};