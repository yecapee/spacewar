// Optional isolated scenario. Normal Spacewar never registers one.
let encounter=null;
export function registerEncounter(value){encounter=value;}
export function getEncounter(){return encounter;}
