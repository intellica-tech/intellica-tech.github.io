---
name: senior-uiux
description: Activates senior UI/UX design mode. Use when designing new sections, reviewing layouts, working on visual hierarchy, improving user experience, mobile responsiveness, or any design-related task on this project.
user-invocable: true
---

# Senior UI/UX Designer — Intellica Tech

Bu projede tasarım kararları alırken ve UI geliştirirken aşağıdaki design system'i uygula.

## Marka Kimliği

Intellica, kurumsal veri ve AI şirketidir. Tasarım dili:
- **Profesyonel ve güvenilir** — fazla yaratıcı/eğlenceli kaçmamalı
- **Modern ve teknolojik** — gradyanlar, koyu temalar, temiz layout
- **Açık ve okunabilir** — bilgi yoğun sayfalarda içerik öncelikli

## Renk Paleti

```css
/* Ana renkler */
--clr-primary: #10B981;      /* Teal/Green — CTA, vurgu */
--clr-accent: #3B82F6;       /* Blue — ikincil vurgu */
--clr-dark: #0B1220;         /* Hero arka planı */

/* Metin renkleri */
--clr-light-text: #111827;   /* Açık section'larda başlık */
--clr-body: #4B5563;         /* Body text */

/* Gradyan kombinasyonları */
/* Teal → Blue:  #10B981 → #3B82F6 */
/* Blue → Teal:  #3B82F6 → #14B8A6 */
/* Sky → Blue:   #0EA5E9 → #2563EB  */
```

## Tipografi Hiyerarşisi

```
section-label  → küçük, uppercase, pill badge (Capabilities, Trusted By vb.)
section-title  → h2, büyük başlık, bazen grad-text accent ile
body text      → #4B5563, 1.6 line-height
```

Başlıklarda gradient kullanımı:
```html
<h2 class="section-title">
  Enterprise <span class="grad-text">AI Solutions</span>
</h2>
```

## Layout Prensipleri

### Hero Section
- Sol: Metin (section-label + h1 + desc + CTA)
- Sağ: Görsel (logo/illustration/abstract)
- Arka plan: koyu (`--clr-dark`)
- Desktop'ta iki sütun, mobile'da tek sütun (görsel üstte küçük)

### Section Yapısı
```
section.section.section--white (veya section--light, section--dark)
  div.container
    div.text-center.anim-fade-up    ← başlık bloğu
      div.section-label
      h2.section-title
      p (açıklama)
    div.grid-N.anim-fade-up         ← içerik grid'i
      ...kartlar/içerik
```

### Grid Sistemi
| Class | Sütun | Kullanım |
|---|---|---|
| `grid-2` | 2 | Yan yana iki büyük blok |
| `grid-3` | 3 | Özellik/hizmet kartları |
| `grid-4` | 4 | Metrik sayıları |
| `grid-5` | 5 | Capability kartları |

## Component Tasarım Standartları

### Kart Tasarımı
Tüm kartlar şu pattern'i izler:
- Beyaz/açık arka plan, hafif gölge
- Rounded corners (`border-radius: 12px` veya `16px`)
- Üstte renkli ikon alanı (gradient arka planlı)
- Başlık + kısa açıklama
- Hover'da subtle scale veya border rengi değişimi

### CTA Butonlar
```html
<!-- Birincil (koyu section'da) -->
<a class="btn btn-primary btn-pill btn-lg">Metni Yaz</a>

<!-- İkincil link -->
<a class="hero-sublink">Explore AI Solutions →</a>
```

### Logo/Client Grid
- `logo-tile` class, border ve padding ile kutu içinde
- Logo'lar grayscale, hover'da tam renk geçiş
- `logo-tile--lg` büyük/önemli logolar için

## Spacing Sistemi

```
Section padding:     80px top/bottom (mobile: 48px)
Container max-width: 1200px
Card padding:        24px-32px
Grid gap:            24px-32px
```

## Mobile UX Kuralları

- Bottom navigation: Home, Products, AI Solutions, Data Platforms, More
- "More" dropdown'ı diğer sayfalar için
- Tüm tap target'lar minimum `44x44px`
- Kart grid'leri mobile'da tek sütuna düşmeli
- Hero görsel mobile'da küçülmeli veya gizlenmeli (içerik öncelikli)

## Section Renk Alternasyonu

Sayfa akışında section'lar arasındaki kontrast:
```
hero (section--dark → koyu)
capabilities (section--white → beyaz)
global impact (section--light → açık gri)
trusted clients (section--white → beyaz)
data platforms (section--light → açık gri)
...
cta strip (section--dark → koyu)
footer (açık gri)
```

## Görseller ve İkonlar

- Hero görselleri: abstract/teknolojik görsel (AI, data, network temalı)
- Capability ikonlar: Intellica cam logo ikonu (`intellica_camlogo_icibos.png`)
- Ürün görselleri: `public/assets/img/` altında ürün başına bir hero görseli
- Partner/client logoları: mümkünse SVG

## UX Checklist — Yeni Section Eklerken

- [ ] Section label eklenmiş mi? (bağlam için)
- [ ] Başlık hiyerarşisi doğru mu? (h2 > h3 > p)
- [ ] CTA var mı? (her section bir sonraki adıma yönlendirmeli)
- [ ] Mobile görünüm test edildi mi?
- [ ] `anim-fade-up` animasyon eklendi mi?
- [ ] Renk kontrast oranı yeterli mi? (WCAG AA minimum)
- [ ] Boş/yüklenmemiş görsel durumu düşünüldü mü?
