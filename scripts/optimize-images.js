// ==========================================================================
//   IMAGE OPTIMIZATION SCRIPT
//   Reads every image from images/raw/ and outputs 3 WebP sizes to
//   images/projects/[filename]-800.webp | -1440.webp | -2880.webp
// ==========================================================================

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories
const INPUT_DIR = path.join(__dirname, '..', 'images', 'raw');
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'projects');

// Target widths
const WIDTHS = [800, 1440, 2880];

// Supported input formats
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif'];

async function optimizeImages() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  // Read all files from input directory
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log('No supported images found in images/raw/');
    console.log(`Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`);
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to process...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.basename(file, path.extname(file));

    console.log(`Processing: ${file}`);

    for (const width of WIDTHS) {
      const outputFilename = `${baseName}-${width}.webp`;
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      try {
        const metadata = await sharp(inputPath).metadata();

        // Only upscale if source is wide enough, otherwise just convert
        const shouldResize = metadata.width > width;

        await sharp(inputPath)
          .resize(shouldResize ? width : metadata.width, null, {
            withoutEnlargement: false,
            fit: 'inside',
          })
          .webp({
            quality: width <= 800 ? 82 : width <= 1440 ? 85 : 88,
            effort: 4,
          })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const sizeKb = (stats.size / 1024).toFixed(1);
        console.log(`  ✓ ${outputFilename} (${sizeKb} KB)`);
        successCount++;

      } catch (err) {
        console.error(`  ✗ Failed ${outputFilename}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('');
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`Done! ${successCount} file(s) generated, ${errorCount} error(s).`);
  console.log(`Output location: images/projects/`);
}

optimizeImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
