---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunut záznam uživatelského testu do samostatného tests.md.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněn neformální test s mámou a mýty zkráceny do jedné kapitoly.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vymezeny tři prioritní problémy porozumění.
---

# Problémy k řešení

- Podklady pro návrh webu podle [Strategie](strategie.md); samotné změny webu se řeší samostatně.

## Mýty a porozumění

- **„Strom jí hlínu kořeny“:** vysvětlit, že uhlík pro růst pochází z CO₂ ve vzduchu; kořeny přijímají vodu a minerální živiny. Ověření: „Odkud strom získává uhlík pro tvorbu dřeva?“ Viz [CO₂](okna.md#co₂) a [Cukry](okna.md#cukry).
- **Tah vody a transpirace:** vysvětlit, že odpar v listech pomáhá táhnout vodu xylémem od kořenů a spotřebovává teplo. Ověření: „Co táhne vodu nahoru a proč odpar ochlazuje?“ Viz [Transpirace](okna.md#transpirace).
- **„Kyslík pro lidi“:** vysvětlit, že strom fotosyntézou vytváří cukry pro vlastní růst a získávání energie; kyslík se přitom uvolňuje. Ověření: „Co fotosyntéza přináší samotnému stromu?“ Viz [Fotosyntéza](okna.md#fotosyntéza).
- Stav všech tří témat: K řešení; vyřešení musí potvrdit ověření porozumění u studentů.

- Poznatky z uživatelského ověřování: [Testy](tests.md).

## Pravidla struktury

- Mýty seskup do jedné kapitoly `##`; každý shrň jedním bodem s cílem, ověřovací otázkou a odkazem na obsah. Společný stav uveď jednou.
- Záznamy uživatelských testů udržuj v `tests.md`; zde na ně pouze odkazuj.
- Vyřešení podlož novým ověřením, nikoli samotnou implementací.
- Historii udržuj ve frontmatteru; pravidla a šablonu ponechávej na konci.

```markdown
## Mýty a porozumění

- **Název mýtu:** cíl. Ověření: „Otázka?“ Viz [Obsah](../soubor.md#kotva).
- Stav témat: stav řešení.

[Poznatky z testování](tests.md)
```
