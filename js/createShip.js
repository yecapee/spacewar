import lookPath from "./lookPath";
import movePathList from "./movePathList";
import shipBulletType from "./shipBulletType";
import { animation } from "./aniEffectMethod";
import bricks from "./bricks";
import { deadSound } from "./sound";
import skillTypeMap from "./shipSkillType";
import createAirShield from "./airShield.mjs";
import feedback from "./feedback.mjs";
import drawShip from "./shipRenderer.mjs";
import { createShipVisual } from "./shipVisual.mjs";

import { positionToXY, positionTosXsY } from "./positionMethod";
import { w, h, pixelWeigth, renderData, killCount } from "./config";

function bulletPosition() {
  var bulletArr = this.bullet;
  for (var key = bulletArr.length - 1; key >= 0; key--) {
    bulletArr[key].data = bulletArr[key].fn();
    if (bulletArr[key].data.clear) {
      bulletArr.splice(key, 1);
    }
  }
}

function grapicBullet(viewDom) {
  var enemyBulleArr = renderData.enemyBullet;

  var thisBullet = this.bullet;

  thisBullet.slice().forEach(function (el) {
    var ps = el.data.position;
    viewDom.save();
    viewDom.shadowColor = "#74eaff";
    viewDom.shadowBlur = 10;
    viewDom.fillStyle = "#78edff";
    viewDom.fillRect(el.data.x - 3, el.data.y - 10, 6, 24);
    viewDom.fillStyle = "#f0fdff";
    viewDom.fillRect(el.data.x - 1, el.data.y - 10, 2, 18);
    viewDom.restore();

    // A projectile is consumed by its first collision.
    var enemyBulletIndex = enemyBulleArr.findIndex(function (bullet) {
      return bullet.data.position === ps || bullet.data.position === ps + w;
    });
    if (enemyBulletIndex !== -1) {
      enemyBulleArr.splice(enemyBulletIndex, 1);
      thisBullet.splice(thisBullet.indexOf(el), 1);
      return;
    }
    renderData.enemy.slice().some(function (obj) {
      if (obj.wasHit(ps, viewDom) || obj.wasHit(ps + w, viewDom)) {
        thisBullet.splice(thisBullet.indexOf(el), 1);
        return true;
      }
      return false;
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
  this.airShield = null;
  this.path = lookPath[this.look](this.position, this.lookType).map(
    (el) => el.ps
  );
  this.pathObj = lookPath[this.look](this.position, this.lookType);
  this.invincible = false;
  this.invincibleTicks = 0;
  this.flightDirection = null;

  var deadCb = obj.deadCb || function () {};
  var hit = false;
  const shipVisual = createShipVisual(positionToXY(this.position), pixelWeigth);

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
    this.invincibleTicks = 36;
    const impact = positionToXY(this.position);
    feedback.damage(impact.x, impact.y);
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

  this.grapic = function (viewDom) {
    if (this.invincibleTicks > 0) this.invincibleTicks--;
    this.invincible = this.invincibleTicks > 0;
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
      viewDom.save();
      if (this.invincible && this.invincibleTicks % 6 < 3) viewDom.globalAlpha = .3;
      const exhaust = positionToXY(this.position);
      const visual = shipVisual.update(exhaust, {
        firing: this.lookType === 'OPEN',
        upgraded: this.bulletType === 'treble',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        direction: this.flightDirection,
      });
      drawShip(viewDom, exhaust, pixelWeigth * 6, visual);
      viewDom.restore();

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

      if (this.isDead) return;

      // was hit
      for (var index = renderData.enemyBullet.length - 1; index >= 0; index--) {
        _wasHit({
          bulletPs: renderData.enemyBullet[index].data.position,
          bulletIndex: index,
          viewDom: viewDom,
          shipPath: path,
        });
        if (this.isDead) return;
      }

      // touch item
      renderData.item.slice().forEach(function (item, index) {
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

  this.updateShield = function () {
    if (this.airShield && this.airShield.update(positionToXY(this.position), renderData.enemyBullet)) {
      this.airShield = null;
    }
  };

  this.skill = function (keycode) {
    if (this.isDead) return;
    var skill = this.skills.find((skill) => skill.skillKey === keycode);
    if (!skill) return;
    if (skill.type === "airShield") {
      if (!this.airShield) this.airShield = createAirShield(positionToXY(this.position), pixelWeigth, (particle) => feedback.burst(particle.x, particle.y, "#dca4ff", 10, 2.5));
      return;
    }
    skill.skillPoint(this.position).forEach((position) => {
      if (position !== undefined) launchSkillsByShip(position, skill.type, this);
    });
  };

  this.dead = function () {
    this.airShield = null;
    const impact = positionToXY(this.position);
    feedback.destroy(impact.x, impact.y, true);
    deadCb();
  };
}
