const cache = new Map();
export function drawProjectile(context, x, y, look = 'player') {
  let sprite = cache.get(look);
  if (!sprite) {
    sprite = document.createElement('canvas'); sprite.width = 36; sprite.height = 48;
    const c = sprite.getContext('2d');
    const player = look === 'player', laser = player || look === 'laser';
    const width = laser ? 6 : 10, height = laser ? 24 : 10;
    c.shadowColor = player ? '#74eaff' : '#ff785a'; c.shadowBlur = player ? 10 : 8;
    c.fillStyle = player ? '#78edff' : '#ff8965'; c.fillRect(18-width/2, 24-height/2, width, height);
    c.shadowBlur = 0; c.fillStyle = player ? '#f0fdff' : '#fff1c7';
    c.fillRect(17, 24-height/2+2, 2, laser ? height-6 : 4);
    cache.set(look, sprite);
  }
  context.drawImage(sprite, Math.round(x)-18, Math.round(y)-24);
}
export function glowCacheSize() { return cache.size; }
