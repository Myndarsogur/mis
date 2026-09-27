import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {buildWorld} from '../world.js';
import {bounds,checkpoints,rooms,contains,zoneAt,modular} from '../layout.js';
import {canStand,move,wallSections} from '../physics.js';
const world=buildWorld(new THREE.Scene());
test('door openings and windows create the intended wall sections',()=>{assert.deepEqual(wallSections(10,[{at:5,width:2,type:'door'}]).map(s=>[s.start,s.end,s.type]),[[0,4,'solid'],[4,6,'door'],[6,10,'solid']]);});
test('movement cannot tunnel through walls, even at large time steps',()=>{const p=move({x:0,z:0},10,0,[{a:[2,-5],b:[2,5],thickness:.2}],bounds);assert(p.x<1.67);assert(p.x>1.5)});
test('diagonal movement slides along walls',()=>{const p=move({x:0,z:0},4,3,[{a:[2,-5],b:[2,5],thickness:.2}],bounds);assert(p.x<1.67);assert(p.z>2.9)});
test('closing a door blocks its threshold and opening it restores access',()=>{const door=world.doors.find(d=>d.id==='front-door');assert(door);assert(canStand(...door.point,world.colliders,bounds));door.collider.enabled=true;assert(!canStand(...door.point,world.colliders,bounds));door.collider.enabled=false;assert(canStand(...door.point,world.colliders,bounds))});
test('every destination has a clear initial standing point',()=>{for(const cp of checkpoints)assert(canStand(...cp.position,world.colliders,bounds),cp.id)});
test('all primary rooms and outdoor destinations are reachable through actual geometry',()=>{
 const step=.5,minX=-44,minZ=-46,width=177,height=281,seen=new Uint8Array(width*height),open=new Int8Array(width*height);open.fill(-1);
 const index=(x,z)=>z*width+x,queue=[[148,89]];seen[index(148,89)]=1;
 for(let head=0;head<queue.length;head++){
  const [x,z]=queue[head];for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz;if(nx<0||nz<0||nx>=width||nz>=height)continue;const i=index(nx,nz);if(seen[i])continue;if(open[i]===-1)open[i]=canStand(minX+nx*step,minZ+nz*step,world.colliders,bounds)?1:0;if(open[i]){seen[i]=1;queue.push([nx,nz])}}
 }
 for(const cp of checkpoints){const x=Math.round((cp.position[0]-minX)/step),z=Math.round((cp.position[1]-minZ)/step);assert(seen[index(x,z)],'Unreachable destination: '+cp.id)}
 for(const room of rooms)assert(queue.some(([x,z])=>contains([minX+x*step,minZ+z*step],room.polygon)),'Unreachable room: '+room.id);
 assert(queue.some(([x,z])=>zoneAt(minX+x*step,minZ+z*step)==='modular'));
});
