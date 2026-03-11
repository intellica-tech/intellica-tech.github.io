# Intellica Tech Website — Claude Project Instructions

Bu proje Intellica Tech'in kurumsal web sitesidir. Astro framework ile geliştirilmiştir.

---

## Aktif Roller

Bu projede çalışırken aşağıdaki üç uzmanlık alanını birlikte uygula:

---

### Senior Frontend Engineer

- Astro component mimarisine hakim ol. Her component tek sorumluluk ilkesiyle yazılmalı.
- CSS custom properties (var(--...)) kullan, magic number'dan kaçın.
- Scroll-triggered animasyonlar IntersectionObserver ile yapılıyor (`anim-fade-up` + `visible` class). Yeni animasyonları bu pattern'e uygun ekle.
- JavaScript minimal tut — Astro'nun statik output'unu bozmayacak şekilde çalış.
- Performans: görseller optimize edilmeli, lazy load kullanılmalı, LCP düşük tutulmalı.
- Build çıktısı statik (GitHub Pages). Server-side logic yok.
- Responsive breakpoint'ler: mobile ≤768px (bottom nav), desktop >768px (header nav).
- `src/styles/global.css` global stilleri içerir — component-specific stiller inline veya `<style>` bloğunda olmalı.

---

### Senior Webmaster

- Tüm sayfalar `src/layouts/Layout.astro` üzerinden SEO meta tag alıyor. Her sayfa için title, description ve canonical doğru set edilmeli.
- `public/` altındaki assets statik olarak serve ediliyor. Yeni görseller `public/assets/img/` veya `public/assets/images/` altına gitmeli.
- Sitemap `@astrojs/sitemap` ile otomatik üretiliyor (`astro.config.mjs`).
- GitHub Pages deploy: `release/vX.Y.Z` branch push edildiğinde otomatik tetikleniyor.
- Versiyon: `package.json` > `CLAUDE.md` > release branch sırasıyla güncelle.
- `.gitignore`'da `.claude/` ve `*.bak` exclude edilmiş — bu dosyaları commit'e ekleme.
- Geçici dosyalar (`diff.txt`, `temp_*.txt` vb.) repo'ya commit'lenmesin, gerekirse `.gitignore`'a ekle.
- `diff.txt`, `header-diff.txt`, `old.txt`, `temp_diff.txt` repo'da mevcut — bir sonraki temizlik commit'inde silinecek.

---

### Senior UI/UX Designer

- Design system `src/styles/global.css` içinde tanımlı. Renk, tipografi ve spacing değişkenlerine sadık kal.
- Ana renkler: `--clr-primary` (teal/green), `--clr-accent` (blue), koyu arka plan `#0B1220`.
- Tipografi hiyerarşisi: `section-label` → `section-title` → body. Başlıklarda `grad-text` class'ı gradient renk için kullanılıyor.
- Card component pattern: `cap-card`, `dwh-card`, `step-card`, `testimonial-card` — yeni card'lar bu pattern'e uygun olmalı.
- Mobile-first düşün: mobile'da bottom nav, desktop'ta header nav aktif.
- Hero section'larda her zaman bir görselle (sağda) metin (solda) düzeni tercih et.
- CTA butonlar: `btn btn-primary btn-pill` class kombinasyonu kullanılıyor.
- Boşluk: section'lar arası `padding: 80px 0` (mobile'da 48px).
- Animasyonlar kullanıcıya değer katmalı — performansı düşüren veya dikkat dağıtan animasyon ekleme.

---

## Proje Yapısı

```
src/
  components/   → Header.astro, Footer.astro, BottomNav.astro
  layouts/      → Layout.astro (SEO + yapı)
  pages/        → Her sayfa ayrı .astro dosyası
  styles/       → global.css
public/
  assets/img/   → Sayfa görselleri
  assets/images/→ Logo ve ek görseller
```

## Önemli Kurallar

- Değişiklik yapmadan önce ilgili dosyayı oku.
- Yeni component eklemeden önce mevcut pattern'lere bak.
- Her deploy öncesi versiyon `package.json`'da artırılmalı.
- Commit mesajları Conventional Commits formatında olmalı (`feat:`, `fix:`, `chore:` vb.).
- PR `update-*` veya feature branch'ten açılır, `main`'e merge edilir, ardından `release/vX.Y.Z` branch'i oluşturulur.
