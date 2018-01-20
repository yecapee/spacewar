(function () {
  var w = Math.floor(window.innerWidth / 30);
  var h = Math.floor(window.innerHeight / 30);
  var objQuantity = 1;
  var objPolling = [1, 4];
  var renCount = 0;
  var renderTime = 500;
  var bulletTime = 200;
  var moveTime = (window.innerWidth < 500) ? 100 : 80;
  var nextPoling = 1;
  var killCount = 0;
  var synth = new Tone.AMSynth().toMaster();
  var atc = {
    isMobile: function () {
      var e = !1;
      return function (n) {
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0, 4))) && (e = !0)
      }(navigator.userAgent || navigator.vendor || window.opera), e
    }
  };

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

  var bossMap = {
    WALL: function () {
      var objArr = randerData.object;
      for (var position = 0; position < w; position++) {
        objArr.push(position);
      }
    }
  };

  function isBossCome(killCount) {
    if (killCount % 20 == 0 && killCount != 0) {
      bossMap['WALL']();
    }
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

  function actionMove() {
    var action = {
      UP: function () {
        var ps = randerData.position;
        randerData.position = (ps - w > -1) ? ps - w : ps;
      },
      RIGHT: function () {
        var ps = randerData.position;
        if (ps + 1 <= w * h - 1) {
          if ((ps + 1) % w !== 0) {
            randerData.position = ps + 1;
          }
        }
      },
      DOWN: function () {
        var ps = randerData.position;
        randerData.position = (ps + w <= w * h - 1) ? ps + w : ps;
      },
      LEFT: function () {
        var ps = randerData.position;
        if (ps - 1 > -1) {
          if (ps % w !== 0) {
            randerData.position = ps - 1;
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

  function objPosition(isSet, boss) {
    var objArr = randerData.object;
    var quantity = objQuantity;

    if (boss) boss();
    else if (isSet) {
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
    // if (!atc.isMobile()) synth.triggerAttackRelease('C4',0.1,0);
    // synth.triggerAttackRelease('C4', 0.2, 0);
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
    var ww = 100 / _w.toString() + '%';
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
          // synth.triggerAttackRelease('C4', 0.1, 0);
          killCount++;
          isBossCome(killCount);
        } else if (randerData.bullet.includes(pointCount) && randerData.object.includes(pointCount + w)) {
          delArr(randerData.bullet, pointCount);
          delArr(randerData.object, pointCount + w);
          // synth.triggerAttackRelease('C4', 0.1, 0);
          killCount++;
          isBossCome(killCount);
        }

        document.getElementById('score').innerHTML = 'Score: ' + killCount;
        var point = (pointCount == randerData.position) ? 'point' : '';
        if (point !== '' && obj !== '') killCount = 0;
        rsPixel += '<div class="pixel ' + point + obj + bullet + '" style=\'width:' + ww + ';height:' + hh + '\'></div>';
        pointCount += 1;
      }
    }
    return rsPixel;
  }

  function dead(){
    return true;
  }
  function render(TYPE) {
    var template = gaphic(TYPE);
    document.getElementById('view').innerHTML = template;
  }

  function burst(time) {
    shot();
    if (time > 0) {
      setTimeout(function () {
        burst(time - 1);
      }, 100);
    }
  }

  document.addEventListener('keydown', function (e) {
    keyCodeMap(e.keyCode, 'keydown');
  }, false);

  document.addEventListener('keyup', function (e) {
    keyCodeMap(e.keyCode, 'keyup');
  }, false);

  window.addEventListener('deviceorientation', function (event) {
    var triggerDeg = 2;
    var alpha = event.alpha;
    var beta = Math.floor(event.beta);
    var gamma = Math.floor(event.gamma);
    var ps = randerData.position;
    //document.getElementById('debug').innerHTML = 'v0.0.6 alpha:' + alpha + ' ,beta:' + beta + ' ,gamma:' + gamma;

    if (beta < -triggerDeg) {
      keyType.UP = true;
      keyType.DOWN = false;
    };

    if (beta > triggerDeg) {
      keyType.DOWN = true;
      keyType.UP = false;
    };

    if (beta > -triggerDeg && beta < triggerDeg) {
      keyType.DOWN = false;
      keyType.UP = false;
    };

    if (gamma < -triggerDeg) {
      keyType.LEFT = true;
      keyType.RIGHT = false;
    };

    if (gamma > triggerDeg) {
      keyType.RIGHT = true;
      keyType.LEFT = false;
    };

    if (gamma > -triggerDeg && gamma < triggerDeg) {
      keyType.RIGHT = false;
      keyType.LEFT = false;
    };
  }, false);

  var view = document.getElementById('view');
  view.addEventListener("touchstart", function (event) {
    burst(5);
  }, false);

  setInterval(function () { render('OBJ_MOVE') }, renderTime);
  setInterval(function () { render('BULLET_MOVE') }, bulletTime);
  setInterval(function () { actionMove() }, moveTime);

  // setInterval(bulletRender, bulletTime);
})();

