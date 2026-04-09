# Intellica.net Gamification Design Spec

## Overview

Add 10 gamification features to intellica.net — a static Astro site deployed on GitHub Pages. All features are client-side only (zero backend, zero database, localStorage at most). The goal is to elevate brand perception ("wow"), drive leads, and increase engagement.

## Constraints

- **Static site**: Astro + GitHub Pages, no server-side logic
- **No state persistence**: No DB, no CMS, no auth. localStorage for session-only progress
- **Design system**: Must follow existing `global.css` tokens (`--clr-primary`, `--clr-accent`, `--grad-brand`, etc.)
- **Responsive**: Mobile ≤768px (bottom nav), Desktop >768px (header nav)
- **Performance**: No heavy JS frameworks. Vanilla JS + CSS animations. Lazy-load interactive components
- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)

## Target Audience

- Potential customers (decision-makers, technical leads seeking data/AI services)
- Talent candidates (students and new graduates for Academy program)
- General visitors (brand awareness and differentiation)

## Priority

1. **Wow factor** — "This company is different, they truly know technology"
2. **Lead generation** — Drive visitors to contact/demo/application
3. **Engagement** — Longer time on site, more pages visited

## Priority Pages

Products, Academy, Insights, Solutions/Data Platforms

---

## Phase 1 — Quick Wins

### Feature 10: Easter Egg Terminal

**Page**: Global (all pages via Layout.astro)
**Trigger**: Konami code (↑↑↓↓←→←→BA) or keyboard shortcut (Ctrl+Shift+T)

**Behavior**:
- A retro terminal overlay slides up from the bottom (dark background, green monospace text)
- Typing `help` shows available commands
- Commands:
  - `help` — list all commands
  - `about` — Intellica company info (founded 2006, Data & AI)
  - `ls products` — list all 10 products with one-line descriptions
  - `cat <product>` — show product details (e.g., `cat ifdm`)
  - `ls team` — fun team stats (240+ academy graduates, 11+ years)
  - `ping ai` — fun AI response simulation
  - `whoami` — "A curious visitor who found our secret terminal"
  - `clear` — clear terminal
  - `exit` — close terminal
- Terminal has blinking cursor, typewriter effect on output
- Subtle CRT scanline effect via CSS

**Technical**:
- Single Astro component: `EasterEggTerminal.astro`
- Injected in `Layout.astro` (global)
- Pure vanilla JS, no dependencies
- Commands defined as a static object map
- CSS: scoped `<style>` block, uses `--clr-primary` for green text

**Wow factor**: High — shareable, viral, "did you know intellica.net has a hidden terminal?"
**Lead**: Low — fun brand moment, not conversion-focused
**Effort**: Low — ~200 lines JS + ~100 lines CSS

---

### Feature 7: Animated Data Flow Storytelling

**Page**: Data Platforms (`data-platforms.astro`)
**Location**: New section after the hero, replacing or augmenting the strategic overview

**Behavior**:
- Scroll-driven animation showing data flowing through a pipeline:
  1. **Sources** (databases, APIs, files) appear as icons on the left
  2. **Extract**: Data particles flow from sources into a funnel
  3. **Transform**: Particles pass through processing nodes (filter, join, aggregate)
  4. **Load**: Clean data lands in a data warehouse icon
  5. **Analyze**: Dashboard/chart icons light up with insights
- Each stage is tied to scroll position (Scroll-driven Animations API with IntersectionObserver fallback)
- At each stage, a short text label appears: "Extract from 50+ sources", "Transform with business rules", etc.
- Intellica branding at the center of the pipeline
- Particles use `--clr-primary` (#00C896) and `--clr-secondary` (#009FE3) colors

**Technical**:
- Component: `DataFlowStorytelling.astro`
- SVG-based pipeline diagram with CSS animations triggered by scroll
- Particle effect: CSS `@keyframes` with multiple small `<div>` elements (no Canvas needed for performance)
- Fallback: Static diagram for browsers without scroll-driven animations support
- Uses `IntersectionObserver` for visibility-based triggers (existing pattern: `anim-fade-up` + `visible`)

**Wow factor**: Very high — cinematic, tells the Intellica story visually
**Lead**: Medium — "Build your pipeline with us" CTA at the end
**Effort**: Medium — ~300 lines CSS animation + ~150 lines JS orchestration

---

### Feature 9: Product Fit Recommender

**Page**: Products (`products.astro`)
**Location**: New section after the hero, before the product grid

**Behavior**:
- "Find Your Ideal Solution" wizard with 3-4 steps:
  1. **Industry**: Finance / Telecom / HR / Other
  2. **Biggest challenge**: Data quality / Reporting gaps / Manual processes / AI readiness
  3. **Priority**: Cost reduction / Speed / Compliance / Innovation
  4. (Optional) **Scale**: SMB / Enterprise
- Each step is a card-based single-select UI with smooth transitions
- Progress bar at top
- Result screen shows:
  - Top 2-3 recommended products with match percentage
  - One-line reason for each ("IFDM — built for finance regulatory reporting")
  - "Get a personalized demo" CTA button → `/contact`
  - "See all products" secondary link

**Matching logic** (client-side):
- Each product has a tag array: `["finance", "data-quality", "compliance", ...]`
- User answers map to tags
- Score = count of matching tags
- Top 3 by score displayed

**Technical**:
- Component: `ProductFitRecommender.astro`
- Vanilla JS state machine for wizard steps
- Product data as static const (same data already exists in `products.astro`)
- CSS transitions between steps (`transform: translateX`)
- No localStorage needed — single-session flow

**Wow factor**: Medium — interactive, personalized feel
**Lead**: Very high — direct funnel to contact page with context
**Effort**: Low-Medium — ~250 lines JS + ~150 lines CSS

---

## Phase 2 — Medium Complexity

### Feature 2: Data Maturity Assessment Quiz

**Page**: Solutions (`solutions.astro`)
**Location**: New section or standalone page `/data-maturity`

**Behavior**:
- "How Mature Is Your Data Strategy?" — 5-7 multiple-choice questions
- Categories assessed: Data Governance, Infrastructure, Analytics, AI Readiness, Culture
- Each question has 4 options scored 1-4
- Result screen:
  - Overall maturity level (Reactive / Managed / Optimized / Leading)
  - Radar chart (SVG, 5 axes for 5 categories)
  - Per-category one-liner insight
  - "Recommended next steps" with relevant Intellica products/services
  - CTA: "Discuss your roadmap with us" → `/contact`

**Technical**:
- Component: `DataMaturityQuiz.astro` (or standalone page)
- SVG radar chart rendered via vanilla JS (calculate polygon points)
- Score calculation: simple average per category
- Step wizard with CSS transitions
- No external chart library needed

**Wow factor**: Medium — interactive assessment feels premium
**Lead**: Very high — personalized result creates "I need help" moment
**Effort**: Medium — ~350 lines JS (quiz engine + radar chart) + ~200 lines CSS

---

### Feature 8: ROI Calculator

**Page**: Solutions (`solutions.astro`)
**Location**: New section or accessible via CTA from hero

**Behavior**:
- "What's Your Data Worth?" interactive calculator
- Inputs (sliders + dropdowns):
  - Industry: Finance / Telecom / Retail / Manufacturing / Other
  - Company size: 50-100 / 100-500 / 500-2000 / 2000+
  - Current data maturity: Basic / Intermediate / Advanced
  - Annual IT budget range (optional slider)
- Output (live-updating as sliders move):
  - Estimated annual savings (bar chart)
  - Decision speed improvement % (gauge)
  - Risk reduction % (gauge)
  - 3-year projected ROI (line chart)
- Benchmark data: Static JSON with industry averages
- CTA: "Get a detailed assessment" → `/contact`

**Technical**:
- Component: `ROICalculator.astro`
- SVG-based charts (bar, gauge, line) — vanilla JS rendering
- Slider inputs with real-time calculation
- Static benchmark dataset embedded as const
- Responsive: stacked layout on mobile

**Wow factor**: Medium — interactive, tangible business value
**Lead**: Very high — "your company could save X" is compelling
**Effort**: Medium — ~400 lines JS (calculation + charts) + ~200 lines CSS

---

### Feature 6: Insight Reading Paths

**Page**: Insights (`insights.astro`)
**Location**: Above the article grid, as a "Choose Your Journey" section

**Behavior**:
- 3-4 themed reading paths:
  - "Data Governance Journey" — articles on governance, dashboard trust, quality
  - "AI Readiness Journey" — articles on RAG, GenAI trust, business analysis
  - "Data Operations Journey" — articles on early warning, manual controls
- Each path shown as a horizontal road/timeline with article nodes
- Clicking a path expands it, showing articles in order
- localStorage tracks which articles have been read (by slug)
- Read articles show a checkmark; next recommended article is highlighted
- Progress indicator: "2/3 articles completed"

**Technical**:
- Component: `ReadingPaths.astro`
- Path definitions: static const mapping paths → article slugs
- localStorage: `intellica-reading-progress` key with `{slug: true}` map
- CSS timeline/roadmap visualization
- Existing article data already defined in `insights.astro` frontmatter

**Wow factor**: Low-Medium — structured learning feels intentional
**Lead**: Low — more engagement/return-visit focused
**Effort**: Low-Medium — ~200 lines JS + ~150 lines CSS

---

## Phase 3 — High Complexity

### Feature 3: Product Constellation Map

**Page**: Products (`products.astro`)
**Location**: Alternative view toggle — "List View | Constellation View"

**Behavior**:
- 10 products displayed as stars/nodes in a dark space-themed canvas
- Products positioned by category clusters:
  - Data Models cluster: IFDM, ITDM, HRDM
  - Governance cluster: ICC, ReTouch
  - Platform cluster: Retable, Orqenta
  - AI cluster: Talk To, Blue Octopus, VAR
- Glowing connection lines between related products
- Hover: Product node enlarges, shows name + one-liner
- Click: Expands product card with full description + "Learn more" link
- Background: Subtle particle/star field animation
- Mouse parallax: Stars shift slightly with cursor movement

**Technical**:
- Component: `ProductConstellation.astro`
- HTML5 Canvas for star field background + connection lines
- Product nodes as positioned HTML elements over canvas (for accessibility)
- Vanilla JS: mouse tracking, parallax calculation, hover/click handlers
- Product positions defined as static coordinates
- Responsive: On mobile, simplified grid layout (canvas disabled)

**Wow factor**: Very high — memorable, unique navigation experience
**Lead**: Medium — discovery-driven, leads to product pages
**Effort**: High — ~500 lines JS (canvas + interactions) + ~200 lines CSS

---

### Feature 1: Interactive Data Pipeline Builder

**Page**: Solutions or Data Platforms (`data-platforms.astro`)
**Location**: Dedicated section "Build Your Pipeline"

**Behavior**:
- Visual pipeline builder with 3 columns: Sources | Transforms | Destinations
- User clicks to add nodes:
  - Sources: Database, API, File, Streaming
  - Transforms: Filter, Join, Aggregate, ML Model
  - Destinations: DWH, Dashboard, Alert, API
- Nodes connect with animated flowing lines (SVG paths)
- Each node click shows a brief tooltip about Intellica's approach
- When pipeline has ≥1 source + ≥1 transform + ≥1 destination:
  - "Run" button activates
  - Clicking "Run" triggers a flow animation (data particles moving through pipeline)
  - Success message: "Pipeline ready! Let's build this for real."
  - CTA: "Contact us" → `/contact`

**Technical**:
- Component: `PipelineBuilder.astro`
- SVG for pipeline canvas with positioned HTML node elements
- Vanilla JS: click-to-add, connection line calculation (bezier curves)
- CSS animations for data flow particles along SVG paths
- No drag-drop (simplification) — click-to-add from palettes
- Responsive: Vertical layout on mobile

**Wow factor**: Very high — "I just built a data pipeline on their website"
**Lead**: High — natural funnel to "let's do this for real"
**Effort**: High — ~500 lines JS + ~250 lines CSS

---

### Feature 5: Academy Challenge Arena

**Page**: Academy (`academy.astro`)
**Location**: New section "Test Your Skills"

**Behavior**:
- 3-5 mini SQL/data challenges with increasing difficulty:
  1. "Select all customers from Istanbul" (basic SELECT + WHERE)
  2. "Find total sales per region" (GROUP BY)
  3. "Join orders with customers" (JOIN)
  4. "Find top 3 products by revenue" (ORDER BY + LIMIT)
  5. "Calculate running total" (window function — bonus)
- Each challenge:
  - Shows a small table preview (sample data)
  - Code editor area (styled textarea with monospace font)
  - "Run" button → client-side SQL evaluation
  - Correct: green checkmark + "Nice!" animation + next challenge unlocked
  - Wrong: hint shown, try again
- Timer (optional, display only — no pressure)
- Completion: "You solved X/5 — you're ready for the real thing!" → Apply Now CTA

**Technical**:
- Component: `ChallengeArena.astro`
- Client-side SQL engine: `sql.js` (SQLite compiled to WASM, ~1MB)
- Pre-loaded with small sample datasets (customers, orders, products)
- Query validation: compare result set against expected output
- Code editor: styled `<textarea>` with basic syntax highlighting (regex-based)
- No external code editor library (keep bundle small)

**Wow factor**: Medium-High — interactive coding is impressive on a corporate site
**Lead**: High — "I can do this" → Academy application
**Effort**: High — ~400 lines JS + sql.js integration + ~200 lines CSS

---

### Feature 4: Live SQL Playground — "Talk to Your Data"

**Page**: Products — Talk to Your Data (`products/talk-to-your-data.astro`)
**Location**: Dedicated demo section

**Behavior**:
- Split-screen interface:
  - Left: Natural language input ("Show me monthly sales by region")
  - Right: Generated SQL + result table/chart
- Pre-defined query mappings (10-15 natural language → SQL pairs)
- Fuzzy matching: user input matched against known queries via keyword similarity
- If no match: "I can handle more complex queries in a live demo — let's talk"
- Sample dataset: retail/sales data (3-4 tables, ~50 rows each)
- Chart toggle: Table view ↔ Bar chart ↔ Line chart
- Typewriter effect on SQL generation (simulates AI thinking)

**Technical**:
- Component: `SQLPlayground.astro`
- Client-side SQL engine: `sql.js` (shared with Academy Challenge Arena)
- NL matching: keyword extraction + cosine similarity against predefined query templates
- Chart rendering: SVG-based (vanilla JS, same pattern as ROI Calculator charts)
- Typewriter effect: CSS animation + JS character-by-character reveal
- Responsive: Stacked layout on mobile (input on top, results below)

**Wow factor**: Very high — "I just talked to a database on their website"
**Lead**: Very high — direct showcase of the product's value
**Effort**: Very high — ~600 lines JS (NL matching + SQL + charts) + ~250 lines CSS

---

## Architecture

### File Structure

```
src/
  components/
    gamification/
      EasterEggTerminal.astro      # Phase 1 — Global
      DataFlowStorytelling.astro   # Phase 1 — Data Platforms
      ProductFitRecommender.astro  # Phase 1 — Products
      DataMaturityQuiz.astro       # Phase 2 — Solutions
      ROICalculator.astro          # Phase 2 — Solutions
      ReadingPaths.astro           # Phase 2 — Insights
      ProductConstellation.astro   # Phase 3 — Products
      PipelineBuilder.astro        # Phase 3 — Data Platforms
      ChallengeArena.astro         # Phase 3 — Academy
      SQLPlayground.astro          # Phase 3 — Talk to Your Data
```

### Shared Patterns

- All components use scoped `<style>` blocks
- All interactive JS is in `<script>` tags within Astro components (client-side only)
- Color tokens from `global.css` (`var(--clr-primary)`, `var(--grad-brand)`, etc.)
- Animation pattern: `anim-fade-up` + `visible` class via IntersectionObserver
- CTA pattern: `btn btn-primary btn-pill` class
- Responsive breakpoint: 768px
- No external JS dependencies except `sql.js` for Phase 3 features (5, 4)

### Performance Budget

- Phase 1: <5KB JS per component (inline, no bundle)
- Phase 2: <10KB JS per component
- Phase 3: <15KB JS per component + sql.js (~1MB, lazy-loaded only on Academy/SQL pages)

---

## Success Metrics

- **Wow**: Social shares, "how did you do this?" inquiries, time spent on interactive sections
- **Lead**: Contact form submissions from gamification CTAs (trackable via UTM or referrer)
- **Engagement**: Pages per session increase, bounce rate decrease, return visits

---

## Out of Scope

- User accounts, authentication, server-side state
- External API calls, third-party analytics integrations
- A/B testing infrastructure
- CMS integration for dynamic content
- Native mobile app considerations
