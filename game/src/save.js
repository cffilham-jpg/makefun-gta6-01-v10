const slot='puerto-alba-autosave-v1';
export function loadProgress(){
  try{const record=JSON.parse(localStorage.getItem(slot));return record?.version===1?record:null;}catch{return null;}
}
export function saveProgress(player){
  const {x,z,cash,rp,standing,done,owned,ammo,slot:weapon}=player;
  try{localStorage.setItem(slot,JSON.stringify({version:1,x,z,cash,rp,standing,done,owned,ammo,slot:weapon}));return 'Progress saved';}
  catch{return 'Unable to write the save slot';}
}
