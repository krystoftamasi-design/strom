---
history:
  - thread_id: 01a1942e-d161-7933-b8f7-31bb2827f7a1
    date: 2026-11-01
    change: Odstraněn Úvod z pořadí položek navigace.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.
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
- Menu začíná na levém okraji pravého sloupce oken a je nad ním s volným odstupem; na úzké obrazovce se položky zalamují.
- Pořadí: Období, Fotosyntéza, Transpirace, Semenace, Kořeny.
- Aktivní Transpirace je navíc podtržená a její průvodce výslovně pojmenovává aktuální kapitolu.
- Aktivní kapitola je zvýrazněna tučným písmem; položky nemají viditelnou výplň ani rámeček.
- Písmo: Satoshi; v podkladu přibližně 21 px.
- Kliknutí přepne příslušnou kapitolu.

#### Manager

- Tlačítko vpravo nahoře zobrazí nebo skryje rozšířené ovládání.
- V Úvodu se tlačítko Manager nezobrazuje.
- Patří pod něj nastavení, uložení pohledu, podmínky stromu a přepínač barev nadpisů.
- Skrývá také posuvník času, údaj o čase, FPS a výšku stromu.

#### Ovládání času

- Pauza, rychlost 2× a rychlost 4× jsou vpravo dole.
- V Úvodu se pauza ani rychlosti 2× a 4× nezobrazují; úvodní animace běží automaticky.
- V ostatních kapitolách tato tlačítka zůstávají viditelná i při vypnutém Manageru.

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
