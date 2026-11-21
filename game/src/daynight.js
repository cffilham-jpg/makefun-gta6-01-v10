import { T } from './geometry.js';

export function installLighting(scene) {
  const sky=new T.Mesh(new T.SphereGeometry(490,32,20),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{
    high:{value:new T.Color()},low:{value:new T.Color()},solar:{value:new T.Vector3(.36,.13,-.92).normalize()},day:{value:1}
  },vertexShader:'varying vec3 ray; void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform vec3 high,low,solar; uniform float day; varying vec3 ray; void main(){vec3 d=normalize(ray);vec3 c=mix(low,high,clamp(.09+d.y*1.8,0.,1.)); float r=max(0.,dot(d,solar)); c+=day*vec3(.85,.49,.21)*(pow(r,34.)*.42+pow(r,340.)*.6+smoothstep(.9991,.9995,r)*1.1);gl_FragColor=vec4(c,1.); #include <encodings_fragment>\n}'.replace('; #include',';\n#include')}));
  scene.add(sky);
  const ambient=new T.HemisphereLight(0xd9eaff,0xb4836f,1.38);scene.add(ambient);
  const sun=new T.DirectionalLight(0xffd2a1,2.05);sun.position.set(26,31,-35);sun.castShadow=true;
  Object.assign(sun.shadow.camera,{left:-34,right:34,top:34,bottom:-34,near:1,far:115});
  sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-.0007;sun.shadow.normalBias=.033;
  scene.add(sun,sun.target);scene.fog=new T.FogExp2(0xf3be99,.011);
  return {sky,ambient,sun,last:''};
}

export function setLight(scene,light,city,period,player) {
  const values={golden:[0x39789a,0xe99e71,0xffb678,1.62,.84,.010],day:[0x448fbc,0xc7e4df,0xe5f1ff,1.82,1.09,.007],night:[0x030714,0x111533,0x7588ff,.38,.39,.011]};
  const [high,low,color,strength,fill,fog]=values[period];
  light.sky.position.set(player.x,0,player.z);
  light.sun.position.set(player.x+22,26,player.z-31);light.sun.target.position.set(player.x,0,player.z-12);
  if(light.last===period)return;
  light.last=period;
  light.sky.material.uniforms.high.value.setHex(high);light.sky.material.uniforms.low.value.setHex(low);
  light.sky.material.uniforms.day.value=period==='night'?0:1;
  scene.fog.color.setHex(low);scene.fog.density=fog;
  light.sun.intensity=strength;light.sun.color.setHex(color);light.ambient.intensity=fill;
  city.windows.forEach((pane,i)=>{
    if(i%4===0)return;
    if(!pane.userData.lit){pane.userData.lit=pane.material.clone();pane.userData.lit.color.setHex(i%3?0xf1b77c:0x7ca5f3);pane.userData.lit.emissive.copy(pane.userData.lit.color);}
    pane.userData.base ||= pane.material;pane.material=period==='night'?pane.userData.lit:pane.userData.base;
  });
}
