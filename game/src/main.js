import { T, box, clamp, distance } from './geometry.js';
import { map, buildCity, roadCollision, districtAt } from './city.js';
import { mountHUD, renderHUD } from './hud.js';
import { makeCar, drive, syncVehicle, readVehicle } from './vehicles.js';
import { makePerson, posePerson, populateWalks, advanceWalks } from './pedestrians.js';
import { spawnTraffic, moveTraffic } from './traffic.js';
import { createPursuit, advancePursuit } from './pursuit.js';
import { dispatchFeed } from './dispatch.js';
import { installLighting, setLight } from './daynight.js';
import { installWeather, updateWeather } from './weather.js';
import { makeEffects, makeFlash, tickEffects } from './effects.js';
import { spawnHostiles, tickHostiles, fireWeapon } from './combat.js';
import { startMission, tickMission, missionView, chapters } from './missions.js';
import { beginActivity, tickActivity, activityView } from './activities.js';
import { buyWeapon, weaponView } from './weapons.js';
import { tickCrew, useCrew, crewView } from './crew.js';
import { respect, reward } from './respect.js';
import { loadProgress, saveProgress } from './save.js';
import { createAudio } from './audio.js';
import { createRadio } from './radio.js';
import { say } from './dialogue.js';
import { attachInput, directions } from './input.js';
import { shots, stageShot } from './shots.js';
import { showMenu } from './menus.js';

const query=new URLSearchParams(location.search).get('shot');
let hero=Object.hasOwn(shots,query)?shots[query]:null;
const scene=new T.Scene();
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
document.querySelector('#world').append(renderer.domElement);
const camera=new T.PerspectiveCamera(57,1,.1,510);
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
addEventListener('resize',resize);resize();mountHUD();

const city=buildCity(scene),light=installLighting(scene),weather=installWeather(scene);
const fleet=spawnTraffic(scene),walkers=populateWalks(scene),pursuit=createPursuit(scene);
const hostiles=spawnHostiles(scene),effects=makeEffects(scene);
const falcon=makeCar(scene,'FALCON GT',0x00a99e,0,0);
const person=makePerson(scene,2,1,0xc24865);
const saved=loadProgress();
const p={x:2,z:1,heading:0,health:100,armour:75,cash:1250,rp:0,wanted:0,ghost:0,lookout:0,
  standing:[50,50,50,50,50,50],cooldowns:[0,0,0],done:[],owned:['FALCON GT'],ammo:[54,null,null,null,null,null],slot:0,fireDelay:0,car:null,person};
if(saved&&!hero)Object.assign(p,saved);
let mission=startMission(hero?.chapter??Math.min(p.done.length,9),hero?.stage??0,hero?.time??170);
let activity=null,clock=hero?.clock??17.8,rain=Boolean(hero?.rain),time=.1;
let menu=hero?null:'start',preview='',notice='',noticeLeft=0,dialogueLeft=hero?Infinity:11;
const input=attachInput(),audio=createAudio(),radio=createRadio(audio);
if(hero)stageShot({p,falcon,fleet,pursuit,hostiles,box,scene},hero);
const cars=[falcon,...fleet.all]; cars.forEach(syncVehicle);
const ramp=box(scene,0xca925a,6,.22,-97,2.55,.48,4);ramp.rotation.x=-.11;
box(scene,0x55767b,-7,.55,-12,1.3,1.1,1.45).castShadow=true;
const tell=text=>{notice=text;noticeLeft=3.1;};
const chooseMenu=type=>{menu=type;showMenu(type,p,preview,action,saved);};

function repair(){
  if(!p.car)return 'Get in a vehicle first';
  if(p.cash<250)return 'Repair costs $250';
  p.cash-=250;p.car.condition=100;return 'Vehicle condition restored';
}
function takeJob(index){mission=startMission(index);activity=null;dialogueLeft=12;chooseMenu(null);tell('Job started · follow the mint waypoint');}
function action(id){
  if(id==='chapters'){chooseMenu('chapters');return;}
  if(id==='begin'||id==='resume'){hero=null;chooseMenu(null);return;}
  if(id==='free'){mission.done=true;chooseMenu(null);return;}
  if(id==='weather'){rain=!rain;return;}
  if(id==='radio'){radio.next();return;}
  let result;
  if(id.startsWith('job')){
    const index=Number(id.slice(3));
    if(index===0||p.done.includes(index-1)||p.done.includes(index)){hero=null;takeJob(index);return;}
    result='Complete the previous chapter to unlock this job';
  }else if(id==='save')result=saveProgress(p);
  else if(id==='repair')result=repair();
  else if(id.startsWith('buy')){result=buyWeapon(p,Number(id.slice(3)));chooseMenu('shop');}
  if(result)document.querySelector('#menu-message').textContent=result;
}

function interact(){
  if(p.car){
    const car=p.car;
    p.car=null;car.speed=0;
    const sign=roadCollision(city,car.x+Math.cos(car.heading)*1.9,car.z-Math.sin(car.heading)*1.9)?-1:1;
    p.x=car.x+Math.cos(car.heading)*1.9*sign;p.z=car.z-Math.sin(car.heading)*1.9*sign;
    return;
  }
  const car=[...cars].sort((a,b)=>distance(p,a)-distance(p,b))[0];
  if(distance(p,car)>4.1){tell('Move closer to a vehicle');return;}
  p.car=car;car.claimed=true;
  if(!p.owned.includes(car.name)){
    p.owned.push(car.name);if(!car.bike)p.wanted=Math.max(1,p.wanted);
  }
  tell(car.name+' · T to tune radio');
}

function updateInput(dt){
  if(input.take('Escape')){if(!menu)saveProgress(p);chooseMenu(menu?null:'pause');}
  if(input.take('KeyM'))action('chapters');
  if(menu){if(input.take('Enter')&&menu==='start')action('begin');return;}
  if(input.take('KeyB')){chooseMenu('shop');return;}
  if(input.take('KeyE'))interact();
  if(input.take('KeyR'))tell(repair());
  if(input.take('KeyT'))radio.next();
  for(const [i,key] of ['KeyZ','KeyX','KeyC'].entries())if(input.take(key))tell(useCrew(p,i));
  for(let i=0;i<6;i++)if(input.take(`Digit${i+1}`)){if(p.ammo[i]!==null)p.slot=i;else tell('Locked · visit Dockside Supply [B]');}
  for(const [key,type] of [['KeyJ','taxi'],['KeyV','vigilante'],['KeyK','race'],['KeyL','delivery']])if(input.take(key)){
    const job=beginActivity(type,p);if(typeof job==='string')tell(job);else activity=job;
  }
  const c=directions(input.held);
  if(p.car){
    const car=p.car;
    drive(car,c,dt,(x,z,r)=>roadCollision(city,x,z,r)||cars.some(other=>other!==car&&distance(other,{x,z})<r+other.radius*.75)||pursuit.barrier.root.visible&&Math.abs(x-pursuit.barrier.x)<2.4+r&&Math.abs(z-pursuit.barrier.z)<r);
    if(car.speed>13&&!car.height&&Math.abs(car.x-6)<1.4&&Math.abs(car.z+97)<2){car.height=.1;car.lift=5.1;reward(p,0,16,districtAt(p.x,p.z,p.standing).i);tell('Stunt jump · +16 RP');}
    Object.assign(p,{x:car.x,z:car.z,heading:car.heading});
  }else{
    p.heading-=input.motion*.004;
    input.motion=0;
    p.person.crouch=input.held.has('KeyQ');
    const move=(c.forward-c.back)*dt*(p.person.crouch?2.3:5.1);
    const strafe=(c.right-c.left)*dt*(p.person.crouch?2.3:4.2);
    const x=p.x-Math.sin(p.heading)*move+Math.cos(p.heading)*strafe;
    const z=p.z-Math.cos(p.heading)*move-Math.sin(p.heading)*strafe;
    if(!roadCollision(city,x,z))Object.assign(p,{x,z});
    if(input.fire||input.held.has('KeyF'))fireWeapon(p,hostiles,effects,audio.shot);
  }
}

function placeCamera(){
  const offset=hero?.camera??(p.car?[.58,2.71,7.1]:[1.08,2.09,3.81]);
  const aim=hero?.look??(p.car?[0,1.84,-13]:[.28,1.2,-12]);
  const rotate=(x,y,z)=>new T.Vector3(p.x+x*Math.cos(p.heading)+z*Math.sin(p.heading),y+(p.car?.height||0),p.z+z*Math.cos(p.heading)-x*Math.sin(p.heading));
  camera.position.copy(rotate(...offset));camera.lookAt(rotate(...aim));
}

function draw(dt){
  const district=districtAt(p.x,p.z,p.standing);
  const running=!hero&&!menu;
  const step=running?dt:0;
  time+=step;clock=(clock+step*.018)%24;
  if(running){
    tickCrew(p,step);p.fireDelay=Math.max(0,p.fireDelay-step);
    const outcome=activity?tickActivity(activity,p,step,district.i):tickMission(mission,p,step,district.i);
    if(outcome){if(activity)activity=null;tell(outcome);}
    if(p.health<=0){p.health=100;p.armour=55;p.wanted=0;p.cash=Math.max(0,p.cash-250);p.x=2;p.z=1;p.car=null;tell('Back at the marina · medical bill $250');}
    dialogueLeft-=step;noticeLeft-=step;
  }
  const detection=advancePursuit(pursuit,p,time,step,Boolean(hero));
  const feed=dispatchFeed(pursuit.units,p);
  moveTraffic(fleet,step,p);advanceWalks(walkers,time,step);tickHostiles(hostiles,p,time,step);
  Object.assign(person,{x:p.x,z:p.z,heading:p.heading});
  person.root.visible=!p.car||Boolean(p.car.bike);posePerson(person,time,step>0&&!p.car&&(input.held.has('KeyW')||input.held.has('ArrowUp')));
  const active=activity?activityView(activity):missionView(mission,p);
  tickEffects(effects,step,active.target);
  setLight(scene,light,city,clock>19.5||clock<6?'night':clock>16.7?'golden':'day',p);
  updateWeather(weather,rain,p,step);
  radio.tick(step,Boolean(p.car));
  placeCamera();renderer.render(scene,camera);
  const [,name,line]=chapters[mission.index];
  renderHUD({map,player:p,rank:respect(p.rp),detection,police:feed,district,crew:crewView(p),vehicle:readVehicle(p.car),radio:radio.view(),mission:active,
    dialogue:dialogueLeft>0?say(name,line):null,weapons:weaponView(p),prompt:noticeLeft>0?notice:p.lookout>0&&active.target?'LOOKOUT · WAYPOINT '+Math.round(distance(p,active.target))+' m':!hero&&!p.car&&cars.some(c=>distance(p,c)<4)?'[E] Enter vehicle':''});
}

if(hero?.onFoot)makeFlash(effects,p.x,p.z,p.heading);
draw(0);
preview=renderer.domElement.toDataURL('image/jpeg',.74);
if(query==='progress')chooseMenu('chapters');
else if(menu)chooseMenu(menu);
document.body.dataset.ready='true';
let last=performance.now();
requestAnimationFrame(function frame(now){
  const dt=clamp((now-last)/1000,0,.05);last=now;
  if((!hero&&!menu)||input.pressed.size){if(hero&&query!=='progress'&&input.pressed.size)hero=null;updateInput(dt);draw(dt);}
  input.pressed.clear();requestAnimationFrame(frame);
});
