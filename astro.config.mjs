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
        fallback: {
            tr: 'en',
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
    redirects: {
        '/about-us': '/about',
        '/our-products': '/products',
        '/our-services': '/solutions',
        '/career': '/careers',
        '/privacy-policy': '/privacy',
        '/cookie-policy': '/cookies',
        '/terms-and-conditions': '/terms',
        '/blog': '/insights',
        '/business-benefits': '/solutions',
        '/demo': '/contact',
    },
});
