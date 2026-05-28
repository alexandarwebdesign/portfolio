#!/usr/bin/env node
// Strip nested <picture> blocks. Keep outermost wrapper, dedupe all sources,
// keep the single final <img>.

const fs = require('fs');

const FILES = ['index.html', 'about.html', 'forma-architects.html'];

function fixOnce(html) {
  // Find every outermost picture by walking with a stack.
  const out = [];
  let i = 0;
  while (i < html.length) {
    const open = html.indexOf('<picture', i);
    if (open === -1) { out.push(html.slice(i)); break; }
    out.push(html.slice(i, open));

    // Walk to find balanced </picture>
    let depth = 0;
    let j = open;
    let blockStart = open;
    let blockEnd = -1;
    while (j < html.length) {
      const nextOpen = html.indexOf('<picture', j + 1);
      const nextClose = html.indexOf('</picture>', j + 1);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        j = nextOpen;
      } else {
        if (depth === 0) {
          blockEnd = nextClose + '</picture>'.length;
          break;
        }
        depth--;
        j = nextClose;
      }
    }

    if (blockEnd === -1) {
      out.push(html.slice(open));
      break;
    }

    const block = html.slice(blockStart, blockEnd);
    // Collapse: collect all unique sources + first img
    const sources = [...block.matchAll(/<source\b[^>]*>/g)].map(m => m[0]);
    const seen = new Set();
    const unique = [];
    for (const s of sources) {
      const typeM = s.match(/\btype="([^"]+)"/);
      const srcsetM = s.match(/\bsrcset="([^"]+)"/);
      if (!srcsetM) continue;
      const key = (typeM ? typeM[1] : '') + '|' + srcsetM[1];
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(s);
    }
    const imgMatch = block.match(/<img\b[^>]*>/);
    if (imgMatch && (unique.length > 0)) {
      out.push('<picture>\n  ' + unique.join('\n  ') + '\n  ' + imgMatch[0] + '\n</picture>');
    } else {
      out.push(block);
    }

    i = blockEnd;
  }
  return out.join('');
}

for (const file of FILES) {
  const orig = fs.readFileSync(file, 'utf8');
  let fixed = orig;
  for (let i = 0; i < 5; i++) {
    const next = fixOnce(fixed);
    if (next === fixed) break;
    fixed = next;
  }
  if (fixed !== orig) {
    fs.writeFileSync(file, fixed);
    console.log(`fixed: ${file}  (${orig.length} -> ${fixed.length} chars)`);
  } else {
    console.log(`clean: ${file}`);
  }
}
