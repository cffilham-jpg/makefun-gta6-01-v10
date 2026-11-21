import { T } from './geometry.js';

// Preserve lighting and shadow flags while combining the city's repeated geometry.
export function batchScenery(scene, movable) {
  const groups=new Map();
  for(const item of scene.children){
    if(!item.isMesh||movable.has(item)||item.material.isMeshBasicMaterial)continue;
    const key=[item.geometry.id,item.material.id,item.castShadow,item.receiveShadow].join('/');
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(item);
  }
  for(const group of groups.values()){
    if(group.length<5)continue;
    const [sample]=group;
    const instances=new T.InstancedMesh(sample.geometry,sample.material,group.length);
    instances.castShadow=sample.castShadow;instances.receiveShadow=sample.receiveShadow;
    group.forEach((item,index)=>{item.updateMatrix();instances.setMatrixAt(index,item.matrix);});
    scene.remove(...group);scene.add(instances);
  }
}
