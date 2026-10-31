---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednoceny stavy propojení tagy a zvýraznění vody s kódem a zapsány provedené kontroly.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zapsána implementace rychlejšího nočního stahování linek a doplněna šablona evidence.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zapsána čekající implementace propojení oken a elementů společnými tagy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: "Implementována Z002: zvýraznění glukózy podle otevření detailu Cukry."
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Přesměrován vzhled oken na samostatný soubor vzhled_oken.md.
---

# Změny

## Čeká

## Rozpracováno

## Implementováno

#### Z004 — Propojení tagy

- Zadání: [Pravidlo propojení](elementy.md#pravidlo-propojení), společný tag okna a elementu.
- Stav: Implementováno.
- Ověření: kontrola napojení `tema` → `setElementHighlight` → materiály linek v kódu; syntaxe a `test_ui_okna_kontrola.mjs` prošly.
- Přepnutí zvýraznění probíhá přímo při změně otevření detailu; aktualizace kapitoly zachovává jeho soulad s viditelností okna.
- Vizuální a funkční ověření: finální kontrola uživatelem.

#### Z001 — Voda

- Zadání: [Voda linka](elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Implementováno.
- Ověření: kontrola vazby tagu `water` na uniform materiálu v kódu; finální kontrola uživatelem.

#### Z005 — Noční stahování linek

- Zadání: [Společné stahování linek](elementy.md#společné-stahování-linek).
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a diffu; finální vizuální kontrola uživatelem.

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

## Pravidla struktury

- Změny seskupuj podle stavu v kapitolách `##`; jednotlivé záznamy mají nadpis `####` se stálým ID a názvem.
- U záznamu uváděj odkaz na zadání, stav a skutečné ověření; případná omezení uveď samostatně.
- Význam stavů a přesuny záznamů určují pravidla evidence výše.
- Tuto část s obecnou šablonou ponechávej na konci dokumentu.

```markdown
## Název stavu

#### ZXXX — Název změny

- Zadání: [Definice](soubor.md#kotva).
- Stav: odpovídající stav.
- Ověření: provedená kontrola nebo finální kontrola uživatelem.
```
