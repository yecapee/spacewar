import { createPool, compact } from './engine.mjs';
export function createProjectileSystem({ width, height, cellWidth, cellHeight }) {
  const pool = createPool(() => ({ data: {}, previousData: {} }), 2048);
  const occupied = new Set();
  const location = (position, output) => { output.x = position % width * cellWidth + cellWidth / 2; output.y = Math.floor(position / width) * cellHeight; };
  const system = {
    pool,
    begin(enemies) { occupied.clear(); for (const bullet of enemies) if (!bullet.dead) occupied.add(bullet.data.position); },
    spawn(kind, position, target, array, variant = 0) {
      if (kind !== 'player' && occupied.has(position)) return null;
      const bullet = pool.acquire(); bullet.dead = false; bullet.kind = kind; bullet.age = 0;
      bullet.originPosition = position; location(position, bullet.data); bullet.x0 = bullet.data.x; bullet.y0 = bullet.data.y;
      const tx = target % width, ty = Math.floor(target / width);
      bullet.tx = tx * cellWidth + cellWidth / 2; bullet.ty = ty * cellHeight;
      const sx = position % width, sy = Math.floor(position / width);
      if (kind === 'player') { bullet.duration = height + 5; bullet.data.look = 'shipBulletNormal'; }
      else if (kind === 'normal') { bullet.duration = 45; bullet.tx = bullet.x0; bullet.ty = bullet.y0 + height * cellHeight; bullet.data.look = 'laser'; }
      else if (kind === 'track') { bullet.duration = Math.max(1, Math.floor(Math.hypot(tx - sx, ty - sy) * 2)); bullet.data.look = 'bulletBall'; }
      else {
        const distance = Math.floor(Math.hypot(bullet.tx - bullet.x0, bullet.ty - bullet.y0) * 2);
        bullet.duration = Math.max(1, distance * .08);
        const angle = Math.atan2(bullet.ty - bullet.y0, bullet.tx - bullet.x0) - Math.PI / 2 + Math.PI / 4 + Math.PI / 8 * (variant + 1);
        bullet.cx = Math.round(bullet.x0 + distance * .3 * Math.cos(angle));
        bullet.cy = Math.round(bullet.y0 + distance * .3 * Math.sin(angle)); bullet.data.look = 'bulletBall';
      }
      bullet.data.clear = false; bullet.data.position = position;
      Object.assign(bullet.previousData, bullet.data);
      this.advance(bullet, kind === 'diffusion' ? 0 : 1);
      Object.assign(bullet.previousData, bullet.data);
      array.push(bullet); if (kind !== 'player') occupied.add(bullet.data.position);
      return bullet;
    },
    advance(bullet, increment = 1) {
      Object.assign(bullet.previousData, bullet.data); bullet.age += increment;
      const t = bullet.age / bullet.duration, data = bullet.data;
      if (bullet.kind === 'player') { data.x = bullet.x0; data.y = bullet.y0 - bullet.age * cellHeight; data.position = bullet.originPosition - bullet.age * width; }
      else if (bullet.kind === 'diffusion') {
        data.x = (1-t)**2 * bullet.x0 + 2*(1-t)*t*bullet.cx + t*t*bullet.tx;
        data.y = (1-t)**2 * bullet.y0 + 2*(1-t)*t*bullet.cy + t*t*bullet.ty;
        data.position = Math.round(data.y / cellWidth) * width + Math.round(data.x / cellWidth);
      } else {
        data.x = bullet.x0 + (bullet.tx - bullet.x0) * t; data.y = bullet.y0 + (bullet.ty - bullet.y0) * t;
        data.position = Math.round((bullet.originPosition % width) + ((bullet.tx - bullet.x0) / cellWidth) * t) + Math.round(Math.floor(bullet.originPosition / width) + ((bullet.ty - bullet.y0) / cellHeight) * t) * width;
      }
      const extra = bullet.kind === 'track' ? 15 : bullet.kind === 'diffusion' ? 5 : 1;
      data.clear = bullet.kind === 'player' ? data.position < 0 : bullet.age > bullet.duration + extra || data.x < -cellWidth * 2 || data.x > width * cellWidth + cellWidth * 2 || data.y > height * cellHeight + cellHeight * 2;
      if (data.clear) bullet.dead = true;
    },
    update(array) { for (const bullet of array) if (!bullet.dead) this.advance(bullet); },
    cleanup(array) { compact(array, (bullet) => !bullet.dead, (bullet) => pool.release(bullet)); },
    clear(array) { for (const bullet of array) pool.release(bullet); array.length = 0; occupied.clear(); },
  };
  return system;
}
