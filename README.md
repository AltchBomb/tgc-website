# TGC Website — Local Dev Setup

HTML page previews for the tecexglobalcompliance.com WordPress redesign.

## Getting started

**Option A — npm (recommended, auto-reloads on save)**

```bash
npm install
npm start
```

Opens at `http://localhost:3000` automatically.

**Option B — VS Code Live Server (no terminal needed)**

1. Install the **Live Server** extension (VS Code will prompt you — click Install All)
2. Right-click `index.html` in the file explorer → **Open with Live Server**
3. Browser opens at `http://127.0.0.1:5500`

> **Note:** The footer partial loads via `fetch()`, which requires pages to be served over HTTP. Opening files directly as `file://` URLs will not load the footer. Always use one of the options above.

---

## Project structure

```
Website/
├── index.html              ← Dev hub — start here
├── package.json
├── global.css              ← All shared styles (layout, components, blog, etc.)
├── README.md
│
├── pages/                  ← One file per page
│   ├── homepage.html
│   ├── about-us.html
│   ├── contact-us.html
│   ├── pricing.html
│   ├── blog.html
│   │
│   ├── expedited-audit.html
│   ├── label-reviews.html
│   ├── hs-code-review.html
│   ├── full-product-compliance.html
│   │
│   ├── cosmetic-compliance.html
│   ├── chemical-compliance.html
│   ├── electronics-compliance.html
│   ├── food-beverage-compliance.html
│   ├── food-supplements-compliance.html
│   ├── consumer-goods-compliance.html
│   ├── medical-devices-compliance.html
│   │
│   └── blog-*.html         ← Blog posts (regulation updates, comparisons, case studies)
│
├── partials/               ← Shared components (loaded via fetch)
│   ├── header.html         ← Site header/nav
│   ├── footer.html         ← Site footer markup
│   └── footer.css          ← Footer-specific styles
│
└── assets/
    └── images/
        ├── og/             ← OG/social share images (1200×630px per page)
        ├── placeholders/   ← Dev placeholder images
        ├── tgc-logo.png
        ├── cosmetics.jpg
        ├── Chemicals.jpg
        ├── electronics.png
        ├── food-beverage.jpg
        ├── food-supplements.webp
        └── consumer-goods.jpg
```

---

## Shared footer

The footer lives at `partials/footer.html`. Every page loads it at runtime:

```js
fetch('../partials/footer.html')
  .then(r => r.text())
  .then(html => { /* inject into placeholder div */ });
```

To edit the footer: open `partials/footer.html`. Changes apply to all 43 pages on reload.

**WordPress note:** In the live site the footer will live in `footer.php`. `partials/footer.html` is the source-of-truth spec for that implementation.

---

## Styles

All CSS lives in `global.css`. There are no per-page `<style>` blocks — every page links only to `../global.css`. The file is organised into sections:

| Section | What it covers |
|---|---|
| Reset / base | Box-sizing, typography, colour variables |
| Layout | `.wrap`, `.s-white`, `.s-navy`, grid helpers |
| Header | `#tgc-site-header`, nav, mobile menu |
| Buttons & CTAs | `.btn`, `.cta-band` |
| Homepage | Hero, form card, trust strip, service cards |
| Industry pages | Reg grid, comparison tables, risk scenarios |
| Blog index | Cards, filters, tags |
| Blog posts | Post hero, article body, reg-update blocks, case study timeline, comparison tables |

---

## Blog

`pages/blog.html` lists all posts with a live JS filter. Categories:

- All · Cosmetics · Chemicals · Electronics · Food & Beverage · Food Supplements · Consumer Goods · Medical Devices · **Case Study**

The filter reads existing `blog-tag-*` classes and link `href` attributes — no `data-*` attributes needed on individual cards. Case study posts are detected by `"case-study"` appearing in the link href.

---

## Adding a new page

1. Save the HTML file to `pages/your-page-name.html`
2. Link global styles in `<head>`: `<link rel="stylesheet" href="../global.css" />`
3. Replace the inline footer block with the shared fetch snippet (copy the `<!-- FOOTER:START -->` block from any existing page)
4. Open `index.html` and add a card in the "Pages in progress" section

---

## Naming convention

Use lowercase, hyphen-separated names that match the intended WordPress slug:

| WordPress URL | File name |
|---|---|
| `/expedited-compliance-audit/` | `expedited-audit.html` |
| `/label-review-service/` | `label-reviews.html` |
| `/hs-code-review/` | `hs-code-review.html` |
| `/industries/chemical-compliance/` | `chemical-compliance.html` |
| `/blog/cosmetic-regulation-updates/` | `blog-cosmetic-regulation-updates.html` |

---

## Outstanding issues (as of April 2026)

- **Expedited Audit** — Resolve price discrepancy: title/copy says $300, homepage + schema say $400
- **Label Reviews** — Fill in FAQ turnaround time: *"Standard label reviews are completed within ___."*
- **HS Code Review** — Add `og:image` and `twitter:image` tags; shorten title tag (currently 65 chars); trim meta description (162 chars)
- **All pages** — OG images needed at `assets/images/og/` (1200×630px per page)
- **Homepage** — Confirm LinkedIn URL and Twitter handle are correct in schema JSON-LD
