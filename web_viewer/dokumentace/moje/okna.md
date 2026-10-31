---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura Transpirace, její okna a elementy podle vzoru Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Převedena kapitola Transpirace na společný vzhled oken Fotosyntézy.
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Zkráceny texty oken Fotosyntéza, Cukry, Voda, CO₂ a O₂ na jeden odstavec.
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Doplněny výukové texty do oken Fotosyntéza, Cukry, Voda, CO₂ a O₂.
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

- Každé okno má jednu hlavní veličinu, stručný vlastní detail a samostatný stav otevření; stav se zachovává při změně kapitoly.
- Kliknutí na nadpis přepne detail. Výchozí detaily Příjmu vody a Průtoku jsou otevřené, ostatní zavřené.

#### Transpirace

**Tag:** 🔵 `water`

- Hlavní okno vlevo dole; hodnota: odpařená voda v `l/h`, jedno desetinné místo.
- Detail: odpařování převážně průduchy táhne vodu od kořenů a spotřebovává teplo; za světla bývá vyšší, nedostatek vody vede k omezení ztrát průduchy.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Příjem vody

**Tag:** 🔵 `water`

- Okno vpravo nahoře; hodnota: příjem kořeny v `l/h`, jedno desetinné místo.
- Detail: kořeny doplňují zásobu vody; příjem omezuje dostupnost vody a sezónní maximum, nemusí odpovídat okamžitému odparu.
- Související element: [Voda linka](elementy.md#voda-linka).

#### Průtok

**Tag:** 🔵 `water`

- Druhé okno vpravo; hodnota: odhad toku ze zásoby do koruny v `l/h`, jedno desetinné místo.
- Detail: xylém vede vodu do koruny; průtok zahrnuje odpar i drobné ostatní ztráty.
- Související elementy: [Voda linka](elementy.md#voda-linka), [Cesta vody](elementy.md#cesta-vody).

#### Chlazení

**Tag:** 🌡️ `temperature`

- Třetí okno vpravo; hodnota: chladicí výkon v `kW`, dvě desetinná místa.
- Detail: odpařování spotřebovává teplo; výkon klesá při omezení odparu a není změnou teploty.

#### Teplota

**Tag:** 🌡️ `temperature`

- Čtvrté okno vpravo; hodnota: teplota u koruny ve `°C`, jedno desetinné místo.
- Detail obsahuje živou teplotu mimo strom a podepsaný rozdíl teplot u koruny a mimo strom.
- Vysvětlení: denní ochlazování odparem, noční omezení vyzařování olistěnou korunou a možný mírně teplejší vzduch u ní.
- Základem jsou normály ČHMÚ 1991–2020; kolísání a teplá či chladná období jsou výukový odhad, nikoli měření nebo předpověď počasí.

## Související dokumenty

- [Vzhled oken](vzhled_oken.md)

- [Technická architektura](../system/architektura_oken.md)
- [Stav změn](../zmeny.md)
- [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Kapitola má úroveň `##`, oblast `###` a konkrétní okno `####`.
- U okna uváděj tag a stručné body s obsahem, hodnotami, ovládáním a stavem detailu.
- Ovládání okna a uchování stavu popisuj zde; reakci souvisejícího elementu definuj pouze v `elementy.md` a odkaž na ni.
- Uváděj pouze položky, které se daného okna týkají.
- Odkazy na související dokumenty ponechávej před těmito pravidly.

```markdown
## Kapitola Název

### Okna

#### Název okna

**Tag:** 🔵 `tag`

- Nadpis: `Název`.
- Obsah: popis obsahu okna.
- Hodnota: veličina a jednotka.
- Ovládání detailu: způsob otevření a zavření.
- Výchozí stav detailu: otevřený nebo zavřený.
- Související element: [Název](elementy.md#kotva).
```
