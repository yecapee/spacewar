import { w, h, pixelWeigth } from './config';
import { positionToXY, xyToPosition } from './positionMethod';
import skillPath from './skillPath';
import bricks from './bricks';
export default {
  claw(position, ship) {
    const target = ship.position; let count = 60, path = [], color = '', damaging = false;
    return {
      update(player) {
        count--; const key = count > 54 ? 'claw1' : count > 48 ? 'claw2' : count > 36 ? 'claw3' : count > 24 ? 'claw4' : 'claw5';
        path = skillPath[key](target); color = count > 54 ? 'rgba(255,255,255,.8)' : count > 48 ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.6)';
        damaging = count <= 36 && count > 0;
        if (damaging && path.some(point => player.path.has(point.ps))) player.injured();
        return count < -1;
      },
      draw(context) { for (const point of path) bricks(point, context, color); },
    };
  },
  atomicExplosion(position) {
    const duration = Math.max(1, 300 - (40 - w) * 20), center = positionToXY(position);
    const points = Array.from({ length: 21 }, () => ({})); let age = 0, color;
    return {
      update(ship) {
        age++; const count = duration - age;
        color = `rgba(${Math.round(255 - 200 / duration * age)},80,${Math.round(50 + 205 / duration * age)},${(count / duration * .5 + .5).toFixed(1)})`;
        for (let i = 0; i < points.length; i++) {
          const angle = Math.PI * 2 / 20 * i + age * Math.PI / 180, point = points[i];
          point.x = Math.round(center.x + age * Math.cos(angle)); point.y = Math.round(center.y + age * Math.sin(angle));
          point.position = xyToPosition(point.x, point.y);
          point.visible = point.x >= 0 && point.x < w * pixelWeigth && point.y >= 0 && point.y < h * pixelWeigth;
          if (point.visible && ship.path.has(point.position)) ship.injured();
        }
        return count < -1;
      },
      draw(context) { context.fillStyle = color; for (const point of points) if (point.visible) context.fillRect(point.x, point.y, 15, 15); },
    };
  },
};
