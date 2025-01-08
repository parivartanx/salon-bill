// import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
 
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    // resolve: {
    //   alias: {
    //     '@renderer': resolve('src/renderer/src')
    //   }
    // },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [react()]
  }
})
