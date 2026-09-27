import * as THREE from '../thrividdarkort/vendor/three.module.min.js';
import {buildWorld} from '../thrividdarkort/world.js';
import {rooms} from '../thrividdarkort/layout.js';
import {createFloorRouter} from './floor-router.js';
import {upperHeight,upperRooms,upperWings} from '../thrividdarkort/upper-floor.js';
import {groups,people,counts,clock} from './simulation.js';
import {createMotion,positionAt,roomColors,roomNames} from './motion.js';
const $=s=>document.querySelector(s);
// These changes apply only in this page's module context, leaving the original map intact.
for(const r of rooms)if(roomColors[r.id]){r.color=roomColors[r.id];r.name=roomNames[r.id];}
$('#legend').innerHTML=groups.map(g=>`<div class="legend-row"><i class="swatch" style="background:${g.color}"></i>${g.name}<b>${g.count}</b></div>`).join('');
let time=0,playing=false,last=0;
function ui(){const c=counts(time);$('#children').textContent=c.children;$('#staff').textContent=c.staff;$('#time').textContent=clock(time);$('#timeline').value=time;$('#timeline').setAttribute('aria-valuetext',clock(time));$('#play').textContent=playing?'Ⅱ Hlé':'▶ Spila';
 const phase=time>=150?['Allir komnir heim','Takk fyrir daginn. Byrjaðu aftur eða færðu tímann til baka.']:time>=120?['Síðustu börnin fara heim','Börn og starfsmenn kveðja smám saman. Klukkan 16:30 eru allir farnir.']:time>=105?['Stofurnar eru lokaðar','Börnin sem eru eftir leika sér í Litla garði. Sex starfsmenn hafa lokið vakt.']:time>=85?['Heimferðir hefjast','Börnum fækkar. Kl. 15:42 hefst sameining í Litla garði og allar stofur tæmast fyrir 15:45.']:time>=45?['Frjálst val á stöðvum','Kindergarten og 5 ára fara í Litla garð ásamt fimm öðrum börnum. Hin velja myndlistastofu, 1. bekk, 2. bekk, matsal eða 2nd grade.']:['Leikur í görðunum','Kindergarten og 5 ára eru inni. 1. og 2. bekkur koma niður stiga af annarri hæð í Litla garð; 3. og 4. bekkur leika í Stóra garði til 14:45.'];$('#phase').textContent=phase[0];$('#description').textContent=phase[1];}
$('#play').onclick=()=>{if(time>=150)time=0;playing=!playing;ui()};$('#restart').onclick=()=>{time=0;playing=false;ui()};$('#timeline').oninput=e=>{time=+e.target.value;ui()};$('#speed').onchange=()=>last=0;document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{time=+b.dataset.time;ui()});document.addEventListener('visibilitychange',()=>last=0);ui();
try{
 const renderer=new THREE.WebGLRenderer({canvas:$('#view'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#dfe8de');
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#fffbed','#9cae8f',2.6));const sun=new THREE.DirectionalLight('#fff0d5',2);sun.position.set(10,60,-30);scene.add(sun);
 const world=buildWorld(scene,{includeUpperFloor:true});world.roofs.visible=false;
 const route=createFloorRouter(world);
 const motion=createMotion(route),zones=motion.zones;
 const labels=Object.entries(zones).map(([id,zone])=>{const el=document.createElement('span');el.className='label';el.textContent=zone.name+(zone.floor?' · 2. hæð':'');const upstairs=upperRooms.find(r=>r.id===id);if(upstairs){const subtitle=document.createElement('small');subtitle.className='label-subtitle';subtitle.textContent=roomNames[upstairs.above]+' · jarðhæð';el.append(subtitle);}$('#labels').append(el);return {id,el,covered:upperRooms.some(r=>r.above===id),floor:zone.floor||0,p:new THREE.Vector3(zone.center[0],(zone.height||0)+1.8,zone.center[1])}});
 for(const wing of Object.values(upperWings)){
  const el=document.createElement('span');el.className='label stair-label '+(wing.stair.id==='junior-stairs'?'stair-junior':'stair-workshop');el.textContent='↗ '+wing.stair.name;$('#labels').append(el);
  labels.push({id:wing.stair.id,el,floor:1,p:new THREE.Vector3(wing.stair.top[0],upperHeight+1.3,wing.stair.top[1])});
 }
 let floorView='all';
 $('#floor-view').onchange=e=>{floorView=e.target.value;document.body.dataset.floorView=floorView;world.upperFloor.group.visible=floorView!=='ground';world.upperFloor.stairs.visible=floorView!=='ground';};
 // Soft outlines identify both play areas without adding an obstacle.
 for(const id of ['small-garden','large-garden']){
  const zone=zones[id],points=[...zone.polygon,zone.polygon[0]].map(p=>new THREE.Vector3(p[0],.12,p[1]));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#759f73',transparent:true,opacity:.6})));
 }
 const geometry=new THREE.BoxGeometry(1,1,1),capMaterial=new THREE.MeshBasicMaterial({color:'#fffbea'});
 const agents=people.map(p=>{
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:p.color,roughness:.7}));const size=p.staff?.68:.34;mesh.scale.set(size,p.staff?1.45:.58,size);scene.add(mesh);
  if(p.staff){const cap=new THREE.Mesh(geometry,capMaterial);cap.scale.set(1.04,.14,1.04);cap.position.y=.44;mesh.add(cap);}
  return {p,mesh,plan:motion.plan(p)};
 });
 const camera=new THREE.PerspectiveCamera(48,1,.1,300);let angle=-.3,elevation=1.04,distance=100,drag=null;
 $('#reset-view').onclick=()=>{angle=-.3;elevation=1.04;distance=100};const canvas=$('#view');canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY}};canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;angle-=(e.clientX-drag.x)*.006;elevation=Math.max(.4,Math.min(1.5,elevation+(e.clientY-drag.y)*.005));drag={id:e.pointerId,x:e.clientX,y:e.clientY}};for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(35,Math.min(160,distance+e.deltaY*.06))},{passive:false});
 function resize(){const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(canvas.parentElement);resize();$('#loading').hidden=true;
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();playing=false;$('#error').hidden=false;$('#error').textContent='Tenging við þrívíddina rofnaði. Endurhladdu síðunni.';ui()});
 window.fristundahermirinn={getState:()=>({time,floorView,...counts(time),agents:agents.map(a=>({id:a.p.id,visible:time<a.p.departure,shown:a.mesh.visible,floor:(a.state?.point[2]||0)>.1?1:0,y:a.mesh.position.y,x:a.mesh.position.x,z:a.mesh.position.z,zone:a.state?.zone,activity:a.state?.kind}))})};
 function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(playing){time=Math.min(150,time+dt*Number($('#speed').value));if(time===150)playing=false;ui()}
 for(const a of agents){
  a.state=positionAt(a.plan,time);const pos=a.state.point;
  a.mesh.visible=time<a.p.departure&&(floorView!=='ground'||(pos[2]||0)<.1)&&(floorView!=='upper'||(pos[2]||0)>.1);
  a.mesh.position.set(pos[0],(pos[2]||0)+(a.p.staff?.8:.4),pos[1]);a.mesh.rotation.y=a.state.heading;
 }

 camera.position.set(Math.sin(angle)*Math.cos(elevation)*distance,Math.sin(elevation)*distance,5+Math.cos(angle)*Math.cos(elevation)*distance);camera.lookAt(0,0,5);camera.updateMatrixWorld();const rect=canvas.getBoundingClientRect();for(const l of labels){const p=l.p.clone().project(camera);l.el.hidden=Math.abs(p.x)>1||Math.abs(p.y)>1||p.z>1||(floorView==='all'&&l.covered)||(floorView==='ground'&&l.floor===1)||(floorView==='upper'&&l.floor===0&&!l.id.includes('garden'));l.el.style.left=(p.x+1)*rect.width/2+'px';l.el.style.top=(1-p.y)*rect.height/2+'px';}renderer.render(scene,camera);
 }requestAnimationFrame(frame);
}catch(error){$('#loading').hidden=true;$('#error').hidden=false;$('#error').textContent='Ekki tókst að ræsa þrívíddarherminn. Prófaðu að endurhlaða í vafra með WebGL. '+error.message;console.error(error);}
