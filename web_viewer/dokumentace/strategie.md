---
history:
  - thread_id: d4bd5380-b7a9-4109-9dcd-32f5819e4b02
    date: 2026-10-31
    change: Definován scénář samostudia, metrika porozumění fotosyntéze do jedné minuty a scénář testu s pěti uživateli.
---

# Produktová strategie

## Uživatel a scénář

- Cílový uživatel: student při domácím samostudiu.
- Kontext: samostatné otevření webu na notebooku bez výkladu učitele a bez nápovědy.
- Hlavní problém: v běžné učebnici student vidí statický vzorec a nevnímá strom jako živý propojený systém, kde změna jednoho prvku okamžitě ovlivní ostatní.

## Metrika úspěchu

- Cíl porozumění (Time-to-Value ≤ 60 s): po 1 minutě volného prozkoumání kapitoly [Fotosyntéza](architektura_obsahu.md#fotosyntéza) student bez nápovědy vyjmenuje klíčové prvky děje (světlo, voda, CO₂, O₂, cukry) a správně vysvětlí alespoň jednu přímou souvislost mezi nimi (např. že z vody a CO₂ za světla vznikají cukry a uvolňuje se O₂, nebo že cévní linka vede vodu/cukry mezi kořeny a korunou).
- Práh úspěchu: alespoň 4 z 5 testovaných studentů (80 %) splní úkol do 60 sekund.

## Rychlý test (5 uživatelů)

- Posaď studenta k otevřené kapitole [Fotosyntéza](okna.md#kapitola-fotosyntéza), dej mu 60 sekund na prozkoumání a nijak mu neraď.
- Během minuty tiše sleduj: zda klikne na nadpisy oken ([Cukry](okna.md#cukry), [Voda](okna.md#voda), [O₂](okna.md#o₂), [CO₂](okna.md#co₂)) a zda si všimne zvýraznění linek na kmeni ([Voda linka](elementy.md#voda-linka), [Glukóza linka](elementy.md#glukóza-linka)).
- Po 60 sekundách obrazovku skryj a polož 2 otázky:
  1. „Které látky nebo prvky se tu fotosyntézy účastní?“
  2. „Jak spolu v tom stromu souvisí alespoň dva z nich?“
- Zapiš pouze: splnil / nesplnil a kde se zasekl.

## Pravidla struktury

- Oblasti strategie mají nadpis `##` a stručné odrážky.
- Odkazy na existující kapitoly, okna a elementy směřují do hlavní dokumentace.
- Historii změn udržuj ve frontmatteru; tuto část se šablonou ponechávej na konci.

```markdown
# Název dokumentu

## Název oblasti

- Stručné pravidlo nebo definice.
```
