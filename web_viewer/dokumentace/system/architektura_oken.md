---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Odstraněn doplňkový řádek s porovnáním teplot v detailu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zjednodušena komponenta na nezávislý blok údajů a detailu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Sjednoceny společné části oken a datové varianty jejich vzhledu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Opraven pád vykreslování při chybějícím výstupu a obnovení modulů po změně oken.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Odstraněn Průtok a doplněny vzorce i šablona číselného okna podle Fotosyntézy.

---

# Architektura oken

## Definice

- Chování a obsah určují [Okna](../moje/okna.md), vizuální pravidla [Vzhled oken](../moje/vzhled_oken.md).
- Cesty ke kódu jsou uvedené od složky `web_viewer`.

### Obsah

- `okna/element_ui_okna_obsah.js` obsahuje záznamy oken Fotosyntézy, Transpirace a Semenace a texty průvodců.
- Záznam určuje ID, nadpis, téma, stranu, text, výpočet, ovládání a výchozí otevření detailu.
- `zobrazitVzorec` a `zobrazitHodnotu` zapínají přehled vstupů a výslednou hodnotu.

- Okna z definic vytváří `configuredCard`. Živé výstupy aktualizují `kapitoly/chapters.js` a u druhých údajů Fotosyntézy `okna/tree_annotations.js`.

### Rozložení

- Hlavní okna používají stejnou komponentu s variantou samostatného detailu pod oknem podle [šablony hlavního okna](../moje/vzhled_oken.md#šablona-hlavního-okna); příznak `hlavni` určuje vzhled, `otevrene` výchozí stav.

- Komponenta má dva nezávislé bloky. `.element-ui-readout` skládá nadpis a údaje. `.annotation-reveal` drží vysvětlení a ve Fotosyntéze také vzorec. V pravých oknech Fotosyntézy se s detailem zobrazují i údaje, u Cukrů zůstávají údaje stále viditelné. Polohu jednotlivých variant určuje [Vzhled oken](../moje/vzhled_oken.md).

- Okno je společná komponenta vytvářená `configuredCard` a `createElementUiOkno`; nadpis, hodnota, vzorec a detail mají jednu strukturu a společné styly pro všechny záznamy Fotosyntézy a Transpirace.
- Typografii a odstupy upravuj v `okna/element_ui_okna_vzhled.css`: `--ui-heading-size`, `--ui-main-heading-size`, `--ui-value-size`, `--ui-main-value-size`, `--ui-formula-size`, `--ui-column-gap`, `--ui-toggle-size` a `--ui-toggle-gap`. Změna sdílené proměnné platí pro všechna okna příslušné role; úzká obrazovka používá společnou sadu hodnot.
- `viditelnyPrepinac: true` v záznamu zapíná variantu +/− a přepínání kliknutím na nadpis; používají ji obě kapitoly. Bez něj zůstává plocha nad nadpisem. CSS používá `data-toggle-visible`, nikoli název kapitoly.
- `vzorecText` volí variantu skutečné rovnice přes `data-formula-kind="equation"`; přehled vstupů používá stejnou část komponenty s variantou `inputs`. Obě varianty se u oken s viditelným přepínačem zalamují a zůstávají viditelné i na úzké obrazovce.
- Použití: do seznamu kapitoly přidej záznam `{ id, nadpis, tema, strana, vypocet, zobrazitVzorec, zobrazitHodnotu, text }`; volitelně `hlavni`, `otevrene`, `vzorecText` a `viditelnyPrepinac`. Téma určuje barvu, převodník jednotku a formát hodnoty. Pozice patří do rozložení kapitoly, velikost nadpisu do společného stylu.
- Přenos vyžaduje renderer, společné CSS, převodník veličin a validátor; renderer přijímá model a callback zvýraznění. Průvodce a pozice konkrétní kapitoly nejsou přenositelnou částí okna.

- `okna/tree_annotations.js` vytváří bloky, přepíná detaily a přebírá ovládací prvky s jejich událostmi.
- `okna/element_ui_okna_vzhled.css` určuje rozložení kapitol, rozměry, písmo a barvy. Fotosyntéza vkládá levé okno pod kontextový text a pravá okna skládá do samostatného sloupce.
- `okna/tree_annotations.css` obsahuje společný základ bloků kapitol.
- Rozložení pracuje v souřadnicích rozhraní; aktualizace za snímek obsluhuje ovládání období a synchronizaci zvýraznění s aktivní kapitolou.
- `kapitoly/chapters.js` určuje pořadí a přepínání kapitol; `kapitoly/chapters.css` vzhled navigace.

### Zvýraznění elementů

- `PhotolysisSystem` přijímá volitelnou `waterGroup`; částice H₂O vznikají v `getReactionPoint` a sdílí `_updateGasScale` i zvýraznění tagem `water` s ostatními plyny. Emisi řídí odpar přes `setTranspiration`, nikoli kolize fotonů. Skupina je oddělená od fotosyntézy a viditelná pouze v Transpiraci.

- `okna/tree_annotations.js` předává zvýraznění podle tématu při otevření detailu nebo při najetí na plochu okna. Stav najetí využívá také styl tlačítka.
- Změna detailu přepíná zvýraznění přímo v obsluze události; aktivní kapitola omezuje zvýraznění na viditelná okna.
- `index.html` mapuje tagy `water` a `sugar` na samostatné uniformy `uSelected` materiálů linek; vykreslení obsluhuje `vykreslovani/water_brush.js`.
- Zvýraznění se agreguje podle tagu pouze z oken aktivní kapitoly; více otevřených oken se stejným tagem se nepřepisuje. Voda reaguje také v Transpiraci, glukóza zůstává u Fotosyntézy.
- Chování určují [Voda linka](../moje/elementy.md#voda-linka) a [Glukóza linka](../moje/elementy.md#glukóza-linka).

## Hodnoty

### Zdroje

- `ekologie/tree_ecology.js` poskytuje živé hodnoty modelu.
- `ekologie/tree_ecology_vzorce.js` obsahuje společné výpočty a jejich vstupy.
- `okna/element_ui_okna_veliciny.js` určuje popisky, témata, jednotky a formát čísel.
- V oknech Fotosyntézy se vykreslují dva údaje na okno na oddělených kolejích včetně produkce a spotřeby O₂, CO₂ a cukrů. Posuvník světla volá `model.setLightAvailability`; červené pohyblivé konce oken se zásobou fungují jako horní strop přes `model.sugarProductionCap` (Cukry) a `model.waterAvailabilityCap` (Voda).
- Volitelný záznam `zasoba` rozšíří okno o kruhový ukazatel zásoby s plněním zleva doprava a směrovou šipkou. Voda čte vlastnosti modelu podle položek `hodnota` a `maximum`. Varianta `zdroj: 'cukry'` přebírá aktuální zásobu a kapacitu ze společné sezónní bilance. Podíl určuje vodorovné plnění kruhu a množství se zobrazuje v zadané jednotce.

### Vstupy výpočtu

- `vzorecText` definuje čitelný vztah pro Transpiraci včetně minima, převodu výkonu a rozdílu teplot; neprochází násobícím rozpisem Fotosyntézy. Výpočty dál poskytuje původní ekologický model.

- `vstupyVzorce` rozepisuje mezivýpočty na základní vstupy bez živých čísel uvnitř názvů.
- `veVzorci: false` skrývá technické přepočty a normalizaci; barevný řádek není úplný matematický vzorec.
- `activeLeafArea` zahrnuje aktivní plochu listů a do tvorby cukrů vstupuje pouze jednou.
- `photosynthesisEfficiency` zahrnuje světlo, vodu, CO₂ a teplotu.

## Kontroly

- Aktualizace hodnot v `kapitoly/chapters.js` přeskočí chybějící výstup; jeho absence nesmí přerušit vykreslování scény.
- Při změně struktury oken obnov verze importů navazujících modulů od `index.html` po definice, převodník a validátor, aby se nekombinovaly staré a nové záznamy z cache.

- `okna/element_ui_okna_kontrola.js` při načtení ověřuje záznamy oken, jedinečná ID, ovladače a definice výpočtů.
- Každý vstup musí mít číselný zdroj, popisek a platné téma; kontrola zachytí kruhové odkazy.
- Chybné záznamy se přeskočí a chyba se vypíše do konzole pouze jednou.
- Neplatný číselný výsledek se zobrazí jako `—`.
- `testy/test_ui_okna_kontrola.mjs` kontroluje definice bez prohlížeče, včetně spuštění bez geometrie stromu.

## Rozšíření

- Nové okno potřebuje záznam v kapitole. Umístění přebírá z rozložení kapitoly.
- Nová veličina potřebuje skutečný zdroj hodnoty a záznam v převodníku.

[Stav implementace](../zmeny.md#z003--ui-podle-svg) · [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Technické oblasti mají nadpis `##`, jejich části `###`.
- Popisuj platné napojení modulů stručnými body; uživatelské chování sdílej odkazem na definici.
- Výsledky ověření a stav implementace eviduj v `zmeny.md`.
- Tuto část se šablonou ponechávej na konci.

```markdown
## Název oblasti

### Název části

- `cesta/modul.js` zajišťuje danou odpovědnost.
- Chování určuje [Definice](../soubor.md#kotva).
```
