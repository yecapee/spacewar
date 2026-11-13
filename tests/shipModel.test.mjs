import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createGameShip } from '../js/shipModel.mjs';

test('live game model keeps a bounded mesh budget and valid merged geometry', () => {
  const ship = createGameShip();
  assert.ok(ship.stats.triangles <= 1200, `${ship.stats.triangles} triangles`);
  assert.ok(ship.stats.drawCalls <= 48, `${ship.stats.drawCalls} draw calls`);
  assert.equal(ship.materials.shell.color.getHexString(), 'ffffff');
  assert.equal(ship.auxiliaryThrusters.length, 2);
  ship.root.traverse((node) => {
    if (!node.isMesh) return;
    assert.ok(node.material.isMeshLambertMaterial || node.material.isMeshBasicMaterial);
    for (const key of ['position', 'normal']) {
      assert.ok([...node.geometry.attributes[key].array].every(Number.isFinite));
    }
  });
});

test('batched meshes still follow both folding arms through deployment and retraction', () => {
  const ship = createGameShip();
  const box = new THREE.Box3();
  const fixed = ship.root.getObjectByName('Pilot_Core').matrixWorld.clone();
  let closedWidth;
  for (let frame = 0; frame <= 100; frame++) {
    const amount = frame / 100;
    ship.setDeployment(amount);
    for (const arm of ship.assemblies) {
      const start = new THREE.Vector3(arm.sign * .55, .08, -.1);
      const end = new THREE.Vector3(arm.sign * (Math.abs(arm.pod.position.x) - .31), .08, arm.pod.position.z + .05);
      assert.ok(Math.abs(start.distanceTo(arm.elbow.position) - .7) < 1e-7);
      assert.ok(Math.abs(end.distanceTo(arm.elbow.position) - 1) < 1e-7);
      assert.ok(arm.pod.children.some((node) => node.isMesh), 'weapon geometry remains attached to its moving pivot');
    }
    assert.deepEqual(ship.root.getObjectByName('Pilot_Core').matrixWorld.elements, fixed.elements);
    box.setFromObject(ship.root);
    assert.ok([box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite));
    if (frame === 0) closedWidth = box.max.x - box.min.x;
  }
  assert.ok(box.max.x - box.min.x > closedWidth * 1.4);
  for (const arm of ship.assemblies) {
    const spread = .57 * .57 * (3 - 2 * .57);
    assert.ok(Math.abs(Math.abs(arm.pod.position.x) - (1.02 + 1.23 * spread)) < 1e-7);
    assert.ok(Math.abs(arm.barrel.position.z + 1.42) < 1e-7, 'limiting spread does not leave the barrel retracted');
  }
  ship.setDeployment(0);
  box.setFromObject(ship.root);
  assert.ok(Math.abs(box.max.x - box.min.x - closedWidth) < 1e-7);
});

test('game auxiliary drives counter-steer and return to the paired rest pose', () => {
  const ship = createGameShip();
  const left = ship.auxiliaryThrusters.find((drive) => drive.sign === -1).gimbal;
  const right = ship.auxiliaryThrusters.find((drive) => drive.sign === 1).gimbal;
  const restLeft = left.position.clone(), restRight = right.position.clone();
  assert.ok(ship.stats.triangles < 1200);
  ship.setThrustDirection(1, 0);
  assert.ok(left.position.z > restLeft.z && left.position.y < restLeft.y);
  assert.ok(right.position.equals(restRight));
  assert.equal(ship.thrustJets.left.visible, true);
  assert.equal(ship.thrustJets.right.visible, false);
  assert.equal(ship.thrustJets.main.visible, false);
  ship.setThrustDirection(-1, 0);
  assert.ok(right.position.z > restRight.z && right.position.y < restRight.y);
  assert.ok(left.position.equals(restLeft));
  assert.equal(ship.thrustJets.right.visible, true);
  assert.equal(ship.thrustJets.left.visible, false);
  ship.setThrustDirection(0, -1);
  assert.notEqual(left.rotation.x, 0);
  assert.notEqual(right.rotation.x, 0);
  assert.equal(ship.thrustJets.main.visible, true);
  assert.equal(ship.thrustJets.left.visible, false);
  assert.equal(ship.thrustJets.right.visible, false);
  ship.setThrustDirection(1, -1);
  assert.equal(ship.thrustJets.main.visible, true);
  assert.equal(ship.thrustJets.left.visible, true);
  assert.equal(ship.thrustJets.right.visible, false);
  ship.setThrustDirection(0, 0);
  assert.ok(left.position.equals(restLeft) && right.position.equals(restRight));
  assert.equal(left.rotation.x + left.rotation.y + left.rotation.z, 0);
  assert.equal(right.rotation.x + right.rotation.y + right.rotation.z, 0);
  assert.ok(Object.values(ship.thrustJets).every((jet) => !jet.visible));
});
