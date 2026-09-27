import {createRouter} from './simulation.js';
import {upperHeight,upperWings,upperWingAt,upperWalkable} from '../thrividdarkort/upper-floor.js';
import {canStand} from '../thrividdarkort/physics.js';

// Points use [x, z, elevation], retaining the map's horizontal coordinate order.
export function createFloorRouter(world){
 const ground=createRouter(world.colliders,canStand);
 const upper=createRouter(world.upperFloor.colliders,(x,z,colliders,bounds,radius)=>upperWalkable([x,z])&&canStand(x,z,colliders,bounds,radius),{keepLargest:false});
 const lift=(path,height)=>path.map(p=>[p[0],p[1],height]);
 const stairs={};
 for(const [id,wing]of Object.entries(upperWings)){
  const bottom=ground(wing.stair.bottom,wing.stair.bottom)[0],top=upper(wing.stair.top,wing.stair.top)[0];
  const path=[];for(let i=0;i<=18;i++){const f=i/18;path.push([bottom[0]+(top[0]-bottom[0])*f,bottom[1]+(top[1]-bottom[1])*f,upperHeight*f]);}
  stairs[id]={bottom,top,path};
 }
 function route(from,to,area){
  if(area)return lift((area.floor?upper:ground)(from,to,area),area.floor?upperHeight:0);
  const fromUp=(from[2]||0)>.1,toUp=(to[2]||0)>.1;
  if(!fromUp&&!toUp)return lift(ground(from,to),0);
  const fromWing=fromUp?upperWingAt(from):null,toWing=toUp?upperWingAt(to):null;
  if(fromUp&&toUp&&fromWing===toWing)return lift(upper(from,to),upperHeight);
  let start=from,path=[];
  if(fromUp){const stair=stairs[fromWing];path.push(...lift(upper(from,stair.top),upperHeight),...stair.path.slice().reverse().slice(1));start=stair.bottom;}
  if(toUp){const stair=stairs[toWing];path.push(...lift(ground(start,stair.bottom),0),...stair.path.slice(1),...lift(upper(stair.top,to),upperHeight).slice(1));}
  else path.push(...lift(ground(start,to),0));
  return path.filter((p,i)=>i===0||p.some((v,j)=>v!==path[i-1][j]));
 }
 route.area=(key,predicate,floor=0)=>{const area=(floor?upper:ground).area(key,predicate);area.floor=floor;return area;};
 route.points=area=>lift((area.floor?upper:ground).points(area),area.floor?upperHeight:0);
 route.stairs=stairs;
 return route;
}
