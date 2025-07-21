import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> = {
    background_color: 'oklch(0.216 0.006 56.043)',
    categories: ['personalization', 'productivity', 'utilities'],
    description: 'An application for printing series of labels/stickers',
    display: 'standalone',
    name: 'Label printer',
    orientation: 'any',
    scope: '/label-printer/',
    short_name: 'Label printer',
    start_url: 'https://cartaplassa.github.io/label-printer/',
    theme_color: '#09090b',
    icons: [
        {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
        },
        {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
        },
        {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
        },
    ],
    screenshots: [
        {
            src: 'desktop.webp',
            sizes: '1280x720',
            type: 'image/webp',
            form_factor: 'wide',
            label: 'Home screen showing main navigation and featured content',
        },
    ],
};

export default defineConfig({
    base: '/label-printer',
    plugins: [
        react(),
        tsconfigPaths(),
        tailwindcss(),
        VitePWA({
            manifest,
            registerType: 'prompt',
            // workbox: {
            //     globPatterns: ['**/*'],
            //     maximumFileSizeToCacheInBytes: Number.MAX_SAFE_INTEGER,
            //     navigateFallback: '/label-printer',
            // },
        }),
    ],
});
