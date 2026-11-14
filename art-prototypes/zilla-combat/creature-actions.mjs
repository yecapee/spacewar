export const ACTIONS=Object.freeze({
 M01:{name:'警戒觀察',duration:1.4,group:'移動',phases:['觀察','追蹤','判斷']},
 M02:{name:'謹慎接近',duration:2.4,group:'移動',phases:['試探','接近','停頓']},
 M03:{name:'低姿奔跑',duration:1.7,group:'移動',phases:['壓低','加速','接近']},
 M04:{name:'急停側切',duration:1.05,group:'移動',phases:['支撐急停','側切','站穩']},
 M05:{name:'短步後撤',duration:1.05,group:'移動',phases:['觀察','退步','站穩']},
 M06:{name:'繞行尋隙',duration:2.6,group:'移動',phases:['觀察','繞側','尋隙']},
 M07:{name:'受傷撤離',duration:2.8,group:'移動',phases:['護住傷側','撤離','觀察出口']},
 A01:{name:'試探爪擊',duration:.95,group:'肉搏',phases:['抬爪','短擊','收爪'],window:[.33,.55],damage:15},
 A02:{name:'側身撞擊',duration:1.4,group:'肉搏',phases:['壓肩','側撞','收勢'],window:[.34,.65],damage:20},
 A03:{name:'跨步重咬',duration:1.65,group:'肉搏',phases:['張顎蓄力','前探咬合','鬆口收回'],window:[.38,.57],damage:24},
 A04:{name:'撲壓制伏',duration:2.2,group:'肉搏',phases:['屈腿蓄力','前撲壓制','落地恢復'],window:[.48,.64],damage:27},
 A05:{name:'防禦尾掃',duration:1.8,group:'肉搏',phases:['扭身','尾掃','恢復'],window:[.35,.67],damage:22},
 A06:{name:'貼身掙脫',duration:1.5,group:'肉搏',phases:['縮身','推爪扭身','脫困'],window:[.25,.65],damage:17},
 D01:{name:'假衝鋒',duration:2.4,group:'欺騙',phases:['正面假衝','急停側切','切入弱側']},
 D02:{name:'假撤退',duration:2.6,group:'欺騙',phases:['退步示弱','觀察追擊','反擊或撤離']},
 D03:{name:'轉移注意',duration:2.2,group:'欺騙',phases:['注視戰機','尾巴預轉','突然突圍']},
 H01:{name:'受傷壓力預警',duration:1.1,group:'熱射線',phases:['呼吸加重','護住傷側','尋找出口']},
 H02:{name:'張嘴蓄熱',duration:1.2,group:'熱射線',phases:['站穩','張顎蓄熱','鎖定方向']},
 H03:{name:'熱射線突圍',duration:1.35,group:'熱射線',phases:['射線起始','持續釋放','停止釋放']},
 H04:{name:'衰弱撤離',duration:2.6,group:'熱射線',phases:['停止噴射','喘息','緩慢撤離']},
});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const env=(a,b,c,d,p)=>smooth(a,b,p)*(1-smooth(c,d,p));
export function sampleAction(id,time){
 const def=ACTIONS[id];if(!def)throw new Error('Unknown action: '+id);const p=clamp(time/def.duration,0,1);
 const state={id,p,phase:Math.min(2,Math.floor(p*3)),gait:0,reverse:false,lean:0,crouch:0,jump:0,jaw:0,claw:0,
  tail:0,bodyTwist:0,headTurn:0,injured:0,charge:0,beam:0,exhaust:0,active:false,vulnerable:1};
 if(id==='M02'||id==='M06')state.gait=.48;
 if(id==='M03'){state.gait=1;state.crouch=.25;}
 if(id==='M04'){state.gait=.95;state.lean=.32*env(0,.18,.6,1,p);state.crouch=.3;}
 if(id==='M05'){state.gait=.45;state.reverse=true;}
 if(id==='M07'){state.gait=.7;state.injured=1;state.crouch=.12;}
 if(id==='A01')state.claw=env(.08,.3,.55,.9,p);
 if(id==='A02'){state.lean=.4*env(.05,.3,.67,1,p);state.gait=env(.2,.35,.7,.85,p);state.bodyTwist=.3*state.lean;}
 if(id==='A03'){state.jaw=env(.05,.3,.42,.58,p);state.crouch=.12;state.headTurn=0;state.gait=.5*env(.2,.35,.6,.8,p);}
 if(id==='A04'){state.crouch=.45*env(0,.2,.25,.38,p);state.jump=1.1*env(.25,.42,.48,.63,p);state.claw=env(.2,.4,.65,.9,p);}
 if(id==='A05'){state.tail=env(.14,.35,.7,.95,p);state.bodyTwist=.45*state.tail;}
 if(id==='A06'){state.claw=env(.05,.2,.65,.95,p);state.tail=.55*state.claw;state.bodyTwist=Math.sin(p*Math.PI*5)*.14;}
 if(id==='D01'){state.gait=p<.38?1:p<.48?0:.9;state.crouch=.18;state.lean=.3*env(.36,.5,.82,1,p);}
 if(id==='D02'){state.gait=p<.42?.45:0;state.reverse=true;state.crouch=.13;}
 if(id==='D03'){state.gait=p>.4?1:.1;state.headTurn=p<.55?-.4:0;state.tail=.2;}
 if(id==='H01'){state.crouch=.15;state.injured=1;state.exhaust=.4;}
 if(id==='H02'){state.jaw=smooth(.02,.55,p);state.charge=smooth(0,.8,p);state.crouch=.08;}
 if(id==='H03'){state.jaw=1;state.charge=1;state.beam=env(0,.08,.9,1,p);}
 if(id==='H04'){state.jaw=1-smooth(0,.25,p);state.exhaust=1;state.injured=1;state.gait=p>.45?.35:0;state.vulnerable=1.35;}
 if(def.window){state.active=p>=def.window[0]&&p<=def.window[1];if(p>def.window[1])state.vulnerable=1.25;}
 return state;
}
