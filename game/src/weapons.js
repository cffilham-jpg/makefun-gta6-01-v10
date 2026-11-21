export const armory=[
  {name:'REEF-9',rounds:54,rp:0,price:0,range:23,rate:.29},
  {name:'MARLIN',rounds:92,rp:50,price:0,range:27,rate:.15},
  {name:'TIDEBREAK',rounds:24,rp:120,price:850,range:17,rate:.65},
  {name:'KESTREL',rounds:84,rp:360,price:1850,range:44,rate:.23},
  {name:'BREAKER',rounds:32,rp:250,price:3800,range:31,rate:.49},
  {name:'FARO MK II',rounds:16,rp:710,price:5900,range:60,rate:.8}
];
export function weaponView(player){return armory.map((w,i)=>({...w,locked:player.ammo[i]===null,price:player.rp>=w.rp?w.price:0,ammo:player.ammo[i],active:i===player.slot}));}
export function buyWeapon(player,i){
  const w=armory[i];
  if(player.rp<w.rp)return 'Requires '+w.rp+' RP';
  const price=player.ammo[i]===null?w.price:120;
  if(player.cash<price)return 'Insufficient cash';
  player.cash-=price;player.ammo[i]=w.rounds;return w.name+' stocked';
}
