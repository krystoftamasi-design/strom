# Architektura obsahu

## ÚVOD

### Text

#### Nápis strom

Písmo Nohemi, umístění vlevo na střed výšky displeje, ve dne tmavý a v noci světlý.

### Okna

### Ovládací prvky

#### [Kapitoly](prvky.md#kapitoly)

## FOTOSYNTÉZA

### Text

#### Datum

- Vlevo nahoře zobrazuje datum
- Popisek i datum používají Satoshi a nemají pozadí.
- Ve dne je text tmavý a v noci světlý.

### Okna

Všech pět oken je definovaných v `okna/element_ui_okna_obsah.js` v seznamu `photosynthesis`.

#### Fotosyntéza

- Okno „Fotosyntéza“ vzniká ze záznamu `id: 'fotosynteza'`.
- Jeho text je v poli `text` stejného záznamu.
- Jeho hodnota používá výpočet `activity`.
- Je vlevo od stromu a spojovací linka vede k listům v horní části koruny.

#### Cukry

- Okno „Cukry“ vzniká ze záznamu `id: 'cukry'`.
- Jeho popisek je v poli `popis` stejného záznamu.
- Jeho hodnota používá výpočet `glucoseGramsPerMinute`.
- Je vpravo od stromu a spojovací linka vede k fialové glukózové lince na kmeni.

#### Voda

- Okno „Voda“ vzniká ze záznamu `id: 'voda'`.
- Jeho text je v poli `text` stejného záznamu.
- Přebírá posuvník `sliderTreeWater`, který je původně v `index.html`.
- Je vlevo od stromu a spojovací linka vede ke kmeni ve spodní části koruny.

#### CO₂

- Okno „CO₂“ vzniká ze záznamu `id: 'co2'`.
- Jeho text je v poli `text` stejného záznamu.
- Je na pravé straně stromu v polovině koruny, nad Cukry.
- Bod napojení linky je odsazený od středu směrem k okraji koruny.
- Spojovací linka vede od nadpisu ke svému bodu na stromu a sleduje ho při otáčení kamery.
- Poloha se posouvá podle místa na obrazovce a ostatních oken.

#### O₂

- Okno „O₂“ vzniká ze záznamu `id: 'kyslik'`.
- Jeho text je v poli `text` stejného záznamu.
- Je vpravo od stromu a spojovací linka vede do horní části koruny přibližně v 88 % výšky stromu.


### Ovládací prvky

#### [Manager](prvky.md#manager)

#### [Ovládání času](prvky.md#ovládání-času)

#### [Kapitoly](prvky.md#kapitoly)

## OSTATNÍ KAPITOLY.... to doplnime jeste 

## Pravidla dokumentu

- Před každou úpravou si přečti tato pravidla.
- Vycházej ze skutečného obsahu a chování webu.
- Neuváděj domněnky ani plánované prvky jako hotovou součást webu.
- Kapitola má nadpis druhé úrovně (`##`).
- Pod kapitolou jsou v tomto pořadí „Text“, „Okna“ a „Ovládací prvky“ jako nadpisy třetí úrovně (`###`).
- Názvy jednotlivých textů a oken mají nadpis čtvrté úrovně (`####`).
- Jednotlivá okna mají nadpis čtvrté úrovně (`####`) bez slova „Okno“.
- Do části „Text“ patří samostatné nápisy mimo okna.
- Názvy textů mají nadpis čtvrté úrovně (`####`) a pod ním krátký popis bez odrážky.
- Do části „Okna“ patří výhradně skutečná okna kolem stromu.
- Samostatné nápisy, například „strom“, patří do části „Text“.
- V části „Ovládací prvky“ jsou jen názvy prvků jako klikací nadpisy čtvrté úrovně (`####`).
- Každý nadpis odkazuje na popis prvku v `prvky.md`.
- Každý prvek je popsaný pouze jednou v `prvky.md`.
- Piš jen podstatné informace a stručně.
- Jednotlivá okna odděluj prázdnými řádky.

