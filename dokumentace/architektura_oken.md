# Architektura oken

- `okna/element_ui_okna_obsah.js` obsahuje jeden záznam pro každé okno.
- Záznam určuje text, téma, stranu, bod stromu a zobrazovaný výpočet.
- `okna/element_ui_okna_vzhled.css` určuje vzhled, barvy a animace.
- Dočasné tlačítko v boční nabídce přepíná zavřené nadpisy na černou.
- Po rozkliknutí se nadpis vrátí do barvy svého tématu.
- Dolní indexy v nadpisech používají stejné písmo jako zbytek nadpisu.
- Proměnné `--ui-font-*`, `--ui-text-*`, `--ui-heading-*`, `--ui-formula-*` a `--ui-value-*` určují společné písmo všech oken.
- Nadpisy mají společný styl Nohemi 27 px s tloušťkou 500.
- Texty, popisky a jednotky mají společný styl Satoshi 16 px s tloušťkou 300.
- Všechny vzorce používají Satoshi Medium 12 px s tloušťkou 500.
- Velikost vzorců určuje `--ui-formula-size` a tloušťku určuje `--ui-formula-weight`.
- Barevné názvy ve vzorci přebírají společné písmo vzorce.
- Výsledná čísla mají společný styl Nohemi 30 px s tloušťkou 400.
- Mobilní velikosti se mění společně pro všechna okna.
- `okna/tree_annotations.js` vytváří okna a zajišťuje rozkliknutí i pohyb podle stromu.
- Zapnutý vzorec vytváří vždy hned pod nadpisem před popisem a ostatním textem.
- `okna/tree_annotations.css` obsahuje společný základ prostorových popisků.
- `okna/element_ui_okna_veliciny.js` převádí výpočetní názvy na krátké popisky, barvy, jednotky a formát čísel.
- Funkce `vstupyVzorce` rozepisuje mezivýpočty na jejich základní vstupy.
- Pole `veVzorci: false` skryje technický přepočet v barevném přehledu bez změny výpočtu.
- `ekologie/tree_ecology_vzorce.js` určuje společné vzorce pro výpočet i zobrazení.
- `ekologie/tree_ecology.js` počítá hodnoty stromu.
- Veličina `activeLeafArea` spojuje plochu listů a podíl listů tvořících cukry.
- Převodník ji zobrazuje zeleně jako „listy“.
- Aktivita ji vztahuje k plnému olistění a tvorba cukrů používá přímo její plochu.
- Veličina `photosynthesisEfficiency` vyjadřuje účinnost světla, vody, CO₂ a teploty bez dalšího násobení podílem listů.
- `index.html` dodává pojmenované body stromu.

Nové okno přidáš záznamem do seznamu příslušné kapitoly.
Nová veličina potřebuje záznam v převodníku a skutečný výpočet.
Nový bod potřebuje definici v `getAnchors` v `index.html`.

Cesty k souborům jsou uvedené od složky `web_viewer`.

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
- Kontrola hlídá také jedinečná ID, body stromu a připojené ovladače.
- Chybné záznamy oken se přeskočí.
- Chyby se vypisují do vývojářské konzole.
- Stejná chyba se nevypisuje každý snímek znovu.
- Kontrolní funkce ověřuje skript `testy/test_ui_okna_kontrola.mjs` bez prohlížeče.

Barevný řádek označujeme jako vstupy výpočtu.
Řádek skrývá technické přepočty a normalizaci.
Nejde tedy o úplný matematický vzorec.
