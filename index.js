import lookPath from './js/lookPath';
import{
  moveFps,
  bulletFps,
  pixelWeigth,
  w,
  h,
  objQuantity,
  objPolling,
  renCount,
  renderTime,
  bulletTime,
  moveTime,
} from './js/config';

(function () {
  var renCount = 0;
  var nextPolling = 1;
  var killCount = 0;
  var renderData = {
    position: null,
    renderTemp: {},
    bullet: [],
    preState: {},
    enemy: [],
    enemyBullet: [],
  };

  var keyType = {
    UP: false,
    RIGHT: false,
    DOWN: false,
    LEFT: false,
    SPACE: false
  };

  var movePathList = {
    goStop: function () {
      var me = this;
      if (this.getST() < 6) this.position += w;
      if (this.getST() > 80) this.position += w;
      if (this.position > w * h - 1) {
        renderData.enemy.find(function (el, index) {
          if (el === me) renderData.enemy.splice(index, 1);
        })
      };
    },
    gostMove: function () {
      var me = this;
      var thisY = Math.floor(this.position / h);
      var r = h / 4;
      var nowY = Math.floor(this.mainX / w);
      var margin = Math.sin(Math.PI / r * nowY);
      var xMargin = Math.floor(margin * r);
      //console.log(nowY, margin);
      this.position = positionLimit.call(this, this.mainX + xMargin);


      if (this.position > w * h - 1) {
        renderData.enemy.find(function (el, index) {
          if (el === me) renderData.enemy.splice(index, 1);
        })
      };
    },
    goToOut: function () {
      this.position += w;
      var me = this;
      if (this.position > w * h - 1) {
        renderData.enemy.find(function (el, index) {
          if (el === me) renderData.enemy.splice(index, 1);
        })
      };
    },
  };

  function createEnemy(obj) {
    this.name = obj.name; //名字
    this.life = obj.life; //生命值
    this.mainX = obj.position;
    this.position = obj.position; //位置
    this.shot = obj.shot; //會不會發射子彈
    this.shotTime = obj.shotTime; //連發數
    this.movePath = obj.movePath; //移動的路徑類型
    this.moveTime = obj.moveTime || 1; // 移動間隔
    this.look = obj.look;

    var hit = false;
    var survivalTime = 0;
    var hitPath = lookPath[this.look](this.position).map(function () {
      return true;
    });

    this.getST = function () {
      return survivalTime;
    };
    this.wasHit = function (bulletPs, viewDom, cb) {
      var me = this;
      if (lookPath[this.look](this.position).includes(bulletPs)) {
        hitPath[lookPath[this.look](this.position).indexOf(bulletPs)] = false;
        hit = true;
        this.life--;
        if (this.life < 1) {
          renderData.enemy.find(function (el, index) {
            if (el === me) {
              var bestScore = localStorage.getItem('bestScore');
              renderData.enemy.splice(index, 1);
              killCount++;
              if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
            }
          })
        };
        this.grapic.call(this, viewDom);
        if (cb) cb();
      }
    };

    this.grapic = function (viewDom) {
      var color = hit ? 'red' : 'white';
      lookPath[this.look](this.position).forEach(function (ps, index) {
        if (hitPath[index]) {
          var psObj = positionToXY(ps);
          viewDom.beginPath();
          viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth);
          viewDom.fillStyle = color;
          viewDom.fill();
        }
      });
    };

    this.action = function (renderType, viewDom) {
      this.grapic.call(this, viewDom);
      if (renderType === 'OBJ_MOVE') {
        enemyMove.call(this);
        if (survivalTime % this.shotTime === 0) {
          if (this.shot) shotByEnemy(this.position);
        };
        survivalTime++;
        hit = false;
      }
    };
  }

  function enemyMove() {
    if (movePathList[this.movePath] && this.getST() % this.moveTime == 0) movePathList[this.movePath].call(this);
  };

  function positionLimit(nowPosition) {
    var leftlimt = this.mainX - (this.mainX % w);
    var rightlimt = leftlimt + w - 1;
    this.mainX += w;
    if (nowPosition > rightlimt) {
      return rightlimt;
    }
    if (nowPosition < leftlimt) {
      return leftlimt;
    }
    return nowPosition;
  };

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

  function actionMove() {
    var action = {
      UP: function () {
        var ps = renderData.position;
        renderData.position = (ps - w > -1) ? ps - w : ps;
      },
      RIGHT: function () {
        var ps = renderData.position;
        if (ps + 1 <= w * h - 1) {
          if ((ps + 1) % w !== 0) {
            renderData.position = ps + 1;
          }
        }
      },
      DOWN: function () {
        var ps = renderData.position;
        var nowY = Math.round((ps - ps % w) / w);
        if (ps + w < w * h) {
          renderData.position = (nowY < h) ? ps + w : ps;
        }
      },
      LEFT: function () {
        var ps = renderData.position;
        if (ps - 1 > -1) {
          if (ps % w !== 0) {
            renderData.position = ps - 1;
          }
        }
      },
      SPACE: function () {
        shot();
      }
    };
    for (var key in keyType) {
      if (keyType[key] == true) action[key]();
      document.getElementById('debug').innerHTML = JSON.stringify(positionToXY(renderData.position), null, 2);
    }
    render('PLAYER_MOVE');
  }

  function objPosition(isSet) {
    var objArr = renderData.object;
    var quantity = objQuantity;

    if (isSet) {
      for (var x = 0; x < quantity; x++) {
        objArr.push(Math.floor(Math.random() * w));
      }
    }

    for (var key in objArr) {
      var val = objArr[key];
      objArr[key] = objArr[key] + w;
    }

    for (var key in objArr) {
      if (objArr[key] > w * h - 1) {
        objArr.splice(key, 1);
      };
    }

  }

  function shot() {
    var bulletArr = renderData.bullet;
    if (!bulletArr.includes(renderData.position - w)) bulletArr.push(renderData.position - w);
    // if (!atc.isMobile()) synth.triggerAttackRelease('C4',0.1,0);
    // synth.triggerAttackRelease('C4', 0.2, 0);
  }

  function shotByEnemy(position) {
    var bulletArr = renderData.enemyBullet;
    if (!bulletArr.includes(position + w)) bulletArr.push(position + w);
  }

  function bulletPosition() {
    var bulletArr = renderData.bullet;
    var enemyBulleArr = renderData.enemyBullet;
    for (var key in bulletArr) {
      bulletArr[key] = bulletArr[key] - w;
      if (bulletArr[key] < 0) {
        bulletArr.splice(key, 1);
      };
    }
    for (var key in enemyBulleArr) {
      enemyBulleArr[key] = enemyBulleArr[key] + w;
      if (enemyBulleArr[key] > w * h + 1) {
        enemyBulleArr.splice(key, 1);
      };
    }
  }

  function delArr(arr, val) {
    for (var key in arr) {
      if (arr[key] == val) {
        arr.splice(key, 1);
      }
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
  };

  function gaphic(TYPE) {
    var bestScore = localStorage.getItem('bestScore') || 0;
    var bestMileage = localStorage.getItem('bestMileage') || 0;
    var shipLookType = 'MK-1';

    if (!renderData.position && renderData.position !== 0) {
      renderData.position = w * Math.floor(h / 2) - Math.floor(w / 2);
    }

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
          });
          renderData.enemy.push(zark);
        }
        nextPolling = renCount + Math.floor(Math.random() * objPolling[1] + objPolling[0]);
      }
      // document.getElementById('debug').innerHTML = nextPolling + ', ' + renCount;
      objPosition(createObj);
      renCount++;
      if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
    }

    if (TYPE === 'BULLET_MOVE') {
      bulletPosition();
    }

    //canvas
    var viewDom = document.getElementById('view').getContext('2d');
    viewDom.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // bullet
    var enemyBulleArr = renderData.enemyBullet;
    var bulletImg = document.getElementById("bulletImg");
    renderData.bullet.map(function (ps) {
      var bulletObj = positionToXY(ps);
      viewDom.drawImage(bulletImg, bulletObj.x - 13 / 2, bulletObj.y - 5, 13, 64);

      //defense
      // console.log(ps, enemyBulleArr);
      if (enemyBulleArr.includes(ps)) {
        enemyBulleArr.splice(enemyBulleArr.indexOf(ps), 1);
        renderData.bullet.splice(renderData.bullet.indexOf(ps), 1);
      }
      if (enemyBulleArr.includes(ps + w)) {
        enemyBulleArr.splice(enemyBulleArr.indexOf(ps + w), 1);
        renderData.bullet.splice(renderData.bullet.indexOf(ps), 1);
      }

      //kill enemy
      renderData.enemy.map(function (obj) {
        obj.wasHit(ps, viewDom, function () {
          renderData.bullet.splice(renderData.bullet.indexOf(ps), 1);
        });
        obj.wasHit(ps + w, viewDom, function () {
          renderData.bullet.splice(renderData.bullet.indexOf(ps), 1);
        });
      })
    })

    // ship
    gaphicShip({
      viewDom: viewDom,
      lookType: shipLookType,
      position: renderData.position,
    });

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
      '<br/> Best Mileage: ' + bestMileage;

    var dead = false;
    if (isDead(renderData.position, shipLookType)) {
      renCount = 0;
      nextPolling = 20;
      renderData.renderTemp = {};
      killCount = 0;
      dead = true;
      console.log('dead');
    }

  }

  function isDead(point, shipLookType) {
    var rs = false;
    renderData.enemyBullet.forEach(function (ps) {
      if (lookPath[shipLookType](point).includes(ps)) rs = true;
    })
    renderData.enemy.map(function (enemy) {
      if (lookPath[shipLookType](point).includes(enemy.position)) rs = true;
    })
    return rs;
  }

  function render(TYPE) {
    gaphic(TYPE);
  }

  function positionToXY(ps) {
    var x = ps % w;
    var y = Math.round((ps - x) / w);
    return {
      ps: ps,
      x: x * pixelWeigth + pixelWeigth / 2,
      //y: Math.round(y / h) * pixelWeigth,
      // y: Math.round(y / h) * window.innerHeight / h,
      y: y * window.innerHeight / h,
      __x: x,
      __y: y,
      limit: w * h - 1,
    };
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
    renderData.position = _ps;
    shot();
    document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
  }

  document.getElementById('view').height = window.innerHeight;
  document.getElementById('view').width = window.innerWidth;
  setInterval(function () {
    render('OBJ_MOVE')
  }, renderTime);
  setInterval(function () {
    render('BULLET_MOVE')
    actionMove()
  }, bulletTime);

})();
