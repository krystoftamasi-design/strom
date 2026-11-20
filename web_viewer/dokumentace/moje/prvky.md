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
- Pořadí: Období, Fotosyntéza, Transpirace, Semenace. Kořeny jsou dočasně skryté.
- Průvodce Transpirací výslovně pojmenovává aktuální kapitolu.
- Aktivní kapitola i položka pod kurzorem jsou zvýrazněny pouze tučným písmem bez podtržení. Šířka počítá s tučným písmem předem; přechod řezu trvá 300 ms a při omezení pohybu je vypnutý. Položky nemají viditelnou výplň ani rámeček; fokus je viditelný.
- Písmo: Satoshi; v podkladu přibližně 21 px.
- Kliknutí přepne příslušnou kapitolu.

#### Přiblížení stromu

- Nejmenší vzdálenost kamery od cíle otáčení je 17 jednotek scény; hodnotu lze doladit po vizuálním ověření.
- Pohled kamery je vystředěný na osu stromu (0 % vodorovného posunu) při zachování osy otáčení v kmeni.

#### Kruh ročních období

- Názvy období leží uprostřed odpovídajících úseků kruhu a označují střed období podle modelového data; jaro připadá přibližně na polovinu dubna.
- Kolečko nad kruhem posouvá rok dopředu plynulým doběhem při otáčení v obou směrech; běžný krok kolečka odpovídá přibližně čtyřem procentům otočení kruhu. Při omezení pohybu se posun provede ihned.

#### Manager

- Klávesa K otevře panel s pokročilými nastaveními modelu a scény. Další stisk K nebo Escape panel zavře.
- Záhlaví otevřeného panelu Nastavení zobrazení ukazuje aktuální FPS.
- Posuvník Počet listů nastavuje pevnou hustotu koruny v rozsahu 0 až 90 000 listů nezávisle na FPS.

#### Ovládání času

- V Období a Fotosyntéze jsou datum a tlačítka pod průvodcem: datum nahoře, tlačítka pod ním. Obě kapitoly používají stejné rozměry a umístění včetně úzké obrazovky.
- Tlačítka jsou zleva zpomalení 0,5×, pauza, zrychlení a reset. Opakovaným kliknutím na zrychlení se postupně nastaví rychlost 2×, 4× a běžná rychlost. Tlačítko resetu obnoví výchozí zdravý stav stromu (plnou korunu, zásoby, automatické přísuny a rychlost 1×) a přepne na léto. V ostatních kapitolách mají tlačítka 48 × 48 px a ikony 28 × 28 px; v aktivním stavu mají kruhový obrys. Panel je bez výplně a barva ovládání se přizpůsobuje dni a noci.
- Při výchozí rychlosti 1× trvá automatický modelový rok 9 minut a 36 sekund. Pauza zastaví běh času a dalším stiskem jej obnoví. Volba jiné rychlosti obnoví běh zvolenou rychlostí. Opětovný stisk zpomalení vrátí 1×.
- V Úvodu jsou tlačítka běhu času skrytá a animace běží automaticky.
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
