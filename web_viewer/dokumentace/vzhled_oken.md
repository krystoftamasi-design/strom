---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura Transpirace, její okna a elementy podle vzoru Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Převedena kapitola Transpirace na společný vzhled oken Fotosyntézy.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Sladěno rozložení detailů, rozestupy a délky tahů se současným CSS.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Detailní text se při rozkliknutí drží ve vyhrazeném prostoru bez překrytí sousedních oken.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: "Opravena délka tahů: běžná okna končí u obsahu, Fotosyntéza používá delší tah kvůli velkému obsahu."

---

# Vzhled oken
## Statická okna

- Okna mají pevnou polohu a rozměry v rozhraní, nezávisle na stromu a kameře.
- Kliknutí na nadpis zobrazí nebo skryje detail ve vyhrazeném prostoru.
- Změna hodnot a zobrazení detailu neposouvají polohu oken.
- Okna nemají pohybové animace ani spojnice ke stromu.
- V kapitole Fotosyntéza jsou výchozí detaily Cukrů a Vody otevřené; v Transpiraci jsou otevřené detaily Příjmu vody a Průtoku, ostatní jsou zavřené.

### Obecný obsah

- Nadpis: název tématu; kliknutí ovládá zobrazení detailu.
- Hodnota: živé číslo s jednotkou pod nadpisem, pokud ji okno zobrazuje.
- Vstupy výpočtu: drobný černý nezalamovaný řádek pod hodnotou ve dne; v noci se převrátí na světlou barvu.
- Detail se zobrazuje napravo od hlavních údajů a sází se od horního okraje okna.
- O₂, CO₂, Cukry a Voda mají společnou šířku levého sloupce a jejich popisy začínají na stejné svislici.
- Mezi sloupci je mezera 15 px; u dlouhého vzorce je výsledný odstup přibližně 15 px. Krátký vzorec Vody ponechává větší volný prostor.
- Prostor detailu zabírá výšku řádků nadpisu, hodnoty a vzorce; delší obsah má vlastní posuv.
- Ovládání: případný posuvník nebo jiný ovládací prvek v detailu.
- Konkrétní hodnoty, texty a ovládání jednotlivých oken určuje [Obsah oken](okna.md).

### Rozložení

- Podklad: [Untitled.svg](../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Fotosyntéza je vlevo dole; vpravo následují shora O₂, CO₂, Cukry a Voda.
- Transpirace používá stejné hlavní okno vlevo dole jako Fotosyntéza; vpravo jsou shora Příjem vody, Průtok, Chlazení a Teplota. Každé má jednu hodnotu a vlastní detail ve společných sloupcích.
- Střed zůstává volný pro strom.
- Bloky jsou bez výplně a rámečku; vlevo mají nepravidelný svislý tah.
- Svislé tahy začínají u horního okraje okna; O₂, CO₂ a Cukry používají 65 % výšky svého bloku, Fotosyntéza 100 %.
- Tah Vody se roztahuje podle výšky řádků nadpisu, hodnoty a vzorce místo procentní výšky bloku.
- Do šířky 700 px zůstávají dva pevné sloupce; detaily mají místo pod nadpisem s vlastním posuvem a přehled vstupů je skrytý.

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

[Obsah oken](okna.md) · [Obsah](architektura_obsahu.md)

## Pravidla struktury

- Název dokumentu má úroveň `#`, společná oblast oken `##` a její témata `###`.
- Témata řaď jako obecný obsah, rozložení, písmo a barvy.
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

[Související dokument](soubor.md)

## Pravidla struktury

- Pravidlo členění.
```
