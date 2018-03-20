import { w, h, pixelWeigth } from './config';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
} from './positionMethod';

function normal(bulletPs, arr, time) {
  var prePs = bulletPs;
  function pathFn(taPs) {
    prePs -= w;
    var realPosition = positionToXY(prePs);
    return {
      position: prePs,
      x: realPosition.x,
      y: realPosition.y,
      look: 'shipBulletNormal',
      w: 20,
      h: 60,
      clear: prePs < 0,
    }
  }
  arr.push({ data: pathFn(), fn: pathFn });
};

export default {
  normal: normal,
  treble: function (bulletPs, arr, time) {
    normal(bulletPs, arr);
    if (bulletPs % w > 1) normal(bulletPs - 1, arr);
    if (bulletPs % w < w-1) normal(bulletPs + 1, arr);
  },
}