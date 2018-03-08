// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
var atc = {
  isMobile: function isMobile() {
    var e = !1;
    return function (n) {
      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0, 4))) && (e = !0);
    }(navigator.userAgent || navigator.vendor || window.opera), e;
  }
};

var moveFps = atc.isMobile() ? 60 : 30;
var bulletFps = atc.isMobile() ? 60 : 30;
var pixelWeigth = atc.isMobile() ? 10 : 20;

exports.moveFps = moveFps;
exports.bulletFps = bulletFps;
exports.pixelWeigth = pixelWeigth;
exports.w = Math.floor(window.innerWidth / pixelWeigth);
exports.h = Math.floor(window.innerHeight / pixelWeigth);
exports.objQuantity = 1;
exports.objPolling = [20, 40];
exports.renderTime = 1000 / moveFps;
exports.bulletTime = 1000 / bulletFps;
exports.moveTime = 1000 / 30;
exports.renderData = {
  position: null,
  renderTemp: {},
  bullet: [],
  preState: {},
  enemy: [],
  enemyBullet: [],
  aniEffect: []
};
},{}],7:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

exports.default = {
  'zark': function zark(ps) {
    var rs = [ps];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(ps - _config.w + 1);
    }
    if (ps % _config.w !== 0 || ps == 0) {
      rs.push(ps - _config.w - 1);
    }
    return rs;
  },
  'MK-1': function MK1(ps) {
    var rs = [ps, ps + _config.w, ps + 3 * _config.w];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(ps + 2 * _config.w + 1);
      rs.push(ps + 3 * _config.w + 2);
      rs.push(ps + 4 * _config.w + 1);
    }
    if (ps % _config.w !== 0) {
      rs.push(ps + 2 * _config.w - 1);
      rs.push(ps + 3 * _config.w - 2);
      rs.push(ps + 4 * _config.w - 1);
    }
    return rs;
  },
  'MK-2': function MK2(ps) {
    var rs = [ps, ps + _config.w, ps + 3 * _config.w];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(ps + 2 * _config.w + 1);
    }
    if (ps % _config.w !== 0) {
      rs.push(ps + 2 * _config.w - 1);
    }
    return rs;
  },
  'MK-3': function MK3(ps) {
    var rs = [ps, ps + _config.w, ps + 2 * _config.w, ps + 4 * _config.w];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(ps + 2 * _config.w + 1);
      rs.push(ps + 3 * _config.w + 1);
    }
    if (ps % _config.w !== 0) {
      rs.push(ps + 2 * _config.w - 1);
      rs.push(ps + 3 * _config.w - 1);
    }
    return rs;
  }
};
},{"./config":9}],8:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

function positionLimit(nowPosition) {
  var leftlimt = this.mainX - this.mainX % _config.w;
  var rightlimt = leftlimt + _config.w - 1;
  this.mainX += _config.w;
  if (nowPosition > rightlimt) {
    return rightlimt;
  }
  if (nowPosition < leftlimt) {
    return leftlimt;
  }
  return nowPosition;
};

exports.default = {
  goStop: function goStop() {
    var me = this;
    if (this.getST() < 6) this.position += _config.w;
    if (this.getST() > 80) this.position += _config.w;
    if (this.position > _config.w * _config.h - 1) {
      _config.renderData.enemy.find(function (el, index) {
        if (el === me) _config.renderData.enemy.splice(index, 1);
      });
    };
  },
  gostMove: function gostMove() {
    var me = this;
    var thisY = Math.floor(this.position / _config.h);
    var r = _config.h / 4;
    var nowY = Math.floor(this.mainX / _config.w);
    var margin = Math.sin(Math.PI / r * nowY);
    var xMargin = Math.floor(margin * r);
    //console.log(nowY, margin);
    this.position = positionLimit.call(this, this.mainX + xMargin);
    if (this.position > _config.w * _config.h - 1) {
      _config.renderData.enemy.find(function (el, index) {
        if (el === me) _config.renderData.enemy.splice(index, 1);
      });
    };
  },
  goToOut: function goToOut() {
    this.position += _config.w;
    var me = this;
    if (this.position > _config.w * _config.h - 1) {
      _config.renderData.enemy.find(function (el, index) {
        if (el === me) _config.renderData.enemy.splice(index, 1);
      });
    };
  }
};
},{"./config":9}],14:[function(require,module,exports) {
'use strict';

var _config = require('./config');

exports.animation = function (totalRenCount, aniFn) {
  var renCount = 1;
  var fn = function fn(viewDom) {
    if (renCount == totalRenCount) {
      _config.renderData.aniEffect.splice(_config.renderData.aniEffect.indexOf(fn), 1);
    }
    aniFn(renCount, viewDom);
    renCount++;
  };
  return fn;
};
},{"./config":9}],6:[function(require,module,exports) {
'use strict';

var _lookPath = require('./js/lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./js/movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _aniEffectMethod = require('./js/aniEffectMethod');

var _config = require('./js/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renCount = 0;
var nextPolling = 1;
var killCount = 0;
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
  this.look = obj.look;

  var hit = false;
  var survivalTime = 0;
  // var hitPath = lookPath[this.look](this.position).map(function () {
  //   return true;
  // });

  this.getST = function () {
    return survivalTime;
  };
  this.wasHit = function (bulletPs, viewDom, cb) {
    var me = this;
    if (_lookPath2.default[this.look](this.position).includes(bulletPs)) {
      // hitPath[lookPath[this.look](this.position).indexOf(bulletPs)] = false;
      hit = true;
      this.life--;
      if (this.life < 1) {
        _config.renderData.enemy.find(function (el, index) {
          if (el === me) {
            var bestScore = localStorage.getItem('bestScore');
            _config.renderData.enemy.splice(index, 1);
            killCount++;
            if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
          }
        });
        this.dead();
      } else {
        this.grapic.call(this, viewDom);
        if (cb) cb();
      };
    }
  };

  this.grapic = function (viewDom) {
    var color = hit ? 'red' : 'white';
    _lookPath2.default[this.look](this.position).forEach(function (ps, index) {
      //if (hitPath[index]) {    
      var psObj = positionToXY(ps);
      viewDom.beginPath();
      viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth);
      viewDom.fillStyle = color;
      viewDom.fill();
      //}
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

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var enemyImg = document.getElementById("explosion");
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(50, function (renCount, viewDom) {
      viewDom.drawImage(enemyImg, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
    }));
  };
}

function enemyMove() {
  if (_movePathList2.default[this.movePath] && this.getST() % this.moveTime == 0) _movePathList2.default[this.movePath].call(this);
};

function keyCodeMap(keycode, type) {
  var map = {
    38: function _() {
      if (type == 'keydown') keyType.UP = true;
      if (type == 'keyup') keyType.UP = false;
    },
    39: function _() {
      if (type == 'keydown') keyType.RIGHT = true;
      if (type == 'keyup') keyType.RIGHT = false;
    },
    40: function _() {
      if (type == 'keydown') keyType.DOWN = true;
      if (type == 'keyup') keyType.DOWN = false;
    },
    37: function _() {
      if (type == 'keydown') keyType.LEFT = true;
      if (type == 'keyup') keyType.LEFT = false;
    },
    32: function _() {
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
    UP: function UP() {
      var ps = _config.renderData.position;
      _config.renderData.position = ps - _config.w > -1 ? ps - _config.w : ps;
    },
    RIGHT: function RIGHT() {
      var ps = _config.renderData.position;
      if (ps + 1 <= _config.w * _config.h - 1) {
        if ((ps + 1) % _config.w !== 0) {
          _config.renderData.position = ps + 1;
        }
      }
    },
    DOWN: function DOWN() {
      var ps = _config.renderData.position;
      var nowY = Math.round((ps - ps % _config.w) / _config.w);
      if (ps + _config.w < _config.w * _config.h) {
        _config.renderData.position = nowY < _config.h ? ps + _config.w : ps;
      }
    },
    LEFT: function LEFT() {
      var ps = _config.renderData.position;
      if (ps - 1 > -1) {
        if (ps % _config.w !== 0) {
          _config.renderData.position = ps - 1;
        }
      }
    },
    SPACE: function SPACE() {
      shot();
    }
  };
  for (var key in keyType) {
    if (keyType[key] == true) action[key]();
    document.getElementById('debug').innerHTML = JSON.stringify(positionToXY(_config.renderData.position), null, 2);
  }
  render('PLAYER_MOVE');
}

function objPosition(isSet) {
  var objArr = _config.renderData.object;
  var quantity = _config.objQuantity;

  if (isSet) {
    for (var x = 0; x < quantity; x++) {
      objArr.push(Math.floor(Math.random() * _config.w));
    }
  }

  for (var key in objArr) {
    var val = objArr[key];
    objArr[key] = objArr[key] + _config.w;
  }

  for (var key in objArr) {
    if (objArr[key] > _config.w * _config.h - 1) {
      objArr.splice(key, 1);
    };
  }
}

function shot() {
  var bulletArr = _config.renderData.bullet;
  if (!bulletArr.includes(_config.renderData.position - _config.w)) bulletArr.push(_config.renderData.position - _config.w);
}

function shotByEnemy(position) {
  var bulletArr = _config.renderData.enemyBullet;
  if (!bulletArr.includes(position + _config.w)) bulletArr.push(position + _config.w);
}

function bulletPosition() {
  var bulletArr = _config.renderData.bullet;
  var enemyBulleArr = _config.renderData.enemyBullet;
  for (var key in bulletArr) {
    bulletArr[key] = bulletArr[key] - _config.w;
    if (bulletArr[key] < 0) {
      bulletArr.splice(key, 1);
    };
  }
  for (var key in enemyBulleArr) {
    enemyBulleArr[key] = enemyBulleArr[key] + _config.w;
    if (enemyBulleArr[key] > _config.w * _config.h + 1) {
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
  _lookPath2.default[data.lookType](data.position).forEach(function (ps, index) {
    var psObj = positionToXY(ps);
    viewDom.beginPath();
    viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth + 1);
    viewDom.fillStyle = 'white';
    viewDom.fill();
  });
};

function gaphic(TYPE) {
  var bestScore = localStorage.getItem('bestScore') || 0;
  var bestMileage = localStorage.getItem('bestMileage') || 0;
  var shipLookType = 'MK-2';

  if (!_config.renderData.position && _config.renderData.position !== 0) {
    _config.renderData.position = _config.w * Math.floor(_config.h / 2) - Math.floor(_config.w / 2);
  }

  if (TYPE === 'OBJ_MOVE') {
    var createObj = false;
    if (renCount == nextPolling) {
      for (var x = 0; x < _config.objQuantity; x++) {
        var zark = new createEnemy({
          name: 'ZARK-ZERO',
          life: 3,
          position: Math.floor(Math.random() * _config.w),
          shot: true,
          shotTime: 3,
          movePath: 'gostMove',
          moveTime: 5,
          look: 'zark'
        });
        _config.renderData.enemy.push(zark);
      }
      nextPolling = renCount + Math.floor(Math.random() * _config.objPolling[1] + _config.objPolling[0]);
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

  // dead
  _config.renderData.aniEffect.forEach(function (el) {
    el(viewDom);
  });

  // bullet
  var enemyBulleArr = _config.renderData.enemyBullet;
  var bulletImg = document.getElementById("bulletImg");
  _config.renderData.bullet.map(function (ps) {
    var bulletObj = positionToXY(ps);
    viewDom.drawImage(bulletImg, bulletObj.x - 13 / 2, bulletObj.y - 5, 13, 64);

    //defense
    // console.log(ps, enemyBulleArr);
    if (enemyBulleArr.includes(ps)) {
      enemyBulleArr.splice(enemyBulleArr.indexOf(ps), 1);
      _config.renderData.bullet.splice(_config.renderData.bullet.indexOf(ps), 1);
    }
    if (enemyBulleArr.includes(ps + _config.w)) {
      enemyBulleArr.splice(enemyBulleArr.indexOf(ps + _config.w), 1);
      _config.renderData.bullet.splice(_config.renderData.bullet.indexOf(ps), 1);
    }

    //kill enemy
    _config.renderData.enemy.map(function (obj) {
      obj.wasHit(ps, viewDom, function () {
        _config.renderData.bullet.splice(_config.renderData.bullet.indexOf(ps), 1);
      });
      obj.wasHit(ps + _config.w, viewDom, function () {
        _config.renderData.bullet.splice(_config.renderData.bullet.indexOf(ps), 1);
      });
    });
  });

  // ship
  gaphicShip({
    viewDom: viewDom,
    lookType: shipLookType,
    position: _config.renderData.position
  });

  //enmyBullet
  var enemyImg = document.getElementById("enemyImg");
  _config.renderData.enemyBullet.map(function (ps) {
    var bulletObj = positionToXY(ps);
    viewDom.drawImage(enemyImg, bulletObj.x - 15 / 2, bulletObj.y - 5, 15, 15);
  });

  // enmy
  _config.renderData.enemy.map(function (obj) {
    obj.action(TYPE, viewDom);
  });

  document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount + '</div><br/>Best score: ' + (localStorage.getItem('bestScore') || 0) + '<br/> Mileage: ' + renCount + '<br/> Best Mileage: ' + bestMileage;

  var dead = false;
  if (isDead(_config.renderData.position, shipLookType)) {
    renCount = 0;
    nextPolling = 20;
    _config.renderData.renderTemp = {};
    killCount = 0;
    dead = true;
    console.log('dead');
  }
}

function isDead(point, shipLookType) {
  var rs = false;
  _config.renderData.enemyBullet.forEach(function (ps) {
    if (_lookPath2.default[shipLookType](point).includes(ps)) rs = true;
  });
  _config.renderData.enemy.map(function (enemy) {
    if (_lookPath2.default[shipLookType](point).includes(enemy.position)) rs = true;
  });
  return rs;
}

function render(TYPE) {
  gaphic(TYPE);
}

function positionToXY(ps) {
  var x = ps % _config.w;
  var y = Math.round((ps - x) / _config.w);
  return {
    ps: ps,
    x: x * _config.pixelWeigth + _config.pixelWeigth / 2,
    //y: Math.round(y / h) * pixelWeigth,
    // y: Math.round(y / h) * window.innerHeight / h,
    y: y * window.innerHeight / _config.h,
    __x: x,
    __y: y,
    limit: _config.w * _config.h - 1
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
  var x = Math.floor(event.touches[0].pageX / _config.pixelWeigth);
  var y = Math.floor(event.touches[0].pageY / _config.pixelWeigth);
  var _ps = _config.w * y + x;
  _config.renderData.position = _ps;
  shot();
  document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (_config.w * y + x);
}

document.getElementById('view').height = window.innerHeight;
document.getElementById('view').width = window.innerWidth;
setInterval(function () {
  render('OBJ_MOVE');
}, _config.renderTime);
setInterval(function () {
  render('BULLET_MOVE');
  actionMove();
}, _config.bulletTime);

//todo
//敵機死亡效果
//分開敵人及主角機的lookPath
//組成像素可縮小
//子彈種類多元
//主角機有血量
//主角機階段進化
},{"./js/lookPath":7,"./js/movePathList":8,"./js/aniEffectMethod":14,"./js/config":9}],16:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55787' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[16,6])
//# sourceMappingURL=/dist/6432f0833db0b42044849fceaf81427b.map