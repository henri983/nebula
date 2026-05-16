import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Utilise /nebula/ seulement pour GitHub Pages, sinon la racine / pour Vercel
  base: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '/nebula/' : '/'
})
