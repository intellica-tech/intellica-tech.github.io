# Multi-Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English + Turkish multi-language support to intellica.net using Astro 6 native i18n, with dynamic routes and JSON translation files that scale to 10+ languages.

**Architecture:** Astro's built-in i18n routing with `prefixDefaultLocale: false` (EN at `/`, TR at `/tr/`). Shared page templates in `src/page-templates/`, thin wrapper pages in `src/pages/` and `src/pages/[lang]/`. Translations in JSON files under `src/i18n/locales/`. Language picker in header, browser language suggestion banner (no auto-redirect).

**Tech Stack:** Astro 6.1.5, @astrojs/sitemap with i18n, TypeScript, vanilla CSS, GitHub Pages (static output)

**Spec:** `docs/superpowers/specs/2026-04-08-multi-language-design.md`

**Note:** This project has no test framework. Verification is done via `astro build` and manual browser checks. Each task ends with a build verification step.

---

## File Structure Overview

```
Create: src/i18n/config.ts
Create: src/i18n/utils.ts
Create: src/i18n/locales/en.json
Create: src/i18n/locales/tr.json
Create: src/components/LanguagePicker.astro
Create: src/components/LanguageBanner.astro
Create: src/page-templates/HomePage.astro
Create: src/page-templates/AboutPage.astro
Create: src/page-templates/ProductsPage.astro
Create: src/page-templates/ProductDetailPage.astro
Create: src/page-templates/SolutionsPage.astro
Create: src/page-templates/ContactPage.astro
Create: src/page-templates/CareersPage.astro
Create: src/page-templates/ClientsPage.astro
Create: src/page-templates/AcademyPage.astro
Create: src/page-templates/DataPlatformsPage.astro
Create: src/page-templates/PartnersPage.astro
Create: src/page-templates/InsightsPage.astro
Create: src/page-templates/InsightDetailPage.astro
Create: src/page-templates/PrivacyPage.astro
Create: src/page-templates/TermsPage.astro
Create: src/page-templates/CookiesPage.astro
Create: src/page-templates/NotFoundPage.astro
Create: src/pages/[lang]/index.astro
Create: src/pages/[lang]/about.astro
Create: src/pages/[lang]/products.astro
Create: src/pages/[lang]/products/[slug].astro
Create: src/pages/[lang]/solutions.astro
Create: src/pages/[lang]/contact.astro
Create: src/pages/[lang]/careers.astro
Create: src/pages/[lang]/clients.astro
Create: src/pages/[lang]/academy.astro
Create: src/pages/[lang]/data-platforms.astro
Create: src/pages/[lang]/partners.astro
Create: src/pages/[lang]/insights.astro
Create: src/pages/[lang]/insights/[slug].astro
Create: src/pages/[lang]/privacy.astro
Create: src/pages/[lang]/terms.astro
Create: src/pages/[lang]/cookies.astro
Create: src/pages/[lang]/404.astro
Create: public/llms.txt
Create: public/tr/llms.txt
Modify: astro.config.mjs
Modify: src/layouts/Layout.astro
Modify: src/components/Header.astro
Modify: src/components/Footer.astro
Modify: src/components/BottomNav.astro
Modify: src/components/CookieConsent.astro
Modify: src/pages/index.astro (simplify to wrapper)
Modify: src/pages/about.astro (simplify to wrapper)
Modify: src/pages/products.astro (simplify to wrapper)
Modify: src/pages/products/[slug].astro (simplify to wrapper)
Modify: src/pages/solutions.astro (simplify to wrapper)
Modify: src/pages/contact.astro (simplify to wrapper)
Modify: src/pages/careers.astro (simplify to wrapper)
Modify: src/pages/clients.astro (simplify to wrapper)
Modify: src/pages/academy.astro (simplify to wrapper)
Modify: src/pages/data-platforms.astro (simplify to wrapper)
Modify: src/pages/partners.astro (simplify to wrapper)
Modify: src/pages/insights.astro (simplify to wrapper)
Modify: src/pages/insights/[slug].astro (simplify to wrapper)
Modify: src/pages/privacy.astro (simplify to wrapper)
Modify: src/pages/terms.astro (simplify to wrapper)
Modify: src/pages/cookies.astro (simplify to wrapper)
Modify: src/pages/404.astro (simplify to wrapper)
Delete: src/pages/products/blue-octopus.astro (consolidated into [slug].astro)
Delete: src/pages/products/var.astro
Delete: src/pages/products/orqenta.astro
Delete: src/pages/products/ifdm.astro
Delete: src/pages/products/retable.astro
Delete: src/pages/products/talk-to-your-data.astro
Delete: src/pages/products/hrdm.astro
Delete: src/pages/products/retouch.astro
Delete: src/pages/products/itdm.astro
Delete: src/pages/products/icc.astro
Delete: src/pages/products/procurement-price-prediction.astro
```

---

## Phase 0: SEO Redirect Rescue

### Task 1: Add EN URL redirect map

Stops SEO bleeding immediately. No other files touched.

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add redirects to astro.config.mjs**

Read the current `astro.config.mjs` and add the `redirects` key. These are old URL → new URL mappings for pages that were renamed when the site was rebuilt.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://intellica.net',
    output: 'static',
    integrations: [sitemap()],
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
```

- [ ] **Step 2: Build and verify redirects**

Run: `npx astro build 2>&1 | tail -5`

Expected: Build succeeds. Check that redirect HTML files were generated:

Run: `cat dist/about-us/index.html`

Expected: Contains `<meta http-equiv="refresh"` pointing to `/about`.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "fix: add redirects for old URLs to stop SEO bleeding"
```

---

## Phase 1: i18n Infrastructure

### Task 2: Create i18n config

**Files:**
- Create: `src/i18n/config.ts`

- [ ] **Step 1: Create the i18n directory and config file**

```typescript
// src/i18n/config.ts

export const languages = {
  en: { name: 'English', dir: 'ltr' as const, font: 'inter', locale: 'en-US' },
  tr: { name: 'Türkçe', dir: 'ltr' as const, font: 'inter', locale: 'tr-TR' },
} as const;

export const defaultLang = 'en';
export type Lang = keyof typeof languages;

/**
 * Returns static paths for all non-default languages.
 * Used by src/pages/[lang]/*.astro files.
 */
export function getI18nPaths() {
  return Object.keys(languages)
    .filter((lang) => lang !== defaultLang)
    .map((lang) => ({ params: { lang } }));
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx astro build 2>&1 | tail -3`

Expected: Build succeeds (file is not imported yet, but syntax is validated by Astro's TS compilation).

- [ ] **Step 3: Commit**

```bash
git add src/i18n/config.ts
git commit -m "feat(i18n): add language config with EN and TR definitions"
```

### Task 3: Create i18n utils

**Files:**
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Create the utils file**

This file loads translation JSON files and provides `getLangFromUrl()`, `useTranslations()`, and `useTranslatedPath()` helper functions.

```typescript
// src/i18n/utils.ts
import { languages, defaultLang, type Lang } from './config';

import en from './locales/en.json';
import tr from './locales/tr.json';

const translations: Record<Lang, Record<string, string>> = { en, tr };

/**
 * Extract language code from a URL pathname.
 * /tr/about → 'tr', /about → 'en' (default)
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

/**
 * Returns a t() function bound to the given language.
 * Falls back to defaultLang, then returns the raw key.
 */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang]?.[key]
      ?? translations[defaultLang]?.[key]
      ?? key;
  };
}

/**
 * Returns a function that prefixes paths with the language code.
 * Default language gets no prefix: /about
 * Other languages get prefix: /tr/about
 */
export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string): string {
    return lang === defaultLang ? path : `/${lang}${path}`;
  };
}
```

**Note:** This file imports `./locales/en.json` and `./locales/tr.json` which don't exist yet. They're created in the next task. Don't build until Task 4 is done.

- [ ] **Step 2: Commit**

```bash
git add src/i18n/utils.ts
git commit -m "feat(i18n): add translation utils — getLangFromUrl, useTranslations, useTranslatedPath"
```

### Task 4: Create initial translation JSON files

**Files:**
- Create: `src/i18n/locales/en.json`
- Create: `src/i18n/locales/tr.json`

- [ ] **Step 1: Create the locales directory and EN translation file**

Extract strings from Header.astro, Footer.astro, BottomNav.astro, CookieConsent.astro, and Layout.astro. These are the shared component strings needed before any page migration.

Read each component file carefully and extract every user-facing string. The full page-specific strings will be added in Phase 3 as each page is migrated.

```json
// src/i18n/locales/en.json
{
  "site.name": "Intellica",
  "site.tagline": "Unleashing Value From Data",

  "nav.products": "Products",
  "nav.aiSolutions": "AI Solutions",
  "nav.dataPlatforms": "Data Platforms",
  "nav.clients": "Clients",
  "nav.about": "About",
  "nav.careers": "Careers",
  "nav.insights": "Insights",
  "nav.contact": "Contact",

  "nav.products.dataModels": "Data Models",
  "nav.products.platformGovernance": "Data Platform & Governance",
  "nav.products.aiProducts": "AI Products",
  "nav.products.exploreAll": "Explore Enterprise Product Portfolio →",

  "nav.careers.joinUs": "Join Us",
  "nav.careers.company": "Company",
  "nav.careers.joinIntellica": "Join Intellica",
  "nav.careers.joinIntellicaDesc": "Join our journey of innovation and build your career",
  "nav.careers.talentProgram": "Data & AI Talent Program",
  "nav.careers.talentProgramDesc": "Intellica's hands-on development program for fresh talent",

  "nav.about.aboutIntellica": "About Intellica",
  "nav.about.aboutIntellicaDesc": "Our mission and global footprint",

  "nav.mobile.careersLabel": "Careers",

  "products.ifdm.name": "IFDM",
  "products.ifdm.desc": "Industry data model for finance",
  "products.itdm.name": "ITDM",
  "products.itdm.desc": "Industry data model for telecom",
  "products.hrdm.name": "HRDM",
  "products.hrdm.desc": "Human resources data model",
  "products.icc.name": "ICC",
  "products.icc.desc": "Data consistency & quality control",
  "products.retouch.name": "ReTouch",
  "products.retouch.desc": "Validated data entry & RDM",
  "products.retable.name": "Retable",
  "products.retable.desc": "No-code apps & data tables",
  "products.orqenta.name": "Orqenta",
  "products.orqenta.desc": "Workflow orchestration and automation",
  "products.talkto.name": "Talk To",
  "products.talkto.desc": "Natural language data analyst",
  "products.blueoctopus.name": "Blue Octopus",
  "products.blueoctopus.desc": "Event intelligence & automated response",
  "products.var.name": "VAR",
  "products.var.desc": "AI voice analytics & recognition",

  "footer.cta.title": "Ready to Transform Your Data?",
  "footer.cta.desc": "From data platforms to AI solutions, we help organizations turn data into measurable business value.",
  "footer.cta.getInTouch": "Get in Touch",
  "footer.cta.viewClients": "View Clients",
  "footer.tagline": "Intellica delivers enterprise data platforms, analytics and AI solutions for leading organizations.",
  "footer.col.products": "Products",
  "footer.col.solutions": "Solutions",
  "footer.col.company": "Company",
  "footer.link.coreProducts": "Core Products",
  "footer.link.aiProducts": "AI Products",
  "footer.link.dataModels": "Data Models",
  "footer.link.allProducts": "All Products",
  "footer.link.aiSolutions": "AI Solutions",
  "footer.link.dataPlatforms": "Data Platforms",
  "footer.link.about": "About",
  "footer.link.joinIntellica": "Join Intellica",
  "footer.link.talentProgram": "Data & AI Talent Program",
  "footer.link.contact": "Contact",
  "footer.pia.prefix": "A",
  "footer.pia.suffix": "Company",
  "footer.trust": "Leading enterprise partner in Banking, Telecom, Public Sector, Manufacturing & Energy.",
  "footer.rights": "All rights reserved.",
  "footer.legal.privacy": "Privacy",
  "footer.legal.terms": "Terms",
  "footer.legal.cookies": "Cookies",

  "bottomNav.products": "Products",
  "bottomNav.aiSolutions": "AI Solutions",
  "bottomNav.dataPlatforms": "Data Platforms",
  "bottomNav.clients": "Clients",
  "bottomNav.more": "More",
  "bottomNav.sheet.products": "Products",
  "bottomNav.sheet.navigation": "Navigation",
  "bottomNav.more.about": "About",
  "bottomNav.more.aboutUs": "About Us",
  "bottomNav.more.aboutUsDesc": "Our mission and global footprint",
  "bottomNav.more.careers": "Careers",
  "bottomNav.more.joinIntellica": "Join Intellica",
  "bottomNav.more.joinIntellicaDesc": "Join our journey of innovation",
  "bottomNav.more.talentProgram": "Data & AI Talent Program",
  "bottomNav.more.talentProgramDesc": "Intellica's development program",
  "bottomNav.more.research": "Research",
  "bottomNav.more.insights": "Insights",
  "bottomNav.more.insightsDesc": "Perspectives and market trends",
  "bottomNav.more.getInTouch": "Get in Touch",
  "bottomNav.more.contactUs": "Contact Us",
  "bottomNav.more.contactUsDesc": "Start a conversation",
  "bottomNav.more.home": "Home",
  "bottomNav.more.homeDesc": "Return to homepage",

  "cookie.text": "We use cookies to analyze site traffic and improve your experience.",
  "cookie.learnMore": "Learn more",
  "cookie.accept": "Accept",
  "cookie.deny": "Decline",

  "langBanner.suggest": "This page is also available in {lang}.",
  "langBanner.switch": "Switch to {lang}",

  "notFound.tagline": "This route isn't in our",
  "notFound.taglineHighlight": "data pipeline",
  "notFound.desc": "The page may have moved, been renamed, or never existed. Let's get you back on track.",
  "notFound.backHome": "Back to Home",
  "notFound.quickNav": "Quick Navigation",
  "notFound.link.products": "Products",
  "notFound.link.productsDesc": "Explore our data & AI product ecosystem",
  "notFound.link.solutions": "AI Solutions",
  "notFound.link.solutionsDesc": "Enterprise AI and analytics solutions",
  "notFound.link.about": "About",
  "notFound.link.aboutDesc": "Our mission and global footprint",
  "notFound.link.contact": "Contact",
  "notFound.link.contactDesc": "Get in touch with our team"
}
```

- [ ] **Step 2: Create TR translation file**

Start with all keys matching EN. Values should be proper Turkish translations — not machine translations. For this initial pass, translate the navigation, footer, cookie consent, and 404 strings. Page-specific content will be added as pages are migrated.

```json
// src/i18n/locales/tr.json
{
  "site.name": "Intellica",
  "site.tagline": "Veriden Değer Üretmek",

  "nav.products": "Ürünler",
  "nav.aiSolutions": "Yapay Zeka Çözümleri",
  "nav.dataPlatforms": "Veri Platformları",
  "nav.clients": "Müşteriler",
  "nav.about": "Hakkımızda",
  "nav.careers": "Kariyer",
  "nav.insights": "İçgörüler",
  "nav.contact": "İletişim",

  "nav.products.dataModels": "Veri Modelleri",
  "nav.products.platformGovernance": "Veri Platformu & Yönetişim",
  "nav.products.aiProducts": "Yapay Zeka Ürünleri",
  "nav.products.exploreAll": "Kurumsal Ürün Portföyünü Keşfet →",

  "nav.careers.joinUs": "Bize Katılın",
  "nav.careers.company": "Şirket",
  "nav.careers.joinIntellica": "Intellica'ya Katıl",
  "nav.careers.joinIntellicaDesc": "İnovasyon yolculuğumuza katılın ve kariyerinizi inşa edin",
  "nav.careers.talentProgram": "Veri & Yapay Zeka Yetenek Programı",
  "nav.careers.talentProgramDesc": "Intellica'nın yeni yetenekler için uygulamalı geliştirme programı",

  "nav.about.aboutIntellica": "Intellica Hakkında",
  "nav.about.aboutIntellicaDesc": "Misyonumuz ve küresel ayak izimiz",

  "nav.mobile.careersLabel": "Kariyer",

  "products.ifdm.name": "IFDM",
  "products.ifdm.desc": "Finans sektörü veri modeli",
  "products.itdm.name": "ITDM",
  "products.itdm.desc": "Telekom sektörü veri modeli",
  "products.hrdm.name": "HRDM",
  "products.hrdm.desc": "İnsan kaynakları veri modeli",
  "products.icc.name": "ICC",
  "products.icc.desc": "Veri tutarlılığı ve kalite kontrolü",
  "products.retouch.name": "ReTouch",
  "products.retouch.desc": "Doğrulanmış veri girişi ve RDM",
  "products.retable.name": "Retable",
  "products.retable.desc": "Kodsuz uygulamalar ve veri tabloları",
  "products.orqenta.name": "Orqenta",
  "products.orqenta.desc": "İş akışı orkestrasyon ve otomasyonu",
  "products.talkto.name": "Talk To",
  "products.talkto.desc": "Doğal dil ile veri analisti",
  "products.blueoctopus.name": "Blue Octopus",
  "products.blueoctopus.desc": "Olay istihbaratı ve otomatik aksiyon",
  "products.var.name": "VAR",
  "products.var.desc": "Yapay zeka ses analizi ve tanıma",

  "footer.cta.title": "Verilerinizi Dönüştürmeye Hazır mısınız?",
  "footer.cta.desc": "Veri platformlarından yapay zeka çözümlerine kadar, organizasyonların veriyi ölçülebilir iş değerine dönüştürmesine yardımcı oluyoruz.",
  "footer.cta.getInTouch": "İletişime Geçin",
  "footer.cta.viewClients": "Müşterileri Gör",
  "footer.tagline": "Intellica, önde gelen organizasyonlar için kurumsal veri platformları, analitik ve yapay zeka çözümleri sunar.",
  "footer.col.products": "Ürünler",
  "footer.col.solutions": "Çözümler",
  "footer.col.company": "Şirket",
  "footer.link.coreProducts": "Temel Ürünler",
  "footer.link.aiProducts": "Yapay Zeka Ürünleri",
  "footer.link.dataModels": "Veri Modelleri",
  "footer.link.allProducts": "Tüm Ürünler",
  "footer.link.aiSolutions": "Yapay Zeka Çözümleri",
  "footer.link.dataPlatforms": "Veri Platformları",
  "footer.link.about": "Hakkımızda",
  "footer.link.joinIntellica": "Intellica'ya Katıl",
  "footer.link.talentProgram": "Veri & Yapay Zeka Yetenek Programı",
  "footer.link.contact": "İletişim",
  "footer.pia.prefix": "Bir",
  "footer.pia.suffix": "Şirketi",
  "footer.trust": "Bankacılık, Telekom, Kamu, Üretim ve Enerji sektörlerinde lider kurumsal iş ortağı.",
  "footer.rights": "Tüm hakları saklıdır.",
  "footer.legal.privacy": "Gizlilik",
  "footer.legal.terms": "Kullanım Şartları",
  "footer.legal.cookies": "Çerezler",

  "bottomNav.products": "Ürünler",
  "bottomNav.aiSolutions": "YZ Çözümleri",
  "bottomNav.dataPlatforms": "Veri Platformları",
  "bottomNav.clients": "Müşteriler",
  "bottomNav.more": "Daha Fazla",
  "bottomNav.sheet.products": "Ürünler",
  "bottomNav.sheet.navigation": "Navigasyon",
  "bottomNav.more.about": "Hakkımızda",
  "bottomNav.more.aboutUs": "Hakkımızda",
  "bottomNav.more.aboutUsDesc": "Misyonumuz ve küresel ayak izimiz",
  "bottomNav.more.careers": "Kariyer",
  "bottomNav.more.joinIntellica": "Intellica'ya Katıl",
  "bottomNav.more.joinIntellicaDesc": "İnovasyon yolculuğumuza katılın",
  "bottomNav.more.talentProgram": "Veri & YZ Yetenek Programı",
  "bottomNav.more.talentProgramDesc": "Intellica'nın geliştirme programı",
  "bottomNav.more.research": "Araştırma",
  "bottomNav.more.insights": "İçgörüler",
  "bottomNav.more.insightsDesc": "Perspektifler ve pazar trendleri",
  "bottomNav.more.getInTouch": "İletişime Geçin",
  "bottomNav.more.contactUs": "Bize Ulaşın",
  "bottomNav.more.contactUsDesc": "Bir sohbet başlatın",
  "bottomNav.more.home": "Ana Sayfa",
  "bottomNav.more.homeDesc": "Ana sayfaya dön",

  "cookie.text": "Site trafiğini analiz etmek ve deneyiminizi geliştirmek için çerezler kullanıyoruz.",
  "cookie.learnMore": "Daha fazla bilgi",
  "cookie.accept": "Kabul Et",
  "cookie.deny": "Reddet",

  "langBanner.suggest": "Bu sayfa {lang} dilinde de mevcuttur.",
  "langBanner.switch": "{lang} diline geç",

  "notFound.tagline": "Bu rota bizim",
  "notFound.taglineHighlight": "veri hattımızda",
  "notFound.desc": "Sayfa taşınmış, yeniden adlandırılmış veya hiç var olmamış olabilir. Sizi doğru yere yönlendirelim.",
  "notFound.backHome": "Ana Sayfaya Dön",
  "notFound.quickNav": "Hızlı Navigasyon",
  "notFound.link.products": "Ürünler",
  "notFound.link.productsDesc": "Veri ve yapay zeka ürün ekosistemimizi keşfedin",
  "notFound.link.solutions": "Yapay Zeka Çözümleri",
  "notFound.link.solutionsDesc": "Kurumsal yapay zeka ve analitik çözümleri",
  "notFound.link.about": "Hakkımızda",
  "notFound.link.aboutDesc": "Misyonumuz ve küresel ayak izimiz",
  "notFound.link.contact": "İletişim",
  "notFound.link.contactDesc": "Ekibimizle iletişime geçin"
}
```

- [ ] **Step 3: Verify i18n infrastructure builds**

Run: `npx astro build 2>&1 | tail -3`

Expected: Build succeeds. The i18n files exist but are not yet imported by any page.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add EN and TR translation files with nav, footer, cookie, and 404 strings"
```

### Task 5: Add i18n routing to astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Update astro config with i18n routing and sitemap i18n**

```javascript
// astro.config.mjs
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
```

- [ ] **Step 2: Build and verify**

Run: `npx astro build 2>&1 | tail -5`

Expected: Build succeeds. Sitemap now generates with i18n config.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(i18n): add Astro i18n routing config and sitemap i18n support"
```

---

## Phase 2: Layout & Shared Components

### Task 6: Update Layout.astro for multi-language

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Read the current Layout.astro**

Read `src/layouts/Layout.astro` in full before making changes.

- [ ] **Step 2: Update Layout.astro**

Add these changes to Layout.astro:
1. Add `lang` prop to Props interface (defaults to `defaultLang`)
2. Import i18n config and `astro:i18n` helpers
3. Change `<html lang="en">` to `<html lang={currentLocale} dir={dir}>`
4. Add dynamic hreflang tags for all locales + x-default
5. Update canonical URL to use `Astro.url.href` (already locale-aware)
6. Update OG locale to be dynamic
7. Add OG locale alternates
8. Update JSON-LD organization schema `inLanguage` field
9. Pass `lang` prop through to Header, Footer, BottomNav, CookieConsent

Key changes to the frontmatter:

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import BottomNav from '../components/BottomNav.astro';
import CookieConsent from '../components/CookieConsent.astro';
import EasterEggTerminal from '../components/gamification/EasterEggTerminal.astro';
import { languages, defaultLang, type Lang } from '../i18n/config';
import { getAbsoluteLocaleUrl } from 'astro:i18n';

export interface Props {
  title: string;
  description?: string;
  pageType?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  hideCta?: boolean;
  lang?: Lang;
}

const { 
  title, 
  description = "Intellica — Empowering enterprises to generate sustainable value from data through modern data platforms, analytics solutions, and production-grade AI systems, trusted since 2006.",
  pageType = "website",
  breadcrumbs = [],
  hideCta = false,
  lang = defaultLang,
} = Astro.props;

const currentLocale = lang;
const { dir } = languages[currentLocale];
const siteUrl = "https://intellica.net";
const canonicalUrl = new URL(Astro.url.pathname, siteUrl).href;
const ogImage = `${siteUrl}/assets/img/intellica-og.png`;

// Strip locale prefix to get the base path for hreflang generation
const localePattern = new RegExp(`^/(${Object.keys(languages).join('|')})/`);
const basePath = Astro.url.pathname.replace(localePattern, '/').replace(/^\//, '');
```

Key changes to the `<head>`:

```html
<html lang={currentLocale} dir={dir}>
<head>
  <!-- ... existing meta tags ... -->

  <!-- hreflang for all locales -->
  {Object.keys(languages).map((l) => (
    <link rel="alternate" hreflang={l} href={getAbsoluteLocaleUrl(l, basePath)} />
  ))}
  <link rel="alternate" hreflang="x-default" href={getAbsoluteLocaleUrl(defaultLang, basePath)} />

  <!-- OG locale (dynamic) -->
  <meta property="og:locale" content={languages[currentLocale].locale.replace('-', '_')} />
  {Object.entries(languages)
    .filter(([code]) => code !== currentLocale)
    .map(([, { locale }]) => (
      <meta property="og:locale:alternate" content={locale.replace('-', '_')} />
  ))}
```

Key changes to the `<body>`:

```html
<Header lang={lang} />
<main role="main">
  <slot />
</main>
<BottomNav lang={lang} />
<Footer hideCta={hideCta} lang={lang} />
<CookieConsent gaId="G-TJXJTG53PX" lang={lang} />
```

- [ ] **Step 3: Build and verify**

Run: `npx astro build 2>&1 | tail -5`

Expected: May show warnings about Header/Footer/BottomNav/CookieConsent not accepting `lang` prop yet. That's OK — those components are updated in the next tasks.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(i18n): update Layout with dynamic lang, dir, hreflang, and OG locale"
```

### Task 7: Create LanguagePicker component

**Files:**
- Create: `src/components/LanguagePicker.astro`

- [ ] **Step 1: Create the LanguagePicker component**

Read `src/i18n/config.ts` to understand the language definitions.

```astro
---
// src/components/LanguagePicker.astro
import { languages, defaultLang, type Lang } from '../i18n/config';

interface Props {
  lang: Lang;
}

const { lang: currentLang } = Astro.props;

// Get the base path (without locale prefix) for cross-language linking
const localePattern = new RegExp(`^/(${Object.keys(languages).join('|')})/`);
const currentPath = Astro.url.pathname.replace(localePattern, '/');
---

<div class="lang-picker">
  {Object.entries(languages).map(([code, { name }]) => {
    const href = code === defaultLang ? currentPath : `/${code}${currentPath}`;
    const isActive = code === currentLang;
    return (
      <a
        href={href}
        class:list={['lang-option', { active: isActive }]}
        hreflang={code}
        aria-current={isActive ? 'true' : undefined}
        aria-label={`Switch to ${name}`}
      >
        {code.toUpperCase()}
      </a>
    );
  })}
</div>

<style>
  .lang-picker {
    display: flex;
    align-items: center;
    gap: 2px;
    background: #F1F5F9;
    border-radius: 8px;
    padding: 2px;
  }

  .lang-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #64748B;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .lang-option:hover {
    color: #1E293B;
    background: rgba(0, 0, 0, 0.04);
  }

  .lang-option.active {
    background: #FFFFFF;
    color: #1E293B;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LanguagePicker.astro
git commit -m "feat(i18n): add LanguagePicker component with compact toggle style"
```

### Task 8: Update Header.astro with i18n

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Read the current Header.astro**

Read `src/components/Header.astro` in full.

- [ ] **Step 2: Update Header.astro**

Changes needed:
1. Add `lang` prop (with `Lang` type, default `defaultLang`)
2. Import `useTranslations`, `useTranslatedPath` from i18n utils
3. Import `LanguagePicker` component
4. Replace all hardcoded strings with `t()` calls
5. Replace all hardcoded hrefs with `tp()` calls (translated paths)
6. Add `<LanguagePicker>` to desktop nav (after Contact link, before closing `</nav>`)
7. Add `<LanguagePicker>` to mobile menu (at the top or bottom)
8. Update the logo link from `href="/"` to `href={tp('/')}`

The frontmatter becomes:

```astro
---
import { defaultLang, type Lang } from '../i18n/config';
import { useTranslations, useTranslatedPath } from '../i18n/utils';
import LanguagePicker from './LanguagePicker.astro';

interface Props { lang?: Lang; }
const { lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);

const products = [
  {
    category: t('nav.products.dataModels'),
    items: [
      { name: t('products.ifdm.name'), desc: t('products.ifdm.desc'), href: tp('/products/ifdm') },
      { name: t('products.itdm.name'), desc: t('products.itdm.desc'), href: tp('/products/itdm') },
      { name: t('products.hrdm.name'), desc: t('products.hrdm.desc'), href: tp('/products/hrdm') },
    ]
  },
  {
    category: t('nav.products.platformGovernance'),
    items: [
      { name: t('products.icc.name'), desc: t('products.icc.desc'), href: tp('/products/icc') },
      { name: t('products.retouch.name'), desc: t('products.retouch.desc'), href: tp('/products/retouch') },
      { name: t('products.retable.name'), desc: t('products.retable.desc'), href: tp('/products/retable') },
      { name: t('products.orqenta.name'), desc: t('products.orqenta.desc'), href: tp('/products/orqenta'), target: '_blank' },
    ]
  },
  {
    category: t('nav.products.aiProducts'),
    items: [
      { name: t('products.talkto.name'), desc: t('products.talkto.desc'), href: tp('/products/talk-to-your-data') },
      { name: t('products.blueoctopus.name'), desc: t('products.blueoctopus.desc'), href: tp('/products/blue-octopus') },
      { name: t('products.var.name'), desc: t('products.var.desc'), href: tp('/products/var') },
    ]
  }
];

const careersMenu = [
  {
    category: t('nav.careers.joinUs'),
    items: [
      { name: t('nav.careers.joinIntellica'), desc: t('nav.careers.joinIntellicaDesc'), href: tp('/careers') },
      { name: t('nav.careers.talentProgram'), desc: t('nav.careers.talentProgramDesc'), href: tp('/academy') },
    ]
  }
];
---
```

In the template, replace hardcoded text/links. Example changes:

- `<a href="/" ...>` → `<a href={tp('/')} ...>`
- `Products` (button text) → `{t('nav.products')}`
- `<a href="/solutions" class="nav-link">AI Solutions</a>` → `<a href={tp('/solutions')} class="nav-link">{t('nav.aiSolutions')}</a>`
- `Explore Enterprise Product Portfolio →` → `{t('nav.products.exploreAll')}`
- Add `<LanguagePicker lang={lang} />` after the last nav link in desktop nav
- Add `<LanguagePicker lang={lang} />` inside mobile menu
- All mobile links: `<a href="/products"` → `<a href={tp('/products')}`

- [ ] **Step 3: Build and verify**

Run: `npx astro build 2>&1 | tail -5`

Expected: Build succeeds. The EN output should be identical to before (same strings, same URLs).

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(i18n): update Header with translated nav labels, links, and LanguagePicker"
```

### Task 9: Update Footer.astro with i18n

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Read the current Footer.astro in full, then update**

Add `lang` prop, import i18n utils, replace all hardcoded strings and links.

Frontmatter changes:

```astro
---
import { version } from '../../package.json';
import { defaultLang, type Lang } from '../i18n/config';
import { useTranslations, useTranslatedPath } from '../i18n/utils';

interface Props {
  hideCta?: boolean;
  lang?: Lang;
}
const { hideCta = false, lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
---
```

Replace in template:
- `"Ready to Transform Your Data?"` → `{t('footer.cta.title')}`
- `href="/contact"` → `href={tp('/contact')}`
- `"Products"` (column title) → `{t('footer.col.products')}`
- All footer links with `tp()` paths
- `"All rights reserved."` → `{t('footer.rights')}`
- `"A"` ... `"Company"` (PiA band) → `{t('footer.pia.prefix')}` ... `{t('footer.pia.suffix')}`
- Legal links: `href="/privacy"` → `href={tp('/privacy')}`

- [ ] **Step 2: Build and verify**

Run: `npx astro build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(i18n): update Footer with translated strings and locale-aware links"
```

### Task 10: Update BottomNav.astro with i18n

**Files:**
- Modify: `src/components/BottomNav.astro`

- [ ] **Step 1: Read the current BottomNav.astro in full, then update**

Add `lang` prop, import i18n utils, replace all hardcoded strings and links. This is the most complex component — it has nav items, product groups, and more groups, all with hardcoded text.

Frontmatter changes:

```astro
---
import { defaultLang, type Lang } from '../i18n/config';
import { useTranslations, useTranslatedPath } from '../i18n/utils';

interface Props { lang?: Lang; }
const { lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
```

Replace `navItems` labels, `productGroups` names/descs, `moreGroups` names/descs, all `href` values with `tp()`.

Also update the client-side `<script>` for active page detection. The `pageMap` needs to handle locale-prefixed paths. Change:

```typescript
const path = window.location.pathname;
// Strip locale prefix for page matching
const localeMatch = path.match(/^\/(en|tr)\//);
const cleanPath = localeMatch ? path.replace(localeMatch[0], '/') : path;
const pageMap: Record<string, string> = {
  '/': 'home',
  '/products': 'products',
  '/solutions': 'solutions',
  // ... same map
};
const activePage = pageMap[cleanPath] ?? '';
```

- [ ] **Step 2: Build and verify**

Run: `npx astro build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/components/BottomNav.astro
git commit -m "feat(i18n): update BottomNav with translated labels and locale-aware routing"
```

### Task 11: Update CookieConsent.astro with i18n

**Files:**
- Modify: `src/components/CookieConsent.astro`

- [ ] **Step 1: Read current CookieConsent.astro, then update**

Add `lang` prop, import i18n utils, replace hardcoded banner text.

```astro
---
import { defaultLang, type Lang } from '../i18n/config';
import { useTranslations, useTranslatedPath } from '../i18n/utils';

export interface Props {
  gaId?: string;
  lang?: Lang;
}

const { gaId = 'G-TJXJTG53PX', lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
---
```

Replace:
- `"We use cookies..."` → `{t('cookie.text')}`
- `"Learn more"` → `{t('cookie.learnMore')}`
- `href="/cookies"` → `href={tp('/cookies')}`
- `"Decline"` → `{t('cookie.deny')}`
- `"Accept"` → `{t('cookie.accept')}`

- [ ] **Step 2: Build and verify**

Run: `npx astro build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/components/CookieConsent.astro
git commit -m "feat(i18n): update CookieConsent with translated banner text"
```

---

## Phase 3: Page Migration

**Strategy:** For each page, we:
1. Add page-specific strings to `en.json` and `tr.json`
2. Move the page content to `src/page-templates/XxxPage.astro`
3. Simplify the original `src/pages/xxx.astro` to a thin wrapper
4. Create `src/pages/[lang]/xxx.astro` as a dynamic wrapper

**IMPORTANT:** Phase 3 is the largest phase. Each page migration task involves reading the full current page, extracting strings, creating the page-template, and creating the [lang] wrapper. The implementor should:
- Read the **full** source of each page before starting
- Extract **every** user-facing string (titles, descriptions, section headings, body paragraphs, button labels, stat labels, image alts)
- Keep `<style>` blocks in the page-template (not in the wrapper)
- Keep page-specific `<script>` blocks in the page-template
- Keep structured data (JSON-LD) in the page-template, translated via `t()`

### Task 12: Migrate homepage (index.astro)

This is the largest page (~500 lines). It has hero, capabilities, metrics, product grid, CTA sections.

**Files:**
- Modify: `src/i18n/locales/en.json` (add `home.*` keys)
- Modify: `src/i18n/locales/tr.json` (add `home.*` keys)
- Create: `src/page-templates/HomePage.astro`
- Modify: `src/pages/index.astro` (simplify to wrapper)
- Create: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Read the full index.astro and extract all strings**

Read `src/pages/index.astro` in full. Identify every user-facing string. Add them to both JSON files with `home.*` prefix.

- [ ] **Step 2: Add home page strings to en.json and tr.json**

Add all `home.*` keys. Examples:

```json
"meta.home.title": "Intellica | Unleashing Value From Data",
"meta.home.description": "Intellica empowers enterprises to generate sustainable value from data...",
"home.hero.label": "Data & AI · Trusted Since 2006",
"home.hero.title1": "Unleashing",
"home.hero.title2": "Value From Data",
"home.hero.desc": "We design and deliver enterprise data platforms...",
"home.hero.cta": "Get in Touch",
"home.hero.link.solutions": "Explore AI Solutions",
"home.hero.link.products": "Explore Products",
"home.proof.text": "We help organizations move from fragmented data...",
"home.capabilities.label": "Capabilities",
"home.capabilities.title1": "Enterprise Data & ",
"home.capabilities.title2": "AI Capabilities"
```

Continue for all sections on the page. The implementor must read the full page to capture every string.

- [ ] **Step 3: Create page-template**

Create `src/page-templates/HomePage.astro`. This file:
- Accepts `lang: Lang` prop
- Imports and uses `useTranslations(lang)` and `useTranslatedPath(lang)`
- Contains the full page HTML, styles, and scripts from index.astro
- Replaces all hardcoded strings with `t()` calls
- Replaces all hrefs with `tp()` calls
- Keeps the Layout wrapper: `<Layout title={t('meta.home.title')} ... lang={lang}>`

- [ ] **Step 4: Simplify index.astro to wrapper**

```astro
---
// src/pages/index.astro
import HomePage from '../page-templates/HomePage.astro';
---
<HomePage lang="en" />
```

- [ ] **Step 5: Create [lang] wrapper**

```astro
---
// src/pages/[lang]/index.astro
import HomePage from '../../page-templates/HomePage.astro';
import { getI18nPaths } from '../../i18n/config';
import type { Lang } from '../../i18n/config';

export const getStaticPaths = getI18nPaths;
const { lang } = Astro.params as { lang: Lang };
---
<HomePage lang={lang} />
```

- [ ] **Step 6: Build and verify**

Run: `npx astro build 2>&1 | grep -E "(index|tr/index|error|Error)" | head -10`

Expected: Both `/index.html` and `/tr/index.html` are generated. No errors.

Verify EN output unchanged: `diff <(curl -s http://localhost:4321/) <(cat dist/index.html)` or visually in browser via `npx astro preview`.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/locales/ src/page-templates/HomePage.astro src/pages/index.astro src/pages/\[lang\]/index.astro
git commit -m "feat(i18n): migrate homepage to multi-language with EN + TR support"
```

### Task 13: Migrate about page

Same pattern as Task 12. Read `src/pages/about.astro` fully, extract strings, create template, create wrappers.

**Files:**
- Modify: `src/i18n/locales/en.json` (add `about.*` keys)
- Modify: `src/i18n/locales/tr.json` (add `about.*` keys)
- Create: `src/page-templates/AboutPage.astro`
- Modify: `src/pages/about.astro` → wrapper
- Create: `src/pages/[lang]/about.astro`

Follow the exact same pattern as Task 12. Build and commit.

### Task 14: Migrate products listing page

**Files:**
- Modify: `src/i18n/locales/en.json` (add `productsPage.*` keys)
- Modify: `src/i18n/locales/tr.json`
- Create: `src/page-templates/ProductsPage.astro`
- Modify: `src/pages/products.astro` → wrapper
- Create: `src/pages/[lang]/products.astro`

### Task 15: Migrate product detail pages

This is special — product details use `getStaticPaths()` with a hardcoded products array. The page-template needs to handle both the slug resolution AND translations.

**Files:**
- Modify: `src/i18n/locales/en.json` (product detail strings are already partially there from nav)
- Modify: `src/i18n/locales/tr.json`
- Create: `src/page-templates/ProductDetailPage.astro`
- Modify: `src/pages/products/[slug].astro` → wrapper with getStaticPaths
- Create: `src/pages/[lang]/products/[slug].astro` → wrapper with combined getStaticPaths
- Delete: Individual product files (`src/pages/products/blue-octopus.astro`, etc.)

**Critical detail:** The `[lang]/products/[slug].astro` needs `getStaticPaths` that returns the cartesian product of languages × slugs:

```astro
---
// src/pages/[lang]/products/[slug].astro
import ProductDetailPage from '../../../page-templates/ProductDetailPage.astro';
import { languages, defaultLang, type Lang } from '../../../i18n/config';

export function getStaticPaths() {
  const slugs = ['ifdm', 'itdm', 'hrdm', 'icc', 'retouch', 'retable', 'orqenta', 'talk-to-your-data', 'blue-octopus', 'var', 'procurement-price-prediction'];
  const langs = Object.keys(languages).filter(l => l !== defaultLang);
  
  return langs.flatMap(lang =>
    slugs.map(slug => ({ params: { lang, slug } }))
  );
}

const { lang, slug } = Astro.params as { lang: Lang; slug: string };
---
<ProductDetailPage lang={lang} slug={slug} />
```

The EN version at `src/pages/products/[slug].astro`:

```astro
---
import ProductDetailPage from '../../page-templates/ProductDetailPage.astro';

export function getStaticPaths() {
  const slugs = ['ifdm', 'itdm', 'hrdm', 'icc', 'retouch', 'retable', 'orqenta', 'talk-to-your-data', 'blue-octopus', 'var', 'procurement-price-prediction'];
  return slugs.map(slug => ({ params: { slug } }));
}

const { slug } = Astro.params as { slug: string };
---
<ProductDetailPage lang="en" slug={slug} />
```

After these wrappers are working, delete the individual product files (blue-octopus.astro, var.astro, etc.) since they're now handled by [slug].astro.

### Task 16: Migrate solutions page

Same pattern. **Files:** `SolutionsPage.astro`, wrappers, translation keys.

### Task 17: Migrate contact page

Same pattern. **Files:** `ContactPage.astro`, wrappers, translation keys.

### Task 18: Migrate careers page

Same pattern. **Files:** `CareersPage.astro`, wrappers, translation keys.

### Task 19: Migrate clients page

Same pattern. **Files:** `ClientsPage.astro`, wrappers, translation keys.

### Task 20: Migrate academy page

Same pattern. **Files:** `AcademyPage.astro`, wrappers, translation keys.

### Task 21: Migrate remaining pages (batch)

Migrate these pages together as they're lower traffic:

- `data-platforms.astro` → `DataPlatformsPage.astro`
- `partners.astro` → `PartnersPage.astro`
- `insights.astro` → `InsightsPage.astro`
- `insights/[slug].astro` → `InsightDetailPage.astro` (similar to product detail — getStaticPaths with slugs × langs)
- `privacy.astro` → `PrivacyPage.astro`
- `terms.astro` → `TermsPage.astro`
- `cookies.astro` → `CookiesPage.astro`
- `404.astro` → `NotFoundPage.astro`

For each: extract strings, create page-template, simplify to wrapper, create [lang] wrapper.

Build and verify after each page or batch of 2-3 pages. Commit after each batch.

---

## Phase 4: Browser Detection & Extras

### Task 22: Create LanguageBanner component

**Files:**
- Create: `src/components/LanguageBanner.astro`
- Modify: `src/layouts/Layout.astro` (add LanguageBanner)

- [ ] **Step 1: Create LanguageBanner.astro**

```astro
---
// src/components/LanguageBanner.astro
import { languages, defaultLang, type Lang } from '../i18n/config';

interface Props { lang: Lang; }
const { lang: currentLang } = Astro.props;

// Build the language name map for client-side JS
const langNames = JSON.stringify(
  Object.fromEntries(Object.entries(languages).map(([code, { name }]) => [code, name]))
);
const supportedLangs = JSON.stringify(Object.keys(languages));

// Get base path for redirect URL construction
const localePattern = new RegExp(`^/(${Object.keys(languages).join('|')})/`);
const basePath = Astro.url.pathname.replace(localePattern, '/');
---

<div id="lang-banner" class="lang-banner" hidden>
  <div class="lang-banner__inner">
    <p id="lang-banner-text" class="lang-banner__text"></p>
    <div class="lang-banner__actions">
      <a id="lang-banner-link" class="lang-banner__btn"></a>
      <button id="lang-banner-dismiss" class="lang-banner__close" aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</div>

<script is:inline define:vars={{ currentLang, defaultLang, langNames, supportedLangs, basePath }}>
(function() {
  var STORAGE_KEY = 'lang-banner-dismissed';
  if (localStorage.getItem(STORAGE_KEY)) return;
  
  // Wait for cookie consent to be handled first
  var consent = localStorage.getItem('ga_consent');
  var delay = consent === null ? 4000 : 1500;
  
  setTimeout(function() {
    var browserLang = navigator.language.slice(0, 2);
    var supported = JSON.parse(supportedLangs);
    var names = JSON.parse(langNames);
    
    if (!supported.includes(browserLang) || browserLang === currentLang) return;
    
    var banner = document.getElementById('lang-banner');
    var text = document.getElementById('lang-banner-text');
    var link = document.getElementById('lang-banner-link');
    if (!banner || !text || !link) return;
    
    var targetName = names[browserLang];
    text.textContent = 'This page is also available in ' + targetName + '.';
    link.textContent = 'Switch to ' + targetName;
    link.href = browserLang === defaultLang ? basePath : '/' + browserLang + basePath;
    
    banner.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        banner.classList.add('visible');
      });
    });
  }, delay);
  
  document.getElementById('lang-banner-dismiss')?.addEventListener('click', function() {
    localStorage.setItem(STORAGE_KEY, 'true');
    var banner = document.getElementById('lang-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function() { banner.hidden = true; }, 400);
    }
  });
})();
</script>

<style>
  .lang-banner {
    position: fixed;
    top: calc(var(--header-h) + 12px);
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
    max-width: 480px;
    width: calc(100% - 32px);
  }
  .lang-banner.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
  .lang-banner__inner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(11, 18, 32, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0, 200, 150, 0.2);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
  .lang-banner__text {
    flex: 1;
    font-size: 0.85rem;
    color: rgba(240, 244, 255, 0.85);
    margin: 0;
    line-height: 1.4;
  }
  .lang-banner__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .lang-banner__btn {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    background: var(--grad-brand);
    color: #fff;
    text-decoration: none;
    white-space: nowrap;
  }
  .lang-banner__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.07);
    border: none;
    color: rgba(240, 244, 255, 0.5);
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .lang-banner { top: calc(var(--header-h) + 8px); }
    .lang-banner__inner { flex-wrap: wrap; }
  }
</style>
```

- [ ] **Step 2: Add LanguageBanner to Layout.astro**

In `src/layouts/Layout.astro`, import and add the component after `<Header>`:

```astro
import LanguageBanner from '../components/LanguageBanner.astro';
```

```html
<Header lang={lang} />
<LanguageBanner lang={lang} />
<main role="main">
```

- [ ] **Step 3: Build and verify**

- [ ] **Step 4: Commit**

```bash
git add src/components/LanguageBanner.astro src/layouts/Layout.astro
git commit -m "feat(i18n): add LanguageBanner for browser language suggestion"
```

### Task 23: Add TR redirect map and llms.txt

**Files:**
- Modify: `astro.config.mjs` (add TR redirects)
- Create: `public/llms.txt`
- Create: `public/tr/llms.txt`

- [ ] **Step 1: Add TR redirects to astro.config.mjs**

Add these to the existing `redirects` object:

```javascript
'/tr/about-us': '/tr/about',
'/tr/our-products': '/tr/products',
'/tr/our-services': '/tr/solutions',
'/tr/career': '/tr/careers',
'/tr/business-benefits': '/tr/solutions',
'/tr/privacy-policy': '/tr/privacy',
'/tr/cookie-policy': '/tr/cookies',
```

- [ ] **Step 2: Create public/llms.txt**

```markdown
# Intellica — intellica.net

> Intellica is an enterprise Data & AI company providing data models,
> analytics platforms, and AI-powered products. Founded in 2006, trusted
> by leading organizations in 20+ countries.

## Languages

- English (default): https://intellica.net/
- Türkçe: https://intellica.net/tr/

## Key Pages

- Products: https://intellica.net/products
- AI Solutions: https://intellica.net/solutions
- Data Platforms: https://intellica.net/data-platforms
- About: https://intellica.net/about
- Careers: https://intellica.net/careers
- Contact: https://intellica.net/contact

## Products

- IFDM (Financial Data Model): https://intellica.net/products/ifdm
- ITDM (Telecom Data Model): https://intellica.net/products/itdm
- HRDM (HR Data Model): https://intellica.net/products/hrdm
- ICC (Data Quality): https://intellica.net/products/icc
- ReTouch (Data Entry): https://intellica.net/products/retouch
- Retable (No-code): https://intellica.net/products/retable
- Orqenta (Orchestration): https://intellica.net/products/orqenta
- Talk To (NL Analytics): https://intellica.net/products/talk-to-your-data
- Blue Octopus (Event Intelligence): https://intellica.net/products/blue-octopus
- VAR (Voice Analytics): https://intellica.net/products/var
```

- [ ] **Step 3: Create public/tr/llms.txt**

Same structure in Turkish with `/tr/` prefixed URLs.

- [ ] **Step 4: Build and verify**

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs public/llms.txt public/tr/llms.txt
git commit -m "feat(i18n): add TR redirects for old URLs and llms.txt for AI crawlers"
```

---

## Phase 5: Verification & Cleanup

### Task 24: Full build verification and final checks

- [ ] **Step 1: Full build**

Run: `npx astro build 2>&1`

Expected: All pages build successfully. Check page count includes both EN and TR versions.

- [ ] **Step 2: Verify hreflang tags**

Run: `grep -c 'hreflang' dist/about/index.html`

Expected: At least 3 (en, tr, x-default).

Run: `grep 'hreflang' dist/about/index.html`

Expected: Shows correct URLs for EN and TR versions.

Run: `grep 'hreflang' dist/tr/about/index.html`

Expected: Same hreflang tags (bidirectional).

- [ ] **Step 3: Verify sitemap hreflang**

Run: `grep -A2 'about' dist/sitemap-0.xml | head -10`

Expected: `<xhtml:link rel="alternate" hreflang=` entries for both locales.

- [ ] **Step 4: Verify redirects**

Run: `cat dist/about-us/index.html | grep 'refresh'`

Expected: Meta refresh pointing to `/about`.

Run: `cat dist/tr/about-us/index.html | grep 'refresh'`

Expected: Meta refresh pointing to `/tr/about`.

- [ ] **Step 5: Verify language picker**

Run: `grep 'lang-picker' dist/index.html`

Expected: Language picker HTML present.

- [ ] **Step 6: Verify canonical URLs**

Run: `grep 'canonical' dist/about/index.html`

Expected: `<link rel="canonical" href="https://intellica.net/about">`

Run: `grep 'canonical' dist/tr/about/index.html`

Expected: `<link rel="canonical" href="https://intellica.net/tr/about">` (NOT pointing to EN version).

- [ ] **Step 7: Preview in browser**

Run: `npx astro preview`

Manually check:
- Homepage loads in EN at `/`
- TR homepage loads at `/tr/`
- Language picker switches between EN and TR
- Navigation links point to correct locale paths
- Footer links are translated and locale-aware
- 404 page works for both locales

- [ ] **Step 8: Commit any fixes**

```bash
git add -A
git commit -m "chore(i18n): verification fixes and cleanup"
```
