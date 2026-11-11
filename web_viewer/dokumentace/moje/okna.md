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

## Kapitola Fotosyntéza

### Okna

- Všechna okna používají [šablonu Transpirace](vzhled_oken.md#šablona-jednoho-okna-podle-transpirace), včetně velikostí písma, tahů a viditelného tlačítka +/−. Nadpis i tlačítko přepínají detail; stav se zachovává při změně kapitoly.
- Fotosyntéza je samostatný nadpis kapitoly bez okna. Tematické detaily jsou výchozí zavřené, vpravo od údajů a na úzké obrazovce pod nimi.
- Okna Světlo, O₂, CO₂, Cukry a Voda obsahují dva údaje s ukazateli. Světlo a Voda zobrazují spotřebu a dostupnost; O₂, CO₂ a Cukry produkci a spotřebu, v tomto pořadí. Neznámá hodnota se označí „Zatím nemáme hodnotu“ bez vyplnění ukazatele.
- Spodní ukazatel vody nastavuje dostupný přísun ke kořenům v l/h, myší, dotykem i klávesnicí. Automatický přísun činí 90 % sezónní kapacity příjmu. Ruční nastavení přetrvá při automatickém běhu; ruční změna období obnoví automatický přísun. Příjem stromu omezuje sezónní kapacita a stav kořenů. Ostatní ukazatele hodnoty pouze zobrazují.
- Ukazatele fotosyntetických toků používají maximum modelu pro plnou korunu a plnou účinnost; ukazatel spotřeby vody používá základní odpar včetně udržovací spotřeby. Rozsah dostupnosti vody sahá ke dvojnásobku sezónní kapacity kořenů, případně k aktuálně nastavenému přísunu, je-li vyšší.

#### Světlo

**Tag:** 🟡 `light`

- Nadpis: `Světlo`.
- Téma: světlo; strana: vlevo; tematické okno.
- Detailní text: „Dostupné světlo dopadá na listy. Jeho využití při fotosyntéze závisí také na vodě a dalších podmínkách.“
- Spotřeba: aktivita fotosyntézy v procentech jako výukový ukazatel využití světla, nikoli měření energie.
- Dostupnost: intenzita světla modelu v procentech, nezávislá na vodě.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.

#### O₂

**Tag:** 🔹 `oxygen`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „O₂ vzniká při štěpení vody a strom ho při fotosyntéze uvolňuje do vzduchu.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: produkce O₂ v `g/min`, zobrazena na jedno desetinné místo.
- Spotřeba O₂: zatím není vypočítána.
- Výchozí stav detailu: zavřený.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „CO₂ je vstupní látka fotosyntézy; průduchy regulují jeho příjem podle vody a podmínek prostředí.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: spotřeba CO₂ v `g/min`, zobrazena na jedno desetinné místo.
- Produkce CO₂: zatím není vypočítána.
- Výchozí stav detailu: zavřený.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Detailní text: „Cukry ukládají energii ze světla a slouží jako palivo i stavební materiál pro růst stromu.“
- Hodnota: `glucoseGramsPerMinute`, jednotka `g/min`, jedno desetinné místo.
- Spotřeba cukrů: zatím není vypočítána.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.
- Ovládání detailu: kliknutí na nadpis Cukry nebo tlačítko +/− přepne detail.
- Stav detailu zůstává zachovaný při změně kapitoly.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

**Tag:** 🔵 `water`

- Nadpis: `Voda`.
- Téma: voda; strana: vpravo.
- Detailní text: „Voda proudí do listů, ochlazuje korunu odparem a pomáhá udržovat listy zavodněné.“
- Vstup výpočtu: `voda`.
- Hodnota: spotřeba vody v `l/h`, zobrazena na jedno desetinné místo.
- Ovládání: spodní ukazatel nastavuje dostupný přísun vody podle společného pravidla oken kapitoly.
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
