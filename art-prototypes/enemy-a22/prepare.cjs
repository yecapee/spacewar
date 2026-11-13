// Sprite extraction/downscaling only. The source already has generated alpha.
const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require(process.env.SPACEWAR_PNG_ROOT || 'pngjs');
const source = PNG.sync.read(fs.readFileSync(path.join(__dirname, 'source.png')));
const names = ['zark-zero', 'zark-plus', 'fort', 'turret', 'orbit-node', 'gozilla'];
const width = source.width / 3, height = source.height / 2;
for (let cell = 0; cell < 6; cell++) {
  const left = cell % 3 * width, top = Math.floor(cell / 3) * height;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (source.data[((top + y) * source.width + left + x) * 4 + 3] < 180) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  const cropWidth = maxX - minX + 1, cropHeight = maxY - minY + 1;
  const edge = cell === 5 ? 160 : 96;
  const scale = (edge - 4) / Math.max(cropWidth, cropHeight);
  const targetWidth = Math.round(cropWidth * scale), targetHeight = Math.round(cropHeight * scale);
  const output = new PNG({ width: targetWidth + 4, height: targetHeight + 4 });
  for (let y = 0; y < targetHeight; y++) for (let x = 0; x < targetWidth; x++) {
    const sx = left + minX + Math.min(cropWidth - 1, Math.floor(x / scale));
    const sy = top + minY + Math.min(cropHeight - 1, Math.floor(y / scale));
    const sourceIndex = (sy * source.width + sx) * 4;
    const destIndex = ((y + 2) * output.width + x + 2) * 4;
    source.data.copy(output.data, destIndex, sourceIndex, sourceIndex + 4);
  }
  const name = path.join(__dirname, '../../img/enemies', `a22-${names[cell]}.png`);
  fs.writeFileSync(name, PNG.sync.write(output));
  console.log(`${names[cell]}: ${output.width} × ${output.height}`);
}
