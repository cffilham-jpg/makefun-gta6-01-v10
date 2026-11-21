import { chapters } from './missions.js';
import { armory } from './weapons.js';
import { crewView } from './crew.js';
import { respect } from './respect.js';

export function showMenu(type,p,preview,action,saved){
  const el=document.querySelector('#menu');el.hidden=!type;
  if(!type)return;
  const button=(id,label)=>`<button data-action="${id}">${label}</button>`;
  const body=type==='start'?`<div class="eyebrow">A COASTAL CRIME STORY</div><h1>PUERTO <em>ALBA</em></h1><p>Lena Marín has one car, one crew, and a city full of debts.</p><div class="button-row">${button('begin',saved?'Continue story':'Start Wheelwoman')}${button('chapters','Chapter select')}${button('free','Free roam')}</div><p class="muted">WASD to move · E to enter or exit · M for chapters · Esc to pause</p>`:
    type==='chapters'?`<div class="eyebrow">LENA MARÍN / STORY LEDGER</div><h1>THE ALBA <em>FILES</em></h1><div class="board-columns"><div class="chapter-grid">${chapters.map(([name,contact],i)=>button('job'+i,`<span>JOB ${String(i+1).padStart(2,'0')} · ${p.done.includes(i)?'COMPLETE':i===0||p.done.includes(i-1)?'AVAILABLE':'LOCKED'}</span>${name} · ${contact}`)).join('')}</div><div><div class="panel"><div class="eyebrow">RESPECT · ${respect(p.rp).name}</div><div class="spread"><b>${p.rp}/${respect(p.rp).next} RP</b><b>$${p.cash.toLocaleString('en-US')}</b></div><span class="bar"><i style="width:${respect(p.rp).percent}%"></i></span></div><div class="panel"><div class="eyebrow">GARAGE · ${p.owned.length} OWNED</div>${preview?`<img class="garage" src="${preview}" alt="Falcon GT at Strand Boulevard">`:''}<div>${p.owned.join(' · ')}</div></div><div class="panel"><div class="eyebrow">CREW ROSTER</div>${crewView(p).map(m=>`<div>${m.name} · ${m.role} [${m.key}]</div>`).join('')}</div></div></div>${button('resume','Return to city')}`:
    type==='shop'?`<div class="eyebrow">TOMÁS / WORKSHOP</div><h2>Dockside Supply</h2><div class="button-row">${armory.map((w,i)=>button('buy'+i,`${w.name} · ${p.ammo[i]===null?`$${w.price} / ${w.rp} RP`:'Refill $120'}`)).join('')}${button('repair','Repair $250')}${button('resume','Leave')}</div>`:
    `<div class="eyebrow">PUERTO ALBA / PAUSED</div><h2>Strand Boulevard</h2><p>WASD · move / steer · E · enter / exit · F · fire · Q · cover · T · tune</p><p>J · taxi · V · vigilante · K · street race · L · delivery · B · supply · R · repair</p><div class="button-row">${button('resume','Resume')}${button('save','Save progress')}${button('chapters','Chapter select')}${button('weather','Toggle rain')}${button('radio','Change radio')}</div>`;
  el.innerHTML=`<div class="board">${body}<p class="warm" id="menu-message"></p></div>`;
  el.onclick=event=>{const id=event.target.closest('button')?.dataset.action;if(id)action(id);};
}
