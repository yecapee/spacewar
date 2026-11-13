import {Vector3} from 'three';
import {poseKaiju} from './kaijuModel.mjs';
export const KAIJU_FRAME_CELLS=25.6;
const corner=new Vector3();
export function aimKaijuMouthAt(model,camera,state,center,target,pixel){
  let heading=state.bodyHeading??Math.PI/2;
  // The muzzle itself moves as the body rotates; converge on its actual projected position.
  for(let i=0;i<16;i++){
    state.bodyHeading=heading;poseKaiju(model,state);
    model.muzzle.getWorldPosition(corner).project(camera);
    const x=center.x+corner.x*pixel*KAIJU_FRAME_CELLS/2;
    const y=center.y-corner.y*pixel*KAIJU_FRAME_CELLS/2;
    if(Math.hypot(target.x-x,target.y-y)<.001)break;
    heading=Math.atan2(target.y-y,target.x-x);
  }
  state.bodyHeading=heading;poseKaiju(model,state);return heading;
}
export function projectKaijuColliders(model,camera,output=[],seen=new Set(),rowRatio=1){
  seen.clear();let count=0;
  model.root.traverse(mesh=>{
    if(!mesh.isMesh)return;
    if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();
    const box=mesh.geometry.boundingBox;
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(let i=0;i<8;i++){
      corner.set(i&1?box.max.x:box.min.x,i&2?box.max.y:box.min.y,i&4?box.max.z:box.min.z).applyMatrix4(mesh.matrixWorld).project(camera);
      const x=corner.x*KAIJU_FRAME_CELLS/2,y=-corner.y*KAIJU_FRAME_CELLS/2*rowRatio;
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
    }
    for(let y=Math.round(minY);y<=Math.round(maxY);y++)for(let x=Math.round(minX);x<=Math.round(maxX);x++){
      const key=(y+64)*128+x+64;if(seen.has(key))continue;seen.add(key);
      const point=output[count]||(output[count]=[0,0]);point[0]=x;point[1]=y;count++;
    }
  });
  output.length=count;return output;
}
