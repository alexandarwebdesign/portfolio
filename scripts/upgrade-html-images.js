#!/usr/bin/env node
// Upgrade <img src=...> blocks into <picture> blocks with AVIF + WebP + JPEG
// sources at the regenerated widths, when the logical image name has variants.

const fs = require('fs');
const path = require('path');

const HTMLS = ['index.html', 'about.html', 'forma-architects.html'];
const IMAGES_DIR = 'images';

function buildInventory() {
  const inv = {};
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'raw') continue;
        walk(p);
      } else {
        const m = e.name.match(/^(.+)-(\d{3,4})\.(avif|webp|jpg)$/i);
        if (!m) continue;
        const logical = path.join(dir, m[1]).replace(/\\/g, '/');
        const w = parseInt(m[2]);
        const fmt = m[3].toLowerCase();
        if (!inv[logical]) inv[logical] = { avif: [], webp: [], jpg: [] };
        if (!inv[logical][fmt].includes(w)) inv[logical][fmt].push(w);
      }
    }
  }
  walk(IMAGES_DIR);
  for (const k of Object.keys(inv)) {
    for (const fmt of ['avif', 'webp', 'jpg']) {
      inv[k][fmt].sort((a, b) => a - b);
    }
  }
  return inv;
}

const inv = buildInventory();

function srcsetFor(logicalKey, fmt) {
  if (!inv[logicalKey]) return null;
  const widths = inv[logicalKey][fmt];
  if (!widths.length) return null;
  return widths.map(w => `/${logicalKey}-${w}.${fmt} ${w}w`).join(', ');
}

function pickFallback(logicalKey) {
  const widths = inv[logicalKey]?.jpg || [];
  if (!widths.length) return null;
  const target = widths.find(w => w >= 1080) || widths[widths.length - 1];
  return `/${logicalKey}-${target}.jpg`;
}

function getAttr(s, name) {
  const m = s.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function buildPicture(logicalKey, fullAttrs) {
  if (!inv[logicalKey]) return null;
  const avifSet = srcsetFor(logicalKey, 'avif');
  const webpSet = srcsetFor(logicalKey, 'webp');
  const jpgSet = srcsetFor(logicalKey, 'jpg');
  const fallback = pickFallback(logicalKey);
  if (!avifSet || !webpSet || !jpgSet || !fallback) return null;

  const widthAttr = getAttr(fullAttrs, 'width');
  const defaultSizes = widthAttr
    ? `(max-width: 768px) 100vw, ${widthAttr}px`
    : '100vw';
  const sizes = getAttr(fullAttrs, 'sizes') || defaultSizes;
  const alt = getAttr(fullAttrs, 'alt');
  const cls = getAttr(fullAttrs, 'class');
  const id = getAttr(fullAttrs, 'id');
  const loading = getAttr(fullAttrs, 'loading') || 'lazy';
  const decoding = getAttr(fullAttrs, 'decoding') || 'async';
  const w = getAttr(fullAttrs, 'width');
  const h = getAttr(fullAttrs, 'height');
  const fp = getAttr(fullAttrs, 'fetchpriority');
  const dataAttrs = [...fullAttrs.matchAll(/\bdata-[a-z-]+="[^"]*"/g)].map(m => m[0]);

  const imgAttrs = [
    `src="${fallback}"`,
    `srcset="${jpgSet}"`,
    `sizes="${sizes}"`,
    cls ? `class="${cls}"` : '',
    id ? `id="${id}"` : '',
    alt !== null ? `alt="${alt}"` : 'alt=""',
    w ? `width="${w}"` : '',
    h ? `height="${h}"` : '',
    `loading="${loading}"`,
    `decoding="${decoding}"`,
    fp ? `fetchpriority="${fp}"` : '',
    ...dataAttrs,
  ].filter(Boolean).join(' ');

  return `<picture data-upgraded="1">\n  <source type="image/avif" srcset="${avifSet}" sizes="${sizes}">\n  <source type="image/webp" srcset="${webpSet}" sizes="${sizes}">\n  <img ${imgAttrs}>\n</picture>`;
}

function isInsideUpgradedPicture(html, matchIndex) {
  const before = html.slice(Math.max(0, matchIndex - 500), matchIndex);
  const openIdx = before.lastIndexOf('<picture');
  const closeIdx = before.lastIndexOf('</picture>');
  return openIdx > closeIdx;
}

function transformHTML(html) {
  // First repair any sizes="undefined" from prior runs.
  html = html.replace(/sizes="undefined"/g, 'sizes="100vw"');

  // Pass 1: <img ...src="X-NNNN.(webp|jpg|png)"...> — multi-width sources.
  html = html.replace(/<img\b([^>]*?)src="\/?(images\/[^"]+?)-(\d{3,4})\.(webp|jpg|png)(\?[^"]*)?"([^>]*?)\/?>/g,
    (match, pre, base, srcW, ext, q, post, offset) => {
      if (isInsideUpgradedPicture(html, offset)) return match;
      const fullAttrs = pre + post;
      const picture = buildPicture(base, fullAttrs);
      return picture || match;
    });

  // Pass 2: <img src="images/.../X.(webp|jpg|png)"> — single-file refs (allow ?v=N).
  html = html.replace(/<img\b([^>]*?)src="\/?(images\/[^"]+?)\.(webp|jpg|png)(\?[^"]*)?"([^>]*?)\/?>/g,
    (match, pre, base, ext, q, post, offset) => {
      if (isInsideUpgradedPicture(html, offset)) return match;
      const fullAttrs = pre + post;
      const picture = buildPicture(base, fullAttrs);
      return picture || match;
    });

  return html;
}

for (const file of HTMLS) {
  const orig = fs.readFileSync(file, 'utf8');
  const out = transformHTML(orig);
  if (out !== orig) {
    fs.writeFileSync(file, out);
    console.log(`upgraded: ${file}`);
  } else {
    console.log(`no change: ${file}`);
  }
}
