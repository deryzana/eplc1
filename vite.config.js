import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: 'www.eplc.com', // atau bisa langsung 'www.eplc.com' jika hanya untuk itu
  //   port: 5137
  // }
})
