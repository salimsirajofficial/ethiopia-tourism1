import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        "./Signup": "./src/pages/Signup.jsx",
        "./Login": "./src/pages/Login.jsx",
        "./ForgotPassword": "./src/pages/ForgotPassword.jsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "19.2.4" },
        "react-dom": { singleton: true, requiredVersion: "19.2.4" },
        "react-router-dom": { singleton: true, requiredVersion: "7.13.2" },
        "@react-oauth/google": { singleton: true, requiredVersion: "0.13.4" },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
});

