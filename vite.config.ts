import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copyBadgeAssetsPlugin(): Plugin {
  return {
    name: 'copy-badge-assets',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'assets/badges');
      const destDir = path.resolve(__dirname, 'dist/assets/badges');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyBadgeAssetsPlugin()],
  test: {
    environment: 'node',
    globals: true,
  },
} as any);
