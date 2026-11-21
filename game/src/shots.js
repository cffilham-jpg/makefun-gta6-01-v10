export const shots={
  chase:{x:0,z:-6,chapter:4,stage:1,time:112,clock:18.3,wanted:5,health:92,armour:74,speed:31.4,camera:[.15,3.08,8.2],look:[0,1.42,-16]},
  shootout:{x:-6,z:-9,chapter:3,stage:1,time:84,clock:20.6,wanted:3,health:69,armour:43,onFoot:true,camera:[2.25,1.73,3.2],look:[.8,1.27,-13]},
  night:{x:2,z:-9,chapter:7,stage:0,time:131,clock:22,wanted:1,health:100,armour:62,speed:14.2,rain:true,camera:[-1.2,4.45,9.4],look:[5.3,1.67,-18]},
  progress:{x:0,z:-6,chapter:4,stage:1,time:112,clock:18.3,wanted:0,health:100,armour:80,speed:0}
};
export function stageShot(game,shot){
  const {p,falcon,fleet,pursuit,hostiles,box,scene}=game;
  p.x=shot.x;p.z=shot.z;p.wanted=shot.wanted;p.health=shot.health;p.armour=shot.armour;
  p.rp=290;p.cash=8640;p.done=[0,1,2,3];p.owned=['FALCON GT','ORCA 900'];p.standing[0]=58;p.ammo=[54,92,24,null,null,null];
  falcon.x=p.x;falcon.z=p.z;falcon.speed=shot.speed||0;falcon.condition=shot.rain?82:96;
  p.car=shot.onFoot?null:falcon;
  if(shot.onFoot){
    falcon.x=-6.4;falcon.z=3;
    box(scene,0x587982,-6.9,.48,-10.55,1.4,.94,.85).castShadow=true;
    fleet.bike.x=-2.35;fleet.bike.z=-13;fleet.bike.heading=.56;
    hostiles.forEach((actor,i)=>{actor.x=-5+i*2.1;actor.z=-14-i*2;actor.heading=Math.PI;});
    p.person.crouch=true;
  }
  pursuit.air.x=p.x+1.7;pursuit.air.z=p.z-14;pursuit.air.y=7.4;
  if(shot.wanted===5)pursuit.ground.slice(0,2).forEach((unit,i)=>{
    unit.x=p.x+(i===0?-3.24:3.4);
    unit.z=p.z+1.25+i*.48;
    unit.heading=i===0?-.19:.18;
    unit.active=true;
  });
  pursuit.barrier.x=0.4;pursuit.barrier.z=p.z-23;pursuit.barrier.root.position.set(.4,0,p.z-23);
  fleet.traffic[0].z=-19;fleet.traffic[1].z=-25;
}
