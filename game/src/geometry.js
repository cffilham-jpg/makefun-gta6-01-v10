export const T = window.THREE;
const palette = new Map();
const cube = new T.BoxGeometry(1,1,1);
export function paint(color, glow = false, roughness = .68) {
  const key = `${color}/${glow}/${roughness}`;
  if (!palette.has(key)) palette.set(key, new T.MeshStandardMaterial({color,roughness,emissive:glow?color:0,emissiveIntensity:glow?.82:0}));
  return palette.get(key);
}
export function box(parent, color, x,y,z, w,h,d, emit = false) {
  const mesh = new T.Mesh(cube,paint(color,emit));
  mesh.position.set(x,y,z); mesh.scale.set(w,h,d); parent.add(mesh);
  return mesh;
}
export function cylinder(parent,color,x,y,z,r1,r2,h,sides=12) {
  const mesh = new T.Mesh(new T.CylinderGeometry(r1,r2,h,sides),paint(color));
  mesh.position.set(x,y,z); parent.add(mesh); return mesh;
}
export function sign(parent, words, x,y,z, width,height, face = 0, tint = '#94ffe0') {
  const ink = document.createElement('canvas'); ink.width=512; ink.height=128;
  const ctx=ink.getContext('2d');
  ctx.fillStyle='#11212d'; ctx.fillRect(0,0,512,128);
  ctx.strokeStyle=tint; ctx.lineWidth=5; ctx.strokeRect(7,7,498,114);
  ctx.font='900 65px system-ui'; ctx.textBaseline='middle'; ctx.textAlign='center';
  ctx.fillStyle=tint; ctx.shadowColor=tint; ctx.shadowBlur=15;
  ctx.fillText(words,256,61,478);
  const texture = new T.CanvasTexture(ink); texture.encoding=T.sRGBEncoding;
  const mesh = new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:texture}));
  mesh.position.set(x,y,z); mesh.rotation.y=face; parent.add(mesh);
  return mesh;
}
export function seeded(seed) {
  return () => { seed=(Math.imul(1664525,seed)+1013904223)>>>0; return seed/4294967296; };
}
export const distance = (a,b) => Math.hypot(a.x-b.x,a.z-b.z);
export const angle = (a,b) => Math.atan2(a.x-b.x,a.z-b.z);
export const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
