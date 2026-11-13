const TAU = Math.PI * 2;
const COLORS = ['#95f8ff', '#bca0ff', '#ff8edc', '#fff2c6'];

export default function drawNovaJets(context, { age, delayFrames, r, opacity }) {
      // The impact is a ragged starburst, with independent jets instead of a ring.
      const impactAge = age - delayFrames;
      if (impactAge < 9) {
        context.globalAlpha = (1 - impactAge / 9) * .8;
        context.strokeStyle = context.shadowColor = '#eaffff';
        context.shadowBlur = 18;
        context.lineWidth = 2;
        for (let index = 0; index < 8; index++) {
          const angle = index * TAU / 8;
          const reach = (index % 2 ? 18 : 30) + impactAge * 2;
          context.beginPath();
          context.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
          context.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach);
          context.stroke();
        }
      }

      for (let index = 0; index < 32; index++) {
        const seed = Math.sin(index * 17.83);
        const angle = index * TAU / 32 + seed * .025;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const point = (distance, offset = 0) => [dx * distance - dy * offset, dy * distance + dx * offset];
        const tip = r * (.76 + (seed + 1) * .15);
        const length = Math.min(tip, 25 + r * (.42 + (index % 4) * .08));
        const base = Math.max(3, tip - length);
        const shoulder = Math.max(base, tip - length * .22);
        const halfWidth = Math.min(5.5, 1.2 + r * .017) * (index % 3 === 0 ? 1.1 : .65);
        const color = COLORS[index % COLORS.length];
        const gradient = context.createLinearGradient(...point(base), ...point(tip));
        gradient.addColorStop(0, 'rgba(99,147,255,0)');
        gradient.addColorStop(.5, color);
        gradient.addColorStop(.88, color);
        gradient.addColorStop(1, '#f0ffff');
        context.globalAlpha = opacity * (index % 3 === 0 ? .8 : .5);
        context.fillStyle = gradient;
        context.shadowColor = color;
        context.shadowBlur = 9;
        context.beginPath();
        context.moveTo(...point(base));
        context.lineTo(...point(shoulder, halfWidth));
        context.lineTo(...point(tip));
        context.lineTo(...point(shoulder, -halfWidth));
        context.closePath();
        context.fill();

        // A fine white core gives the leading tip weight without filling the screen.
        context.globalAlpha = opacity * .85;
        context.strokeStyle = '#e4faff';
        context.lineWidth = index % 4 === 0 ? 1.2 : .6;
        context.beginPath();
        context.moveTo(...point(Math.max(base, tip - length * .55)));
        context.lineTo(...point(tip));
        context.stroke();

        // Short branching discharges run outward along a few jets, never around them.
        if (index % 4 === 0) {
          context.strokeStyle = '#c0a0ff';
          context.shadowColor = '#b086ff';
          context.lineWidth = .8;
          context.globalAlpha = opacity * .65;
          context.beginPath();
          for (let step = 0; step < 6; step++) {
            const distance = tip * (.25 + step * .105);
            const offset = Math.sin(index + step * 3.1 + age * .4) * Math.min(6, r * .04);
            if (step === 0) context.moveTo(...point(distance, offset));
            else context.lineTo(...point(distance, offset));
          }
          context.stroke();
        }

        // Uneven shards trail each jet rather than forming a circular particle belt.
        context.shadowBlur = 3;
        context.fillStyle = color;
        for (let shard = 0; shard < 3; shard++) {
          const distance = tip * (.18 + shard * .23 + (seed + 1) * .04);
          const offset = Math.sin(index * 2.7 + shard) * (4 + impactAge * .15);
          const [x, y] = point(distance, offset);
          context.globalAlpha = opacity * (.6 - shard * .12);
          context.fillRect(x, y, shard === 0 ? 2 : 1.2, shard === 0 ? 2 : 1.2);
        }
      }
}
