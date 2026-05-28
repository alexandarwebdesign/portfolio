#!/usr/bin/env node
// Inject inline LQIP background on every <picture> whose image has a .blur.txt
// sibling. Wraps the picture so a blurred placeholder shows before the real
// image decodes. Adds class `is-loaded` via inline onload on the <img>.

const fs = require('fs');
const path = require('path');

const HTMLS = ['index.html', 'about.html', 'forma-architects.html'];

// Read all .blur.txt files into a map keyed by logical name (full path).
function blurMap() {
  const map = {};
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === 'raw' || e.name === 'toups') continue;
        walk(p);
      } else if (e.name.endsWith('.blur.txt')) {
        const logical = path.join(d, e.name.replace(/\.blur\.txt$/, '')).replace(/\\/g, '/');
        map[logical] = fs.readFileSync(p, 'utf8').trim();
      }
    }
  }
  walk('images');
  return map;
}

const BLUR = blurMap();

function transform(html) {
  return html.replace(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g, (block) => {
    // Skip if already LQIP-wrapped
    if (block.includes('lqip-wrap')) return block;
    const imgM = block.match(/<img\b[^>]*src="\/?(images\/[^"]+?)-(\d{3,4})\.(webp|jpg|png)(\?[^"]*)?"[^>]*>/);
    if (!imgM) return block;
    const key = imgM[1];
    const blur = BLUR[key];
    if (!blur) return block;

    // Inject onload class on <img>
    let updated = block.replace(/<img\b/, '<img onload="this.parentElement.parentElement.classList.add(\'is-loaded\')"');

    return `<span class="lqip-wrap" style="background-image:url('${blur}')">${updated}</span>`;
  });
}

for (const f of HTMLS) {
  const before = fs.readFileSync(f, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(f, after);
    console.log(`lqip-wrapped: ${f}`);
  } else {
    console.log(`no-change: ${f}`);
  }
}
