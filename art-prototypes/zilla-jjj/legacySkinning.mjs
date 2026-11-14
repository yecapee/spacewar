import {ShaderChunk} from './vendor/three.module.js';

/** WebGL 1 cannot use textureSize/texelFetch. Four adjacent texels hold one bone matrix. */
export function legacySkinningShader(textureWidth){
  if(!Number.isInteger(textureWidth)||textureWidth<4||textureWidth%4)throw new Error('Invalid bone texture width');
  return `
  #ifdef USE_SKINNING
    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;
    uniform highp sampler2D boneTexture;
    mat4 getBoneMatrix(const in float i) {
      float size = ${textureWidth.toFixed(1)};
      float j = i * 4.0;
      float x = mod(j, size);
      float y = (floor(j / size) + 0.5) / size;
      vec4 v1 = texture2D(boneTexture, vec2((x + 0.5) / size, y));
      vec4 v2 = texture2D(boneTexture, vec2((x + 1.5) / size, y));
      vec4 v3 = texture2D(boneTexture, vec2((x + 2.5) / size, y));
      vec4 v4 = texture2D(boneTexture, vec2((x + 3.5) / size, y));
      return mat4(v1, v2, v3, v4);
    }
  #endif
  `;
}

export function enableLegacySkinning(root){
  const widths=new Set(),skeletons=new Set();
  root.traverse(node=>{if(node.isSkinnedMesh)skeletons.add(node.skeleton);});
  for(const skeleton of skeletons){skeleton.computeBoneTexture();widths.add(skeleton.boneTexture.image.width);}
  if(widths.size!==1)throw new Error('此模型的骨架貼圖尺寸無法使用相容繪圖模式。');
  ShaderChunk.skinning_pars_vertex=legacySkinningShader([...widths][0]);
}
