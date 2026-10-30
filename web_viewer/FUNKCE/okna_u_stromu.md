---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Nahrazena pohyblivá a roztažitelná okna odkazy na společnou statickou definici.
---

# Okna u stromu




## Jak fungují

- Požadované chování a rozložení určuje [Statická okna](../dokumentace/okna.md#statická-okna).
- Okna zobrazují živé hodnoty; statická je jejich poloha a geometrie.
- Kliknutí na Vodu nebo Cukry zachovává související [reakce elementů](../dokumentace/elementy.md), bez pohybu okna.
- Stav přechodu ze současné implementace eviduje [Z003](../dokumentace/zmeny.md#z003--ui-podle-svg).

## Vzhled

- Rozmístění, barevné tahy, písmo a pořadí obsahu určuje [Vzhled podle podkladu](../dokumentace/okna.md#vzhled-podle-podkladu).
- Text je ve dne tmavý a v noci světlý; barvy témat se v noci nemění.

## Barvy

- Voda je modrá.
- Kyslík je světle modrý.
- CO₂ je červenooranžový.
- Světlo a aktivita jsou žluté.
- Listy jsou zelené.
- Kořeny jsou hnědé.
- Cukry jsou fialové.
- Teplota je růžovočervená.

## Hodnoty a vzorce

- Pole `vypocet` propojí okno s výsledkem a vzorcem.
- Vzorec ukazuje krátké barevné názvy vstupů skutečného výpočtu.
- Složené veličiny se rozepisují na jednotlivé vstupy.
- Místo účinnosti se zobrazí světlo, voda, CO₂ a teplota.
- Technické přepočty jednotek se mezi barevnými vstupy nezobrazují.
- Název „listy“ znamená aktivní plochu listů po zohlednění olistění a červenání.
- Aktivní plocha listů se do tvorby cukrů započítává pouze jednou.
- Umístění vzorce určuje [Vzhled podle podkladu](../dokumentace/okna.md#vzhled-podle-podkladu).
- Vzorec používá Satoshi Medium ve velikosti 12 px.
- Jednotlivé názvy ve vzorci se liší pouze barvou.
- Vzorec neobsahuje živá čísla uvnitř barevných názvů.
- Pole `zobrazitVzorec` zapíná nebo vypíná vzorec.
- Pole `zobrazitHodnotu` zapíná nebo vypíná výsledné číslo.


