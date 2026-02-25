# Intellica — New Astro Website
Intellica (kuruluş: 2006) bir Data & AI şirketidir. 20+ ülkede aktif, 200+ büyük ölçekli proje, 100+ kurumsal referans ve 450+ uzman teknik kadrosu bulunmaktadır. Mevcut HTML tabanlı siteyi, 2025–2026 standartlarına uygun, sade, modern ve dünyaya hitap eden bir Astro sitesine dönüştürüyoruz.

## Tasarım Yönü
Renk paleti: Turkuaz #00C896 → Mavi #009FE3 gradyanı (mevcut marka rengi)
Yazı tipi: Inter (Google Fonts) — kurumsal ve modern
Stil: Dark-first hero, glassmorphism kartlar, beyaz seksiyonlar, subtil animasyonlar
Feel: Palantir / Databricks / Vercel vibes — sade ama güçlü, kurumsal güven verici
)
## Proposed Changes
Project Setup
[NEW] Astro project @ C:\Users\NAZLIBAYAR\Documents\website-naz
Astro 5.x projesi npm create astro@latest ./ ile kurulacak. Daha sonra aşağıdaki klasör yapısı oluşturulacak:

website-naz/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Temel layout (Header + Footer)
│   ├── components/
│   │   ├── Header.astro           # Mega-menu navigasyon
│   │   ├── Footer.astro           # Footer
│   │   ├── Hero.astro             # Anasayfa hero bölümü
│   │   └── ui/                    # Button, Card, Badge vb.
│   ├── pages/
│   │   ├── index.astro            # Anasayfa
│   │   ├── products.astro         # Ürünler
│   │   ├── solutions.astro        # Çözümler
│   │   ├── about.astro            # Hakkımızda (Şirket)
│   │   └── contact.astro          # İletişim
│   └── styles/
│       └── global.css             # Design tokens + global styles
└── public/
    ├── assets/                    # Kopyalanan logo, icon, görsel varlıklar
    └── favicon.ico
Ana Sayfa (index.astro)
Aşağıdaki bölümler sırayla yer alacak:

Hero — Koyu arka plan (gradient veya görsel), büyük başlık, CTA butonları
Capabilities (Kabiliyetler) — 5 kart grid: Modern Data Platforms, BI & Analytics, AI/ML, Data Governance, Danışmanlık
Global Impact — Sayaçlı metrik barı (20+ ülke, 200+ proje, %40 büyüme, 450+ uzman)
Trusted Clients — Logo grid (Akbank, Vodafone, Turkcell, ING vb.)
Products Teaser — 3 kategorili ürün kartları (Veri Modelleri, Platform & Governance, AI Ürünleri)
DWH / Data Platform Transformation — 3 kart (DWH Modernizasyon, Entegrasyon, Semantic Layer)
AI Solutions — 2x2 kart (Müşteri 360, Talep Tahmini, Document Answers, Defect Solver)
CTA Strip — "Demo Talep Edin" aksiyonu
Footer
Ürünler Sayfası (products.astro)
9 ürün kartı 3'lü grid ile: IFDM, ITDM, HRDM (Veri Modelleri), ICC, ReTouch, Retable (Platform), Talk To, Blue Octopus, VAR (AI)

Çözümler Sayfası (solutions.astro)
Kabiliyetler → Hizmetler → AI Portföy bölümleri / AI senaryoları (Müşteri 360, Satın Alma Olasılığı, Document Answers, Defect Solver, Talep Tahmini, Çağrı Merkezi vb.)

Şirket Sayfası (about.astro)
Biz kimiz + Tarihçe timeline (2006–2022)

İletişim Sayfası (contact.astro)
İletişim bilgileri + Form

Stil ve Tasarım Sistemi (global.css)
CSS custom properties (design tokens)
Inter font from Google Fonts
Dark hero section, light content sections
Glassmorphism cards: subtle blur + border
Gradient text effects
Smooth scroll animations (Intersection Observer)
Mobile-first responsive grid
Verification Plan
Automated Build Test
powershell
# Projeyi build et (hata olmaması gerekir)
cd C:\Users\NAZLIBAYAR\Documents\website-naz
npm run build
Dev Server Görsel Kontrol
powershell
cd C:\Users\NAZLIBAYAR\Documents\website-naz
npm run dev
# Tarayıcıda http://localhost:4321 açılır
Kontrol edilecekler:

 Anasayfa açılıyor ve tüm bölümler görünüyor
 Header navigasyon çalışıyor (mega-menu açılıyor)
 Tüm pages (/, /products, /solutions, /about, /contact) 200 döndürüyor
 Mobil görünüm (devtools ile 375px'de test)
 Animasyonlar çalışıyor (scroll ile counter sayıyor, kartlar hover)
 Logo ve görseller görüntüleniyor