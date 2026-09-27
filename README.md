# Frístund — The game

Opnaðu `index.html` í vafra. Engin uppsetning, nettenging eða byggingarskref eru nauðsynleg. Fyrir staðbundna vefþjónustu má keyra `python3 -m http.server 8000` í möppunni og opna `http://localhost:8000`.

Sex kaflar kynna mætingu, svæði, starfsfólk, samveru og brottför. Svör og könnun kortsins halda utan um framvindu á meðan síðan er opin. Ferðin er hönnuð fyrir um fimm mínútna lestur og leik, án tímamarka. Endurhleðsla byrjar nýja ferð.

Breiðir skjáir sýna tvær síður samhliða. Á mjóum skjám raðast þær lóðrétt. CSS nýtir viewport segments þegar vafrinn styður upplýsingar um tvískiptan skjá. Það þarf að prófa sérstaklega á raunverulegu samanbrjótanlegu tæki.

## Efni og útlit

Frumteikningar eru varðveittar. Léttari afrit í `assets/` eru notuð í síðunni. Gagnvirka SVG-kortið er einföld, myndræn túlkun en ekki nákvæmur grunnflötur. Grænir litir tengja saman Föndur og fjör og Music and science á korti og í hlutverkalista.

Sjö lykilhlutverk eru kynnt: Skráning, Föndur og fjör, Music and science, Stuð, Úti, Matsalur og Kindergarten (5 ára). Matsalur er samkomurými fyrir afslöppun og ærslagang. Enginn fastur heildarfjöldi starfsfólks er birtur.

Kortið hefur fjóra tíma: 14:00 eru eldri börn úti og Kindergarten inni á bleika svæðinu; 14:45 fer Kindergarten út og eldri börnin velja innistöðvar; 15:45 er frágangur og ferð út; 16:30 er lokað og kortið tómt. Hringir tákna árganga: 5 ára bleikt, 6 ára blátt, 7 ára grænt, 8 ára appelsínugult og 9 ára fjólublátt. Litaðir ferhyrningar tákna lykilhlutverk. Kindergarten er áfram sýnt úti kl. 15:45, þegar eldri börnin bætast við eftir frágang. Fjöldi tákna er myndræn framsetning, ekki raunveruleg talning. Dreifing einstakra hlutverka er kynningartillaga, ekki staðfest mönnunaráætlun. Tímar, staðsetningar og texti eru í `day.js`.

KN Yuanmo SC er hlaðið úr `KNYuanmo-Regular.ttf`. Letrið inniheldur íslenska séríslenska stafi og virkar án nettengingar.

## Yfirferð

JavaScript-málskipan í `app.js` og `day.js` stenst yfirferð. Gagnapróf staðfesta aðskilda útivistartíma Kindergarten og eldri barna kl. 14:00 og 14:45, árganga­liti og dreifingu sjö hlutverka, ferð út kl. 15:45 og tómt kort kl. 16:30. Staðbundnar skráatilvísanir og íslenskar leturtáknmyndir voru yfirfarnar. Chrome-sjónprófun gat ekki keyrt vegna aðgangstakmarkana keyrsluumhverfisins; sjónprófun í vafra og á raunverulegu tvískjáartæki er eftir.

## Tungumál

Smellur á merkið skiptir milli íslensku og ensku. Í ensku er merkið „after-school / LEIKURINN“. Valinn kafli, tími, svör og skoðaðir staðir haldast. Tungumálaval vistast í localStorage þegar vafrinn leyfir það. Þýðingar eru í `translations.js`; `language.js` þýðir sýnilegan texta og aðgengismerkingar, þar á meðal nýjan texta eftir samskipti. Frumtexti er varðveittur svo hægt sé að skipta aftur á íslensku. Engin netþjónusta er notuð.

Þýðingar allra tímalýsinganna, breytilegrar framvindu og kaflamerkinga hafa verið yfirfarnar með keyrsluprófum. Tungumálaskipti og endurheimt íslensks texta hafa verið prófuð með DOM-líkani; sjónprófun í raunverulegum vafra er eftir.

## Thrividdarkort

Nýtt sjálfstætt Three.js-gönguverkefni er í [`thrividdarkort/`](thrividdarkort/README.md). Ræstu staðbundinn vefþjón og opnaðu `/thrividdarkort/`. Tengill neðst í bæklingnum opnar það. Grunnmynd aðalhæðar er rakin eftir opinberum uppdrætti, með áætluðum viðbótum sem eru tilgreindar í heimildayfirliti. [Grunnhugsun framtíðarhermunar](thrividdarkort/FUNDAMENTALS.md) er í sérstöku skjali.
