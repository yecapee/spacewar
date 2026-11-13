const TAU = Math.PI * 2;
const HALF_WIDTH = 3;

export function createLaserVolley(origin, { range = 340, waveCount = 4, shotsPerWave = 12, waveInterval = 6, random = Math.random } = {}) {
  const center = { ...origin };
  const waves = Array.from({ length: waveCount }, (_, index) => ({ start: 1 + index * waveInterval, hit: new WeakSet() }));
  const projectiles = waves.flatMap((wave, waveIndex) => {
    const rotation = random() * TAU;
    return Array.from({ length: shotsPerWave }, (_, index) => {
      const angle = rotation + (index + (random() - .5) * .8) * TAU / shotsPerWave;
      return { wave: waveIndex, angle, dx: Math.cos(angle), dy: Math.sin(angle),
        length: 22 + random() * 16, speed: 11 + random() * 5,
        distance: 0, previousDistance: 0, active: false, finished: false };
    });
  });
  let age = 0;
  let reach = 0;
  return {
    projectiles,
    get radius() { return reach; },
    update(targets, context, emitter = center) {
      age++;
      for (const shot of projectiles) {
        const wave = waves[shot.wave];
        if (age < wave.start || shot.finished) continue;
        // Freeze each wave's origin only when it actually fires.
        if (!wave.origin) wave.origin = { x: emitter.x, y: emitter.y };
        shot.origin = wave.origin;
        shot.active = true;
        shot.previousDistance = shot.distance;
        shot.distance += shot.speed;
        reach = Math.max(reach, Math.min(range, shot.distance));
        const from = Math.max(0, shot.previousDistance - shot.length);
        const to = Math.min(range, shot.distance);
        if (shot.distance - shot.length > range) {
          shot.finished = true;
          shot.active = false;
          continue;
        }
        for (const target of targets) {
          if (target.enemy.life < 1 || wave.hit.has(target.enemy)) continue;
          const point = target.points.find((point) => {
            const dx = point.x - shot.origin.x;
            const dy = point.y - shot.origin.y;
            const along = dx * shot.dx + dy * shot.dy;
            const across = Math.abs(-dx * shot.dy + dy * shot.dx);
            const padding = point.radius || 0;
            return along >= from - padding && along <= to + padding && across <= HALF_WIDTH + padding;
          });
          if (point && target.enemy.wasHit(point.position, context)) wave.hit.add(target.enemy);
        }
      }
      return projectiles.every((shot) => shot.finished);
    },
    draw(context, renderOrigin = center) {
      context.save();
      context.lineCap = 'round';
      for (const [width, color, alpha, blur] of [
        [8, '#8567ff', .16, 10],
        [3.2, '#76eaff', .8, 6],
        [1.1, '#edffff', 1, 1],
      ]) {
        context.lineWidth = width;
        context.strokeStyle = context.shadowColor = color;
        context.shadowBlur = blur;
        context.globalAlpha = alpha;
        context.beginPath();
        for (const shot of projectiles) {
          if (!shot.active) continue;
          const tail = Math.max(0, shot.distance - shot.length);
          const tip = Math.min(range, shot.distance);
          const offsetX = shot.origin.x - renderOrigin.x;
          const offsetY = shot.origin.y - renderOrigin.y;
          context.moveTo(offsetX + shot.dx * tail, offsetY + shot.dy * tail);
          context.lineTo(offsetX + shot.dx * tip, offsetY + shot.dy * tip);
        }
        context.stroke();
      }
      let lastLaunch;
      for (const wave of waves) {
        if (age >= wave.start) lastLaunch = wave.start;
      }
      const flare = lastLaunch === undefined ? 0 : Math.max(0, 1 - (age - lastLaunch) / 3);
      if (flare > 0) {
        const glow = context.createRadialGradient(0, 0, 0, 0, 0, 16);
        glow.addColorStop(0, 'rgba(221,255,255,.8)');
        glow.addColorStop(1, 'rgba(110,130,255,0)');
        context.fillStyle = glow;
        context.globalAlpha = flare * .6;
        context.shadowBlur = 0;
        context.fillRect(-16, -16, 32, 32);
      }
      context.restore();
    },
  };
}

export default function drawNovaLasers(context, { volley, emitter }) {
  volley.draw(context, emitter);
}
