# Frístundahermirinn

Sjálfstæð síða sem endurnýtir rými, rúmfræði og árekstragögn úr `../thrividdarkort/`.

Ræstu `python3 -m http.server 8000` í rót verkefnisins og opnaðu http://localhost:8000/fristundahermirinn/.

Spila / hlé, endurræsing, hraðaval og tímasleði stjórna deginum frá 14:00 til 16:30. Draga má til að snúa kortinu og skruna til að breyta aðdrætti. Hermunin byrjar í hléi.

Forsendur hópastærða og dagskrár eru í `simulation.js` og birtast einnig á síðunni. Kindergarten og 5 ára eru einn bleikur hópur með 26 börnum, 13 í hvorri upphafsstofu. 1. bekkur hefur 24 blá börn, 2. bekkur 24 græn, 3. bekkur 23 appelsínugul og 4. bekkur 14 fjólublá. Heildarfjöldinn er áfram 111. Frá 14:00 til 14:45 eru 3. og 4. bekkur í Stóra garði milli skóla og kirkju. Börn í 1. og 2. bekk koma niður af 2. hæð í Litla garð kl. 14:00. Frjálst val allra hópa innandyra eftir 14:45 er aðeins í myndlistastofu, 1. bekk, 2. bekk, matsal og 2nd grade. Stofur 3. og 4. bekkjar, smíðastofa og 1st grade eru ekki valstöðvar. Kindergarten og 5 ára fara í Litla garð kl. 14:45; alls eru þá 31 barn úti og 80 á stöðvum. Börn á stöðvum skipta um stofur á dreifðum tímum eftir 15:02 og 15:18. Matsalur er gulur; myndlistastofa og smíðastofa hafa milda appelsínuliti. Stofur 3. og 4. bekkjar halda appelsínugula og fjólubláa litnum.

Kl. 15:42 hefst sameining í Litla garði. Kl. 15:45 eru þar 40 börn og 8 starfsmenn eftir; enginn er eftir kl. 16:30. Brúni kubburinn hefur verið fjarlægður.

Litli garður notar sameiginleg mörk og búnað úr `thrividdarkort/layout.js` (`smallGarden`). Hann er malbikaður frá húsveggjum að línu húsendans, með grænni girðingu og opnu hliði, afgirtu tré, rólum báðum megin og bekkjum við minna gámahús. Afstaða og vinnumál eru áætluð eftir lýsingu notanda. Girðingar, bekkir og rólur hafa áhrif á gönguleiðir barnanna.

`motion.js` tengir garðana við hreyfingu. Börnin fara á milli leikpunkta innan síns svæðis, með mismunandi hraða og stuttum pásum. Starfsmenn fara hægar. Ferðir milli rýma fylgja samfelldum gönguleiðum; staðbundinn leikur helst innan viðkomandi stofu eða garðs. Leiðir eru reiknaðar á 0,5 m reitum með veggjum, opnum dyrum og húsgögnum upprunalega kortsins. Staða ræðst af tíma dags, svo hlé og tímasleði endurskapa sömu hreyfingu. Þetta er skýringarhermun, ekki mannfjölda- eða öryggisgreining. Kubbar halda hópalit sínum; starfsmenn eru stærri með ljósum toppi. Engin persónugögn eru notuð.

Próf: `node --test fristundahermirinn/tests/*.test.mjs thrividdarkort/tests/*.test.mjs` úr rót.

Önnur hæð kemur úr sameiginlegu `thrividdarkort/upper-floor.js`: 1. bekkur er yfir Kindergarten, 2. bekkur yfir 5 ára, 1st grade yfir myndlistastofu og 2nd grade yfir smíðastofu. 1. bekkur skiptist 12/12 milli 1. bekkjar og 1st grade; 2. bekkur 12/12 milli 2. bekkjar og 2nd grade. Hæðin (3,4 m) og tveir stigar eru áætluð, ekki staðfest mæling.

`floor-router.js` tengir leiðaleit á hvorri hæð við stigana. Hæð breytist aðeins í skilgreindum stigum. Leikleiðir á efri hæð forðast opin yfir stigunum. Hæðaval sýnir báðar hæðir, jarðhæð eða börn/stofumerkingar á efri hæð. Það breytir ekki hermunartíma eða talningu barna. Yfirlit upprunalega þrívíddarkortsins notar sömu efri hæð; göngusýn þess helst á jarðhæð.

Í horninu sem snýr að nágrannahúsunum er sandkassi með viðarkanti og við hliðina lítill kastali, um 1,6 × 1,6 m, ætlaður sem tveggja barna pallur með súlu og litlum klifurvegg. Á miðju malbiksins er flöt, máluð 12 arma stjarna. Staðsetning og stærðir búnaðar eru áætluð samkvæmt lýsingu notanda. Kastali og sandkassakantar hindra gönguleiðir; stjörnumálningin gerir það ekki.

Ný afstaða Litla garðs: græna hliðið snýr að götunni en stendur í línu við húsendann (x≈27,41), hvít girðing skilur nálægari heimili frá leiksvæðinu. Afgirt tré og bæði rólusett eru saman í fjærhorninu við smíðastofuna. Búnaður við húsagirðinguna er færður 1,5 m til hægri. Tvö lítil færanleg fótboltamörk í bilinu að hliðinu snúa nú 90° frá fyrri afstöðu, eftir lengd svæðisins. Hliðið hefur opnar grindur og greið gönguleið er fram hjá mörkunum. Stjarnan helst á upprunalega staðnum [8, -16,8]. Öll afstaða er enn áætluð eftir lýsingu notanda.
