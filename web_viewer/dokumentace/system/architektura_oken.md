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

# Architektura oken

## Definice

- Chování a obsah určují [Okna](../moje/okna.md), vizuální pravidla [Vzhled oken](../moje/vzhled_oken.md).
- Cesty ke kódu jsou uvedené od složky `web_viewer`.

### Obsah

- `okna/element_ui_okna_obsah.js` obsahuje záznamy v seznamech `photosynthesis` a `transpiration`.
- `pruvodceTranspiraci` ve stejném obsahovém modulu drží viditelné vysvětlení, názvy kroků, legendu a instrukci; `shrnuti` v záznamu okna se vykresluje mimo skrývaný detail.
- Záznam určuje ID, nadpis, téma, stranu, text, výpočet, ovládání a výchozí otevření detailu.
- `zobrazitVzorec` a `zobrazitHodnotu` zapínají přehled vstupů a výslednou hodnotu.

- Obsah obou kapitol vytváří stejný `configuredCard` z definic; `kapitoly/chapters.js` aktualizuje živé výstupy. Transpirace nemá vlastní HTML bloky oken.
- Průvodce kapitoly zobrazuje stálé schéma cesty vody; Teplota zapíná živé porovnání teplot v detailu.

### Rozložení

- `okna/tree_annotations.js` vytváří bloky, přepíná detaily a přebírá ovládací prvky s jejich událostmi.
- `okna/element_ui_okna_vzhled.css` určuje pevné pozice podle ID a společného příznaku hlavního okna, rozměry, písmo a barvy.
- `okna/tree_annotations.css` obsahuje společný základ bloků kapitol.
- Rozložení pracuje v souřadnicích rozhraní; aktualizace za snímek obsluhuje ovládání období a synchronizaci zvýraznění s aktivní kapitolou.
- `kapitoly/chapters.js` určuje pořadí a přepínání kapitol; `kapitoly/chapters.css` vzhled navigace.

### Zvýraznění elementů

- `okna/tree_annotations.js` předává tag tématu a stav otevření přes `setElementHighlight` v `kapitoly/chapters.js`.
- Změna detailu přepíná zvýraznění přímo v obsluze události; aktivní kapitola omezuje zvýraznění na viditelná okna.
- `index.html` mapuje tagy `water` a `sugar` na samostatné uniformy `uSelected` materiálů linek; vykreslení obsluhuje `vykreslovani/water_brush.js`.
- Zvýraznění se agreguje podle tagu pouze z oken aktivní kapitoly; více otevřených oken se stejným tagem se nepřepisuje. Voda reaguje také v Transpiraci, glukóza zůstává u Fotosyntézy.
- Chování určují [Voda linka](../moje/elementy.md#voda-linka) a [Glukóza linka](../moje/elementy.md#glukóza-linka).

## Hodnoty

### Zdroje

- `ekologie/tree_ecology.js` poskytuje živé hodnoty modelu.
- `ekologie/tree_ecology_vzorce.js` obsahuje společné výpočty a jejich vstupy.
- `okna/element_ui_okna_veliciny.js` určuje popisky, témata, jednotky a formát čísel.
- Fotosyntéza používá `activity`, Cukry `glucoseGramsPerMinute` a posuvník Vody `sliderTreeWater`.
- O₂ a CO₂ mají textové detaily bez samostatného číselného výstupu; čísla ze SVG jsou pouze ukázková.

### Vstupy výpočtu

- `vzorecText` definuje čitelný vztah pro Transpiraci včetně minima, převodu výkonu a rozdílu teplot; neprochází násobícím rozpisem Fotosyntézy. Výpočty dál poskytuje původní ekologický model.

- `vstupyVzorce` rozepisuje mezivýpočty na základní vstupy bez živých čísel uvnitř názvů.
- `veVzorci: false` skrývá technické přepočty a normalizaci; barevný řádek není úplný matematický vzorec.
- `activeLeafArea` zahrnuje aktivní plochu listů a do tvorby cukrů vstupuje pouze jednou.
- `photosynthesisEfficiency` zahrnuje světlo, vodu, CO₂ a teplotu.

## Kontroly

- `okna/element_ui_okna_kontrola.js` při načtení ověřuje záznamy oken, jedinečná ID, ovladače a definice výpočtů.
- Každý vstup musí mít číselný zdroj, popisek a platné téma; kontrola zachytí kruhové odkazy.
- Chybné záznamy se přeskočí a chyba se vypíše do konzole pouze jednou.
- Neplatný číselný výsledek se zobrazí jako `—`.
- `testy/test_ui_okna_kontrola.mjs` kontroluje definice bez prohlížeče, včetně spuštění bez geometrie stromu.

## Rozšíření

- Nové okno potřebuje záznam v kapitole a pevnou pozici v CSS.
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
