import { w, h, pixelWeigth } from './config';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
} from './positionMethod';

export default {
  normal: function (bulletPs, time) {
    var prePs = bulletPs;
    var count = time || 60;
    return function (shipPs) {
      count--;
      var p0 = positionTosXsY(prePs);
      var p1 = positionTosXsY(prePs + w * h);
      var t = 1 / 60 * (60 - count);

      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      // console.log(x,y,sXsYToPosition(x,y));
      // console.log(prePs,shipPs,p0,p1,sXsYToPosition(p0.x,p0.y),sXsYToPosition(p1.x,p1.y));

      return {
        position: sXsYToPosition(x, y),
        look: '',
        clear: count < -1,
      }
    }
  },
  track: function (bulletPs, time) {
    var prePs = bulletPs;
    var count = time || 25;
    var p1 = null;
    return function (shipPs) {
      count--;
      var p0 = positionTosXsY(prePs);
      if (!p1) p1 = positionTosXsY(shipPs);
      var t = 1 / 25 * (25 - count);
      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      // console.log(x,y,sXsYToPosition(x,y));
      // console.log(prePs,shipPs,p0,p1,sXsYToPosition(p0.x,p0.y),sXsYToPosition(p1.x,p1.y));

      return {
        position: sXsYToPosition(x, y),
        look: '',
        clear: count < -15 || x < 0 || x > w - 1,
      }
    }
  },
}