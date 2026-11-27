import {dialogueCast} from './dialogueContent.mjs';

export function createDialogueView({document,controller,assetBase}) {
 const el=id=>document.getElementById(id),root=el('encounterDialogue'),history=el('dialogueHistory');
 // Older isolated harness pages also import the game, without the story UI.
 if(!root||!history)return {enabled:false,historyOpen:false,show(){},hide(){},render(){}};
 let lastLine='',activeEnemy='',lastEvent='';
 const set=(id,text)=>{if(el(id).textContent!==text)el(id).textContent=text;};
 const portrait=(id,actor)=>{el(id).src=assetBase+dialogueCast[actor].image+'.webp';el(id).alt=dialogueCast[actor].name+'頭像';};
 function closeHistory(){if(history.open)history.close();}
 el('dialogueNext').onclick=()=>controller.advance();
 el('dialogueSkip').onclick=()=>controller.skip();
 el('dialogueAuto').onclick=()=>controller.setAuto(!controller.state.automatic);
 el('dialogueLog').onclick=()=>{
  controller.history(true);el('dialogueHistoryLines').replaceChildren(...controller.state.history.map(line=>{
   const block=document.createElement('article'),name=document.createElement('h3'),text=document.createElement('p');
   name.textContent=dialogueCast[line.actor].name;text.textContent=line.text;block.append(name,text);
   if(line.action){const note=document.createElement('p');note.className='encounter-action';note.textContent=line.action;block.append(note);}
   return block;
  }));history.showModal();
 };
 el('dialogueHistoryClose').onclick=closeHistory;
 history.addEventListener('close',()=>controller.history(false));
 root.addEventListener('cancel',event=>{event.preventDefault();controller.suspend();});
 portrait('dialogueAllyPortrait','pilot');
 return {
  enabled:true,
  get historyOpen(){return history.open;},
  show(){if(!root.open)root.showModal();el('dialogueNext').focus({preventScroll:true});},
  hide(){closeHistory();if(root.open)root.close();lastLine=lastEvent=activeEnemy='';},
  render(state){
   if(!state.active)return;
   root.dataset.encounter=state.eventId;root.dataset.line=String(state.index+1);root.dataset.total=String(state.total);
   root.dataset.suspended=String(state.suspended);root.dataset.auto=String(state.automatic);
   set('dialogueChapter',state.title);set('dialogueProgress',`${state.index+1} / ${state.total}`);
   if(lastEvent!==state.eventId){lastEvent=state.eventId;set('dialogueAllyText','……確認前方訊號。');set('dialogueEnemyAction','');}
   const line=state.line,isAlly=line.actor==='pilot',key=state.eventId+':'+state.index;
   if(!isAlly&&activeEnemy!==line.actor){activeEnemy=line.actor;portrait('dialogueEnemyPortrait',line.actor);set('dialogueEnemyName',dialogueCast[line.actor].name);}
   for(const [id,active] of [['dialogueEnemy',!isAlly],['dialogueAlly',isAlly]]){
    el(id).classList.toggle('speaking',active);el(id).classList.toggle('listening',!active);
   }
   if(key!==lastLine){
    lastLine=key;el(isAlly?'dialogueAlly':'dialogueEnemy').scrollTop=0;
    set('dialogueAnnouncement',dialogueCast[line.actor].name+'：'+line.text+(line.action?' '+line.action:''));
    if(!isAlly)set('dialogueEnemyAction',line.action||'');
   }
   set(isAlly?'dialogueAllyText':'dialogueEnemyText',state.text);
   set('dialogueNext',state.suspended?'繼續閱讀':state.complete?(state.index===state.total-1?'開始交戰':'繼續'):'顯示整句');
   set('dialogueAuto',state.automatic?'自動：開':'自動');el('dialogueAuto').setAttribute('aria-pressed',String(state.automatic));
   set('dialogueHint',state.suspended?'閱讀已暫停，按「繼續閱讀」接續。':'Space / Enter 繼續 · 戰鬥暫停中');
  },
 };
}
