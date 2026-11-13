import world from './world';
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
import {createKaijuController} from './kaijuSequence.mjs';
import {updateKaijuVisual} from './kaijuRenderer.mjs';
import {createKaijuAttack} from './kaijuAttack.mjs';
import {heavyWaveSound} from './sound';
import {
  w,
  h,
  pixelWeigth,
  renderData,
  killCount,
  vheight,
  vwidth,
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
  var lookTicks = 0;
  this.removed = false;
  if (this.name === 'GOZILLA') {
    this.look = 'kaiju'; _look = this.look;
    this.kaiju = createKaijuController(this, {width:w,height:h,onStep:(enemy,foot)=>{
      const at=positionToXY(enemy.position);
      feedback.stomp(at.x+(foot?1:-1)*pixelWeigth,at.y+pixelWeigth*4);
    }});
    this.lifeBarPosition = ps => ps+w*5;
    renderData.skills.push(createKaijuAttack(this,{pixel:pixelWeigth,width:vwidth,height:vheight,toXY:positionToXY,
      onStage:stage=>{if(stage==='flame'||stage==='beam')heavyWaveSound();},
      onShieldBreak:p=>feedback.burst(p.x,p.y,'#dca4ff',8,2)}));
  }

  this.getST = function () {
    return survivalTime;
  };

  this.wasHit = function (bulletPs, viewDom, cb, confirmedContact = false) {
    var me = this;
    var path = world.cache.get(this).cells;
    if (this.life < 1) return false;
    if (confirmedContact || path.has(bulletPs)) {
      hitFrames = 4;
      var impact = positionToXY(bulletPs);
      feedback.burst(impact.x, impact.y, '#fff4cf', 5, 1.5);
      this.life--;
      if (this.life < 1) {
        this.dead();
      }
      if (cb) cb();
      return true;
    }
    return false;
  };

  this.draw = function (viewDom, alpha = 1) {
    if (this.removed || this.life < 1) return;
    const current = positionToXY(this.position), previous = positionToXY(this.previousPosition);
    const dx = (previous.x - current.x) * (1 - alpha), dy = (previous.y - current.y) * (1 - alpha);
    viewDom.save(); viewDom.translate(dx, dy);
    drawEnemy(viewDom, this, world.cache.get(this).pathObj, pixelWeigth, positionToXY, hitFrames > 0, vheight / h);

    if(this.showLife){
      var ps = positionToXY(
        this.lifeBarPosition(this.position)
      );
      viewDom.fillStyle = 'rgba(255,255,255,.3)';
      viewDom.fillRect(ps.x-50, ps.y, 100, 5);
      viewDom.fillStyle = 'orange';
      viewDom.fillRect(ps.x-50, ps.y, Math.round(100*this.life/this.maxlife), 5);
    }
    viewDom.restore();
  };
  this.grapic = this.draw;

  this.update = function (ship) {
    var isLaunchSkill = false;
    var lookType = _look;
    if (!this.removed && this.life > 0) {
      if (this.kaiju) {
        this.previousPosition = this.position;
        this.kaiju.update(ship);
        updateKaijuVisual(this,pixelWeigth,positionToXY,vheight/h);
        survivalTime++; if(hitFrames>0)hitFrames--;
        return;
      }
      if (lookTicks > 0 && --lookTicks === 0) this.look = _look;
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
    if (lookType !== _look) { this.look = lookType; lookTicks = 8; }
    if (hitFrames > 0) hitFrames--;
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    feedback.destroy(deadPs.x, deadPs.y, this.showLife);
    this.removed = true;
    obj = null;
    explosionSound();
    deadCb();
  }

}
