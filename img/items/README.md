# Pickup art

All three game sprites are **96 × 96 RGBA PNGs** with transparent padding, matching the width of the small A2.2 enemy sprite. They share one source canvas size, pixel density and nearest-neighbor game scaling. Their visible bodies fit approximately the existing three-cell pickup footprint; pickup rewards and collision shapes are retained.

Created using the built-in image generation tool from the approved SPACEWAR pickup concept sheet, then exported at the requested consistent resolution. The original generated images are preserved outside the repository. The game caches each sprite once rather than processing art every frame.

## Generation prompts

Each asset used the approved concept sheet as its reference. Substitute the subject below into this common prompt:

> Create a SINGLE production-ready transparent game sprite extracted/recreated from the approved reference design: ONLY the {subject}. No other objects, no sheet, no text labels, no numbers, no frame, no corner brackets, no floor or background. Preserve its approved white modular armor, cool pale grey side faces, charcoal recesses, neon color coding, precise recognizable silhouette. Top-down view with modest visible beveled depth, refined crisp pixel art / low-poly arcade spaceship hardware style, limited detail that reads at 48px. Square canvas, object exactly centered in both axes, longest dimension fills 80 percent of image, preserve aspect ratio. Transparent background including all around object. Keep glow tight and restrained, no large halo, no cast shadow detached from object. This is one of three equally scaled pickups; same pixel density, white material and light direction upper left for all. Match reference closely, do not redesign.

- `repair.png`: LEFT repair capsule, squat rounded rectangle, mint green medical plus and orange latches
- `hull.png`: CENTER hexagonal hull upgrade module, mint double chevrons and small plus, subtle purple edge emitters
- `triple.png`: RIGHT triple-shot capacitor module, three parallel horizontal amber energy cartridges inside white housing, tapered right end with three projectile symbol

Preview: `/art-prototypes/pickups-preview.html` (uses the actual game renderer).
