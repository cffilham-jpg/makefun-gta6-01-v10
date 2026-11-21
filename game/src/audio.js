export function createAudio(){
  let ctx;
  function open(){ctx??=new AudioContext();if(ctx.state==='suspended')ctx.resume();return ctx;}
  addEventListener('keydown',open,{once:true});addEventListener('pointerdown',open,{once:true});
  function tone(hz,duration,volume,type='triangle',offset=0,end=hz){
    if(!ctx||ctx.state!=='running')return;
    const source=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime+offset;
    source.type=type;source.frequency.setValueAtTime(hz,at);source.frequency.exponentialRampToValueAtTime(end,at+duration);
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    source.connect(gain).connect(ctx.destination);source.start(at);source.stop(at+duration+.02);
  }
  return {open,tone,shot:()=>tone(170,.15,.18,'sawtooth',0,28)};
}
