---
history:
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: "Přeskupeno pořadí pravých oken Transpirace: nahoře Teplota, uprostřed Chlazení a dole Příjem vody."
  - thread_id: 01a19439-ee7f-71f1-af82-4e2ff1146c5f
    date: 2026-11-01
    change: Zkrácena specifikace vzhledu, sloučeny duplicity a odstraněna pravidla obsahu a technické návody.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zjednodušena komponenta na nezávislý blok údajů a detailu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Sjednoceny společné části oken a datové varianty jejich vzhledu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zachována definovaná velikost nadpisů bez zmenšování podle obsahu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zakázáno zalamování nadpisů oken a upraven prostor záhlaví.

---

# Vzhled oken

## Statická okna

- Při najetí na vedlejší okno se tlačítko +/− zvýrazní barvou tématu. Při najetí přímo na tlačítko se zvětší o 8 % s přechodem 160 ms. Aktivní nápověda provede jemný pulz zvětšení a návratu každých 8 sekund; hover má přednost. Při systémovém omezení pohybu se animace vypínají. Aktivaci a ukončení určuje [Obsah oken](okna.md).

- Okna mají pevné místo v rozhraní, nezávisle na stromu a kameře; nemají pohybové animace ani spojnice ke stromu.
- Změny hodnot a otevření detailu neposouvají údaje ani sousední okna. Prázdná plocha společných oken propouští myš ke stromu; nadpis, tlačítko a otevřený detail zůstávají ovladatelné.
- Bloky jsou bez výplně a rámečku, s nepravidelným svislým tahem vlevo v barvě tématu.
- Tematická okna Fotosyntézy mají místo svislého tahu dva vodorovné pruhy vysoké 8 px s původní nepravidelnou texturou. Horní je nad prvním údajem a plní se zleva; spodní je nad druhým údajem a plní se zprava. Zbytek každého pruhu zůstává zeslabený. Ovládání dostupnosti vody má rozšířenou plochu a viditelný klávesnicový fokus.

### Obecný obsah

- Údaje tvoří svislý blok: nadpis → hodnota s jednotkou → vzorec nebo přehled vstupů.
- Pravá tematická okna začínají na 70 % šířky a mají šířku 27 %; do šířky 700 px začínají na 52 % a mají šířku 44 %.
- Tematické okno má detail vpravo, zarovnaný k hornímu okraji, s vlastním posuvem a mezerou 15 px. Hlavní okno používá variantu detailu pod údaji.
- Nadpis zůstává na jednom řádku bez zmenšování podle délky; při nedostatku místa je dostupný vodorovný posuv.
- Viditelné tlačítko +/− je kruhové, široké 28 px, s odstupem 8 px od nadpisu a vlastním prostorem; fokus je viditelný.
- Konkrétní texty, hodnoty, ovládání a výchozí otevření detailů určuje [Obsah oken](okna.md).

### Rozložení

- Výjimka Fotosyntézy: hlavní okno je vlevo nahoře na úrovni prvního pravého okna (25 %, do šířky 700 px 22 %). Kontextový průvodce začíná 15 % výšky obrazovky pod hlavním oknem, má stejný levý okraj a vlastní svislý posuv; čas je pod ním u spodního okraje. Při změně věty se 15 sekund čeká, pak text 3 sekundy mizí a nový se 3 sekundy objevuje. Ostatní rozměry a poloha detailu hlavního okna zůstávají podle společné šablony.

- Aktuální vzor oken: Transpirace; původní grafický podklad: [podklad rozhraní](../../web_assets/ui_from_af/Untitled.svg), přibližně 2020 × 1143 px; procenta se vztahují k ploše rozhraní.
- Transpirace má vlevo shora ovládání času (16 % výšky), průvodce (32 %) a hlavní okno dole; tematická okna jsou vpravo a střed zůstává volný pro strom.
- Fotosyntéza: vpravo shora O₂, CO₂, Cukry a Voda; stejně jako u Transpirace se první sloupec přizpůsobuje nadpisu a tlačítku. Pravá okna mají horní okraje 28 / 42 / 58 / 74 %, poslední výšku 18 %; ostatní sdílené rozměry zůstávají.
- Transpirace: vpravo shora Teplota, Chlazení a Příjem vody; první sloupec se přizpůsobuje nezalomenému nadpisu a tlačítku.
- Hlavní okno Transpirace: levý okraj 6 %, horní okraj 65 %, šířka 55 %, výška 21 %, nejméně 140 px.
- Pravá okna Transpirace: levý okraj 68 %, šířka 29 %, horní okraje 28 / 48 / 68 %, výška 14 %, nejméně 85 px.
- Levé odsazení obsahu je 20 px. Tematický tah má šířku 8 px a 65 % výšky vlastního okna; hlavní tah 12 px a 100 %. Nepravidelný obrys vybírá jedna z pěti obrazových masek.
- Mezi okny zůstává volný prostor; dlouhý detail se posouvá uvnitř svého okna. Výjimka Semenace: stručné detaily i kontext jsou bez posuvníků, celé čitelné a bez ořezu; detail tematického okna je pod nadpisem.

### Úzká obrazovka

- Do šířky 700 px zůstávají dva pevné sloupce; tematický detail je pod údaji, hlavní detail je také pod nimi. Oba mají vlastní posuv.
- Pravý sloupec začíná na 52 % a má šířku 44 %; okna Transpirace mají horní okraje 26 / 46 / 70 % a výšku 17 %.
- Hlavní okno: levý okraj 4 %, horní 65 %, šířka 44 %, výška 24 %; minimální výška oken se ruší. Odsazení obsahu je 12 px, tematický tah má šířku 5 px a hlavní 6 px. Tematický detail má nad sebou mezeru 8 px.
- Používá se společná typografická škála pro úzkou obrazovku, bez výjimek podle délky nadpisu.
- Vzorce i přehledy vstupů obou kapitol zůstávají viditelné a mohou se zalomit. Fotosyntéza má pravá okna na 22 / 40 / 58 / 76 %, poslední výšku 20 %.

### Písmo

- Velikosti jsou v CSS pixelech; `vw` je 1 % šířky obrazovky. `clamp(minimum, plynulá velikost, maximum)` omezuje písmo mezi krajními hodnotami. Nejde o pevné velikosti ze SVG.
- Tematický nadpis: Nohemi, váha 400, `clamp(27px, 2.63vw, 53px)`; hlavní nadpis: váha 500, `clamp(40px, 4.57vw, 92px)`. Oba mají řádkování 1,05 a prostrkání −0,035 em, bez vnějších okrajů.
- Tematická hodnota: Nohemi, váha 600, `clamp(20px, 1.15vw, 26px)`; hlavní hodnota: `clamp(38px, 4vw, 80px)`. Řádkování 1,1; číslice mají stejnou šířku. Nad hlavní hodnotou je odsazení 12 px.
- Popisky a tematické jednotky: Satoshi, váha 300, `clamp(11px, .83vw, 16px)`, řádkování 1,35. Odstavce hlavního i tematického detailu jsou větší a mají řez medium (váha 500): `clamp(16px, 1.05vw, 20px)`, řádkování 1,4; na úzké obrazovce 14 px. Tematická jednotka má odstup 4 px od čísla; hlavní jednotka dědí velikost a barvu hodnoty bez tohoto odstupu. Odstavce detailu mají dolní mezeru 8 px, poslední 0.
- Vzorec: Satoshi, váha 500, `clamp(8px, .6vw, 12px)`, řádkování 1,25, horní mezera 3 px. Skutečná rovnice se může zalomit.
- Symbol +/−: Satoshi, váha 400, 24 px, řádkování 1; uprostřed tlačítka 28 × 28 px s rámečkem 1 px. Fokus má obrys 2 px v barvě tématu, vzdálený 4 px; při najetí se symbol i rámeček přebarví do tématu.
- Do šířky 700 px: tematický nadpis `clamp(22px, 5vw, 32px)`, hlavní `clamp(18px, 4.5vw, 31px)`; tematická hodnota zůstává na společné škále (v tomto rozsahu 20 px), hlavní má 35 px. Text má 11 px, vzorec 9 px, odsazení nad hlavní hodnotou 6 px. Váhy, řádkování a velikost tlačítka se nemění.

### Barvy

- Běžný text, nadpisy, tematické jednotky a vzorce: ve dne `#181818`, v noci `#f0f2e9`. Hodnoty a levé tahy používají barvu tématu v obou režimech.
- Transpirace a Příjem vody: modrá `#2f49d6`; Teplota a Chlazení: růžovočervená `#ff1f4c`.
- Další témata: světlo `#ffcc00`, kyslík `#4fa2da`, CO₂ `#ff583c`, cukry `#d42fd5`, listy `#51b700`, kořeny `#311619`.

### Šablona jednoho okna podle Transpirace

- Vzorem tematického okna je Teplota, Chlazení nebo Příjem vody; hlavní variantou je Transpirace. Společný základ tvoří barevný tah, blok údajů a samostatný detail podle pravidel výše.
- Tematické okno má první sloupec široký podle nezalomeného nadpisu a tlačítka; detail dostává zbývající šířku po odečtení mezery. Hlavní varianta používá samostatný detail pod údaji.
- Nadpis nebo tlačítko přepíná detail; tlačítko je dostupné klávesnicí a oznamuje otevření. Zavření skryje pouze detail, hodnota i vzorec zůstávají. Hlavní detaily obou kapitol jsou výchozí otevřené, tematické zavřené a jejich stav se zachovává při změně kapitoly podle [Obsahu oken](okna.md#kapitola-transpirace).
- Samostatný průvodce kapitoly není součástí šablony okna.
- U dalšího okna určuj pouze roli, umístění, rozměry a případnou vzhledovou odlišnost; obsah patří do [Obsahu oken](okna.md).
- Technické použití společné komponenty popisuje [Architektura oken](../system/architektura_oken.md#rozložení).

### Šablona hlavního okna

- Nadpis, hodnota a vzorec zůstávají na pevném místě vlevo dole. Prázdná plocha hlavního okna propouští tažení ke stromu podle společného pravidla statických oken.
- Detail se otevírá pod spodním okrajem pevného okna zarovnaný k levému okraji údajů, s odstupem 14 px, na úzké obrazovce 8 px; šířka je nejvýše 44 znakových jednotek a zároveň uvnitř šířky okna.
- Detail nezvětšuje okno, má vlastní posuv a maximální výšku 10 % obrazovky, na úzké obrazovce 8 %.
- Otevření ani délka textu neposouvá údaje a sousední okna. Stejná varianta platí pro hlavní okna všech kapitol.
- Výchozí otevření určuje obsah okna, nikoli šablona.

[Obsah oken](okna.md) · [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Název dokumentu má úroveň `#`, společná oblast `##` a témata `###`.
- Témata řaď: obecný obsah → rozložení → úzká obrazovka → písmo → barvy → šablona okna → šablona hlavního okna.
- Každé pravidlo vzhledu uveď jednou; obsah a ovládání odkazuj do `okna.md`, technické návody do architektury.
- U rozměrů uváděj jednotky, vztažnou plochu procent a mezní šířku obrazovky.
- Historii ponechávej ve frontmatteru a odkazy před touto závěrečnou částí.

```markdown
# Název dokumentu

## Název oblasti

- Společný vzhled.

### Obecný obsah

- Skladba okna a odkaz na obsah.

### Rozložení

- Poloha, rozměry a odlišnosti kapitol.

### Úzká obrazovka

- Mezní šířka a přizpůsobení rozložení.

### Písmo

- Typografické pravidlo.

### Barvy

- Barevné pravidlo.

### Šablona jednoho okna podle vzoru

- Společný základ a odkaz na použití.

### Šablona hlavního okna

- Poloha detailu pod údaji, odstup a omezení posuvu.

[Související dokument](../soubor.md)

## Pravidla struktury

- Pravidlo členění.
```
