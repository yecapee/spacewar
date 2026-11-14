import * as THREE from './vendor/three.module.js';

// Palette lives in bind-pose model coordinates, so the blue belly follows
// the original skin through movement without adding geometry or image assets.
export function blueInspiredMaterial(source,{simpleLighting=false}={}){
  const colors={body:'#63787a',spines:'#456371',tongue:'#c3888e',teeth:'#f2e7cc',eyes:'#f4c45e'};
  const options={color:colors[source.name]||colors.body,side:THREE.DoubleSide,emissive:colors[source.name]||colors.body,emissiveIntensity:.12};
  const material=simpleLighting?new THREE.MeshLambertMaterial(options):new THREE.MeshStandardMaterial({...options,roughness:.88,metalness:0,flatShading:true});
  material.name=source.name;
  const isEye=source.name==='eyes';
  if(isEye)material.emissiveIntensity=.02;
  if(source.name!=='body'&&source.name!=='body_head'&&!isEye)return material;
  const uniforms={
    blueBase:{value:new THREE.Color('#63787a')},
    blueBelly:{value:new THREE.Color('#145a9c')},
    eyeIris:{value:new THREE.Color('#f4b844')},
  };
  material.color.set('#ffffff');
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vPalettePosition;\nvarying vec3 vPaletteNormal;');
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPalettePosition = position;\nvPaletteNormal = normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vPalettePosition;
      varying vec3 vPaletteNormal;
      uniform vec3 blueBase, blueBelly, eyeIris;
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',isEye?`#include <color_fragment>
      float eyeSide = sign(vPalettePosition.x);
      vec3 eyeDirection = normalize(vPalettePosition-vec3(eyeSide*0.574486,15.27085,17.46544));
      float pupilHorizontal = eyeDirection.x*eyeSide*0.76-eyeDirection.z*0.65;
      float pupil = 1.0-smoothstep(0.10,0.18,abs(pupilHorizontal));
      pupil *= 1.0-smoothstep(0.65,0.8,abs(eyeDirection.y));
      pupil *= smoothstep(0.2,0.4,dot(eyeDirection,vec3(eyeSide*0.65,0.0,0.76)));
      diffuseColor.rgb = mix(eyeIris,vec3(0.004,0.006,0.008),pupil);
    `:`#include <color_fragment>
      float belly = 1.0-smoothstep(-0.35,-0.05,normalize(vPaletteNormal).y);
      diffuseColor.rgb = mix(blueBase,blueBelly,belly);
    `);
  };
  material.customProgramCacheKey=()=> isEye?'amber-eye-slit-v1':'blue-underside-palette-v3';
  return material;
}
