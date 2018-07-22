import lookPath from './lookPath';
import movePathList from './movePathList';
import { animation } from './aniEffectMethod';
import { positionToXY } from './positionMethod';
import bulletTypeMap from './enemyBulletType';
import skillTypeMap from './enemySkillType';
import bricks from './bricks';
import { explosionSound } from './sound';
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

function shotByEnemy(position, bulletType, ship) {
  var bulletArr = renderData.enemyBullet;
  var dataFn = bulletTypeMap[bulletType](position);
  if (!bulletArr.reduce(function (rs, el) { return rs || (el.data.position === position) }, false)) {
    bulletArr.push({
      data: dataFn(ship.position),
      fn: dataFn,
    })
  };
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
  var hit = false;
  var survivalTime = 0;
  var _look = this.look;
  var setLook;

  this.getST = function () {
    return survivalTime;
  };

  this.wasHit = function (bulletPs, viewDom, cb) {
    var me = this;
    var path = lookPath[this.look](this.position).map(el => el.ps);
    if (path.includes(bulletPs)) {
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
        this.grapic.call(this, viewDom, _look);
        if (cb) cb();
      };
    }
  };

  this.grapic = function (viewDom, lootype) {
    var color = hit ? 'red' : 'white';
    if (lootype != _look) {
      this.look = lootype;
      setLook && clearTimeout(setLook);
      setLook = setTimeout(function () {
        this.look = _look;
      }.bind(this), 200);
    }

    lookPath[this.look](this.position).forEach(function (ps, index) {
      bricks(ps, viewDom, color);
    });

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
      hit = false;
    }
    this.grapic(viewDom, lookType);
  };

  this.dead = function () {
    var position = this.position;
    var deadPs = positionToXY(position);
    var explosion = document.getElementById("explosion");
    renderData.aniEffect.push(
      animation(50, function (renCount, viewDom) {
        viewDom.drawImage(explosion, deadPs.x - (50 - renCount) / 2, deadPs.y, 120 - renCount, 120 - renCount);
      })
    );
    obj = null;
    explosionSound();
    deadCb();
  }

}