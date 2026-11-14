# JJJ Godzilla 1998 — game asset

Model by **JJJ (Caseys42)**. Rigging, facial controls and source fixes by **MMDCharizard**.

Source: https://www.deviantart.com/mmdcharizard/art/MMD-Godzilla-Godzilla-1998-DL-839474655

Author rules: https://www.deviantart.com/mmdcharizard/journal/MMDCharizard-s-model-rules-409867850

The project owner confirmed author permission on 2026-11-14 to publish the edited model in this noncommercial demo: https://yecapee.github.io/spacewar/dist/ . This confirmation does not grant arbitrary downstream redistribution rights. The original download archive and high-resolution mesh are not included in the public repository or deployment.

## Included game model

- Reduced asset: `zilla-jjj-ps1-face.glb`, 1,536 triangles and 125 bones.
- Face: 512 triangles for the head region; eyes retain 208 triangles and teeth 94.
- Body proportions use uniform scaling from the original source.
- Source skinning drives the hips, two torso joints, two neck joints, head and fifteen tail joints.
- Runtime palette: gray back, blue lower jaw, throat, chest, abdomen, limbs and underside of the tail; amber eyes.
- Mouth stays closed except biting, thermal windup and beam release.
- `body-motion.mjs` advances the 21 weighted body joints at the game's fixed 40 Hz tick, with gait waves, delayed turning and stopping inertia.
- Colliders and mouth emitter are projected from the same posed skeleton used for rendering.

## Runtime and build

`model.mjs`, `palette.mjs` and `legacySkinning.mjs` provide loading, posing and WebGL compatibility. The vendored Three.js files are MIT licensed; see `vendor/THREE-LICENSE.txt`.

From the repository root:

```sh
npm ci
npm test
npm run build
```

The builder packages this reduced mesh, `model-report.json`, `source.json` and creator credits into `dist/assets/creature/`. The model path is relative to `dist/` and works under the original GitHub Pages subdirectory.

The standalone encounter source is in `../zilla-combat/`. To rebuild that local development preview, run `node scripts/build-zilla-preview.cjs zilla-combat`, serve the repository over HTTP and open `/art-prototypes/zilla-combat/`.
