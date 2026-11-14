import * as THREE from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {blueInspiredMaterial} from './palette.mjs';

export const ACTIONS={
  idle:{name:'原比例待機',duration:4,stages:['呼吸','觀察','擺尾'],description:'保留 JJJ 的原始外形與骨架，只加入輕微呼吸和尾部擺動。'},
  walk:{name:'重心步行',duration:1.8,stages:['接地承重','後推送身','抬腳前跨'],description:'朝頭部方向前進。支撐腳向後推送身體，擺動腳抬起向前跨，腳掌保持水平。'},
  run:{name:'低姿奔跑',duration:.95,stages:['接地','蹬地','前跨'],description:'加大步幅與抬腳高度，頸部壓低，尾巴平衡身體。'},
  rush:{name:'破陣突進',duration:3.6,stages:['壓低蓄力','突進','恢復'],description:'壓低上身後加速跨步，向頭部前方突進。'},
  sweep:{name:'迴身尾掃',duration:3.2,stages:['扭身蓄力','迴身掃尾','收勢'],description:'腰部先旋轉，再帶動原骨架的十五節長尾。'},
  bite:{name:'裂顎重咬',duration:2.8,stages:['張顎','前探咬合','恢復'],description:'使用原模型獨立下顎與頸部骨骼完成張口、前探與咬合。'},
  breath:{name:'高熱吐息',duration:5.2,stages:['準備','吐息','冷卻'],description:'由嘴前方釋放高熱氣流，張顎與頸部姿勢同步變化。'},
};
const smooth=(a,b,x)=>{const v=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return v*v*(3-2*v);};
const envelope=(a,b,c,d,x)=>smooth(a,b,x)*(1-smooth(c,d,x));
const v1=new THREE.Vector3(),v2=new THREE.Vector3(),v3=new THREE.Vector3(),q=new THREE.Quaternion();

export async function createRiftback({onProgress,simpleLighting=false,defaultVariant='reduced',assetBase=document.baseURI}={}){
  const loader=new GLTFLoader();
  const [gltf,report]=await Promise.all([
    loader.loadAsync(new URL(defaultVariant==='original'?'zilla-jjj.glb':'zilla-jjj-ps1-face.glb',assetBase).href,e=>onProgress?.(e.loaded,e.total)),
    fetch(new URL('model-report.json',assetBase)).then(r=>{if(!r.ok)throw Error('模型資料讀取失敗：HTTP '+r.status);return r.json();}),
  ]);
  const root=new THREE.Group(),normalized=new THREE.Group();root.add(normalized);normalized.add(gltf.scene);
  const scale=16/(report.bounds[1][2]-report.bounds[0][2]);
  normalized.scale.setScalar(scale);normalized.position.set(0,-report.bounds[0][1]*scale,0);
  const entries={};
  function prepare(gltf,variant){
    const bones={},rest=new Map(),materials={};let index=0;
    gltf.scene.traverse(n=>{
      if(n.isBone){bones[n.name]=n;rest.set(n,{position:n.position.clone(),quaternion:n.quaternion.clone()});}
      if(n.isMesh){n.frustumCulled=false;n.castShadow=true;n.receiveShadow=true;
        if(variant==='reduced')n.material=blueInspiredMaterial(n.material,{simpleLighting});
        else if(simpleLighting){const m=n.material;n.material=new THREE.MeshLambertMaterial({map:m.map,color:m.color,side:THREE.DoubleSide});}
        if(n.material.map)n.material.map.anisotropy=2;materials[index++]=n.material;
      }
    });
    if(variant==='reduced')for(const [side,direction]of [['L',1],['R',-1]]){
      const eye=bones['eye_'+side];
      eye.position.x+=direction*.18;eye.position.y+=.03;eye.scale.setScalar(1.45);
      rest.get(eye).position.copy(eye.position);
    }
    return {gltf,bones,rest,materials};
  }
  entries[defaultVariant]=prepare(gltf,defaultVariant);
  const muzzle=new THREE.Group();root.add(muzzle);
  const model={root,normalized,scale,muzzle,report,entries,
    async setVariant(name){
      if(!['original','reduced'].includes(name))return;
      if(!entries[name]){
        const asset=await loader.loadAsync(new URL(name==='original'?'zilla-jjj.glb':'zilla-jjj-ps1-face.glb',assetBase).href,e=>onProgress?.(e.loaded,e.total));
        entries[name]=prepare(asset,name);normalized.add(asset.scene);
      }
      for(const [key,entry]of Object.entries(entries))entry.gltf.scene.visible=key===name;
      Object.assign(this,entries[name]);this.variant=name;this.stats=report[name];this.joints=Object.values(this.bones);
      this.head=this.bones.head;this.neck=this.bones.neck2;this.torso=this.bones.upperbody;
      this.feet={};
      for(const side of ['L','R'])this.feet[side]={ankle:new THREE.Vector3().fromArray(report.bones_data.find(b=>b.name==='ankle_'+side).position),chain:['knee_'+side+'2','knee_'+side,'leg_'+side].map(n=>this.bones[n])};
    },
  };
  await model.setVariant(defaultVariant);
  poseRiftback(model,'idle',0);return model;
}

function solveLeg(model,side,target){
  const ankle=model.bones['ankle_'+side],chain=model.feet[side].chain,scene=model.gltf.scene;
  for(let iteration=0;iteration<16;iteration++){
    for(let j=0;j<chain.length;j++){
      scene.updateMatrixWorld(true);
      const joint=chain[j];scene.worldToLocal(ankle.getWorldPosition(v1));scene.worldToLocal(joint.getWorldPosition(v2));
      v1.sub(v2);v3.copy(target).sub(v2);
      let angle=Math.atan2(v1.y*v3.z-v1.z*v3.y,v1.y*v3.y+v1.z*v3.z);
      const limits=j===0?[-.52,1.39]:j===1?[-1.39,.26]:[-1.1,1.1];
      joint.rotation.x=THREE.MathUtils.clamp(joint.rotation.x+angle,limits[0],limits[1]);
    }
  }
  // Keep the source foot orientation while the knee/ankle chain moves.
  scene.updateMatrixWorld(true);ankle.parent.getWorldQuaternion(q).invert();
  scene.getWorldQuaternion(vq);ankle.quaternion.copy(q).multiply(vq);
}
const vq=new THREE.Quaternion();
const zAxis=new THREE.Vector3(0,0,1),headPoint=new THREE.Vector3(),neckPoint=new THREE.Vector3();
export function poseRiftback(model,name,time,{travel=false,travelTime=time}={}){
  const meta=ACTIONS[name]||ACTIONS.idle,p=THREE.MathUtils.clamp(time/meta.duration,0,1),b=model.bones;
  for(const [bone,rest]of model.rest){bone.position.copy(rest.position);bone.quaternion.copy(rest.quaternion);}
  model.root.position.set(0,0,0);model.root.rotation.set(0,0,0);
  const active=name==='walk'||name==='run'||name==='rush',run=name!=='walk';
  const stride=run?5.8:3.8,period=name==='rush'?.8:meta.duration;
  const phase=(time/period)%1;
  if(active){
    const rush=name==='rush'?envelope(.12,.3,.78,.96,p):1;
    b.groove.position.y+=.17*Math.cos(phase*Math.PI*4)*rush;
    b.upperbody.rotation.x=run?.04:.01;b.neck.rotation.x=run?.06:0;
    for(const [side,offset]of [['L',0],['R',.5]]){
      const step=(phase+offset)%1,stance=.62,u=step<stance?step/stance:(step-stance)/(1-stance);
      const foot=model.feet[side].ankle.clone();
      foot.z+=(step<stance?stride*(.5-u):stride*(-.5+smooth(0,1,u)))*rush;
      foot.y+=(step<stance?0:Math.sin(u*Math.PI)*(run?1.65:1.0))*rush;
      solveLeg(model,side,foot);
      b['arm_'+side].rotation.x=Math.sin((phase+offset)*Math.PI*2)*.13*rush;
      b['elbow_'+side].rotation.x=-.08*rush;
    }
    if(travel){
      const velocity=stride*model.scale/(period*.62),angle=travelTime*velocity/3.3;
      model.root.position.set(-Math.cos(angle)*3.3,0,Math.sin(angle)*3.3);model.root.rotation.y=angle;
    }
    if(name==='rush'&&travel){model.root.rotation.y=0;model.root.position.set(0,0,-2.4+5.2*smooth(.25,.74,p));}
  }else{
    b.upperbody.rotation.x=.008*Math.sin(time*Math.PI*.5);b.neck.rotation.x=-.006*Math.sin(time*Math.PI*.5);
  }
  for(let i=0;i<15;i++){
    const bone=b[i===0?'tail':'tail'+(i+1)];if(bone)bone.rotation.y=.009*Math.sin(time*1.4-i*.4);
  }
  // PMX is reflected to glTF's right-handed coordinates. Jaw X rotation must
  // be reflected too: negative closes the source's slightly open rest pose.
  const closed=-.23;
  b.jaw.rotation.x=closed;
  if(name==='bite'){
    const open=envelope(.07,.25,.47,.6,p);b.jaw.rotation.x=closed+.73*open;
    b.neck.rotation.x=.08*envelope(.15,.34,.65,.83,p);b.head.rotation.x=-.1*open;
  }
  if(name==='breath'){
    const lift=envelope(.08,.27,.84,.98,p);b.jaw.rotation.x=closed+.73*lift;
    b.neck.rotation.x=-.12*lift;b.head.rotation.x=-.08*lift;
  }
  if(name==='sweep'){
    const pull=envelope(.04,.23,.26,.5,p),strike=envelope(.23,.43,.6,.88,p);
    b.upperbody.rotation.y=-.13*pull+.16*strike;
    for(let i=0;i<15;i++){const bone=b[i===0?'tail':'tail'+(i+1)];if(bone)bone.rotation.y=-.05*pull+.07*strike*Math.cos(i*.12);}
    model.root.rotation.y=Math.PI*2*smooth(.23,.72,p);
  }
  model.root.updateMatrixWorld(true);
  const mouthY=-.8-1.6*THREE.MathUtils.clamp((b.jaw.rotation.x-closed)/.73,0,1);
  headPoint.set(0,mouthY,5.1);b.head.localToWorld(headPoint);
  neckPoint.set(0,mouthY,7.1);b.head.localToWorld(neckPoint);
  v1.copy(neckPoint).sub(headPoint).normalize();
  model.muzzle.position.copy(model.root.worldToLocal(headPoint));
  model.root.getWorldQuaternion(q).invert();v1.applyQuaternion(q);model.muzzle.quaternion.setFromUnitVectors(zAxis,v1);
  model.root.updateMatrixWorld(true);model.root.traverse(n=>{if(n.isSkinnedMesh)n.skeleton.update();});
  return {progress:p,emit:name==='breath'?envelope(.29,.37,.72,.82,p):0,heat:0,arc:name==='sweep'?envelope(.28,.35,.67,.78,p):0,phase:p<.3?0:p<.76?1:2};
}
