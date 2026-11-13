// Procedural, texture-free low-poly blockout. Forward is -Z; +Y is up.
export function buildModularInterceptor(T, { lowDetail = false, maxSpread = 1, tailThruster = false } = {}) {
  const root = new T.Group();
  root.name = 'Modular_Interceptor';
  const moving = [];
  const auxiliaryThrusters = [];
  const thrustJets = { main: null, left: null, right: null };
  function surface(options) {
    if (!lowDetail) return new T.MeshStandardMaterial(options);
    const { color, emissive, emissiveIntensity, flatShading } = options;
    return new T.MeshLambertMaterial(Object.fromEntries(Object.entries({ color, emissive, emissiveIntensity, flatShading }).filter(([, value]) => value !== undefined)));
  }
  const materials = {
    shell: surface({ color: 0xdce4e9, metalness: .35, roughness: .46, flatShading: true }),
    dark: surface({ color: 0x202d42, metalness: .5, roughness: .48, flatShading: true }),
    steel: surface({ color: 0x6d8292, metalness: .72, roughness: .33, flatShading: true }),
    orange: surface({ color: 0xf99536, metalness: .25, roughness: .4, flatShading: true }),
    window: surface({ color: 0x135575, emissive: 0x06425a, emissiveIntensity: .35, metalness: .5, roughness: .18, flatShading: true }),
    glow: surface({ color: 0x73f3ff, emissive: 0x36dbea, emissiveIntensity: 2, roughness: .25 }),
  };
  Object.entries(materials).forEach(([name, material]) => { material.name = name; });

  function slab(width, length, height, corner = .08) {
    const w = width / 2, l = length / 2;
    if (lowDetail && (width < .25 || length < .25 || height < .08)) {
      return new T.BoxGeometry(width, height, length);
    }
    const c = Math.min(corner, w * .6, l * .6);
    return prism([[-w + c, -l], [w - c, -l], [w, -l + c], [w, l - c], [w - c, l], [-w + c, l], [-w, l - c], [-w, -l + c]], height);
  }
  function prism(points, height) {
    const shape = new T.Shape();
    points.forEach(([x, z], index) => index ? shape.lineTo(x, -z) : shape.moveTo(x, -z));
    shape.closePath();
    const geometry = new T.ExtrudeGeometry(shape, { depth: height, steps: 1, bevelEnabled: !lowDetail, bevelThickness: .025, bevelSize: .025, bevelSegments: 1, curveSegments: 1 });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -height / 2, 0);
    return geometry;
  }
  function mesh(name, geometry, material, parent, position = [0, 0, 0]) {
    // At game scale these fasteners and repeated vents are sub-pixel details.
    if (lowDetail && /(?:_Pin$|_Lock$|Shoulder_Lock|Intake_Fin|Weapon_Serial|Weapon_Clamp|Drive_Clamp|Canopy_Indicator|Nozzle_Inner|Link_B_Highlight|Core_Rear_Vent_[12]|Exhaust_Slot_.*_(?:-1|1)$)/.test(name)) {
      geometry.dispose();
      return new T.Object3D();
    }
    const object = new T.Mesh(geometry, material);
    object.name = name;
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    (parent || root).add(object);
    return object;
  }
  function group(name, parent = root, animated = false) {
    const object = new T.Group();
    object.name = name;
    parent.add(object);
    if (animated) moving.push(object);
    return object;
  }
  function block(name, dimensions, material, parent, position, corner = .07) {
    return mesh(name, slab(...dimensions, corner), material, parent, position);
  }
  function joint(name, parent, position, animated = false) {
    const object = group(name, parent, animated);
    object.position.set(...position);
    mesh(`${name}_Bearing`, new T.CylinderGeometry(.13, .13, .12, lowDetail ? 6 : 10), materials.steel, object);
    mesh(`${name}_Lock`, new T.CylinderGeometry(.085, .085, .018, 10), materials.orange, object, [0, .07, 0]);
    mesh(`${name}_Pin`, new T.CylinderGeometry(.035, .035, .022, 8), materials.dark, object, [0, .085, 0]);
    return object;
  }

  const core = group('Pilot_Core');
  block('Backbone', [.48, tailThruster ? 3.1 : 4.05, .2], materials.dark, core, [0, .19, tailThruster ? .18 : .3]);
  const hull = [[0, -1.87], [.38, -1.3], [.6, -.5], [.62, .55], [.4, 1.32], [0, 1.58], [-.4, 1.32], [-.62, .55], [-.6, -.5], [-.38, -1.3]];
  mesh('Core_Underbody', prism(hull, .36), materials.dark, core, [0, .43, 0]);
  const upper = mesh('Core_Armor', prism(hull.map(([x, z]) => [x * .91, z * .92]), .22), materials.shell, core, [0, .7, 0]);
  upper.userData.module = 'fixed pilot core';
  block('Canopy_Gasket', [.69, 1.28, .1], materials.dark, core, [0, .88, -.49], .19);
  const canopy = mesh('Smoked_Canopy', new T.IcosahedronGeometry(1, 0), materials.window, core, [0, .98, -.49]);
  canopy.scale.set(.31, .16, .63);
  block('Nose_Identification', [.15, .44, .035], materials.orange, core, [0, .84, -1.19]);
  block('Canopy_Indicator', [.08, .24, .04], materials.glow, core, [0, .92, -.04], .02);
  for (let i = 0; i < 3; i++) block(`Core_Rear_Vent_${i}`, [.45, .07, .025], materials.dark, core, [0, .85, .65 + i * .15], .01);
  for (const sign of [-1, 1]) block(`Shoulder_Lock_${sign}`, [.11, .32, .06], materials.orange, core, [sign * .53, .76, .18]);

  if (tailThruster) {
    // A short, wide nozzle replaces the exposed backbone; it ends alongside
    // the two drive cassettes instead of forming a central tail spike.
    const thruster = group('Central_Tail_Thruster');
    thruster.position.set(0, .31, 1.56);
    materials.nozzle = surface({ color: 0x303335, flatShading: true });
    block('Tail_Thruster_Collar', [.68, .48, .4], materials.steel, thruster, [0, 0, 0], .12);
    const nozzle = mesh('Tail_Nozzle_Shroud', new T.CylinderGeometry(.25, .31, .34, 6, 1, true), materials.steel, thruster, [0, 0, .24]);
    nozzle.rotation.x = Math.PI / 2;
    const chamber = mesh('Tail_Nozzle_Chamber', new T.CylinderGeometry(.23, .23, .025, 6), materials.nozzle, thruster, [0, 0, .405]);
    chamber.rotation.x = Math.PI / 2;
    const exhaust = group('Main_Active_Exhaust', thruster, true);
    thrustJets.main = exhaust;
    const aperture = mesh('Tail_Nozzle_Aperture', new T.CylinderGeometry(.16, .16, .028, 6), materials.glow, exhaust, [0, 0, .423]);
    aperture.rotation.x = Math.PI / 2;
    // Short, separated plasma bands have no rigid pointed tail silhouette.
    materials.plasma = new T.MeshBasicMaterial({ color: 0x42dfff, transparent: true, opacity: .85, toneMapped: false });
    block('Tail_Exhaust_Band_0', [.3, .1, .08], materials.plasma, exhaust, [0, .08, .49], .02);
    block('Tail_Exhaust_Band_1', [.23, .075, .05], materials.plasma, exhaust, [0, .08, .63], .02);
    block('Tail_Top_Light', [.32, .19, .025], materials.plasma, exhaust, [0, .215, .05], .03);
  }

  for (const sign of [-1, 1]) {
    const name = sign < 0 ? 'L' : 'R';
    const engine = group(`Drive_Cassette_${name}`);
    if (tailThruster) {
      const gimbal = group(`Auxiliary_Thruster_Gimbal_${name}`, root, true);
      gimbal.position.set(sign * .86, .4, .65);
      gimbal.add(engine);
      engine.position.set(0, 0, .4);
      engine.scale.setScalar(.5);
      auxiliaryThrusters.push({ gimbal, sign });
      block(`Auxiliary_Mount_${name}`, [.24, .2, .12], materials.steel, core, [sign * .66, .4, .7], .03);
    } else engine.position.set(sign * .98, .4, 1.07);
    block(`Drive_Chassis_${name}`, [.76, 1.5, .43], materials.dark, engine, [0, 0, 0]);
    block(`Drive_Shell_${name}`, [.71, 1.36, .21], materials.shell, engine, [0, .29, -.04], .17);
    block(`Drive_Intake_${name}`, [.4, .46, .035], materials.dark, engine, [0, .425, -.31]);
    for (let i = 0; i < 3; i++) block(`Intake_Fin_${name}_${i}`, [.31, .035, .025], materials.steel, engine, [0, .455, -.45 + i * .13], .005);
    for (const side of [-1, 1]) block(`Drive_Clamp_${name}_${side}`, [.1, .25, .13], materials.orange, engine, [side * .37, .14, .15]);
    block(`Nozzle_Housing_${name}`, [.56, .16, .34], materials.steel, engine, [0, .015, .79]);
    block(`Nozzle_Inner_${name}`, [.43, .055, .22], materials.dark, engine, [0, .02, .89]);
    for (let i = -1; i <= 1; i++) block(`Exhaust_Slot_${name}_${i}`, [.075, .025, .17], materials.glow, engine, [i * .12, .025, .928], .005);
    if (tailThruster) {
      const nozzle = mesh(`Auxiliary_Nozzle_Shroud_${name}`, new T.CylinderGeometry(.22, .27, .28, 6, 1, true), materials.steel, engine, [0, .015, .91]);
      nozzle.rotation.x = Math.PI / 2;
      const chamber = mesh(`Auxiliary_Nozzle_Chamber_${name}`, new T.CylinderGeometry(.2, .2, .02, 6), materials.nozzle, engine, [0, .015, 1.06]);
      chamber.rotation.x = Math.PI / 2;
      const exhaust = group(`Auxiliary_Active_Exhaust_${name}`, engine, true);
      thrustJets[sign < 0 ? 'left' : 'right'] = exhaust;
      const aperture = mesh(`Auxiliary_Nozzle_Aperture_${name}`, new T.CylinderGeometry(.13, .13, .025, 6), materials.plasma, exhaust, [0, .015, 1.075]);
      aperture.rotation.x = Math.PI / 2;
      block(`Auxiliary_Top_Channel_${name}`, [.12, .37, .025], materials.plasma, exhaust, [0, .45, -.31], .02);
      block(`Auxiliary_Exhaust_Band_${name}`, [.26, .13, .06], materials.plasma, exhaust, [0, .08, 1.16], .02);
      block(`Auxiliary_Exhaust_Tip_${name}`, [.17, .07, .04], materials.plasma, exhaust, [0, .08, 1.35], .02);
    }
  }

  const assemblies = [];
  const up = new T.Vector3(0, 1, 0);
  for (const sign of [-1, 1]) {
    const name = sign < 0 ? 'L' : 'R';
    const pod = group(`Weapon_Cassette_${name}`, root, true);
    block(`Weapon_Underbody_${name}`, [.62, 1.9, .34], materials.dark, pod, [0, 0, 0]);
    const silhouette = [[-.2, -.99], [.2, -.99], [.3, -.64], [.3, .65], [.17, .9], [-.17, .9], [-.3, .65], [-.3, -.64]];
    mesh(`Weapon_Shell_${name}`, prism(silhouette, .2), materials.shell, pod, [0, .255, 0]);
    block(`Weapon_Rail_Recess_${name}`, [.15, 1.12, .04], materials.dark, pod, [sign * .23, .38, .1]);
    for (let i = 0; i < 3; i++) block(`Weapon_Serial_${name}_${i}`, [.09, .055, .025], materials.steel, pod, [-sign * .11, .375, .22 + i * .13], .005);
    for (const z of [-.6, .56]) block(`Weapon_Clamp_${name}_${z}`, [.13, .17, .12], materials.orange, pod, [-sign * .29, .2, z]);
    const barrel = group(`Barrel_Extension_${name}`, pod, true);
    const tube = mesh(`Barrel_Sleeve_${name}`, new T.CylinderGeometry(.065, .085, .62, lowDetail ? 4 : 8), materials.steel, barrel);
    tube.rotation.x = Math.PI / 2;
    const muzzle = mesh(`Laser_Aperture_${name}`, new T.CylinderGeometry(.042, .042, .025, lowDetail ? 4 : 8), materials.glow, barrel, [0, 0, -.325]);
    muzzle.rotation.x = Math.PI / 2;
    block(`Weapon_Vent_${name}`, [.22, .42, .035], materials.glow, pod, [0, .385, -.36]);
    const cover = group(`Weapon_Bay_Cover_${name}`, pod, true);
    block(`Weapon_Cover_Plate_${name}`, [.35, .62, .055], materials.orange, cover, [0, 0, 0]);
    joint(`Dock_Collar_${name}`, pod, [-sign * .27, -.19, .05]);

    const rootJoint = joint(`Shoulder_Pivot_${name}`, root, [sign * .55, .08, -.1]);
    const elbow = joint(`Elbow_${name}`, root, [0, .08, 0], true);
    const first = group(`Link_A_${name}`, root, true);
    // Link geometry is along Y; quaternion points it along the planar mechanism.
    mesh(`Link_A_Beam_${name}`, new T.BoxGeometry(.15, .7, .13), materials.steel, first);
    const second = group(`Link_B_${name}`, root, true);
    mesh(`Link_B_Beam_${name}`, new T.BoxGeometry(.13, 1, .13), materials.dark, second);
    mesh(`Link_B_Highlight_${name}`, new T.BoxGeometry(.065, .4, .025), materials.orange, second, [0, 0, .08]);
    assemblies.push({ sign, pod, barrel, cover, first, second, elbow, rootJoint });
  }

  const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  function pointLink(object, from, to) {
    object.position.copy(from).add(to).multiplyScalar(.5);
    object.quaternion.setFromUnitVectors(up, to.clone().sub(from).normalize());
  }
  function setDeployment(amount) {
    // Limit the outriggers separately from the barrel and cover animations.
    const t = smooth(amount * maxSpread);
    const gun = smooth((amount - .55) / .45);
    for (const a of assemblies) {
      const x = 1.02 + t * 1.23;
      const z = -.45 - t * .45;
      a.pod.position.set(a.sign * x, .35, z);
      a.barrel.position.set(0, .16, -1.02 - gun * .4);
      a.cover.position.set(0, .43, -.38 + smooth((amount - .2) / .6) * .48);
      const start = new T.Vector3(a.sign * .55, .08, -.1);
      const end = new T.Vector3(a.sign * (x - .31), .08, z + .05);
      const dx = Math.abs(end.x) - .55, dz = end.z + .1;
      const distance = Math.hypot(dx, dz);
      const along = (.7 ** 2 - 1 ** 2 + distance ** 2) / (2 * distance);
      const height = Math.sqrt(Math.max(0, .7 ** 2 - along ** 2));
      const middle = new T.Vector3(a.sign * (.55 + along * dx / distance - height * dz / distance), .08, -.1 + along * dz / distance + height * dx / distance);
      a.elbow.position.copy(middle);
      pointLink(a.first, start, middle);
      pointLink(a.second, middle, end);
    }
    root.updateMatrixWorld(true);
  }
  setDeployment(0);
  function setThrustDirection(x = 0, y = 0) {
    x = Math.max(-1, Math.min(1, x));
    y = Math.max(-1, Math.min(1, y));
    for (const { gimbal, sign } of auxiliaryThrusters) {
      // Counter-steering stance: right input lowers the left auxiliary drive;
      // left input lowers the right. Zero input restores the paired rest pose.
      const lowered = Math.max(0, -sign * x);
      gimbal.position.set(sign * .86, .4 - lowered * .06, .65 + lowered * .12);
      gimbal.rotation.set(y * .15 + lowered * .08, -x * .12, -sign * y * .08);
    }
    if (thrustJets.main) thrustJets.main.visible = y < -.03;
    if (thrustJets.left) thrustJets.left.visible = x > .03;
    if (thrustJets.right) thrustJets.right.visible = x < -.03;
    root.updateMatrixWorld(true);
  }
  setThrustDirection(0, 0);
  return { root, setDeployment, setThrustDirection, auxiliaryThrusters, thrustJets, moving, materials, assemblies };
}
