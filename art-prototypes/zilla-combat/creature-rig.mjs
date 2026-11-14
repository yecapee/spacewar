import {poseRiftback} from '../zilla-jjj/model.mjs';
import {Vector3,Quaternion} from '../zilla-jjj/vendor/three.module.js';
import {BODY_JOINTS} from './body-motion.mjs';
const a=new Vector3(),b=new Vector3(),q=new Quaternion(),z=new Vector3(0,0,1);
export function poseCombat(model,state){
 const m=state.monster,p=state.pose,moving=Math.abs(m.speed)>.12,run=Math.abs(m.speed)>2.4;
 const period=run?.95:1.8,stride=(run?5.8:3.8)*model.scale/.62;
 // Foot support travels opposite the body's actual displacement, including retreat.
 const cycle=((m.walkTime/stride*(m.speed<0?-1:1))%1+1)%1;
 poseRiftback(model,moving?(run?'run':'walk'):'idle',moving?cycle*period:state.time);
 const bones=model.bones,side=m.side;
 bones.groove.position.y-=p.crouch*.8;
 bones.upperbody.rotation.x+=p.crouch*.22;
 bones.upperbody.rotation.z+=p.lean*side;
 bones.upperbody.rotation.y+=p.bodyTwist*side;
 bones.neck2.rotation.y+=p.headTurn*side;
 bones.neck.rotation.x-=p.charge*.12;
 bones.head.rotation.x-=p.charge*.08;
 bones.jaw.rotation.x=-.23+.73*p.jaw;
 for(const [suffix,sign]of [['L',1],['R',-1]]){
  const strike=p.id==='A01'?(sign===side?p.claw:0):p.claw;
  bones['arm_'+suffix].rotation.x-=strike*.75;
  bones['arm_'+suffix].rotation.z+=sign*strike*.35;
  bones['elbow_'+suffix].rotation.x-=strike*.4+p.injured*.16;
 }
 for(let i=0;i<15;i++){
  const tail=bones[i===0?'tail':'tail'+(i+1)];
  if(tail)tail.rotation.y+=p.tail*.085*side*Math.cos(i*.06);
 }
 bones.upperbody.rotation.z+=p.injured*.035*Math.sin(state.time*7);
 const motion=state.bodyMotion;
 if(motion){
  BODY_JOINTS.forEach((name,i)=>{if(bones[name])bones[name].rotation.y+=motion.yaw[i];});
  bones.upperbody.rotation.x+=motion.pitch;
  bones.upperbody2.rotation.x-=motion.pitch*.3;
  bones.neck.rotation.x-=motion.pitch*.3;
  bones.head.rotation.x-=motion.pitch*.2;
  bones.upperbody.rotation.z+=motion.roll;
  bones.neck2.rotation.z-=motion.roll*.35;
 }
 model.root.position.set(m.x,p.jump,m.z);model.root.rotation.y=m.yaw;
 model.root.updateMatrixWorld(true);
 const mouthY=-.8-1.6*p.jaw;
 a.set(0,mouthY,5.1);bones.head.localToWorld(a);
 b.set(0,mouthY,7.1);bones.head.localToWorld(b);b.sub(a).normalize();
 model.muzzle.position.copy(model.root.worldToLocal(a));
 model.root.getWorldQuaternion(q).invert();b.applyQuaternion(q);model.muzzle.quaternion.setFromUnitVectors(z,b);
 model.root.updateMatrixWorld(true);model.root.traverse(n=>{if(n.isSkinnedMesh)n.skeleton.update();});
}
