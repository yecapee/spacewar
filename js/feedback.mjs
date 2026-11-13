const particles = [];
let trauma = 0;
let flash = 0;
let time = 0;

const feedback = {
  burst(x, y, color = '#b8f5ff', count = 8, speed = 2) {
    for (let index = 0; index < count; index++) {
      const angle = Math.PI * 2 * index / count + Math.random() * .4;
      const velocity = (.5 + Math.random()) * speed;
      particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
        color, life: 12 + Math.floor(Math.random() * 12), size: 2 + Math.floor(Math.random() * 3) });
    }
    if (particles.length > 320) particles.splice(0, particles.length - 320);
  },
  damage(x, y) {
    this.burst(x, y, '#ff6f83', 18, 3);
    trauma = Math.max(trauma, 5);
    flash = 10;
  },
  novaImpact(x, y) {
    trauma = Math.max(trauma, 3);
  },
  destroy(x, y, boss = false) {
    this.burst(x, y, '#ffbc76', boss ? 40 : 20, boss ? 5 : 3);
    this.burst(x, y, '#fff5db', 8, 1.8);
    trauma = Math.max(trauma, boss ? 4 : 1.5);
  },
  render(context, reducedMotion) {
    time++;
    trauma *= .78;
    flash = Math.max(0, flash - 1);
    context.save();
    for (let index = particles.length - 1; index >= 0; index--) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= .96;
      particle.vy *= .96;
      particle.life--;
      context.globalAlpha = Math.min(1, particle.life / 10);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, particle.size, particle.size);
      if (particle.life <= 0) particles.splice(index, 1);
    }
    context.restore();
    return {
      x: reducedMotion ? 0 : Math.sin(time * 2.4) * trauma,
      y: reducedMotion ? 0 : Math.cos(time * 3.2) * trauma,
      flash: flash / 22,
    };
  },
  reset() { particles.length = 0; trauma = 0; flash = 0; },
};
export default feedback;
