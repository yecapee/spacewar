import drawNebulaFlames from './novaNebula.mjs';
import drawSpaceFracture from './novaFracture.mjs';
import drawNovaJets from './novaJets.mjs';
import drawMoltenStars from './novaMolten.mjs';
import drawNovaLasers, { createLaserVolley } from './novaLasers.mjs';

const TAU = Math.PI * 2;
const IMPACT_RENDERERS = {
  jets: drawNovaJets,
  nebula: drawNebulaFlames,
  fracture: drawSpaceFracture,
  gold: drawMoltenStars,
  lasers: drawNovaLasers,
};

// A harmless sonic precursor is followed by the damaging laser volley.
export default function createNovaBurst(origin, { radius = 340, frames = 32, thickness = 12, delayFrames = 10, onStage = () => {}, visualStyle = "lasers", random = Math.random } = {}) {
  const center = { ...origin };
  const emitter = { ...origin };
  const hit = new WeakSet();
  const volley = visualStyle === "lasers" ? createLaserVolley(center, { range: radius, random }) : null;
  let age = 0;
  let currentRadius = 0;
  return {
    center,
    get radius() { return currentRadius; },
    get phase() { return age <= delayFrames ? "sonic" : "impact"; },
    update(targets, context, shipCenter) {
      if (shipCenter) {
        emitter.x = shipCenter.x;
        emitter.y = shipCenter.y;
      }
      const previousRadius = currentRadius;
      age++;
      if (age === 1 && delayFrames > 0) onStage("sonic", volley ? emitter : center);
      if (age === delayFrames + 1) onStage("impact", volley ? emitter : center);
      if (age <= delayFrames) return false;
      if (volley) {
        const complete = volley.update(targets, context, emitter);
        currentRadius = volley.radius;
        return complete;
      }
      currentRadius = radius * (1 - (1 - Math.min((age - delayFrames) / frames, 1)) ** 1.7);
      for (const target of targets) {
        if (hit.has(target.enemy) || target.enemy.life < 1) continue;
        const point = target.points.find((point) => {
          const distance = Math.hypot(point.x - center.x, point.y - center.y);
          return distance >= Math.max(0, previousRadius - thickness) && distance <= currentRadius + thickness;
        });
        if (point && target.enemy.wasHit(point.position, context)) hit.add(target.enemy);
      }
      return age >= delayFrames + frames;
    },
    draw(context) {
      const t = Math.max(0, Math.min((age - delayFrames) / frames, 1));
      const opacity = Math.min(1, (1 - t) * 4);
      const r = currentRadius;
      context.save();
      const renderOrigin = volley ? emitter : center;
      context.translate(renderOrigin.x, renderOrigin.y);
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';

      // The sonic precursor races ahead and fades before the heavy front catches up.
      if (delayFrames > 0 && age < delayFrames + 8) {
        const sonicProgress = Math.min(age / Math.max(1, delayFrames), 1);
        const sonicRadius = radius * 1.12 * (1 - (1 - sonicProgress) ** 2.4);
        const sonicOpacity = Math.max(0, 1 - age / (delayFrames + 8));
        for (const [width, alpha, blur] of [[6, .15, 16], [1.2, .9, 5]]) {
          context.lineWidth = width;
          context.strokeStyle = context.shadowColor = '#bcfaff';
          context.shadowBlur = blur;
          context.globalAlpha = sonicOpacity * alpha;
          context.beginPath();
          context.arc(0, 0, Math.max(.1, sonicRadius), 0, TAU);
          context.stroke();
        }
      }

      // A brief star-shaped ignition at the actual casting position.
      if (age < 12) {
        const glow = context.createRadialGradient(0, 0, 0, 0, 0, 42);
        glow.addColorStop(0, `rgba(234,255,255,${(1 - age / 12) * .9})`);
        glow.addColorStop(.3, 'rgba(119,220,255,.25)');
        glow.addColorStop(1, 'rgba(164,93,255,0)');
        context.fillStyle = glow;
        context.fillRect(-42, -42, 84, 84);
        context.strokeStyle = '#e5fdff';
        context.lineWidth = 1.3;
        context.globalAlpha = 1 - age / 12;
        for (let index = 0; index < 8; index++) {
          const angle = index * TAU / 8;
          context.beginPath();
          context.moveTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
          context.lineTo(Math.cos(angle) * (16 + age * 2), Math.sin(angle) * (16 + age * 2));
          context.stroke();
        }
      }

      if (age <= delayFrames) {
        // A compact violet charge remains at the origin during the brief separation.
        context.globalAlpha = .8;
        context.strokeStyle = context.shadowColor = '#b998ff';
        context.shadowBlur = 14;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(0, 0, 5 + (1 - age / Math.max(1, delayFrames)) * 13, 0, TAU);
        context.stroke();
        context.restore();
        return;
      }

      const drawImpact = IMPACT_RENDERERS[visualStyle] || drawNovaLasers;
      drawImpact(context, { age, delayFrames, r, opacity, maxRadius: radius, progress: t, volley, emitter });
      context.restore();
    },
  };
}
