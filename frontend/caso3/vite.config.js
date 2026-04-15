// ─────────────────────────────────────────────────────────────────────────────
// vite.config.js — Configuración del bundler / dev server
//
// @vitejs/plugin-react habilita:
//   - JSX transform (no necesitas importar React en cada archivo)
//   - Fast Refresh: los componentes se actualizan en el browser sin perder estado
//     cuando guardas cambios en un archivo .jsx
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
