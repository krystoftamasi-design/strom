---
history:
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: "Přeskupeno pořadí pravých oken Transpirace: nahoře Teplota, uprostřed Chlazení a dole Příjem vody."
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Odstraněn doplňkový řádek s porovnáním teplot v detailu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vrácena viditelná tlačítka +/− do oken Transpirace.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednoceny zápisy čtyř oken Transpirace podle šablony Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Odstraněn Průtok a doplněny vzorce i šablona číselného okna podle Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.

---

# Okna

- Popisné texty oken piš co nejstručněji, aby se vešly do dostupného prostoru a zachovaly hlavní sdělení.
- Nápověda +/− se aktivuje 30 sekund po načtení stránky, pokud uživatel dosud ručně nepřepnul žádné okno; první přepnutí tlačítkem, nadpisem či klávesnicí ji vypne všude až do obnovení stránky. Automatické výchozí otevření ji nevypíná. Animaci určuje [Vzhled oken](vzhled_oken.md).

## Kapitola Období

- Průvodce popisuje proměnu koruny buku během roku od jarního rašení až po přezimování pupenů. Roční období se mění kruhem u stromu. Pauza a rychlost dole u data řídí společně kalendář, slunce a zásoby. Každý měsíc běží při rychlosti 1× 24 sekund od úsvitu do dalšího úsvitu, z toho 20 sekund den a 4 sekundy noc. Obě části odpovídají 12 modelovým hodinám. Při ručním otáčení kruhem se poloha slunce drží. Po ukončení tahu nebo doběhnutí posunu kolečkem slunce přejede do nové polohy za 220 ms. Při nastaveném omezení pohybu se poloha změní okamžitě. Přeskočený čas nepřidává vodě další spotřebu. Zásoba cukrů se dopočítá mezi oběma daty podle roční bilance a aktuálního nastavení produkce.

## Kapitola Fotosyntéza

### Okna

- Okna používají [společnou šablonu](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace) ve variantě s vodorovnými pruhy. Kliknutí v bloku údajů přepne detail. Posuvníky světla a vody se ovládají samostatně myší, dotykem nebo klávesnicí. Stav detailu se zachovává při změně kapitoly.
- Při každém přechodu do Fotosyntézy se nastaví léto. Fotosyntéza je samostatný nadpis kapitoly bez okna. Tematická okna jsou vpravo a jejich detaily jsou výchozí zavřené. Polohu otevřeného detailu určuje [vzhled oken](vzhled_oken.md#obecný-obsah).
- Vzorec nebo přehled vstupů se u oken Fotosyntézy zobrazuje až v otevřeném detailu.
- Okna Světlo, O₂, CO₂, Cukry a Voda obsahují dva údaje o tocích nebo dostupnosti podle [popisu vzhledu](vzhled_oken.md). Cukry a Voda navíc ukazují zásobu. Neznámá hodnota se označí „Zatím nemáme hodnotu“ bez vyplnění ukazatele.
- Ukazatel dostupnosti vody nastavuje přísun ke kořenům v l/h. Automatický přísun činí 90 % sezónní kapacity příjmu. Ruční nastavení přetrvá při automatickém běhu. Ruční změna období obnoví automatický přísun. Příjem stromu omezuje sezónní kapacita a stav kořenů.
- Ukazatel dostupnosti světla nastavuje přes den intenzitu v rozsahu 0 až 100 %. Ovlivňuje tvorbu cukrů i emisi fotonů. V noci je dostupnost nulová a posuvník se zamkne. Nastavená hodnota se obnoví po východu slunce. Ruční změna období vrátí automatickou dostupnost podle slunce.
- Ukazatele fotosyntetických toků používají maximum modelu pro plnou korunu a plnou účinnost; ukazatel spotřeby vody používá základní odpar včetně udržovací spotřeby. Rozsah dostupnosti vody sahá ke dvojnásobku sezónní kapacity kořenů, případně k aktuálně nastavenému přísunu, je-li vyšší.
- Dýchání je orientační výukový odhad celého stromu, probíhá ve dne i v noci a jeho ukazatele používají stejné škály jako odpovídající fotosyntetické toky. Při 20 °C je zvolená spotřeba cukru 15 % teoretické produkce plné koruny; každých 10 °C ji zdvojnásobí nebo sníží na polovinu, výpočet omezuje teplotu na −10 až 40 °C. Hodnoty O₂ a CO₂ vycházejí ze vztahu glukóza + 6 O₂ → 6 CO₂ + voda. Jde o zvolený příklad, nikoli kalibraci nebo měření buku. Okamžitý odhad dýchání se počítá nezávisle na velikosti zásoby cukrů. Teplotní závislost udržovacího dýchání je inspirována [modelem GO+](https://gmd.copernicus.org/articles/13/5973/2020/).

#### Světlo

**Tag:** 🟡 `light`

- Nadpis: `Světlo`.
- Téma: světlo; strana: vpravo; tematické okno.
- Detailní text: „Listy využívají světlo podle dostupnosti vody a dalších podmínek.“
- Spotřeba: aktivita fotosyntézy v procentech jako výukový ukazatel využití světla, nikoli měření energie.
- Dostupnost: intenzita světla modelu v procentech, nezávislá na vodě.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.

#### O₂

**Tag:** 🔹 `oxygen`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „Fotosyntéza uvolňuje O₂. Dýchání ho spotřebovává v odhadovaném množství.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: produkce O₂ v `g/min`, zobrazena na jedno desetinné místo.
- Spotřeba O₂: orientační odhad dýchání v `g/min`.
- Výchozí stav detailu: zavřený.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „Fotosyntéza přijímá CO₂. Dýchání ho uvolňuje v odhadovaném množství.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: spotřeba CO₂ v `g/min`, zobrazena na jedno desetinné místo.
- Produkce CO₂: orientační odhad dýchání v `g/min`.
- Výchozí stav detailu: zavřený.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Detailní text: „Při rašení se do spotřeby počítá růst listů. Na podzim se k produkci přičítají cukry přesunuté z listů do zásoby.“
- Produkce a spotřeba se zobrazují v `g/min` na jedno desetinné místo. Sezónní přírůstky vycházejí ze [společné bilance cukrů](#kapitola-prototyp).
- Zásoba: aktuální výukový odhad v kilogramech podle [společné bilance cukrů](#kapitola-prototyp). Značka Z ukazuje podíl na nastavené kapacitě.
- Při automatickém běhu roku určuje dostupná zásoba, kolik jarního růstu může strom pokrýt. Když cukry nestačí, doroste menší listová plocha, která sníží tvorbu cukrů. Zmenšená plocha přetrvá do dalšího rašení. Jde o výukové znázornění oslabení.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.
- Stav detailu zůstává zachovaný při změně kapitoly.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

**Tag:** 🔵 `water`

- Nadpis: `Voda`.
- Téma: voda; strana: vpravo.
- Detailní text: „Voda zavodňuje listy a jejím odparem se koruna ochlazuje.“
- Vstup výpočtu: `voda`.
- Hodnota: spotřeba vody v `l/h`, zobrazena na jedno desetinné místo.
- Zásoba: aktuální množství dostupné vody ve stromu v litrech. Samostatný pruh ukazuje podíl na kapacitě zásoby. Při běhu roku se její celodenní bilance započítává podle uplynulých kalendářních dní. Denní odpar se pro tuto bilanci průměruje s nocí. Údaj o spotřebě dál ukazuje okamžitou hodnotu.
- Ovládání: ukazatel dostupnosti nastavuje přísun vody podle společného pravidla oken kapitoly.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

## Kapitola Transpirace

### Okna

- Okna používají [šablonu Transpirace](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace); samostatný [průvodce](texty.md#průvodce-transpirací) zůstává mimo ně.
- Stav detailů zůstává zachovaný při změně kapitoly.

#### Transpirace

**Tag:** 🔵 `water`

- Nadpis: `Transpirace`; role: hlavní okno; strana: vlevo.
- Detailní text: „Voda se odpařuje z listů. Tím pomáhá táhnout další vodu od kořenů a spotřebovává teplo. Strom vodu nepumpuje jako srdce.“
- Hodnota: odpařená voda v `l/h`, jedno desetinné místo.
- Vzorec: `min(základ × listy × světlo × voda; spotřeba)`, viditelný pod hodnotou.
- Vstupy výpočtu: základ odparu, podíl listů, světlo, zavodnění a mez spotřeby; význam jednotek určuje [Význam vzorců](#význam-vzorců).
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: otevřený; detail je pod hlavními údaji.
- Související elementy: [Voda linka](elementy.md#voda-linka), [H₂O částice](elementy.md#h₂o).

#### Příjem vody

**Tag:** 🔵 `water`

- Nadpis: `Příjem vody`; role: tematické okno; strana: vpravo dole.
- Detailní text: „Kořeny přijímají vodu a doplňují její zásobu ve stromu. Příjem a odpar nemusí být v danou chvíli stejné.“
- Hodnota: příjem kořeny v `l/h`, jedno desetinné místo.
- Vzorec: `min(přísun; limit kořenů)`, viditelný pod hodnotou.
- Vstupy výpočtu: dostupný přísun vody a sezónní kapacita kořenů upravená jejich stavem.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Chlazení

**Tag:** 🌡️ `temperature`

- Nadpis: `Chlazení`; role: tematické okno; strana: vpravo, druhé shora.
- Detailní text: „Odpaření vody spotřebovává teplo. Číslo ukazuje odhad chladicího výkonu, nikoli pokles teploty.“
- Hodnota: chladicí výkon v `kW`, dvě desetinná místa.
- Vzorec: `odpar × 2450 / 3600`, viditelný pod hodnotou.
- Vstupy výpočtu: odpar v `l/h`, modelové skupenské teplo 2450 kJ/kg a převod hodin na sekundy.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.

#### Teplota

**Tag:** 🌡️ `temperature`

- Nadpis: `Teplota`; role: tematické okno; strana: vpravo nahoře.
- Detailní text: „Číslo ukazuje teplotu u koruny. Ve dne ji odpar pomáhá snižovat; v noci může být u koruny mírně tepleji. Jde o výukový odhad založený na normálech ČHMÚ 1991–2020, nikoli měření nebo předpověď.“
- Hodnota: teplota u koruny ve `°C`, jedno desetinné místo.
- Vzorec: `okolí − ochlazení + noční efekt`, viditelný pod hodnotou.
- Vstupy výpočtu: teplota okolí, modelový účinek odparu a noční efekt olistěné koruny.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.

### Význam vzorců

- `min` znamená menší ze dvou hodnot. Vodní toky a základ odparu jsou ve vzorcích vyjádřeny v `l/h`; listy, světlo a zavodnění jsou bezrozměrné podíly.
- Limit kořenů je sezónní kapacita příjmu upravená podle stavu kořenů.
- Chlazení převádí odpar v `l/h` na výkon v `kW` pomocí modelového skupenského tepla 2450 kJ/kg a převodu hodin na sekundy.
- Teplota u koruny je teplota okolí snížená o modelový účinek odparu a zvýšená o noční efekt olistěné koruny; jde o výukový odhad.

## Kapitola Semenace

### Okna

- Cíl a navržené ověření určuje [Strategie](strategie.md#uplatnění-v-semenaci).
- Okna navazují na [šablonu Transpirace](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace). Hlavní detail je výchozí otevřený, tematické zavřené; nadpis nebo tlačítko +/− přepíná detail a stav zůstává při změně kapitoly zachovaný.
- Stávající ovládání období určuje zobrazenou fázi, bez další časové osy. Fáze jsou typickým přehledem, nikoli přesným kalendářem či simulací jednotlivých let.

#### Semenace

- Nadpis: `Semenace`; role: hlavní okno; strana: vlevo.
- Detail: „Z opylených květů vznikají bukvice. Na jaře mohou semena vyklíčit.“
- Přehled období: jaro — kvetení a opylení, případně klíčení semen z předchozího roku; léto — vývoj bukvic; podzim — dozrávání, pád a šíření; zima — přezimování semen.
- [Kontext počtu semen](texty.md#kontext-počtu-semen) doplňuje jejich množství a přežití.
- Hodnota: název aktuální fáze; žádný vypočtený počet ani procento.

#### Květy

- Nadpis: `Květy`; role: tematické okno; strana: vpravo nahoře.
- Stav podle období: jaro `Kvetou`, léto `Po odkvětu`, podzim a zima `Mimo období`.
- Detail: „Na jaře vítr přenáší pyl mezi květy.“
- Zvýraznění květů čeká na dodání assetů; zatím není element propojen.

#### Bukvice

- Nadpis: `Bukvice`; role: tematické okno; strana: vpravo uprostřed.
- Stav podle období: jaro `Po opylení`, léto `Vyvíjejí se`, podzim `Dozrávají`, zima `Mimo období`.
- Detail: „Bukvice vznikají po opylení. Bohatá úroda není každý rok.“
- Vývoj bukvic znázorňuje [model v koruně](elementy.md#padající-semena).

#### Semena

**Tag:** 🟤 `seeds`

- Nadpis: `Semena`; role: tematické okno; strana: vpravo dole.
- Stav podle období: jaro `Mohou klíčit`, léto `Ve vývoji`, podzim `Padají`, zima `Přezimují`. Jaro a zima se vztahují k semenům předchozí úrody.
- Detail: „Bukvice padají poblíž stromu; živočichové část přenesou dál. Za generace se tak druh může šířit při změnách klimatu.“
- Roční přehled znázorňuje jeden rok; posun druhu probíhá přes mnoho generací a není součástí roční simulace.
- Související element: [Padající semena](elementy.md#padající-semena).

## Kapitola Prototyp

Tři zkušební varianty ukazují společnou zásobu cukrů v kilogramech. Výchozí maximum je 40 kg. Roční křivka používá pro každý měsíc reprezentativní bilanci celého dne, průměr hodinových výpočtů z příslušného měsíce. Při automatickém běhu roku jde do využitelné zásoby 12 % kladné bilance. Od začátku opadu do dorostení jarních listů se ze zásoby kryje 53 % záporné bilance, v olistěné části roku celá. Pro podzimní přesun z listů se do začátku opadu vyhrazuje 10 % kapacity. Tyto výukové parametry nastavují roční průběh zásoby bez změny okamžité produkce a dýchání. Nedostatek vody v zásobě stromu nebo ručně snížené světlo snižují tvorbu cukrů až pro část roku, která od změny uběhne. Okamžitá tvorba a spotřeba sledují denní cyklus odvozený z data. Při ručním přesunu data se od výchozí zásoby dopočítá denní produkce podle aktuálního nastavení produkce, vody a světla a započte se spotřeba. Pohyb zpět obrací odhadovanou bilanci. Při nulové produkci nepřibývají cukry z fotosyntézy. Na podzim se stále mohou vrátit cukry už uložené v listech. Při návratu na původní datum bez automatického běhu se obnoví původní hodnota, i když zásoba mezitím dosáhla svého limitu. Změna maxima založí novou referenční zásobu pro zvolené datum. Lednový stav referenční křivky navazuje na konec předchozího modelového roku. Při jarním rašení se jednorázově odebere až 350 g podle dostupné zásoby. I po přeskočení jara se odběr započte ve chvíli, kdy se objeví nové listy. Ve spotřebě se k dýchání na jeden modelový kalendářní den přičte průměr tohoto odběru za den, přepočtený na minuty zrychleného času. Do začátku opadu se 10 % kladné bilance ukládá do listů, nejvýše do 10 % nastaveného maxima. Cukry se z listů vracejí do zásoby podle časové křivky animace opadu od 25. října do 20. listopadu. Přesun se přičítá k fotosyntéze v produkci. Obě sezónní hodnoty jsou přepočtené na minuty zrychleného času a zobrazují je hlavní okno Cukry i prototypy. Zvolené limity jsou výukové parametry. [Měření rašení u buku](https://pubmed.ncbi.nlm.nih.gov/27126226/) dokládá výraznou spotřebu škrobu ve větvičkách. [Značení uhlíku u buku](https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.14124) dokládá přenos z listů do zásobních orgánů před opadem.

## Související dokumenty

- [Vzhled oken](vzhled_oken.md)

- [Technická architektura](../system/architektura_oken.md)
- [Stav změn](../zmeny.md)
- [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Kapitola má úroveň `##`, oblast `###` a konkrétní okno `####`.
- Používej šablonu okna odvozenou z Transpirace: tag → nadpis a role → stručné shrnutí → detail → hodnota → vzorec a vstupy → ovládání a výchozí stav → související element.
- U každého okna s vypočtenou hodnotou je vzorec povinný a viditelný i při zavřeném detailu. Přehled vstupů odlišuj od úplné rovnice; nepoužívej automaticky násobení pro součet, rozdíl nebo omezení minimem.
- Ovládání okna a uchování stavu popisuj zde; reakci souvisejícího elementu definuj pouze v `elementy.md` a odkaž na ni.
- Uváděj pouze položky, které se daného okna týkají.
- Odkazy na související dokumenty ponechávej před těmito pravidly.

```markdown
## Kapitola Název

### Okna

#### Název okna

**Tag:** 🔵 `tag`

- Nadpis: `Název`; role: hlavní nebo tematické okno; strana: vlevo nebo vpravo.
- Shrnutí: stručné vysvětlení viditelné bez otevření detailu.
- Detailní text: krátké vysvětlení tématu.
- Hodnota: vypočtená veličina, jednotka, formát a popisek.
- Vzorec: skutečný vztah nebo označený přehled vstupů, viditelný pod hodnotou.
- Vstupy výpočtu: význam jednotlivých proměnných a případná zjednodušení.
- Ovládání detailu: způsob otevření a zavření.
- Výchozí stav detailu: otevřený nebo zavřený.
- Související element: [Název](elementy.md#kotva).
```
