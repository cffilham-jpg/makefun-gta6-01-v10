export function drawMinimap(canvas, { map, player, police, mission, district }) {
  const ctx = canvas.getContext('2d');
  const center = canvas.width / 2;
  const scale = 1.07;
  const px = x => center + (x-player.x)*scale;
  const py = z => center + (z-player.z)*scale;
  ctx.fillStyle = '#153842';
  ctx.fillRect(0,0,230,230);
  ctx.fillStyle = '#155271';
  ctx.fillRect(px(map.coast),0,230,230);
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#657c84';
  ctx.beginPath();
  for (const x of map.avenues) { ctx.moveTo(px(x),0); ctx.lineTo(px(x),230); }
  for (const z of map.streets) { ctx.moveTo(0,py(z)); ctx.lineTo(px(map.coast),py(z)); }
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#b9b7a0';
  ctx.stroke();
  const dot = (x,y,r,color) => { ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); };
  if (player.wanted) {
    ctx.strokeStyle='#ff746d'; ctx.fillStyle='#ff746d27'; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.arc(center,center,25+player.wanted*9,0,7); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  }
  for (const unit of police) dot(px(unit.x),py(unit.z),4,unit.air?'#ffcf70':'#ff797a');
  if (mission.target) {
    const dx=px(mission.target.x)-center, dy=py(mission.target.z)-center;
    const clamp=Math.max(1,Math.hypot(dx,dy)/94);
    dot(center+dx/clamp,center+dy/clamp,7,'#72ffe1');
  }
  ctx.save(); ctx.translate(center,center); ctx.rotate(-player.heading);
  ctx.fillStyle='#fff9e9'; ctx.beginPath(); ctx.moveTo(0,-11); ctx.lineTo(7,8); ctx.lineTo(0,4); ctx.lineTo(-7,8); ctx.fill(); ctx.restore();
  ctx.fillStyle='#fff5de'; ctx.textAlign='center'; ctx.font='bold 19px system-ui'; ctx.fillText('N',center,23);
  ctx.font='bold 14px system-ui'; ctx.fillText(district.code,center,209);
}
