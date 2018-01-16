(function () {
  var w = 25;
  var h = 25;
  var objQuantity = 1;
  var objPolling = [1, 4];
  var renCount = 0;
  var renderTime = 500;
  var bulletTime = 200;
  var nextPoling = 1;
  var killCount = 0;

  var randerData = {
    position: null,
    object: [],
    bullet: [],
  };

  function keyCodeMap(keycode) {
    var ps = randerData.position;
    var map = {
      38: function () {
        randerData.position = (ps - w > -1) ? ps - w : ps;
      },
      39: function () {
        if (ps + 1 <= w * h - 1) {
          if ((ps + 1) % w !== 0) {
            randerData.position = ps + 1;
          }
        }
      },
      40: function () {
        randerData.position = (ps + w <= w * h - 1) ? ps + w : ps;
      },
      37: function () {
        if (ps - 1 > -1) {
          if (ps % w !== 0) {
            randerData.position = ps - 1;
          }
        }
      },
      32: function () {
        shot(true);
      }
    };
    return map[keycode] || function () { };
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

  document.addEventListener('keydown', function (e) {
    //console.log(e.keyCode);
    keyCodeMap(e.keyCode)();
    render('PLAYER_MOVE');
  }, false);

  window.addEventListener('deviceorientation', function(event) {
    var triggerDeg = 30;
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;
    document.getElementById('debug').innerHTML = 'v0.0.0 alpha:'+alpha+' ,beta:'+beta+' ,gamma:'+gamma;

    if(beta < -triggerDeg){
      randerData.position = (ps - w > -1) ? ps - w : ps;
    }
    if(beta > triggerDeg){
      randerData.position = (ps + w <= w * h - 1) ? ps + w : ps;
    }
    if(gamma < -triggerDeg){
      if (ps - 1 > -1) {
        if (ps % w !== 0) {
          randerData.position = ps - 1;
        }
      }   
    }
    if(gamma > triggerDeg){
      if (ps + 1 <= w * h - 1) {
        if ((ps + 1) % w !== 0) {
          randerData.position = ps + 1;
        }
      }
    }
    render('PLAYER_MOVE');
  }, false);

  setInterval(function () { render('OBJ_MOVE') }, renderTime);
  setInterval(function () { render('BULLET_MOVE') }, bulletTime);
  // setInterval(bulletRender, bulletTime);
})();