const clamp = x => Math.max(0, Math.min(1,x));
const smooth = (a,b,x) => {const v=clamp((x-a)/(b-a));return v*v*(3-2*v);};
export const KAIJU_CYCLE = 560;
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
  let age=0,lastStep=-1;
  // Give both boss variants room for the same silhouette, including on narrow screens.
  const margin=Math.min(4,Math.floor((width-1)/2));
  const x=Math.max(margin,Math.min(width-1-margin,enemy.position%width));
  enemy.position=Math.round(height*.22)*width+x;enemy.previousPosition=enemy.position;
  return {state, mouth:{x:0,y:0}, direction:{x:0,y:1},
    update(ship) {
      sampleKaijuSequence(age++,state);
      state.walkTime+=state.walking/40;
      const step=Math.floor(state.walkTime/1.4);
      state.stomp=false;
      if(state.walking>.5&&step!==lastStep){
        lastStep=step;state.stomp=true;state.foot=1-step%2;
        if(step>0){
          const row=Math.floor(enemy.position/width), col=enemy.position%width;
          const shipCol=ship.position%width;
          const dx=Math.abs(shipCol-col)>2?Math.sign(shipCol-col):0;
          const nextCol=Math.max(margin,Math.min(width-1-margin,col+dx));
          const nextRow=Math.min(Math.round(height*.31),row+1);
          enemy.position=nextRow*width+nextCol;
        }
        onStep(enemy,state.foot);
      }
    }
  };
}
