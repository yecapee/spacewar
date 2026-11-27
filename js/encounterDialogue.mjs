import {dialogueEvents} from './dialogueContent.mjs';

// Presentation time is independent of the frozen combat clock.
export function createEncounterDialogue({events=dialogueEvents,onStart=()=>{},onChange=()=>{},onFinish=()=>{},reducedMotion=false}={}) {
 const seen=new Set(),spawned=new Set(),queue=[];
 let current=null,index=0,revealed=0,elapsed=0,readingMs=0,automatic=false,suspended=false,historyOpen=false;
 const line=()=>current?.lines[index];
 function snapshot(){return {
  active:Boolean(current),eventId:current?.id||null,title:current?.title||'',
  line:line()||null,index,total:current?.lines.length||0,
  text:line()?Array.from(line().text).slice(0,revealed).join(''):'',
  complete:Boolean(line()&&revealed>=Array.from(line().text).length),
  automatic,suspended,historyOpen,history:current?current.lines.slice(0,index+1):[],seen:[...seen],
 };}
 const emit=()=>onChange(snapshot());
 function load(event){current=event;index=0;elapsed=readingMs=0;revealed=reducedMotion?Array.from(line().text).length:0;}
 function finish(){
  if(queue.length){load(queue.shift());emit();return;}
  current=null;historyOpen=false;suspended=false;emit();onFinish();
 }
 const api={
  get state(){return snapshot();},
  spawn(ids){
   for(const id of ids)if(id)spawned.add(id);
   for(const event of events){
    if(event.enemies.every(id=>spawned.has(id))&&!event.enemies.every(id=>seen.has(id))){
     event.enemies.forEach(id=>seen.add(id));queue.push(event);
    }
   }
   if(!current&&queue.length){load(queue.shift());onStart();emit();}
   return Boolean(current);
  },
  advance(){
   if(!current||historyOpen)return;
   if(suspended){suspended=false;elapsed=readingMs=0;emit();return;}
   const length=Array.from(line().text).length;
   if(revealed<length){revealed=length;readingMs=0;emit();return;}
   if(index===current.lines.length-1){finish();return;}
   index++;elapsed=readingMs=0;revealed=reducedMotion?Array.from(line().text).length:0;emit();
  },
  skip(){if(!current)return;queue.length=0;finish();},
  setAuto(value){automatic=Boolean(value);readingMs=0;if(automatic)suspended=false;emit();},
  suspend(value=true){if(!current)return;suspended=Boolean(value);elapsed=readingMs=0;emit();},
  history(value){if(!current)return;historyOpen=Boolean(value);if(historyOpen)revealed=Array.from(line().text).length;readingMs=0;emit();},
  update(delta){
   if(!current||suspended||historyOpen)return;
   const ms=Math.min(250,Math.max(0,Number.isFinite(delta)?delta:0)),length=Array.from(line().text).length;
   if(revealed<length){elapsed+=ms;const count=Math.min(length,Math.floor(elapsed/38));if(count>revealed){revealed=count;emit();}if(revealed===length)readingMs=0;}
   else if(automatic){readingMs+=ms;if(readingMs>=Math.max(2000,length*100))api.advance();}
  },
  reset(){seen.clear();spawned.clear();queue.length=0;current=null;index=revealed=elapsed=readingMs=0;automatic=suspended=historyOpen=false;emit();},
 };
 return api;
}
