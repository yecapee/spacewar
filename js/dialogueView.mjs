import {dialogueCast} from './dialogueContent.mjs';

export function createDialogueView({document,controller,assetBase}) {
 const el=id=>document.getElementById(id),root=el('encounterDialogue');
 // Older isolated harness pages also import the game, without the story UI.
 if(!root)return {enabled:false,show(){},hide(){},render(){}};
 let lastLine='',activeEnemy='',lastEvent='';
 const set=(id,text)=>{if(el(id).textContent!==text)el(id).textContent=text;};
 const portrait=(id,actor)=>{el(id).src=assetBase+dialogueCast[actor].image+'.webp';el(id).alt=dialogueCast[actor].name+'頭像';};
 root.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();controller.advance();});
 root.addEventListener('cancel',event=>event.preventDefault());
 portrait('dialogueAllyPortrait','pilot');
 return {
  enabled:true,
  show(){if(!root.open)root.showModal();root.focus({preventScroll:true});},
  hide(){if(root.open)root.close();lastLine=lastEvent=activeEnemy='';},
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
   set('dialogueHint',state.suspended?'任意鍵或點擊畫面，接續閱讀。':'任意鍵或點擊畫面繼續 · 戰鬥暫停中');
  },
 };
}
