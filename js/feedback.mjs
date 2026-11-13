import { createParticleStore } from './particlePool.mjs';
const store = createParticleStore(320);
const particles = store.active;
let trauma = 0;
let flash = 0;
let time = 0;

const feedback = {
  burst(x, y, color = '#b8f5ff', count = 8, speed = 2) {
    for (let index = 0; index < count; index++) {
      const angle = Math.PI * 2 * index / count + Math.random() * .4;
      const velocity = (.5 + Math.random()) * speed;
      store.add({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
        color, life: 12 + Math.floor(Math.random() * 12), size: 2 + Math.floor(Math.random() * 3) });
    }
  },
  damage(x, y) {
    this.burst(x, y, '#ff6f83', 18, 3);
    trauma = Math.max(trauma, 5);
    flash = 10;
  },
  novaImpact(x, y) {
    trauma = Math.max(trauma, 3);
  },
  stomp(x,y) {
    this.burst(x,y,'#798397',5,1);
    trauma=Math.max(trauma,.8);
  },
  destroy(x, y, boss = false) {
    this.burst(x, y, '#ffbc76', boss ? 40 : 20, boss ? 5 : 3);
    this.burst(x, y, '#fff5db', 8, 1.8);
    trauma = Math.max(trauma, boss ? 4 : 1.5);
  },
  update() {
    time++;
    trauma *= .78;
    flash = Math.max(0, flash - 1);
    store.update();
  },
  render(context, reducedMotion) {
    context.save();
    for (let index = particles.length - 1; index >= 0; index--) {
      const particle = particles[index];
      context.globalAlpha = Math.min(1, particle.life / 10);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    context.restore();
    return {
      x: reducedMotion ? 0 : Math.sin(time * 2.4) * trauma,
      y: reducedMotion ? 0 : Math.cos(time * 3.2) * trauma,
      flash: flash / 22,
    };
  },
  reset() { store.clear(); trauma = 0; flash = 0; },
};
export default feedback;
