---
name: senior-webmaster
description: Activates senior webmaster mode. Use when handling deployments, versioning, git workflow, SEO, sitemap, GitHub Actions, or release management for this project.
user-invocable: true
---

# Senior Webmaster — Intellica Tech

Bu projede deployment, versiyonlama ve teknik site yönetimi için standartlar.

## Deploy Pipeline

```
feature branch → main → release/vX.Y.Z branch push → GitHub Actions → GitHub Pages
```

1. Değişiklikler feature/update branch'inde geliştirilir
2. PR açılır → `main`'e merge edilir
3. `package.json` versiyonu artırılır ve commit atılır
4. `release/vX.Y.Z` branch'i oluşturulup push edilir → otomatik deploy tetiklenir

## Versiyon Yönetimi

Semantic versioning: `MAJOR.MINOR.PATCH`
- **PATCH** (`1.0.x`): Bug fix, küçük içerik değişikliği
- **MINOR** (`1.x.0`): Yeni sayfa/bölüm, önemli UI değişikliği
- **MAJOR** (`x.0.0`): Tam yeniden tasarım, mimari değişiklik

Güncelleme sırası:
1. `package.json` → `"version": "X.Y.Z"`
2. Commit: `chore: bump version to X.Y.Z`
3. `git push origin main`
4. `git checkout -b release/vX.Y.Z && git push -u origin release/vX.Y.Z`

## Git Workflow

### Branch İsimlendirme
- Feature: `feature/kisa-aciklama`
- Güncelleme: `update/ne-guncellendi`
- Fix: `fix/hata-aciklamasi`
- Release: `release/vX.Y.Z`

### Commit Mesajı Formatı (Conventional Commits)
```
feat: yeni bir özellik ekle
fix: hata düzeltmesi
chore: bakım işlemi (versiyon, bağımlılık vb.)
style: kod/görsel stil değişikliği
docs: dokümantasyon güncelleme
refactor: yeniden yapılandırma
```

## .gitignore Kuralları

Commit'lenmemesi gerekenler:
- `.claude/launch.json` — local dev server config
- `.claude/worktrees/` — git worktree geçici klasörleri
- `*.bak` — yedek dosyalar
- `diff.txt`, `temp_*.txt`, `old.txt`, `header-diff.txt` — geçici analiz dosyaları

Commit'lenmesi gerekenler:
- `.claude/skills/` — proje skills dosyaları (ekip paylaşımı için)
- `CLAUDE.md` — proje talimatları

## SEO Yönetimi

Her sayfa `Layout.astro`'dan şu props alıyor:
```astro
<Layout
  title="Sayfa Başlığı | Intellica"
  description="150-160 karakter meta description"
  canonical="/sayfa-url"
>
```

Kontrol listesi:
- [ ] Her sayfanın unique title'ı var mı?
- [ ] Meta description 150-160 karakter arası mı?
- [ ] Canonical URL doğru set edilmiş mi?
- [ ] OG image tanımlı mı?
- [ ] Sitemap'te sayfa var mı? (`@astrojs/sitemap` otomatik üretiyor)

## GitHub Actions

Repo: `intellica-tech/intellica-tech.github.io`

Aktif workflow'lar:
- **Deploy to GitHub Pages**: `release/v*` branch push'unda tetiklenir
- **Docker Build & Push to GHCR**: `main` branch push'unda tetiklenir

Action durumunu kontrol etmek için:
```bash
gh run list --limit 5
gh run watch <run-id>
```

## Asset Yönetimi

```
public/
  assets/
    img/          ← Sayfa hero ve içerik görselleri
    images/       ← Logolar, diyagramlar, ürün görselleri
      logos/      ← Partner/client logo SVG/PNG dosyaları
      map/        ← Dünya haritası görseli
```

Görseller için kurallar:
- Hero görseller: maksimum `~700KB`, WebP tercih et
- Logo dosyaları: SVG tercih et
- Yeni görsel eklerken mevcut dosya boyutlarıyla karşılaştır

## Geçici Dosya Temizliği

Repo'da bulunan temizlenmesi gereken dosyalar:
- `diff.txt`, `header-diff.txt`, `old.txt`, `temp_diff.txt`

Temizleme komutu:
```bash
cd /path/to/repo
git rm diff.txt header-diff.txt old.txt temp_diff.txt
git commit -m "chore: remove temporary diff files"
```
