import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/react-typewriter-hook/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      'react-typewriter-hook': path.resolve(rootDir, '../src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(rootDir, '..')],
    },
  },
}))

