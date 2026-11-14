import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createSurvivalController} from '../art-prototypes/zilla-combat/survival-controller.mjs';
import {createSurvivalAttack} from '../art-prototypes/zilla-combat/spacewar-attack.mjs';
import {rasterizeTriangle} from '../art-prototypes/zilla-combat/projected-collider.mjs';
import {getEncounter,registerEncounter} from '../js/encounter.mjs';
const fixture=()=>{const enemy={life:800,maxlife:800,position:12,removed:false},ship={position:35*30+15,bullet:[],life:5,isDead:false};const k=enemy.kaiju=createSurvivalController(enemy,{width:30,height:56,random:()=>.5});return {enemy,ship,k};};
const ticks=(k,ship,n)=>{for(let i=0;i<n;i++)k.update(ship);};
test('normal game has no registered scenario',()=>{assert.equal(getEncounter(),null);const example={ready:false};registerEncounter(example);assert.equal(getEncounter(),example);registerEncounter(null);});
test('isolated page imports the actual main entry and uses original player code',()=>{
 const entry=fs.readFileSync(new URL('../art-prototypes/zilla-combat/viewer.mjs',import.meta.url),'utf8');assert.match(entry,/import '\.\.\/\.\.\/index\.js'/);assert.doesNotMatch(entry,/CreatureCombat|setInput|keydown|playerHP/);
 const setup=fs.readFileSync(new URL('../art-prototypes/zilla-combat/setup.mjs',import.meta.url),'utf8');assert.match(setup,/life:800/);assert.doesNotMatch(setup,/makeShip|createShip|playerHP|bulletDamage/);
});
test('AI observes real enemy life loss, gates heat, then exhausts and retreats',()=>{
 const {enemy,ship,k}=fixture();k.update(ship);assert.equal(k.pressure,0);enemy.life-=47;k.update(ship);assert.equal(k.pressure,47);assert.notEqual(k.state.action,'H01');
 enemy.life--;k.update(ship);assert.equal(k.pressure,48);assert.equal(k.state.action,'H01');assert.equal(k.queueAction('H03'),false);
 ticks(k,ship,270);assert.ok(k.history.includes('H02'));assert.ok(k.history.includes('H03'));assert.ok(k.history.includes('H04'));assert.ok(k.history.includes('M07'));assert.equal(k.heatCount,1);assert.equal(ship.life,5,'AI must never write player life');
 enemy.life-=50;ticks(k,ship,80);assert.equal(k.heatCount,1,'cooldown must prevent another release');
});
test('no incoming damage means melee choices without scripted heat cycles',()=>{
 const {enemy,ship,k}=fixture();ticks(k,ship,40*35);assert.equal(k.heatCount,0);assert.ok(k.history.some(id=>id.startsWith('A')));assert.equal(ship.life,5);assert.equal(enemy.life,800);
});
test('all motion remains bounded and finite after player relocation',()=>{
 const {enemy,ship,k}=fixture();for(let i=0;i<3000;i++){if(i%150===0)ship.position=(i%2?8:45)*30+(i%3?3:25);k.update(ship);assert.ok(Number.isFinite(k.state.bodyHeading));assert.ok(enemy.position>=0&&enemy.position<30*56);assert.ok(k.state.pose.jaw>=0&&k.state.pose.jaw<=1);}
});
test('physical attacks call original ship.injured instead of assigning custom HP damage',()=>{
 const {enemy,ship,k}=fixture();let hits=0;ship.injured=()=>{hits++;};k.state.serial=1;k.state.action='A01';k.state.pose={active:false};k.meleeShape={x:20,y:20,radius:15};
 const skill=createSurvivalAttack(enemy,{pixel:15,width:450,height:840,toXY:()=>({x:0,y:0})}),world={cache:{get:()=>({points:[{x:20,y:20,radius:7.5}]})}};
 skill.update(ship,world);assert.equal(hits,0);k.state.pose.active=true;skill.update(ship,world);skill.update(ship,world);assert.equal(hits,1);assert.equal(ship.life,5);
});
test('heat ray uses existing particle shield interception and original injury callback',()=>{
 const {enemy,ship,k}=fixture();let hits=0,burns=0;ship.injured=()=>{hits++;};Object.assign(k.state,{phase:'beam',beam:1,flame:0,tick:40,serial:1,pose:{active:false}});k.mouth={x:20,y:100};k.direction={x:0,y:1};
 const particle={x:20,y:180,alive:true};ship.airShield={phase:'ready',particles:[particle]};const attack=createSurvivalAttack(enemy,{pixel:15,width:450,height:840,toXY:()=>({x:0,y:0}),onShieldBreak:()=>burns++}),world={cache:{get:()=>({points:[{x:20,y:240,radius:7.5}]})}};
 attack.update(ship,world);assert.equal(hits,0);assert.equal(burns,1);assert.equal(particle.alive,false);k.state.tick++;attack.update(ship,world);assert.equal(hits,1);
});
test('projected triangle collider fills body cells without a giant rectangular hitbox',()=>{
 const cells=new Set();rasterizeTriangle({x:0,y:0},{x:5,y:0},{x:0,y:5},cells);assert.ok(cells.has('1,1'));assert.ok(!cells.has('4,4'));assert.ok(cells.size>10);
});
