const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyZ7OacV-r4FJFESbg9bLT11nGoRpjlG5oJZFIURBObG_ZoQllRckcUXJd9Ldh7oqVb/exec";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // GOOGLE APPS SCRIPT API PROXY
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
        const init = {
          method: request.method,
          redirect: "manual",
        };

        if (request.method !== "GET" && request.method !== "HEAD") {
          init.headers = {
            "Content-Type":
              request.headers.get("Content-Type") ||
              "text/plain;charset=utf-8",
          };

          init.body = await request.text();
        }

        // First request to Apps Script
        const firstResponse = await fetch(APPS_SCRIPT_URL, init);

        // Apps Script may return a redirect.
        // Follow it ourselves so we can inspect the final response.
        let response = firstResponse;

        if (
          response.status >= 300 &&
          response.status < 400 &&
          response.headers.get("Location")
        ) {
          const redirectUrl = response.headers.get("Location");

          const redirectInit = {
            method: request.method,
            redirect: "follow",
          };

          if (
            request.method !== "GET" &&
            request.method !== "HEAD"
          ) {
            // The body has already been consumed above, so don't
            // resend it on the redirect.
            redirectInit.method = "GET";
          }

          response = await fetch(redirectUrl, redirectInit);
        }

        const contentType =
          response.headers.get("Content-Type") || "";

        const body = await response.text();

        // =================================================
        // Return JSON if Apps Script returned JSON
        // =================================================

        if (
          contentType.includes("application/json") ||
          body.trim().startsWith("{") ||
          body.trim().startsWith("[")
        ) {
          return new Response(body, {
            status: response.status,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        }

        // =================================================
        // Unexpected HTML / non-JSON response
        // =================================================

        return new Response(
          JSON.stringify({
            success: false,
            error: "Apps Script returned non-JSON",
            status: response.status,
            contentType: contentType,
            preview: body.substring(0, 500),
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
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
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // =====================================================
    // SERVE MINI APP
    // =====================================================

    return env.ASSETS.fetch(request);
  },
};