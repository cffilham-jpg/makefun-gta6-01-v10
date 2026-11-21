import { T, box, seeded } from './geometry.js';

export function makePerson(scene,x,z,jacket,uniform=false) {
  const root=new T.Group();root.position.set(x,0,z);scene.add(root);
  const torso=box(root,jacket,0,1.14,0,.47,.61,.3); torso.castShadow=true;
  const head=new T.Mesh(new T.SphereGeometry(.16,10,7),new T.MeshStandardMaterial({color:0xc78b67}));
  head.position.set(0,1.63,0);root.add(head);
  box(root,uniform?0x16263b:0x352733,0,1.74,.02,.298,.12,.28);
  if(uniform)box(root,0x52637c,0,1.22,-.153,.31,.28,.05);
  const limbs=[];
  for(const side of [-1,1]){
    const limb=new T.Group(); limb.position.set(side*.116,.9,0);root.add(limb);
    box(limb,0x283747,0,-.28,0,.16,.62,.18);
    box(limb,0x162537,0,-.56,-.038,.18,.13,.28);
    limbs.push(limb);
    const arm=box(root,jacket,side*.277,1.15,-.1,.14,.43,.15);arm.rotation.x=.34;
    box(root,0xc78b67,side*.277,.92,-.19,.135,.13,.14);
  }
  return {root,limbs,x,z,heading:0,uniform};
}

export function posePerson(person,time,walking) {
  person.root.position.set(person.x,person.crouch?-.23:0,person.z);
  person.root.rotation.y=person.heading;
  person.limbs.forEach((leg,i)=>leg.rotation.x=walking?Math.sin(time*10+i*Math.PI)*.62:person.crouch?-.24:0);
}

export function populateWalks(scene) {
  const r=seeded(7366);
  return Array.from({length:38},(_,i)=>{
    const x=(i%2===0?10.2:-10.0)-64*Math.floor(i/14)+(r()-.5)*.5;
    const z=4-i%14*6+r()*3;
    const person=makePerson(scene,x,z,[0xf1c46f,0xe86e72,0x62beab,0xf2dec2,0x6ca5cc][i%5]);
    person.heading=i%3?0:Math.PI; return person;
  });
}

export function advanceWalks(walkers,time,dt) {
  walkers.forEach((person,i)=>{
    person.z-=Math.cos(person.heading)*dt*(.7+(i%5)*.13);
    if(person.z<-120||person.z>96)person.heading+=Math.PI;
    posePerson(person,time+i,true);
  });
}
