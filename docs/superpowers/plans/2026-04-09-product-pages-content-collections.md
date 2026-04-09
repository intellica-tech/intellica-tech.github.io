# Product Pages — Content Collections Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 11 hardcoded product pages to Astro Content Collections (YAML + shared components) to fix Turkish locale routing and enable full i18n support.

**Architecture:** Single ProductLayout template renders all product pages from YAML data files. 8 shared components handle each section type. Content Collections with glob loader reads YAML files per locale. Existing `t()` system untouched for UI strings.

**Tech Stack:** Astro 6.x Content Collections, Zod schema validation, YAML content files, glob loader (built-in — no new dependencies)

**Spec:** `docs/superpowers/specs/2026-04-09-product-pages-content-collections-design.md`

---

## File Structure

### New files to CREATE

```
src/content/config.ts                              — Collection schema (Zod)
src/content/products/en/icc.yaml                   — English ICC content
src/content/products/en/talk-to-your-data.yaml     — English Talk To content
src/content/products/en/blue-octopus.yaml          — English Blue Octopus content
src/content/products/en/var.yaml                   — English VAR content
src/content/products/en/orqenta.yaml               — English Orqenta content
src/content/products/en/retouch.yaml               — English ReTouch content
src/content/products/en/retable.yaml               — English Retable content
src/content/products/en/ifdm.yaml                  — English IFDM content
src/content/products/en/itdm.yaml                  — English ITDM content
src/content/products/en/hrdm.yaml                  — English HRDM content
src/content/products/en/procurement-price-prediction.yaml — English Procurement content
src/content/products/tr/icc.yaml                   — Turkish ICC content
src/content/products/tr/talk-to-your-data.yaml     — Turkish Talk To content
src/content/products/tr/blue-octopus.yaml          — Turkish Blue Octopus content
src/content/products/tr/var.yaml                   — Turkish VAR content
src/content/products/tr/orqenta.yaml               — Turkish Orqenta content
src/content/products/tr/retouch.yaml               — Turkish ReTouch content
src/content/products/tr/retable.yaml               — Turkish Retable content
src/content/products/tr/ifdm.yaml                  — Turkish IFDM content
src/content/products/tr/itdm.yaml                  — Turkish ITDM content
src/content/products/tr/hrdm.yaml                  — Turkish HRDM content
src/content/products/tr/procurement-price-prediction.yaml — Turkish Procurement content
src/components/product/ProductHero.astro            — Hero section component
src/components/product/OverviewSection.astro        — Overview section component
src/components/product/CapabilitiesGrid.astro       — Capabilities section component
src/components/product/FeatureShowcase.astro        — Feature/Architecture section component
src/components/product/UseCaseTabs.astro            — Use cases wrapper component
src/components/product/UseCaseCard.astro            — Individual use case card component
src/components/product/JourneySection.astro         — Journey + integration section component
src/components/product/ProductCTA.astro             — Shared CTA section component
src/layouts/ProductLayout.astro                     — Single product page template
```

### Files to MODIFY

```
src/pages/products/[slug].astro                    — Replace with Content Collection reader
src/pages/[lang]/products/[slug].astro             — Replace with Content Collection reader
src/i18n/locales/en.json                           — Remove productsDetail.*, add productLayout.*
src/i18n/locales/tr.json                           — Remove productsDetail.*, add productLayout.*
```

### Files to DELETE (after migration verified)

```
src/pages/products/icc.astro
src/pages/products/talk-to-your-data.astro
src/pages/products/blue-octopus.astro
src/pages/products/var.astro
src/pages/products/orqenta.astro
src/pages/products/retouch.astro
src/pages/products/retable.astro
src/pages/products/ifdm.astro
src/pages/products/itdm.astro
src/pages/products/hrdm.astro
src/pages/products/procurement-price-prediction.astro
src/page-templates/ProductDetailPage.astro
```

---

## Task 1: Content Collection Schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create content config with Zod schema**

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

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add Content Collection schema for product pages"
```

---

## Task 2: First YAML — ICC English (Pilot)

Build one complete English YAML to validate the schema works end-to-end before doing the rest.

**Files:**
- Create: `src/content/products/en/icc.yaml`

- [ ] **Step 1: Extract ICC content from `src/pages/products/icc.astro` into YAML**

Read `src/pages/products/icc.astro` and extract ALL text content into the YAML structure defined by the schema. Every heading, paragraph, list item, tab label, card content, image path, and caption must be captured.

The YAML must include:
- `slug: icc`
- `lang: en`
- `hero` with category "Data Platform & Governance", title parts, description
- `overview` with Problem/Approach/Business Value text, 5 whenPreferred items, preferredNote
- `capabilities` with label "Capabilities", heading "Core", 6 items (Auto-Reconciliation, Quality Gates, Drift Alerting, Audit Logging, Rule Engine, Health Dashboard)
- `featureSection` with heading "Configurable"/"Quality Rules", callout, image `/assets/images/icc_rule.png`
- `useCases` with 3 tabs (telecom/finance/insurance), each with 2 cards containing interventionLabel "ICC INTERVENTION", impactLabel "BUSINESS IMPACT"
- `journey` with heading "Operational"/"Model", 3 steps (Rule Definition, Automated Execution, Incident Resolution)
- `integration` with heading "Enterprise"/"Ready", 5 bullet items
- `jsonLd` with type "SoftwareApplication", category "BusinessApplication, DataGovernance"

- [ ] **Step 2: Run Astro build to validate schema**

```bash
npx astro build 2>&1 | head -50
```

Expected: Build succeeds or only fails on missing routes (not schema errors). If schema validation fails, fix the YAML.

- [ ] **Step 3: Commit**

```bash
git add src/content/products/en/icc.yaml
git commit -m "feat: add ICC English YAML content (pilot)"
```

---

## Task 3: Product Section Components

Build all 8 shared components. Each component receives typed props from YAML data and renders the corresponding HTML section using existing CSS classes from `global.css`.

**Files:**
- Create: `src/components/product/ProductHero.astro`
- Create: `src/components/product/OverviewSection.astro`
- Create: `src/components/product/CapabilitiesGrid.astro`
- Create: `src/components/product/FeatureShowcase.astro`
- Create: `src/components/product/UseCaseCard.astro`
- Create: `src/components/product/UseCaseTabs.astro`
- Create: `src/components/product/JourneySection.astro`
- Create: `src/components/product/ProductCTA.astro`

- [ ] **Step 1: Create ProductHero.astro**

Reference HTML from `src/pages/products/icc.astro` lines 29-38. Uses CSS classes: `page-hero`, `container`, `section-label`, `anim-fade-up`, `grad-text`, `btn btn-primary btn-pill btn-lg`, `hero-actions`.

Props: `hero` object (category, titlePrefix, titleHighlight, description) + `lang` + `contactHref` string.

The component renders:
```astro
---
import type { Lang } from '../../i18n/config';
import { useTranslations, useTranslatedPath } from '../../i18n/utils';

interface Props {
  hero: {
    category: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
  };
  lang: Lang;
}

const { hero, lang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
---
<section class="page-hero">
  <div class="container">
    <div class="section-label anim-fade-up">{hero.category}</div>
    <h1 class="anim-fade-up">{hero.titlePrefix} <span class="grad-text">{hero.titleHighlight}</span></h1>
    <p class="anim-fade-up">{hero.description}</p>
    <div class="hero-actions anim-fade-up" style="margin-top: 32px;">
      <a href={tp('/contact')} class="btn btn-primary btn-pill btn-lg">{t('productLayout.cta.primary')}</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create OverviewSection.astro**

Reference HTML from `src/pages/products/icc.astro` lines 41-72. Uses CSS classes: `section section--white`, `grid-2`, `card-light`, `anim-fade-up`, `grad-text`, `check-list`.

Props: `overview` object + `lang`.

```astro
---
import type { Lang } from '../../i18n/config';
import { useTranslations } from '../../i18n/utils';

interface Props {
  overview: {
    problem: string;
    approach: string;
    businessValue: string;
    whenPreferred: string[];
    preferredNote: string;
  };
  lang: Lang;
}

const { overview, lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="section section--white">
  <div class="container">
    <div class="grid-2" style="gap: 48px; align-items: start;">
      <div class="card-light anim-fade-up" style="padding: 40px; border-radius: 24px;">
        <h2 style="color: var(--clr-light-text); margin-bottom: 24px;">{t('productLayout.overview.title')} <span class="grad-text">{t('productLayout.overview.titleHighlight')}</span></h2>
        <div style="margin-bottom: 24px;">
          <p style="font-weight: 700; color: var(--clr-light-text); margin-bottom: 8px;">{t('productLayout.overview.problemLabel')}</p>
          <p style="color: var(--clr-light-muted);">{overview.problem}</p>
        </div>
        <div style="margin-bottom: 24px;">
          <p style="font-weight: 700; color: var(--clr-light-text); margin-bottom: 8px;">{t('productLayout.overview.approachLabel')}</p>
          <p style="color: var(--clr-light-muted);">{overview.approach}</p>
        </div>
        <div>
          <p style="font-weight: 700; color: var(--clr-light-text); margin-bottom: 8px;">{t('productLayout.overview.valueLabel')}</p>
          <p style="color: var(--clr-light-muted);">{overview.businessValue}</p>
        </div>
      </div>

      <div class="card-light anim-fade-up" style="padding: 40px; border-radius: 24px; background: #f8fafc;">
        <h3 style="color: var(--clr-light-text); margin-bottom: 24px;">{t('productLayout.overview.whenTitle')} <span class="grad-text">{t('productLayout.overview.whenTitleHighlight')}</span></h3>
        <ul class="check-list">
          {overview.whenPreferred.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
        <p style="font-size: 0.85rem; color: var(--clr-light-muted); margin-top: 24px; font-style: italic;">{overview.preferredNote}</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create CapabilitiesGrid.astro**

Reference HTML from `src/pages/products/icc.astro` lines 77-115. Uses CSS classes: `section section--light`, `section-label`, `section-title`, `grid-3`, `cap-card-modern`, `cap-icon-box`.

Props: `capabilities` object.

```astro
---
interface Props {
  capabilities: {
    label: string;
    heading: string;
    headingHighlight: string;
    items: { title: string; description: string }[];
  };
}

const { capabilities } = Astro.props;
---
<section class="section section--light">
  <div class="container">
    <div class="text-center anim-fade-up" style="margin-bottom: 48px;">
      <div class="section-label" style="margin-inline: auto;">{capabilities.label}</div>
      <h2 class="section-title" style="color: var(--clr-light-text);">{capabilities.heading} <span class="grad-text">{capabilities.headingHighlight}</span></h2>
    </div>

    <div class="grid-3 anim-fade-up" style="gap: 24px;">
      {capabilities.items.map((cap) => (
        <div class="cap-card-modern">
          <div class="cap-icon-box"><img src="/assets/img/intellica_camlogo_icibos.png" alt="" loading="lazy" /></div>
          <h3>{cap.title}</h3>
          <p>{cap.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create FeatureShowcase.astro**

Reference HTML from `src/pages/products/icc.astro` lines 119-142. Uses CSS classes: `section section--dark noise`, `product-grid`, `anim-fade-up`, `grad-text`, `cap-card-modern`, `img-frame`, `product-screenshot`.

Props: `featureSection` object.

```astro
---
interface Props {
  featureSection: {
    heading: string;
    headingHighlight: string;
    description: string;
    calloutTitle: string;
    calloutDescription: string;
    image: string;
    imageAlt: string;
    imageCaption: string;
  };
}

const { featureSection } = Astro.props;
---
<section class="section section--dark noise">
  <div class="container">
    <div class="product-grid anim-fade-up">
      <div class="anim-fade-up">
        <h2 style="color: #fff; margin-bottom: 24px;">{featureSection.heading} <span class="grad-text">{featureSection.headingHighlight}</span></h2>
        <p style="color: rgba(255,255,255,0.7); margin-bottom: 32px; font-size: 1.1rem; line-height: 1.7;">
          {featureSection.description}
        </p>
        <div class="cap-card-modern" style="padding: 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          <p style="font-weight: 700; color: #fff; margin-bottom: 8px;">{featureSection.calloutTitle}</p>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem;">{featureSection.calloutDescription}</p>
        </div>
      </div>
      <div class="anim-fade-up">
        <div class="img-frame">
          <img src={featureSection.image} alt={featureSection.imageAlt} class="product-screenshot" loading="lazy" />
        </div>
        <p style="text-align: center; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 16px; font-style: italic;">
          {featureSection.imageCaption}
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Create UseCaseCard.astro**

Reference HTML from `src/pages/products/icc.astro` lines 163-202 (tab card content). Uses CSS classes: `use-case-card-alt`, `scenario`, `uc-section`, `uc-label`, `uc-label--impact`, `uc-list`.

Props: single card object.

```astro
---
interface Props {
  card: {
    title: string;
    badges: string[];
    scenario?: string;
    interventionLabel: string;
    interventionItems: string[];
    impactLabel: string;
    impactItems: string[];
  };
}

const { card } = Astro.props;
---
<div class="use-case-card-alt">
  {card.badges.length > 0 && (
    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
      {card.badges.map((badge, i) => (
        <span style={`font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; ${i === 0 ? 'background: rgba(0, 200, 150, 0.1); color: var(--clr-primary);' : 'background: #f1f5f9; color: #64748b;'}`}>
          {badge}
        </span>
      ))}
    </div>
  )}
  <h4>{card.title}</h4>
  {card.scenario && <p class="scenario">{card.scenario}</p>}
  <div class="uc-section">
    <p class="uc-label">{card.interventionLabel}</p>
    <ul class="uc-list">
      {card.interventionItems.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  </div>
  <div class="uc-section">
    <p class="uc-label uc-label--impact">{card.impactLabel}</p>
    <ul class="uc-list">
      {card.impactItems.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  </div>
</div>
```

- [ ] **Step 6: Create UseCaseTabs.astro**

Wrapper component with conditional tab bar rendering. Reference HTML from `src/pages/products/icc.astro` lines 145-297. Uses CSS classes: `section section--light`, `section-label`, `section-title`, `section-sub`, `tabs-container`, `tabs-nav`, `tab-btn`, `tab-content`, `grid-2`.

Props: `useCases` object.

Rendering logic:
- If first tab has `label: null` → no tab bar, render cards directly
- If multiple tabs → render tab bar + content panels
- If a tab has 1 card → centered (max-width: 800px)
- If a tab has 2+ cards → grid-2

```astro
---
import UseCaseCard from './UseCaseCard.astro';

interface Props {
  useCases: {
    label: string;
    heading: string;
    headingHighlight: string;
    subtitle?: string;
    tabs: {
      id: string;
      label: string | null;
      cards: {
        title: string;
        badges: string[];
        scenario?: string;
        interventionLabel: string;
        interventionItems: string[];
        impactLabel: string;
        impactItems: string[];
      }[];
    }[];
  };
}

const { useCases } = Astro.props;
const hasTabs = useCases.tabs.length > 1 || useCases.tabs[0]?.label !== null;
---
<section class="section section--light" id="use-cases">
  <div class="container">
    <div class="text-center anim-fade-up" style="margin-bottom: 48px;">
      <div class="section-label" style="margin-inline: auto;">{useCases.label}</div>
      <h2 class="section-title" style="color: var(--clr-light-text);">{useCases.heading} <span class="grad-text">{useCases.headingHighlight}</span></h2>
      {useCases.subtitle && <p class="section-sub">{useCases.subtitle}</p>}
    </div>

    {hasTabs ? (
      <div class="tabs-container anim-fade-up">
        <div class="tabs-nav">
          {useCases.tabs.map((tab, i) => (
            <button class={`tab-btn${i === 0 ? ' active' : ''}`} data-tab={tab.id}>{tab.label}</button>
          ))}
        </div>

        {useCases.tabs.map((tab, i) => (
          <div id={tab.id} class={`tab-content${i === 0 ? ' active' : ''}`}>
            {tab.cards.length === 1 ? (
              <div style="display: flex; justify-content: center;">
                <div style="max-width: 800px; width: 100%;">
                  <UseCaseCard card={tab.cards[0]} />
                </div>
              </div>
            ) : (
              <div class="grid-2" style="gap: 32px;">
                {tab.cards.map((card) => (
                  <UseCaseCard card={card} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div class={`anim-fade-up ${useCases.tabs[0].cards.length === 1 ? '' : 'grid-2'}`} style="gap: 32px;">
        {useCases.tabs[0].cards.length === 1 ? (
          <div style="display: flex; justify-content: center;">
            <div style="max-width: 800px; width: 100%;">
              <UseCaseCard card={useCases.tabs[0].cards[0]} />
            </div>
          </div>
        ) : (
          useCases.tabs[0].cards.map((card) => (
            <UseCaseCard card={card} />
          ))
        )}
      </div>
    )}
  </div>
</section>

<style>
.use-case-card-alt {
  background: #fff;
  border: 1px solid #E8EEF5;
  border-radius: 24px;
  padding: 40px;
  transition: all 0.3s ease;
  height: 100%;
}
.use-case-card-alt:hover {
  border-color: var(--clr-primary);
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}
.use-case-card-alt h4 {
  font-size: 1.25rem;
  color: var(--clr-light-text);
  margin-bottom: 20px;
}
.use-case-card-alt .scenario {
  font-size: 1rem;
  color: var(--clr-light-muted);
  line-height: 1.6;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
}
.uc-section { margin-bottom: 24px; }
.uc-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--clr-primary);
  margin-bottom: 16px;
}
.uc-label--impact { color: #10B981; }
.uc-list { list-style: none; padding: 0; }
.uc-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: var(--clr-light-muted);
}
.uc-list li::before {
  content: '\2022';
  position: absolute; left: 0; color: var(--clr-primary);
}

.tabs-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 12px 24px;
  border-radius: 99px;
  border: 1px solid #E2E8F0;
  background: #fff;
  color: #64748B;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tab-btn:hover {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
}
.tab-btn.active {
  background: var(--clr-primary);
  border-color: var(--clr-primary);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 200, 150, 0.25);
}
.tab-content {
  display: none;
  animation: fadeIn 0.5s ease;
}
.tab-content.active {
  display: block;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 768px) {
  .tabs-nav {
    flex-wrap: nowrap !important;
    justify-content: flex-start;
    overflow-x: auto;
    gap: 8px;
    padding: 4px 10px 12px;
    margin-bottom: 24px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs-nav::-webkit-scrollbar { display: none; }
  .tab-btn {
    padding: 10px 18px;
    font-size: 0.85rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>

<script is:inline>
  document.querySelectorAll('.tabs-container').forEach(container => {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target)?.classList.add('active');
      });
    });
  });
</script>
```

- [ ] **Step 7: Create JourneySection.astro**

Reference HTML from `src/pages/products/icc.astro` lines 303-343. Uses CSS classes: `section section--white`, `grid-2`, `anim-fade-up`, `grad-text`, `step-list`, `step-item`, `step-num`, `bullet-list`.

Props: `journey` object + `integration` object (optional).

```astro
---
interface Props {
  journey: {
    heading: string;
    headingHighlight: string;
    description?: string;
    steps: { number: string; title: string; description: string }[];
  };
  integration?: {
    heading: string;
    headingHighlight: string;
    description: string;
    items: string[];
  };
}

const { journey, integration } = Astro.props;
---
<section class="section section--white">
  <div class="container">
    <div class="grid-2" style="gap: 60px;">
      <div class="anim-fade-up">
        <h2 style="color: var(--clr-light-text); margin-bottom: 32px;">{journey.heading} <span class="grad-text">{journey.headingHighlight}</span></h2>
        {journey.description && <p style="color: var(--clr-light-muted); margin-bottom: 24px;">{journey.description}</p>}
        <div class="step-list">
          {journey.steps.map((step) => (
            <div class="step-item">
              <span class="step-num">{step.number}</span>
              <div>
                <h6>{step.title}</h6>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {integration && (
        <div class="anim-fade-up">
          <h2 style="color: var(--clr-light-text); margin-bottom: 24px;">{integration.heading} <span class="grad-text">{integration.headingHighlight}</span></h2>
          <p style="color: var(--clr-light-muted); margin-bottom: 24px;">{integration.description}</p>
          <ul class="bullet-list">
            {integration.items.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
</section>

<style>
.check-list, .bullet-list {
  list-style: none; padding: 0; margin: 0;
}
.check-list li, .bullet-list li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 12px;
  color: var(--clr-light-muted);
  font-size: 0.95rem;
}
.check-list li::before {
  content: '\2713';
  position: absolute; left: 0; top: 0;
  color: var(--clr-primary); font-weight: bold;
}
.bullet-list li::before {
  content: '';
  position: absolute; left: 0; top: 10px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--clr-primary);
}
.step-list { display: flex; flex-direction: column; gap: 32px; }
.step-item { display: flex; gap: 24px; align-items: flex-start; }
.step-num {
  font-size: 2rem; font-weight: 800;
  color: rgba(0,200,150,0.15);
  line-height: 1;
}
.step-item h6 {
  font-size: 1.1rem; color: var(--clr-light-text);
  margin-bottom: 8px;
}
.step-item p { font-size: 0.95rem; color: var(--clr-light-muted); }

@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 8: Create ProductCTA.astro**

This is identical across ALL product pages. Uses `t()` for translation. Reference HTML from `src/pages/products/icc.astro` lines 349-361.

```astro
---
import type { Lang } from '../../i18n/config';
import { useTranslations, useTranslatedPath } from '../../i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);
---
<section class="section section--dark">
  <div class="container">
    <div class="cta-strip anim-fade-up">
      <h2>{t('productLayout.cta.heading')} <span class="grad-text">{t('productLayout.cta.headingHighlight')}</span></h2>
      <p>{t('productLayout.cta.desc')}</p>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 32px;">
        <a class="btn btn-primary btn-pill btn-lg" href={tp('/contact')}>{t('productLayout.cta.primary')}</a>
        <a class="btn btn-ghost btn-pill btn-lg" href={tp('/clients')}>{t('productLayout.cta.secondary')}</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 9: Commit all components**

```bash
git add src/components/product/
git commit -m "feat: add 8 shared product section components"
```

---

## Task 4: ProductLayout + Routing

**Files:**
- Create: `src/layouts/ProductLayout.astro`
- Modify: `src/pages/products/[slug].astro`
- Modify: `src/pages/[lang]/products/[slug].astro`

- [ ] **Step 1: Create ProductLayout.astro**

Single template that orchestrates all product sections. Reads product data from props, conditionally renders optional sections.

```astro
---
import Layout from './Layout.astro';
import type { Lang } from '../i18n/config';
import { useTranslations, useTranslatedPath } from '../i18n/utils';
import ProductHero from '../components/product/ProductHero.astro';
import OverviewSection from '../components/product/OverviewSection.astro';
import CapabilitiesGrid from '../components/product/CapabilitiesGrid.astro';
import FeatureShowcase from '../components/product/FeatureShowcase.astro';
import UseCaseTabs from '../components/product/UseCaseTabs.astro';
import JourneySection from '../components/product/JourneySection.astro';
import ProductCTA from '../components/product/ProductCTA.astro';
import SQLPlayground from '../components/gamification/SQLPlayground.astro';

interface Props {
  product: Record<string, any>;
}

const { product } = Astro.props;
const lang = product.lang as Lang;
const t = useTranslations(lang);
const tp = useTranslatedPath(lang);

const siteUrl = 'https://intellica.net';

const breadcrumbs = [
  { name: t('productLayout.breadcrumb'), url: `${siteUrl}${tp('/products')}` },
  { name: product.name, url: `${siteUrl}${tp(`/products/${product.slug}`)}` },
];

const productSchema = {
  '@context': 'https://schema.org',
  '@type': product.jsonLd.type,
  name: product.name,
  description: product.pageDescription,
  applicationCategory: product.jsonLd.category,
  operatingSystem: 'Web-based',
  author: { '@id': `${siteUrl}/#organization` },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'USD',
  },
};

const customComponentMap: Record<string, any> = {
  SQLPlayground,
};
---
<Layout title={product.pageTitle} description={product.pageDescription} breadcrumbs={breadcrumbs} hideCta={true} lang={lang}>
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(productSchema)} />

  <ProductHero hero={product.hero} lang={lang} />

  <OverviewSection overview={product.overview} lang={lang} />

  <CapabilitiesGrid capabilities={product.capabilities} />

  {product.featureSection && (
    <FeatureShowcase featureSection={product.featureSection} />
  )}

  {product.customComponents?.map((name: string) => {
    const Component = customComponentMap[name];
    return Component ? <Component /> : null;
  })}

  {product.useCases && (
    <UseCaseTabs useCases={product.useCases} />
  )}

  {product.journey && (
    <JourneySection journey={product.journey} integration={product.integration} />
  )}

  <ProductCTA lang={lang} />
</Layout>
```

- [ ] **Step 2: Update EN route `src/pages/products/[slug].astro`**

Replace entire file content:

```astro
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

- [ ] **Step 3: Update TR route `src/pages/[lang]/products/[slug].astro`**

Replace entire file content:

```astro
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

- [ ] **Step 4: Commit layout and routes**

```bash
git add src/layouts/ProductLayout.astro src/pages/products/\[slug\].astro src/pages/\[lang\]/products/\[slug\].astro
git commit -m "feat: add ProductLayout template and update routes for Content Collections"
```

---

## Task 5: JSON Translation Cleanup

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/tr.json`

- [ ] **Step 1: Add `productLayout.*` keys to `en.json`**

Add these keys (insert after the last `productsDetail.*` block or at the end before the closing `}`):

```json
"productLayout.breadcrumb": "Products",
"productLayout.overview.title": "What does it",
"productLayout.overview.titleHighlight": "solve?",
"productLayout.overview.problemLabel": "Problem",
"productLayout.overview.approachLabel": "Approach",
"productLayout.overview.valueLabel": "Business Value",
"productLayout.overview.whenTitle": "When is it",
"productLayout.overview.whenTitleHighlight": "preferred?",
"productLayout.cta.heading": "Ready to Transform Your",
"productLayout.cta.headingHighlight": "Data?",
"productLayout.cta.desc": "From data platforms to AI solutions, we help organizations turn data into measurable business value.",
"productLayout.cta.primary": "Get in Touch",
"productLayout.cta.secondary": "View Clients"
```

- [ ] **Step 2: Add `productLayout.*` keys to `tr.json`**

```json
"productLayout.breadcrumb": "Ürünler",
"productLayout.overview.title": "Hangi sorunu",
"productLayout.overview.titleHighlight": "çözer?",
"productLayout.overview.problemLabel": "Problem",
"productLayout.overview.approachLabel": "Yaklaşım",
"productLayout.overview.valueLabel": "İş Değeri",
"productLayout.overview.whenTitle": "Ne zaman",
"productLayout.overview.whenTitleHighlight": "tercih edilir?",
"productLayout.cta.heading": "Verilerinizi Dönüştürmeye",
"productLayout.cta.headingHighlight": "Hazır mısınız?",
"productLayout.cta.desc": "Veri platformlarından yapay zeka çözümlerine, kuruluşların veriyi ölçülebilir iş değerine dönüştürmesine yardımcı oluyoruz.",
"productLayout.cta.primary": "İletişime Geçin",
"productLayout.cta.secondary": "Müşterilerimiz"
```

- [ ] **Step 3: Remove all `productsDetail.*` keys from both files**

Delete all lines matching `"productsDetail.*"` from both `en.json` and `tr.json`. These are lines 517-585 in both files (approximately 69 lines per file).

**Do NOT delete** `products.*` keys (e.g., `products.icc.name`) — those are used by Header/BottomNav.

- [ ] **Step 4: Commit JSON changes**

```bash
git add src/i18n/locales/en.json src/i18n/locales/tr.json
git commit -m "chore: replace productsDetail keys with productLayout keys, remove unused translations"
```

---

## Task 6: Pilot Build Verification — ICC English

Verify the ICC English page renders correctly through the new Content Collections pipeline before creating remaining YAML files.

- [ ] **Step 1: Run dev server**

```bash
npx astro dev
```

- [ ] **Step 2: Open `http://localhost:4321/products/icc` in browser**

Verify:
- Page Hero renders with "Data Platform & Governance" label, "ICC — Consistency Controller" title
- Overview section has Problem/Approach/Business Value + When Preferred checklist
- 6 capability cards in grid-3
- Dark feature section with ICC Rule screenshot
- 3 use case tabs (Telecom/Finance/Insurance) with cards
- Journey section with 3 steps + integration bullet list
- CTA section with buttons

- [ ] **Step 3: If rendering issues found, fix component code**

Common issues to check:
- CSS class mismatches (verify against `global.css`)
- Missing `anim-fade-up` classes
- Inline style differences from original
- Image path correctness

- [ ] **Step 4: Commit any fixes**

```bash
git add -u
git commit -m "fix: resolve ICC pilot rendering issues"
```

---

## Task 7: Remaining English YAML Files (10 files)

Extract content from each remaining English product page into YAML format matching the schema.

**Files to create:**
- `src/content/products/en/talk-to-your-data.yaml`
- `src/content/products/en/blue-octopus.yaml`
- `src/content/products/en/var.yaml`
- `src/content/products/en/orqenta.yaml`
- `src/content/products/en/retouch.yaml`
- `src/content/products/en/retable.yaml`
- `src/content/products/en/ifdm.yaml`
- `src/content/products/en/itdm.yaml`
- `src/content/products/en/hrdm.yaml`
- `src/content/products/en/procurement-price-prediction.yaml`

- [ ] **Step 1: Extract Talk To content**

Read `src/pages/products/talk-to-your-data.astro` and create YAML. Note: includes `customComponents: ['SQLPlayground']`. Has 3 use case tabs (IT & BI, Customer, Management). Some tabs have 2 cards, others 1 centered card.

- [ ] **Step 2: Extract Blue Octopus content**

Read `src/pages/products/blue-octopus.astro`. Has 3 use case tabs. Cards include badges.

- [ ] **Step 3: Extract VAR content**

Read `src/pages/products/var.astro`. Has 3 use case tabs with mixed layouts.

- [ ] **Step 4: Extract Orqenta content**

Read `src/pages/products/orqenta.astro`. Has 3 use case tabs.

- [ ] **Step 5: Extract ReTouch content**

Read `src/pages/products/retouch.astro`. Has 3 use case tabs.

- [ ] **Step 6: Extract Retable content**

Read `src/pages/products/retable.astro`. No tabs — model as single tab with `label: null`, 2 cards.

- [ ] **Step 7: Extract IFDM content**

Read `src/pages/products/ifdm.astro`. No tabs — model as single tab with `label: null`. Use custom `interventionLabel` ("IFDM CONTRIBUTION") and `impactLabel` ("GAIN"). Has architecture section instead of feature section — use same `featureSection` schema.

- [ ] **Step 8: Extract ITDM content**

Read `src/pages/products/itdm.astro`. No useCases. Has architecture section via `featureSection`.

- [ ] **Step 9: Extract HRDM content**

Read `src/pages/products/hrdm.astro`. No useCases. Has architecture section via `featureSection`.

- [ ] **Step 10: Extract Procurement content**

Read `src/pages/products/procurement-price-prediction.astro`. Minimal page — only hero, overview, capabilities, CTA. No featureSection, useCases, journey, or integration.

- [ ] **Step 11: Build to validate all YAML files**

```bash
npx astro build 2>&1 | tail -20
```

Expected: Build succeeds. If schema validation errors, fix the corresponding YAML.

- [ ] **Step 12: Commit all English YAML files**

```bash
git add src/content/products/en/
git commit -m "feat: add all 10 remaining English product YAML files"
```

---

## Task 8: Turkish YAML Files (11 files)

Create Turkish translations of all 11 product YAML files.

**Files to create:**
- `src/content/products/tr/icc.yaml`
- `src/content/products/tr/talk-to-your-data.yaml`
- `src/content/products/tr/blue-octopus.yaml`
- `src/content/products/tr/var.yaml`
- `src/content/products/tr/orqenta.yaml`
- `src/content/products/tr/retouch.yaml`
- `src/content/products/tr/retable.yaml`
- `src/content/products/tr/ifdm.yaml`
- `src/content/products/tr/itdm.yaml`
- `src/content/products/tr/hrdm.yaml`
- `src/content/products/tr/procurement-price-prediction.yaml`

- [ ] **Step 1: Create all 11 Turkish YAML files**

For each file:
- Copy the English YAML structure exactly
- Set `lang: tr`
- Translate ALL text content to Turkish (professional, corporate tone — target audience: government, ministries, enterprise)
- Keep `slug` identical to English (URLs are the same across locales)
- Keep `image` paths identical (same images for both languages)
- Keep `jsonLd.type` and `jsonLd.category` in English (schema.org standard)
- Translate section labels: "Capabilities" → "Yetenekler", "Solutions" → "Çözümler", etc.
- Translate intervention/impact labels per product

- [ ] **Step 2: Build to validate all Turkish YAML files**

```bash
npx astro build 2>&1 | tail -20
```

- [ ] **Step 3: Commit all Turkish YAML files**

```bash
git add src/content/products/tr/
git commit -m "feat: add all 11 Turkish product YAML translations"
```

---

## Task 9: Full Verification — EN + TR

- [ ] **Step 1: Start dev server**

```bash
npx astro dev
```

- [ ] **Step 2: Verify all 11 English product pages**

Open each URL and verify content matches original:
- `http://localhost:4321/products/icc`
- `http://localhost:4321/products/talk-to-your-data`
- `http://localhost:4321/products/blue-octopus`
- `http://localhost:4321/products/var`
- `http://localhost:4321/products/orqenta`
- `http://localhost:4321/products/retouch`
- `http://localhost:4321/products/retable`
- `http://localhost:4321/products/ifdm`
- `http://localhost:4321/products/itdm`
- `http://localhost:4321/products/hrdm`
- `http://localhost:4321/products/procurement-price-prediction`

Check: hero, overview, capabilities, feature section, use cases (tabs work), journey, CTA, JSON-LD in page source.

- [ ] **Step 3: Verify all 11 Turkish product pages**

Open each URL — these should ALL work now (previously 404 or wrong content):
- `http://localhost:4321/tr/products/icc`
- `http://localhost:4321/tr/products/talk-to-your-data`
- `http://localhost:4321/tr/products/blue-octopus`
- `http://localhost:4321/tr/products/var`
- `http://localhost:4321/tr/products/orqenta`
- `http://localhost:4321/tr/products/retouch`
- `http://localhost:4321/tr/products/retable`
- `http://localhost:4321/tr/products/ifdm`
- `http://localhost:4321/tr/products/itdm`
- `http://localhost:4321/tr/products/hrdm`
- `http://localhost:4321/tr/products/procurement-price-prediction`

Check: all content is in Turkish, navigation links work, language switcher works.

- [ ] **Step 4: Verify Talk To SQLPlayground renders**

Open `http://localhost:4321/products/talk-to-your-data` — SQLPlayground interactive component should appear between Feature Showcase and Use Cases sections.

- [ ] **Step 5: Verify navigation links**

- Click products in Header dropdown (both EN and TR) — all links should resolve
- Click products in BottomNav (mobile) — all links should resolve
- Switch language on a product page — should navigate to the other locale version

- [ ] **Step 6: Fix any issues found and commit**

```bash
git add -u
git commit -m "fix: resolve verification issues in product pages"
```

---

## Task 10: Delete Old Product Files

Only after full verification passes.

**Files to delete:**
- `src/pages/products/icc.astro`
- `src/pages/products/talk-to-your-data.astro`
- `src/pages/products/blue-octopus.astro`
- `src/pages/products/var.astro`
- `src/pages/products/orqenta.astro`
- `src/pages/products/retouch.astro`
- `src/pages/products/retable.astro`
- `src/pages/products/ifdm.astro`
- `src/pages/products/itdm.astro`
- `src/pages/products/hrdm.astro`
- `src/pages/products/procurement-price-prediction.astro`
- `src/page-templates/ProductDetailPage.astro`

- [ ] **Step 1: Delete old static product pages**

```bash
git rm src/pages/products/icc.astro \
       src/pages/products/talk-to-your-data.astro \
       src/pages/products/blue-octopus.astro \
       src/pages/products/var.astro \
       src/pages/products/orqenta.astro \
       src/pages/products/retouch.astro \
       src/pages/products/retable.astro \
       src/pages/products/ifdm.astro \
       src/pages/products/itdm.astro \
       src/pages/products/hrdm.astro \
       src/pages/products/procurement-price-prediction.astro \
       src/page-templates/ProductDetailPage.astro
```

- [ ] **Step 2: Final build check**

```bash
npx astro build 2>&1 | tail -20
```

Expected: Clean build with no errors. No broken imports referencing deleted files.

- [ ] **Step 3: Commit deletion**

```bash
git commit -m "chore: remove old hardcoded product pages and generic template"
```

---

## Task 11: Smoke Test + Final Commit

- [ ] **Step 1: Full production build**

```bash
npx astro build
```

Expected: Clean build, no warnings about missing files or broken references.

- [ ] **Step 2: Preview production build**

```bash
npx astro preview
```

Spot check 3-4 pages in both languages to confirm production output matches dev.

- [ ] **Step 3: Verify no broken references**

```bash
grep -r "ProductDetailPage" src/ --include="*.astro" --include="*.ts"
grep -r "productsDetail\." src/ --include="*.json" --include="*.astro" --include="*.ts"
```

Expected: No matches for either grep (all old references removed).

- [ ] **Step 4: Final commit if any remaining fixes**

```bash
git add -u
git commit -m "chore: final cleanup after product pages Content Collections migration"
```
