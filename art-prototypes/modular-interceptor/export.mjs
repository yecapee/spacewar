import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { buildModularInterceptor } from './model.mjs';

const runtime = process.env.SPACEWAR_THREE_ROOT;
const T = await import(runtime ? pathToFileURL(join(runtime, 'build/three.module.js')).href : 'three');
const { GLTFExporter } = await import(runtime ? pathToFileURL(join(runtime, 'examples/jsm/exporters/GLTFExporter.js')).href : 'three/addons/exporters/GLTFExporter.js');

// Node has Blob; Three's browser exporter also expects this small FileReader API.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => { this.result = result; this.onloadend?.(); }).catch((error) => this.onerror?.(error));
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.(); }).catch((error) => this.onerror?.(error));
  }
};

const ship = buildModularInterceptor(T);
for (let sample = 0; sample <= 100; sample++) {
  ship.setDeployment(sample / 100);
  for (const assembly of ship.assemblies) {
    const start = new T.Vector3(assembly.sign * .55, .08, -.1);
    const end = new T.Vector3(assembly.sign * (Math.abs(assembly.pod.position.x) - .31), .08, assembly.pod.position.z + .05);
    assert.ok(Math.abs(start.distanceTo(assembly.elbow.position) - .7) < 1e-7);
    assert.ok(Math.abs(end.distanceTo(assembly.elbow.position) - 1) < 1e-7);
  }
}
ship.root.traverse((node) => {
  if (node.isMesh) for (const value of node.geometry.attributes.position.array) assert.ok(Number.isFinite(value));
});

function clip(name, reverse) {
  const times = Array.from({ length: 41 }, (_, sample) => sample / 20);
  const records = ship.moving.map((node) => ({ node, positions: [], rotations: [] }));
  for (const time of times) {
    ship.setDeployment(reverse ? 1 - time / 2 : time / 2);
    for (const record of records) {
      record.node.position.toArray(record.positions, record.positions.length);
      record.node.quaternion.toArray(record.rotations, record.rotations.length);
    }
  }
  return new T.AnimationClip(name, 2, records.flatMap(({ node, positions, rotations }) => [
    new T.VectorKeyframeTrack(`${node.name}.position`, times, positions),
    new T.QuaternionKeyframeTrack(`${node.name}.quaternion`, times, rotations),
  ]));
}
const animations = [clip('Deploy', false), clip('Retract', true)];

async function save(name, deployment, withAnimation = false) {
  ship.setDeployment(deployment);
  const result = await new GLTFExporter().parseAsync(ship.root, { binary: true, trs: true, animations: withAnimation ? animations : [] });
  const bytes = Buffer.from(result);
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLength = bytes.readUInt32LE(12);
  const content = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
  assert.ok(content.meshes.length > 20);
  if (withAnimation) assert.equal(content.animations.length, 2);
  await writeFile(new URL(name, import.meta.url), bytes);
  return { name, bytes: bytes.length, meshes: content.meshes.length, animations: content.animations?.map((item) => item.name) || [] };
}

const results = [];
results.push(await save('modular-interceptor.glb', 0, true));
results.push(await save('modular-interceptor-normal.glb', 0));
results.push(await save('modular-interceptor-attack.glb', 1));
await writeFile(new URL('validation.json', import.meta.url), JSON.stringify({ mechanismSamples: 101, linkLengths: [.7, 1], files: results }, null, 2));
console.log(JSON.stringify(results, null, 2));
