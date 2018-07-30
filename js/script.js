import {
  w,
  h,
  pixelWeigth,
  renderData
} from './config';
import createEnemy from './createEnemy';
import {
  animation,
} from './aniEffectMethod';
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
  ezPositionWithCheckScope
} from './positionMethod';

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  return {
    position: sXsYToPosition(_x, _y),
    outScope: _x < 0 || _x > w - 1 || _y < 0 || _y > h - 1,
    x: _x,
    y: _y
  }
}

// test enemy
var turret = {
  name: 'turret',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 18],
  movePath: 'goToOut',
  moveTime: 5,
  look: 'turret',
  bulletType: 'diffusionTrack',
}

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

var GOZILLA = {
  name: 'GOZILLA',
  showLife:true,
  lifeBarPosition:function(ps){
    var xy = ezPositionWithCheckScope(ps);
    return xy(0,-9);
  },
  life: 800,
  // position: Math.floor(Math.random() * w),
  shot: false,
  shotTime: [100, 54, 9],
  movePath: 'pingpong',
  moveTime: 3,
  look: 'MONSTER1',
  shotLook: 'MONSTER1_openmouth',
  position: Math.round(w / 3) - 5,
  bulletType: 'track',
  skills: [
    {
      type: 'atomicExplosion',
      launchTime: [250, 120, 6],
      skillLook: 'MONSTER1_openmouth',
      skillPoint: function (ps) {
        var xy = ezPositionWithCheckScope(ps);
        var point = [[-5, -2]];
        var rs = point.map(function (_xy) {
          return xy(_xy[0], _xy[1]);
        });
        return rs;
      },
    },
  ],
  shotPoint: function (ps) {
    var xy = ezPositionWithCheckScope(ps);
    var point = [[-7, -4], [-6, -3], [-6, -1], [-7, 0], [-9, -2], [-8, -3], [-5, -2], [-8, -1], [-8, -2], [-7, -2], [-7, -3], [-7, -1], [-6, -2]];
    var rs = point.map(function (_xy) {
      return xy(_xy[0], _xy[1]);
    });
    return rs;
  }
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
  name: 'circleKiller',
  showLife:true,
  lifeBarPosition:function(ps){
    var xy = ezPositionWithCheckScope(ps);
    return xy(0,-6);
  },
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
  movePath: 'pingpong',
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
  name: 'hp_1',
  movePath: 'pingpong',
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
  name: 'TrebleBullet',
  movePath: 'pingpong',
  moveTime: 10,
  changeBullet: 'treble',
  look: 'porweUp',
  color: 'rgba(255,0,0,1)',
  effect: function (ship) {
    ship.look = 'crystal-plus';
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


//script
var script = {
  0: {
    enemy: [Zark0],
    //enemy: [turret],
    enemyPolling: [20, 100],
    enemyQuantity: 1,
    stopCount: false,
    stopEnemyPush: false,
  },
  // 1: {
  //   // enemy: [Zark1, Fort0],
  //   // enemyPolling: [15, 55],
  //   item: [GreenPoint, GreenPoint, GreenPoint, TrebleBullet],
  // },
  // 100: {
  //   boss: [GOZILLA],
  // },
  // 103: {
  //   stopCount: stop,
  // },
  // 104: {
  //   stopCount: true,
  // },
  // 1:{
  //   //item: [GreenPoint],
  //   //stopCount: false,
  // },
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
  },
  1806: {
    boss: [circleKiller2],
  },
  1807: {
    stopCount: true,
    stopEnemyPush: true,
  },
  1809: {
    stopCount: false,
    stopEnemyPush: false,
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
  2120: {
    item: [GreenPoint],
  },
  2200: {
    boss: [GOZILLA],
  },
  2201: {
    stopEnemyPush: false,
    stopCount: true,
  },
  2202: {
    item: [GreenPoint],
    stopCount: false,
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


//export 
export default function (renCount, ruleObj, nextPolling) {
  var rule = script[renCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    })
    //console.log('script : ',ruleObj,'nextPolling : ',nextPolling);
  }
};


