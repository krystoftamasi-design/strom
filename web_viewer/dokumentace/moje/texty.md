---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.

---
# Texty

#### Strom

- Písmo: Nohemi.
- Umístění: vlevo na střed výšky displeje.
- Barva: ve dne tmavá, v noci světlá.
- Zdroj: [chapters.js](../../kapitoly/chapters.js), blok `intro`.

#### Datum

- Zobrazuje datum modelového roku.
- Umístění: vlevo nahoře.
- Písmo: Satoshi, bez pozadí.
- Barva: ve dne tmavá, v noci světlá.
- Vzhled: [tree_annotations.css](../../okna/tree_annotations.css), `.season-date-card`.

[Zpět na obsah](../architektura_obsahu.md)

## Pravidla struktury

- Zachovej hlavní nadpis `#` a tematické části `##`; podrobnosti mají úroveň `###` až `####`.
- Historii udržuj ve frontmatteru a tuto část ponechávej na konci.

```markdown
# Název dokumentu

## Název tématu

- Informace k tématu.

### Název části

- Podrobnost.

## Pravidla struktury

- Pravidlo členění.
```
