---
name: senior-frontend-engineer
description: Activates senior frontend engineering mode for Astro/CSS/JS work. Use when writing components, fixing layout issues, optimizing performance, working with animations, or any frontend code task on this project.
user-invocable: true
---

# Senior Frontend Engineer — Intellica Tech

Bu projede frontend geliştirme yaparken aşağıdaki standartları uygula.

## Proje Stack

- **Framework**: Astro (static output, no SSR)
- **Styling**: Vanilla CSS with custom properties (`src/styles/global.css`)
- **JavaScript**: Minimal vanilla JS, no framework
- **Deploy target**: GitHub Pages (static files only)

## Component Kuralları

- Her `.astro` dosyası tek bir sorumluluğa sahip olmalı
- Component'lere özgü stiller `<style>` bloğunda, global değişiklikler `global.css`'de
- Yeni component eklemeden önce `src/components/` altındaki mevcut pattern'lere bak
- `src/layouts/Layout.astro` tüm sayfaların temel layout'u — doğrudan değiştirme, miras al

## CSS Standartları

- Magic number kullanma, her zaman `var(--...)` custom property kullan
- Mevcut renk değişkenleri: `--clr-primary`, `--clr-accent`, `--clr-dark`, `--clr-light-text`
- Spacing: `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`
- Responsive: mobile-first, breakpoint `768px`
  - `≤768px`: bottom nav aktif, tek sütun layout
  - `>768px`: header nav aktif, çok sütun layout

## Animasyon Sistemi

Scroll-triggered animasyon pattern — mevcut sisteme uygun ekle:

```html
<div class="my-element anim-fade-up">...</div>
```

CSS zaten tanımlı:
```css
.anim-fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.anim-fade-up.visible { opacity: 1; transform: translateY(0); }
```

IntersectionObserver script `Layout.astro` içinde — yeni element eklediğinde sadece `anim-fade-up` class eklemek yeterli.

## Performans Kuralları

- Görseller `public/assets/img/` altında, `<img loading="lazy" />` kullan
- Hero görselleri hariç tüm görseller lazy load
- Yeni JavaScript eklerken bundle size artışını göz önünde bulundur
- CSS animasyonlar `will-change` gerektirmiyorsa kullanma

## Mevcut UI Pattern'leri

| Pattern | Class |
|---|---|
| Capability card | `cap-card anim-fade-up` |
| DWH/platform card | `dwh-card` |
| Step card | `step-card` |
| Testimonial | `testimonial-card` |
| CTA button | `btn btn-primary btn-pill btn-lg` |
| Section label | `section-label` |
| Section title | `section-title` |
| Gradient text | `grad-text` |
| Grid layouts | `grid-2`, `grid-3`, `grid-4`, `grid-5` |

## Sık Yapılan Hatalar — Yapma

- `!important` kullanma
- Inline `style=""` ile layout yönetme (sadece renk/gradient için kabul edilebilir)
- `px` yerine `rem`/`em` kullanmayı unutma (font-size için)
- Yeni bir animasyon sistemi yazmak yerine mevcut `anim-fade-up` pattern'ini kullan

## Dosya Yapısı

```
src/
  components/
    Header.astro     ← Desktop nav + dropdown
    BottomNav.astro  ← Mobile nav
    Footer.astro     ← Footer linkleri
  layouts/
    Layout.astro     ← SEO + global script + nav logic
  pages/
    index.astro      ← Ana sayfa
    products/        ← Ürün alt sayfaları
    insights/        ← Blog/insight alt sayfaları
  styles/
    global.css       ← Tüm global stiller ve custom properties
```
