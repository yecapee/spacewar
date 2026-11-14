import {w} from '../../js/config';
import {registerEncounter} from '../../js/encounter.mjs';
import {createSurvivalController,ACTIONS} from './survival-controller.mjs';
import {createSurvivalAttack} from './spacewar-attack.mjs';
import {prepareCreature,updateSurvivalVisual,drawSurvivalVisual} from './spacewar-visual.mjs';
import {createCreatureEnemy} from './creature-enemy.mjs';
let boss=null,started=false;
export const encounter={
 ready:false,description:'沿用 Spacewar 原本的操作、攻擊波、粒子空氣盾與傷害機制，單獨對戰求生型怪獸 AI。',
 reset(){boss=null;started=false;},
 script(tick,rule){
  if(started)return;started=true;rule.enemy=[];rule.enemyQuantity=0;rule.stopEnemyPush=true;rule.stopCount=true;
  rule.boss=[{name:'GOZILLA',showLife:true,life:800,position:Math.floor(w/2),shot:false,shotTime:[1,0,1],look:'kaiju',skills:[],
   createKaiju(enemy,options){boss=enemy;return createCreatureEnemy(enemy,options);},createAttack:createSurvivalAttack}];
 },
 complete(){return Boolean(started&&boss&&(boss.removed||boss.life<1));},
 onTick(){if(!boss)return;const k=boss.kaiju,s=k.state;document.getElementById('creatureState').textContent=`${s.action} ${ACTIONS[s.action].name} · ${ACTIONS[s.action].phases[s.pose.phase]} ｜ ${boss.life} / ${boss.maxlife} ｜ 承傷 ${k.pressure} / ${k.damageThreshold}`;document.getElementById('creatureState').dataset.action=s.action;},
};
registerEncounter(encounter);
export async function prepareEncounter(){
 const button=document.getElementById('startButton'),status=document.getElementById('creatureState');button.disabled=true;
 try{await prepareCreature((loaded,total)=>{status.textContent='載入怪獸模型 '+(total?Math.round(loaded/total*100)+'%':(loaded/1048576).toFixed(1)+' MB');});encounter.ready=true;status.textContent='Spacewar 原版戰鬥系統 · 怪獸 AI 已就緒';button.disabled=false;}
 catch(e){status.textContent='怪獸模型載入失敗：'+e.message;console.error(e);}
 const select=document.getElementById('nextAction');for(const [id,action]of Object.entries(ACTIONS))if(!id.startsWith('H'))select.add(new Option(id+' '+action.name,id));
 document.getElementById('queueAction').onclick=()=>boss?.kaiju.queueAction(select.value);
}
