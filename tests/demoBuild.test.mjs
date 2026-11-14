import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {Script} from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
test('GitHub demo packages classic scripts and resolves model assets inside dist',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/data-model-base="\.\/assets\/creature\/"/);assert.doesNotMatch(html,/type=["'](?:module|importmap)["']/);
 for(const match of html.matchAll(/(?:src|href)=["'](\.\/[^"']+)["']/g))assert.ok(fs.existsSync(path.join(root,match[1].split('?')[0])),match[1]);
 const scripts=[...html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)].map(m=>m[1]);assert.ok(scripts.length>0);
 for(const script of scripts)assert.doesNotThrow(()=>new Script(fs.readFileSync(path.join(root,script),'utf8')));
 for(const name of ['zilla-jjj-ps1-face.glb','model-report.json','source.json','CREDITS.txt'])assert.ok(fs.existsSync(path.join(root,'assets/creature',name)));
 assert.ok(!fs.existsSync(path.join(root,'assets/creature/zilla-jjj.glb')),'do not redistribute the original high resolution asset');
 assert.match(html,/MMDCharizard/);
});
test('public demo includes the reduced skinned mesh with real head and tail joint weights',()=>{
 const b=fs.readFileSync(path.join(root,'assets/creature/zilla-jjj-ps1-face.glb')),len=b.readUInt32LE(12),g=JSON.parse(b.subarray(20,20+len));
 assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);assert.equal(g.skins[0].joints.length,125);
 assert.equal(g.meshes.flatMap(m=>m.primitives).reduce((sum,p)=>sum+g.accessors[p.indices].count/3,0),1536);
 const jointNames=g.skins[0].joints.map(i=>g.nodes[i].name);for(const name of ['lowerbody','upperbody','upperbody2','neck','neck2','head','tail','tail15'])assert.ok(jointNames.includes(name));
 const source=JSON.parse(fs.readFileSync(path.join(root,'assets/creature/source.json')));assert.equal(source.usage.approved_public_demo,'https://yecapee.github.io/spacewar/dist/');
});
