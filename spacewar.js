(function () {
  var w = 25;
  var h = 25;
  var objQuantity = 1;
  var objPolling = [1, 4];
  var renCount = 0;
  var renderTime = 500;
  var bulletTime = 200;
  var moveTime = 100;
  var nextPoling = 1;
  var killCount = 0;

  var randerData = {
    position: null,
    object: [],
    bullet: [],
  };

  var keyType = {
    UP: false,
    RIGHT: false,
    DOWN: false,
    LEFT: false,
    SPACE: false
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

    if (map[keycode]) map[keycode]();
    // return map[keycode] || function () { };
  }

  function actionMove() {
    var ps = randerData.position;
    var action = {
      UP: function () {
        randerData.position = (ps - w > -1) ? ps - w : ps;
      },
      RIGHT: function () {
        if (ps + 1 <= w * h - 1) {
          if ((ps + 1) % w !== 0) {
            randerData.position = ps + 1;
          }
        }
      },
      DOWN: function () {
        randerData.position = (ps + w <= w * h - 1) ? ps + w : ps;
      },
      LEFT: function () {
        if (ps - 1 > -1) {
          if (ps % w !== 0) {
            randerData.position = ps - 1;
          }
        }
      },
      SPACE: function () {
        shot(true);
      }
    };
    for (var key in keyType) {
      if (keyType[key] == true) action[key]();
    }
    render('PLAYER_MOVE');
  }

  function objPosition(isSet) {
    var objArr = randerData.object;
    var quantity = objQuantity;
    if (isSet) {
      for (var x = 0; x < quantity; x++) {
        objArr.push(Math.floor(Math.random() * w));
      }
    }

    for (var key in objArr) {
      objArr[key] = objArr[key] + w;
      if (objArr[key] > w * h - 1) {
        objArr.splice(key, 1);
      };
    }

    // console.log(randerData.object);
  }

  function shot() {
    var bulletArr = randerData.bullet;
    bulletArr.push(randerData.position - w);
  }

  function bulletPosition() {
    var bulletArr = randerData.bullet;
    for (var key in bulletArr) {
      bulletArr[key] = bulletArr[key] - w;
      if (bulletArr[key] < 0) {
        bulletArr.splice(key, 1);
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
    var ww = Math.floor(100 / _w).toString() + '%';
    var hh = Math.floor(100 / _h).toString() + '%';
    var rsPixel = '';

    if (!randerData.position) {
      randerData.position = w * Math.floor(h / 2) - Math.floor(w / 2);
    }

    if (TYPE === 'OBJ_MOVE') {
      if (renCount % nextPoling == 0) {
        nextPoling = Math.floor(Math.random() * objPolling[1] + objPolling[0])
      }
      objPosition(renCount % nextPoling == 0);
      renCount++;
    }

    if (TYPE === 'BULLET_MOVE') {
      bulletPosition();
    }

    var pointCount = 0;
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < h; y++) {
        var bullet = (randerData.bullet.includes(pointCount)) ? ' bullet' : '';
        var obj = (randerData.object.includes(pointCount)) ? ' obj' : '';

        if (randerData.bullet.includes(pointCount) && randerData.object.includes(pointCount)) {
          delArr(randerData.bullet, pointCount);
          delArr(randerData.object, pointCount);
          killCount++;
        } else if (randerData.bullet.includes(pointCount) && randerData.object.includes(pointCount + w)) {
          delArr(randerData.bullet, pointCount);
          delArr(randerData.object, pointCount + w);
          killCount++;
        }

        document.getElementById('score').innerHTML = 'Score: ' + killCount;
        var point = (pointCount == randerData.position) ? 'point' : '';
        rsPixel += '<div class="pixel ' + point + obj + bullet + '" style=\'width:' + ww + ';height:' + hh + '\'></div>';
        pointCount += 1;
      }
    }
    return rsPixel;
  }

  function render(TYPE) {
    var template = gaphic(TYPE);
    document.getElementById('view').innerHTML = template;
  }

  function getScope(nowPosition) {
    var ps = randerData.position;
    return {
      left: nowPosition - (ps % nowPosition),
      right: nowPosition - (ps % nowPosition) + (w - 1)
    }
  }

  document.addEventListener('keydown', function (e) {
    keyCodeMap(e.keyCode, 'keydown');
  }, false);

  document.addEventListener('keyup', function (e) {
    keyCodeMap(e.keyCode, 'keyup');
  }, false);

  window.addEventListener('deviceorientation', function (event) {
    var triggerDeg = 0;
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = Math.floor(event.gamma / 3);
    var ps = randerData.position;
    document.getElementById('debug').innerHTML = 'v0.0.5 alpha:' + alpha + ' ,beta:' + beta + ' ,gamma:' + gamma;

    // if (beta < -triggerDeg) {
    //   randerData.position = (ps - w > -1) ? ps - w : ps;
    // };

    // if (beta > triggerDeg) {
    //   randerData.position = (ps + w <= w * h - 1) ? ps + w : ps;
    // };

    //randerData.position = ps + gamma;
    if (gamma < -triggerDeg) {
      keyType.LEFT = true;
      keyType.RIGHT = false;
    };

    if (gamma > triggerDeg) {
      keyType.RIGHT = true;
      keyType.LEFT = false;
    };

    render('PLAYER_MOVE');
  }, false);

  setInterval(function () { render('OBJ_MOVE') }, renderTime);
  setInterval(function () { render('BULLET_MOVE') }, bulletTime);
  setInterval(function () { actionMove() }, moveTime);

  // setInterval(bulletRender, bulletTime);
})();