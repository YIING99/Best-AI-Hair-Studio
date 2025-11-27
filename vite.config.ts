import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to local functions during development if needed, 
    // or rely on Vercel dev command.
    port: 3000
  }
});