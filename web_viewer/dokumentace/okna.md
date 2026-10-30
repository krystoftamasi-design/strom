---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Popsán vzhled a rozmístění bloků Fotosyntézy podle Untitled.svg.
---

# Okna

Definice: [element_ui_okna_obsah.js](../okna/element_ui_okna_obsah.js), seznam `photosynthesis`.

Společný vzhled a fungování: [Okna u stromu](../FUNKCE/okna_u_stromu.md).

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
- Podklad určuje vzhled; dosavadní rozbalování a napojení na strom platí dál, pokud je zadání výslovně nemění.
- Rozložení na úzkých displejích podklad neurčuje.

#### Fotosyntéza

- Záznam: `fotosynteza`, text v poli `text`.
- Umístění: vlevo dole podle [podkladu](#vzhled-podle-podkladu).
- Nadpis Fotosyntéza je dominantní, tučný; v podkladu přibližně 92 px.
- Pod nadpisem je drobný popisek „aktivita“ a velká žlutá hodnota v procentech.
- Hodnota: aktivita fotosyntézy, výpočet `activity`.
- Bod linky: listy v horní části koruny.

#### Cukry

- Záznam: `cukry`, popisek v poli `popis`.
- Umístění: vpravo pod CO₂.
- Hodnota: tvorba glukózy, výpočet `glucoseGramsPerMinute`.
- Napojení: [Glukóza linka](elementy.md#glukóza-linka).
- Bod linky: uprostřed glukózové trasy na kmeni.

#### Voda

- Záznam: `voda`, text v poli `text`.
- Umístění: vpravo pod Cukry, poslední blok sloupce.
- Ovládání: přísun vody, posuvník `sliderTreeWater` z [index.html](../index.html).
- Napojení: [Voda linka](elementy.md#voda-linka).
- Bod linky: u kmene ve spodní části koruny.

#### CO₂

- Záznam: `co2`, text v poli `text`.
- Umístění: vpravo pod O₂, nad Cukry.
- Bod linky: u okraje koruny, dál od středu.

#### O₂

- Záznam: `kyslik`, text v poli `text`.
- Umístění: vpravo, první blok sloupce pod navigací.
- Bod linky: horní část koruny, přibližně v 88 % výšky stromu.

## Napojení

- Konce linek sledují své body při otáčení kamery.
- Popisek „Napojení“ určuje související element.
- Popisek „Bod linky“ určuje konkrétní místo připojení.
- Souřadnice určuje `getAnchors` v [index.html](../index.html).
- Rozmístění a linky řídí [tree_annotations.js](../okna/tree_annotations.js).
- Hodnoty počítá [tree_ecology.js](../ekologie/tree_ecology.js).

[Zpět na obsah](architektura_obsahu.md)
