import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        secure: false,
      },
    },
  },

  plugins: [react()],
});
