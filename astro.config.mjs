import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://intellica.net',
    output: 'static',
    i18n: {
        locales: ['en', 'tr'],
        defaultLocale: 'en',
        routing: {
            prefixDefaultLocale: false,
        },
    },
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'en',
                locales: {
                    en: 'en-US',
                    tr: 'tr-TR',
                },
            },
        }),
    ],
    // Redirects are handled via static HTML files in public/ for instant
    // client-side redirection (no visible "Redirecting…" flash).
});
