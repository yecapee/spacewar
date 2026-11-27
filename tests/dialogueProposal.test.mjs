import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {actors,encounters,encounterOnce} from '../art-prototypes/dialogue-proposals/content.mjs';

test('all nine enemy individuals have a portrait and speak in their first encounter',()=>{
 const enemies=Object.keys(actors).filter(id=>id!=='pilot');
 assert.equal(enemies.length,9);
 assert.equal(encounters.length,7);
 assert.deepEqual(encounters.map(e=>e.at),[0,640,1040,1500,2200,3280,5280]);
 for(const [id,a] of Object.entries(actors))assert.ok(fs.existsSync(new URL('../art-prototypes/dialogue-proposals/assets/'+a.image+'.webp',import.meta.url)),id);
 const covered=[];
 for(const event of encounters){
  assert.ok(event.lines.some(l=>l.actor==='pilot'));
  for(const id of event.enemies){assert.ok(event.lines.some(l=>l.actor===id));assert.equal(actors[id].first,event.at);covered.push(id);}
  assert.ok(event.choices.length>=2);
  for(const choice of event.choices){assert.ok(choice.lines.some(l=>l.actor==='pilot'));assert.ok(choice.lines.some(l=>event.enemies.includes(l.actor)));}
  for(const l of [...event.lines,...event.choices.flatMap(c=>c.lines)]){assert.ok(actors[l.actor]);assert.ok(l.text.length>0);if(['survival','legacy-a','legacy-b'].includes(l.actor))assert.ok(l.action);}
 }
 assert.deepEqual(covered.sort(),enemies.sort());
});
test('paired first encounters mark both actors; repeats skip; a new run resets',()=>{
 const seen=new Set();
 for(const id of ['rings','legacy']){const e=encounters.find(e=>e.id===id);assert.equal(encounterOnce(seen,e),true);e.enemies.forEach(a=>assert.ok(seen.has(a)));assert.equal(encounterOnce(seen,e),false);}
 assert.equal(seen.size,4);seen.clear();assert.equal(encounterOnce(seen,encounters.find(e=>e.id==='rings')),true);
});
test('public dialogue export matches the reviewed scripts and portraits',()=>{
 const exported=JSON.parse(fs.readFileSync(new URL('../art-prototypes/dialogue-proposals/dialogue.json',import.meta.url)));
 assert.deepEqual(exported,{actors,encounters});
});
