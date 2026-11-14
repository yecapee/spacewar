// Shared enemy adapter used by the campaign and the isolated encounter.
import {createSurvivalController} from './survival-controller.mjs';
import {updateSurvivalVisual,drawSurvivalVisual} from './spacewar-visual.mjs';
export {prepareCreature} from './spacewar-visual.mjs';
export {createSurvivalAttack} from './spacewar-attack.mjs';
export function createCreatureEnemy(enemy,options){
 const k=createSurvivalController(enemy,options);k.updateVisual=updateSurvivalVisual;k.draw=drawSurvivalVisual;
 const update=k.update;k.update=ship=>{k.targetPosition=ship.position;update(ship);};return k;
}
