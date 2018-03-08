import lookPath from './lookPath';
import movePathList from './movePathList';
import { animation } from './aniEffectMethod';
import { positionToXY } from './positionMethod';
import {
  w,
  h,
  pixelWeigth,
  renderData,
  killCount,
} from './config';

function enemyMove() {
  if (movePathList[this.movePath] && this.getST() % this.moveTime == 0) movePathList[this.movePath].call(this);
}

function shotByEnemy(position) {
  var bulletArr = renderData.enemyBullet;
  if (!bulletArr.includes(position + w)) bulletArr.push(position + w);
}

export default function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.mainX = obj.position;
  this.position = obj.position; //位置
  this.shot = obj.shot; //會不會發射子彈
  this.shotTime = obj.shotTime; //連發數
  this.movePath = obj.movePath; //移動的路徑類型
  this.moveTime = obj.moveTime || 1; // 移動間隔
  this.look = obj.look;

  var deadCb = obj.deadCb || function () { };
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
    if (lookPath[this.look](this.position).includes(bulletPs)) {
      // hitPath[lookPath[this.look](this.position).indexOf(bulletPs)] = false;
      hit = true;
      this.life--;
      if (this.life < 1) {
        renderData.enemy.find(function (el, index) {
          if (el === me) {
            var bestScore = localStorage.getItem('bestScore');
            renderData.enemy.splice(index, 1);
          }
        })
        this.dead();
      } else {
        this.grapic.call(this, viewDom);
        if (cb) cb();
      };

    }
  };

  this.grapic = function (viewDom) {
    var color = hit ? 'red' : 'white';
    lookPath[this.look](this.position).forEach(function (ps, index) {
      //if (hitPath[index]) {    
      var psObj = positionToXY(ps);
      viewDom.beginPath();
      viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth);
      viewDom.fillStyle = color;
      viewDom.fill();
      //}
    });
  };

  this.action = function (renderType, viewDom) {
    this.grapic.call(this, viewDom);
    if (renderType === 'OBJ_MOVE') {
      enemyMove.call(this);
      // if (survivalTime % this.shotTime === 0) {
      if (survivalTime % this.shotTime[0] < this.shotTime[1]) {
        var shotCount = survivalTime % this.shotTime[0];
        if (shotCount % this.shotTime[2] == 0) {
          this.shot && shotByEnemy(this.position);
        }
      };
      survivalTime++;
      hit = false;
    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var enemyImg = document.getElementById("explosion");
    renderData.aniEffect.push(
      animation(50, function (renCount, viewDom) {
        viewDom.drawImage(enemyImg, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
      })
    );
    deadCb();
  }

}