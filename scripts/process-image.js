#!/usr/bin/env node

/**
 * process-image.js
 *
 * Takes a master image (JPEG/PNG/WebP/etc.) and produces:
 *   - AVIF variants at multiple widths (smallest, best compression)
 *   - WebP variants at the same widths (broad browser support)
 *   - JPEG variants as universal fallback
 *   - A base64-encoded blur placeholder (~20px wide, for blurDataURL)
 *
 * Usage:
 *   node process-image.js <input> [output-dir] [--name=<slug>] [--quality=portfolio|standard]
 *
 * Examples:
 *   node process-image.js ./hero.jpg
 *   node process-image.js ./hero.jpg ./public/img
 *   node process-image.js ./raw.jpg ./public/img --name=studio-01 --quality=portfolio
 *
 * Quality presets:
 *   standard  — AVIF 60 / WebP 80 / JPEG 82  (default; good for general use)
 *   portfolio — AVIF 72 / WebP 88 / JPEG 90  (for hero/portfolio photography on retina)
 *
 * Requires: sharp ( npm install sharp )
 *
 * Output filenames:
 *   <name>-500.avif, <name>-800.avif, ..., <name>-3200.avif
 *   <name>-500.webp, <name>-800.webp, ..., <name>-3200.webp
 *   <name>-500.jpg,  <name>-800.jpg,  ..., <name>-3200.jpg
 *   <name>.blur.txt        (base64 data URL for blur placeholder)
 *
 * The widths used match Webflow's defaults (3200, 2600, 2000, 1600, 1080, 800, 500)
 * with one tweak — we drop 2600 in favor of 2400 because 2400 = 1200px @ 2x retina,
 * which is the most common display size on modern laptops.
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('\n  ERROR: sharp is not installed.');
  console.error('  Run: npm install sharp\n');
  process.exit(1);
}

// ─── Configuration ─────────────────────────────────────────────────────────

// Widths to generate. The script will skip any width >= the source width
// (no point upscaling — that just wastes bytes).
const WIDTHS = [500, 800, 1080, 1600, 2400, 3200];

// Quality presets.
//   standard  — sweet-spot for content imagery
//   portfolio — for hero/portfolio photography that must look tack-sharp on retina
//               (matches the byte budget of award-winning portfolio sites like
//               dennissnellenberg.com, which ship single ~1MB JPEGs per image)
const QUALITY_PRESETS = {
  standard:  { avif: 60, webp: 80, jpeg: 82 },
  portfolio: { avif: 80, webp: 92, jpeg: 92 },
};

// Blur placeholder size — 20px wide is enough for a recognizable preview
// while keeping the base64 string under ~500 chars.
const BLUR_WIDTH = 20;

// ─── Argument parsing ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
  console.log(`
  Usage: node process-image.js <input> [output-dir] [--name=<slug>] [--quality=standard|portfolio]

  Examples:
    node process-image.js ./hero.jpg
    node process-image.js ./hero.jpg ./public/img
    node process-image.js ./raw.jpg ./public/img --name=studio-01 --quality=portfolio
  `);
  process.exit(args.length < 1 ? 1 : 0);
}

const flagArgs = args.filter((a) => a.startsWith('--'));
const positional = args.filter((a) => !a.startsWith('--'));

const nameFlag = flagArgs.find((a) => a.startsWith('--name='));
const customName = nameFlag ? nameFlag.split('=')[1] : null;

const qualityFlag = flagArgs.find((a) => a.startsWith('--quality='));
const qualityPreset = qualityFlag ? qualityFlag.split('=')[1] : 'standard';
const QUALITY = QUALITY_PRESETS[qualityPreset];
if (!QUALITY) {
  console.error(`  ERROR: Unknown quality preset "${qualityPreset}". Use "standard" or "portfolio".`);
  process.exit(1);
}

const inputPath = path.resolve(positional[0]);
const outputDir = path.resolve(positional[1] || path.dirname(inputPath));

if (!fs.existsSync(inputPath)) {
  console.error(`  ERROR: Input file not found: ${inputPath}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const baseName = customName || path.parse(inputPath).name;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function generateVariant(width, format) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const outputPath = path.join(outputDir, `${baseName}-${width}.${ext}`);

  let pipeline = sharp(inputPath).resize({
    width,
    withoutEnlargement: true,
    fit: 'inside',
    kernel: 'lanczos3',
  });

  // Light unsharp mask after downscale to restore perceptual sharpness lost
  // to resize + lossy compression. Stronger for portfolio preset.
  if (QUALITY === QUALITY_PRESETS.portfolio) {
    pipeline = pipeline.sharpen({ sigma: 0.8, m1: 0.6, m2: 0.4 });
  } else {
    pipeline = pipeline.sharpen({ sigma: 0.5 });
  }

  if (format === 'avif') {
    pipeline = pipeline.avif({ quality: QUALITY.avif, effort: 6, chromaSubsampling: '4:4:4' });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: QUALITY.webp, effort: 6, smartSubsample: true });
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: QUALITY.jpeg, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' });
  }

  await pipeline.toFile(outputPath);
  const stats = fs.statSync(outputPath);
  return { format, width, path: outputPath, size: stats.size };
}

async function generateBlurPlaceholder() {
  const buffer = await sharp(inputPath)
    .resize({ width: BLUR_WIDTH })
    .jpeg({ quality: 50 })
    .toBuffer();

  const base64 = buffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;
  const outputPath = path.join(outputDir, `${baseName}.blur.txt`);
  fs.writeFileSync(outputPath, dataUrl);
  return { path: outputPath, size: dataUrl.length };
}

// ─── Main ──────────────────────────────────────────────────────────────────

(async () => {
  console.log(`\n  Processing: ${path.basename(inputPath)}`);
  console.log(`  Output dir: ${outputDir}\n`);

  // Inspect source to skip widths larger than the source
  const metadata = await sharp(inputPath).metadata();
  console.log(`  Source: ${metadata.width}×${metadata.height} ${metadata.format} (${formatBytes(fs.statSync(inputPath).size)})\n`);

  const widthsToUse = WIDTHS.filter((w) => w <= metadata.width);
  if (widthsToUse.length === 0) {
    // Source is smaller than even the smallest variant — just generate at source width
    widthsToUse.push(metadata.width);
  } else if (widthsToUse[widthsToUse.length - 1] < metadata.width) {
    // Always include the source width as the largest variant if it's not already covered
    // (only if source is meaningfully larger than the largest standard width)
    if (metadata.width > widthsToUse[widthsToUse.length - 1] + 200) {
      widthsToUse.push(metadata.width);
    }
  }

  const formats = ['avif', 'webp', 'jpeg'];
  const results = [];

  for (const format of formats) {
    console.log(`  Generating ${format.toUpperCase()} variants...`);
    for (const width of widthsToUse) {
      try {
        const result = await generateVariant(width, format);
        results.push(result);
        console.log(`    ${path.basename(result.path).padEnd(40)} ${formatBytes(result.size).padStart(10)}`);
      } catch (err) {
        console.error(`    Failed at ${width}px ${format}: ${err.message}`);
      }
    }
    console.log('');
  }

  console.log(`  Generating blur placeholder...`);
  const blur = await generateBlurPlaceholder();
  console.log(`    ${path.basename(blur.path).padEnd(40)} ${formatBytes(blur.size).padStart(10)}\n`);

  // Summary
  const totalBytes = results.reduce((sum, r) => sum + r.size, 0);
  const sourceBytes = fs.statSync(inputPath).size;
  console.log(`  ─────────────────────────────────────────────────────────`);
  console.log(`  Source:       ${formatBytes(sourceBytes)}`);
  console.log(`  All variants: ${formatBytes(totalBytes)} across ${results.length} files`);
  console.log(`  Largest AVIF: ${formatBytes(Math.max(...results.filter(r => r.format === 'avif').map(r => r.size)))}`);
  console.log(`  Largest WebP: ${formatBytes(Math.max(...results.filter(r => r.format === 'webp').map(r => r.size)))}`);
  console.log(`  Largest JPEG: ${formatBytes(Math.max(...results.filter(r => r.format === 'jpeg').map(r => r.size)))}`);
  console.log(`  ─────────────────────────────────────────────────────────\n`);
  console.log(`  Done. Use the variants in <picture> / next/image / your CMS.\n`);
})().catch((err) => {
  console.error(`\n  ERROR: ${err.message}\n`);
  process.exit(1);
});
