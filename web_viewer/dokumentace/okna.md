---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Nahrazeno prostorové ukotvení statickými okny bez pohybu a spojnic ke stromu.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Popsán vzhled a rozmístění bloků Fotosyntézy podle Untitled.svg.
---

# Okna

Definice: [element_ui_okna_obsah.js](../okna/element_ui_okna_obsah.js), seznam `photosynthesis`.

Společné chování: [Statická okna](#statická-okna).

## Statická okna

- Okna mají pevnou polohu v rozhraní podle podkladu.
- Při otáčení, přiblížení nebo posunu kamery ani při změnách stromu se nehýbou.
- Jejich poloha ani viditelnost nezávisí na projekci bodů stromu.
- Ke stromu nevedou spojovací linky; barevný svislý tah je součástí okna.
- Změna hodnot nebo zobrazení detailu neposouvá okno ani okolní bloky.
- Okna nemají animaci přesunu, roztažení ani prodlužování tahu.
- Související element určuje význam a reakci na ovládání, nikoli prostorové ukotvení.

## Vzhled podle podkladu

- Podklad: [Untitled.svg](../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Rozložení kapitoly Fotosyntéza: dominantní blok vlevo dole; O₂, CO₂, Cukry a Voda ve svislém sloupci vpravo v tomto pořadí.
- Střed zůstává volný pro strom; prázdné pozadí podkladu neurčuje změnu scény.
- Bloky nemají výplň, obrys ani zaoblený rámeček.
- Vlevo od každého bloku je nepravidelný svislý barevný tah podle podkladu.
- Barvy tahů a hodnot: Fotosyntéza žlutá, O₂ světle modrá, CO₂ červenooranžová, Cukry fialová, Voda modrá.
- Nadpisy používají Nohemi Regular; v podkladu mají menší bloky přibližně 53 px.
- Hodnota je přímo pod nadpisem, zvýrazněná barvou tématu; drobná jednotka stojí vedle čísla.
- Zapnutý vzorec je pod hodnotou, drobný a kompaktní; nahrazuje dosavadní umístění hned pod nadpisem.
- Vysvětlující text se rozkládá vpravo vedle bloku, jak ukazují Cukry a Voda.
- Čísla 62 % a 2,4 g/min i pracovní odstavce v SVG jsou ukázkové; výsledky a jednotky musí odpovídat veličině.
- Vzhled doplňuje [statické chování](#statická-okna); původní pohyblivá okna jsou nahrazena.
- Rozložení na úzkých displejích podklad neurčuje.

#### Fotosyntéza

- Záznam: `fotosynteza`, text v poli `text`.
- Umístění: vlevo dole podle [podkladu](#vzhled-podle-podkladu).
- Nadpis Fotosyntéza je dominantní, tučný; v podkladu přibližně 92 px.
- Pod nadpisem je drobný popisek „aktivita“ a velká žlutá hodnota v procentech.
- Hodnota: aktivita fotosyntézy, výpočet `activity`.

#### Cukry

- Záznam: `cukry`, popisek v poli `popis`.
- Umístění: vpravo pod CO₂.
- Hodnota: tvorba glukózy, výpočet `glucoseGramsPerMinute`.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

- Záznam: `voda`, text v poli `text`.
- Umístění: vpravo pod Cukry, poslední blok sloupce.
- Ovládání: přísun vody, posuvník `sliderTreeWater` z [index.html](../index.html).
- Související element: [Voda linka](elementy.md#voda-linka).

#### CO₂

- Záznam: `co2`, text v poli `text`.
- Umístění: vpravo pod O₂, nad Cukry.

#### O₂

- Záznam: `kyslik`, text v poli `text`.
- Umístění: vpravo, první blok sloupce pod navigací.

## Technické souvislosti

- Současná implementace: [tree_annotations.js](../okna/tree_annotations.js); přechod na pevné rozložení čeká v [Z003](zmeny.md#z003--ui-podle-svg).
- Hodnoty počítá [tree_ecology.js](../ekologie/tree_ecology.js).
- Technický přehled: [Architektura oken](architektura_oken.md).

[Zpět na obsah](architektura_obsahu.md)
