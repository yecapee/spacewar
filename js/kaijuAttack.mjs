import {segmentBox} from './engine.mjs';
export function createKaijuAttack(enemy,{pixel,width,height,toXY,onStage=()=>{},onShieldBreak=()=>{}}){
  let phase='',lastBurn=-1000,blocked=false,active=false,previousBeam=null;
  const start={x:0,y:0},end={x:0,y:0},center={},previous={};
  const state=enemy.kaiju.state;
  function endpoint(mouth=enemy.kaiju.mouth,d=enemy.kaiju.direction){
    start.x=mouth.x;start.y=mouth.y;
    const tx=Math.abs(d.x)<.00001?Infinity:((d.x>0?width:0)-start.x)/d.x;
    const ty=Math.abs(d.y)<.00001?Infinity:((d.y>0?height:0)-start.y)/d.y;
    const reach=Math.max(0,Math.min(tx>0?tx:Infinity,ty>0?ty:Infinity,Math.hypot(width,height)));
    end.x=start.x+d.x*reach;end.y=start.y+d.y*reach;
  }
  function flameHit(point){
    const d=enemy.kaiju.direction,dx=point.x-start.x,dy=point.y-start.y;
    const distance=dx*d.x+dy*d.y,across=Math.abs(dx*d.y-dy*d.x);
    return distance>=0&&distance<=pixel*12+(point.radius||0)&&across<=distance*.18+pixel*.15+(point.radius||0);
  }
  return {
    update(ship,world){
      if(enemy.removed||enemy.life<1)return true;
      if(phase!==state.phase){phase=state.phase;onStage(phase,enemy.kaiju.mouth);}
      endpoint();blocked=false;active=state.flame>.4||state.beam>.4;
      if(!active||ship.isDead){previousBeam=null;return false;}
      const current={mouth:{...enemy.kaiju.mouth},direction:{...enemy.kaiju.direction}};
      const angle=Math.atan2(current.direction.y,current.direction.x);
      const oldAngle=previousBeam?Math.atan2(previousBeam.direction.y,previousBeam.direction.x):angle;
      const delta=Math.atan2(Math.sin(angle-oldAngle),Math.cos(angle-oldAngle));
      const samples=state.beam>.4?Math.max(1,Math.min(16,Math.ceil(Math.abs(delta)*Math.hypot(width,height)/(pixel*.65)))):1;
      const points=world.cache.get(ship).points;
      let hit=false;
      for(let sample=1;sample<=samples;sample++){
        const progress=sample/samples;
        if(previousBeam&&state.beam>.4){
          const a=oldAngle+delta*progress;
          endpoint({x:previousBeam.mouth.x+(current.mouth.x-previousBeam.mouth.x)*progress,y:previousBeam.mouth.y+(current.mouth.y-previousBeam.mouth.y)*progress},{x:Math.cos(a),y:Math.sin(a)});
        }else endpoint();
        blocked=false;
        if(state.beam>.4&&ship.airShield?.phase==='ready'){
        let first=Infinity,particle=null;
        for(const p of ship.airShield.particles){
          if(!p.alive)continue;
          const hit=segmentBox(start,end,p.x,p.y,7.5,7.5);
          if(hit!==null&&hit<first){first=hit;particle=p;}
        }
        if(particle){
          end.x=start.x+(end.x-start.x)*first;end.y=start.y+(end.y-start.y)*first;blocked=true;
          if(state.tick-lastBurn>=8){particle.alive=false;lastBurn=state.tick;onShieldBreak(particle);}
        }
        }
        hit ||= points.some(p=>state.beam>.4
        ?segmentBox(start,end,p.x,p.y,(p.radius||0)+pixel*.18,(p.radius||0)+pixel*.18)!==null
        :flameHit(p));
      }
      if(hit)ship.injured();
      previousBeam=state.beam>.4?current:null;
      return false;
    },
    draw(context,alpha=1){
      if(enemy.removed||enemy.life<1)return;
      toXY(enemy.position,center);toXY(enemy.previousPosition,previous);
      const dx=(previous.x-center.x)*(1-alpha),dy=(previous.y-center.y)*(1-alpha);
      const d=enemy.kaiju.direction;
      context.save();context.translate(dx,dy);context.lineCap='round';
      if(state.phase==='charge'){
        context.globalAlpha=state.charge*.25;context.fillStyle='#b96aff';context.beginPath();context.arc(start.x,start.y,pixel*(.2+state.charge*.45),0,Math.PI*2);context.fill();
      }
      if(state.flame>.01){
        const length=pixel*12,sideX=-d.y,sideY=d.x;
        const gradient=context.createLinearGradient(start.x,start.y,start.x+d.x*length,start.y+d.y*length);
        gradient.addColorStop(0,'#fff1d9');gradient.addColorStop(.2,'#ffb664');gradient.addColorStop(.6,'#ee704981');gradient.addColorStop(1,'#d94e8200');
        context.fillStyle=gradient;context.globalCompositeOperation='lighter';
        for(let i=0;i<18;i++){
          const progress=(state.tick*.037+i*.071)%1,distance=progress*length;
          const radius=(pixel*.2+progress*pixel*1.7)*state.flame;
          const sway=Math.sin(i*2.4+state.tick*.13)*progress*pixel*.45;
          const cx=start.x+d.x*distance+sideX*sway,cy=start.y+d.y*distance+sideY*sway;
          context.globalAlpha=(1-progress)*state.flame*.65;
          context.beginPath();context.moveTo(cx+d.x*radius*1.7,cy+d.y*radius*1.7);
          context.lineTo(cx+sideX*radius,cy+sideY*radius);context.lineTo(cx-d.x*radius,cy-d.y*radius);
          context.lineTo(cx-sideX*radius,cy-sideY*radius);context.closePath();context.fill();
        }
      }
      if(state.beam>.01){
        context.globalCompositeOperation='lighter';
        for(const [size,color,opacity] of [[1.1,'#963dff',.1],[.45,'#b863ff',.7],[.11,'#fff1ff',1]]){
          context.lineWidth=pixel*size*state.beam;context.strokeStyle=color;context.globalAlpha=opacity*state.beam;
          context.beginPath();context.moveTo(start.x,start.y);context.lineTo(end.x,end.y);context.stroke();
        }
        context.globalAlpha=.75*state.beam;context.fillStyle='#f3d5ff';
        for(let i=0;i<(blocked?8:5);i++){
          const age=(state.tick*.07+i*.17)%1,angle=i*2.4;
          const radius=pixel*(.3+age*.8);
          context.fillRect(end.x+Math.cos(angle)*radius,end.y+Math.sin(angle)*radius,2*(1-age),2*(1-age));
        }
      }
      context.restore();
    },
    get ray(){return {start:{...start},end:{...end},blocked,active};},
  };
}
