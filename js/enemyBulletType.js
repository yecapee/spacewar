import { w, h, pixelWeigth, renderData } from './config';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
  xyToPosition
} from './positionMethod';
import { circle } from './aniEffectMethod';

var bulletArr = renderData.enemyBullet;

function bulletPush(data, bulletPs) {
  if (!bulletArr.reduce(function (rs, el) { return rs || (el.data.position === bulletPs) }, false)) {
    bulletArr.push(data);
  };
}

function getAngle(a,b) {
  var Dx = b.x - a.x;
  var Dy = b.y - a.y;
  var DRoation = Math.atan2(Dy,Dx);
  var WRotation = DRoation/Math.PI*180;
  return WRotation-90;
}

export default {
  normal: function (bulletPs, ship) {
    var time = 45;
    var prePs = bulletPs;
    var count = time;

    var dataFn = function (taPs, clear) {
      count--;
      var p0 = positionTosXsY(prePs);
      var p1 = positionTosXsY(prePs + w * h);
      var t = 1 / time * (time - count);

      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      var _p0 = positionToXY(prePs);
      var _p1 = positionToXY(prePs + w * h);
      var t = 1 / time * (time - count);
      var realX = _p0.x + (_p1.x - _p0.x) * t;
      var realY = _p0.y + (_p1.y - _p0.y) * t;

      if (clear) {
        time = null;
        prePs = null;
        count = null;
      }
      return {
        position: sXsYToPosition(x, y),
        x: realX,
        y: realY,
        look: 'laser',
        w: 20,
        h: 60,
        clear: count < -1,
      }
    }

    bulletPush({
      data: dataFn(ship.position),
      fn: dataFn,
    }, bulletPs)

  },
  track: function (bulletPs, ship) {
    var prePs = bulletPs;
    var time;
    var count;
    var p1 = null;
    var _p1 = null;
    var dataFn = function (taPs, clear) {
      var p0 = positionTosXsY(prePs);
      if (!p1) {
        p1 = positionTosXsY(taPs);
        time = Math.floor(Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y)) * 2);
        count = time - 1;
      }
      var t = 1 / time * (time - count);
      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      var _p0 = positionToXY(prePs);
      var marginX = pixelWeigth / 2;
      var marginY = 0;

      if (!_p1) _p1 = positionToXY(taPs);
      var realX = (_p0.x + marginX + (_p1.x - _p0.x + marginX) * t);
      var realY = (_p0.y + marginY + (_p1.y - _p0.y + marginY) * t);
      count--;

      if (clear) {
        time = null;
        prePs = null;
        count = null;
        p1 = null;
        _p1 = null;
      }

      return {
        position: sXsYToPosition(x, y),
        x: realX,
        y: realY,
        look: 'bulletBall',
        w: 15,
        h: 15,
        clear: count < -15 || x < 0 || x > w - 1,
      }
    }

    bulletPush({
      data: dataFn(ship.position),
      fn: dataFn,
    }, bulletPs)
  },
  diffusionTrack: function (bulletPs, ship) {

    for (var i = 0; i < 3; i++) {
      (function (i) {
        //console.log('i',i);
        
        var prePs = bulletPs;

        var p0 = positionToXY(prePs);
        
        var p2 = positionToXY(ship.position);
        var distance = Math.floor(Math.sqrt((p0.x - p2.x) * (p0.x - p2.x) + (p0.y - p2.y) * (p0.y - p2.y)) * 2);
        var time = distance*.08;
        var p1 = circle(p0.x, p0.y, distance*.3, 16, i+1, getAngle(p0,p2)*Math.PI/180 + Math.PI/180*45);

        var count = time;

        var dataFn = function (taPs, clear) {

          var t = (time - count) / time;
          var x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
          var y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;


          count--;

          if (clear) {
            prePs = null;
            time = null;
            count = null;
            p0 = null;
            p1 = null;
            p2 = null;
          }

          return {
            position: xyToPosition(x, y),
            x: x,
            y: y,
            look: 'bulletBall',
            w: 15,
            h: 15,
            clear: count < -5 || xyToPosition(x, y).x < 0 || xyToPosition(x, y).x > w - 1,
          }
        }

        bulletPush({
          data: dataFn(ship.position),
          fn: dataFn,
        }, bulletPs)
      })(i)
    }

  },
}