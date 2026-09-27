import {rooms,contains,smallGarden} from '../thrividdarkort/layout.js';
import {upperRooms} from '../thrividdarkort/upper-floor.js';
import {schedule} from './simulation.js';

export const gardenAreas={
 'small-garden':smallGarden,
 'large-garden':{name:'Stóri garður',center:[8,16],polygon:[[0,5],[17,5],[17,28],[0,28]]}
};
export const roomNames={'craft':'Kindergarten','class-garden':'5 ára','class-south':'Myndlistastofa','class-south-west':'Smíðastofa','class-north':'3. bekkur','class-north-east':'4. bekkur','dining':'Matsalur',...Object.fromEntries(upperRooms.map(r=>[r.id,r.name]))};
export const roomColors={'craft':'#ed73ae','class-garden':'#ed73ae','class-south':'#efbd8e','class-south-west':'#eeb17e','class-north':'#f29c50','class-north-east':'#ae88e3','dining':'#efd163'};
const distance=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1],(b[2]||0)-(a[2]||0));
function randomFor(id){let seed=id+713;return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}

export function createMotion(route){
 const zones={};
 for(const r of [...rooms,...upperRooms])if(roomNames[r.id])zones[r.id]={name:roomNames[r.id],floor:r.floor||0,height:r.height||0,center:r.polygon.reduce((a,p)=>[a[0]+p[0]/r.polygon.length,a[1]+p[1]/r.polygon.length],[0,0]),polygon:r.polygon};
 Object.assign(zones,gardenAreas);zones.home={name:'Heim →',center:[34,-1.5,0]};
 // Reusable local paths keep play inside each room or garden, even around furniture.
 for(const [id,zone]of Object.entries(zones)){
  if(!zone.polygon){zone.anchors=[zone.center];continue;}
  zone.area=route.area(id,p=>contains(p,zone.polygon),zone.floor||0);
  const points=route.points(zone.area),random=randomFor(id.length*131+id.charCodeAt(0));
  const seed=points[Math.floor(points.length/2)];zone.anchors=[seed];
  for(let trial=0;trial<400&&zone.anchors.length<(gardenAreas[id]?64:36);trial++){
   const candidate=points[Math.floor(random()*points.length)];
   if(zone.anchors.some(p=>distance(p,candidate)<.6))continue;
   try{route(seed,candidate,zone.area);zone.anchors.push(candidate);}catch{/* Skip isolated gaps beside furniture. */}
  }
  if(!seed)throw new Error(`Engir göngureitir í ${zone.name}`);
 }
 const localPaths=new Map();
 function local(zone,a,b){const key=zone.area.key+':'+a+':'+b;if(!localPaths.has(key))localPaths.set(key,route(a,b,zone.area));return localPaths.get(key);}
 function plan(person){
  const random=randomFor(person.id),entries=schedule(person),legs=[];
  const anchor=zone=>zone.anchors[Math.floor(random()*zone.anchors.length)];
  const initial=zones[entries[0].zone];
  let from=initial.anchors[person.id%initial.anchors.length],now=0,current=entries[0].zone;
  const start=from;
  function add(path,begin,duration,zone,kind){
   const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths[i-1]+distance(path[i-1],path[i]));
   legs.push({path,lengths,length:lengths.at(-1),begin,end:begin+duration,zone,kind});from=path.at(-1);now=begin+duration;
  }
  function roam(until){const zone=zones[current];if(!zone.area)return;
   while(now<until){
    const target=anchor(zone),path=local(zone,from,target),length=path.reduce((sum,p,i)=>sum+(i?distance(path[i-1],p):0),0);
    const pause=person.staff?.65+random():.1+random()*.35;
    const duration=Math.max(.2,length/(person.staff?5:7+random()*5));
    if(now+pause+duration>until)break;
    add(path,now+pause,duration,current,'play');
   }
  }
  for(let i=1;i<entries.length;i++){
   const entry=entries[i];roam(entry.time);
   const target=anchor(zones[entry.zone]),path=route(from,target),length=path.reduce((sum,p,i)=>sum+(i?distance(path[i-1],p):0),0);
   const latest=entry.zone==='home'?person.departure:entry.time===102?105:entries[i+1]?.time??person.departure;
   const stagger=entry.zone==='home'?0:Math.min(.7,random()*.7);
   const begin=entry.time+stagger;
   add(path,begin,Math.min(Math.max(.3,length/32),latest-begin),entry.zone,'travel');current=entry.zone;
  }
  return {start,initialZone:entries[0].zone,legs};
 }
 return {zones,plan};
}

// Absolute time makes pauses, speed changes and backwards seeking reproducible.
export function positionAt(plan,time){
 let point=plan.start,zone=plan.initialZone,kind='rest';
 for(const leg of plan.legs){
  if(time<leg.begin)break;
  zone=leg.zone;kind=leg.kind;
  if(time>=leg.end){point=leg.path.at(-1);continue;}
  const d=(time-leg.begin)/(leg.end-leg.begin)*leg.length;
  let lo=0,hi=leg.lengths.length-1;
  while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(leg.lengths[mid]<=d)lo=mid;else hi=mid-1;}
  const j=Math.min(lo+1,leg.path.length-1),a=leg.path[lo],b=leg.path[j],fraction=(d-leg.lengths[lo])/(leg.lengths[j]-leg.lengths[lo]||1);
  return {point:[a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction,(a[2]||0)+((b[2]||0)-(a[2]||0))*fraction],heading:Math.atan2(b[0]-a[0],b[1]-a[1]),zone,kind};
 }
 return {point,heading:0,zone,kind:'rest'};
}
