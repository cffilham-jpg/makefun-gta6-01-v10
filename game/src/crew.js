const roster=[
  {name:'Reyes',role:'Driver',ability:'GHOST PLATES',key:'Z',effect:p=>p.ghost=30},
  {name:'Tomás',role:'Mechanic',ability:'PIT STOP',key:'X',effect:p=>{if(!p.car)return false;p.car.condition=100;return true;}},
  {name:'Inés',role:'Lookout',ability:'BIRD’S EYE',key:'C',effect:p=>p.lookout=24}
];
export const crewView = player => roster.map((member,i)=>({...member,wait:Math.ceil(player.cooldowns[i])}));
export function useCrew(player,i){
  if(player.cooldowns[i]>0)return 'Crew channel cooling down';
  if(roster[i].effect(player)===false)return 'Get in a vehicle for Pit Stop';
  player.cooldowns[i]=[65,45,39][i];return roster[i].ability+' active';
}
export function tickCrew(player,dt){
  player.cooldowns=player.cooldowns.map(n=>Math.max(0,n-dt));
  player.ghost=Math.max(0,player.ghost-dt);player.lookout=Math.max(0,player.lookout-dt);
}
