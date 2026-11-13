export const KAIJU_SPACING=9;
const alive=(other,enemy)=>other!==enemy&&other.kaiju&&!other.removed&&other.life>0;
function segmentDistance(ax,ay,bx,by,x,y){
  const dx=bx-ax,dy=by-ay,length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/length)):0;
  return Math.hypot(ax+dx*t-x,ay+dy*t-y);
}

export function createKaijuNavigation(enemy,{width,height,getPeers=()=>[]}){
  let id=0;
  for(const other of getPeers()||[])if(alive(other,enemy))id=Math.max(id,(other.kaiju.id||0)+1);
  const side=id%2?1:-1;
  const margin=Math.min(4,Math.floor((width-1)/2)),rowMargin=Math.min(7,Math.floor((height-1)/2));
  function peers(){return getPeers()||[];}
  function crowded(){for(const other of peers())if(alive(other,enemy))return true;return false;}
  function target(x,y){
    if(!crowded())return {x,y};
    // Stable personal flanks prevent every boss choosing the same approach lane.
    return {x:Math.max(margin,Math.min(width-1-margin,x+side*6)),
      y:Math.max(rowMargin,Math.min(height-1-rowMargin,y-3-Math.floor(id/2)*6))};
  }
  function canMove(ax,ay,bx,by){
    if(ax===bx&&ay===by)return true;
    for(const other of peers())if(alive(other,enemy)){
      const x=other.position%width,y=Math.floor(other.position/width);
      const before=Math.hypot(ax-x,ay-y),after=Math.hypot(bx-x,by-y);
      const closest=segmentDistance(ax,ay,bx,by,x,y);
      if(before<KAIJU_SPACING-.001){
        if(after<=before+.001||closest<before-.001)return false;
      }else if(closest<KAIJU_SPACING-.001)return false;
    }
    return true;
  }
  function place(){
    if(!crowded())return;
    const preferredX=enemy.position%width,preferredY=Math.floor(enemy.position/width);
    let best=enemy.position,score=Infinity;
    for(let y=rowMargin;y<height-rowMargin;y++)for(let x=margin;x<width-margin;x++){
      let clear=true;
      for(const other of peers())if(alive(other,enemy)&&Math.hypot(x-other.position%width,y-Math.floor(other.position/width))<KAIJU_SPACING){clear=false;break;}
      if(!clear)continue;
      const cost=(x-preferredX)**2+(y-preferredY)**2*1.1-side*x*.001;
      if(cost<score){score=cost;best=y*width+x;}
    }
    enemy.position=best;
  }
  function guide(x,y){
    const goal=target(x,y),cx=enemy.position%width,cy=Math.floor(enemy.position/width);
    let dx=goal.x-cx,dy=goal.y-cy;
    for(const other of peers())if(alive(other,enemy)){
      let ax=cx-other.position%width,ay=cy-Math.floor(other.position/width),distance=Math.hypot(ax,ay);
      if(distance>=17)continue;
      if(distance<.001){ax=id<(other.kaiju.id||0)?-1:1;ay=0;distance=1;}
      const awayX=ax/distance,awayY=ay/distance;
      const strength=Math.max(0,14-distance)*2.5;
      dx+=awayX*strength;dy+=awayY*strength;
      // Both members use the same passing convention, yielding opposite tangents.
      if((goal.x-cx)*ax+(goal.y-cy)*ay<0){
        const hand=(id+(other.kaiju.id||0))%2?1:-1;
        dx-=awayY*strength*hand;dy+=awayX*strength*hand;
      }
    }
    return {dx,dy,distance:Math.hypot(goal.x-cx,goal.y-cy),grouped:crowded()};
  }
  function planRush(heading){
    if(!crowded())return heading;
    const x=enemy.position%width,y=Math.floor(enemy.position/width);
    for(const turn of [0,side*.4,-side*.4,side*.8,-side*.8]){
      const angle=heading+turn;
      if(canMove(x,y,x+Math.cos(angle)*9,y+Math.sin(angle)*9))return angle;
    }
    return null;
  }
  return {id,side,place,target,guide,canMove,planRush};
}
