export function attachInput() {
  const held=new Set(); const pressed=new Set();
  const input={held,pressed,fire:false,motion:0,take:key=>pressed.delete(key)};
  window.addEventListener('keydown',event=>{
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(event.code))event.preventDefault();
    held.add(event.code); if(!event.repeat)pressed.add(event.code);
  });
  window.addEventListener('keyup',event=>held.delete(event.code));
  window.addEventListener('blur',()=>{held.clear();input.fire=false;});
  document.querySelector('#world').addEventListener('pointerdown',()=>input.fire=true);
  window.addEventListener('pointerup',()=>input.fire=false);
  window.addEventListener('mousemove',event=>{if(input.fire||event.buttons===2)input.motion+=event.movementX;});
  window.addEventListener('contextmenu',event=>event.preventDefault());
  return input;
}
export function directions(held) {
  const has=(a,b)=>Number(held.has(a)||held.has(b));
  return {forward:has('KeyW','ArrowUp'),back:has('KeyS','ArrowDown'),left:has('KeyA','ArrowLeft'),right:has('KeyD','ArrowRight'),brake:held.has('Space')};
}
