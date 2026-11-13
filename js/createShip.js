import shipBulletType from './shipBulletType';
import { animation } from './aniEffectMethod';
import bricks from './bricks';
import { deadSound } from './sound';
import skillTypeMap from './shipSkillType';
import createAirShield from './airShield.mjs';
import feedback from './feedback.mjs';
import drawShip from './shipRenderer.mjs';
import { createShipVisual } from './shipVisual.mjs';
import { positionToXY } from './positionMethod';
import { w, pixelWeigth, renderData } from './config';
import world from './world';
import projectiles from './projectiles';
import { sweptBounds, segmentBox } from './engine.mjs';
import { drawProjectile } from './glowSprites.mjs';

export default function (obj) {
  Object.assign(this, { name: obj.name, life: obj.life, maxLife: obj.life, position: obj.position,
    previousPosition: obj.position, simulationPosition: obj.position, deadPosition: obj.position,
    bullet: [], bulletType: 'normal', look: obj.look, isDead: false, shotFps: 8,
    skills: obj.skills || [], airShield: null, invincible: false, invincibleTicks: 0, flightDirection: null });
  const deadCb = obj.deadCb || (() => {});
  const shipVisual = createShipVisual(positionToXY(this.position), pixelWeigth);
  const center = {}, previous = {}, display = {}, bounds = {};
  const nearbyEnemies = [], nearbyBullets = [], nearbyItems = [];
  let visual = null;
  const updatePath = () => {
    const collider = world.cache.get(this);
    this.pathObj = collider.pathObj; this.path = collider.cells;
    return collider;
  };
  this.injured = function () {
    if (this.invincible || this.isDead) return;
    this.invincible = true; this.invincibleTicks = 36;
    positionToXY(this.position, center); feedback.damage(center.x, center.y); deadSound();
    this.life--;
    renderData.aniEffect.push(animation(10, (_age, context) => {
      if (this.pathObj) for (const point of this.pathObj) bricks(point, context, 'rgba(255,0,0,.8)');
    }));
    if (this.life < 1) { this.life = 0; this.isDead = true; this.dead(); }
  };
  this.shot = function () { if (!this.isDead) shipBulletType[this.bulletType](this.position, this.bullet); };
  this.updateShield = function () {
    if (!this.airShield) return;
    positionToXY(this.position, center); positionToXY(this.previousPosition, previous);
    sweptBounds(previous, center, this.airShield.trackingRange + pixelWeigth * 2, bounds);
    world.enemies.query(bounds, nearbyEnemies); world.bullets.query(bounds, nearbyBullets);
    if (this.airShield.update(center, nearbyBullets, nearbyEnemies, bullet => { bullet.dead = true; })) this.airShield = null;
  };
  this.update = function () {
    if (this.invincibleTicks > 0) this.invincibleTicks--;
    this.invincible = this.invincibleTicks > 0;
    const collider = updatePath();
    positionToXY(this.position, center);
    visual = shipVisual.update(center, { firing: this.lookType === 'OPEN', upgraded: this.bulletType === 'treble',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches, direction: this.flightDirection });
    drawShip.update(center, pixelWeigth * 6, visual);
    projectiles.update(this.bullet);
    this.updateShield();
    for (const bullet of this.bullet) {
      if (bullet.dead) continue;
      sweptBounds(bullet.previousData, bullet.data, pixelWeigth, bounds);
      world.bullets.query(bounds, nearbyBullets);
      let hitBullet = null, hitTime = Infinity;
      for (const target of nearbyBullets) {
        if (target.dead) continue;
        const time = segmentBox(bullet.previousData, bullet.data, target.data.x, target.data.y, 7, 15, target.previousData.x, target.previousData.y);
        if (time !== null && time < hitTime) { hitBullet = target; hitTime = time; }
      }
      if (hitBullet) { hitBullet.dead = bullet.dead = true; continue; }
      world.enemies.query(bounds, nearbyEnemies);
      let impact = null, targetEnemy = null;
      for (const target of nearbyEnemies) {
        if (target.enemy.life < 1 || target.enemy.removed) continue;
        const hit = world.hit(bullet.previousData, bullet.data, target);
        if (hit && (!impact || hit.time < impact.time)) { impact = hit; targetEnemy = target.enemy; }
      }
      if (targetEnemy && targetEnemy.wasHit(impact.point.position, undefined, undefined, true)) bullet.dead = true;
    }
    projectiles.cleanup(this.bullet);
    if (!this.isDead) {
      world.enemies.query(collider.bounds, nearbyEnemies);
      for (const target of nearbyEnemies) if (target.enemy.life > 0 && !target.enemy.removed) {
        for (const cell of collider.cells) if (target.cells.has(cell)) { this.injured(); break; }
      }
      world.bullets.query(collider.bounds, nearbyBullets);
      for (const bullet of nearbyBullets) {
        if (!bullet.dead && world.hit(bullet.previousData || bullet.data, bullet.data, collider, 1)) { this.injured(); bullet.dead = true; }
        if (this.isDead) break;
      }
      if (!this.isDead) {
        world.items.query(collider.bounds, nearbyItems);
        for (const target of nearbyItems) if (!target.entity.removed) {
          for (const cell of collider.cells) if (target.cells.has(cell)) { target.entity.wasPickUp(this); break; }
        }
      }
    }
    this.simulationPosition = this.position;
  };
  this.draw = function (context, alpha = 1) {
    for (const bullet of this.bullet) {
      const x = bullet.previousData.x + (bullet.data.x - bullet.previousData.x) * alpha;
      const y = bullet.previousData.y + (bullet.data.y - bullet.previousData.y) * alpha;
      drawProjectile(context, x, y - 1, 'player');
    }
    if (this.isDead || !visual) return;
    positionToXY(this.position, center); positionToXY(this.previousPosition, previous);
    display.x = previous.x + (center.x - previous.x) * alpha; display.y = previous.y + (center.y - previous.y) * alpha;
    context.save(); if (this.invincible && this.invincibleTicks % 6 < 3) context.globalAlpha = .3;
    drawShip(context, display, pixelWeigth * 6, visual, alpha); context.restore();
  };
  this.grapic = this.draw;
  this.skill = function (keycode) {
    if (this.isDead) return;
    const skill = this.skills.find(value => value.skillKey === keycode); if (!skill) return;
    if (skill.type === 'airShield') {
      if (!this.airShield) this.airShield = createAirShield(positionToXY(this.position), pixelWeigth, particle => feedback.burst(particle.x, particle.y, '#dca4ff', 10, 2.5));
    } else for (const position of skill.skillPoint(this.position)) if (position !== undefined) renderData.shipSkills.push(skillTypeMap[skill.type](position, this));
  };
  this.dead = function () {
    this.airShield = null; positionToXY(this.position, center); feedback.destroy(center.x, center.y, true); deadCb();
  };
}
