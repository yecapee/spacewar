import {
  w,
  pixelWeigth,
  renderData
} from './config';
import createEnemy from './createEnemy';
import {
  animation,
  circle
} from './aniEffectMethod';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition
} from './positionMethod';
import _ from 'lodash';

// enemy
var Zark0 = {
  name: 'ZARK-ZERO',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: 'gostMove',
  moveTime: 5,
  look: 'zark',
  bulletType: 'normal',
}

var Zark1 = {
  name: 'ZARK-PLUS',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 81, 9],
  movePath: 'gostMove',
  moveTime: 3,
  look: 'zark',
  bulletType: 'normal',
}

var Fort0 = {
  name: 'FORT',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: 'goToOut',
  moveTime: 5,
  look: 'fort',
  bulletType: 'track',
}

var circleKiller = {
  name: 'test',
  life: 20,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [100, 54, 9],
  movePath: 'pingpong',
  moveTime: 3,
  look: 'CIRCLE',
  position: Math.round(w / 3) - 5,
  bulletType: 'track',
}

var circleKiller2 = Object.assign({}, circleKiller, { position: Math.round(w / 3) * 2 + 5 });

// enhancing item
// restoreLife:['liftReset','liftMax-6','liftRestore-6'],
// changeBullet:[],

var GreenPoint = {
  name: 'greenPoint',
  movePath: 'goToOut',
  moveTime: 10,
  restoreLife: ['liftMax-2', 'liftReset'],
  look: 'hp+',
  color: 'rgba(0,255,0,1)',
  effect: function (ship) {
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i)
          viewDom.fillStyle = 'rgba(0,255,0,.8)';
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
}

var hp_1 = {
  name: 'greenPoint',
  movePath: 'goToOut',
  moveTime: 10,
  restoreLife: ['liftRestore-1',],
  look: 'hp+',
  color: 'rgba(255,255,0,1)',
  effect: function (ship) {
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i)
          viewDom.fillStyle = 'rgba(255,255,0,.8)';
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
}

var TrebleBullet = {
  name: 'greenPoint',
  movePath: 'goToOut',
  moveTime: 10,
  changeBullet: 'treble',
  look: 'hp+',
  color: 'rgba(255,0,0,1)',
  effect: function (ship) {
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i)
          viewDom.fillStyle = 'rgba(255,0,0,.8)';
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
}

var script = {
  0: {
    enemy: [Zark0],
    enemyPolling: [20, 100],
    enemyQuantity: 1,
    stopCount: false,
  },
  800: {
    enemy: [Zark0, Fort0],
    enemyPolling: [15, 80],
    enemyQuantity: 1,
  },
  1600: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 75],
    enemyQuantity: 1,
  },
  1601: {
    item: [GreenPoint],
  },
  1700: {
    enemy: [],
  },
  1800: {
    item: [hp_1],
  },
  1805: {
    boss: [circleKiller],
    stopCount: true,
  },
  1806: {
    boss: [circleKiller2],
    stopCount: true,
  },
  1809: {
    stopCount: false,
  },
  1820: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 75],
    item: [TrebleBullet],
  },
  2100: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 55],
    item: [GreenPoint],
  },
  3400: {
    item: [hp_1],
  },
  4500: {
    enemyPolling: [15, 45],
  },
  5600: {
    item: [hp_1],
  },
  5700: {
    enemyPolling: [10, 35],
  }

};

export default function (renCount, ruleObj) {
  var rule = script[renCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    })
  }
};
