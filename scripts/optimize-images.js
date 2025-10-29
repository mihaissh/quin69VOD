const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP(inputPath, outputPath, options = {}) {
  const { quality = 80, effort = 6 } = options;
  
  try {
    await sharp(inputPath)
      .webp({ quality, effort })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`  ✅ ${path.basename(outputPath)}`);
    console.log(`     Original: ${(inputStats.size / 1024).toFixed(1)} KiB`);
    console.log(`     WebP: ${(outputStats.size / 1024).toFixed(1)} KiB`);
    console.log(`     Savings: ${savings}%\n`);
    
    return { success: true, savings };
  } catch (error) {
    console.error(`  ❌ Failed to convert ${inputPath}:`, error.message);
    return { success: false, error };
  }
}

async function optimizePNG(inputPath) {
  try {
    const buffer = await sharp(inputPath)
      .png({ quality: 85, compressionLevel: 9, palette: true })
      .toBuffer();
    
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    const newSize = buffer.length;
    
    if (newSize < originalSize) {
      fs.writeFileSync(inputPath, buffer);
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`  ✅ ${path.basename(inputPath)}`);
      console.log(`     Original: ${(originalSize / 1024).toFixed(1)} KiB`);
      console.log(`     Optimized: ${(newSize / 1024).toFixed(1)} KiB`);
      console.log(`     Savings: ${savings}%\n`);
    } else {
      console.log(`  ℹ️  ${path.basename(inputPath)} - Already optimized\n`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`  ❌ Failed to optimize ${inputPath}:`, error.message);
    return { success: false, error };
  }
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');
  console.log('================================================\n');

  // Convert quin69.png to WebP
  console.log('📦 Converting quin69.png to WebP...\n');
  const quin69Png = 'public/quin69.png';
  const quin69WebP = 'public/quin69.webp';
  
  if (fs.existsSync(quin69Png)) {
    await convertToWebP(quin69Png, quin69WebP, { quality: 90, effort: 6 });
  } else {
    console.log('  ⚠️  quin69.png not found\n');
  }

  // Optimize other PNG files
  console.log('📦 Optimizing PNG files...\n');
  const pngFiles = ['public/favicon.png', 'public/meta_image.png', 'public/quin69.png'];
  
  for (const pngFile of pngFiles) {
    if (fs.existsSync(pngFile)) {
      await optimizePNG(pngFile);
    }
  }

  console.log('================================================');
  console.log('🎉 Image optimization complete!\n');
  console.log('Images optimized:');
  console.log('- quin69.png → WebP + optimized PNG');
  console.log('- favicon.png → optimized');
  console.log('- meta_image.png → optimized\n');
}

optimizeImages().catch(err => {
  console.error('❌ Error optimizing images:', err);
  process.exit(1);
});
