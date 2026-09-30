'use strict';
// Translate presentation in place: names, custom notes and simulation state stay intact.
const icelandicUI = {
 'Image description':'Myndlýsing',
 "A guide holds a tablet beside a registration board with a blue sky, a four-part green roof and colourful panels.":"Leiðbeinandi heldur á spjaldtölvu við skráningartöflu með bláum himni, fjórskiptu grænu þaki og litríkum reitum.",
 "A guide and two children create together at a table with coloured paper, beads and clay.":"Leiðbeinandi og tvö börn skapa saman við borð með lituðum pappír, perlum og leir.",
 "A guide and two children explore a colourful xylophone and examine a leaf with a magnifying glass.":"Leiðbeinandi og tvö börn prófa litríkan xýlófón og skoða laufblað með stækkunargleri.",
 "A guide crouches beside two children building with large foam blocks on a rug. A ball lies nearby.":"Leiðbeinandi situr á hækjum sér hjá tveimur börnum sem byggja úr stórum svampkubbum á mottu. Bolti liggur hjá.",
 "A guide watches two children playing ball in the Little Garden, with grass, a tree and a low fence.":"Leiðbeinandi fylgist með tveimur börnum í boltaleik í Litla garði. Í kring eru gras, tré og lág girðing.",
 "A guide stands beside two children sharing a calm snack break at a table with bowls, cups and fruit.":"Leiðbeinandi stendur hjá tveimur börnum í rólegum matartíma við borð með skálum, bollum og ávöxtum.",
 "A guide sits on a soft rug with two young children. One looks at a picture book and the other stacks wooden blocks.":"Leiðbeinandi situr á mjúkri mottu með tveimur ungum börnum. Annað skoðar myndabók og hitt staflar trékubbum.",

 'A guide holding a tablet and looking at a board with a blue sky, a four-part green roof and colourful panels.':'Leiðbeinandi með spjaldtölvu horfir á töflu með bláum himni, fjórskiptu grænu þaki og litríkum reitum.',
 'Everyone arrives for work':'Allir mæta til starfa',
 'Children are collected and checked in':'Börnin eru sótt og skráð inn',
 'Outdoor time':'Útivist',
 'Activity stations open':'Stöðvar opna',
 'Activity stations close':'Stöðvar loka',
 '13:30 · We prepare our spaces and get ready to welcome the children.':'13:30 · Við undirbúum rýmin og búum okkur undir að taka á móti börnunum.',
 '14:00 · A warm welcome, a quick check-in, and then outside.':'14:00 · Hlýjar móttökur, skráning og svo út að leika.',
 '14:00–14:45 · Fresh air and shared play; the youngest group settles indoors.':'14:00–14:45 · Ferskt loft og sameiginlegur leikur; yngsti hópurinn finnur sinn stað inni.',
 '14:45 · Time to create, explore and find a favourite activity.':'14:45 · Tími til að skapa, kanna og finna eitthvað skemmtilegt að gera.',
 '15:45 · We tidy up together and head outside.':'15:45 · Við göngum frá saman og förum út.',
 '15:45–16:30 · We play outside and say goodbye as families arrive.':'15:45–16:30 · Við leikum úti og kveðjum börnin þegar þau eru sótt.',

 'Break':'Hlé','Restart afternoon':'Byrja daginn aftur','Game controls':'Stjórnun leiks','Day timeline':'Tímalína dagsins',
 'The first dining guide stays inside. The other dining guides help outdoors before 14:45 and from 15:45.':'Fyrsti leiðbeinandinn í matsal er inni. Hinir leiðbeinendurnir aðstoða í útivist fyrir 14:45 og frá 15:45.',
 'One guide inside; the others help outdoors.':'Einn inni; hinir aðstoða í útivist.',
 'Play day':'Spila dag','Roles':'Hlutverk','Local time':'Tíminn núna','Guides':'Leiðbeinendur',
 'A place to belong at Túngata · The after-school game':'Griðarstaður við Túngötuna · Spilið frístund',
 'Let’s walk through our day':'Förum í gegnum daginn okkar',
 'One school. Different people. One team.':'Eitt hús. Ólíkir einstaklingar. Einn stór hópur.',
 'Display mode ↗':'Sýna á skjá ↗','Exit display ×':'Loka sýningarham ×','Game sections':'Hlutar spilsins',
 'A PLACE TO BELONG · TÚNGATA':'GRIÐARSTAÐUR VIÐ TÚNGÖTUNA','LOCAL TIME':'TÍMINN NÚNA',
 '✳ Safety, wellbeing and shared responsibility.':'✳ Öryggi, velferð og sameiginleg ábyrgð.',
 'Saved in this browser.':'Vistast í þessum vafra.','Could not save. Keep this page open.':'Ekki tókst að vista. Haltu síðunni opinni.',
 'Close schedule':'Loka dagskrá','Close ×':'Loka ×','Team & roles':'Hópurinn og hlutverkin','The Game':'Leikurinn',
 'One team. Many roles.':'Einn hópur. Mörg hlutverk.','The school comes to life.':'Skólinn lifnar við.',
 'Choose today’s team and move their names onto the roles. Together, we make it work.':'Veldu hóp dagsins og færðu nöfnin á hlutverkin. Saman látum við þetta ganga upp.',
 '111 children. Five colours. Your team, following the afternoon from arrival to home time.':'111 börn. Fimm litir. Hópurinn þinn fylgir deginum frá mætingu til heimferðar.',
 'Drag a name to a role, or tap a name and then its destination.':'Dragðu nafn á hlutverk eða veldu nafn og svo stað.',
 'Our roles':'Hlutverkin okkar','Guide':'Leiðbeinandi','Drag to a role':'Dragðu á hlutverk','Everyone has a role.':'Öll nafnspjöld komin á sinn stað.',
 '↶ Return here':'↶ Til baka','Staff name':'Nafn starfsmanns','Enter a name…':'Skrifaðu nafn…','Enter a name.':'Skrifaðu nafn.',
 '＋ Add':'＋ Bæta við','Here today':'Með í dag','Photo':'Mynd','Remove photo':'Fjarlægja mynd','Needs staff':'Vantar leikmann',
 'Each name has one place. Each role can have several guides.':'Hvert nafnspjald á einn stað. Hvert hlutverk getur haft marga leiðbeinendur.',
 'Enter the game →':'Inn í leikinn →','The name card has moved.':'Nafnspjaldið hefur verið fært.',
 'The name card is back under Guide.':'Nafnspjaldið er aftur undir Leiðbeinandi.',
 'Select a name first to return it to Guide.':'Veldu fyrst nafnspjald til að færa aftur undir Leiðbeinandi.',
 'ROLE SCHEDULE':'DAGSKRÁ HLUTVERKS','Registration schedule.':'Dagskrá skráningar.',
 'Suggested schedule · adapt to your procedures and staffing.':'Tillaga að dagskrá · samræmið við verklag og mönnun dagsins.',
 'Staff in this role':'Leiðbeinendur í hlutverkinu','Choose staff who are here today.':'Veldu leiðbeinendur sem eru með í dag.',
 'Where can you find us?':'Hvar finnurðu okkur?',
 'Choose a PNG, JPG or WebP photo under 300 KB.':'Veldu PNG, JPG eða WebP mynd undir 300 KB.',
 'Could not read the photo.':'Ekki tókst að lesa myndina.','The board was updated in another window.':'Taflan var uppfærð í öðrum glugga.',
 'Registration':'Skráning','Arts & crafts':'Föndur og fjör','Music & science':'Music and science','Active play':'Stuð',
 'Outdoors':'Úti','Dining hall':'Matsalur','Kindergarten · age 5':'5 ára','Kindergarten':'5 ára','1st grade':'1. bekkur','2nd grade':'2. bekkur','3rd grade':'3. bekkur','4th grade':'4. bekkur',
 'Little Garden · Outdoors':'Litli-garður · Úti',
 'Keep track of arrivals, attendance and departures.':'Halda utan um mætingu og brottför.',
 'Make room for creativity and shared projects.':'Skapa rými fyrir sköpun og sameiginleg verkefni.',
 'Bring children together through music and discovery.':'Tengja börn saman í tónlist og uppgötvunum.',
 'Support play, movement and positive relationships.':'Styðja við leik, hreyfingu og góð samskipti.',
 'Be visible and available in the outdoor area.':'Vera sýnileg og til staðar á útisvæðinu.',
 'Create a welcoming space for food and conversation.':'Skapa notalega umgjörð um mat og samveru.',
 'Provide security and continuity for the youngest group.':'Skapa öryggi og samfellu fyrir yngsta hópinn.',
 'You can find me near the registration board.':'Þú finnur mig nálægt töflunni.',
 'You can find me in Arts & crafts.':'Þú finnur mig í Föndri og fjöri.',
 'You can find me in Music & science.':'Þú finnur mig í Music and science.',
 'You can find me in Active play.':'Þú finnur mig í Stuði.',
 'You can find me outside in the Little Garden.':'Þú finnur mig úti í Litla-garði.',
 'You can find me in the dining hall.':'Þú finnur mig í matsalnum.',
 'You can find me in Kindergarten or outside with the youngest group.':'Þú finnur mig í Kindergarten eða úti með yngsta hópnum.',
 'School simulation':'Frístundahermir','THE AFTER-SCHOOL GAME':'SPILIÐ FRÍSTUND','Play afternoon':'Spila daginn','Pause':'Gera hlé','↺ Restart':'↺ Byrja aftur','Speed':'Hraði',
 'Move through the afternoon':'Ferðastu í gegnum daginn','Simulation time':'Tími í leiknum','♟ Named pieces = your guides':'♟ Nöfn á peðum = leiðbeinendur',
 'The school game board':'Leikborð skólans',
 '111 child pieces in five age colours move between Registration, Kindergarten, the dining hall, Arts and crafts, Music and science, Active play and the Little Garden. Larger named pieces represent your assigned guides. The text below describes the current phase.':'111 barnapeð í fimm árgangslitum fara milli Skráningar, Kindergarten, Matsalar, Föndurs og fjörs, Music and science, Stuðs og Litla-garðs. Stærri peð með nöfnum tákna leiðbeinendurna. Textinn fyrir neðan lýsir stöðu dagsins.',
 'CLASSROOMS · ARRIVALS / HOME':'KENNSLUSTOFUR · MÆTING / HEIMFERÐ','No guide assigned':'Enginn leiðbeinandi',
 'OUT TO THE GARDEN':'ÚT Í GARÐ','SHARED CORRIDOR':'SAMEIGINLEGUR GANGUR','What the guides are doing':'Hvað leiðbeinendurnir eru að gera',
 'Everyone home':'Öll komin heim','The school is quiet. The team has finished the afternoon.':'Það er hljótt í skólanum. Hópurinn hefur lokið deginum.',
 'Final check':'Lokayfirferð','Reconcile the register, check the spaces and say the last goodbyes.':'Stemmið af skráninguna, yfirfarið rýmin og kveðjið síðustu börnin.',
 'Home time':'Heimferð','Registration checks departures while the team supports the remaining children.':'Skráning fylgist með brottför á meðan hópurinn styður við börnin sem eru eftir.',
 'Tidy up & head outside':'Frágangur og útivera','The older children join the youngest group in the garden.':'Eldri börnin koma út til yngsta hópsins í garðinum.',
 'Choose your activity':'Veldu þér verkefni','The youngest group goes outside. Older children explore four indoor activities.':'Yngsti hópurinn fer út. Eldri börnin velja á milli fjögurra innistöðva.',
 'Play & settle in':'Leikum og finnum okkar stað','Older children play outdoors; the youngest group stays in Kindergarten.':'Eldri börnin leika úti; yngsti hópurinn er í Kindergarten.',
 'Welcome, everyone':'Velkomin öll','Classes arrive through Registration and the guides help children find their group.':'Bekkirnir fara í gegnum Skráningu og leiðbeinendurnir hjálpa börnunum að finna hópinn sinn.',
 'Collect the classes':'Sækjum bekkina','Guides prepare to welcome children and support the handover.':'Leiðbeinendur búa sig undir að taka á móti börnunum og styðja við afhendingu.',
 'Prepare together':'Undirbúum okkur saman','The guides review the afternoon, set up their areas and get ready for the children.':'Leiðbeinendur fara yfir daginn, undirbúa svæðin og búa sig undir komu barnanna.'
};
icelandicUI['Current guide activities']='Leiðbeinendur að störfum núna';
for(const entries of Object.values(roleActivities))for(const [en,is] of entries)icelandicUI[en]=is;
const icelandicSchedules={
 skraning:[
 'Mæti til starfa. Fer yfir barnalistann og atriði sem þarf að ræða í upphafi dags.',
 'Aðstoða við uppsetningu og annan undirbúning.',
 'Geri klárt fyrir að sækja bekki.',
 'Tek á móti bekknum og skrái börnin inn. Kynni dagskrá dagsins og spjalla við þau á leiðinni í útivistina.',
 'Öll eldri börn eru komin út. Aðstoða á ganginum, fer yfir skráningu bekkjanna og stemmi töfluna af.',
 'Aðstoða börnin við skráningu á stöðvar og kynni smáatriði dagsins.',
 'Hjálpa börnum að vera á stöðvum eða finna eitthvað við hæfi. Yfirfer sameiginleg rými, heilsa foreldrum og kveð börnin.',
 'Fer yfir skráninguna og stemmi af í lok dags.',
 'Geng frá töflunni og kveð síðustu börnin. Hef samband við foreldra ef sækja þarf barn, samkvæmt verklagi.',
 'Lýk vakt þegar öll börn hafa verið sótt eða ábyrgð afhent samkvæmt verklagi.'
 ],
 fondur:[
 'Fer yfir daginn með hópnum og vel sköpunarverkefni sem ólík börn geta tekið þátt í.',
 'Tek fram pappír, liti, perlur eða leir og undirbý vinnusvæðið.',
 'Aðstoða við að sækja bekki samkvæmt verkaskiptingu.',
 'Tek á móti börnum og styð við ferðina út.',
 'Aðstoða í útivist og býð börnum að prófa sköpunarverkefni síðar um daginn.',
 'Opna stöðina, kynni efniviðinn og sýni hvernig gengið er frá.',
 'Aðstoða við sköpun, tengi börn með sameiginleg áhugamál og gef hugmyndum þeirra rými.',
 'Ljúkum verkefnum saman, merkjum verk og göngum frá efniviði áður en farið er út.',
 'Aðstoða við útiveru og brottför barnanna.',
 'Fer yfir vinnusvæðið og miðla því sem þarf að undirbúa fyrir næsta dag.',
 'Lýk vakt samkvæmt verkaskiptingu og verklagi.'
 ],
 music:[
 'Fer yfir daginn og vel tónlistar- eða uppgötvunarverkefni.',
 'Yfirfer búnað, undirbý efnivið og hugsa um örugga notkun og þægilega hljóðvist.',
 'Aðstoða við að sækja bekki samkvæmt verkaskiptingu.',
 'Tek á móti börnum og fylgi þeim út.',
 'Styð við útileik og kynnist áhugamálum barnanna.',
 'Opna stöðina og kynni verkefni, búnað og sameiginlegar reglur.',
 'Býð upp á tónlist, tilraunir og samvinnu. Hjálpa börnum að skiptast á og prófa sig áfram.',
 'Geng frá búnaði með börnunum og styð við ferðina út.',
 'Aðstoða við útiveru og brottför.',
 'Tryggi að búnaður sé frágenginn og miðla hugmyndum fyrir næsta dag.',
 'Lýk vakt samkvæmt verkaskiptingu og verklagi.'
 ],
 stud:[
 'Fer yfir þarfir hópsins og skipulegg leik sem allir geta fundið leið inn í.',
 'Undirbý leikrými og yfirfer leikefni.',
 'Geri klárt fyrir móttöku bekkja með hópnum.',
 'Tek á móti börnum og aðstoða við ferðina út.',
 'Býð upp á útileik og hjálpa börnum að tengjast hvert öðru.',
 'Opna Stuð og kynni leikmöguleika og mörk rýmisins.',
 'Styð við frjálsan leik og hreyfingu, býð nýjum börnum inn og aðstoða við samskipti.',
 'Geng frá með hópnum og hjálpa börnunum að komast út.',
 'Styð við útileik og róleg lok dagsins.',
 'Fer yfir leikrými og aðstoða við brottför síðustu barna.',
 'Lýk vakt samkvæmt verkaskiptingu og verklagi.'
 ],
 uti:[
 'Fer yfir daginn, veður og verkaskiptingu á útisvæðum.',
 'Yfirfer útisvæðið og tek til leikefni í samræmi við aðstæður.',
 'Samræmi móttöku á útisvæðinu við starfsfólk sem sækir bekki.',
 'Tek á móti börnum úti og minni á mörk svæðisins.',
 'Er sýnileg á svæðinu, styð við leik og tek eftir börnum sem vantar félagsskap.',
 'Samræmi skipti hópa milli inni- og útisvæða og tek á móti yngsta hópnum.',
 'Styð við útileik og fylgist með líðan og þátttöku barnanna.',
 'Tek á móti eldri börnunum sem koma út eftir frágang inni.',
 'Samræmi brottför við Skráningu og hjálpa börnum að finna eigur sínar.',
 'Geng frá útileikefni með hópnum og yfirfer svæðið samkvæmt verkaskiptingu.',
 'Lýk vakt þegar umsjón hefur verið lokið eða afhent samkvæmt verklagi.'
 ],
 matur:[
 'Fer yfir matartíma dagsins og upplýsingar um matarþarfir samkvæmt verklagi.',
 'Undirbý matsal og samræmi fyrirkomulag við samstarfsfólk.',
 'Yfirfer aðstöðu og aðstoða við móttöku samkvæmt verkaskiptingu.',
 'Aðstoða við móttöku barna og kynningu dagsins.',
 'Sinni undirbúningi matar eða styð við útivist samkvæmt verkaskiptingu.',
 'Tek á móti börnum í matsal samkvæmt matartíma hópsins og skapa rólega umgjörð.',
 'Styð við mat og samveru. Hjálpa börnum að finna sæti og góðan félagsskap.',
 'Geng frá með börnunum og aðstoða við ferðina út.',
 'Fer yfir borð og búnað og aðstoða hópinn eftir þörfum.',
 'Lýk frágangi og miðla upplýsingum fyrir næsta dag.',
 'Lýk vakt samkvæmt verkaskiptingu og verklagi.'
 ],
 yngstu:[
 'Fer yfir daginn og upplýsingar sem skipta máli fyrir yngsta hópinn.',
 'Undirbý kunnuglegan leik, efnivið og rólegt svæði.',
 'Samræmi móttöku og afhendingu hópsins við samstarfsfólk.',
 'Tek á móti yngstu börnunum inni, heilsa hverju barni og kynni daginn.',
 'Styð við leik og samveru inni og hjálpa börnum að finna félagsskap.',
 'Aðstoða við klæðnað og fylgi hópnum út. Samræmi umsjón við starfsfólk úti.',
 'Er til staðar í útileik, styð samskipti og gef börnum tíma til að prófa sig áfram.',
 'Styð við samveru þegar eldri börnin koma út og gæti samfellu fyrir yngsta hópinn.',
 'Aðstoða við brottför og miðla upplýsingum til Skráningar.',
 'Kveð síðustu börnin og yfirfer eigur og rými hópsins.',
 'Lýk vakt þegar umsjón hefur verið lokið eða afhent samkvæmt verklagi.'
 ]
};
for(const [id,detail] of Object.entries(roleDetails))detail.schedule.forEach(([,text],i)=>{icelandicUI[text]=icelandicSchedules[id][i];});
function translateUI(source,language='is'){
 if(language==='en')return source;
 const text=source.trim();let translated=icelandicUI[text];
 if(translated===undefined){
  let m;
  if((m=text.match(/^Staff · (\d+) here today · add or edit$/)))translated=`Leikmannahópurinn · ${m[1]} með í dag · bæta við og breyta`;
  else if((m=text.match(/^(\d+) here · (\d+) arriving · (\d+) home$/)))translated=`${m[1]} hér · ${m[2]} á leiðinni · ${m[3]} heima`;
  else if((m=text.match(/^(\d+) years · (\d+)$/)))translated=`${m[1]} ára · ${m[2]}`;
  else if((m=text.match(/^(\d+) guides?$/)))translated=`${m[1]} ${m[1]==='1'?'leiðbeinandi':'leiðbeinendur'}`;
  else if((m=text.match(/^Child (\d+) · (Kindergarten|[1-4](?:st|nd|rd|th) grade)$/)))translated=`Barn ${m[1]} · ${icelandicUI[m[2]]}`;
  else if((m=text.match(/^Child (\d+) · age (\d+)$/)))translated=`Barn ${m[1]} · ${m[2]} ára`;
  else if((m=text.match(/^Saved in this browser · (.+)$/)))translated=`Vistað í þessum vafra · ${m[1]}`;
  else if((m=text.match(/^(.+): open schedule$/)))translated=`${icelandicUI[m[1]]||m[1]}: opna dagskrá`;
  else if((m=text.match(/^(.+) ↗$/))&&icelandicUI[m[1]])translated=icelandicUI[m[1]]+' ↗';
  else if((m=text.match(/^No guide assigned · (.+)$/)))translated=`Enginn leiðbeinandi · ${m[1]}`;
  else if((m=text.match(/^Move (.+)$/)))translated=`Færa ${m[1]}`;
  else if((m=text.match(/^Choose a photo for (.+)$/)))translated=`Velja mynd fyrir ${m[1]}`;
  else if((m=text.match(/^Place selected staff member in (.+)$/)))translated=`Setja valinn leiðbeinanda í ${icelandicUI[m[1]]||m[1]}`;
  else if((m=text.match(/^(.+) selected · choose a role or Guide\. Tap the name again to cancel\.$/)))translated=`${m[1]} valið · veldu hlutverk eða Leiðbeinandi. Smelltu aftur á nafnið til að hætta við.`;
  else if((m=text.match(/^(.+) added to the team\.$/)))translated=`${m[1]} bætt við hópinn.`;
  else if(text.startsWith('Illustrative school layout and age split, not live attendance.'))translated=text
   .replace('Illustrative school layout and age split, not live attendance. 1× = one simulated minute per second.','Skýringarmynd og áætluð aldursskipting, ekki rauntímaskráning. 1× = ein mínúta í leiknum á sekúndu.')
   .replace(/(\d+) roles have no guide — assign your team in Team & roles\./,'$1 hlutverk vantar leiðbeinanda — úthlutaðu hlutverkum í Hópurinn og hlutverkin.')
   .replace('All seven roles have guides.','Öll sjö hlutverkin eru mönnuð.')
   .replace('Unassigned guides remain in the Guide list.','Leiðbeinendur án hlutverks eru áfram á Leiðbeinandalistanum.');
 }
 return translated===undefined?source:source.replace(text,()=>translated);
}
let interfaceLanguage='is';
try{if(localStorage.getItem('fristundaspil-language')==='en')interfaceLanguage='en';}catch{}
function uiText(text){return translateUI(text,interfaceLanguage);}
if(typeof MutationObserver!=='undefined'){
 const sources=new WeakMap();
 const attrs=['aria-label','title','placeholder','alt'];
 const logo=document.querySelector('#language-toggle');
 function apply(node,key,read,write){
  const value=read();let entries=sources.get(node);if(!entries){entries={};sources.set(node,entries);}
  if(!entries[key]||entries[key].output!==value)entries[key]={source:value,output:value};
  const entry=entries[key],output=translateUI(entry.source,interfaceLanguage);
  if(output!==value)write(output);entry.output=output;
 }
 function translateNode(node){
  if(node.nodeType===3){
   if(!node.parentElement||node.parentElement.closest('script,style,#language-toggle,[data-user-content],input,textarea'))return;
   apply(node,'text',()=>node.nodeValue,v=>{node.nodeValue=v;});return;
  }
  if(node.nodeType!==1)return;
  if(node.closest('script,style,#language-toggle'))return;
  if(node.hasAttribute('data-default-location'))node.value=translateUI(node.getAttribute('data-default-location'),interfaceLanguage);
  for(const attr of attrs)if(node.hasAttribute(attr))apply(node,attr,()=>node.getAttribute(attr),v=>node.setAttribute(attr,v));
  node.childNodes.forEach(translateNode);
 }
 const observer=new MutationObserver(records=>{
  observer.disconnect();
  for(const record of records){if(record.type==='childList')record.addedNodes.forEach(translateNode);else translateNode(record.target);}
  observe();
 });
 function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});}
 function refresh(){
  observer.disconnect();translateNode(document.body);
  document.documentElement.lang=interfaceLanguage;
  document.title=interfaceLanguage==='is'?'Spilið frístund':'The Game · After-school';
  logo.innerHTML=`<i class="brand-dot" aria-hidden="true"></i><span class="brand-words"><span class="brand-kicker">${interfaceLanguage==='is'?'spilið':'the game'}</span><span class="brand-name">${interfaceLanguage==='is'?'frístund':'after-school'}</span></span><small>${interfaceLanguage==='is'?'EN':'IS'}</small>`;
  logo.setAttribute('aria-label',interfaceLanguage==='is'?'Skipta yfir á ensku':'Switch to Icelandic');
  logo.title=logo.getAttribute('aria-label');
  observe();
 }
 logo.addEventListener('click',()=>{
  interfaceLanguage=interfaceLanguage==='is'?'en':'is';
  try{localStorage.setItem('fristundaspil-language',interfaceLanguage);}catch{}
  refresh();updateGameClock();
 });
 refresh();updateGameClock();
}
