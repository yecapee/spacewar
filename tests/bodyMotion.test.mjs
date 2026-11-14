import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../art-prototypes/zilla-jjj/vendor/three.module.js';
import {createBodyMotion,BODY_JOINTS} from '../art-prototypes/zilla-combat/body-motion.mjs';
import {poseCombat} from '../art-prototypes/zilla-combat/creature-rig.mjs';
import {sampleAction} from '../art-prototypes/zilla-combat/creature-actions.mjs';
const input={heading:0,speed:12,walkTime:0};
test('turn propagates gradually through chest, neck and fifteen tail joints',()=>{
 const motion=createBodyMotion();motion.update(input);let pose;
 for(let i=1;i<=12;i++)pose=motion.update({...input,heading:i*.05,walkTime:i*.2});
 assert.equal(pose.yaw.length,21);assert.ok(pose.yaw.slice(1,6).every(v=>Math.abs(v)>.04));
 assert.ok(Math.abs(pose.yaw[6]-pose.yaw[20])>.05,'tail must have a curve rather than a rigid rotation');
 const earlier=pose.yaw.slice();for(let i=0;i<8;i++)pose=motion.update({...input,heading:.6,speed:0,walkTime:2.4});
 assert.ok(Math.abs(pose.yaw[12])>.02,'tail keeps moving after a stop');assert.notDeepEqual(pose.yaw,earlier);
 for(let i=0;i<400;i++)pose=motion.update({...input,heading:.6,speed:0,walkTime:2.4});
 assert.ok(pose.yaw.every(v=>Math.abs(v)<1e-5));assert.ok(Math.abs(pose.pitch)<1e-5);
});
test('straight travel has a whole-body gait wave; abrupt stopping produces pitch inertia',()=>{
 const motion=createBodyMotion();let result;
 for(let i=0;i<80;i++)result=motion.update({...input,walkTime:i*.2});
 assert.ok(Math.abs(result.yaw[1])>.005);assert.ok(new Set(result.yaw.slice(6).map(v=>v.toFixed(3))).size>8);
 result=motion.update({...input,speed:0,walkTime:16});assert.ok(result.pitch>.001);
});
test('angle wrapping and long rapid turns remain bounded, finite and deterministic',()=>{
 const a=createBodyMotion(),b=createBodyMotion();
 for(let i=0;i<3000;i++){const args={heading:Math.atan2(Math.sin(i*.09),Math.cos(i*.09)),speed:i%120<60?21:0,walkTime:i*.2};const x=a.update(args),y=b.update(args);assert.deepEqual(x,y);assert.ok(x.yaw.every(v=>Number.isFinite(v)&&Math.abs(v)<.28));}
});
test('bracing stabilizes the firing head while tail retains secondary motion',()=>{
 const a=createBodyMotion(),b=createBodyMotion();a.update(input);b.update(input);let x,y;
 for(let i=0;i<12;i++){const args={...input,heading:i*.05,walkTime:i*.2};x=a.update(args);y=b.update({...args,braced:true});}
 for(let i=0;i<6;i++)assert.ok(Math.abs(y.yaw[i]-x.yaw[i]*.18)<1e-9);
 assert.deepEqual(x.yaw.slice(6),y.yaw.slice(6));
});
function specimen(){
 const report=JSON.parse(fs.readFileSync(new URL('../art-prototypes/zilla-jjj/model-report.json',import.meta.url))),root=new T.Group(),normalized=new T.Group(),scene=new T.Group();root.add(normalized);normalized.add(scene);normalized.scale.setScalar(.3125);
 const bones={},rest=new Map(),nodes=report.bones_data.map(b=>{const n=new T.Bone();n.name=b.name;bones[b.name]=n;return n;});
 report.bones_data.forEach((b,i)=>{const parent=b.parent<0?[0,0,0]:report.bones_data[b.parent].position;nodes[i].position.fromArray(b.position.map((v,k)=>v-parent[k]));(b.parent<0?scene:nodes[b.parent]).add(nodes[i]);rest.set(nodes[i],{position:nodes[i].position.clone(),quaternion:nodes[i].quaternion.clone()});});
 const model={root,normalized,gltf:{scene},bones,rest,scale:.3125,muzzle:new T.Group(),feet:{}};root.add(model.muzzle);
 for(const side of ['L','R'])model.feet[side]={ankle:new T.Vector3().fromArray(report.bones_data.find(b=>b.name==='ankle_'+side).position),chain:['knee_'+side+'2','knee_'+side,'leg_'+side].map(n=>bones[n])};return model;
}
test('actual rig uses every joint, repeated rendering never advances motion and muzzle stays attached',()=>{
 const model=specimen(),motion=createBodyMotion();motion.update(input);let bodyMotion;
 for(let i=1;i<=12;i++)bodyMotion=motion.update({...input,heading:i*.05,walkTime:i*.2});
 const state={time:1,monster:{x:2,z:3,yaw:.6,speed:12,walkTime:2.4,side:1},pose:sampleAction('M03',.5),bodyMotion};
 poseCombat(model,state);const first=Object.values(model.bones).map(n=>n.matrixWorld.elements.slice());const muzzle=model.muzzle.matrixWorld.elements.slice();
 for(let i=0;i<10;i++)poseCombat(model,state);
 assert.deepEqual(Object.values(model.bones).map(n=>n.matrixWorld.elements),first);assert.deepEqual(model.muzzle.matrixWorld.elements,muzzle);assert.equal(model.bones.jaw.rotation.x,-.23);
 for(const name of BODY_JOINTS)assert.ok(model.bones[name].matrixWorld.elements.every(Number.isFinite));
 const animated=BODY_JOINTS.map(name=>model.bones[name].rotation.y);poseCombat(model,{...state,bodyMotion:null});
 BODY_JOINTS.forEach((name,i)=>assert.ok(Math.abs(animated[i]-model.bones[name].rotation.y-bodyMotion.yaw[i])<1e-7,name));
 const a=model.muzzle.getWorldPosition(new T.Vector3()),b=new T.Vector3(0,-.8,5.1);model.bones.head.localToWorld(b);assert.ok(a.distanceTo(b)<1e-6);
});
