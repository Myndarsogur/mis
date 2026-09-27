export const groups=[
 {name:'Kindergarten og 5 ára',count:26,color:'#ed73ae',room:'craft',rooms:['craft','class-garden'],yard:'small-garden'},
 {name:'3. bekkur',count:23,color:'#f29c50',room:'class-north',yard:'large-garden'},
 {name:'4. bekkur',count:14,color:'#ae88e3',room:'class-north-east',yard:'large-garden'},
 {name:'1. bekkur',count:24,floor:1,color:'#428dd8',room:'upper-bekkur-1',rooms:['upper-bekkur-1','upper-grade-1'],yard:'small-garden'},
 {name:'2. bekkur',count:24,floor:1,color:'#4da56b',room:'upper-bekkur-2',rooms:['upper-bekkur-2','upper-grade-2'],yard:'small-garden'}
];
export const stations=['class-south','upper-bekkur-1','upper-bekkur-2','dining','upper-grade-2'];
export const people=[];
let n=0;
for(let g=0;g<groups.length;g++)for(let i=0;i<groups[g].count;i++){
 const id=n++,departure=id<71?85+(id+1)*20/71:120+(id-70)*30/40;
 const choices=stations;
 people.push({id,group:g,room:groups[g].rooms?.[i%2]||groups[g].room,staff:false,color:groups[g].color,departure,station:g===0||id>=groups[0].count&&id<groups[0].count+5?'small-garden':choices[id%choices.length]});
}
for(let i=0;i<14;i++){const g=i%groups.length,choices=stations;people.push({id:111+i,group:g,room:groups[g].rooms?.[Math.floor(i/groups.length)%2]||groups[g].room,staff:true,color:groups[g].color,departure:i<6?105:120+(i-5)*30/8,station:i<4?'small-garden':choices[i%choices.length]});}
export function schedule(person){const g=groups[person.group],choices=stations;return [
 {time:0,zone:person.room||g.room},
 ...(person.group===0?[]:[{time:0,zone:g.yard}]),
 {time:45,zone:person.station},
 ...(person.station==='small-garden'||person.staff?[]:[
  {time:62+person.id%7,zone:choices[(choices.indexOf(person.station)+1)%choices.length]},
  {time:78+person.id%5,zone:choices[(choices.indexOf(person.station)+2)%choices.length]}
 ]),...(person.departure>105?[{time:102,zone:'small-garden'}]:[]),
 {time:person.departure-2,zone:'home'}
 ];}
export function counts(time){return {children:people.filter(p=>!p.staff&&time<p.departure).length,staff:people.filter(p=>p.staff&&time<p.departure).length};}
export function clock(time){const minutes=840+Math.floor(time);return `${Math.floor(minutes/60)}:${String(minutes%60).padStart(2,'0')}`;}
// Breadth-first route fields share the same walls and furniture as the original map.
export function createRouter(colliders,canStand,{keepLargest=true}={}){
 const step=.5,minX=-34,minZ=-45,w=145,h=161,bounds={minX:-35,maxX:38,minZ:-46,maxZ:36};
 const free=new Uint8Array(w*h),fields=new Map();
 for(let z=0;z<h;z++)for(let x=0;x<w;x++)free[z*w+x]=canStand(minX+x*step,minZ+z*step,colliders,bounds,.16)?1:0;
 const point=i=>[minX+(i%w)*step,minZ+Math.floor(i/w)*step];
 const edges=Array.from({length:w*h},()=>[]);
 for(let i=0;i<free.length;i++)if(free[i])for(const j of [i+1,i+w])if(j<free.length&&Math.abs(j%w-i%w)<=1&&free[j]){const a=point(i),b=point(j);if(canStand((a[0]+b[0])/2,(a[1]+b[1])/2,colliders,bounds,.16)){edges[i].push(j);edges[j].push(i);}}
 // Keep the largest connected walkable area; furniture can enclose tiny pockets.
 const visited=new Uint8Array(w*h);let largest=[];
 for(let i=0;i<free.length;i++)if(free[i]&&!visited[i]){const component=[i];visited[i]=1;for(let k=0;k<component.length;k++)for(const j of edges[component[k]])if(!visited[j]){visited[j]=1;component.push(j);}if(component.length>largest.length)largest=component;}
 if(keepLargest){free.fill(0);for(const i of largest)free[i]=1;}
 const nearestCache=new Map();
 function nearest(p,area){const key=(area?.key||'world')+':'+p;if(nearestCache.has(key))return nearestCache.get(key);let best=-1,d=Infinity;for(let i=0;i<free.length;i++)if(free[i]&&(!area||area.has(i))){const q=point(i),v=(q[0]-p[0])**2+(q[1]-p[1])**2;if(v<d){best=i;d=v}}nearestCache.set(key,best);return best;}
 function field(goal,area){const key=goal+':'+(area?.key||'world');if(fields.has(key))return fields.get(key);const prev=new Int32Array(w*h).fill(-1),queue=new Int32Array(w*h);let head=0,tail=1;queue[0]=goal;prev[goal]=goal;
 while(head<tail){const i=queue[head++];for(const j of edges[i])if(prev[j]===-1&&(!area||area.has(j))){prev[j]=i;queue[tail++]=j;}}
 if(fields.size>220)fields.delete(fields.keys().next().value);fields.set(key,prev);return prev;}
 const route=(from,to,area)=>{const start=nearest(from,area),goal=nearest(to,area);if(start<0||goal<0)throw new Error("Svæðið hefur enga göngureiti.");const prev=field(goal,area);if(prev[start]<0)throw new Error('Engin gönguleið fannst milli rýma.');const path=[point(start)];let i=start;while(i!==goal){i=prev[i];path.push(point(i));}return path;};
 route.area=(key,contains)=>{const area=new Set();area.key=key;for(let i=0;i<free.length;i++)if(free[i]&&contains(point(i)))area.add(i);return area;};
 route.points=area=>[...area].map(point);
 return route;
}
