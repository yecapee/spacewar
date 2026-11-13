import { createPool, compact } from './engine.mjs';
export function createParticleStore(limit) {
  const active = [], pool = createPool(() => ({}), limit);
  return {
    active, pool,
    add(values) { if (active.length >= limit) return null; const p = pool.acquire(); Object.assign(p, values); active.push(p); return p; },
    update() { for (const p of active) { p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy *= .96; p.life--; } compact(active, p => p.life > 0, p => pool.release(p)); },
    clear() { for (const p of active) pool.release(p); active.length = 0; },
  };
}
