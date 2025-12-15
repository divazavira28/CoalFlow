import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/CoalFlow/",
  plugins: [
    react({
      jsxRuntime: "classic",
      include: /\.(js|jsx)$/ // >>> IZINKAN JSX DI FILE .js
    }),
  ],
});
