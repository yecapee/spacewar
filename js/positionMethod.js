import {
  w,
  h,
  pixelWeigth,
} from './config';

var positionTosXsY = function (position) {
  var x = position % w;
  var y = Math.round((position - x) / w);
  return {
    x: x,
    y: y
  };
}

exports.positionToXY = function (ps) {
  var x = ps % w;
  var y = Math.round((ps - x) / w);
  return {
    ps: ps,
    x: x * pixelWeigth + pixelWeigth / 2,
    y: y * window.innerHeight / h,
    __x: x,
    __y: y,
    limit: w * h - 1,
  };
}

exports.xyToPosition = function (x, y) {
  var _x = (x - pixelWeigth / 2) / pixelWeigth;
  var rs = y / pixelWeigth * w + _x;
  return rs;
}

exports.positionTosXsY = positionTosXsY;

exports.sXsYToPosition = function (sx, sy) {
  return sy * w + sx;
}

exports.ezPosition = function (position) {
  var ps = position;
  return function (x, y) {
    var rs = ps + y * w + x;
    return rs;
  };
}

exports.ezPositionWithCheckScope = function (position) {
  var ps = position;
  var psXy = positionTosXsY(ps);
  return function (x, y) {
    var _x = psXy.x + x;
    var _y = psXy.y + y;
    var rs = ps + y * w + x;
    return (_x < 0 || _x > w - 1 || _y < 0 || _y > h - 1) ? undefined : rs;
  };
}

exports.touchScope = function (position) {
  var ps = positionTosXsY(position);
  return {
    TOP: ps.y === 0,
    RIGHT: ps.x === w - 1,
    BOTTOM: ps.y === h - 1,
    LEFT: ps.x === 0,
  }
}

exports.outScope = function (position) {
  var ps = positionTosXsY(position);
  return {
    TOP: ps.y < 0,
    RIGHT: ps.x > w - 1,
    BOTTOM: ps.y > h - 1,
    LEFT: ps.x < 0,
  }
}