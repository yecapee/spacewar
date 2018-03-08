import lookPath from './js/lookPath';
import movePathList from './js/movePathList';
import createEnemy from './js/createEnemy';
import createShip from './js/createShip';
import { animation } from './js/aniEffectMethod';
import { positionToXY } from './js/positionMethod';
import {
  pixelWeigth,
  w,
  h,
  objQuantity,
  objPolling,
  renderTime,
  bulletTime,
  moveTime,
  renderData,
} from './js/config';

var renCount = 0;
var nextPolling = 1;
var killCount = 0;
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
      if (type == 'keydown') keyType.SPACE = true;
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
      //renderData.position = (ps - w > -1) ? ps - w : ps;
      ship.position = (ps - w > -1) ? ps - w : ps;
    },
    RIGHT: function () {
      var ps = ship.position;
      if (ps + 1 <= w * h - 1) {
        if ((ps + 1) % w !== 0) {
          //renderData.position = ps + 1;
          ship.position = ps + 1;
        }
      }
    },
    DOWN: function () {
      var ps = ship.position;
      var nowY = Math.round((ps - ps % w) / w);
      if (ps + w < w * h) {
        //renderData.position = (nowY < h) ? ps + w : ps;
        ship.position = (nowY < h) ? ps + w : ps;
      }
    },
    LEFT: function () {
      var ps = ship.position;
      if (ps - 1 > -1) {
        if (ps % w !== 0) {
          //renderData.position = ps - 1;
          ship.position = ps - 1;
        }
      }
    },
    SPACE: function () {
      ship.shot();
      //shot();
    }
  };
  for (var key in keyType) {
    if (keyType[key] == true) action[key]();
    document.getElementById('debug').innerHTML = JSON.stringify(positionToXY(renderData.position), null, 2);
  }
}

// function shot() {
//   var bulletArr = renderData.bullet;
//   if (!bulletArr.includes(renderData.position - w)) bulletArr.push(renderData.position - w);
// }

function bulletPosition() {
  // var bulletArr = renderData.bullet;
  var enemyBulleArr = renderData.enemyBullet;
  // for (var key in bulletArr) {
  //   bulletArr[key] = bulletArr[key] - w;
  //   if (bulletArr[key] < 0) {
  //     bulletArr.splice(key, 1);
  //   };
  // }
  for (var key in enemyBulleArr) {
    enemyBulleArr[key] = enemyBulleArr[key] + w;
    if (enemyBulleArr[key] > w * h + 1) {
      enemyBulleArr.splice(key, 1);
    };
  }
}

function gaphicShip(data) {
  // var color = hit ? 'red' : 'white';
  var viewDom = data.viewDom;
  lookPath[data.lookType](data.position).forEach(function (ps, index) {
    var psObj = positionToXY(ps);
    viewDom.beginPath();
    viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth + 1);
    viewDom.fillStyle = 'white';
    viewDom.fill();
  });
}

var mkII = new createShip({
  name: 'MK-2',
  life: 5,
  position: w * Math.floor(h / 2) - Math.floor(w / 2),
  deadPosition: w * Math.floor(h / 2) - Math.floor(w / 2),
  look: 'MK-2',
  deadCb: function () {
    killCount = 0;
    // killCount++;
    // if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
  }
});

function gaphic(TYPE) {
  var bestScore = localStorage.getItem('bestScore') || 0;
  var bestMileage = localStorage.getItem('bestMileage') || 0;
  var shipLookType = 'MK-2';

  if (TYPE === 'OBJ_MOVE') {
    var createObj = false;
    if (renCount == nextPolling) {
      for (var x = 0; x < objQuantity; x++) {
        var zark = new createEnemy({
          name: 'ZARK-ZERO',
          life: 3,
          position: Math.floor(Math.random() * w),
          shot: true,
          shotTime: 3,
          movePath: 'gostMove',
          moveTime: 5,
          look: 'zark',
          deadCb: function () {
            killCount++;
            if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
          }
        });
        renderData.enemy.push(zark);
      }
      nextPolling = renCount + Math.floor(Math.random() * objPolling[1] + objPolling[0]);
    }

    renCount++;
    if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
  }

  if (TYPE === 'CONTROL_MOVE') {
    bulletPosition();
  }

  //canvas
  var viewDom = document.getElementById('view').getContext('2d');
  viewDom.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // effect
  renderData.aniEffect.forEach(function (el) {
    el(viewDom);
  })

  // ship
  mkII.grapic(viewDom);

  //enmyBullet
  var enemyImg = document.getElementById("enemyImg");
  renderData.enemyBullet.map(function (ps) {
    var bulletObj = positionToXY(ps);
    viewDom.drawImage(enemyImg, bulletObj.x - 15 / 2, bulletObj.y - 5, 15, 15);
  })

  // enmy
  renderData.enemy.map(function (obj) {
    obj.action(TYPE, viewDom);
  })

  document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount +
    '</div><br/>Best score: ' + (localStorage.getItem('bestScore') || 0) +
    '<br/> Mileage: ' + renCount +
    '<br/> Best Mileage: ' + bestMileage +
    '<br/> Life: ' + mkII.life;

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

document.addEventListener('touchstart', touch, false);
document.addEventListener('touchmove', touch, false);
document.addEventListener('touchend', touch, false);

function touch(event) {
  var event = event || window.event;
  event.preventDefault();
  var x = Math.floor(event.touches[0].pageX / pixelWeigth);
  var y = Math.floor(event.touches[0].pageY / pixelWeigth);
  var _ps = (w * y + x);
  mkII.position = _ps;
  mkII.shot();
  document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
}

document.getElementById('view').height = window.innerHeight;
document.getElementById('view').width = window.innerWidth;
setInterval(function () {
  render('OBJ_MOVE')
}, renderTime);
setInterval(function () {
  render('CONTROL_MOVE')
  actionMove(mkII);
}, bulletTime);


//todo

//* 敵機死亡效果
//分開敵人及主角機的lookPath
//組成像素可縮小
//子彈種類多元


//*主角機有血量
//主角機階段進化
//*主角機物件化？