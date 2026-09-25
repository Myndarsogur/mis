/* Táknræn hópadreifing; ekki talning barna eða mönnunaráætlun. */
const dayRoles = [
  {name:'Skráning', color:'#68bce9', description:'Öll börn eru skráð inn.'},
  {name:'Föndur og fjör', color:'#327b37', description:'Þar sem dansinn dunar og myndirnar klippast og límast.'},
  {name:'Music and science', color:'#70c83e', description:'Settar eru upp stöðvar og ýmist fara börnin af stað í sérverkefni eða útivist.'},
  {name:'Stuð', color:'#ff783d', description:'Í gegnum allt starfið er starfsfólk að veita stuðning með ýmsum hætti.'},
  {name:'Úti', color:'#b6947d', description:'Öll fara í útivist og því er mikilvægt að vera með öll viðeigandi föt fyrir það.'},
  {name:'Matsalur', color:'#ffce30', description:'Hressing og leikur í opnu stóru rými. Hér er oft mikið um að vera.'},
  {name:'Kindergarten', color:'#f77be2', description:'5 ára börnin leika inni kl. 14:00 á meðan eldri börnin eru í útivist. Starfsfólkið er með hópnum inni.'}
];
const daySteps = [
  {
    time:'14:00', title:'Allir út!',
    text:'Öll börnin fara í útivist í upphafi frístundar. Við hreyfum okkur, leikum okkur og öndum að okkur fersku lofti. Starfsfólkið skráir börnin inn og er með þeim úti.',
    staff:['Skráning','Úti','Úti','Úti','Úti','Úti','Kindergarten']
  },
  {
    time:'14:45', title:'Ég vel mér stöð',
    text:'Öll börnin velja sér stöðvar. Starfsfólk sem er dreift um svæðið býður upp á ólíkar athafnir fyrir börnin til að spreyta sig á. Hér er tækifæri til að prófa, takast á við áskoranir og vaxa.',
    staff:['Skráning','Föndur og fjör','Music and science','Stuð','Úti','Matsalur','Úti'],
    descriptions:{
      'Skráning':'Börnin skrá myndina sína á töflunni og merkja við stöðina þar sem þau eru.',
      'Music and science':'Stöðvarnar eru núna í fullum gangi og fróðleikur og fjör er í fyrirrúmi.',
      'Úti':'Í gegnum daginn geta börnin alltaf valið að fara út ef þau kjósa svo. Starfsmaður er til taks til þess að vera með þeim í leik úti, hvernig sem viðrar.',
      'Föndur og fjör':'Allar stöðvar bjóða upp á eitthvað ólíkt og nýtt. Hugmyndirnar koma oftast frá börnunum sjálfum.',
      'Stuð':'Stuðningur felst í því að aðstoða í erfiðum aðstæðum. Að hjálpa hvort öðru að skilja betur hvernig við getum verið saman.',
      'Kindergarten':'5 ára hópurinn er nú í útivist á meðan eldri börnin eru á stöðvum inni. Starfsfólkið er með börnunum úti í leik og hreyfingu.',
      'Matsalur':'Það er líklega mest um að vera um þetta leyti. Allir að fá sér hressingu eða að koma sér fyrir í leik.'
    }
  },
  {
    time:'15:45', title:'Göngum frá og förum út',
    text:'Við göngum frá eftir okkur og með öðrum áður en stöðvar loka. Starfsfólk aðstoðar við frágang og fylgir börnunum í útivist.',
    staff:['Skráning','Frágangur → úti','Frágangur → úti','Fylgir börnum út','Úti','Frágangur → úti','Úti'],
    descriptions:{
      'Skráning':'Mörg börn eru að skrá sig út með því að merkja við það á töflunni. Þau eða foreldrar geta látið starfsmann vita svo hann geti skráð brottförina hjá sér.',
      'Music and science':'Stöðvar loka. Frágangur er í fullum gangi.',
      'Úti':'Allir týnast út hægt og rólega eftir fráganginn og koma sér fyrir í lokaleik dagsins í frístund.',
      'Föndur og fjör':'Stöðvarnar loka og gengið er frá gluggunum, gólfunum, stólunum og öllu hinu.',
      'Kindergarten':'5 ára hópurinn er úti. Eldri börnin bætast í útivistina eftir frágang og við njótum síðustu leikja dagsins saman.',
      'Matsalur':'Lokar. Börnin geta fengið sér ávaxtabita áður en þau fara út.'
    }
  },
  {
    time:'16:30', title:'Lokað — allir farnir heim',
    text:'Nú er frístund lokuð. Öll börn og allt starfsfólk eru farin heim. Takk fyrir daginn. Sjáumst á morgun!',
    staff:[]
  }
];
function dayDescriptions(step) {
  const data=daySteps[step];
  return data.staff.length ? dayRoles.map(role=>({...role, description:data.descriptions?.[role.name] ?? role.description})) : [];
}

function dayLayout(step) {
  if(step===3)return {children:[],staff:[]};
  const ageColors={5:'#f45bcb',6:'#359de5',7:'#56b844',8:'#f48a32',9:'#9856d9'};
  const stations=[[69,43],[68,75],[39,84],[17,78]];
  const children=Array.from({length:25},(_,i)=>{
    const age=i<20?6+i%4:5;
    const person={age,color:ageColors[age]};
    if(age===5){
      const j=i-20;
      return {...person,x:step===0?80+(j%3)*4.5:17+(j%3)*5,y:step===0?52+Math.floor(j/3)*5.2:30+Math.floor(j/3)*5,zone:step===0?'Kindergarten':'Úti'};
    }
    if(step===0)return {...person,x:13+(i%5)*3.8,y:44+Math.floor(i/5)*3.6,zone:'Úti'};
    if(step===2)return {...person,x:16+(i%5)*4.7+Math.floor(i/5)*2,y:44+Math.floor(i/5)*4.5,zone:'Á leið út'};
    const station=Math.floor(i/5),j=i%5;
    const [x,y]=stations[station];
    return {...person,x:x+(j%3)*3.5,y:y+Math.floor(j/3)*3.8,zone:['Music and science','Föndur og fjör','Matsalur','Stuð'][station]};
  });
  const positions=step===0?[[49,39],[11,32],[26,27],[37,39],[12,57],[35,56],[93,55]]:step===1?[[49,39],[78,66],[77,28],[13,67],[23,25],[49,69],[11,35]]:[[49,39],[39,64],[44,26],[35,48],[12,32],[35,72],[28,28]];
  return {children,staff:positions.map(([x,y],i)=>({x,y,...dayRoles[i],location:daySteps[step].staff[i]}))};
}
if(typeof module!=='undefined')module.exports={daySteps,dayLayout,dayDescriptions};
if(typeof document!=='undefined'){
  const map=document.querySelector('#map');
  const layer=document.createElement('div');layer.className='people-layer';layer.setAttribute('aria-hidden','true');map.append(layer);
  const children=Array.from({length:25},()=>{const el=document.createElement('span');el.className='map-child';layer.append(el);return el});
  const staff=dayRoles.map(r=>{const el=document.createElement('span');el.className='map-staff';el.style.setProperty('--role',r.color);layer.append(el);return el});
  const closing=document.createElement('div');closing.className='closed-sign';closing.innerHTML='☾<br>Allir farnir heim';closing.hidden=true;map.append(closing);
  const route=document.createElement('div');route.className='cleanup-route';route.setAttribute('aria-hidden','true');route.innerHTML='<span>↖</span> Göngum frá → út';route.hidden=true;map.append(route);
  function setDay(step){
    const data=daySteps[step], layout=dayLayout(step);
    document.querySelectorAll('[data-time]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.time)===step?'true':'false'));
    map.dataset.time=step;
    closing.hidden=step!==3;route.hidden=step!==2;
    children.forEach((el,i)=>{const p=layout.children[i];el.hidden=!p;if(p){el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.setProperty('--age',p.color)}});
    staff.forEach((el,i)=>{const p=layout.staff[i];el.hidden=!p;if(p){el.style.left=p.x+'%';el.style.top=p.y+'%'}});
    document.querySelector('#day-summary').innerHTML=`<h3><time>${data.time}</time> ${data.title}</h3><p>${data.text}</p>`;
    document.querySelector('#staff-locations').innerHTML=dayDescriptions(step).map(role=>`<span><i style="--c:${role.color}"></i><strong>${role.name}</strong><span>${role.description}</span></span>`).join('');
  }
  document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>setDay(Number(b.dataset.time))));
  setDay(0);
}
