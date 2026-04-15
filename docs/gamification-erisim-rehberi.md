# Gamification Özellikleri — Erişim Rehberi

Bu doküman Intellica Tech web sitesine eklenen 11 interaktif gamification özelliğinin **nerede, nasıl ve hangi koşullarda** erişilebilir olduğunu anlatır. Demo sunumu, pazarlama içeriği veya kullanıcı rehberi hazırlarken kaynak olarak kullanılabilir.

Tüm component'ler `src/components/gamification/` altında yaşar. Hiçbiri framework bağımlılığı kullanmaz — saf vanilla JS + Astro, `prefers-reduced-motion` destekli, klavye erişilebilir.

---

## Hızlı Erişim Matrisi

| # | Özellik | Sayfa (EN) | Sayfa (TR) | Tetikleyici |
|---|---|---|---|---|
| 1 | **Challenge Arena** | [/academy](https://intellica.net/academy) | [/tr/academy](https://intellica.net/tr/academy) | Sayfayı aç → bölüme scroll |
| 2 | **Contact Fun Mode** | [/contact](https://intellica.net/contact) | [/tr/contact](https://intellica.net/tr/contact) | Varsayılan görünüm (mobilde classic) |
| 3 | **Data Flow Story** | [/data-platforms](https://intellica.net/data-platforms) | [/tr/data-platforms](https://intellica.net/tr/data-platforms) | Sayfayı aç → bölüme scroll |
| 4 | **Data Maturity Quiz** | [/solutions](https://intellica.net/solutions) | [/tr/solutions](https://intellica.net/tr/solutions) | Sayfayı aç → bölüme scroll |
| 5 | **Easter Egg Terminal** | Tüm sayfalar (global) | Tüm sayfalar (global) | **Konami kodu** veya **`Ctrl+Shift+K`** |
| 6 | **Pipeline Builder** | [/data-platforms](https://intellica.net/data-platforms) | [/tr/data-platforms](https://intellica.net/tr/data-platforms) | Sayfayı aç → bölüme scroll |
| 7 | **Product Constellation** | [/products](https://intellica.net/products) | [/tr/products](https://intellica.net/tr/products) | Sayfayı aç → bölüme scroll |
| 8 | **Product Fit Wizard** | [/products](https://intellica.net/products) | [/tr/products](https://intellica.net/tr/products) | Sayfayı aç → bölüme scroll |
| 9 | **Reading Paths** | [/insights](https://intellica.net/insights) | [/tr/insights](https://intellica.net/tr/insights) | Sayfayı aç → bölüme scroll |
| 10 | **ROI Calculator** | [/solutions](https://intellica.net/solutions) | [/tr/solutions](https://intellica.net/tr/solutions) | Sayfayı aç → bölüme scroll |
| 11 | **SQL Playground** | [/products/talk-to-your-data](https://intellica.net/products/talk-to-your-data) | [/tr/products/talk-to-your-data](https://intellica.net/tr/products/talk-to-your-data) | Sadece bu ürün sayfasında aktif |

---

## 1. Challenge Arena — SQL Çözme Yarışması

- **Nerede:** Academy sayfası (`/academy`, `/tr/academy`)
- **Ne yapar:** 5 aşamalı SQL challenge — her aşamada bir sorgu yazıyorsun, doğru çözdüğünde konfeti patlaması ve bir sonraki aşamaya geçiyorsun.
- **Özellikler:**
  - Geri sayım timer'ı (zaman yarışı hissi)
  - Takıldığında "hint" butonu — ipucu verir
  - Final puan kartı (paylaşılabilir sonuç)
- **Kim için ideal:** SQL öğrenmek isteyen adaylar, iş görüşmesi öncesi pratik arayanlar
- **Teknik not:** Sorgular tarayıcı içinde mock veri üzerinde çalışır, gerçek veritabanı yoktur
- **Kaynak:** `src/components/gamification/ChallengeArena.astro`

---

## 2. Contact Fun Mode — SQL Temalı İletişim Formu

- **Nerede:** Contact sayfası (`/contact`, `/tr/contact`)
- **Varsayılan davranış:** Desktop'ta Fun Mode açılır, mobilde klasik form gösterilir
- **URL parametresi ile zorlama:**
  - `/contact?mode=fun` → her zaman fun mode
  - `/contact?mode=classic` → her zaman klasik form
- **Manuel geçiş:** Fun Mode altında "Switch to Classic" linki bulunur
- **Özellikler:**
  - Chat icebreaker animasyonu (SELECT * FROM conversation temalı)
  - Veri pipeline görselleştirmesi — form gönderilirken akış animasyonu
- **Kaynak:** `src/components/gamification/ContactFunMode.astro`

---

## 3. Data Flow Story — İnteraktif Veri Yolculuğu

- **Nerede:** Data Platforms sayfası (`/data-platforms`, `/tr/data-platforms`)
- **Ne yapar:** Kaynak → dönüşüm → yükleme → analitik aşamalarını görsel olarak anlatan animasyonlu bir hikaye
- **Etkileşim:** Kullanıcı her aşamaya tıklayıp detayları açabilir
- **Kaynak:** `src/components/gamification/DataFlowStory.astro`

---

## 4. Data Maturity Quiz — Veri Olgunluk Testi

- **Nerede:** Solutions sayfası (`/solutions`, `/tr/solutions`)
- **Ne yapar:** 5 soruluk kısa değerlendirme — şirketinin veri olgunluğunu ölçer
- **Çıktı:** Radar chart (SVG) üzerinde 5 boyutlu skor + kişiselleştirilmiş öneri
- **Kullanım amacı:** Lead qualification — düşük olgunluk = danışmanlık fırsatı
- **Kaynak:** `src/components/gamification/DataMaturityQuiz.astro`

---

## 5. Easter Egg Terminal — Gizli Retro Terminal 🥚

- **Nerede:** **Tüm sayfalarda global olarak aktif** (`Layout.astro` içine gömülü)
- **Nasıl açılır:**
  1. **Konami kodu:** ↑ ↑ ↓ ↓ ← → ← → B A
  2. **Klavye kısayolu:** `Ctrl+Shift+K`
- **Ne yapar:** Ekranı kaplayan retro CLI terminali açılır — `help`, `status`, `whoami` gibi komutlar çalıştırılabilir
- **Kullanım senaryoları:**
  - Teknik konferans sunumunda "bakın bunu bulmuşlar" faktörü
  - Developer hiring — CV'de "easter egg'ünüzü buldum" yazan adaylar
- **Teknik not:** Input terminal açıkken yakalar, Konami yeniden tetiklenmez (çakışma önlenmiş)
- **Kaynak:** `src/components/gamification/EasterEggTerminal.astro`

---

## 6. Pipeline Builder — Sürükle-Bırak İş Akışı

- **Nerede:** Data Platforms sayfası (`/data-platforms`, `/tr/data-platforms`)
- **Ne yapar:** Source, transform, destination node'larını sürükleyip birbirine bağlayarak bir veri pipeline'ı kurma simülasyonu
- **Etkileşim:** Drag & drop + bağlantı çizme
- **Kaynak:** `src/components/gamification/PipelineBuilder.astro`

---

## 7. Product Constellation — Ürün Yıldız Haritası

- **Nerede:** Products sayfası (`/products`, `/tr/products`)
- **Ne yapar:** 11 ürünün birbirleriyle ilişkisini (veri akışı, tamamlayıcılık) görsel harita olarak sunar
- **Etkileşim:** Ürüne hover / tıklama → o ürünün bağlı olduğu diğer ürünler vurgulanır
- **Kaynak:** `src/components/gamification/ProductConstellation.astro`

---

## 8. Product Fit Wizard — Ürün Eşleştirme Sihirbazı

- **Nerede:** Products sayfası (`/products`, `/tr/products`)
- **Ne yapar:** 3 adımlı soru dizisi — sektör → sorun → öncelik → sana en uygun 3 ürünü öneriyor
- **Çıktı:** Eşleşme puanlı 3 ürün kartı + ürün sayfasına link
- **Kullanım amacı:** Karmaşık ürün yelpazesinde kullanıcıyı doğru yere yönlendirme
- **Kaynak:** `src/components/gamification/ProductFitWizard.astro`

---

## 9. Reading Paths — Kişiselleştirilmiş İçerik Rotası

- **Nerede:** Insights (blog) sayfası (`/insights`, `/tr/insights`)
- **Ne yapar:** Kullanıcının rolünü seçmesine göre (CDO, data engineer, analyst...) önerilen okuma sırasını oluşturur
- **Etkileşim:** Rol seçimi → tematik makale listesi
- **Kaynak:** `src/components/gamification/ReadingPaths.astro`

---

## 10. ROI Calculator — Veri Değeri Hesaplayıcı

- **Nerede:** Solutions sayfası (`/solutions`, `/tr/solutions`)
- **Ne yapar:** Şirket büyüklüğü, veri kaynak sayısı gibi girdileri alıp 3 yıllık ROI projeksiyonu hesaplar
- **Görsel çıktı:** SVG gauge + sayısal özet tablo
- **Kullanım amacı:** Sales enablement — fiyat konuşmasından önce değer konuşmasını başlatmak
- **Kaynak:** `src/components/gamification/ROICalculator.astro`

---

## 11. SQL Playground — Tarayıcı İçi SQL Çalıştırıcı

- **Nerede:** **Sadece Talk to Your Data ürün sayfasında** (`/products/talk-to-your-data`)
- **Neden sadece orada:** ProductLayout'a global olarak import edilmiştir ama YAML'daki `customComponents: ["SQLPlayground"]` alanıyla opt-in çalışır. Şu an yalnızca `talk-to-your-data.yaml` bu alanı içerir.
- **Ne yapar:** Örnek veri üzerinde gerçek SQL sorgusu çalıştırabilirsin — sonuçlar stillendirilmiş tablo + birden fazla grafik olarak dönüyor
- **Bir başka ürüne eklemek için:**
  ```yaml
  # src/content/products/{en,tr}/<product>.yaml
  customComponents:
    - SQLPlayground
  ```
- **Kaynak:** `src/components/gamification/SQLPlayground.astro` + `src/layouts/ProductLayout.astro` (customComponentMap)

---

## Mimari Notlar — Geliştiriciler İçin

### Global vs sayfa-bazlı import pattern'i

| Tip | Component'ler | Import lokasyonu |
|---|---|---|
| **Global** (her sayfada aktif) | Easter Egg Terminal | `src/layouts/Layout.astro` |
| **Layout opt-in** (ürün sayfalarında YAML ile açılır) | SQL Playground | `src/layouts/ProductLayout.astro` |
| **Sayfa-bazlı** | Diğer 9 component | `src/page-templates/*.astro` |

### Yeni bir gamification component eklerken

1. Dosyayı `src/components/gamification/` altına koy
2. Vanilla JS kullan — React/Vue/Svelte ekleme (statik build'i bozar)
3. `prefers-reduced-motion` respektle, motion'ı kapat veya azalt
4. aria etiketleri + klavye navigasyonu ekle
5. İlgili sayfaya (`src/page-templates/...`) import et
6. Hem EN hem TR metinler için `src/i18n/locales/{en,tr}.json` anahtarları ekle
7. Global yapmak istiyorsan → `Layout.astro` içine taşı (ama gerekmedikçe yapma, her sayfayı ağırlaştırır)

### Erişilebilirlik taahhütleri

Tüm component'ler şu garantileri sağlar:
- Klavye ile tam erişim (Tab / Enter / Esc)
- Screen reader uyumu (aria-live, aria-label, semantic HTML)
- `prefers-reduced-motion: reduce` medya sorgusu dinlenir
- Yüksek kontrast modda okunabilirlik

---

## Pazarlama / Demo Senaryoları

**Müşteriye canlı demo gösterirken tavsiye edilen sıra:**
1. `/` ana sayfadan başla — pratik girişi
2. `/products` → **Product Fit Wizard**'ı çalıştır ("sizin için hangi ürün?" hikayesi)
3. `/products/talk-to-your-data` → **SQL Playground**'ta canlı sorgu çalıştır
4. `/solutions` → **ROI Calculator** ile somut değer konuşması
5. `/data-platforms` → **Pipeline Builder** ile teknik derinlik
6. *(Bonus)* Herhangi bir sayfada `Ctrl+Shift+K` — **Easter Egg Terminal** ile kapanış

**Sosyal medya / blog içeriği için:**
- Challenge Arena skor ekranı paylaşım formatı destekler
- Data Maturity Quiz sonucu kişiye özel içerik — lead magnet olarak ideal

---

## Kaynak Kod Haritası

```
src/
├── components/gamification/          # 11 component'in kendisi
│   ├── ChallengeArena.astro
│   ├── ContactFunMode.astro
│   ├── DataFlowStory.astro
│   ├── DataMaturityQuiz.astro
│   ├── EasterEggTerminal.astro
│   ├── PipelineBuilder.astro
│   ├── ProductConstellation.astro
│   ├── ProductFitWizard.astro
│   ├── ReadingPaths.astro
│   ├── ROICalculator.astro
│   └── SQLPlayground.astro
│
├── layouts/
│   ├── Layout.astro                  # → EasterEggTerminal (global)
│   └── ProductLayout.astro           # → SQLPlayground (opt-in)
│
├── page-templates/
│   ├── AcademyPage.astro             # → ChallengeArena
│   ├── ContactPage.astro             # → ContactFunMode
│   ├── DataPlatformsPage.astro       # → DataFlowStory, PipelineBuilder
│   ├── InsightsPage.astro            # → ReadingPaths
│   ├── ProductsPage.astro            # → ProductFitWizard, ProductConstellation
│   └── SolutionsPage.astro           # → DataMaturityQuiz, ROICalculator
│
└── content/products/{en,tr}/
    └── talk-to-your-data.yaml        # customComponents: [SQLPlayground]
```
