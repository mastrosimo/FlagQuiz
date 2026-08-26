import type { LocalizedText } from '../types';

export type CountryFactCategory = 'geography' | 'history' | 'culture' | 'nature' | 'record';

export interface CountryFact {
  text: LocalizedText;
  category: CountryFactCategory;
  source: string;
}

/**
 * Curiosità per Paese, 2-3 per codice ISO, verificate su fonti enciclopediche/
 * istituzionali. Un Paese assente dalla mappa significa "non ancora popolato",
 * non "zero curiosità per scelta".
 */
export const COUNTRY_FACTS: Partial<Record<string, CountryFact[]>> = {
  // ---- Europe ----
  AL: [
    { text: { it: 'L\'Albania si affaccia sia sul Mar Adriatico sia sul Mar Ionio, con l\'Italia a soli 80 km di distanza attraverso l\'Adriatico.', en: 'Albania borders both the Adriatic and Ionian seas, with Italy just 80 km away across the Adriatic.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Circa tre quarti del territorio albanese è montuoso, con le Alpi Albanesi del Nord tra le zone più impervie.', en: 'About three-quarters of Albania is mountainous, with the North Albanian Alps among its most rugged areas.' }, category: 'geography', source: 'Britannica' },
  ],
  AD: [
    { text: { it: 'Andorra è una co-principato governato congiuntamente dal Presidente francese e dal Vescovo spagnolo di Urgell, un assetto in vigore dal 1278.', en: 'Andorra is a co-principality jointly ruled by the President of France and the Spanish Bishop of Urgell, an arrangement in place since 1278.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'La valle del Madriu-Perafita-Claror, Patrimonio UNESCO, occupa circa un decimo del territorio di Andorra.', en: 'The Madriu-Perafita-Claror valley, a UNESCO World Heritage Site, covers about a tenth of Andorra\'s land area.' }, category: 'nature', source: 'UNESCO / Britannica' },
  ],
  AT: [
    { text: { it: 'Insieme alla Svizzera, l\'Austria è considerata l\'unico vero Paese alpino d\'Europa.', en: 'Along with Switzerland, Austria is considered one of the only two true Alpine countries in Europe.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La posizione dell\'Austria all\'incrocio tra la via commerciale del Danubio e i passi alpini ne ha fatto per secoli uno snodo strategico d\'Europa.', en: 'Austria\'s position at the crossroads of the Danube trade route and the Alpine passes made it a strategic hub of Europe for centuries.' }, category: 'history', source: 'Britannica' },
  ],
  BY: [
    { text: { it: 'Circa il 40% del territorio della Bielorussia è coperto da foreste, tra le percentuali più alte d\'Europa.', en: 'About 40% of Belarus is covered by forest, one of the highest proportions in Europe.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'La foresta di Białowieża, Patrimonio UNESCO condiviso con la Polonia, è l\'ultima grande foresta primaria rimasta in Europa e ospita bisonti europei reintrodotti allo stato selvatico.', en: 'The Białowieża Forest, a UNESCO World Heritage Site shared with Poland, is the last large primeval forest remaining in Europe and is home to European bison reintroduced into the wild.' }, category: 'nature', source: 'Britannica / UNESCO' },
  ],
  BE: [
    { text: { it: 'Il Belgio ha tre lingue ufficiali: olandese, francese e tedesco.', en: 'Belgium has three official languages: Dutch, French, and German.' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Bruxelles ospita le sedi dell\'Unione Europea e della NATO, ed è per questo spesso chiamata "la capitale d\'Europa".', en: 'Brussels hosts the headquarters of both the European Union and NATO, earning it the nickname "the capital of Europe".' }, category: 'history', source: 'Britannica' },
  ],
  BA: [
    { text: { it: 'La Bosnia ed Erzegovina ha un accesso al Mare Adriatico di soli circa 20 km, presso la città di Neum.', en: 'Bosnia and Herzegovina has only about 20 km of Adriatic coastline, near the town of Neum.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Sarajevo, la capitale, conserva una forte eredità multiculturale ottomana, visibile nel suo storico bazar di Baščaršija.', en: 'Sarajevo, the capital, preserves a strong multicultural Ottoman heritage, visible in its historic Baščaršija bazaar.' }, category: 'culture', source: 'Britannica' },
  ],
  BG: [
    { text: { it: 'Fondata nel 681 d.C., la Bulgaria è, dopo San Marino, il Paese europeo con il nome rimasto invariato più a lungo nella storia.', en: 'Founded in 681 CE, Bulgaria is, after San Marino, the European country whose name has remained unchanged for the longest time in history.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'La Bulgaria si trova sulla penisola balcanica orientale ed è nota per un patrimonio archeologico tra i più ricchi d\'Europa.', en: 'Bulgaria lies on the eastern Balkan Peninsula and is known for one of the richest archaeological heritages in Europe.' }, category: 'culture', source: 'Britannica' },
  ],
  HR: [
    { text: { it: 'La costa croata si estende per circa 1.800 km ed è costellata da oltre 1.100 isole e isolotti.', en: 'Croatia\'s coastline stretches about 1,800 km and is dotted with more than 1,100 islands and islets.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La regione storica della Dalmazia, lungo la costa adriatica croata, comprende città come Zara, Spalato e Dubrovnik.', en: 'The historic region of Dalmatia, along Croatia\'s Adriatic coast, includes cities such as Zadar, Split, and Dubrovnik.' }, category: 'culture', source: 'Britannica' },
  ],
  CY: [
    { text: { it: 'Cipro è divisa dal 1974 tra la Repubblica di Cipro, riconosciuta a livello internazionale, e il nord, ma l\'intera isola fa formalmente parte del territorio dell\'Unione Europea.', en: 'Cyprus has been divided since 1974 between the internationally recognized Republic of Cyprus and the north, but the whole island is formally part of European Union territory.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Cipro si trova nel Mediterraneo orientale, a circa 64 km dalla costa della Turchia.', en: 'Cyprus lies in the eastern Mediterranean, about 64 km from the coast of Turkey.' }, category: 'geography', source: 'Britannica' },
  ],
  CZ: [
    { text: { it: 'La Cechia comprende le storiche regioni di Boemia e Moravia più parte della Slesia.', en: 'Czechia comprises the historic regions of Bohemia and Moravia, plus part of Silesia.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il Castello di Praga, le cui origini risalgono al IX secolo, occupa circa 45 ettari ed è tra i più grandi complessi castellani antichi al mondo.', en: 'Prague Castle, whose origins date to the 9th century, covers about 45 hectares and is among the largest ancient castle complexes in the world.' }, category: 'history', source: 'Britannica' },
  ],
  DK: [
    { text: { it: 'Il Regno di Danimarca comprende anche la Groenlandia e le Isole Fær Øer, entrambe autonome.', en: 'The Kingdom of Denmark also includes Greenland and the Faroe Islands, both self-governing.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La monarchia danese, fondata nel X secolo dai re vichinghi Gorm il Vecchio e Harald Dente Azzurro, è una delle più antiche al mondo.', en: 'The Danish monarchy, founded in the 10th century by the Viking kings Gorm the Old and Harald Bluetooth, is one of the oldest in the world.' }, category: 'history', source: 'Britannica' },
  ],
  EE: [
    { text: { it: 'Circa metà del territorio dell\'Estonia è ricoperto da foreste.', en: 'About half of Estonia\'s territory is covered by forest.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'L\'Estonia è stata pioniera dell\'e-government: praticamente tutti i servizi pubblici sono disponibili online già dalla fine degli anni \'90.', en: 'Estonia has been a pioneer in e-government: nearly all public services have been available online since the late 1990s.' }, category: 'culture', source: 'e-Estonia.com' },
  ],
  FI: [
    { text: { it: 'La Finlandia conta decine di migliaia di laghi, tanto da essere soprannominata "la terra dei mille laghi".', en: 'Finland has tens of thousands of lakes, earning it the nickname "the land of a thousand lakes".' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La sauna finlandese è iscritta nella Lista del Patrimonio Culturale Immateriale dell\'UNESCO.', en: 'The Finnish sauna is inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity.' }, category: 'culture', source: 'UNESCO' },
  ],
  FR: [
    { text: { it: 'La Francia è, da oltre trent\'anni, il Paese più visitato al mondo dai turisti internazionali.', en: 'France has been the world\'s most visited country by international tourists for more than thirty years.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'Con i suoi territori d\'oltremare, la Francia è il Paese dell\'Unione Europea con la superficie più estesa.', en: 'Including its overseas territories, France is the largest country in the European Union by area.' }, category: 'geography', source: 'Britannica' },
  ],
  DE: [
    { text: { it: 'Con circa 84 milioni di abitanti, la Germania è il Paese più popoloso dell\'Unione Europea.', en: 'With about 84 million people, Germany is the most populous country in the European Union.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Reno scorre dalle Alpi svizzere fino al Mare del Nord attraversando i Paesi Bassi, per circa 1.230 km.', en: 'The Rhine flows from the Swiss Alps to the North Sea through the Netherlands, running about 1,230 km.' }, category: 'geography', source: 'Britannica' },
  ],
  GR: [
    { text: { it: 'La Grecia conta oltre 2.000 isole, di cui solo circa 170 abitate.', en: 'Greece has more than 2,000 islands, only about 170 of which are inhabited.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Nel 507 a.C., ad Atene, nacque la prima democrazia della storia mondiale.', en: 'In 507 BCE, Athens gave rise to the first democracy in world history.' }, category: 'history', source: 'Britannica' },
  ],
  HU: [
    { text: { it: 'Il Danubio attraversa Budapest dividendo la città in due parti, Buda e Pest.', en: 'The Danube runs through Budapest, dividing the city into two parts, Buda and Pest.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Budapest conta oltre 120 sorgenti termali, più di qualsiasi altra capitale al mondo.', en: 'Budapest has more than 120 thermal springs, more than any other capital city in the world.' }, category: 'record', source: 'Britannica-adjacent' },
  ],
  IS: [
    { text: { it: 'L\'Islanda conta circa 200 vulcani di vario tipo e ospita Vatnajökull, il ghiacciaio più esteso d\'Europa.', en: 'Iceland has about 200 volcanoes of various types and is home to Vatnajökull, the largest glacier in Europe.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'La sorgente calda islandese di Geysir ha dato il nome, in inglese, alla parola "geyser".', en: 'Iceland\'s Geysir hot spring gave the English language the word "geyser".' }, category: 'culture', source: 'Britannica' },
  ],
  IE: [
    { text: { it: 'Il soprannome "Isola di Smeraldo" deriva dai paesaggi verdeggianti che caratterizzano l\'Irlanda.', en: 'The nickname "Emerald Isle" comes from Ireland\'s pervasive green landscapes.' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Le Scogliere di Moher, nella contea di Clare, si innalzano per 214 metri sull\'Oceano Atlantico e si estendono per circa 8 km.', en: 'The Cliffs of Moher, in County Clare, rise 214 metres above the Atlantic and stretch for about 8 km.' }, category: 'nature', source: 'Britannica' },
  ],
  IT: [
    { text: { it: 'L\'Italia conta decine di siti Patrimonio dell\'Umanità UNESCO distribuiti in tutto il Paese, dalle Dolomiti alla Costiera Amalfitana.', en: 'Italy has dozens of UNESCO World Heritage Sites spread across the country, from the Dolomites to the Amalfi Coast.' }, category: 'culture', source: 'UNESCO' },
    { text: { it: 'L\'Etna, in Sicilia, con i suoi circa 3.350 metri, è il vulcano attivo più alto d\'Europa ed è a sua volta Patrimonio UNESCO.', en: 'Mount Etna in Sicily, at about 3,350 metres, is Europe\'s tallest active volcano and is itself a UNESCO World Heritage Site.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'La penisola italiana si estende per circa 960 km, delimitata dalle Alpi a nord e dagli Appennini che ne percorrono la spina dorsale.', en: 'The Italian Peninsula stretches about 960 km, bounded by the Alps to the north and the Apennines running down its spine.' }, category: 'geography', source: 'Britannica' },
  ],
  LV: [
    { text: { it: 'Le foreste coprono circa il 54% del territorio della Lettonia.', en: 'Forests cover about 54% of Latvia\'s territory.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Sulla costa baltica della Lettonia si trova ambra, resina fossile di antichi alberi.', en: 'Along Latvia\'s Baltic coast, amber, the fossilized resin of ancient trees, can be found.' }, category: 'nature', source: 'Britannica' },
  ],
  LI: [
    { text: { it: 'Il Liechtenstein è, insieme all\'Uzbekistan, uno dei soli due Paesi al mondo "doppiamente senza sbocco sul mare".', en: 'Liechtenstein is, along with Uzbekistan, one of only two countries in the world that are "doubly landlocked".' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'È il più piccolo Paese di lingua tedesca al mondo.', en: 'It is the smallest German-speaking country in the world.' }, category: 'record', source: 'Britannica-adjacent' },
  ],
  LT: [
    { text: { it: 'Nel XV secolo, al culmine della sua potenza, il Granducato di Lituania fu uno dei più grandi Stati d\'Europa, esteso dal Mar Baltico al Mar Nero.', en: 'In the 15th century, at the height of its power, the Grand Duchy of Lithuania was one of the largest states in Europe, stretching from the Baltic Sea to the Black Sea.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Sulle spiagge lituane del Baltico si trova ambra, alcuni pezzi vecchi di oltre 30 milioni di anni.', en: 'Amber washes up on Lithuania\'s Baltic beaches, some pieces more than 30 million years old.' }, category: 'nature', source: 'Britannica-adjacent' },
  ],
  LU: [
    { text: { it: 'Il Lussemburgo nacque nel 963 attorno a una fortezza romana chiamata "Lucilinburhuc", che significa "piccola fortezza".', en: 'Luxembourg was founded in 963 around a Roman fortress called "Lucilinburhuc", meaning "little fortress".' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Il Lussemburgo fu tra i membri fondatori dell\'Unione Benelux e della Comunità Economica Europea.', en: 'Luxembourg was among the founding members of the Benelux Union and the European Economic Community.' }, category: 'history', source: 'Britannica' },
  ],
  MT: [
    { text: { it: 'I Templi Megalitici di Malta, Patrimonio UNESCO, sono tra le più antiche costruzioni in pietra a sé stanti al mondo, precedenti sia Stonehenge sia le piramidi egizie.', en: 'The Megalithic Temples of Malta, a UNESCO World Heritage Site, are among the oldest freestanding stone structures in the world, predating both Stonehenge and the Egyptian pyramids.' }, category: 'history', source: 'UNESCO / Britannica' },
    { text: { it: 'Malta è abitata ininterrottamente da circa 7.000 anni.', en: 'Malta has been continuously inhabited for about 7,000 years.' }, category: 'history', source: 'Britannica-adjacent' },
  ],
  MD: [
    { text: { it: 'La Moldavia ospita Milestii Mici, la cantina vinicola più estesa al mondo per lunghezza dei tunnel, secondo il Guinness dei primati.', en: 'Moldova is home to Milestii Mici, the largest wine cellar in the world by tunnel length, according to Guinness World Records.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'La Moldavia, senza sbocco sul mare, si trova quasi interamente tra i fiumi Prut e Dnestr.', en: 'Landlocked Moldova lies almost entirely between the Prut and Dniester rivers.' }, category: 'geography', source: 'Britannica' },
  ],
  MC: [
    { text: { it: 'Monaco è, dopo la Città del Vaticano, il secondo Stato sovrano più piccolo al mondo.', en: 'Monaco is, after Vatican City, the second-smallest sovereign state in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Monaco è lo Stato sovrano più densamente popolato al mondo: solo la regione di Macao, che non è uno Stato sovrano, ha una densità maggiore.', en: 'Monaco is the most densely populated sovereign state in the world: only Macau, which is not a sovereign state, has a higher density.' }, category: 'record', source: 'World Economic Forum / Britannica' },
  ],
  ME: [
    { text: { it: 'Il nome Montenegro ("montagna nera") deriva dall\'antica roccaforte del Monte Lovćen, vicino all\'Adriatico.', en: 'The name Montenegro ("black mountain") comes from the ancient stronghold of Mount Lovćen, near the Adriatic.' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'La vetta più alta del Montenegro, il Bobotov Kuk, raggiunge i 2.522 metri nel massiccio del Durmitor.', en: 'Montenegro\'s highest peak, Bobotov Kuk, reaches 2,522 metres in the Durmitor massif.' }, category: 'geography', source: 'Britannica' },
  ],
  NL: [
    { text: { it: 'Circa un quarto dei Paesi Bassi si trova sotto il livello del mare, con il punto più basso a -7 metri.', en: 'About a quarter of the Netherlands lies below sea level, with the lowest point at -7 metres.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Circa 6.500 km² di terreno olandese sono stati bonificati dal mare tramite dighe e "polder".', en: 'About 6,500 km² of Dutch land has been reclaimed from the sea using dikes and polders.' }, category: 'history', source: 'Britannica' },
  ],
  MK: [
    { text: { it: 'Il Lago di Ohrid, sul confine con l\'Albania, ha circa 2 milioni di anni ed è uno dei pochissimi laghi antichi rimasti al mondo.', en: 'Lake Ohrid, on the border with Albania, is about 2 million years old and is one of very few ancient lakes remaining in the world.' }, category: 'nature', source: 'UNESCO / Britannica' },
    { text: { it: 'La Macedonia del Nord, senza sbocco sul mare, si trova nei Balcani centro-meridionali.', en: 'Landlocked North Macedonia lies in the south-central Balkans.' }, category: 'geography', source: 'Britannica' },
  ],
  NO: [
    { text: { it: 'La costa della Norvegia conta circa 50.000 isole ed è incisa da profondi fiordi glaciali.', en: 'Norway\'s coastline has about 50,000 islands and is carved by deep glacial fjords.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il Sognefjord, il fiordo più lungo e profondo della Norvegia, si estende per 206 km nell\'entroterra raggiungendo i 1.308 metri di profondità.', en: 'The Sognefjord, Norway\'s longest and deepest fjord, stretches 206 km inland and reaches a depth of 1,308 metres.' }, category: 'geography', source: 'Britannica' },
  ],
  PL: [
    { text: { it: 'La Vistola, il fiume più lungo della Polonia, scorre per oltre 1.000 km fino al Mar Baltico.', en: 'The Vistula, Poland\'s longest river, flows for more than 1,000 km to the Baltic Sea.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'A metà del \'500, la Polonia unita fu il più esteso Stato d\'Europa.', en: 'By the mid-1500s, a united Poland was the largest state in Europe.' }, category: 'history', source: 'Britannica' },
  ],
  PT: [
    { text: { it: 'Il confine tra Portogallo e Spagna, fissato dal Trattato di Alcañices nel 1297, è rimasto pressoché invariato per oltre 700 anni.', en: 'The border between Portugal and Spain, set by the Treaty of Alcañices in 1297, has remained largely unchanged for more than 700 years.' }, category: 'history', source: 'Britannica-adjacent' },
    { text: { it: 'Nel XV secolo il Portogallo fu pioniere delle grandi esplorazioni oceaniche, aprendo le rotte marittime verso l\'Africa e l\'Asia.', en: 'In the 15th century, Portugal pioneered the great age of ocean exploration, opening sea routes to Africa and Asia.' }, category: 'history', source: 'Britannica' },
  ],
  RO: [
    { text: { it: 'I Carpazi rumeni ospitano fino al 60% della popolazione di orsi bruni d\'Europa.', en: 'The Romanian Carpathians are home to up to 60% of Europe\'s brown bear population.' }, category: 'nature', source: 'Britannica-adjacent' },
    { text: { it: 'Il Delta del Danubio, in Romania, è il delta più esteso d\'Europa ed è Patrimonio UNESCO.', en: 'The Danube Delta, in Romania, is the largest delta in Europe and a UNESCO World Heritage Site.' }, category: 'nature', source: 'UNESCO / Britannica' },
  ],
  RU: [
    { text: { it: 'La Russia è di gran lunga il Paese più esteso al mondo e si estende su 11 fusi orari.', en: 'Russia is by far the largest country in the world and spans 11 time zones.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Lago Baikal, in Russia, è il lago più profondo della Terra.', en: 'Lake Baikal, in Russia, is the deepest lake on Earth.' }, category: 'record', source: 'Britannica' },
  ],
  SM: [
    { text: { it: 'San Marino è considerata la repubblica più antica del mondo: la tradizione ne fissa la fondazione al 301 d.C.', en: 'San Marino is considered the oldest republic in the world: tradition places its founding in 301 CE.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'San Marino è governata da due Capitani Reggenti, eletti ogni sei mesi.', en: 'San Marino is governed by two Captains Regent, elected every six months.' }, category: 'culture', source: 'Britannica' },
  ],
  RS: [
    { text: { it: 'Belgrado, la capitale della Serbia, sorge alla confluenza dei fiumi Danubio e Sava.', en: 'Belgrade, Serbia\'s capital, sits at the confluence of the Danube and Sava rivers.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il nome Beograd significa "città bianca".', en: 'The name Beograd means "white city".' }, category: 'culture', source: 'Britannica' },
  ],
  SK: [
    { text: { it: 'Gli Alti Tatra, al confine con la Polonia, culminano nel Gerlachovský štít, la vetta più alta della Slovacchia con 2.655 metri.', en: 'The High Tatras, on the border with Poland, culminate in Gerlachovský štít, Slovakia\'s highest peak at 2,655 metres.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La Slovacchia, senza sbocco sul mare, si trova nel cuore dell\'Europa centrale.', en: 'Landlocked Slovakia lies at the heart of Central Europe.' }, category: 'geography', source: 'Britannica' },
  ],
  SI: [
    { text: { it: 'Il territorio carsico della Slovenia conta circa 7.000 grotte censite.', en: 'Slovenia\'s karst terrain has about 7,000 known caves.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Il Lago di Bled ospita l\'unica isola naturale della Slovenia, con una chiesetta, dominata da un castello su una rupe.', en: 'Lake Bled has Slovenia\'s only natural island, with a small church, overlooked by a castle perched on a cliff.' }, category: 'nature', source: 'Britannica' },
  ],
  ES: [
    { text: { it: 'Dopo la Svizzera, la Spagna è il Paese più montuoso d\'Europa: circa il 90% del suo territorio si trova oltre i 600 metri di quota.', en: 'After Switzerland, Spain is the most mountainous country in Europe: about 90% of its territory lies above 600 metres in elevation.' }, category: 'geography', source: 'spain.info (ente turistico ufficiale)' },
    { text: { it: 'La Spagna include anche due arcipelaghi, le Canarie e le Baleari, oltre al territorio peninsulare.', en: 'Spain also includes two archipelagos, the Canary and Balearic Islands, in addition to its mainland territory.' }, category: 'geography', source: 'Britannica' },
  ],
  SE: [
    { text: { it: 'La Svezia conta circa 100.000 laghi, tra cui il Vänern, il più grande dell\'Unione Europea.', en: 'Sweden has about 100,000 lakes, including Vänern, the largest in the European Union.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Grazie all\'"Allemansrätten", il diritto di accesso pubblico, chiunque può camminare, accamparsi e raccogliere bacche liberamente in natura, indipendentemente dal proprietario del terreno.', en: 'Thanks to "Allemansrätten," the right of public access, anyone may walk, camp, and pick berries freely in nature, regardless of who owns the land.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  CH: [
    { text: { it: 'Le montagne coprono circa il 60% del territorio svizzero, tra la catena del Giura e le Alpi.', en: 'Mountains cover about 60% of Switzerland\'s territory, between the Jura range and the Alps.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La lunga politica di neutralità armata ha permesso alla Svizzera di restare fuori da entrambe le guerre mondiali del Novecento.', en: 'Switzerland\'s long-standing policy of armed neutrality kept it out of both World Wars of the 20th century.' }, category: 'history', source: 'Britannica' },
  ],
  UA: [
    { text: { it: 'L\'Ucraina è il più esteso Paese interamente in Europa (la Russia, più grande, si estende anche in Asia).', en: 'Ukraine is the largest country entirely within Europe (Russia, which is larger, also extends into Asia).' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il territorio ucraino è costituito quasi interamente da pianure, con un\'altitudine media di circa 175 metri.', en: 'Ukraine\'s territory consists almost entirely of plains, with an average elevation of about 175 metres.' }, category: 'geography', source: 'Britannica' },
  ],
  GB: [
    { text: { it: 'Il Regno Unito è formato da quattro nazioni: Inghilterra, Scozia, Galles e Irlanda del Nord.', en: 'The United Kingdom is made up of four nations: England, Scotland, Wales, and Northern Ireland.' }, category: 'culture', source: 'Britannica' },
    { text: { it: '"Big Ben" è in realtà il soprannome della grande campana dell\'orologio del Palazzo di Westminster, a Londra.', en: '"Big Ben" is actually the nickname of the great bell of the clock at the Palace of Westminster in London.' }, category: 'culture', source: 'Britannica' },
  ],
  VA: [
    { text: { it: 'La Città del Vaticano è lo Stato indipendente più piccolo del mondo, sia per superficie sia per popolazione.', en: 'Vatican City is the smallest independent state in the world, both by area and by population.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'È l\'unico Paese al mondo il cui intero territorio è dichiarato Patrimonio dell\'Umanità UNESCO.', en: 'It is the only country in the world whose entire territory is designated a UNESCO World Heritage Site.' }, category: 'culture', source: 'UNESCO / Britannica' },
  ],

  // ---- Asia ----
  AF: [
    { text: { it: 'Le montagne coprono fino all\'80% del territorio afghano.', en: 'Mountains cover as much as 80% of Afghanistan\'s territory.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La catena dell\'Hindu Kush, lunga circa 800 km, fa parte della catena himalayana e raggiunge oltre i 6.400 metri.', en: 'The Hindu Kush range, about 800 km long, is part of the Himalayan chain and rises above 6,400 metres.' }, category: 'geography', source: 'Britannica' },
  ],
  AM: [
    { text: { it: 'Verso il 301 d.C. l\'Armenia divenne il primo regno a proclamare ufficialmente il cristianesimo come religione di Stato, prima di Roma.', en: 'Around 301 CE, Armenia became the first kingdom to officially adopt Christianity as its state religion, predating Rome.' }, category: 'history', source: 'Britannica-adjacent' },
    { text: { it: 'Il Monte Ararat, tradizionalmente indicato come luogo d\'approdo dell\'Arca di Noè, domina il paesaggio armeno pur trovandosi oggi oltre il confine con la Turchia.', en: 'Mount Ararat, traditionally cited as the resting place of Noah\'s Ark, dominates the Armenian landscape even though it now lies just across the border in Turkey.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  AZ: [
    { text: { it: 'L\'Azerbaigian è soprannominato "Terra del Fuoco": a Yanar Dag, sulla costa del Mar Caspio, una fiamma alimentata dal gas naturale arde ininterrottamente da decenni.', en: 'Azerbaijan is nicknamed the "Land of Fire": at Yanar Dag, on the Caspian coast, a flame fed by natural gas has burned continuously for decades.' }, category: 'nature', source: 'Britannica-adjacent' },
    { text: { it: 'Le montagne del Caucaso coprono gran parte del nord e dell\'ovest dell\'Azerbaigian.', en: 'The Caucasus Mountains cover much of northern and western Azerbaijan.' }, category: 'geography', source: 'Britannica' },
  ],
  BH: [
    { text: { it: 'Il nome Bahrein deriva dall\'arabo "al-baḥrayn", che significa "le due acque".', en: 'The name Bahrain comes from the Arabic "al-baḥrayn", meaning "the two seas".' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Il Bahrein è un arcipelago di circa 30 isole ed è il più piccolo Paese del mondo arabo.', en: 'Bahrain is an archipelago of about 30 islands and is the smallest country in the Arab world.' }, category: 'geography', source: 'Britannica' },
  ],
  BD: [
    { text: { it: 'Il Bangladesh è uno dei Paesi più densamente popolati al mondo.', en: 'Bangladesh is one of the most densely populated countries in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'La pianura del delta formato da Gange, Brahmaputra e Meghna occupa circa il 79% del territorio del Bangladesh.', en: 'The delta plain formed by the Ganges, Brahmaputra, and Meghna rivers covers about 79% of Bangladesh.' }, category: 'geography', source: 'Britannica' },
  ],
  BT: [
    { text: { it: 'Il Bhutan misura il proprio sviluppo tramite la "Felicità Interna Lorda" invece del solo PIL, un concetto introdotto nel 1972.', en: 'Bhutan measures its development through "Gross National Happiness" rather than GDP alone, a concept introduced in 1972.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'La costituzione del Bhutan impone di mantenere almeno il 60% del territorio coperto da foreste, rendendolo uno dei pochi Paesi a bilancio di carbonio negativo.', en: 'Bhutan\'s constitution requires at least 60% forest cover to be maintained, making it one of the few carbon-negative countries in the world.' }, category: 'nature', source: 'Britannica-adjacent' },
  ],
  BN: [
    { text: { it: 'Il Brunei è un sultanato indipendente sull\'isola del Borneo, la cui ricchezza deriva dai giacimenti di petrolio e gas naturale sfruttati dal 1929.', en: 'Brunei is an independent sultanate on the island of Borneo, whose wealth comes from oil and natural gas deposits exploited since 1929.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Il territorio del Brunei è diviso in due parti separate dallo stato malese di Sarawak.', en: 'Brunei\'s territory is split into two parts separated by the Malaysian state of Sarawak.' }, category: 'geography', source: 'Britannica' },
  ],
  KH: [
    { text: { it: 'Angkor Wat, costruita nel XII secolo, è il più grande monumento religioso al mondo, con circa 160 ettari di estensione.', en: 'Angkor Wat, built in the 12th century, is the largest religious monument in the world, covering about 160 hectares.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Angkor Wat nacque come tempio induista dedicato a Vishnu e divenne in seguito un santuario buddhista.', en: 'Angkor Wat began as a Hindu temple dedicated to Vishnu and later became a Buddhist shrine.' }, category: 'history', source: 'Britannica' },
  ],
  CN: [
    { text: { it: 'La Cina è, per superficie, il terzo Paese al mondo dopo Russia e Canada, e copre circa un quattordicesimo delle terre emerse del pianeta.', en: 'China is, by area, the third-largest country in the world after Russia and Canada, covering about one-fourteenth of Earth\'s land area.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La versione della Grande Muraglia risalente alla dinastia Ming si estende per circa 8.850 km ed è Patrimonio UNESCO dal 1987.', en: 'The Ming-dynasty version of the Great Wall runs for about 8,850 km and has been a UNESCO World Heritage Site since 1987.' }, category: 'history', source: 'UNESCO / Britannica' },
  ],
  GE: [
    { text: { it: 'Secondo gli studi più recenti, la Georgia è considerata la culla del vino: vasi in argilla per la vinificazione risalenti a circa 6000 a.C. sono stati ritrovati nel Paese.', en: 'According to recent scholarship, Georgia is considered the birthplace of wine: clay vessels used for winemaking dating to around 6000 BCE have been found there.' }, category: 'history', source: 'Britannica-adjacent' },
    { text: { it: 'La Georgia si affaccia sul Mar Nero, ai piedi del Grande Caucaso.', en: 'Georgia lies on the Black Sea, at the foot of the Greater Caucasus.' }, category: 'geography', source: 'Britannica' },
  ],
  IN: [
    { text: { it: 'L\'India è il settimo Paese al mondo per superficie ed è separata dal resto dell\'Asia dalla catena himalayana.', en: 'India is the seventh-largest country in the world by area, separated from the rest of Asia by the Himalayan mountain wall.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Dall\'indipendenza nel 1947, l\'India è la più grande democrazia del mondo per popolazione.', en: 'Since independence in 1947, India has been the world\'s largest democracy by population.' }, category: 'history', source: 'Britannica' },
  ],
  ID: [
    { text: { it: 'L\'Indonesia è composta da circa 17.500 isole ed è il più grande Paese arcipelagico al mondo.', en: 'Indonesia is made up of about 17,500 islands and is the largest archipelagic country in the world.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'L\'Indonesia è il Paese più popoloso del Sud-est asiatico e il quarto al mondo.', en: 'Indonesia is the most populous country in Southeast Asia and the fourth most populous in the world.' }, category: 'record', source: 'Britannica' },
  ],
  IR: [
    { text: { it: 'Gran parte dell\'Iran è occupata da un altopiano desertico centrale, circondato da alte catene montuose come lo Zagros e l\'Elburz.', en: 'Much of Iran consists of a central desert plateau ringed by high mountain ranges such as the Zagros and Elburz.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'L\'Iran fu il cuore dell\'antico impero persiano.', en: 'Iran was the heart of the ancient Persian Empire.' }, category: 'history', source: 'Britannica' },
  ],
  IQ: [
    { text: { it: 'Il territorio dell\'Iraq comprende l\'antica Mesopotamia, "terra tra i due fiumi", una delle culle della civiltà umana.', en: 'Iraq\'s territory includes ancient Mesopotamia, "the land between two rivers," one of the cradles of human civilization.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Le piene annuali di Tigri ed Eufrate resero le pianure meridionali dell\'Iraq tra le più fertili del Vicino Oriente.', en: 'The yearly floods of the Tigris and Euphrates made the southern plains of Iraq some of the richest soil in the Near East.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  IL: [
    { text: { it: 'Il Mar Morto, tra Israele e Giordania, è il punto più basso della superficie terrestre, a circa 400 metri sotto il livello del mare.', en: 'The Dead Sea, between Israel and Jordan, is the lowest point on Earth\'s land surface, at about 400 metres below sea level.' }, category: 'geography', source: 'Britannica' },
  ],
  JP: [
    { text: { it: 'Un rilevamento governativo del 2023, condotto con mappatura digitale, ha contato 14.125 isole giapponesi, più del doppio delle 6.852 censite in precedenza.', en: 'A 2023 government survey using digital mapping counted 14,125 Japanese islands, more than double the previously recorded 6,852.' }, category: 'record', source: 'Autorità geospaziale giapponese' },
    { text: { it: 'Le quattro isole principali del Giappone, da nord a sud, sono Hokkaido, Honshu, Shikoku e Kyushu.', en: 'Japan\'s four main islands, from north to south, are Hokkaido, Honshu, Shikoku, and Kyushu.' }, category: 'geography', source: 'Britannica' },
  ],
  JO: [
    { text: { it: 'Nella Valle del Giordano il terreno scende fino a circa 430 metri sotto il livello del mare, presso il Mar Morto.', en: 'The Jordan Valley drops to about 430 metres below sea level at the Dead Sea.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Petra, un tempo capitale del regno nabateo, fu scavata nell\'arenaria rossa e dotata di un sofisticato sistema di raccolta dell\'acqua.', en: 'Petra, once the capital of the Nabataean kingdom, was carved into red sandstone and equipped with a sophisticated water-harvesting system.' }, category: 'history', source: 'Britannica' },
  ],
  KZ: [
    { text: { it: 'Il Kazakistan è il più grande Paese senza sbocco sul mare del mondo.', en: 'Kazakhstan is the largest landlocked country in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Kazakistan è anche il nono Paese al mondo per estensione territoriale.', en: 'Kazakhstan is also the ninth-largest country in the world by area.' }, category: 'geography', source: 'Britannica' },
  ],
  KW: [
    { text: { it: 'Le riserve petrolifere del Kuwait rappresentano circa un decimo di quelle mondiali, terze dopo Iraq e Arabia Saudita.', en: 'Kuwait\'s oil reserves represent roughly one-tenth of the world\'s total, third after Iraq and Saudi Arabia.' }, category: 'record', source: 'Britannica' },
  ],
  KG: [
    { text: { it: 'Oltre il 90% del territorio del Kirghizistan è montuoso.', en: 'Over 90% of Kyrgyzstan\'s territory is mountainous.' }, category: 'geography', source: 'Britannica-adjacent' },
    { text: { it: 'La catena del Tian Shan, le "Montagne Celesti", attraversa l\'Asia centrale per circa 2.500 km, con vette che superano i 7.400 metri.', en: 'The Tian Shan range, the "Celestial Mountains," stretches across Central Asia for about 2,500 km, with peaks over 7,400 metres.' }, category: 'geography', source: 'Britannica' },
  ],
  LA: [
    { text: { it: 'Sull\'altopiano dello Xiangkhoang, nel Laos settentrionale, la Piana delle Giare conserva centinaia di antichi vasi di pietra il cui scopo originario resta dibattuto.', en: 'On the Xiangkhoang Plateau in northern Laos, the Plain of Jars preserves hundreds of ancient stone jars whose original purpose is still debated.' }, category: 'history', source: 'Britannica' },
  ],
  LB: [
    { text: { it: 'I celebri cedri del Libano, un tempo usati dagli antichi Fenici per costruire navi, sopravvivono oggi solo in boschetti montani protetti.', en: 'Lebanon\'s famous cedar trees, once used by the ancient Phoenicians to build ships, now survive only in protected mountain groves.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Tra la catena del Libano e l\'Anti-Libano si trova la fertile Valle della Bekaa.', en: 'Between the Lebanon Mountains and the Anti-Lebanon range lies the fertile Bekaa Valley.' }, category: 'geography', source: 'Britannica' },
  ],
  MY: [
    { text: { it: 'La Malaysia è divisa in due regioni, la Malaysia Peninsulare e la Malaysia Orientale sul Borneo, separate da circa 640 km di Mar Cinese Meridionale.', en: 'Malaysia is split into two regions, Peninsular Malaysia and East Malaysia on Borneo, separated by about 640 km of the South China Sea.' }, category: 'geography', source: 'Britannica' },
  ],
  MV: [
    { text: { it: 'Le Maldive sono il Paese più basso del mondo: il punto più alto raggiunge appena 2,4 metri sul livello del mare.', en: 'The Maldives is the lowest country in the world: its highest natural point is just 2.4 metres above sea level.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'L\'arcipelago delle Maldive è formato da 1.190 isole coralline raggruppate in 26 atolli.', en: 'The Maldives archipelago consists of 1,190 coral islands grouped into 26 atolls.' }, category: 'geography', source: 'Britannica' },
  ],
  MN: [
    { text: { it: 'La Mongolia è il Paese sovrano meno densamente popolato al mondo.', en: 'Mongolia is the world\'s most sparsely populated sovereign country.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Nel 1206 Gengis Khan unificò le tribù mongole e turche, fondando l\'Impero Mongolo.', en: 'In 1206, Genghis Khan united the Mongol and Turkic tribes, founding the Mongol Empire.' }, category: 'history', source: 'Britannica' },
  ],
  MM: [
    { text: { it: 'Il Myanmar raggiunge il suo punto più alto al Monte Hkakabo, 5.881 metri, nell\'estremo nord del Paese.', en: 'Myanmar reaches its highest point at Mount Hkakabo, 5,881 metres, in the far north of the country.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il fiume Irrawaddy è navigabile per quasi 1.600 km ed è fondamentale per i trasporti e l\'agricoltura del Myanmar.', en: 'The Irrawaddy River is navigable for nearly 1,600 km and is central to transport and agriculture in Myanmar.' }, category: 'geography', source: 'Britannica' },
  ],
  NP: [
    { text: { it: 'Il Nepal è l\'unico Paese al mondo con una bandiera nazionale non rettangolare, formata da due pennoni triangolari sovrapposti.', en: 'Nepal is the only country with a non-rectangular national flag, made of two overlapping triangular pennants.' }, category: 'record', source: 'Wikipedia (fatto strutturale ampiamente verificato)' },
    { text: { it: 'Il Nepal ospita otto delle quattordici vette del mondo sopra gli 8.000 metri, tra cui l\'Everest, il Kangchenjunga e l\'Annapurna.', en: 'Nepal is home to eight of the world\'s fourteen peaks above 8,000 metres, including Everest, Kangchenjunga, and Annapurna.' }, category: 'geography', source: 'NASA Science' },
  ],
  KP: [
    { text: { it: 'Il Monte Paektu, 2.744 metri, è la vetta più alta della Corea del Nord: è un vulcano con un lago craterico chiamato Lago del Paradiso, sul confine con la Cina.', en: 'Mount Paektu, at 2,744 metres, is North Korea\'s highest peak: it is a volcano with a crater lake called Heaven Lake, on the border with China.' }, category: 'geography', source: 'Britannica / Wikipedia' },
  ],
  OM: [
    { text: { it: 'Le montagne dell\'Hajar, in Oman, raggiungono i 2.980 metri presso il Monte Shams.', en: 'The Hajar Mountains in Oman reach 2,980 metres at Mount Shams.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Gli alberi d\'incenso della regione del Dhofar, un tempo tenuti in maggior pregio dell\'oro, sono oggi Patrimonio UNESCO.', en: 'The frankincense trees of the Dhofar region, once prized more than gold, are today a UNESCO World Heritage Site.' }, category: 'culture', source: 'UNESCO / Britannica' },
  ],
  PK: [
    { text: { it: 'Il Pakistan ospita il K2, seconda vetta più alta del mondo con 8.611 metri, nella catena del Karakorum.', en: 'Pakistan is home to K2, the world\'s second-highest peak at 8,611 metres, in the Karakoram Range.' }, category: 'record', source: 'Britannica' },
  ],
  PS: [
    { text: { it: 'Il territorio è composto da due aree distinte e separate, la Cisgiordania e la Striscia di Gaza.', en: 'The territory is composed of two separate areas, the West Bank and the Gaza Strip.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La Cisgiordania è prevalentemente montuosa e degrada a est verso il Mar Morto, mentre la Striscia di Gaza è pianeggiante e sabbiosa lungo la costa mediterranea.', en: 'The West Bank is largely mountainous, sloping down in the east toward the Dead Sea, while the Gaza Strip is flat and sandy along the Mediterranean coast.' }, category: 'geography', source: 'Britannica' },
  ],
  PH: [
    { text: { it: 'Le Filippine sono un arcipelago di oltre 7.600 isole.', en: 'The Philippines is an archipelago of more than 7,600 islands.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Le Filippine hanno la costa discontinua più lunga di qualsiasi Paese al mondo, circa 36.300 km.', en: 'The Philippines has the longest discontinuous coastline of any country in the world, about 36,300 km.' }, category: 'record', source: 'Britannica' },
  ],
  QA: [
    { text: { it: 'Il Qatar occupa una piccola penisola desertica protesa nel Golfo Persico.', en: 'Qatar occupies a small desert peninsula jutting into the Persian Gulf.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il North Field, al largo delle coste del Qatar, è uno dei più grandi giacimenti di gas naturale al mondo.', en: 'The North Field, off Qatar\'s coast, is one of the largest natural gas fields in the world.' }, category: 'record', source: 'Britannica' },
  ],
  SA: [
    { text: { it: 'L\'Arabia Saudita è il più grande Paese al mondo privo di un fiume permanente.', en: 'Saudi Arabia is the largest country in the world without a permanent river.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'Il Rub\' al-Khali, il "Quarto Vuoto", è il più esteso deserto di sabbia continuo al mondo e copre oltre un quarto del territorio saudita.', en: 'The Rub\' al-Khali, the "Empty Quarter," is the largest continuous sand desert in the world and covers more than a quarter of Saudi Arabia.' }, category: 'geography', source: 'Britannica' },
  ],
  SG: [
    { text: { it: 'Singapore è una città-Stato composta dall\'isola principale e da circa 60 isolotti minori.', en: 'Singapore is a city-state made up of the main island and about 60 smaller islets.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La posizione di Singapore sullo Stretto di Malacca ne ha fatto uno dei porti più trafficati al mondo.', en: 'Singapore\'s position on the Strait of Malacca has made it one of the busiest ports in the world.' }, category: 'record', source: 'Britannica' },
  ],
  KR: [
    { text: { it: 'Circa il 70% del territorio della Corea del Sud è montuoso o collinare.', en: 'About 70% of South Korea\'s territory is mountainous or hilly.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il punto più alto della Corea del Sud, l\'Hallasan, è il cono di un vulcano sull\'isola di Jeju, alto 1.950 metri.', en: 'South Korea\'s highest point, Hallasan, is a volcanic cone on Jeju Island, standing 1,950 metres tall.' }, category: 'geography', source: 'Britannica' },
  ],
  LK: [
    { text: { it: 'Lo Sri Lanka è soprannominato la "Lacrima dell\'India" per la sua forma nell\'Oceano Indiano.', en: 'Sri Lanka is nicknamed the "Teardrop of India" for its shape in the Indian Ocean.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'Lo Sri Lanka è tra i principali produttori ed esportatori mondiali del celebre tè di Ceylon.', en: 'Sri Lanka is among the world\'s leading producers and exporters of the famous Ceylon tea.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  SY: [
    { text: { it: 'Damasco, la capitale della Siria, è tra le città abitate ininterrottamente più antiche al mondo, con tracce di occupazione che risalgono all\'8000-10000 a.C.', en: 'Damascus, Syria\'s capital, is among the oldest continuously inhabited cities in the world, with evidence of occupation dating back to 8000-10,000 BCE.' }, category: 'history', source: 'Britannica' },
  ],
  TJ: [
    { text: { it: 'Le montagne del Pamir, in Tagikistan, sono chiamate il "Tetto del Mondo" per le loro vette oltre i 6.100 metri.', en: 'The Pamir Mountains in Tajikistan are called the "Roof of the World" for their peaks above 6,100 metres.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il ghiacciaio Fedchenko, in Tagikistan, con i suoi circa 77 km, è il più lungo ghiacciaio del mondo al di fuori delle regioni polari.', en: 'The Fedchenko Glacier in Tajikistan, at about 77 km, is the longest glacier in the world outside the polar regions.' }, category: 'record', source: 'Britannica-adjacent' },
  ],
  TH: [
    { text: { it: 'La Thailandia è l\'unico Paese del Sud-est asiatico a non essere mai stato colonizzato da una potenza europea.', en: 'Thailand is the only Southeast Asian country never to have been colonized by a European power.' }, category: 'history', source: 'CIA World Factbook' },
    { text: { it: 'Con il vecchio nome di Siam, il Paese restò indipendente anche fungendo da zona cuscinetto tra i territori coloniali britannici e francesi nel Sud-est asiatico.', en: 'Under its former name Siam, the country stayed independent partly by serving as a buffer zone between British and French colonial territories in Southeast Asia.' }, category: 'history', source: 'Britannica' },
  ],
  TL: [
    { text: { it: 'Timor Est è uno dei Paesi più giovani al mondo: ha ottenuto l\'indipendenza dall\'Indonesia nel 2002.', en: 'Timor-Leste is one of the world\'s newest countries, gaining independence from Indonesia in 2002.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'È l\'unica nazione asiatica che si trova interamente nell\'emisfero australe.', en: 'It is the only Asian nation lying entirely within the Southern Hemisphere.' }, category: 'geography', source: 'Britannica' },
  ],
  TR: [
    { text: { it: 'La Turchia si estende in parte in Europa e in gran parte in Asia: Istanbul è l\'unica città al mondo situata su due continenti.', en: 'Turkey lies partly in Europe and mostly in Asia: Istanbul is the only city in the world located on two continents.' }, category: 'geography', source: 'Britannica' },
  ],
  TM: [
    { text: { it: 'Nel deserto del Karakum, in Turkmenistan, il cratere di Darvaza, noto come "Porta dell\'Inferno", arde ininterrottamente dal 1971.', en: 'In the Karakum Desert of Turkmenistan, the Darvaza crater, known as the "Door to Hell," has been burning continuously since 1971.' }, category: 'nature', source: 'Britannica-adjacent' },
  ],
  AE: [
    { text: { it: 'Gli Emirati Arabi Uniti sono una federazione di sette emirati, formatasi nel 1971 dopo il ritiro britannico dal Golfo.', en: 'The United Arab Emirates is a federation of seven emirates, formed in 1971 after the British withdrawal from the Gulf.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Oltre il 90% del territorio degli Emirati è desertico.', en: 'Over 90% of the UAE\'s territory is desert.' }, category: 'geography', source: 'Britannica' },
  ],
  UZ: [
    { text: { it: 'Samarcanda, una delle città più antiche dell\'Asia centrale, fu un crocevia chiave della Via della Seta e in seguito capitale dell\'impero di Tamerlano.', en: 'Samarkand, one of Central Asia\'s oldest cities, was a key Silk Road hub and later the capital of Timur\'s (Tamerlane\'s) empire.' }, category: 'history', source: 'UNESCO / Britannica' },
  ],
  VN: [
    { text: { it: 'Il Vietnam ha una forma a "S" e si estende per circa 1.650 km da nord a sud, restringendosi fino a soli 50 km di larghezza nel punto più stretto.', en: 'Vietnam is S-shaped, stretching about 1,650 km from north to south and narrowing to just 50 km at its narrowest point.' }, category: 'geography', source: 'Britannica-adjacent' },
    { text: { it: 'Il Delta del Mekong avanza sul mare di 60-80 metri ogni anno a causa dei sedimenti trasportati dal fiume.', en: 'The Mekong Delta advances into the sea by 60-80 metres every year due to sediment carried by the river.' }, category: 'nature', source: 'Britannica-adjacent' },
  ],
  YE: [
    { text: { it: 'L\'isola yemenita di Socotra, isolata nell\'Oceano Indiano, è Patrimonio UNESCO per la sua flora unica al mondo, tra cui il celebre albero del sangue di drago.', en: 'Yemen\'s Socotra Island, isolated in the Indian Ocean, is a UNESCO World Heritage Site for its unique flora, including the famous dragon\'s blood tree.' }, category: 'nature', source: 'UNESCO / Britannica' },
  ],

  // ---- Africa ----
  DZ: [
    { text: { it: 'L\'Algeria è il Paese più esteso del continente africano.', en: 'Algeria is the largest country on the African continent.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Circa quattro quinti del territorio algerino si trovano nel Sahara.', en: 'About four-fifths of Algeria\'s territory lies within the Sahara.' }, category: 'geography', source: 'Britannica' },
  ],
  AO: [
    { text: { it: 'L\'Angola è tra i maggiori produttori di petrolio dell\'Africa e ospita importanti giacimenti di diamanti alluvionali.', en: 'Angola is among Africa\'s major oil producers and has significant alluvial diamond deposits.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il paesaggio angolano va dalla costa semidesertica atlantica alla foresta pluviale dell\'interno, fino agli altopiani meridionali.', en: 'Angola\'s landscape ranges from the semi-desert Atlantic coast to the rainforest interior and southern highlands.' }, category: 'geography', source: 'Britannica' },
  ],
  BJ: [
    { text: { it: 'Il Benin è considerato la terra d\'origine del Vodun (voodoo), religione ancora oggi ufficialmente riconosciuta e celebrata ogni 10 gennaio.', en: 'Benin is considered the birthplace of Vodun (voodoo), a religion still officially recognized today and celebrated every 10 January.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'Il Benin si estende per circa 700 km dal Golfo di Guinea al fiume Niger.', en: 'Benin stretches about 700 km from the Gulf of Guinea to the Niger River.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  BW: [
    { text: { it: 'Il Delta dell\'Okavango, in Botswana, è uno dei pochi grandi delta interni al mondo privo di sbocco sul mare.', en: 'The Okavango Delta in Botswana is one of the few large inland deltas in the world with no outlet to the sea.' }, category: 'nature', source: 'UNESCO / Britannica' },
    { text: { it: 'Il Deserto del Kalahari copre oltre il 70% del territorio del Botswana.', en: 'The Kalahari Desert covers over 70% of Botswana\'s territory.' }, category: 'geography', source: 'Britannica' },
  ],
  BF: [
    { text: { it: 'Il nome Burkina Faso, adottato nel 1984, significa all\'incirca "terra delle persone integre".', en: 'The name Burkina Faso, adopted in 1984, roughly means "land of incorruptible people".' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Il Paese, prima chiamato Alto Volta, prende il nome dai tre rami del fiume Volta che lo attraversano: Nero, Bianco e Rosso.', en: 'The country, formerly called Upper Volta, is named after the three branches of the Volta River that flow through it: Black, White, and Red.' }, category: 'geography', source: 'Britannica' },
  ],
  BI: [
    { text: { it: 'Pur essendo senza sbocco sul mare, il Burundi si affaccia sul Lago Tanganica lungo il suo confine sud-occidentale.', en: 'Though landlocked, Burundi borders Lake Tanganyika along its southwestern edge.' }, category: 'geography', source: 'Britannica-adjacent' },
    { text: { it: 'Il Monte Heha, 2.685 metri, è la vetta più alta del Burundi.', en: 'Mount Heha, at 2,685 metres, is Burundi\'s highest peak.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  CV: [
    { text: { it: 'Capo Verde è un arcipelago vulcanico formato da 10 isole e 5 isolotti.', en: 'Cape Verde is a volcanic archipelago made up of 10 islands and 5 islets.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'L\'Isola di Fogo ospita un vulcano attivo e la vetta più alta dell\'arcipelago, 2.829 metri.', en: 'Fogo Island has an active volcano and the archipelago\'s highest peak, at 2,829 metres.' }, category: 'nature', source: 'Britannica' },
  ],
  CM: [
    { text: { it: 'Il Camerun è soprannominato "l\'Africa in miniatura" per la varietà di paesaggi che racchiude, dal Sahel alla foresta pluviale, fino agli altopiani vulcanici.', en: 'Cameroon is nicknamed "Africa in miniature" for the range of landscapes it contains, from the Sahel to rainforest to volcanic highlands.' }, category: 'geography', source: 'Britannica-adjacent' },
    { text: { it: 'Il Camerun conta oltre 250 gruppi etnici.', en: 'Cameroon is home to more than 250 ethnic groups.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  CF: [
    { text: { it: 'L\'altopiano della Repubblica Centrafricana segna lo spartiacque tra il bacino del fiume Congo-Ubangi e quello del Lago Ciad.', en: 'The Central African Republic\'s plateau forms the drainage divide between the Congo-Ubangi river basin and the Lake Chad watershed.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il sud del Paese è coperto dalla foresta pluviale del bacino del Congo, la seconda più estesa al mondo.', en: 'The south of the country is covered by the Congo Basin rainforest, the second-largest in the world.' }, category: 'nature', source: 'Britannica' },
  ],
  TD: [
    { text: { it: 'Il Lago Ciad si è ridotto di circa il 90% dagli anni \'60, a causa di cambiamenti climatici e maggiore uso dell\'acqua per l\'irrigazione.', en: 'Lake Chad has shrunk by about 90% since the 1960s, due to climate shifts and increased water use for irrigation.' }, category: 'nature', source: 'Britannica-adjacent' },
    { text: { it: 'Il Ciad, senza sbocco sul mare, ha un\'estensione pari a circa il doppio del Texas.', en: 'Landlocked Chad covers an area roughly twice the size of Texas.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  KM: [
    { text: { it: 'L\'arcipelago vulcanico delle Comore è soprannominato "le isole del profumo" per la fragranza delle sue piante.', en: 'The volcanic Comoros archipelago is nicknamed the "Perfume Islands" for its fragrant plant life.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'Le Comore sono il primo produttore mondiale di ylang-ylang, ingrediente base di profumi celebri come Chanel N°5.', en: 'The Comoros is the world\'s largest producer of ylang-ylang, a key ingredient in famous perfumes such as Chanel No. 5.' }, category: 'record', source: 'Britannica-adjacent' },
  ],
  CG: [
    { text: { it: 'La Repubblica del Congo si trova a cavallo dell\'Equatore, nell\'Africa centro-occidentale.', en: 'The Republic of the Congo sits astride the Equator in west-central Africa.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La capitale Brazzaville sorge sul fiume Congo, esattamente di fronte a Kinshasa, capitale della Repubblica Democratica del Congo.', en: 'The capital, Brazzaville, lies on the Congo River directly across from Kinshasa, capital of the neighboring Democratic Republic of the Congo.' }, category: 'geography', source: 'Britannica' },
  ],
  CD: [
    { text: { it: 'La Repubblica Democratica del Congo ospita gran parte della foresta pluviale del bacino del Congo, la seconda più estesa al mondo dopo l\'Amazzonia.', en: 'The Democratic Republic of the Congo is home to much of the Congo Basin rainforest, the second-largest in the world after the Amazon.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Il fiume Congo, lungo circa 4.700 km, è il fiume più profondo del mondo e il secondo più lungo dell\'Africa dopo il Nilo.', en: 'The Congo River, about 4,700 km long, is the deepest river in the world and Africa\'s second-longest after the Nile.' }, category: 'record', source: 'Britannica' },
  ],
  DJ: [
    { text: { it: 'Il Lago Assal, a Gibuti, si trova a 155 metri sotto il livello del mare: è il punto più basso dell\'Africa e uno specchio d\'acqua tra i più salati al mondo.', en: 'Lake Assal, in Djibouti, lies 155 metres below sea level: it is the lowest point in Africa and one of the saltiest bodies of water on Earth.' }, category: 'record', source: 'Britannica' },
  ],
  EG: [
    { text: { it: 'La Grande Piramide di Giza, costruita per il faraone Cheope intorno al 2543-2436 a.C., raggiungeva originariamente circa 147 metri di altezza.', en: 'The Great Pyramid of Giza, built for the pharaoh Khufu around 2543-2436 BCE, originally stood about 147 metres tall.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Il Nilo scorre per circa 6.650 km dall\'Africa centro-orientale al Mediterraneo, il fiume più lungo del mondo.', en: 'The Nile flows about 6,650 km from east-central Africa to the Mediterranean, the longest river in the world.' }, category: 'record', source: 'Britannica' },
  ],
  GQ: [
    { text: { it: 'La Guinea Equatoriale è l\'unico Paese africano la cui lingua ufficiale è lo spagnolo.', en: 'Equatorial Guinea is the only African country whose official language is Spanish.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  ER: [
    { text: { it: 'Il nome Eritrea deriva dalla versione italianizzata del latino "Mare Erythraeum", cioè "Mar Rosso".', en: 'The name Eritrea comes from an Italianized version of the Latin "Mare Erythraeum," meaning "Red Sea".' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'La costa eritrea si estende per circa 1.000 km lungo il Mar Rosso, comprendendo l\'arcipelago di Dahlak.', en: 'Eritrea\'s coastline extends about 1,000 km along the Red Sea, including the Dahlak Archipelago.' }, category: 'geography', source: 'Britannica' },
  ],
  SZ: [
    { text: { it: 'L\'Eswatini (ex Swaziland) è l\'ultima monarchia assoluta d\'Africa: il re detiene potere di veto su tutti i rami del governo.', en: 'Eswatini (formerly Swaziland) is Africa\'s last absolute monarchy, where the king holds veto power over all branches of government.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'Il Paese cambiò nome da Swaziland a Eswatini, "terra degli Swazi", nel 2018.', en: 'The country changed its name from Swaziland to Eswatini, "land of the Swazis," in 2018.' }, category: 'history', source: 'Britannica-adjacent' },
  ],
  ET: [
    { text: { it: 'Insieme alla Liberia, l\'Etiopia è uno dei soli due Paesi africani mai stati colonizzati da una potenza europea, dopo aver sconfitto l\'Italia nella battaglia di Adua nel 1896.', en: 'Along with Liberia, Ethiopia is one of only two African countries never colonized by a European power, having defeated Italy at the Battle of Adwa in 1896.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'L\'Etiopia utilizza un proprio calendario, che corre con circa sette-otto anni di ritardo rispetto a quello gregoriano.', en: 'Ethiopia uses its own calendar, which runs about seven to eight years behind the Gregorian calendar.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  GA: [
    { text: { it: 'Il Gabon si trova a cavallo dell\'Equatore, sulla costa occidentale dell\'Africa.', en: 'Gabon straddles the Equator on Africa\'s west coast.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Circa tre quarti del territorio del Gabon sono coperti da fitta foresta pluviale equatoriale.', en: 'About three-quarters of Gabon is covered by dense equatorial rainforest.' }, category: 'nature', source: 'Britannica' },
  ],
  GM: [
    { text: { it: 'Il Gambia è il più piccolo Paese non insulare dell\'Africa, una stretta striscia di terra intorno al fiume Gambia, quasi interamente circondata dal Senegal.', en: 'The Gambia is the smallest non-island country in Africa, a narrow strip of land around the Gambia River, almost entirely surrounded by Senegal.' }, category: 'record', source: 'Britannica' },
  ],
  GH: [
    { text: { it: 'Il Ghana, nel 1957, fu il primo Paese dell\'Africa subsahariana a ottenere l\'indipendenza da una potenza coloniale.', en: 'Ghana, in 1957, was the first sub-Saharan African country to gain independence from a colonial power.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Prima dell\'indipendenza, il Ghana era conosciuto come Costa d\'Oro sotto il dominio britannico.', en: 'Before independence, Ghana was known as the Gold Coast under British rule.' }, category: 'history', source: 'Britannica' },
  ],
  GN: [
    { text: { it: 'Gli altopiani del Fouta Djallon, in Guinea, sono la sorgente di alcuni dei maggiori fiumi dell\'Africa occidentale, tra cui il Niger, il Gambia e il Senegal.', en: 'The Fouta Djallon highlands in Guinea are the source of several major West African rivers, including the Niger, Gambia, and Senegal rivers.' }, category: 'record', source: 'Britannica' },
  ],
  GW: [
    { text: { it: 'L\'arcipelago delle Bijagós, al largo della Guinea-Bissau, è Riserva della Biosfera UNESCO dal 1996 ed è stato dichiarato Patrimonio dell\'Umanità UNESCO nel 2025.', en: 'The Bijagós Archipelago, off the coast of Guinea-Bissau, has been a UNESCO Biosphere Reserve since 1996 and was inscribed as a UNESCO World Heritage Site in 2025.' }, category: 'nature', source: 'UNESCO' },
    { text: { it: 'La Guinea-Bissau è abitata da oltre 20 gruppi etnici diversi.', en: 'Guinea-Bissau is home to more than 20 different ethnic groups.' }, category: 'culture', source: 'Britannica' },
  ],
  CI: [
    { text: { it: 'La Costa d\'Avorio è il primo produttore mondiale di cacao, con circa il 40-45% della produzione globale.', en: 'Côte d\'Ivoire is the world\'s leading cocoa producer, accounting for roughly 40-45% of global output.' }, category: 'record', source: 'Britannica' },
  ],
  KE: [
    { text: { it: 'Il Kenya è attraversato dalla Grande Rift Valley, con scarpate, vulcani e laghi sia d\'acqua dolce sia salini.', en: 'Kenya is crossed by the Great Rift Valley, with escarpments, volcanoes, and both freshwater and soda lakes.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il Lago Bogoria, nella Rift Valley keniota, ospita una delle popolazioni di fenicotteri minori più numerose al mondo.', en: 'Lake Bogoria, in Kenya\'s Rift Valley, hosts one of the world\'s largest populations of lesser flamingos.' }, category: 'nature', source: 'Britannica' },
  ],
  LS: [
    { text: { it: 'Il Lesotho è l\'unico Paese indipendente al mondo che si trova interamente al di sopra dei 1.000 metri di altitudine, soprannominato "il regno nel cielo".', en: 'Lesotho is the only independent country in the world lying entirely above 1,000 metres in elevation, nicknamed the "Kingdom in the Sky".' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Lesotho è completamente circondato dal territorio del Sudafrica.', en: 'Lesotho is completely surrounded by South African territory.' }, category: 'geography', source: 'Britannica' },
  ],
  LR: [
    { text: { it: 'La Liberia fu fondata nel 1822 come territorio per gli ex schiavi liberati dalle Americhe e dichiarò l\'indipendenza nel 1847, prima repubblica d\'Africa.', en: 'Liberia was founded in 1822 as a settlement for freed slaves from the Americas and declared independence in 1847, becoming Africa\'s first republic.' }, category: 'history', source: 'Britannica' },
  ],
  LY: [
    { text: { it: 'La Libia detiene le maggiori riserve di petrolio accertate dell\'intero continente africano.', en: 'Libya holds the largest proven oil reserves on the African continent.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'Gran parte del territorio libico si trova all\'interno del deserto del Sahara.', en: 'Most of Libya\'s territory lies within the Sahara Desert.' }, category: 'geography', source: 'Britannica' },
  ],
  MG: [
    { text: { it: 'Il Madagascar è la quarta isola più estesa al mondo.', en: 'Madagascar is the fourth-largest island in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Madagascar ospita quasi 40 specie di lemuri che non si trovano in nessun\'altra parte del mondo.', en: 'Madagascar is home to nearly 40 species of lemurs found nowhere else on Earth.' }, category: 'nature', source: 'Britannica' },
  ],
  MW: [
    { text: { it: 'Il Lago Malawi è il terzo lago più esteso d\'Africa e ospita circa il 15% di tutte le specie di pesci d\'acqua dolce del pianeta.', en: 'Lake Malawi is Africa\'s third-largest lake and is home to about 15% of all the world\'s freshwater fish species.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Il Malawi è soprannominato "il caldo cuore dell\'Africa" per l\'ospitalità della sua gente.', en: 'Malawi is nicknamed "The Warm Heart of Africa" for the friendliness of its people.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  ML: [
    { text: { it: 'Nel XIV secolo Timbuctù, in Mali, era un centro chiave del commercio transahariano di oro e sale.', en: 'By the 14th century, Timbuktu in Mali was a major hub of the trans-Saharan trade in gold and salt.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'L\'Impero del Mali, costruito anche su questa ricchezza commerciale, divenne il più grande e ricco impero mai visto nell\'Africa occidentale.', en: 'The Mali Empire, built in part on this trading wealth, became the largest and richest empire yet seen in West Africa.' }, category: 'history', source: 'Britannica' },
  ],
  MR: [
    { text: { it: 'Circa il 90% del territorio della Mauritania si trova all\'interno del deserto del Sahara.', en: 'About 90% of Mauritania\'s territory lies within the Sahara Desert.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La Mauritania forma un ponte geografico e culturale tra il Maghreb nordafricano e l\'Africa subsahariana occidentale.', en: 'Mauritania forms a geographic and cultural bridge between North Africa\'s Maghrib and West Africa\'s sub-Saharan region.' }, category: 'culture', source: 'Britannica' },
  ],
  MU: [
    { text: { it: 'Maurizio era la patria del dodo, uccello incapace di volare estinto entro il 1681 dopo l\'arrivo dei marinai europei e degli animali che portarono con sé.', en: 'Mauritius was home to the dodo, a flightless bird driven to extinction by 1681 after European sailors arrived with the animals that accompanied them.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'L\'isola di Maurizio, di origine vulcanica, è quasi interamente circondata da barriere coralline.', en: 'Mauritius, an island of volcanic origin, is almost entirely surrounded by coral reefs.' }, category: 'geography', source: 'Britannica' },
  ],
  MA: [
    { text: { it: 'La catena dell\'Atlante divide il Marocco in due metà: l\'Alto Atlante raggiunge i 4.165 metri sul Monte Toubkal.', en: 'The Atlas Mountains divide Morocco into two halves, with the High Atlas reaching 4,165 metres at Mount Toubkal.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il sud e il sud-est del Marocco si trovano all\'interno del deserto del Sahara.', en: 'Southern and southeastern Morocco lie within the Sahara Desert.' }, category: 'geography', source: 'Britannica' },
  ],
  MZ: [
    { text: { it: 'Il Mozambico ha un\'ampia costa sull\'Oceano Indiano, separata dal Madagascar dal Canale del Mozambico.', en: 'Mozambique has an extensive Indian Ocean coastline, separated from Madagascar by the Mozambique Channel.' }, category: 'geography', source: 'Britannica' },
  ],
  NA: [
    { text: { it: 'Il Deserto del Namib, lungo la costa atlantica della Namibia, è considerato il deserto più antico del mondo, arido da 55-80 milioni di anni.', en: 'The Namib Desert, along Namibia\'s Atlantic coast, is considered the oldest desert in the world, arid for 55-80 million years.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'La Costa degli Scheletri prende il nome dalle ossa di balena e dai relitti di navi un tempo disseminati lungo le sue rive.', en: 'The Skeleton Coast is named for the whale bones and shipwrecks once scattered along its shores.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  NE: [
    { text: { it: 'Il Niger è il più esteso Paese dell\'Africa occidentale.', en: 'Niger is the largest country in West Africa by area.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'Oltre l\'80% del territorio del Niger si trova all\'interno del deserto del Sahara.', en: 'Over 80% of Niger\'s territory lies within the Sahara Desert.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  NG: [
    { text: { it: 'La Nigeria è il Paese più popoloso dell\'Africa, con oltre 200 milioni di abitanti.', en: 'Nigeria is the most populous country in Africa, with more than 200 million people.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'La Nigeria conta circa 250 gruppi etnici e centinaia di lingue diverse.', en: 'Nigeria is home to about 250 ethnic groups and hundreds of different languages.' }, category: 'culture', source: 'Britannica' },
  ],
  RW: [
    { text: { it: 'Il Ruanda è soprannominato "il Paese dalle mille colline" per il suo paesaggio di altopiani interrotti da innumerevoli colline e valli.', en: 'Rwanda is nicknamed "the land of a thousand hills" for its landscape of high plateaus broken by countless hills and valleys.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'I Monti Virunga, in Ruanda, ospitano l\'ultima popolazione al mondo di gorilla di montagna.', en: 'The Virunga Mountains in Rwanda are home to the world\'s last remaining population of mountain gorillas.' }, category: 'nature', source: 'Britannica' },
  ],
  ST: [
    { text: { it: 'São Tomé e Príncipe è il secondo Paese più piccolo dell\'Africa.', en: 'São Tomé and Príncipe is the second-smallest country in Africa.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Nel 1908 São Tomé era diventata il primo produttore mondiale di cacao.', en: 'By 1908, São Tomé had become the world\'s largest producer of cocoa.' }, category: 'history', source: 'Britannica' },
  ],
  SN: [
    { text: { it: 'La penisola di Capo Verde, presso Dakar, è il punto più occidentale dell\'intero continente africano.', en: 'The Cape Verde Peninsula, near Dakar, is the westernmost point of the African continent.' }, category: 'record', source: 'Britannica' },
  ],
  SC: [
    { text: { it: 'Le isole granitiche delle Seychelles sono considerate le isole oceaniche più antiche del mondo, resti dell\'antico supercontinente Gondwana.', en: 'The granitic islands of the Seychelles are considered the oldest oceanic islands in the world, remnants of the ancient supercontinent Gondwana.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'L\'arcipelago delle Seychelles è composto da circa 115 isole.', en: 'The Seychelles archipelago consists of about 115 islands.' }, category: 'geography', source: 'Britannica' },
  ],
  SL: [
    { text: { it: 'La capitale della Sierra Leone, Freetown, sorge su uno dei porti naturali più grandi al mondo.', en: 'Sierra Leone\'s capital, Freetown, sits on one of the largest natural harbours in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il nome Sierra Leone deriva dal portoghese "Serra Lyoa", cioè "monti dei leoni".', en: 'The name Sierra Leone comes from the Portuguese "Serra Lyoa," meaning "Lion Mountains".' }, category: 'culture', source: 'Britannica' },
  ],
  SO: [
    { text: { it: 'La Somalia ha la costa più lunga dell\'Africa continentale, circa 3.025 km secondo il CIA World Factbook.', en: 'Somalia has the longest coastline on mainland Africa, about 3,025 km according to the CIA World Factbook.' }, category: 'record', source: 'CIA World Factbook' },
  ],
  ZA: [
    { text: { it: 'Il Sudafrica è l\'unico Paese al mondo con tre capitali: Pretoria (esecutiva), Città del Capo (legislativa) e Bloemfontein (giudiziaria).', en: 'South Africa is the only country in the world with three capital cities: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).' }, category: 'record', source: 'Britannica / Council on Foreign Relations' },
    { text: { it: 'Questo assetto risale al 1910, quando quattro colonie britanniche separate si unirono nell\'Unione Sudafricana dividendo le funzioni di capitale come compromesso.', en: 'This arrangement dates to 1910, when four separate British colonies united into the Union of South Africa and split the capital functions as a compromise.' }, category: 'history', source: 'Council on Foreign Relations' },
  ],
  SS: [
    { text: { it: 'Il Sud Sudan è il Paese più giovane al mondo, indipendente dal Sudan dal 9 luglio 2011.', en: 'South Sudan is the world\'s youngest country, having become independent from Sudan on 9 July 2011.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Sud Sudan conta oltre 60 gruppi etnici diversi.', en: 'South Sudan is home to more than 60 different ethnic groups.' }, category: 'culture', source: 'Britannica' },
  ],
  SD: [
    { text: { it: 'A Khartoum, la confluenza tra Nilo Azzurro e Nilo Bianco dà origine al Nilo vero e proprio.', en: 'At Khartoum, the confluence of the Blue Nile and White Nile forms the Nile proper.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il Sudan conta più piramidi antiche dell\'Egitto: oltre 200 a Meroe, costruite dal Regno di Kush.', en: 'Sudan has more ancient pyramids than Egypt, over 200 at Meroë, built by the Kingdom of Kush.' }, category: 'history', source: 'Britannica' },
  ],
  TZ: [
    { text: { it: 'Il Kibo, la cima principale del Kilimangiaro in Tanzania, raggiunge i 5.895 metri, il punto più alto d\'Africa.', en: 'Kibo, the main peak of Mount Kilimanjaro in Tanzania, reaches 5,895 metres, the highest point in Africa.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Parco Nazionale del Serengeti protegge le grandi migrazioni di gnu, zebre e gazzelle.', en: 'Serengeti National Park protects the great migrations of wildebeest, zebra, and gazelle.' }, category: 'nature', source: 'Britannica' },
  ],
  TG: [
    { text: { it: 'Il Togo è uno dei Paesi più stretti al mondo: meno di 115 km di larghezza per circa 515 km di lunghezza, da una breve costa sul Golfo di Guinea.', en: 'Togo is one of the narrowest countries in the world: less than 115 km wide, stretching about 515 km north from a short coastline on the Gulf of Guinea.' }, category: 'record', source: 'Britannica' },
  ],
  TN: [
    { text: { it: 'Capo Angela, in Tunisia, è il punto più settentrionale dell\'intero continente africano.', en: 'Cape Angela, in Tunisia, is the northernmost point of the entire African continent.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'L\'antica Cartagine, fondata dai Fenici intorno all\'VIII secolo a.C. vicino all\'attuale Tunisi, fu per secoli una delle grandi potenze del Mediterraneo.', en: 'Ancient Carthage, founded by the Phoenicians around the 8th century BCE near modern Tunis, was for centuries one of the great powers of the Mediterranean.' }, category: 'history', source: 'Britannica' },
  ],
  UG: [
    { text: { it: 'Winston Churchill soprannominò l\'Uganda "la perla dell\'Africa" dopo averla visitata in epoca coloniale britannica.', en: 'Winston Churchill nicknamed Uganda "the Pearl of Africa" after visiting it during British colonial rule.' }, category: 'culture', source: 'Britannica-adjacent' },
    { text: { it: 'La capitale Kampala sorge vicino al Lago Vittoria, sorgente del fiume Nilo.', en: 'The capital, Kampala, lies near Lake Victoria, the source of the Nile River.' }, category: 'geography', source: 'Britannica' },
  ],
  ZM: [
    { text: { it: 'Lo Zambia prende il nome dal fiume Zambesi, che drena gran parte del suo territorio.', en: 'Zambia takes its name from the Zambezi River, which drains most of the country.' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Lo Zambia condivide con lo Zimbabwe le Cascate Vittoria, una delle Sette Meraviglie Naturali del mondo.', en: 'Zambia shares Victoria Falls with Zimbabwe, one of the Seven Natural Wonders of the World.' }, category: 'nature', source: 'Britannica' },
  ],
  ZW: [
    { text: { it: 'Le rovine di Grande Zimbabwe, un\'antica città in pietra dell\'età del ferro, hanno dato il nome al Paese: "zimbabwe" significa "case di pietra" in lingua shona.', en: 'The Great Zimbabwe ruins, an Iron Age stone city, gave the country its name: "zimbabwe" means "stone houses" in the Shona language.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Le Cascate Vittoria, note localmente come Mosi-oa-Tunya ("il fumo che tuona"), sono Patrimonio dell\'Umanità UNESCO.', en: 'Victoria Falls, known locally as Mosi-oa-Tunya ("The Smoke That Thunders"), is a UNESCO World Heritage Site.' }, category: 'nature', source: 'UNESCO / Britannica' },
  ],

  // ---- North America ----
  AG: [
    { text: { it: 'Antigua è celebre per le sue "365 spiagge", una per ogni giorno dell\'anno.', en: 'Antigua is famous for its "365 beaches," one for every day of the year.' }, category: 'record', source: 'Britannica-adjacent' },
    { text: { it: 'Barbuda è un\'isola corallina pianeggiante, mentre Antigua è di origine vulcanica con il Monte Obama a 405 metri.', en: 'Barbuda is a flat coral island, while Antigua is volcanic in origin, with Mount Obama rising to 405 metres.' }, category: 'geography', source: 'Britannica' },
  ],
  BS: [
    { text: { it: 'Le Bahamas comprendono quasi 700 isole e cayos, di cui solo circa 30 abitate.', en: 'The Bahamas consists of nearly 700 islands and cays, only about 30 of which are inhabited.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Le Bahamas sono formate da calcare corallino e non hanno fiumi.', en: 'The Bahamas is made up of coralline limestone and has no rivers.' }, category: 'geography', source: 'Britannica' },
  ],
  BB: [
    { text: { it: 'Barbados è l\'isola più orientale dei Caraibi ed è composta quasi interamente da calcare corallino, non da roccia vulcanica.', en: 'Barbados is the easternmost Caribbean island and is made up almost entirely of coral limestone rather than volcanic rock.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'La Harrison\'s Cave, a Barbados, è un celebre sistema di grotte scavate nel calcare corallino dell\'isola.', en: 'Harrison\'s Cave in Barbados is a famous cave system carved into the island\'s coral limestone.' }, category: 'nature', source: 'Britannica' },
  ],
  BZ: [
    { text: { it: 'La Barriera Corallina del Belize è la seconda più estesa al mondo dopo la Grande Barriera Corallina australiana ed è Patrimonio UNESCO.', en: 'The Belize Barrier Reef is the second-largest in the world after Australia\'s Great Barrier Reef, and is a UNESCO World Heritage Site.' }, category: 'nature', source: 'UNESCO / Britannica' },
    { text: { it: 'Il Belize fu l\'ultima colonia britannica sulla terraferma americana.', en: 'Belize was the last British colony on the American mainland.' }, category: 'history', source: 'Britannica' },
  ],
  CA: [
    { text: { it: 'Il Canada è, per superficie, il secondo Paese al mondo dopo la Russia.', en: 'Canada is the second-largest country in the world by area, after Russia.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Canada ha la costa più lunga di qualsiasi Paese al mondo, affacciata su tre oceani: Atlantico, Pacifico e Artico.', en: 'Canada has the longest coastline of any country in the world, bordering three oceans: the Atlantic, Pacific, and Arctic.' }, category: 'record', source: 'Britannica' },
  ],
  CR: [
    { text: { it: 'La Costa Rica ha abolito il proprio esercito con la costituzione del 1949.', en: 'Costa Rica abolished its army under its 1949 constitution.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Pur occupando meno dello 0,03% della superficie terrestre, la Costa Rica ospita circa il 5% della biodiversità del pianeta.', en: 'Although it covers less than 0.03% of Earth\'s surface, Costa Rica is home to about 5% of the planet\'s biodiversity.' }, category: 'nature', source: 'Britannica-adjacent' },
  ],
  CU: [
    { text: { it: 'Cuba è la più grande isola dei Caraibi, lunga circa 1.250 km.', en: 'Cuba is the largest island in the Caribbean, about 1,250 km long.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Cuba comprende un arcipelago di circa 1.600 tra isole, isolotti e cayos.', en: 'Cuba comprises an archipelago of about 1,600 islands, islets, and cays.' }, category: 'geography', source: 'Britannica' },
  ],
  DM: [
    { text: { it: 'Dominica è soprannominata "l\'isola della natura" per le sue foreste pluviali, i vulcani e le sorgenti termali.', en: 'Dominica is nicknamed "the Nature Island" for its rainforests, volcanoes, and hot springs.' }, category: 'nature', source: 'Britannica' },
    { text: { it: 'Il Boiling Lake, nel parco nazionale Morne Trois Pitons, è una fumarola allagata tra le più grandi del mondo.', en: 'Boiling Lake, in Morne Trois Pitons National Park, is a flooded fumarole and one of the largest of its kind in the world.' }, category: 'nature', source: 'Britannica' },
  ],
  DO: [
    { text: { it: 'La Repubblica Dominicana occupa i due terzi orientali dell\'isola di Hispaniola, condivisa con Haiti.', en: 'The Dominican Republic occupies the eastern two-thirds of the island of Hispaniola, shared with Haiti.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il Pico Duarte, in Repubblica Dominicana, con i suoi 3.175 metri è il punto più alto di tutte le Antille.', en: 'Pico Duarte, in the Dominican Republic, at 3,175 metres, is the highest point in the entire West Indies.' }, category: 'record', source: 'Britannica' },
  ],
  SV: [
    { text: { it: 'El Salvador è l\'unico Paese centroamericano privo di una costa sui Caraibi.', en: 'El Salvador is the only Central American country without a Caribbean coastline.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Pur essendo il più piccolo Paese del Centro America continentale, El Salvador è il più densamente popolato.', en: 'Although it is the smallest mainland Central American country, El Salvador is the most densely populated.' }, category: 'record', source: 'Britannica' },
  ],
  GD: [
    { text: { it: 'Grenada è soprannominata "l\'isola delle spezie" ed è il secondo produttore mondiale di noce moscata dopo l\'Indonesia.', en: 'Grenada is nicknamed "the Spice Isle" and is the world\'s second-largest producer of nutmeg after Indonesia.' }, category: 'record', source: 'Britannica' },
  ],
  GT: [
    { text: { it: 'Il Guatemala fu il cuore della grande civiltà Maya, che nel suo periodo classico (250-900 d.C.) contava oltre 40 città.', en: 'Guatemala was the heartland of the great Maya civilization, which at its Classic-period height (250-900 CE) had more than 40 cities.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'Il Guatemala conta 37 vulcani; il Tajumulco, 4.220 metri, è la vetta più alta dell\'America Centrale.', en: 'Guatemala has 37 volcanoes; Tajumulco, at 4,220 metres, is the highest peak in Central America.' }, category: 'record', source: 'Britannica' },
  ],
  HT: [
    { text: { it: 'Con l\'indipendenza del 1804, ad esito della Rivoluzione haitiana, Haiti divenne la prima repubblica nera del mondo.', en: 'With independence in 1804, following the Haitian Revolution, Haiti became the first Black republic in the world.' }, category: 'history', source: 'Britannica' },
  ],
  HN: [
    { text: { it: 'Le rovine Maya di Copán, in Honduras, Patrimonio UNESCO dal 1980, includono una scalinata geroglifica con circa 1.260 simboli incisi.', en: 'The Maya ruins of Copán in Honduras, a UNESCO World Heritage Site since 1980, include a hieroglyphic stairway with about 1,260 carved symbols.' }, category: 'history', source: 'UNESCO / Britannica' },
  ],
  JM: [
    { text: { it: 'La Giamaica è la terza isola più estesa dei Caraibi e la più grande di lingua inglese.', en: 'Jamaica is the third-largest island in the Caribbean and the largest English-speaking one.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il caffè Blue Mountain, coltivato oltre i 1.500 metri di altitudine in Giamaica, è tra i più rari e pregiati al mondo.', en: 'Blue Mountain coffee, grown above 1,500 metres in Jamaica, is among the rarest and most prized coffees in the world.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  MX: [
    { text: { it: 'Il territorio del Messico fu la culla di grandi civiltà precolombiane, tra cui Olmechi, Maya e Aztechi.', en: 'Mexico\'s territory was home to major pre-Columbian civilizations, including the Olmec, Maya, and Aztec.' }, category: 'history', source: 'Britannica' },
    { text: { it: 'La capitale azteca, Tenochtitlan, fu fondata su un\'isola del Lago Texcoco nel 1325 e arrivò a contare circa 300.000 abitanti.', en: 'The Aztec capital, Tenochtitlan, was founded on an island in Lake Texcoco in 1325 and grew to about 300,000 inhabitants.' }, category: 'history', source: 'Britannica' },
  ],
  NI: [
    { text: { it: 'Il Lago Nicaragua è l\'unico lago d\'acqua dolce al mondo che ospita squali di provenienza oceanica.', en: 'Lake Nicaragua is the only freshwater lake in the world known to host sharks of oceanic origin.' }, category: 'nature', source: 'Britannica-adjacent' },
    { text: { it: 'È anche il lago più esteso dell\'America Centrale, con oltre 400 isole al suo interno.', en: 'It is also the largest lake in Central America, containing more than 400 islands.' }, category: 'geography', source: 'Britannica-adjacent' },
  ],
  PA: [
    { text: { it: 'Il Canale di Panama collega gli oceani Atlantico e Pacifico attraverso l\'istmo di Panama ed è in funzione dal 1914.', en: 'The Panama Canal connects the Atlantic and Pacific oceans across the Isthmus of Panama and has been in operation since 1914.' }, category: 'history', source: 'Britannica' },
  ],
  KN: [
    { text: { it: 'Saint Kitts e Nevis è il più piccolo Stato sovrano delle Americhe, sia per superficie sia per popolazione.', en: 'Saint Kitts and Nevis is the smallest sovereign country in the Americas, both by area and by population.' }, category: 'record', source: 'Britannica' },
  ],
  LC: [
    { text: { it: 'I Pitons, due guglie vulcaniche gemelle di Saint Lucia, sono Patrimonio dell\'Umanità UNESCO dal 2004.', en: 'The Pitons, twin volcanic spires in Saint Lucia, have been a UNESCO World Heritage Site since 2004.' }, category: 'nature', source: 'UNESCO / Britannica' },
  ],
  VC: [
    { text: { it: 'Saint Vincent e Grenadine è composto da oltre 30 isole, che formano la catena delle Grenadine.', en: 'Saint Vincent and the Grenadines is made up of more than 30 islands forming the Grenadines chain.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Il vulcano Soufrière, 1.234 metri, ha causato eruzioni devastanti nella storia dell\'isola di Saint Vincent.', en: 'The Soufrière volcano, at 1,234 metres, has caused devastating eruptions in the history of the island of Saint Vincent.' }, category: 'nature', source: 'Britannica' },
  ],
  TT: [
    { text: { it: 'Trinidad e Tobago è la patria dello steelpan, unico strumento musicale acustico inventato nel XX secolo, diventato strumento nazionale nel 1992.', en: 'Trinidad and Tobago is the birthplace of the steelpan, the only acoustic musical instrument invented in the 20th century, which became the national instrument in 1992.' }, category: 'culture', source: 'Britannica-adjacent' },
  ],
  US: [
    { text: { it: 'L\'Alaska, il più grande stato USA, è più estesa dei tre stati successivi per superficie messi insieme.', en: 'Alaska, the largest U.S. state, is bigger than the next three largest states combined.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il punto più alto dell\'Alaska, il Denali, raggiunge i 6.190 metri: la vetta più alta del Nord America.', en: 'Alaska\'s highest point, Denali, rises to 6,190 metres, the tallest peak in North America.' }, category: 'record', source: 'Britannica' },
  ],

  // ---- South America ----
  AR: [
    { text: { it: 'La Cordigliera delle Ande forma un confine naturale di circa 5.140 km tra Argentina e Cile e include l\'Aconcagua, a 6.960 metri la vetta più alta delle Ande.', en: 'The Andes form a natural border of about 5,140 km between Argentina and Chile and include Aconcagua, which at 6,960 metres is the highest peak in the Andes.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'La Patagonia, la vasta regione semi-arida dell\'Argentina meridionale, ospita fauna come condor, puma e guanachi.', en: 'Patagonia, the vast semiarid region of southern Argentina, is home to wildlife such as condors, pumas, and guanacos.' }, category: 'nature', source: 'Britannica' },
  ],
  BO: [
    { text: { it: 'La Bolivia ha due capitali: Sucre, capitale costituzionale e sede della Corte Suprema, e La Paz, sede del governo.', en: 'Bolivia has two capitals: Sucre, the constitutional capital and seat of the Supreme Court, and La Paz, the seat of government.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Salar de Uyuni, sull\'altopiano boliviano, è la distesa di sale più grande del mondo.', en: 'The Uyuni Salt Flat, on the Bolivian Altiplano, is the largest salt flat in the world.' }, category: 'record', source: 'Britannica' },
  ],
  BR: [
    { text: { it: 'Il Brasile è il più grande Paese del Sud America e il quinto al mondo, occupando quasi metà della superficie del continente.', en: 'Brazil is the largest country in South America and the fifth largest in the world, covering nearly half the continent\'s land area.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Circa il 60% della foresta amazzonica, la più grande foresta pluviale tropicale del pianeta, si trova entro i confini del Brasile.', en: 'About 60% of the Amazon rainforest, the largest tropical rainforest on Earth, lies within Brazil\'s borders.' }, category: 'nature', source: 'Britannica' },
  ],
  CL: [
    { text: { it: 'Il Cile si estende per circa 4.300 km da nord a sud, con una larghezza media di appena 177 km: è il Paese più lungo e stretto del mondo.', en: 'Chile stretches about 4,300 km from north to south, averaging only 177 km in width, the longest, narrowest country in the world.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Il Deserto di Atacama, nel nord del Cile, è uno dei luoghi più aridi della Terra: alcune sue aree non hanno mai registrato precipitazioni.', en: 'The Atacama Desert in northern Chile is one of the driest places on Earth: some areas have never recorded rainfall.' }, category: 'nature', source: 'Britannica' },
  ],
  CO: [
    { text: { it: 'La Colombia è l\'unico Paese del Sud America con coste sia sull\'Oceano Pacifico sia sul Mar dei Caraibi.', en: 'Colombia is the only country in South America with coastlines on both the Pacific Ocean and the Caribbean Sea.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Pur occupando meno dell\'1% della superficie terrestre mondiale, la Colombia è uno dei Paesi con la maggiore biodiversità del pianeta.', en: 'Although it covers less than 1% of the world\'s land area, Colombia is one of the most biodiverse countries on the planet.' }, category: 'nature', source: 'CBD (Convenzione ONU sulla Diversità Biologica)' },
  ],
  EC: [
    { text: { it: 'L\'Ecuador prende il nome dall\'Equatore, che lo attraversa dividendolo nelle regioni di Costa, Sierra e Oriente.', en: 'Ecuador is named after the Equator, which crosses it, dividing it into the Costa, Sierra, and Oriente regions.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Le Isole Galápagos, territorio ecuadoriano, ospitano una fauna unica al mondo che ispirò le teorie di Darwin sull\'evoluzione dopo la sua visita nel 1835.', en: 'The Galápagos Islands, Ecuadorian territory, host wildlife found nowhere else, which inspired Darwin\'s theories on evolution after his 1835 visit.' }, category: 'nature', source: 'Britannica' },
  ],
  GY: [
    { text: { it: 'La Guyana è l\'unico Paese sudamericano la cui lingua ufficiale è l\'inglese.', en: 'Guyana is the only country in South America where the official language is English.' }, category: 'culture', source: 'Britannica' },
    { text: { it: 'Il nome Guyana deriva da un termine indigeno che significa "terra d\'acqua".', en: 'The name Guyana comes from an Indigenous term meaning "land of water".' }, category: 'culture', source: 'Britannica' },
  ],
  PY: [
    { text: { it: 'Il Paraguay ha due lingue ufficiali, spagnolo e guaraní, ed è uno dei pochi Paesi al mondo dove una lingua indigena è parlata dalla maggioranza della popolazione.', en: 'Paraguay has two official languages, Spanish and Guaraní, and is one of the few countries where an Indigenous language is spoken by the majority of the population.' }, category: 'culture', source: 'Britannica' },
  ],
  PE: [
    { text: { it: 'Machu Picchu, costruita a metà del XV secolo come residenza dell\'imperatore Pachacútec, è Patrimonio UNESCO dal 1983.', en: 'Machu Picchu, built in the mid-15th century as a residence for the emperor Pachacútec, has been a UNESCO World Heritage Site since 1983.' }, category: 'history', source: 'UNESCO / Britannica' },
    { text: { it: 'Al suo apice, l\'Impero Inca fu il più vasto mai esistito nelle Americhe, esteso dall\'Ecuador fino al Cile centrale.', en: 'At its height, the Inca Empire was the largest ever to exist in the Americas, stretching from Ecuador to central Chile.' }, category: 'history', source: 'Britannica' },
  ],
  SR: [
    { text: { it: 'Il Suriname è il più piccolo Stato sovrano del Sud America.', en: 'Suriname is the smallest sovereign country in South America.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'È l\'unico Paese sovrano delle Americhe la cui lingua ufficiale è l\'olandese, eredità del suo passato coloniale.', en: 'It is the only sovereign country in the Americas whose official language is Dutch, a legacy of its colonial past.' }, category: 'culture', source: 'Britannica' },
  ],
  UY: [
    { text: { it: 'L\'Uruguay è il Paese di lingua spagnola più piccolo del Sud America.', en: 'Uruguay is the smallest Spanish-speaking country in South America.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'È l\'unico Paese sudamericano il cui territorio si trova interamente fuori dai tropici.', en: 'It is the only South American country lying entirely outside the tropics.' }, category: 'geography', source: 'Britannica' },
  ],
  VE: [
    { text: { it: 'Le Cascate dell\'Angel, in Venezuela, sono la cascata più alta del mondo, con un salto di quasi 980 metri.', en: 'Angel Falls in Venezuela is the world\'s tallest waterfall, with a drop of nearly 980 metres.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'Si trovano su un altopiano chiamato Auyán-Tepui ("Montagna del Diavolo"), immerse in una giungla così fitta che si osservano al meglio dall\'alto.', en: 'They flow from a plateau called Auyán-Tepui ("Devil\'s Mountain"), surrounded by jungle so dense they are best viewed from the air.' }, category: 'geography', source: 'Britannica' },
  ],

  // ---- Oceania ----
  AU: [
    { text: { it: 'L\'Australia è al tempo stesso il continente più piccolo e, dopo Russia, Canada, Cina, Stati Uniti e Brasile, il sesto Paese più esteso al mondo, l\'unico tra questi sei interamente circondato dall\'acqua.', en: 'Australia is both the smallest continent and, after Russia, Canada, China, the United States, and Brazil, the sixth-largest country in the world, the only one of those six entirely surrounded by water.' }, category: 'record', source: 'Governo australiano' },
    { text: { it: 'Il lungo isolamento del continente ha permesso l\'evoluzione di una fauna unica, tra cui l\'ornitorinco e l\'echidna, gli unici mammiferi al mondo che depongono le uova.', en: 'The continent\'s long isolation allowed unique wildlife to evolve, including the platypus and the echidna, the only egg-laying mammals on Earth.' }, category: 'nature', source: 'Britannica' },
  ],
  FJ: [
    { text: { it: 'Le Figi sono composte da circa 300 isole, di cui solo un centinaio abitate, oltre a 540 isolotti minori.', en: 'Fiji is made up of about 300 islands, only around a hundred inhabited, plus 540 smaller islets.' }, category: 'record', source: 'Britannica' },
  ],
  KI: [
    { text: { it: 'Kiribati è tra i pochi Paesi al mondo il cui territorio attraversa sia l\'Equatore sia la linea internazionale del cambiamento di data, estendendosi in tutti e quattro gli emisferi.', en: 'Kiribati is among the few countries whose territory straddles both the Equator and the International Date Line, extending into all four hemispheres.' }, category: 'record', source: 'Britannica' },
  ],
  MH: [
    { text: { it: 'Tra il 1946 e il 1958 gli Stati Uniti condussero 67 test nucleari sugli atolli di Bikini ed Enewetak, nelle Isole Marshall.', en: 'Between 1946 and 1958, the United States conducted 67 nuclear tests on Bikini and Enewetak atolls in the Marshall Islands.' }, category: 'history', source: 'Britannica' },
  ],
  FM: [
    { text: { it: 'Nan Madol, sull\'isola di Pohnpei, è l\'unica città antica conosciuta costruita sopra una barriera corallina, soprannominata la "Venezia del Pacifico".', en: 'Nan Madol, on Pohnpei island, is the only known ancient city built on top of a coral reef, nicknamed the "Venice of the Pacific".' }, category: 'history', source: 'Britannica' },
  ],
  NR: [
    { text: { it: 'Nauru è il terzo Paese più piccolo del mondo per superficie, dopo Vaticano e Monaco.', en: 'Nauru is the third-smallest country in the world by area, after Vatican City and Monaco.' }, category: 'record', source: 'Britannica' },
    { text: { it: 'La sua economia dipendeva quasi interamente dall\'estrazione di fosfati, un tempo tra le riserve più ricche al mondo, oggi quasi esaurite.', en: 'Its economy depended almost entirely on phosphate mining, once among the richest deposits in the world, now nearly depleted.' }, category: 'history', source: 'Britannica' },
  ],
  NZ: [
    { text: { it: 'Oltre l\'80% delle piante native della Nuova Zelanda non si trova in nessun\'altra parte del mondo, e circa il 71% degli uccelli nativi lo era prima dell\'arrivo dell\'uomo.', en: 'Over 80% of New Zealand\'s native plants are found nowhere else on Earth, and about 71% of native bird species were endemic before human arrival.' }, category: 'nature', source: 'Te Ara - Enciclopedia della Nuova Zelanda' },
    { text: { it: 'Il kiwi, uccello incapace di volare presente solo in Nuova Zelanda, ha dato il soprannome "Kiwi" agli abitanti del Paese.', en: 'The kiwi, a flightless bird found only in New Zealand, gave the nickname "Kiwis" to the country\'s people.' }, category: 'culture', source: 'Britannica' },
  ],
  PW: [
    { text: { it: 'Le Rock Islands di Palau includono la Jellyfish Lake, dove milioni di meduse dorate hanno perso nel tempo la capacità di pungere, evolvendosi in isolamento.', en: 'Palau\'s Rock Islands include Jellyfish Lake, where millions of golden jellyfish have lost their ability to sting over time, having evolved in isolation.' }, category: 'nature', source: 'UNESCO' },
  ],
  PG: [
    { text: { it: 'La Papua Nuova Guinea conta oltre 800 lingue indigene distinte, la maggiore diversità linguistica di qualsiasi Paese al mondo.', en: 'Papua New Guinea has over 800 distinct Indigenous languages, the greatest linguistic diversity of any country in the world.' }, category: 'record', source: 'Britannica' },
  ],
  WS: [
    { text: { it: 'Samoa, vicino alla linea internazionale del cambiamento di data, è tra i primi luoghi al mondo a entrare in un nuovo giorno.', en: 'Samoa, near the International Date Line, is among the first places in the world to enter a new day.' }, category: 'record', source: 'timeanddate.com' },
    { text: { it: 'Nel 2011 Samoa spostò la propria posizione rispetto alla linea del cambiamento di data, saltando un intero giorno di calendario, per allinearsi ai fusi orari di Australia e Nuova Zelanda.', en: 'In 2011 Samoa shifted its position relative to the Date Line, skipping an entire calendar day, to align with the time zones of Australia and New Zealand.' }, category: 'history', source: 'timeanddate.com' },
  ],
  SB: [
    { text: { it: 'Guadalcanal, la maggiore delle Isole Salomone, fu teatro di una delle battaglie più cruente della guerra del Pacifico nella Seconda guerra mondiale.', en: 'Guadalcanal, the largest of the Solomon Islands, was the site of one of the bloodiest battles of the Pacific War in World War II.' }, category: 'history', source: 'Britannica' },
  ],
  TO: [
    { text: { it: 'Tonga è l\'unica nazione del Pacifico a non essere mai stata colonizzata, mantenendo una monarchia indigena ininterrotta.', en: 'Tonga is the only Pacific nation never to have been colonized, maintaining an unbroken Indigenous monarchy.' }, category: 'history', source: 'CIA World Factbook' },
  ],
  TV: [
    { text: { it: 'Tuvalu, con appena 26 km², è il quarto Paese più piccolo del mondo.', en: 'Tuvalu, at just 26 km², is the fourth-smallest country in the world.' }, category: 'record', source: 'Britannica' },
  ],
  VU: [
    { text: { it: 'Vanuatu è formato da una catena di 13 isole principali di origine vulcanica, con diversi vulcani ancora attivi.', en: 'Vanuatu consists of a chain of 13 principal volcanic islands, several with active volcanoes.' }, category: 'geography', source: 'Britannica' },
    { text: { it: 'Oltre alle tre lingue ufficiali, a Vanuatu si parlano più di 100 lingue: tra le maggiori diversità linguistiche al mondo in proporzione alla popolazione.', en: 'Beyond its three official languages, more than 100 languages are spoken in Vanuatu, among the greatest linguistic diversity in the world relative to population.' }, category: 'culture', source: 'Britannica' },
  ],
};

export function getCountryFacts(code: string): CountryFact[] {
  return COUNTRY_FACTS[code] ?? [];
}
