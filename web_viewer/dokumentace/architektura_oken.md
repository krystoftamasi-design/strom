---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Odděleny odkazy na obsah a samostatný vzhled oken.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Sloučeny technické informace do pořadí definice, hodnoty, kontroly a rozšíření.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Aktualizován technický přehled podle implementovaných statických oken.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Odstraněna koncová mezera při kontrole dokumentu.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Oddělena cílová statická architektura od dosavadního pohyblivého kódu.
---

# Architektura oken

## Definice

- Chování a obsah určují [Okna](okna.md), vizuální pravidla [Vzhled oken](vzhled_oken.md).
- Cesty ke kódu jsou uvedené od složky `web_viewer`.

### Obsah

- `okna/element_ui_okna_obsah.js` obsahuje záznamy v seznamu `photosynthesis`.
- Záznam určuje ID, nadpis, téma, stranu, text, výpočet, ovládání a výchozí otevření detailu.
- `zobrazitVzorec` a `zobrazitHodnotu` zapínají přehled vstupů a výslednou hodnotu.

### Rozložení

- `okna/tree_annotations.js` vytváří bloky, přepíná detaily a přebírá ovládací prvky s jejich událostmi.
- `okna/element_ui_okna_vzhled.css` určuje pevné pozice podle ID, rozměry, písmo a barvy.
- `okna/tree_annotations.css` obsahuje společný základ bloků kapitol.
- Rozložení pracuje v souřadnicích rozhraní; aktualizace za snímek obsluhuje pouze ovládání období.
- `kapitoly/chapters.js` určuje pořadí a přepínání kapitol; `kapitoly/chapters.css` vzhled navigace.

## Hodnoty

### Zdroje

- `ekologie/tree_ecology.js` poskytuje živé hodnoty modelu.
- `ekologie/tree_ecology_vzorce.js` obsahuje společné výpočty a jejich vstupy.
- `okna/element_ui_okna_veliciny.js` určuje popisky, témata, jednotky a formát čísel.
- Fotosyntéza používá `activity`, Cukry `glucoseGramsPerMinute` a posuvník Vody `sliderTreeWater`.
- O₂ a CO₂ mají textové detaily bez samostatného číselného výstupu; čísla ze SVG jsou pouze ukázková.

### Vstupy výpočtu

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

[Stav implementace](zmeny.md#z003--ui-podle-svg) · [Obsah](architektura_obsahu.md)
