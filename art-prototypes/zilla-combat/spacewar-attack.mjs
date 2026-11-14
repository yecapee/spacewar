import {createKaijuAttack} from '../../js/kaijuAttack.mjs';
export function createSurvivalAttack(enemy,options){
 const ray=createKaijuAttack(enemy,options);let serial=-1,hit=false;
 return {
  update(ship,world){
   if(ray.update(ship,world))return true;
   const k=enemy.kaiju,s=k.state;
   if(serial!==s.serial){serial=s.serial;hit=false;}
   if(s.pose?.active&&!hit&&!ship.isDead){
    const shape=k.meleeShape;
    if(shape&&world.cache.get(ship).points.some(p=>Math.hypot(p.x-shape.x,p.y-shape.y)<=shape.radius+(p.radius||0))){ship.injured();hit=true;}
   }return false;
  },
  draw(context,alpha){
   const k=enemy.kaiju,shape=k.meleeShape,s=k.state;
   if(shape&&s.action?.startsWith('A')){context.save();context.strokeStyle=s.pose.active?'#ff7b62':'#ffc477';context.globalAlpha=.55;context.lineWidth=2;context.beginPath();context.arc(shape.x,shape.y,shape.radius,0,Math.PI*2);context.stroke();context.restore();}
   ray.draw(context,alpha);
  },get ray(){return ray.ray;},
 };
}
