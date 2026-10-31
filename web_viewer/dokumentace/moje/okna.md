---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Odstraněn Průtok a doplněny vzorce i šablona číselného okna podle Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura Transpirace, její okna a elementy podle vzoru Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Převedena kapitola Transpirace na společný vzhled oken Fotosyntézy.

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

- Každé okno má viditelný vzorec pod hodnotou a jednu hlavní veličinu, stručný vlastní detail a samostatný stav otevření; stav se zachovává při změně kapitoly.
- Kliknutí na nadpis nebo viditelné tlačítko +/− přepne detail; všechny čtyři detaily je výchozím stavem zavřených.
- Krátká shrnutí jsou viditelná i při zavřeném detailu: Transpirace vysvětluje tah odparem, Příjem vody doplňování vody kořeny, Chlazení spotřebu tepla a Teplota srovnání u koruny a mimo strom.
- Zavřené okno nabízí „Otevřít vysvětlení +“; otevřené vodní téma odkazuje na zvýraznění modré linky. Teplotní témata označují otevřené vysvětlení bez tvrzení o prostorovém zvýraznění.
- Průvodní texty určuje [Průvodce Transpirací](texty.md#průvodce-transpirací).

#### Transpirace

**Tag:** 🔵 `water`

- Vzorec: `min(základ × listy × světlo × voda; spotřeba)`.
- Hlavní okno vlevo dole; hodnota: odpařená voda v `l/h`, jedno desetinné místo.
- Detail: odpařování převážně průduchy táhne vodu od kořenů a spotřebovává teplo; za světla bývá vyšší, nedostatek vody vede k omezení ztrát průduchy.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Příjem vody

**Tag:** 🔵 `water`

- Vzorec: `min(přísun; limit kořenů)`.
- Okno vpravo nahoře; hodnota: příjem kořeny v `l/h`, jedno desetinné místo.
- Detail: kořeny doplňují zásobu vody; příjem omezuje dostupnost vody a sezónní maximum, nemusí odpovídat okamžitému odparu.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Chlazení

**Tag:** 🌡️ `temperature`

- Vzorec: `odpar × 2450 / 3600`.
- Druhé okno vpravo; hodnota: chladicí výkon v `kW`, dvě desetinná místa.
- Detail: odpařování spotřebovává teplo; výkon klesá při omezení odparu a není změnou teploty.

#### Teplota

**Tag:** 🌡️ `temperature`

- Vzorec: `okolí − ochlazení + noční efekt`.
- Třetí okno vpravo; hodnota: teplota u koruny ve `°C`, jedno desetinné místo.
- Detail obsahuje živou teplotu mimo strom a podepsaný rozdíl teplot u koruny a mimo strom.
- Vysvětlení: denní ochlazování odparem, noční omezení vyzařování olistěnou korunou a možný mírně teplejší vzduch u ní.
- Základem jsou normály ČHMÚ 1991–2020; kolísání a teplá či chladná období jsou výukový odhad, nikoli měření nebo předpověď počasí.

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
