import { SpatialGrid, createColliderCache, sweptBounds, segmentBox } from './engine.mjs';
export function createCollisionWorld(shapeFor, toXY, pixelSize) {
  const cache = createColliderCache(shapeFor, toXY, pixelSize / 2);
const enemies = new SpatialGrid(pixelSize * 4), bullets = new SpatialGrid(pixelSize * 4), items = new SpatialGrid(pixelSize * 4);
const bounds = {};
return {
  cache, enemies, bullets, items,
  begin() { cache.beginTick(); enemies.clear(); bullets.clear(); items.clear(); },
  rebuild(data) {
    for (const enemy of data.enemy) if (enemy.life > 0 && !enemy.removed) { const collider = cache.get(enemy); enemies.insert(collider, collider.bounds); }
    for (const bullet of data.enemyBullet) if (!bullet.dead) bullets.insert(bullet, sweptBounds(bullet.previousData || bullet.data, bullet.data, 3, bounds));
    for (const item of data.item) if (!item.removed) { const collider = cache.get(item); items.insert(collider, collider.bounds); }
  },
  hit(from, to, collider, padding = 2) {
    let best = null;
    for (const point of collider.points) {
      const time = segmentBox(from, to, point.x, point.y, point.radius + padding, point.radius + padding, point.previousX, point.previousY);
      if (time !== null && (!best || time < best.time)) best = { time, point };
    }
    return best;
  },
};

}
