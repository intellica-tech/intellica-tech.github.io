# Intellica — Official Website

> **Unlocking the Infinite Value of Data**  
> The official website of Intellica, a global Data & AI company headquartered in Istanbul — active in 20+ countries since 2006.

[![Deploy to GitHub Pages](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/pages.yml)
[![Docker Build & Push](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/docker.yml/badge.svg)](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/docker.yml)
[![Astro](https://img.shields.io/badge/Built%20with-Astro%20v6-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/License-Private-red)](./LICENSE)

---

## 🏢 About Intellica

Intellica is a **Data & AI** company that has been leading enterprises on their data transformation journeys since **2006**. With a team of **450+ technical experts**, we deliver modern data platforms, analytics solutions, and production-grade AI systems to **100+ enterprise clients** across **20+ countries**.

**What we do:**
- 🏗️ **Modern Data Platforms & DWH** — Cloud-native architecture, migration, and integration
- 📊 **BI & Advanced Analytics** — Enterprise dashboarding, semantic layer, self-service analytics
- 🤖 **AI & Machine Learning** — GenAI, LLM, predictive models, agentic AI — from PoC to production
- 🔒 **Data Governance** — Quality, lineage, cataloging, MDM and compliance frameworks
- 🎯 **Consulting & Managed Services** — Strategy, GAP analysis, expert teams, ongoing operations

**Key numbers:** `20+` Countries · `200+` Projects · `100+` Enterprise Clients · `40%` YoY Growth · `450+` Experts

🌍 **Live site:** [https://intellica-tech.github.io](https://intellica-tech.github.io)

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro v6](https://astro.build) — static output, zero JS by default |
| **i18n** | Astro native i18n routing — English (default) + Turkish (`/tr/`) |
| **Content** | Astro Content Collections (YAML + Zod schema) for product pages |
| **Styling** | Vanilla CSS with custom design tokens (no framework) |
| **Typography** | Inter (Google Fonts) |
| **Rendering** | Static Site Generation (SSG) |
| **Interactivity** | Vanilla JS — 11 gamification components, no framework dependencies |
| **Container** | Docker (multi-stage: Node 24 Slim builder → Nginx Alpine runtime) |
| **Registry** | GitHub Container Registry (`ghcr.io`) |
| **Hosting** | GitHub Pages (via GitHub Actions) |
| **CI/CD** | GitHub Actions |
| **Node** | v24 |

---

## 📁 Project Structure

```text
├── .github/workflows/
│   ├── docker.yml                # main → build & push Docker image to GHCR
│   └── pages.yml                 # release/* → build & deploy to GitHub Pages
│
├── public/
│   ├── assets/img/               # Logos, icons, brand assets
│   ├── assets/images/            # Client & product logos, map assets
│   └── llms.txt                  # AI crawler visibility (Claude, GPT, etc.)
│
├── src/
│   ├── components/
│   │   ├── Header.astro          # Sticky nav with mega-menu & mobile toggle
│   │   ├── Footer.astro          # Brand, social links, navigation columns
│   │   ├── BottomNav.astro       # Mobile bottom navigation bar
│   │   ├── LanguagePicker.astro  # EN/TR language switcher
│   │   └── LanguageBanner.astro  # Browser language suggestion banner
│   │
│   ├── components/product/       # 8 shared product section components
│   │   ├── ProductHero.astro     # Hero with category badge & title highlight
│   │   ├── OverviewSection.astro # Problem / approach / business value
│   │   ├── CapabilitiesGrid.astro# Numbered capability cards
│   │   ├── FeatureShowcase.astro # Feature section with image callout
│   │   ├── UseCaseTabs.astro     # Tabbed use cases by industry
│   │   ├── UseCaseCard.astro     # Individual use case card
│   │   ├── JourneySection.astro  # Operational steps + integrations
│   │   └── ProductCTA.astro      # Product call-to-action footer
│   │
│   ├── components/gamification/  # 11 interactive engagement components
│   │   ├── ChallengeArena.astro  # 5-level SQL challenge with timer & hints
│   │   ├── ContactFunMode.astro  # SQL-themed contact form
│   │   ├── ROICalculator.astro   # Data value calculator with SVG gauges
│   │   ├── ProductFitWizard.astro# 3-step product matching wizard
│   │   ├── DataMaturityQuiz.astro# 5-question maturity assessment
│   │   ├── SQLPlayground.astro   # Browser-based SQL executor
│   │   └── ...                   # + 5 more (Constellation, DataFlow, etc.)
│   │
│   ├── content/
│   │   └── products/
│   │       ├── en/               # 11 English product YAML files
│   │       └── tr/               # 11 Turkish product YAML files
│   │
│   ├── i18n/
│   │   ├── config.ts             # Language configuration (EN, TR)
│   │   ├── utils.ts              # useTranslations(), useTranslatedPath()
│   │   └── locales/
│   │       ├── en.json           # English translations (~1,200 keys)
│   │       └── tr.json           # Turkish translations (~1,200 keys)
│   │
│   ├── layouts/
│   │   ├── Layout.astro          # Base HTML layout, SEO meta, JS animations
│   │   └── ProductLayout.astro   # Product page template (Content Collections)
│   │
│   ├── pages/                    # English pages (no prefix)
│   │   ├── index.astro
│   │   ├── products.astro
│   │   ├── products/[slug].astro # Dynamic product detail routes
│   │   ├── solutions.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── careers.astro
│   │   ├── academy.astro
│   │   ├── clients.astro
│   │   ├── insights.astro
│   │   ├── partners.astro
│   │   ├── data-platforms.astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   └── cookies.astro
│   │
│   ├── pages/[lang]/             # Turkish pages (/tr/ prefix)
│   │   └── (mirrors all EN pages)
│   │
│   ├── styles/
│   │   └── global.css            # Design system: tokens, typography, components
│   │
│   └── content.config.ts         # Content Collection schema (Zod)
│
├── astro.config.mjs              # Astro config (site URL, i18n, redirects)
├── Dockerfile                    # Multi-stage Docker build
├── nginx.conf                    # Nginx config (gzip, cache, SPA routing)
└── package.json
```

---

## 🎨 Design System

The site uses a bespoke CSS design system defined in `src/styles/global.css`:

| Token | Value |
|-------|-------|
| `--clr-primary` | `#00C896` (Turquoise) |
| `--clr-secondary` | `#009FE3` (Blue) |
| `--grad-brand` | `135deg, #00C896 → #009FE3` |
| `--font` | Inter, -apple-system, sans-serif |
| `--radius-md` | `16px` |
| `--transition` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

**Design patterns used:**
- Dark hero sections with radial gradient blobs
- Glassmorphism cards (`backdrop-filter: blur`)
- White/light content sections for readability
- Scroll-triggered `anim-fade-up` animations (IntersectionObserver)
- Animated counters for metrics
- Mega-menu navigation with category grouping

---

## 🚀 Local Development

### Prerequisites

- **Node.js v24** — install via [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or your package manager

### Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server → `http://localhost:4321` |
| `npm run build` | Build static site to `./dist/` |
| `npm run preview` | Preview production build locally |

**Quick start:**
```bash
npm install && npm run dev
```

---

## 🐳 Docker

### Build locally

```bash
docker build -t intellica-web .
```

### Run locally

```bash
docker run -p 8080:80 intellica-web
# → open http://localhost:8080
```

### Pull from GHCR

```bash
docker pull ghcr.io/intellica-tech/intellica-tech.github.io:latest
docker run -p 8080:80 ghcr.io/intellica-tech/intellica-tech.github.io:latest
```

---

## ⚙️ CI/CD Pipelines

Two GitHub Actions workflows handle all automation:

### 1. `docker.yml` — Triggered on `main` push

```
push to main
    └── Build multi-arch Docker image (linux/amd64 + linux/arm64)
    └── Push to ghcr.io/intellica-tech/intellica-tech.github.io
        ├── :latest
        ├── :sha-<short-sha>
        └── :YYYY-MM-DD
```

**No secrets needed** — uses the built-in `GITHUB_TOKEN` with `packages: write` permission.

### 2. `pages.yml` — Triggered on `release/**` push

```
push to release/*
    └── [build job]
    │   ├── npm ci
    │   ├── astro build → ./dist
    │   └── upload-pages-artifact
    └── [deploy job]
        └── deploy-pages → github-pages environment
            → https://intellica-tech.github.io
```

### Required GitHub Repo Setting

> **Settings → Pages → Build and deployment → Source → `GitHub Actions`**

---

## 🌐 Internationalization (i18n)

The site supports **English** (default) and **Turkish** with Astro's native i18n routing:

- English pages live at root: `/products`, `/about`, `/contact`
- Turkish pages use `/tr/` prefix: `/tr/products`, `/tr/about`, `/tr/contact`
- Translation keys stored in `src/i18n/locales/en.json` and `tr.json` (~1,200 keys each)
- `LanguagePicker` component for manual switching
- `LanguageBanner` auto-suggests the visitor's browser language
- Old URLs redirect via `astro.config.mjs` (`/about-us` → `/about`, `/our-products` → `/products`, etc.)

---

## 📦 Content Collections

Product detail pages are powered by **Astro Content Collections** with YAML data files:

- **22 YAML files** — 11 products × 2 languages (`src/content/products/en/` and `tr/`)
- **Zod schema** in `src/content.config.ts` enforces type-safe structure
- **ProductLayout** (`src/layouts/ProductLayout.astro`) renders all product pages
- **8 shared components** (`src/components/product/`) — Hero, Overview, Capabilities, Features, Use Cases, Journey, Integration, CTA

**Products:** IFDM, ITDM, HRDM, ICC, ReTouch, Retable, Orqenta, Talk To, Blue Octopus, VAR, Procurement Price Prediction

---

## 🎮 Gamification

11 interactive components in `src/components/gamification/` built with **vanilla JS** (no framework dependencies):

| Component | Description |
|-----------|-------------|
| **ChallengeArena** | 5-progressive SQL challenges with timer, hints & confetti |
| **ContactFunMode** | SQL-themed contact form with chat icebreaker & pipeline animation |
| **ROICalculator** | "What's Your Data Worth?" calculator with SVG gauges |
| **ProductFitWizard** | 3-step product matching wizard (industry → challenge → priority) |
| **DataMaturityQuiz** | 5-question assessment with radar chart visualization |
| **SQLPlayground** | Browser-based SQL query executor |
| **ProductConstellation** | Visual product relationship mapper |
| **DataFlowStory** | Interactive data journey narrative |
| **EasterEggTerminal** | Hidden CLI-style terminal easter egg |
| **PipelineBuilder** | Drag-and-drop workflow constructor |
| **ReadingPaths** | Personalized content recommendation paths |

All components support keyboard navigation, `prefers-reduced-motion`, and ARIA labels.

---

## 📄 Pages

| Route (EN) | Route (TR) | Description |
|------------|------------|-------------|
| `/` | `/tr` | Homepage — Hero, Capabilities, Global Impact, Clients, Products, AI, CTA |
| `/about` | `/tr/about` | Company story, values, timeline 2006–2025 |
| `/products` | `/tr/products` | 11 product cards across 3 categories |
| `/products/[slug]` | `/tr/products/[slug]` | Product detail pages (Content Collections) |
| `/solutions` | `/tr/solutions` | Capabilities, service models, AI portfolio, DWH |
| `/data-platforms` | `/tr/data-platforms` | Data platform services |
| `/contact` | `/tr/contact` | Contact form (classic + fun mode) + office details |
| `/careers` | `/tr/careers` | Career opportunities |
| `/academy` | `/tr/academy` | Academy program + Challenge Arena |
| `/clients` | `/tr/clients` | Client portfolio |
| `/insights` | `/tr/insights` | Blog / thought leadership |
| `/partners` | `/tr/partners` | Partner ecosystem |
| `/privacy` | `/tr/privacy` | Privacy policy |
| `/terms` | `/tr/terms` | Terms and conditions |
| `/cookies` | `/tr/cookies` | Cookie policy |

---

## 🌐 Deployment Environments

| Environment | Trigger | URL |
|-------------|---------|-----|
| **GitHub Pages** | Push to `release/**` | [intellica-tech.github.io](https://intellica-tech.github.io) |
| **Docker (GHCR)** | Push to `main` | `ghcr.io/intellica-tech/intellica-tech.github.io` |
| **Local dev** | Manual | `http://localhost:4321` |

---

## 📬 Contact

- **Website:** [intellica.net](https://www.intellica.net)
- **LinkedIn:** [linkedin.com/company/intellica](https://www.linkedin.com/company/intellica)
- **Email:** info@intellica.net
- **Phone:** +90 216 688 45 46
- **Address:** Gardenya 1 Plaza, Floor 1, Ataşehir, Istanbul, Turkey
