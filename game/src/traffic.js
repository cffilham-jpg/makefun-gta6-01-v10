import { makeCar, syncVehicle } from './vehicles.js';
import { makeMotorcycle } from './motorcycles.js';

export function spawnTraffic(scene) {
  const colors=[0xf2bb78,0x87c5bd,0xde7f63,0xd8d5bf,0x705d8b,0x9ea4b8];
  const traffic=Array.from({length:24},(_,i)=>{
    const lane=i%2===0?1:-1;
    const car=makeCar(scene,i%5===0?'ALBA CAB':'PASEO LX',colors[i%colors.length],-64*Math.floor(i/7)+lane*5.7,-4-i%7*26);
    car.heading=lane===1?Math.PI:0; car.speed=8+i%5; syncVehicle(car);
    return car;
  });
  const bike=makeMotorcycle(scene,-5.2,3.5);
  const cab=makeCar(scene,'ALBA CAB',0xffbd48,6,3.5);
  return {traffic,bike,cab,all:[bike,cab,...traffic]};
}

export function moveTraffic(fleet,dt,player) {
  fleet.traffic.forEach(car=>{
    if(car===player.car || car.claimed)return;
    car.z-=Math.cos(car.heading)*car.speed*dt;
    if(car.z<-254)car.z=138;
    if(car.z>140)car.z=-254;
    syncVehicle(car);
  });
}
