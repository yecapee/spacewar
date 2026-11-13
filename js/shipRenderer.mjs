import * as THREE from 'three';
import { createGameShip } from './shipModel.mjs';
import { createThrusterExhaust, projectNozzles } from './thrusterExhaust.mjs';
let renderer, unavailable = false;
const poseKeys = ['deployment', 'bank', 'pitch', 'yaw', 'thrustX', 'thrustY'];
function createRenderer(displaySize, tailThruster) {
  const gpu = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', depth: true, stencil: false });
  gpu.setPixelRatio(1); const resolution = Math.max(160, Math.min(384, Math.ceil(displaySize)));
  gpu.setSize(resolution, resolution, false); gpu.setClearColor(0, 0);
  gpu.toneMapping = THREE.ACESFilmicToneMapping; gpu.toneMappingExposure = 1.2;
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-3.25,3.25,3.25,-3.25,.1,30);
  camera.position.set(0,10,3.1); camera.lookAt(0,.35,0); camera.updateMatrixWorld(true);
  scene.add(new THREE.HemisphereLight(0xc5efff,0x283453,2.2));
  const key = new THREE.DirectionalLight(0xfff0de,2.8); key.position.set(-3,6,-4); scene.add(key);
  const ship = createGameShip({ tailThruster }); scene.add(ship.root);
  const frame = document.createElement('canvas'); frame.width = frame.height = resolution;
  const frameContext = frame.getContext('2d'), exhaust = createThrusterExhaust();
  const pose = {}, updateEmitters = [], drawEmitters = [];
  let dirty = true, contextLost = false, instance, lastTick = -1;
  let paletteReference, upgraded;
  gpu.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; });
  gpu.domElement.addEventListener('webglcontextrestored', () => { contextLost = false; dirty = true; });
  function prepare(state) {
    let changed = false;
    for (const key of poseKeys) if (pose[key] !== (state[key] || 0)) { pose[key] = state[key] || 0; changed = true; }
    if (changed) {
      ship.setDeployment(pose.deployment); ship.setThrustDirection(pose.thrustX,pose.thrustY);
      ship.root.rotation.set(pose.pitch,pose.yaw,pose.bank); dirty = true;
    }
    const p = state.palette;
    if (p !== paletteReference || state.upgraded !== upgraded) {
      if (p) {
        ship.materials.shell.color.set(p.shell); ship.materials.dark.color.set(p.side); ship.materials.steel.color.set(p.steel);
        ship.materials.window.color.set(p.canopy); ship.materials.window.emissive.set(p.canopy).multiplyScalar(.25);
        ship.materials.glow.color.set(p.glow); ship.materials.glow.emissive.set(p.glow);
        if (ship.materials.plasma) ship.materials.plasma.color.set(p.glow);
      }
      ship.materials.orange.color.set(state.upgraded ? '#ff657b' : p?.accent || '#f99536'); paletteReference = p; upgraded = state.upgraded; dirty = true;
    }
  }
  return {
    update(position,size,state) {
      if (instance !== state.instanceId) { instance = state.instanceId; lastTick = -1; exhaust.reset(); }
      prepare(state);
      if (state.simulationTick !== undefined && state.simulationTick === lastTick) return;
      lastTick = state.simulationTick;
      exhaust.update(projectNozzles(ship,camera,position,size,state,updateEmitters),state.palette?.glow,state.reducedMotion);
    },
    draw(context,position,size,state,alpha) {
      prepare(state);
      if (!contextLost && dirty) {
        gpu.render(scene,camera); frameContext.clearRect(0,0,resolution,resolution); frameContext.drawImage(gpu.domElement,0,0); dirty = false;
      }
      exhaust.render(context,projectNozzles(ship,camera,position,size,state,drawEmitters),state.palette?.glow,state.reducedMotion,alpha);
      context.imageSmoothingEnabled = true;
      context.drawImage(frame,position.x-size/2,position.y-size/2,size,size);
    },
  };
}
function ensure(size,state) {
  if (unavailable) return null;
  if (!renderer) try { renderer = createRenderer(size,Boolean(state.tailThruster)); }
  catch (error) {
    unavailable = true; const node = document.getElementById('graphicsStatus');
    if (node) { node.hidden = false; node.textContent = '3D 戰機需要 WebGL 2，請啟用瀏覽器硬體加速後重新整理。'; }
    console.error('Unable to create the 3D ship renderer:',error);
  }
  return renderer;
}
function drawShip(context,position,size,state,alpha = 1) {
  const runtime = ensure(size,state); if (!runtime) return;
  if (state.simulationTick === undefined) runtime.update(position,size,state);
  runtime.draw(context,position,size,state,alpha);
}
drawShip.update = (position,size,state) => ensure(size,state)?.update(position,size,state);
export default drawShip;
