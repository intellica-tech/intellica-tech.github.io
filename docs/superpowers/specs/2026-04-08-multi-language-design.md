# Multi-Language Support — Design Specification

> Date: 2026-04-08
> Status: Approved
> Astro Version: 6.1.5
> Initial Languages: English (default) + Turkish
> Future Languages: Arabic, Urdu, Russian, Japanese, German + others (~10 total)

---

## 1. URL Structure & Routing

### Astro i18n Config

```javascript
// astro.config.mjs
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
        locales: { en: 'en-US', tr: 'tr-TR' },
      },
    }),
  ],
  redirects: {
    // Phase 0: EN URL renames
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
    // Phase 2: TR URL renames (added when TR pages are live)
    '/tr/about-us': '/tr/about',
    '/tr/our-products': '/tr/products',
    '/tr/our-services': '/tr/solutions',
    '/tr/career': '/tr/careers',
    '/tr/business-benefits': '/tr/solutions',
    '/tr/privacy-policy': '/tr/privacy',
    '/tr/cookie-policy': '/tr/cookies',
  },
});
```

### URL Map

| Page | EN (default) | TR | Future AR |
|---|---|---|---|
| Home | `/` | `/tr/` | `/ar/` |
| About | `/about` | `/tr/about` | `/ar/about` |
| Products | `/products` | `/tr/products` | `/ar/products` |
| Product detail | `/products/ifdm` | `/tr/products/ifdm` | `/ar/products/ifdm` |
| Solutions | `/solutions` | `/tr/solutions` | `/ar/solutions` |
| Contact | `/contact` | `/tr/contact` | `/ar/contact` |
| Careers | `/careers` | `/tr/careers` | `/ar/careers` |

### Adding a New Language (Future)

1. `astro.config.mjs` → add to `locales` array
2. `src/i18n/locales/{lang}.json` → create translation file
3. `src/i18n/config.ts` → add language entry with name, dir, font, locale
4. Build → all `/{lang}/*` pages auto-generated

No template changes needed.

---

## 2. File Structure

```
src/
  i18n/
    config.ts                → Language definitions, RTL, font, getI18nPaths()
    utils.ts                 → getLangFromUrl(), useTranslations(), useTranslatedPath()
    locales/
      en.json                → All EN translations
      tr.json                → All TR translations
  page-templates/
    HomePage.astro           → Shared home page template
    AboutPage.astro          → Shared about page template
    ProductsPage.astro       → Shared products listing template
    ProductDetailPage.astro  → Shared product detail template
    SolutionsPage.astro      → Shared solutions template
    ContactPage.astro        → Shared contact template
    CareersPage.astro        → Shared careers template
    ClientsPage.astro        → Shared clients template
    AcademyPage.astro        → Shared academy template
    DataPlatformsPage.astro  → Shared data platforms template
    PartnersPage.astro       → Shared partners template
    InsightsPage.astro       → Shared insights listing template
    InsightDetailPage.astro  → Shared insight detail template
    PrivacyPage.astro        → Shared privacy template
    TermsPage.astro          → Shared terms template
    CookiesPage.astro        → Shared cookies template
    NotFoundPage.astro       → Shared 404 template
  pages/
    index.astro              → / (EN wrapper, ~5 lines)
    about.astro              → /about (EN wrapper)
    products.astro           → /products (EN wrapper)
    products/
      [slug].astro           → /products/ifdm (EN, existing dynamic route)
    solutions.astro
    contact.astro
    careers.astro
    clients.astro
    academy.astro
    data-platforms.astro
    partners.astro
    insights.astro
    insights/[slug].astro
    privacy.astro
    terms.astro
    cookies.astro
    404.astro
    [lang]/
      index.astro            → /tr/ (dynamic wrapper)
      about.astro            → /tr/about (dynamic wrapper)
      products.astro         → /tr/products (dynamic wrapper)
      products/
        [slug].astro         → /tr/products/ifdm (dynamic, nested)
      solutions.astro
      contact.astro
      careers.astro
      clients.astro
      academy.astro
      data-platforms.astro
      partners.astro
      insights.astro
      insights/[slug].astro
      privacy.astro
      terms.astro
      cookies.astro
  layouts/
    Layout.astro             → Updated: lang, dir, hreflang, font, canonical
  components/
    Header.astro             → Updated: t() for nav labels
    Footer.astro             → Updated: t() for footer text
    BottomNav.astro          → Updated: t() for mobile nav
    CookieConsent.astro      → Updated: t() for banner text
    LanguagePicker.astro     → NEW: language dropdown
    LanguageBanner.astro     → NEW: browser language suggestion
```

---

## 3. Translation System

### Layer 1: Language Config (`src/i18n/config.ts`)

```typescript
export const languages = {
  en: { name: 'English', dir: 'ltr', font: 'inter', locale: 'en-US' },
  tr: { name: 'Türkçe', dir: 'ltr', font: 'inter', locale: 'tr-TR' },
} as const;

export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export function getI18nPaths() {
  return Object.keys(languages)
    .filter(lang => lang !== defaultLang)
    .map(lang => ({ params: { lang } }));
}
```

### Layer 2: Translation Files (`src/i18n/locales/*.json`)

Namespace convention:

| Prefix | Scope | Example |
|---|---|---|
| `nav.*` | Navigation (header, footer, bottom nav) | `nav.products` |
| `footer.*` | Footer-specific strings | `footer.rights` |
| `cta.*` | Buttons and call-to-action | `cta.getStarted` |
| `hero.{page}.*` | Page hero section | `hero.about.title` |
| `{page}.{section}.*` | Page inner sections | `about.section1.title` |
| `products.{slug}.*` | Product-specific | `products.ifdm.name` |
| `meta.*` | SEO meta information | `meta.about.title` |
| `common.*` | Shared terms | `common.readMore` |
| `banner.*` | Language banner strings | `banner.suggest` |
| `cookie.*` | Cookie consent strings | `cookie.accept` |

### Layer 3: Helper Functions (`src/i18n/utils.ts`)

```typescript
import { languages, defaultLang, type Lang } from './config';

// Load all locale files
import en from './locales/en.json';
import tr from './locales/tr.json';

const translations: Record<Lang, Record<string, string>> = { en, tr };

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang]?.[key]
        || translations[defaultLang]?.[key]
        || key;
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string): string {
    return lang === defaultLang ? path : `/${lang}${path}`;
  };
}
```

### Layer 4: Page Template Pattern

Shared template (`page-templates/AboutPage.astro`):
```astro
---
import Layout from '../layouts/Layout.astro';
import { useTranslations, useTranslatedPath } from '../i18n/utils';
import type { Lang } from '../i18n/config';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
---
<Layout title={t('meta.about.title')} description={t('meta.about.description')} lang={lang}>
  <section class="hero">
    <h1 class="grad-text">{t('hero.about.title')}</h1>
    <p>{t('hero.about.description')}</p>
  </section>
  <!-- ... page content using t() ... -->
</Layout>
```

EN wrapper (`pages/about.astro`):
```astro
---
import AboutPage from '../page-templates/AboutPage.astro';
---
<AboutPage lang="en" />
```

Dynamic wrapper (`pages/[lang]/about.astro`):
```astro
---
import AboutPage from '../../page-templates/AboutPage.astro';
import { getI18nPaths } from '../../i18n/config';
export const getStaticPaths = getI18nPaths;
const { lang } = Astro.params;
---
<AboutPage lang={lang} />
```

---

## 4. Layout, SEO & AI Visibility

### Layout.astro Updates

```astro
---
import { languages, defaultLang } from '../i18n/config';
import { getAbsoluteLocaleUrl } from 'astro:i18n';

const currentLocale = Astro.currentLocale || defaultLang;
const { dir, font } = languages[currentLocale];
const currentPath = Astro.url.pathname
  .replace(new RegExp(`^/(${Object.keys(languages).join('|')})/`), '/')
  .replace(/^\//, '');
---
<html lang={currentLocale} dir={dir}>
<head>
  <!-- hreflang for all locales (auto-generated) -->
  {Object.keys(languages).map(lang => (
    <link rel="alternate" hreflang={lang}
          href={getAbsoluteLocaleUrl(lang, currentPath)} />
  ))}
  <link rel="alternate" hreflang="x-default"
        href={getAbsoluteLocaleUrl(defaultLang, currentPath)} />

  <!-- canonical: each language points to itself -->
  <link rel="canonical" href={Astro.url.href} />

  <!-- OG locale -->
  <meta property="og:locale" content={languages[currentLocale].locale} />
  {Object.entries(languages)
    .filter(([code]) => code !== currentLocale)
    .map(([, { locale }]) => (
      <meta property="og:locale:alternate" content={locale} />
  ))}

  <!-- Font loading (script-based, lazy) -->
  {font === 'noto-arabic' && (
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic&display=swap" rel="stylesheet" />
  )}
  {font === 'noto-jp' && (
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet" />
  )}
</head>
```

### JSON-LD Structured Data

Organization schema `inLanguage` field dynamically set to current page language. BreadcrumbList names translated via `t()`.

### Sitemap

`@astrojs/sitemap` with i18n config auto-generates hreflang XML annotations. No manual intervention needed.

### llms.txt

```
public/
  llms.txt              → Main index (EN)
  tr/llms.txt           → Turkish version
```

Each file summarizes site purpose, lists available languages, and links to key pages in that language.

---

## 5. Language Picker & Browser Detection

### LanguagePicker.astro

- Desktop: header right side, next to navigation
- Mobile: inside BottomNav "More" menu
- Links to same page in other language (`/about` ↔ `/tr/about`)
- Active language highlighted
- 2 languages: compact toggle (`EN | TR`)
- 10 languages: dropdown menu

### LanguageBanner.astro

- Client-side JS reads `navigator.language`
- If browser language is supported AND different from current page → show suggestion banner
- Banner text: "This page is also available in Türkçe. [Switch]"
- Dismiss → `localStorage` saves preference, banner never shown again
- **No automatic redirect** (Google best practice)
- Cookie consent takes priority — lang banner shown after cookie consent is handled
- Google crawlers don't see banner (JS-dependent rendering)

---

## 6. Redirect Strategy

### Phase 0: EN URL Renames (immediate, pre-i18n)

| Old | New |
|---|---|
| `/about-us` | `/about` |
| `/our-products` | `/products` |
| `/our-services` | `/solutions` |
| `/career` | `/careers` |
| `/privacy-policy` | `/privacy` |
| `/cookie-policy` | `/cookies` |
| `/terms-and-conditions` | `/terms` |
| `/blog` | `/insights` |
| `/business-benefits` | `/solutions` |
| `/demo` | `/contact` |

### Phase 2: TR URL Renames (after TR pages live)

| Old | New |
|---|---|
| `/tr/about-us` | `/tr/about` |
| `/tr/our-products` | `/tr/products` |
| `/tr/our-services` | `/tr/solutions` |
| `/tr/career` | `/tr/careers` |
| `/tr/business-benefits` | `/tr/solutions` |
| `/tr/privacy-policy` | `/tr/privacy` |
| `/tr/cookie-policy` | `/tr/cookies` |

Unchanged paths (no redirect needed): `/tr/contact`, `/tr/clients`, `/tr/academy`

### Phase 3: Google Search Console

Submit updated sitemap, request re-indexing for key pages, verify hreflang in Search Console.

---

## 7. RTL & CSS Strategy

### Current Phase (EN + TR, both LTR)

- Use CSS Logical Properties in new CSS (`margin-inline-start` instead of `margin-left`)
- Don't touch existing CSS — it works for LTR
- Layout.astro `dir` attribute is dynamic from config

### Future Phase (AR/UR added)

- Add `[dir="rtl"]` overrides only for non-logical existing CSS
- Load script-specific fonts conditionally
- Adjust `line-height` for Arabic/CJK scripts

### Font Strategy

| Script | Font | Languages | Loading |
|---|---|---|---|
| Latin | Inter (already loaded) | EN, TR, DE | Always |
| Cyrillic | Inter (subset) | RU | Always (Inter covers it) |
| Arabic | Noto Sans Arabic | AR, UR | Lazy (only on AR/UR pages) |
| CJK | Noto Sans JP | JA | Lazy (only on JA pages) |

---

## 8. Implementation Phases

### Phase 0: SEO Rescue (pre-i18n)
- Add EN redirect map to `astro.config.mjs`
- Build & deploy
- **Impact:** Recover ~300 lost sessions/month immediately

### Phase 1: i18n Infrastructure
1. Create `src/i18n/config.ts`
2. Create `src/i18n/utils.ts`
3. Extract EN strings → `src/i18n/locales/en.json`
4. Create TR translations → `src/i18n/locales/tr.json`
5. Add i18n config to `astro.config.mjs`

### Phase 2: Layout & Shared Components
1. Update `Layout.astro` — lang, dir, hreflang, OG locale, JSON-LD
2. Update `Header.astro` — t() for nav
3. Update `Footer.astro` — t() for footer
4. Update `BottomNav.astro` — t() for mobile nav
5. Create `LanguagePicker.astro` — add to Header
6. Update `CookieConsent.astro` — t() for banner
7. Update sitemap i18n config

### Phase 3: Page Migration (by traffic priority)
1. `index` (home) — 586 sessions/month
2. `about` — 136 sessions/month
3. `products` + `products/[slug]` — 96 sessions/month
4. `solutions` — 27 sessions/month
5. `careers` — 67 sessions/month
6. `contact` — 40 sessions/month
7. `clients` — 25 sessions/month
8. `academy` — 23 sessions/month
9. Remaining pages — privacy, terms, cookies, partners, data-platforms, insights

For each page:
1. Extract hardcoded strings to `en.json`
2. Update page to use `t()`
3. Create `page-templates/XxxPage.astro` (shared template)
4. Simplify `pages/xxx.astro` to wrapper
5. Create `pages/[lang]/xxx.astro` wrapper
6. Add Turkish translations to `tr.json`

### Phase 4: Browser Detection & Remaining Redirects
1. Create `LanguageBanner.astro`
2. Add TR redirect map to `astro.config.mjs`
3. Create `llms.txt` and `tr/llms.txt`

### Phase 5: Verification & Deploy
1. `astro build` — all pages build successfully
2. hreflang tags correct on every page
3. Sitemap XML contains hreflang
4. Language picker works on all pages
5. Language banner triggers correctly
6. 404 page works in both languages
7. All redirects functional
8. Submit sitemap to Google Search Console

### Scope Summary

| Category | Count |
|---|---|
| New files | ~8 (i18n/*, page-templates seed, LanguagePicker, LanguageBanner, llms.txt) |
| Updated files | ~6 (Layout, Header, Footer, BottomNav, CookieConsent, astro.config) |
| Wrapper pages | ~25 ([lang]/ wrappers) |
| Page templates | ~17 (page-templates/) |
| Translation files | 2 (en.json, tr.json) |
| **Total** | **~58 files** |

---

## Research References

- [Google: Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google: Localized Versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Astro i18n Routing Guide](https://docs.astro.build/en/guides/internationalization/)
- [Astro i18n Recipe](https://docs.astro.build/en/recipes/i18n/)
- [Astro 6.1 Release Notes](https://astro.build/blog/astro-610/)
- [llms.txt Specification](https://llmstxt.org/)
- [International llms.txt Structure](https://www.rebelytics.com/creating-a-scalable-international-llms-txt-structure-step-by-step/)
- [Multilingual SEO for AI-First Search 2026](https://seenos.ai/international-geo/multilingual-seo-guide)
- [Subdirectories vs Subdomains SEO 2026](https://koanthic.com/en/subdirectories-vs-subdomains-seo-complete-guide-2026/)
