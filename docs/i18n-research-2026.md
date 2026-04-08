# Multi-Language Research — Astro 6 + SEO Best Practices 2026

> Date: 2026-04-08
> Astro Version: 6.1.5 (upgraded from 5.17.1)

## Industry Consensus: Subdirectory Approach

All major sources agree — subdirectory (`/tr/`, `/de/`) is the standard for 85%+ of websites.

| Source | Recommendation |
|---|---|
| Google Search Central | Subdirectory for unified authority |
| Next.js App Router | `[locale]/` dynamic segment |
| Astro 6 | `src/pages/{locale}/` folder structure |
| Vercel | Subdirectory for SEO-optimized sites |
| SEO Industry (2026) | Subdirectory dominates |

### Why Subdirectory Wins
- Domain authority consolidation (backlinks benefit all languages)
- Single Google Search Console property
- Low maintenance (one hosting, one SSL, one deploy)
- Easy hreflang management

### Google Critical Warnings
1. **"Avoid automatically redirecting users from one language version to another"** — harmful for both users and crawlers
2. **"Don't use IP analysis to adapt your content"** — unreliable
3. Google uses **visible page content** to determine language, not `lang` attribute or URL
4. Recommend **hyperlinks to other language versions** for user choice

## Astro 6 Native i18n System

### Configuration (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://intellica.net',
  output: 'static',
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,  // EN at /, TR at /tr/
    },
    fallback: {
      tr: 'en'  // Missing TR pages fall back to EN
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', tr: 'tr-TR' },
      },
    }),
  ],
});
```

### File Structure

```
src/pages/
  index.astro           → intellica.net/
  about.astro           → intellica.net/about/
  products.astro        → intellica.net/products/
  tr/
    index.astro         → intellica.net/tr/
    about.astro         → intellica.net/tr/about/
    products.astro      → intellica.net/tr/products/
```

### Helper Functions (`astro:i18n`)

```javascript
import {
  getRelativeLocaleUrl,    // getRelativeLocaleUrl('tr', 'about') → '/tr/about'
  getAbsoluteLocaleUrl,    // Full URL with domain
  getRelativeLocaleUrlList, // All locale variants for a path
  getLocaleByPath,         // Extract locale from URL path
} from 'astro:i18n';
```

### Page-level Locale Access

- `Astro.currentLocale` — Works in static. Returns locale from URL or defaultLocale.
- `Astro.preferredLocale` — SSR only. NOT available in static builds.
- `Astro.preferredLocaleList` — SSR only.

### Translation System (Official Recipe)

```typescript
// src/i18n/ui.ts
export const ui = {
  en: { 'nav.home': 'Home', 'nav.about': 'About' },
  tr: { 'nav.home': 'Ana Sayfa', 'nav.about': 'Hakkımızda' },
} as const;

// src/i18n/utils.ts
export function getLangFromUrl(url: URL) { ... }
export function useTranslations(lang) { ... }
export function useTranslatedPath(lang) { ... }
```

### SEO: hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://intellica.net/about" />
<link rel="alternate" hreflang="tr" href="https://intellica.net/tr/about" />
<link rel="alternate" hreflang="x-default" href="https://intellica.net/about" />
```

### Sitemap: Automatic hreflang XML

`@astrojs/sitemap` with i18n config auto-generates:
```xml
<url>
  <loc>https://intellica.net/about/</loc>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://intellica.net/about/"/>
  <xhtml:link rel="alternate" hreflang="tr-TR" href="https://intellica.net/tr/about/"/>
</url>
```

### Astro 6 Breaking Change
- `redirectToDefaultLocale` default changed from `true` (v5) to `false` (v6)
- Requires `prefixDefaultLocale: true` to function
- Not relevant if using `prefixDefaultLocale: false`

## Browser Language Detection — Static Site Limitations

`Astro.preferredLocale` is SSR-only. For static sites, options:

1. **Client-side JS** — Read `navigator.language`, show banner (NOT redirect)
2. **Language switcher in header** — Always visible toggle
3. **Combination** — Toggle always present + soft banner for detected language mismatch

Google recommends option 2+3: **always provide a language switcher, optionally suggest based on browser language, never force redirect.**

## Third-Party Libraries — Not Recommended

| Library | Status (2026) |
|---|---|
| astro-i18next | Abandoned, Astro 5 incompatible |
| astro-i18n-aut | Inactive 1+ year |
| Paraglide JS | SSR only, not for static |
| **Astro built-in** | **Stable, recommended** |

## Current Site State

- All content hardcoded in .astro files (no content collections)
- No existing i18n infrastructure
- Organization schema already declares `availableLanguage: ["English", "Turkish"]`
- Navigation links hardcoded as arrays in Header/Footer/BottomNav components
- 34 pages, static output, GitHub Pages deploy

## Key Decisions Needed

1. Default language: EN (preserves current Google index) vs TR (company is Turkish)
2. Content extraction: How to organize translation strings
3. Browser detection: Banner vs redirect vs toggle-only
4. Page duplication: Full duplicate pages vs shared templates with translated content
5. Redirect strategy: Old `/tr/*` URLs → new `/tr/*` URLs
