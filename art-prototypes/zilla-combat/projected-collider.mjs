// Rasterize posed, projected model triangles into Spacewar's existing cell grid.
export function rasterizeTriangle(a,b,c,seen){
 const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
 const orientation=cross(a,b,c);if(Math.abs(orientation)<1e-7)return;
 for(let y=Math.ceil(Math.min(a.y,b.y,c.y)-.4);y<=Math.floor(Math.max(a.y,b.y,c.y)+.4);y++)
  for(let x=Math.ceil(Math.min(a.x,b.x,c.x)-.4);x<=Math.floor(Math.max(a.x,b.x,c.x)+.4);x++){
   const p={x,y},sign=orientation>0?1:-1;
   if(sign*cross(a,b,p)>=-.6&&sign*cross(b,c,p)>=-.6&&sign*cross(c,a,p)>=-.6)seen.add(x+','+y);
  }
}
