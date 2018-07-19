import { w, h, pixelWeigth } from './config';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
} from './positionMethod';
import skillPath from './skillPath';
import bricks from './bricks';
import { renderData } from './config';
import { animation } from './aniEffectMethod';

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  return {
    position: sXsYToPosition(_x, _y),
    outScope: _x < 0 || _x > w - 1 || _y < 0 || _y > h - 1,
  }
}

export default {
  claw: function (position, ship) {
    var time = 60;
    var prePs = position;
    var count = time;
    var _taPs = ship.position;
    return function (ship, viewDom) {
      count--;
      var t = 1 / time * (time - count);
      var isHurt = false;

      if (count > time * .9) {
        skillPath['claw1'](_taPs).forEach(function (ps) {
          bricks(ps, viewDom, 'rgba(255,255,255,.8)');
        });
        return false;
      }
      if (count > time * .8) {
        skillPath['claw2'](_taPs).forEach(function (ps) {
          bricks(ps, viewDom, 'rgba(255,255,255,.2)');
        });
        return false;
      }
      if (count > time * .6) {
        skillPath['claw3'](_taPs).forEach(function (ps) {
          bricks(ps, viewDom, 'rgba(255,255,255,.6)');
          isHurt = isHurt || ship.path.includes(ps.ps);
        });
        //if (isHurt) ship.injured();
        return false;
      }
      if (count > time * .4) {
        skillPath['claw4'](_taPs).forEach(function (ps) {
          bricks(ps, viewDom, 'rgba(255,255,255,.6)');
          isHurt = isHurt || ship.path.includes(ps.ps);
        });
        if (isHurt) ship.injured();
        return false;
      }
      if (count > 0) {
        skillPath['claw5'](_taPs).forEach(function (ps) {
          bricks(ps, viewDom, 'rgba(255,255,255,1.0)');
          isHurt = isHurt || ship.path.includes(ps.ps);
        });
        if (isHurt) ship.injured();
        return false;
      }

      return count < -1;
    }
  },
  atomicExplosion: function (position, ship) {
    var time = 120;
    var prePs = position;
    var count = time;
    var _taPs = ship.position;
    return function (ship, viewDom) {
      count--;
      var t = 1 / time * (time - count);
      var isHurt = false;

      var p0 = positionTosXsY(prePs);
      var pointLength = 25;
      var skillPath = [];
      for (var i = 0; i <= pointLength; i++) {
        var psData = circle(p0.x, p0.y, t * 30, pointLength, i, Math.round(t / 20));
        !psData.outScope && skillPath.push({ ps: psData.position, brickType: '0' });
      }

      skillPath.forEach(function (ps) {
        //var color = count % 2 ? 'rgba(255,0,0,.5)' : 'rgba(255,0,0,1)';
        var color = 'rgba(' + (255 - 200 / time * (time - count)) + ',80,' + (50 + 205 / time * (time - count)) + ',1)'
        bricks(ps, viewDom, color);
        isHurt = isHurt || ship.path.includes(ps.ps);
      });

      if (isHurt) ship.injured();

      return count < -1;
    }
  },
}