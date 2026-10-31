---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upravena instrukce Transpirace pro společné ovládání přes nadpis okna.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.
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

#### Průvodce Transpirací

- Vlevo nad hlavním oknem: „Právě prohlížíš · Transpirace“ a „Odpar v listech táhne vodu vzhůru.“
- Vysvětlení: „Kořeny vodu přijímají. Xylém ji vede do listů, kde se odpařuje a spotřebovává teplo.“
- Legenda: „Modrá linka ve stromu = cesta vody“; schéma určuje [Cesta vody](elementy.md#cesta-vody).
- Nad pravými okny: „Prozkoumej prvky transpirace“ a „Klikni na nadpis okna. Otevřeš vysvětlení; vodní témata zvýrazní modrou linku.“
- Texty používají společné písmo rozhraní, ve dne jsou tmavé a v noci světlé; modrá legenda zachovává čitelnost v noci.

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
