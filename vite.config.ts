import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The illustrations ship as files, never inlined, so their paths stay
    // individually addressable and the bundle stays cacheable.
    assetsInlineLimit: 0,
    // The prisoners illustration is 2.1 MB of path data that has to be measured
    // and drawn at runtime, so a single large chunk is expected here.
    chunkSizeWarningLimit: 1600,
  },
});
