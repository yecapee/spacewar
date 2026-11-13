import test from 'node:test';
import assert from 'node:assert/strict';
import { createShipVisual } from '../js/shipVisual.mjs';
import { createGameShip } from '../js/shipModel.mjs';

test('movement drives the installed thrusters and stopping restores idle', () => {
  const visual = createShipVisual({ x: 100, y: 100 }, 15);
  const ship = createGameShip();
  let center = { x: 100, y: 100 }, state;
  const step = (dx, dy) => {
    center = { x: center.x + dx, y: center.y + dy };
    state = visual.update(center);
    ship.setThrustDirection(state.thrustX, state.thrustY);
  };
  for (let i = 0; i < 12; i++) step(15, 0);
  assert.equal(ship.thrustJets.left.visible, true);
  assert.equal(ship.thrustJets.right.visible, false);
  assert.equal(ship.thrustJets.main.visible, false);
  assert.ok(ship.auxiliaryThrusters[0].gimbal.position.z > .65);
  for (let i = 0; i < 24; i++) step(0, 0);
  assert.equal(state.thrustX, 0);
  assert.ok(Object.values(ship.thrustJets).every((jet) => !jet.visible));
  for (let i = 0; i < 12; i++) step(-15, -15);
  assert.equal(ship.thrustJets.right.visible, true);
  assert.equal(ship.thrustJets.main.visible, true);
  assert.equal(ship.thrustJets.left.visible, false);
  for (let i = 0; i < 24; i++) step(0, 0);
  assert.equal(state.thrustY, 0);
  assert.ok(Object.values(ship.thrustJets).every((jet) => !jet.visible));
});

test('white theme and the new body persist through firing and bullet upgrades', () => {
  const visual = createShipVisual({ x: 0, y: 0 }, 15);
  let state;
  for (let i = 0; i < 12; i++) state = visual.update({ x: 0, y: 0 }, { firing: true, upgraded: true });
  assert.equal(state.deployment, 1);
  assert.equal(state.palette.shell, '#FFFFFF');
  assert.equal(state.tailThruster, true);
  assert.equal(state.upgraded, true);
  assert.equal(state.thrustX, 0);
  assert.equal(state.thrustY, 0);
  for (let i = 0; i < 12; i++) state = visual.update({ x: 0, y: 0 });
  assert.equal(state.deployment, 0);
  assert.equal(state.palette.shell, '#FFFFFF');
  const fresh = createShipVisual({ x: 500, y: 200 }, 15).update({ x: 500, y: 200 });
  assert.equal(fresh.thrustX, 0);
  assert.equal(fresh.deployment, 0);
});

test('large touch moves remain bounded and reduced motion removes banking', () => {
  const visual = createShipVisual({ x: 0, y: 0 }, 10);
  const state = visual.update({ x: 200, y: -300 }, { reducedMotion: true });
  assert.equal(state.thrustX, 1);
  assert.equal(state.thrustY, -1);
  assert.equal(state.bank, 0);
  assert.equal(state.pitch, 0);
  assert.equal(state.yaw, 0);
});

test('held controls maintain banking, yaw and pitch between movement steps, then return to level', () => {
  const visual = createShipVisual({ x: 100, y: 100 }, 15);
  const center = { x: 100, y: 100 };
  let state;
  for (let i = 0; i < 30; i++) state = visual.update(center, { direction: { x: 1, y: -1 } });
  assert.ok(state.bank < -.3 && state.yaw < -.07 && state.pitch < -.15);
  assert.equal(state.thrustX, 1);
  assert.equal(state.thrustY, -1);
  for (let i = 0; i < 30; i++) state = visual.update(center, { direction: { x: 0, y: 0 } });
  assert.equal(state.bank, 0);
  assert.equal(state.yaw, 0);
  assert.equal(state.pitch, 0);
  assert.equal(state.thrustX, 0);
  assert.equal(state.thrustY, 0);
});
