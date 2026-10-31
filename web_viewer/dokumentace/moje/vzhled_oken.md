---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zachována definovaná velikost nadpisů bez zmenšování podle obsahu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zakázáno zalamování nadpisů oken a upraven prostor záhlaví.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zdokumentována replikovatelnost, rozestupy a prostor ovládání oken.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vrácena viditelná tlačítka +/− do oken Transpirace.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocen vzhled oken Transpirace se společnou šablonou Fotosyntézy.

---

# Vzhled oken

- Účel: replikovatelnost vzhledu oken v dalších kapitolách a projektech. Dokument musí určit rozložení, rozměry, odstupy, typografii a stavy tak, aby šly zopakovat bez dohledávání historie chatu.
## Statická okna

- Okna mají pevnou polohu a rozměry v rozhraní, nezávisle na stromu a kameře.
- Kliknutí na nadpis zobrazí nebo skryje detail ve vyhrazeném prostoru.
- Změna hodnot a zobrazení detailu neposouvají polohu oken.
- Okna nemají pohybové animace ani spojnice ke stromu.
- V kapitole Fotosyntéza jsou výchozí detaily Cukrů a Vody otevřené; v Transpiraci jsou všechny detaily výchozím stavem zavřené.

### Obecný obsah

- Nadpis: název tématu; kliknutí ovládá zobrazení detailu.
- Hodnota: živé číslo s jednotkou pod nadpisem, pokud ji okno zobrazuje.
- Transpirace používá stejné rozložení nadpisu, hodnoty a detailu jako Fotosyntéza. Nadpisy se nikdy nezalamují; skutečné vzorce se mohou zalomit uvnitř sloupců; vzorce zůstávají v Transpiraci viditelné i na úzké obrazovce.
- Vstupy výpočtu: drobný černý nezalamovaný řádek pod hodnotou ve dne; v noci se převrátí na světlou barvu.
- Detail se zobrazuje napravo od hlavních údajů a sází se od horního okraje okna.
- Fotosyntéza má společný začátek detailů tematických oken; v Transpiraci se šířka prvního sloupce přizpůsobuje nezalomenému nadpisu a tlačítku.
- Mezi sloupci je mezera 15 px; u dlouhého vzorce je výsledný odstup přibližně 15 px. Krátký vzorec Vody ponechává větší volný prostor.
- Prostor detailu zabírá výšku řádků nadpisu, hodnoty a vzorce; delší obsah má vlastní posuv.
- Ovládání: případný posuvník nebo jiný ovládací prvek v detailu.
- Konkrétní hodnoty, texty a ovládání jednotlivých oken určuje [Obsah oken](okna.md).

### Rozložení

- Podklad: [Untitled.svg](../../web_assets/ui_from_af/Untitled.svg), plátno přibližně 2020 × 1143.
- Fotosyntéza je vlevo dole; vpravo následují shora O₂, CO₂, Cukry a Voda.
- Transpirace používá stejné hlavní okno vlevo dole jako Fotosyntéza; vpravo jsou shora Příjem vody, Chlazení a Teplota. Každé má jednu hodnotu a vlastní detail ve společných sloupcích.
- Rozměry a procentní pozice se vztahují k ploše rozhraní, nikoli ke stromu.
- Pravá okna Transpirace: levý okraj 68 %, šířka 29 %, horní okraje 28 %, 48 % a 68 %; výška 14 %, nejméně 85 px. Rozteč horních okrajů je 20 % výšky rozhraní, nominální volný odstup 6 %; při uplatnění minimální výšky se zmenšuje.
- Do šířky 700 px: pravý sloupec začíná na 52 %, má šířku 44 %, horní okraje 22 %, 46 % a 70 % a výšku oken 17 %. Nominální volný odstup je 7 % výšky rozhraní.
- Při přenosu na jiný počet oken stanov jejich výšky a rozteče společně; mezi koncem obsahu jednoho okna a začátkem dalšího musí zůstat volné místo i při dlouhém nadpisu a otevřeném detailu. Dlouhý detail má vlastní posuv.
- U pevně umístěných oken vytvářej vnější odstup roztečí pozic; samotný margin bez úpravy sousedních pozic nezaručuje mezeru.
- Střed zůstává volný pro strom.
- Bloky jsou bez výplně a rámečku; vlevo mají nepravidelný svislý tah.
- Svislé tahy začínají u horního okraje okna; O₂, CO₂ a Cukry používají 65 % výšky svého bloku, Fotosyntéza 100 %.
- Tah Vody se roztahuje podle výšky řádků nadpisu, hodnoty a vzorce místo procentní výšky bloku.
- Do šířky 700 px zůstávají dva pevné sloupce; detaily mají místo pod nadpisem s vlastním posuvem a přehled vstupů je skrytý.

- Transpirace má vedle nadpisu viditelné kruhové tlačítko +/− pro otevření a zavření detailu. Záhlaví má sloupec podle šířky nezalomeného nadpisu a vlastní pevný sloupec tlačítka 28 px s mezerou 8 px; nadpis zůstává na jednom řádku, tlačítko nesmí zasahovat do detailu ani hodnoty. Otevření detailu nemění sílu barevného tahu; samostatná shrnutí a stavové nápisy nejsou součástí okna.
- Vlevo nad hlavním oknem je vysvětlení děje a svislé schéma s vodou stoupající od kořenů k listům; nad pravými okny je označení témat a krátká instrukce.

### Písmo

- Nadpis okna je vždy na jednom řádku. Velikost určuje společná typografická škála Fotosyntézy, bez dodatečného zmenšování podle délky názvu; pokud se záhlaví nevejde, má vodorovný posuv bez překrytí tlačítka a detailu.

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

- Dokument udržuj jako přenositelnou specifikaci vzhledu; schválené úpravy důležité pro zopakování doplň do definic i šablony, nejen do evidence změn.
- Uváděj měrné jednotky, vztažnou plochu procent, mezní šířku obrazovky a rozdíly variant; konkrétní texty a výpočty ponechávej v obsahu oken.
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
- Umístění: role a strana; levý a horní okraj v procentech plochy rozhraní.
- Rozměry: šířka, výška a minimální výška.
- Vnější odstupy: rozteč sousedních oken a volné místo po odečtení výšky; u pevných pozic uprav také pozice sousedů. Střed ponech stromu.
- Podklad: bez výplně, rámečku a spojnice ke stromu.
- Barevný tah: nepravidelná svislá linka vlevo v barvě tématu.
- Nadpis: Nohemi; hlavní okno má dominantní větší a tučnější nadpis, tematické okno menší nadpis.
- Hodnota: pod nadpisem, Nohemi v barvě tématu; popisek a jednotka v Satoshi.
- Vzorec / přehled vstupů: pod hodnotou, drobné Satoshi Medium; ve dne černý, v noci světlý.
- Detail: druhý sloupec napravo, zarovnaný k hornímu okraji okna, Satoshi Light; dlouhý text má vlastní posuv.
- Rozestup sloupců: 15 px; tematická okna stejného sloupce mají společný začátek detailů.
- Zavřený stav: nadpis, hodnota a vzorec zůstávají na místě; detail je skrytý.
- Otevřený stav: detail se zobrazí ve vyhrazeném prostoru bez posunutí sousedních oken.
- Ovládání: zvolená varianta — plocha nad nadpisem / viditelné +/− vedle nadpisu; u viditelné varianty určuj vlastní šířku tlačítka a mezeru. Nadpis se nikdy nezalamuje; zachovej definovanou velikost písma a přizpůsob šířku sloupce, při nedostatku místa umožni vodorovný posuv záhlaví. Fokus je viditelný. Konkrétní chování a výchozí stav určuje definice okna.
- Úzká obrazovka: dva pevné sloupce, definovaná typografická škála a detail pod hlavními údaji; Fotosyntéza skrývá přehled vstupů, Transpirace zachovává skutečné vzorce.
- Responzivní rozložení: mezní šířka obrazovky, pozice a rozměry oken, rozteče, zalamování a posuv dlouhého detailu; zachovej prostor pro tlačítko i otevřený text.
- Konkrétní nadpis, tag, hodnota, vzorec a detail: odkaz na definici v obsahu oken.
```
