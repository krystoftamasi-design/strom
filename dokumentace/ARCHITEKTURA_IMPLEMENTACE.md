# Architektura ve stávajícím prohlížeči

Vstup zůstává `index.html`. Jeden načtený strom, jeden renderer a jedna animační smyčka. Kapitoly Úvod, Fotosyntéza, Transpirace, Kořeny a Semenace mění obsah a zvýrazněný děj. Informace jsou přichycené k bodům koruny, kmene a kořenů pomocí projekce z 3D scény a spojovacích linek. Delší texty se rozbalují přímo u příslušného místa. Přítok, zásoba, období a nastavení slunce se sdílejí. Technické ovladače zůstávají pod tlačítkem Nastavení; jejich dosavadní profil `strom.settings.v1` se dál načítá a ukládá.

Nový úvod „Rok v životě buku“ přehraje přibližně 12sekundový průchod od konce zimy přes jaro, léto a podzim do další zimy. Používá stejnou sezónní polohu, barvy a společnou funkci životního cyklu listů jako interaktivní kolečko. Začíná stávající animací dorůstání, od poloviny října spouští skutečný pád listů a koncem podzimu jej zrychluje. Poslední listy nechá dopadnout a zmizet před automatickým přechodem do Fotosyntézy. Zobrazený den a vodní bilance používají společný čas: den trvá běžně 60 sekund, v úvodu 6 sekund. Po dokončení nebo přeskočení se obnoví předchozí období a slunce. Neaktivní karta neposouvá simulaci.

## Jednoduché moduly

- `kapitoly/chapters.js`, `kapitoly/chapters.css`: kapitoly, společné původní ovladače, obsah a schéma kořenové špičky.
- `okna/tree_annotations.js`, `okna/tree_annotations.css`: prostorové popisky přichycené ke stromu.
- `obdobi/season_ring.js`: vodorovný 3D kruh kolem kořenů s názvy období v jeho rovině. Čára používá původní průhlednou texturu `LINKA.png`, zkopírovanou do `web_assets/season_ring_brush.png`. Kruh reaguje na tažení myší i prstem, kliknutí na prostorový název období a kolečko myši; klávesnice má zachované původní ovladače období. Výběr se promítne do koruny i vodního modelu. Perspektivu a zakrytí řeší přímo 3D scéna.
- `obdobi/season_timeline.js`: plynulé propojení úhlu kruhu s původním posuvníkem období. Automatický rok používá čas vodního modelu (365 modelových dní na oběh) a zobrazuje datum. Ruční otočení nebo použití posuvníku pozastaví automatický rok, takže úhel po puštění zůstane přesně zachovaný. Tlačítko „Pokračovat v roce“ obnoví posun z vybraného místa. Vodní bilance nadále běží ve zvolených podmínkách.

Při dosažení zimy se listové sítě nevypínají. Od poloviny října se postupně spouští animace pádu a na začátku zimy se uvolní všechny zbývající listy. Pád má vlastní plynulé hodiny, které se koncem podzimu a v zimě zrychlují. V druhé polovině zimy se spustí stávající dorůstání nových listů; pokud při rychlém otočení ještě dobíhá starý pád, nejdříve zrychleně doběhne. Animace růstu a pádu se nepřekrývají a běží i po zastavení kalendáře. Stejná pravidla platí pro úvod i kolečko.

Kruh lze otáčet pouze dopředu. Opačný pohyb tažením nebo kolečkem myši je ignorován. Výběr dřívějšího období přes původní předvolby představuje jeho následující výskyt v dalším roce.
- `ekologie/tree_ecology.js`: jediná zásoba, sezónní nároky, vodní stres, fotosyntéza a orientační chladicí výkon.
- `index.html`: propojení nových modulů se stávajícími materiály, listy, vodní linkou a částicemi.
- `vykreslovani/photolysis_system.js`: volitelně přijímá vypočtenou fotosyntetickou aktivitu; při použití samostatně zachovává původní chování.

Není potřeba framework, sestavení ani nové balíčky. Písma Satoshi Variable a Nohemi jsou lokálně v `web_assets/fonts`.

## Rozměry a míra přesnosti

Výška nad zemí, obrys koruny a geometrický odhad objemu dřeva se získají jednorázově z načteného modelu před násobením listových ploch pro vizuální hustotu. Objem se počítá součtem orientovaných objemů trojúhelníků kmene a kořenů se zahrnutím měřítka. Síť není dendrometrické měření; otevřené části, průniky a stylizace mohou odhad zkreslit. HUD proto nyní ukazuje výšku skutečně načtené geometrie namísto pevně zadaných 26,1 m.

Současné koeficienty jsou **orientační výukové předvolby pro buk**, nikoli kalibrace konkrétního jedince. Zadání neobsahuje měřenou bělovou plochu ani prostředí. Biologickou věrnost zvyšuje propojení procesů; přesná absolutní čísla vyžadují terénní údaje.

| Předvolba | Použití |
| --- | --- |
| Plocha koruny × 4 | Odhad efektivní listové plochy; nezávisí na počtu grafických listových ploch |
| Objem dřeva × 8 l/m³ | Orientační mobilizovatelná zásoba, nikoli všechna voda ve dřevě |
| 0,9 l/m² listů/den, 12 hodin světla | Výchozí odpar, upravený velikostí, obdobím, světlem a vodním stresem |
| 8 µmol CO₂/m²/s | Referenční fotosyntetická aktivita; výstup je ekvivalent glukózy, nikoli skutečná zásoba cukrů |
| CO₂ 420 ppm, referenčně 280 ppm | Pevný ilustrační scénář +50 %, nikoli aktuální atmosférické měření |
| 2 450 kJ/kg | Přibližné skupenské teplo pro převod odparu na kW |
| 1 modelový den = 60 reálných sekund, v úvodu 6 sekund | Vodní bilance používá stejné tempo jako zobrazený den; výkony a toky zůstávají přepočtené za modelovou minutu |

Bilance: `zásoba = clamp(zásoba + (skutečný příjem − spotřeba) × modelové minuty, 0, kapacita)`. Numerický krok je jedna modelová minuta. Výpočty používají l/min, rozhraní zobrazuje vodní toky v l/h (`l/h = l/min × 60`). Při výběru jiného období se nastaví jeho výchozí nabídka vody jako násobek možného odparu vypočteného z velikosti koruny. Aktuální zásoba se zachová a dále se mění pouze podle bilance. Počáteční podíl zásoby se použije pouze při prvním načtení stromu. Předvolby nabídky a počáteční zásoby jsou pro jaro 0,68 a 80 %, léto 0,55 a 65 %, podzim 0,38 a 70 %, zimu 0,06 a 60 %. V jarním, podzimním a zimním scénáři může díky nižší spotřebě přebytek příjmu doplňovat zásobu až do její kapacity; při nízké nabídce nebo poškození kořenů může i tehdy zásoba ubývat. Ruční změna dodávané vody ve Fotosyntéze platí do další změny období. Podíly jsou ilustrační, protože model nemá údaje o vlhkosti půdy ani srážkách.

`voda období` je nejvyšší množství, které strom v daném období dokáže přijmout; `vstup uživatele` je množství vody dodané ke kořenům. Bez poškození kořenů platí `skutečný příjem = min(voda období, vstup uživatele)`: pokud je voda období větší než vstup uživatele, strom přijme pouze vstup uživatele; pokud je vstup uživatele větší než voda období, přijme pouze vodu období. Při rovnosti přijme tuto společnou hodnotu. Přebytek nad sezónním maximem se do zásoby nepřičte. Zahnívání kořenů může příjem ještě snížit pod toto minimum.

Dostupná voda průběžně omezuje odpar a fotosyntézu. Sezónní práh stresu je podíl kapacity, který roste s nároky a světlem. Uživatelský ovladač určuje vodu dodanou ke kořenům. Skutečný přítok do stromu nepřekročí sezónní maximum; při dlouhodobém překročení přebytek výukově znázorňuje zamokření a postupné zahnívání kořenů. Poškození může snížit jejich příjem až o 80 % a po odstranění přebytku se postupně zmenšuje. Jde o zjednodušený stav, nikoli výpočet kyslíku v půdě nebo skutečné choroby. Spotřeba nikdy nepřevýší zásobu plus skutečný přítok v kroku. Modrý pulz toku mízy používá stejné zrychlené hodiny jako bilance, jeho rychlost navíc slábne s poklesem odparu a zavodnění. Vizuální schnutí a zotavení je záměrně zrychlené; návrat listů je výukové zjednodušení, nikoli předpověď zvratnosti poškození suchem. Půdní zásoba, odtok ani samostatné průduchy se nepočítají.

Chlazení: `kW ≈ odpar [l/min] / 60 × 2450`. Měsíční základ teploty je celostátní normál ČHMÚ 1991–2020. Datum odvozuje model ze stejné polohy sezónního kolečka jako zobrazený kalendář a teploty mezi polovinami měsíců plynule interpoluje. Denní rozptyl je výukový odhad, nikoli měřený měsíční normál maxim a minim: nejnižší teplota nastává přibližně v 6 h, nejvyšší v 15 h. Odhad u koruny se snižuje podle poměru skutečného a možného odparu a světelného faktoru. Výsledek není měření okolního vzduchu ani předpověď počasí; pro konkrétní místo by byly potřeba místní meteorologické údaje. Odhad chlazení v kW nepřevádíme přímo na pokles teploty okolí. V noci model zachovává drobnou zbytkovou spotřebu.

Nabídka vody, sezónní maximum příjmu a parametry spotřeby se lineárně interpolují podle přesného natočení kolečka mezi sousedními obdobími, včetně přechodu zimy do jara. V polovině úseku mají parametry průměr obou období. Neprobíhá žádné časové dobíhání: po zastavení kolečka zůstávají sezónní parametry na vybrané poloze. Bilance dál pracuje a zásoba zůstává zachována. Stejnou polohu používá automatický průběh roku; ručně zadaná voda se při něm zachovává až do dalšího ručního výběru období nebo otočení kolečka.

Teplotu navíc mění syntetické počasí: dvě plynulé vlny s periodou 12 a 5 modelových dní vytvářejí teplá a chladná období. Jejich společná maximální odchylka od měsíčního základu je podle měsíce přibližně ±5 až ±11 °C, takže letní odpoledne mohou překročit 30 °C. Tyto odchylky jsou výukové předvolby, nikoli data ČHMÚ. Počasí používá stejné modelové hodiny jako bilance vody, respektuje pauzu a rychlost přehrávání a nemění se náhodně při překreslení ani při úpravě přítoku vody.

## Světelný cyklus

Svítání, den, soumrak a noc tvoří jeden ilustrační cyklus za modelový týden (168 skutečných sekund při rychlosti 1 s = 1 h). Jde o záměrně zpomalené znázornění denního světla; modelový kalendář a vodní bilance si zachovávají svou rychlost. Cyklus začíná v ranní fázi a používá stejné modelové hodiny jako vodní bilance, takže se při skrytí karty zastaví. Orientační dráha pro 50° severní šířky má pevnou deklinaci 22°. Kolečko mění pouze sezónní podmínky, nikoli čas dne, polohu slunce ani délku světlé části cyklu.

Výška nad obzorem plynule mění přímé světlo, fotosyntézu a odpar. Pozadí přechází mezi denním, soumrakovým a nočním odstínem; obloha i kresba listů a kmene v noci ztmavnou. Slunce a jeho paprsky se pod obzorem skryjí. Obnova stínů kvůli pohybu slunce je omezená na nejvýše jednu za 750 ms. Ruční posunutí slunce automatický cyklus vypne; přepínačem ve Fotosyntéze jej lze znovu zapnout.

## Odborné podklady a obsah

- [Bittner et al., 2012](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2011JG001780): vazba světla, průduchů a vodního toku u buku. Zdejší model je výrazně zjednodušený.
- [Köcher et al., 2013](https://pubmed.ncbi.nlm.nih.gov/23999137/): mobilizace vnitřní vody souvisí s vlastnostmi dřeva; celková voda ve dřevě se nerovná využitelné rezervě. Tento zdroj neurčuje zdejší koeficient 8 l/m³.
- [Výzkum hydrotropismu, 2017](https://www.nature.com/articles/nplants201757): obsah o smyslové a růstové reakci je obecné výukové schéma; parametry huseníčku se nepřenášejí na buk.
- [Forestry England: beech](https://www.forestryengland.uk/tree-species/beech): bukvice a jejich podzimní uvolňování. Semenace je jednoduchý sezónní přehled, bez nové simulace plodnosti.

## Kontrola

`node web_viewer/testy/test_tree_ecology.mjs` ověřuje bilanci, meze zásoby, sucho a zotavení, noc, zimní potřebu vody, jednotky chlazení a stabilitu mezi snímkovými frekvencemi. Kontrola rozhraní probíhá v Google Chrome. Původní soubory před změnou jsou v `qa_architektura/pred_upravou_20261024`.
