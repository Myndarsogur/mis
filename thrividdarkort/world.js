import {buildUpperFloor} from './upper-floor.js';
import * as THREE from './vendor/three.module.min.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {schoolOutline,rooms,partitions,exits,palette,p,church,modular,smallGarden} from './layout.js';
import {segmentDistance,wallSections} from './physics.js';
export function buildWorld(scene,{includeUpperFloor=false}={}){
 const colliders=[],doors=[],roofs=new THREE.Group(),labels=[];scene.add(roofs);
 const materials=new Map();
 function material(color){if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.9}));return materials.get(color)}
 function mesh(geometry,color,parent=scene){const m=new THREE.Mesh(geometry,material(color));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function box(x,y,z,w,h,d,color,parent=scene){const m=mesh(new THREE.BoxGeometry(w,h,d),color,parent);m.position.set(x,y,z);return m}
 function solid(a,b,thickness=.18){const c={a,b,thickness,enabled:true};colliders.push(c);return c}
 function obstacle(x,z,w,d){solid([x-w/2,z-d/2],[x+w/2,z-d/2]);solid([x+w/2,z-d/2],[x+w/2,z+d/2]);solid([x+w/2,z+d/2],[x-w/2,z+d/2]);solid([x-w/2,z+d/2],[x-w/2,z-d/2])}
 function floor(points,color,y=.025){const s=new THREE.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();const m=mesh(new THREE.ShapeGeometry(s),color);m.rotation.x=-Math.PI/2;m.position.y=y;m.castShadow=false;return m}
 function roof(x,z,w,d,base,rise,color=palette.roof){const pts=[-w/2,0,-d/2,w/2,0,-d/2,w/2,0,d/2,-w/2,0,d/2,-w/2,rise,0,w/2,rise,0];const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex([0,4,5,0,5,1,3,2,5,3,5,4,0,3,4,1,5,2]);g.computeVertexNormals();const m=mesh(g,color,roofs);m.material=new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide,roughness:.9});m.position.set(x,base,z);return m}
 function beam(a,b,width,color,parent=scene){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),m=mesh(new THREE.CylinderGeometry(width,width,va.distanceTo(vb),6),color,parent);m.position.copy(va).add(vb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.sub(va).normalize());return m}
 function wall(a,b,{height=3.1,color=palette.wall,openings=[],windows=false}={}){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/length,uz=(b[1]-a[1])/length;
  const at=t=>[a[0]+ux*t,a[1]+uz*t];
  const cuts=openings.map(o=>({...o,at:o.point?(o.point[0]-a[0])*ux+(o.point[1]-a[1])*uz:o.at,type:o.type||'door',width:o.width||1.35}));
  if(windows)for(let t=1.7;t<length-1;t+=3.1)if(!cuts.some(c=>Math.abs(c.at-t)<(c.width/2+1.05)))cuts.push({at:t,width:1.65,type:'window'});
  function section(start,end,low,high,c=color){if(end-start<.01||high-low<.01)return;const [x,z]=at((start+end)/2);const m=box(x,(low+high)/2,z,end-start,high-low,.2,c);m.rotation.y=-Math.atan2(uz,ux);return m}
  for(const cut of wallSections(length,cuts)){
   const {start,end,type}=cut;
   if(type==='solid'){section(start,end,0,height);solid(at(start),at(end));continue}
   const bottom=type==='window'?1:0,top=type==='window'?Math.min(2.5,height-.3):2.5;
   section(start,end,top,height);if(bottom)section(start,end,0,bottom);
   section(start-.045,start+.045,bottom,top,palette.trim);section(end-.045,end+.045,bottom,top,palette.trim);section(start,end,top-.045,top+.045,palette.trim);
   if(type==='window'){
    solid(at(start),at(end));section(start,end,bottom-.045,bottom+.045,palette.trim);section((start+end)/2-.025,(start+end)/2+.025,bottom,top,palette.trim);
    const pane=section(start,end,bottom,top,'#bfdfe7');pane.material=new THREE.MeshStandardMaterial({color:'#b1dce3',transparent:true,opacity:.14,roughness:.1,depthWrite:false});pane.castShadow=false;
   }else{
    const hinge=new THREE.Group(),[x,z]=at(start);hinge.position.set(x,0,z);hinge.rotation.y=-Math.atan2(uz,ux);scene.add(hinge);
    const leaf=new THREE.Group();hinge.add(leaf);box((end-start)/2,1.2,0,end-start-.08,2.4,.055,'#b6c7b2',leaf);box(end-start-.2,1.05,-.065,.07,.08,.13,'#b28b4e',leaf);
    leaf.rotation.y=Math.PI/2;
    const collider=solid(at(start),at(end),.1);collider.enabled=false;
    doors.push({id:cut.id||`door-${doors.length}`,name:cut.name||'Hurð',point:at((start+end)/2),open:true,leaf,collider,angle:Math.PI/2});
   }
  }
 }
 // Ground, road and paths are all geometry, not image textures.
 box(0,-.18,24,96,.3,146,palette.ground);box(41,-.015,24,7,.05,142,'#969d9e');box(36,-.005,24,2.4,.06,142,'#d8d5c8');
 box(-40,-.015,20,5,.05,135,'#a7a9a3');box(0,-.012,91,85,.05,5,'#a7a9a3');
 for(let z=-40;z<91;z+=7)box(41,.02,z,.13,.012,2.8,'#efe8d5');
 for(let z=37;z<44;z+=1.2)box(41,.025,z,5.8,.015,.5,'#f7f4e8');
 box(8,-.005,6,10,.08,16,palette.path);box(15,0,28,5,.08,39,palette.path);box(-5,0,57,59,.08,3,palette.path);box(-3,0,73,3,.08,32,palette.path);
 floor(schoolOutline,'#e6ddc9');
 floor(smallGarden.polygon,'#777e7c',.03);
 const ceiling=floor(schoolOutline,'#e8dfca',3.08);scene.remove(ceiling);roofs.add(ceiling);ceiling.material=new THREE.MeshStandardMaterial({color:'#e8dfca',side:THREE.DoubleSide,roughness:1});
 for(const r of rooms)floor(r.polygon,r.color,.04);
 for(let i=0;i<schoolOutline.length;i++){
  const a=schoolOutline[i],b=schoolOutline[(i+1)%schoolOutline.length];const openings=exits.filter(e=>segmentDistance(...e.point,a,b)<.03);
  wall(a,b,{windows:true,openings});
 }
 partitions.forEach(s=>wall(s.a,s.b,{openings:(s.doors||(s.door?[s.door]:[])).map(point=>({point})),color:'#eee5d3'}));
 // Roof massing from the elevations; upper storeys are not walkable in this ground-floor study.
 const centralA=p(845,470),centralB=p(1254,680);const cx=(centralA[0]+centralB[0])/2,cz=(centralA[1]+centralB[1])/2;
 box(cx,4.6,cz,centralB[0]-centralA[0],3.0,centralB[1]-centralA[1],palette.wall,roofs);
 roof(cx,cz,centralB[0]-centralA[0]+.5,centralB[1]-centralA[1]+.5,6.1,3.6);
 for(let x=2;x<15;x+=3.5)for(const z of [centralA[1]-.01,centralB[1]+.01])box(x,4.6,z,1.7,1.5,.09,palette.trim,roofs);
 for(const [x,z,w,d]of [[-4.35,-17.15,8.7,17.7],[-5.8,11,11.3,21],[23.3,-12.9,8.4,26],[23.3,10.9,8.4,21]])roof(x,z,w+.4,d,3.15+(includeUpperFloor&&x<0?3.4:0),2.1);
 // Small turret on the old school, distinct from the cathedral's square tower.
 box(14.3,7.1,-5.8,2.1,2.2,2.1,palette.wall,roofs);
 const spire=mesh(new THREE.ConeGeometry(1.75,5,4),palette.roof,roofs);spire.rotation.y=Math.PI/4;spire.position.set(14.3,10.7,-5.8);
 beam([14.3,13.2,-5.8],[14.3,14.2,-5.8],.04,'#566262',roofs);
 // Indicative furniture; clear aisles and all exits remain passable.
 function table(x,z,w=1.5,d=.75){box(x,.68,z,w,.12,d,palette.wood);for(const dx of [-w/2+.1,w/2-.1])for(const dz of [-d/2+.1,d/2-.1])box(x+dx,.3,z+dz,.06,.6,.06,'#77816e');obstacle(x,z,w,d)}
 function chair(x,z){box(x,.38,z,.42,.08,.42,'#759b94');box(x,.65,z+.2,.42,.48,.055,'#759b94')}
 for(const r of rooms){
  const xs=r.polygon.map(p=>p[0]),zs=r.polygon.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
  if(['classroom','craft'].includes(r.kind)){
   for(let x=minX+1.2;x<maxX-1.2;x+=2.3)for(let z=minZ+1.2;z<maxZ-1.2;z+=2.3){table(x,z);chair(x,z+.6)}
   box((minX+maxX)/2,1.75,minZ+.04,Math.min(2.5,maxX-minX-1),1.0,.07,'#487562');
  }else if(r.kind==='lounge'||r.kind==='office'){table((minX+maxX)/2,minZ+1.5,1.5,.7);chair((minX+maxX)/2,minZ+2.1)}
 }
 for(const [x,z]of [p(440,670),p(490,570),p(400,725)])table(x,z,2,.9);
 const rec=p(1460,670);table(...rec,2.6,.65);
 // Smaller, inset modular block: schematic placement follows the user description.
 const m=modular;
 box(m.x+m.width/2,.01,m.z+m.depth/2,m.width,.08,m.depth,'#ddd8bb');
 const corners=[[m.x,m.z],[m.x+m.width,m.z],[m.x+m.width,m.z+m.depth],[m.x,m.z+m.depth]];
 corners.forEach((a,i)=>wall(a,corners[(i+1)%4],{height:m.height,windows:true,openings:i===2?[{id:'modular-door',name:'Dyr að litla gámahúsinu',point:[m.x+m.width*.48,m.z+m.depth],width:1.8}]:[]}));
 box(m.x+m.width/2,m.height+.1,m.z+m.depth/2,m.width+.15,.18,m.depth+.15,'#8b9792',roofs);
 // Cathedral: site-plan footprint with explicitly schematic nave and furnishings.
 const c=church,l=c.x-c.width/2,r=c.x+c.width/2,t=c.z-c.depth/2,b=c.z+c.depth/2;
 box(c.x,.01,c.z,c.width,.08,c.depth,'#d6cfbb');
 wall([l,t],[r,t],{height:c.height,windows:true,color:'#c3c9c6'});
 wall([r,t],[r,b],{height:c.height,color:'#c3c9c6',openings:[{at:c.depth/2,width:2.8,id:'church-inner',name:'Innri kirkjudyr'}]});
 wall([r,b],[l,b],{height:c.height,windows:true,color:'#c3c9c6'});wall([l,b],[l,t],{height:c.height,color:'#c3c9c6'});
 roof(c.x,c.z,c.width+.7,c.depth+.7,c.height,5.5,'#697775');
 box(r+3,.01,c.z,6,.08,6,'#d6cfbb');wall([r,c.z-3],[r+6,c.z-3],{height:19,color:'#b9c2c3'});wall([r+6,c.z-3],[r+6,c.z+3],{height:19,color:'#b9c2c3',openings:[{at:3,width:2.8,id:'church-door',name:'Dyr Landakotskirkju'}]});wall([r+6,c.z+3],[r,c.z+3],{height:19,color:'#b9c2c3'});
 box(r+3,19,c.z,6.3,.4,6.3,'#a0b0b1',roofs);
 for(const x of [r+.2,r+2,r+4,r+5.8])for(const z of [c.z-2.9,c.z+2.9])box(x,19.9,z,.8,1.6,.8,'#b9c2c3',roofs);
 for(const z of [c.z-1,c.z+1])box(r+6.12,16,z,.06,2.7,.8,'#58666a',roofs);
 beam([r+3,20,c.z],[r+3,23,c.z],.1,'#6d716b',roofs);beam([r+3,22,c.z-1],[r+3,22,c.z+1],.1,'#6d716b',roofs);
 for(let x=l+3;x<r-3;x+=4){
  for(const z of [t-.3,b+.3]){box(x,3,z,.65,6,1,'#adb7b1');obstacle(x,z,.65,1)}
  for(const z of [c.z-4.5,c.z+4.5]){box(x,.47,z,.65,.2,4.5,'#a38060');box(x-.3,.85,z,.12,.85,4.5,'#a38060');obstacle(x,z,.65,4.5)}
  // Rib-like pointed arches built from beams, visible from within.
  beam([x,6,t+.7],[x,11.8,c.z],.1,'#d3d3c6');beam([x,11.8,c.z],[x,6,b-.7],.1,'#d3d3c6');
 }
 box(l+2,.5,c.z,1.3,1,3,'#eee4ce');obstacle(l+2,c.z,1.3,3);
 // Park trees, benches, sandpit and a swing set.
 function tree(x,z,size=1){const trunk=mesh(new THREE.CylinderGeometry(.15,.25,2.5*size,7),'#8c785a');trunk.position.set(x,1.25*size,z);const crown=mesh(new THREE.IcosahedronGeometry(1.6*size,1),'#648b66');crown.position.set(x,3*size,z);solid([x,z],[x,z],.5);}
 for(const [x,z,s]of [[-28,3,1],[-29,13,.8],[-27,-17,1],[-18,-31,.9],[-3,-32,1],[34,14,1],[31,24,1],[-29,29,1.2],[-34,43,1],[-28,62,1.3],[-19,68,.9],[-15,83,1],[12,85,1.2],[27,76,1],[30,59,1.3],[7,62,.8],[-4,42,.8]])tree(x,z,s);
 for(const [x,z]of [[-11,59],[10,60],[23,78],[-24,16]]){box(x,.5,z,2,.13,.6,palette.wood);box(x,.8,z+.25,2,.5,.08,palette.wood);box(x-.8,.23,z,.1,.46,.5,palette.trim);box(x+.8,.23,z,.1,.46,.5,palette.trim);obstacle(x,z,2,.6)}
 box(4,.02,15,6,.12,4,'#e8ce97');for(const x of [1,7])box(x,.13,15,.15,.24,4.2,palette.wood);
 for(const x of [7,12]){beam([x,0,18],[x,2.8,19.3],.09,'#da9c65');beam([x,0,20.6],[x,2.8,19.3],.09,'#da9c65');solid([x,18],[x,20.6],.18)}
 beam([7,2.8,19.3],[12,2.8,19.3],.1,'#da9c65');
 for(const x of [8.7,10.5]){beam([x-.3,2.8,19.3],[x-.3,.6,19.3],.018,'#536164');beam([x+.3,2.8,19.3],[x+.3,.6,19.3],.018,'#536164');box(x,.58,19.3,.8,.09,.38,'#46696f')}
 // Shared small playground: asphalt reaches the school walls and the modular block.
 function fence(a,b,height=1.1,color='#477f59'){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.ceil(length/.32);
  for(let i=0;i<=count;i++){const f=i/count;box(a[0]+(b[0]-a[0])*f,height/2,a[1]+(b[1]-a[1])*f,.065,height,.065,color);}
  for(const y of [.22,height-.12])beam([a[0],y,a[1]],[b[0],y,b[1]],.045,color);
  solid(a,b,.12);
 }
 for(const [a,b]of smallGarden.fences)fence(a,b);
 for(const [a,b]of smallGarden.whiteFences)fence(a,b,1.35,'#f5f3e8');
 // Open gate leaves point inward from the pavement-facing gateposts.
 const gate=smallGarden.gate;
 fence(gate.a,[gate.a[0]-1.2,gate.a[1]],1.1);
 fence(gate.b,[gate.b[0]-1.2,gate.b[1]],1.1);
 const enclosure=smallGarden.tree.polygon;
 floor(enclosure,'#a9b68c',.055);
 enclosure.forEach((a,i)=>fence(a,enclosure[(i+1)%enclosure.length],.85));
 tree(...smallGarden.tree.center,.95);
 for(const swing of smallGarden.swings){
  const at=(x,z)=>[swing.x+x*Math.cos(swing.rotation)-z*Math.sin(swing.rotation),swing.z+x*Math.sin(swing.rotation)+z*Math.cos(swing.rotation)];
  for(const x of [-2,2]){const a=at(x,-1.1),b=at(x,1.1),top=at(x,0);beam([a[0],.05,a[1]],[top[0],2.6,top[1]],.09,'#527e67');beam([b[0],.05,b[1]],[top[0],2.6,top[1]],.09,'#527e67');solid(a,b,.18);}
  const a=at(-2,0),b=at(2,0);beam([a[0],2.6,a[1]],[b[0],2.6,b[1]],.1,'#527e67');
  for(const x of [-.85,.85]){for(const dx of [-.28,.28]){const q=at(x+dx,0);beam([q[0],2.6,q[1]],[q[0],.55,q[1]],.018,'#536164');}const q=at(x,0),seat=box(q[0],.53,q[1],.7,.08,.4,'#3c5e4c');seat.rotation.y=-swing.rotation;solid(at(x-.4,0),at(x+.4,0),.4);}
 }
 for(const [x,z]of smallGarden.benches){box(x,.5,z,1.5,.12,.48,palette.wood);box(x,.8,z-.2,1.5,.5,.08,palette.wood);for(const dx of [-.55,.55])box(x+dx,.24,z,.1,.48,.4,palette.trim);obstacle(x,z,1.5,.5);}
 // Sand corner towards the neighbouring houses; low timber edging is solid.
 const sand=smallGarden.sandbox,[sandX,sandZ]=sand.center;
 box(sandX,.065,sandZ,sand.width,.06,sand.depth,'#dbc58e');
 for(const dx of [-sand.width/2,sand.width/2]){box(sandX+dx,.16,sandZ,.16,.3,sand.depth+.16,palette.wood);solid([sandX+dx,sandZ-sand.depth/2],[sandX+dx,sandZ+sand.depth/2],.16);}
 for(const dz of [-sand.depth/2,sand.depth/2]){box(sandX,.16,sandZ+dz,sand.width,.3,.16,palette.wood);solid([sandX-sand.width/2,sandZ+dz],[sandX+sand.width/2,sandZ+dz],.16);}
 // A compact, two-child play castle: raised deck, battlements, pole and climbing panel.
 const castle=smallGarden.castle,[cxPlay,czPlay]=castle.center,half=castle.width/2,h=castle.platformHeight;
 box(cxPlay,h,czPlay,castle.width,.14,castle.depth,'#cfab75');
 for(const dx of [-half,half])for(const dz of [-half,half]){box(cxPlay+dx,1.05,czPlay+dz,.14,2.1,.14,'#b88d59');box(cxPlay+dx,2.15,czPlay+dz,.23,.2,.23,'#c77759');}
 for(const dx of [-half,half]){box(cxPlay+dx,h+.36,czPlay,.09,.6,castle.depth,'#719797');for(const dz of [-.6,0,.6])box(cxPlay+dx,h+.75,czPlay+dz,.1,.22,.25,'#719797');}
 box(cxPlay,h+.36,czPlay-half,castle.width,.6,.09,'#719797');
 for(const dx of [-.6,0,.6])box(cxPlay+dx,h+.75,czPlay-half,.25,.22,.1,'#719797');
 obstacle(cxPlay,czPlay,castle.width+.15,castle.depth+.15);
 const poleX=cxPlay+half+.55;
 beam([poleX,.04,czPlay],[poleX,2.1,czPlay],.06,'#b7c1bc');beam([cxPlay+half,2.1,czPlay],[poleX,2.1,czPlay],.045,'#b7c1bc');solid([poleX,czPlay],[poleX,czPlay],.15);
 // Sloped miniature climbing wall faces into the garden, with coloured handholds.
 const climbRun=.75,climbLength=Math.hypot(h,climbRun),climb=new THREE.Group();
 climb.position.set(cxPlay,h/2,czPlay+half+climbRun/2);climb.rotation.x=-Math.atan2(climbRun,h);scene.add(climb);
 box(0,0,0,1.05,climbLength,.09,'#bd9770',climb);
 for(let row=0;row<4;row++)for(const dx of [-.28,.28])box(dx+(row%2?.05:-.05),-climbLength*.35+row*climbLength*.23,.075,.13,.08,.08,row%2?'#86a46b':'#cd805d',climb);
 obstacle(cxPlay,czPlay+half+climbRun/2,1.15,climbRun+.15);
 // Flat paint: twelve outer tips alternate with twelve inner vertices.
 const star=smallGarden.star,starPoints=[];
 for(let i=0;i<star.arms*2;i++){const a=-Math.PI/2+i*Math.PI/star.arms,r=i%2?star.innerRadius:star.outerRadius;starPoints.push([star.center[0]+Math.cos(a)*r,star.center[1]+Math.sin(a)*r]);}
 floor(starPoints,'#efe0a4',.045);
 const starBorder=starPoints.map(([x,z])=>new THREE.Vector3(x,.05,z));starBorder.push(starBorder[0].clone());
 scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(starBorder),new THREE.LineBasicMaterial({color:'#f9f3db'})));
 labels.push({text:'LITLI GARÐUR · MALBIK',point:[8,1,-17]});
 // Two lightweight portable goals in the short space between sandpit and street gate.
 const football=smallGarden.football;
 for(const goal of football.goals){
  const [gx,gz]=goal.center,backX=-goal.facing*football.depth,z0=-football.width/2,z1=football.width/2,hGoal=football.height;
  const angle=football.rotation||0,at=(x,y,z)=>[gx+x*Math.cos(angle)-z*Math.sin(angle),y,gz+x*Math.sin(angle)+z*Math.cos(angle)];
  const rail=(a,b,width,color)=>beam(at(...a),at(...b),width,color);
  const barrier=(a,b,width)=>{const pa=at(a[0],0,a[1]),pb=at(b[0],0,b[1]);solid([pa[0],pa[2]],[pb[0],pb[2]],width);};
  for(const z of [z0,z1]){rail([0,.05,z],[0,hGoal,z],.04,'#f1f1e8');rail([0,hGoal,z],[backX,.08,z],.035,'#f1f1e8');rail([0,.08,z],[backX,.08,z],.035,'#f1f1e8');barrier([0,z],[backX,z],.08);}
  rail([0,hGoal,z0],[0,hGoal,z1],.04,'#f1f1e8');rail([backX,.08,z0],[backX,.08,z1],.035,'#f1f1e8');barrier([backX,z0],[backX,z1],.06);
  for(let z=z0+.2;z<z1;z+=.2)rail([0,hGoal,z],[backX,.08,z],.009,'#dce4de');
  for(let y=.2;y<hGoal;y+=.2){const x=backX*(1-y/hGoal);rail([x,y,z0],[x,y,z1],.009,'#dce4de');}
 }
 const ball=mesh(new THREE.SphereGeometry(.16,10,7),'#eae8d9');ball.position.set(24,.2,-29.2);
 // Neighbouring homes now sit immediately behind the white boundary fence.
 const neighbours=smallGarden.neighbours;
 for(const [x,z]of neighbours.centers){box(x,2,z,neighbours.width,4,neighbours.depth,'#d1c4b0');roof(x,z,neighbours.width+.5,neighbours.depth+.5,4,2,'#777e77');obstacle(x,z,neighbours.width,neighbours.depth);}
 labels.push({text:'LANDAKOTSSKÓLI',point:[6,10,-3]},{text:'LANDAKOTSKIRKJA',point:[-8,18,40]},{text:'LANDAKOTSTÚN',point:[-6,1,76]});
 // Batch only static meshes. Door groups remain separate for interaction.
 function batch(parent){
  const groups=new Map();
  for(const child of [...parent.children]){
   if(!child.isMesh||child.material.transparent)continue;
   child.updateMatrix();
   const key=child.material.uuid+Object.keys(child.geometry.attributes).sort().join(',');
   if(!groups.has(key))groups.set(key,[]);groups.get(key).push(child);
  }
  for(const list of groups.values()){
   if(list.length<2)continue;
   const geometries=list.map(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();return g.applyMatrix4(m.matrix)});
   const merged=mergeGeometries(geometries,false);
   if(merged){const combined=new THREE.Mesh(merged,list[0].material);combined.castShadow=true;combined.receiveShadow=true;parent.add(combined);for(const m of list){parent.remove(m);m.geometry.dispose()}}
   for(const g of geometries)g.dispose();
  }
 }
 batch(scene);batch(roofs);
 const upperFloor=includeUpperFloor?buildUpperFloor(scene):null;
 return {colliders,doors,roofs,labels,upperFloor};
}
