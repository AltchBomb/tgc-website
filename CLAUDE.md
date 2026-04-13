# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Injects partials inline → starts live-server at localhost:3000
npm run inject     # Runs scripts/inject-header.js only (no server)
```

`npm start` is the recommended dev workflow. It runs `inject-header.js` first, which embeds the current contents of `partials/header.html` and `partials/footer.html` directly into every page between their `<!-- HEADER:START/END -->` and `<!-- FOOTER:START/END -->` marker comments. The live-server then watches for changes with auto-reload.

There is no build step, test suite, or linter.

## Architecture

### Static HTML pages + runtime partials

The site is a collection of plain HTML files in `pages/`. Each page:
- Links to `../global.css` only — no per-page `<style>` blocks
- Contains `<!-- HEADER:START --> … <!-- HEADER:END -->` and `<!-- FOOTER:START --> … <!-- FOOTER:END -->` markers for the inject script
- References assets and links relatively (`../assets/…`, `../global.css`)

### Two partial-loading strategies

**Inject approach** (what `npm start` uses): `scripts/inject-header.js` reads the partial files and writes their HTML directly between the markers in every page. Pages become self-contained and work on `file://` as well as HTTP. This is the intended dev workflow.

**Fetch approach** (currently in pages after recent session work): pages hold a placeholder `<div id="tgc-header-placeholder">` + a `fetch("../partials/header.html")` script between the markers instead of inline HTML. This requires an HTTP server. Running `npm run inject` will replace the fetch scripts with inline HTML, reverting to the inject approach.

> **Important**: If the pages currently contain the fetch block, running `npm run inject` will overwrite it with the inline HTML. Both approaches are intentional; choose one consistently.

### `global.css`

All CSS lives here (~6900 lines). Never add `<style>` blocks to individual pages. The file is sectioned in order:

1. CSS variables / base reset / `html`+`body`
2. `.tgc-page` — the page wrapper class that uses `all: initial` to reset WordPress theme bleed; all page content lives inside this wrapper
3. Layout utilities (`.wrap`, section backgrounds)
4. Typography / spacing helpers
5. `#tgc-site-header` — fixed 80px header; burger, dropdown nav, mobile menu
6. Buttons, CTAs
7. Homepage, industry pages, service pages, pricing, blog index, blog post styles — each in a clearly-labelled section
8. Footer grid (`.tgc-footer-grid`) — responsive at 768px and 480px

The `#tgc-site-header` lives **outside** `.tgc-page`, so `.tgc-page *` rules do not affect it.

### Header/footer partials

- `partials/header.html` — full `<header id="tgc-site-header">` + inline `<script>` for burger toggle and active-state highlighting. Burger toggle adds/removes class `tgc-mob-open` on `#tgc-hdr-mobile-menu`.
- `partials/footer.html` — full `<footer id="tgc-site-footer">` with inline styles + a `<script>` for the `.fade` intersection observer (this script is stripped when using the fetch approach since the page owns the observer).
- `partials/footer.css` — a separate stylesheet with `#tgc-site-footer`-scoped rules that was the original footer spec. Current `footer.html` uses inline styles; responsive grid rules for the footer are in `global.css` as `.tgc-footer-grid`.

### Blog filter (`pages/blog.html`)

The JS filter reads `blog-tag-*` classes on article cards and `"case-study"` in link `href` values — no `data-*` attributes. Adding a new category requires updating the filter buttons and the detection logic in the inline script.

### Page wrapper IDs

Each page has a unique ID on its `.tgc-page` div (e.g. `id="tgc-hp"`, `id="tgc-cosm"`) used to scope page-specific CSS rules without `!important` escalation.

## Adding a new page

1. Copy an existing page with similar structure
2. Set a unique `id` on the `.tgc-page` div
3. Ensure only `<link rel="stylesheet" href="../global.css" />` in `<head>` (no extra stylesheets)
4. Keep the `<!-- HEADER:START/END -->` and `<!-- FOOTER:START/END -->` markers; run `npm run inject` to populate them
5. Add a card to `index.html`

## Pricing

- **Expedited Audit** — from $300. Cheapest tier is General Consumer Goods (EU & UK / North America). Other categories (Food, Supplements, Electronics, Cosmetics, Chemicals) start at $400+. The pricing calculator in `pricing.html` holds the full per-category, per-region data.
- **Label Reviews** — from $300 (EU & UK / North America); $400 for APAC, MEA, LATAM.
- **HS Code Review** — from $40 flat rate across all regions.

## Analytics / tracking (pending setup)

The following tags need to be added to the site once accounts are created. All should be implemented via Google Tag Manager (GTM) so only one code change is needed:

- **Google Tag Manager** — add GTM `<script>` snippet to `<head>` and GTM `<noscript>` snippet to `<body>` in `partials/header.html`. Provide the Container ID (`GTM-XXXXXXX`) and I can implement across all pages in one edit.
- **Google Search Console** — add the verification `<meta name="google-site-verification" content="...">` tag to `<head>` on all pages. Provide the verification code.
- **GA4** — configure inside GTM once GTM is live.
- **Google Ads conversion tracking** — configure inside GTM, fire on contact form submit.

## Outstanding issues (as of April 2026)

- **HS Code Review** — Missing `og:image`/`twitter:image`; title tag 65 chars (too long); meta description 162 chars (too long)
- **All pages** — OG images missing at `assets/images/og/` (1200×630px per page)
- **All pages** — `margin-top` on `.tgc-page` wrappers is `64px` on many pages; should be `80px` to match the 80px fixed header
- **Homepage** — Confirm LinkedIn URL and Twitter handle in schema JSON-LD are correct
- **Analytics** — GTM, GA4, Google Ads conversion tracking, and Search Console verification not yet implemented (see section above)
