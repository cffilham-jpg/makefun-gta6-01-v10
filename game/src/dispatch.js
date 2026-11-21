export function dispatchFeed(units, player) {
  return units.filter(unit=>unit.root.visible).map(unit=>({
    name:unit.name,tactic:unit.tactic,x:unit.x,z:unit.z,air:unit.air,
    distance:Math.round(Math.hypot(unit.x-player.x,unit.z-player.z,unit.air?unit.y:0))
  }));
}
