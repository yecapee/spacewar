import * as THREE from 'three';
import {createKaijuModel,poseKaiju,createKaijuCamera} from './kaijuModel.mjs';
let runtime,unavailable=false;
const frames=new WeakMap();
const point=new THREE.Vector3(),forward=new THREE.Vector3(),rotation=new THREE.Quaternion();
const center={};
function ensure(){
  if(unavailable)return null;
  if(runtime)return runtime;
  try{
    const gpu=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power',stencil:false});
    gpu.setPixelRatio(1);gpu.setSize(216,288,false);gpu.setClearColor(0,0);gpu.toneMapping=THREE.ACESFilmicToneMapping;gpu.toneMappingExposure=1.25;
    const scene=new THREE.Scene(),camera=createKaijuCamera(),model=createKaijuModel();scene.add(model.root);
    scene.add(new THREE.HemisphereLight('#cad3e8','#202139',2.8));
    const key=new THREE.DirectionalLight('#e5ecff',3.5);key.position.set(-6,15,10);scene.add(key);
    const rim=new THREE.DirectionalLight('#aa8aff',3);rim.position.set(3,8,-8);scene.add(rim);
    runtime={gpu,scene,camera,model,lost:false};
    gpu.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();runtime.lost=true;});
    gpu.domElement.addEventListener('webglcontextrestored',()=>{runtime.lost=false;runtime.generation=(runtime.generation||0)+1;});
    return runtime;
  }catch(error){unavailable=true;console.warn('Kaiju 3D renderer unavailable; using sprite fallback.',error);return null;}
}
export function updateKaijuVisual(enemy,pixel,toXY){
  const r=ensure(),kaiju=enemy.kaiju;
  toXY(enemy.position,center);
  if(!r){kaiju.mouth.x=center.x;kaiju.mouth.y=center.y-pixel*2;kaiju.direction.x=Math.sin(kaiju.state.sweep);kaiju.direction.y=Math.cos(kaiju.state.sweep);return;}
  poseKaiju(r.model,kaiju.state);
  r.model.muzzle.getWorldPosition(point);r.model.muzzle.getWorldQuaternion(rotation);
  forward.set(0,0,1).applyQuaternion(rotation).add(point).project(r.camera);point.project(r.camera);
  const width=pixel*13,height=width*4/3;
  kaiju.mouth.x=center.x+point.x*width/2;kaiju.mouth.y=center.y-point.y*height/2;
  const dx=(forward.x-point.x)*width/2,dy=-(forward.y-point.y)*height/2,length=Math.hypot(dx,dy);
  kaiju.direction.x=dx/length;kaiju.direction.y=dy/length;
}
export default function drawKaiju(context,enemy,pixel,toXY){
  const r=ensure();if(!r||r.lost)return false;
  let entry=frames.get(enemy);
  if(!entry){const canvas=document.createElement('canvas');canvas.width=216;canvas.height=288;entry={canvas,context:canvas.getContext('2d'),tick:-1,generation:-1};frames.set(enemy,entry);}
  if(entry.tick!==enemy.kaiju.state.tick||entry.generation!==(r.generation||0)){
    poseKaiju(r.model,enemy.kaiju.state);r.gpu.render(r.scene,r.camera);
    entry.context.clearRect(0,0,216,288);entry.context.drawImage(r.gpu.domElement,0,0);entry.tick=enemy.kaiju.state.tick;entry.generation=r.generation||0;
  }
  toXY(enemy.position,center);const width=pixel*13,height=width*4/3;
  context.save();context.imageSmoothingEnabled=false;
  context.drawImage(entry.canvas,center.x-width/2,center.y-height/2,width,height);context.restore();return true;
}
