import { makeHelicopter, flySearchlight } from './helicopter.js';
import { makeRoadblock } from './roadblocks.js';
import { makeCar, syncVehicle } from './vehicles.js';
import { distance, clamp } from './geometry.js';

const callsigns=['GARZA-7','GAVIOTA-12','MANTA-4','MIRLO-8','TIBURÓN-2','ORCA-9'];
export function createPursuit(scene) {
  const air=makeHelicopter(scene);
  const barrier=makeRoadblock(scene,3,-52);
  const ground=callsigns.map((name,i)=>({...makeCar(scene,name,i%2?0x375678:0x264050,0,0,true),tactic:'CLOSING IN',active:false}));
  return {air,barrier,ground,units:[air,...ground.slice(0,2),barrier,...ground.slice(2)],clear:0};
}

export function advancePursuit(pursuit,player,time,dt,hero=false) {
  const {ground,air,barrier}=pursuit;
  air.root.visible=air.beam.visible=player.wanted>=4;
  barrier.root.visible=player.wanted>=3;
  if(air.root.visible)flySearchlight(air,player,time,dt);
  let seen=air.root.visible;
  ground.forEach((car,i)=>{
    car.root.visible=i<Math.min(ground.length,player.wanted*2);
    if(!car.root.visible){car.active=false;return;}
    if(!car.active){car.x=player.x+[-3.8,4.7,-7.4,3,6,-5][i];car.z=player.z+[3.9,6.3,-14,-28,39,52][i];car.active=true;}
    const gap=distance(car,player);
    car.tactic=gap<10?'RAMMING':i%3===2?'FLANKING':'CLOSING IN';
    seen ||= gap<35;
    if(!hero){
      const dx=player.x-car.x,dz=player.z-car.z;
      car.heading=Math.atan2(-dx,-dz);
      const speed=gap>7?Math.min(22,gap*.8):0;
      car.x-=Math.sin(car.heading)*speed*dt;
      car.z-=Math.cos(car.heading)*speed*dt;
      if(gap<8&&player.ghost<=0){
        if(player.car)player.car.condition=Math.max(15,player.car.condition-dt*2);
        else if(player.armour>0)player.armour=Math.max(0,player.armour-dt*2.6);
        else player.health=Math.max(0,player.health-dt*2.6);
      }
    }
    car.lights[0].visible=Math.floor(time*7+i)%2===0;
    car.lights[1].visible=!car.lights[0].visible;
    syncVehicle(car);
  });
  if(!hero){
    pursuit.clear=(seen&&player.ghost<=0)?0:pursuit.clear+dt;
    if(player.wanted && pursuit.clear>9){player.wanted=clamp(player.wanted-1,0,5);pursuit.clear=0;}
  }
  return !player.wanted?'PATROL BANDS CLEAR':player.ghost>0?'GHOST PLATES · SIGNAL LOST':seen?'IN SIGHT · SEARCH ZONE ACTIVE':'OUT OF SIGHT · LOSE THE TAIL';
}
