import { renderData } from './config';
exports.animation = function (totalRenCount, aniFn) {
  var renCount = 1;
  var fn = function (viewDom) {
    if (renCount == totalRenCount) {
      renderData.aniEffect.splice(renderData.aniEffect.indexOf(fn), 1);
    }
    aniFn(renCount, viewDom);
    renCount++;
  }
  return fn;
};

exports.circle = function (x, y, r, all, now) {
  var ang = Math.PI *2/all;
  return {
    x: x + r * Math.cos(ang*now),
    y: y + r * Math.sin(ang*now),
  }
}