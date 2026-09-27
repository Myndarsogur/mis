import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../../thrividdarkort/vendor/three.module.min.js';
import {buildWorld} from '../../thrividdarkort/world.js';
import {rooms,contains,bounds} from '../../thrividdarkort/layout.js';
import {upperRooms,upperHeight,upperWings,upperWalkable} from '../../thrividdarkort/upper-floor.js';
import {canStand} from '../../thrividdarkort/physics.js';
import {people,counts,schedule,clock,groups,stations} from '../simulation.js';
import {createMotion,positionAt,gardenAreas} from '../motion.js';
import {createFloorRouter} from '../floor-router.js';
const world=buildWorld(new THREE.Scene(),{includeUpperFloor:true}),route=createFloorRouter(world),motion=createMotion(route);
const plans=people.map(p=>motion.plan(p));

test('111 börn, fimm litahópar og réttur fjöldi við tímamót',()=>{
 assert.equal(groups.length,5);assert.deepEqual(groups.map(g=>g.count),[26,23,14,24,24]);assert.equal(people.length,125);
 const pink=people.filter(p=>!p.staff&&p.group===0);assert.equal(pink.filter(p=>p.room==='craft').length,13);assert.equal(pink.filter(p=>p.room==='class-garden').length,13);
 assert.deepEqual(counts(0),{children:111,staff:14});assert.deepEqual(counts(105),{children:40,staff:8});assert.deepEqual(counts(150),{children:0,staff:0});assert.equal(clock(150),'16:30');
 const children=people.filter(p=>!p.staff);assert.equal(children.filter(p=>p.station==='small-garden').length,31);assert.equal(children.filter(p=>p.station!=='small-garden').length,80);
});
test('Fjórar stofur eru beint fyrir ofan tilgreindar stofur á jarðhæð',()=>{
 for(const room of upperRooms){assert.deepEqual(room.polygon,rooms.find(r=>r.id===room.above).polygon);assert.equal(room.height,upperHeight);assert.equal(room.floor,1);}
 assert.equal(new Set(people.filter(p=>!p.staff&&groups[p.group].floor===1).map(p=>p.room)).size,4);
});
test('Blá og græn börn fara niður stiga í Litla garð og á leyfilegar valstöðvar',()=>{
 for(const p of people.filter(p=>!p.staff&&groups[p.group].floor===1)){
  const plan=plans[p.id];assert.equal(plan.start[2],upperHeight);
  const firstTrip=plan.legs.find(l=>l.kind==='travel');
  assert.ok(firstTrip.path.some(point=>point[2]>0&&point[2]<upperHeight));
  assert.equal(firstTrip.path.at(-1)[2],0);assert.equal(firstTrip.zone,'small-garden');
  const outside=positionAt(plan,15);assert.equal(outside.point[2],0);assert.ok(contains(outside.point,gardenAreas['small-garden'].polygon));
  const indoor=schedule(p).filter(e=>e.time>=45&&e.time<85);assert.ok(indoor.every(e=>stations.includes(e.zone)));
  for(const event of indoor){const trip=plan.legs.find(l=>l.kind==='travel'&&l.zone===event.zone&&l.begin>=event.time&&l.begin<event.time+1);assert.ok(trip);const state=positionAt(plan,trip.end);assert.equal(state.point[2],motion.zones[event.zone].height||0);assert.ok(contains(state.point,motion.zones[event.zone].polygon));}
 }
});
test('Leiðir eru samfelldar, hæð breytist aðeins í stigum og leikur helst innan svæðis',()=>{
 for(const person of people){
  const plan=plans[person.id];let previous=plan.start,previousEnd=0;
  for(const leg of plan.legs){
   assert.deepEqual(leg.path[0],previous,`Stökk í leið ${person.id}`);previous=leg.path.at(-1);
   assert.ok(leg.begin>=previousEnd);assert.ok(leg.end>leg.begin);previousEnd=leg.end;
   if(leg.kind==='play')for(const point of leg.path){assert.ok(contains(point,motion.zones[leg.zone].polygon));assert.equal(point[2],motion.zones[leg.zone].height||0);}
   for(let i=1;i<leg.path.length;i++){
    const a=leg.path[i-1],b=leg.path[i];
    if(a[2]!==b[2]){assert.ok(Object.values(upperWings).some(({stair:s})=>Math.abs(a[0]-s.top[0])<.01&&a[1]>=Math.min(s.top[1],s.bottom[1])-.01&&a[1]<=Math.max(s.top[1],s.bottom[1])+.01));continue;}
    const x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;
    assert.ok(canStand(x,z,a[2]?world.upperFloor.colliders:world.colliders,bounds,.16));
    if(a[2])assert.ok(upperWalkable([x,z]),'Ekki ganga yfir opið yfir stiganum');
   }
  }
  const first=positionAt(plan,15);
  assert.ok([15.5,16,16.5,17,17.5,18,19,20].some(t=>{const p=positionAt(plan,t).point;return p[0]!==first.point[0]||p[1]!==first.point[1];}));
  if(person.departure>105){const state=positionAt(plan,105);assert.equal(state.point[2],0);assert.ok(contains(state.point,gardenAreas['small-garden'].polygon));}
  assert.deepEqual(positionAt(plan,15),first);
  const events=schedule(person);for(let i=1;i<events.length;i++)assert.ok(events[i].time>=events[i-1].time);assert.equal(events.at(-1).zone,'home');
 }
});

test('Frjálst val allra hópa notar aðeins fimm leyfilegar innistöðvar',()=>{
 const allowed=['class-south','upper-bekkur-1','upper-bekkur-2','dining','upper-grade-2'];
 assert.deepEqual(stations,allowed);
 for(const person of people){
  for(const event of schedule(person).filter(e=>e.time>=45&&e.time<85&&e.zone!=='home'))assert.ok(event.zone==='small-garden'||allowed.includes(event.zone));
  for(const leg of plans[person.id].legs.filter(l=>l.kind==='play'&&l.begin>=45))assert.ok(leg.zone==='small-garden'||allowed.includes(leg.zone));
 }
});

test('Stækkaði Litli garður er sameiginlegur og leiðir halda börnum utan afgirtu trjábeðsins',async()=>{
 const {smallGarden,modular,p}=await import('../../thrividdarkort/layout.js');
 assert.equal(gardenAreas['small-garden'],smallGarden);
 assert.ok(contains([.5,-26.5],smallGarden.polygon));
 assert.ok(contains([17,-23],smallGarden.polygon));
 assert.ok(modular.x+modular.width<34);
 const gateCenter=smallGarden.gate.a.map((v,i)=>(v+smallGarden.gate.b[i])/2);
 assert.ok(canStand(...gateCenter,world.colliders,bounds,.24),'Hliðið er opið');
 assert.equal(smallGarden.gate.a[0],smallGarden.gate.b[0]);assert.equal(gateCenter[0],p(1527,43)[0],'Hliðið endar við húsendann');
 assert.ok(!canStand(gateCenter[0],-34,world.colliders,bounds,.24),'Græna girðingin stöðvar göngu');
 assert.ok(!canStand(20,-36,world.colliders,bounds,.24),'Hvíta girðingin skilur heimilin frá garðinum');
 assert.ok(!contains([33,-33],smallGarden.polygon),'Malbikið nær ekki lengur að götunni');
 assert.equal(smallGarden.football.rotation,Math.PI/2);
 assert.ok(smallGarden.sandbox.center[0]>23);
 assert.deepEqual(smallGarden.star.center,[8,-16.8],'Stjarnan helst á sama stað');
 assert.ok(modular.width*modular.depth<12,'Kubb­urinn hefur verið minnkaður verulega');
 const points=route.points(route.area('expanded-yard-test',p=>contains(p,smallGarden.polygon)));
 assert.ok(points.length>0);
 assert.ok(points.every(p=>!contains(p,smallGarden.tree.polygon)),'Engir leikpunktar innan afgirts horns');
 let expandedPlay=false;
 for(const plan of plans)for(const leg of plan.legs.filter(l=>l.kind==='play'&&l.zone==='small-garden'))for(const point of leg.path){assert.ok(!contains(point,smallGarden.tree.polygon));if(point[0]>15||point[0]<1||point[1]<-25||point[1]>-10)expandedPlay=true;}
 assert.ok(expandedPlay,'Börnin nýta viðbótarsvæðið');
});
