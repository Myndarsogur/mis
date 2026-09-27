import * as THREE from './vendor/three.module.min.js';
import {rooms,contains} from './layout.js';

// Schematic second storey: footprints follow the rooms below. Stair positions
// and the 3.4 m floor-to-floor height are estimates, pending a measured plan.
export const upperHeight=3.4;
export const upperRooms=[
 {id:'upper-bekkur-1',name:'1. bekkur',above:'craft',wing:'junior',color:'#72aee8'},
 {id:'upper-bekkur-2',name:'2. bekkur',above:'class-garden',wing:'junior',color:'#8ccc9c'},
 {id:'upper-grade-1',name:'1st grade',above:'class-south',wing:'workshop',color:'#72aee8'},
 {id:'upper-grade-2',name:'2nd grade',above:'class-south-west',wing:'workshop',color:'#8ccc9c'}
].map(r=>({...r,floor:1,height:upperHeight,polygon:rooms.find(b=>b.id===r.above).polygon.map(p=>[...p])}));
export const upperWings={
 junior:{polygon:[[-11.5,6],[-.3,6],[-.3,21.5],[-11.5,21.5]],stair:{id:'junior-stairs',name:'Stigi · 1. og 2. bekkur',bottom:[-2.5,3.5,0],top:[-2.5,10,upperHeight]}},
 workshop:{polygon:[[-8.5,-26],[-.3,-26],[-.3,-10],[-8.5,-10]],stair:{id:'workshop-stairs',name:'Stigi · 1st / 2nd grade',bottom:[-7.5,-10,0],top:[-7.5,-18,upperHeight]}}
};
export const upperDoors={
 'upper-bekkur-1':[-4.85,18.5], 'upper-bekkur-2':[-4.85,9],
 'upper-grade-1':[-6.28,-12], 'upper-grade-2':[-7.5,-19.64]
};
export function upperWingAt(point){return Object.entries(upperWings).find(([,w])=>contains(point,w.polygon))?.[0];}
export function buildUpperFloor(scene){
 const group=new THREE.Group();group.name='second-floor';scene.add(group);
 const stairs=new THREE.Group();stairs.name='stairs';scene.add(stairs);
 const colliders=[];
 function box(x,y,z,w,h,d,color,parent=group){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.85}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function floor(polygon,color,y){const shape=new THREE.Shape();polygon.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.y=y;group.add(mesh);}
 function wall(a,b,door){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/length,uz=(b[1]-a[1])/length;
  const at=t=>[a[0]+t*ux,a[1]+t*uz];
  const center=door?(door[0]-a[0])*ux+(door[1]-a[1])*uz:0;
  const spans=door?[[0,center-.7],[center+.7,length]]:[[0,length]];
  for(const [start,end]of spans){if(end<=start)continue;const p=at((start+end)/2),mesh=box(p[0],upperHeight+.48,p[1],end-start,.96,.12,'#ede8d9');mesh.rotation.y=-Math.atan2(uz,ux);colliders.push({a:at(start),b:at(end),thickness:.12,enabled:true});}
 }
 for(const wing of Object.values(upperWings)){
  // Floor opening over the stair flight keeps the staircase visible from above.
  const [x0,z0]=wing.polygon[0],[x1,z1]=wing.polygon[2],s=wing.stair;
  const left=s.top[0]-.6,right=s.top[0]+.6,low=Math.max(z0,Math.min(s.bottom[1],s.top[1])),high=Math.min(z1,Math.max(s.bottom[1],s.top[1]));
  for(const [a,b,c,d]of [[x0,z0,left,z1],[right,z0,x1,z1],[left,z0,right,low],[left,high,right,z1]])if(c>a&&d>b)floor([[a,b],[c,b],[c,d],[a,d]],'#e6ddc9',upperHeight);
  wing.polygon.forEach((a,i)=>wall(a,wing.polygon[(i+1)%4]));
  const steps=18,dz=(s.top[1]-s.bottom[1])/steps;
  for(let i=0;i<steps;i++)box(s.bottom[0],(i+.5)*upperHeight/steps,s.bottom[1]+(i+.5)*dz,1.1,upperHeight/steps,Math.abs(dz),'#b69365',stairs);
  for(const dx of [-.65,.65]){const a=new THREE.Vector3(s.bottom[0]+dx,.9,s.bottom[1]),b=new THREE.Vector3(s.top[0]+dx,upperHeight+.9,s.top[1]);const rail=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,a.distanceTo(b),6),new THREE.MeshStandardMaterial({color:'#627a75'}));rail.position.copy(a).add(b).multiplyScalar(.5);rail.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());stairs.add(rail);}
 }
 for(const r of upperRooms){
  floor(r.polygon,r.color,upperHeight+.025);
  const door=upperDoors[r.id];
  r.polygon.forEach((a,i)=>{const b=r.polygon[(i+1)%4],dx=b[0]-a[0],dz=b[1]-a[1],t=((door[0]-a[0])*dx+(door[1]-a[1])*dz)/(dx*dx+dz*dz);const on=t>=0&&t<=1&&Math.hypot(a[0]+dx*t-door[0],a[1]+dz*t-door[1])<.12;wall(a,b,on?door:null);});
 }
 return {group,stairs,colliders,rooms:upperRooms,wings:upperWings};
}

export function upperWalkable(point){
 const id=upperWingAt(point);if(!id)return false;
 const s=upperWings[id].stair;
 const along=(point[1]-s.bottom[1])/(s.top[1]-s.bottom[1]);
 return !(Math.abs(point[0]-s.top[0])<.7&&along>=0&&along<.97);
}
