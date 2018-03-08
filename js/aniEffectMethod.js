import { renderData } from './config';
exports.animation = function (totalRenCount,aniFn) {
  var renCount = 1;
  var fn = function (viewDom) {
    if (renCount == totalRenCount) {
      renderData.aniEffect.splice(renderData.aniEffect.indexOf(fn), 1);
    }
    aniFn(renCount,viewDom);    
    renCount++;
  }
  return fn;
};