import test from 'node:test';
import assert from 'node:assert/strict';
import { SpatialGrid, sweptBounds, segmentBox, createColliderCache, compact } from '../js/engine.mjs';
import { createProjectileSystem } from '../js/projectileSystem.mjs';
import { createParticleStore } from '../js/particlePool.mjs';
import { createRecords } from '../js/records.mjs';
import { createThrusterExhaust } from '../js/thrusterExhaust.mjs';
import { drawProjectile, glowCacheSize } from '../js/glowSprites.mjs';

test('spatial queries deduplicate large colliders and preserve swept hits across cells', () => {
  const grid = new SpatialGrid(30), a = {}, b = {};
  grid.insert(a, { minX: -40, maxX: 40, minY: -10, maxY: 40 });
  grid.insert(b, { minX: 300, maxX: 310, minY: 300, maxY: 310 });
  assert.deepEqual(grid.query(sweptBounds({ x: -100, y: 0 }, { x: 100, y: 0 })), [a]);
  assert.ok(segmentBox({ x: -100, y: 0 }, { x: 100, y: 0 }, 0, 0, 5) !== null);
  grid.clear(); assert.deepEqual(grid.query({ minX: -200, maxX: 400, minY: -200, maxY: 400 }), []);
});
test('collider shape is shared across consumers and unchanged ticks; point storage is reused', () => {
  let calls = 0;
  const cache = createColliderCache(entity => { calls++; return [{ ps: entity.position }]; }, (ps, out) => Object.assign(out, { x: ps, y: 50 }), 7.5);
  const enemy = { position: 10, previousPosition: 0, look: 'test' };
  cache.beginTick(); const first = cache.get(enemy), point = first.points[0];
  for (let i = 0; i < 100; i++) assert.equal(cache.get(enemy), first);
  assert.equal(calls, 1); assert.equal(point.previousX, 0);
  enemy.previousPosition = 10; cache.beginTick(); cache.get(enemy); assert.equal(calls, 1); assert.equal(point.previousX, 10);
  enemy.position = 20; cache.beginTick(); cache.get(enemy); assert.equal(calls, 2); assert.equal(first.points[0], point);
});
test('projectiles reuse records and data buffers, clear safely and normalize zero-distance tracking', () => {
  const system = createProjectileSystem({ width: 40, height: 60, cellWidth: 15, cellHeight: 15 }), list = [];
  const first = system.spawn('player', 1000, 1000, list), data = first.data;
  first.dead = true; system.cleanup(list);
  const second = system.spawn('track', 1000, 1000, list);
  assert.equal(second, first); assert.equal(second.data, data); assert.equal(system.pool.created, 1);
  for (let i = 0; i < 200; i++) system.update(list);
  assert.ok(Number.isFinite(second.data.x) && Number.isFinite(second.data.y));
  system.cleanup(list); assert.equal(list.length, 0); assert.equal(system.pool.available, 1);
  system.clear(list); assert.equal(system.pool.available, 1);
});
test('stable compaction and particle reuse preserve survivors and bounded capacity', () => {
  const values = [1,2,3,4]; compact(values, x => x % 2); assert.deepEqual(values, [1,3]);
  const particles = createParticleStore(2);
  particles.add({ x: 0, y: 0, vx: 1, vy: 1, life: 1 }); particles.add({ x: 1, y: 1, vx: 1, vy: 1, life: 2 });
  assert.equal(particles.add({}), null); particles.update();
  const created = particles.pool.created; particles.add({ x: 0, y: 0, vx: 0, vy: 0, life: 2 });
  assert.equal(particles.pool.created, created); particles.clear(); assert.equal(particles.active.length, 0);
});
test('records cache reads, batch writes and retain dirty data after storage failure', () => {
  let reads = 0, writes = 0, fail = false; const saved = new Map();
  const records = createRecords({ getItem() { reads++; return null; }, setItem(k,v) { if (fail) throw Error('full'); writes++; saved.set(k,v); } });
  for (let i = 1; i <= 400; i++) { records.update(i, i); records.tick(); }
  assert.equal(reads, 2); assert.equal(writes, 20); assert.equal(saved.get('bestMileage'), '400');
  records.update(401, 401); fail = true; records.flush(); fail = false; records.flush();
  assert.equal(saved.get('bestScore'), '401');
});
test('drawing repeatedly never advances exhaust simulation and glow is baked once per variant', () => {
  const context = new Proxy({}, { get: () => () => {} });
  const exhaust = createThrusterExhaust(() => .5), emitter = { name: 'main', x: 10, y: 20, dx: 0, dy: 1, width: 4, strength: 1 };
  exhaust.update([emitter]); const count = exhaust.count;
  for (let i = 0; i < 100; i++) exhaust.render(context, [emitter]); assert.equal(exhaust.count, count);
  let canvases = 0; globalThis.document = { createElement() { canvases++; return { getContext: () => context }; } };
  for (let i = 0; i < 100; i++) drawProjectile(context, 10, 20, 'player');
  assert.equal(canvases, 1); assert.equal(glowCacheSize(), 1); delete globalThis.document;
});

test('all pooled projectile trajectories stay finite and retire offscreen', () => {
  const system = createProjectileSystem({ width: 40, height: 60, cellWidth: 15, cellHeight: 15 });
  for (const kind of ['normal', 'track', 'diffusion']) {
    const list = []; system.begin(list);
    const bullet = system.spawn(kind, 200, 1600, list, 1);
    for (let step = 0; step < 300; step++) {
      system.update(list); assert.ok(Number.isFinite(bullet.data.x) && Number.isFinite(bullet.data.y));
    }
    assert.equal(bullet.dead, true); system.cleanup(list); assert.equal(list.length, 0);
  }
});
