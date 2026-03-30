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

---

## Project structure

```
Website/
├── index.html              ← Dev hub — start here
├── package.json
├── README.md
│
├── pages/                  ← One file per page
│   ├── homepage.html
│   ├── expedited-audit.html
│   ├── label-reviews.html
│   ├── hs-code-review.html
│   ├── full-product-compliance.html
│   └── [add new pages here]
│
├── partials/               ← Shared components (loaded via fetch)
│   ├── footer.html         ← Site footer markup (WordPress: lives in footer.php)
│   └── footer.css          ← Footer styles (WordPress: lives in theme style.css)
│
├── assets/
│   └── images/
│       ├── og/             ← OG/social share images (1200×630px)
│       └── placeholders/   ← Dev placeholder images
│
└── .vscode/
    ├── settings.json       ← Editor config
    └── extensions.json     ← Recommended extensions
```

## Shared footer

The footer is a single shared file at `partials/footer.html`. Every page loads it at runtime via `fetch('../partials/footer.html')` so there is one place to update when links change.

To edit the footer: open `partials/footer.html` and `partials/footer.css`. Changes apply to all pages immediately on reload.

**WordPress note:** In the live WordPress site the footer will live in `footer.php` (theme). `partials/footer.html` is the source-of-truth spec for that implementation.

## Adding a new page

1. Save the HTML file to `pages/your-page-name.html`
2. Replace the inline footer HTML with the shared fetch snippet (copy from any existing page)
3. Add `<link rel="stylesheet" href="../partials/footer.css">` to `<head>`
4. Open `index.html` and add a card in the "Pages in progress" section

## Naming convention

Use lowercase, hyphen-separated names that match the intended WordPress slug:

| WordPress URL | File name |
|---|---|
| `/expedited-compliance-audit/` | `expedited-audit.html` |
| `/label-review-service/` | `label-reviews.html` |
| `/hs-code-review/` | `hs-code-review.html` |
| `/industries/chemical-compliance/` | `chemical-compliance.html` |

## Outstanding issues (as of March 2026)

- **Expedited Audit** — Resolve price: title/copy says $300, homepage + schema say $400
- **Label Reviews** — Fill in FAQ turnaround time: *"Standard label reviews are completed within ___."*
- **HS Code Review** — Add `og:image` and `twitter:image` tags; shorten title tag (currently 65 chars, 5 over ideal); trim meta description (162 chars, 2 over limit)
- **All pages** — OG images needed at `assets/images/og/` (1200×630px per page)
- **Homepage** — Organization + WebSite schema JSON-LD blocks added; confirm LinkedIn URL and Twitter handle are correct
