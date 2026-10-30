# Okna

Definice: [element_ui_okna_obsah.js](../okna/element_ui_okna_obsah.js), seznam `photosynthesis`.

Společný vzhled a fungování: [Okna u stromu](../FUNKCE/okna_u_stromu.md).

#### Fotosyntéza

- Záznam: `fotosynteza`, text v poli `text`.
- Umístění: vlevo u horní části koruny.
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
- Umístění: vlevo u spodní části koruny.
- Ovládání: přísun vody, posuvník `sliderTreeWater` z [index.html](../index.html).
- Napojení: [Voda linka](elementy.md#voda-linka).
- Bod linky: u kmene ve spodní části koruny.

#### CO₂

- Záznam: `co2`, text v poli `text`.
- Umístění: vpravo v polovině koruny, nad Cukry.
- Bod linky: u okraje koruny, dál od středu.

#### O₂

- Záznam: `kyslik`, text v poli `text`.
- Umístění: vpravo u horní části koruny.
- Bod linky: horní část koruny, přibližně v 88 % výšky stromu.

## Napojení

- Konce linek sledují své body při otáčení kamery.
- Popisek „Napojení“ určuje související element.
- Popisek „Bod linky“ určuje konkrétní místo připojení.
- Souřadnice určuje `getAnchors` v [index.html](../index.html).
- Rozmístění a linky řídí [tree_annotations.js](../okna/tree_annotations.js).
- Hodnoty počítá [tree_ecology.js](../ekologie/tree_ecology.js).

[Zpět na obsah](architektura_obsahu.md)
