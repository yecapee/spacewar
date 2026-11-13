import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createMovement, createFixedClock } from '../js/gameplay.mjs';

// Run the actual session controller with lightweight DOM/render/audio substitutes.
function session() {
  const elements = new Map();
  const handlers = {};
  const context2d = new Proxy({}, { get: () => () => {} });
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      style: { setProperty() {} }, classList: { toggle() {} }, dataset: {}, textContent: '',
      hidden: false, disabled: false, blur() {}, focus() {}, addEventListener() {},
      getContext: () => context2d,
    });
    return elements.get(id);
  }
  let frame;
  let shots = 0;
  const context = vm.createContext({
    createMovement, createFixedClock,
    document: {
      getElementById: element, documentElement: element('html'),
      addEventListener: (type, handler) => { handlers[type] = handler; },
    },
    window: { matchMedia: () => ({ matches: false }), addEventListener() {} },
    localStorage: { getItem: () => null, setItem() {} },
    requestAnimationFrame: (callback) => { frame = callback; },
    feedback: { reset() {}, render: () => ({ x: 0, y: 0, flash: 0 }) },
    renderData: { enemy: [], enemyBullet: [], aniEffect: [], item: [], skills: [], shipSkills: [] },
    w: 40, h: 60, vwidth: 600, vheight: 900, shipLife: 5, renderTime: 25,
    script: (_mileage, rules) => Object.assign(rules, { enemy: [], enemyQuantity: 0 }),
    createShip: class {
      constructor(options) {
        this.options = options;
        this.life = this.maxLife = options.life;
        this.position = options.position;
        this.shotFps = 8;
      }
      updateShield() {} grapic() {} skill() {}
      shot() { shots++; }
    },
  });
  const source = readFileSync(new URL('../index.js', import.meta.url), 'utf8')
    .replace(/^import\s+[\s\S]*?;\s*/gm, '');
  vm.runInContext(source, context);
  return { context, elements, handlers, tick: (time) => frame(time), shots: () => shots };
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
