import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { deleteAccountPlugin } from "./vite/deleteAccountPlugin.js";
import { siteLogPlugin } from "./vite/siteLogPlugin.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    envPrefix: ["VITE_", "FIRST_KEY_OF_", "SECOND_KEY_OF_"],
    plugins: [react(), deleteAccountPlugin(), siteLogPlugin()],
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        "/api": {
          target:
            env.VITE_API_PROXY_TARGET || "http://localhost:6001",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    preview: {
      port: 4173,
      strictPort: false,
      proxy: {
        "/api": {
          target:
            env.VITE_API_PROXY_TARGET || "http://localhost:6001",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
