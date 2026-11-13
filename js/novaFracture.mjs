const TAU = Math.PI * 2;
const random = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const SECTORS = 13;
const RADII = [.09, .3, .57, .86];
const vertices = RADII.map((radius, layer) => Array.from({ length: SECTORS }, (_, index) => {
  const angle = (index + (random(index + 3) - .5) * .45) * TAU / SECTORS + (random(layer * 31 + index) - .5) * .09;
  const distance = radius + (random(layer * 59 + index + 17) - .5) * (layer ? .13 : .03);
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}));
const panes = [];
function pane(points) {
  const center = points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
  panes.push({ points, center, distance: Math.hypot(center.x, center.y), seed: random(panes.length + 91) });
}
for (let layer = 0; layer < RADII.length - 1; layer++) {
  for (let index = 0; index < SECTORS; index++) {
    const next = (index + 1) % SECTORS;
    const a = vertices[layer][index];
    const b = vertices[layer + 1][index];
    const c = vertices[layer + 1][next];
    const d = vertices[layer][next];
    if (random(layer * 41 + index) > .35) {
      pane([a, b, d]);
      pane([b, c, d]);
    } else pane([a, b, c, d]);
  }
}

// Shared polygon edges fracture first; the resulting glass planes then drift and tumble apart.
export default function drawSpaceFracture(context, { age, delayFrames, r, opacity, maxRadius }) {
  const life = age - delayFrames;
  const scale = Math.min(maxRadius, 280);
  const reveal = Math.min(1, life / 6);
  const drift = Math.max(0, (life - 6) / 46);
  const crackFlash = Math.max(0, 1 - life / 18);
  context.save();
  context.lineJoin = 'miter';
  context.lineCap = 'butt';

  for (let index = 0; index < panes.length; index++) {
    const pane = panes[index];
    if (pane.distance > reveal) continue;
    const distance = Math.max(.001, pane.distance);
    const travel = drift * scale * (.28 + pane.seed * .65);
    const x = pane.center.x * scale + pane.center.x / distance * travel;
    const y = pane.center.y * scale + pane.center.y / distance * travel;
    const fade = opacity * (1 - drift * .45);
    context.save();
    context.translate(x, y);
    context.rotate((pane.seed - .5) * drift * 1.7);
    const flatten = 1 - Math.sin(drift * (1.1 + pane.seed) * Math.PI) * .3;
    context.scale(flatten, 1);
    context.beginPath();
    pane.points.forEach((point, vertex) => {
      const px = (point.x - pane.center.x) * scale;
      const py = (point.y - pane.center.y) * scale;
      if (vertex === 0) context.moveTo(px, py); else context.lineTo(px, py);
    });
    context.closePath();

    // Transparent facets leave the enemies and background visible through the fracture.
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = fade;
    const tint = index % 3 === 0 ? '167,126,255' : '123,224,255';
    const glass = context.createLinearGradient(-30, -30, 35, 40);
    glass.addColorStop(0, `rgba(${tint},${.035 + pane.seed * .055})`);
    glass.addColorStop(.5, 'rgba(200,240,255,.01)');
    glass.addColorStop(1, `rgba(${tint},.065)`);
    context.fillStyle = glass;
    context.fill();

    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = fade * (.23 + crackFlash * .6);
    context.strokeStyle = context.shadowColor = index % 4 === 0 ? '#b5a2ff' : '#b8f3ff';
    context.lineWidth = .65;
    context.shadowBlur = crackFlash * 5;
    context.stroke();

    // Only selected cut edges flare white: no continuous circular outline.
    if (index % 3 === 0 || crackFlash > .6) {
      const a = pane.points[0];
      const b = pane.points[1];
      context.globalAlpha = fade * (.55 + crackFlash * .4);
      context.strokeStyle = '#edfdff';
      context.lineWidth = index % 3 === 0 ? 1.25 : .8;
      context.shadowBlur = 7;
      context.beginPath();
      context.moveTo((a.x - pane.center.x) * scale, (a.y - pane.center.y) * scale);
      context.lineTo((b.x - pane.center.x) * scale, (b.y - pane.center.y) * scale);
      context.stroke();
    }
    context.restore();
  }

  // Small, sharp chips scatter between the larger glass planes.
  context.globalCompositeOperation = 'lighter';
  for (let index = 0; index < 24; index++) {
    const seed = random(index + 143);
    const angle = index * TAU / 24 + random(index + 59) * .2;
    const distance = r * (.38 + seed * .65);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 2 + seed * 4;
    context.save();
    context.translate(x, y);
    context.rotate(angle + life * (seed - .5) * .08);
    context.globalAlpha = opacity * (.35 + seed * .5);
    context.fillStyle = index % 3 === 0 ? '#c6adff' : '#d0faff';
    context.shadowColor = context.fillStyle;
    context.shadowBlur = 4;
    context.beginPath();
    context.moveTo(-size, size * .3);
    context.lineTo(size, 0);
    context.lineTo(-size * .4, -size * .5);
    context.closePath();
    context.fill();
    context.restore();
  }
  context.restore();
}
