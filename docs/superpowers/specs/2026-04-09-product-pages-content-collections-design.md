# Product Pages — Content Collections Migration Design

**Date:** 2026-04-09  
**Status:** Approved  
**Scope:** Migrate 11 product pages from hardcoded Astro files to Astro Content Collections (YAML + shared components)

---

## Problem Statement

Turkish (tr) locale product pages are broken in two ways:

1. **404 errors** — Pages like `/tr/products/talk-to-your-data` don't exist because `getStaticPaths()` uses short slugs (`talkto`) while navigation links use full slugs (`talk-to-your-data`)
2. **Wrong content** — Pages that DO render (e.g., `/tr/products/icc`) show a generic 6-line template (`ProductDetailPage.astro`) instead of the rich 540-line English equivalent

### Root Cause

English product pages are standalone `.astro` files with hardcoded HTML (no `t()` translations). Turkish pages rely on a generic dynamic router + minimal template. The two experiences have a massive content gap.

### Why Other Pages Work

Non-product pages (About, Contact, Solutions...) use the `page-templates/` + `t()` pattern — a single template with `useTranslations(lang)`. This pattern works because those pages have short UI strings. Product pages have long-form content (paragraphs, use cases, industry scenarios) that don't fit the JSON key-value model.

---

## Solution: Astro Content Collections

Use Content Collections for product page content. Keep existing `t()` system for UI strings (nav, footer, layout labels). Two i18n strategies coexist with a clear boundary:

| Layer | Strategy | Example |
|-------|----------|---------|
| Global UI (nav, footer, buttons) | `t()` + JSON | `t('nav.products')` |
| Page structure (about, contact) | `t()` + page-templates | `t('about.hero.title')` |
| Product page content | **Content Collections + YAML** | `product.hero.description` |

### Why YAML over JSON/MDX

- Multi-line strings are natural (`>` folded, `|` literal)
- Readable by non-developers (translation teams)
- Structured data with schema validation (Zod)
- No MDX complexity needed — content fits rigid section structure

---

## Architecture

### File Structure

```
src/
  content/
    config.ts                          # Collection schema (Zod)
    products/
      en/
        icc.yaml                       # 11 English product files
        talk-to-your-data.yaml
        blue-octopus.yaml
        var.yaml
        orqenta.yaml
        retouch.yaml
        retable.yaml
        ifdm.yaml
        itdm.yaml
        hrdm.yaml
        procurement-price-prediction.yaml
      tr/
        icc.yaml                       # 11 Turkish product files
        ... (same 11 files)
  
  components/product/
    ProductHero.astro                  # Category label + title + description + CTA
    OverviewSection.astro              # Problem/Approach/Value + When Preferred checklist
    CapabilitiesGrid.astro             # 6 capability cards in grid-3
    FeatureShowcase.astro              # Dark section: text + screenshot/architecture image
    UseCaseTabs.astro                  # Tab wrapper + conditional tab bar
    UseCaseCard.astro                  # Individual card (badges, scenario, intervention, impact)
    JourneySection.astro               # 3 numbered steps + integration bullet list
    ProductCTA.astro                   # Shared CTA (uses t() — identical across all products)
  
  layouts/
    ProductLayout.astro                # Single template orchestrating all product sections

  pages/
    products/
      [slug].astro                     # EN route — reads from Content Collection
    [lang]/
      products/
        [slug].astro                   # TR route — reads from Content Collection
```

### Section Flow (Every Product Page)

```
ProductHero             — "What is this product?"         (required)
OverviewSection         — "What problem does it solve?"   (required)
CapabilitiesGrid        — "What can it do?"               (required)
FeatureShowcase         — "What does it look like?"       (optional)
customComponent slot    — "Try it!" (e.g., SQLPlayground) (optional)
UseCaseTabs             — "Who uses it and how?"          (optional)
JourneySection          — "How does it work?"             (optional)
ProductCTA              — "Take action"                   (required)
```

### Product Section Matrix

```
                Hero  Overview  Caps  Feature  UseCases  Journey  CTA
ICC              *      *        *      *       tabs       *       *
Talk To          *      *        *      *       tabs       *       *
Blue Octopus     *      *        *      *       tabs       *       *
VAR              *      *        *      *       tabs       *       *
Orqenta          *      *        *      *       tabs       *       *
ReTouch          *      *        *      *       tabs       *       *
IFDM             *      *        *      *       cards      *       *
ITDM             *      *        *      *       —          *       *
HRDM             *      *        *      *       —          *       *
Retable          *      *        *      *       cards      —       *
Procurement      *      *        *      —       —          —       *

* = present, — = absent
```

---

## Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const useCaseCardSchema = z.object({
  title: z.string(),
  badges: z.array(z.string()).default([]),
  scenario: z.string().optional(),
  interventionLabel: z.string(),
  interventionItems: z.array(z.string()),
  impactLabel: z.string().default('BUSINESS IMPACT'),
  impactItems: z.array(z.string()),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/products' }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'tr']),
    name: z.string(),
    pageTitle: z.string(),
    pageDescription: z.string(),

    hero: z.object({
      category: z.string(),
      titlePrefix: z.string(),
      titleHighlight: z.string(),
      description: z.string(),
    }),

    overview: z.object({
      problem: z.string(),
      approach: z.string(),
      businessValue: z.string(),
      whenPreferred: z.array(z.string()),
      preferredNote: z.string(),
    }),

    capabilities: z.object({
      label: z.string().default('Capabilities'),
      heading: z.string().default('Core'),
      headingHighlight: z.string().default('Capabilities'),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),

    featureSection: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string(),
      calloutTitle: z.string(),
      calloutDescription: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      imageCaption: z.string(),
    }).optional(),

    useCases: z.object({
      label: z.string().default('Solutions'),
      heading: z.string().default('Strategic'),
      headingHighlight: z.string().default('Use Cases'),
      subtitle: z.string().optional(),
      tabs: z.array(z.object({
        id: z.string(),
        label: z.string().nullable(),
        cards: z.array(useCaseCardSchema),
      })),
    }).optional(),

    journey: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string().optional(),
      steps: z.array(z.object({
        number: z.string(),
        title: z.string(),
        description: z.string(),
      })),
    }).optional(),

    integration: z.object({
      heading: z.string(),
      headingHighlight: z.string(),
      description: z.string(),
      items: z.array(z.string()),
    }).optional(),

    jsonLd: z.object({
      type: z.string().default('SoftwareApplication'),
      category: z.string(),
    }),

    customComponents: z.array(z.string()).default([]),
  }),
});

export const collections = { products };
```

---

## Routing

### English (default locale, no prefix)

```astro
// src/pages/products/[slug].astro
---
import ProductLayout from '../../layouts/ProductLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const products = await getCollection('products', (p) => p.data.lang === 'en');
  return products.map((p) => ({
    params: { slug: p.data.slug },
    props: { product: p.data },
  }));
}

const { product } = Astro.props;
---
<ProductLayout product={product} />
```

### Turkish (and future locales)

```astro
// src/pages/[lang]/products/[slug].astro
---
import ProductLayout from '../../../layouts/ProductLayout.astro';
import { getCollection } from 'astro:content';
import { languages, defaultLang, type Lang } from '../../../i18n/config';

export async function getStaticPaths() {
  const langs = Object.keys(languages).filter((l) => l !== defaultLang);
  const products = await getCollection('products', (p) => langs.includes(p.data.lang));
  return products.map((p) => ({
    params: { lang: p.data.lang, slug: p.data.slug },
    props: { product: p.data },
  }));
}

const { product } = Astro.props;
---
<ProductLayout product={product} />
```

### URL Mapping

| Product | English URL | Turkish URL |
|---------|------------|-------------|
| ICC | `/products/icc` | `/tr/products/icc` |
| Talk To | `/products/talk-to-your-data` | `/tr/products/talk-to-your-data` |
| Blue Octopus | `/products/blue-octopus` | `/tr/products/blue-octopus` |
| VAR | `/products/var` | `/tr/products/var` |
| Orqenta | `/products/orqenta` | `/tr/products/orqenta` |
| ReTouch | `/products/retouch` | `/tr/products/retouch` |
| Retable | `/products/retable` | `/tr/products/retable` |
| IFDM | `/products/ifdm` | `/tr/products/ifdm` |
| ITDM | `/products/itdm` | `/tr/products/itdm` |
| HRDM | `/products/hrdm` | `/tr/products/hrdm` |
| Procurement | `/products/procurement-price-prediction` | `/tr/products/procurement-price-prediction` |

---

## UseCaseTabs Normalization

Three existing variants unified into one component:

### Variant A: Tabbed (6 pages — ICC, Talk To, Blue Octopus, VAR, Orqenta, ReTouch)
- Multiple tabs with labels
- Cards rendered in grid-2 (2+ cards) or centered (1 card)

### Variant B: Simple cards (Retable)
- Modeled as single tab with `label: null` — tab bar not rendered

### Variant C: Value cards (IFDM)
- Same card structure with custom `interventionLabel` ("IFDM CONTRIBUTION") and `impactLabel` ("GAIN")
- Modeled as single tab with `label: null`

### Rendering Logic

```
if tabs[0].label === null → no tab bar, render cards directly
if tabs.length > 1 → render tab bar + tab content panels
if tab.cards.length === 1 → centered layout (max-width: 800px)
if tab.cards.length >= 2 → grid-2 layout
if card.badges.length > 0 → render badge row
```

---

## JSON Cleanup

### Keys to DELETE from en.json and tr.json

All `productsDetail.*` keys (~69 lines per file, ~138 total):
- `productsDetail.breadcrumbProducts`
- `productsDetail.overview`
- `productsDetail.keyFeatures`
- `productsDetail.ctaTitle`, `productsDetail.ctaDesc`, `productsDetail.ctaButton`
- `productsDetail.{product}.tagline` (×9 products)
- `productsDetail.{product}.category` (×9 products)
- `productsDetail.{product}.desc` (×9 products)
- `productsDetail.{product}.feature1/2/3` (×9 products)

### Keys to ADD (shared layout strings, ~10 per file)

```json
"productLayout.breadcrumb": "Products",
"productLayout.overview.title": "What does it",
"productLayout.overview.titleHighlight": "solve?",
"productLayout.overview.whenTitle": "When is it",
"productLayout.overview.whenTitleHighlight": "preferred?",
"productLayout.cta.heading": "Ready to Transform Your",
"productLayout.cta.headingHighlight": "Data?",
"productLayout.cta.desc": "From data platforms to AI solutions...",
"productLayout.cta.primary": "Get in Touch",
"productLayout.cta.secondary": "View Clients"
```

### Keys UNCHANGED

`products.*` keys (used in Header/BottomNav for menu items) remain untouched.

### Net effect on JSON files

| File | Before | After |
|------|--------|-------|
| en.json | 1240 lines | ~1180 lines (-60) |
| tr.json | 1240 lines | ~1180 lines (-60) |

---

## Files to DELETE

| File | Reason |
|------|--------|
| `src/pages/products/icc.astro` | Replaced by `content/products/en/icc.yaml` |
| `src/pages/products/talk-to-your-data.astro` | Replaced by YAML |
| `src/pages/products/blue-octopus.astro` | Replaced by YAML |
| `src/pages/products/var.astro` | Replaced by YAML |
| `src/pages/products/orqenta.astro` | Replaced by YAML |
| `src/pages/products/retouch.astro` | Replaced by YAML |
| `src/pages/products/retable.astro` | Replaced by YAML |
| `src/pages/products/ifdm.astro` | Replaced by YAML |
| `src/pages/products/itdm.astro` | Replaced by YAML |
| `src/pages/products/hrdm.astro` | Replaced by YAML |
| `src/pages/products/procurement-price-prediction.astro` | Replaced by YAML |
| `src/page-templates/ProductDetailPage.astro` | Replaced by `ProductLayout.astro` |

Total: 12 files deleted.

---

## Dependencies

- `@astrojs/mdx` — NOT needed (using YAML, not MDX)
- No new npm packages required — Astro 6.x Content Collections + glob loader are built-in
- `astro.config.mjs` — no changes needed for YAML content collections

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| CSS styles embedded in old `.astro` files lost | Extract all product-specific CSS into component `<style>` blocks during migration |
| SEO regression (JSON-LD, meta tags) | YAML includes `jsonLd`, `pageTitle`, `pageDescription` — ProductLayout generates same schema |
| Navigation link breakage | Slug values in YAML match existing navigation `href` values exactly |
| Talk To's SQLPlayground breaks | `customComponents` array handles special component slots |
| Build failure from schema mismatch | Zod validates all YAML at build time — errors caught before deploy |
