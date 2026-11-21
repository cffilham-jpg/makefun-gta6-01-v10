import { T, box, seeded } from './geometry.js';

export function makeEffects(scene){
  const flash=new T.Mesh(new T.IcosahedronGeometry(.34,0),new T.MeshBasicMaterial({color:0xffc24f,toneMapped:false}));
  const light=new T.PointLight(0xffa048,2.8,6);
  flash.add(light);flash.visible=false;scene.add(flash);
  const smoke=[];const random=seeded(331);
  for(let i=0;i<8;i++){
    const p=new T.Mesh(new T.IcosahedronGeometry(.16,0),new T.MeshBasicMaterial({color:0xb9bcc9,transparent:true,opacity:.2,depthWrite:false}));
    p.visible=false;scene.add(p);smoke.push(p);
  }
  const checkpoint=new T.Group();scene.add(checkpoint);
  const hoop=new T.Mesh(new T.TorusGeometry(2.75,.1,8,45),new T.MeshBasicMaterial({color:0x64ffd5}));
  checkpoint.add(hoop);hoop.position.y=3;
  box(checkpoint,0x78ffe6,0,2,0,.14,3.5,.14,true);
  return {flash,smoke,checkpoint,random,age:9};
}
export function makeFlash(effects,x,z,heading){
  effects.age=0;effects.flash.position.set(x+.48-Math.sin(heading)*.88,1.26,z-Math.cos(heading)*.88);
  effects.smoke.forEach(p=>{p.position.copy(effects.flash.position);p.position.x+=(effects.random()-.5)*.4;p.position.y+=effects.random()*.55;p.scale.setScalar(1);});
}
export function tickEffects(effects,dt,target){
  effects.age+=dt;effects.flash.visible=effects.age<.08;
  effects.smoke.forEach(p=>{p.visible=effects.age<.65;p.material.opacity=Math.max(0,.31-effects.age*.46);p.position.y+=dt*.57;p.scale.setScalar(1+effects.age*3);});
  effects.checkpoint.visible=Boolean(target);
  if(target)effects.checkpoint.position.set(target.x,0,target.z);
}
