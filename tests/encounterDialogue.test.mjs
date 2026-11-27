import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {createEncounterDialogue} from '../js/encounterDialogue.mjs';
import {dialogueCast,dialogueEvents} from '../js/dialogueContent.mjs';

function finish(controller){let budget=100;while(controller.state.active&&budget--)controller.advance();assert.ok(budget>0);}
test('production dialogue covers all nine enemies and both sides of every first encounter',()=>{
 const covered=dialogueEvents.flatMap(e=>e.enemies);assert.equal(new Set(covered).size,9);assert.equal(covered.length,9);
 for(const event of dialogueEvents){assert.ok(event.lines.some(l=>l.actor==='pilot'));for(const id of event.enemies)assert.ok(event.lines.some(l=>l.actor===id));
  for(const line of event.lines){assert.ok(line.actor==='pilot'||event.enemies.includes(line.actor));assert.ok(existsSync(new URL('../art-prototypes/dialogue-proposals/assets/'+dialogueCast[line.actor].image+'.webp',import.meta.url)));if(['survival','legacy-a','legacy-b'].includes(line.actor))assert.ok(line.action);}
 }
});
test('only real spawned identities trigger scenes, paired scenes wait for both actors, reset allows a new run',()=>{
 const d=createEncounterDialogue();assert.equal(d.spawn(['GOZILLA','kaiju',undefined]),false);
 assert.equal(d.spawn(['legacy-a']),false);assert.equal(d.state.seen.length,0);
 assert.equal(d.spawn(['legacy-b']),true);assert.equal(d.state.eventId,'legacy');assert.deepEqual(d.state.seen,['legacy-a','legacy-b']);
 d.skip();assert.equal(d.spawn(['legacy-a','legacy-b']),false);
 assert.equal(d.spawn(['survival']),true);assert.equal(d.state.eventId,'hunter');finish(d);
 d.reset();assert.equal(d.state.seen.length,0);assert.equal(d.spawn(['survival']),true);
});
test('a same-tick group queues different first encounters and releases combat only after all are read',()=>{
 let starts=0,finishes=0;const d=createEncounterDialogue({onStart:()=>starts++,onFinish:()=>finishes++});
 d.spawn(['zark-zero','fort']);assert.equal(starts,1);assert.equal(d.state.eventId,'patrol');
 const firstLength=d.state.total;for(let i=0;i<firstLength*2;i++)d.advance();
 assert.equal(d.state.eventId,'fort');assert.equal(finishes,0);assert.equal(starts,1);
 finish(d);assert.equal(finishes,1);assert.equal(d.spawn(['zark-zero','fort']),false);
});
test('manual advance fills the sentence before moving; hold suspension and history stop all reading timers',()=>{
 const d=createEncounterDialogue();d.spawn(['survival']);assert.equal(d.state.text,'');
 d.update(76);assert.equal(d.state.text,'……');d.advance();assert.equal(d.state.complete,true);assert.equal(d.state.index,0);
 d.advance();assert.equal(d.state.index,1);d.setAuto(true);d.suspend();const before=d.state;
 for(let i=0;i<100;i++)d.update(250);assert.equal(d.state.text,before.text);assert.equal(d.state.index,before.index);
 d.advance();assert.equal(d.state.suspended,false);assert.equal(d.state.index,before.index);
 d.history(true);assert.equal(d.state.complete,true);for(let i=0;i<100;i++)d.update(250);assert.equal(d.state.index,before.index);
 d.history(false);for(let i=0;i<7;i++)d.update(250);assert.equal(d.state.index,before.index);
});
test('auto waits for reading time and large wall-clock gaps never skip the conversation',()=>{
 const d=createEncounterDialogue({reducedMotion:true});d.spawn(['survival']);assert.equal(d.state.complete,true);d.setAuto(true);
 d.update(60000);assert.equal(d.state.index,0);for(let i=0;i<7;i++)d.update(250);assert.equal(d.state.index,1);
 let budget=1000;while(d.state.active&&budget--)d.update(250);assert.ok(budget>0);assert.equal(d.state.active,false);
});
test('skip consumes the spawned group, never repeats it and leaves a future unseen type available',()=>{
 const d=createEncounterDialogue();d.spawn(['ring-alpha','ring-beta']);d.skip();assert.equal(d.spawn(['ring-alpha','ring-beta']),false);
 assert.equal(d.spawn(['turret']),true);assert.equal(d.state.eventId,'turret');
});
