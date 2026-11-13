import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createGameShip } from '../js/shipModel.mjs';
import { projectNozzles, createThrusterExhaust } from '../js/thrusterExhaust.mjs';

test('exhaust follows transformed 3D nozzle positions, including banking and gimbals', () => {
  const ship = createGameShip();
  const camera = new THREE.OrthographicCamera(-3.25, 3.25, 3.25, -3.25, .1, 30);
  camera.position.set(0, 10, 3.1); camera.lookAt(0, .35, 0);
  ship.root.rotation.set(-.17, -.08, -.34); ship.setThrustDirection(1, -1);
  const state = { thrustX: 1, thrustY: -1 };
  const frames = projectNozzles(ship, camera, { x: 200, y: 300 }, 90, state);
  const main = frames.find((frame) => frame.name === 'main');
  const position = ship.nozzleEmitters.main.getWorldPosition(new THREE.Vector3()).project(camera);
  assert.ok(Math.abs(main.x - (200 + position.x * 45)) < 1e-7);
  assert.ok(Math.abs(main.y - (300 - position.y * 45)) < 1e-7);
  assert.ok(main.y > 300 && main.dy > .8);
  assert.equal(frames.find((frame) => frame.name === 'right').strength, 0);
  const moved = projectNozzles(ship, camera, { x: 260, y: 340 }, 90, state);
  for (let i = 0; i < frames.length; i++) {
    assert.ok(Math.abs(moved[i].x - frames[i].x - 60) < 1e-7);
    assert.ok(Math.abs(moved[i].y - frames[i].y - 40) < 1e-7);
    assert.ok(Math.abs(Math.hypot(frames[i].dx, frames[i].dy) - 1) < 1e-7);
  }
  ship.root.rotation.set(0, 0, 0); ship.setThrustDirection(0, 1);
  const reverse = projectNozzles(ship, camera, { x: 200, y: 300 }, 90, { thrustX: 0, thrustY: 1 });
  for (const frame of reverse.filter((frame) => frame.name !== 'main')) {
    assert.equal(frame.strength, 1);
    assert.ok(frame.dy < -.8, 'reverse exhaust faces the nose');
  }
});
test('simple scattered particles spawn only at the main tail and expire after stopping', () => {
  const rectangles = [];
  const context = new Proxy({}, { get: (_, key) => key === 'fillRect' ? (...args) => rectangles.push(args) : () => {} });
  const effect = createThrusterExhaust(() => .5);
  const emitter = { name: 'main', x: 10, y: 20, dx: 0, dy: 1, strength: 1, width: 4 };
  effect.draw(context, [{ ...emitter, name: 'left' }]); assert.equal(effect.count, 0);
  effect.draw(context, [emitter]); assert.equal(effect.count, 2);
  effect.draw(context, []);
  assert.equal(rectangles[0][0], 9); assert.equal(rectangles[0][1], 23);
  for (let i = 0; i < 24; i++) effect.draw(context, []);
  assert.equal(effect.count, 0);
  effect.draw(context, [emitter], undefined, true); assert.equal(effect.count, 0);
  effect.draw(context, [emitter]); effect.reset(); assert.equal(effect.count, 0);
});
