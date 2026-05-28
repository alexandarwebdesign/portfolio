#!/usr/bin/env node
// Rebuild every <picture> block in the HTML: derive logical name from the
// inner <img src>, then regenerate the AVIF/WebP/JPG <source> srcsets using
// the on-disk variant inventory.

const fs = require('fs');
const path = require('path');

function buildInventory() {
  const r = {};
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === 'raw') continue;
        walk(p);
      } else {
        const m = e.name.match(/^(.+)-(\d{3,4})\.(avif|webp|jpg)$/i);
        if (!m) continue;
        const key = path.join(d, m[1]).replace(/\\/g, '/');
        const w = parseInt(m[2]);
        const fmt = m[3].toLowerCase();
        if (!r[key]) r[key] = { avif: [], webp: [], jpg: [] };
        if (!r[key][fmt].includes(w)) r[key][fmt].push(w);
      }
    }
  }
  walk('images');
  for (const k of Object.keys(r)) {
    for (const f of ['avif', 'webp', 'jpg']) r[k][f].sort((a, b) => a - b);
  }
  return r;
}

const INV = buildInventory();

function setOf(key, fmt) {
  if (!INV[key]) return null;
  const widths = INV[key][fmt];
  if (!widths.length) return null;
  return widths.map(w => `/${key}-${w}.${fmt} ${w}w`).join(', ');
}

function fallbackOf(key) {
  if (!INV[key]) return null;
  const widths = INV[key].jpg || [];
  if (!widths.length) return null;
  return `/${key}-${widths.find(w => w >= 1080) || widths[widths.length - 1]}.jpg`;
}

for (const file of ['forma-architects.html', 'index.html', 'about.html']) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g, (block) => {
    const imgM = block.match(/<img\b[^>]*src="\/?(images\/[^"]+?)-(\d{3,4})\.(webp|jpg|png)(\?[^"]*)?"[^>]*>/);
    if (!imgM) return block;
    const key = imgM[1];
    if (!INV[key]) return block;

    const sizesM = block.match(/\bsizes="([^"]+)"/);
    const sizes = sizesM ? sizesM[1] : '100vw';

    const avifSet = setOf(key, 'avif');
    const webpSet = setOf(key, 'webp');
    const jpgSet  = setOf(key, 'jpg');
    const fallback = fallbackOf(key);
    if (!avifSet || !webpSet || !jpgSet || !fallback) return block;

    let img = imgM[0];
    img = img.replace(/\bsrcset="[^"]*"/, `srcset="${jpgSet}"`);
    img = img.replace(/\bsrc="[^"]*"/, `src="${fallback}"`);
    img = img.replace(/\bsizes="[^"]*"/, `sizes="${sizes}"`);

    return `<picture>\n  <source type="image/avif" srcset="${avifSet}" sizes="${sizes}">\n  <source type="image/webp" srcset="${webpSet}" sizes="${sizes}">\n  ${img}\n</picture>`;
  });
  fs.writeFileSync(file, html);
  console.log(`rebuilt: ${file}`);
}
