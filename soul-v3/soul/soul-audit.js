#!/usr/bin/env node
/**
 * soul-audit.js
 *
 * Runs at Stage 1 of the SOUL v3 polish protocol.
 * Inspects the repo and produces a Motion Context Report that the AI
 * must read before deriving the motion language.
 *
 * Usage:
 *   node soul/soul-audit.js
 *   node soul/soul-audit.js --root /path/to/repo
 *   node soul/soul-audit.js --json       (JSON output only)
 *   node soul/soul-audit.js --verbose    (include raw findings)
 *
 * This script is intentionally dependency-free (Node built-ins only).
 * It makes no assumptions about framework — inspects what is there.
 */

const fs = require('fs');
const path = require('path');

// -------- CLI args --------
const args = process.argv.slice(2);
const ROOT = args.includes('--root')
  ? args[args.indexOf('--root') + 1]
  : process.cwd();
const JSON_ONLY = args.includes('--json');
const VERBOSE = args.includes('--verbose');

// -------- Helpers --------

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', '.svelte-kit',
  'dist', 'build', 'out', '.turbo', '.cache', 'coverage',
  '.vercel', '.netlify', 'public', 'static', 'soul', 'soul-v3',
]);

const TEXT_EXTS = new Set([
  '.css', '.scss', '.sass', '.less', '.pcss',
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.vue', '.svelte', '.astro',
  '.html', '.md', '.mdx', '.json',
]);

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && !['.env.example'].includes(entry.name)) {
      if (entry.name !== '.well-known') continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (TEXT_EXTS.has(ext)) out.push(full);
    }
  }
  return out;
}

function readSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); }
  catch { return ''; }
}

function uniq(arr) { return [...new Set(arr)]; }

// -------- Detections --------

function detectFramework(root, files) {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return { name: 'unknown', evidence: 'no package.json' };
  const pkg = JSON.parse(readSafe(pkgPath) || '{}');
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const detect = [
    ['next', 'Next.js'], ['nuxt', 'Nuxt'], ['astro', 'Astro'],
    ['@sveltejs/kit', 'SvelteKit'], ['@remix-run/react', 'Remix'],
    ['vite', 'Vite'], ['react', 'React'], ['vue', 'Vue'], ['svelte', 'Svelte'],
  ];
  for (const [dep, name] of detect) {
    if (deps[dep]) return { name, evidence: `package.json: ${dep}@${deps[dep]}`, deps };
  }
  return { name: 'vanilla / unknown', evidence: 'no framework marker in package.json', deps };
}

function detectAnimationLibs(deps) {
  const anim = {
    gsap: !!deps.gsap,
    lenis: !!deps.lenis || !!deps['@studio-freight/lenis'],
    locomotive: !!deps['locomotive-scroll'],
    framerMotion: !!deps['framer-motion'] || !!deps.motion,
    motionOne: !!deps['motion'] && !deps['framer-motion'],
    three: !!deps.three,
    ogl: !!deps.ogl,
    barba: !!deps['@barba/core'],
    splitting: !!deps.splitting,
    splitType: !!deps['split-type'],
    tailwind: !!deps.tailwindcss,
  };
  const installed = Object.entries(anim).filter(([, v]) => v).map(([k]) => k);
  return { installed, raw: anim };
}

// Typography evidence — grep for font-family, font-weight, etc
function detectTypography(files) {
  const fontFaces = new Set();
  const fontFamilies = new Set();
  const weightsSeen = new Set();
  const lineHeightsSeen = new Set();
  const letterSpacingSeen = new Set();
  const variableFontEvidence = [];

  const fontFamilyRe = /font-family\s*:\s*([^;]+);?/gi;
  const fontFaceRe = /@font-face\s*\{[^}]*?font-family\s*:\s*['"]?([^'";]+)['"]?/gi;
  const weightRe = /font-weight\s*:\s*(\d{3}|bold|normal|lighter|bolder)/gi;
  const lineHeightRe = /line-height\s*:\s*([\d.]+)(?!\w)/gi;
  const letterSpacingRe = /letter-spacing\s*:\s*(-?[\d.]+)(em|rem|px)?/gi;
  const varSettingsRe = /font-variation-settings\s*:\s*([^;]+);?/gi;

  for (const f of files) {
    const ext = path.extname(f);
    if (!['.css', '.scss', '.sass', '.less', '.pcss'].includes(ext) &&
        !['.vue', '.svelte', '.astro', '.tsx', '.jsx'].includes(ext)) continue;
    const content = readSafe(f);
    let m;
    while ((m = fontFaceRe.exec(content))) fontFaces.add(m[1].trim());
    while ((m = fontFamilyRe.exec(content))) {
      const families = m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
      families.forEach(fam => { if (fam && !fam.startsWith('var(')) fontFamilies.add(fam); });
    }
    while ((m = weightRe.exec(content))) weightsSeen.add(m[1]);
    while ((m = lineHeightRe.exec(content))) {
      const val = parseFloat(m[1]);
      if (val > 0.5 && val < 3) lineHeightsSeen.add(val);
    }
    while ((m = letterSpacingRe.exec(content))) letterSpacingSeen.add(m[0]);
    while ((m = varSettingsRe.exec(content))) variableFontEvidence.push(m[1].trim());
  }

  return {
    fontFaces: [...fontFaces],
    fontFamilies: [...fontFamilies].slice(0, 20),
    weightsSeen: [...weightsSeen].sort(),
    lineHeightsSeen: [...lineHeightsSeen].sort((a, b) => a - b),
    letterSpacingSamples: [...letterSpacingSeen].slice(0, 10),
    variableFontEvidence: variableFontEvidence.slice(0, 10),
  };
}

// Color — find tokens that look like color variables
function detectColor(files) {
  const colorVarRe = /--(?:color|bg|fg|text|surface|brand|accent|primary|secondary|border|shadow)[\w-]*\s*:\s*([^;]+);/gi;
  const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  const tokens = {};
  const allHex = new Set();

  for (const f of files) {
    const content = readSafe(f);
    let m;
    while ((m = colorVarRe.exec(content))) {
      const name = m[0].match(/--[\w-]+/)[0];
      const value = m[1].trim();
      tokens[name] = value;
    }
    while ((m = hexRe.exec(content))) {
      const h = '#' + m[1].toLowerCase();
      if (h.length === 4 || h.length === 7 || h.length === 9) allHex.add(h);
    }
  }

  // Infer palette character
  const hexArr = [...allHex];
  let saturationHint = 'unknown';
  let contrastHint = 'unknown';
  if (hexArr.length >= 3) {
    let lowSat = 0, highSat = 0, veryDark = 0, veryLight = 0;
    for (const h of hexArr) {
      const rgb = hexToRgb(h);
      if (!rgb) continue;
      const sat = saturation(rgb);
      const lum = luminance(rgb);
      if (sat < 0.15) lowSat++;
      if (sat > 0.55) highSat++;
      if (lum < 0.1) veryDark++;
      if (lum > 0.95) veryLight++;
    }
    saturationHint = lowSat > highSat ? 'muted / desaturated' : highSat > lowSat ? 'vivid / saturated' : 'mixed';
    contrastHint = (veryDark > 0 && veryLight > 0) ? 'high contrast (near-black + near-white present)' : 'moderate contrast';
  }

  return {
    tokens,
    tokenCount: Object.keys(tokens).length,
    hexColorsFound: hexArr.length,
    saturationHint,
    contrastHint,
    samplePalette: hexArr.slice(0, 12),
  };
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6 && hex.length !== 8) return null;
  return {
    r: parseInt(hex.substr(0, 2), 16) / 255,
    g: parseInt(hex.substr(2, 2), 16) / 255,
    b: parseInt(hex.substr(4, 2), 16) / 255,
  };
}
function saturation({ r, g, b }) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}
function luminance({ r, g, b }) { return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

// Spacing — find spacing variables and detect scale type
function detectSpacing(files) {
  const spacingRe = /--(?:space|spacing|gap|size)[\w-]*\s*:\s*([\d.]+)(px|rem|em)/gi;
  const tokens = {};
  for (const f of files) {
    const content = readSafe(f);
    let m;
    while ((m = spacingRe.exec(content))) {
      const name = m[0].match(/--[\w-]+/)[0];
      const value = parseFloat(m[1]);
      const unit = m[2];
      tokens[name] = { value, unit };
    }
  }
  const values = Object.values(tokens).map(t => t.unit === 'rem' || t.unit === 'em' ? t.value * 16 : t.value).sort((a, b) => a - b);
  
  // Detect scale type
  let scaleType = 'unknown';
  if (values.length >= 4) {
    const ratios = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) ratios.push(values[i] / values[i - 1]);
    }
    const diffs = [];
    for (let i = 1; i < values.length; i++) diffs.push(values[i] - values[i - 1]);
    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const diffRange = Math.max(...diffs) - Math.min(...diffs);
    const diffAvg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    
    if (avgRatio > 1.7 && avgRatio < 2.3) scaleType = 'geometric (doubling, ~2x steps)';
    else if (avgRatio > 1.4 && avgRatio < 1.7) scaleType = 'modular / golden-ratio-ish';
    else if (diffRange / diffAvg < 0.3) scaleType = 'linear (even steps)';
    else scaleType = 'mixed / custom';
  }
  
  return { tokens, values, count: values.length, scaleType };
}

// Radii — detect corner treatment
function detectRadii(files) {
  const radiusRe = /--(?:radius|rounded|corner)[\w-]*\s*:\s*([\d.]+)(px|rem|em|%)?/gi;
  const inlineRadiusRe = /border-radius\s*:\s*([\d.]+)(px|rem|em|%)?/gi;
  const tokens = {};
  const inlineValues = [];
  for (const f of files) {
    const content = readSafe(f);
    let m;
    while ((m = radiusRe.exec(content))) {
      const name = m[0].match(/--[\w-]+/)[0];
      tokens[name] = { value: parseFloat(m[1]), unit: m[2] || 'px' };
    }
    while ((m = inlineRadiusRe.exec(content))) {
      inlineValues.push({ value: parseFloat(m[1]), unit: m[2] || 'px' });
    }
  }
  const allValues = [
    ...Object.values(tokens).map(t => t.unit === 'rem' ? t.value * 16 : t.value),
    ...inlineValues.filter(v => v.unit !== '%').map(v => v.unit === 'rem' ? v.value * 16 : v.value)
  ];
  const maxRadius = allValues.length ? Math.max(...allValues) : null;
  const hasPill = inlineValues.some(v => v.unit === '%' && v.value >= 50) ||
                  inlineValues.some(v => v.value >= 9999) ||
                  Object.values(tokens).some(t => t.value >= 9999);
  let character = 'unknown';
  if (maxRadius !== null) {
    if (maxRadius === 0) character = 'sharp (zero radius)';
    else if (maxRadius <= 4) character = 'architectural / near-sharp';
    else if (maxRadius <= 10) character = 'modest / standard';
    else if (maxRadius <= 20) character = 'softened';
    else character = 'generous / friendly';
    if (hasPill) character += ' (pill shapes present)';
  }
  return { tokens, maxRadius, character, hasPill };
}

// Existing animation evidence in the repo
function detectExistingAnimation(files) {
  const easingsFound = new Set();
  const durationsFound = new Set();
  const transitionsFound = [];
  const gsapCalls = [];
  const clicheFlags = [];

  const cubicBezierRe = /cubic-bezier\([^)]+\)/g;
  const durationRe = /(?:transition-duration|animation-duration|duration)\s*:?\s*([\d.]+)(ms|s)/gi;
  const gsapCallRe = /gsap\.(?:to|from|fromTo|set|timeline)\s*\(/g;

  // Known clichés — signal that the repo already has template DNA
  const clicheSignatures = [
    { re: /cubic-bezier\(\s*0\.16\s*,\s*1\s*,\s*0\.3\s*,\s*1\s*\)/, name: 'Framer/Vercel/Linear easing' },
    { re: /cubic-bezier\(\s*0\.19\s*,\s*1\s*,\s*0\.22\s*,\s*1\s*\)/, name: 'Penner easeOutExpo' },
    { re: /cubic-bezier\(\s*0\.34\s*,\s*1\.56\s*,\s*0\.64\s*,\s*1\s*\)/, name: 'easeOutBack (stock)' },
    { re: /cubic-bezier\(\s*0\.4\s*,\s*0\s*,\s*0\.2\s*,\s*1\s*\)/, name: 'Material standard easing' },
    { re: /locomotive-scroll/i, name: 'Locomotive Scroll (legacy)' },
    { re: /\blerp\s*:\s*0\.07\b/, name: 'Locomotive default lerp 0.07' },
    { re: /multiplier\s*:\s*0\.9\b/, name: 'Locomotive default multiplier 0.9' },
    { re: /data-scroll-speed\s*=/, name: 'Locomotive data-scroll-speed attribute' },
    { re: /@barba\/core|barba\.init/, name: 'Barba.js page transitions' },
    { re: /\.magnetic\b|class\s*=\s*["'][^"']*magnetic/, name: 'Magnetic button pattern' },
    { re: /cursor-(?:dot|ring|follower)/, name: 'Two-part custom cursor pattern' },
    { re: /grain\.(?:png|webp|jpg)/i, name: 'Grain overlay PNG' },
    { re: /noise\.(?:png|webp|svg)/i, name: 'Noise overlay asset' },
  ];

  for (const f of files) {
    const ext = path.extname(f);
    const content = readSafe(f);
    
    let m;
    while ((m = cubicBezierRe.exec(content))) easingsFound.add(m[0]);
    while ((m = durationRe.exec(content))) {
      const val = parseFloat(m[1]);
      const ms = m[2] === 's' ? val * 1000 : val;
      if (ms > 0 && ms < 10000) durationsFound.add(ms);
    }
    while ((m = gsapCallRe.exec(content))) {
      gsapCalls.push({ file: path.relative(ROOT, f), call: m[0] });
    }
    for (const c of clicheSignatures) {
      if (c.re.test(content)) {
        clicheFlags.push({ cliche: c.name, file: path.relative(ROOT, f) });
      }
    }
  }

  return {
    easingsFound: [...easingsFound],
    durationsFound: [...durationsFound].sort((a, b) => a - b),
    gsapCallCount: gsapCalls.length,
    gsapCallSamples: gsapCalls.slice(0, 10),
    clichesDetected: clicheFlags.slice(0, 30),
  };
}

// Content inventory — copy samples, images, content types
function detectContent(root, files) {
  const copyFiles = [];
  const contentDirs = ['content', 'data', 'posts', 'articles', 'case-studies', 'projects', 'work'];
  const mdFiles = files.filter(f => ['.md', '.mdx'].includes(path.extname(f)));
  const jsonDataFiles = files.filter(f => {
    if (path.extname(f) !== '.json') return false;
    const rel = path.relative(root, f);
    return contentDirs.some(d => rel.includes(`/${d}/`) || rel.startsWith(`${d}/`));
  });
  
  // Count images in public/ and similar
  let imageCount = 0;
  function countImages(dir) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        if (entry.isDirectory()) countImages(path.join(dir, entry.name));
        else if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(entry.name)) imageCount++;
      }
    } catch {}
  }
  ['public', 'static', 'assets'].forEach(d => {
    const p = path.join(root, d);
    if (fs.existsSync(p)) countImages(p);
  });

  return {
    markdownContentCount: mdFiles.length,
    jsonContentCount: jsonDataFiles.length,
    imageCount,
    contentFileSamples: mdFiles.slice(0, 5).map(f => path.relative(root, f)),
  };
}

// -------- Run audit --------

function runAudit() {
  const files = walk(ROOT);
  const framework = detectFramework(ROOT, files);
  const libs = detectAnimationLibs(framework.deps || {});
  const typography = detectTypography(files);
  const color = detectColor(files);
  const spacing = detectSpacing(files);
  const radii = detectRadii(files);
  const animation = detectExistingAnimation(files);
  const content = detectContent(ROOT, files);

  return {
    meta: {
      root: ROOT,
      filesScanned: files.length,
      generatedAt: new Date().toISOString(),
      soulVersion: '3.0',
    },
    framework,
    libraries: libs,
    typography,
    color,
    spacing,
    radii,
    existingAnimation: animation,
    content,
  };
}

// -------- Format output --------

function formatHuman(audit) {
  const L = [];
  L.push('');
  L.push('━'.repeat(72));
  L.push('SOUL v3 — MOTION CONTEXT REPORT');
  L.push('━'.repeat(72));
  L.push(`Scanned: ${audit.meta.filesScanned} files in ${audit.meta.root}`);
  L.push(`Generated: ${audit.meta.generatedAt}`);
  L.push('');

  // Framework
  L.push('┌─ FRAMEWORK ─────────────────────────────────────────────────────────');
  L.push(`│  ${audit.framework.name}`);
  L.push(`│  ${audit.framework.evidence}`);
  L.push('└─');
  L.push('');

  // Libraries
  L.push('┌─ ANIMATION / SCROLL LIBRARIES INSTALLED ────────────────────────────');
  if (audit.libraries.installed.length === 0) {
    L.push('│  (none) — good. Decide per project, starting from native.');
  } else {
    audit.libraries.installed.forEach(lib => L.push(`│  • ${lib}`));
    if (audit.libraries.raw.locomotive) {
      L.push('│  ⚠ Locomotive Scroll detected — legacy. Consider Lenis or native.');
    }
  }
  L.push('└─');
  L.push('');

  // Typography
  L.push('┌─ TYPOGRAPHY EVIDENCE ───────────────────────────────────────────────');
  L.push(`│  Font faces declared: ${audit.typography.fontFaces.length}`);
  if (audit.typography.fontFaces.length) {
    audit.typography.fontFaces.slice(0, 5).forEach(f => L.push(`│    • ${f}`));
  }
  L.push(`│  Font families referenced: ${audit.typography.fontFamilies.join(', ') || '(none detected)'}`);
  L.push(`│  Weights used: ${audit.typography.weightsSeen.join(', ') || '(none detected)'}`);
  L.push(`│  Line-heights sampled: ${audit.typography.lineHeightsSeen.slice(0, 8).join(', ') || '(none)'}`);
  if (audit.typography.variableFontEvidence.length) {
    L.push(`│  Variable font use: YES (${audit.typography.variableFontEvidence.length} instances)`);
  }
  L.push('│');
  L.push('│  DERIVATION PROMPT:');
  L.push('│   → Open derive-motion.md, Derivation 1 (Tempo).');
  L.push('│   → Use the weights/widths/style above to land a tempo range.');
  L.push('│   → Narrow using the line-height samples.');
  L.push('└─');
  L.push('');

  // Color
  L.push('┌─ COLOR EVIDENCE ────────────────────────────────────────────────────');
  L.push(`│  Color tokens defined: ${audit.color.tokenCount}`);
  L.push(`│  Total hex colors found: ${audit.color.hexColorsFound}`);
  L.push(`│  Saturation character: ${audit.color.saturationHint}`);
  L.push(`│  Contrast character: ${audit.color.contrastHint}`);
  if (audit.color.samplePalette.length) {
    L.push(`│  Palette sample: ${audit.color.samplePalette.slice(0, 8).join('  ')}`);
  }
  L.push('│');
  L.push('│  DERIVATION PROMPT:');
  L.push('│   → Open derive-motion.md, Derivation 2 (Easing).');
  L.push('│   → Combine with radii below to shape the primary easing curve.');
  L.push('└─');
  L.push('');

  // Spacing
  L.push('┌─ SPACING EVIDENCE ──────────────────────────────────────────────────');
  L.push(`│  Spacing tokens: ${audit.spacing.count}`);
  L.push(`│  Scale type: ${audit.spacing.scaleType}`);
  if (audit.spacing.values.length) {
    L.push(`│  Values (px-normalized): ${audit.spacing.values.slice(0, 10).join(', ')}${audit.spacing.values.length > 10 ? '...' : ''}`);
  }
  L.push('│');
  L.push('│  DERIVATION PROMPT:');
  L.push('│   → Open derive-motion.md, Derivation 3 (Stagger).');
  L.push('│   → Scale type above informs stagger personality.');
  L.push('└─');
  L.push('');

  // Radii
  L.push('┌─ RADII / CORNER EVIDENCE ───────────────────────────────────────────');
  L.push(`│  Corner character: ${audit.radii.character}`);
  if (audit.radii.maxRadius !== null) {
    L.push(`│  Max radius (px-normalized): ${audit.radii.maxRadius}`);
  }
  L.push('│');
  L.push('│  DERIVATION PROMPT:');
  L.push('│   → Feeds into Derivation 2 (Easing) alongside color character.');
  L.push('└─');
  L.push('');

  // Existing animation
  L.push('┌─ EXISTING ANIMATION IN REPO ────────────────────────────────────────');
  L.push(`│  cubic-bezier curves in code: ${audit.existingAnimation.easingsFound.length}`);
  audit.existingAnimation.easingsFound.slice(0, 6).forEach(e => L.push(`│    • ${e}`));
  L.push(`│  Durations in code (ms): ${audit.existingAnimation.durationsFound.slice(0, 10).join(', ')}${audit.existingAnimation.durationsFound.length > 10 ? '...' : ''}`);
  L.push(`│  GSAP calls in code: ${audit.existingAnimation.gsapCallCount}`);
  L.push('└─');
  L.push('');

  // Clichés
  L.push('┌─ CLICHÉ FLAGS ──────────────────────────────────────────────────────');
  if (audit.existingAnimation.clichesDetected.length === 0) {
    L.push('│  No saturated clichés detected in existing code. Good starting point.');
  } else {
    L.push(`│  ${audit.existingAnimation.clichesDetected.length} cliché signature(s) found in the repo:`);
    audit.existingAnimation.clichesDetected.slice(0, 10).forEach(c => {
      L.push(`│   ⚠ ${c.cliche}`);
      L.push(`│      in: ${c.file}`);
    });
    if (audit.existingAnimation.clichesDetected.length > 10) {
      L.push(`│   ... and ${audit.existingAnimation.clichesDetected.length - 10} more (see --verbose)`);
    }
    L.push('│');
    L.push('│  → Review cliches.md. Each flagged item must be removed OR');
    L.push('│    justified in CHARTER.md with a specific modification.');
  }
  L.push('└─');
  L.push('');

  // Content
  L.push('┌─ CONTENT INVENTORY ─────────────────────────────────────────────────');
  L.push(`│  Markdown/MDX content files: ${audit.content.markdownContentCount}`);
  L.push(`│  JSON content files: ${audit.content.jsonContentCount}`);
  L.push(`│  Images in public/static/assets: ${audit.content.imageCount}`);
  L.push('│');
  L.push('│  SIGNATURE PROMPT:');
  L.push('│   → The signature interaction (Stage 4) should USE this content,');
  L.push('│     not a generic technique. Read signature.md after deriving.');
  L.push('└─');
  L.push('');

  // Next actions
  L.push('━'.repeat(72));
  L.push('NEXT STEPS');
  L.push('━'.repeat(72));
  L.push('');
  L.push('1. Open /soul/derive-motion.md and complete all five derivations.');
  L.push('   Write the output to /soul/CHARTER.md.');
  L.push('');
  L.push('2. Cross-reference derived easing with the cliché list in cliches.md.');
  L.push('   If the derivation lands near a stock curve, shift control points.');
  L.push('');
  L.push('3. Open /soul/differentiate.md. Inspect 3 competitors.');
  L.push('   Update CHARTER.md with specific divergences.');
  L.push('');
  L.push('4. Open /soul/signature.md. Derive the signature from the content');
  L.push('   inventory above. Build it first, in isolation.');
  L.push('');
  L.push('5. Proceed to Stage 5 (macro choreography), then silences, sensory,');
  L.push('   cliché scan, and final verification.');
  L.push('');
  L.push('━'.repeat(72));
  L.push('');

  return L.join('\n');
}

// -------- Main --------

const audit = runAudit();

if (JSON_ONLY) {
  console.log(JSON.stringify(audit, null, 2));
} else {
  console.log(formatHuman(audit));
  if (VERBOSE) {
    console.log('\n--- RAW AUDIT JSON ---\n');
    console.log(JSON.stringify(audit, null, 2));
  }
}

// Also write to /soul/AUDIT.json for later reference by the AI
try {
  const outDir = path.join(ROOT, 'soul');
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(
      path.join(outDir, 'AUDIT.json'),
      JSON.stringify(audit, null, 2)
    );
    if (!JSON_ONLY) {
      console.log('Audit written to: soul/AUDIT.json');
      console.log('');
    }
  }
} catch (e) {
  // silent — not critical
}
