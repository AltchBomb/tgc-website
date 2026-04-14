/**
 * inject-partials.js
 *
 * Reads partials/header.html and partials/footer.html and injects
 * them into every HTML page in Pages/ between their marker comments:
 *
 *   <!-- HEADER:START -->  ...  <!-- HEADER:END -->
 *   <!-- FOOTER:START -->  ...  <!-- FOOTER:END -->
 *
 * Usage:
 *   node scripts/inject-header.js
 *
 * Run this whenever partials/header.html or partials/footer.html changes.
 * HTML is embedded directly so pages work on file:// and any web server.
 */

const fs   = require('fs');
const path = require('path');

const ROOT        = path.join(__dirname, '..');
const PAGES_DIR   = path.join(ROOT, 'Pages');
const HEADER_FILE = path.join(ROOT, 'partials', 'header.html');
const FOOTER_FILE = path.join(ROOT, 'partials', 'footer.html');

// ── Read partials ─────────────────────────────────────────────────
if (!fs.existsSync(HEADER_FILE)) {
  console.error('ERROR: partials/header.html not found.');
  process.exit(1);
}
if (!fs.existsSync(FOOTER_FILE)) {
  console.error('ERROR: partials/footer.html not found.');
  process.exit(1);
}
const headerHTML = fs.readFileSync(HEADER_FILE, 'utf8').trim();
const footerHTML = fs.readFileSync(FOOTER_FILE, 'utf8').trim();

// ── Helper: inject a partial between START/END markers ────────────
function injectPartial(source, startMarker, endMarker, partial, label) {
  const startIdx = source.indexOf(startMarker);
  const endIdx   = source.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) return null;   // no markers → skip
  if (endIdx < startIdx) {
    console.error(`    [${label}] ERROR: END marker before START`);
    return null;
  }

  const before   = source.slice(0, startIdx + startMarker.length);
  const after    = source.slice(endIdx);
  const indent   = '    ';
  const injected = '\n' + partial.split('\n').map(l => indent + l).join('\n') + '\n' + indent;
  return before + injected + after;
}

// ── Process each page ─────────────────────────────────────────────
const pages = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));

let headerUpdated = 0, footerUpdated = 0, headerSkipped = 0, footerSkipped = 0;

for (const file of pages) {
  const filePath = path.join(PAGES_DIR, file);
  let content    = fs.readFileSync(filePath, 'utf8');
  let dirty      = false;

  // Header
  const withHeader = injectPartial(content, '<!-- HEADER:START -->', '<!-- HEADER:END -->', headerHTML, 'HEADER');
  if (withHeader === null) {
    console.log(`  SKIP   HEADER  ${file}`);
    headerSkipped++;
  } else if (withHeader !== content) {
    content = withHeader;
    dirty   = true;
    headerUpdated++;
    console.log(`  WRITE  HEADER  ${file}`);
  } else {
    console.log(`  OK     HEADER  ${file}`);
  }

  // Footer
  const withFooter = injectPartial(content, '<!-- FOOTER:START -->', '<!-- FOOTER:END -->', footerHTML, 'FOOTER');
  if (withFooter === null) {
    console.log(`  SKIP   FOOTER  ${file}`);
    footerSkipped++;
  } else if (withFooter !== content) {
    content = withFooter;
    dirty   = true;
    footerUpdated++;
    console.log(`  WRITE  FOOTER  ${file}`);
  } else {
    console.log(`  OK     FOOTER  ${file}`);
  }

  if (dirty) fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`\nHeader: ${headerUpdated} updated, ${headerSkipped} skipped.`);
console.log(`Footer: ${footerUpdated} updated, ${footerSkipped} skipped.`);
