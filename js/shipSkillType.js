import { w, h, pixelWeigth } from "./config";
import {
  positionToXY,
  positionTosXsY,
  xyToPosition,
  sXsYToPosition,
} from "./positionMethod";
import skillPath from "./skillPath";
import bricks from "./bricks";
import { renderData } from "./config";
import { animation } from "./aniEffectMethod";

function circle(x, y, r, all, now, margin) {
  var ang = (Math.PI * 2) / all;
  var _margin = ((2 * Math.PI) / 360) * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));

  return {
    position_big: xyToPosition(_x, _y),
    position: sXsYToPosition(_x, _y),
    outScope:
      Math.round(_x / pixelWeigth) < 0 ||
      Math.round(_x / pixelWeigth) > w - 1 ||
      Math.round(_y / pixelWeigth) < 0 ||
      Math.round(_y / pixelWeigth) > h - 1,
    x: _x,
    y: _y,
  };
}

export default {
  atomicExplosion: function (position, ship) {
    var time = 300 - (40 - w) * 20;
    var prePs = position;
    var count = time;
    return function (ship, viewDom) {
      count--;
      var t = (1 / time) * (time - count);
      var p0 = positionToXY(prePs);
      var pointLength = 20;
      var skillPath = [];
      for (var i = 0; i <= pointLength; i++) {
        var psData = circle(
          p0.x,
          p0.y,
          (time - count) * 1,
          pointLength,
          i,
          time - count
        );
        !psData.outScope &&
          skillPath.push({
            ps: psData.position_big,
            brickType: "0",
            x: psData.x,
            y: psData.y,
          });
      }

      skillPath.forEach(function (ps) {
        //var color = count % 2 ? 'rgba(255,0,0,.5)' : 'rgba(255,0,0,1)';
        var color =
          "rgba(" +
          Math.round(255 - (200 / time) * (time - count)) +
          ",80," +
          Math.round(50 + (205 / time) * (time - count)) +
          "," +
          ((count / time) * 0.5 + 0.5).toFixed(1) +
          ")";
        //bricks(ps, viewDom, 'blue');
        if (ps.ps) {
          viewDom.fillStyle = color;
          viewDom.fillRect(ps.x, ps.y, 15, 15);
          renderData.enemyBullet.forEach(function (bullet, index) {
            if (ps.ps === bullet.data.position) {
              renderData.enemyBullet.splice(index, 1);
            }
          });
        }
      });

      return count < -1;
    };
  },
  atomicExplosionCanKill: function (position, ship) {
    var time = 300 - (40 - w) * 20;
    var prePs = ship.position;
    var count = time;
    return function (ship, viewDom) {
      count--;
      var t = (1 / time) * (time - count);
      var p0 = positionToXY(ship.position);
      var pointLength = 20;
      var skillPath = [];
      for (var i = 0; i <= pointLength; i++) {
        var psData = circle(
          p0.x,
          p0.y,
          (time - count) * 1,
          pointLength,
          i,
          time - count
        );
        !psData.outScope &&
          skillPath.push({
            ps: psData.position_big,
            brickType: "0",
            x: psData.x,
            y: psData.y,
          });
      }

      skillPath.forEach(function (ps) {
        if (ps.ps) {
          var enemyImg = document.getElementById("bulletBall");
          viewDom.drawImage(enemyImg, ps.x, ps.y, 15, 15);

          renderData.enemy.forEach(function (obj) {
            obj.wasHit(ps.ps, viewDom, function () {
             //  thisBullet.splice(thisBullet.indexOf(el), 1);
            })
          });

          // renderData.enemy.forEach(function (_enemy, index) {
          //   if (ps.ps === _enemy.position) {
          //     _enemy.wasHit(ps.ps, viewDom);
          //   }
          // });
        }
      });

      return count < -1;
    };
  },
};
