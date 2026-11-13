import {sweepOffset} from './kaijuSweep.mjs';
const clamp = x => Math.max(0, Math.min(1,x));
const smooth = (a,b,x) => {const v=clamp((x-a)/(b-a));return v*v*(3-2*v);};
export const KAIJU_CYCLE = 624;
const TRACK_INTERVAL = 48; // Remember the player's position every 1.2 seconds.
const TURN_PER_TICK = .04;
const CRUISE_SPEED = 4;
const RUSH_SPEED = 18;
const FOLLOW_DISTANCE = 6;
export function sampleKaijuSequence(tick, state = {}) {
  const t=(tick%KAIJU_CYCLE)/40;
  state.tick=tick; state.time=t;
  state.phase=t<4?'walk':t<6.2?'charge':t<7.6?'flame':t<12.8?'beam':'cooldown';
  state.walking=1-smooth(3.6,4,t)+smooth(14.8,15.6,t);
  state.charge=smooth(4,6.2,t)*(1-smooth(12.9,14.6,t));
  state.firing=smooth(6.15,6.4,t)*(1-smooth(12.65,12.95,t));
  state.beam=smooth(7.6,7.8,t)*(1-smooth(12.65,12.95,t));
  state.flame=state.firing*(1-smooth(7.2,7.7,t));
  state.sweep=sweepOffset(t);
  state.jaw=.025+state.firing*.66+state.charge*.07;
  return state;
}

export function createKaijuController(enemy, {width,height,onStep=()=>{},random=Math.random}) {
  const state=sampleKaijuSequence(0);state.walkTime=0;
  let tick=0,lastStep=-1,heading=Math.PI/2,bodyHeading=heading,attackHeading=heading;
  let targetX=null,targetY=null,phase='walk',mode='cruise',modeAge=0,rushHeading=heading,rushDuration=0;
  let nextRush=Math.round((.65+random()*.85)*40),windupDuration=0,moveX=0,moveY=0;
  const margin=Math.min(4,Math.floor((width-1)/2)),rowMargin=Math.min(7,Math.floor((height-1)/2));
  const x=Math.max(margin,Math.min(width-1-margin,enemy.position%width));
  enemy.position=Math.round(height*.22)*width+x;enemy.previousPosition=enemy.position;
  const turn=(from,to,limit)=>from+Math.max(-limit,Math.min(limit,Math.atan2(Math.sin(to-from),Math.cos(to-from))));
  const control={state,mouth:{x:0,y:0},direction:{x:0,y:1},
    update(ship) {
      sampleKaijuSequence(tick++,state);
      const row=Math.floor(enemy.position/width),col=enemy.position%width;
      const playerX=ship.position%width,playerY=Math.floor(ship.position/width);
      if(targetX===null||(tick-1)%TRACK_INTERVAL===0){
        targetX=targetX===null?playerX:targetX+(playerX-targetX)*.6;
        targetY=targetY===null?playerY:targetY+(playerY-targetY)*.6;
      }
      const dx=targetX-col,dy=targetY-row,distance=Math.hypot(dx,dy);
      const desired=Math.atan2(dy,dx),liveAim=Math.atan2(playerY-row,playerX-col);
      const gaitAllowed=state.walking;let speed=0;
      state.rush=0;state.brace=0;state.moved=false;state.stomp=false;
      if(state.phase==='walk'){
        if(phase!=='walk'){
          mode='cruise';modeAge=0;nextRush=tick+Math.round((.45+random()*1.1)*40);
          moveX=moveY=0;
        }
        modeAge++;
        if(mode==='cruise'&&tick>=nextRush&&state.time<2.4&&distance>7){
          mode='windup';modeAge=0;
          // Commit to a nearby flank rather than homing perfectly during the lunge.
          rushHeading=Math.atan2(playerY-row+(random()-.5)*3,playerX-col+(random()-.5)*5);
          windupDuration=8+Math.round(random()*5);rushDuration=22+Math.round(random()*12);
          moveX=moveY=0;
        }
        if(mode==='windup'){
          bodyHeading=turn(bodyHeading,rushHeading,.06);heading=bodyHeading;
          state.brace=Math.min(1,modeAge/Math.max(1,windupDuration));state.walking=0;
          const error=Math.atan2(Math.sin(rushHeading-bodyHeading),Math.cos(rushHeading-bodyHeading));
          if(modeAge>=windupDuration&&Math.abs(error)<.035){mode='rush';modeAge=0;}
        }else if(mode==='rush'){
          heading=bodyHeading=rushHeading;state.rush=1;state.walking=1;
          speed=CRUISE_SPEED+(RUSH_SPEED-CRUISE_SPEED)*smooth(0,5,modeAge);
          if(modeAge>=rushDuration){
            mode='recover';modeAge=0;speed=0;state.rush=0;state.walking=0;
            onStep(enemy,lastStep%2);nextRush=tick+Math.round((.6+random()*.8)*40);
          }
        }else if(mode==='recover'){
          state.walking=0;state.brace=.35*(1-Math.min(1,modeAge/10));
          if(modeAge>=10){mode='cruise';modeAge=0;}
        }else{
          heading=turn(heading,desired,TURN_PER_TICK);bodyHeading=heading;
          if(distance<=FOLLOW_DISTANCE)state.walking=0;
          speed=distance>FOLLOW_DISTANCE?CRUISE_SPEED*gaitAllowed:0;
        }
      }else{
        mode='cruise';modeAge=0;moveX=moveY=0;state.walking=0;
        if(state.phase==='charge'&&phase!=='charge')state.aimBaseHeading=undefined;
        if(state.phase==='charge'||state.phase==='flame'){
          attackHeading=liveAim;bodyHeading=turn(bodyHeading,attackHeading,.06);heading=bodyHeading;
          state.aimTargetPosition=ship.position;
        }else if(state.phase==='beam'||state.phase==='cooldown'&&state.firing>.01){
          if(phase!=='beam'&&state.phase==='beam')state.aimTargetPosition=ship.position;
          bodyHeading=(state.aimBaseHeading??attackHeading)+state.sweep;heading=bodyHeading;
        }else{
          bodyHeading=turn(bodyHeading,desired,.025);heading=bodyHeading;
        }
      }
      state.bodyHeading=bodyHeading;state.attackHeading=state.aimBaseHeading??attackHeading;
      state.heading=heading;state.speed=speed;state.movement=state.phase==='walk'?mode:'attack';
      state.walkTime+=state.walking*(state.rush?3.2:1)/40;
      const step=Math.floor(state.walkTime/1.4);
      if(state.walking>.5&&step!==lastStep){lastStep=step;state.stomp=true;state.foot=1-step%2;onStep(enemy,state.foot);}
      if(speed>0){
        moveX+=Math.cos(heading)*speed/40;moveY+=Math.sin(heading)*speed/40;
        const sx=Math.trunc(moveX),sy=Math.trunc(moveY);moveX-=sx;moveY-=sy;
        const nextCol=Math.max(margin,Math.min(width-1-margin,col+sx));
        const nextRow=Math.max(rowMargin,Math.min(height-1-rowMargin,row+sy));
        enemy.position=nextRow*width+nextCol;state.moved=enemy.position!==row*width+col;
        if(mode==='rush'&&(nextCol!==col+sx||nextRow!==row+sy)){
          mode='recover';modeAge=0;state.rush=0;nextRush=tick+Math.round((.6+random()*.8)*40);
          state.speed=0;
          onStep(enemy,state.foot||0);
        }
      }
      state.movement=state.phase==='walk'?mode:'attack';
      phase=state.phase;
    }
  };
  return control;
}
