import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { ITEM_RESOLUTION, itemArtKey } from '../js/itemArt.mjs';

test('pickup art follows the actual effects rather than the shared legacy shape', () => {
  assert.equal(itemArtKey({ restoreLife: ['liftRestore-1'] }), 'repair');
  assert.equal(itemArtKey({ restoreLife: ['liftMax-2', 'liftReset'] }), 'hull');
  assert.equal(itemArtKey({ changeBullet: 'treble' }), 'triple');
  for (const kind of ['repair','hull','triple']) {
    const png = readFileSync(new URL(`../img/items/${kind}.png`, import.meta.url));
    assert.equal(png.readUInt32BE(16), ITEM_RESOLUTION);
    assert.equal(png.readUInt32BE(20), ITEM_RESOLUTION);
    assert.equal(png[25], 6, 'RGBA sprites retain transparency');
  }
});

function harness() {
  let spriteDraws = 0, brickDraws = 0, effects = 0;
  const context = vm.createContext({
    world: { cache: { get: () => ({ pathObj: [{ps:10}] }) } },
    drawItem: () => { spriteDraws++; return true; }, bricks: () => brickDraws++,
    positionToXY: (ps, out = {}) => Object.assign(out, {x:ps%40*15,y:Math.floor(ps/40)*15}),
    movePathList: {}, pixelWeigth:15, w:40, h:60, renderData:{},
  });
  const source = readFileSync(new URL('../js/createItem.js', import.meta.url), 'utf8')
    .replace(/import[\s\S]*?from\s+["'][^"']+["'];/g, '')
    .replace('export default function (obj)', 'function Item(obj)');
  vm.runInContext(source+'\nthis.Item=Item;', context);
  return { create: options => new context.Item({position:100,look:'hp+',effect:()=>effects++,...options}),
    counts: () => [spriteDraws,brickDraws,effects] };
}

test('new art keeps repair, hull and triple-shot rewards and cannot grant a pickup twice', () => {
  const h = harness(), ship = {life:3,maxLife:5,bulletType:'normal'};
  const repair = h.create({restoreLife:['liftRestore-1']});
  for (let i=0;i<20;i++) repair.draw({});
  assert.equal(ship.life,3);
  repair.wasPickUp(ship); repair.wasPickUp(ship); repair.draw({});
  assert.equal(ship.life,4);
  const hull = h.create({restoreLife:['liftMax-2','liftReset']}); hull.wasPickUp(ship);
  assert.equal(ship.maxLife,7); assert.equal(ship.life,7);
  const triple = h.create({changeBullet:'treble'}); triple.wasPickUp(ship);
  assert.equal(ship.bulletType,'treble');
  assert.deepEqual(h.counts(),[20,0,3]);
});
