# SEO Redirect Strategy — Old URLs Migration

> Date: 2026-04-08
> Status: Pending (blocked by multi-language decision)

## Problem

Google still indexes old URLs from the previous website. New site has different URL structure and Turkish (`/tr/*`) paths were removed. Visitors from search results hit 404 pages.

## Analytics Data (Old URLs Still Getting Traffic)

### Sessions & Visitors

| Old Path | Sessions | Unique Visitors | Avg. Time |
|---|---|---|---|
| `/` | 380 | 272 | 39s |
| `/tr` | 206 | 140 | 25s |
| `/about-us` | 73 | 39 | 33s |
| `/tr/about-us` | 63 | 49 | 27s |
| `/our-products` | 50 | 31 | 3m 18s |
| `/tr/our-products` | 46 | 30 | 46s |
| `/career` | 38 | 35 | 41s |
| `/tr/career` | 29 | 26 | 1m 42s |
| `/contact` | 22 | 22 | 20s |
| `/tr/contact` | 18 | 14 | 24s |
| `/clients` | 15 | 11 | 49s |
| `/tr/academy` | 15 | 13 | 28s |
| `/tr/our-services` | 14 | 13 | 53s |
| `/our-services` | 13 | 12 | 20s |
| `/tr/clients` | 10 | 10 | 34s |
| `/academy` | 8 | 7 | 49s |
| `/business-benefits` | 5 | 4 | 51s |
| `/tr/business-benefits` | 3 | 3 | 18s |
| `/privacy-policy` | 1 | 1 | 23s |
| `/demo` | 1 | 1 | — |
| `/cookie-policy` | 1 | 1 | — |
| `/terms-and-conditions` | 1 | 1 | 10s |
| `/tr/privacy-policy` | 1 | 1 | 4s |

### Page Hits (Includes Bot Traffic)

Notable entries: `/robots.txt` (102), `/wp-admin` (76), `/blog` (65), `/wordpress` (64), `/sitemap.xml` (42)

## Current Site URL Structure (New)

```
/                → index (home)
/about           → about page (was /about-us)
/products        → products listing (was /our-products)
/products/*      → individual product pages
/solutions       → solutions page (was /our-services)
/data-platforms   → data platforms page
/contact         → contact page (unchanged)
/careers         → careers page (was /career)
/clients         → clients page (unchanged)
/academy         → academy page (unchanged)
/partners        → partners page (new)
/insights        → insights/blog (was /blog)
/insights/*      → individual insight articles
/privacy         → privacy policy (was /privacy-policy)
/cookies         → cookie policy (was /cookie-policy)
/terms           → terms (was /terms-and-conditions)
/404             → custom 404 page
```

## Redirect Map — English URL Renames (Permanent)

These are definitive regardless of multi-language support:

| Old URL | New URL | Reason |
|---|---|---|
| `/about-us` | `/about` | Name shortened |
| `/our-products` | `/products` | Name shortened |
| `/our-services` | `/solutions` | Name + concept changed |
| `/career` | `/careers` | Singular → plural |
| `/privacy-policy` | `/privacy` | Name shortened |
| `/cookie-policy` | `/cookies` | Name shortened |
| `/terms-and-conditions` | `/terms` | Name shortened |
| `/blog` | `/insights` | Concept changed |
| `/business-benefits` | `/solutions` | Page merged |
| `/demo` | `/contact` | Page merged |

## Redirect Map — Turkish `/tr/*` Paths (Depends on Multi-Language)

Decision: Multi-language support will be added. Turkish paths will return.
Strategy: Implement redirects AFTER multi-language is built so old `/tr/*` paths redirect directly to new `/tr/*` paths (single redirect, no chain).

Expected mapping when Turkish is ready:

| Old Turkish URL | Expected New URL |
|---|---|
| `/tr` | `/tr` |
| `/tr/about-us` | `/tr/about` |
| `/tr/our-products` | `/tr/products` |
| `/tr/our-services` | `/tr/solutions` |
| `/tr/career` | `/tr/careers` |
| `/tr/contact` | `/tr/contact` |
| `/tr/clients` | `/tr/clients` |
| `/tr/academy` | `/tr/academy` |
| `/tr/our-services` | `/tr/solutions` |
| `/tr/business-benefits` | `/tr/solutions` |
| `/tr/privacy-policy` | `/tr/privacy` |

## Implementation Method

Astro `redirects` in `astro.config.mjs` — generates static HTML files with `<meta http-equiv="refresh">` for GitHub Pages compatibility.

## Action Plan

1. **Phase 1 (Now):** Implement English URL redirects only
2. **Phase 2 (After multi-language):** Add Turkish redirects from old `/tr/*` to new `/tr/*` paths
3. **Phase 3:** Submit updated sitemap to Google Search Console, request re-indexing

## WordPress Bot Traffic

URLs like `/wp-admin`, `/wordpress`, `/wp`, `/backup`, `/wp-includes` are automated vulnerability scanners. No action needed — 404 page handles them.
