import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createMovement, createFixedClock } from '../js/gameplay.mjs';
import { createRecords } from '../js/records.mjs';
import { compact } from '../js/engine.mjs';
import { createProjectileSystem } from '../js/projectileSystem.mjs';
import { createTouchGestures } from '../js/touchGestures.mjs';

// Run the actual session controller with lightweight DOM/render/audio substitutes.
function session({search='',encounter=null,story=null}={}) {
  const elements = new Map();
  const handlers = {};
  const context2d = new Proxy({}, { get: () => () => {} });
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      style: { setProperty() {} }, classList: { toggle() {} }, dataset: {}, textContent: '',
      hidden: false, disabled: false, blur() {}, focus() {}, listeners: {},
      addEventListener(type, handler) { this.listeners[type] = handler; },
      setPointerCapture() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 600, height: 900 }),
      getContext: () => context2d,
    });
    return elements.get(id);
  }
  let frame;
  let shots = 0, updates = 0, draws = 0;
  const context = vm.createContext({
    createMovement, createFixedClock, createTouchGestures, createRecords, compact, getEncounter:()=>encounter,
    prepareCreature:()=>({then(callback){callback();return {catch(){}};}}),
    projectiles: createProjectileSystem({ width: 40, height: 60, cellWidth: 15, cellHeight: 15 }),
    world: { begin() {}, rebuild() {} }, drawProjectile() {},
    document: {
      getElementById: element, documentElement: element('html'),
      addEventListener: (type, handler) => { handlers[type] = handler; },
    },
    window: { location:{search}, matchMedia: () => ({ matches: false }), addEventListener() {} },
    localStorage: { getItem: () => null, setItem() {} },
    requestAnimationFrame: (callback) => { frame = callback; },
    feedback: { reset() {}, update() {}, render: () => ({ x: 0, y: 0, flash: 0 }) },
    renderData: { enemy: [], enemyBullet: [], aniEffect: [], item: [], skills: [], shipSkills: [] },
    w: 40, h: 60, vwidth: 600, vheight: 900, shipLife: 5, renderTime: 25,
    script: story||((_mileage, rules) => Object.assign(rules, { enemy: [], enemyQuantity: 0 })),
    createEnemy: class {constructor(options){Object.assign(this,options);this.options={...options};this.removed=false;}update(){}draw(){}dead(){if(this.removed)return;this.life=0;this.removed=true;this.options.deadCb();}},
    createItem: class {constructor(options){Object.assign(this,options);this.removed=false;}update(){}draw(){}},
    createShip: class {
      constructor(options) {
        this.options = options;
        this.life = this.maxLife = options.life;
        this.position = options.position;
        this.shotFps = 8;
        this.bullet = []; this.simulationPosition = this.previousPosition = this.position;
        this.casts = [];
      }
      updateShield() {} update() { updates++; } draw() { draws++; } grapic() {} skill(key) { this.casts.push(key); }
      shot() { shots++; }
    },
  });
  const source = readFileSync(new URL('../index.js', import.meta.url), 'utf8')
    .replace(/^import\s+[\s\S]*?;\s*/gm, '');
  vm.runInContext(source, context);
  return { context, elements, handlers, tick: (time) => frame(time), shots: () => shots, updates: () => updates, draws: () => draws };
}

test('pause freezes the session and releases firing; resume does not jump forward', () => {
  const { context, elements, handlers, tick, shots } = session();
  context.startRun();
  handlers.keydown({ code: 'Space', repeat: false, preventDefault() {}, target: { closest: () => null } });
  tick(0);
  tick(125);
  assert.ok(shots() > 0);
  const fired = shots();
  const distance = elements.get('mileage').textContent;
  context.togglePause();
  tick(5000);
  assert.equal(elements.get('mileage').textContent, distance);
  assert.equal(shots(), fired);
  assert.equal(elements.get('ready').dataset.screen, 'paused');
  context.togglePause();
  tick(10000);
  assert.equal(elements.get('mileage').textContent, distance);
  tick(10025);
  assert.equal(Number(elements.get('mileage').textContent), Number(distance) + 1);
  assert.equal(shots(), fired);
});

test('death preserves the final score, opens the result screen, and restart clears the old run', () => {
  const { context, elements, tick } = session();
  context.startRun();
  context.killCount = 7;
  context.scriptMileage = 1234;
  context.ship.life = 0;
  context.ship.isDead = true;
  context.ship.options.deadCb();
  tick(0);
  for (let frame = 1; frame <= 32; frame++) tick(frame * 25);
  assert.equal(elements.get('ready').hidden, false);
  assert.equal(elements.get('ready').dataset.screen, 'over');
  assert.equal(elements.get('resultScore').textContent, '7');
  assert.equal(elements.get('resultMileage').textContent, '1234');
  const previousShip = context.ship;
  context.renderData.enemyBullet.push({ data: { x: 1, y: 1 } });
  context.startRun();
  assert.notEqual(context.ship, previousShip);
  assert.equal(context.ship.life, 5);
  assert.equal(context.renderData.enemyBullet.length, 0);
  assert.equal(elements.get('score').textContent, '0000');
  assert.equal(elements.get('mileage').textContent, '0000');
  assert.equal(elements.get('ready').hidden, true);
});

test('touch gestures invoke actual player skills and cancelled or paused input does not', () => {
  const { context, elements } = session(); context.startRun();
  const canvas = elements.get('view');
  const event = (x, y, time) => ({ pointerId: 1, pointerType: 'touch', clientX: x, clientY: y, timeStamp: time, preventDefault() {} });
  for (const time of [0, 180]) {
    canvas.listeners.pointerdown(event(300, 500, time));
    canvas.listeners.pointerup(event(300, 500, time + 40));
  }
  assert.deepEqual([...context.ship.casts], [65]);
  const point = (i) => event(300 + 50 * Math.cos(i * Math.PI / 20), 500 + 50 * Math.sin(i * Math.PI / 20), 500 + i * 20);
  canvas.listeners.pointerdown(point(0));
  for (let i = 1; i < 40; i++) canvas.listeners.pointermove(point(i));
  canvas.listeners.pointerup(point(40));
  assert.deepEqual([...context.ship.casts], [65, 83]);
  canvas.listeners.pointerdown(event(300, 500, 2000));
  canvas.listeners.pointercancel(event(300, 500, 2040));
  canvas.listeners.pointerup(event(300, 500, 2060));
  context.togglePause();
  canvas.listeners.pointerdown(event(300, 500, 2200));
  canvas.listeners.pointerup(event(300, 500, 2240));
  assert.deepEqual([...context.ship.casts], [65, 83]);
});

test('touch listeners recognize an open oval after a long movement drag',()=>{
  const {context,elements}=session();context.startRun();const canvas=elements.get('view');
  const event=(x,y,time)=>({pointerId:1,pointerType:'touch',clientX:x,clientY:y,timeStamp:time,preventDefault(){}});
  canvas.listeners.pointerdown(event(40,250,0));
  for(let i=1;i<=300;i++)canvas.listeners.pointermove(event(40+i*.8,250+i*.5,i*20));
  for(let i=0;i<32;i++)canvas.listeners.pointermove(event(280+32*Math.cos(i/32*Math.PI*1.6),450+20*Math.sin(i/32*Math.PI*1.6),6100+i*35));
  canvas.listeners.pointerup(event(280+32*Math.cos(Math.PI*1.6),450+20*Math.sin(Math.PI*1.6),7220));
  assert.deepEqual([...context.ship.casts],[83]);
});

 test('catch-up performs five logical updates but only one render; extra renders do not advance logic', () => {
  const run = session(); run.context.startRun(); run.tick(0);
  const rendered = run.draws(); run.tick(125);
  assert.equal(run.updates(), 5); assert.equal(run.draws() - rendered, 1);
  run.tick(126); assert.equal(run.updates(), 5); assert.equal(run.draws() - rendered, 2);
 });

test('direct kaiju encounter starts at the boss without overwriting survival records',()=>{
  const run=session({search:'?encounter=kaiju'});run.context.startRun();
  assert.equal(run.context.scriptMileage,2200);
  run.tick(0);run.tick(125);
  assert.equal(vm.runInContext('records.bestMileage',run.context),0);
  assert.equal(run.elements.get('overlayEyebrow').textContent,'BOSS ENCOUNTER / G-01');
});

test('multi-boss shortcut uses the normal mixed-boss story wave without changing records',()=>{
  const run=session({search:'?encounter=kaiju&wave=multi'});run.context.startRun();
  assert.equal(run.context.scriptMileage,5280);
  run.tick(0);run.tick(125);
  assert.equal(vm.runInContext('records.bestMileage',run.context),0);
});

test('isolated scenario shares player controls, waits for assets and completes without changing records',()=>{
 let done=false,resets=0,ticks=0;
 const encounter={ready:false,description:'test encounter',reset(){done=false;resets++;},script(_n,rule){Object.assign(rule,{enemy:[],enemyQuantity:0,stopCount:true,stopEnemyPush:true});},onTick(){ticks++;},complete:()=>done};
 const run=session({encounter});run.context.startRun();assert.equal(vm.runInContext('phase',run.context),'ready');
 encounter.ready=true;run.context.startRun();run.tick(0);
 const key=code=>run.handlers.keydown({code,repeat:false,preventDefault(){},target:{closest:()=>null}});
 key('Space');key('KeyA');key('KeyS');run.tick(125);
 assert.ok(run.shots()>0);assert.deepEqual([...run.context.ship.casts],[65,83]);assert.equal(resets,1);assert.ok(ticks>0);
 done=true;run.tick(150);assert.equal(run.elements.get('ready').dataset.screen,'won');assert.equal(vm.runInContext('phase',run.context),'won');
 assert.equal(vm.runInContext('records.bestMileage',run.context),0);assert.equal(run.elements.get('runStatus').textContent,'遭遇戰完成');
 run.context.startRun();assert.equal(resets,2);assert.equal(vm.runInContext('phase',run.context),'playing');assert.equal(run.context.ship.life,5);
});

function campaignStory(){
 const context=vm.createContext({w:40,h:60,pixelWeigth:15,renderData:{},createCreatureEnemy(){},createSurvivalAttack(){}});
 const source=readFileSync(new URL('../js/script.js',import.meta.url),'utf8').replace(/import[\s\S]*?from\s+["'][^"']+["'];/g,'').replace('export default function (renCount, ruleObj, nextPolling)','function story(renCount, ruleObj, nextPolling)');
 vm.runInContext(source+'\nthis.story=story;',context);return context.story;
}

test('campaign waits for the entire boss group, applies frozen events once and resumes the next chapter',()=>{
 const run=session({story:campaignStory()}),c=run.context;c.startRun();c.scriptMileage=1500;c.updateSimulation();
 assert.equal(c.renderData.enemy.length,2);assert.equal(c.scriptMileage,1500);
 for(let i=0;i<20;i++)c.updateSimulation();assert.equal(c.renderData.enemy.length,2,'frozen milestone cannot respawn bosses');
 c.renderData.enemy[0].dead();c.updateSimulation();assert.equal(c.scriptMileage,1500,'first of two bosses cannot release the chapter');
 c.renderData.enemy[0].dead();c.updateSimulation();assert.equal(c.scriptMileage,1501);c.updateSimulation();
 assert.equal(c.renderData.item.length,1);assert.equal(run.elements.get('chapterLabel').textContent,'04 火力突破');
 c.scriptMileage=1520;c.updateSimulation();assert.equal(c.renderData.item.length,3);
 c.startRun();c.scriptMileage=1500;c.updateSimulation();assert.equal(c.renderData.enemy.length,2,'restart resets milestone bookkeeping');
 const bosses=[...c.renderData.enemy];bosses.forEach(b=>b.dead());c.updateSimulation();assert.equal(c.scriptMileage,1501,'simultaneous kills advance exactly once');
});

test('solo hunter replaces the old boss, clears carryover enemies, and leaves twelve seconds of recovery',()=>{
 const run=session({story:campaignStory()}),c=run.context;c.startRun();
 c.renderData.enemy.push({life:1,removed:false,update(){},draw(){}});c.scriptMileage=2200;c.updateSimulation();
 assert.equal(c.renderData.enemy.length,1);assert.equal(c.renderData.enemy[0].name,'GOZILLA');assert.equal(typeof c.renderData.enemy[0].createKaiju,'function');
 for(let i=0;i<20;i++)c.updateSimulation();assert.equal(c.scriptMileage,2200);assert.equal(c.renderData.enemy.length,1);
 c.renderData.enemy[0].dead();c.updateSimulation();assert.equal(c.scriptMileage,2201);c.updateSimulation();
 for(let i=0;i<478;i++)c.updateSimulation();assert.equal(c.renderData.enemy.length,0);assert.equal(c.scriptMileage,2680);
 c.updateSimulation();assert.equal(run.elements.get('chapterLabel').textContent,'07 重返航線');
 assert.ok(c.renderData.item.every(item=>item.restoreLife.every(effect=>!effect.startsWith('liftMax'))),'recovery repairs instead of multiplying max health');
});

test('full campaign reaches endless mode with four gated boss groups and only one permanent hull upgrade',()=>{
 const run=session({story:campaignStory()}),c=run.context;c.startRun();
 const chapters=[],waves=[];let held=0,lastGate=-1;
 for(let i=0;i<7500&&c.scriptMileage<=7040;i++){
  c.updateSimulation();const label=run.elements.get('chapterLabel').textContent;
  if(chapters.at(-1)!==label)chapters.push(label);
  const bosses=c.renderData.enemy.filter(e=>e.showLife);
  if(bosses.length){
   if(lastGate!==c.scriptMileage){lastGate=c.scriptMileage;held=0;waves.push({mile:lastGate,count:bosses.length,names:bosses.map(e=>e.name)});}
   if(++held===3)bosses.forEach(e=>e.dead());
  }
 }
 assert.equal(c.scriptMileage,7041);assert.deepEqual(waves.map(w=>[w.mile,w.count]),[[1500,2],[2200,1],[4240,2],[5280,2]]);
 assert.equal(waves[1].names[0],'GOZILLA');assert.equal(chapters.at(-1),'14 無盡航行');assert.ok(chapters.includes('06 回收與喘息'));
 assert.equal(c.renderData.item.filter(item=>item.restoreLife?.some(effect=>effect.startsWith('liftMax'))).length,1);
});
