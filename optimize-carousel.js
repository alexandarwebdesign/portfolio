const { execSync } = require('child_process');

try {
  console.log("Optimizing image 1...");
  execSync('node Gems/scripts/process-image.js "Gems/raw-birse/1920w light-6.png" "images/projects" --name=birse-carousel-1 --quality=portfolio', { stdio: 'inherit' });

  console.log("Optimizing image 2...");
  execSync('node Gems/scripts/process-image.js "Gems/raw-birse/1920w light-8.png" "images/projects" --name=birse-carousel-2 --quality=portfolio', { stdio: 'inherit' });

  console.log("Optimizing image 3...");
  execSync('node Gems/scripts/process-image.js "Gems/raw-birse/1920w light-9.png" "images/projects" --name=birse-carousel-3 --quality=portfolio', { stdio: 'inherit' });

  console.log("Optimization complete! You can now check the Birsé page.");
} catch (error) {
  console.error("An error occurred during optimization:");
  console.error(error.message);
}
