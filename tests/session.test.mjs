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
function session() {
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
    createMovement, createFixedClock, createTouchGestures, createRecords, compact,
    projectiles: createProjectileSystem({ width: 40, height: 60, cellWidth: 15, cellHeight: 15 }),
    world: { begin() {}, rebuild() {} }, drawProjectile() {},
    document: {
      getElementById: element, documentElement: element('html'),
      addEventListener: (type, handler) => { handlers[type] = handler; },
    },
    window: { matchMedia: () => ({ matches: false }), addEventListener() {} },
    localStorage: { getItem: () => null, setItem() {} },
    requestAnimationFrame: (callback) => { frame = callback; },
    feedback: { reset() {}, update() {}, render: () => ({ x: 0, y: 0, flash: 0 }) },
    renderData: { enemy: [], enemyBullet: [], aniEffect: [], item: [], skills: [], shipSkills: [] },
    w: 40, h: 60, vwidth: 600, vheight: 900, shipLife: 5, renderTime: 25,
    script: (_mileage, rules) => Object.assign(rules, { enemy: [], enemyQuantity: 0 }),
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

 test('catch-up performs five logical updates but only one render; extra renders do not advance logic', () => {
  const run = session(); run.context.startRun(); run.tick(0);
  const rendered = run.draws(); run.tick(125);
  assert.equal(run.updates(), 5); assert.equal(run.draws() - rendered, 1);
  run.tick(126); assert.equal(run.updates(), 5); assert.equal(run.draws() - rendered, 2);
 });
