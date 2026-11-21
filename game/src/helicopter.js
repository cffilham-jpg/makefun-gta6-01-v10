import { T, box, cylinder } from './geometry.js';

export function makeHelicopter(scene) {
  const root=new T.Group(); scene.add(root);
  const hull=new T.Mesh(new T.SphereGeometry(1,16,8),new T.MeshStandardMaterial({color:0x253e53,roughness:.35}));
  hull.scale.set(1.32,1.2,2.8); root.add(hull);
  const canopy=new T.Mesh(new T.SphereGeometry(1,14,8),new T.MeshStandardMaterial({color:0x437f93,roughness:.14}));
  canopy.scale.set(1.18,.82,1.42); canopy.position.set(0,.2,-1.43); root.add(canopy);
  box(root,0x243048,0,.43,3.78,.41,.38,4.5);
  box(root,0x344963,0,.98,5.66,.17,1.44,.66);
  box(root,0xb6d8d7,0,.17,3.75,.43,.13,3.3);
  for(const x of [-1.03,1.03]){
    box(root,0x182831,x,-1.17,0,.12,.12,3.8);
    for(const z of [-.92,1.03])box(root,0x182831,x*.83,-.9,z,.10,.60,.11);
    box(root,x<0?0xfc4554:0x66ffb6,x,.13,1.1,.22,.16,.28,true);
  }
  cylinder(root,0x263246,0,1.44,0,.10,.12,.7);
  const rotor=new T.Group(); rotor.position.y=1.74; root.add(rotor);
  box(rotor,0x19283c,0,0,0,10.8,.055,.26);
  box(rotor,0x19283c,0,0,0,.26,.055,10.8);
  const beam=new T.Mesh(new T.ConeGeometry(2.68,15,36,1,true),new T.MeshBasicMaterial({color:0xffdd8c,transparent:true,opacity:.26,depthTest:false,depthWrite:false,side:T.DoubleSide,toneMapped:false}));
  beam.renderOrder=5;
  scene.add(beam);
  return {name:'HALCÓN-1',tactic:'SPOTLIGHT',air:true,root,beam,rotor,x:-1,z:-18,y:12};
}

export function flySearchlight(unit,player,phase,dt) {
  const anchorX=player.x+Math.cos(phase*.4)*13;
  const anchorZ=player.z-17+Math.sin(phase*.4)*7;
  const blend=Math.min(1,dt*.7);
  unit.x+=(anchorX-unit.x)*blend;
  unit.z+=(anchorZ-unit.z)*blend;
  unit.root.position.set(unit.x,unit.y,unit.z);
  unit.root.rotation.set(.11,phase*.16,-.15);
  unit.rotor.rotation.y=phase*21+.42;
  const tip=new T.Vector3(unit.x,unit.y-1,unit.z);
  const floor=new T.Vector3(player.x,0,player.z-1);
  const direction=tip.clone().sub(floor);
  unit.beam.position.copy(tip.clone().lerp(floor,.5));
  unit.beam.scale.y=direction.length()/15;
  unit.beam.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());
}
