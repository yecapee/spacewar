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

function gaphicShip(data) {
  // var color = hit ? 'red' : 'white';
  var viewDom = data.viewDom;
  lookPath[data.lookType](data.position).forEach(function (ps, index) {
    var psObj = positionToXY(ps);
    viewDom.beginPath();
    viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth + 1);
    viewDom.fillStyle = 'white';
    viewDom.fill();
  });
}

function bulletPosition() {
  var bulletArr = this.bullet;
  for (var key in bulletArr) {
    bulletArr[key] = bulletArr[key] - w;
    if (bulletArr[key] < 0) {
      bulletArr.splice(key, 1);
    };
  }
}

function grapicBullet(viewDom) {
  var enemyBulleArr = renderData.enemyBullet;
  var bulletImg = document.getElementById("bulletImg");
  var thisBullet = this.bullet;
  thisBullet.map(function (ps) {
    var bulletObj = positionToXY(ps);
    viewDom.drawImage(bulletImg, bulletObj.x - 13 / 2, bulletObj.y - 5, 13, 64);

    // defense
    if (enemyBulleArr.includes(ps)) {
      enemyBulleArr.splice(enemyBulleArr.indexOf(ps), 1);
      thisBullet.splice(thisBullet.indexOf(ps), 1);
    }
    if (enemyBulleArr.includes(ps + w)) {
      enemyBulleArr.splice(enemyBulleArr.indexOf(ps + w), 1);
      thisBullet.splice(thisBullet.indexOf(ps), 1);
    }

    // kill enemy
    renderData.enemy.map(function (obj) {
      obj.wasHit(ps, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      });
      obj.wasHit(ps + w, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(ps), 1);
      });
    })
  })
}

export default function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.deadPosition = obj.position; //復活位置
  this.position = obj.position; //位置
  this.killCount = 0; //擊殺數
  this.bullet = [], //子彈陣列
  this.look = obj.look;
  this.isDead = false;

  var deadCb = obj.deadCb || function () { };
  var hit = false;
  

  this.wasHit = function (bulletPs, viewDom) {
    // console.log(this.life);
    var me = this;
    if (lookPath[this.look](this.position).includes(bulletPs)) {
      // hit = true;
      this.life--;
      renderData.enemyBullet.splice(renderData.enemyBullet.indexOf(bulletPs), 1);
      if (this.life < 1) {
        this.life = 0;
        this.isDead = true;
        this.dead();
      }
    }
  };

  this.shot = function () {
    if(!this.isDead){
      var bulletArr = this.bullet;
      if (!bulletArr.includes(this.position - w)) bulletArr.push(this.position - w);
    }
  };

  this.grapic = function (viewDom) {
    var color = hit ? 'red' : 'white';
    var _wasHit = this.wasHit.bind(this);
    var isDead = this.isDead;
    if(!isDead){
      lookPath[this.look](this.position).forEach(function (ps, index) {
        //if (hitPath[index]) {    
        var psObj = positionToXY(ps);
        viewDom.beginPath();
        viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth + 1);
        viewDom.fillStyle = color;
        viewDom.fill();
        //}
      });

      renderData.enemyBullet.forEach(function (bulletPs) {
        _wasHit(bulletPs, viewDom, function() {
          console.log('dead');
        });
      })

      bulletPosition.call(this);
      grapicBullet.call(this, viewDom);
    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var enemyImg = document.getElementById("explosion");
    renderData.aniEffect.push(
      animation(50, function (renCount, viewDom) {
        viewDom.drawImage(enemyImg, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
        //console.log(renCount);
        if(renCount == 50){
          this.life = obj.life;
          this.position = this.deadPosition;
          this.isDead = false;
          this.bullet = [];
        } 
      }.bind(this))
    );
    deadCb();
  }

}