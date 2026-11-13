import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {Vector3} from 'three';
import {createKaijuModel,poseKaiju,createKaijuCamera} from '../js/kaijuModel.mjs';
import {sampleKaijuSequence,createKaijuController,KAIJU_CYCLE} from '../js/kaijuSequence.mjs';
import {createKaijuAttack} from '../js/kaijuAttack.mjs';

test('kaiju stops for charge, opens its jaw for flame, then sweeps a narrow beam and cools down',()=>{
  assert.equal(sampleKaijuSequence(0).phase,'walk');
  const charge=sampleKaijuSequence(220),flame=sampleKaijuSequence(275),beam=sampleKaijuSequence(360),cool=sampleKaijuSequence(520);
  assert.equal(charge.phase,'charge');assert.equal(charge.walking,0);assert.equal(charge.firing,0);
  assert.equal(flame.phase,'flame');assert.ok(flame.jaw>.6);assert.equal(flame.beam,0);
  assert.equal(beam.phase,'beam');assert.equal(beam.flame,0);assert.ok(beam.beam>.99);
  assert.ok(sampleKaijuSequence(310).sweep<sampleKaijuSequence(400).sweep);
  assert.equal(cool.firing,0);assert.equal(sampleKaijuSequence(KAIJU_CYCLE).phase,'walk');
});

test('heavy gait moves only on footfalls and stays in bounds on narrow screens',()=>{
  for(const width of [21,26,45]){
    const enemy={position:width-1},player={position:50*width};let steps=0;
    const controller=createKaijuController(enemy,{width,height:56,onStep:()=>steps++});
    let moves=0,previous=enemy.position;
    for(let tick=0;tick<1120;tick++){
      controller.update(player);
      const row=Math.floor(enemy.position/width),x=enemy.position%width;
      assert.ok(x>=4&&x<width-4);assert.ok(row<56);
      if(enemy.position!==previous){moves++;assert.equal(controller.state.stomp,true);assert.ok(controller.state.walking>.5);}
      previous=enemy.position;
    }
    assert.ok(steps>2&&moves>0&&moves<20);
  }
});

test('low-poly rig retains independent jaw animation and an oblique camera with a stable mouth projection',()=>{
  const model=createKaijuModel(),camera=createKaijuCamera();
  assert.ok(model.stats.triangles<=1300);assert.ok(model.stats.drawCalls<=70);
  const closed={...sampleKaijuSequence(200),walkTime:3};poseKaiju(model,closed);
  const closedAngle=model.jaw.rotation.x;
  const active={...sampleKaijuSequence(350),walkTime:4};poseKaiju(model,active);
  assert.ok(model.jaw.rotation.x>closedAngle+.5);
  assert.ok(camera.position.z>10&&camera.position.y>camera.position.z);
  const mouth=model.muzzle.getWorldPosition(new Vector3()).project(camera);
  assert.ok(Math.abs(mouth.x)<1&&Math.abs(mouth.y)<1);
  model.root.traverse(node=>assert.ok(node.matrixWorld.elements.every(Number.isFinite)));
  const other=createKaijuModel();poseKaiju(other,closed);
  assert.notEqual(model.jaw.rotation.x,other.jaw.rotation.x);
});

function combat(){
  const enemy={position:400,previousPosition:400,life:10,kaiju:{state:sampleKaijuSequence(200),mouth:{x:100,y:100},direction:{x:0,y:1}}};
  let hits=0,breaks=0;const cues=[];
  const ship={position:500,isDead:false,injured(){hits++;}};
  let points=[{x:100,y:300,radius:7.5}];
  const world={cache:{get:()=>({points})}};
  const attack=createKaijuAttack(enemy,{pixel:15,width:390,height:844,toXY:(_ps,out)=>Object.assign(out,{x:100,y:100}),onStage:s=>cues.push(s),onShieldBreak:()=>breaks++});
  return {enemy,ship,attack,world,cues,hits:()=>hits,breaks:()=>breaks,points:value=>points=value};
}

test('charge cannot hurt the player; flame is a bounded cone and beam damage matches its visible ray',()=>{
  const h=combat();h.attack.update(h.ship,h.world);assert.equal(h.hits(),0);
  sampleKaijuSequence(275,h.enemy.kaiju.state);h.attack.update(h.ship,h.world);assert.equal(h.hits(),0,'outside flame reach');
  h.points([{x:112,y:220,radius:7.5}]);h.attack.update(h.ship,h.world);assert.equal(h.hits(),1);
  sampleKaijuSequence(350,h.enemy.kaiju.state);h.points([{x:100,y:700,radius:7.5}]);h.attack.update(h.ship,h.world);assert.equal(h.hits(),2);
  h.points([{x:140,y:700,radius:7.5}]);h.attack.update(h.ship,h.world);assert.equal(h.hits(),2);
  assert.deepEqual(h.cues,['charge','flame','beam']);
});

test('a shield blocks the ray at its nearest live segment, burns gradually, and holes pass damage',()=>{
  const h=combat();sampleKaijuSequence(350,h.enemy.kaiju.state);
  const particle={x:100,y:200,alive:true};h.ship.airShield={phase:'ready',particles:[particle]};
  h.attack.update(h.ship,h.world);assert.equal(h.hits(),0);assert.equal(h.breaks(),1);assert.equal(particle.alive,false);
  assert.ok(h.attack.ray.end.y<210);assert.equal(h.attack.ray.blocked,true);
  h.attack.update(h.ship,h.world);assert.equal(h.hits(),1);assert.equal(h.breaks(),1);
  h.enemy.life=0;assert.equal(h.attack.update(h.ship,h.world),true);
  assert.equal(h.hits(),1);
});

test('continuous contact burns at most one shield segment every eight simulation ticks',()=>{
  const h=combat();sampleKaijuSequence(350,h.enemy.kaiju.state);
  h.ship.airShield={phase:'ready',particles:[{x:100,y:200,alive:true},{x:100,y:205,alive:true}]};
  for(let tick=350;tick<358;tick++){sampleKaijuSequence(tick,h.enemy.kaiju.state);h.attack.update(h.ship,h.world);}
  assert.equal(h.breaks(),1);assert.equal(h.hits(),0);
  sampleKaijuSequence(358,h.enemy.kaiju.state);h.attack.update(h.ship,h.world);
  assert.equal(h.breaks(),2);assert.equal(h.hits(),0);
});

test('actual enemy installs only one owned breath skill and never emits the legacy atomic rings',()=>{
  const data={skills:[],enemyBullet:[]};let visualUpdates=0;
  const xy=(ps,out={})=>Object.assign(out,{x:ps%26*15,y:Math.floor(ps/26)*15});
  const context=vm.createContext({createKaijuController,createKaijuAttack,updateKaijuVisual(){visualUpdates++;},
    w:26,h:56,pixelWeigth:15,vwidth:390,vheight:844,positionToXY:xy,renderData:data,
    feedback:{stomp(){},burst(){},destroy(){}},heavyWaveSound(){},explosionSound(){},
    movePathList:{},skillTypeMap:{atomicExplosion(){throw Error('legacy attack');}},bulletTypeMap:{},
  });
  const source=readFileSync(new URL('../js/createEnemy.js',import.meta.url),'utf8').replace(/import[\s\S]*?from\s+["'][^"']+["'];/g,'').replace('export default function (obj)','function Enemy(obj)');
  vm.runInContext(source+'\nthis.Enemy=Enemy;',context);
  const enemy=new context.Enemy({name:'GOZILLA',position:8,life:800,skills:[{type:'atomicExplosion',launchTime:[1,1,1]}]});
  const other=new context.Enemy({name:'GOZILLA',position:18,life:800});
  for(let i=0;i<600;i++){enemy.update({position:26*45+13});other.update({position:26*45+13});}
  assert.equal(data.skills.length,2);assert.equal(enemy.look,'kaiju');assert.equal(visualUpdates,1200);
  assert.notEqual(enemy.kaiju.state,other.kaiju.state);
  assert.equal(data.enemyBullet.length,0);
  enemy.dead();assert.equal(data.skills[0].update({},{}),true);
  assert.equal(data.skills[1].update({isDead:true},{}),false);
});
