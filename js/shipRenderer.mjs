import * as THREE from 'three';
import { createGameShip } from './shipModel.mjs';

let renderer;
let unavailable = false;

function createRenderer(displaySize, tailThruster) {
  const gpu = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', depth: true, stencil: false });
  // This is a live 3D render target, independent of screen/device pixel density.
  gpu.setPixelRatio(1);
  const resolution = Math.max(160, Math.min(384, Math.ceil(displaySize)));
  gpu.setSize(resolution, resolution, false);
  gpu.setClearColor(0x000000, 0);
  gpu.toneMapping = THREE.ACESFilmicToneMapping;
  gpu.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.25, 3.25, 3.25, -3.25, .1, 30);
  camera.position.set(0, 10, 3.1);
  camera.lookAt(0, .35, 0);
  scene.add(new THREE.HemisphereLight(0xc5efff, 0x283453, 2.2));
  const key = new THREE.DirectionalLight(0xfff0de, 2.8);
  key.position.set(-3, 6, -4);
  scene.add(key);
  const ship = createGameShip({ tailThruster });
  scene.add(ship.root);
  const frame = document.createElement('canvas');
  frame.width = frame.height = resolution;
  const frameContext = frame.getContext('2d');
  let signature = '';
  let contextLost = false;
  gpu.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); contextLost = true; });
  gpu.domElement.addEventListener('webglcontextrestored', () => { contextLost = false; signature = ''; });

  return {
    draw(context, position, size, state) {
      // Position does not affect the mesh render; reuse the buffer in level flight.
      const thrustX = state.thrustX || 0, thrustY = state.thrustY || 0;
      const palette = state.palette;
      const yaw = state.yaw || 0;
      const next = `${state.deployment.toFixed(3)}:${state.bank.toFixed(3)}:${state.pitch.toFixed(3)}:${yaw.toFixed(3)}:${state.upgraded}:${thrustX.toFixed(3)}:${thrustY.toFixed(3)}:${palette ? Object.values(palette).join(',') : ''}`;
      if (!contextLost && next !== signature) {
        ship.setDeployment(state.deployment);
        ship.setThrustDirection(thrustX, thrustY);
        ship.root.rotation.set(state.pitch, yaw, state.bank);
        if (palette) {
          ship.materials.shell.color.set(palette.shell);
          ship.materials.dark.color.set(palette.side);
          ship.materials.steel.color.set(palette.steel);
          ship.materials.window.color.set(palette.canopy);
          ship.materials.window.emissive.set(palette.canopy).multiplyScalar(.25);
          ship.materials.glow.color.set(palette.glow);
          ship.materials.glow.emissive.set(palette.glow);
          if (ship.materials.plasma) ship.materials.plasma.color.set(palette.glow);
        }
        ship.materials.orange.color.set(state.upgraded ? '#ff657b' : palette?.accent || '#f99536');
        gpu.render(scene, camera);
        frameContext.clearRect(0, 0, resolution, resolution);
        frameContext.drawImage(gpu.domElement, 0, 0);
        signature = next;
      }
      context.imageSmoothingEnabled = true;
      context.drawImage(frame, position.x - size / 2, position.y - size / 2, size, size);
    },
  };
}

export default function drawShip(context, position, size, state) {
  if (unavailable) return;
  if (!renderer) {
    try { renderer = createRenderer(size, Boolean(state.tailThruster)); }
    catch (error) {
      unavailable = true;
      // Give an actionable error instead of silently replacing the model with pixels.
      const message = document.getElementById('graphicsStatus');
      if (message) { message.hidden = false; message.textContent = '3D 戰機需要 WebGL 2，請啟用瀏覽器硬體加速後重新整理。'; }
      console.error('Unable to create the 3D ship renderer:', error);
      return;
    }
  }
  renderer.draw(context, position, size, state);
}
