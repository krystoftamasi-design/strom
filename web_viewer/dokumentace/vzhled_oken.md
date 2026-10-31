---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Sjednocena výška barevných svislých tahů s výškou každého okna.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Nastaven nezalamovaný řádek vstupů výpočtu.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Upřesněna barva vstupů výpočtu: černá ve dne a světlá v noci.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Doplněna obecná skladba obsahu oken bez přesunu konkrétních textů.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Přesunut samostatný popis vzhledu oken z okna.md.
---

# Vzhled oken
## Statická okna

- Okna mají pevnou polohu a rozměry v rozhraní, nezávisle na stromu a kameře.
- Kliknutí na nadpis zobrazí nebo skryje detail ve vyhrazeném prostoru.
- Změna hodnot a zobrazení detailu neposouvají bloky ani nemění délku barevného tahu.
- Okna nemají pohybové animace ani spojnice ke stromu.
- Při vstupu jsou otevřené detaily Cukrů a Vody; ostatní jsou skryté.

### Obecný obsah

- Nadpis: název tématu; kliknutí ovládá zobrazení detailu.
- Hodnota: živé číslo s jednotkou pod nadpisem, pokud ji okno zobrazuje.
- Vstupy výpočtu: drobný černý nezalamovaný řádek pod hodnotou ve dne; v noci se převrátí na světlou barvu.
- Detail: vysvětlující text ve vyhrazeném prostoru vedle hlavních údajů.
- Ovládání: případný posuvník nebo jiný ovládací prvek v detailu.
- Konkrétní hodnoty, texty a ovládání jednotlivých oken určuje [Obsah oken](okna.md).

### Rozložení

- Podklad: [Untitled.svg](../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Fotosyntéza je vlevo dole; vpravo následují shora O₂, CO₂, Cukry a Voda.
- Střed zůstává volný pro strom.
- Bloky jsou bez výplně a rámečku; vlevo mají nepravidelný svislý tah.
- Barevný svislý tah každého okna začíná u horního okraje a končí u jeho dolního okraje; délka se řídí výškou okna.
- Do šířky 700 px zůstávají dva pevné sloupce; detaily mají místo pod nadpisem s vlastním posuvem a přehled vstupů je skrytý.

### Písmo

- Nadpisy používají Nohemi Regular, přibližně 53 px na referenčním plátně.
- Fotosyntéza má dominantní tučný nadpis přibližně 92 px.
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
