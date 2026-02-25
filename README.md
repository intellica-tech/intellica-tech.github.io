# Intellica — Official Website

> **Unlocking the Infinite Value of Data**  
> The official website of Intellica, a global Data & AI company headquartered in Istanbul — active in 20+ countries since 2006.

[![Deploy to GitHub Pages](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/pages.yml)
[![Docker Build & Push](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/docker.yml/badge.svg)](https://github.com/intellica-tech/intellica-tech.github.io/actions/workflows/docker.yml)
[![Astro](https://img.shields.io/badge/Built%20with-Astro%20v5-BC52EE?logo=astro&logoColor=white)](https://astro.build)
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
| **Framework** | [Astro v5](https://astro.build) — static output, zero JS by default |
| **Styling** | Vanilla CSS with custom design tokens (no framework) |
| **Typography** | Inter (Google Fonts) |
| **Rendering** | Static Site Generation (SSG) |
| **Container** | Docker (multi-stage: Node 22 builder → Nginx 1.27 Alpine) |
| **Registry** | GitHub Container Registry (`ghcr.io`) |
| **Hosting** | GitHub Pages (via GitHub Actions) |
| **CI/CD** | GitHub Actions |
| **Node** | v22 LTS (installed via Chocolatey on Windows) |

---

## 📁 Project Structure

```text
website-naz/
├── .github/
│   └── workflows/
│       ├── docker.yml          # main → build & push Docker image to GHCR
│       └── pages.yml           # release/* → build & deploy to GitHub Pages
│
├── public/
│   └── assets/
│       ├── img/                # Logos, icons, brand assets
│       └── images/
│           ├── logos/          # Client & product logos
│           └── map/            # World map assets
│
├── src/
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with mega-menu & mobile toggle
│   │   └── Footer.astro        # Brand, social links, navigation columns
│   ├── layouts/
│   │   └── Layout.astro        # Base HTML layout, SEO meta, JS animations
│   ├── pages/
│   │   ├── index.astro         # Homepage (Hero, Capabilities, Products, AI, CTA…)
│   │   ├── products.astro      # 9 product cards across 3 categories
│   │   ├── solutions.astro     # Capabilities, services, AI portfolio, DWH
│   │   ├── about.astro         # Company story, values, timeline 2006–2025
│   │   └── contact.astro       # Contact form + office details
│   └── styles/
│       └── global.css          # Design system: tokens, typography, components
│
├── astro.config.mjs            # Astro config (site URL, static output)
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx config (gzip, cache, SPA routing)
├── .dockerignore
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

Node.js is installed via **Chocolatey** on Windows. Use `.cmd` variants or prepend the path:

```powershell
# One-time: install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs
```

### Commands

Run all commands from the project root. On Windows with Chocolatey Node, prefix with the path:

```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
```

| Command | Action |
|---------|--------|
| `npm.cmd install` | Install dependencies |
| `npm.cmd run dev` | Start dev server → `http://localhost:4321` |
| `npm.cmd run build` | Build static site to `./dist/` |
| `npm.cmd run preview` | Preview production build locally |
| `npm.cmd run astro -- check` | Type-check all `.astro` files |

**Quick start (copy-paste):**
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; & "C:\Program Files\nodejs\npm.cmd" run dev
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

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Capabilities, Global Impact, Clients, Products, AI Solutions, How We Work, Testimonials, CTA |
| `/products` | 9 licensed products across 3 categories (Data Models, Governance, AI) |
| `/solutions` | Capabilities, 4 service models, AI portfolio, DWH transformation |
| `/about` | Company story, values, timeline 2006–2025 |
| `/contact` | Contact form + office address, phone, LinkedIn |

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
