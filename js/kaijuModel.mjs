import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {bodyYawForHeading} from './kaijuSweep.mjs';

// Abstract articulated creature: broad facets, sparse claws and a seven-joint tail.
export function createKaijuModel() {
const scene = new THREE.Group();
const mat = (color,roughness=.8) => new THREE.MeshStandardMaterial({color,roughness,metalness:.15,flatShading:true});
const skin=mat('#3b4553'), chestMat=mat('#59616e'), dark=mat('#242d3a'), edge=mat('#6b7280'), claw=mat('#b7bec9');
const throatMat=new THREE.MeshStandardMaterial({color:'#220d35',emissive:'#a747ff',emissiveIntensity:.1,roughness:.65});
const eyeMat=new THREE.MeshStandardMaterial({color:'#f1bbff',emissive:'#ce73ff',emissiveIntensity:2.5});
function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function mesh(parent,geometry,material,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const ico=new THREE.OctahedronGeometry(1,0), box=new THREE.BoxGeometry(1,1,1);
const root=group(scene,0,0,0), body=group(root,0,3.1,0);
mesh(body,ico,skin,0,1.2,0,1.65,2.25,1.12);
mesh(body,ico,chestMat,0,1.65,.67,1.15,1.5,.67);
mesh(body,ico,dark,0,-.15,-.12,1.5,1.15,1.02);
// One broad chest plane replaces the small layered armor details.
const neck=group(body,0,2.8,.1);
mesh(neck,ico,skin,0,.2,.25,.85,1.22,.83);
const head=group(neck,0,.7,.4);
mesh(head,ico,skin,0,.35,.5,.91,.73,1.16);
mesh(head,box,chestMat,0,.16,1.17,1.03,.51,1.04);
mesh(head,ico,dark,0,.58,.48,.8,.42,1.02);
for(const sign of [-1,1]) {
  const brow=mesh(head,box,edge,sign*.61,.5,.96,.52,.17,.75);brow.rotation.z=sign*.14;
  mesh(head,box,eyeMat,sign*.66,.33,1.13,.12,.1,.27);
}
const jaw=group(head,0,-.1,.55);
mesh(jaw,ico,skin,0,-.18,.57,.69,.29,.98);
mesh(jaw,box,dark,0,-.04,.74,.89,.12,1.22);
const mouthCore=mesh(head,ico,throatMat,0,-.11,.85,.44,.26,.5);
mesh(jaw,box,throatMat,0,.035,.7,.67,.06,1.02);
const toothGeo=new THREE.ConeGeometry(.075,.22,4);
for(const sign of [-1,1]) for(let i=0;i<2;i++) {
  const upper=mesh(head,toothGeo,claw,sign*.41,-.14,.7+i*.65);upper.rotation.z=Math.PI;
  mesh(jaw,toothGeo,claw,sign*.39,.06,.25+i*.65);
}
const muzzle=group(head,0,-.16,1.76);
const arms=[];
for(const sign of [-1,1]) {
  const arm=group(body,sign*1.24,2.05,.5);arm.rotation.z=sign*.24;
  mesh(arm,ico,skin,sign*.22,-.5,.14,.48,.84,.52);
  const hand=group(arm,sign*.23,-1.04,.5);mesh(hand,ico,chestMat,0,0,0,.34,.5,.37);
  for(let i=0;i<2;i++){const c=mesh(hand,toothGeo,claw,(i-.5)*.25,-.39,.2);c.rotation.x=-.6;}
  arms.push(arm);
}
const legs=[], feet=[];
for(const sign of [-1,1]) {
  const leg=group(root,sign*1.03,2.4,.1);
  mesh(leg,ico,skin,sign*.13,-.45,.02,.87,1.25,.9);
  const shin=group(leg,0,-1.22,.19);
  mesh(shin,ico,chestMat,0,-.31,.04,.57,.77,.59);
  const foot=group(shin,0,-.85,.38);
  mesh(foot,ico,skin,0,.06,.25,.72,.34,1.12);
  for(let i=0;i<3;i++){const toe=mesh(foot,new THREE.ConeGeometry(.13,.5,4),claw,(i-1)*.37,0,1.04);toe.rotation.x=Math.PI/2;}
  legs.push({leg,shin,sign});feet.push(foot);
}
// A linked tail swings with a lag that increases towards the tip.
const tail=[], dorsal=[];
let tailParent=group(body,0,-.05,-.8);
for(let i=0;i<7;i++) {
  const joint=group(tailParent,0,0,i===0?0:-1.2);
  const width=.86*(1-i/8);
  mesh(joint,ico,i%2?skin:dark,0,-.02,-.56,width,width*.7,1.02);
  joint.rotation.x=i===0?-.4:.025;tail.push(joint);tailParent=joint;
}
function plate(parent,x,y,z,size,index) {
  const g=new THREE.BufferGeometry();
  const p=[-.28,0,0,.28,0,0,0,size,-.15,-.28,0,.3,.28,0,.3,0,size,.15];
  g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,1,2,3,5,4,0,3,5,0,5,2,1,2,5,1,5,4,0,1,4,0,4,3]);g.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:'#74728c',emissive:'#a452ff',emissiveIntensity:0,flatShading:true,roughness:.6});
  const m=mesh(parent,g,material,x,y,z);dorsal.push({mesh:m,index});return m;
}
for(let i=0;i<tail.length;i++) plate(tail[i],0,.35*(1-i/8),-.4,.28+(6-i)*.07,8-i*8/6);
for(let row=0;row<5;row++) for(const side of [-1,0,1]) {
  if(side!==0&&row!==1&&row!==3)continue;
  const y=.4+row*.64,z=-1.02+row*.075,size=(side===0?1.1:.68)*(1-Math.abs(row-2)*.12);
  const fin=plate(body,side*.58,y,z,size,9+row);fin.rotation.x=-.5;fin.rotation.z=side*-.3;
}
plate(neck,0,.38,-.56,.58,14);
let triangles=0;root.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;});

// Batch static parts only inside their own joint, preserving the jaw and limbs.
const protectedMeshes=new Set([mouthCore,...dorsal.map(fin=>fin.mesh)]);
const joints=[];root.traverse(node=>{if(node.isGroup)joints.push(node);});
for(const joint of joints){
  const batches=new Map();
  for(const node of joint.children)if(node.isMesh&&!protectedMeshes.has(node)){
    if(!batches.has(node.material))batches.set(node.material,[]);
    batches.get(node.material).push(node);
  }
  for(const [material,nodes] of batches)if(nodes.length>1){
    const geometries=nodes.map(node=>{node.updateMatrix();const g=node.geometry.index?node.geometry.toNonIndexed():node.geometry.clone();g.applyMatrix4(node.matrix);g.deleteAttribute('uv');g.clearGroups();return g;});
    const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
    nodes.forEach(node=>node.removeFromParent());joint.add(new THREE.Mesh(merged,material));
  }
}
let drawCalls=0;root.traverse(node=>{if(node.isMesh)drawCalls++;});
return {root,body,neck,head,jaw,muzzle,legs,feet,arms,tail,dorsal,throatMat,mouthCore,stats:{triangles,drawCalls}};
}

export function poseKaiju(model,state){
  const {body,neck,head,jaw,legs,arms,tail,dorsal,throatMat,mouthCore}=model;
  const stride=state.walkTime*2*Math.PI/2.8,walking=state.walking;
  const pitch=.02-state.charge*.07+state.firing*.22;
  model.root.rotation.y=bodyYawForHeading(state.bodyHeading??Math.PI/2,pitch);
  const dip=Math.exp(-(state.walkTime%1.4)*8);
  body.position.y=3.1-walking*(.07*Math.abs(Math.sin(stride))+.15*dip)-state.charge*.18-(state.brace||0)*.25;
  body.rotation.set(.04+walking*.035*Math.sin(stride-.4)+(state.rush||0)*.12,0,walking*.035*Math.cos(stride));
  legs.forEach(({leg,shin},i)=>{const p=stride+i*Math.PI,lift=Math.max(0,Math.sin(p));leg.rotation.x=walking*.25*Math.cos(p);leg.position.y=2.4+walking*.22*lift;shin.rotation.x=walking*.3*lift;arms[i].rotation.x=-.35+walking*.14*Math.cos(p-.5);});
  tail.forEach((joint,i)=>{joint.rotation.y=walking*.065*Math.sin(stride-i*.36);joint.rotation.x=(i===0?-.4:.025)+walking*.012*Math.cos(stride-i*.25);});
  neck.rotation.x=-.02+walking*.035*Math.sin(stride-.6)-state.charge*.07;
  head.rotation.set(.22*state.firing+walking*.03*Math.sin(stride-.9),walking*.035*Math.cos(stride-.8),0);
  jaw.rotation.x=state.jaw;
  throatMat.emissiveIntensity=.06+state.charge*2.2+state.firing*2;
  const pulse=1+state.firing*.1;mouthCore.scale.set(.44*pulse,.26*pulse,.5*pulse);
  for(const fin of dorsal){const threshold=4+fin.index*.11;const level=THREE.MathUtils.smoothstep(state.time,threshold,threshold+.65)*(1-THREE.MathUtils.smoothstep(state.time,12.9+(14-fin.index)*.07,14.6+(14-fin.index)*.02));fin.mesh.material.emissiveIntensity=level*(1.9+.3*Math.sin(state.time*9-fin.index*.3));}
  model.root.updateMatrixWorld(true);
}

export function createKaijuCamera(){
  // Oblique front view: face, chest and both planted feet remain visible.
  const camera=new THREE.OrthographicCamera(-9.6,9.6,9.6,-9.6,.1,60);
  camera.position.set(0,19,13);camera.lookAt(0,3,0);camera.updateMatrixWorld(true);return camera;
}
