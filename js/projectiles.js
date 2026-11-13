import { w, h, pixelWeigth, vheight } from './config';
import { createProjectileSystem } from './projectileSystem.mjs';
export default createProjectileSystem({ width: w, height: h, cellWidth: pixelWeigth, cellHeight: vheight / h });
