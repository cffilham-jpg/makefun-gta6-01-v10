import { T, box, cylinder, sign, seeded } from './geometry.js';
import { batchScenery } from './scenery.js';

export const map = {avenues:[-192,-128,-64,0], streets:[-240,-180,-120,-60,0,60,120], coast:26};
const districts = [
  ['Alba Marina','Strand Boulevard','MAR',0,0],['Casco Viejo','Mercado Avenue','CAS',-64,-60],
  ['El Faro','Beacon Road','FAR',0,-240],['Las Torres','Cristal Avenue','TOR',-128,-120],
  ['Colina Verde','Jardín Drive','COL',-192,60],['Puerto Norte','Crane Row','PUE',-64,120]
];
export function districtAt(x,z,standing) {
  const i=districts.reduce((best,d,i)=>Math.hypot(x-d[3],z-d[4])<Math.hypot(x-districts[best][3],z-districts[best][4])?i:best,0);
  const [name,street,code]=districts[i];
  const score=standing[i] ?? 50;
  return {name,street,code,i,standing:score,status:score>=75?'TRUSTED':score<35?'HOSTILE':'NEUTRAL'};
}

function palm(scene,x,z,phase) {
  const trunk=cylinder(scene,0x756049,x,3,z,.14,.35,6,8); trunk.rotation.z=.09;
  for(let i=0;i<8;i++){
    const yaw=i*Math.PI/4+phase;
    const leaf=new T.Mesh(new T.SphereGeometry(1,6,3),new T.MeshStandardMaterial({color:i%2?0x267a62:0x529657}));
    leaf.position.set(x+Math.sin(yaw)*1.05-.24,6+Math.sin(i)*.2,z+Math.cos(yaw)*1.05);
    leaf.rotation.y=yaw; leaf.rotation.x=.26; leaf.scale.set(.43,.18,1.8); scene.add(leaf);
  }
}

export function buildCity(scene) {
  const random=seeded(95021);
  const blocks=[];
  const windows=[];
  const land=box(scene,0xbda986,-98,-.24,-59,248,.45,425); land.receiveShadow=true;
  const water=box(scene,0x226f8f,134,-.42,-125,216,.18,650);
  const asphalt=[];
  for(const x of map.avenues){
    const road=box(scene,0x343a46,x,.014,-60,19,.06,420); asphalt.push(road); road.receiveShadow=true;
    for(let z=-267;z<=145;z+=6){
      if(map.streets.some(row=>Math.abs(row-z)<10))continue;
      box(scene,0xf0cb7c,x,.055,z,.14,.014,3.1);
      for(const side of [-1,1])box(scene,0xdcc8a3,x+side*9.12,.055,z,.12,.013,6);
    }
  }
  for(const z of map.streets){
    const road=box(scene,0x343a46,-99,.023,z,249,.052,16); road.receiveShadow=true; asphalt.push(road);
    for(let x=-215;x<21;x+=7){ if(map.avenues.every(col=>Math.abs(col-x)>11))box(scene,0xe0d2b3,x,.06,z,3,.014,.13); }
    if(z!==0)for(let x=-8;x<9;x+=1.45)box(scene,0xdad5c1,x,.06,z+10,.62,.015,2.8);
  }
  box(scene,0xcfad86,18,.12,-63,14.5,.27,411).receiveShadow=true;
  for(let z=-257;z<145;z+=9){
    box(scene,0x374b57,24.7,.7,z,.2,1.35,.2);
    box(scene,0x566873,24.7,1.24,z+4.5,.13,.12,9);
    if(z%2) palm(scene,13.2,z,random());
  }
  for(let x=-214;x<=-12;x+=18){
    for(let z=-260;z<144;z+=12){
      if(map.avenues.some(col=>Math.abs(col-x)<14) || map.streets.some(row=>Math.abs(row-z)<14))continue;
      const tower=x<-80&&z<-66&&z>-175;
      const h=tower?13+random()*33:4+random()*9;
      const color=(tower?[0x486b83,0x5b8790,0x718aa0]:[0xe3b593,0xb66e65,0x74a9ac,0xce9b6d,0x9cb1a7])[Math.floor(random()*(tower?3:5))];
      const width=12+random()*2,depth=9+random()*2;
      const shell=box(scene,color,x,h/2,z,width,h,depth); shell.castShadow=true; shell.receiveShadow=true;
      box(scene,tower?0x233a51:0xe9c29e,x,h+.28,z,width+.46,.57,depth+.4);
      box(scene,color,x+1,h+.8,z-.8,width*.50,1.5,depth*.51);
      blocks.push({x,z,width,depth});
      for(let y=2;y<h-.8;y+=2.4){
        for(let dz=-3.4;dz<=3.5;dz+=3.4){
          windows.push(box(scene,0x273a52,x+width/2+.03,y,z+dz,.07,1.25,1.8));
          windows.push(box(scene,0x273a52,x+dz,y,z+depth/2+.03,1.8,1.25,.07));
        }
      }
      if(x===-16 || x===-34){box(scene,0x297475,x+width/2+.64,2.2,z,1.45,.26,depth*.78);}
    }
  }
  for(const [z,words,tint] of [[-17,'CLUB MAREA','#ff78b0'],[-42,'HOTEL ALBA','#78ffdf'],[-79,'CAFÉ LUCERO','#ffbe79'],[19,'CINE LUNA','#bca9ff']]){
    sign(scene,words,-10.8,3.3,z,8,2,Math.PI/2,tint);
    sign(scene,words,-8.95,4.45,z+3.9,5.7,1.46,.08,tint);
    box(scene,0xeab6a0,-12.2,1.37,z,3,2.7,8).castShadow=true;
  }
  sign(scene,'ALBA MARINA',14,4.1,-26,7.5,1.35,0,'#ffc999');
  for(const x of [10.4,17.6]) box(scene,0x466274,x,1.95,-26,.17,3.9,.16);
  const shimmer=seeded(9252);
  for(let i=0;i<145;i++){
    const x=26+shimmer()*51,z=-220+shimmer()*330;
    box(scene,i%3===0?0x5598a2:0x418099,x,-.317,z,1+shimmer()*4.2,.009,.08+shimmer()*.18,i%12===0);
  }
  for(let z=-260;z<151;z+=21){
    palm(scene,-10.7,z,random());
    const pole=box(scene,0x253849,10.65,3,z+3,.13,6,.13); pole.castShadow=true;
    box(scene,0xb3a58b,9.75,5.9,z+3,2,.14,.13);
    box(scene,0xffdcac,8.9,5.8,z+3,.5,.14,.27,true);
  }
  for(let z=-84;z<40;z+=18){
    box(scene,0x977c67,33,0,z,16,.35,1.5);
    const hull=box(scene,0xf2e4d5,35,.22,z+3,3,.85,6.7); hull.rotation.y=.09;
    box(scene,0x196378,35,.71,z+3.7,2.6,.33,2.6);
    box(scene,0xf0dbc4,35,2.35,z+3,.07,4.05,.07);
    const sail=new T.Mesh(new T.ConeGeometry(1.38,3.45,3),new T.MeshStandardMaterial({color:0xf5cfa0,side:T.DoubleSide}));
    sail.position.set(35.25,2.75,z+3); sail.scale.x=.13; scene.add(sail);
  }
  cylinder(scene,0xf1dbb4,16,7,-244,1.65,2.7,14,20);
  cylinder(scene,0xa44b45,16,12.5,-244,1.8,1.8,2.3,20);
  cylinder(scene,0xffd290,16,14.6,-244,1.65,1.65,1.5,20);
  cylinder(scene,0x324352,16,15.8,-244,0,2.2,1.2,20);
  for(let i=0;i<10;i++)box(scene,[0x973d43,0x598e9c,0xc0874e][i%3],16,1.3+Math.floor(i/5)*2.6,91+(i%5)*7,5,2.6,6);
  for(const z of [92,115]){
    box(scene,0xf0a743,22,8,z,1.2,16,1.2);
    box(scene,0xf0a743,29,15.5,z,15,1,1.3);
    box(scene,0x303847,36,12,z,.08,7,.08);
  }
  batchScenery(scene,new Set([water,...windows,...asphalt]));
  return {blocks,windows,water,asphalt};
}

export function roadCollision(city,x,z,r=.55) {
  return x>24-r || x<-219+r || z<-266+r || z>146-r || city.blocks.some(b=>Math.abs(x-b.x)<b.width/2+r&&Math.abs(z-b.z)<b.depth/2+r);
}
