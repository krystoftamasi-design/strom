---
history:
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Zjednodušen průvodce Transpirací na jedinou větu o tahu vody odparem v listech.
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
- Umístění: vpravo nahoře.
- Písmo: Satoshi, bez pozadí.
- Barva: ve dne tmavá, v noci světlá.
- Vzhled: [tree_annotations.css](../../okna/tree_annotations.css), `.season-date-card`.

#### Průvodce Transpirací

- Fotosyntéza zobrazuje výchozí text a po otevření oken CO₂, Cukry, Voda nebo O₂ zobrazí příslušnou tematickou variantu. Definice textů jsou v [Kontextových textech](kontextove_texty.md#fotosyntéza).
- Transpirace zobrazuje text „Odpar v listech táhne vodu vzhůru.“.

#### Kontext počtu semen

- V [Semenaci](okna.md#kapitola-semenace) kontext pod hlavním oknem říká: „Z mnoha bukvic jen malá část doroste ve strom.“
- Kontext není počítanou hodnotou stromu ani novým ovládacím prvkem. Přesný počet bukvic, časové období a podíl přežití doplnit až po ověření zdroje, životní fáze a podmínek; do té doby nezobrazovat vymyšlená čísla.
- Část semen spotřebují živočichové; některá nevyklíčí a část semenáčků nepřežije. Živočichové mohou semena také šířit.

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
