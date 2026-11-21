const stations=[
  {station:'ALBA FM 101.3',track:'Marisol Vega · Neon Tide',notes:[0,7,12,15,12,7,5,3],root:110,step:.235},
  {station:'FARO FM 88.4',track:'Las Boyas · Night Ferry',notes:[0,3,10,12,7,10,3,5],root:130.81,step:.29}
];
export function createRadio(audio){
  let index=0,beat=0,clock=0;
  return {
    next(){index=(index+1)%3;beat=0;clock=0;},
    view(){return stations[index]??{station:'RADIO OFF',track:'Press T to tune'};},
    tick(dt,enabled){
      const song=stations[index];if(!song||!enabled)return;
      clock-=dt;if(clock>0)return;clock+=song.step;
      const interval=song.notes[beat%8];
      audio.tone(song.root*2**(interval/12),.26,.047,'triangle');
      if(beat%2===0)audio.tone(song.root*.5,.25,.059,'sine',0,song.root*.45);
      if(beat%4===0)audio.tone(62,.12,.065,'sine',0,28);
      beat++;
    }
  };
}
