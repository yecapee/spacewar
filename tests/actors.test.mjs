import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createCollisionWorld } from '../js/collisionWorld.mjs';
import { createProjectileSystem } from '../js/projectileSystem.mjs';
import { sweptBounds, segmentBox } from '../js/engine.mjs';
import { createShipVisual } from '../js/shipVisual.mjs';
import createAirShield from '../js/airShield.mjs';
function harness() {
  const data = {enemy:[],enemyBullet:[],item:[],skills:[],shipSkills:[],aniEffect:[]};
  const xy = (ps,out={}) => Object.assign(out,{x:ps%40*15+7.5,y:Math.floor(ps/40)*15});
  const world = createCollisionWorld(e=>[{ps:e.position,brickType:'0'}],xy,15);
  const projectiles=createProjectileSystem({width:40,height:60,cellWidth:15,cellHeight:15});
  const context = vm.createContext({ world,projectiles,sweptBounds,segmentBox,createShipVisual,createAirShield,
    positionToXY:xy,w:40,h:60,vheight:900,pixelWeigth:15,renderData:data,
    window:{matchMedia:()=>({matches:false})},
    drawShip:Object.assign(()=>{}, {update(){}}),drawEnemy(){},drawProjectile(){},bricks(){},
    feedback:{damage(){},destroy(){},burst(){}},deadSound(){},explosionSound(){},movePathList:{},bulletTypeMap:{},skillTypeMap:{},
    shipBulletType:{normal(ps,array){projectiles.spawn('player',ps,ps,array);}},
    animation:()=>Object.assign(()=>{}, {update:()=>true}),
  });
  for (const [file,name] of [['createShip.js','Ship'],['createEnemy.js','Enemy']]) {
    const source=readFileSync(new URL('../js/'+file,import.meta.url),'utf8').replace(/import[\s\S]*?from\s+["'][^"']+["'];/g,'').replace('export default function (obj)',`function ${name}(obj)`);
    vm.runInContext(source+`\nthis.${name}=${name};`,context);
  }
  const ship=new context.Ship({name:'player',position:50*40+20,life:5,look:'modular'});
  const enemy=(row,life=2,deadCb=()=>{})=>{const e=new context.Enemy({name:'enemy',position:row*40+20,life,look:'zark',shot:false,shotTime:[100,0,1],deadCb});data.enemy.push(e);return e;};
  const update=()=>{world.begin();for(const e of data.enemy)e.update(ship);world.rebuild(data);ship.update();};
  return {data,ship,enemy,world,projectiles,update,xy};
}
const graphics=new Proxy({}, {get:()=>()=>{}});
test('real actors use nearest swept hits and repeated draws never move or damage them',()=>{
  const h=harness(),near=h.enemy(22),far=h.enemy(18);
  const bullet=h.projectiles.spawn('player',26*40+20,0,h.ship.bullet);bullet.age=12;
  h.update();assert.equal(near.life,1);assert.equal(far.life,2);assert.equal(h.ship.bullet.length,0);
  const before=[h.ship.life,h.ship.position,h.ship.invincibleTicks,near.life,near.position,near.getST()];
  for(let i=0;i<100;i++){h.ship.draw(graphics,.5);near.draw(graphics,.5);}
  assert.deepEqual([h.ship.life,h.ship.position,h.ship.invincibleTicks,near.life,near.position,near.getST()],before);
});
test('deferred removals cannot award a kill twice when several projectiles overlap',()=>{
  const h=harness();let deaths=0;const near=h.enemy(22,1,()=>deaths++),far=h.enemy(18);
  for(let i=0;i<2;i++){const b=h.projectiles.spawn('player',26*40+20,0,h.ship.bullet);b.age=12;}
  h.update();assert.equal(deaths,1);assert.equal(near.life,0);assert.equal(near.removed,true);assert.equal(far.life,1);
});
test('real shield resolves a fast shot before the same shot can hurt the hull',()=>{
  const h=harness();h.ship.skill = h.ship.skill.bind(h.ship);
  const center=h.xy(h.ship.position);h.ship.airShield=createAirShield(center,15);
  for(let i=0;i<30;i++)h.ship.airShield.update(center,[]);
  const count=h.ship.airShield.remaining;
  const bullet={data:{x:center.x,y:center.y+30},previousData:{x:center.x,y:center.y-130},dead:false};h.data.enemyBullet.push(bullet);
  h.update();assert.equal(h.ship.life,5);assert.equal(bullet.dead,true);assert.equal(h.ship.airShield.remaining,count-1);
});
