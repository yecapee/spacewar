import { Vector3 } from 'three';

export function projectNozzles(ship, camera, center, size, state) {
  ship.root.updateMatrixWorld(true); camera.updateMatrixWorld(true);
  const result = [];
  for (const [name, emitter] of Object.entries(ship.nozzleEmitters)) {
    const strength = Math.max(0, Math.min(1, name === 'main' ? -state.thrustY : Math.max(state.thrustY, name === 'left' ? state.thrustX : -state.thrustX)));
    const origin = new Vector3().setFromMatrixPosition(emitter.matrixWorld).project(camera);
    const end = emitter.localToWorld(new Vector3(0, 0, 1)).project(camera);
    const dx = end.x - origin.x, dy = origin.y - end.y;
    const length = Math.hypot(dx, dy) || 1;
    result.push({ name, x: center.x + origin.x * size / 2, y: center.y - origin.y * size / 2,
      dx: dx / length, dy: dy / length, strength, width: name === 'main' ? Math.max(3.5, size * .047) : Math.max(2.5, size * .025) });
  }
  return result;
}

export function createThrusterExhaust(random = Math.random) {
  const particles = [];
  let tick = 0;
  return {
    get count() { return particles.length; },
    reset() { particles.length = 0; tick = 0; },
    draw(context, emitters, color = '#72edcc', reducedMotion = false) {
      tick++;
      context.save(); context.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx; particle.y += particle.vy; particle.life--;
        particle.vx *= .96; particle.vy *= .96;
        context.globalAlpha = Math.max(0, particle.life / 12) * .75;
        context.fillStyle = particle.color;
        context.fillRect(particle.x - 1, particle.y - 1, particle.size, particle.size);
        if (particle.life <= 0) particles.splice(i, 1);
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
        if (emitter.name === 'main' && !reducedMotion && particles.length < 72) {
          for (let i = 0; i < 2 && particles.length < 72; i++) {
            const spread = (random() - .5) * width * .2;
            const fan = (random() - .5) * 5, speed = 2 + random() * 4;
            particles.push({ x: x + nx * spread, y: y + ny * spread,
              vx: dx * speed + nx * fan, vy: dy * speed + ny * fan,
              life: 12 + Math.floor(random() * 10), size: 1.5 + random() * 1.5,
              color: random() < .5 ? '#fff4b0' : '#f4ffff' });
          }
        }
      }
      context.restore();
    },
  };
}
