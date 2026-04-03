# Intellica Tech Website — Claude Project Instructions

Bu proje Intellica Tech'in kurumsal web sitesidir. Astro framework ile geliştirilmiştir.
GitHub Pages üzerinde statik olarak yayınlanmaktadır.

---

## Branch & Workflow

### Branch Yapısı

| Branch | Amaç |
|---|---|
| `main` | Aktif geliştirme — **her zaman buradan çalış** |
| `release/vX.Y.Z` | Deploy branch'i — sadece release için oluştur, doğrudan commit atma |

### Çalışma Akışı

1. Her oturuma `main`'de başla: `git checkout main && git pull origin main`
2. Değişiklikleri `main`'e commit et
3. Kullanıcı **"release oluştur"** dediğinde → Adım A
4. Kullanıcı **"yayınla"** dediğinde → Adım B

---

#### Adım A — "release oluştur" komutu

> Versiyon numarasını artır ve commit et. Branch oluşturma.

1. `package.json` içindeki `"version"` alanını artır (patch: `1.0.11` → `1.0.12`)
2. `chore: bump version to X.Y.Z` mesajıyla commit et (`main` branch'inde)
3. Kullanıcıya yeni versiyonu bildir: *"Release v1.0.12 hazır, yayınlamak için 'yayınla' de."*

**Versiyon artırma kuralı:**
- `patch` (1.0.X): hata düzeltme veya küçük içerik güncellemesi
- `minor` (1.X.0): yeni sayfa veya önemli yeni özellik
- `major` (X.0.0): büyük yeniden yapılanma (nadiren)

---

#### Adım B — "yayınla" komutu

> `package.json`'daki mevcut versiyona göre release branch oluştur ve push et.

1. `package.json`'dan mevcut versiyonu oku
2. `main`'den `release/vX.Y.Z` branch'i oluştur
3. `origin/release/vX.Y.Z`'ye push et
4. `main`'e geri dön
5. Kullanıcıya bildir: *"release/vX.Y.Z push edildi, GitHub Actions deploy başlatıldı."*

```bash
# Örnek komut dizisi (v1.0.12 için)
git checkout main
git checkout -b release/v1.0.12
git push origin release/v1.0.12
git checkout main
```

### Commit Formatı (Conventional Commits)

`feat:` · `fix:` · `chore:` · `content:` · `style:`

### Kritik Kurallar

- `release/*` branch'ine **doğrudan commit atma**
- `git push --force` **asla kullanma**
- Geçici dosyalar (`*Kopya*`, `*.cjs` scriptler, `temp_*`, `diff.txt`) commit'e girmesin — `.gitignore`'a ekle
- `.claude/` dizini `.gitignore`'da — worktree branch'leri otomatik temizlenir

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
- `.gitignore`'da `.claude/` ve `*.bak` exclude edilmiş — bu dosyaları commit'e ekleme.

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

## Genel Kurallar

- Değişiklik yapmadan önce ilgili dosyayı oku.
- Yeni component eklemeden önce mevcut pattern'lere bak.
- Her deploy öncesi versiyon `package.json`'da artırılmalı.
