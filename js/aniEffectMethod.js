import { renderData } from './config';
exports.animation = function (totalRenCount, aniFn) {
  var renCount = 1;
  var fn = function (viewDom) {
    if (renCount == totalRenCount) {
      var index = renderData.aniEffect.indexOf(fn);
      if (index !== -1) renderData.aniEffect.splice(index, 1);
    }
    aniFn(renCount, viewDom);
    renCount++;
  }
  return fn;
};

exports.circle = function (x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  return {
    x: x + r * Math.cos(ang * now + (margin || 0)),
    y: y + r * Math.sin(ang * now + (margin || 0)),
  }
}
