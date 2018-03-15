import { w } from './config';
import createEnemy from './createEnemy';

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


// enhancing item
// restoreLife:['liftReset','liftMax-6','liftRestore-6'],
// changeBullet:[],

var GreenPoint = {
  name: 'greenPoint',
  life: 1,
  // position: Math.floor(Math.random() * w),
  movePath: 'goToOut',
  moveTime: 10,
  restoreLife: ['liftMax-2','liftReset'],
  look: 'point',
  color: 'rgba(0,255,0,1)',
  effect: function () { },
}

var script = {
  0: {
    enemy: [Zark0],
    enemyPolling: [20, 100],
    enemyQuantity: 1,
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
};

export default function (reCount, ruleObj) {
  var rule = script[reCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    })
  }
};
