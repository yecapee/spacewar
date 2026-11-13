// Keep the original 15px particle spacing, rendered as thin neon arc segments.
const PARTICLE_SIZE = 15;
const FAN_FRAMES = 12;
const TURN_FRAMES = 18;
const ARC_ANGLE = Math.PI / 2;
const DEPLOYMENT_TURN = Math.PI;
const MAX_TRACKING_TURN = Math.PI / 20;

const easeOut = (t) => 1 - (1 - t) ** 3;
const smoothStep = (t) => t * t * (3 - 2 * t);

// Segment / box intersection catches fast bullets and shield movement between ticks.
function hitTime(from, to, halfWidth, halfHeight) {
  let enter = 0;
  let leave = 1;
  for (const [axis, extent] of [["x", halfWidth], ["y", halfHeight]]) {
    const delta = to[axis] - from[axis];
    if (Math.abs(delta) < 0.000001) {
      if (Math.abs(from[axis]) > extent) return null;
      continue;
    }
    const a = (-extent - from[axis]) / delta;
    const b = (extent - from[axis]) / delta;
    enter = Math.max(enter, Math.min(a, b));
    leave = Math.min(leave, Math.max(a, b));
    if (enter > leave) return null;
  }
  return enter;
}

export default function createAirShield(shipOrigin, pixelSize, onBreak = () => {}) {
  const radius = pixelSize * 5;
  const trackingRange = radius * 2.2;
  const contactCooldown = new WeakMap();
  const count = Math.ceil(radius * ARC_ANGLE / PARTICLE_SIZE) + 1;
  let age = 0;
  let facing = -Math.PI / 2;
  const pivot = { x: shipOrigin.x, y: shipOrigin.y + pixelSize * 1.5 };
  const particles = Array.from({ length: count }, (_, index) => ({
    angle: Math.PI / 4 + index * ARC_ANGLE / (count - 1),
    alive: true,
    x: shipOrigin.x,
    y: shipOrigin.y + pixelSize * 1.5,
  }));

  return {
    particles,
    phase: "fan",
    tracking: false,
    trackingRange,
    get facingAngle() { return facing; },
    get remaining() {
      return particles.filter((particle) => particle.alive).length;
    },
    update(origin, bullets, enemies = []) {
      age++;
      pivot.x = origin.x;
      pivot.y = origin.y + pixelSize * 1.5;
      const expansion = easeOut(Math.min(age / FAN_FRAMES, 1));
      const turn = smoothStep(Math.max(0, Math.min((age - FAN_FRAMES) / TURN_FRAMES, 1)));
      this.phase = age < FAN_FRAMES ? "fan" : age < FAN_FRAMES + TURN_FRAMES ? "turn" : "ready";

      // Finish the tail deployment before steering toward the nearest approaching shot.
      this.tracking = false;
      if (this.phase === "ready") {
        let nearest = null;
        let nearestDistance = trackingRange ** 2;
        for (const bullet of bullets) {
          const current = bullet.data;
          const previous = bullet.previousData;
          if (!previous || current.clear || ![current.x, current.y, previous.x, previous.y].every(Number.isFinite)) continue;
          const vx = current.x - previous.x;
          const vy = current.y - previous.y;
          const dx = current.x - origin.x;
          const dy = current.y - origin.y;
          // Do not turn after stationary shots or shots that have already passed the ship.
          if (vx * vx + vy * vy < .000001 || dx * vx + dy * vy >= 0) continue;
          const distance = dx * dx + dy * dy;
          if (distance < nearestDistance) {
            nearest = current;
            nearestDistance = distance;
          }
        }
        for (const target of enemies) {
          if (target.enemy.life < 1) continue;
          for (const point of target.points) {
            const distance = (point.x - origin.x) ** 2 + (point.y - origin.y) ** 2;
            if (distance < nearestDistance) { nearest = point; nearestDistance = distance; }
          }
        }
        if (nearest) {
          this.tracking = true;
          const desired = Math.atan2(nearest.y - pivot.y, nearest.x - pivot.x);
          const difference = Math.atan2(Math.sin(desired - facing), Math.cos(desired - facing));
          facing += Math.abs(difference) < .00001 ? difference
            : Math.max(-MAX_TRACKING_TURN, Math.min(MAX_TRACKING_TURN, difference * .3));
        }
      }
      const steering = this.phase === "ready" ? facing + Math.PI / 2 : 0;

      // Surviving segments keep their width and slide together around the center.
      // The shorter arc is not replenished: its total coverage shrinks with each hit.
      const survivors = particles.filter((particle) => particle.alive);
      const spacing = ARC_ANGLE / (count - 1);
      survivors.forEach((particle, rank) => {
        const targetAngle = Math.PI / 2 + (rank - (survivors.length - 1) / 2) * spacing;
        const difference = targetAngle - particle.angle;
        particle.angle = Math.abs(difference) < .00001 ? targetAngle : particle.angle + difference * .2;
      });

      // The pivot stays at the tail. After fanning out, only the angle changes.
      for (const particle of particles) {
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.previousAngle = particle.renderAngle ?? particle.angle;
        const angle = particle.angle - DEPLOYMENT_TURN * turn + steering;
        particle.renderAngle = angle;
        particle.x = pivot.x + Math.cos(angle) * radius * expansion;
        particle.y = pivot.y + Math.sin(angle) * radius * expansion;
      }

      for (let index = bullets.length - 1; index >= 0; index--) {
        const bullet = bullets[index];
        // Use the bullet impact point, matching the game's existing ship collisions.
        const current = bullet.data;
        const previous = bullet.previousData || current;
        if (![current.x, current.y, previous.x, previous.y].every(Number.isFinite)) continue;
        let target = null;
        let firstHit = Infinity;
        for (const particle of particles) {
          if (!particle.alive) continue;
          const local = (x, y, angle) => ({
            x: -Math.sin(angle) * x + Math.cos(angle) * y,
            y: Math.cos(angle) * x + Math.sin(angle) * y,
          });
          const time = hitTime(
            local(previous.x - particle.previousX, previous.y - particle.previousY, particle.previousAngle),
            local(current.x - particle.x, current.y - particle.y, particle.renderAngle),
            PARTICLE_SIZE / 2,
            3
          );
          if (time !== null && time < firstHit) {
            target = particle;
            firstHit = time;
          }
        }
        if (target) {
          target.alive = false;
          onBreak(target);
          bullets.splice(index, 1);
        }
      }
      // A hull contact consumes one shield segment and deals one ordinary hit.
      // A brief per-enemy interval prevents one overlap draining the whole arc.
      for (const target of enemies) {
        if (target.enemy.life < 1 || age < (contactCooldown.get(target.enemy) || 0)) continue;
        let impact = null, firstHit = Infinity;
        for (const point of target.points) for (const particle of particles) {
          if (!particle.alive) continue;
          const angle = particle.renderAngle;
          const local = (x, y) => ({ x: -Math.sin(angle) * x + Math.cos(angle) * y, y: Math.cos(angle) * x + Math.sin(angle) * y });
          const time = hitTime(
            local((point.previousX ?? point.x) - particle.previousX, (point.previousY ?? point.y) - particle.previousY),
            local(point.x - particle.x, point.y - particle.y),
            PARTICLE_SIZE / 2 + (point.radius || 0), 3 + (point.radius || 0)
          );
          if (time !== null && time < firstHit) { firstHit = time; impact = { point, particle }; }
        }
        if (impact && target.enemy.wasHit(impact.point.position, undefined, undefined, true)) {
          impact.particle.alive = false; onBreak(impact.particle);
          contactCooldown.set(target.enemy, age + 8);
        }
      }
      return this.remaining === 0;
    },
    draw(context) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      const halfSegment = ARC_ANGLE / (count - 1) * .43;
      for (const [width, color, alpha, blur] of [
        [7, "#b45cff", .18, 12],
        [2, "#bfa0ff", .9, 8],
        [.8, "#d8ffff", 1, 3],
      ]) {
        context.lineWidth = width;
        context.strokeStyle = context.shadowColor = color;
        context.globalAlpha = alpha;
        context.shadowBlur = blur;
        for (const particle of particles) {
          if (!particle.alive) continue;
          const r = Math.hypot(particle.x - pivot.x, particle.y - pivot.y);
          if (r < .1) continue;
          context.beginPath();
          context.arc(pivot.x, pivot.y, r, particle.renderAngle - halfSegment, particle.renderAngle + halfSegment);
          context.stroke();
        }
      }
      context.restore();
    },
  };
}
