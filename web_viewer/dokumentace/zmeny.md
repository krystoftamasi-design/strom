---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zapsána čekající implementace propojení oken a elementů společnými tagy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: "Implementována Z002: zvýraznění glukózy podle otevření detailu Cukry."
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Přesměrován vzhled oken na samostatný soubor vzhled_oken.md.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Aktualizován odkaz na samostatnou kategorii Vzhled oken.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Zkrácena evidence na zadání, stav a ověření bez opakování definic.
---

# Změny

## Čeká

#### Z004 — Propojení tagy

- Zadání: [Pravidlo propojení](elementy.md#pravidlo-propojení), společný tag okna a elementu.
- Stav: Čeká.
- Ověření: témata v kódu určují barvy; zvýraznění glukózy je dosud navázané na ID `cukry`, nikoli na společný tag.
- Dokumentace: sjednocené tagy a členění definic; kód v tomto kroku nezměněn.

#### Z001 — Voda

- Zadání: [Voda linka](elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Čeká.
- Ověření: neprovedeno.

## Rozpracováno

## Implementováno

#### Z002 — Glukóza

- Zadání: [Glukóza linka](elementy.md#glukóza-linka), zvýraznění při otevření okna Cukry a návrat při zavření.
- Stav: Implementováno.
- Ověření: porovnání vazby okna s uniformem shaderu v kódu; finální kontrola uživatelem.

#### Z003 — UI podle SVG

- Zadání: [Fotosyntéza](architektura_obsahu.md#fotosyntéza), [statická okna](okna.md#statická-okna), [vzhled bloků](vzhled_oken.md), [Kapitoly](prvky.md#kapitoly).
- Stav: Implementováno.
- Ověření: kontrola syntaxe změněných modulů a `test_ui_okna_kontrola.mjs` prošly; test zahrnuje spuštění bez bodů stromu.
- Omezení: širší `test_tree_ecology.mjs` selhává na „Excess inflow stops at capacity“ v nezměněném ekologickém modelu.
- Vizuální a závěrečné ověření: finální kontrola uživatelem.

## Ověřeno

## K upřesnění

## Pravidla evidence

- Postup a význam stavů určuje [AGENTS.md](../../AGENTS.md#změny).
- Každá změna má stálé ID, odkaz na zadání, stav a výsledek ověření.
- Při změně stavu přesuň záznam do příslušné části.
- Neevidované části webu nejsou tímto dokumentem ověřené.

[Zpět na obsah](architektura_obsahu.md)
