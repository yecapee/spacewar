import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import createAirShield from '../js/airShield.mjs';
import { createShipVisual } from '../js/shipVisual.mjs';

const origin = { x: 300, y: 400 };
const pixelSize = 15;
const tail = { x: 300, y: 422.5 };
const advance = (shield, frames = 30) => {
  for (let tick = 0; tick < frames; tick++) shield.update(origin, []);
};
const bulletAt = (particle) => ({ data: { x: particle.x, y: particle.y } });
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('fans from the tail, then rotates counterclockwise by 180 degrees with a fixed pivot and radius', () => {
  const shield = createAirShield(origin, pixelSize);
  for (const particle of shield.particles) {
    near(particle.x, tail.x);
    near(particle.y, tail.y);
  }
  advance(shield, 12);
  const expanded = shield.particles.map((particle) => ({ x: particle.x - tail.x, y: particle.y - tail.y }));
  assert.ok(shield.particles.every((particle) => particle.y > tail.y));
  advance(shield, 9);
  // Halfway through a counterclockwise half-turn, the fan passes the right side.
  const middle = shield.particles[Math.floor(shield.particles.length / 2)];
  assert.ok(middle.x > tail.x);
  near(middle.y, tail.y);
  advance(shield, 9);
  assert.equal(shield.phase, 'ready');
  shield.particles.forEach((particle, index) => {
    near(particle.x - tail.x, -expanded[index].x);
    near(particle.y - tail.y, -expanded[index].y);
    near(Math.hypot(particle.x - tail.x, particle.y - tail.y), 75);
    assert.ok(particle.y < origin.y);
  });
  const angles = shield.particles.map((p) => Math.atan2(p.y - tail.y, p.x - tail.x));
  near(angles.at(-1) - angles[0], Math.PI / 2);
});

test('follows the ship without healing damaged particles after regrouping', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  shield.update(origin, [bulletAt(shield.particles[4])]);
  advance(shield, 60);
  const before = shield.particles.map((particle) => ({ ...particle }));
  shield.update({ x: origin.x + 45, y: origin.y - 30 }, []);
  shield.particles.forEach((particle, index) => {
    near(particle.x - before[index].x, 45);
    near(particle.y - before[index].y, -30);
    assert.equal(particle.alive, before[index].alive);
  });
});

test('one bullet destroys one particle; a subsequent bullet passes through the hole', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const particle = shield.particles[4];
  const count = shield.remaining;
  const firstBullet = [bulletAt(particle)];
  assert.equal(shield.update(origin, firstBullet), false);
  assert.equal(firstBullet.length, 0);
  assert.equal(shield.remaining, count - 1);
  const secondBullet = [bulletAt(particle)];
  shield.update(origin, secondBullet);
  assert.equal(secondBullet.length, 1);
  assert.equal(shield.remaining, count - 1);
});

test('fast bullets cannot skip through intact particles between frames', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const particle = shield.particles[4];
  const bullets = [{
    previousData: { x: particle.x, y: particle.y - 60 },
    data: { x: particle.x, y: particle.y + 60 },
  }];
  shield.update(origin, bullets);
  assert.equal(bullets.length, 0);
  assert.equal(particle.alive, false);
});

test('shield persists indefinitely and ends only after every particle is destroyed', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield, 1000);
  for (const particle of shield.particles) {
    advance(shield, 60);
    const count = shield.remaining;
    const expired = shield.update(origin, [bulletAt(particle)]);
    assert.equal(shield.remaining, count - 1);
    assert.equal(expired, shield.remaining === 0);
  }
});

// Load the player with stand-ins for unrelated rendering/audio modules so the actual
// skill lifecycle is tested without starting a browser or an AudioContext.
function createPlayer() {
  const source = readFileSync(new URL('../js/createShip.js', import.meta.url), 'utf8')
    .replace(/import[\s\S]*?from\s+["'][^"']+["'];/g, '')
    .replace('export default function (obj)', 'function CreateShip(obj)');
  const renderData = { enemyBullet: [], shipSkills: [], aniEffect: [], enemy: [], item: [] };
  const context = vm.createContext({
    createAirShield, createShipVisual, feedback: { burst() {}, damage() {}, destroy() {} }, renderData, pixelWeigth: pixelSize, w: 40,
    lookPath: { crystal: () => [] },
    positionToXY: () => origin,
    animation: () => () => {},
    document: { getElementById: () => ({}) },
  });
  vm.runInContext(source + '\nthis.CreateShip = CreateShip;', context);
  const ship = new context.CreateShip({
    name: 'test', life: 5, position: 100, look: 'crystal',
    skills: [{ skillKey: 83, type: 'airShield' }],
  });
  return { ship, renderData };
}

test('S cannot replace a shield during deployment or repair it; it can recast after depletion', () => {
  const { ship, renderData } = createPlayer();
  ship.skill(83);
  const initial = ship.airShield;
  ship.skill(83);
  assert.equal(ship.airShield, initial);
  advance(initial);
  renderData.enemyBullet.push(bulletAt(initial.particles[4]));
  ship.updateShield();
  const remaining = initial.remaining;
  ship.skill(83);
  assert.equal(ship.airShield, initial);
  assert.equal(initial.remaining, remaining);
  for (const particle of initial.particles.filter((particle) => particle.alive)) {
    advance(initial, 60);
    renderData.enemyBullet.push(bulletAt(particle));
    ship.updateShield();
  }
  assert.equal(ship.airShield, null);
  ship.skill(83);
  assert.notEqual(ship.airShield, initial);
  assert.equal(ship.airShield.remaining, initial.particles.length);
});

test('death clears the shield and dead ships cannot cast', () => {
  const { ship } = createPlayer();
  ship.skill(83);
  ship.isDead = true;
  ship.dead();
  assert.equal(ship.airShield, null);
  ship.skill(83);
  assert.equal(ship.airShield, null);
});

test('the thin shield does not block shots outside its visible radial band', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const middle = shield.particles[4];
  const bullets = [{ data: { x: middle.x, y: middle.y + 6 } }];
  const remaining = shield.remaining;
  shield.update(origin, bullets);
  assert.equal(bullets.length, 1);
  assert.equal(shield.remaining, remaining);
});

test('shield break feedback fires once for the destroyed segment', () => {
  const broken = [];
  const shield = createAirShield(origin, pixelSize, (particle) => broken.push(particle));
  advance(shield);
  const middle = shield.particles[4];
  shield.update(origin, [bulletAt(middle), bulletAt(middle)]);
  assert.equal(broken.length, 1);
  assert.equal(broken[0], middle);
});


test('surviving segments slide into a shorter centered arc without gaining health or changing radius', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const left = shield.particles[0];
  shield.update(origin, [bulletAt(left)]);
  const right = shield.particles.at(-1);
  const before = right.renderAngle;
  shield.update(origin, []);
  assert.ok(right.renderAngle < before);
  advance(shield, 60);
  const survivors = shield.particles.filter((particle) => particle.alive);
  assert.equal(survivors.length, shield.particles.length - 1);
  assert.equal(left.alive, false);
  const angles = survivors.map((particle) => particle.renderAngle);
  near((angles[0] + angles.at(-1)) / 2, -Math.PI / 2);
  near(angles.at(-1) - angles[0], (Math.PI / 2) / (shield.particles.length - 1) * (survivors.length - 1));
  for (const particle of survivors) near(Math.hypot(particle.x - tail.x, particle.y - tail.y), 75);
});

test('a last remaining segment regroups directly in front of the ship', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  for (const particle of shield.particles.slice(0, -1)) {
    advance(shield, 60);
    shield.update(origin, [bulletAt(particle)]);
  }
  advance(shield, 60);
  assert.equal(shield.remaining, 1);
  const last = shield.particles.at(-1);
  near(last.x, origin.x);
  near(last.y, tail.y - 75);
});

function approaching(angle, distance = 250) {
  const x = tail.x + Math.cos(angle) * distance;
  const y = tail.y + Math.sin(angle) * distance;
  return {
    data: { x, y },
    previousData: { x: x + Math.cos(angle) * 10, y: y + Math.sin(angle) * 10 },
  };
}
const angleDelta = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

test('deployed shield smoothly turns toward the closest approaching bullet', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const close = approaching(0, 200);
  const far = approaching(Math.PI, 350);
  shield.update(origin, [far, close]);
  assert.equal(shield.tracking, true);
  assert.ok(shield.facingAngle > -Math.PI / 2);
  assert.ok(shield.facingAngle < 0);
  for (let frame = 0; frame < 45; frame++) shield.update(origin, [far, close]);
  near(shield.facingAngle, 0);
  near(shield.particles[4].x, tail.x + 75);
  near(shield.particles[4].y, tail.y);
  assert.equal(shield.remaining, shield.particles.length);
});

test('shots moving away do not distract the shield from an incoming attack', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const receding = approaching(Math.PI, 100);
  [receding.data, receding.previousData] = [receding.previousData, receding.data];
  const incoming = approaching(0, 300);
  for (let frame = 0; frame < 45; frame++) shield.update(origin, [receding, incoming]);
  near(shield.facingAngle, 0);
  const heading = shield.facingAngle;
  shield.update(origin, []);
  assert.equal(shield.tracking, false);
  near(shield.facingAngle, heading);
});

test('tracking takes the shortest turn across the angle boundary and keeps a bounded turn speed', () => {
  const shield = createAirShield(origin, pixelSize);
  advance(shield);
  const leftBelow = approaching(170 * Math.PI / 180);
  for (let frame = 0; frame < 50; frame++) shield.update(origin, [leftBelow]);
  const nextAngle = -170 * Math.PI / 180;
  const before = shield.facingAngle;
  shield.update(origin, [approaching(nextAngle)]);
  assert.ok(Math.abs(angleDelta(shield.facingAngle, before)) <= Math.PI / 20);
  assert.ok(Math.abs(angleDelta(nextAngle, shield.facingAngle)) < Math.abs(angleDelta(nextAngle, before)));
});

test('incoming bullets do not interrupt the tail fan and 180 degree deployment animation', () => {
  const shield = createAirShield(origin, pixelSize);
  for (let frame = 0; frame < 29; frame++) {
    shield.update(origin, [approaching(0, 300)]);
    assert.equal(shield.tracking, false);
    near(shield.facingAngle, -Math.PI / 2);
  }
  shield.update(origin, [approaching(0, 300)]);
  assert.equal(shield.phase, 'ready');
  assert.equal(shield.tracking, true);
});
