import { w } from './config';
import projectiles from './projectiles';
function normal(position, array) { projectiles.spawn('player', position, position, array); }
export default {
  normal,
  treble(position, array) {
    normal(position, array);
    if (position % w > 1) normal(position - 1, array);
    if (position % w < w - 1) normal(position + 1, array);
  },
};
