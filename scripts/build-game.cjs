const {Parcel}=require('@parcel/core');
const fs=require('node:fs/promises');
const path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
async function main(){
 const temporary=path.join(root,'.parcel-release'),destination=path.join(root,'dist');
 await fs.rm(temporary,{recursive:true,force:true});
 const parcel=new Parcel({entries:path.join(root,'index.js'),defaultConfig:require.resolve('@parcel/config-default'),mode:'production',shouldDisableCache:true,shouldAutoInstall:false,
  targets:{demo:{context:'browser',outputFormat:'global',distDir:temporary,publicUrl:'./',engines:{browsers:['Chrome >= 80','Safari >= 13']}}},
  defaultTargetOptions:{shouldScopeHoist:true,shouldOptimize:true,sourceMaps:false},
 });
 const result=await parcel.run();
 const modelDirectory=path.join(temporary,'assets/creature');await fs.mkdir(modelDirectory,{recursive:true});
 for(const name of ['zilla-jjj-ps1-face.glb','model-report.json','source.json'])await fs.copyFile(path.join(root,'art-prototypes/zilla-jjj',name),path.join(modelDirectory,name));
 await fs.writeFile(path.join(modelDirectory,'CREDITS.txt'),'Model: JJJ (Caseys42). Rigging and source fixes: MMDCharizard.\nSource: https://www.deviantart.com/mmdcharizard/art/MMD-Godzilla-Godzilla-1998-DL-839474655\nRules: https://www.deviantart.com/mmdcharizard/journal/MMDCharizard-s-model-rules-409867850\nNoncommercial demo. Project owner confirmed author permission for this edited game model on 2026-11-14.\nOriginal model files are not distributed.\n');
 const bundles=result.bundleGraph.getBundles(),scripts=bundles.filter(b=>b.type==='js');
 if(scripts.length!==1)throw Error('Expected one classic game bundle');
 const scriptBytes=await fs.readFile(scripts[0].filePath),scriptName='spacewar.'+createHash('sha256').update(scriptBytes).digest('hex').slice(0,12)+'.js';
 await fs.writeFile(path.join(temporary,scriptName),scriptBytes);if(path.basename(scripts[0].filePath)!==scriptName)await fs.unlink(scripts[0].filePath);
 let html=await fs.readFile(path.join(root,'index.html'),'utf8');
 html=html.replace(/data-model-base="[^"]*"/,'data-model-base="./assets/creature/"');
 html=html.replace(/<script type="module" src="index.js"><\/script>/,`<script defer src="./${scriptName}"></script>`);
 const styleLinks=[];
 for(const bundle of bundles.filter(b=>b.type==='css')){
  const bytes=await fs.readFile(bundle.filePath),name='spacewar.'+createHash('sha256').update(bytes).digest('hex').slice(0,12)+'.css';
  await fs.writeFile(path.join(temporary,name),bytes);if(path.basename(bundle.filePath)!==name)await fs.unlink(bundle.filePath);styleLinks.push(`<link rel="stylesheet" href="./${name}">`);
 }
 html=html.replace('</head>',styleLinks.join('\n')+'\n</head>');
 for(const match of [...html.matchAll(/src="\.\/img\/([^"]+)"/g)]){
  const name=match[1],target=path.join(temporary,'assets/legacy',name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(path.join(root,'img',name),target);html=html.replace(match[0],`src="./assets/legacy/${name}"`);
 }
 await fs.writeFile(path.join(temporary,'index.html'),html.trimEnd()+'\n');
 if(/type=["'](?:module|importmap)["']/.test(html))throw Error('The public demo must use a self-contained classic browser bundle.');
 await fs.rm(destination,{recursive:true,force:true});await fs.rename(temporary,destination);
 console.log(JSON.stringify({directory:'dist',modelBase:'./assets/creature/',buildTimeMs:result.buildTime}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
