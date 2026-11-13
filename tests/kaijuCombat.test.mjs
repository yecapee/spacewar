import test from 'node:test';
import assert from 'node:assert/strict';
import {Vector3,Quaternion} from 'three';
import {createKaijuModel,poseKaiju,createKaijuCamera} from '../js/kaijuModel.mjs';
import {sampleKaijuSequence,createKaijuController} from '../js/kaijuSequence.mjs';
import {sweepOffset,SWEEP_START,SWEEP_END,SWEEP_ARC} from '../js/kaijuSweep.mjs';
import {projectKaijuColliders,aimKaijuMouthAt,KAIJU_FRAME_CELLS} from '../js/kaijuProjection.mjs';
import {createKaijuAttack} from '../js/kaijuAttack.mjs';
import {createColliderCache} from '../js/engine.mjs';

test('the actual projected mouth ray sweeps 270 degrees with a slow start and faster finish',()=>{
  const model=createKaijuModel(),camera=createKaijuCamera();let total=0,previous=null;
  const measured=[];
  for(let i=0;i<=80;i++){
    const time=SWEEP_START+(SWEEP_END-SWEEP_START)*i/80;
    const state=sampleKaijuSequence(Math.round(time*40));state.walkTime=3;state.bodyHeading=Math.PI/2+sweepOffset(time);
    poseKaiju(model,state);
    const origin=model.muzzle.getWorldPosition(new Vector3()),q=model.muzzle.getWorldQuaternion(new Quaternion());
    const front=new Vector3(0,0,1).applyQuaternion(q).add(origin).project(camera);origin.project(camera);
    const angle=Math.atan2(-(front.y-origin.y),front.x-origin.x);
    if(previous!==null)total+=Math.atan2(Math.sin(angle-previous),Math.cos(angle-previous));
    previous=angle;measured.push(total);
  }
  assert.ok(Math.abs(total-SWEEP_ARC)<.00001);
  assert.ok(measured[80]-measured[60]>(measured[20]-measured[0])*5);
});

test('whole-body turning stays continuous through walking, charging, sweeping and recovery',()=>{
  const width=26,enemy={position:8},player={position:45*width+24};
  const control=createKaijuController(enemy,{width,height:56,random:()=>.5});let heading=Math.PI/2;
  for(let i=0;i<1300;i++){
    if(i===700)player.position=7*width+2;
    control.update(player);
    const delta=Math.atan2(Math.sin(control.state.bodyHeading-heading),Math.cos(control.state.bodyHeading-heading));
    assert.ok(Math.abs(delta)<.065,`unexpected body jump at ${i}: ${delta}`);
    heading=control.state.bodyHeading;
  }
});

test('opening ray passes through the player from the actual moving 3D muzzle, then sweeps from zero',()=>{
  assert.equal(sweepOffset(SWEEP_START),0);assert.ok(Math.abs(sweepOffset(SWEEP_END)-Math.PI*1.5)<1e-8);
  const model=createKaijuModel(),camera=createKaijuCamera(),center={x:220,y:240};
  for(const target of [{x:380,y:700},{x:70,y:550},{x:400,y:100},{x:50,y:100}]){
    const state=sampleKaijuSequence(304);state.walkTime=3;state.bodyHeading=Math.PI/2;
    aimKaijuMouthAt(model,camera,state,center,target,15);
    const p=model.muzzle.getWorldPosition(new Vector3()),q=model.muzzle.getWorldQuaternion(new Quaternion());
    const f=new Vector3(0,0,1).applyQuaternion(q).add(p).project(camera);p.project(camera);
    const mouth={x:center.x+p.x*15*KAIJU_FRAME_CELLS/2,y:center.y-p.y*15*KAIJU_FRAME_CELLS/2};
    const dx=f.x-p.x,dy=-(f.y-p.y),tx=target.x-mouth.x,ty=target.y-mouth.y;
    assert.ok(Math.abs(dx*ty-dy*tx)/Math.hypot(dx,dy)<.01,'ray misses the player');
    assert.ok(dx*tx+dy*ty>0,'ray points away from the player');
  }
});

test('seeded bursts have variable timing, commit to their facing and greatly exceed cruise speed',()=>{
  const runs=[];
  for(const seed of [7,123,987]){
    let value=seed;const random=()=>{value=(Math.imul(1664525,value)+1013904223)>>>0;return value/4294967296;};
    const width=45,enemy={position:15},ship={position:50*width+35};
    const control=createKaijuController(enemy,{width,height:60,random});
    let burstTick=null,max=0,brace=false;
    for(let tick=0;tick<150;tick++){
      const old=enemy.position;control.update(ship);max=Math.max(max,control.state.speed);
      if(control.state.movement==='windup')brace=true;
      if(control.state.rush){
        if(burstTick===null)burstTick=tick;
        const dx=enemy.position%width-old%width,dy=Math.floor(enemy.position/width)-Math.floor(old/width);
        assert.ok(dx*Math.cos(control.state.bodyHeading)+dy*Math.sin(control.state.bodyHeading)>=0);
      }
    }
    assert.ok(brace&&burstTick!==null);assert.ok(max>=18);runs.push(burstTick);
  }
  assert.ok(new Set(runs).size>1,'bursts repeat the same schedule');
});

test('turning changes projected hull cells and no tail vertices are clipped by the offscreen camera',()=>{
  const model=createKaijuModel(),camera=createKaijuCamera(),state=sampleKaijuSequence(350);state.walkTime=3;
  const shapes=[];
  for(const heading of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    state.bodyHeading=heading;poseKaiju(model,state);
    shapes.push(JSON.stringify(projectKaijuColliders(model,camera)));
    model.root.traverse(mesh=>{
      if(!mesh.isMesh)return;
      const vertices=mesh.geometry.attributes.position,point=new Vector3();
      for(let i=0;i<vertices.count;i++){
        point.fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).project(camera);
        assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1,'camera crops rotating geometry');
      }
    });
  }
  assert.equal(new Set(shapes).size,4);
  const entity={position:100,colliderRevision:0,dx:0};
  const cache=createColliderCache(e=>[{ps:e.position+e.dx}],(ps,out)=>Object.assign(out,{x:ps,y:0}),.5);
  cache.beginTick();assert.ok(cache.get(entity).cells.has(100));
  entity.dx=3;entity.colliderRevision++;cache.beginTick();assert.ok(cache.get(entity).cells.has(103));
});

test('accelerated sweep cannot jump over a player between simulation ticks',()=>{
  const enemy={position:0,previousPosition:0,life:10,kaiju:{state:sampleKaijuSequence(350),mouth:{x:100,y:100},direction:{x:-.1,y:Math.sqrt(.99)}}};
  let hits=0;const ship={isDead:false,injured(){hits++;}};
  const world={cache:{get:()=>({points:[{x:100,y:700,radius:7.5}]})}};
  const attack=createKaijuAttack(enemy,{pixel:15,width:390,height:844,toXY:(_ps,out)=>Object.assign(out,{x:0,y:0})});
  attack.update(ship,world);assert.equal(hits,0);
  enemy.kaiju.direction.x=.1;enemy.kaiju.state.tick++;
  attack.update(ship,world);assert.equal(hits,1);
});
