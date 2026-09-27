/** Geometry in metres. x follows drawing right (approximately north), z drawing down.
 * Ground-floor tracing: 2018 drawing 2018-12-1103374, reference/plan-12.jpg.
 * Calibration: the 8.30 m dimension spans 205 px in the 1872 px reference view.
 * Walls/doors are simplified traces. Heights, church interior and furnishings are estimates.
 */
export const calibration={pixelsPerMetre:205/8.3,source:'2018-12-1103374.tif',status:'traced-approximate'};
export const p=(x,z)=>[(x-850)/calibration.pixelsPerMetre,(z-680)/calibration.pixelsPerMetre];
const poly=points=>points.map(([x,z])=>p(x,z));
export const schoolOutline=poly([[640,43],[845,43],[845,470],[1254,470],[1254,170],[1320,170],[1320,43],[1527,43],[1527,1207],[1320,1207],[1320,680],[845,680],[845,1207],[570,1207],[570,770],[260,770],[450,470],[570,470],[570,170],[640,170]]);
export const bounds={minX:-45,maxX:45,minZ:-47,maxZ:95};
export const palette={wall:'#f1e9d6',trim:'#527778',roof:'#8b6554',wood:'#d5a976',ground:'#97b58b',path:'#d5c9b0',school:'#e6b674',church:'#b5c7d1'};
const room=(id,name,rect,color,kind='classroom')=>({id,name,polygon:poly([[rect[0],rect[1]],[rect[2],rect[1]],[rect[2],rect[3]],[rect[0],rect[3]]]),color,kind});
export const rooms=[
 room('class-south-west','Kennslustofa · suðurálma',[645,48,840,195],'#aecaba'),
 room('class-south','Kennslustofa · miðja suðurálmu',[695,275,840,423],'#d9bf86'),
 room('class-garden','Kennslustofa · við garð',[575,835,730,980],'#b6d4d7'),
 room('craft','Handavinnustofa',[575,1060,730,1200],'#d9aec6','craft'),
 room('staff','Kennarastofa',[860,475,970,600],'#ddd0ae','lounge'),
 room('office','Skrifstofa',[970,475,1050,600],'#d4ceb7','office'),
 room('support','Viðtalsrými',[1050,475,1190,600],'#c5c3d8','lounge'),
 room('north-hall','Salur · norðurálma',[1380,48,1522,420],'#cfbea1','hall'),
 room('class-north','Kennslustofa · norðurálma',[1380,835,1522,980],'#b9c8df'),
 room('class-north-east','Kennslustofa · við Túngötu',[1380,1060,1522,1200],'#c5d5ae'),
 {id:'dining',name:'Matsalur',polygon:poly([[450,475],[570,475],[570,765],[265,765]]),color:'#ebd08b',kind:'dining'},
 room('kitchen','Eldhús',[575,560,695,650],'#e4d5b6','kitchen'),
 room('reception','Anddyri · Túngata',[1380,590,1522,705],'#b3d6dc','reception')
];
// Gaps are specified in drawing coordinates. All doorways are traversable at ground level.
export const partitions=[
 {a:p(640,195),b:p(845,195),door:p(670,195)},
 {a:p(640,270),b:p(845,270),door:p(665,270)},
 {a:p(695,270),b:p(695,423),door:p(695,395)},
 {a:p(640,423),b:p(845,423),door:p(665,423)},
 {a:p(570,470),b:p(845,470),door:p(760,470)},
 {a:p(695,470),b:p(695,650),door:p(695,615)},
 {a:p(570,560),b:p(695,560)},
 {a:p(570,650),b:p(695,650),door:p(625,650)},
 {a:p(570,470),b:p(570,770),door:p(570,715)},
 {a:p(730,770),b:p(730,1207),doors:[p(730,895),p(730,1135)]},
 {a:p(570,830),b:p(730,830)},
 {a:p(570,980),b:p(730,980)},
 {a:p(570,1060),b:p(730,1060)},
 {a:p(845,600),b:p(1254,600),doors:[p(910,600),p(1010,600),p(1110,600),p(1220,600)]},
 {a:p(970,470),b:p(970,600)},
 {a:p(1050,470),b:p(1050,600)},
 {a:p(1190,470),b:p(1190,600)},
 {a:p(1380,43),b:p(1380,1207),doors:[p(1380,320),p(1380,635),p(1380,900),p(1380,1130)]},
 {a:p(1380,420),b:p(1527,420)},
 {a:p(1380,590),b:p(1527,590)},
 {a:p(1380,705),b:p(1527,705)},
 {a:p(1380,830),b:p(1527,830)},
 {a:p(1380,980),b:p(1527,980)},
 {a:p(1380,1060),b:p(1527,1060)}
];
export const exits=[
 {id:'front-door',name:'Aðalinngangur · Túngata',point:p(1527,642),width:1.8},
 {id:'garden-door',name:'Dyr að skólagarði',point:p(1060,680),width:1.7},
 {id:'west-door',name:'Dyr að vesturgarði',point:p(570,240),width:1.4},
 {id:'south-door',name:'Dyr úr suðurálmu',point:p(845,1020),width:1.5},
 {id:'dining-door',name:'Dyr úr matsal',point:p(450,770),width:1.6}
];
// Revised schematic placement from the user's description, not measured dimensions.
export const modular={x:12.5,z:-26.75,width:3.2,depth:3,height:2.6,status:'user-described-approximate-placement'};
const westInner=p(845,470)[0],eastInner=p(1254,470)[0],eastTip=p(1320,43),eastStep=p(1254,170),courtyardBack=p(845,470)[1],gardenEnd=p(1527,43)[0];
export const smallGarden={
 id:'small-garden',name:'Litli garður',center:[8,-17],surface:'asphalt',status:'user-described-approximate',
 polygon:[[westInner,-36],[gardenEnd,-36],[gardenEnd,eastTip[1]],[eastTip[0],eastTip[1]],[eastTip[0],eastStep[1]],[eastInner,eastStep[1]],[eastInner,courtyardBack],[westInner,courtyardBack]],
 fences:[[[gardenEnd,-36],[gardenEnd,-32]],[[gardenEnd,-29],[gardenEnd,eastTip[1]]]],
 whiteFences:[[[westInner,eastTip[1]],[westInner,-36]],[[westInner,-36],[gardenEnd,-36]]],
 gate:{a:[gardenEnd,-32],b:[gardenEnd,-29],faces:'street',alignment:'school-end'},
 tree:{center:[4.2,-33.5],polygon:[[2.5,-35.2],[5.9,-35.2],[5.9,-31.8],[2.5,-31.8]]},
 swings:[{x:9.5,z:-33.5,rotation:0},{x:4.2,z:-28.5,rotation:Math.PI/2}],
 benches:[[13.3,-27.45],[15.2,-27.45]],
 sandbox:{center:[24.5,-34],width:4.4,depth:2.6},
 castle:{center:[20,-33.4],width:1.6,depth:1.6,platformHeight:1.1,capacity:2},
 football:{polygon:[[22,-32.3],[26,-32.3],[26,-26.3],[22,-26.3]],rotation:Math.PI/2,goals:[{center:[24,-31.5],facing:1},{center:[24,-27],facing:-1}],width:1.7,height:1.05,depth:.6},
 neighbours:{centers:[[-26,-40],[-16,-40],[-6,-40],[4,-40],[14,-40],[24,-40]],width:7,depth:6},
 star:{center:[8,-16.8],arms:12,outerRadius:3,innerRadius:1.35}

};
export const church={x:-11,z:40,width:37,depth:15,height:10.5,status:'site-plan-proportions-interior-schematic'};
export const checkpoints=[
 {id:'entrance',name:'Aðalinngangur',position:[30,-1.5],yaw:Math.PI/2,description:'Við Túngötu. Gakktu inn um dyrnar og inn á ganginn.'},
 {id:'corridor',name:'Gangurinn',position:p(1070,650),yaw:Math.PI/2,description:'Tengingin milli álma. Hér verður hægt að fylgja börnunum milli rýma.'},
 {id:'classroom',name:'Kennslustofa',position:p(690,930),yaw:Math.PI/2,description:'Rými í suðurálmu, rakið eftir grunnmynd. Laus húsgögn eru til viðmiðunar.'},
 {id:'hall',name:'Matsalur',position:p(480,680),yaw:Math.PI,description:'Matsalurinn með skáa útveggnum. Útsýni út um glugga og dyr að garði.'},
 {id:'small-garden',name:'Litli garður',position:[8,-17],yaw:Math.PI,description:'Malbikaður garður milli húsanna. Græn girðing, afgirt tré, rólur og bekkir við gámahúsið.'},
 {id:'garden',name:'Skólagarður',position:[8,10],yaw:Math.PI,description:'Milli skólans og kirkjunnar. Leiktæki og gróður eru einfölduð.'},
 {id:'church',name:'Landakotskirkja',position:[15,40],yaw:Math.PI/2,description:'Hlutföll eftir afstöðumynd. Innra skipulag kirkjunnar er skýringarlíkan.'},
 {id:'park',name:'Landakotstún',position:[-4,70],yaw:0,description:'Opið grænt svæði við kirkjuna. Stígar og tré eru til viðmiðunar.'}
];
export function contains(point,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [xi,zi]=polygon[i],[xj,zj]=polygon[j];if((zi>point[1])!==(zj>point[1])&&point[0]<(xj-xi)*(point[1]-zi)/(zj-zi)+xi)inside=!inside;}return inside;}
export function zoneAt(x,z){const r=rooms.find(r=>contains([x,z],r.polygon));if(r)return r.id;if(contains([x,z],schoolOutline))return 'school-corridor';if(Math.abs(x-church.x)<church.width/2&&Math.abs(z-church.z)<church.depth/2)return 'church';if(x>modular.x&&x<modular.x+modular.width&&z>modular.z&&z<modular.z+modular.depth)return 'modular';if(contains([x,z],smallGarden.polygon))return smallGarden.id;if(z>53)return 'park';return 'garden';}
