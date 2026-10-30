# Podklady pro zjednodušenou ekologii buku

Prověřeno 24. 10. 2026 podle výzkumu buku lesního. Jde o posouzení parametrů,
nikoli měření konkrétního stromu nebo zkoušku běhu aplikace.

## Plocha listů

Model používá plochu půdorysu koruny × 4. Hodnota 4 je přiměřený výukový
odhad plně olistěné koruny, nikoli změřená plocha tohoto buku.

Magnani et al. (1998) uvádějí pro 35letý bukový porost LAI 3,8.
Herbst et al. (1999) uvádějí pro 105letý porost s výškou 29 m maximum LAI 4,5.
Jde o porostní měření na plochu půdy; použití na půdorys jediného stromu je
další zjednodušení. PAI zahrnující i větve se nesmí zaměňovat s LAI listů.

- https://doi.org/10.1046/j.1365-3040.1998.00328.x
- https://www.afs-journal.org/articles/forest/pdf/1999/02/AFS_0003-4312_1999_56_2_ART0003.pdf
- https://pubmed.ncbi.nlm.nih.gov/14750004/

Aktivní část plochy dodává animace: podíl připojených listů × druhá mocnina
jejich růstu. Odtržené listy již nevypařují vodu za strom ani netvoří cukry
v jeho výpočtu. Grafické kopie listů představují dekorativní hustotu koruny.

## Dostupná zásoba vody

Koeficient 8 litrů na m³ geometrického objemu dřeva se nepodařilo doložit
jako biologický vztah pro buk. Zůstává výukovým nastavením; údaj v aplikaci
je označen jako odhad. Objem grafického modelu navíc nerozlišuje bělové dřevo,
další živá pletiva a jejich vodní potenciál.

Köcher et al. (2013) uvádějí u čtyř roztroušeně pórovitých druhů včetně buku
s výškou 25–28 m průměrné denní čerpání zásob 5–12 kg vody, tj. přibližně
5–12 litrů, představující 10–22 % denní transpirace. To je denně čerpaná
voda z kmenových zásob, nikoli maximální kapacita celého stromu. Nelze z toho
odvodit univerzální koeficient litrů na m³ veškerého dřeva.

- https://doi.org/10.1093/treephys/tpt055
- https://pubmed.ncbi.nlm.nih.gov/23999137/

## Spotřeba a velikost

Nepodložená korekce `sqrt(objem / 5) × sqrt(26,1 / výška)` byla odstraněna.
Velikost stromu ovlivňuje základní výpar přes odhad plochy listů.

Základní sazba 0,9 l/m² listů za 12 hodin plného světla zůstává názorným
nastavením maxima. Skutečný denní výpar model integruje podle světla,
aktivního olistění a dostupnosti vody. Není to naměřená denní spotřeba
tohoto buku; použitá porostní data neposkytují kalibraci jednotlivého stromu.
Pro srovnání Herbst et al. zjistili roční transpiraci bukového porostu
326–421 mm. Roční porostní součet neurčuje okamžitý výpar jediného stromu.

Přidaný násobitel spotřeby `1 + (teplota − 20) × 0,015` byl odstraněn.
Teplota se nadále zobrazuje a ovlivňuje výukovou odezvu fotosyntézy.

## Čas

### Jarní rašení buku

Nové listy začínají v modelu růst od 25. dubna. Dokončení opadu starých
listů během zimy samo o sobě růst nespouští. Stejný nejčasnější termín
platí pro obnovu listů po suchu; růst je povolen v pozdním jaru a létě.
Datum odpovídá názornému termínu rašení buku ve středoevropských podmínkách,
nikoli přesné předpovědi pro každé místo a rok. Výzkum českých fenologických
dat uvádí průměrné nástupy rašení buku mezi 13. dubnem a 6. květnem podle
lokality a nadmořské výšky.

- https://gisak.vsb.cz/GISacek/GISacek_2014/referaty/prazak.pdf

Hlavní smyčka počítá jediný přírůstek modelových minut. Stejná hodnota
posouvá denní hodiny a ekologii včetně vody, zamokření a počasí. Automatický
kalendář mimo úvod čerpá z uplynulých modelových minut. Úvod si ponechává
zrychlenou prezentaci ročních období. Starý samostatný týdenní cyklus slunce
byl odstraněn; slunce používá denní hodiny nebo ruční nastavení.

## Noční teplota u koruny

Model přidává v noci až 0,5 °C k teplotě vzduchu u plně olistěné koruny.
Příspěvek je přímo úměrný aktivnímu olistění a plynule nabíhá od západu
slunce do výšky slunce −12°. Při svítání stejně plynule mizí. Ztlumení
slunečního světla samo o sobě nezapíná noční oteplení.

Jde o jednoduché znázornění omezeného vyzařování tepla pod korunou.
Hodnota 0,5 °C je výukové nastavení, nikoli měření tohoto buku. Model
nepočítá oblačnost ani vítr a nepopisuje všechny možné noční situace.
Denní ochlazení zůstává navázané na skutečný výpar vody.

Mechanismus omezeného nočního vychládání popisuje srovnání otevřených
ploch a prostoru pod lesním zápojem ve Švýcarsku:
https://www.sciencedirect.com/science/article/abs/pii/S0168192308003171

## Sezónní kalendář buku lesního

`obdobi/beech_phenology.js` používá orientační český kalendář: rašení od 25. dubna,
plné olistění kolem 15. května, začátek podzimního barvení koncem září,
červenooranžová fáze během října a opad od 25. října do 20. listopadu.
Konkrétní dny jsou zvolené body výukového modelu, nikoli univerzální
pozorované termíny. Stanoviště, nadmořská výška a počasí je mohou posouvat.
Barva, kalendář opadu a růst mají společný datumový základ; barva sama
neurčuje datum opadu. Sucho může měnit barvu nezávisle na kalendáři.

Podklady:
- Vojenské lesy a statky: listy buku raší koncem dubna až v první polovině
  května; některé mohou vytrvat na větvích dlouho do zimy.
  https://deti.vls.cz/tipy-do-lesa/zivot-v-lese/stromy/buk-lesni/
- ČHMÚ, Meteorologické zprávy 69 (2016), s. 135–136: na stanici Brloh je
  průměrný nástup 10% podzimního zbarvení buku 30. září. Článek odděluje
  přirozené podzimní zbarvení od předčasného žloutnutí při suchu.
  https://www.chmi.cz/files/portal/docs/reditel/SIS/casmz/assets/2016/chmu_mz_5-16.pdf
- ČHMÚ, normál 1991–2020: úplný opad buku připadá podle oblasti zpravidla
  na listopad. Mapa zveřejněná programem GLOBE:
  https://globe-czech.cz/_files/userfiles/Fenofaze_buk_CHMU.pdf
- Univerzita Hradec Králové: podzimní barvy buku zahrnují žlutou, červenou
  a tmavě hnědou; červenání proto není samostatný univerzální termín.
  https://zelen-mesta.uhk.cz/buk-lesni-fagus-sylvatica/
