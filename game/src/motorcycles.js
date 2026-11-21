import { T, box, cylinder } from './geometry.js';

export function makeMotorcycle(scene,x,z) {
  const root=new T.Group(); root.position.set(x,0,z); scene.add(root);
  for(const axle of [-.91,.89]){
    const tire=cylinder(root,0x121924,0,.37,axle,.37,.37,.16,18); tire.rotation.z=Math.PI/2;
    const hub=cylinder(root,0xadb9bd,0,.37,axle,.24,.24,.173,13); hub.rotation.z=Math.PI/2;
  }
  box(root,0x2d333e,0,.63,0,.36,.42,1.2);
  box(root,0x12b6ae,0,1,-.36,.54,.34,.74);
  box(root,0x242137,0,.95,.36,.43,.12,.57);
  box(root,0xff5a64,0,.86,.91,.26,.12,.09,true);
  box(root,0xd7e9e3,0,.97,-.89,.31,.19,.16,true);
  box(root,0x4d6870,0,1.17,-.63,.74,.08,.11);
  return {root,x,z,heading:0,speed:0,condition:100,top:41,radius:.61,bike:true,name:'ORCA 900'};
}
