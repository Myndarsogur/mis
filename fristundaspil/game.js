'use strict';
// A deterministic rehearsal of the afternoon, not live attendance tracking.
const GAME_START=810, GAME_END=990;
const childGroups=[
 {name:'Pink',age:5,color:'#ed65b0',count:23},
 {name:'Blue',age:6,color:'#369fe2',count:22},
 {name:'Green',age:7,color:'#60b84e',count:22},
 {name:'Orange',age:8,color:'#f29438',count:22},
 {name:'Purple',age:9,color:'#9863d6',count:22}
];
function childGroupLabel(age){return ({5:'Kindergarten',6:'1st grade',7:'2nd grade',8:'3rd grade',9:'4th grade'})[age];}
const children=childGroups.flatMap((group,g)=>Array.from({length:group.count},(_,n)=>({id:childGroups.slice(0,g).reduce((sum,x)=>sum+x.count,0)+n,group:g,age:group.age,color:group.color})));
const wideSchoolAreas={
 school:{x:28,y:20,w:944,h:70,label:'CLASSROOMS · ARRIVAL / HOME'},
 skraning:{x:28,y:125,w:270,h:140,label:'Registration'},
 yngstu:{x:320,y:125,w:320,h:140,label:'Kindergarten'},
 matur:{x:662,y:125,w:310,h:140,label:'Dining hall'},
 fondur:{x:28,y:335,w:290,h:140,label:'Arts & crafts'},
 music:{x:340,y:335,w:310,h:140,label:'Music & science'},
 stud:{x:672,y:335,w:300,h:140,label:'Active play'},
 uti:{x:28,y:545,w:944,h:235,label:'Little Garden · Outdoors'}
};
const narrowSchoolAreas={
 school:{x:24,y:20,w:632,h:60,label:'CLASSROOMS · ARRIVALS / HOME'},
 skraning:{x:24,y:115,w:305,h:130,label:'Registration'},
 yngstu:{x:351,y:115,w:305,h:130,label:'Kindergarten'},
 matur:{x:24,y:290,w:305,h:130,label:'Dining hall'},
 fondur:{x:351,y:290,w:305,h:130,label:'Arts & crafts'},
 music:{x:24,y:465,w:305,h:130,label:'Music & science'},
 stud:{x:351,y:465,w:305,h:130,label:'Active play'},
 uti:{x:24,y:640,w:632,h:225,label:'Little Garden · Outdoors'}
};
function arrangeSchool(width,height){
 const margin=18,gap=18,top=94;
 const school={x:margin,y:10,w:width-margin*2,h:60,label:'CLASSROOMS · ARRIVALS / HOME'};
 const areas={school};
 const names=Object.fromEntries(Object.entries(wideSchoolAreas).map(([id,a])=>[id,a.label]));
 function add(id,x,y,w,h){areas[id]={x,y,w,h,label:names[id]};}
 if(width/height>1.15){
  const leftWidth=(width-margin*2-gap)*.67,gardenX=margin+leftWidth+gap;
  const row=(height-top-margin-gap*2)/3;
  const rows=[['skraning','yngstu',.46],['matur','fondur',.53],['music','stud',.43]];
  rows.forEach(([one,two,split],i)=>{const first=(leftWidth-gap)*split,y=top+i*(row+gap);add(one,margin,y,first,row);add(two,margin+first+gap,y,leftWidth-first-gap,row);});
  add('uti',gardenX,top,width-margin-gardenX,height-top-margin);
 }else{
  const gardenH=(height-top)*.24,row=(height-top-margin-gardenH-gap*3)/3;
  const rows=[['skraning','yngstu',.46],['matur','fondur',.53],['music','stud',.48]];
  rows.forEach(([one,two,split],i)=>{const usable=width-margin*2-gap,first=usable*split,y=top+i*(row+gap);add(one,margin,y,first,row);add(two,margin+first+gap,y,usable-first,row);});
  add('uti',margin,top+3*(row+gap),width-margin*2,gardenH);
 }
 return areas;
}
function areaShape(a,index){
 const {x,y,w,h}=a;
 const radius=Math.min(w,h)*.2;
 const r=[radius*.55,radius*1.25,radius*.7,radius*1.5];
 if(index%2)r.reverse();
 return `M${x+r[0]} ${y+3} Q${x+w*.48} ${y-3} ${x+w-r[1]} ${y+2} Q${x+w} ${y} ${x+w-2} ${y+r[1]} L${x+w-5} ${y+h-r[2]} Q${x+w} ${y+h} ${x+w-r[2]} ${y+h-1} Q${x+w*.45} ${y+h-5} ${x+r[3]} ${y+h} Q${x} ${y+h} ${x+3} ${y+h-r[3]} L${x} ${y+r[0]} Q${x} ${y+3} ${x+r[0]} ${y+3} Z`;
}
let boardObserver=null,boardSizeKey='';
let schoolAreas=wideSchoolAreas,gameNarrow=false;
let gameMinute=GAME_START,gameRunning=false,gameSpeed=4,gameFrame=null,gameLastFrame=null,gameLastDraw=0;
const gameClock=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(Math.floor(m%60)).padStart(2,'0')}`;
function childArrival(c){return 840+(c.id%8)*.8;}
function childDeparture(c){return 950+((c.id*43)%111)/110*40;}
function childRoute(c){
 const activity=['fondur','music','stud','matur'];
 const first=c.age===5?'yngstu':'uti';
 const route=[[810,'school'],[childArrival(c),'skraning'],[childArrival(c)+2,first],
 [885,c.age===5?'uti':activity[c.id%4]],[900,c.age===5?'uti':activity[(c.id+1)%4]],
 [915,c.age===5?'uti':activity[(c.id+2)%4]],[930,c.age===5?'uti':activity[(c.id+3)%4]],
 [945,'uti'],[childDeparture(c)-1,'skraning'],[childDeparture(c),'school']];
 return route;
}
function staffRoute(roleId,roleIndex=0){
 // One dining guide stays inside; the remaining guides support outdoor play.
 if(roleId==='matur')return roleIndex===0
  ? [[810,'matur'],[990,'school']]
  : [[810,'uti'],[885,'matur'],[945,'uti'],[990,'school']];
 const indoor=['fondur','music','stud'];
 return [[810,roleId],[815,roleId],[830,roleId==='uti'?'uti':'school'],
 [840,roleId==='uti'?'uti':roleId==='yngstu'?'yngstu':'skraning'],
 [850,indoor.includes(roleId)?'uti':roleId],
 [885,roleId==='yngstu'?'uti':roleId],[900,roleId==='yngstu'?'uti':roleId],
 [945,roleId==='skraning'?'skraning':roleId==='matur'?'matur':'uti'],
 [960,roleId==='skraning'?'skraning':roleId==='uti'||roleId==='yngstu'?'uti':roleId],
 [975,roleId==='yngstu'?'yngstu':roleId],[990,'school']];
}
function spot(zone,id,minute,staff=false){
 const a=schoolAreas[zone],seed=id+1;
 const fx=((seed*47)%101)/100,fy=((seed*67)%97)/96;
 const top=zone==='school'?43:Math.min(a.h-40,43+activityHeight(zone));
 const x=a.x+30+fx*(a.w-60),y=a.y+top+fy*Math.max(0,a.h-top-30);
 if(staff&&zone!=='school')return {x:a.x+60+((seed*.381966)%1)*(a.w-120),y:a.y+a.h-45};
 const wobble=staff?0:4;
 return {x:x+Math.sin(minute*.63+seed)*wobble,y:y+Math.cos(minute*.47+seed)*wobble};
}
function doorway(zone){
 const a=schoolAreas[zone];
 return {x:a.x+a.w/2,y:a.y+a.h+8};
}
function interpolatePath(points,t){
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));
 let distance=Math.max(0,Math.min(1,t))*lengths.reduce((a,b)=>a+b,0);
 for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const f=lengths[i]?distance/lengths[i]:0;return {x:points[i].x+(points[i+1].x-points[i].x)*f,y:points[i].y+(points[i+1].y-points[i].y)*f};}distance-=lengths[i];}
 return points[0];
}
function travel(from,to,id,minute,t,staff){
 const a=spot(from,id,minute,staff),b=spot(to,id,minute,staff);
 const doorA=doorway(from),doorB=doorway(to);
 const points=[a,doorA];
 if(doorA.y!==doorB.y)points.push({x:15,y:doorA.y},{x:15,y:doorB.y});
 points.push(doorB,b);
 return interpolatePath(points,t);
}
function routePosition(route,id,minute,staff=false){
 let current=route[0];
 for(let i=1;i<route.length;i++){
  const next=route[i];
  if(minute<next[0]){
   const duration=Math.min(2,next[0]-current[0]);
   const fraction=(minute-(next[0]-duration))/duration;
   if(fraction>0&&current[1]!==next[1])return {...travel(current[1],next[1],id,minute,fraction,staff),zone:next[1],travelling:true};
   return {...spot(current[1],id,minute,staff),zone:current[1],travelling:false};
  }
  current=next;
 }
 return {...spot(current[1],id,minute,staff),zone:current[1],travelling:false};
}
function childState(c,minute){
 const status=minute<childArrival(c)?'waiting':minute>=childDeparture(c)?'home':'here';
 return {...routePosition(childRoute(c),c.id,minute),status};
}
function currentDuty(roleId,minute){
 const entries=roleDetails[roleId].schedule;
 return entries.filter(([time])=>{const [h,m]=time.split('–')[0].split(':').map(Number);return h*60+m<=minute;}).at(-1)||entries[0];
}
function currentActivity(roleId,minute){
 const index=roleDetails[roleId].schedule.indexOf(currentDuty(roleId,minute));
 return roleActivities[roleId][index][0];
}
function activityHeight(){return 29;}
function activityMarkup(roleId,minute){
 const split=roleId==='matur'&&owners(roles.find(r=>r.id===roleId)).length>1&&(minute<885||(minute>=945&&minute<990));
 return `<p><span>${split?'One guide inside; the others help outdoors.':currentActivity(roleId,minute)}</span></p>`;
}
function analogClock(){
 return `<svg class="analog-clock" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fffdf5" stroke="#adbda0" stroke-width="2"/>${Array.from({length:12},(_,i)=>`<line x1="32" y1="5" x2="32" y2="${i%3===0?11:8}" stroke="#5c7351" stroke-width="${i%3===0?2:1}" transform="rotate(${i*30} 32 32)"/>`).join('')}<line id="hour-hand" x1="32" y1="32" x2="32" y2="17" stroke="#294b3b" stroke-width="4" stroke-linecap="round"/><line id="minute-hand" x1="32" y1="32" x2="32" y2="9" stroke="#294b3b" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="32" r="3" fill="#294b3b"/></svg>`;
}
function guideLegend(){return `<svg viewBox="-15 -23 30 48" aria-hidden="true"><circle cy="-12" r="7" fill="#f3d7b5" stroke="#324731" stroke-width="1.5"/><path d="M-8-3Q0-7 8-3L12 14H-12Z" fill="#d4e4ed" stroke="#324731" stroke-width="2.5"/><path d="M-5 14V20M5 14V20" stroke="#324731" stroke-width="3"/></svg><span>Guides</span>`;}
function gamePhase(minute){
 if(minute>=990)return ['Everyone home','The school is quiet. The team has finished the afternoon.'];
 if(minute>=946)return ['Outdoor time','15:45–16:30 · We play outside and say goodbye as families arrive.'];
 if(minute>=945)return ['Activity stations close','15:45 · We tidy up together and head outside.'];
 if(minute>=885)return ['Activity stations open','14:45 · Time to create, explore and find a favourite activity.'];
 if(minute>=841)return ['Outdoor time','14:00–14:45 · Fresh air and shared play; the youngest group settles indoors.'];
 if(minute>=840)return ['Children are collected and checked in','14:00 · A warm welcome, a quick check-in, and then outside.'];
 return ['Everyone arrives for work','13:30 · We prepare our spaces and get ready to welcome the children.'];
}
function gameStaff(){return selected().filter(p=>playerRole(p.id)).map((p,i)=>{
 const role=playerRole(p.id);
 return {...p,role,index:i,roleIndex:owners(role).findIndex(owner=>owner.id===p.id)};
});}
function guideDuty(p,minute){
 const outside=p.role.id==='matur'&&p.roleIndex>0&&(minute<885||(minute>=945&&minute<990));
 return currentDuty(outside?'uti':p.role.id,minute);
}
function renderGameHeader(){
 document.querySelector('#header-game').innerHTML=`<div class="simulation-clocks">${analogClock()}<time id="game-time">${gameClock(gameMinute)}</time></div><div class="header-playback"><button id="game-play">${gameRunning?'Break':'Play afternoon'}</button><button id="game-reset" class="outline" aria-label="Restart afternoon" title="Restart afternoon">↺</button><label class="speed-control"><span class="sr-only">Speed</span><select id="game-speed" aria-label="Speed">${[4,8,16,1].map(n=>`<option value="${n}" ${gameSpeed===n?'selected':''}>${n}×</option>`).join('')}</select></label></div>`;
 updateGameClock();
}
function updateGameClock(){
 const time=document.querySelector('#game-time');if(!time)return;
 time.textContent=gameClock(gameMinute);
 document.querySelector('#hour-hand').setAttribute('transform',`rotate(${(gameMinute%720)/2} 32 32)`);
 document.querySelector('#minute-hand').setAttribute('transform',`rotate(${(gameMinute%60)*6} 32 32)`);
}
function gameMarkup(){
 gameNarrow=typeof window.matchMedia==='function'&&window.matchMedia('(max-width:600px)').matches;
 schoolAreas=gameNarrow?narrowSchoolAreas:wideSchoolAreas;
 const width=gameNarrow?680:1000,height=gameNarrow?890:820,school=schoolAreas.school,garden=schoolAreas.uti;

 const unstaffed=roles.filter(r=>!owners(r).length);
 return `<section class="game-shell" aria-label="School simulation"><div class="game-top"><div><p class="eyebrow">A place to belong at Túngata · The after-school game</p><h1 id="game-title" aria-live="polite">${gamePhase(gameMinute)[0]}</h1></div><span class="game-count" id="game-count"></span></div>

 <p id="game-description" class="game-description"></p>
 <label class="game-scrub"><span>13:30 <span>Move through the afternoon</span> 16:30</span><input id="game-seek" type="range" min="810" max="990" step="0.1" value="${gameMinute}" aria-label="Simulation time"></label>
 <div class="game-legend">${childGroups.map(g=>`<span><i style="--piece:${g.color}"></i><span>${childGroupLabel(g.age)}</span><small>· ${g.count}</small></span>`).join('')}<span class="staff-key-game">${guideLegend()}</span></div>
 <div class="school-board">${schoolMarkup(width,height)}</div>
 
 <p class="game-note">Illustrative school layout and age split, not live attendance. 1× = one simulated minute per second. ${unstaffed.length?`${unstaffed.length} roles have no guide — assign your team in Team & roles.`:'All seven roles have guides.'}${selected().some(p=>!playerRole(p.id))?' Unassigned guides remain in the Guide list.':''}</p>
 </section>`;
}
function schoolMarkup(width,height){
 const school=schoolAreas.school,garden=schoolAreas.uti;
 return `<svg id="school-svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="school-title school-desc"><title id="school-title">The school game board</title><desc id="school-desc">111 child pieces in five age colours move between Registration, Kindergarten, the dining hall, Arts and crafts, Music and science, Active play and the Little Garden. Larger named pieces represent your assigned guides. The text below describes the current phase.</desc>
 <defs><pattern id="board-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#cad1bf"/></pattern><filter id="pawn-shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity=".16"/></filter></defs>
 <rect width="${width}" height="${height}" rx="22" fill="#edf0e5"/><rect width="${width}" height="${height}" rx="22" fill="url(#board-dots)"/>
 
 <rect x="${school.x}" y="${school.y}" width="${school.w}" height="${school.h}" rx="14" fill="#e1e6da"/><text x="45" y="40" class="school-label">CLASSROOMS · ARRIVALS / HOME</text>
 ${roles.map((r,index)=>{const a=schoolAreas[r.id];return `<g class="school-zone" data-open-role="${r.id}" role="button" tabindex="0" aria-label="${r.name}: open schedule"><path class="area-shape" d="${areaShape(a,index)}" fill="${r.tint}" stroke="#fffdf5" stroke-width="3"/><text x="${a.x+20}" y="${a.y+29}" class="school-label">${a.label} ↗</text><foreignObject x="${a.x+15}" y="${a.y+37}" width="${a.w-30}" height="${activityHeight(r.id)}"><div xmlns="http://www.w3.org/1999/xhtml" class="on-board-activities role-story" data-activity-role="${r.id}" data-activity-time="${currentDuty(r.id,gameMinute)[0]}" aria-label="Current guide activities">${activityMarkup(r.id,gameMinute)}</div></foreignObject></g>`;}).join('')}

 <g aria-hidden="true" fill="#7b9e64" opacity=".35"><circle cx="${garden.x+garden.w-50}" cy="${garden.y+garden.h-50}" r="23"/><circle cx="${garden.x+garden.w-90}" cy="${garden.y+garden.h-37}" r="17"/><circle cx="${garden.x+52}" cy="${garden.y+garden.h-53}" r="19"/></g>
 <g id="child-pieces" aria-hidden="true">${children.map(c=>`<g data-child="${c.id}" fill="${c.color}" stroke="#ffffff" stroke-width=".9"><title>Child ${c.id+1} · ${childGroupLabel(c.age)}</title><circle cy="-4" r="4"/><path d="M-4 1Q0-2 4 1L6 8H-6Z"/></g>`).join('')}</g>
 <g id="guide-pieces">${gameStaff().map(p=>`<g data-guide="${esc(p.id)}" filter="url(#pawn-shadow)"><title>${esc(p.name)} · ${p.role.name}</title><circle cy="-12" r="7" fill="#f3d7b5" stroke="#324731" stroke-width="1.5"/><path d="M-8-3Q0-7 8-3L12 14H-12Z" fill="${p.role.tint}" stroke="#324731" stroke-width="2.5"/><path d="M-5 14V20M5 14V20" stroke="#324731" stroke-width="3"/><rect x="${-Math.max(44,Math.min(110,p.name.length*7+12))/2}" y="22" width="${Math.max(44,Math.min(110,p.name.length*7+12))}" height="19" rx="7" fill="#fffef5"/><text y="36" text-anchor="middle" class="guide-name" data-user-content>${esc(p.name.length>15?p.name.slice(0,14)+'…':p.name)}</text></g>`).join('')}</g></svg>`;
}
function fitSchoolBoard(){
 const container=document.querySelector('.school-board');if(!container?.getBoundingClientRect)return;
 const rect=container.getBoundingClientRect();if(!rect.width||!rect.height)return;
 // Use a coordinate system matching the available aspect ratio, keeping pieces round.
 const factor=Math.max(rect.width<600?1.85:1.15,650/rect.height,600/rect.width);
 const width=Math.round(rect.width*factor),height=Math.round(rect.height*factor);
 const key=`${width}:${height}`;if(key===boardSizeKey)return;
 boardSizeKey=key;schoolAreas=arrangeSchool(width,height);
 container.innerHTML=schoolMarkup(width,height);
 drawGame();
}
function drawGame(){
 const svg=document.querySelector('#school-svg');if(!svg)return;
 for(const r of roles){
  const panel=svg.querySelector(`[data-activity-role="${r.id}"]`),time=currentDuty(r.id,gameMinute)[0];
  if(panel&&panel.dataset.activityTime!==time){panel.dataset.activityTime=time;panel.innerHTML=activityMarkup(r.id,gameMinute);}
 }
 let here=0,waiting=0,home=0;
 for(const c of children){const p=childState(c,gameMinute),el=svg.querySelector(`[data-child="${c.id}"]`);if(p.status==='here')here++;else if(p.status==='waiting')waiting++;else home++;
  el.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);el.style.display=p.status==='home'?'none':'';el.style.opacity=p.status==='waiting'?'.45':'1';
 }
 const staffNodes=[...svg.querySelectorAll('[data-guide]')];
 for(const p of gameStaff()){const point=routePosition(staffRoute(p.role.id,p.roleIndex),200+p.index,gameMinute,true),el=staffNodes.find(el=>el.dataset.guide===p.id);if(el){el.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);el.style.display=gameMinute>=990?'none':'';}}
 updateGameClock();
 document.querySelector('#game-seek').value=gameMinute;
 document.querySelector('#game-seek').setAttribute('aria-valuetext',gameClock(gameMinute));
 document.querySelector('#game-count').textContent=`${here} here · ${waiting} arriving · ${home} home`;
 const [phase,description]=gamePhase(gameMinute);
 const heading=document.querySelector('#game-title');const phaseKey=phase+'|'+description;if(heading.dataset.phase!==phaseKey){heading.dataset.phase=phaseKey;heading.textContent=phase;document.querySelector('#game-description').textContent=description;}
}

function pauseGame(){gameRunning=false;const button=document.querySelector('#game-play');if(button)button.textContent='Play afternoon';}
function stopGame(){if(boardObserver)boardObserver.disconnect();boardObserver=null;boardSizeKey='';if(gameFrame!==null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(gameFrame);gameFrame=null;gameLastFrame=null;}
function mountGame(){
 stopGame();
 fitSchoolBoard();
 if(typeof ResizeObserver!=='undefined'){boardObserver=new ResizeObserver(fitSchoolBoard);boardObserver.observe(document.querySelector('.school-board'));}
 document.querySelector('#game-seek').addEventListener('input',e=>{pauseGame();gameMinute=Number(e.target.value);drawGame();});

 drawGame();
 function frame(now){
  if(gameLastFrame!==null&&gameRunning&&!document.hidden&&!document.querySelector('#role-dialog').open){gameMinute=Math.min(GAME_END,gameMinute+Math.min((now-gameLastFrame)/1000,.1)*gameSpeed);if(gameMinute===GAME_END){pauseGame();drawGame();}}
  gameLastFrame=now;
  if(gameRunning&&!document.hidden&&now-gameLastDraw>40){drawGame();gameLastDraw=now;}
  gameFrame=requestAnimationFrame(frame);
 }
 if(typeof requestAnimationFrame==='function')gameFrame=requestAnimationFrame(frame);
}

document.addEventListener('click',e=>{
 if(e.target.closest('#game-play')){
  if(state.step!==2)go(2);
  if(gameMinute>=GAME_END)gameMinute=GAME_START;
  gameRunning=!gameRunning;
  document.querySelector('#game-play').textContent=gameRunning?'Break':'Play afternoon';drawGame();
 }
 if(e.target.closest('#game-reset')){pauseGame();gameMinute=GAME_START;updateGameClock();if(state.step===2)drawGame();}
});
document.addEventListener('change',e=>{if(e.target.id==='game-speed')gameSpeed=Number(e.target.value);});
document.addEventListener('keydown',e=>{
 const zone=e.target.closest('.school-zone');
 if(zone&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openRole(zone.dataset.openRole);}
});
