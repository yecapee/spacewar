import test from 'node:test';
import assert from 'node:assert/strict';
import { createTouchGestures } from '../js/touchGestures.mjs';

function circle(gesture, sign = 1, turns = 1) {
  const point = (i) => ({ x: 150 + 50 * Math.cos(i / 40 * Math.PI * 2 * sign * turns), y: 300 + 50 * Math.sin(i / 40 * Math.PI * 2 * sign * turns) });
  gesture.start(point(0), 0);
  for (let i = 1; i < 40; i++) gesture.move(point(i));
  return gesture.end(point(40), 700);
}
test('closed circles in either direction cast a shield; half circles and scribbles do not', () => {
  assert.equal(circle(createTouchGestures(), 1), 'shield');
  assert.equal(circle(createTouchGestures(), -1), 'shield');
  assert.equal(circle(createTouchGestures(), 1, .5), null);
  assert.equal(circle(createTouchGestures(), 1, 2), 'shield');
  const gesture = createTouchGestures();
  gesture.start({ x: 0, y: 0 }, 0);
  for (let i = 0; i < 20; i++) gesture.move({ x: i % 2 * 80, y: i * 10 });
  assert.equal(gesture.end({ x: 0, y: 0 }, 700), null);
});
test('a nearby double tap casts once; drags, distant taps, and cancelled input do not', () => {
  const gesture = createTouchGestures(), point = { x: 100, y: 200 };
  const tap = (time, where = point) => { gesture.start(where, time); return gesture.end(where, time + 40); };
  assert.equal(tap(0), null); assert.equal(tap(180), 'attack'); assert.equal(tap(300), null);
  gesture.cancel(); assert.equal(tap(400), null); assert.equal(tap(900), null);
  assert.equal(tap(1000, { x: 170, y: 200 }), null);
  gesture.start(point, 1200); gesture.move({ x: 200, y: 200 });
  assert.equal(gesture.end(point, 1300), null);
  assert.equal(tap(1400), null);
  gesture.cancel(); assert.equal(tap(1500), null);
});

function drawLoop(gesture,{rx=50,ry=rx,turns=1,sign=1,duration=700,samples=40,time=0,wobble=false}={}){
  const point=i=>{
    const angle=i/samples*Math.PI*2*turns*sign+(wobble ? .05*Math.sin(i*2.2) : 0);
    const r=wobble?1+.16*Math.sin(i*.7):1;
    return {x:150+rx*r*Math.cos(angle),y:300+ry*r*Math.sin(angle)};
  };
  gesture.start(point(0),time);
  for(let i=1;i<samples;i++)gesture.move(point(i),time+duration*i/samples);
  return gesture.end(point(samples),time+duration);
}

test('thumb-sized, open, oval, slow and sparsely sampled loops are recognized in either direction',()=>{
  for(const sign of [-1,1])for(const options of [
    {turns:.75},{rx:22,ry:15,turns:.8,duration:2600,samples:14},
    {rx:50,ry:20},{rx:14,samples:8},{rx:30,duration:120,samples:8},
    {duration:3000,samples:80,wobble:true},
  ])assert.equal(drawLoop(createTouchGestures(),{...options,sign}),'shield',JSON.stringify({options,sign}));
});

test('a recent circle is recognized after a long movement drag, and a dense circle never freezes at the sample cap',()=>{
  const gesture=createTouchGestures();
  gesture.start({x:0,y:0},0);
  for(let i=1;i<=600;i++)gesture.move({x:i*.7,y:i*.5},i*10);
  for(let i=0;i<32;i++)gesture.move({x:420+40*Math.cos(i*Math.PI/16),y:300+30*Math.sin(i*Math.PI/16)},6100+i*25);
  assert.equal(gesture.end({x:460,y:300},6900),'shield');
  assert.equal(gesture.end({x:460,y:300},7000),null,'one release cannot cast twice');
  assert.equal(drawLoop(gesture,{rx:260,samples:2048,duration:1600,time:8000}),'shield');
});

test('ordinary drags, U-turns, zigzags and tiny finger wobbles do not cast',()=>{
  for(const turns of [.25,.5])assert.equal(drawLoop(createTouchGestures(),{turns}),null);
  assert.equal(drawLoop(createTouchGestures(),{rx:9}),null);
  for(const path of [
    Array.from({length:60},(_,i)=>({x:10+i*4,y:40+i*2})),
    Array.from({length:60},(_,i)=>({x:150+Math.sin(i*.15)*80,y:50+i*5})),
    Array.from({length:60},(_,i)=>({x:100+i%2*80,y:50+i*4})),
  ]){
    const gesture=createTouchGestures();gesture.start(path[0],0);
    path.slice(1).forEach((point,i)=>gesture.move(point,(i+1)*20));
    assert.equal(gesture.end(path.at(-1),1200),null);
  }
});
