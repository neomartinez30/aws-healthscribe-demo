import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: 'build',
        target: 'ES2022',
        cssMinify: true,
        rollupOptions: {
            external: ['@cloudscape-design/{}-styles/index.css', '@cloudscape-design/{}-styles'],
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                },
            },
        },
    },
    plugins: [optimizeCssModules(), react()],
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
        exclude: ['lucide-react'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        fs: {
            strict: true,
        },
    },
});
