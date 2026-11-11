---
history:
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Opraveno záhlaví oken, aby tlačítko plus/minus zůstalo uvnitř okna.
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Zmenšeno společné tlačítko plus/minus v šabloně oken.
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Zvětšen text odstavců v detailech oken na 14 px; úzké obrazovky používají 12 px.
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: "Přeskupeno pořadí pravých oken Transpirace: nahoře Teplota, uprostřed Chlazení a dole Příjem vody."
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Zjednodušen průvodce Transpirací na jedinou větu o tahu vody odparem v listech.
  - thread_id: 01a19440-f196-71c2-b537-4d16ada46139
    date: 2026-11-01
    change: Obnovena verze importu částicového modulu po přidání zvýraznění plynů.

---

# Změny

## Čeká

#### Z103 — Návrh kapitoly Semenace

- Zadání: navrhnout kapitolu s ročním cyklem, kontextem počtu a úspěšnosti semen, vazbou oken a částicemi padajících semen.
- Výsledek: zapsán cíl, obsah, ovládání obdobím, kontext a návrh zvýraznění i chování částic; assety dodá uživatel, číselné údaje vyžadují zdroje.
- Stav: Čeká.
- Ověření: kontrola návaznosti dokumentace a existujícího ročního přehledu; web ani částice nebyly změněny.

## Rozpracováno

## Implementováno

#### Z137 — Ovládání času u data

- Zadání: přesunout tlačítka času před datum.
- Výsledek: pauza a rychlosti jsou vlevo od data v horním řádku.
- Stav: Implementováno.
- Ověření: test definic oken a kontrola při commitu; vizuální a funkční kontrola čeká na uživatele.

#### Z136 — Plynulé přibližování stromu

- Zadání: odstranit skokové přibližování a oddalování.
- Výsledek: výpočet kolečka zůstává konečný i při měřítku obrazovky pod 100 %.
- Stav: Implementováno.
- Ověření: cílený test kolečka pro několik měřítek obrazovky prošel; vizuální a funkční kontrola čeká na uživatele.

#### Z135 — Úvodní text Fotosyntézy

- Zadání: přidat pod nadpis krátký text, který se po 20 sekundách skryje.
- Výsledek: věta o světle a cukrech se zobrazí při vstupu do kapitoly a po 20 sekundách zmizí.
- Stav: Implementováno.
- Ověření: kontrola při commitu; vizuální a funkční kontrola čeká na uživatele.

#### Z134 — Zarovnání data

- Zadání: posunout datum na stejný pravý okraj jako okna Fotosyntézy.
- Výsledek: datum má pravé odsazení 6 %, na úzké obrazovce 4 %.
- Stav: Implementováno.
- Ověření: kontrola při commitu. Vizuální kontrola čeká na uživatele.

#### Z133 — Sjednocení okrajů Fotosyntézy

- Zadání: sjednotit pravý okraj oken s levým okrajem nadpisu.
- Výsledek: oba okraje mají stejné odsazení na široké i úzké obrazovce.
- Stav: Implementováno.
- Ověření: kontrola při commitu. Vizuální kontrola čeká na uživatele.

#### Z132 — Výpočty v detailech oken

- Zadání: zobrazovat výpočty až po rozkliknutí okna.
- Výsledek: vzorce a přehledy vstupů oken Fotosyntézy jsou součástí detailu.
- Stav: Implementováno.
- Ověření: kontrola při commitu; vizuální a funkční kontrola čeká na uživatele.

#### Z131 — Okna Fotosyntézy vpravo

- Zadání: přesunout Světlo a ostatní okna doprava, tlačítka vlevo od nadpisů a detaily vlevo od oken.
- Výsledek: všech pět tematických oken je zarovnaných vpravo a používá požadované umístění tlačítek a detailů.
- Stav: Implementováno.
- Ověření: test definic oken prošel. Vizuální a funkční kontrola čeká na uživatele.

#### Z130 — Nadpis Fotosyntéza a okno Světlo

- Zadání: změnit Fotosyntézu na nadpis a zobrazit spotřebu i dostupnost světla v samostatném okně; fotony navázat na dostupnost.
- Výsledek: kapitola má samostatný nadpis a společné tematické okno Světlo. Dostupnost světla řídí příchozí fotony, zatímco aktivita fotosyntézy ovlivňuje vznik plynů.
- Stav: Implementováno.
- Ověření: testy definic oken, částic a vodního modelu prošly. V Chrome při nulovém přísunu vody klesla spotřeba světla na 0 %, dostupnost zůstala kladná a fotony přicházely.

#### Z129 — Čitelnější pruhy a dostupnost vody

- Zadání: zvýraznit pruhy a zpřesnit ovládání vody kolem schopnosti příjmu kořenů.
- Výsledek: pruhy jsou vyšší, prázdná část zřetelnější a rozsah přísunu vychází ze sezónního limitu.
- Stav: Implementováno.
- Ověření: cílené testy vody a oken prošly; v Chrome ověřeno načtení, čitelnost a tažení dostupnosti vody.

#### Z128 — Stálá šířka linek

- Zadání: vypnout rozšiřování linek podle přísunu vody.
- Výsledek: voda i glukóza mají stálou základní šířku; zvýraznění souvisejících oken zůstává.
- Stav: Implementováno.
- Ověření: kontrola při commitu. Existující test linky vyžaduje Edge a starý vstup, proto nebyl spuštěn; vizuální kontrola čeká na uživatele.

#### Z127 — Nižší automatický přísun vody

- Zadání: ponechat prostor pro zvýšení dostupné vody.
- Výsledek: automatický přísun odpovídá 90 % sezónního limitu příjmu kořenů.
- Stav: Implementováno.
- Ověření: cílené testy vody a definic oken prošly. Vizuální a funkční kontrola čeká na uživatele.

#### Z126 — Původní textura vodorovných pruhů

- Zadání: vrátit pruhům ve Fotosyntéze původní texturu.
- Výsledek: oba směry vyplnění používají nepravidelný obrys z původních vodorovných tahů.
- Stav: Implementováno.
- Ověření: kontrola při commitu a ověření dostupnosti tří obrazových masek. Vizuální kontrola čeká na uživatele.

#### Z125 — Vodorovné ukazatele toků

- Zadání: zobrazit v tematických oknech Fotosyntézy dva protisměrné vodorovné pruhy a ovládat dostupnost vody.
- Výsledek: O₂, CO₂, Cukry a Voda mají dva údaje; chybějící výpočty jsou označené. Spodní pruh vody nastavuje přísun ke kořenům a ostatní pruhy ukazují výpočty.
- Stav: Implementováno.
- Ověření: cílený test vazeb fotosyntézy a omezení příjmu vody i existující test definic oken prošly. Vizuální a funkční kontrola čeká na uživatele.

#### Z124 — Čárky jako posuvníky ve Fotosyntéze

- Zadání: zobrazit hodnoty vůči maximu a umožnit jejich nastavení pomocí čárek oken.
- Výsledek: čárky zachovávají délku maxima, zobrazují aktuální podíl a ovládají navázané veličiny nebo spotřebu vody; po zásahu se obnovuje vliv podmínek.
- Stav: Implementováno.
- Ověření: cílený test vazeb, vodní bilance a návratu k automatice a existující test definic oken prošly. Vizuální a funkční kontrola čeká na uživatele; existující test ekologie selhal na zásobě vody.

#### Z123 — Větší uvolněná semena

- Zadání: zvětšit semena, aby byla v koruně a pod stromem viditelná.
- Výsledek: uvolněná semena se při pádu postupně zvětší na dvojnásobek původní velikosti a zůstanou větší po dopadu.
- Stav: Implementováno.
- Ověření: kontrola při commitu. Vizuální kontrola čeká na uživatele.

#### Z122 — Více květů v koruně

- Zadání: zvýšit počet květů v Semenaci.
- Výsledek: do koruny se rozmísťuje 48 květů.
- Stav: Implementováno.
- Ověření: kontrola při commitu. Vizuální kontrola čeká na uživatele.

#### Z121 — Menší květy a společný opad s listy

- Zadání: zmenšit květy, zvýšit jejich počet a načasovat opad podle listů.
- Výsledek: v koruně je 24 menších květů. Prázdné obaly padají po uvolnění semen v období opadu listů.
- Stav: Implementováno.
- Ověření: ověřen začátek opadu podle společného kalendáře a návaznost na dopad semen. Vizuální kontrola čeká na uživatele.

#### Z120 — Zavěšení květů a pád v Semenaci

- Zadání: rozevírat květy směrem dolů, sladit osvětlení s korunou a zobrazit pád semen i prázdných obalů.
- Výsledek: květy visí špičkou u větví a přijímají stín koruny. Podzim spustí postupný pád semen a na přelomu podzimu a zimy padají také obaly.
- Stav: Implementováno.
- Ověření: v Google Chrome ověřen směr zavěšení, pohyb semen i obalů z koruny k zemi a vykreslení bez chyb shaderu. Vizuální kontrola čeká na uživatele.

#### Z119 — Obnovení načítání stromu

- Zadání: opravit zastavení načítání hlavní stránky.
- Výsledek: zvýraznění má při vytváření oken dostupný počáteční stav a průběžnou aktualizaci. Okno Semena opět předává stav modelu.
- Stav: Implementováno.
- Ověření: v Google Chrome se načetl strom i model Semenace a výběr podzimu proběhl bez chyb stránky.

#### Z118 — Model květu a semen v Semenaci

- Zadání: zapojit hotový model do kapitoly Semenace u stromu.
- Výsledek: modely na větvích rostou podle období, na podzim se rozevřou a vypustí semena. Okno Semena zvětšuje uvolněná semena a omezení pohybu ukazuje statický dopad.
- Stav: Implementováno.
- Ověření: test definic oken a cílená kontrola umístění na větve, sezonních stavů, pádu, zvýraznění a omezení pohybu. Vizuální kontrola čeká na uživatele.

#### Z117 — Volná dutina květu a užší spodek

- Zadání: odstranit vnitřní výplň a přiblížit spodní hrany dílů.
- Výsledek: v dutině zůstávají semena a spodní hrany leží blíž společné špičce.
- Stav: Implementováno.
- Ověření: v Blenderu ověřeny upravené spodní vrcholy, počet ploch, hladké stínování a UV. Vizuální kontrola čeká na uživatele.

#### Z116 — Hladké stínování květu

- Zadání: použít Shade Smooth na květ.
- Výsledek: všechny tři díly mají hladké stínování a zachovávají původní obrys.
- Stav: Implementováno.
- Ověření: v Blenderu ověřeno hladké stínování, počet ploch a UV všech dílů. Vizuální kontrola čeká na uživatele.

#### Z115 — Růst květu a vypadnutí semen

- Zadání: nechat květ vyrůst z malého poupěte a uvolnit semena z dutiny.
- Výsledek: květ roste od začátku dozrávání. Dvě semena z dodaných textur postupně vypadnou na konci a posuvníkem je lze vrátit do dutiny.
- Stav: Implementováno.
- Ověření: geometrická kontrola drah obou semen, dopadu a návratu na začátek. Vizuální kontrola čeká na uživatele.

#### Z113 — Alfa v celé animaci semene

- Zadání: zachovat průhlednost textury od začátku dozrávání.
- Výsledek: alfa vnějších dílů je aktivní při každém úhlu. Menší vnitřní skořápka kryje zavřené spoje a při rozevření ustupuje k základně.
- Stav: Implementováno.
- Ověření: kontrola průniků vnitřní skořápky se zavřeným modelem v Blenderu. Vizuální kontrola čeká na uživatele.

#### Z114 — Otáčení stromu přes plochu oken

- Zadání: umožnit otáčení stromu přes prázdnou plochu oken a začlenit pravidlo do šablony hlavního okna.
- Výsledek: prázdné plochy společných oken propouštějí myš, nadpisy, tlačítka a otevřené detaily zůstávají přístupné.
- Stav: Implementováno.
- Ověření: v Google Chrome tažení přes dříve blokované místo otočilo kameru ve Fotosyntéze i Semenaci; tlačítka hlavních detailů fungovala.

#### Z111 — Plynulé kolečko období

- Zadání: zrychlit a vyhladit otáčení kruhu kolečkem myši.
- Výsledek: krok kolečka v obou směrech posune kruh dopředu plynule přibližně o čtyři procenta otočení; omezení pohybu provede posun ihned.
- Stav: Implementováno.
- Ověření: syntaktická kontrola prošla; doplňkový test ekologie selhal na zásobě vody a chování v prohlížeči nebylo ověřeno.

#### Z110 — Dosednutí dílů a alfa okrajů semene

- Zadání: zmírnit ořez textur a uzavřít mezery mezi stranami.
- Výsledek: hrany a konce tří dílů v zavřené poloze dosedají. Po rozevření mají volné okraje měkkou průhlednost podle textury.
- Stav: Implementováno.
- Ověření: kontrola párování všech hran exportu, společného bodu otáčení a UV. Vizuální kontrola čeká na uživatele.

#### Z109 — Model semene podle Blenderu

- Zadání: převzít tvar ze souboru kvet.blend a použít průhlednost podle listů.
- Výsledek: ladicí stránka načítá tři exportované díly s původním UV mapováním a texturami; okraje používají stejný princip alfa masky jako listy.
- Stav: Implementováno.
- Ověření: kontrola exportu tří sítí s UV a syntaxe JavaScriptu; vizuální a funkční kontrola čeká na uživatele.

#### Z108 — Hranatý model semene

- Zadání: zjednodušit tvar semene na rovné plochy s ostrými hranami.
- Výsledek: každý díl má dvě rovné vnější plochy. Složený model má trojúhelníkový průřez a tři díly se otevírají ze společné spodní špičky.
- Stav: Implementováno.
- Ověření: kontrola rovinnosti ploch, napojení zavřených hran, společné špičky a otevřené dutiny. Vizuální kontrola čeká na uživatele.

#### Z107 — Ladicí stránka semene

- Zadání: vytvořit z dodaných textur 3D model se třemi stranami a ovládaným dozráváním.
- Výsledek: samostatná stránka zobrazuje zelený až hnědý model. Tři díly se vyklápějí kolem společné špičky a odhalují dutinu. Čtyři textury lze střídat.
- Stav: Implementováno.
- Ověření: kontrola uzavřených hran, společné špičky a otevřené dutiny v geometrii. Vizuální kontrola čeká na uživatele.

#### Z106 — Okna Semenace podle elementů

- Zadání: převést tematická okna na Květy, Bukvice a Semena s aktuálním stavem a návazností na elementy.
- Výsledek: tři okna ukazují typický stav podle období; Semena zvýrazňují padající částice. Květy a bukvice čekají na assety a propojení.
- Stav: Implementováno.
- Ověření: test definic oken a kontrola při commitu; vizuální a funkční kontrola webu čeká na uživatele.

#### Z105 — Stručné texty Semenace

- Zadání: zkrátit popisy, stanovit pravidlo stručnosti a odstranit posuvníky oken.
- Výsledek: okna a kontext Semenace mají kratší texty; jejich obsah se zobrazuje bez posuvníků a dokumentace stanoví stručnost popisů.
- Stav: Implementováno.
- Ověření: kontrola změn a syntaktická kontrola při commitu; výsledné rozložení čeká na vizuální kontrolu uživatelem.

#### Z104 — Semenace ve webu

- Zadání: realizovat navržená okna, kontext a částice padajících semen s využitím období.
- Výsledek: společná okna a kontext ukazují fázi a souvislosti; na podzim padají schematické částice, které reagují na okno Šíření semen. Použity jsou dočasné tvary do dodání assetů.
- Stav: Implementováno.
- Ověření: prošel test definic oken test_ui_okna_kontrola.mjs; finální vizuální a funkční kontrola čeká na uživatele, číselné údaje na zdroje.

#### Z102 — Menší částice vodní páry

- Zadání: zmenšit částice H₂O na velikost O₂.
- Výsledek: při výchozím otevření hlavního okna jsou stejně velké jako nezvýrazněné O₂; zvýraznění nadále funguje.
- Stav: Implementováno.
- Ověření: prošel test test_water_vapour.mjs; vizuální kontrola velikosti čeká na uživatele.

#### Z101 — Středy období na kruhu

- Zadání: umístit jaro podle data doprostřed jarního úseku.
- Výsledek: úseky kruhu jsou vystředěné na názvy období a jejich modelová středová data; jaro odpovídá polovině dubna.
- Stav: Implementováno.
- Ověření: kontrola převodu data, geometrie a syntaxe; finální vizuální kontrola uživatelem.

#### Z100 — Rozptyl vodní páry

- Zadání: sjednotit rozptyl částic H₂O v Transpiraci s O₂.
- Výsledek: vodní pára používá stejný směr a rozptylový kužel jako částice O₂.
- Stav: Implementováno.
- Ověření: cílený test částic vodní páry; vizuální kontrola čeká na uživatele.

#### Z099 — Posun postranních oken

- Zadání: posunout postranní okna trochu doprava.
- Výsledek: pravá okna začínají na 70 % šířky; jejich pravá hrana zůstává na místě. Na úzkých obrazovkách zůstává dosavadní rozložení.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; vizuální kontrola čeká na uživatele.

#### Z098 — Silnější linky bez zesvětlení

- Zadání: zesílit zvýrazněné linky a nezesvětlovat jejich barvu.
- Výsledek: zvýrazněné linky jsou silnější a zachovávají barvu.
- Stav: Implementováno.
- Ověření: kontrola změn a syntaxe; finální vizuální kontrola uživatelem.

#### Z097 — Výraznější zvýraznění elementů

- Zadání: zvýšit zřetelnost zvýraznění propojených elementů.
- Výsledek: zvýrazněné linky jsou světlejší a méně průhledné, částice jsou větší.
- Stav: Implementováno.
- Ověření: cílený test částic a kontrola změn; finální vizuální kontrola uživatelem.

#### Z093 — Zvýraznění elementů při najetí na okno

- Zadání: rozšířit propojení oken a elementů o najetí.
- Výsledek: najetí zvýrazní související element stejně jako otevřený detail; oba stavy se kombinují.
- Stav: Implementováno.
- Ověření: kontrola změn a syntaxe JavaScriptu; finální funkční kontrola uživatelem.

#### Z096 — Rozvržení kapitol a času

- Zadání: vytvořit dvě varianty rozmístění hlavního okna, průvodce a času.
- Výsledek: Fotosyntéza řadí hlavní okno, průvodce a čas shora; Transpirace čas, průvodce a hlavní okno.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; vizuální kontrola čeká na uživatele.

#### Z095 — Zvýraznění tlačítka vedlejšího okna

- Zadání: zvýraznit tlačítko při najetí na celé vedlejší okno a zachovat zvětšení při najetí na tlačítko.
- Výsledek: tlačítko přebírá barvu tématu při hoveru okna; při vlastním hoveru se také zvětší.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; vizuální kontrola čeká na uživatele.

#### Z094 — Velikost textu hlavního detailu

- Zadání: sjednotit velikost rozbaleného textu hlavního a vedlejších oken.
- Výsledek: všechny detaily používají stejnou velikost a řez písma včetně úzkých obrazovek.
- Stav: Implementováno.
- Ověření: kontrola pravidel CSS a dokumentace; vizuální kontrola čeká na uživatele.

#### Z093 — Časování kontextového textu

- Zadání: zkrátit čekání a prolínání kontextového textu a odstranit výjimku při omezení pohybu.
- Výsledek: po 15 sekundách původní text 3 sekundy mizí a nový se 3 sekundy objevuje za všech nastavení pohybu.
- Stav: Implementováno.
- Ověření: kontrola změněných hodnot v kódu a dokumentaci; vizuální kontrola čeká na uživatele.

#### Z092 — Jednotné plynulé zvýraznění menu

- Zadání: odstranit podtržení a sjednotit zvýraznění všech kapitol.
- Výsledek: aktivní položka i položka pod kurzorem jsou tučné; řez se plynule mění bez zvětšení a podtržení.
- Stav: Implementováno.
- Ověření: kontrola změn a pravidel stylu; finální vizuální a funkční kontrola uživatelem.

#### Z091 — Stabilní tučné menu

- Zadání: vrátit skutečně tučné písmo při najetí a odstranit poskakování položek.
- Výsledek: tlačítka mají předem šířku tučného textu, zvětšuje se samotný text od spodního okraje.
- Stav: Implementováno.
- Ověření: kontrola vlastního diffu a commitový hook; vizuální ověření uživatelem.


#### Z090 — Jemnější zvýraznění menu

- Zadání: zjemnit a zpomalit zvětšení při najetí a omezit poskakování textu dolů.
- Výsledek: plynulý přechod 300 ms, zvětšení o 3 % od spodního okraje a zvýraznění bez změny šířky textu.
- Stav: Implementováno.
- Ověření: kontrola vlastního diffu a commitový hook; vizuální ověření uživatelem.


#### Z089 — Zvýraznění položek menu při najetí

- Zadání: nahradit podtržení při najetí tučným a zvětšeným textem ve společném menu.
- Výsledek: položky kapitol se při najetí zvýrazní tučně a zvětší o 8 %; fokus zůstává viditelný a omezení pohybu vypíná přechod.
- Stav: Implementováno.
- Ověření: kontrola vlastního diffu a commitový hook; vizuální ověření uživatelem.


#### Z088 — Poloha menu v Úvodu a načtení data

- Zadání: vrátit menu v Úvodu na původní místo a načíst přesunuté datum.
- Výsledek: v Úvodu je menu znovu uprostřed výšky vpravo; nová verze stylů se načte po obnovení stránky.
- Stav: Implementováno.
- Ověření: kontrola diffu a commitový hook; vizuální ověření uživatelem.


#### Z087 — Odstranění Manageru a vzhled ovládání času

- Zadání: odstranit tlačítko Manager a sladit ovládání času se současným rozhraním.
- Výsledek: Manager je odstraněný; pauza a rychlosti mají jednoduchý světlý nebo tmavý vzhled vpravo dole, v Úvodu zůstávají skryté.
- Stav: Implementováno.
- Ověření: kontrola syntaxe JavaScriptu a existující test definic oken; chování času ani vzhled nebyly v prohlížeči ověřeny.


#### Z086 — Menu vlevo a datum vpravo

- Zadání: přesunout menu na levou hranu na místo data a datum dát doprava.
- Výsledek: navigace začíná vlevo nahoře, datum je vpravo nahoře; úzké obrazovky používají přizpůsobené okraje.
- Stav: Implementováno.
- Ověření: kontrola vlastního diffu a commitový hook; finální vizuální kontrola uživatelem.


#### Z085 — Detail hlavních oken pod údaji

- Zadání: otevřít text hlavního okna směrem dolů a upravit společnou šablonu i dokumentaci.
- Výsledek: detail hlavního okna Fotosyntézy i Transpirace je samostatně pod pevným oknem, nezvětšuje je a má vlastní posuv; šablona platí i pro úzké obrazovky.
- Stav: Implementováno.
- Ověření: kontrola CSS a cílený test definic oken; finální vizuální kontrola uživatelem.


#### Z084 — Plynulá změna kontextu

- Zadání: pomalejší prolínání kontextových textů a nižší poloha průvodce Fotosyntézy.
- Výsledek: po 20 sekundách text 5 sekund mizí a nový se 5 sekund objevuje; při omezení pohybu se po čekání přepne bez animace. Průvodce je níže pod hlavním oknem.
- Stav: Implementováno.
- Ověření: kontrola syntaxe JavaScriptu; vizuální a funkční kontrola uživatelem.


#### Z083 — Fotosyntéza nahoře s kontextem pod oknem

- Zadání: zarovnat hlavní Fotosyntézu s horním postranním oknem a umístit kontext hned pod ni.
- Výsledek: hlavní okno začíná na 25 % výšky (na úzké obrazovce 22 %); kontext následuje 14 px pod ním a dlouhý text má vlastní posuv.
- Stav: Implementováno.
- Ověření: kontrola CSS a vlastního diffu; finální vizuální kontrola ponechána uživateli.


#### Z082 — Pohybová nápověda oken

- Zadání: [Nápověda +/−](moje/okna.md).
- Výsledek: hover +8 %, po 30 s bez použití pulz každých 8 s; první ruční přepnutí vypíná nápovědu všude až do obnovení. Respektuje omezení pohybu.
- Stav: Implementováno.
- Ověření: kontrola definic oken; finální vizuální kontrola uživatelem.

#### Z081 — Neořezané tlačítko detailu

- Zadání: minimální oprava tlačítka plus/minus ve společné šabloně.
- Výsledek: tlačítko bez záporného posunu, rámeček uvnitř rozměru a zachovaná minimální velikost.
- Stav: Implementováno.
- Ověření: kontrola CSS; vizuální kontrola uživatelem.

#### Z080 — Kontextové texty Fotosyntézy

- Zadání: nasadit kontextové texty z [Kontextových textů](moje/kontextove_texty.md#fotosyntéza) do kapitoly Fotosyntéza.
- Výsledek: průvodce zobrazuje výchozí větu a při otevření oken CO₂, Cukry, Voda nebo O₂ přepíná na tematickou variantu; po zavření se vrací k výchozímu textu.
- Stav: Implementováno.
- Ověření: kontrola syntaxe JavaScriptu, odkazů a dokumentace; finální vizuální kontrola uživatelem.

#### Z078 — Výraznější kruh období

- Zadání: větší tučné verzálky a silnější tah kruhu.
- Výsledek: názvy období jsou větší, tučné a verzálkami; tah kruhu je širší.
- Stav: Implementováno.
- Ověření: vizuální test neprováděn.

#### Z076 — Úvod bez Manageru

- Zadání: [Manager](moje/prvky.md#manager).
- Výsledek: tlačítko Manager je v Úvodu skryté, v ostatních kapitolách zůstává dostupné.
- Stav: Implementováno.
- Ověření: netestováno na výslovný pokyn uživatele.

#### Z077 — Sjednocení pohybu částic H₂O

- Zadání: řídit množství částic H₂O stejně jako ostatní částice a nezačínat na hnědém konci vodní linky.
- Výsledek: odpar dál určuje četnost emisí; H₂O nyní používá stejný odstup od zdroje, náhodnou rychlost, životnost, velikost a plynulé zvětšení/zmenšení jako plynové částice.
- Stav: Implementováno.
- Ověření: cílený test vodní páry, vizuální kontrola Transpirace v Google Chromu a kontrola dokumentace.

#### Z075 — Úvod bez ovládání času

- Zadání: [Ovládání času](moje/prvky.md#ovládání-času).
- Výsledek: v Úvodu jsou skryté pauza a rychlosti 2× a 4×; ostatní kapitoly ovládání zachovávají.
- Stav: Implementováno.
- Ověření: cílená kontrola v Chromu.

#### Z074 — PNG textury H₂O v Transpiraci

- Zadání: nahradit částice Transpirace připravenými PNG texturami H₂O.
- Výsledek: vodní pára používá tři existující malované varianty H₂O; generovaný text přes canvas byl odstraněn.
- Stav: Implementováno.
- Ověření: cílené testy částic, kontrola dokumentace a vizuální kontrola Transpirace v Google Chromu.

#### Z073 — Vycentrování menu v Úvodu

- Zadání: umístit menu v Úvodu na střed výšky obrázku.
- Výsledek: úvodní menu je svisle vycentrované na 50 % výšky obrazovky; menu ostatních kapitol zůstává nahoře.
- Stav: Implementováno.
- Ověření: kontrola CSS, dokumentace a změny verze stylopisu; finální vizuální kontrola v Google Chromu.

#### Z072 — Ukotvení tahu okna Voda

- Zadání: opravit okno Voda, protože levý tah přesahoval okno.
- Výsledek: obnoveno absolutní umístění oken podle společné šablony; levý tematický tah se kotví k oknu a nemění jeho rozložení.
- Stav: Implementováno.
- Ověření: kontrola CSS, dokumentace a změny verze stylopisu; finální vizuální kontrola uživatelem.

#### Z071 — Interakční odhad pozornosti

- Zadání: zahrnout kliknutí a polohu myši do lokální analýzy.
- Výsledek: [oddělený heuristický odhad](../tools/UNISAL.md#kliknutí-a-myš) s poklesem váhy, původní UNISAL zachován; srovnávací video používá společnou škálu.
- Stav: Implementováno.
- Ověření: skutečný záznam automatického otevření Vody, video H.264, kontrola normalizace, nulového účinku před kliknutím, poklesu, ukončení a slabšího vlivu myši. Nejde o měřený pohled ani validovaný model.

#### Z070 — Větší text v postranních oknech

- Zadání: zvětšit malý text odstavců v šabloně postranních oken.
- Výsledek: tematické odstavce používají řez medium (váha 500), `clamp(16px, 1.05vw, 20px)` a na úzké obrazovce 14 px; hlavní okna zůstávají beze změny.
- Stav: Implementováno.
- Ověření: kontrola CSS, dokumentace a změny verze stylopisu; finální vizuální kontrola uživatelem.

#### Z069 — Časová heatmapa UNISAL

- Zadání: analyzovat otevření Vody jako video.
- Výsledek: [video nástroj](../tools/UNISAL.md#video) zachovává rekurentní stav a společnou škálu celého klipu; výstup H.264.
- Stav: Implementováno.
- Ověření: 81 snímků při 8 fps, konečné normalizované mapy a dekódovaný náhled; jde o predikci pozornosti, nikoli důkaz příčiny či porozumění.

#### Z068 — Lokální predikce pozornosti UNISAL

- Zadání: lokální UNISAL pro modelové heatmapy webu.
- Výsledek: samostatné prostředí, oficiální předtrénované váhy a [příkaz pro snímky](../tools/UNISAL.md); bez změny webu.
- Stav: Implementováno.
- Ověření: predikce uloženého snímku Fotosyntézy; mapa neprokazuje porozumění ani měřený pohyb očí.

#### Z067 — Vyšší poloha menu bez staré cache

- Zadání: [Kapitoly](moje/prvky.md#kapitoly).
- Výsledek: menu začíná u barevné hrany pravých oken ve výšce 7 % obrazovky; obnovena verze stylopisu pro načtení úpravy.
- Stav: Implementováno.
- Ověření: kontrola CSS a odkazu stylopisu; finální kontrola uživatelem.

#### Z066 — Zarovnání menu kapitol

- Zadání: [Kapitoly](moje/prvky.md#kapitoly).
- Výsledek: navigace posunuta výš a zarovnána s levým okrajem pravého sloupce oken, včetně úzkého zobrazení.
- Stav: Implementováno.
- Ověření: kontrola pravidel CSS; finální kontrola uživatelem.

#### Z065 — Přesunutí tlačítka detailu k hodnotě

- Zadání: přesunout kolečko plus/minus na místo vedle hodnoty v okně.
- Výsledek: u všech ostatních tematických oken je tlačítko hned za celým nadpisem; název se nerozděluje. Hlavní okna jsou pouze Transpirace a Fotosyntéza a zůstávají v původním rozložení.
- Stav: Implementováno.
- Ověření: kontrola diffu; finální vizuální kontrola v Google Chromu.

#### Z064 — Tlačítko uvnitř záhlaví okna

- Zadání: kolečka plus/minus se nevejdou do okna.
- Výsledek: záhlaví používá dostupnou šířku okna, nadpis se může zmenšit a tlačítko zůstává uvnitř.
- Stav: Implementováno.
- Ověření: kontrola diffu; finální vizuální kontrola v Google Chromu.

#### Z063 — Opravy po testu oken

- Zadání: [Okna](moje/okna.md).
- Výsledek: odstraněn viditelný posuvník vody, sjednoceno formátování hodnot Transpirace a velikost +/− na 28 px; drobné popisky a vzorce zachovány.
- Stav: Implementováno.
- Ověření: cílená kontrola oken; finální kontrola uživatelem.

#### Z062 — Ukotvení hlavního detailu nad oknem

- Zadání: hlavní detail Transpirace se nezobrazuje nad údaji.
- Výsledek: absolutně umístěný hlavní detail už nedědí druhý sloupec mřížky; jeho poloha se počítá vůči celému oknu. Obnovena verze CSS.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; Chrome není dostupný, finální vizuální kontrola uživatelem.


#### Z061 — Obnovení importů hlavního okna

- Zadání: načíst aktuální variantu hlavního okna bez starých modulů v cache.
- Výsledek: sjednocen řetězec importů kapitoly a rendereru s novou definicí Transpirace.
- Stav: Implementováno.
- Ověření: kontrola importů; finální vizuální kontrola uživatelem.


#### Z060 — Menší tlačítko detailu oken

- Zadání: zmenšit tlačítko plus v šabloně okna.
- Výsledek: společný přepínač detailu má 20 px místo 28 px, menší znak plus/minus a jeho optické vycentrování.
- Stav: Implementováno.
- Ověření: kontrola diffu a předběžná kontrola vybraných souborů; finální vizuální kontrola uživatelem.

#### Z059 — Fotosyntéza podle šablony Transpirace

- Zadání: aplikovat [šablonu Transpirace](moje/vzhled_oken.md#šablona-jednoho-okna-podle-transpirace) na okna Fotosyntézy.
- Výsledek: všech pět oken má viditelné +/− a přepínání nadpisem, společné písmo, tahy a rozložení detailu. Hlavní detail je otevřený nad údaji, tematické výchozí zavřené. Přehled vstupů je viditelný i na úzké obrazovce; původní výpočty, témata a vazby elementů zůstávají.
- Stav: Implementováno.
- Ověření: cílený validační test oken a kontrola vlastního diffu; finální vizuální a funkční kontrola uživatelem.

#### Z058 — Vodní pára a hlavní okno Transpirace

- Zadání: H₂O částice, hlavní detail nad údaji, stručnější texty a soubor nápadů.
- Výsledek: modré H₂O vycházejí z konce vodní linky v Transpiraci a sdílí zvýraznění plynových částic. Hlavní okna otevírají detail vzhůru; Transpirace jej má výchozím stavem otevřený. Texty jsou kratší, dva odložené návrhy jsou v [Nápadech](moje/napady.md).
- Stav: Implementováno.
- Ověření: cílený test H₂O a validační test oken prošly; finální vizuální kontrola uživatelem. Průběžné načtení v Chromu nebylo dostupné kvůli nedostupnému připojení prohlížeče.


#### Z057 — Přesná šablona podle Transpirace

- Zadání: popsat úplnou šablonu okna podle Transpirace včetně velikostí písma.
- Výsledek: vzorem je Transpirace; definice obsahuje přesné škály písma, váhy, řádkování, barvy, rozměry, odstupy, ovládání a úzkou variantu podle současného kódu. Odkazy na šablonu jsou sjednocené.
- Stav: Implementováno.
- Ověření: porovnání s CSS a rendererem; dokumentační změna bez úpravy webu a bez finální vizuální kontroly.

#### Z056 — Větší text detailu oken

- Zadání: zvětšit text odstavce v okně.
- Výsledek: `.annotation-body p` používá 14 px, na úzké obrazovce 12 px.
- Stav: Implementováno.
- Ověření: kontrola diffu a předběžná kontrola vybraných souborů; finální vizuální kontrola uživatelem.

#### Z055 — Pořadí oken Transpirace

- Zadání: [Rozložení oken](moje/vzhled_oken.md#rozložení).
- Výsledek: pravá okna jsou shora Teplota, Chlazení a Příjem vody; Příjem vody je nyní dole.
- Stav: Implementováno.
- Ověření: kontrola diffu, syntaxe JavaScriptu, YAML historie a předběžná kontrola vybraných souborů; finální vizuální kontrola uživatelem.

#### Z054 — Jednodušší pracovní postup

- Zadání: omezit administrativu a opakované kontroly.
- Výsledek: historie v Gitu bez povinných YAML záznamů a ID chatů; kratší AGENTS.md, cílené testy a jedna automatická kontrola při commitu. Hook prověřuje i syntaxi a mezery. Web se nemění.
- Stav: Implementováno.
- Ověření: testy kontroloru pro dokumenty bez frontmatteru, obsah bez aktualizace historie, starou delší historii, neplatný YAML, chybný JavaScript a mezery; kontrola diffu.

#### Z053 — Jednoduchý text průvodce Transpirací

- Zadání: [Co žáci nechápou a proč nestačí učebnice či video](moje/strategie.md#co-žáci-nechápou-a-proč-nestačí-učebnice-či-video).
- Výsledek: průvodce Transpirací zobrazuje pouze větu „Odpar v listech táhne vodu vzhůru.“; doplňkové popisky, kroky, legendu a nápovědu jsem odstranil.
- Stav: Implementováno.
- Ověření: kontrola diffu, syntaxe JavaScriptu, kontrola YAML historie a předběžná kontrola vybraných souborů; finální vizuální kontrola uživatelem.

#### Z052 — Obnovení importu částicového modulu

- Zadání: opravit načítání webu po commitu `9c80528`.
- Výsledek: import částicového systému má novou verzi URL, aby prohlížeč pro nové volání zvýraznění nepoužil starý modul z cache.
- Stav: Implementováno.
- Ověření: kontrola diffu, existence modulu a metody, syntaxe a předběžná kontrola vybraných souborů; finální kontrola uživatelem. Původní pád v prohlížeči nebyl reprodukován.

#### Z051 — Jednotná kontrola před commitem

- Zadání: zachytit formální chyby před pokusem o commit.
- Výsledek: režim `--files` ověřuje výslovný seznam pracovních souborů bez zápisu do Gitu, mezery, syntaxi JS a inline skriptů HTML, dokumentaci, historii a evidenci; hlídá změnu podkladů během běhu.
- Stav: Implementováno.
- Ověření: testy předběžné kontroly a původního kontroloru; spuštění nového režimu na souborech tohoto úkolu.

#### Z050 — Zvýraznění částic O₂ a CO₂

- Zadání: zvětšit částice O₂ a CO₂ a zviditelnit reakci elementu po kliknutí.
- Výsledek: částice obou plynů mají větší základní velikost; otevření okna O₂ nebo CO₂ zvýší velikost odpovídajícího proudu přes společné rozhraní částicového systému.
- Stav: Implementováno.
- Ověření: kontrola diffu, syntaxe JavaScriptu, test částic a kontrola dokumentace; finální vizuální kontrola uživatelem.

#### Z049 — Zkrácení detailu Teploty

- Zadání: odstranit dovětek na konci detailu Teploty.
- Výsledek: odstraněn přidaný řádek s teplotou mimo strom a rozdílem; hlavní hodnota, vzorec a vysvětlení zachovány.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken a kontrola dokumentace; finální kontrola uživatelem.

#### Z048 — Úklid vzhledu oken

- Zadání: zkrátit [Vzhled oken](moje/vzhled_oken.md) a odstranit zastaralá pravidla.
- Výsledek: sloučeny opakované definice, zkrácena šablona, obsah a technické použití nahrazeny odkazy; zachovány rozměry a platné rozdíly kapitol. Kód webu se nemění.
- Stav: Implementováno.
- Ověření: porovnání s obsahem oken a CSS, kontrola YAML historie, jedinečnosti ID a místních odkazů; bez vizuálního testu webu.

#### Z047 — Bezpečnější postup ukládání změn

- Zadání: vyřešit opakované chyby historie, oprávnění a smíšených commitů.
- Výsledek: pravidla explicitního commitu podle cest, oddělení práce na společných souborech, zastavení po chybě a kontroly YAML před commitem; upřesněn rozsah kontroly indexu.
- Stav: Implementováno.
- Ověření: kontrola postupů chatu 01a1942e-d161-7933-b8f7-31bb2827f7a1, test odděleného commitu v dočasném repozitáři a kontrola dokumentace.

#### Z046 — Jednoduché okno bez posunů údajů

- Zadání: zjednodušit komponentu a odstranit posun hodnoty a vzorce po otevření textu.
- Výsledek: jeden svislý blok nadpisu, hodnoty a vzorce; druhý nezávislý blok detailu s posuvem. Odstraněno sdílení tří řádků mezi údaji a detailem.
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; v Chromu otevření a zavření Teploty zachovává polohy údajů vůči oknu 0 / 40,9 / 65,9 px. Finální kontrola ostatních oken uživatelem.

#### Z045 — Odstranění Úvodu z nabídky

- Zadání: odstranit Úvod z nabídky a dokumentace, protože uživatel nepoznal, že se v této kapitole nachází.
- Výsledek: položka Úvod není v nabídce; výchozí úvodní animace zůstává zachovaná. Z rozcestníku a definice pořadí navigace byla odstraněna samostatná položka Úvod.
- Stav: Implementováno.
- Ověření: kontrola diffu, syntaxe JavaScriptu, vyhledání zbývajících odkazů na položku nabídky a kontrola YAML historie; finální kontrola uživatelem.

#### Z044 — Kompaktní zavřené okno

- Zadání: roztažené řádky okna Teplota.
- Výsledek: skrytý detail se neúčastní výpočtu výšky řádků společné komponenty; nadpis, hodnota a vzorec nejsou roztahovány dlouhým skrytým textem.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; finální vizuální kontrola uživatelem.

#### Z043 — Společné části komponenty okna

- Zadání: společný nadpis, hodnota, vzorec a předávaný obsah.
- Výsledek: centralizovány velikosti a odstupy; viditelný přepínač a skutečná rovnice jsou datové varianty místo stylových vazeb na kapitolu. Zachován společný renderer a doplněn postup použití v [architektuře](system/architektura_oken.md#rozložení).
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; kontrola dokumentace; finální vizuální kontrola uživatelem.

#### Z042 — Zachování velikosti nadpisů

- Zadání: nezmenšovat nadpis kvůli nezalamování.
- Výsledek: odstraněny zmenšující výjimky Transpirace; nadpisy používají společnou typografickou škálu Fotosyntézy. Zachován jeden řádek a případný posuv záhlaví. Pravidlo upraveno v definici i šabloně.
- Stav: Implementováno.
- Ověření: kontrola odstraněných CSS výjimek a dokumentace; finální vizuální kontrola uživatelem.

#### Z041 — Nezalamované nadpisy oken

- Zadání: nadpis okna vždy na jednom řádku.
- Výsledek: odstraněno zalamování, sloupec Transpirace se přizpůsobuje nadpisu a tlačítku; na úzké obrazovce menší písmo a případný vodorovný posuv záhlaví. Pravidlo přeneseno do šablony vzhledu.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; finální vizuální kontrola uživatelem.

#### Z040 — Replikovatelná specifikace vzhledu oken

- Zadání: [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: zapsán účel replikovatelnosti, konkrétní rozestupy Transpirace, vlastní prostor tlačítka a obecné položky přenositelné šablony včetně úzkých obrazovek.
- Stav: Implementováno.
- Ověření: porovnání rozměrů a pozic s aktuálním CSS, kontrola dokumentace; web se nemění a jeho finální vizuální kontrola zůstává uživateli.

#### Z039 — Větší odstupy oken Transpirace

- Zadání: přidat mezery mezi okny.
- Výsledek: zvětšeny svislé rozestupy pravých oken posunem Chlazení a Teploty; samostatné rozmístění pro úzké obrazovky.
- Stav: Implementováno.
- Ověření: kontrola změněných pozic a připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z038 — Prostor pro tlačítka detailů

- Zadání: odstranit překrytí tlačítek a textu v Transpiraci.
- Výsledek: záhlaví má samostatný pevný sloupec pro +/− a zmenšitelný sloupec pro zalamovaný nadpis; tlačítko zůstává uvnitř záhlaví.
- Stav: Implementováno.
- Ověření: kontrola CSS a připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z037 — Viditelné přepínače Transpirace

- Zadání: tlačítko + vedle nadpisů oken Transpirace.
- Výsledek: stávající přepínače detailů jsou viditelné jako +/−; rozložení a obsah oken zachovány.
- Stav: Implementováno.
- Ověření: validační test oken a kontrola připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z036 — Okna Transpirace podle šablony Fotosyntézy

- Zadání: [Šablona vzhledu](moje/vzhled_oken.md#šablona-jednoho-okna-podle-transpirace), [Transpirace](moje/okna.md#kapitola-transpirace).
- Výsledek: společné písmo, sloupce, barevné tahy a ovládací plocha nad nadpisem; odstraněny odlišné kruhové přepínače, duplicitní shrnutí a stavové nápisy uvnitř oken. Zachovány čtyři hodnoty, vzorce, výpočty, samostatné detaily a průvodce mimo okna. Zápisy všech čtyř oken sjednoceny podle obsahové šablony.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola připravené dokumentace; finální vizuální a funkční kontrola uživatelem.

#### Z035 — Obnovení stromu po změně oken

- Zadání: odstranění zmizení stromu ve všech kapitolách.
- Výsledek: ošetřen chybějící výstup při aktualizaci hodnot a obnoveny verze navazujících modulů; starší záznamy oken z cache už nepřerušují vykreslování.
- Stav: Implementováno.
- Vizuální ověření: strom a živé hodnoty potvrzeny agentem v otevřeném Chromu uživatele.
- Ověření: před opravou opakovaný pád `out()` u chybějícího `ecoCanopyTemperatureDifference`; po opravě viditelný strom v Úvodu a Transpiraci, živé hodnoty a žádná nová chyba tohoto pádu. Syntaxe a validační test oken prošly.

#### Z034 — Zjednodušení Transpirace a vzorce oken

- Zadání: [Transpirace](moje/okna.md#kapitola-transpirace).
- Výsledek: odstraněno samostatné okno Průtok, jeho výstup a detail; pravá okna řazena bez mezery. Vodní linka a stálý přehled cesty vody zůstávají. Čtyři zbývající okna mají vzorce; pravidla a šablona číselného okna je vyžadují. Ve vzhledu je samostatná šablona převzatá z Fotosyntézy.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken, kontrola odkazů a průběžná kontrola čtyř viditelných vzorců i klikání v Chromu; finální vizuální kontrola uživatelem.

#### Z033 — Srozumitelný vstup do Transpirace

- Zadání: [Průvodce Transpirací](moje/texty.md#průvodce-transpirací), [poznatky z testu](moje/tests.md).
- Výsledek: viditelné vysvětlení děje a cesty vody, označení prvků, stručná shrnutí mimo detaily a viditelná tlačítka +/−; otevřená vodní témata odkazují na zvýraznění linky. Fotosyntéza používá původní vzhled.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken a průběžná kontrola v Google Chromu při 1440 × 1000 — pět oken, shrnutí, kliknutí a absence běhových chyb; finální kontrola uživatelem a test porozumění zbývají.

#### Z032 — Rozdělení dokumentace do složek

- Zadání: [Uspořádání dokumentace](struktura_projektu.md#dokumentace).
- Výsledek: složky `moje`, `system` a `starsi`; rozcestník, struktura a evidence zůstávají v kořeni. Opraveny odkazy, pravidla a cesty kontroloru.
- Stav: Implementováno.
- Ověření: úplná formální kontrola dokumentace a testy kontroloru.

#### Z031 — Úklid dokumentace

- Zadání: [Uspořádání dokumentace](struktura_projektu.md#dokumentace).
- Výsledek: záloha rozcestníku před rozdělením, starší technický přehled a původní popis barevného posunu a vody přesunuty do `old/dokumentace`; odstraněn odkaz ze vstupního README.
- Stav: Implementováno.
- Ověření: kontrola odkazů na přesunuté soubory a zachování archivních kopií.

#### Z030 — Samostatné záznamy uživatelských testů

- Zadání: [Testy](moje/tests.md).
- Výsledek: test s mámou přesunut beze změny pozorování do `tests.md`; u strategických problémů zůstaly mýty a odkaz.
- Stav: Implementováno.
- Ověření: porovnání přesunutého textu s původním záznamem, kontrola odkazů a struktury.

#### Z029 — Poznatky z neformálního testu

- Zadání: [Problémy k řešení](moje/strategi_problems.md).
- Výsledek: zapsán test s mámou včetně fungujícího Období; odděleny návrhy od pozorování a mýty zkráceny do jedné kapitoly.
- Stav: Implementováno.
- Ověření: porovnání se zprávou uživatele, kontrola členění a odkazů; nejde o nový test webu ani ověření cílové skupiny.

#### Z028 — Tři prioritní problémy porozumění

- Zadání: [Problémy k řešení](moje/strategi_problems.md).
- Výsledek: dokument vymezuje tři mylné představy, cíle a ověřovací otázky; samotné problémy zůstávají k řešení.
- Stav: Implementováno.
- Ověření: kontrola struktury a místních odkazů.

#### Z027 — Úplná struktura Transpirace podle Fotosyntézy

- Zadání: [Transpirace](moje/okna.md#transpirace), [Převod podle vzoru](../../AGENTS.md#převod-podle-vzoru).
- Výsledek: hlavní proces a čtyři tematická okna se samostatnými hodnotami a detaily, společné definice i vykreslení, vazba na vodní linku a schéma cesty vody. Doplněno pravidlo pro budoucí převody a [postup ve strategii](moje/strategie.md#postup-návrhu-kapitoly-podle-vzoru).
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; finální vizuální a funkční kontrola uživatelem.

#### Z026 — Zachování linek při přepnutí kapitoly

- Zadání: [Společné stahování linek](moje/elementy.md#společné-stahování-linek).
- Výsledek: přepnutí kapitoly zachovává stažení vody a glukózy i stav červenání; před zobrazením skupin aktualizuje hranice linek bez posunu animace.
- Stav: Implementováno.
- Ověření: kontrola syntaxe a odstranění resetu v přepínači kapitol; finální vizuální kontrola uživatelem.

#### Z025 — Transpirace ve stylu Fotosyntézy

- Zadání: [Transpirace](moje/okna.md#transpirace), [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: společný vzhled hlavního okna a Odparu z listů, barevné tahy a pevné sloupce; zachovány původní texty, živé hodnoty a výpočty. Doplněny definice a rozcestník.
- Stav: Implementováno.
- Ověření: syntaxe JavaScriptu a validační test oken; finální vizuální kontrola uživatelem.

#### Z024 — Plynulé tempo linek

- Zadání: [Společná rychlost linek](moje/elementy.md#společná-rychlost-linek).
- Výsledek: obě linky používají čas přehrávání bez násobení proměnlivým odparem a bez zrychlení ekologických hodin.
- Stav: Implementováno.
- Ověření: kontrola syntaxe; test pauzy a násobičů přehrávání v Chromu.

#### Z023 — Společná pomalejší animace linek

- Zadání: [Společná rychlost linek](moje/elementy.md#společná-rychlost-linek).
- Výsledek: voda a glukóza sdílí čas a rychlost; animace běží poloviční rychlostí vody a reaguje na pauzu a zrychlení času.
- Stav: Implementováno.
- Ověření: syntaxe hlavního modulu a kontrola společných uniformů; finální vizuální kontrola uživatelem.

#### Z022 — Stálá rychlost glukózy

- Zadání: [Glukóza linka](moje/elementy.md#glukóza-linka).
- Výsledek: animace glukózy používá vlastní reálný čas a pevnou rychlost 1× místo dynamické rychlosti vody a modelových hodin.
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a vazeb uniformů; finální vizuální kontrola uživatelem.

#### Z021 — Report pouze s neshodami

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: report vypisuje jen doložené neshody, bez shod a neověřených položek; upraven i existující report.
- Stav: Implementováno.
- Ověření: kontrola výsledného diffu, syntaxe spouštěče a formátu zkráceného reportu.

#### Z020 — Shoda dokumentace s webem po deseti commitech

- Zadání: [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Výsledek: revize porovnává všechny obsahové definice s kódem a pozorováním skutečného Google Chromu; hlásí doložené neshody bez oprav.
- Stav: Implementováno.
- Ověření: integrační testy spouštěče a ruční kontrola sběru v Chromu; úplnost všech scénářů není zaručena.

#### Z018 — Jedinečné identifikátory změn

- Zadání: [Změny](../../AGENTS.md#změny).
- Výsledek: odstraněny duplicity ID, doplněno načtení aktuální evidence a kontrola kolizí před commitem; existující kontrolor duplicity automaticky hlásí.
- Stav: Implementováno.
- Ověření: kontrola jedinečnosti ID, vyhledání odkazů a testy kontroloru dokumentace.

#### Z015 — Revize bez konzolového okna

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: podproces Codex CLI ve Windows používá `CREATE_NO_WINDOW`.
- Stav: Implementováno.
- Ověření: integrační test kontroluje příznak spuštění podprocesu; vizuální kontrola uživatelem.

#### Z014 — Report revize v Markdownu

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: report se ukládá jako `revize_dokumentace.md`.
- Stav: Implementováno.
- Ověření: kontrola cest a integrační testy spouštěče.

#### Z013 — Současný vzhled oken

- Zadání: [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: dokumentace popisuje horní zarovnání detailů, společný začátek pravého sloupce, mezeru 15 px a samostatné délky barevných tahů.
- Stav: Implementováno.
- Ověření: porovnání s aktuálním CSS a definicemi obsahu; předchozí kontrola v Chromu naměřila odstup dlouhého vzorce přibližně 15 px. Poslední změna zakončení Vody je ověřena pouze v kódu.

#### Z012 — Revize bez hodinového čekání

- Zadání: [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Výsledek: desátý commit spustí revizi agentem na pozadí; výsledek je v `old/revize_dokumentace.md` a hodinová automatizace je pozastavená.
- Stav: Implementováno.
- Ověření: integrační testy spouštěče a výstupů, ověření neinteraktivního Codex CLI; ruční spuštění vstupní revize.

#### Z011 — Zkrácené texty oken

- Zadání: [Fotosyntéza](moje/okna.md#fotosyntéza), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda), [CO₂](moje/okna.md#co₂), [O₂](moje/okna.md#o₂).
- Výsledek: každé okno má jeden stručný odstavec místo více dlouhých odstavců.
- Stav: Implementováno.
- Ověření: kontrola počtu textových položek v definici oken, syntaxe a validační test oken.

#### Z010 — Výukové texty oken

- Zadání: [Fotosyntéza](moje/okna.md#fotosyntéza), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda), [CO₂](moje/okna.md#co₂), [O₂](moje/okna.md#o₂).
- Výsledek: okna vysvětlují roli vstupů, produkci cukrů a kyslíku, spotřebu CO₂ a význam vody pro fotosyntézu.
- Stav: Implementováno.
- Ověření: kontrola textů proti definici oken, syntaxe a validační test oken.

#### Z019 — Automatická kontrola dokumentace

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: kontrolor připraveného commitu a lokální hook; spouštění revizí určuje [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Stav: Implementováno.
- Ověření: integrační testy kontroloru v dočasných repozitářích; úplná kontrola hlásí existující nálezy, první pravidelná revize čeká na spuštění.

#### Z009 — Jedno desetinné místo hodnot

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda).
- Výsledek: hodnoty produkce a spotřeby se zobrazují s jedním desetinným místem.
- Stav: Implementováno.
- Ověření: kontrola formátování hodnot, validační test oken a kontrola zobrazení v Chromu.

#### Z017 — Detail bez překrytí a vypnuté ovládání Vody

- Zadání: [Voda](moje/okna.md#voda), [Vzhled oken](moje/vzhled_oken.md#obecný-obsah).
- Stav: Implementováno.
- Ověření: kontrola změněného JavaScriptu a CSS; finální vizuální kontrola uživatelem.

#### Z007 — Hodnoty a vstupy oken O₂, CO₂ a Voda

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Voda](moje/okna.md#voda).
- Výsledek: O₂ zobrazuje produkci v `g/min`, CO₂ spotřebu v `g/min` a Voda spotřebu v `l/h`; každé okno zobrazuje své vstupy výpočtu.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z008 — Rozlišení produkce a spotřeby

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda).
- Výsledek: hodnoty O₂ a Cukrů mají popisek „produkce“, hodnoty CO₂ a Vody „spotřeba“; CO₂ se počítá z aktivní plochy listů, fotosyntetické účinnosti a převodu molů na gramy.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z006 — Pulzující zvýraznění linek

- Zadání: [Voda linka](moje/elementy.md#voda-linka), [Glukóza linka](moje/elementy.md#glukóza-linka), zvýraznění zesílením tloušťky a pulzací bez zesvětlení.
- Stav: Implementováno.
- Ověření: kontrola shaderu a syntaxe změněného JavaScriptu; finální vizuální kontrola uživatelem.

#### Z004 — Propojení tagy

- Zadání: [Pravidlo propojení](moje/elementy.md#pravidlo-propojení), společný tag okna a elementu.
- Stav: Implementováno.
- Ověření: kontrola napojení `tema` → `setElementHighlight` → materiály linek v kódu; syntaxe a `test_ui_okna_kontrola.mjs` prošly.
- Přepnutí zvýraznění probíhá přímo při změně otevření detailu; aktualizace kapitoly zachovává jeho soulad s viditelností okna.
- Vizuální a funkční ověření: finální kontrola uživatelem.

#### Z001 — Voda

- Zadání: [Voda linka](moje/elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Implementováno.
- Ověření: kontrola vazby tagu `water` na uniform materiálu v kódu; finální kontrola uživatelem.

#### Z005 — Noční stahování linek

- Zadání: [Společné stahování linek](moje/elementy.md#společné-stahování-linek).
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a diffu; finální vizuální kontrola uživatelem.

#### Z002 — Glukóza

- Zadání: [Glukóza linka](moje/elementy.md#glukóza-linka), zvýraznění při otevření okna Cukry a návrat při zavření.
- Stav: Implementováno.
- Ověření: porovnání vazby okna s uniformem shaderu v kódu; finální kontrola uživatelem.

#### Z003 — UI podle SVG

- Zadání: [Fotosyntéza](architektura_obsahu.md#fotosyntéza), [statická okna](moje/vzhled_oken.md#statická-okna), [vzhled bloků](moje/vzhled_oken.md), [Kapitoly](moje/prvky.md#kapitoly).
- Stav: Implementováno.
- Ověření: kontrola syntaxe změněných modulů a `test_ui_okna_kontrola.mjs` prošly; test zahrnuje spuštění bez bodů stromu.
- Omezení: širší `test_tree_ecology.mjs` selhává na „Excess inflow stops at capacity“ v nezměněném ekologickém modelu.
- Vizuální a závěrečné ověření: finální kontrola uživatelem.

## Ověřeno

## K upřesnění

## Pravidla evidence

- Postup dokončení určuje [Pracovní postup](../../AGENTS.md#pracovní-postup), význam stavů [Změny](../../AGENTS.md#změny).
- Každá změna má stálé ID, odkaz na zadání, stav a výsledek ověření.
- Přidělování ID a řešení souběžných kolizí určuje [AGENTS.md](../../AGENTS.md#změny); každé ID použij pouze jednou v celém dokumentu.
- Eviduj i drobné vizuální ladění celého webu; související pokusy sluč do jedné dokončené logické změny.
- U drobných úprav stačí stručný výsledný popis a skutečné ověření; podrobné definice nepřepisuj, pokud se jejich význam nemění.
- Evidenci commituj společně s příslušným kódem; historii souborů vede Git, bez povinné YAML historie a ID chatu.
- Při změně stavu přesuň záznam do příslušné části.
- Předaný výsledek ber jako vyhovující a uzavřený bez dalšího schválení, pokud uživatel výslovně nevznese výhradu nebo požadavek na úpravu.
- Přijetí bez výhrady neprokazuje provedení testu; bez doložené finální kontroly ponech stav „Implementováno“. Po potvrzení skutečné kontroly zapiš rozsah ověření, přesuň záznam do „Ověřeno“ a evidenci ulož samostatným commitem.
- Neevidované části webu nejsou tímto dokumentem ověřené.

[Zpět na obsah](architektura_obsahu.md)

## Pravidla struktury

- Změny seskupuj podle stavu v kapitolách `##`; jednotlivé záznamy mají nadpis `####` se stálým ID a názvem.
- U záznamu uváděj odkaz na zadání, stav a skutečné ověření; případná omezení uveď samostatně.
- U vizuálního ladění přidej stručný bod „Výsledek“ s konečnou úpravou; mezikroky do šablony nepatří.
- Význam stavů a přesuny záznamů určují pravidla evidence výše.
- Tuto část s obecnou šablonou ponechávej na konci dokumentu.

```markdown
## Název stavu

#### ZXXX — Název změny

- Zadání: [Definice](soubor.md#kotva).
- Výsledek: stručný popis výsledné úpravy.
- Stav: odpovídající stav.
- Ověření: provedená kontrola nebo finální kontrola uživatelem.
```
