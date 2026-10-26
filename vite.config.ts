import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages has no server-side routing. Serving index.html as 404.html lets
 * deep links (/student/jane) and page refreshes boot the SPA, which then
 * resolves the route client-side with BrowserRouter.
 */
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const index = resolve(process.cwd(), 'dist/index.html')
      if (existsSync(index)) copyFileSync(index, resolve(process.cwd(), 'dist/404.html'))
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The workflow sets VITE_BASE_PATH to "/<repository-name>/" automatically,
  // so no username or repository name is hardcoded here.
  const base = env.VITE_BASE_PATH || '/'
  return {
    base,
    plugins: [react(), githubPagesSpaFallback()],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
