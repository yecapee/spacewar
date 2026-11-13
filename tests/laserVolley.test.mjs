import test from 'node:test';
import assert from 'node:assert/strict';
import { createLaserVolley } from '../js/novaLasers.mjs';
import createNovaBurst from '../js/novaBurst.mjs';

function target(x, y, radius = 0) {
  return { enemy: { life: 100, hits: 0, wasHit() { this.hits++; return true; } }, points: [{ position: 1, x, y, radius }] };
}
function seeded(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}
const fixed = () => .5;

test('four distinct random volleys launch in sequence, with short segments that move outward', () => {
  const volley = createLaserVolley({ x: 0, y: 0 }, { range: 400, random: seeded(42) });
  assert.equal(volley.projectiles.length, 48);
  assert.ok(volley.projectiles.every((shot) => shot.length >= 22 && shot.length <= 38));
  volley.update([], {});
  assert.equal(volley.projectiles.filter((shot) => shot.active).length, 12);
  assert.ok(volley.projectiles.filter((shot) => shot.active).every((shot) => shot.distance > 0 && shot.distance <= 16));
  for (let frame = 0; frame < 6; frame++) volley.update([], {});
  assert.equal(volley.projectiles.filter((shot) => shot.active).length, 24);
  assert.notEqual(volley.projectiles[0].angle, volley.projectiles[12].angle);
  const secondCast = createLaserVolley({ x: 0, y: 0 }, { random: seeded(43) });
  assert.notEqual(volley.projectiles[0].angle, secondCast.projectiles[0].angle);
});

test('distant enemies are hit only when a short beam arrives; gaps and range limits stay safe', () => {
  const volley = createLaserVolley({ x: 0, y: 0 }, { range: 200, waveCount: 1, random: fixed });
  const gapAngle = Math.PI / 12;
  const targets = [target(150, 0), target(250, 0), target(Math.cos(gapAngle) * 150, Math.sin(gapAngle) * 150)];
  volley.update(targets, {});
  assert.equal(targets[0].enemy.hits, 0);
  for (let frame = 0; frame < 25; frame++) volley.update(targets, {});
  assert.deepEqual(targets.map((target) => target.enemy.hits), [1, 0, 0]);
});

test('swept collision catches targets between ticks and each volley hits an enemy at most once', () => {
  const volley = createLaserVolley({ x: 0, y: 0 }, { range: 200, random: fixed });
  const targets = [target(7, 0), target(100, 8, 7.5)];
  for (let frame = 0; frame < 50; frame++) volley.update(targets, {});
  assert.deepEqual(targets.map((target) => target.enemy.hits), [4, 4]);
});

test('the burst lasts until the final volley has left the field', () => {
  const burst = createNovaBurst({ x: 0, y: 0 }, { radius: 400, delayFrames: 0, random: fixed });
  for (let frame = 0; frame < 32; frame++) assert.equal(burst.update([], {}), false);
  let finished = false;
  for (let frame = 0; frame < 30; frame++) finished = burst.update([], {});
  assert.equal(finished, true);
});

test('later waves launch from the current ship center while earlier shots keep their launch origin', () => {
  const volley = createLaserVolley({ x: 0, y: 0 }, { range: 400, random: fixed });
  const shipCenter = { x: 100, y: 100 };
  volley.update([], {}, shipCenter);
  const first = volley.projectiles[0];
  assert.deepEqual(first.origin, { x: 100, y: 100 });
  shipCenter.x = 200;
  shipCenter.y = 150;
  for (let frame = 0; frame < 6; frame++) volley.update([], {}, shipCenter);
  assert.deepEqual(volley.projectiles[12].origin, { x: 200, y: 150 });
  assert.deepEqual(first.origin, { x: 100, y: 100 });
  assert.ok(first.distance > first.speed);
  const oldTrajectory = target(0, 100);
  const newTrajectory = target(250, 150);
  for (let frame = 0; frame < 4; frame++) volley.update([oldTrajectory, newTrajectory], {}, { x: 900, y: 900 });
  assert.equal(oldTrajectory.enemy.hits, 1);
  assert.equal(newTrajectory.enemy.hits, 1);
});

test('movement during the sonic stage changes the first volley launch position', () => {
  const burst = createNovaBurst({ x: 0, y: 0 }, { radius: 200, random: fixed });
  const enemy = target(210, 150);
  for (let frame = 0; frame < 10; frame++) burst.update([enemy], {}, { x: 200, y: 150 });
  assert.equal(enemy.enemy.hits, 0);
  burst.update([enemy], {}, { x: 200, y: 150 });
  assert.equal(enemy.enemy.hits, 1);
});
