export function respect(rp){
  const levels=[[0,'ROOKIE'],[120,'RUNNER'],[250,'HUSTLER'],[550,'FIXER'],[1100,'ROYALTY']];
  const i=levels.findLastIndex(level=>rp>=level[0]);
  const next=levels[i+1]?.[0] ?? 1800;
  return {name:levels[i][1],next,percent:(rp-levels[i][0])*100/(next-levels[i][0])};
}
export function reward(player,cash,rp,district){
  player.cash+=cash; player.rp+=rp;
  player.standing[district]=Math.min(100,(player.standing[district]??50)+5);
}
