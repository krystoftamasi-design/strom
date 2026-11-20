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
- Tematická okna Fotosyntézy používají návrh z Affinity. Vedle nadpisu je malované tlačítko +/−. Pod záhlavím jsou dva řádky s popiskem vlevo a hodnotou s jednotkou vpravo. Mezi řádky leží dvojitý vodorovný pruh s texturou z Affinity, vysoký přibližně 34 až 45 px (horní a dolní kolej oddělená mezerou 2 až 3 px).
- Podklad obou kolejí je ve dne tmavě modrý (`#151d3a`) a v noci světlejší (`#a3adc6`). Horní kolej zobrazuje horní údaj s barvou tématu, dolní kolej dolní údaj ve světlejším odstínu; oba tahy jsou samostatné a nepřekrývají se. U kyslíku, CO₂ a cukrů je nahoře produkce (`p`) a dole spotřeba (`s`), na škále 0 až maximum modelu pro plnou korunu. U vody patří horní řádek dostupnosti a dolní spotřebě (`s`); u světla patří horní řádek dostupnosti a dolní spotřebě (`s`). Škála vody odpovídá rozsahu dostupnosti vody (nejméně základnímu odparu) a škála světla je 0 až 100 %. Ovládání dostupnosti světla má viditelný úchyt, rozšířenou plochu a viditelný klávesnicový fokus.
- Pruhy mají zrcadlové koncovky. U upravitelných hodnot (dostupnost Světla a stropy Cukrů a Vody) nahrazuje horní pravou tmavou koncovku červený pohyblivý konec baru (`#ff1700`) se symbolem `−`, který lze táhnout myší i dotykem po celé délce horní koleje (0 až 100 %) a ovládat klávesnicí s viditelným fokusem. Při hodnotě zaokrouhlené na nulu zůstává písmenová značka na začátku pruhu a výplň daného toku má nulovou délku. Úchyt Světla ukazuje ruční nastavení a zůstává na místě i při změnách denního světla. V automatickém režimu je vpravo. Lze jej ovládat i z nulové polohy.
- Zásoba vody je vedle pruhů v kompaktním sloupci. Zásoba cukrů má větší kruhový graf široký 88 až 136 px podle dostupného místa. Nad kruhem je popisek „Zásoba cukrů“, uprostřed aktuální množství v kg. Kruhový graf ukazuje roční průběh od ledna nahoře po směru hodin. Vnější okraj označuje kapacitu, ryska s tečkou aktuální den a hodnotu. U cukrů vede tmavá ryska nad výplní až k vnitřnímu okraji. U značek jsou popisky Zima nahoře, Jaro vpravo, Léto dole a Podzim vlevo.

### Obecný obsah

- Údaje tvoří svislý blok: nadpis → hodnota s jednotkou → vzorec nebo přehled vstupů. Ve Fotosyntéze je vzorec nebo přehled vstupů v detailu.
- Detail Transpirace má vlastní posuv a je vpravo od údajů. V Semenaci je detail pod nadpisem. Hlavní okno používá variantu detailu pod údaji.
- Ve Fotosyntéze se pravá okna po otevření rozšíří o pruhy a vysvětlení. Na širší obrazovce je vysvětlení vedle nadpisu mírně výš a pruhy jsou pod ním přes šířku sloupce. U Cukrů se detail otevírá pod ukazateli. Text je zarovnaný doleva a vzorec má 12 až 15 px.
- Nadpis zůstává na jednom řádku bez zmenšování podle délky; při nedostatku místa je dostupný vodorovný posuv.
- Tlačítko +/− má vlastní prostor vedle nadpisu, odstup 8 px a viditelný fokus. Základní varianta má kruhový obrys o průměru 28 px.
- Ve Fotosyntéze tvoří tlačítko původní štětcový kroužek z Affinity, široký 19 až 25 px, se symbolem +/− v průhledném středu. Otvor kroužku míří od detailu. Klikací plocha je 28 až 35 px a kroužek se při najetí na okno zesvětlí.
- Konkrétní texty, hodnoty, ovládání a výchozí otevření detailů určuje [Obsah oken](okna.md).

### Rozložení

- V Transpiraci a Semenaci je uprostřed obrazovky velký nápis „soon ....“ písmem Nohemi Light. Obsah za ním je silně rozostřený a mírně ztmavený, menu zůstává ostré.

- Fotosyntéza má vlevo samostatný nadpis kapitoly a pod ním samostatné posuvné okno Cukry. Pruhy a kruhový graf mají vlastní výšku. Ovládání času je pod touto plochou a datum u levého spodního okraje.
- V Období jsou vlevo samostatný nadpis a průvodce. Kruh ročních období a ovládání času zůstávají u stromu.
- Kruh období má krátké štětcové rysky mezi úseky. Pevná ryska dole je výrazná plná zelená čára ve středu obrazovky (50 %) v ose stromu; ve Fotosyntéze je široká 16 px. Začátek každého úseku míjí pevnou rysku v den začátku období. V tu chvíli se úsek i jeho popisek zbarví světle zeleně.

- Aktuální vzor oken: Transpirace; původní grafický podklad: [podklad rozhraní](../../web_assets/ui_from_af/Untitled.svg), přibližně 2020 × 1143 px; procenta se vztahují k ploše rozhraní.
- Transpirace má vlevo průvodce (32 % výšky) a hlavní okno dole; tematická okna jsou vpravo a střed zůstává volný pro strom.
- Fotosyntéza řadí vpravo od stromu Světlo, O₂, CO₂ a Vodu pod sebe. Celý pravý sloupec lze posouvat.
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
- Vzorce i přehledy vstupů se mohou zalomit. Ve Fotosyntéze začíná pravý sloupec v úrovni okna Cukry a detail se otevírá pod pruhy. Kruh zásoby cukrů je pod pruhy. Jemný obrys písma pomáhá oddělit text od kresby stromu.

### Písmo

- Velikosti jsou v CSS pixelech; `vw` je 1 % šířky obrazovky. `clamp(minimum, plynulá velikost, maximum)` omezuje písmo mezi krajními hodnotami. Nejde o pevné velikosti ze SVG.
- Okna Fotosyntézy používají nadpis 27 až 56 px, hodnoty 16 až 26 px a popisky 13 až 20 px; velikosti se přizpůsobují prostoru.
- Tematický nadpis: Nohemi, váha 400, `clamp(27px, 2.63vw, 53px)`; hlavní nadpis: váha 500, `clamp(40px, 4.57vw, 92px)`. Oba mají řádkování 1,05 a prostrkání −0,035 em, bez vnějších okrajů.
- Tematická hodnota: Nohemi, váha 600, `clamp(20px, 1.15vw, 26px)`; hlavní hodnota: `clamp(38px, 4vw, 80px)`. Řádkování 1,1; číslice mají stejnou šířku. Nad hlavní hodnotou je odsazení 12 px.
- Popisky a tematické jednotky: Satoshi, váha 300, `clamp(11px, .83vw, 16px)`, řádkování 1,35. Odstavce hlavního i tematického detailu jsou větší a mají řez medium (váha 500): `clamp(16px, 1.05vw, 20px)`, řádkování 1,4; na úzké obrazovce 14 px. Tematická jednotka má odstup 4 px od čísla; hlavní jednotka dědí velikost a barvu hodnoty bez tohoto odstupu. Odstavce detailu mají dolní mezeru 8 px, poslední 0.
- Vzorec: Satoshi, váha 500, `clamp(8px, .6vw, 12px)`, řádkování 1,25, horní mezera 3 px. Skutečná rovnice se může zalomit.
- Symbol +/− je v písmu Satoshi s řádkováním 1. Základní varianta má 24 px, váhu 400 a rámeček 1 px, které se při najetí zbarví podle tématu. Fotosyntéza používá symbol 12 až 13 px s váhou 600. Fokus má obrys 2 px v barvě tématu, vzdálený 4 px.
- Do šířky 700 px: tematický nadpis `clamp(22px, 5vw, 32px)`, hlavní `clamp(18px, 4.5vw, 31px)`; tematická hodnota zůstává na společné škále (v tomto rozsahu 20 px), hlavní má 35 px. Text má 11 px, vzorec 9 px, odsazení nad hlavní hodnotou 6 px. Váhy, řádkování a velikost tlačítka se nemění.

### Barvy

- Číselné hodnoty ve Fotosyntéze používají barvu běžného textu podle denního nebo nočního režimu.

- Běžný text, nadpisy, tematické jednotky a vzorce používají ve dne `#181818` a v noci `#f0f2e9`. Barva tématu patří levým tahům a hodnotám mimo Fotosyntézu.
- Transpirace a Příjem vody: modrá `#2f49d6`; Teplota a Chlazení: růžovočervená `#ff1f4c`.
- Další témata: světlo `#ffcc00`, kyslík `#4fa2da`, CO₂ `#e5241c`, cukry `#ff9700` (dolní pruh `#ffc572`), listy `#51b700`, kořeny `#311619`.

### Šablona jednoho okna podle Transpirace

- Vzorem tematického okna je Teplota, Chlazení nebo Příjem vody; hlavní variantou je Transpirace. Společný základ tvoří barevný tah, blok údajů a samostatný detail podle pravidel výše.
- Tematické okno má první sloupec široký podle nezalomeného nadpisu a tlačítka; detail dostává zbývající šířku po odečtení mezery. Hlavní varianta používá samostatný detail pod údaji.
- Nadpis nebo tlačítko přepíná detail. Tlačítko je dostupné klávesnicí a oznamuje otevření. Viditelnost vzorce se řídí jeho umístěním v bloku údajů nebo v detailu. Výchozí stav určuje [Obsah oken](okna.md).
- Samostatní kontextoví průvodci sdílejí typografii. Text má v Období, Fotosyntéze a Transpiraci přibližně 19–31 px, na úzké obrazovce 16 px. Kompaktní průvodce Semenací má přibližně 12–17 px.
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
