#!/usr/bin/env node
// Regenerate AVIF + WebP + JPEG variants (portfolio quality) for every logical
// source image referenced on the site, EXCLUDING:
//   - images/raw (originals only)
//   - images/marquee (already regenerated)
//   - images/Mockups (sharp-edge PNGs with transparency)
//   - SVG, webm

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = 'images';
const WIDTHS = [500, 800, 1080, 1600, 2400, 3200];
const QUALITY = { avif: 80, webp: 92, jpeg: 92 };

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'raw' || e.name === 'marquee' || e.name === 'Mockups') continue;
      out = out.concat(walk(p));
    } else if (/\.(jpe?g|webp|png)$/i.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

function groupLogical(files) {
  const groups = {};
  for (const p of files) {
    const dir = path.dirname(p);
    const base = path.basename(p, path.extname(p));
    const m = base.match(/^(.+)-(\d{3,4})$/);
    const logical = m ? path.join(dir, m[1]) : path.join(dir, base);
    if (!groups[logical]) groups[logical] = [];
    groups[logical].push(p);
  }
  return groups;
}

async function pickSource(items) {
  let best = null, bestW = 0;
  for (const p of items) {
    try {
      const m = await sharp(p).metadata();
      if (m.width > bestW) { bestW = m.width; best = p; }
    } catch {}
  }
  return { source: best, width: bestW };
}

async function regen(logical, source, srcWidth) {
  const dir = path.dirname(logical);
  const name = path.basename(logical);
  const widths = WIDTHS.filter(w => w <= srcWidth);
  if (!widths.length) widths.push(srcWidth);
  if (widths[widths.length - 1] < srcWidth - 200) widths.push(srcWidth);

  console.log(`\n${name}  (source ${srcWidth}w from ${path.basename(source)})`);

  const srcBuf = fs.readFileSync(source);

  for (const fmt of ['avif', 'webp', 'jpeg']) {
    const ext = fmt === 'jpeg' ? 'jpg' : fmt;
    for (const w of widths) {
      const out = path.join(dir, `${name}-${w}.${ext}`);
      let p = sharp(srcBuf).resize({ width: w, withoutEnlargement: true, fit: 'inside', kernel: 'lanczos3' });
      p = p.sharpen({ sigma: 0.8, m1: 0.6, m2: 0.4 });
      if (fmt === 'avif') p = p.avif({ quality: QUALITY.avif, effort: 6, chromaSubsampling: '4:4:4' });
      else if (fmt === 'webp') p = p.webp({ quality: QUALITY.webp, effort: 6, smartSubsample: true });
      else p = p.jpeg({ quality: QUALITY.jpeg, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' });
      await p.toFile(out);
    }
  }

  // blur placeholder
  const blur = await sharp(srcBuf).resize({ width: 20 }).jpeg({ quality: 50 }).toBuffer();
  fs.writeFileSync(path.join(dir, `${name}.blur.txt`), `data:image/jpeg;base64,${blur.toString('base64')}`);
}

(async () => {
  const files = walk(ROOT);
  const groups = groupLogical(files);
  for (const [logical, items] of Object.entries(groups)) {
    const { source, width } = await pickSource(items);
    if (!source) continue;
    if (width < 400) { console.log(`SKIP ${logical} (${width}w too small)`); continue; }
    try {
      await regen(logical, source, width);
    } catch (e) {
      console.error(`FAIL ${logical}:`, e.message);
    }
  }
  console.log('\nDone.');
})();
