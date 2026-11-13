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
    return {
      update(ship, world) {
        const targets = world.enemies;
        const shipCenter = positionToXY(ship.position);
        return burst.update(targets, undefined, { x: shipCenter.x, y: shipCenter.y + pixelWeigth / 2 });
      },
      draw(context) { burst.draw(context); },
    };
  },
};
