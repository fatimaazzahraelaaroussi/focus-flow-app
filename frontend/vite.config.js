//import { defineConfig, loadEnv } from 'vite'
//import react from '@vitejs/plugin-react'

//export default defineConfig(({ mode }) => {
  //const env = loadEnv(mode, process.cwd(), '')
  
  //return {
    //plugins: [react()],
    //server: {
      //port: 3000,
      //proxy: {
        //'/api': {
          //target: 'http://localhost:5000',
          //changeOrigin: true
        //}
      //}
    //}
  //}
//})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})