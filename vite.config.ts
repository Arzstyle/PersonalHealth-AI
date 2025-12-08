import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/PersonalHealth-AI/', // ← ganti dengan nama repo kamu
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
