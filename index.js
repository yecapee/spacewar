import './main.css';
import lookPath from './js/lookPath';
import movePathList from './js/movePathList';
import script from './js/script';
import createEnemy from './js/createEnemy';
import createShip from './js/createShip';
import createItem from './js/createItem';
import { animation } from './js/aniEffectMethod';
import { positionToXY } from './js/positionMethod';
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
} from './js/config';

var renCount = 0;
var nextPolling = 1;
var killCount = 0;
var bgCount = 0;
var shotFn;
var ruleObj = {};

var keyType = {
  UP: false,
  RIGHT: false,
  DOWN: false,
  LEFT: false,
  SPACE: false
}

function keyCodeMap(keycode, type) {
  var map = {
    38: function () {
      if (type == 'keydown') keyType.UP = true;
      if (type == 'keyup') keyType.UP = false;
    },
    39: function () {
      if (type == 'keydown') keyType.RIGHT = true;
      if (type == 'keyup') keyType.RIGHT = false;
    },
    40: function () {
      if (type == 'keydown') keyType.DOWN = true;
      if (type == 'keyup') keyType.DOWN = false;
    },
    37: function () {
      if (type == 'keydown') keyType.LEFT = true;
      if (type == 'keyup') keyType.LEFT = false;
    },
    32: function () {
      if (type == 'keydown') {
        keyType.SPACE = true;
        ship.shot();
      }
      if (type == 'keyup') keyType.SPACE = false;
    }
  };

  if (map[keycode]) {
    map[keycode]();
  }
}

function actionMove(ship) {
  var action = {
    UP: function () {
      var ps = ship.position;
      ship.position = (ps - w > -1) ? ps - w : ps;
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
      var nowY = Math.round((ps - ps % w) / w);
      if (ps + w < w * h) {
        ship.position = (nowY < h) ? ps + w : ps;
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
    }
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
    }, 1000 / ship.shotFps);
  }
}

function closeShot() {
  clearInterval(shotFn);
  shotFn = null;
}

function bulletPosition(shipPs) {
  var enemyBulleArr = renderData.enemyBullet;
  for (var key in enemyBulleArr) {
    enemyBulleArr[key].data = enemyBulleArr[key].fn(shipPs);
    if (enemyBulleArr[key].data.clear) {
      enemyBulleArr.splice(key, 1);
    };
  }
  //console.log(enemyBulleArr);
}

var ship = new createShip({
  name: 'MK-2',
  life: shipLife,
  position: w * Math.floor(h / 2) - Math.floor(w / 2),
  deadPosition: w * Math.floor(h / 2) - Math.floor(w / 2),
  look: 'MK-2',
  deadCb: function (ship) {
    killCount = 0;
    renCount = 0;
    nextPolling = 100;
  }
});

function gaphic(TYPE) {
  var bestScore = localStorage.getItem('bestScore') || 0;
  var bestMileage = localStorage.getItem('bestMileage') || 0;

  script(renCount, ruleObj);
  if (TYPE === 'OBJ_MOVE') {
    var createObj = false;
    var item = ruleObj.item;

    if (renCount == nextPolling) {
      for (var x = 0; x < ruleObj.enemyQuantity; x++) {
        var enemyObj = ruleObj.enemy[(renCount % ruleObj.enemy.length)];
        enemyObj.position = Math.floor(Math.random() * w);
        enemyObj.deadCb = function () {
          killCount++;
          if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
        };
        renderData.enemy.push(new createEnemy(enemyObj));
      }
      nextPolling = renCount + Math.floor(Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]);
    }

    if(item){
      item.forEach(function(itemData){
        itemData.position = Math.floor(Math.random() * w);
        renderData.item.push(new createItem(itemData));  
      });
      ruleObj.item = null;
    }

    bgCount++;
    renCount++;
    if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
  }

  if (TYPE === 'BULLET_MOVE') {
    bulletPosition(ship.position);
  }

  //canvas
  var viewDom = document.getElementById('view').getContext('2d');
  viewDom.clearRect(0, 0, vwidth, vheight);

  // ship
  ship.grapic(viewDom);

  //enmyBullet
  renderData.enemyBullet.map(function (bullt) {
    var bulletObj = positionToXY(bullt.data.position);
    //viewDom.drawImage(enemyImg, bulletObj.x - 15 / 2, bulletObj.y - 5, 15, 15);
    var enemyImg = document.getElementById(bullt.data.look);
    viewDom.drawImage(enemyImg, bullt.data.x - 15 / 2, bullt.data.y - 5, bullt.data.w, bullt.data.h);
  })

  // enmy
  renderData.enemy.forEach(function (obj) {
    obj.action(TYPE, viewDom, ship.position);
  })

  // item
  renderData.item.forEach(function (obj) {
    obj.action(TYPE, viewDom, ship.position);
  })

  // effect
  renderData.aniEffect.forEach(function (el) {
    el(viewDom);
  })

  //bg
  document.getElementById('view').style.backgroundPositionY = bgCount + 'px';

  document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount +
    '</div><br/> Mileage: ' + renCount +
    '<br/>Best score: ' + (localStorage.getItem('bestScore') || 0) +
    '<br/> Best Mileage: ' + bestMileage +
    '<br/> Life: ' + ship.life +'/'+ ship.maxLife;

  document.getElementById('life').style.width = (100 / ship.maxLife * ship.life) + '%';

}

function render(TYPE) {
  gaphic(TYPE);
}

document.addEventListener('keydown', function (e) {
  keyCodeMap(e.keyCode, 'keydown');
}, false);
document.addEventListener('keyup', function (e) {
  keyCodeMap(e.keyCode, 'keyup');
}, false);

document.addEventListener('touchstart', touchAction, false);
document.addEventListener('touchmove', touchAction, false);
document.addEventListener('touchend', closeShot, false);

function touchAction(event) {
  var event = event || window.event;
  event.preventDefault();
  if (event.touches[0]) {
    var x = Math.floor(event.touches[0].pageX / pixelWeigth);
    var y = Math.floor(event.touches[0].pageY / pixelWeigth);
    var _ps = (w * y + x);
    ship.position = _ps;
    shotDriver();
    //document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
  }
}

document.getElementById('view').height = vheight;
document.getElementById('view').width = vwidth;

setInterval(function () {
  render('OBJ_MOVE')
  //
  render('CONTROL_MOVE');
  !atc.isMobile() && actionMove(ship);
  //
  render('BULLET_MOVE');
}, renderTime);


// setInterval(function () {
//   render('CONTROL_MOVE');
//   !atc.isMobile() && actionMove(ship);
// }, controlTime);


// setInterval(function () {
//   render('BULLET_MOVE');
// }, bulletTime);

//todo *做了 -不做了

//*敵機死亡效果
//-分開敵人及主角機的lookPath
//-組成像素可縮小
//*敵機子彈種類多元

//*主角機有血量
//-主角機階段進化
//*主角機物件化？

//*子彈發射時間間隔可調整
//*子彈發射時間pc與mobile驅動方式一致

//*加入背景

//*射擊效果
//*增強道具
//*主角機可切換子彈
//*出彈頻率應該綁在SHIP物件
// 來一點速度感的特效

// BOSS設計
//*關卡設計