import { T, seeded } from './geometry.js';

export function installWeather(scene){
  const random=seeded(42), points=new Float32Array(2400);
  for(let i=0;i<points.length;i+=6){points[i]=random()*58-29;points[i+1]=random()*24;points[i+2]=random()*70-35;}
  const shape=new T.BufferGeometry();shape.setAttribute('position',new T.BufferAttribute(points,3));
  const streaks=new T.LineSegments(shape,new T.LineBasicMaterial({color:0x9ecaf8,transparent:true,opacity:.36,depthWrite:false}));
  scene.add(streaks);
  const highlights=new T.Group();scene.add(highlights);
  for(const [z,c] of [[-17,0xff318d],[-42,0x2effd9],[-79,0xffbc60],[19,0xa779ff]]){
    for(let i=0;i<21;i++){
      const material=new T.MeshBasicMaterial({color:c,transparent:true,opacity:random()*.18,depthWrite:false,blending:T.AdditiveBlending});
      const patch=new T.Mesh(new T.PlaneGeometry(.8+random()*3,.02+random()*.12),material);
      patch.rotation.x=-Math.PI/2;patch.position.set(-6+random()*7,.064,z+(random()-.5)*13);highlights.add(patch);
    }
    const neon=new T.PointLight(c,1.95,19,2);neon.position.set(-8,4,z);highlights.add(neon);
  }
  return {streaks,points,highlights};
}

export function updateWeather(weather,raining,player,dt){
  weather.streaks.visible=weather.highlights.visible=raining;
  if(!raining)return;
  weather.streaks.position.set(player.x,0,player.z-13);
  const p=weather.points;
  for(let i=0;i<p.length;i+=6){p[i+1]=(p[i+1]-dt*22+24)%24;p[i+3]=p[i]+.10;p[i+4]=p[i+1]+.53;p[i+5]=p[i+2]+.13;}
  weather.streaks.geometry.attributes.position.needsUpdate=true;
}
