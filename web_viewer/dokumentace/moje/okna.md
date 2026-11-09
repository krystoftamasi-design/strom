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
- Hlavní detail je pod údaji a výchozí otevřený; tematické detaily jsou výchozí zavřené, vpravo od údajů a na úzké obrazovce pod nimi.

#### Fotosyntéza

**Tag:** 🟡 `light`

- Nadpis: `Fotosyntéza`.
- Ovládání přívodu vody: posuvník se na webu nezobrazuje.
- Téma: světlo; strana: vlevo; hlavní okno.
- Detailní text: „Listy využívají světlo, vodu a CO₂ k tvorbě cukrů; při fotosyntéze se uvolňuje O₂.“
- Hodnota: `activity`, zobrazená v procentech.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: otevřený; detail je pod hlavními údaji.

#### O₂

**Tag:** 🔹 `oxygen`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „O₂ vzniká při štěpení vody a strom ho při fotosyntéze uvolňuje do vzduchu.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: produkce O₂ v `g/min`, zobrazena na jedno desetinné místo.
- Výchozí stav detailu: zavřený.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „CO₂ je vstupní látka fotosyntézy; průduchy regulují jeho příjem podle vody a podmínek prostředí.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: spotřeba CO₂ v `g/min`, zobrazena na jedno desetinné místo.
- Výchozí stav detailu: zavřený.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Detailní text: „Cukry ukládají energii ze světla a slouží jako palivo i stavební materiál pro růst stromu.“
- Hodnota: `glucoseGramsPerMinute`, jednotka `g/min`, jedno desetinné místo.
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
- Ovládání: vypnuté; posuvník se v okně nezobrazuje.
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

#### Vznik bukvic

- Nadpis: `Vznik bukvic`; role: tematické okno; strana: vpravo.
- Detail: „Vítr přenáší pyl. Bukvice dozrávají na podzim; bohatá úroda není každý rok.“
- Vazba na element: není určena; assety květů a bukvic dodá uživatel a jejich použití se upřesní.

#### Šíření semen

**Tag:** 🟤 `seeds`

- Nadpis: `Šíření semen`; role: tematické okno; strana: vpravo.
- Detail: „Bukvice padají poblíž stromu, živočichové část přenesou dál. Za generace se tak druh může šířit při změnách klimatu.“
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
