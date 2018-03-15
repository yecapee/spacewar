import lookPath from './lookPath';
import movePathList from './movePathList';
import { animation } from './aniEffectMethod';
import { positionToXY } from './positionMethod';
import {
  w,
  h,
  pixelWeigth,
  renderData,
} from './config';

function restoreLifeAction(type, value, ship) {
  //'liftReset','liftMax-6','liftRestore-6'
  var actionMap = {
    liftReset: function (ship) {
      ship.life = ship.maxLife;
    },
    liftMax: function (ship, value) {
      var val = parseInt(value);
      ship.maxLife += val;
    },
    liftRestore: function (ship, value) {
      var val = parseInt(value);
      if (ship.life + val > ship.maxLife) {
        return ship.life = ship.maxLife;
      }
      return ship.life += val;
    },
  }

  if (actionMap[type]) actionMap[type](ship, value);
}

function itemMove() {
  if (movePathList[this.movePath] && this.getST() % this.moveTime == 0) movePathList[this.movePath].call(this);
}

export default function (obj) {
  this.name = obj.name; //名字
  this.mainX = obj.position;
  this.position = obj.position; //位置
  this.movePath = obj.movePath; //移動的路徑類型
  this.moveTime = obj.moveTime || 1; // 移動間隔
  this.color = obj.color;
  this.look = obj.look;

  this.restoreLife = obj.restoreLife || [];
  this.changeBullet = obj.changeBullet || '';

  var effect = obj.effect || function () { };
  var survivalTime = 0;

  this.getST = function () {
    return survivalTime;
  };

  this.grapic = function (viewDom) {
    var color = this.color;
    lookPath[this.look](this.position).forEach(function (ps, index) {
      var psObj = positionToXY(ps);
      viewDom.beginPath();
      viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth);
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
    renderData.item.splice(renderData.item.indexOf(this), 1);
    var position = this.position;
    var deadPs = positionToXY(position);
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
  }

}

