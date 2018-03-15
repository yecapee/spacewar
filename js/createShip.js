import lookPath from './lookPath';
import movePathList from './movePathList';
import shipBulletType from './shipBulletType';
import { animation } from './aniEffectMethod';
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
  var enemyBulleArr = renderData.enemyBullet;

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
      if (enemyBullet.data.position === ps + w) {
        enemyBulleArr.splice(index, 1);
        thisBullet.splice(thisBullet.indexOf(el), 1);
      }
    });

    // kill enemy
    renderData.enemy.map(function (obj) {
      obj.wasHit(ps, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(el), 1);
      });
      obj.wasHit(ps + w, viewDom, function () {
        thisBullet.splice(thisBullet.indexOf(el), 1);
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
  this.bullet = []; //子彈陣列
  this.bulletType = 'normal';
  this.look = obj.look;
  this.isDead = false;
  this.shotFps = 8;
  this.maxLife = obj.life;

  var deadCb = obj.deadCb || function () { };
  var hit = false;

  this.wasHit = function (data) {
    var {
      bulletPs,
      bulletIndex,
      viewDom,
      touchEnemy,
      shipPath 
    } = data;
    var me = this;
    if (shipPath.includes(bulletPs) || shipPath.includes(bulletPs + w) || touchEnemy) {
      this.life--;
      renderData.aniEffect.push(
        animation(10, function (renCount, viewDom) {
          shipPath.forEach(function (ps, index) {
            var psObj = positionToXY(ps);
            viewDom.fillStyle = 'rgba(255,0,0,.8)';
            viewDom.fillRect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth + 1);
          });
        }.bind(this))
      );
      renderData.enemyBullet.splice(bulletIndex, 1);
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
      shipBulletType[this.bulletType](this.position, this.bullet);
      //
      var shotPositon = this.position;
      renderData.aniEffect.push(
        animation(30, function (renCount, viewDom) {
          var margin1 = 4 + Math.random() * 20;
          var margin2 = 4 + Math.random() * 20;
          var margin3 = Math.random() * 5;
          var margin4 = Math.random() * 5;
          var ap0 = positionToXY(shotPositon);
          var t = 1 / 30 * (30 - renCount);

          var ax = (1 - t) * (1 - t) * ap0.x + 2 * t * (1 - t) * ap0.x + t * t * (ap0.x - margin1);
          var ay = (1 - t) * (1 - t) * ap0.y + 2 * t * (1 - t) * (ap0.y - margin1) + t * t * (ap0.y - margin1);
          var bx = (1 - t) * (1 - t) * ap0.x + 2 * t * (1 - t) * ap0.x + t * t * (ap0.x + margin2);
          var by = (1 - t) * (1 - t) * ap0.y + 2 * t * (1 - t) * (ap0.y - margin2) + t * t * (ap0.y - margin2);

          viewDom.fillStyle = renCount % 2 ? 'rgba(255,255,255,.8)' : 'rgba(255,255,0,.8)';
          viewDom.fillRect(ax - margin3, ay, 3, 3);
          viewDom.fillRect(bx + margin4, by, 3, 3);
        })
      );

    }
  };

  this.grapic = function (viewDom) {
    var _ = this;
    var _wasHit = this.wasHit.bind(this);
    var isDead = this.isDead;
    var path = lookPath[this.look](this.position);
    bulletPosition.call(this);
    grapicBullet.call(this, viewDom);

    if (!isDead) {
      lookPath[this.look](this.position).forEach(function (ps, index) {
        var psObj = positionToXY(ps);
        viewDom.beginPath();
        viewDom.rect(psObj.x - pixelWeigth / 2, psObj.y, pixelWeigth, pixelWeigth + 1);
        viewDom.fillStyle = 'white';
        viewDom.fill();
      });

      //hit or touchEnemy
      var enemyMap = renderData.enemy.reduce(function (total, el) {
        return [...total, ...lookPath[el.look](el.position)]
      }, []);
      var touchEnemy = path.reduce(function (total, el) {
        return total || enemyMap.includes(el);
      }, false);
      renderData.enemyBullet.forEach(function (bullet, index) {
        _wasHit({
          bulletPs: bullet.data.position,
          bulletIndex: index,
          viewDom: viewDom,
          touchEnemy: touchEnemy,
          shipPath: path,
        });
      })

      // touch item
      renderData.item.forEach(function(item, index){
        var itemMap = lookPath[item.look](item.position);
        var touchItem = path.reduce(function (total, el) {
          return total || itemMap.includes(el);
        }, false);  

        if(touchItem){
          item.wasPickUp(_);
        }
      })      

    }
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var explosion = document.getElementById("explosion");
    renderData.aniEffect.push(
      animation(50, function (renCount, viewDom) {
        viewDom.drawImage(explosion, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
        //console.log(renCount);
        if (renCount == 50) {
          this.life = obj.life;
          this.maxLife = obj.life;
          this.position = this.deadPosition;
          this.isDead = false;
          this.bullet = [];
        }
      }.bind(this))
    );
    deadCb();
  }

}