import {
  positionToXY,
  positionTosXsY
} from './positionMethod';
import {
  w,
  h,
  pixelWeigth,
  renderData,
  killCount,
} from './config';

var brickMap = {
  0: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    viewDom.beginPath();
    viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  1: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;

    viewDom.beginPath();
    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  2: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;

    viewDom.beginPath();
    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  3: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;

    viewDom.beginPath();
    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  4: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth + 1);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  5: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + halfzWidth, psObj.y + halfzWidth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  6: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX + halfzWidth, psObj.y + halfzWidth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  7: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + halfzWidth, psObj.y + halfzWidth);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  8: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + halfzWidth, psObj.y + halfzWidth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  b0: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + halfzWidth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  b1: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + halfzWidth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  d0: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX + halfzWidth, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  d1: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + halfzWidth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  crystal1: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + halfzWidth, psObj.y);
    viewDom.lineTo(defX, psObj.y + pixelWeigth);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + pixelWeigth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  crystal3: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + halfzWidth, psObj.y);
    viewDom.lineTo(defX, psObj.y + halfzWidth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  crystal4: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + halfzWidth);
    viewDom.lineTo(defX + halfzWidth, psObj.y + pixelWeigth);
    viewDom.lineTo(defX, psObj.y + halfzWidth);

    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
  crystal5: function (ps, viewDom, color) {
    var psObj = positionToXY(ps);
    var defX = psObj.x - pixelWeigth / 2;
    var halfzWidth = pixelWeigth / 2;

    viewDom.beginPath();

    viewDom.moveTo(defX + halfzWidth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y);
    viewDom.lineTo(defX + pixelWeigth, psObj.y + halfzWidth);
    viewDom.fillStyle = color || 'white';
    viewDom.fill();
  },
}

export default function (brickObj, viewDom, color) {
  if (!brickObj) return;
  if (typeof brickObj === 'number') {
    return brickMap[0](brickObj, viewDom, color);
  }
  return brickMap[brickObj.brickType](brickObj.ps, viewDom, color);
}