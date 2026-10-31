---
history:
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

#### Fotosyntéza

**Tag:** 🟡 `light`

- Nadpis: `Fotosyntéza`.
- Téma: světlo; strana: vlevo; hlavní okno.
- Detailní text: „Listy využívají světlo, vodu a CO₂ k tvorbě cukrů; při fotosyntéze se uvolňuje O₂.“
- Hodnota: `activity`, zobrazená v procentech.
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
- Výchozí stav detailu: otevřený.
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
- Výchozí stav detailu: otevřený.
- Související element: [Voda linka](elementy.md#voda-linka).

## Kapitola Transpirace

### Okna

- Okna používají [šablonu Fotosyntézy](vzhled_oken.md#šablona-jednoho-okna-podle-fotosyntézy); samostatný [průvodce](texty.md#průvodce-transpirací) zůstává mimo ně.
- Stav detailů zůstává zachovaný při změně kapitoly.

#### Transpirace

**Tag:** 🔵 `water`

- Nadpis: `Transpirace`; role: hlavní okno; strana: vlevo.
- Detailní text: „Voda se odpařuje převážně průduchy listů. Odpar pomáhá táhnout vodu od kořenů a spotřebovává teplo. Za světla bývá vyšší; nedostatek vody vede k omezení ztrát průduchy.“
- Hodnota: odpařená voda v `l/h`, jedno desetinné místo.
- Vzorec: `min(základ × listy × světlo × voda; spotřeba)`, viditelný pod hodnotou.
- Vstupy výpočtu: základ odparu, podíl listů, světlo, zavodnění a mez spotřeby; význam jednotek určuje [Význam vzorců](#význam-vzorců).
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Příjem vody

**Tag:** 🔵 `water`

- Nadpis: `Příjem vody`; role: tematické okno; strana: vpravo nahoře.
- Detailní text: „Kořeny doplňují zásobu vody ve stromu. Příjem omezuje dostupná voda a sezónní maximum kořenů; nemusí být stejný jako okamžitý odpar.“
- Hodnota: příjem kořeny v `l/h`, jedno desetinné místo.
- Vzorec: `min(přísun; limit kořenů)`, viditelný pod hodnotou.
- Vstupy výpočtu: dostupný přísun vody a sezónní kapacita kořenů upravená jejich stavem.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Chlazení

**Tag:** 🌡️ `temperature`

- Nadpis: `Chlazení`; role: tematické okno; strana: vpravo, druhé shora.
- Detailní text: „Odpařování vody spotřebovává teplo. Chladicí výkon je fyzikální odhad, nikoli změna teploty; při omezení odparu klesá.“
- Hodnota: chladicí výkon v `kW`, dvě desetinná místa.
- Vzorec: `odpar × 2450 / 3600`, viditelný pod hodnotou.
- Vstupy výpočtu: odpar v `l/h`, modelové skupenské teplo 2450 kJ/kg a převod hodin na sekundy.
- Ovládání detailu: kliknutí na nadpis nebo viditelné tlačítko +/− vedle něj.
- Výchozí stav detailu: zavřený.

#### Teplota

**Tag:** 🌡️ `temperature`

- Nadpis: `Teplota`; role: tematické okno; strana: vpravo, třetí shora.
- Detailní text: „Ve dne odpar ochlazuje okolí koruny; v noci olistěná koruna omezuje vyzařování tepla a u ní může být mírně tepleji. Základem jsou normály ČHMÚ 1991–2020. Denní kolísání a teplá či chladná období jsou výukový odhad, nikoli měření nebo předpověď počasí.“
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

## Související dokumenty

- [Vzhled oken](vzhled_oken.md)

- [Technická architektura](../system/architektura_oken.md)
- [Stav změn](../zmeny.md)
- [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Kapitola má úroveň `##`, oblast `###` a konkrétní okno `####`.
- Používej šablonu okna odvozenou z Fotosyntézy: tag → nadpis a role → stručné shrnutí → detail → hodnota → vzorec a vstupy → ovládání a výchozí stav → související element.
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
