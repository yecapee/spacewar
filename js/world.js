import lookPath from './lookPath';
import { positionToXY } from './positionMethod';
import { pixelWeigth, w, h } from './config';
import { createCollisionWorld } from './collisionWorld.mjs';
function shapeFor(entity, output = []) {
  const shape = lookPath[entity.look];
  if (!shape.offsets) return shape(entity.position, entity.lookType, entity.getST?.() || 0);
  const x = entity.position % w, y = Math.floor(entity.position / w); let count = 0;
  for (const [dx, dy] of shape.offsets) {
    const px = x + dx, py = y + dy;
    if (px < 0 || px >= w || py < 0 || py >= h) continue;
    const point = output[count] || (output[count] = {}); count++;
    point.ps = py * w + px; point.brickType = '0';
  }
  output.length = count; return output;
}
export default createCollisionWorld(shapeFor, positionToXY, pixelWeigth);
