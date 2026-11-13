import test from 'node:test';
import assert from 'node:assert/strict';
import { createFixedClock, createMovement } from '../js/gameplay.mjs';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);

test('cardinal and diagonal motion cover equal distances; opposite directions cancel', () => {
  const cardinal = createMovement(500, 500, 250 * 500 + 250);
  const diagonal = createMovement(500, 500, 250 * 500 + 250);
  for (let index = 0; index < 60; index++) {
    cardinal.move(1, 0);
    diagonal.move(1, -1);
  }
  near(Math.hypot(cardinal.x - 250, cardinal.y - 250), 60);
  near(Math.hypot(diagonal.x - 250, diagonal.y - 250), 60);
  const before = diagonal.position;
  assert.equal(diagonal.move(0, 0), before);
});

test('ship stays inside the playfield and pointer movement resynchronizes the controller', () => {
  const controller = createMovement(40, 60, 20 * 40 + 20);
  for (let index = 0; index < 100; index++) controller.move(-1, -1);
  assert.equal(controller.position, 41);
  controller.sync(30 * 40 + 30);
  assert.equal(controller.move(1, 0), 30 * 40 + 31);
  for (let index = 0; index < 100; index++) controller.move(1, 1);
  assert.equal(controller.position, 58 * 40 + 38);
});

test('30, 60 and 144Hz displays advance the same simulation time', () => {
  for (const rate of [30, 60, 144]) {
    const clock = createFixedClock(25);
    let ticks = 0;
    clock.advance(0, () => ticks++);
    for (let frame = 1; frame <= rate; frame++) clock.advance(frame * 1000 / rate, () => ticks++);
    assert.equal(ticks, 40, `${rate}Hz`);
  }
});

test('pause/reset discards elapsed wall time and long stalls have bounded catch-up', () => {
  const clock = createFixedClock(25);
  let ticks = 0;
  clock.advance(0, () => ticks++);
  clock.advance(50, () => ticks++);
  assert.equal(ticks, 2);
  clock.reset();
  clock.advance(10000, () => ticks++);
  assert.equal(ticks, 2);
  clock.advance(10025, () => ticks++);
  assert.equal(ticks, 3);
  clock.advance(50000, () => ticks++);
  assert.equal(ticks, 8);
});
