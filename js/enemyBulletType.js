import { renderData } from './config';
import projectiles from './projectiles';
export default {
  normal(position, ship) { projectiles.spawn('normal', position, ship.position, renderData.enemyBullet); },
  track(position, ship) { projectiles.spawn('track', position, ship.position, renderData.enemyBullet); },
  diffusionTrack(position, ship) { for (let i = 0; i < 3; i++) projectiles.spawn('diffusion', position, ship.position, renderData.enemyBullet, i); },
};
