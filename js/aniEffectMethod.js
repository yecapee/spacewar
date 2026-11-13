import { renderData } from './config';
exports.animation = function (totalRenCount, aniFn) {
  var renCount = 0;
  var fn = function (viewDom) { if (renCount > 0) aniFn(renCount, viewDom); };
  fn.update = function () { renCount++; return renCount <= totalRenCount; };
  fn.draw = fn;
  return fn;
};

exports.circle = function (x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  return {
    x: x + r * Math.cos(ang * now + (margin || 0)),
    y: y + r * Math.sin(ang * now + (margin || 0)),
  }
}
