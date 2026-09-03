import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const elevenLabsApiKey = (
    env.VITE_TTS_API_KEY ?? env.ELEVENLABS_API_KEY ?? env.VITE_TTS_API_KEY
  )?.trim();
  const apiUrl = env.VITE_API_URL?.trim();

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      proxy: {
        "/api/elevenlabs/voices": {
          target: "https://api.elevenlabs.io",
          changeOrigin: true,
          rewrite: (requestPath) =>
            requestPath.replace(/^\/api\/elevenlabs\/voices/, "/v2/voices"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (elevenLabsApiKey) {
                proxyReq.setHeader("xi-api-key", elevenLabsApiKey);
              }
            });
          },
        },
        "/api/elevenlabs/tts": {
          target: "https://api.elevenlabs.io",
          changeOrigin: true,
          rewrite: (requestPath) =>
            requestPath.replace(
              /^\/api\/elevenlabs\/tts/,
              "/v1/text-to-speech",
            ),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (elevenLabsApiKey) {
                proxyReq.setHeader("xi-api-key", elevenLabsApiKey);
              }
            });
          },
        },
        "/api/supertone/tts": {
          target: "https://supertoneapi.com",
          changeOrigin: true,
          rewrite: (requestPath) =>
            requestPath.replace(/^\/api\/supertone\/tts/, "/v1/text-to-speech"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.ELEVENLABS_API_KEY) {
                proxyReq.setHeader("x-sup-api-key", env.ELEVENLABS_API_KEY.trim());
              }
            });
          },
        },
        
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("ngrok-skip-browser-warning", "true");
            });
          },
        },
      },
    },
  };
});
