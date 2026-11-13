import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { SpatialGrid, sweptBounds, segmentBox, createColliderCache } from '../js/engine.mjs';
import { createProjectileSystem } from '../js/projectileSystem.mjs';
let seed = 42; const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
const enemies = Array.from({length: 300}, () => ({ x: random()*1200, y: random()*1800 }));
const shots = Array.from({length: 4000}, () => {const x=random()*1200,y=random()*1800;return {from:{x,y},to:{x:x+(random()-.5)*30,y:y-25}};});
const buildStart=performance.now();
const grid = new SpatialGrid(60); for(const enemy of enemies)grid.insert(enemy,{minX:enemy.x-15,maxX:enemy.x+15,minY:enemy.y-15,maxY:enemy.y+15});
const gridBuildMs=performance.now()-buildStart;
let bruteChecks=0,gridChecks=0,bruteHits=0,gridHits=0;const candidates=[],bounds={};
const start=performance.now();
for(const shot of shots)for(const enemy of enemies){bruteChecks++;if(segmentBox(shot.from,shot.to,enemy.x,enemy.y,15)!==null)bruteHits++;}
const bruteMs=performance.now()-start, next=performance.now();
for(const shot of shots)for(const enemy of grid.query(sweptBounds(shot.from,shot.to),candidates)){gridChecks++;if(segmentBox(shot.from,shot.to,enemy.x,enemy.y,15)!==null)gridHits++;}
const gridMs=performance.now()-next;assert.equal(gridHits,bruteHits);assert.ok(gridChecks<bruteChecks*.1);
let builds=0;const cache=createColliderCache(e=>{builds++;return [{ps:e.position}];},(ps,out)=>Object.assign(out,{x:ps,y:0}),7.5);
const entity={position:10,look:'test'};for(let tick=0;tick<1000;tick++){cache.beginTick();for(let read=0;read<20;read++)cache.get(entity);}assert.equal(builds,1);
const system=createProjectileSystem({width:40,height:60,cellWidth:15,cellHeight:15}),active=[];
for(let wave=0;wave<100;wave++){for(let i=0;i<100;i++)system.spawn('player',1000,1000,active);for(const bullet of active)bullet.dead=true;system.cleanup(active);}assert.equal(system.pool.created,100);
console.log(JSON.stringify({scenario:{enemies:300,shots:4000},identicalHits:bruteHits,bruteChecks,gridChecks,checkReductionPercent:Number((100*(1-gridChecks/bruteChecks)).toFixed(2)),gridBuildMs:Number(gridBuildMs.toFixed(2)),bruteMs:Number(bruteMs.toFixed(2)),gridMs:Number(gridMs.toFixed(2)),colliderBuildsFor20000Reads:builds,projectileObjectsFor10000Spawns:system.pool.created},null,2));
