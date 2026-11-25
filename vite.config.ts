import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite abrir el build (dist/) desde cualquier carpeta o servidor estatico.
export default defineConfig({
  plugins: [react()],
  base: './',
})
