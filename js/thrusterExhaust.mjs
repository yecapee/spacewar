import { createParticleStore } from './particlePool.mjs';
import { Vector3 } from 'three';

const projectedOrigin = new Vector3(), projectedEnd = new Vector3();
export function projectNozzles(ship, camera, center, size, state, result = []) {
  ship.root.updateMatrixWorld(true); camera.updateMatrixWorld(true);
  let count = 0;
  for (const name in ship.nozzleEmitters) {
    const emitter = ship.nozzleEmitters[name];
    const strength = Math.max(0, Math.min(1, name === 'main' ? -state.thrustY : Math.max(state.thrustY, name === 'left' ? state.thrustX : -state.thrustX)));
    const origin = projectedOrigin.setFromMatrixPosition(emitter.matrixWorld).project(camera);
    const end = emitter.localToWorld(projectedEnd.set(0, 0, 1)).project(camera);
    const dx = end.x - origin.x, dy = origin.y - end.y;
    const length = Math.hypot(dx, dy) || 1;
    const frame = result[count] || (result[count] = {}); count++;
    Object.assign(frame, { name, x: center.x + origin.x * size / 2, y: center.y - origin.y * size / 2,
      dx: dx / length, dy: dy / length, strength, width: name === 'main' ? Math.max(3.5, size * .047) : Math.max(2.5, size * .025) });
  }
  result.length = count;
  return result;
}

export function createThrusterExhaust(random = Math.random) {
  const store = createParticleStore(72), particles = store.active;
  const previousEmitters = new Map();
  let tick = 0;
  return {
    get count() { return particles.length; },
    reset() { store.clear(); previousEmitters.clear(); tick = 0; },
    update(emitters, color = '#72edcc', reducedMotion = false) {
      tick++;
      for (const p of particles) { p.previousX = p.x; p.previousY = p.y; }
      store.update();
      for (const emitter of emitters) {
        const { name, x, y, dx, dy, width, strength } = emitter, nx = -dy, ny = dx;
        let previous = previousEmitters.get(name);
        if (!previous) previousEmitters.set(name, previous = { x, y });
        if (strength > .03) {
        if (emitter.name === 'main' && !reducedMotion && particles.length < 72) {
          for (let i = 0; i < 2 && particles.length < 72; i++) {
            const spread = (random() - .5) * width * .2;
            const fan = (random() - .5) * 5, speed = 2 + random() * 4;
            store.add({ x: x + nx * spread, y: y + ny * spread,
              vx: dx * speed + nx * fan, vy: dy * speed + ny * fan,
              previousX: previous.x, previousY: previous.y, life: 12 + Math.floor(random() * 10), size: 1.5 + random() * 1.5,
              color: random() < .5 ? '#fff4b0' : '#f4ffff' });
          }
        }
        }
        previous.x = x; previous.y = y;
      }
    },
    render(context, emitters, color = '#72edcc', reducedMotion = false, alpha = 1) {
      context.save(); context.globalCompositeOperation = 'lighter';
      for (const particle of particles) {
        context.globalAlpha = Math.max(0,particle.life / 12) * .75; context.fillStyle = particle.color;
        context.fillRect(particle.previousX + (particle.x-particle.previousX)*alpha-1, particle.previousY + (particle.y-particle.previousY)*alpha-1, particle.size,particle.size);
      }
      for (const emitter of emitters) {
        if (emitter.strength <= .03) continue;
        const { x, y, dx, dy, width, strength } = emitter;
        const pulse = reducedMotion ? 1 : .88 + Math.sin(tick * 1.8) * .12;
        const length = width * (emitter.name === 'main' ? 4.5 : 3.5) * (.55 + strength * .45) * pulse;
        const nx = -dy, ny = dx;
        for (const [scale, fill, alpha] of [[1.35, color, .25], [.8, color, .9], [.35, '#f1ffff', 1]]) {
          context.globalAlpha = alpha;
          context.fillStyle = fill;
          context.beginPath();
          context.moveTo(x + nx * width * scale / 2, y + ny * width * scale / 2);
          context.lineTo(x + dx * length * .72 + nx * width * scale * .22, y + dy * length * .72 + ny * width * scale * .22);
          context.lineTo(x + dx * length, y + dy * length);
          context.lineTo(x + dx * length * .72 - nx * width * scale * .22, y + dy * length * .72 - ny * width * scale * .22);
          context.lineTo(x - nx * width * scale / 2, y - ny * width * scale / 2);
          context.closePath(); context.fill();
        }
      }
      context.restore();
    },
    draw(context, emitters, color, reducedMotion) { this.update(emitters,color,reducedMotion); this.render(context,emitters,color,reducedMotion); },
  };
}
