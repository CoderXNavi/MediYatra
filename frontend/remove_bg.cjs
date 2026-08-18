const fs = require('fs');
const { PNG } = require('pngjs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'logo_icon.png');
const outputPath = path.join(__dirname, 'public', 'logo_clean.png');

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // Detect cream/white/beige paper background pixels
        if (r > 180 && g > 170 && b > 155) {
          this.data[idx + 3] = 0; // Transparent alpha
        } else {
          this.data[idx + 3] = 255;
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Successfully created clean transparent logo:', outputPath);
    });
  });
