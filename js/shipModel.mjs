import {
  Group, MeshLambertMaterial, MeshBasicMaterial, Shape, ExtrudeGeometry, BoxGeometry, Mesh,
  Object3D, CylinderGeometry, IcosahedronGeometry, Vector3, Matrix4,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildModularInterceptor } from '../art-prototypes/modular-interceptor/model.mjs';
import { PLAYER_PALETTE } from './shipVisual.mjs';

// Merge only within an animation pivot, so the articulated mechanism stays live.
export function createGameShip({ tailThruster = true } = {}) {
  // Pass only the constructors this low-detail factory needs, so bundling can
  // discard unrelated Three.js exports and the demo's standard material path.
  const ship = buildModularInterceptor({ Group, MeshLambertMaterial, MeshBasicMaterial, Shape,
    ExtrudeGeometry, BoxGeometry, Mesh, Object3D, CylinderGeometry,
    IcosahedronGeometry, Vector3 }, { lowDetail: true, maxSpread: .57, tailThruster });
  // Neutral pale undersides remain visible against the blue space background.
  ship.materials.shell.color.set(PLAYER_PALETTE.shell);
  ship.materials.dark.color.set(PLAYER_PALETTE.side);
  ship.materials.steel.color.set(PLAYER_PALETTE.steel);
  const anchors = new Set([ship.root, ...ship.moving]);
  const batches = new Map();
  const originals = [];
  ship.root.updateMatrixWorld(true);
  ship.root.traverse((mesh) => {
    if (!mesh.isMesh) return;
    let anchor = mesh.parent;
    while (!anchors.has(anchor)) anchor = anchor.parent;
    let materials = batches.get(anchor);
    if (!materials) batches.set(anchor, materials = new Map());
    let geometries = materials.get(mesh.material);
    if (!geometries) materials.set(mesh.material, geometries = []);
    const transform = new Matrix4().copy(anchor.matrixWorld).invert().multiply(mesh.matrixWorld);
    let geometry = mesh.geometry.clone();
    if (geometry.index) geometry = geometry.toNonIndexed();
    geometry.applyMatrix4(transform);
    // No textures: remove unused UVs and extrusion groups before batching.
    geometry.deleteAttribute('uv');
    geometry.clearGroups();
    geometries.push(geometry);
    originals.push(mesh);
  });
  originals.forEach((mesh) => { mesh.removeFromParent(); mesh.geometry.dispose(); });
  let triangles = 0, drawCalls = 0;
  for (const [anchor, materials] of batches) {
    for (const [material, geometries] of materials) {
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach((item) => item.dispose());
      triangles += geometry.attributes.position.count / 3;
      const mesh = new Mesh(geometry, material);
      mesh.name = `${anchor.name}_${material.name}_Batch`;
      anchor.add(mesh);
      drawCalls++;
    }
  }
  ship.stats = { triangles, drawCalls };
  return ship;
}
