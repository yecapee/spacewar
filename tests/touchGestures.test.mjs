import test from 'node:test';
import assert from 'node:assert/strict';
import { createTouchGestures } from '../js/touchGestures.mjs';

function circle(gesture, sign = 1, turns = 1) {
  const point = (i) => ({ x: 150 + 50 * Math.cos(i / 40 * Math.PI * 2 * sign * turns), y: 300 + 50 * Math.sin(i / 40 * Math.PI * 2 * sign * turns) });
  gesture.start(point(0), 0);
  for (let i = 1; i < 40; i++) gesture.move(point(i));
  return gesture.end(point(40), 700);
}
test('closed circles in either direction cast a shield; half circles and scribbles do not', () => {
  assert.equal(circle(createTouchGestures(), 1), 'shield');
  assert.equal(circle(createTouchGestures(), -1), 'shield');
  assert.equal(circle(createTouchGestures(), 1, .5), null);
  assert.equal(circle(createTouchGestures(), 1, 2), null);
  const gesture = createTouchGestures();
  gesture.start({ x: 0, y: 0 }, 0);
  for (let i = 0; i < 20; i++) gesture.move({ x: i % 2 * 80, y: i * 10 });
  assert.equal(gesture.end({ x: 0, y: 0 }, 700), null);
});
test('a nearby double tap casts once; drags, distant taps, and cancelled input do not', () => {
  const gesture = createTouchGestures(), point = { x: 100, y: 200 };
  const tap = (time, where = point) => { gesture.start(where, time); return gesture.end(where, time + 40); };
  assert.equal(tap(0), null); assert.equal(tap(180), 'attack'); assert.equal(tap(300), null);
  gesture.cancel(); assert.equal(tap(400), null); assert.equal(tap(900), null);
  assert.equal(tap(1000, { x: 170, y: 200 }), null);
  gesture.start(point, 1200); gesture.move({ x: 200, y: 200 });
  assert.equal(gesture.end(point, 1300), null);
  assert.equal(tap(1400), null);
  gesture.cancel(); assert.equal(tap(1500), null);
});
