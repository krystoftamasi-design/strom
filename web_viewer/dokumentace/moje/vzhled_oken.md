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

- Tlačítko +/− vedlejšího okna se zvýrazní při najetí na celou plochu okna včetně otevřeného detailu. Při najetí přímo na tlačítko se zvětší o 8 % s přechodem 160 ms. Aktivní nápověda provede jemný pulz každých 8 sekund. Při systémovém omezení pohybu se animace vypínají. Aktivaci a ukončení určuje [Obsah oken](okna.md).

- Okna mají pevné místo v rozhraní, nezávisle na stromu a kameře; nemají pohybové animace ani spojnice ke stromu.
- Změny hodnot neposouvají údaje ani sousední okna. Ve Fotosyntéze má hodnota pevné místo přibližně pro „100 %“ a celý blok údajů je klikací. U ostatních oken prázdná plocha propouští myš ke stromu.
- Bloky jsou bez výplně a rámečku. Mimo Fotosyntézu mají vlevo nepravidelný svislý tah v barvě tématu.
- Tematická okna Fotosyntézy používají návrh z Affinity. Nahoře je nadpis vlevo a malované tlačítko +/− vpravo. Pod záhlavím jsou dva řádky s popiskem vlevo a hodnotou s jednotkou vpravo. Mezi řádky leží vodorovný pruh s původní texturou z Affinity, vysoký 24 až 32 px.
- Na tlumeném podkladu pruhu jsou dvě značky. Jejich poloha zleva doprava ukazuje obě hodnoty samostatně. U kyslíku, CO₂ a cukrů je v horním řádku produkce (P) a v dolním spotřeba (S), na škále 0 až 7 g/min. U vody a světla patří horní řádek i horní značka dostupnosti, dolní řádek i dolní značka spotřebě. Škála vody odpovídá rozsahu dostupnosti vody a škála světla je 0 až 100 %. Ovládání dostupnosti má viditelný úchyt na konci značky, rozšířenou plochu a viditelný klávesnicový fokus.

- Výplně vodorovného pruhu Fotosyntézy jsou krycí. Tahy začínají vlevo rovně a končí v úzkých značkách s texturou štětce, širokých 11 až 14 px, s mírně zaoblenými rohy. Podklad má krátké rozšíření na obou koncích, široké 10 až 14 px. Písmena jsou vystředěná v koncovkách. Spotřeba má tmavší barvu a při překryvu leží větší hodnota pod menší.

### Obecný obsah

- Údaje tvoří svislý blok: nadpis → hodnota s jednotkou → vzorec nebo přehled vstupů. Ve Fotosyntéze je vzorec nebo přehled vstupů v detailu.
- Tematický detail má vlastní posuv. Je vpravo od údajů v Transpiraci a ve Fotosyntéze a pod nadpisem v Semenaci. Hlavní okno používá variantu detailu pod údaji.
- Detail Fotosyntézy se otevírá u O₂ vpravo a u CO₂ a Cukrů vlevo s odstupem 16 až 30 px (6 px pod horním okrajem okna); u Světla se otevírá pod údaji a u Vody nad údaji, čímž odsouvají ostatní okna bez překryvu. Otevřené CO₂ posune O₂ níže do třetího řádku. Detail v prvním sloupci odtlačí druhý sloupec doprava. Detail i vzdálenější sloupec mohou přesáhnout pravý okraj obrazovky. Pod vzorcem je odstavec široký nejvýše 88 % detailu s pravým odstupem 6 % jeho šířky. Text je zarovnaný doleva a má písmo o jeden bod menší než společná velikost detailu. Vzorec používá velikost 12 až 15 px.
- Nadpis zůstává na jednom řádku bez zmenšování podle délky; při nedostatku místa je dostupný vodorovný posuv.
- Tlačítko +/− má vlastní prostor vedle nadpisu, odstup 8 px a viditelný fokus. Základní varianta má kruhový obrys o průměru 28 px.
- Ve Fotosyntéze má tlačítko výplň ve tvaru malované částice o šířce přibližně 17 až 20 px a klikací plochu 22 až 28 px v barvě tématu s bílým +/−. Při najetí na okno se výplň zesvětlí a symbol ztmavne.
- Konkrétní texty, hodnoty, ovládání a výchozí otevření detailů určuje [Obsah oken](okna.md).

### Rozložení

- Fotosyntéza má vlevo samostatný nadpis kapitoly a pod ním kontextového průvodce s vlastním svislým posuvem. Při změně věty se 15 sekund čeká, pak text 3 sekundy mizí a nový se 3 sekundy objevuje.
- Prototyp bilance O₂ je kruh pod textem průvodce. Zásoba (Z) je nahoře a její hladina stoupá ode dna oddílu. Pohyblivé čáry oddělují produkci (P) a spotřebu (S). Větší tok je dole, při shodě je dole spotřeba. Části si ponechávají místo na písmeno i při nulové hodnotě. Pod kruhem je nastavení maxima v gramech. Na úzké obrazovce se pro prototyp vyhradí místo nad tematickými okny a kapitola se dá posouvat.
- Období přebírá samostatný nadpis a průvodce vlevo z Fotosyntézy. Kruh ročních období a ovládání času zůstávají u stromu.

- Aktuální vzor oken: Transpirace; původní grafický podklad: [podklad rozhraní](../../web_assets/ui_from_af/Untitled.svg), přibližně 2020 × 1143 px; procenta se vztahují k ploše rozhraní.
- Transpirace má vlevo průvodce (32 % výšky) a hlavní okno dole; tematická okna jsou vpravo a střed zůstává volný pro strom.
- Fotosyntéza: čtyři řádky vpravo od stromu — nahoře vycentrované Světlo, pod ním vlevo O₂ a vpravo CO₂, dále vpravo Cukry a dole vycentrovaná Voda. Horní odstup je 7 %, dolní 6 % výšky, pravý odstup přibližně 3 % a mezera mezi sloupci 16 až 30 px. Šířka okna je 12 % šířky obrazovky s mezemi 132 a 224 px. Velmi nízká obrazovka umožní svislý posuv.
- Transpirace: vpravo shora Teplota, Chlazení a Příjem vody; první sloupec se přizpůsobuje nezalomenému nadpisu a tlačítku.
- Hlavní okno Transpirace: levý okraj 6 %, horní okraj 65 %, šířka 55 %, výška 21 %, nejméně 140 px.
- Pravá okna Transpirace: levý okraj 68 %, šířka 29 %, horní okraje 28 / 48 / 68 %, výška 14 %, nejméně 85 px.
- Levé odsazení obsahu je 20 px. Tematický tah má šířku 8 px a 65 % výšky vlastního okna; hlavní tah 12 px a 100 %. Nepravidelný obrys vybírá jedna z pěti obrazových masek.
- Mezi okny zůstává volný prostor; dlouhý detail se posouvá uvnitř svého okna. Výjimka Semenace: stručné detaily i kontext jsou bez posuvníků, celé čitelné a bez ořezu; detail tematického okna je pod nadpisem.

### Úzká obrazovka

- Do šířky 700 px zůstávají dva pevné sloupce. V Transpiraci se detaily otevírají pod údaji a mají vlastní posuv.
- Pravý sloupec začíná na 52 % a má šířku 44 %; okna Transpirace mají horní okraje 26 / 46 / 70 % a výšku 17 %.
- Hlavní okno: levý okraj 4 %, horní 65 %, šířka 44 %, výška 24 %; minimální výška oken se ruší. Odsazení obsahu je 12 px, tematický tah má šířku 5 px a hlavní 6 px. Tematický detail má nad sebou mezeru 8 px.
- Používá se společná typografická škála pro úzkou obrazovku, bez výjimek podle délky nadpisu.
- Vzorce i přehledy vstupů se mohou zalomit. Sloupce Fotosyntézy začínají pod průvodcem ve 39 % výšky obrazovky a mají dolní odstup 12 % kvůli ovládání času. Detail má šířku nejvýše 42 % obrazovky.

### Písmo

- Velikosti jsou v CSS pixelech; `vw` je 1 % šířky obrazovky. `clamp(minimum, plynulá velikost, maximum)` omezuje písmo mezi krajními hodnotami. Nejde o pevné velikosti ze SVG.
- Okna Fotosyntézy používají nadpis 25 až 52 px, hodnoty 15 až 24 px a popisky 12 až 18 px; velikosti se přizpůsobují prostoru.
- Tematický nadpis: Nohemi, váha 400, `clamp(27px, 2.63vw, 53px)`; hlavní nadpis: váha 500, `clamp(40px, 4.57vw, 92px)`. Oba mají řádkování 1,05 a prostrkání −0,035 em, bez vnějších okrajů.
- Tematická hodnota: Nohemi, váha 600, `clamp(20px, 1.15vw, 26px)`; hlavní hodnota: `clamp(38px, 4vw, 80px)`. Řádkování 1,1; číslice mají stejnou šířku. Nad hlavní hodnotou je odsazení 12 px.
- Popisky a tematické jednotky: Satoshi, váha 300, `clamp(11px, .83vw, 16px)`, řádkování 1,35. Odstavce hlavního i tematického detailu jsou větší a mají řez medium (váha 500): `clamp(16px, 1.05vw, 20px)`, řádkování 1,4; na úzké obrazovce 14 px. Tematická jednotka má odstup 4 px od čísla; hlavní jednotka dědí velikost a barvu hodnoty bez tohoto odstupu. Odstavce detailu mají dolní mezeru 8 px, poslední 0.
- Vzorec: Satoshi, váha 500, `clamp(8px, .6vw, 12px)`, řádkování 1,25, horní mezera 3 px. Skutečná rovnice se může zalomit.
- Symbol +/− je v písmu Satoshi s řádkováním 1. Základní varianta má 24 px, váhu 400 a rámeček 1 px, které se při najetí zbarví podle tématu. Fotosyntéza používá symbol 15 px s váhou 600. Fokus má obrys 2 px v barvě tématu, vzdálený 4 px.
- Do šířky 700 px: tematický nadpis `clamp(22px, 5vw, 32px)`, hlavní `clamp(18px, 4.5vw, 31px)`; tematická hodnota zůstává na společné škále (v tomto rozsahu 20 px), hlavní má 35 px. Text má 11 px, vzorec 9 px, odsazení nad hlavní hodnotou 6 px. Váhy, řádkování a velikost tlačítka se nemění.

### Barvy

- Číselné hodnoty ve Fotosyntéze používají barvu běžného textu podle denního nebo nočního režimu.

- Běžný text, nadpisy, tematické jednotky a vzorce používají ve dne `#181818` a v noci `#f0f2e9`. Barva tématu patří levým tahům a hodnotám mimo Fotosyntézu.
- Transpirace a Příjem vody: modrá `#2f49d6`; Teplota a Chlazení: růžovočervená `#ff1f4c`.
- Další témata: světlo `#ffcc00`, kyslík `#4fa2da`, CO₂ `#ff583c`, cukry `#d42fd5`, listy `#51b700`, kořeny `#311619`.

### Šablona jednoho okna podle Transpirace

- Vzorem tematického okna je Teplota, Chlazení nebo Příjem vody; hlavní variantou je Transpirace. Společný základ tvoří barevný tah, blok údajů a samostatný detail podle pravidel výše.
- Tematické okno má první sloupec široký podle nezalomeného nadpisu a tlačítka; detail dostává zbývající šířku po odečtení mezery. Hlavní varianta používá samostatný detail pod údaji.
- Nadpis nebo tlačítko přepíná detail. Tlačítko je dostupné klávesnicí a oznamuje otevření. Viditelnost vzorce se řídí jeho umístěním v bloku údajů nebo v detailu. Výchozí stav určuje [Obsah oken](okna.md).
- Samostatný průvodce kapitoly není součástí šablony okna.
- U dalšího okna určuj pouze roli, umístění, rozměry a případnou vzhledovou odlišnost; obsah patří do [Obsahu oken](okna.md).
- Technické použití společné komponenty popisuje [Architektura oken](../system/architektura_oken.md#rozložení).

### Šablona hlavního okna

- Nadpis, hodnota a vzorec zůstávají na pevném místě vlevo dole. Prázdná plocha hlavního okna propouští tažení ke stromu podle společného pravidla statických oken.
- Detail se otevírá pod spodním okrajem pevného okna zarovnaný k levému okraji údajů, s odstupem 14 px, na úzké obrazovce 8 px; šířka je nejvýše 44 znakových jednotek a zároveň uvnitř šířky okna.
- Detail nezvětšuje okno, má vlastní posuv a maximální výšku 10 % obrazovky, na úzké obrazovce 8 %.
- Otevření ani délka textu neposouvá údaje a sousední okna. Varianta platí pro kapitoly s hlavním oknem.
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
