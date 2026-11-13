import lookPath from './lookPath';
import movePathList from './movePathList';
import { animation } from './aniEffectMethod';
import { positionToXY } from './positionMethod';
import bulletTypeMap from './enemyBulletType';
import skillTypeMap from './enemySkillType';
import bricks from './bricks';
import { explosionSound } from './sound';
import feedback from './feedback.mjs';
import drawEnemy from './enemyRenderer.mjs';
import {
  w,
  h,
  pixelWeigth,
  renderData,
  killCount,
  vheight,
} from './config';

function enemyMove() {
  if (movePathList[this.movePath] && this.getST() % this.moveTime == 0) movePathList[this.movePath].call(this);
}

function shotByEnemy(position, bulletType, ship) {
  //var bulletArr = renderData.enemyBullet;
  //var dataFn = 
  bulletTypeMap[bulletType](position, ship);
  // if (!bulletArr.reduce(function (rs, el) { return rs || (el.data.position === position) }, false)) {
  //   bulletArr.push({
  //     data: dataFn(ship.position),
  //     fn: dataFn,
  //   })
  // };
}

function launchSkillsByEnemy(position, Type, ship) {
  //console.log(position, Type, shipPs); 
  var skillArr = renderData.skills.push(
    skillTypeMap[Type](position, ship)
  );

  // var dataFn = bulletTypeMap[bulletType](position);
  // if ( !bulletArr.reduce(function (rs, el) { return rs || (el.data.position === position) }, false) ) {
  //   bulletArr.push({
  //     data: dataFn(shipPs),
  //     fn: dataFn,
  //   })
  // };
}

export default function (obj) {
  this.name = obj.name; //名字
  this.life = obj.life; //生命值
  this.maxlife = obj.life;
  this.showLife = obj.showLife || false; //顯示生命條
  this.mainX = obj.position;
  this.lifeBarPosition = obj.lifeBarPosition || function (position) { return position };
  this.position = obj.position; //位置
  this.previousPosition = obj.position;
  this.shot = obj.shot; //會不會發射子彈
  this.shotTime = obj.shotTime; //連發數
  this.shotPoint = obj.shotPoint || function (position) { return [position] }; //發射點
  this.skillPoint = obj.skillPoint || function (position) { return [position] }; //技能發射點
  this.movePath = obj.movePath; //移動的路徑類型
  this.moveTime = obj.moveTime || 1; // 移動間隔
  this.look = obj.look;
  this.shotLook = obj.shotLook || obj.look;
  this.bulletType = obj.bulletType || 'normal';
  this.skills = obj.skills || [];

  var deadCb = obj.deadCb || function () { };
  var hitFrames = 0;
  var survivalTime = 0;
  var _look = this.look;
  var setLook;

  this.getST = function () {
    return survivalTime;
  };

  this.wasHit = function (bulletPs, viewDom, cb, confirmedContact = false) {
    var me = this;
    var path = lookPath[this.look](this.position).map(el => el.ps);
    if (this.life < 1) return false;
    if (confirmedContact || path.includes(bulletPs)) {
      hitFrames = 4;
      var impact = positionToXY(bulletPs);
      feedback.burst(impact.x, impact.y, '#fff4cf', 5, 1.5);
      this.life--;
      if (this.life < 1) {
        renderData.enemy.find(function (el, index) {
          if (el === me) {
            var bestScore = localStorage.getItem('bestScore');
            renderData.enemy.splice(index, 1);
          }
        })
        this.dead();
      } else if (viewDom) {
        this.grapic.call(this, viewDom, _look);
      };
      if (cb) cb();
      return true;
    }
    return false;
  };

  this.grapic = function (viewDom, lootype) {
    if (lootype != _look) {
      this.look = lootype;
      setLook && clearTimeout(setLook);
      setLook = setTimeout(function () {
        this.look = _look;
      }.bind(this), 200);
    }

    drawEnemy(viewDom, this, lookPath[this.look](this.position), pixelWeigth, positionToXY, hitFrames > 0, vheight / h);

    if(this.showLife){
      var ps = positionToXY(
        this.lifeBarPosition(this.position)
      );
      viewDom.fillStyle = 'rgba(255,255,255,.3)';
      viewDom.fillRect(ps.x-50, ps.y, 100, 5);
      viewDom.fillStyle = 'orange';
      viewDom.fillRect(ps.x-50, ps.y, Math.round(100*this.life/this.maxlife), 5);
    }
  };

  this.action = function (renderType, viewDom, ship) {
    var isLaunchSkill = false;
    var lookType = _look;
    if (renderType === 'OBJ_MOVE') {
      this.previousPosition = this.position;
      enemyMove.call(this);
      this.skills.forEach(function (skill) {
        if (survivalTime % skill.launchTime[0] < skill.launchTime[1]) {
          var launchCount = survivalTime % skill.launchTime[0];
          if (launchCount % skill.launchTime[2] == 0) {
            skill.skillPoint(this.position).forEach(function (position) {
              launchSkillsByEnemy(position, skill.type, ship);
              isLaunchSkill = true;
              lookType = skill.skillLook;
            })
          }
        }
      }.bind(this));

      if (survivalTime % this.shotTime[0] < this.shotTime[1] && !isLaunchSkill) {
        var shotCount = survivalTime % this.shotTime[0];
        if (shotCount % this.shotTime[2] == 0) {
          this.shotPoint(this.position).forEach(function (position) {
            if (this.shot) {
              shotByEnemy(position, this.bulletType, ship);
              lookType = this.shotLook;
            }
          }.bind(this));
        }
      };

      survivalTime++;

    }
    this.grapic(viewDom, lookType);
    if (renderType === 'OBJ_MOVE' && hitFrames > 0) hitFrames--;
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    feedback.destroy(deadPs.x, deadPs.y, this.showLife);
    obj = null;
    explosionSound();
    deadCb();
  }

}
