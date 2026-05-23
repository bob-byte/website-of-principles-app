import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { deleteAccountPlugin } from "./vite/deleteAccountPlugin.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), deleteAccountPlugin()],
    server: {
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
