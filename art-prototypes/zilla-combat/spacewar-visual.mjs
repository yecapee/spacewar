import * as T from '../zilla-jjj/vendor/three.module.js';
import {createRiftback} from '../zilla-jjj/model.mjs';
import {enableLegacySkinning} from '../zilla-jjj/legacySkinning.mjs';
import {bodyYawForHeading} from '../../js/kaijuSweep.mjs';
import {poseCombat} from './creature-rig.mjs';
import {rasterizeTriangle} from './projected-collider.mjs';
let runtime;
const point=new T.Vector3(),projected=[],seen=new Set(),FRAME=25.6;
export async function prepareCreature(onProgress){
 const gpu=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});gpu.setPixelRatio(1);gpu.setSize(384,384,false);gpu.setClearColor(0,0);gpu.outputColorSpace=T.SRGBColorSpace;
 const model=await createRiftback({assetBase:new URL(document.documentElement.dataset.modelBase||'../zilla-jjj/',document.baseURI),simpleLighting:!gpu.capabilities.isWebGL2,onProgress});
 if(!gpu.capabilities.isWebGL2)enableLegacySkinning(model.root);
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-9.6,9.6,9.6,-9.6,.1,80);camera.position.set(0,19,13);camera.lookAt(0,3,0);camera.updateMatrixWorld(true);scene.add(model.root);
 scene.add(new T.HemisphereLight(0xdbeaff,0x647a86,2));const key=new T.DirectionalLight(0xffeed7,3.2);key.position.set(-6,15,10);scene.add(key);const rim=new T.DirectionalLight(0x80bfff,2);rim.position.set(3,8,-8);scene.add(rim);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=384;
 runtime={gpu,scene,camera,model,canvas,context:canvas.getContext('2d'),lastEnemy:null,lastTick:-1,lost:false};
 gpu.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();runtime.lost=true;document.getElementById('graphicsStatus').hidden=false;document.getElementById('graphicsStatus').textContent='怪獸繪圖中斷，請重新整理。';});
 gpu.domElement.addEventListener('webglcontextrestored',()=>{runtime.lost=false;runtime.lastTick=-1;document.getElementById('graphicsStatus').hidden=true;});gpu.compile(scene,camera);
}
function pose(enemy){const s=enemy.kaiju.state;poseCombat(runtime.model,{time:s.tick/40,monster:{x:0,z:0,yaw:bodyYawForHeading(s.bodyHeading),speed:s.speed,walkTime:s.walkTime,side:1},pose:s.pose,bodyMotion:s.bodyMotion});}
function projectBone(name,center,pixel,output){runtime.model.bones[name].getWorldPosition(point).project(runtime.camera);output.x=center.x+point.x*pixel*FRAME/2;output.y=center.y-point.y*pixel*FRAME/2;return output;}
export function updateSurvivalVisual(enemy,pixel,toXY,rowHeight=pixel){
 const k=enemy.kaiju,s=k.state,r=runtime;if(!r)return;k.pixel=pixel;k.rowHeight=rowHeight;pose(enemy);const center=toXY(enemy.position);seen.clear();
 r.model.gltf.scene.traverse(mesh=>{
  if(!mesh.isMesh)return;const count=mesh.geometry.attributes.position.count;
  for(let i=0;i<count;i++){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld).project(r.camera);const p=projected[i]||(projected[i]={});p.x=point.x*FRAME/2;p.y=-point.y*FRAME/2*pixel/rowHeight;seen.add(Math.round(p.x)+','+Math.round(p.y));}
  const index=mesh.geometry.index,total=index?index.count:count;
  for(let i=0;i<total;i+=3)rasterizeTriangle(projected[index?index.getX(i):i],projected[index?index.getX(i+1):i+1],projected[index?index.getX(i+2):i+2],seen);
 });
 k.colliderOffsets.length=0;for(const value of seen)k.colliderOffsets.push(value.split(',').map(Number));enemy.colliderRevision=s.tick;
 r.model.muzzle.getWorldPosition(point).project(r.camera);k.mouth.x=center.x+point.x*pixel*FRAME/2;k.mouth.y=center.y-point.y*pixel*FRAME/2;
 if(s.action==='H02'){
  if(s.pose.p<.76||!k.lockedDirection){const target=toXY(k.targetPosition),dx=target.x-k.mouth.x,dy=target.y-k.mouth.y,length=Math.hypot(dx,dy)||1;k.lockedDirection={x:dx/length,y:dy/length};}
  Object.assign(k.direction,k.lockedDirection);
 }else if(s.action==='H03'&&k.lockedDirection)Object.assign(k.direction,k.lockedDirection);else k.lockedDirection=null;
 if(s.action.startsWith('A')){const bone=s.action==='A05'?'tail10':s.action==='A01'?'wrist_L':s.action==='A03'?'head':'upperbody2';k.meleeShape=projectBone(bone,center,pixel,k.meleeShape||{});k.meleeShape.radius=pixel*(s.action==='A01'?1.5:s.action==='A03'?1.7:2.5);}else k.meleeShape=null;
}
export function drawSurvivalVisual(context,enemy,pixel,toXY){
 const r=runtime;if(!r||r.lost)return true;
 if(r.lastEnemy!==enemy||r.lastTick!==enemy.kaiju.state.tick){pose(enemy);r.gpu.render(r.scene,r.camera);r.context.clearRect(0,0,384,384);r.context.drawImage(r.gpu.domElement,0,0);r.lastEnemy=enemy;r.lastTick=enemy.kaiju.state.tick;}
 const center=toXY(enemy.position),size=pixel*FRAME;context.save();context.imageSmoothingEnabled=true;context.drawImage(r.canvas,center.x-size/2,center.y-size/2,size,size);context.restore();return true;
}
