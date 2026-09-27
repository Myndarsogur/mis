# Hvað drífur daginn áfram?

Fyrst kemur **rýmið**. Dagurinn er röð athafna sem fara fram á tilteknum stöðum, með fólki sem þarf að komast á milli þeirra. Klukkan ein og sér flytur engan; leið þarf að vera til staðar og aðgengileg.

## 1. Staðir og tengingar

Rými fær auðkenni, útlínu, hæð og dyr. Garður og skólalóð eru líka rými. Hurð er tenging milli staða með stöðu, breidd og mögulegum aðgangsreglum. Veggir, gluggar og lokuð hurð hindra göngu. Gluggi leyfir útsýni, ekki ferð milli rýma.

Í frumgerðinni eru útlínur í `layout.js`, árekstrar í `physics.js` og hurðarástand í `world.js`. Hreyfing í síma og með lyklaborði fer um sama árekstrakerfi. Því þarf ekki að viðhalda tveimur mismunandi útgáfum húsnæðisins.

## 2. Heimildir áður en hegðun er byggð

Hvert mikilvægt mál á að eiga sér heimild eða vera merkt áætlun. Næst þarf að ganga með raunverulegan staðkunnugan notanda í gegnum kortið og staðfesta:

1. Núverandi stofur, notkun þeirra og heiti.
2. Réttar dyr, tengingar og hvaða inngangar eru notaðir í frístund.
3. Hæðarmun, tröppur, stiga, efri hæðir og raunhæfar ferðaleiðir.
4. Mörk skólagarðs, hlið, leiktæki og sjónlínur starfsfólks.
5. Aðgengileg rými kirkjunnar og hvort börn fari inn í hana í hermuninni.

Þessar staðfestingar eru forsenda þess að kalla daghermunina trúverðuga eftirmynd. Núverandi líkan er rýmisfrumgerð og gönguprófun.

## 3. Fólk og athafnir koma næst

Barn hefur staðsetningu, hóp, næstu athöfn og áfangastað. Starfsmaður hefur staðsetningu, hlutverk og verkefni. Þau þurfa gönguleið um staðfestar dyr áður en þau geta breytt um stað. Síðar bætast við leiðaleit, bið við dyr og fylgd hópa.

Dæmi um atburðarás er `sækja hóp → safna saman → ganga að dyrum → ganga í garð → staðfesta komu`. Þetta er áætluð hegðun fyrir næsta verkefni; hún er ekki virk í kortinu enn.

## 4. Klukka og reglur

Hermunarklukkan býr síðar til verkefni: sækja í stofur, útivist, stöðvaval, hressing, frágangur og brottför. Reglurnar vísa í auðkenni rýma, ekki sjónræna liti eða hnit sem eru skrifuð inn víða. Litir hjálpa notandanum að skilja; rýmisgögn og atburðir stýra kerfinu.

## 5. Tenging við núverandi leik

Bæklingurinn og kortið hafa tengla sín á milli. Núverandi tímabil og árganga­liti má síðar flytja í sameiginlegt gagnalag. Kortið birtir nú `window.thrividdarkort` með `getState()`, `goTo(id)` og `events`. Atburðir eru `zoneenter`, `doorchange`, `relocate` og `modechange`; þeir eru einnig sendir á `window` með forskeytinu `thrividdarkort:`.

```js
window.addEventListener('thrividdarkort:zoneenter', ({ detail }) => {
  // Síðar: merkja komu barns eða hóps á staðfestan áfangastað.
  console.log(detail.zone, detail.position);
});
```

API-ið er fyrir tengingu framtíðarhermunar. Ekki eru vistuð persónugögn og engin raunveruleg börn eru skráð. Næsta tækniskref er útgáfustýrt rýmisskema með föstum hurðaauðkennum, rýmistengingum og leiðaleit sem tekur mið af hurðarástandi. Innri hurðanúmer frumgerðarinnar geta breyst þegar veggir eru lagfærðir.
