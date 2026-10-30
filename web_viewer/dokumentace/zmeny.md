---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Rozšířena Z003 o nahrazení pohyblivých oken statickým UI.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Evidována čekající úprava UI podle SVG jako Z003.
---

# Změny

## Čeká

#### Z001 — Voda

- Zadání: [Voda linka](elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Čeká.
- Ověření: neprovedeno.

#### Z002 — Glukóza

- Zadání: [Glukóza linka](elementy.md#glukóza-linka), zvýraznění při otevření okna Cukry a návrat při zavření.
- Stav: Čeká.
- Ověření: neprovedeno.

#### Z003 — UI podle SVG

- Zadání: [Fotosyntéza](architektura_obsahu.md#fotosyntéza), [statická okna](okna.md#statická-okna), [vzhled bloků](okna.md#vzhled-podle-podkladu), [Kapitoly](prvky.md#kapitoly).
- Stav: Čeká; nyní je zapsaná definice, implementace naváže samostatně.
- Rozdíl proti kódu: pevné bloky UI nahrazují polohování podle stromu; odstraňuje se projekce kotev, spojnice a animované změny geometrie.
- Rozložení: velká Fotosyntéza vlevo dole, čtyři bloky vpravo, vzorec pod hodnotou.
- Ověření: v `tree_annotations.js` potvrzeno dosavadní polohování přes `getAnchors` a `project`; související dokumentace sjednocena, kód nezměněn, finální kontrola uživatelem.

## Rozpracováno

## Implementováno

## Ověřeno

## K upřesnění

## Pravidla evidence

- Postup a význam stavů určuje [AGENTS.md](../../AGENTS.md#postup-změn).
- Každá změna má stálé ID, odkaz na zadání, stav a výsledek ověření.
- Při změně stavu přesuň záznam do příslušné části.
- Neevidované části webu nejsou tímto dokumentem ověřené.

[Zpět na obsah](architektura_obsahu.md)
