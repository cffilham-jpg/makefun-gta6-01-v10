import { armory } from './weapons.js';
import { makePerson, posePerson } from './pedestrians.js';
import { distance } from './geometry.js';
import { makeFlash } from './effects.js';

export function spawnHostiles(scene){
  return Array.from({length:4},(_,i)=>({...makePerson(scene,-6+i*3,-12-i*3,0x414c66,true),hp:2}));
}
export function tickHostiles(hostiles,player,time,dt){
  hostiles.forEach((actor,i)=>{
    actor.root.visible=actor.hp>0&&player.wanted>=2&&!player.car;
    if(!actor.root.visible)return;
    const gap=distance(actor,player);
    actor.heading=Math.atan2(actor.x-player.x,actor.z-player.z);
    if(gap>8&&gap<48){actor.x-=Math.sin(actor.heading)*dt*2.2;actor.z-=Math.cos(actor.heading)*dt*2.2;}
    if(gap<18&&!player.person.crouch&&player.ghost<=0){
      if(player.armour>0)player.armour=Math.max(0,player.armour-dt*.8);
      else player.health=Math.max(0,player.health-dt*.8);
    }
    posePerson(actor,time+i,gap>8&&gap<48);
  });
}
export function fireWeapon(player,hostiles,effects,sound){
  if(player.car||player.fireDelay>0||!(player.ammo[player.slot]>0))return;
  const weapon=armory[player.slot];player.ammo[player.slot]--;player.fireDelay=weapon.rate;
  player.wanted=Math.max(2,player.wanted);
  makeFlash(effects,player.x,player.z,player.heading);sound();
  const target=hostiles.filter(actor=>actor.hp>0&&distance(actor,player)<weapon.range).filter(actor=>{
    const direction=Math.atan2(player.x-actor.x,player.z-actor.z)-player.heading;
    return Math.cos(direction)>.963;
  }).sort((a,b)=>distance(a,player)-distance(b,player))[0];
  if(target){target.hp--;if(!target.hp){player.rp+=12;player.wanted=Math.min(5,player.wanted+1);}}
}
