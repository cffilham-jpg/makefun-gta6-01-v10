import { T, box } from './geometry.js';

export function makeRoadblock(scene,x,z) {
  const root=new T.Group(); root.position.set(x,0,z); scene.add(root);
  box(root,0xfaaf51,0,.62,0,4.8,.43,.23);
  for(let i=-2;i<=2;i++)box(root,0x333740,i*.87,.62,.123,.41,.39,.028).rotation.z=.29;
  for(const i of [-1,1]){
    box(root,0x383747,i*1.88,.31,0,.2,.62,.52);
    box(root,0xffa132,i*1.88,.93,0,.23,.22,.22,true);
  }
  return {root,name:'PELÍCANO-3',tactic:'ROADBLOCK',x,z,barrier:true};
}
