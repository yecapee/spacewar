import { pixelWeigth, vwidth, vheight, renderData } from './config';
import { positionToXY } from './positionMethod';
import lookPath from './lookPath';
import createNovaBurst from './novaBurst.mjs';
import feedback from './feedback.mjs';
import { sonicBoomSound, heavyWaveSound } from './sound';

export default {
  atomicExplosionCanKill(position) {
    const origin = positionToXY(position);
    // Positions describe the top of the ship's central grid cell.
    const burst = createNovaBurst({ x: origin.x, y: origin.y + pixelWeigth / 2 }, {
      onStage(stage, center) {
        if (stage === 'sonic') sonicBoomSound();
        else {
          heavyWaveSound();
          feedback.novaImpact(center.x, center.y);
        }
      },
      radius: Math.hypot(vwidth, vheight),
    });
    return function (ship, context) {
      const targets = renderData.enemy.slice().map((enemy) => ({
        enemy,
        points: lookPath[enemy.look](enemy.position)
          .filter((point) => point.ps !== undefined)
          .map((point) => {
            const location = positionToXY(point.ps);
            return { position: point.ps, x: location.x, y: location.y + pixelWeigth / 2, radius: pixelWeigth / 2 };
          }),
      }));
      const shipCenter = positionToXY(ship.position);
      const complete = burst.update(targets, context, { x: shipCenter.x, y: shipCenter.y + pixelWeigth / 2 });
      burst.draw(context);
      return complete;
    };
  },
};
