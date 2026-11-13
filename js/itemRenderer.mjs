import { ITEM_RESOLUTION, itemArt, itemArtKey } from './itemArt.mjs';

const urls = {
  repair: new URL('../img/items/repair.png', import.meta.url),
  hull: new URL('../img/items/hull.png', import.meta.url),
  triple: new URL('../img/items/triple.png', import.meta.url),
};
const sprites = {};
for (const [key, url] of Object.entries(urls)) {
  const image = new Image();
  image.addEventListener('load', () => {
    // Resample once, then share the same pixel density for all three pickups.
    const frame = document.createElement('canvas');
    frame.width = frame.height = ITEM_RESOLUTION;
    const context = frame.getContext('2d');
    context.drawImage(image, 0, 0, ITEM_RESOLUTION, ITEM_RESOLUTION);
    sprites[key] = frame;
  });
  image.src = url.href;
}

export default function drawItem(context, item, center, pixel) {
  const key = itemArtKey(item), frame = sprites[key];
  if (!frame) return false;
  // Art occupies ~80% of the frame: visible body spans the original three-cell pickup.
  const size = Math.round(pixel * 3.75);
  const x = Math.round(center.x - size / 2), y = Math.round(center.y + pixel / 2 - size / 2);
  context.save();
  context.imageSmoothingEnabled = false;
  context.drawImage(frame, x, y, size, size);
  // Small corner markers distinguish collectibles without hiding their silhouettes.
  context.strokeStyle = itemArt[key].color;
  context.globalAlpha = .65;
  context.lineWidth = 1;
  const edge = Math.round(pixel * 1.65), arm = Math.max(2, Math.round(pixel * .25));
  const cx = Math.round(center.x), cy = Math.round(center.y + pixel / 2);
  context.beginPath();
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) {
    context.moveTo(cx + dx * (edge - arm), cy + dy * edge);
    context.lineTo(cx + dx * edge, cy + dy * edge);
    context.lineTo(cx + dx * edge, cy + dy * (edge - arm));
  }
  context.stroke();
  context.restore();
  return true;
}
