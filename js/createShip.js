import lookPath from "./lookPath";
import movePathList from "./movePathList";
import shipBulletType from "./shipBulletType";
import { animation } from "./aniEffectMethod";
import bricks from "./bricks";
import { deadSound } from "./sound";
import skillTypeMap from "./shipSkillType";

import { positionToXY, positionTosXsY } from "./positionMethod";
import { w, h, pixelWeigth, renderData, killCount } from "./config";

function bulletPosition() {
  var bulletArr = this.bullet;
  for (var key in bulletArr) {
    bulletArr[key].data = bulletArr[key].fn();
    if (bulletArr[key].data.clear) {
      bulletArr.splice(key, 1);
    }
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
    });
  });
}

function launchSkillsByShip(position, Type, ship) {
  var skillArr = renderData.shipSkills.push(skillTypeMap[Type](position, ship));
}

export default function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.deadPosition = obj.position; //復活位置
  this.position = obj.position; //位置
  this.prePosition;
  this.killCount = 0; //擊殺數
  this.bullet = []; //子彈陣列
  this.bulletType = "normal";
  this.look = obj.look;
  this.isDead = false;
  this.shotFps = 8;
  this.maxLife = obj.life;
  this.skills = obj.skills || [];
  this.path = lookPath[this.look](this.position, this.lookType).map(
    (el) => el.ps
  );
  this.pathObj = lookPath[this.look](this.position, this.lookType);
  this.invincible = false;

  var deadCb = obj.deadCb || function () {};
  var hit = false;

  this.wasHit = function (data) {
    var { bulletPs, bulletIndex, viewDom, shipPath } = data;

    if (shipPath.includes(bulletPs) || shipPath.includes(bulletPs + w)) {
      this.injured();
      renderData.enemyBullet.splice(bulletIndex, 1);
    }
  };

  this.injured = function () {
    if (this.invincible) return;
    this.invincible = true;
    deadSound();
    this.life--;
    renderData.aniEffect.push(
      animation(
        10,
        function (renCount, viewDom) {
          this.pathObj.forEach(function (ps, index) {
            bricks(ps, viewDom, "rgba(255,0,0,.8)");
          });
        }.bind(this)
      )
    );
    if (this.life < 1) {
      this.life = 0;
      this.isDead = true;
      this.dead();
    }
    setTimeout(
      function () {
        this.invincible = false;
      }.bind(this),
      300
    );
  };

  this.touch = function (data) {
    var { viewDom, touchEnemy, pathObj } = data;

    if (touchEnemy) {
      this.injured();
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
          var t = (1 / 30) * (30 - renCount);

          var ax =
            (1 - t) * (1 - t) * ap0.x +
            2 * t * (1 - t) * ap0.x +
            t * t * (ap0.x - margin1);
          var ay =
            (1 - t) * (1 - t) * ap0.y +
            2 * t * (1 - t) * (ap0.y - margin1) +
            t * t * (ap0.y - margin1);
          var bx =
            (1 - t) * (1 - t) * ap0.x +
            2 * t * (1 - t) * ap0.x +
            t * t * (ap0.x + margin2);
          var by =
            (1 - t) * (1 - t) * ap0.y +
            2 * t * (1 - t) * (ap0.y - margin2) +
            t * t * (ap0.y - margin2);

          viewDom.fillStyle =
            renCount % 2 ? "rgba(255,255,255,.8)" : "rgba(255,255,0,.8)";
          viewDom.fillRect(ax - margin3, ay, 3, 3);
          viewDom.fillRect(bx + margin4, by, 3, 3);
        })
      );
    }
  };

  // this.grapic = function (viewDom, lootype) {
  //   var color = hit ? 'red' : 'white';
  //   if (lootype != _look) {
  //     this.look = lootype;
  //     setLook && clearTimeout(setLook);
  //     setLook = setTimeout(function () {
  //       this.look = _look;
  //     }.bind(this), 200);
  //   }

  //   lookPath[this.look](this.position).forEach(function (ps, index) {
  //     bricks(ps, viewDom, color);
  //   });

  //   if(this.showLife){
  //     var ps = positionToXY(
  //       this.lifeBarPosition(this.position)
  //     );
  //     viewDom.fillStyle = 'rgba(255,255,255,.3)';
  //     viewDom.fillRect(ps.x-50, ps.y, 100, 5);
  //     viewDom.fillStyle = 'orange';
  //     viewDom.fillRect(ps.x-50, ps.y, Math.round(100*this.life/this.maxlife), 5);
  //   }
  // };

  this.grapic = function (viewDom) {
    var _ = this;
    var _wasHit = this.wasHit.bind(this);
    var _touch = this.touch.bind(this);
    var isDead = this.isDead;
    var path = lookPath[this.look](this.position, this.lookType).map(
      (el) => el.ps
    );
    var pathObj = lookPath[this.look](this.position, this.lookType);

    this.path = path;
    this.pathObj = pathObj;
    bulletPosition.call(this);
    grapicBullet.call(this, viewDom);

    if (!isDead) {
      lookPath[this.look](this.position, this.lookType).forEach(function (
        ps,
        index
      ) {
        bricks(ps, viewDom);
      });

      // touchEnemy
      var enemyMap = renderData.enemy.reduce(function (total, el) {
        return [...total, ...lookPath[el.look](el.position).map((el) => el.ps)];
      }, []);
      var touchEnemy = path.reduce(function (total, el) {
        return el === undefined ? false : total || enemyMap.includes(el);
      }, false);

      _touch({
        touchEnemy,
        viewDom,
        pathObj,
      });

      // was hit
      renderData.enemyBullet.forEach(function (bullet, index) {
        _wasHit({
          bulletPs: bullet.data.position,
          bulletIndex: index,
          viewDom: viewDom,
          shipPath: path,
        });
      });

      // touch item
      renderData.item.forEach(function (item, index) {
        var itemMap = lookPath[item.look](item.position).map(function (el) {
          return el.ps;
        });
        var touchItem = path.reduce(function (total, el) {
          return total || itemMap.includes(el);
        }, false);
        if (touchItem) {
          //console.log(JSON.stringify(itemMap),JSON.stringify(path));
          item.wasPickUp(_);
        }
      });
    }
  };

  this.skill = function (keycode) {
    var _this = this;
    var skill = this.skills.find((skill) => skill.skillKey === keycode);
    skill.skillPoint(this.position).forEach(function (position) {
      launchSkillsByShip(position, skill.type, _this);
      isLaunchSkill = true;
      lookType = skill.skillLook;
    });
    // this.grapic(viewDom, lookType);
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var explosion = document.getElementById("explosion");
    renderData.aniEffect.push(
      animation(
        50,
        function (renCount, viewDom) {
          viewDom.drawImage(
            explosion,
            deadPs.x - (50 - renCount) / 2,
            deadPs.y,
            120 - renCount,
            120 - renCount
          );
          //console.log(renCount);
          if (renCount == 50) {
            this.life = obj.life;
            this.maxLife = obj.life;
            this.position = this.deadPosition;
            this.isDead = false;
            this.bullet = [];
            this.bulletType = "normal";
            this.look = obj.look;
          }
        }.bind(this)
      )
    );
    deadCb();
  };
}
