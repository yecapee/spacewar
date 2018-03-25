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
})({35:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],26:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":35}],10:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./img/spacebg.png":[["0be558690d0b1f803f034b043d9bd2f2.png",30],30],"_css_loader":26}],19:[function(require,module,exports) {
var atc = {
  isMobile: function isMobile() {
    var e = !1;
    return function (n) {
      (/(android|bb\d+|meego).+mobile|iPad|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0, 4))) && (e = !0);
    }(navigator.userAgent || navigator.vendor || window.opera), e;
  }
};
var moveFps = atc.isMobile() ? 40 : 40;
var bulletFps = atc.isMobile() ? 30 : 30;
var controlFps = atc.isMobile() ? 60 : 40;
var pixelWeigth = atc.isMobile() ? 10 : 15;
var vwidth = atc.isMobile() ? window.innerWidth : window.innerHeight >= window.innerWidth ? window.innerWidth : window.innerHeight / 4 * 3;
var vheight = window.innerHeight;

exports.atc = atc;
exports.moveFps = moveFps;
exports.bulletFps = bulletFps;
exports.controlFps = controlFps;
exports.pixelWeigth = pixelWeigth;
exports.vwidth = vwidth;
exports.vheight = vheight;
exports.w = Math.floor(vwidth / pixelWeigth);
exports.h = Math.floor(vheight / pixelWeigth);
exports.renderTime = 1000 / moveFps;
exports.bulletTime = 1000 / bulletFps;
exports.controlTime = 1000 / controlFps;
exports.moveTime = 1000 / 30;
exports.shipLife = 5;
exports.renderData = {
  enemy: [],
  enemyBullet: [],
  aniEffect: [],
  item: []
};
},{}],18:[function(require,module,exports) {
'use strict';

var _config = require('./config');

var positionTosXsY = function positionTosXsY(position) {
  var x = position % _config.w;
  var y = Math.round((position - x) / _config.w);
  return {
    x: x,
    y: y
  };
};

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

exports.positionTosXsY = positionTosXsY;

exports.sXsYToPosition = function (sx, sy) {
  return sy * _config.w + sx;
};

exports.ezPosition = function (position) {
  var ps = position;
  return function (x, y, clear) {
    var rs = ps + y * _config.w + x;
    if (clear) {
      ps = null;
    }
    return rs;
  };
};

exports.ezPositionWithCheckScope = function (position) {
  var ps = position;
  var psXy = positionTosXsY(ps);
  return function (x, y, clear) {
    var _x = psXy.x + x;
    var _y = psXy.y + y;
    var rs = ps + y * _config.w + x;
    if (clear) {
      ps = null;
      psXy = null;
      return;
    }
    return _x < 0 || _x > _config.w - 1 || _y < 0 || _y > _config.h - 1 ? undefined : rs;
  };
};

exports.touchScope = function (position) {
  var ps = positionTosXsY(position);
  return {
    TOP: ps.y === 0,
    RIGHT: ps.x === _config.w - 1,
    BOTTOM: ps.y === _config.h - 1,
    LEFT: ps.x === 0
  };
};

exports.outScope = function (position) {
  var ps = positionTosXsY(position);
  return {
    TOP: ps.y < 0,
    RIGHT: ps.x > _config.w - 1,
    BOTTOM: ps.y > _config.h - 1,
    LEFT: ps.x < 0
  };
};
},{"./config":19}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _positionMethod = require('./positionMethod');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  return {
    position: (0, _positionMethod.sXsYToPosition)(_x, _y),
    outScope: _x < 0 || _x > _config.w - 1 || _y < 0 || _y > _config.h - 1
  };
}

function circleMap() {
  var renCount = 0;
  return function (ps, getmap) {
    var p0 = (0, _positionMethod.positionTosXsY)(ps);
    var pointLength = 8;
    var rs = [];
    for (var i = 0; i <= pointLength; i++) {
      var psData = circle(p0.x, p0.y, 5, pointLength, i, Math.round(renCount / 20));
      !psData.outScope && rs.push(psData.position);
    }
    if (!getmap) renCount++;
    return rs;
  };
}

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
  'fort': function fort(ps) {
    var rs = [ps];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(ps - _config.w + 1);
    }
    if (ps % _config.w !== 0 || ps == 0) {
      rs.push(ps - _config.w - 1);
    }
    if (ps - 2 * _config.w > 0) {
      rs.push(ps - 2 * _config.w);
    }
    return rs;
  },
  'point': function point(ps) {
    return [ps];
  },
  'hp+': function hp(ps) {
    var rs = [];
    if (ps % _config.w - 1 > 0) {
      rs = [].concat(_toConsumableArray(rs), [ps - _config.w - 1, ps + _config.w - 1]);
    }
    if (ps % _config.w + 1 < _config.w) {
      rs = [].concat(_toConsumableArray(rs), [ps - _config.w + 1, ps + _config.w + 1]);
    }
    return rs;
  },
  'SPIDER': function SPIDER(ps) {
    var xy = (0, _positionMethod.ezPosition)(ps);
    var rs = [xy(0, 0)];
    if (ps % _config.w !== _config.w - 1) {
      rs = [].concat(_toConsumableArray(rs), [xy(1, -1), xy(1, -2), xy(1, 1)]);
    }
    if (ps % _config.w !== 0) {
      rs = [].concat(_toConsumableArray(rs), [xy(-1, -1), xy(-1, -2), xy(-1, 1)]);
    }
    xy(0, 0, true);
    return rs;
  },
  'TALONS': function TALONS(ps, type) {
    var xy = (0, _positionMethod.ezPositionWithCheckScope)(ps);
    var rs = [xy(0, -2), xy(0, 1)];
    var open = type === 'OPEN';

    if (open) {
      rs = [].concat(_toConsumableArray(rs), [xy(1, 0), xy(2, -1), xy(2, -2), xy(2, -3)]);
      rs = [].concat(_toConsumableArray(rs), [xy(-1, 0), xy(-2, -1), xy(-2, -2), xy(-2, -3)]);
    }
    if (!open) {
      rs = [].concat(_toConsumableArray(rs), [xy(1, 0), xy(1, -1), xy(1, -2), xy(1, -3)]);
      rs = [].concat(_toConsumableArray(rs), [xy(-1, 0), xy(-1, -1), xy(-1, -2), xy(-1, -3)]);
    }
    xy(0, 0, true);
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
    var xy = (0, _positionMethod.ezPosition)(ps);
    var rs = [xy(0, 0), xy(0, 1), xy(0, 3)];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(xy(1, 2));
    }
    if (ps % _config.w !== 0) {
      rs.push(xy(-1, 2));
    }
    xy(0, 0, true);
    return rs;
  },
  'MK-2.LIGHT': function MK2LIGHT(ps) {
    var xy = (0, _positionMethod.ezPosition)(ps);
    var rs = [xy(0, 0), xy(0, 3)];
    if (ps % _config.w !== _config.w - 1) {
      rs.push(xy(1, 2));
    }
    if (ps % _config.w !== 0) {
      rs.push(xy(-1, 2));
    }
    xy(0, 0, true);
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
  },
  'CIRCLE': circleMap()
};
},{"./config":19,"./positionMethod":18}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _positionMethod = require('./positionMethod');

function positionLimit(nowPosition) {
  var leftlimt = this.mainX - this.mainX % _config.w;
  var rightlimt = leftlimt + _config.w - 1;

  if (nowPosition > rightlimt) {
    this.mainX -= 1;
    return -1;
  }
  if (nowPosition < leftlimt) {
    this.mainX += 1;
    return -1;
  }
  this.mainX += _config.w;
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
    while (this.position == -1) {
      this.position = positionLimit.call(this, this.mainX + xMargin);
    }
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
  },
  pingpong: function pingpong() {
    var xy = (0, _positionMethod.ezPosition)(this.position);
    var prePs = (0, _positionMethod.positionTosXsY)(this.prePosition);
    var nowPs = (0, _positionMethod.positionTosXsY)(this.position);

    if (!this.prePosition) {
      this.prePosition = this.position;
      this.position = xy(1, 1);
      // console.log(this.prePosition,this.position,xy(1, 1));
      return;
    };

    var directionX = prePs.x < nowPs.x; // 1 >, 0 <
    var directionY = prePs.y < nowPs.y; // 1 V, 0 ^
    this.prePosition = this.position;

    var scope = (0, _positionMethod.touchScope)(this.position);

    if (!directionX && !directionY) {
      if (scope.LEFT && scope.TOP) return xy(1, 1);

      if (scope.LEFT) return this.position = xy(1, -1);
      if (scope.TOP) return this.position = xy(-1, 1);
      return this.position = xy(-1, -1);
    };

    if (!directionX && directionY) {
      if (scope.LEFT && scope.BOTTOM) return xy(1, -1);

      if (scope.LEFT) return this.position = xy(1, 1);
      if (scope.BOTTOM) return this.position = xy(-1, -1);
      return this.position = xy(-1, 1);
    };

    if (directionX && !directionY) {
      if (scope.RIGHT && scope.TOP) return xy(-1, 1);

      if (scope.RIGHT) return this.position = xy(-1, -1);
      if (scope.TOP) return this.position = xy(1, 1);
      return this.position = xy(1, -1);
    };

    if (directionX && directionY) {
      if (scope.RIGHT && scope.BOTTOM) return xy(-1, -1);

      if (scope.RIGHT) return this.position = xy(-1, 1);
      if (scope.BOTTOM) return this.position = xy(1, -1);
      return this.position = xy(1, 1);
    };
  }
};
},{"./config":19,"./positionMethod":18}],17:[function(require,module,exports) {
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

exports.circle = function (x, y, r, all, now) {
  var ang = Math.PI * 2 / all;
  return {
    x: x + r * Math.cos(ang * now),
    y: y + r * Math.sin(ang * now)
  };
};
},{"./config":19}],34:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _positionMethod = require('./positionMethod');

exports.default = {
  normal: function normal(bulletPs, time) {
    var time = 45;
    var prePs = bulletPs;
    var count = time;
    return function (taPs, clear) {
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

      if (clear) {
        time = null;
        prePs = null;
        count = null;
      }
      return {
        position: (0, _positionMethod.sXsYToPosition)(x, y),
        x: realX,
        y: realY,
        look: 'laser',
        w: 20,
        h: 60,
        clear: count < -1
      };
    };
  },
  track: function track(bulletPs, clear) {
    var prePs = bulletPs;
    var time;
    var count;
    var p1 = null;
    var _p1 = null;
    return function (taPs) {
      var p0 = (0, _positionMethod.positionTosXsY)(prePs);
      if (!p1) {
        p1 = (0, _positionMethod.positionTosXsY)(taPs);
        time = Math.floor(Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y)) * 2);
        count = time - 1;
      }
      var t = 1 / time * (time - count);
      var x = Math.round(p0.x + (p1.x - p0.x) * t);
      var y = Math.round(p0.y + (p1.y - p0.y) * t);

      var _p0 = (0, _positionMethod.positionToXY)(prePs);
      var marginX = _config.pixelWeigth / 2;
      var marginY = 0;

      if (!_p1) _p1 = (0, _positionMethod.positionToXY)(taPs);
      var realX = _p0.x + marginX + (_p1.x - _p0.x + marginX) * t;
      var realY = _p0.y + marginY + (_p1.y - _p0.y + marginY) * t;
      count--;

      if (clear) {
        time = null;
        prePs = null;
        count = null;
        p1 = null;
        _p1 = null;
      }

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
},{"./config":19,"./positionMethod":18}],14:[function(require,module,exports) {
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
    if (_lookPath2.default[this.look](this.position, 'GETMAP').includes(bulletPs)) {
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
    this.grapic(viewDom);
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
    var explosion = document.getElementById("explosion");
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(50, function (renCount, viewDom) {
      viewDom.drawImage(explosion, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
    }));
    obj = null;
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
},{"./lookPath":11,"./movePathList":12,"./aniEffectMethod":17,"./positionMethod":18,"./enemyBulletType":34,"./config":19}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (renCount, ruleObj) {
  var rule = script[renCount];
  if (rule) {
    Object.keys(rule).forEach(function (key) {
      ruleObj[key] = rule[key];
    });
  }
};

var _config = require('./config');

var _createEnemy = require('./createEnemy');

var _createEnemy2 = _interopRequireDefault(_createEnemy);

var _aniEffectMethod = require('./aniEffectMethod');

var _positionMethod = require('./positionMethod');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// enemy
var Zark0 = {
  name: 'ZARK-ZERO',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: 'gostMove',
  moveTime: 5,
  look: 'zark',
  bulletType: 'normal'
};

var Zark1 = {
  name: 'ZARK-PLUS',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 81, 9],
  movePath: 'gostMove',
  moveTime: 3,
  look: 'zark',
  bulletType: 'normal'
};

var Fort0 = {
  name: 'FORT',
  life: 1,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [200, 54, 9],
  movePath: 'goToOut',
  moveTime: 5,
  look: 'fort',
  bulletType: 'track'
};

var circleKiller = {
  name: 'test',
  life: 20,
  // position: Math.floor(Math.random() * w),
  shot: true,
  shotTime: [100, 54, 9],
  movePath: 'pingpong',
  moveTime: 3,
  look: 'CIRCLE',
  position: Math.round(_config.w / 3) - 5,
  bulletType: 'track'
};

var circleKiller2 = Object.assign({}, circleKiller, { position: Math.round(_config.w / 3) * 2 + 5 });

// enhancing item
// restoreLife:['liftReset','liftMax-6','liftRestore-6'],
// changeBullet:[],

var GreenPoint = {
  name: 'greenPoint',
  movePath: 'pingpong',
  moveTime: 10,
  restoreLife: ['liftMax-2', 'liftReset'],
  look: 'hp+',
  color: 'rgba(0,255,0,1)',
  effect: function effect(ship) {
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(80, function (renCount, viewDom) {
      var p0 = (0, _positionMethod.positionToXY)(ship.position);
      var all = 5;
      for (var i = 1; i <= all; i++) {
        var nowPs = (0, _aniEffectMethod.circle)(p0.x, p0.y, 1.5 * renCount, all, i);
        viewDom.fillStyle = 'rgba(0,255,0,.8)';
        viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
      }
    }));
  }
};

var hp_1 = {
  name: 'greenPoint',
  movePath: 'pingpong',
  moveTime: 10,
  restoreLife: ['liftRestore-1'],
  look: 'hp+',
  color: 'rgba(255,255,0,1)',
  effect: function effect(ship) {
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(80, function (renCount, viewDom) {
      var p0 = (0, _positionMethod.positionToXY)(ship.position);
      var all = 5;
      for (var i = 1; i <= all; i++) {
        var nowPs = (0, _aniEffectMethod.circle)(p0.x, p0.y, 1.5 * renCount, all, i);
        viewDom.fillStyle = 'rgba(255,255,0,.8)';
        viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
      }
    }));
  }
};

var TrebleBullet = {
  name: 'greenPoint',
  movePath: 'pingpong',
  moveTime: 10,
  changeBullet: 'treble',
  look: 'hp+',
  color: 'rgba(255,0,0,1)',
  effect: function effect(ship) {
    ship.look = 'TALONS';
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(80, function (renCount, viewDom) {
      var p0 = (0, _positionMethod.positionToXY)(ship.position);
      var all = 5;
      for (var i = 1; i <= all; i++) {
        var nowPs = (0, _aniEffectMethod.circle)(p0.x, p0.y, 1.5 * renCount, all, i);
        viewDom.fillStyle = 'rgba(255,0,0,.8)';
        viewDom.fillRect(nowPs.x, nowPs.y, 15, 15);
      }
    }));
  }
};

var script = {
  0: {
    enemy: [Zark0],
    enemyPolling: [20, 100],
    enemyQuantity: 1,
    stopCount: false
  },
  800: {
    enemy: [Zark0, Fort0],
    enemyPolling: [15, 80],
    enemyQuantity: 1
  },
  1600: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 75],
    enemyQuantity: 1
  },
  1601: {
    item: [GreenPoint]
  },
  1700: {
    enemy: []
  },
  1800: {
    item: [hp_1]
  },
  1805: {
    boss: [circleKiller],
    stopCount: true
  },
  1806: {
    boss: [circleKiller2],
    stopCount: true
  },
  1809: {
    stopCount: false
  },
  1820: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 75],
    item: [TrebleBullet]
  },
  2100: {
    enemy: [Zark1, Fort0],
    enemyPolling: [15, 55],
    item: [GreenPoint]
  },
  3400: {
    item: [hp_1]
  },
  4500: {
    enemyPolling: [15, 45]
  },
  5600: {
    item: [hp_1]
  },
  5700: {
    enemyPolling: [10, 35]
  }

};

;
},{"./config":19,"./createEnemy":14,"./aniEffectMethod":17,"./positionMethod":18}],32:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _positionMethod = require('./positionMethod');

function normal(bulletPs, arr, time) {
  var prePs = bulletPs;
  function pathFn(taPs) {
    prePs -= _config.w;
    var realPosition = (0, _positionMethod.positionToXY)(prePs);
    return {
      position: prePs,
      x: realPosition.x,
      y: realPosition.y,
      look: 'shipBulletNormal',
      w: 20,
      h: 60,
      clear: prePs < 0
    };
  }
  arr.push({ data: pathFn(), fn: pathFn });
};

exports.default = {
  normal: normal,
  treble: function treble(bulletPs, arr, time) {
    normal(bulletPs, arr);
    if (bulletPs % _config.w > 1) normal(bulletPs - 1, arr);
    if (bulletPs % _config.w < _config.w - 1) normal(bulletPs + 1, arr);
  }
};
},{"./config":19,"./positionMethod":18}],15:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.deadPosition = obj.position; //復活位置
  this.position = obj.position; //位置
  this.prePosition;
  this.killCount = 0; //擊殺數
  this.bullet = []; //子彈陣列
  this.bulletType = 'normal';
  this.look = obj.look;
  this.isDead = false;
  this.shotFps = 8;
  this.maxLife = obj.life;

  var deadCb = obj.deadCb || function () {};
  var hit = false;

  this.wasHit = function (data) {
    var bulletPs = data.bulletPs,
        bulletIndex = data.bulletIndex,
        viewDom = data.viewDom,
        shipPath = data.shipPath;


    if (shipPath.includes(bulletPs) || shipPath.includes(bulletPs + _config.w)) {
      this.life--;
      _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(10, function (renCount, viewDom) {
        shipPath.forEach(function (ps, index) {
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

  this.touch = function (data) {
    var viewDom = data.viewDom,
        shipPath = data.shipPath,
        touchEnemy = data.touchEnemy;


    var me = this;
    if (touchEnemy) {
      this.life--;
      _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(10, function (renCount, viewDom) {
        shipPath.forEach(function (ps, index) {
          var psObj = (0, _positionMethod.positionToXY)(ps);
          viewDom.fillStyle = 'rgba(255,0,0,.8)';
          viewDom.fillRect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth + 1);
        });
      }.bind(this)));
      if (this.life < 1) {
        this.life = 0;
        this.isDead = true;
        this.dead();
      }
    }
  };

  this.shot = function () {
    if (!this.isDead) {
      //
      _shipBulletType2.default[this.bulletType](this.position, this.bullet);
      //
      var shotPositon = this.position;
      _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(30, function (renCount, viewDom) {
        var margin1 = 4 + Math.random() * 20;
        var margin2 = 4 + Math.random() * 20;
        var margin3 = Math.random() * 5;
        var margin4 = Math.random() * 5;
        var ap0 = (0, _positionMethod.positionToXY)(shotPositon);
        var t = 1 / 30 * (30 - renCount);

        var ax = (1 - t) * (1 - t) * ap0.x + 2 * t * (1 - t) * ap0.x + t * t * (ap0.x - margin1);
        var ay = (1 - t) * (1 - t) * ap0.y + 2 * t * (1 - t) * (ap0.y - margin1) + t * t * (ap0.y - margin1);
        var bx = (1 - t) * (1 - t) * ap0.x + 2 * t * (1 - t) * ap0.x + t * t * (ap0.x + margin2);
        var by = (1 - t) * (1 - t) * ap0.y + 2 * t * (1 - t) * (ap0.y - margin2) + t * t * (ap0.y - margin2);

        viewDom.fillStyle = renCount % 2 ? 'rgba(255,255,255,.8)' : 'rgba(255,255,0,.8)';
        viewDom.fillRect(ax - margin3, ay, 3, 3);
        viewDom.fillRect(bx + margin4, by, 3, 3);
      }));
    }
  };

  this.grapic = function (viewDom) {
    var _ = this;
    var _wasHit = this.wasHit.bind(this);
    var _touch = this.touch.bind(this);
    var isDead = this.isDead;
    var path = _lookPath2.default[this.look](this.position, this.lookType);
    bulletPosition.call(this);
    grapicBullet.call(this, viewDom);

    if (!isDead) {
      _lookPath2.default[this.look](this.position, this.lookType).forEach(function (ps, index) {
        var psObj = (0, _positionMethod.positionToXY)(ps);
        viewDom.beginPath();
        viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth + 1);
        viewDom.fillStyle = 'white';
        viewDom.fill();
      });

      // touchEnemy
      var enemyMap = _config.renderData.enemy.reduce(function (total, el) {
        return [].concat(_toConsumableArray(total), _toConsumableArray(_lookPath2.default[el.look](el.position)));
      }, []);
      var touchEnemy = path.reduce(function (total, el) {
        //console.log('arr',enemyMap, el);
        return total || enemyMap.includes(el);
      }, false);

      _touch({
        touchEnemy: touchEnemy,
        viewDom: viewDom,
        shipPath: path
      });

      // was hit
      _config.renderData.enemyBullet.forEach(function (bullet, index) {
        _wasHit({
          bulletPs: bullet.data.position,
          bulletIndex: index,
          viewDom: viewDom,
          shipPath: path
        });
      });

      // touch item
      _config.renderData.item.forEach(function (item, index) {
        var itemMap = _lookPath2.default[item.look](item.position);
        var touchItem = path.reduce(function (total, el) {
          return total || itemMap.includes(el);
        }, false);
        if (touchItem) {
          item.wasPickUp(_);
        }
      });
    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = (0, _positionMethod.positionToXY)(position);
    var explosion = document.getElementById("explosion");
    _config.renderData.aniEffect.push((0, _aniEffectMethod.animation)(50, function (renCount, viewDom) {
      viewDom.drawImage(explosion, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
      //console.log(renCount);
      if (renCount == 50) {
        this.life = obj.life;
        this.maxLife = obj.life;
        this.position = this.deadPosition;
        this.isDead = false;
        this.bullet = [];
        this.bulletType = 'normal';
        this.look = obj.look;
      }
    }.bind(this)));
    deadCb();
  };
};

var _lookPath = require('./lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _shipBulletType = require('./shipBulletType');

var _shipBulletType2 = _interopRequireDefault(_shipBulletType);

var _aniEffectMethod = require('./aniEffectMethod');

var _positionMethod = require('./positionMethod');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function bulletPosition() {
  var bulletArr = this.bullet;
  for (var key in bulletArr) {
    bulletArr[key].data = bulletArr[key].fn();
    if (bulletArr[key].data.clear) {
      bulletArr.splice(key, 1);
    };
  }
}

function grapicBullet(viewDom) {
  var enemyBulleArr = _config.renderData.enemyBullet;

  var thisBullet = this.bullet;

  thisBullet.map(function (el) {
    var ps = el.data.position;
    var bulletImg = document.getElementById(el.data.look);

    viewDom.drawImage(bulletImg, el.data.x - 13 / 2, el.data.y - 5, 13, 64);

    // defense
    enemyBulleArr.forEach(function (enemyBullet, index) {
      if (enemyBullet.data.position === ps) {
        enemyBulleArr.splice(index, 1);
        thisBullet.splice(thisBullet.indexOf(el), 1);
      }
      if (enemyBullet.data.position === ps + _config.w) {
        enemyBulleArr.splice(index, 1);
        thisBullet.splice(thisBullet.indexOf(el), 1);
      }
    });

    // kill enemy
    _config.renderData.enemy.map(function (obj) {
      obj.wasHit(ps, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(el), 1);
      });
      obj.wasHit(ps + _config.w, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(el), 1);
      });
    });
  });
}
},{"./lookPath":11,"./movePathList":12,"./shipBulletType":32,"./aniEffectMethod":17,"./positionMethod":18,"./config":19}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  this.name = obj.name; //名字
  this.mainX = obj.position;
  this.position = obj.position; //位置
  this.movePath = obj.movePath; //移動的路徑類型
  this.moveTime = obj.moveTime || 1; // 移動間隔
  this.color = obj.color;
  this.look = obj.look;

  this.restoreLife = obj.restoreLife || [];
  this.changeBullet = obj.changeBullet || '';

  var effect = obj.effect || function () {};
  var survivalTime = 0;

  this.getST = function () {
    return survivalTime;
  };

  this.grapic = function (viewDom) {
    var color = this.color;
    _lookPath2.default[this.look](this.position).forEach(function (ps, index) {
      var psObj = (0, _positionMethod.positionToXY)(ps);
      viewDom.beginPath();
      viewDom.rect(psObj.x - _config.pixelWeigth / 2, psObj.y, _config.pixelWeigth, _config.pixelWeigth);
      viewDom.fillStyle = color;
      viewDom.fill();
    });
  };

  this.action = function (renderType, viewDom, shipPs) {
    this.grapic(viewDom);
    if (renderType === 'OBJ_MOVE') {
      itemMove.call(this);
      survivalTime++;
    }
  };

  this.wasPickUp = function (ship) {
    _config.renderData.item.splice(_config.renderData.item.indexOf(this), 1);
    var position = this.position;
    var deadPs = (0, _positionMethod.positionToXY)(position);
    var restoreLife = this.restoreLife;
    var changeBullet = this.changeBullet;

    // restoreLife
    if (restoreLife.length > 0) {
      restoreLife.forEach(function (val) {
        var action = val.split('-');
        restoreLifeAction(action[0], action[1], ship);
      });
    }

    // changeBullet
    if (changeBullet) {
      ship.bulletType = changeBullet;
    }

    effect(ship);
    delete this;
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

function restoreLifeAction(type, value, ship) {
  //'liftReset','liftMax-6','liftRestore-6'
  var actionMap = {
    liftReset: function liftReset(ship) {
      ship.life = ship.maxLife;
    },
    liftMax: function liftMax(ship, value) {
      var val = parseInt(value);
      ship.maxLife += val;
    },
    liftRestore: function liftRestore(ship, value) {
      var val = parseInt(value);
      if (ship.life + val > ship.maxLife) {
        return ship.life = ship.maxLife;
      }
      return ship.life += val;
    }
  };

  if (actionMap[type]) actionMap[type](ship, value);
}

function itemMove() {
  if (_movePathList2.default[this.movePath] && this.getST() % this.moveTime == 0) _movePathList2.default[this.movePath].call(this);
}
},{"./lookPath":11,"./movePathList":12,"./aniEffectMethod":17,"./positionMethod":18,"./config":19}],2:[function(require,module,exports) {
'use strict';

require('./main.css');

var _lookPath = require('./js/lookPath');

var _lookPath2 = _interopRequireDefault(_lookPath);

var _movePathList = require('./js/movePathList');

var _movePathList2 = _interopRequireDefault(_movePathList);

var _script = require('./js/script');

var _script2 = _interopRequireDefault(_script);

var _createEnemy = require('./js/createEnemy');

var _createEnemy2 = _interopRequireDefault(_createEnemy);

var _createShip = require('./js/createShip');

var _createShip2 = _interopRequireDefault(_createShip);

var _createItem = require('./js/createItem');

var _createItem2 = _interopRequireDefault(_createItem);

var _aniEffectMethod = require('./js/aniEffectMethod');

var _positionMethod = require('./js/positionMethod');

var _config = require('./js/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      ship.lookType = 'OPEN';
    }, 1000 / ship.shotFps);
  }
}

function closeShot() {
  clearInterval(shotFn);
  ship.lookType = 'CLOSE';
  shotFn = null;
}

function bulletPosition(shipPs) {
  var enemyBulleArr = _config.renderData.enemyBullet;
  for (var key in enemyBulleArr) {
    enemyBulleArr[key].data = enemyBulleArr[key].fn(shipPs);
    if (enemyBulleArr[key].data.clear) {
      enemyBulleArr[key].fn(shipPs, true);
      enemyBulleArr.splice(key, 1);
    };
  }
}

function clearRenderData() {
  _config.renderData.enemy = [];
  // renderData.enemyBullet = [];
  // renderData.aniEffect = [];
  _config.renderData.item = [];
}

var ship = new _createShip2.default({
  name: 'MK-2',
  life: _config.shipLife,
  position: _config.w * Math.floor(_config.h / 2) - Math.floor(_config.w / 2),
  deadPosition: _config.w * Math.floor(_config.h / 2) - Math.floor(_config.w / 2),
  look: 'MK-2',
  deadCb: function deadCb(ship) {
    killCount = 0;
    renCount = 0;
    nextPolling = 100;
    clearRenderData();
  }
});

function gaphic(TYPE) {
  var bestScore = localStorage.getItem('bestScore') || 0;
  var bestMileage = localStorage.getItem('bestMileage') || 0;
  var stopCount = ruleObj.stopCount;
  var boss = ruleObj.boss || [];
  (0, _script2.default)(renCount, ruleObj);
  if (TYPE === 'OBJ_MOVE') {
    var createObj = false;
    var item = ruleObj.item;

    // enemy push
    if (renCount == nextPolling && !stopCount) {
      for (var x = 0; x < ruleObj.enemyQuantity; x++) {
        var enemyObj = ruleObj.enemy[renCount % ruleObj.enemy.length];
        if (enemyObj) {
          enemyObj.position = Math.floor(Math.random() * _config.w);
          enemyObj.deadCb = function () {
            killCount++;
            if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
          };
          _config.renderData.enemy.push(new _createEnemy2.default(enemyObj));
        }
      }
      if (ruleObj.enemyPolling) {
        nextPolling = renCount + Math.floor(Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]);
      }
    }

    // boss push
    if (boss.length) {
      var defPosition = Math.floor(Math.random() * _config.w);
      boss.forEach(function (enemyObj, index) {
        console.log(enemyObj.position);
        enemyObj.deadCb = function () {
          killCount++;
          if (bestScore < killCount) localStorage.setItem('bestScore', killCount);
          renCount++;
        };
        _config.renderData.enemy.push(new _createEnemy2.default(enemyObj));
      });
      ruleObj.boss = [];
      renCount++;
    }
    //

    if (item) {
      item.forEach(function (itemData) {
        itemData.position = Math.floor(Math.random() * _config.w);
        _config.renderData.item.push(new _createItem2.default(itemData));
      });
      ruleObj.item = null;
    }

    bgCount++;
    !stopCount && renCount++;
    if (bestMileage < renCount) localStorage.setItem('bestMileage', renCount);
  }

  if (TYPE === 'BULLET_MOVE') {
    bulletPosition(ship.position);
  }

  //canvas
  var viewDom = document.getElementById('view').getContext('2d');
  viewDom.clearRect(0, 0, _config.vwidth, _config.vheight);

  // ship
  ship.grapic(viewDom);

  //enmyBullet
  _config.renderData.enemyBullet.map(function (bullt) {
    var bulletObj = (0, _positionMethod.positionToXY)(bullt.data.position);
    //viewDom.drawImage(enemyImg, bulletObj.x - 15 / 2, bulletObj.y - 5, 15, 15);
    var enemyImg = document.getElementById(bullt.data.look);
    viewDom.drawImage(enemyImg, bullt.data.x - 15 / 2, bullt.data.y - 5, bullt.data.w, bullt.data.h);
  });

  // enmy
  _config.renderData.enemy.forEach(function (obj) {
    obj.action(TYPE, viewDom, ship.position);
  });

  // item
  _config.renderData.item.forEach(function (obj) {
    obj.action(TYPE, viewDom, ship.position);
  });

  // effect
  _config.renderData.aniEffect.forEach(function (el) {
    el(viewDom);
  });

  //bg
  document.getElementById('view').style.backgroundPositionY = bgCount + 'px';

  document.getElementById('score').innerHTML = 'Score: <div class="score">' + killCount + '</div><br/> Mileage: ' + renCount + '<br/>Best score: ' + (localStorage.getItem('bestScore') || 0) + '<br/> Best Mileage: ' + bestMileage + '<br/> Life: ' + ship.life + '/' + ship.maxLife;

  document.getElementById('life').style.width = 100 / ship.maxLife * ship.life + '%';
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
    var x = Math.floor(event.touches[0].pageX / _config.pixelWeigth);
    var y = Math.floor(event.touches[0].pageY / _config.pixelWeigth);
    var _ps = _config.w * y + x;
    ship.position = _ps;
    shotDriver();
    //document.getElementById("debug").innerHTML = "Touch moved (" + x + "," + y + "), " + (w * y + x);
  }
}

document.getElementById('view').height = _config.vheight;
document.getElementById('view').width = _config.vwidth;

setInterval(function () {
  render('OBJ_MOVE');
  //
  render('CONTROL_MOVE');
  !_config.atc.isMobile() && actionMove(ship);
  //
  render('BULLET_MOVE');
}, _config.renderTime);

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
},{"./main.css":10,"./js/lookPath":11,"./js/movePathList":12,"./js/script":13,"./js/createEnemy":14,"./js/createShip":15,"./js/createItem":16,"./js/aniEffectMethod":17,"./js/positionMethod":18,"./js/config":19}],36:[function(require,module,exports) {

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '62966' + '/');
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
},{}]},{},[36,2])
//# sourceMappingURL=/dist/spacewar.map