import test from 'node:test';
import assert from 'node:assert/strict';
import {createKaijuController} from '../js/kaijuSequence.mjs';
import {createKaijuNavigation,KAIJU_SPACING} from '../js/kaijuNavigation.mjs';

function generator(seed){let value=seed;return()=>{value=(Math.imul(1664525,value)+1013904223)>>>0;return value/4294967296;};}
function group(width,count,sameSpawn=false){
  const enemies=[];
  for(let i=0;i<count;i++){
    const enemy={position:sameSpawn?Math.floor(width/2):Math.round(width*(i+1)/(count+1)),life:800};
    enemy.kaiju=createKaijuController(enemy,{width,height:56,getPeers:()=>enemies,random:generator(91+i*123)});
    enemies.push(enemy);
  }
  return enemies;
}
function assertSpacing(enemies,width){
  for(let i=0;i<enemies.length;i++)for(let j=i+1;j<enemies.length;j++){
    const a=enemies[i].position,b=enemies[j].position;
    const distance=Math.hypot(a%width-b%width,Math.floor(a/width)-Math.floor(b/width));
    assert.ok(distance>=KAIJU_SPACING-.001,`bosses ${i}, ${j} overlap: ${distance}`);
  }
}

test('duplicate spawns are separated before the first frame, including narrow mobile arenas',()=>{
  for(const width of [21,26,45])assertSpacing(group(width,3,true),width);
});

test('multiple kaiju maintain body clearance while flanking a moving player and bursting',()=>{
  for(const width of [21,26,45]){
    const enemies=group(width,3),paths=enemies.map(()=>[]);
    const ship={position:width*44+Math.floor(width/2)};
    for(let tick=0;tick<2500;tick++){
      ship.position=(12+Math.round((1+Math.sin(tick/320))*16))*width+Math.round((width-1)*(1+Math.sin(tick/173))*.5);
      for(let i=0;i<enemies.length;i++){
        const old=enemies[i].position;enemies[i].kaiju.update(ship);
        if(enemies[i].position!==old)paths[i].push([tick,enemies[i].position%width-old%width,Math.floor(enemies[i].position/width)-Math.floor(old/width)]);
      }
      assertSpacing(enemies,width);
    }
    for(const path of paths)assert.ok(path.length>10,'an avoidance lane remains permanently stuck');
    assert.equal(new Set(paths.map(path=>JSON.stringify(path))).size,3,'bosses follow identical movement schedules');
    assert.notEqual(enemies[0].kaiju.state.time,enemies[1].kaiju.state.time);
    assert.notEqual(enemies[0].kaiju.routeSide,enemies[1].kaiju.routeSide);
  }
});

test('rush planning rejects a path through another boss and movement cannot cross its clearance',()=>{
  const width=45,enemy={position:20*width+10,life:800};
  const other={position:20*width+22,life:800,kaiju:{id:1}};
  const navigation=createKaijuNavigation(enemy,{width,height:56,getPeers:()=>[other]});
  assert.equal(navigation.canMove(10,20,30,20),false);
  assert.equal(navigation.canMove(10,20,11,20),true);
  const heading=navigation.planRush(0);
  assert.ok(heading===null||heading!==0,'rush is aimed directly into the other boss');
  other.removed=true;
  assert.equal(navigation.canMove(10,20,30,20),true);
  assert.equal(navigation.planRush(0),0);
});

test('a survivor resumes normal pursuit after its partner dies',()=>{
  const width=26,enemies=group(width,2),ship={position:width*44+13};
  enemies[1].removed=true;enemies[1].life=0;
  const start=enemies[0].position;let moved=false;
  for(let tick=0;tick<400;tick++){enemies[0].kaiju.update(ship);moved ||= enemies[0].position!==start;}
  assert.ok(moved);
});
