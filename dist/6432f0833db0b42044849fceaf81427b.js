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
})({16:[function(require,module,exports) {
var atc = {
  isMobile: function isMobile() {
    var e = !1;
    return function (n) {
      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0, 4))) && (e = !0);
    }(navigator.userAgent || navigator.vendor || window.opera), e;
  }
};
var moveFps = atc.isMobile() ? 60 : 40;
var bulletFps = atc.isMobile() ? 30 : 30;
var controlFps = atc.isMobile() ? 60 : 40;
var pixelWeigth = atc.isMobile() ? 10 : 15;
var vwidth = atc.isMobile() ? window.innerWidth : window.innerHeight >= window.innerWidth ? window.innerWidth : window.innerHeight / 4 * 3;
var vheight = window.innerHeight;

exports.moveFps = moveFps;
exports.bulletFps = bulletFps;
exports.controlFps = controlFps;
exports.pixelWeigth = pixelWeigth;
exports.vwidth = vwidth;
exports.vheight = vheight;
exports.w = Math.floor(vwidth / pixelWeigth);
exports.h = Math.floor(vheight / pixelWeigth);
exports.objQuantity = 1;
exports.objPolling = [20, 60];
exports.renderTime = 1000 / moveFps;
exports.bulletTime = 1000 / bulletFps;
exports.controlTime = 1000 / controlFps;
exports.moveTime = 1000 / 30;
exports.shipLife = 5;
exports.renderData = {
  enemy: [],
  enemyBullet: [],
  aniEffect: []
};
},{}],10:[function(require,module,exports) {
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
},{"./config":16}],11:[function(require,module,exports) {
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
},{"./config":16}],14:[function(require,module,exports) {
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
},{"./config":16}],15:[function(require,module,exports) {
'use strict';

var _config = require('./config');

exports.positionToXY = function (ps) {
  var x = ps % _config.w;
  var y = Math.round((ps - x) / _config.w);
  return {
    ps: ps,
    x: x * _config.pixelWeigth + _config.pixelWeigth / 2,
    y: y * window.innerHeight / _config.h,
    __x: x,
    __y: y,
    limit: _config.w * _config.h - 1
  };
};

exports.xyToPosition = function (x, y) {
  var _x = (x - _config.pixelWeigth / 2) / _config.pixelWeigth;
  var rs = y / _config.pixelWeigth * _config.w + _x;
  return rs;
};

exports.positionTosXsY = function (position) {
  var x = position % _config.w;
  var y = Math.round((position - x) / _config.w);
  return {
    x: x,
    y: y
  };
};

exports.sXsYToPosition = function (sx, sy) {
  return sy * _config.w + sx;
};
},{"./config":16}],21:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _positionMethod = require('./positionMethod');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
  normal: function normal(bulletPs, time) {
    var time = 45;
    var prePs = bulletPs;
    var count = time;
    return function (shipPs) {
      var _ref;

      count--;
      var p0 = (0, _positionMethod.positionTosXsY)(prePs);
      var p1 = (0, _positionMethod.positionTosXsY)(prePs + _config.w * _config.h);
      var t = 1 / time * (time - count);

      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      var _p0 = (0, _positionMethod.positionToXY)(prePs);
      var _p1 = (0, _positionMethod.positionToXY)(prePs + _config.w * _config.h);
      var t = 1 / time * (time - count);
      var realX = _p0.x + (_p1.x - _p0.x) * t;
      var realY = _p0.y + (_p1.y - _p0.y) * t;

      return _ref = {
        position: (0, _positionMethod.sXsYToPosition)(x, y),
        look: '',
        x: realX,
        y: realY
      }, _defineProperty(_ref, 'look', 'laser'), _defineProperty(_ref, 'w', 20), _defineProperty(_ref, 'h', 60), _defineProperty(_ref, 'clear', count < -1), _ref;
    };
  },
  track: function track(bulletPs, time) {
    var prePs = bulletPs;
    var count = time || 30;
    var p1 = null;
    var _p1 = null;
    return function (shipPs) {
      count--;
      var p0 = (0, _positionMethod.positionTosXsY)(prePs);
      if (!p1) p1 = (0, _positionMethod.positionTosXsY)(shipPs);
      var t = 1 / 25 * (25 - count);
      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      var _p0 = (0, _positionMethod.positionToXY)(prePs);
      if (!_p1) _p1 = (0, _positionMethod.positionToXY)(shipPs);
      var t = 1 / 25 * (25 - count);
      var realX = _p0.x + (_p1.x - _p0.x) * t;
      var realY = _p0.y + (_p1.y - _p0.y) * t;

      return {
        position: (0, _positionMethod.sXsYToPosition)(x, y),
        x: realX,
        y: realY,
        look: 'bulletBall',
        w: 15,
        h: 15,
        clear: count < -15 || x < 0 || x > _config.w - 1
      };
    };
  }
};
},{"./config":16,"./positionMethod":15}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.mainX = obj.position;
  this.position = obj.position; //位置
  this.shot = obj.shot; //會不會發射子彈
  this.shotTime = obj.shotTime; //連發數
  this.movePath = obj.movePath; //移動的路徑類型
  this.moveTime = obj.moveTime || 1; // 移動間隔
  this.look = obj.look;
  this.bulletType = obj.bulletType || 'normal';

  var deadCb = obj.deadCb || function () {};
  var hit = false;
  var survivalTime = 0;

  this.getST = function () {
    return survivalTime;
  };
  this.wasHit = function (bulletPs, viewDom, cb) {
    var me = this;
    if (_lookPath2.default[this.look](this.position).includes(bulletPs)) {
      hit = true;
      this.life--;
      if (this.life < 1) {
        _config.renderData.enemy.find(function (el, index) {
          if (el === me) {
            var bestScore = localStorage.getItem('bestScore');
            _config.renderData.enemy.splice(index, 1);
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
      var psObj = (0, _positionMethod.positionToXY)(ps);
      viewDom.beginPath();
      viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth);
      viewDom.fillStyle = color;
      viewDom.fill();
    });
  };

  this.action = function (renderType, viewDom, shipPs) {
    this.grapic.call(this, viewDom);
    if (renderType === 'OBJ_MOVE') {
      enemyMove.call(this);
      if (survivalTime % this.shotTime[0] < this.shotTime[1]) {
        var shotCount = survivalTime % this.shotTime[0];
        if (shotCount % this.shotTime[2] == 0) {
          this.shot && shotByEnemy(this.position, this.bulletType, shipPs);
        }
      };
      survivalTime++;
      hit = false;
    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = (0, _positionMethod.positionToXY)(position);
    var enemyImg = document.getElementById("explosion");
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(50, function (renCount, viewDom) {
      viewDom.drawImage(enemyImg, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
    }));
    deadCb();
  };
};

var _lookPath = require('./lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _aniEffectMethod = require('./aniEffectMethod');

var _positionMethod = require('./positionMethod');

var _enemyBulletType = require('./enemyBulletType');

var _enemyBulletType2 = _interopRequireDefault(_enemyBulletType);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function enemyMove() {
  if (_movePathList2.default[this.movePath] && this.getST() % this.moveTime == 0) _movePathList2.default[this.movePath].call(this);
}

function shotByEnemy(position, bulletType, shipPs) {
  var bulletArr = _config.renderData.enemyBullet;
  var dataFn = _enemyBulletType2.default[bulletType](position);
  if (!bulletArr.reduce(function (rs, el) {
    return rs || el.data.position === position;
  }, false)) {
    bulletArr.push({
      data: dataFn(shipPs),
      fn: dataFn
    });
  };
}
},{"./lookPath":10,"./movePathList":11,"./aniEffectMethod":14,"./positionMethod":15,"./enemyBulletType":21,"./config":16}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.deadPosition = obj.position; //復活位置
  this.position = obj.position; //位置
  this.killCount = 0; //擊殺數
  this.bullet = [], //子彈陣列
  this.look = obj.look;
  this.isDead = false;

  var deadCb = obj.deadCb || function () {};
  var hit = false;

  this.wasHit = function (bulletPs, bulletIndex, viewDom) {
    // console.log(this.life);
    var me = this;
    var path = _lookPath2.default[this.look](this.position);
    var enemyMap = _config.renderData.enemy.reduce(function (total, el) {
      return [].concat(_toConsumableArray(total), _toConsumableArray(_lookPath2.default[el.look](el.position)));
    }, []);
    var touchEnemy = path.reduce(function (total, el) {
      return total || enemyMap.includes(el);
    }, false);
    if (path.includes(bulletPs) || path.includes(bulletPs + _config.w) || touchEnemy) {
      this.life--;
      _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(10, function (renCount, viewDom) {
        path.forEach(function (ps, index) {
          var psObj = (0, _positionMethod.positionToXY)(ps);
          viewDom.fillStyle = 'rgba(255,0,0,.8)';
          viewDom.fillRect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth + 1);
        });
      }.bind(this)));
      _config.renderData.enemyBullet.splice(bulletIndex, 1);
      if (this.life < 1) {
        this.life = 0;
        this.isDead = true;
        this.dead();
      }
    }
  };

  this.shot = function () {
    if (!this.isDead) {
      var bulletArr = this.bullet;
      if (!bulletArr.includes(this.position - _config.w)) bulletArr.push(this.position - _config.w);
    }
  };

  this.grapic = function (viewDom) {
    var _wasHit = this.wasHit.bind(this);
    var isDead = this.isDead;
    if (!isDead) {
      _lookPath2.default[this.look](this.position).forEach(function (ps, index) {
        var psObj = (0, _positionMethod.positionToXY)(ps);
        viewDom.beginPath();
        viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth + 1);
        viewDom.fillStyle = 'white';
        viewDom.fill();
      });

      _config.renderData.enemyBullet.forEach(function (bullet, index) {
        _wasHit(bullet.data.position, index, viewDom);
      });

      bulletPosition.call(this);
      grapicBullet.call(this, viewDom);
    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = (0, _positionMethod.positionToXY)(position);
    var enemyImg = document.getElementById("explosion");
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(50, function (renCount, viewDom) {
      viewDom.drawImage(enemyImg, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
      //console.log(renCount);
      if (renCount == 50) {
        this.life = obj.life;
        this.position = this.deadPosition;
        this.isDead = false;
        this.bullet = [];
      }
    }.bind(this)));
    deadCb();
  };
};

var _lookPath = require('./lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _aniEffectMethod = require('./aniEffectMethod');

var _positionMethod = require('./positionMethod');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function bulletPosition() {
  var bulletArr = this.bullet;
  for (var key in bulletArr) {
    bulletArr[key] = bulletArr[key] - _config.w;
    if (bulletArr[key] < 0) {
      bulletArr.splice(key, 1);
    };
  }
}

function grapicBullet(viewDom) {
  var enemyBulleArr = _config.renderData.enemyBullet;
  var bulletImg = document.getElementById("bulletImg");
  var thisBullet = this.bullet;
  thisBullet.map(function (ps) {
    var bulletObj = (0, _positionMethod.positionToXY)(ps);
    viewDom.drawImage(bulletImg, bulletObj.x - 13 / 2, bulletObj.y - 5, 13, 64);

    // defense
    enemyBulleArr.forEach(function (enemyBullet, index) {
      if (enemyBullet.data.position === ps) {
        enemyBulleArr.splice(index, 1);
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      }
      if (enemyBullet.data.position === ps + _config.w) {
        enemyBulleArr.splice(index, 1);
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      }
    });

    // kill enemy
    _config.renderData.enemy.map(function (obj) {
      obj.wasHit(ps, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      });
      obj.wasHit(ps + _config.w, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      });
    });
  });
}
},{"./lookPath":10,"./movePathList":11,"./aniEffectMethod":14,"./positionMethod":15,"./config":16}],8:[function(require,module,exports) {
'use strict';

var _lookPath = require('./js/lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./js/movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _createEnemy = require('./js/createEnemy');

var _createEnemy2 = _interopRequireDefault(_createEnemy);

var _createShip = require('./js/createShip');

var _createShip2 = _interopRequireDefault(_createShip);

var _aniEffectMethod = require('./js/aniEffectMethod');

var _positionMethod = require('./js/positionMethod');

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

function actionMove(ship) {
  var action = {
    UP: function UP() {
      var ps = ship.position;
      ship.position = ps - _config.w > -1 ? ps - _config.w : ps;
    },
    RIGHT: function RIGHT() {
      var ps = ship.position;
      if (ps + 1 <= _config.w * _config.h - 1) {
        if ((ps + 1) % _config.w !== 0) {
          ship.position = ps + 1;
        }
      }
    },
    DOWN: function DOWN() {
      var ps = ship.position;
      var nowY = Math.round((ps - ps % _config.w) / _config.w);
      if (ps + _config.w < _config.w * _config.h) {
        ship.position = nowY < _config.h ? ps + _config.w : ps;
      }
    },
    LEFT: function LEFT() {
      var ps = ship.position;
      if (ps - 1 > -1) {
        if (ps % _config.w !== 0) {
          ship.position = ps - 1;
        }
      }
    },
    SPACE: function SPACE() {
      ship.shot();
    }
  };
  for (var key in keyType) {
    if (keyType[key] == true) action[key]();
    //document.getElementById('debug').innerHTML = JSON.stringify(positionToXY(renderData.position), null, 2);
  }
}

function bulletPosition(shipPs) {
  var enemyBulleArr = _config.renderData.enemyBullet;
  for (var key in enemyBulleArr) {
    enemyBulleArr[key].data = enemyBulleArr[key].fn(shipPs);
    if (enemyBulleArr[key].data.clear) {
      enemyBulleArr.splice(key, 1);
    };
  }
  //console.log(enemyBulleArr);
}

var mkII = new _createShip2.default({
  name: 'MK-2',
  life: _config.shipLife,
  position: _config.w * Math.floor(_config.h / 2) - Math.floor(_config.w / 2),
  deadPosition: _config.w * Math.floor(_config.h / 2) - Math.floor(_config.w / 2),
  look: 'MK-2',
  deadCb: function deadCb() {
    killCount = 0;
    renCount = 0;
    nextPolling = 100;
  }
});

function gaphic(TYPE) {
  var bestScore = localStorage.getItem('bestScore') || 0;
  var bestMileage = localStorage.getItem('bestMileage') || 0;
  var shipLookType = 'MK-2';

  if (TYPE === 'OBJ_MOVE') {
    var createObj = false;
    if (renCount == nextPolling) {
      for (var x = 0; x < _config.objQuantity; x++) {
        var zark = new _createEnemy2.default({
          name: 'ZARK-ZERO',
          life: 3,
          position: Math.floor(Math.random() * _config.w),
          shot: true,
          shotTime: [200, 54, 9],
          movePath: 'gostMove',
          moveTime: 5,
          look: 'zark',
          bulletType: renCount % 2 == 0 ? 'normal' : 'track',
          deadCb: function deadCb() {
            killCount++;
            if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
          }
        });
        _config.renderData.enemy.push(zark);
      }
      nextPolling = renCount + Math.floor(Math.random() * _config.objPolling[1] + _config.objPolling[0]);
    }

    renCount++;
    if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
  }

  if (TYPE === 'BULLET_MOVE') {
    bulletPosition(mkII.position);
  }

  //canvas
  var viewDom = document.getElementById('view').getContext('2d');
  viewDom.clearRect(0, 0, _config.vwidth, _config.vheight);

  // ship
  mkII.grapic(viewDom);

  //enmyBullet
  _config.renderData.enemyBullet.map(function (bullt) {
    var bulletObj = (0, _positionMethod.positionToXY)(bullt.data.position);
    //viewDom.drawImage(enemyImg, bulletObj.x - 15 / 2, bulletObj.y - 5, 15, 15);
    var enemyImg = document.getElementById(bullt.data.look);
    viewDom.drawImage(enemyImg, bullt.data.x - 15 / 2, bullt.data.y - 5, bullt.data.w, bullt.data.h);
  });

  // enmy
  _config.renderData.enemy.map(function (obj) {
    obj.action(TYPE, viewDom, mkII.position);
  });

  // effect
  _config.renderData.aniEffect.forEach(function (el) {
    el(viewDom);
  });

  document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount + '</div><br/>Best score: ' + (localStorage.getItem('bestScore') || 0) + '<br/> Mileage: ' + renCount + '<br/> Best Mileage: ' + bestMileage + '<br/> Life: ' + mkII.life;

  document.getElementById('life').style.width = 100 / _config.shipLife * mkII.life + '%';
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
  if (event.touches[0]) {
    var x = Math.floor(event.touches[0].pageX / _config.pixelWeigth);
    var y = Math.floor(event.touches[0].pageY / _config.pixelWeigth);
    var _ps = _config.w * y + x;
    mkII.position = _ps;
    mkII.shot();
    //document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
  }
}

document.getElementById('view').height = _config.vheight;
document.getElementById('view').width = _config.vwidth;

setInterval(function () {
  render('OBJ_MOVE');
}, _config.renderTime);

setInterval(function () {
  render('CONTROL_MOVE');
  actionMove(mkII);
}, _config.controlTime);

setInterval(function () {
  render('BULLET_MOVE');
}, _config.bulletTime);

//todo

//* 敵機死亡效果
//分開敵人及主角機的lookPath
//組成像素可縮小
//*子彈種類多元


//*主角機有血量
//主角機階段進化
//*主角機物件化？
},{"./js/lookPath":10,"./js/movePathList":11,"./js/createEnemy":12,"./js/createShip":13,"./js/aniEffectMethod":14,"./js/positionMethod":15,"./js/config":16}],23:[function(require,module,exports) {

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55001' + '/');
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
},{}]},{},[23,8])
//# sourceMappingURL=/dist/6432f0833db0b42044849fceaf81427b.map