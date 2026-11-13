export const SWEEP_ARC=Math.PI*1.5;
export const SWEEP_START=7.6;
export const SWEEP_END=12.6;
export function sweepOffset(time){
  const p=Math.max(0,Math.min(1,(time-SWEEP_START)/(SWEEP_END-SWEEP_START)));
  return SWEEP_ARC*p*p;
}
// Convert a screen heading to a world-space body yaw, including the downward mouth pitch.
export function bodyYawForHeading(heading,pitch=0){
  const dx=Math.cos(heading),dy=Math.sin(heading);
  const length=Math.hypot(16,13),verticalForward=16/length,verticalUp=13/length;
  const a=Math.cos(pitch)*dy,b=-verticalForward*Math.cos(pitch)*dx,c=verticalUp*Math.sin(pitch)*dx;
  const phase=Math.atan2(b,a),s=Math.asin(Math.max(-1,Math.min(1,c/Math.hypot(a,b))));
  for(const yaw of [s-phase,Math.PI-s-phase]){
    const x=Math.cos(pitch)*Math.sin(yaw),y=verticalForward*Math.cos(pitch)*Math.cos(yaw)+verticalUp*Math.sin(pitch);
    if(x*dx+y*dy>0)return yaw;
  }
  return 0;
}
