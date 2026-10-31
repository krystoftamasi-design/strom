---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Popsána vodorovná navigace a pořadí kapitol podle UI podkladu.
---

# Prvky

#### Kapitoly

- Vodorovná textová navigace v horní pravé části podle [Untitled.svg](../../web_assets/ui_from_af/Untitled.svg).
- Pořadí: Úvod, Období, Fotosyntéza, Transpirace, Semenace, Kořeny.
- Aktivní kapitola je zvýrazněna tučným písmem; položky nemají viditelnou výplň ani rámeček.
- Písmo: Satoshi; v podkladu přibližně 21 px.
- Kliknutí přepne příslušnou kapitolu.

#### Manager

- Tlačítko vpravo nahoře zobrazí nebo skryje rozšířené ovládání.
- Patří pod něj nastavení, uložení pohledu, podmínky stromu a přepínač barev nadpisů.
- Skrývá také posuvník času, údaj o čase, FPS a výšku stromu.

#### Ovládání času

- Pauza, rychlost 2× a rychlost 4× jsou vpravo dole.
- Tato tlačítka zůstávají viditelná i při vypnutém Manageru.

[Zpět na architekturu obsahu](../architektura_obsahu.md)

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
