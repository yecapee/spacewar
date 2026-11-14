const {Parcel}=require('@parcel/core');
const path=require('node:path');
const fs=require('node:fs/promises');
const {createHash}=require('node:crypto');

async function main(){
  const project=path.resolve(__dirname,'../art-prototypes',process.argv[2] || 'zilla-1998');
  const parcel=new Parcel({
    entries:path.join(project,'viewer.mjs'),
    defaultConfig:require.resolve('@parcel/config-default'),
    mode:'production',
    shouldDisableCache:true,
    shouldAutoInstall:false,
    targets:{preview:{context:'browser',outputFormat:'global',distDir:path.join(project,'assets'),publicUrl:'./',engines:{browsers:['Chrome >= 80','Safari >= 13']}}},
    defaultTargetOptions:{shouldScopeHoist:true,shouldOptimize:true,sourceMaps:false},
  });
  const result=await parcel.run();
  const javascript=result.bundleGraph.getBundles().filter(bundle=>bundle.type==='js');
  if(javascript.length!==1)throw new Error('The preview must ship as a single browser script.');
  const contents=await fs.readFile(javascript[0].filePath),hash=createHash('sha256').update(contents).digest('hex').slice(0,12);
  const fingerprinted=path.join(project,'assets',`viewer.${hash}.js`);await fs.writeFile(fingerprinted,contents);
  const relative=path.relative(project,fingerprinted).split(path.sep).join('/');
  const htmlPath=path.join(project,'index.html');
  let html=await fs.readFile(htmlPath,'utf8');
  html=html.replace(/\s*<script type="importmap">[\s\S]*?<\/script>/,'');
  html=html.replace(/  <script>window\.addEventListener[\s\S]*?<script type="module" src="\.\/viewer\.mjs"><\/script>/,'  <!-- preview-runtime -->');
  html=html.replace(/  <!-- preview-runtime -->[\s\S]*?<!-- \/preview-runtime -->|  <!-- preview-runtime -->/,`  <!-- preview-runtime -->\n  <script src="./boot.js?v=${hash}"></script>\n  <script defer src="./${relative}"></script>\n  <!-- /preview-runtime -->`);
  const styles=result.bundleGraph.getBundles().filter(bundle=>bundle.type==='css');
  html=html.replace(/\s*<!-- bundled-styles -->[\s\S]*?<!-- \/bundled-styles -->/,'');
  if(styles.length)html=html.replace('</head>',`<!-- bundled-styles -->${styles.map(bundle=>`<link rel="stylesheet" href="./${path.relative(project,bundle.filePath).split(path.sep).join('/')}?v=${hash}">`).join('')}<!-- /bundled-styles --></head>`);
  await fs.writeFile(htmlPath,html);
  console.log(JSON.stringify({script:relative,bytes:(await fs.stat(javascript[0].filePath)).size,buildTimeMs:result.buildTime}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
