(function () {
  var atc = {
    isMobile: function () {
      var e = !1;
      return function (n) {
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0, 4))) && (e = !0)
      }(navigator.userAgent || navigator.vendor || window.opera), e
    }
  };
  var pixelWeigth = atc.isMobile() ? 40 : 30;
  var w = Math.floor(window.innerWidth / pixelWeigth);
  var h = Math.floor(window.innerHeight / pixelWeigth);
  var objQuantity = 1;
  var objPolling = [80, 400];
  var renCount = 0;
  var renderTime = 1000;
  var bulletTime = 1000;
  //var moveTime = atc.isMobile() ? 30 : 80;
  var moveTime = 1000 / 30;
  var nextPolling = 1;
  var killCount = 0;
  // var synth = new Tone.AMSynth().toMaster();

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

  var renderData = {
    position: null,
    renderTemp: {},
    // object: [],
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

  function createEnemy(obj) {
    this.name = obj.name; //名字
    this.life = obj.life; //生命值
    this.mainX = obj.position;
    this.position = obj.position; //位置
    this.shot = obj.shot; //會不會發射子彈
    this.shotTime = obj.shotTime; //連發數
    this.movePath = obj.movePath; //移動的路徑類型
    this.moveTime = obj.moveTime || 1; // 移動間隔

    var survivalTime = 0;
    this.getST = function () {
      return survivalTime;
    };
    this.wasHit = function () {
      var me = this;
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
    }
    this.action = function () {
      enemyMove.call(this);
      if (survivalTime % this.shotTime === 0) {
        if (this.shot) shotByEnemy(this.position);
      };
      survivalTime++;
    }
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
        renderData.position = (ps + w <= w * h - 1) ? ps + w : ps;
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
    }
    render('PLAYER_MOVE');
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

  function burst(time) {
    shot();
    if (time > 0) {
      setTimeout(function () {
        burst(time - 1);
      }, 100);
    }
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

  function gaphic(TYPE) {
    var _w = w;
    var _h = h;
    var ww = 100 / _w.toString() + '%';
    var hh = Math.floor(100 / _h).toString() + '%';
    var rsPixel = '';
    var bestScore = localStorage.getItem('bestScore') || 0;
    var bestMileage = localStorage.getItem('bestMileage') || 0;
    var enemyList = {};

    for (var key in renderData.enemy) {
      var thisEnemy = renderData.enemy[key];
      enemyList[thisEnemy.position] = thisEnemy;
      if (TYPE === 'OBJ_MOVE') thisEnemy.action();
    }

    if (!renderData.position && renderData.position !== 0) {
      renderData.position = w * Math.floor(h / 2) - Math.floor(w / 2);
    }

    if (TYPE === 'OBJ_MOVE') {
      if (renCount == nextPolling) {
        for (var x = 0; x < objQuantity; x++) {
          var zark = new createEnemy({
            name: 'zark',
            life: 3,
            position: Math.floor(Math.random() * w),
            shot: true,
            shotTime: 3,
            movePath: 'gostMove',
            moveTime: 5,
          });
          renderData.enemy.push(zark);
        }
        nextPolling = renCount + Math.floor(Math.random() * objPolling[1] + objPolling[0]);
        console.log(renCount, nextPolling);
      }
      renCount++;
      if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
    }

    if (TYPE === 'BULLET_MOVE') {
      bulletPosition();
    }

    var pointCount = 0;


    for (var x = 0; x < w; x++) {
      for (var y = 0; y < h; y++) {
        var bullet = renderData.bullet.includes(pointCount);
        var enemyBullet = renderData.enemyBullet.includes(pointCount);
        var enemy = false;

        if (enemyList[pointCount]) {
          var thisEnemy = enemyList[pointCount];
          enemy = true;
          if (renderData.bullet.includes(thisEnemy.position) && (TYPE == 'BULLET_MOVE')) {
            delArr(renderData.bullet, pointCount);
            thisEnemy.wasHit();
          } else if (renderData.bullet.includes(thisEnemy.position + w) && (TYPE == 'BULLET_MOVE')) {
            delArr(renderData.bullet, pointCount);
            thisEnemy.wasHit();
          }
        }

        // isBossCome();
        document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount +
          '</div><br/>Best score: ' + (localStorage.getItem('bestScore') || 0) +
          '<br/> Mileage: ' + renCount +
          '<br/> Best Mileage: ' + bestMileage;

        var point = (pointCount === renderData.position);
        var dead = false;
        if (isDead(renderData.position, enemyList)) {
          renCount = 0;
          nextPolling = 20;
          renderData.renderTemp = {};
          killCount = 0;
          dead = true;
        }

        if (renderData.preState['pixel_' + pointCount]) {
          document.getElementById('pixel_' + pointCount).classList.remove("point");
          document.getElementById('pixel_' + pointCount).classList.remove("enemy");
          document.getElementById('pixel_' + pointCount).classList.remove("bullet");
          document.getElementById('pixel_' + pointCount).classList.remove("dead");
          document.getElementById('pixel_' + pointCount).classList.remove("enemyBullet");
          delete renderData.preState['pixel_' + pointCount];
        };

        if (document.getElementById('pixel_' + pointCount)) {
          if (point) document.getElementById('pixel_' + pointCount).classList.add("point");
          if (enemy) document.getElementById('pixel_' + pointCount).classList.add("enemy");
          if (bullet) document.getElementById('pixel_' + pointCount).classList.add("bullet");
          if (dead) document.getElementById('pixel_' + pointCount).classList.add("dead");
          if (enemyBullet) document.getElementById('pixel_' + pointCount).classList.add("enemyBullet");
        }

        if (point || enemy || bullet || dead || enemyBullet) renderData.preState['pixel_' + pointCount] = true;
        if (enemy && bullet) console.log('hit');
        if (firstRen()) {
          rsPixel += '<div id="pixel_' + pointCount + '" class="pixel" style=\'width:' + ww + ';height:' + hh + '\'></div>';
        }
        pointCount += 1;
      }
    }
    if (renderData.renderTemp[renCount]) {
      renderData.renderTemp[renCount]();
      delete renderData.renderTemp[renCount];
    }

    // console.log(renderData.enemy.length);
    firstRen(rsPixel);
  }

  function firstRen(rsPixel) {
    if (rsPixel) {
      document.getElementById('view').innerHTML = rsPixel;
      firstRen = function () { return false };
    }
    return true;
  }

  function isDead(point, enemyList) {
    if (renderData.enemyBullet.includes(point)) return true;
    if (enemyList[point]) return true;
    // if (renderData.object.includes(point + w + 1)) return true;
    // if (renderData.object.includes(point + w - 1)) return true;
    return false;
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
    renderData.position = _ps;
    shot();
    document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
  }

  // setInterval(function () { render('OBJ_MOVE') }, renderTime);
  // setInterval(function () { render('BULLET_MOVE') }, bulletTime);
  // setInterval(function () { actionMove() }, moveTime);


  setInterval(function () {
    render('OBJ_MOVE')
    render('BULLET_MOVE')
    actionMove()
  }, 1000 / 24);
})();


