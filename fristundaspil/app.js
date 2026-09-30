'use strict';
const key = 'fristundaspil-v2';
const roles = [
 ['skraning','Registration','↗','#e5dbf0','Keep track of arrivals, attendance and departures.',['Welcome every child.','Check children in and out using the agreed procedure.']],
 ['fondur','Arts & crafts','✳','#e4eab8','Make room for creativity and shared projects.',['Invite children to join in.','Tidy materials together.']],
 ['music','Music & science','♫','#d7e7cf','Bring children together through music and discovery.',['Introduce activities and help children explore.','Care for equipment and keep sound levels comfortable.']],
 ['stud','Active play','⚡','#f3dac1','Support play, movement and positive relationships.',['Help children join a game.','Be available when disagreements arise.']],
 ['uti','Outdoors','☀','#d4e4ed','Be visible and available in the outdoor area.',['Follow the agreed boundaries and procedures.','Help everyone find a way to play.']],
 ['matur','Dining hall','◒','#f1e6b8','Create a welcoming space for food and conversation.',['Follow information about dietary needs.','Support calm conversations and shared tidying.']],
 ['yngstu','Kindergarten','♡','#efd8df','Provide security and continuity for the youngest group.',['Support transitions between areas.','Introduce games and help children connect.']]
].map(([id,name,icon,tint,responsibility,duties])=>({id,name,icon,tint,responsibility,duties}));
const lanes = [['ready','Ready'],['active','In progress'],['help','Needs support'],['done','Finished']];
const defaults = ()=>({step:0,players:[],assignments:{},locations:{},positions:{},times:['14:00','14:45','15:45','16:30']});
function readState(){
 try {
  const s=JSON.parse(localStorage.getItem(key)||localStorage.getItem('fristundaspil-v1'));
  if(!s||!Array.isArray(s.players))return defaults();
  const d=defaults();
  d.step=s.step===2?2:0;
  d.players=s.players.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string').map(p=>({id:p.id,name:p.name,selected:!!p.selected,photo:validPhoto(p.photo)?p.photo:''}));
  const placed=new Set();
  for(const r of roles){
   const old=s.assignments?.[r.id];
   d.assignments[r.id]=[...new Set((Array.isArray(old)?old:typeof old==='string'?[old]:[]).filter(id=>d.players.some(p=>p.id===id)&&!placed.has(id)))];
   d.assignments[r.id].forEach(id=>placed.add(id));
   if(typeof s.locations?.[r.id]==='string')d.locations[r.id]=s.locations[r.id];
   if(lanes.some(l=>l[0]===s.positions?.[r.id]))d.positions[r.id]=s.positions[r.id];
  }
  if(Array.isArray(s.times)&&s.times.length===4&&s.times.every(t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t)))d.times=s.times;
  return d;
 }catch{return defaults();}
}
function validPhoto(photo){return typeof photo==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(photo)&&photo.length<420000;}
let state=readState(),present=false,dragId=null,pickedPlayer=null;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected=()=>state.players.filter(p=>p.selected);
function save(){try{localStorage.setItem(key,JSON.stringify(state));$('#save-status').textContent='Saved in this browser · '+new Date().toLocaleTimeString(document.documentElement?.lang==='is'?'is-IS':'en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});}catch{$('#save-status').textContent='Could not save. Keep this page open.';}}
function announce(message){$('#announcement').textContent=message;}
function go(step){if(step===0)pauseGame();state.step=step;save();render();const heading=state.step===2?$('#game-title'):$('#heading');heading.setAttribute('tabindex','-1');heading.focus();}
const owners=r=>selected().filter(p=>(state.assignments[r.id]||[]).includes(p.id));
function portrait(p){return p.photo?`<img draggable="false" class="portrait" src="${esc(p.photo)}" alt="">`:`<span data-user-content class="portrait initials" aria-hidden="true">${esc(p.name.trim().split(/\s+/).map(n=>Array.from(n)[0]).slice(0,2).join(''))}</span>`;}
function playerRole(id){return roles.find(r=>(state.assignments[r.id]||[]).includes(id));}
function playerToken(p){return `<button type="button" class="name-token ${pickedPlayer===p.id?'picked':''}" data-drag-player="${esc(p.id)}" draggable="${!present}" aria-pressed="${pickedPlayer===p.id}" aria-label="Move ${esc(p.name)}">${portrait(p)}<strong data-user-content>${esc(p.name)}</strong></button>`;}
function roleCard(r,board=false){
 const people=owners(r);
 return `<article class="role-shell" data-drop-role="${r.id}" style="--tint:${r.tint}">
 <div class="role visual-card" ${board&&!present?'draggable="true"':''} data-role="${r.id}">
 <button class="role-head" data-open-role="${r.id}" aria-label="${r.name}: open schedule"><strong>${r.name}</strong><span aria-hidden="true">↗</span></button>
 <div class="role-people ${people.length>4?'many':people.length>1?'multiple':''}">${people.length?people.map(p=>present?`<span data-user-content class="assigned-person">${portrait(p)}<strong data-user-content>${esc(p.name)}</strong></span>`:playerToken(p)).join(''):`<button class="vacant" data-place-role="${r.id}" aria-label="Place selected staff member in ${r.name}">＋<small>Needs staff</small></button>`}</div>
 <button ${state.locations[r.id]?'data-user-content':''} class="where" data-open-role="${r.id}">${esc(state.locations[r.id]||roleDetails[r.id].location)}</button></div>
 <p class="role-caption">${r.responsibility}</p>
 ${board?`<label class="edit">Status<select data-position="${r.id}">${lanes.map(([id,name])=>`<option value="${id}" ${(state.positions[r.id]||'ready')===id?'selected':''}>${name}</option>`).join('')}</select></label>`:''}
 </article>`;
}
function roster(){const waiting=selected().filter(p=>!playerRole(p.id));return `<aside class="roster edit" data-drop-storage><h2>Guide <span class="badge">${waiting.length}</span></h2><p class="note">Drag to a role</p><div class="player-tray">${waiting.map(playerToken).join('')||'<p class="empty">Everyone has a role.</p>'}</div><button class="return-storage outline" data-return-storage>↶ Return here</button></aside>`;}
function managePlayers(){return `<details class="manage-players edit"><summary>Staff · ${selected().length} here today · add or edit</summary><form id="add" class="add-form"><label>Staff name<input id="name" required maxlength="60" autocomplete="off" placeholder="Enter a name…"></label><button>＋ Add</button></form><div class="player-tray">${state.players.map(p=>`<div class="player-token"><strong data-user-content>${esc(p.name)}</strong><label class="attendance"><input type="checkbox" data-attendance="${esc(p.id)}" ${p.selected?'checked':''}> Here today</label><label class="photo-label">Photo<input type="file" accept="image/png,image/jpeg,image/webp" data-photo="${esc(p.id)}" aria-label="Choose a photo for ${esc(p.name)}"></label>${p.photo?`<button data-remove-photo="${esc(p.id)}" class="remove-photo">Remove photo</button>`:''}</div>`).join('')}</div></details>`;}
function assign(roleId,playerId,checked=true){
 if(!roles.some(r=>r.id===roleId)||!selected().some(p=>p.id===playerId))return;
 if(checked){for(const r of roles)state.assignments[r.id]=(state.assignments[r.id]||[]).filter(id=>id!==playerId);state.assignments[roleId].push(playerId);}
 else state.assignments[roleId]=(state.assignments[roleId]||[]).filter(id=>id!==playerId);
 pickedPlayer=null;save();render();announce('The name card has moved.');
}
function returnToStorage(playerId){
 for(const r of roles)state.assignments[r.id]=(state.assignments[r.id]||[]).filter(id=>id!==playerId);
 pickedPlayer=null;save();render();announce('The name card is back under Guide.');
}
const roleIllustrations={skraning:'registration-guide.png',fondur:'arts-crafts-guide.png',music:'music-science-guide.png',stud:'active-play-guide.png',uti:'outdoors-guide.png',matur:'dining-hall-guide.png',yngstu:'kindergarten-guide.png'};
let openRoleId=null,suppressClickUntil=0;
function openRole(id){
 if(state.step===2)pauseGame();
 const r=roles.find(r=>r.id===id);if(!r)return;openRoleId=id;
 const location=state.locations[id]||roleDetails[id].location;
 const locationMarkup=`<p class="role-location" ${state.locations[id]?'data-user-content':''}>${esc(location)}</p>`;
 $('#role-dialog-content').innerHTML=`<div class="schedule-heading" style="--tint:${r.tint}"><h2 id="role-title">${r.name}</h2></div><figure class="role-illustration"><img src="assets/${roleIllustrations[id]}" width="1536" height="1024" alt="${esc(roleDetails[id].illustration)}"><figcaption>${locationMarkup}</figcaption></figure><div class="schedule-body">${id==='matur'?'<p class="note">The first dining guide stays inside. The other dining guides help outdoors before 14:45 and from 15:50.</p>':''}<ol class="schedule">${roleDetails[id].schedule.map(([time,text])=>`<li><span class="schedule-time">${time}</span><p>${text}</p></li>`).join('')}</ol></div>`;
 if(!$('#role-dialog').open)$('#role-dialog').showModal();
}
function render(){
document.body.classList.toggle('assignment-mode',state.step===0&&!present);
document.body.classList.toggle('game-mode',state.step===2);
const managementOpen=document.querySelector('.manage-players')?.open;
renderGameHeader();
$('#steps').innerHTML=[[0,'Roles']].map(([step,label])=>`<button data-step="${step}" ${state.step===step?'aria-current="page"':''}>${label}</button>`).join('');
$('#heading').textContent=['One team. Many roles.','','The school comes to life.'][state.step];
$('#subtitle').textContent=['Choose today’s team and move their names onto the roles. Together, we make it work.','Give each role a guide and a place in the school.','111 children. Five colours. Your team, following the afternoon from arrival to home time.'][state.step];
if(state.step===0){$('#content').innerHTML=`${managePlayers()}<p class="move-instructions" role="status">${pickedPlayer?`${esc(state.players.find(p=>p.id===pickedPlayer)?.name)} selected · choose a role or Guide. Tap the name again to cancel.`:'Drag a name to a role, or tap a name and then its destination.'}</p><div class="assignment-layout">${roster()}<section class="role-destination"><div class="toolbar"><h2>Our roles</h2></div><div class="grid roles">${roles.map(r=>roleCard(r)).join('')}</div></section></div><div class="bottom"><p class="note">Each name has one place. Each role can have several guides.</p><button data-step="2">Enter the game →</button></div>`;if(!state.players.length||managementOpen)document.querySelector('.manage-players').open=true;}
if(state.step===2){$('#content').innerHTML=gameMarkup();mountGame();}else stopGame();
}
document.addEventListener('click',e=>{
 const step=e.target.closest('[data-step]');if(step){go(Number(step.dataset.step));return;}
 if(Date.now()<suppressClickUntil)return;
 const token=e.target.closest('[data-drag-player]');if(token&&!present){const id=token.dataset.dragPlayer;pickedPlayer=pickedPlayer===id?null:id;render();Array.from(document.querySelectorAll('[data-drag-player]')).find(el=>el.dataset.dragPlayer===id)?.focus();return;}
 if(e.target.closest('[data-return-storage]')){if(pickedPlayer)returnToStorage(pickedPlayer);else announce('Select a name first to return it to Guide.');return;}
 const destination=e.target.closest('[data-drop-role]');if(pickedPlayer&&destination&&!e.target.closest('select')){assign(destination.dataset.dropRole,pickedPlayer);return;}
 const empty=e.target.closest('[data-place-role]');if(empty){openRole(empty.dataset.placeRole);return;}
 const card=e.target.closest('[data-open-role]');if(card){openRole(card.dataset.openRole);return;}
 if(destination&&!e.target.closest('select,label')){openRole(destination.dataset.dropRole);return;}
 const remove=e.target.closest('[data-remove-photo]');if(remove){const p=state.players.find(p=>p.id===remove.dataset.removePhoto);if(p){p.photo='';save();render();}}
});
document.addEventListener('submit',e=>{if(e.target.id!=='add')return;e.preventDefault();const name=$('#name').value.trim();if(!name){$('#name').setCustomValidity(uiText('Enter a name.'));$('#name').reportValidity();return;}state.players.push({id:globalThis.crypto?.randomUUID?crypto.randomUUID():`p${Date.now()}`,name,selected:true});save();render();document.querySelector('.manage-players').open=true;$('#name').focus();announce(`${name} added to the team.`);});
document.addEventListener('input',e=>{if(e.target.id==='name')e.target.setCustomValidity('');if(e.target.dataset.location){e.target.removeAttribute('data-default-location');state.locations[e.target.dataset.location]=e.target.value;save();}});
function move(id,position){if(!roles.some(r=>r.id===id)||!lanes.some(l=>l[0]===position))return;state.positions[id]=position;save();render();document.querySelector(`[data-position="${id}"]`)?.focus();announce(`${roles.find(r=>r.id===id).name}: ${lanes.find(l=>l[0]===position)[1]}`);}
document.addEventListener('change',async e=>{
 const d=e.target.dataset;
 if(d.attendance){const p=state.players.find(p=>p.id===d.attendance);p.selected=e.target.checked;if(!p.selected){for(const r of roles)state.assignments[r.id]=(state.assignments[r.id]||[]).filter(id=>id!==p.id);}save();render();document.querySelector('.manage-players').open=true;}
 if(d.member)assign(d.memberRole,d.member,e.target.checked);
 if(d.location)render();
 if(d.position)move(d.position,e.target.value);
 if(d.time!==undefined&&e.target.value){state.times[Number(d.time)]=e.target.value;save();}
 if(d.photo){
  const p=state.players.find(p=>p.id===d.photo),file=e.target.files[0];if(!p||!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>300000){announce('Choose a PNG, JPG or WebP photo under 300 KB.');alert(uiText('Choose a PNG, JPG or WebP photo under 300 KB.'));e.target.value='';return;}
  const reader=new FileReader();reader.onload=()=>{if(validPhoto(reader.result)){p.photo=reader.result;save();render();}};reader.onerror=()=>announce('Could not read the photo.');reader.readAsDataURL(file);
 }
});
document.addEventListener('dragstart',e=>{
 if(present||e.target.closest('input,select,label')){e.preventDefault();return;}
 const player=e.target.closest('[data-drag-player]'),card=e.target.closest('[data-role]');
 if(player&&selected().some(p=>p.id===player.dataset.dragPlayer))dragId={type:'player',id:player.dataset.dragPlayer};
 else if(card&&state.step===2)dragId={type:'role',id:card.dataset.role};
 else{e.preventDefault();return;}
 e.dataTransfer.setData('text/plain',JSON.stringify(dragId));e.dataTransfer.effectAllowed='move';
});
function dropTarget(e){return dragId?e.target.closest(dragId.type==='player'?'[data-drop-role],[data-drop-storage]':'[data-lane]'):null;}
document.addEventListener('dragover',e=>{const target=dropTarget(e);if(target){e.preventDefault();target.classList.add('over');}});
document.addEventListener('dragleave',e=>{const target=dropTarget(e);if(target&&!target.contains(e.relatedTarget))target.classList.remove('over');});
document.addEventListener('drop',e=>{const target=dropTarget(e);if(target){e.preventDefault();if(dragId.type==='player'){if(target.hasAttribute('data-drop-storage'))returnToStorage(dragId.id);else assign(target.dataset.dropRole,dragId.id);}else move(dragId.id,target.dataset.lane);}dragId=null;document.querySelectorAll('.over').forEach(el=>el.classList.remove('over'));});
document.addEventListener('dragend',()=>{suppressClickUntil=Date.now()+250;dragId=null;document.querySelectorAll('.over').forEach(el=>el.classList.remove('over'));});
$('#close-role').addEventListener('click',()=>$('#role-dialog').close());
$('#role-dialog').addEventListener('close',()=>{const id=openRoleId;openRoleId=null;render();document.querySelector(`[data-open-role="${id}"]`)?.focus();});
window.addEventListener('storage',e=>{if(e.key===key){const step=state.step;state=readState();if(present)state.step=2;else state.step=step;render();if(openRoleId)openRole(openRoleId);announce('The board was updated in another window.');}});

// Touch uses pointer capture so the actual name card follows the finger.
let touchDrag=null;
document.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'||present)return;
 const token=e.target.closest('[data-drag-player]');if(!token)return;
 touchDrag={id:token.dataset.dragPlayer,pointer:e.pointerId,x:e.clientX,y:e.clientY,source:token,ghost:null};
 token.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
 if(!touchDrag||touchDrag.pointer!==e.pointerId)return;
 const d=touchDrag;
 if(!d.ghost&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)return;
 if(!d.ghost){d.ghost=d.source.cloneNode(true);d.ghost.classList.add('drag-ghost');d.ghost.style.width=d.source.getBoundingClientRect().width+'px';d.ghost.removeAttribute('data-drag-player');document.body.append(d.ghost);d.source.classList.add('drag-source');}
 d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';
 document.querySelectorAll('.over').forEach(el=>el.classList.remove('over'));
 document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-role],[data-drop-storage]')?.classList.add('over');
 const margin=55;if(e.clientY>window.innerHeight-margin)window.scrollBy(0,12);else if(e.clientY<margin)window.scrollBy(0,-12);
});
function endTouch(e,cancel=false){
 if(!touchDrag||touchDrag.pointer!==e.pointerId)return;
 const d=touchDrag;touchDrag=null;
 if(d.ghost){suppressClickUntil=Date.now()+500;d.ghost.remove();d.source.classList.remove('drag-source');
 const target=cancel?null:document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-role],[data-drop-storage]');
 if(target){if(target.hasAttribute('data-drop-storage'))returnToStorage(d.id);else assign(target.dataset.dropRole,d.id);}
 }
 document.querySelectorAll('.over').forEach(el=>el.classList.remove('over'));
}
document.addEventListener('pointerup',e=>endTouch(e));
document.addEventListener('pointercancel',e=>endTouch(e,true));
render();
