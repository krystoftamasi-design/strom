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

- Vodorovná textová navigace vlevo nahoře podle [Untitled.svg](../../web_assets/ui_from_af/Untitled.svg).
- V kapitolách začíná menu u levého okraje nad okny; v Úvodu zůstává vpravo uprostřed výšky obrazovky. Na úzké obrazovce se položky zalamují.
- Pořadí: Období, Fotosyntéza, Transpirace, Semenace, Kořeny.
- Průvodce Transpirací výslovně pojmenovává aktuální kapitolu.
- Aktivní kapitola i položka pod kurzorem jsou zvýrazněny pouze tučným písmem bez podtržení. Šířka počítá s tučným písmem předem; přechod řezu trvá 300 ms a při omezení pohybu je vypnutý. Položky nemají viditelnou výplň ani rámeček; fokus je viditelný.
- Písmo: Satoshi; v podkladu přibližně 21 px.
- Kliknutí přepne příslušnou kapitolu.

#### Manager

- Tlačítko Manager se nezobrazuje; rozšířené ovládání zůstává skryté.

#### Ovládání času

- Pauza, rychlost 2× a rychlost 4× jsou vpravo dole bez výplně panelu; tlačítka mají 38 × 38 px, aktivní stav kruhový obrys a barva se přizpůsobuje dni a noci. Na široké obrazovce jsou 3 % od pravého a 5 % od spodního okraje, do šířky 700 px 4 % a 3 %.
- Pauza zastaví běh času a dalším stiskem jej obnoví. Volba 2× nebo 4× obnoví běh danou rychlostí; opětovný stisk aktivní rychlosti vrátí 1×.
- V Úvodu se pauza ani rychlosti 2× a 4× nezobrazují; úvodní animace běží automaticky.
- V ostatních kapitolách jsou tlačítka viditelná a přístupná klávesnicí; fokus má viditelný obrys.

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
