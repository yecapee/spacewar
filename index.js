import "./main.css";
import lookPath from "./js/lookPath";
import movePathList from "./js/movePathList";
import script from "./js/script";
import createEnemy from "./js/createEnemy";
import createShip from "./js/createShip";
import createItem from "./js/createItem";
// import music from './js/bgmusic';
import { animation } from "./js/aniEffectMethod";
import { positionToXY, ezPositionWithCheckScope } from "./js/positionMethod";
import {
  atc,
  pixelWeigth,
  w,
  h,
  renderTime,
  bulletTime,
  moveTime,
  renderData,
  controlTime,
  vwidth,
  vheight,
  shipLife,
} from "./js/config";

var renCount = 0;
var nextPolling = 1;
var killCount = 0;
var bgCount = 0;
var shotFn;
var ruleObj = {};
var scriptMileage = renCount;

var keyType = {
  UP: false,
  RIGHT: false,
  DOWN: false,
  LEFT: false,
  SPACE: false,
};

function keyCodeMap(keycode, type) {
  var map = {
    38: function () {
      if (type == "keydown") keyType.UP = true;
      if (type == "keyup") keyType.UP = false;
    },
    39: function () {
      if (type == "keydown") keyType.RIGHT = true;
      if (type == "keyup") keyType.RIGHT = false;
    },
    40: function () {
      if (type == "keydown") keyType.DOWN = true;
      if (type == "keyup") keyType.DOWN = false;
    },
    37: function () {
      if (type == "keydown") keyType.LEFT = true;
      if (type == "keyup") keyType.LEFT = false;
    },
    32: function () {
      if (type == "keydown") {
        keyType.SPACE = true;
        ship.shot();
      }
      if (type == "keyup") keyType.SPACE = false;
    },
  };

  if (map[keycode]) {
    map[keycode]();
  } else if (type === "keydown") {
    ship.skill(keycode);
  }
}

function actionMove(ship) {
  var action = {
    UP: function () {
      var ps = ship.position;
      ship.position = ps - w > -1 ? ps - w : ps;
    },
    RIGHT: function () {
      var ps = ship.position;
      if (ps + 1 <= w * h - 1) {
        if ((ps + 1) % w !== 0) {
          ship.position = ps + 1;
        }
      }
    },
    DOWN: function () {
      var ps = ship.position;
      var nowY = Math.round((ps - (ps % w)) / w);
      if (ps + w < w * h) {
        ship.position = nowY < h ? ps + w : ps;
      }
    },
    LEFT: function () {
      var ps = ship.position;
      if (ps - 1 > -1) {
        if (ps % w !== 0) {
          ship.position = ps - 1;
        }
      }
    },
    SPACE: function () {
      shotDriver();
    },
  };
  for (var key in keyType) {
    if (keyType[key] == true) action[key]();
  }
  if (!keyType.SPACE) closeShot();
}

function shotDriver() {
  if (!shotFn) {
    shotFn = setInterval(function () {
      ship.shot();
      ship.lookType = "OPEN";
    }, 1000 / ship.shotFps);
  }
}

function closeShot() {
  clearInterval(shotFn);
  ship.lookType = "CLOSE";
  shotFn = null;
}

function bulletPosition(shipPs) {
  var enemyBulleArr = renderData.enemyBullet;
  for (var key = enemyBulleArr.length - 1; key >= 0; key--) {
    enemyBulleArr[key].data = enemyBulleArr[key].fn(shipPs);
    if (enemyBulleArr[key].data.clear) {
      enemyBulleArr.splice(key, 1);
    }
  }
}

function clearRenderData() {
  renderData.enemy.length = 0;
  renderData.enemyBullet.length = 0;
  renderData.item.length = 0;
  renderData.skills.length = 0;
  renderData.shipSkills.length = 0;
  ruleObj = {};

  //console.log(renderData);
}

var ship = new createShip({
  name: "CrystalShip",
  life: shipLife,
  position: w * Math.floor(h / 2) - Math.floor(w / 2),
  deadPosition: w * Math.floor(h / 2) - Math.floor(w / 2),
  look: "crystal",
  skills: [
    {
      skillKey: 65,
      type: "atomicExplosionCanKill",
      launchTime: [250, 120, 6],
      skillPoint: function (ps) {
        var xy = ezPositionWithCheckScope(ps);
        var point = [[0, 0]];
        var rs = point.map(function (_xy) {
          return xy(_xy[0], _xy[1]);
        });
        return rs;
      },
    },
    {
      skillKey: 83,
      type: "atomicExplosion",
      launchTime: [250, 120, 6],
      skillPoint: function (ps) {
        var xy = ezPositionWithCheckScope(ps);
        var point = [[0, 0]];
        var rs = point.map(function (_xy) {
          return xy(_xy[0], _xy[1]);
        });
        return rs;
      },
    },
  ],
  deadCb: function (ship) {
    killCount = 0;
    renCount = 0;
    scriptMileage = 0;
    nextPolling = 100;
    clearRenderData();
  },
});

function gaphic(TYPE) {
  var bestScore = localStorage.getItem("bestScore") || 0;
  var bestMileage = localStorage.getItem("bestMileage") || 0;
  script(scriptMileage, ruleObj, nextPolling);
  var { stopCount, stopEnemyPush } = ruleObj;
  var boss = ruleObj.boss || [];
  if (TYPE === "OBJ_MOVE") {
    var createObj = false;
    var item = ruleObj.item;

    // enemy push
    if (renCount == nextPolling && !stopEnemyPush) {
      for (var x = 0; x < ruleObj.enemyQuantity; x++) {
        var enemyObj = ruleObj.enemy[renCount % ruleObj.enemy.length];
        if (enemyObj) {
          enemyObj.position = Math.floor(Math.random() * w);
          enemyObj.deadCb = function () {
            killCount++;
            if (bestScore < killCount)
              localStorage.setItem("bestScore", killCount);
          };
          renderData.enemy.push(new createEnemy(enemyObj));
        }
      }
      if (ruleObj.enemyPolling) {
        nextPolling =
          renCount +
          Math.floor(
            Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]
          );
      }
    }

    if (nextPolling < renCount && ruleObj.enemyPolling) {
      nextPolling =
        renCount +
        Math.floor(
          Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]
        );
    }

    // boss push
    if (boss.length > 0) {
      var defPosition = Math.floor(Math.random() * w);
      boss.forEach(function (enemyObj, index) {
        // console.log(enemyObj.position);
        enemyObj.deadCb = function () {
          killCount++;
          if (bestScore < killCount)
            localStorage.setItem("bestScore", killCount);
          scriptMileage++;
        };
        renderData.enemy.push(new createEnemy(enemyObj));
      });
      ruleObj.boss = [];
    }
    //

    if (item) {
      item.forEach(function (itemData) {
        itemData.position = Math.floor(Math.random() * w);
        renderData.item.push(new createItem(itemData));
      });
      ruleObj.item = null;
    }

    bgCount++;

    renCount++;
    !stopCount && scriptMileage++;

    if (bestMileage < scriptMileage)
      localStorage.setItem("bestMileage", scriptMileage);
  }

  bulletPosition(ship.position);

  //canvas
  var viewDom = document.getElementById("view").getContext("2d");
  viewDom.clearRect(0, 0, vwidth, vheight);

  // ship
  ship.grapic(viewDom);

  //enmyBullet
  renderData.enemyBullet.map(function (bullt) {
    var enemyImg = document.getElementById(bullt.data.look);
    viewDom.drawImage(
      enemyImg,
      bullt.data.x - 15 / 2,
      bullt.data.y - 5,
      bullt.data.w,
      bullt.data.h
    );
  });

  // enmy
  renderData.enemy.slice().forEach(function (obj) {
    obj.action(TYPE, viewDom, ship);
  });

  // skill
  renderData.skills.slice().forEach(function (skill) {
    if (skill(ship, viewDom)) {
      var index = renderData.skills.indexOf(skill);
      if (index !== -1) renderData.skills.splice(index, 1);
    }
  });

  // shipskill
  renderData.shipSkills.slice().forEach(function (skill) {
    if (skill(ship, viewDom)) {
      var index = renderData.shipSkills.indexOf(skill);
      if (index !== -1) renderData.shipSkills.splice(index, 1);
    }
  });

  // item
  renderData.item.slice().forEach(function (obj) {
    obj.action(TYPE, viewDom, ship.position);
  });

  // effect
  renderData.aniEffect.slice().forEach(function (el) {
    el(viewDom);
  });

  //bg
  document.getElementById("view").style.backgroundPositionY = bgCount + "px";

  document.getElementById("score").innerHTML =
    'Score: <div class="score">' +
    killCount +
    "</div><br/> Mileage: " +
    scriptMileage +
    "<br/>Best score: " +
    (localStorage.getItem("bestScore") || 0) +
    "<br/> Best Mileage: " +
    bestMileage +
    "<br/> Life: " +
    ship.life +
    "/" +
    ship.maxLife;

  document.getElementById("life").style.width =
    (100 / ship.maxLife) * ship.life + "%";
}

document.addEventListener(
  "keydown",
  function (e) {
    if (![32, 37, 38, 39, 40, 65, 83].includes(e.keyCode)) return;
    e.preventDefault();
    if (e.repeat) return;
    start();
    keyCodeMap(e.keyCode, "keydown");
  },
  false
);
document.addEventListener(
  "keyup",
  function (e) {
    keyCodeMap(e.keyCode, "keyup");
    if (e.keyCode === 32) closeShot();
  },
  false
);

document.getElementById("view").addEventListener("touchstart", touchAction, { passive: false });
document.getElementById("view").addEventListener("touchmove", touchAction, { passive: false });
document.addEventListener("touchend", closeShot, false);

function touchAction(event) {
  var event = event || window.event;
  event.preventDefault();
  if (event.touches[0]) {
    var rect = document.getElementById("view").getBoundingClientRect();
    var x = Math.max(0, Math.min(w - 1, Math.floor((event.touches[0].clientX - rect.left) / rect.width * w)));
    var y = Math.max(0, Math.min(h - 1, Math.floor((event.touches[0].clientY - rect.top) / rect.height * h)));
    var _ps = w * y + x;
    ship.position = _ps;
    shotDriver();
  }
}

document.getElementById("view").height = vheight;
document.getElementById("view").width = vwidth;

window.addEventListener("blur", function () {
  Object.keys(keyType).forEach((key) => keyType[key] = false);
  closeShot();
});
document.addEventListener("touchcancel", closeShot);

var preTimetamp = null;

function step(timestamp) {
  var progress;
  if (preTimetamp === null) preTimetamp = timestamp;
  progress = timestamp - preTimetamp;

  if (progress >= renderTime) {
    preTimetamp = timestamp;
    //animation
    !atc.isMobile() && actionMove(ship);
    gaphic("OBJ_MOVE");
    //
  }
  requestAnimationFrame(step);
}

//music
document.getElementById("ready").onclick = start;

function start() {
  document.getElementById("ready").style.zIndex = -1;
  requestAnimationFrame(step);
  // window._music();
  start = function () {};
}

window.r = renderData;

//todo

// 來一點速度感的特效
//*把敵人也改成可以用其他磚塊拼

// 加入盾牌道具
// 加入近戰道具
// 玩家特殊技
