import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
test('circle boss collider reads never advance its angle or share a hidden counter', () => {
  const source=readFileSync(new URL('../js/lookPath.js',import.meta.url),'utf8').replace(/import[\s\S]*?from\s+["'][^"']+["'];/g,'').replace('export default {','this.paths = {');
  const context=vm.createContext({ w:40,h:60,
    positionTosXsY:ps=>({x:ps%40,y:Math.floor(ps/40)}),sXsYToPosition:(x,y)=>y*40+x,
    ezPositionWithCheckScope:ps=>(x,y)=>{const sx=ps%40+x,sy=Math.floor(ps/40)+y;return sx<0||sx>=40||sy<0||sy>=60?undefined:sy*40+sx;},
  });
  vm.runInContext(source,context);
  const snapshot=JSON.stringify(context.paths.CIRCLE(1220,true,0));
  for(let i=0;i<100;i++)assert.equal(JSON.stringify(context.paths.CIRCLE(1220,false,0)),snapshot);
  assert.notEqual(JSON.stringify(context.paths.CIRCLE(1220,true,1800)),snapshot);
});
