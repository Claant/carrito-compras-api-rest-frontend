import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    mode === 'development' ? vueDevTools() : null,
    mode === 'production' ? compression() : null,
     visualizer({ filename: 'stats.html', open: true })
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  build: {
  minify: 'esbuild',  // minimiza el código para que pese menos.
  sourcemap: false,   
  cssCodeSplit: true,   // separa el CSS por vista o componente.
  chunkSizeWarningLimit: 600,  // ajusta el límite de advertencia de tamaño.
rollupOptions: {
  output: {
    manualChunks(id) {  // divide las dependencias grandes (jspdf, html2canvas, vendor) en archivos separados para evitar duplicados.
      if (id.includes('node_modules')) {
        if (id.includes('jspdf')) return 'jspdf'
        if (id.includes('html2canvas')) return 'html2canvas'
        return 'vendor' // todo lo demás en un solo chunk
      }
    }
  }
}


}
,

  server: {
    port: 5173,
    open: true
  }
}))
