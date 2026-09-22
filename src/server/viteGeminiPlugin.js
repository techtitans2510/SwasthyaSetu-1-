import { handleGeminiNavigation } from "./geminiService.js";

/**
 * Vite Dev & Preview Server Middleware Plugin for Gemini AI Assistant
 *
 * Provides a secure server-side API endpoint at POST /api/ai/navigate.
 * Prevents client-side exposure of GEMINI_API_KEY.
 */
export function viteGeminiPlugin() {
  return {
    name: "vite-plugin-gemini-assistant",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";
        if (url === "/api/ai/navigate" && req.method === "POST") {
          let rawBody = "";
          req.on("data", (chunk) => {
            rawBody += chunk;
          });

          req.on("end", async () => {
            try {
              const parsed = JSON.parse(rawBody || "{}");
              const { message, role, currentPage, currentSection, language } = parsed;

              if (!message || typeof message !== "string") {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    success: false,
                    error: "Bad Request: 'message' is required."
                  })
                );
                return;
              }

              const result = await handleGeminiNavigation({
                message,
                role,
                currentPage: currentPage || "/",
                currentSection: currentSection || "General",
                language
              });

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, ...result }));
            } catch (err) {
              console.error("[viteGeminiPlugin] Request handler error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  error: "Internal server error processing navigation decision."
                })
              );
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default viteGeminiPlugin;
