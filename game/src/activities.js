import { distance } from './geometry.js';
import { reward } from './respect.js';
import { createRace } from './races.js';

export function beginActivity(type,player){
  if(!player.car)return 'Get in a vehicle first';
  if(type==='taxi'&&player.car.name!=='ALBA CAB')return 'Find an Alba Cab first';
  if(type==='race')return createRace();
  if(type==='taxi')return {type,label:'TAXI FARE',title:'Waterfront Pickup',route:[{x:11,z:-20},{x:11,z:-75}],stage:0,time:100,payout:420};
  if(type==='delivery')return {type,label:'DELIVERY',title:'Harbour Express',route:[{x:0,z:60},{x:0,z:119}],stage:0,time:110,payout:560};
  return {type,label:'VIGILANTE',title:'Harbour Patrol',route:[{x:-64,z:-60},{x:-64,z:0},{x:0,z:0}],stage:0,time:100,payout:720};
}
export function activityView(job){
  return {...job,contact:'Alba Crossover Radio',target:job.route[job.stage],total:job.route.length,stage:job.stage+1,progress:job.stage*100/job.route.length,objective:`Reach checkpoint ${job.stage+1}`,next:job.stage+1===job.route.length?'Collect payout':'Follow the next marker'};
}
export function tickActivity(job,player,dt,district){
  job.time-=dt;
  if(job.time<=0)return 'Activity timed out';
  if(distance(job.route[job.stage],player)>7||!player.car)return '';
  if(++job.stage<job.route.length)return '';
  reward(player,job.payout,42,district);return `${job.label} complete · $${job.payout}`;
}
