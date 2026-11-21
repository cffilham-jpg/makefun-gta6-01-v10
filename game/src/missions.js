import { distance } from './geometry.js';
import { reward } from './respect.js';

export const chapters=[
  ['Wheelwoman','Reyes','A borrowed car is a promise. Bring it back faster.','Meet Reyes','Test the Falcon','Park by the marina',[[0,-22],[0,-75],[5,-118]]],
  ['The Alba Deal','Marco','The buyers are early. Take the coast road to the slip.','Collect the manifest','Deliver to the pier','Leave the boardwalk',[[-11,-18],[14,-77],[0,-121]]],
  ['Faro Lights','Inés','The lighthouse is our signal. Follow the old road north.','Reach the point','Check the beacon','Return to the hotel',[[0,-220],[14,-242],[0,-43]]],
  ['Roadblock at Midnight','Reyes','There is a checkpoint on Strand. Keep the Falcon moving.','Reach Strand Boulevard','Cross the checkpoint','Meet Reyes in Casco',[[0,-22],[0,-81],[-64,-60]]],
  ['The Long Getaway','Marco','The boat sails in two minutes! Shake that chopper and get to the pier!','Break through the blockade','Reach the marina slip','Lose the patrol',[[0,-30],[14,-67],[0,-121]]],
  ['Dockside Debts','Tomás','A crane operator is waiting. Take the receipt to the docks.','Pick up the receipt','Meet the crane operator','Return to the garage',[[-64,58],[-1,115],[0,2]]],
  ['High Tide Heist','Marco','The tide is turning. Get the freight off the waterfront.','Secure the freight','Cross Casco','Drop the freight',[[14,35],[-64,-59],[-129,-120]]],
  ['Storm Runner','Inés','The storm cut our comms. Find me under the blue lights.','Reach Club Marea','Follow the lights','Reach the beacon',[[0,-19],[0,-80],[14,-241]]],
  ['Causeway Run','Reyes','Every second you buy gives the crew a head start.','Reach the causeway','Cross the city','Circle back to Strand',[[-64,120],[-192,-60],[0,-60]]],
  ['Queen of Alba','Marco','Take the long way home, Lena. This city knows your name.','Gather the crew','Drive to El Faro','Finish at Alba Marina',[[-64,-60],[0,-238],[0,0]]]
];
export function startMission(index,stage=0,time=170){return {index,stage,time,initial:null,done:false,failed:false};}
export function missionView(mission,player){
  const [title,contact,,, , ,route]=chapters[mission.index];
  const coords=route[Math.min(mission.stage,2)];
  const target={x:coords[0],z:coords[1]};
  const progress=100*(mission.stage+(mission.done?0:Math.max(0,1-distance(target,player)/(mission.initial??100))))/3;
  const entry=chapters[mission.index];
  return {label:`JOB ${mission.index+1}/${chapters.length}`,title,contact,stage:Math.min(3,mission.stage+1),total:3,time:Math.max(0,mission.time),progress,
    objective:mission.done?'Job complete':mission.failed?'Time expired · M to retry':entry[3+mission.stage],next:entry[4+mission.stage] instanceof Array?'Collect your payout':entry[4+mission.stage]||'Choose a new job',target:mission.done||mission.failed?null:target};
}
export function tickMission(mission,player,dt,district){
  if(mission.done||mission.failed)return '';
  mission.time-=dt;
  if(mission.time<=0){mission.failed=true;return 'Job failed · M to retry';}
  const target=missionView(mission,player).target;
  const gap=distance(target,player);mission.initial??=Math.max(25,gap);
  if(gap>=6)return '';
  mission.stage++;mission.initial=null;
  if(mission.stage<3){if(mission.index>=3)player.wanted=Math.max(player.wanted,Math.min(5,mission.index-1));return 'Checkpoint reached';}
  mission.done=true;
  if(!player.done.includes(mission.index))player.done.push(mission.index);
  reward(player,850+mission.index*220,65+mission.index*12,district);
  return 'Job complete · cash and respect earned';
}
