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

## Kapitola Fotosyntéza

### Okna

#### Světlo

**Tag:** 🟡 `light`
### Vzorec: `světlo × voda × (listy / max. listy) × CO₂ × teplota`

- Téma: světlo; strana: vpravo; tematické okno.
- Detailní text: „Odhad využití světla.“
- Spotřeba: dostupnost světla × aktivita fotosyntézy, na stejné procentní škále jako dostupnost.
- Dostupnost: intenzita světla modelu v procentech, nezávislá na vodě.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.

#### O₂

**Tag:** 🔹 `oxygen`

### Vzorec: `cukry × 1,07`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „Fotosyntéza O₂ uvolňuje, dýchání spotřebovává.“
- Zobrazení vzorce: .
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: produkce O₂ v `g/min`, zobrazena na jedno desetinné místo.
- Spotřeba O₂: orientační odhad dýchání v `g/min`.
- Výchozí stav detailu: zavřený.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

### Vzorec: `listy × účinnost × 0,021`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „Fotosyntéza CO₂ přijímá, dýchání uvolňuje.“
- Zobrazení vzorce: .
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: spotřeba CO₂ v `g/min`, zobrazena na jedno desetinné místo.
- Produkce CO₂: orientační odhad dýchání v `g/min`.
- Výchozí stav detailu: zavřený.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

### Vzorec: `listy × účinnost × 0,0144`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Detailní text: „Rašení čerpá cukry. Na podzim se část vrací z listů.“
- Produkce a spotřeba se zobrazují v `g/min` na jedno desetinné místo. Sezónní přírůstky vycházejí ze [společné bilance cukrů](#společná-bilance-cukrů).
- Zásoba: aktuální výukový odhad v kilogramech podle [společné bilance cukrů](#společná-bilance-cukrů). Roční graf je stále viditelný vpravo u pruhů podle artboardu „PODKLAD graf kole4ko“ v [podkladu Affinity](../../web_assets/af/2.af). Popisek je nad kruhem, hodnota uprostřed a plocha plná v barvě pruhu produkce.
- Roční graf začíná 1. ledna nahoře a běží po směru hodin. Výplň sahá od vnitřního okraje pro 0 kg po aktuální průběh. Vnější kruh označuje kapacitu. Ryska s tečkou ukazuje aktuální datum a hodnotu. Typický rok se spočítá den po dni už při načítání stromu se stejnou bilancí a s výchozím ovládáním. Od 1. ledna k rysce je výplň jednotně oranžová. Zaznamenané hodnoty doplňuje typický rok pro dny bez záznamu. Od rysky do konce roku je plocha průhledná. Po přelomu roku, návratu v čase nebo resetu se záznam kreslí od nové pozice.
- Ovládání: červený pohyblivý konec horního pruhu funguje jako horní zarážka (strop) — produkci cukrů omezuje až od chvíle, kdy se dotkne barevného pruhu a zatlačí jej zpět; nad aktuální hodnotou produkci nemění.
- Při automatickém běhu roku určuje dostupná zásoba, kolik jarního růstu může strom pokrýt. Když cukry nestačí, doroste menší listová plocha, která sníží tvorbu cukrů. Zmenšená plocha přetrvá do dalšího rašení. Jde o výukové znázornění oslabení.
- Zobrazení vzorce: .
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.
- Stav detailu zůstává zachovaný při změně kapitoly.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

**Tag:** 🔵 `water`

### Vzorec: `spotřeba vody`

- Nadpis: `Voda`.
- Téma: voda; strana: vpravo.
- Detailní text: „Odpar vody ochlazuje korunu.“
- Zobrazení vzorce: .
- Vstup výpočtu: `voda`.
- Hodnota: spotřeba vody v `l/h`, zobrazena na jedno desetinné místo.
- Zásoba: aktuální množství dostupné vody ve stromě a kořenové půdě v litrech (výuková kapacita vystačí zhruba na 3–4 letní dny bez srážek). Kruhový ukazatel vpravo ukazuje podíl na kapacitě zásoby zleva doprava. Při běhu roku se její celodenní bilance započítává podle uplynulých kalendářních dní. Denní odpar se pro tuto bilanci průměruje s nocí. Údaj o spotřebě dál ukazuje okamžitou hodnotu.
- Ovládání: červený pohyblivý konec horního pruhu funguje jako horní zarážka — automatický přísun vody omezuje až od chvíle, kdy se dotkne barevného pruhu; nad aktuální hodnotou přísun nemění.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

## Kapitola Transpirace

### Okna

- Okna používají [šablonu Transpirace](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace); samostatný [průvodce](texty.md#průvodce-transpirací) zůstává mimo ně.
- Stav detailů zůstává zachovaný při změně kapitoly.

#### Transpirace

**Tag:** 🔵 `water`

### Vzorec: `min(základ × listy × světlo × voda; spotřeba)`

- Nadpis: `Transpirace`; role: hlavní okno; strana: vlevo.
- Detailní text: „Voda se odpařuje z listů. Tím pomáhá táhnout další vodu od kořenů a spotřebovává teplo. Strom vodu nepumpuje jako srdce.“
- Hodnota: odpařená voda v `l/h`, jedno desetinné místo.
- Zobrazení vzorce: viditelný pod hodnotou.
- Vstupy výpočtu: základ odparu, podíl listů, světlo, zavodnění a mez spotřeby; význam jednotek určuje [Význam vzorců](#význam-vzorců).
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: otevřený; detail je pod hlavními údaji.
- Související elementy: [Voda linka](elementy.md#voda-linka), [H₂O částice](elementy.md#h₂o).

#### Příjem vody

**Tag:** 🔵 `water`

### Vzorec: `min(přísun; limit kořenů)`

- Nadpis: `Příjem vody`; role: tematické okno; strana: vpravo dole.
- Detailní text: „Kořeny přijímají vodu a doplňují její zásobu ve stromu. Příjem a odpar nemusí být v danou chvíli stejné.“
- Hodnota: příjem kořeny v `l/h`, jedno desetinné místo.
- Zobrazení vzorce: viditelný pod hodnotou.
- Vstupy výpočtu: dostupný přísun vody a sezónní kapacita kořenů upravená jejich stavem.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Chlazení

**Tag:** 🌡️ `temperature`

### Vzorec: `odpar × 2450 / 3600`

- Nadpis: `Chlazení`; role: tematické okno; strana: vpravo, druhé shora.
- Detailní text: „Odpaření vody spotřebovává teplo. Číslo ukazuje odhad chladicího výkonu, nikoli pokles teploty.“
- Hodnota: chladicí výkon v `kW`, dvě desetinná místa.
- Zobrazení vzorce: viditelný pod hodnotou.
- Vstupy výpočtu: odpar v `l/h`, modelové skupenské teplo 2450 kJ/kg a převod hodin na sekundy.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.

#### Teplota

**Tag:** 🌡️ `temperature`

### Vzorec: `okolí − ochlazení + noční efekt`

- Nadpis: `Teplota`; role: tematické okno; strana: vpravo nahoře.
- Detailní text: „Číslo ukazuje teplotu u koruny. Ve dne ji odpar pomáhá snižovat; v noci může být u koruny mírně tepleji. Jde o výukový odhad založený na normálech ČHMÚ 1991–2020, nikoli měření nebo předpověď.“
- Hodnota: teplota u koruny ve `°C`, jedno desetinné místo.
- Zobrazení vzorce: viditelný pod hodnotou.
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


- Popisné texty oken piš co nejstručněji, aby se vešly do dostupného prostoru a zachovaly hlavní sdělení.
- Nápověda +/− se aktivuje 30 sekund po načtení stránky, pokud uživatel dosud ručně nepřepnul žádné okno; první přepnutí tlačítkem, nadpisem či klávesnicí ji vypne všude až do obnovení stránky. Automatické výchozí otevření ji nevypíná. Animaci určuje [Vzhled oken](vzhled_oken.md).

## Kapitola Období

- Průvodce popisuje proměnu koruny buku během roku od jarního rašení až po přezimování pupenů. Roční období se mění kruhem u stromu. Pauza a rychlost dole u data řídí společně kalendář, slunce a zásoby. Při rychlosti 1× trvá jeden měsíc zhruba 53 sekund od úsvitu do úsvitu. Noc trvá 2 sekundy a den zbytek. Den i noc stále představují po 12 hodinách modelového slunečního cyklu. Výpočty zásob se řídí uplynulým kalendářním časem. Při ručním otáčení kruhem se poloha slunce a denní doba drží a po ukončení posunu plynule navážou od stejné hodiny. Přeskočený čas nepřidává vodě další spotřebu. Zásoba cukrů se dopočítá mezi oběma daty podle roční bilance a aktuálního nastavení produkce.

### Společná pravidla Fotosyntézy

- Okna používají [společnou šablonu](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace) ve variantě s dvojitými vodorovnými pruhy. Kliknutí v bloku údajů přepne detail. Posuvník světla a červené pohyblivé konce u oken se zásobou (Cukry, Voda) se ovládají samostatně myší, dotykem nebo klávesnicí. Stav detailu se zachovává při změně kapitoly.
- Při každém přechodu do Fotosyntézy se nastaví léto. Fotosyntéza je samostatný nadpis kapitoly bez okna. Tematická okna jsou vpravo a jejich detaily jsou výchozí zavřené. Polohu otevřeného detailu určuje [vzhled oken](vzhled_oken.md#obecný-obsah).
- Vzorec nebo přehled vstupů se u oken Fotosyntézy zobrazuje až v otevřeném detailu.
- Okna Světlo, O₂, CO₂, Cukry a Voda obsahují dva údaje o tocích nebo dostupnosti podle [popisu vzhledu](vzhled_oken.md). Cukry a Voda navíc ukazují kruhovou zásobu. Neznámá hodnota se označí „Zatím nemáme hodnotu“ bez vyplnění ukazatele.
- Červený pohyblivý konec u Cukrů a Vody funguje jako horní zarážka na škále pruhu (0 až 100 %): dokud se nedotkne barevného pruhu, přirozenou hodnotu nemění; jakmile se jej dotkne, táhne jej s sebou a zastropuje produkci cukrů, resp. automatický přísun vody (ten v průměru činí 90 % sezónní kapacity příjmu a v čase plynule kolísá kolem tohoto průměru jako simulace vlhčích a sušších dnů). Nastavení přetrvá při automatickém běhu. Příjem stromu omezuje sezónní kapacita a stav kořenů.
- Ukazatel dostupnosti světla nastavuje přes den intenzitu v rozsahu 0 až 100 %. Ovlivňuje tvorbu cukrů i emisi fotonů. V noci je dostupnost nulová a posuvník se zamkne. Nastavená hodnota se obnoví po východu slunce. Ruční změna období vrátí automatickou dostupnost podle slunce.
- Ukazatele fotosyntetických toků používají maximum modelu pro plnou korunu a plnou účinnost; ukazatel spotřeby vody používá základní odpar včetně udržovací spotřeby. Rozsah dostupnosti vody sahá ke dvojnásobku sezónní kapacity kořenů, případně k aktuálně nastavenému přísunu, je-li vyšší.
- Dýchání je orientační výukový odhad celého stromu, probíhá ve dne i v noci a jeho ukazatele používají stejné škály jako odpovídající fotosyntetické toky. Při 20 °C a plné koruně je zvolená spotřeba cukru 15 % teoretické produkce plné koruny; bez listů klesá na 20 % a každých 10 °C ji zdvojnásobí nebo sníží na polovinu (teplota je omezena na −10 až 40 °C). Hodnoty O₂ a CO₂ vycházejí ze vztahu glukóza + 6 O₂ → 6 CO₂ + voda. Jde o zvolený příklad, nikoli kalibraci nebo měření buku. Při vyčerpané zásobě cukrů (0 kg) se dýchání omezí nejvýše na aktuální produkci cukrů (v zimě na 0). Teplotní závislost udržovacího dýchání je inspirována [modelem GO+](https://gmd.copernicus.org/articles/13/5973/2020/).

### Společná bilance cukrů

Výchozí kapacita zásoby cukrů je 40 kg. Zásoba se počítá průběžně stejně jako zásoba vody z denního průměru bilance: při kladné bilanci se ukládá 7,3 % přebytku (u oslabené neplné koruny až 25 %, protože strom šetří na růstu dřeva a přednostně doplňuje zásoby), při záporné se čerpá 100 % rozdílu. Na začátku jarního rašení (25. dubna) určí dostupná zásoba cukrů i zavodnění stromu podíl vyrašené koruny (pro 100 % koruny je potřeba 14 kg cukrů a plné zavodnění) a odpovídající spotřeba cukrů se plynule rozloží po celou dobu rašení (25. dubna – 13. května, 18 dní) ve stejných jednotkách `g/min` jako dýchání. Při podzimním opadu (25. října – 20. listopadu) se plynule vrací až 3 kg cukrů úměrně listům, které na stromě zůstaly před opadem, a přičítají se k produkci v `g/min`. Při ručním posunu data dopředu se přičte aktuální denní bilance za přeskočené dny (a případný podíl rašení); pohyb zpět zásobu nemění. Zvolené limity jsou výukové parametry. [Měření rašení u buku](https://pubmed.ncbi.nlm.nih.gov/27126226/) dokládá výraznou spotřebu škrobu ve větvičkách. [Značení uhlíku u buku](https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.14124) dokládá přenos z listů do zásobních orgánů před opadem.

## Související dokumenty

- [Vzhled oken](vzhled_oken.md)

- [Technická architektura](../system/architektura_oken.md)
- [Stav změn](../zmeny.md)
- [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Kapitola má úroveň `##`, oblast `###` a konkrétní okno `####`.
- Používej níže uvedenou šablonu a uveď pouze údaje, které se okna týkají.
- Vzorec uváděj tam, kde je definován; jeho zobrazení určuje příslušná kapitola.
- Ovládání okna a uchování stavu popisuj zde; reakci souvisejícího elementu definuj pouze v `elementy.md` a odkaž na ni.
- Uváděj pouze položky, které se daného okna týkají.
- Odkazy na související dokumenty ponechávej před těmito pravidly.

```markdown
#### Název okna

**Tag:** symbol `tag`

### Vzorec: `výpočet`

- Téma: téma; strana: umístění; role okna.
- Detailní text: „Stručné vysvětlení.“
- Spotřeba: význam a jednotka.
- Dostupnost: význam a jednotka.
- Vstupy výpočtu: zapnuté nebo vypnuté.
- Výsledná hodnota: zapnutá nebo vypnutá.
- Výchozí stav detailu: otevřený nebo zavřený.
```
