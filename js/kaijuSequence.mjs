const clamp = x => Math.max(0, Math.min(1,x));
const smooth = (a,b,x) => {const v=clamp((x-a)/(b-a));return v*v*(3-2*v);};
export const KAIJU_CYCLE = 560;
const TRACK_INTERVAL = 48; // Remember the player's position every 1.2 seconds.
const TURN_PER_TICK = .028;
const FOLLOW_DISTANCE = 6;
export function sampleKaijuSequence(tick, state = {}) {
  const t=(tick%KAIJU_CYCLE)/40;
  state.tick=tick; state.time=t;
  state.phase=t<4?'walk':t<6.2?'charge':t<7.6?'flame':t<10.4?'beam':'cooldown';
  state.walking=1-smooth(3.6,4,t)+smooth(13.2,14,t);
  state.charge=smooth(4,6.2,t)*(1-smooth(10.5,13.2,t));
  state.firing=smooth(6.15,6.4,t)*(1-smooth(10.25,10.5,t));
  state.beam=smooth(7.3,7.65,t)*(1-smooth(10.25,10.5,t));
  state.flame=state.firing*(1-smooth(7.2,7.7,t));
  state.sweep=-.38+smooth(7.6,10.4,t)*.76;
  state.jaw=.025+state.firing*.66+state.charge*.07;
  return state;
}

export function createKaijuController(enemy, {width,height,onStep=()=>{}}) {
  const state=sampleKaijuSequence(0);state.walkTime=0;
  let age=0,lastStep=-1,heading=Math.PI/2,targetX=null,targetY=null;
  // Give both boss variants room for the same silhouette, including on narrow screens.
  const margin=Math.min(4,Math.floor((width-1)/2));
  const x=Math.max(margin,Math.min(width-1-margin,enemy.position%width));
  enemy.position=Math.round(height*.22)*width+x;enemy.previousPosition=enemy.position;
  return {state, mouth:{x:0,y:0}, direction:{x:0,y:1},
    update(ship) {
      sampleKaijuSequence(age++,state);
      if(targetX===null||(age-1)%TRACK_INTERVAL===0){
        const x=ship.position%width,y=Math.floor(ship.position/width);
        targetX=targetX===null?x:targetX+(x-targetX)*.6;
        targetY=targetY===null?y:targetY+(y-targetY)*.6;
      }
      const row=Math.floor(enemy.position/width),col=enemy.position%width;
      const targetDX=targetX-col,targetDY=targetY-row;
      const distance=Math.hypot(targetDX,targetDY);
      if(distance<=FOLLOW_DISTANCE)state.walking=0;
      if(state.walking>.5&&distance>FOLLOW_DISTANCE){
        const desired=Math.atan2(targetDY,targetDX);
        const difference=Math.atan2(Math.sin(desired-heading),Math.cos(desired-heading));
        heading+=Math.max(-TURN_PER_TICK,Math.min(TURN_PER_TICK,difference));
      }
      state.heading=heading;
      state.walkTime+=state.walking/40;
      const step=Math.floor(state.walkTime/1.4);
      state.stomp=false;
      if(state.walking>.5&&step!==lastStep){
        lastStep=step;state.stomp=true;state.foot=1-step%2;
        if(step>0&&distance>FOLLOW_DISTANCE){
          // Commit only on a planted step, using the slowly turning remembered heading.
          const hx=Math.cos(heading),hy=Math.sin(heading);
          const dx=Math.abs(hx)>.38?Math.sign(hx):0;
          const dy=Math.abs(hy)>.38?Math.sign(hy):0;
          const nextCol=Math.max(margin,Math.min(width-1-margin,col+dx));
          const rowMargin=Math.min(7,Math.floor((height-1)/2));
          const nextRow=Math.max(rowMargin,Math.min(height-1-rowMargin,row+dy));
          enemy.position=nextRow*width+nextCol;
        }
        onStep(enemy,state.foot);
      }
    }
  };
}
