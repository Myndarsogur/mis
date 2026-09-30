const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
function setup(seed={}){
 const storage=new Map(Object.entries(seed)),elements=new Map(),events={};
 function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',open:false,dataset:{},style:{},querySelector:element,querySelectorAll:()=>[],setAttribute(){},focus(){},classList:{toggle(){}},addEventListener(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(id)}
 const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[],body:element('body'),addEventListener:(id,fn)=>events[id]=fn},window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setInterval(){},Date,crypto:{randomUUID:()=> 'new-player'}});
 for(const name of ['schedules.js','game.js','app.js','language.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),context);
 return {run:code=>vm.runInContext(code,context),element,storage,events};
}
const players=[{id:'a',name:'Aron',selected:true},{id:'b',name:'Birna',selected:true}];
test('migrates v1 assignments without changing the legacy data',()=>{
 const legacy=JSON.stringify({step:1,players,assignments:{skraning:'a'},locations:{skraning:'Við töfluna'},positions:{skraning:'active'}});
 const app=setup({'fristundaspil-v1':legacy});
 assert.equal(app.run('state.step'),0);
 assert.equal(app.run('JSON.stringify(state.assignments.skraning)'), '["a"]');
 app.run('save()');assert.equal(app.storage.get('fristundaspil-v1'),legacy);
 assert.equal(JSON.parse(app.storage.get('fristundaspil-v2')).locations.skraning,'Við töfluna');
});
test('assigns multiple people, prevents duplicates, removes individuals and respects attendance',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players})});
 app.run('assign("skraning","a"); assign("skraning","b"); assign("skraning","a")');
 assert.equal(app.run('owners(roles[0]).length'),2);
 assert.match(app.element('#content').innerHTML,/role-people multiple/);
 app.run('assign("skraning","a",false)');assert.equal(app.run('owners(roles[0])[0].id'),'b');
 app.run('state.players[1].selected=false');assert.equal(app.run('owners(roles[0]).length'),0);
 app.run('state=readState()');assert.equal(app.run('state.assignments.skraning.length'),1);
});
test('all seven cards open full schedules, including registration times',()=>{
 const app=setup();
 assert.equal(app.run('roles.every(r=>roleDetails[r.id].schedule.length>=10)'),true);
 for(const id of ['skraning','fondur','music','stud','uti','matur','yngstu']){
  app.run(`openRole('${id}')`);assert.equal(app.element('#role-dialog').open,true);
  assert.match(app.element('#role-dialog-content').innerHTML,/13:30/);
  assert.match(app.element('#role-dialog-content').innerHTML,/16:30/);
 }
 app.run('openRole("skraning")');assert.match(app.element('#role-dialog-content').innerHTML,/15:00–16:00/);
});
test('escapes names and locations, and rejects unsafe photos',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players:[{id:'a',name:'<img onerror=alert(1)>',selected:true,photo:'javascript:alert(1)'}],assignments:{uti:['a']},locations:{uti:'<script>bad</script>'}})});
 assert.doesNotMatch(app.element('#content').innerHTML,/<script>bad/);
 assert.match(app.element('#content').innerHTML,/&lt;script&gt;bad/);
 assert.equal(app.run('state.players[0].photo'),'');
});
test('game board preserves assignment groups',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players,assignments:{uti:['a','b']}})});
 app.run('go(2)');
 assert.equal((app.element('#content').innerHTML.match(/data-child=/g)||[]).length,111);
 assert.equal((app.element('#content').innerHTML.match(/data-guide=/g)||[]).length,2);
 assert.doesNotMatch(app.element('#content').innerHTML,/draggable="true"/);
 app.run('openRole("uti")');assert.doesNotMatch(app.element('#role-dialog-content').innerHTML,/data-member=/);
 assert.equal(app.run('owners(roles.find(r=>r.id==="uti")).length'),2);
});
test('names travel from storage between roles and back without copies',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players})});
 assert.match(app.run('roster()'),/data-drag-player="a"/);
 app.run('assign("skraning","a")');
 assert.doesNotMatch(app.run('roster()'),/data-drag-player="a"/);
 app.run('assign("uti","a")');
 assert.equal(app.run('owners(roles[0]).length'),0);
 assert.equal(app.run('playerRole("a").id'),'uti');
 app.run('state=readState()');assert.equal(app.run('playerRole("a").id'),'uti');
 app.run('returnToStorage("a")');
 assert.equal(app.run('playerRole("a")'),undefined);
 assert.match(app.run('roster()'),/data-drag-player="a"/);
});
test('old duplicate assignments resolve to one location',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players,assignments:{skraning:['a'],uti:['a','b']}})});
 assert.equal(app.run('playerRole("a").id'),'skraning');
 assert.equal(app.run('owners(roles.find(r=>r.id==="uti")).length'),1);
});
test('native drop moves a name to a role and returns it to storage',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players})});
 app.run('dragId={type:"player",id:"a"}');
 const destination={dataset:{dropRole:'uti'},hasAttribute:()=>false};
 app.events.drop({target:{closest:()=>destination},preventDefault(){}});
 assert.equal(app.run('playerRole("a").id'),'uti');
 app.run('dragId={type:"player",id:"a"}');
 app.events.drop({target:{closest:()=>({hasAttribute:()=>true})},preventDefault(){}});
 assert.equal(app.run('playerRole("a")'),undefined);
});

test('111 children in five age colours follow the afternoon and all go home',()=>{
 const app=setup();
 assert.equal(app.run('children.length'),111);
 assert.equal(app.run('JSON.stringify(childGroups.map(g=>g.count))'),'[23,22,22,22,22]');
 assert.equal(app.run('children.every(c=>childState(c,810).status==="waiting")'),true);
 assert.equal(app.run('children.every(c=>childState(c,855).status==="here")'),true);
 assert.equal(app.run('children.filter(c=>c.age===5).every(c=>childState(c,860).zone==="yngstu")'),true);
 assert.equal(app.run('children.filter(c=>c.age>5).every(c=>childState(c,860).zone==="uti")'),true);
 assert.equal(app.run('children.filter(c=>c.age===5).every(c=>childState(c,890).zone==="uti")'),true);
 assert.equal(app.run('children.filter(c=>c.age>5).every(c=>["fondur","music","stud","matur"].includes(childState(c,890).zone))'),true);
 assert.equal(app.run('children.every(c=>childState(c,946).zone==="uti")'),true);
 assert.equal(app.run('children.every(c=>childState(c,990).status==="home")'),true);
 assert.equal(app.run('Math.max(...children.map(childDeparture))'),990);
});
test('simulation trajectories remain finite and reconcile counts at every minute',()=>{
 const app=setup();
 assert.equal(app.run(`Array.from({length:181},(_,i)=>810+i).every(t=>{
  const pieces=children.map(c=>childState(c,t));
  return pieces.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1000&&p.y>=0&&p.y<=820)&&pieces.filter(p=>['waiting','here','home'].includes(p.status)).length===111;
 })`),true);
});
test('staff follow role routes and current schedule entries',()=>{
 const app=setup();
 assert.equal(app.run('routePosition(staffRoute("fondur"),201,860,true).zone'),'uti');
 assert.equal(app.run('routePosition(staffRoute("fondur"),201,900,true).zone'),'fondur');
 assert.equal(app.run('routePosition(staffRoute("yngstu"),202,900,true).zone'),'uti');
 assert.equal(app.run('currentDuty("skraning",960)[0]'),'16:00');
 assert.equal(app.run('roles.every(r=>routePosition(staffRoute(r.id),200,990,true).zone==="school")'),true);
});

test('language catalog covers every schedule, defaults and live game counters',()=>{
 const app=setup();
 assert.equal(app.run('Object.values(roleDetails).every(r=>r.schedule.every(([,text])=>translateUI(text)!==text))'),true);
 assert.equal(app.run('Object.values(roleDetails).every(r=>translateUI(r.location)!==r.location)'),true);
 assert.equal(app.run('translateUI("111 here · 0 arriving · 0 home")'),'111 hér · 0 á leiðinni · 0 heima');
 assert.equal(app.run('translateUI("Registration: open schedule")'),'Skráning: opna dagskrá');
 assert.equal(app.run('translateUI("Registration", "en")'),'Registration');
 assert.equal(app.run('translateUI("A custom note")'),'A custom note');
});

test('role captions follow time without duplicating names inside the areas',()=>{
 const app=setup({'fristundaspil-v2':JSON.stringify({players,assignments:{skraning:['a','b']}})});
 assert.equal(app.run('roles.every(r=>roleActivities[r.id].length===roleDetails[r.id].schedule.length)'),true);
 assert.equal(app.run('currentActivity("skraning",810)'),'Reviewing the register.');
 assert.equal(app.run('currentActivity("skraning",885)'),'Helping choose activities.');
 assert.equal(app.run('currentActivity("skraning",960)'),'Reconciling the register.');
 assert.equal(app.run('translateUI(currentActivity("skraning",960))'),'Stemmir af skráninguna.');
 const markup=app.run('activityMarkup("skraning",885)');
 assert.doesNotMatch(markup,/Aron|Birna|portrait/);
 assert.equal((markup.match(/Helping choose activities/g)||[]).length,1);
 assert.match(app.run('activityMarkup("uti",885)'),/Welcoming the youngest group/);
 app.run('go(2)');
 assert.equal((app.element('#content').innerHTML.match(/data-activity-role=/g)||[]).length,7);
});

test('compact game starts at 4x, orders speed choices and updates both clock hands',()=>{
 const app=setup();
 assert.equal(app.run('gameSpeed'),4);
 app.run('go(2)');
 const markup=app.element('#content').innerHTML;
 assert.match(app.element('#header-game').innerHTML,/class="analog-clock"/);
 assert.match(app.element('#header-game').innerHTML,/value="4" selected[^]*value="8"[^]*value="16"[^]*value="1"/);
 assert.doesNotMatch(markup,/Named pieces = your guides/);
 assert.match(app.element('#header-game').innerHTML,/Play afternoon/);
 assert.match(app.element('#steps').innerHTML,/Roles/);
});

test('one dining guide stays inside while two support outdoors at the start and end',()=>{
 const team=[...players,{id:'c',name:'Charlie',selected:true}];
 const app=setup({'fristundaspil-v2':JSON.stringify({players:team,assignments:{matur:['a','b','c']}})});
 assert.equal(app.run('gameStaff().filter(p=>p.role.id==="matur").length'),3);
 for(const time of [810,815,830,840,850,870,945,960,975,980]){
  assert.equal(app.run(`gameStaff().filter(p=>routePosition(staffRoute(p.role.id,p.roleIndex),200+p.index,${time},true).zone==='matur').length`),1);
  assert.equal(app.run(`gameStaff().filter(p=>routePosition(staffRoute(p.role.id,p.roleIndex),200+p.index,${time},true).zone==='uti').length`),2);
 }
 assert.equal(app.run('gameStaff().every(p=>routePosition(staffRoute(p.role.id,p.roleIndex),200+p.index,900,true).zone==="matur")'),true);
 assert.equal(app.run('gameStaff().every(p=>routePosition(staffRoute(p.role.id,p.roleIndex),200+p.index,990,true).zone==="school")'),true);
 assert.equal(app.run('guideDuty(gameStaff()[1],850)[1]'),app.run('currentDuty("uti",850)[1]'));
 assert.equal(app.run('guideDuty(gameStaff()[0],850)[1]'),app.run('currentDuty("matur",850)[1]'));
 assert.match(app.run('activityMarkup("matur",850)'),/One guide inside/);
 app.run('state.players[0].selected=false');
 assert.equal(app.run('gameStaff()[0].id'),'b');
 assert.equal(app.run('gameStaff()[0].roleIndex'),0);
});

test('main heading follows the requested day milestones in both languages',()=>{
 const app=setup();
 for(const [time,title] of [[810,'Allir mæta til starfa'],[840,'Börnin eru sótt og skráð inn'],[841,'Útivist'],[884.9,'Útivist'],[885,'Stöðvar opna'],[944.9,'Stöðvar opna'],[945,'Stöðvar loka'],[946,'Útivist'],[989.9,'Útivist'],[990,'Öll komin heim']]){
  assert.equal(app.run(`translateUI(gamePhase(${time})[0])`),title);
 }
 app.run('go(2)');
 assert.doesNotMatch(app.element('#content').innerHTML,/game-duty-list|game-duties|Let’s walk through/);
 assert.match(app.element('#header-game').innerHTML,/aria-label="Restart afternoon"/);
});
test('responsive organic regions fit both wide and portrait canvases',()=>{
 const app=setup();
 for(const [width,height] of [[1600,700],[700,1050],[600,650]]){
  assert.equal(app.run(`Object.values(arrangeSchool(${width},${height})).every(a=>a.x>=0&&a.y>=0&&a.w>100&&a.h>0&&a.x+a.w<=${width}&&a.y+a.h<=${height})`),true);
 }
});
