import { T, box, cylinder, sign, clamp } from './geometry.js';

export function makeCar(scene, name, color, x, z, police=false) {
  const root=new T.Group(); scene.add(root);
  const body=box(root,color,0,.71,0,2.15,.54,4.66); body.castShadow=true;
  box(root,0x263341,0,.34,0,1.74,.15,3.5);
  box(root,color,0,.96,.13,2.05,.22,4.38);
  box(root,0x172e3d,0,1.22,.31,1.76,.49,2.26);
  box(root,police?0xf1ede2:color,0,1.5,.30,1.64,.13,1.78);
  box(root,0x1b262f,0,.44,2.31,2.11,.16,.14);
  box(root,0x1b262f,0,.47,-2.26,2.09,.2,.13);
  box(root,0x20252e,0,.83,2.335,1.92,.265,.055);
  box(root,0xc2e2de,0,1.07,2.22,1.78,.036,.1);
  for(const side of [-1,1]){
    for(const axle of [-1.47,1.48]){
      const wheel=cylinder(root,0x141824,side*1.06,.42,axle,.43,.43,.34,14); wheel.rotation.z=Math.PI/2;
      const hub=cylinder(root,0xa0abb0,side*1.237,.42,axle,.22,.22,.032,12); hub.rotation.z=Math.PI/2;
    }
    box(root,0xfb3447,side*.68,.852,2.373,.6,.12,.045,true);
    box(root,0xffebba,side*.71,.84,-2.34,.42,.14,.055,true);
    box(root,color,side*1.05,1.16,-.56,.23,.12,.26);
    box(root,0x101f2c,side*1.07,.68,.1,.03,.085,3.06);
  }
  sign(root,police?'ALBA PD':'ALBA • 06',0,.64,2.395,.57,.15,0,'#ffe9bc');
  if(!police){box(root,0x151f2d,0,1.12,2.04,2.04,.10,.26);for(const x of [-.79,.79])box(root,0x141d2b,x,1.04,2.05,.08,.25,.12);}
  const lights=[];
  if(police)for(const [i,c] of [[-1,0xff3075],[1,0x3e9aff]])lights.push(box(root,c,i*.39,1.66,.27,.73,.16,.27,true));
  root.position.set(x,0,z);
  return {root,name,x,z,heading:0,speed:0,condition:100,police,lights,top:37,radius:1.2};
}

export function syncVehicle(car) {
  car.root.position.set(car.x,car.height||0,car.z);
  car.root.rotation.y=car.heading;
}

export function drive(car, control, dt, collision) {
  const throttle=control.forward-control.back;
  car.speed += throttle*(car.bike?22:16)*dt;
  car.speed *= Math.exp(-(control.brake?3.4:throttle?.15:.86)*dt);
  car.speed=clamp(car.speed,-9,car.top*(.55+car.condition*.0045));
  const steer=control.left-control.right;
  car.heading+=steer*Math.sign(car.speed)*Math.min(1,Math.abs(car.speed)/4)*(control.brake?2.9:1.5)*dt;
  const x=car.x-Math.sin(car.heading)*car.speed*dt;
  const z=car.z-Math.cos(car.heading)*car.speed*dt;
  if(collision(x,z,car.radius)){
    car.condition=Math.max(15,car.condition-Math.abs(car.speed)*.43);
    car.speed*=-.19;
  }else{car.x=x;car.z=z;}
  car.height=Math.max(0,(car.height||0)+(car.lift||0)*dt);
  if(car.height>0)car.lift-=11*dt;
  syncVehicle(car);
}

export function readVehicle(car) {
  if(!car)return null;
  const speed=Math.round(Math.abs(car.speed)*3.6);
  return {name:car.name,condition:Math.ceil(car.condition),speed,gear:Math.min(5,1+Math.floor(speed/34))};
}
