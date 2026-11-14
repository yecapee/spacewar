// Spacewar enemy controller only. Does not own the player, weapons or damage.
import {ACTIONS,sampleAction} from './creature-actions.mjs';
import {createBodyMotion} from './body-motion.mjs';
import {bodyYawForHeading} from '../../js/kaijuSweep.mjs';
export {ACTIONS,sampleAction};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const angle=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export function createSurvivalController(enemy,{width,height,random=Math.random,onStep=()=>{},damageThreshold=48}={}){
 let x=clamp(enemy.position%width,4,width-5),y=Math.round(height*.23),tick=0,lastLife=enemy.life;
 let id='M01',age=0,heading=Math.PI/2,aim=heading,side=1,walk=0,serial=0,lastStep=0,heatReadyAt=0,lastDodge=-200,lastTrick=-400;
 const motion=createBodyMotion();
 const history=[],damage=[],state={},control={state,mouth:{x:0,y:0},direction:{x:0,y:1},colliderOffsets:[],history,damageThreshold,pressure:0,heatCount:0};
 enemy.position=Math.round(y)*width+Math.round(x);enemy.previousPosition=enemy.position;
 const enter=(next,ship)=>{id=next;age=0;serial++;aim=Math.atan2(Math.floor(ship.position/width)-y,ship.position%width-x);side=ship.position%width>=x?-1:1;history.push(next);if(history.length>60)history.shift();if(next.startsWith('D'))lastTrick=tick;if(next==='M04')lastDodge=tick;if(next==='H03'){heatReadyAt=tick+16*40;damage.length=0;control.heatCount++;}};
 const pressure=()=>{while(damage.length&&tick-damage[0].tick>8*40)damage.shift();return damage.reduce((sum,v)=>sum+v.amount,0);};
 const choose=(ship,d)=>{
  if(enemy.life/enemy.maxlife<.22&&random()<.4)return enter('M07',ship);
  if(d<5)return enter(random()<.6?'A06':'A05',ship);
  if(d<11)return enter(['A01','A02','A03','A04'][Math.floor(random()*4)],ship);
  if(tick-lastTrick>240&&d<22)return enter(['D01','D02','D03'][Math.floor(random()*3)],ship);
  enter(d>13?'M03':'M06',ship);
 };
 control.queueAction=next=>{if(!ACTIONS[next]||next.startsWith('H'))return false;control.queued=next;return true;};
 control.update=ship=>{
  if(enemy.life<1||enemy.removed||ship.isDead)return;
  tick++;const loss=Math.max(0,lastLife-enemy.life);lastLife=enemy.life;if(loss)damage.push({tick,amount:loss});control.pressure=pressure();
  const px=ship.position%width,py=Math.floor(ship.position/width),d=Math.hypot(px-x,py-y),desired=Math.atan2(py-y,px-x);
  const threatened=d<Math.min(36,height*.7)&&(loss>0||control.pressure>0||d<12);
  if(!id.startsWith('H')&&!id.startsWith('A')&&control.pressure>=control.damageThreshold&&tick>=heatReadyAt&&threatened)enter('H01',ship);
  // Use the real upward player bullets to anticipate the lane; no auto-aim weapon.
  if(['M01','M02','M03','M06'].includes(id)&&tick-lastDodge>150&&ship.bullet?.some(b=>!b.dead&&Math.abs(b.data.x-(x+.5)*control.pixel)<control.pixel*2&&b.data.y>y*control.rowHeight&&b.data.y-y*control.rowHeight<control.pixel*12))enter('M04',ship);
  age+=1/40;const pose=sampleAction(id,age),p=pose.p;let speed=0,target=desired,turn=.07;
  if(id==='M02')speed=d>10?4:0;
  if(id==='M03')speed=d>8?12:0;
  if(id==='M04'){target=aim+side*1.1;speed=p<.75?16:3;turn=.15;}
  if(id==='M05')speed=-5;
  if(id==='M06'){target=desired+side*1.05;speed=6;}
  if(id==='M07'){target=desired+Math.PI;speed=9;}
  if(id==='A02'||id==='A03'||id==='A04'){target=aim;speed=p>.23&&p<.58?(id==='A04'?21:id==='A02'?17:10):0;turn=.035;}
  if(id==='A05'){target=aim+side*Math.PI*p;turn=.13;}
  if(id==='A06'){target=aim+side*Math.sin(p*Math.PI)*.7;speed=p>.6?4:0;}
  if(id==='D01'){target=p<.38?aim:aim+side*1.2;speed=p<.38?14:p<.48?0:16;turn=.15;}
  if(id==='D02')speed=p<.48?-7:0;
  if(id==='D03'){target=desired+side*(p<.4?0:1.3);speed=p>.4?15:0;turn=.13;}
  if(id==='H01')turn=.035;
  if(id==='H02'){if(p<.76)aim=desired;target=aim;turn=.05;}
  if(id==='H03'){target=aim;turn=0;}
  if(id==='H04'){target=desired+Math.PI;speed=p>.5?3:0;turn=.035;}
  heading+=clamp(angle(target,heading),-turn,turn);
  const oldX=x,oldY=y;x=clamp(x+Math.cos(heading)*speed/40,4,width-5);y=clamp(y+Math.sin(heading)*speed/40,7,height-8);
  const moved=Math.hypot(x-oldX,y-oldY);walk+=moved/1.33;
  enemy.position=Math.round(y)*width+Math.round(x);
  Object.assign(state,{tick,time:age,action:id,serial,pose,bodyHeading:heading,heading,walkTime:walk,speed:speed<0?-moved*40:moved*40,
   phase:id==='H02'?'charge':id==='H03'?'beam':id==='H04'?'cooldown':'walk',flame:0,beam:pose.beam,charge:pose.charge,walking:moved>0?1:0,sweep:0});
  state.bodyMotion=motion.update({heading:bodyYawForHeading(heading),speed:state.speed,walkTime:walk,braced:id==='H02'||id==='H03'});
  control.direction.x=Math.cos(aim);control.direction.y=Math.sin(aim);
  const step=Math.floor(walk/1.4);if(step!==lastStep&&moved){lastStep=step;onStep(enemy,step%2);}
  if(age>=ACTIONS[id].duration){
   if(id==='H01')enter(threatened?'H02':'M07',ship);
   else if(id==='H02'){
    // Preserve the last aiming direction when committing to release.
    const lock=aim;enter(threatened?'H03':'M07',ship);if(id==='H03')aim=lock;
   }else if(id==='H03')enter('H04',ship);
   else if(id==='H04')enter('M07',ship);
   else if(control.queued){enter(control.queued,ship);control.queued=null;}
   else choose(ship,d);
  }
 };
 return control;
}
