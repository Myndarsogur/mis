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

## The Game · After-school

Open [`fristundaspil/index.html`](fristundaspil/index.html), or serve the repository and visit `/fristundaspil/`. The app works without dependencies or external services. Click the green-dot wordmark to switch between Icelandic and English without resetting the simulation. Icelandic is the default; the language choice is saved. Headings use the local KN Yuanmo SC font.

### Team and roles

Use **Roles** in the toolbar to manage staff. Names move between the Guide list and role cards rather than duplicate. A person has one role; a role can have several people. Mouse and touch dragging and tap-name-then-destination are supported. Photos are optional PNG/JPG/WebP files under 300 KB. Click a role to open its simplified schedule card.

Staff, assignments, photos and custom notes persist in localStorage. Windows on the same origin and browser receive assignment updates. There is no cross-device service. Legacy staff data is retained; duplicate legacy assignments resolve to the first role in board order. Simulation progress is temporary.

### Playback and the board

The top toolbar contains the simulated analogue/digital clock, Play afternoon / Break, a small restart icon, and speeds in the order **4×, 8×, 16×, 1×**, with 4× as the default. Playback can be started directly from the role view. Opening Roles or a schedule pauses the simulation. No device-time clock or expandable guide-duty panel is displayed.

Below the toolbar are the current day heading, a short description, the time slider and the age-group legend. The heading follows the requested schedule:

- 13:30: everyone arrives for work.
- 14:00: children are collected and checked in; from 14:01 the heading reads Outdoor time until 14:45.
- 14:45: activity stations open.
- 15:45: activity stations close; from 15:46 the heading reads Outdoor time until closing.
- 16:30: everyone is home.

The heading and description update during playback and seeking, in either language. Arrival and station-closing messages are displayed for their first simulated minute before switching to outdoor time.

Seven irregular, rounded colour areas adapt to the actual remaining screen space. Desktop places the garden alongside the indoor spaces; portrait layouts place it below them. The SVG view box matches the available aspect ratio so text and pieces retain their proportions. Each area has a short activity sentence. Named guide pieces wear their role colours and move according to their schedules; there are no fixed staff-name lists inside the areas.

There are exactly **111 child pieces**: 23 pink (Kindergarten / 5 ára), and 22 each in blue (1st grade / 1. bekkur), green (2nd grade / 2. bekkur), orange (3rd grade / 3. bekkur) and purple (4th grade / 4. bekkur). The age split and school layout are illustrative, not live attendance or a measured floor plan.

Children arrive through Registration, then settle in Kindergarten or outdoors. At 14:45 the youngest group goes outside and older children rotate through indoor activities. At 15:45 the older children return outside; departures run until 16:30. Dining staffing is split: the first guide stays inside, while the other dining guides help outdoors before 14:45 and from 15:45. With three assigned dining guides, this means one inside and two outside at the start and end.

### Validation

Run `node --test fristundaspil/tests/app.test.cjs`. Tests cover migration, assignments, schedules, translation, the 111-piece population, transitions, closing, guide routes, dining staffing, toolbar controls, day headings and responsive geometry.

Chrome checks cover playback, Break, restart, time seeking, schedule dialogs, language switching and full-canvas board layout at 1440×900, 1280×720, 390×844 and 320×568, with no browser errors. Physical-device touch testing remains separate.

The simulation and layout are in `fristundaspil/game.js`, schedules and short activity text in `schedules.js`, and Icelandic translations in `language.js`.

Role dialogs show the role title, a matching illustration, location and full schedule. All seven roles have warm, simple illustrations with accessible descriptions in Icelandic and English. Images are in `fristundaspil/assets/`; the exact built-in image generation prompts are recorded in [the illustration manifest](fristundaspil/assets/role-illustrations.prompts.md) and [the registration prompt](fristundaspil/assets/registration-guide.prompt.md). Schedule times use KN Yuanmo SC while description text retains Arial. Names are assigned from the main role board, and custom locations remain visible.
