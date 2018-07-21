import { w, h, pixelWeigth } from './config';
import {
  positionToXY,
  positionTosXsY,
  // xyToPosition,
  sXsYToPosition,
} from './positionMethod';
import skillPath from './skillPath';
import bricks from './bricks';
import { renderData } from './config';
import { animation } from './aniEffectMethod';

function xyToPosition(x, y) {
  var _x = Math.round(x / pixelWeigth);
  var _y = Math.round(y / pixelWeigth);
  //console.log(_x,_y);
  //var _x = (x - pixelWeigth / 2) / pixelWeigth;
  //var rs = (y - pixelWeigth / 2) / pixelWeigth * w + _x;
  return _y * w + _x;
}

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));

  // console.log(
  //   'x',Math.round((_x - pixelWeigth / 2 )/pixelWeigth),
  //   'y',Math.round(_y / window.innerHeight)
  // );
  return {
    position_big: xyToPosition(_x, _y),
    position: sXsYToPosition(_x, _y),
    //outScope: _x < 0 || _x > w - 1 || _y < 0 || _y > h - 1,
    outScope: Math.round(_x / pixelWeigth) < 0 || Math.round(_x / pixelWeigth) > w - 1 || Math.round(_y / pixelWeigth) < 0 || Math.round(_y / pixelWeigth) > h - 1,
    x: _x,
    y: _y,
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
    var time = 300-(40-w)*20;
    var prePs = position;
    var count = time;
    var _taPs = ship.position;
    return function (ship, viewDom) {
      count--;
      var t = 1 / time * (time - count);
      var isHurt = false;
      var p0 = positionToXY(prePs);
      var pointLength = 20;
      var skillPath = [];
      for (var i = 0; i <= pointLength; i++) {
        var psData = circle(p0.x, p0.y, (time - count) * 1, pointLength, i, (time - count));
        !psData.outScope && skillPath.push({ ps: psData.position_big, brickType: '0', x: psData.x, y: psData.y });
      }

      skillPath.forEach(function (ps) {
        //var color = count % 2 ? 'rgba(255,0,0,.5)' : 'rgba(255,0,0,1)';
        var color = 'rgba(' + Math.round(255 - 200 / time * (time - count)) + ',80,' + Math.round(50 + 205 / time * (time - count)) + ',' + (count / time * .5 + .5 ).toFixed(1) + ')'
        //bricks(ps, viewDom, 'blue');
        if (ps.ps) {
          viewDom.fillStyle = color;
          viewDom.fillRect(ps.x, ps.y, 15, 15);
          isHurt = isHurt || ship.path.includes(ps.ps);
        }
      });

      isHurt && ship.injured();

      return count < -1;
    }
  },
}