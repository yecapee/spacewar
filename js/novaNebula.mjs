const TAU = Math.PI * 2;
const PALETTE = [
  { cloud: '84,99,239', fire: '83,224,255', core: '#c1faff' },
  { cloud: '128,66,219', fire: '191,126,255', core: '#ece0ff' },
  { cloud: '167,57,182', fire: '247,106,205', core: '#ffe2f7' },
];

// Curved, overlapping plumes roll outward at different speeds instead of forming a ring.
export default function drawNebulaFlames(context, { age, delayFrames, r, opacity }) {
  const life = age - delayFrames;
  const pulse = Math.max(0, 1 - life / 10);
  if (pulse > 0) {
    const ignition = context.createRadialGradient(0, 0, 3, 0, 0, 55);
    ignition.addColorStop(0, `rgba(153,237,255,${pulse * .45})`);
    ignition.addColorStop(.35, `rgba(124,86,230,${pulse * .18})`);
    ignition.addColorStop(1, 'rgba(70,49,160,0)');
    context.globalAlpha = opacity;
    context.fillStyle = ignition;
    context.fillRect(-55, -55, 110, 110);
  }

  for (let index = 0; index < 20; index++) {
    const seed = .5 + .5 * Math.sin(index * 17.83 + 1.3);
    const angle = index * TAU / 20 + Math.sin(index * 9.31) * .16;
    const color = PALETTE[index % PALETTE.length];
    const tip = r * (.57 + seed * .56);
    const base = Math.max(12, r * (.1 + seed * .17));
    const span = Math.max(1, tip - base);
    const width = Math.min(30, 5 + r * .095) * (.4 + seed * .95);
    const curl = Math.sin(life * .12 + index * 2.1) * Math.min(26, r * .12);
    context.save();
    context.rotate(angle + Math.sin(life * .06 + index) * .06);
    context.shadowBlur = 0;

    // Soft violet clouds give the flame a translucent, billowing body.
    for (let layer = 0; layer < 3; layer++) {
      const x = base + span * (.3 + layer * .25);
      const y = curl * (layer ? .7 : -.4);
      const size = width * (2.2 - layer * .3);
      const cloud = context.createRadialGradient(x, y, 0, x, y, size);
      cloud.addColorStop(0, `rgba(${color.cloud},.4)`);
      cloud.addColorStop(.45, `rgba(${color.cloud},.18)`);
      cloud.addColorStop(1, `rgba(${color.cloud},0)`);
      context.globalAlpha = opacity * .85;
      context.fillStyle = cloud;
      context.fillRect(x - size, y - size, size * 2, size * 2);
    }

    const flame = context.createLinearGradient(base, 0, tip, curl);
    flame.addColorStop(0, `rgba(${color.cloud},0)`);
    flame.addColorStop(.35, `rgba(${color.cloud},.3)`);
    flame.addColorStop(.7, `rgba(${color.fire},.55)`);
    flame.addColorStop(1, `rgba(${color.fire},.1)`);
    context.fillStyle = flame;
    context.globalAlpha = opacity * .45;
    context.shadowColor = `rgb(${color.fire})`;
    context.shadowBlur = 12;
    context.beginPath();
    context.moveTo(base, 0);
    context.bezierCurveTo(base + span * .25, -width * .3, tip - span * .4, -width * .9, tip - span * .18, curl - width * .25);
    context.bezierCurveTo(tip - span * .02, curl - width * .15, tip + width * .8, curl - width * .9, tip + width * .35, curl - width * .55);
    context.bezierCurveTo(tip + width * .05, curl - width * .15, tip - span * .15, curl + width * .25, tip - span * .34, curl + width * .3);
    context.bezierCurveTo(base + span * .4, width * .45, base + span * .22, width * .25, base, 0);
    context.closePath();
    context.fill();

    // A moving S-shaped highlight curls into the plume instead of pointing straight out.
    const filament = context.createLinearGradient(base, 0, tip, curl);
    filament.addColorStop(0, `rgba(${color.fire},0)`);
    filament.addColorStop(.65, color.core);
    filament.addColorStop(1, `rgba(${color.fire},0)`);
    context.strokeStyle = filament;
    context.shadowColor = `rgb(${color.fire})`;
    context.shadowBlur = 8;
    context.lineWidth = index % 3 === 0 ? 1.1 : .65;
    context.globalAlpha = opacity * (index % 2 === 0 ? .6 : .25);
    context.beginPath();
    context.moveTo(base + span * .15, 0);
    context.bezierCurveTo(base + span * .42, -width * .8, tip - span * .22, curl - width * .6, tip, curl);
    context.bezierCurveTo(tip + width * .2, curl - width * .05, tip + width * .4, curl - width * .55, tip + width * .25, curl - width * .45);
    context.stroke();

    context.shadowBlur = 4;
    context.fillStyle = color.core;
    for (let ember = 0; ember < 3; ember++) {
      const distance = base + span * (.25 + ember * .27 + seed * .07);
      const offset = Math.sin(index * 3.7 + ember * 2.4 + life * .08) * width * .7;
      context.globalAlpha = opacity * (.45 + ember * .1);
      const size = ember === 2 ? 2 : 1.2;
      context.fillRect(distance, offset, size, size);
    }
    context.restore();
  }
}
