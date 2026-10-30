---
history:
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

## Rozložení

- Definice: [Statická okna](okna.md#statická-okna) a [Vzhled podle podkladu](okna.md#vzhled-podle-podkladu).
- `okna/element_ui_okna_obsah.js` určuje ID, téma, text, stranu, výpočet a výchozí otevření detailů.
- `okna/tree_annotations.js` vytváří bloky a přesouvá původní ovládání, aby zachovalo své události.
- `okna/element_ui_okna_vzhled.css` určuje pevné souřadnice podle ID okna, rozměry a typografii.
- Rozložení nevolá projekci bodů stromu; nevytváří spojnice a nezávisí na kameře.
- Aktualizace za snímek obsluhuje pouze ovládání období, nikoli rozmístění oken.
- Hodnota je pod nadpisem, vzorec pod hodnotou; podrobnosti mají samostatnou vyhrazenou plochu.
- Kliknutí mění viditelnost a přístupnost detailu; geometrie bloku i barevný tah zůstávají pevné.
- Barvy, písmo a úzké rozložení sdílí CSS; dolní indexy dědí písmo nadpisu.
- `kapitoly/chapters.css` určuje vodorovnou navigaci; pořadí kapitol obsahuje `kapitoly/chapters.js`.
- Stav implementace: [Z003](zmeny.md#z003--ui-podle-svg).

## Hodnoty

- `okna/element_ui_okna_veliciny.js` převádí výpočetní názvy na popisky, barvy, jednotky a formát čísel.
- `vstupyVzorce` rozepisuje mezivýpočty na jejich základní vstupy.
- `veVzorci: false` skrývá technické přepočty bez změny výsledku.
- `ekologie/tree_ecology_vzorce.js` určuje společné vzorce; `ekologie/tree_ecology.js` počítá hodnoty stromu.
- `activeLeafArea` zahrnuje aktivní plochu listů; tvorba cukrů ji používá pouze jednou.
- `photosynthesisEfficiency` zahrnuje světlo, vodu, CO₂ a teplotu.
- Nové okno potřebuje záznam v příslušné kapitole a pevnou pozici v CSS; bod stromu nepotřebuje.
- Nová veličina potřebuje skutečný výpočet a záznam v převodníku.
- Cesty ke kódu jsou uvedené od složky `web_viewer`.

## Kontroly

Kontroly zajišťuje `okna/element_ui_okna_kontrola.js`.

- Při načtení se před vytvářením oken zkontrolují všechny záznamy a definice výpočtů.
- Každý vstup musí mít zdroj hodnoty.
- Každý zobrazovaný vstup musí mít popisek a platné barevné téma.
- Kruhový odkaz mezi vzorci se zachytí před jejich rozepisováním.
- Výsledky se při aktualizaci zkontrolují na platné konečné číslo.
- Místo neplatného čísla se zobrazí `—`.
- Chybová zpráva označí konkrétní veličinu nebo okno.
- Nové záznamy se zahrnou do kontroly automaticky.
- Kontrola hlídá také jedinečná ID a připojené ovladače; bod stromu ověřuje jen u starších záznamů, které jej výslovně obsahují.
- Chybné záznamy oken se přeskočí.
- Chyby se vypisují do vývojářské konzole.
- Stejná chyba se nevypisuje každý snímek znovu.
- Kontrolní funkce ověřuje skript `testy/test_ui_okna_kontrola.mjs` bez prohlížeče.

Barevný řádek označujeme jako vstupy výpočtu.
Řádek skrývá technické přepočty a normalizaci.
Nejde tedy o úplný matematický vzorec.
