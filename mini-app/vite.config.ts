import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { zmpVitePlugin } from 'zmp-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    zmpVitePlugin()
  ]
});
