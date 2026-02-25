# Mobile Bottom Navigation — Intellica Website (2025-2026)
Hamburger menü + slide-down mobile menüyü, tam uygulama hissi veren bottom navigation bar ile değiştirme planı. Mobil kullanıcılar siteyi rahatlıkla tek elle gezebilecek; masaüstü deneyimi değişmeyecek.

## 2025-2026 Standartları — Neden Bottom Nav?
Kriter	Hamburger	Bottom Nav
Thumb reachability	❌ Sol üst köşe	✅ Alt — tam başparmak bölgesi
Tap hedefi	⚠️ 3 çizgi, küçük	✅ Geniş, min 48×48px
Aktif sayfa belli	❌ Menü açmak lazım	✅ Her zaman görünür
Kognitif yük	❌ 2 adım (aç + tıkla)	✅ 1 adım
App hissi	❌ Web'e özgü	✅ iOS/Android ile aynı
2025-2026 standardı	❌ Eski nesil	✅ Material 3, iOS HIG
Design Sistemi
Renk & Stil
Arkaplan: rgba(3, 11, 22, 0.92) + backdrop-filter: blur(24px) — sitenin mevcut glassmorphism dili ile uyumlu
Aktif ikon: var(--clr-primary) (teal) rengi + dolu ikon + küçük gösterge çizgisi/pill
Pasif ikon: rgba(240,244,255,0.45) — soluk
Safe area: padding-bottom: env(safe-area-inset-bottom) — iPhone notch/dynamic island desteği
İkonlar (SVG inline)
🏠 Home — ev ikonu → /
📦 Products — grid/kutu ikonu → products panel açar
🔧 Solutions → /solutions
ℹ️ About → /about
✉️ Contact → /contact
NOTE

5 öğe tam limit. Google Material 3 ve Apple HIG standartlarına göre 3-5 arası optimal. Tüm 5 navigasyon öğesi kullanılacak.

## Products — Bottom Sheet (Drawer)
Products butonu tıklandığında hamburger açılmayacak; bunun yerine ekranın altından yukarı kayan bir bottom sheet açılacak. İçinde:

3 kategori başlığı (Data Models / Data Platform & Governance / AI Products)
9 ürün linki
"View All Products" butonu
## Proposed Changes
[MODIFY] 
Header.astro
Tüm mobil kısım (hamburger toggle + slide-down mobile-menu) silinecek. Yerine ayrı bir BottomNav.astro bileşeni referans alınacak.

Değişecek:

diff
- <!-- Mobile toggle -->
- <button id="mobile-toggle" class="mobile-toggle" ...>
-   <span></span><span></span><span></span>
- </button>
- <!-- Mobile Menu -->
- <div id="mobile-menu" class="mobile-menu"> ... </div>
- .mobile-toggle CSS
- .mobile-menu CSS
- .mobile-link CSS
Kalacak:

Desktop header ve mega menu — değişmeden kalır
@media (max-width: 900px) → sadece nav-desktop gizleme
[NEW] 
BottomNav.astro
Tamamen yeni bileşen. Sadece mobilde görünür (display: none on ≥900px).

Yapı:

<nav class="bottom-nav" role="navigation" aria-label="Mobile Navigation">
  <!-- 5 nav item -->
  <a href="/" class="bnav-item" data-page="home">
    <span class="bnav-icon"><!-- SVG --></span>
    <span class="bnav-label">Home</span>
  </a>
  <!-- Products: trigger bottom sheet -->
  <button class="bnav-item" id="bnav-products-btn">
    <span class="bnav-icon"><!-- SVG --></span>
    <span class="bnav-label">Products</span>
  </button>
  <!-- Solutions, About, Contact -->
  <!-- Products Bottom Sheet -->
  <div class="bottom-sheet" id="products-sheet" aria-modal="true">
    <div class="sheet-handle"></div>
    <div class="sheet-content">
      <div class="sheet-header">Products</div>
      <!-- Kategoriler ve ürünler -->
      ...
      <div class="sheet-overlay" id="sheet-overlay"></div>
    </div>
  </div>
</nav>
CSS özellikleri:

css
.bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom); /* iPhone notch */
  background: rgba(3, 11, 22, 0.92);
  backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  z-index: 1000;
}
/* Aktif göstergesi: üstte küçük pill */
.bnav-item.active::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 24px; height: 3px;
  background: var(--clr-primary);
  border-radius: 0 0 3px 3px;
}
/* Bottom Sheet — ekranın altından yukarı kaydırma */
.bottom-sheet {
  position: fixed;
  bottom: -100%;
  left: 0; right: 0;
  background: rgba(8, 15, 30, 0.98);
  border-radius: 20px 20px 0 0;
  transition: bottom 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1100;
}
.bottom-sheet.open { bottom: 64px; }
JS özellikleri:

Aktif sayfayı window.location.pathname ile otomatik tespiti
Products bottom sheet aç/kapat
Overlay tıklayınca kapat
touch-action: pan-y ile native swipe-to-close hissi
[MODIFY] 
Layout.astro
BottomNav bileşeni import edilip <Footer> öncesine eklenecek. Ayrıca <body> tag'ine padding-bottom: 64px sadece mobilde uygulanacak — içerik bottom nav'ın arkasında kalmasın diye.

diff
+ import BottomNav from '../components/BottomNav.astro';
  ...
  <body>
    <Header />
    <main>
      <slot />
    </main>
+   <BottomNav />
    <Footer />
  </body>
Ekranlar (Kullanıcı Akışı)
NORMAL DURUM:
┌─────────────────────┐
│   Sayfa içeriği     │
│                     │
│                     │
├─────────────────────┤
│ 🏠   📦   🔧  ℹ️  ✉️ │  ← Bottom Nav (fixed)
└─────────────────────┘
PRODUCTS TIKLANINCA:
┌─────────────────────┐
│   (Overlay karart)  │
├─────────────────────┤
│ ── handle ──        │
│ 📦 Products         │
│ ─ Data Models ─     │
│   IFDM              │
│   ITDM              │
│   HRDM              │
│ ─ Data Platform ─   │
│   ICC               │  ← Bottom Sheet
│   ReTouch           │
│   Retable AI        │
│ ─ AI Products ─     │
│   Talk To           │
│   BlueOctopus       │
│   VAR               │
│ [View All Products] │
├─────────────────────┤
│ 🏠   📦   🔧  ℹ️  ✉️ │
└─────────────────────┘
Verification Plan
Build testi: npm run build — hata yok
Responsive test: Tarayıcıda DevTools ile 375px (iPhone SE), 390px (iPhone 14), 430px (iPhone 15 Pro Max) genişliklerinde kontrol
Desktop kontrolü: 1024px+ genişlikte bottom nav görünmemeli
Aktif sayfa: Her sayfada ilgili ikon aktif renkte görünmeli
Products drawer: Açılıp kapanması, ürün linklerinin çalışması
Safe area: iPhone'da içerik bottom nav'ın arkasında kalmamalı
Klavye erişilebilirliği: Tab ile tüm öğelere erişilebilmeli