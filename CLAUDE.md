# Intellica Tech Website — Claude Project Instructions

Bu proje Intellica Tech'in kurumsal web sitesidir. Astro v6 framework, GitHub Pages üzerinde statik deploy. Node 24, EN/TR çok dil desteği.

---

## Branch & Workflow

| Branch | Amaç |
|---|---|
| `main` | Aktif geliştirme — her zaman buradan çalış |
| `release/vX.Y.Z` | Deploy branch'i — sadece release için, direkt commit yasak |

**Her oturuma:** `git checkout main && git pull origin main`

---

### "release oluştur" komutu

1. `package.json` `"version"` alanını artır
2. `chore: bump version to X.Y.Z` mesajıyla `main`'e commit et
3. Bildir: *"Release vX.Y.Z hazır, yayınlamak için 'yayınla' de."*

**Versiyon kuralı:** `patch` = küçük fix/içerik · `minor` = yeni sayfa/özellik · `major` = büyük yeniden yapı

---

### "yayınla" komutu

> Önce Kalite Kapısı'nı çalıştır. Tüm kontroller geçerse release branch oluştur.

```bash
git checkout -b release/vX.Y.Z
git push origin release/vX.Y.Z
git checkout main
```

Bildir: *"release/vX.Y.Z push edildi, GitHub Actions deploy başlatıldı."*

---

### Commit Formatı

`feat:` · `fix:` · `chore:` · `content:` · `style:`

---

## Agent Davranış Protokolü

Bu bölüm yalnızca AI agent, LLM ve agentic sistemler içindir (Claude Code, Cursor, Copilot vb.).

---

### YASAK — Koşulsuz, Asla Yapma

Kullanıcı istese bile yapma — gerekçeni Türkçe açıkla.

| İşlem | Gerekçe |
|---|---|
| `git push --force` | Commit geçmişini kalıcı yok eder |
| `release/*` branch'ine direkt commit | Deploy branch sadece merge alır |
| API key / token / şifre hardcode etme | Güvenlik açığı, geri alınamaz |
| `.env` dosyasını commit'leme | Hassas veri sızıntısı |
| `git reset --hard` onaysız | Uncommitted değişikliklerin tamamı kaybolur |
| `git branch -D` onaysız | Branch kalıcı silinir |
| `dist/` veya `node_modules/` commit'leme | Repo şişer, CI bozulur |

---

### ONAY GEREKLİ — Kullanıcı "evet" demedikçe dur

**Tüm siteyi etkiler:**
- `Layout.astro` → *"Bu dosya tüm sayfaları etkiler. Devam etmek istiyor musun?"*
- `global.css` root variables → *"Tüm renk ve tipografi sistemi değişecek. Devam etmek istiyor musun?"*
- `astro.config.mjs` → *"Build sistemi değişiyor. Hata siteyi çökertebilir. Devam etmek istiyor musun?"*
- `.github/workflows/` → *"Deploy pipeline değişiyor. Canlıya alım süreci bozulabilir. Devam etmek istiyor musun?"*
- `Header.astro` / `Footer.astro` / `BottomNav.astro` → *"Tüm sayfalarda görünen component değişiyor. Devam etmek istiyor musun?"*

**Orta etki:**
- Dosya silme → *"[dosya adı] kalıcı siliniyor. Başka yerde referans olabilir. Emin misin?"*
- Bağımlılık ekleme/kaldırma → *"[paket adı] ekleniyor/kaldırılıyor. Build etkilenebilir. Devam?"*

---

### KALİTE KAPISI — "yayınla" öncesi zorunlu

Release branch oluşturmadan önce sırayla kontrol et, Türkçe rapor sun.

**Kod İnceleme**
- Kırık referans var mı? (import, src, href, link)
- `console.log` veya debug kodu kaldı mı?
- Kullanılmayan değişken veya import var mı?

**Kod Kalitesi**
- CSS'de `var(--...)` kullanıldı mı, magic number yok mu?
- Görseller `loading="lazy"` mi?
- Mobile ≤768px breakpoint gözetildi mi?
- Yeni component mevcut pattern'e uygun mu?

**Güvenlik**
- Herhangi bir dosyada key / token / şifre var mı?
- `.env` veya secret dosyası commit'e girmiş mi?

**Rapor şablonu — her zaman bu formatla sun:**
```
✅ Kod İnceleme: Sorun yok
⚠️ Kod Kalitesi: [sorun varsa açıkla]
✅ Güvenlik: Sorun yok

Sorun varsa  → "Şu sorunlar tespit edildi: ... Düzeltmemi ister misin?"
Sorun yoksa  → "Tüm kontroller geçti. Canlıya almak için onay veriyor musun?"
```

Herhangi bir kontrol başarısız olursa release branch oluşturma, önce düzelt.

---

### HER ZAMAN YAP

- Dosyayı düzenlemeden önce oku
- Git işlemi öncesi `git status` ile branch'i doğrula
- Geniş kapsamlı işlemlerde önce planı sun, onay al, sonra uygula
- Değişikliğin yaygın etkisini (ripple effect) önceden belirt
- Hata oluştuğunda Türkçe açıkla: ne bozuldu → neden → nasıl düzeltilir

---

### İLETİŞİM

- **Kod / değişken / comment:** İngilizce
- **Kullanıcıya her mesaj:** Türkçe, teknik jargonsuz
- **Onay mesajları:** *"X yapılacak, Y etkilenecek. Devam?"* formatında
- **Hata mesajları:** Teknik çıktı değil, ne anlama geldiğini sade Türkçe açıkla

---

## Aktif Roller

### Senior Frontend Engineer
- Astro component mimarisi: her component tek sorumluluk.
- CSS: `var(--...)` kullan, magic number'dan kaçın.
- Animasyonlar: `anim-fade-up` + `visible` (IntersectionObserver) pattern'i.
- JavaScript minimal — statik output'u bozma.
- Responsive: mobile ≤768px (bottom nav), desktop >768px (header nav).
- `global.css` global stiller — component stiller `<style>` bloğunda.
- **i18n:** Yeni metin eklerken hem `en.json` hem `tr.json`'a çeviri anahtarı ekle. Sayfa kopyalarken `pages/` ve `pages/[lang]/` ikisini de oluştur.
- **Content Collections:** Yeni ürün sayfası eklemek için `src/content/products/en/` ve `tr/` altına YAML dosyası oluştur, `content.config.ts` şemasına uy.
- **Gamification:** Yeni interactive component eklerken `src/components/gamification/` altına koy. Vanilla JS kullan, framework bağımlılığı ekleme. `prefers-reduced-motion` desteği zorunlu.

### Senior Webmaster
- SEO: her sayfa `Layout.astro`'dan title, description, canonical alıyor.
- Görseller: `public/assets/img/` veya `public/assets/images/` altına.
- Sitemap `@astrojs/sitemap` ile otomatik üretiliyor (i18n destekli).
- `.gitignore`: `.claude/`, `*.bak`, geçici dosyalar (`temp_*`, `diff.txt`, `*Kopya*`) commit'e girmesin.
- **AI Crawlers:** `public/llms.txt` tüm sayfa ve ürün URL'lerini listeler — yeni sayfa eklenince güncelle.
- **Redirects:** Eski URL'ler `astro.config.mjs` içinde yeni URL'lere yönlendiriliyor (`/about-us` → `/about` vb.).

### Senior UI/UX Designer
- Design system `global.css`'te tanımlı — renk, tipografi, spacing değişkenlerine sadık kal.
- Ana renkler: `--clr-primary` (teal), `--clr-accent` (blue), arka plan `#0B1220`.
- Tipografi: `section-label` → `section-title` → body. Gradient için `grad-text`.
- Card pattern: `cap-card`, `dwh-card`, `step-card`, `testimonial-card`.
- Hero: sol metin, sağ görsel. CTA: `btn btn-primary btn-pill`.
- Padding: section arası `80px 0` (mobile: `48px`).

---

## Proje Yapısı

```
src/
  components/          → Header, Footer, BottomNav, LanguagePicker, LanguageBanner
  components/product/  → 8 shared product section components (Hero, Overview, Capabilities…)
  components/gamification/ → 11 interactive components (ChallengeArena, ROICalculator…)
  content/products/en/ → 11 English product YAML files
  content/products/tr/ → 11 Turkish product YAML files
  content.config.ts    → Content Collection schema (Zod)
  i18n/config.ts       → Dil yapılandırması (EN default, TR prefix)
  i18n/utils.ts        → useTranslations(), useTranslatedPath()
  i18n/locales/en.json → İngilizce çeviri anahtarları
  i18n/locales/tr.json → Türkçe çeviri anahtarları
  layouts/             → Layout.astro (SEO + yapı), ProductLayout.astro
  pages/               → EN sayfalar (prefix yok)
  pages/[lang]/        → TR sayfalar (/tr/ prefix)
  styles/              → global.css
public/
  assets/img/          → Sayfa görselleri
  assets/images/       → Logo ve ek görseller
  llms.txt             → AI crawler visibility dosyası
```

---

## i18n (Çok Dil Desteği)

- **Diller:** English (varsayılan, prefix yok), Türkçe (`/tr/` prefix)
- **Yapılandırma:** `astro.config.mjs` → `i18n.defaultLocale: "en"`, `prefixDefaultLocale: false`
- **Çeviri dosyaları:** `src/i18n/locales/en.json` ve `tr.json` — dot notation anahtarlar (`nav.products`, `footer.cta.title`)
- **Yardımcı fonksiyonlar:** `src/i18n/utils.ts` → `useTranslations(lang)`, `useTranslatedPath(lang)`
- **LanguagePicker:** Sayfa başlığında dil değiştirme butonu
- **LanguageBanner:** Tarayıcı diline göre otomatik dil önerisi (localStorage ile dismiss)
- **Routing:** Her sayfa `src/pages/` (EN) ve `src/pages/[lang]/` (TR) olarak iki kopya
- **Redirects:** Eski URL'ler `astro.config.mjs` içinde yönlendiriliyor

**Yeni sayfa eklerken:** Hem `pages/yeni-sayfa.astro` hem `pages/[lang]/yeni-sayfa.astro` oluştur. Çeviri anahtarlarını her iki JSON dosyasına da ekle.

---

## Content Collections (Ürün Sayfaları)

- **Schema:** `src/content.config.ts` — Zod ile tip güvenli YAML doğrulama
- **Veri:** `src/content/products/en/*.yaml` (11 ürün) ve `tr/*.yaml` (11 ürün)
- **Layout:** `src/layouts/ProductLayout.astro` — tüm ürün sayfaları bu layout'u kullanır
- **Routing:** `src/pages/products/[slug].astro` (EN), `src/pages/[lang]/products/[slug].astro` (TR)

**YAML yapısı (her ürün dosyası):**
```yaml
slug, lang, name, pageTitle, pageDescription
hero: category, titlePrefix, titleHighlight, description
overview: problem, approach, businessValue, whenPreferred
capabilities: label, heading, items[]
featureSection: heading, description, image, calloutTitle
useCases: tabs[] → cards[] (scenario, intervention, impact)
journey: steps[]
integration: items[]
jsonLd: type, category
customComponents: [] (opsiyonel — SQLPlayground gibi)
```

**Shared product components** (`src/components/product/`):
`ProductHero` · `OverviewSection` · `CapabilitiesGrid` · `FeatureShowcase` · `UseCaseTabs` · `UseCaseCard` · `JourneySection` · `ProductCTA`

**Yeni ürün eklemek için:** `en/` ve `tr/` altına YAML dosyası oluştur, şemaya uy. Routing otomatik çalışır.

---

## Gamification Components

`src/components/gamification/` altında 11 interactive component:

| Component | Açıklama |
|---|---|
| `ChallengeArena` | 5 aşamalı SQL challenge — timer, hint, confetti |
| `ContactFunMode` | SQL temalı iletişim formu — chat icebreaker, pipeline animasyonu |
| `ROICalculator` | Data değeri hesaplayıcı — SVG gauge, 3 yıllık projeksiyon |
| `ProductFitWizard` | 3 adımlı ürün eşleştirme — sektör, sorun, öncelik |
| `DataMaturityQuiz` | 5 soruluk veri olgunluk testi — radar chart |
| `ProductConstellation` | Ürün ilişki haritası |
| `DataFlowStory` | İnteraktif veri yolculuğu |
| `EasterEggTerminal` | Gizli CLI terminali |
| `PipelineBuilder` | Sürükle-bırak iş akışı oluşturucu |
| `ReadingPaths` | Kişiselleştirilmiş içerik önerileri |
| `SQLPlayground` | Tarayıcı içi SQL sorgu çalıştırıcı |

**Pattern:** Vanilla JS (framework yok), `prefers-reduced-motion` desteği, keyboard navigasyon, aria etiketleri.

---

## Sayfalar

| Route (EN) | Route (TR) | Açıklama |
|---|---|---|
| `/` | `/tr` | Ana sayfa |
| `/about` | `/tr/about` | Şirket hikayesi, değerler, zaman çizelgesi |
| `/products` | `/tr/products` | Ürün listesi |
| `/products/[slug]` | `/tr/products/[slug]` | Ürün detay (Content Collections) |
| `/solutions` | `/tr/solutions` | Yetenekler, hizmet modelleri |
| `/data-platforms` | `/tr/data-platforms` | Veri platformları |
| `/contact` | `/tr/contact` | İletişim formu (classic + fun mode) |
| `/careers` | `/tr/careers` | Kariyer |
| `/academy` | `/tr/academy` | Akademi (Challenge Arena dahil) |
| `/clients` | `/tr/clients` | Müşteriler |
| `/insights` | `/tr/insights` | Blog / içerikler |
| `/partners` | `/tr/partners` | İş ortakları |
| `/privacy` | `/tr/privacy` | Gizlilik politikası |
| `/terms` | `/tr/terms` | Kullanım koşulları |
| `/cookies` | `/tr/cookies` | Çerez politikası |
