import { w, h, pixelWeigth, renderData } from "./config";
import createEnemy from "./createEnemy";
import {createCreatureEnemy,createSurvivalAttack} from '../art-prototypes/zilla-combat/creature-enemy.mjs';
import { animation } from "./aniEffectMethod";
import {
  positionToXY,
  positionTosXsY,
  sXsYToPosition,
  ezPositionWithCheckScope,
} from "./positionMethod";

function circle(x, y, r, all, now, margin) {
  var ang = (Math.PI * 2) / all;
  var _margin = ((2 * Math.PI) / 360) * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  return {
    position: sXsYToPosition(_x, _y),
    outScope: _x < 0 || _x > w - 1 || _y < 0 || _y > h - 1,
    x: _x,
    y: _y,
  };
}

// test enemy
var turret = {
  name: "turret",
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 18],
  movePath: "goToOut",
  moveTime: 5,
  look: "turret",
  bulletType: "diffusionTrack",
};

// enemy
var Zark0 = {
  name: "ZARK-ZERO",
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: "gostMove",
  moveTime: 5,
  look: "zark",
  bulletType: "normal",
};

// The articulated boss owns its gait and breath sequence; legacy pixel skills are disabled.
var GOZILLA = {
  name: "GOZILLA", showLife: true, life: 800,
  shot: false, shotTime: [1, 0, 1], look: "kaiju", skills: [],
  position: Math.round(w / 3),
  createKaiju:createCreatureEnemy,createAttack:createSurvivalAttack,
};
// The original procedural pair keeps its own navigation and swept beam attacks.
var OLD_GOZILLA = {
  name:'GOZILLA',showLife:true,life:400,shot:false,shotTime:[1,0,1],look:'kaiju',skills:[],position:Math.round(w/3),
};
var OLD_GOZILLA2 = {...OLD_GOZILLA,position:Math.round(w*2/3)};

var Zark1 = {
  name: "ZARK-PLUS",
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 81, 9],
  movePath: "gostMove",
  moveTime: 3,
  look: "zark",
  bulletType: "normal",
};

var Fort0 = {
  name: "FORT",
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: "goToOut",
  moveTime: 5,
  look: "fort",
  bulletType: "track",
};

var circleKiller = {
  name: "circleKiller",
  showLife: true,
  lifeBarPosition: function (ps) {
    var xy = ezPositionWithCheckScope(ps);
    return xy(0, -6);
  },
  life: 20,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [100, 54, 9],
  movePath: "pingpong",
  moveTime: 3,
  look: "CIRCLE",
  position: Math.round(w / 3) - 5,
  bulletType: "track",
};

var circleKiller2 = Object.assign({}, circleKiller, {
  position: Math.round(w / 3) * 2 + 5,
});

// enhancing item
// restoreLife:['liftReset','liftMax-6','liftRestore-6'],
// changeBullet:[],

var GreenPoint = {
  name: "greenPoint",
  movePath: "pingpong",
  moveTime: 10,
  restoreLife: ["liftMax-2", "liftReset"],
  look: "hp+",
  color: "#cf9cff",
  effect: function (ship) {
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i);
          viewDom.fillStyle = "rgba(207,156,255,.8)";
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
};

var hp_1 = {
  name: "hp_1",
  movePath: "pingpong",
  moveTime: 10,
  restoreLife: ["liftRestore-1"],
  look: "hp+",
  color: "#86ffd0",
  effect: function (ship) {
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i);
          viewDom.fillStyle = "rgba(134,255,208,.8)";
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
};

var TrebleBullet = {
  name: "TrebleBullet",
  movePath: "pingpong",
  moveTime: 10,
  changeBullet: "treble",
  look: "porweUp",
  color: "#ffbc55",
  effect: function (ship) {
    ship.look = "modular-plus";
    renderData.aniEffect.push(
      animation(80, function (renCount, viewDom) {
        var p0 = positionToXY(ship.position);
        var all = 5;
        for (var i = 1; i <= all; i++) {
          var nowPs = circle(p0.x, p0.y, 1.5 * renCount, all, i);
          viewDom.fillStyle = "rgba(255,188,85,.8)";
          viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
        }
      })
    );
  },
};

// Chapter timings count active flight only. Boss encounters hold this clock.
var script = {
  0: {chapter:'01 初航巡邏',enemy:[Zark0],enemyPolling:[30,100],enemyQuantity:1,stopCount:false,stopEnemyPush:false,waitForBosses:false},
  640: {chapter:'02 交叉火網',enemy:[Zark0,Fort0],enemyPolling:[22,80],enemyQuantity:1},
  1040: {enemy:[Zark0,Zark1,Fort0],enemyPolling:[20,75]},
  1200: {chapter:'03 雙環封鎖',enemy:[],stopEnemyPush:true,item:[hp_1]},
  1500: {clearField:true,boss:[circleKiller,circleKiller2],stopCount:true,stopEnemyPush:true,waitForBosses:true},
  1501: {chapter:'04 火力突破',stopCount:false,stopEnemyPush:true,item:[hp_1]},
  1520: {item:[TrebleBullet,GreenPoint]},
  1640: {enemy:[Zark0,Zark1,Fort0],enemyPolling:[28,75],enemyQuantity:1,stopEnemyPush:false},
  1920: {enemy:[Zark1,Fort0],enemyPolling:[20,65]},
  2040: {chapter:'05 求生獵手',enemy:[],stopEnemyPush:true,item:[hp_1]},
  2200: {chapter:'05 求生獵手 · 單體決戰',clearField:true,boss:[GOZILLA],enemy:[],stopCount:true,stopEnemyPush:true,waitForBosses:true},
  2201: {chapter:'06 回收與喘息',stopCount:false,stopEnemyPush:true,enemy:[],item:[hp_1]},
  2360: {item:[hp_1]},
  2680: {chapter:'07 重返航線',enemy:[Zark0],enemyPolling:[45,100],enemyQuantity:1,stopEnemyPush:false},
  3000: {enemy:[Zark0,Fort0],enemyPolling:[30,85]},
  3280: {chapter:'08 突破封鎖',enemy:[Zark1,Fort0,turret],enemyPolling:[25,70],enemyQuantity:1},
  3760: {enemy:[Zark1,Fort0,turret],enemyPolling:[20,60],item:[hp_1]},
  4080: {chapter:'09 雙環反擊',enemy:[],stopEnemyPush:true,item:[hp_1]},
  4240: {chapter:'09 雙環反擊',clearField:true,boss:[{...circleKiller,life:40},{...circleKiller2,life:40}],enemy:[Zark0,Fort0],enemyQuantity:1,enemyPolling:[65,100],stopCount:true,stopEnemyPush:false,waitForBosses:true},
  4241: {chapter:'10 戰後整備',enemy:[],stopCount:false,stopEnemyPush:true,item:[hp_1]},
  4400: {item:[hp_1]},
  4560: {chapter:'11 巨獸前線',enemy:[Zark1,Fort0],enemyPolling:[25,70],enemyQuantity:1,stopEnemyPush:false},
  5040: {chapter:'12 雙獸壓境',enemy:[],stopEnemyPush:true,item:[hp_1]},
  5280: {chapter:'12 雙獸壓境 · 舊哥吉拉聯手',clearField:true,boss:[OLD_GOZILLA,OLD_GOZILLA2],stopCount:true,stopEnemyPush:true,waitForBosses:true},
  5281: {chapter:'13 返航整備',enemy:[],stopCount:false,stopEnemyPush:true,item:[hp_1]},
  5440: {item:[hp_1]},
  5600: {chapter:'14 無盡航行',enemy:[Zark1,Fort0,turret],enemyPolling:[18,60],enemyQuantity:1,stopEnemyPush:false},
  6240: {enemyPolling:[15,50]},
  6600: {item:[hp_1]},
  7040: {enemyPolling:[10,40]},
};

//export
export default function (renCount, ruleObj, nextPolling) {
  var rule = script[renCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    });
    //console.log('script : ',ruleObj,'nextPolling : ',nextPolling);
  }
}
