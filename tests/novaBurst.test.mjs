import test from 'node:test';
import assert from 'node:assert/strict';
import createNovaBurst from '../js/novaBurst.mjs';

function target(x, y, position = 1) {
  const enemy = { life: 10, hits: 0, wasHit(ps) { assert.equal(ps, position); this.hits++; return true; } };
  return { enemy, points: [{ x, y, position }] };
}

test('legacy shockwave still covers angles between decorative rays', () => {
  const wave = createNovaBurst({ x: 300, y: 300 }, { radius: 200, visualStyle: 'jets' });
  const targets = Array.from({ length: 64 }, (_, index) => {
    const angle = (index + .37) * Math.PI * 2 / 64;
    return target(300 + Math.cos(angle) * 100, 300 + Math.sin(angle) * 100, index);
  });
  for (let frame = 0; frame < 62; frame++) wave.update(targets, {});
  assert.ok(targets.every((target) => target.enemy.hits === 1));
});

test('the blast starts at the cast location and does not drag along with the ship', () => {
  const origin = { x: 100, y: 100 };
  const wave = createNovaBurst(origin, { radius: 200, visualStyle: 'jets' });
  origin.x = 900;
  origin.y = 900;
  assert.deepEqual(wave.center, { x: 100, y: 100 });
  const enemy = target(110, 100);
  for (let frame = 0; frame < 11; frame++) wave.update([enemy], {});
  assert.equal(enemy.enemy.hits, 1);
});

test('the swept front reaches targets between frames and only damages each enemy once per cast', () => {
  const wave = createNovaBurst({ x: 0, y: 0 }, { radius: 200, frames: 2, thickness: 1, delayFrames: 0, visualStyle: 'jets' });
  const targets = [target(0, -40), target(180, 0), target(-100, 0), target(0, 300)];
  assert.equal(wave.update(targets, {}), false);
  assert.equal(targets[0].enemy.hits, 1);
  assert.equal(targets[1].enemy.hits, 0);
  assert.equal(wave.update(targets, {}), true);
  assert.deepEqual(targets.map((target) => target.enemy.hits), [1, 1, 1, 0]);
});

test('large enemies can be hit through their visible edge even if their center is out of range', () => {
  const wave = createNovaBurst({ x: 0, y: 0 }, { radius: 100, visualStyle: 'jets' });
  const boss = target(200, 0, 2);
  boss.points.push({ x: 60, y: 0, position: 2 });
  for (let frame = 0; frame < 62; frame++) wave.update([boss], {});
  assert.equal(boss.enemy.hits, 1);
});


test('sonic precursor has no damage; impact begins later, with exactly one cue per stage', () => {
  const stages = [];
  const wave = createNovaBurst({ x: 0, y: 0 }, { random:()=>.5, onStage: (stage) => stages.push(stage) });
  const closeTarget = target(8, 0);
  for (let frame = 0; frame < 10; frame++) {
    wave.update([closeTarget], {});
    assert.equal(wave.phase, 'sonic');
    assert.equal(wave.radius, 0);
    assert.equal(closeTarget.enemy.hits, 0);
  }
  assert.deepEqual(stages, ['sonic']);
  wave.update([closeTarget], {});
  assert.equal(wave.phase, 'impact');
  assert.equal(closeTarget.enemy.hits, 1);
  for (let frame = 0; frame < 51; frame++) wave.update([closeTarget], {});
  assert.deepEqual(stages, ['sonic', 'impact']);
});
