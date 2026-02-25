# SEO, LLM Search & Modern Web Standards — Intellica Website (2025-2026)
Intellica websitesi yeni geliştirildi ancak modern arama motoru optimizasyonu, yapılandırılmış veri (structured data), ve özellikle Generative Engine Optimization (GEO) — ChatGPT, Claude, Perplexity gibi LLM tabanlı arama motorlarında görünürlük — için kritik eksiklikler tespit edildi. Bu plan, 2025-2026 standartlarına uygun kapsamlı bir optimizasyon stratejisi sunmaktadır.

## Mevcut Durum Analizi
Kriter	Durum	Öncelik
robots.txt	❌ Yok	🔴 Kritik
XML Sitemap	❌ Yok	🔴 Kritik
Canonical URL	❌ Yok	🔴 Kritik
JSON-LD Structured Data	❌ Yok	🔴 Kritik
Open Graph tags	⚠️ Temel (image yok, site_name yok)	🟡 Önemli
Twitter Card tags	❌ Yok	🟡 Önemli
llms.txt (LLM Search)	❌ Yok	🟡 Önemli
Semantic HTML	⚠️ Temel düzeyde	🟢 İyileştirme
Core Web Vitals hints	⚠️ Preconnect/preload yok	🟢 İyileştirme
Image alt tags	✅ Mevcut (çoğunlukla iyi)	✅
Mobile responsive	✅ Mevcut	✅
HTTPS	✅ Site URL HTTPS	✅
Proposed Changes
1. Technical SEO Foundation
[NEW] 
robots.txt
Tüm arama motoru crawler'larına ve AI crawler'larına (GPTBot, ClaudeBot, PerplexityBot) erişim izni veren robots.txt dosyası oluşturulacak.

User-agent: *
Allow: /
# AI Crawlers — Explicitly allowed
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot  
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: GoogleOther
Allow: /
Sitemap: https://intellica-tech.github.io/sitemap-index.xml
[MODIFY] 
astro.config.mjs
@astrojs/sitemap entegrasyonu eklenecek. Bu Astro'nun build zamanında otomatik XML sitemap oluşturmasını sağlar.

diff
import { defineConfig } from 'astro/config';
+import sitemap from '@astrojs/sitemap';
 export default defineConfig({
     site: 'https://intellica-tech.github.io',
     output: 'static',
+    integrations: [sitemap()],
 });
[MODIFY] 
Layout.astro
<head> bölümüne aşağıdaki meta tag'ler eklenecek:

Canonical URL — her sayfanın kendsine ait canonical linki
Open Graph genişletme — og:image, og:site_name, og:url, og:locale
Twitter Card — summary_large_image tipi
Ek meta taglar — author, robots index direktifi, generator
diff
<head>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
+  <meta name="robots" content="index, follow" />
+  <meta name="author" content="Intellica" />
+  <meta name="generator" content={Astro.generator} />
+  <link rel="canonical" href={Astro.url.href} />
   <title>{title}</title>
   <meta name="description" content={description} />
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   <link rel="icon" href="/favicon.ico" />
+  <meta property="og:site_name" content="Intellica" />
   <meta property="og:title" content={title} />
   <meta property="og:description" content={description} />
   <meta property="og:type" content="website" />
+  <meta property="og:url" content={Astro.url.href} />
+  <meta property="og:locale" content="en_US" />
+  <meta property="og:image" content="https://intellica-tech.github.io/assets/img/intellica-og.png" />
+  <meta property="og:image:width" content="1200" />
+  <meta property="og:image:height" content="630" />
+  <meta name="twitter:card" content="summary_large_image" />
+  <meta name="twitter:title" content={title} />
+  <meta name="twitter:description" content={description} />
+  <meta name="twitter:image" content="https://intellica-tech.github.io/assets/img/intellica-og.png" />
   <meta name="theme-color" content="#030B16" />
 </head>
IMPORTANT

OG image dosyası (intellica-og.png, 1200x630px) oluşturulup public/assets/img/ dizinine yerleştirilmelidir. Bu image, sosyal medya paylaşımlarında ve AI arama sonuçlarında sitenin görsel temsilidir.

2. Structured Data (JSON-LD Schema.org)
JSON-LD formatında yapılandırılmış veri eklenecek. Bu, Google'ın ve AI motorlarının sitenin içeriğini, firmanın kimliğini ve ürünlerini anlamasını sağlar.

[MODIFY] 
Layout.astro
Her sayfaya Organization schema'sı eklenecek (head bölümüne):

json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://intellica-tech.github.io/#organization",
  "name": "Intellica",
  "url": "https://intellica-tech.github.io",
  "logo": "https://intellica-tech.github.io/assets/img/intellica-logo.png",
  "description": "Intellica is a global Data & AI company empowering enterprises with modern data platforms, analytics solutions, and production-grade AI systems since 2006.",
  "foundingDate": "2006",
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 450 },
  "areaServed": ["Turkey", "UAE", "Saudi Arabia", "Pakistan", "UK", "USA", "Albania"],
  "sameAs": [
    "https://www.linkedin.com/company/intellica",
    "https://www.intellica.net"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Atatürk Mah. Turgut Özal Blv. Gardenya 1 Plaza, Floor 1",
    "addressLocality": "Ataşehir, Istanbul",
    "addressCountry": "TR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-216-688-45-46",
    "contactType": "sales",
    "email": "info@intellica.net"
  }
}
[MODIFY] 
index.astro
Ana sayfaya WebSite schema'sı eklenecek. Bu, arama motorlarına sitenin birincil giriş noktasını bildirir:

json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Intellica",
  "url": "https://intellica-tech.github.io",
  "publisher": { "@id": "https://intellica-tech.github.io/#organization" }
}
[MODIFY] 
products.astro
Her ürün için SoftwareApplication schema'sı eklenecek (IFDM, ITDM, HRDM, ICC, ReTouch, Retable AI, Talk To, BlueOctopus, VAR).

[MODIFY] 
about.astro
AboutPage schema'sı eklenecek.

[MODIFY] 
contact.astro
ContactPage schema'sı eklenecek.

Tüm sayfalar — BreadcrumbList
Her sayfaya BreadcrumbList schema'sı eklenecek:

json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://intellica-tech.github.io/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://intellica-tech.github.io/products" }
  ]
}
3. LLM & AI Search Optimization (GEO)
2025-2026'nın en yeni trendi olan Generative Engine Optimization kapsamında, AI motorlarının site içeriğini doğru şekilde anlaması ve alıntılaması sağlanacak.

[NEW] 
llms.txt
llms.txt, AI motorlarına (GPTBot, ClaudeBot vb.) sitenin yapısını ve önemli sayfalarını Markdown formatında bildiren dosyadır:

markdown
# Intellica
> Intellica is a global Data & AI company founded in 2006. We empower enterprises to generate sustainable value from data through modern data platforms, analytics solutions, and production-grade AI systems. Active in 20+ countries with 450+ expert professionals and 200+ enterprise projects delivered.
## Pages
- [Home](https://intellica-tech.github.io/): Main landing page
- [Products](https://intellica-tech.github.io/products): Licensed product ecosystem (IFDM, ITDM, HRDM, ICC, ReTouch, Retable AI, Talk To, BlueOctopus, VAR)
- [Solutions](https://intellica-tech.github.io/solutions): Enterprise data & AI solutions and services
- [About](https://intellica-tech.github.io/about): Company background, values, and timeline
- [Contact](https://intellica-tech.github.io/contact): Contact information and inquiry form
## Products
- IFDM: International standard data warehouse model for the finance industry
- ITDM: International standard data warehouse model for the telecom industry
- HRDM: Data warehouse model optimized for human resources
- ICC: Central data consistency management and quality control platform
- ReTouch: Data entry management platform with validation and audit trails
- Retable AI: Cloud-based no-code data and application platform
- Talk To: AI data analyst — natural language to SQL for enterprise data
- BlueOctopus: AI-powered centralized analytics and surveillance platform
- VAR: AI-powered voice signature, matching and identity extraction
## Detailed Content
- [Full site content](https://intellica-tech.github.io/llms-full.txt)
[NEW] 
llms-full.txt
Sitenin tüm içeriğinin Markdown formatında derlenmiş versiyonu. LLM'lerin tek bir istekle tüm site içeriğini tarayabilmesini sağlar.

4. Semantic HTML & Content Yapı İyileştirmeleri
[MODIFY] 
Layout.astro
<main> tag'ine role="main" ve uygun id eklenecek
[MODIFY] 
Header.astro
<header> tag'ine role="banner" eklenecek
aria-current="page" aktif sayfa navigasyonu için eklenecek
[MODIFY] 
Footer.astro
<footer> tag'ine role="contentinfo" eklenecek
5. Performance & Core Web Vitals
[MODIFY] 
Layout.astro
diff
<head>
+  <link rel="preconnect" href="https://fonts.googleapis.com" />
+  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
+  <link rel="dns-prefetch" href="https://www.linkedin.com" />
   ...
 </head>
Verification Plan
Automated Tests
Build testi — projenin hatasız derlenmesini doğrular:

cd c:\Users\NAZLIBAYAR\Documents\website-naz && npm run build
Sitemap doğrulama — build sonrası dist/sitemap-index.xml dosyasının oluştuğunu kontrol eder:

dir c:\Users\NAZLIBAYAR\Documents\website-naz\dist\sitemap-index.xml
robots.txt doğrulama — build sonrası dist/robots.txt dosyasının kopyalandığını doğrular:

type c:\Users\NAZLIBAYAR\Documents\website-naz\dist\robots.txt
llms.txt doğrulama — build sonrası dist/llms.txt dosyasının kopyalandığını doğrular:

type c:\Users\NAZLIBAYAR\Documents\website-naz\dist\llms.txt
JSON-LD doğrulama — build output HTML dosyalarında application/ld+json script tag'lerinin varlığını kontrol eder:

findstr /s "application/ld+json" c:\Users\NAZLIBAYAR\Documents\website-naz\dist\*.html
Manual Verification (Browser)
Browser test — npm run dev ile local server başlatıp tüm sayfaların doğru render edildiğini tarayıcı aracıyla kontrol etme

Google Rich Results Test — Deploy sonrası Google Rich Results Test aracıyla structured data doğrulaması (kullanıcı tarafından manual yapılmalı)

Schema Markup Validator — Deploy sonrası Schema.org Validator ile doğrulama (kullanıcı tarafından manual yapılmalı)