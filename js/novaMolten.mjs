const GOLDEN_ANGLE = 2.399963229728653;
const random = (seed) => {
  const value = Math.sin(seed * 127.1 + 81.7) * 43758.5453;
  return value - Math.floor(value);
};

// White-hot metal fragments burst out at uneven speeds, tumble, and shed amber sparks.
export default function drawMoltenStars(context, { age, delayFrames, r, opacity }) {
  const life = age - delayFrames;
  context.save();
  context.globalCompositeOperation = 'lighter';
  context.lineCap = 'round';
  if (life < 10) {
    const pulse = 1 - life / 10;
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, 45);
    glow.addColorStop(0, `rgba(255,255,237,${pulse * .85})`);
    glow.addColorStop(.2, `rgba(255,227,141,${pulse * .6})`);
    glow.addColorStop(.55, `rgba(255,158,42,${pulse * .2})`);
    glow.addColorStop(1, 'rgba(255,121,20,0)');
    context.globalAlpha = 1;
    context.fillStyle = glow;
    context.fillRect(-45, -45, 90, 90);
    context.strokeStyle = '#fff9df';
    context.shadowColor = '#ffe9a0';
    context.shadowBlur = 12;
    context.globalAlpha = pulse;
    context.lineWidth = 1;
    for (let index = 0; index < 8; index++) {
      const angle = index * Math.PI / 4;
      const reach = (index % 2 ? 15 : 28) * (1 + life * .06);
      context.beginPath();
      context.moveTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
      context.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach);
      context.stroke();
    }
  }

  for (let index = 0; index < 54; index++) {
    const seed = random(index + 7);
    const angle = index * GOLDEN_ANGLE + (random(index + 61) - .5) * .3;
    const speed = .35 + seed * .78;
    const distance = r * speed;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const x = dx * distance;
    const y = dy * distance + life * life * .007 * seed;
    const tail = Math.min(distance * .6, 14 + seed * 38) * (1 - life / 90);
    const hot = index % 4 === 0;
    context.shadowColor = '#ffb73e';
    context.shadowBlur = 7;
    const trail = context.createLinearGradient(x - dx * tail, y - dy * tail, x, y);
    trail.addColorStop(0, 'rgba(255,117,20,0)');
    trail.addColorStop(.55, 'rgba(255,164,43,.45)');
    trail.addColorStop(1, '#fff0b3');
    context.strokeStyle = trail;
    context.globalAlpha = opacity * (hot ? .8 : .5);
    context.lineWidth = hot ? 1.5 : .7;
    context.beginPath();
    context.moveTo(x - dx * tail, y - dy * tail);
    context.lineTo(x, y);
    context.stroke();

    context.save();
    context.translate(x, y);
    context.rotate(angle + (random(index + 137) - .5) * life * .16);
    const length = 5 + seed * 10;
    const width = 1.5 + random(index + 209) * 3;
    const metal = context.createLinearGradient(-length / 2, -width, length / 2, width);
    metal.addColorStop(0, '#dc892d');
    metal.addColorStop(.45, '#ffd778');
    metal.addColorStop(.53, '#fffce4');
    metal.addColorStop(1, '#ffc957');
    context.fillStyle = metal;
    context.shadowColor = '#ffdb79';
    context.shadowBlur = hot ? 9 : 4;
    context.globalAlpha = opacity * (.65 + seed * .3);
    context.beginPath();
    context.moveTo(-length * .55, -width * .25);
    context.lineTo(length * .7, -width * .15);
    context.lineTo(length * .2, width * .65);
    context.lineTo(-length * .45, width * .3);
    context.closePath();
    context.fill();
    if (hot) {
      context.globalAlpha = opacity * .85;
      context.strokeStyle = '#ffffed';
      context.lineWidth = .7;
      context.beginPath();
      context.moveTo(-length * .35, -width * .2);
      context.lineTo(length * .7, -width * .15);
      context.stroke();
    }
    context.restore();
  }

  // Small fading embers occupy the spaces between the heavier metal shards.
  context.shadowBlur = 3;
  for (let index = 0; index < 46; index++) {
    const seed = random(index + 331);
    const angle = index * GOLDEN_ANGLE + .8;
    const distance = r * (.15 + seed * .85);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + life * life * .01;
    context.globalAlpha = opacity * (.25 + seed * .5);
    context.fillStyle = index % 3 === 0 ? '#fff1bc' : '#ffb44f';
    context.shadowColor = '#ffc865';
    const size = seed > .75 ? 2 : 1;
    context.fillRect(x, y, size, size);
  }
  context.restore();
}
