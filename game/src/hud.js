import { drawMinimap } from './minimap.js';

const money = n => '$' + Math.round(n).toLocaleString('en-US');
const meter = (value, tone = '') => `<span class="bar ${tone}"><i style="width:${Math.max(0,Math.min(value,100))}%"></i></span>`;
const cell = (label, value) => `<div class="spread"><span>${label}</span><b>${value}</b></div>`;
const set = (id, html) => {
  const element = document.getElementById(id);
  if (element.content !== html) { element.content = html; element.innerHTML = html; }
};

export function mountHUD() {
  document.querySelector('#hud').innerHTML = `<div class="worldtag">PUERTO ALBA</div>
    <div class="left"><section class="panel" id="mission"></section><section class="panel" id="vitals"></section></div>
    <div class="right"><section class="panel" id="wanted"></section><section class="panel" id="dispatch"></section><section class="panel" id="crew"></section></div>
    <div class="mapbox"><canvas id="radar" width="230" height="230" aria-label="District map"></canvas><section class="panel" id="district"></section></div>
    <section class="panel vehicle" id="vehicle"></section><section class="panel dialogue" id="dialogue"></section>
    <div class="prompt" id="prompt" hidden></div><div class="weapons" id="weapons"></div>`;
}

export function renderHUD(view) {
  const { mission, player, rank, police, district, crew, vehicle, radio, dialogue, weapons } = view;
  const minutes = Math.floor(mission.time / 60);
  const seconds = Math.floor(mission.time % 60).toString().padStart(2,'0');
  set('mission', `<div class="spread eyebrow"><span>${mission.label}</span><time>${minutes}:${seconds}</time></div>
    <h2>${mission.title}</h2><div class="warm">${mission.contact}</div><p class="line">${mission.objective}</p>
    <div class="line">STAGE ${mission.stage}/${mission.total}${meter(mission.progress)}</div><p class="muted">NEXT · ${mission.next}</p>`);
  set('vitals', `${cell('HEALTH', Math.ceil(player.health)+'%')}${meter(player.health,'red')}
    ${cell('ARMOUR', Math.ceil(player.armour)+'%')}${meter(player.armour)}
    <div class="eyebrow line">${rank.name} · ${player.rp}/${rank.next} RP</div>${meter(rank.percent,'amber')}`);
  set('wanted', `<div class="spread"><b class="cash">${money(player.cash)}</b><b class="stars">${'★'.repeat(player.wanted)}${'☆'.repeat(5-player.wanted)}</b></div><div>${view.detection}</div>`);
  const rows = police.slice(0,5).map(unit => `<div class="dispatch-row"><b>${unit.name}</b><span>${unit.tactic}</span><span>${unit.distance} m</span></div>`).join('');
  set('dispatch', `<div class="eyebrow">DISPATCH · ${police.length} UNITS</div>${rows || '<p class="muted line">Patrol bands clear</p>'}${police.length>5 ? `<p class="muted">+${police.length-5} more units</p>` : ''}`);
  set('crew', `<div class="eyebrow">CREW CHANNEL</div>${crew.map(member => `<div class="spread line"><span><b>${member.ability}</b><br><span class="muted">${member.name} · ${member.role}</span></span><b class="warm">${member.wait ? member.wait+'s' : '['+member.key+']'}</b></div>`).join('')}`);
  set('district', `<div class="eyebrow">${district.name}</div><div>${district.street}</div>${meter(district.standing)}<div>${district.status} · ${district.standing}</div>`);
  set('vehicle', `${vehicle ? `<div class="eyebrow">${vehicle.name}</div><div class="spread"><strong>${vehicle.speed}</strong><span>km/h · G${vehicle.gear}</span></div>${cell('CONDITION',vehicle.condition+'%')}${meter(vehicle.condition,'amber')}` : '<div class="eyebrow">ON FOOT</div>'}<div class="line warm">${radio.station}</div><div>${radio.track}</div>`);
  document.querySelector('#dialogue').hidden = !dialogue;
  if (dialogue) set('dialogue', `<img alt="" src="${dialogue.portrait}"><div><div class="eyebrow">${dialogue.name} · ${dialogue.role}</div><p>${dialogue.line}</p></div>`);
  set('weapons', weapons.map((slot,i) => `<div class="panel slot ${slot.active?'active':''}"><b>${i+1} · ${slot.name}</b><small>${slot.locked ? slot.price ? money(slot.price) : 'LOCKED' : slot.ammo+' rounds'}</small></div>`).join(''));
  document.querySelector('#prompt').hidden = !view.prompt;
  set('prompt',view.prompt || '');
  drawMinimap(document.querySelector('#radar'),view);
}
