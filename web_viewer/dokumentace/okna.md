---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Opraven název konkrétního okna a ověřeny odkazy.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Rozlišena kotva kapitoly a jednotlivého okna Fotosyntéza.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Vyčištěny definice oken a uspořádány podle chování, vzhledu a pořadí v UI.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Popsána implementace pevného rozložení a zobrazení detailů na menších displejích.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Nahrazeno prostorové ukotvení statickými okny bez pohybu a spojnic ke stromu.
---

# Okna

## Statická okna

- Okna mají pevnou polohu a rozměry v rozhraní, nezávisle na stromu a kameře.
- Kliknutí na nadpis zobrazí nebo skryje detail ve vyhrazeném prostoru.
- Změna hodnot a zobrazení detailu neposouvají bloky ani nemění délku barevného tahu.
- Okna nemají pohybové animace ani spojnice ke stromu.
- Při vstupu jsou otevřené detaily Cukrů a Vody; ostatní jsou skryté.

## Vzhled podle podkladu

### Rozložení

- Podklad: [Untitled.svg](../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Fotosyntéza je vlevo dole; vpravo následují shora O₂, CO₂, Cukry a Voda.
- Střed zůstává volný pro strom.
- Bloky jsou bez výplně a rámečku; vlevo mají nepravidelný svislý tah.
- Hodnota s jednotkou je pod nadpisem, přehled vstupů výpočtu pod hodnotou a detail vpravo vedle nich.
- Do šířky 700 px zůstávají dva pevné sloupce; detaily mají místo pod nadpisem s vlastním posuvem a přehled vstupů je skrytý.

### Písmo

- Nadpisy používají Nohemi Regular, přibližně 53 px na referenčním plátně.
- Fotosyntéza má dominantní tučný nadpis přibližně 92 px.
- Popisky, jednotky a detaily používají Satoshi Light.
- Přehled vstupů používá drobné písmo Satoshi Medium; názvy vstupů se liší barvou.
- Hodnoty používají Nohemi a barvu příslušného tématu.

### Barvy

- Text je ve dne tmavý a v noci světlý.
- Barvy témat zůstávají stejné ve dne i v noci.
- Světlo a aktivita jsou žluté.
- Voda je modrá, kyslík světle modrý a CO₂ červenooranžový.
- Cukry jsou fialové, listy zelené, kořeny hnědé a teplota růžovočervená.

## Kapitola Fotosyntéza

### Okna

#### Fotosyntéza

- Umístění: vlevo dole.
- Hodnota: aktivita v procentech s popiskem „aktivita“.
- Detail: využití světla k tvorbě cukrů, uvolňování kyslíku a význam cukrů pro růst.

#### O₂

- Umístění: první blok pravého sloupce pod navigací.
- Detail: uvolňování kyslíku při fotosyntéze.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

- Umístění: vpravo pod O₂.
- Detail: srovnání s předindustriální koncentrací a vliv CO₂ na fotosyntézu.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

- Umístění: vpravo pod CO₂.
- Hodnota: tvorba glukózy v g/min.
- Detail: „Tvorba cukrů ≈ glukóza“.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

- Umístění: poslední blok pravého sloupce pod Cukry.
- Ovládání: posuvník přísunu vody.
- Detail: vliv nedostatku vody na průduchy, přísun CO₂ a fotosyntézu.
- Související element: [Voda linka](elementy.md#voda-linka).

## Související dokumenty

- [Technická architektura](architektura_oken.md)
- [Stav změn](zmeny.md)
- [Obsah](architektura_obsahu.md)
