import drawKaiju from './kaijuRenderer.mjs';
const urls = {
  zero: new URL('../img/enemies/a22-zark-zero.png', import.meta.url),
  plus: new URL('../img/enemies/a22-zark-plus.png', import.meta.url),
  fort: new URL('../img/enemies/a22-fort.png', import.meta.url),
  turret: new URL('../img/enemies/a22-turret.png', import.meta.url),
  node: new URL('../img/enemies/a22-orbit-node.png', import.meta.url),
  gozilla: new URL('../img/enemies/a22-gozilla.png', import.meta.url),
};
const sprites = {};
for (const [name, url] of Object.entries(urls)) {
  const image = new Image();
  const sprite = sprites[name] = { image, flash: null };
  image.addEventListener('load', () => {
    const flash = document.createElement('canvas');
    flash.width = image.naturalWidth; flash.height = image.naturalHeight;
    const context = flash.getContext('2d');
    context.drawImage(image, 0, 0);
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = '#fff2ff';
    context.fillRect(0, 0, flash.width, flash.height);
    sprite.flash = flash;
  });
  image.src = url.href;
}

function sprite(context, key, x, y, width, height, hit) {
  const entry = sprites[key];
  if (!entry.image.complete || !entry.image.naturalWidth) return;
  const source = hit && entry.flash ? entry.flash : entry.image;
  const scale = Math.min(width / source.width, height / source.height);
  width = source.width * scale;
  height = source.height * scale;
  context.drawImage(source, Math.round(x - width / 2), Math.round(y - height / 2), Math.round(width), Math.round(height));
}

export default function drawEnemy(context, enemy, points, pixel, toXY, hit, rowHeight = pixel) {
  if (!points.length) return;
  if (enemy.kaiju && (enemy.kaiju.draw?enemy.kaiju.draw(context,enemy,pixel,toXY):drawKaiju(context,enemy,pixel,toXY))) return;
  context.save();
  context.imageSmoothingEnabled = false;
  if (enemy.look === 'CIRCLE') {
    // Use the actual rotating collision points, rather than an unrelated ring image.
    const nodes = points.map((point) => toXY(point.ps));
    nodes.slice(0, 8).forEach((point) => sprite(context, 'node', point.x, point.y, pixel * 1.6, pixel * 1.7, hit));
  } else {
    // Stable design bounds prevent a sprite shrinking when its grid is clipped.
    const bounds = enemy.kaiju ? [-3,-7,3,5] : enemy.look.startsWith('MONSTER1') ? [-7, -8, 7, 6]
      : enemy.look === 'MONSTER0' ? [-2, -4, 3, 3]
      : enemy.look === 'fort' ? [-1, -2, 1, 0]
      : enemy.look === 'SPIDER' ? [-1, -2, 1, 2]
      : enemy.look === 'turret' ? [-1, -1, 1, 1] : [-1, -1, 1, 0];
    const center = toXY(enemy.position);
    const minX = center.x + bounds[0] * pixel, maxX = center.x + bounds[2] * pixel;
    const minY = center.y + bounds[1] * rowHeight, maxY = center.y + bounds[3] * rowHeight;
    const width = maxX - minX + pixel;
    const height = maxY - minY + pixel;
    const key = enemy.kaiju || enemy.look.startsWith('MONSTER') ? 'gozilla'
      : enemy.look === 'fort' || enemy.look === 'SPIDER' ? 'fort'
      : enemy.look === 'turret' ? 'turret'
      : enemy.name === 'ZARK-PLUS' ? 'plus' : 'zero';
    sprite(context, key, (minX + maxX) / 2, (minY + maxY) / 2, width, height, hit);
    // Warm reactor charge stays legible while the kaiju prepares its mouth attack.
    if (enemy.look === 'MONSTER1_openmouth') {
      context.globalCompositeOperation = 'screen';
      context.globalAlpha = .75;
      context.fillStyle = '#ff9b28';
      context.fillRect(minX + width * .05, minY + height * .31, pixel * 2, pixel * .75);
    }
  }
  context.restore();
}
