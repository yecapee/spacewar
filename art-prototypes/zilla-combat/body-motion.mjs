// Secondary skeletal motion. Advance only with Spacewar's fixed 40 Hz tick.
// Rendering reads the resulting pose and never advances these springs.
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=v=>Math.atan2(Math.sin(v),Math.cos(v));
function spring(node,target,hz,damping,dt,angular=false){
 const error=angular?wrap(target-node.value):target-node.value,w=TAU*hz;
 node.velocity+=(w*w*error-2*damping*w*node.velocity)*dt;node.value+=node.velocity*dt;
}
export const BODY_JOINTS=['lowerbody','upperbody','upperbody2','neck','neck2','head',...Array.from({length:15},(_,i)=>i?'tail'+(i+1):'tail')];
export function createBodyMotion(){
 let initialized=false,lastSpeed=0;
 const joints=BODY_JOINTS.map(()=>({value:0,velocity:0}));
 const amplitude={value:0,velocity:0},pitch={value:0,velocity:0};
 const output={yaw:BODY_JOINTS.map(()=>0),pitch:0,roll:0,amplitude:0};
 return {update({heading,speed,walkTime,braced=false},dt=1/40){
  if(![heading,speed,walkTime,dt].every(Number.isFinite)||dt<=0||dt>.1)throw new Error('Invalid body motion tick');
  if(!initialized){for(const j of joints)j.value=heading;lastSpeed=speed;initialized=true;}
  const acceleration=(speed-lastSpeed)/dt;lastSpeed=speed;
  const steps=Math.ceil(dt/(1/120)),step=dt/steps;
  for(let n=0;n<steps;n++){
   spring(amplitude,clamp(Math.abs(speed)/12,0,1),3,.8,step);
   spring(pitch,clamp(-acceleration*.003,-.14,.14),3,.65,step);
   // Hips and chest branch from the locomotion root. Neck and tail follow
   // their actual parent, creating a delayed curve instead of rigid yaw.
   for(let i=0;i<joints.length;i++){
    const parent=i===0||i===1?-1:i===6?0:i-1;
    const target=parent<0?heading:joints[parent].value;
    const hz=i<6?[4,4.5,4.2,4,3.8,3.8][i]:3.5-(i-6)*.045;
    spring(joints[i],target,hz,i<6?.9:.72,step,true);
    const base=parent<0?heading:joints[parent].value,limit=i<6?[.12,.22,.14,.18,.16,.2][i]:.15;
    const offset=wrap(joints[i].value-base);
    if(Math.abs(offset)>limit){joints[i].value=base+clamp(offset,-limit,limit);joints[i].velocity*=.8;}
   }
  }
  const phase=walkTime*TAU/2.5,amp=clamp(amplitude.value,0,1),brace=braced?.18:1;
  for(let i=0;i<joints.length;i++){
   const parent=i===0||i===1?-1:i===6?0:i-1,base=parent<0?heading:joints[parent].value;
   const local=wrap(joints[i].value-base);
   const wave=i<6?Math.sin(phase-i*.38)*[.014,.034,.028,.023,.018,.012][i]:Math.sin(phase-(i-6)*.43+.6)*(.02+(i-6)*.0018);
   output.yaw[i]=(local+wave*amp)*(i<6?brace:1);
  }
  output.pitch=pitch.value*brace;output.roll=Math.sin(phase)*amp*.022*brace;output.amplitude=amp;
  return output;
 }};
}
