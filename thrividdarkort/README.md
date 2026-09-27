# Thrividdarkort · Landakot

Sjálfstætt HTML5 / Three.js-verkefni og rýmisgrunnur fyrir væntanlega hermun frístundardags. Tengill í frístundarbæklingnum opnar kortið; bakhnappur kortsins fer aftur í bæklinginn.

## Keyrsla

Í aðalmöppu Frístundar:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Opnaðu `http://localhost:8000/thrividdarkort/`. ES-einingar þurfa HTTP-vefþjón; að tvísmella HTML-skrána með `file://` keyrir ekki þrívíddina. Three.js 0.180.0 og leyfisskrá fylgja í `vendor/`; engin CDN-tenging eða uppsetning npm-pakka þarf fyrir leikinn. WebGL 2 er nauðsynlegt.

## Notkun

- **Yfirlit:** dragðu til að snúa; skrun eða +/− breytir aðdrætti. Þök og aðra hæð má sýna eða fela.
- **Ganga:** W/A/S/D, eða örvar. Dragðu á sviðinu til að líta um. Músarsýn læsir músinni; Esc sleppir henni.
- **Sími:** stýripinni vinstra megin fyrir göngu og dráttur á sviðinu fyrir sjónarhorn. Hægt er að nota bæði samtímis. +/− fyrir aðdrátt í yfirliti.
- **Dyr:** E eða hnappurinn sem birtist við nálægar dyr. Dyr opnast og lokast og hafa áhrif á leiðir.
- **Upphafsstaðir:** færa notanda beint á valinn stað. Þetta er könnunartæki, ekki sjálfvirk leiðsögn.

## Hvað er staðfest og hvað er áætlað?

Grunnmyndin er rakin og einfölduð út frá opinberum uppdrætti frá 2018, ekki tilbúin rétthyrnd skólabygging. Átta metra og þrjátíu sentímetra mál á suðurálmu er kvarðaviðmið: 205 px í 1872 px breiðri birtingu teikningarinnar. Eining í líkaninu er metri. Veggskot, þjónusturými og smærri op eru einfölduð. Tracing eftir forskoðunarmynd er ekki mæling á vettvangi.

Gámahúsið hefur verið fært að staðnum þar sem tréð var áður í líkaninu og minnkað verulega í áætlað 3,2 × 3 m vinnulíkan samkvæmt lýsingu notanda. Þau mál eru ekki mæld eftir uppdrætti. Eldri uppdráttur 2022 er áfram í heimildum en lýsir ekki nýju vinnumálunum. Litli garður nær frá veggjum skólans að línu húsendans. Malbik, græn girðing með opnu hliði, afgirt tré á móti smíðastofu, tvö rólusett og bekkir við gámahúsið fylgja sömu lýsingu. Það er **ekki staðfest núverandi grunnmynd**.

Afstaða kirkju, skóla og garðs byggir á afstöðumynd. Kirkjan er einfölduð bygging með áætluðu innra skipulagi. Hæðir, gluggaskipan, húsgögn, leikbúnaður, tré og nákvæm götumörk eru áætluð. Önnur hæð yfir vesturálmunum hefur fjórar stofur og tvo áætlaða stiga. Hún birtist í yfirliti kortsins og er notuð fyrir ferðir barna í Frístundaherminum. Göngusýn þessa korts er áfram á jarðhæð. Aðalhæð, lóð og kirkjugólf eru flöt í þessari útgáfu; þrep, raunhæðir og aðgengi bíða staðfestingar.

Allt sýnilegt í þrívíddinni er búið til úr rúmfræði, án ljósmyndatexta eða myndflata. Grunnkortið er SVG. Uppdrættirnir í `reference/` eru heimildir, ekki áferð á þrívíddarlíkaninu.

Uppruni hvers skjals og dagsetning er í `reference/sources.json`. Teikningarnar eru úr [Skjalasafni Reykjavíkur, landnúmer 101147](https://skjalasafn.reykjavik.is/fotoweb/archives/5000-A%C3%B0aluppdr%C3%A6ttir/?q=202%3A101147). Samanburður á lóð: [deiliskipulagsgögn Reykjavíkurborgar](https://fundur.reykjavik.is/sites/default/files/agenda-items/tungata.pdf). Aðalinngangur við Túngötu: [Landakotsskóli, Inngangar og aðkoma](https://www.landakotsskoli.is/allar-frettir/inngangar-og-adkoma-1).

## Uppbygging

- `layout.js`: kvarði, útlínur, rými, veggir, dyr og upphafsstaðir. Viðhald rýmisgagna á að byrja hér.
- `upper-floor.js`: sameiginleg rýmisgögn, gólf, stofudyr, stigatengingar og rúmfræði annarrar hæðar. Hæð og stigar eru áætluð.
- `world.js`: býr til þrívídd, hurðir og árekstraveggi. Óhreyfanleg rúmfræði er sameinuð til að fækka teikniköllum.
- `physics.js`: lítil, óháð göngueðlisfræði. Þrepaskipt hreyfing kemur í veg fyrir að ganga í gegnum veggi þegar rammatíðni lækkar.
- `main.js`: sjónarhorn, lyklaborð/snerting, dyr og notendaviðmót.
- `FUNDAMENTALS.md`: rýmisgrunnur og næsta stig dagshermunarinnar.

## Prófanir

```sh
node --test thrividdarkort/tests/*.test.mjs
```

Prófin athuga glufur í veggjum, lokaðar/opnar dyr, árekstra, upphafsstaði og samfellda aðgengilega leið að öllum helstu rýmum og áfangastöðum. Þau staðfesta virkni líkansins, ekki að það samsvari núverandi húsnæði.

Chrome-prófun notar tölvustærð og hermda símastærð, WebGL, lyklaborð og snertiatburði. Raunveruleg iOS-/Android-tæki og samanbrjótanlegir skjáir þurfa enn eigin prófun.

Í horninu sem snýr að nágrannahúsunum er sandkassi með viðarkanti og við hliðina lítill kastali, um 1,6 × 1,6 m, ætlaður sem tveggja barna pallur með súlu og litlum klifurvegg. Á miðju malbiksins er flöt, máluð 12 arma stjarna. Staðsetning og stærðir búnaðar eru áætluð samkvæmt lýsingu notanda. Kastali og sandkassakantar hindra gönguleiðir; stjörnumálningin gerir það ekki.

Ný afstaða Litla garðs: græna hliðið snýr að götunni en stendur í línu við húsendann (x≈27,41), hvít girðing skilur nálægari heimili frá leiksvæðinu. Afgirt tré og bæði rólusett eru saman í fjærhorninu við smíðastofuna. Búnaður við húsagirðinguna er færður 1,5 m til hægri. Tvö lítil færanleg fótboltamörk í bilinu að hliðinu snúa nú 90° frá fyrri afstöðu, eftir lengd svæðisins. Hliðið hefur opnar grindur og greið gönguleið er fram hjá mörkunum. Stjarnan helst á upprunalega staðnum [8, -16,8]. Öll afstaða er enn áætluð eftir lýsingu notanda.
