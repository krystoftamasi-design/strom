---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněna šablona vzhledu podle Fotosyntézy a vzorce zbývajících oken Transpirace.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura Transpirace, její okna a elementy podle vzoru Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Převedena kapitola Transpirace na společný vzhled oken Fotosyntézy.

---

# Vzhled oken
## Statická okna

- Okna mají pevnou polohu a rozměry v rozhraní, nezávisle na stromu a kameře.
- Kliknutí na nadpis zobrazí nebo skryje detail ve vyhrazeném prostoru.
- Změna hodnot a zobrazení detailu neposouvají polohu oken.
- Okna nemají pohybové animace ani spojnice ke stromu.
- V kapitole Fotosyntéza jsou výchozí detaily Cukrů a Vody otevřené; v Transpiraci jsou všechny detaily výchozím stavem zavřené a základní vysvětlení zůstávají viditelná.

### Obecný obsah

- Nadpis: název tématu; kliknutí ovládá zobrazení detailu.
- Hodnota: živé číslo s jednotkou pod nadpisem, pokud ji okno zobrazuje.
- V Transpiraci má každé číselné okno vzorec pod hodnotou i při zavřeném detailu; dlouhý vztah se může zalomit a shrnutí následuje pod ním. Vzorec je v této kapitole viditelný i na úzké obrazovce.
- Vstupy výpočtu: drobný černý nezalamovaný řádek pod hodnotou ve dne; v noci se převrátí na světlou barvu.
- Detail se zobrazuje napravo od hlavních údajů a sází se od horního okraje okna.
- O₂, CO₂, Cukry a Voda mají společnou šířku levého sloupce a jejich popisy začínají na stejné svislici.
- Mezi sloupci je mezera 15 px; u dlouhého vzorce je výsledný odstup přibližně 15 px. Krátký vzorec Vody ponechává větší volný prostor.
- Prostor detailu zabírá výšku řádků nadpisu, hodnoty a vzorce; delší obsah má vlastní posuv.
- Ovládání: případný posuvník nebo jiný ovládací prvek v detailu.
- Konkrétní hodnoty, texty a ovládání jednotlivých oken určuje [Obsah oken](okna.md).

### Rozložení

- Podklad: [Untitled.svg](../../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Fotosyntéza je vlevo dole; vpravo následují shora O₂, CO₂, Cukry a Voda.
- Transpirace používá stejné hlavní okno vlevo dole jako Fotosyntéza; vpravo jsou shora Příjem vody, Chlazení a Teplota. Každé má jednu hodnotu a vlastní detail ve společných sloupcích.
- Střed zůstává volný pro strom.
- Bloky jsou bez výplně a rámečku; vlevo mají nepravidelný svislý tah.
- Svislé tahy začínají u horního okraje okna; O₂, CO₂ a Cukry používají 65 % výšky svého bloku, Fotosyntéza 100 %.
- Tah Vody se roztahuje podle výšky řádků nadpisu, hodnoty a vzorce místo procentní výšky bloku.
- Do šířky 700 px zůstávají dva pevné sloupce; detaily mají místo pod nadpisem s vlastním posuvem a přehled vstupů je skrytý.

- V Transpiraci jsou tlačítka +/− viditelná v kruhu vedle nadpisu; otevřený blok má silnější svislý tah a slovní potvrzení otevření.
- Vlevo nad hlavním oknem je vysvětlení děje a svislé schéma s vodou stoupající od kořenů k listům; nad pravými okny je označení témat a krátká instrukce.

### Písmo

- Nadpisy používají Nohemi Regular, přibližně 53 px na referenčním plátně.
- Hlavní okna Fotosyntézy a Transpirace mají dominantní tučný nadpis přibližně 92 px.
- Popisky, jednotky a detaily používají Satoshi Light.
- Přehled vstupů používá drobné písmo Satoshi Medium; názvy vstupů jsou ve dne černé a v noci světlé.
- Hodnoty používají Nohemi a barvu příslušného tématu.

### Barvy

- Text je ve dne tmavý a v noci světlý.
- Barvy témat zůstávají stejné ve dne i v noci.
- Světlo a aktivita jsou žluté.
- Voda je modrá, kyslík světle modrý a CO₂ červenooranžový.
- Cukry jsou fialové, listy zelené, kořeny hnědé a teplota růžovočervená.

[Obsah oken](okna.md) · [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Název dokumentu má úroveň `#`, společná oblast oken `##` a její témata `###`.
- Témata řaď jako obecný obsah, rozložení, písmo a barvy.
- Šablonu jednoho okna odvozuj z hlavního a tematických oken Fotosyntézy: svislý tah, nadpis, hodnota, vzorec a detail napravo. Doplňky Transpirace nejsou součástí společné šablony.
- Rozliš hlavní okno vlevo dole s dominantním nadpisem a hodnotou od menších tematických oken v pravém sloupci.
- Pro další okna používej následující šablonu se zástupnými názvy; konkrétní obsah a výchozí otevření určují definice v `okna.md`.
- Popisuj aktuální vzhled stručnými odrážkami; konkrétní texty a ovládání odkazuj do obsahu oken.
- Historii udržuj ve frontmatteru, odkazy před touto závěrečnou částí.

```markdown
# Název dokumentu

## Název oblasti

- Společné pravidlo.

### Obecný obsah

- Skladba obsahu.

### Rozložení

- Poloha a rozměry.

### Písmo

- Typografické pravidlo.

### Barvy

- Barevné pravidlo.

[Související dokument](../soubor.md)

## Pravidla struktury

- Pravidlo členění.
```

### Šablona jednoho okna podle Fotosyntézy

```markdown
#### Název okna

- Role: hlavní okno procesu / tematické okno.
- Umístění: hlavní okno vlevo dole / tematické okno v pravém sloupci; střed je vyhrazen stromu.
- Podklad: bez výplně, rámečku a spojnice ke stromu.
- Barevný tah: nepravidelná svislá linka vlevo v barvě tématu.
- Nadpis: Nohemi; hlavní okno má dominantní větší a tučnější nadpis, tematické okno menší nadpis.
- Hodnota: pod nadpisem, Nohemi v barvě tématu; popisek a jednotka v Satoshi.
- Vzorec / přehled vstupů: pod hodnotou, drobné Satoshi Medium; ve dne černý, v noci světlý.
- Detail: druhý sloupec napravo, zarovnaný k hornímu okraji okna, Satoshi Light; dlouhý text má vlastní posuv.
- Rozestup sloupců: 15 px; tematická okna stejného sloupce mají společný začátek detailů.
- Zavřený stav: nadpis, hodnota a vzorec zůstávají na místě; detail je skrytý.
- Otevřený stav: detail se zobrazí ve vyhrazeném prostoru bez posunutí sousedních oken.
- Ovládání: ovládací plocha nad nadpisem s viditelným označením při ovládání klávesnicí; konkrétní chování a výchozí stav určuje definice okna.
- Úzká obrazovka: dva pevné sloupce, menší písmo a detail pod hlavními údaji; Fotosyntéza skrývá přehled vstupů.
- Konkrétní nadpis, tag, hodnota, vzorec a detail: odkaz na definici v obsahu oken.
```
