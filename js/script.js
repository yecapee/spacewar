import { w } from './config';
import createEnemy from './createEnemy';

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
  name: 'ZARK-ZERO',
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
  }

};

export default function (reCount, ruleObj) {
  var rule = script[reCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    })
  }
}