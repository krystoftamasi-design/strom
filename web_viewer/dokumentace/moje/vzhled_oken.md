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
- Tematická okna Fotosyntézy používají návrh z Affinity. Vedle nadpisu je malované tlačítko +/−. Pod záhlavím jsou dva řádky s popiskem vlevo a hodnotou s jednotkou vpravo. Mezi řádky leží vodorovný pruh s texturou z Affinity, vysoký 31 až 42 px.
- Podklad pruhu je ve dne tmavě modrý a v noci světlejší. Poloha obou značek zleva doprava ukazuje hodnoty samostatně. U kyslíku, CO₂ a cukrů je v horním řádku produkce (P) a v dolním spotřeba (S), na škále 0 až maximum modelu pro plnou korunu. U vody patří horní řádek dostupnosti a dolní spotřebě; u světla patří horní řádek dostupnosti a dolní aktivitě. Škála vody odpovídá rozsahu dostupnosti vody (nejméně základnímu odparu) a škála světla je 0 až 100 %. Ovládání dostupnosti má viditelný úchyt, rozšířenou plochu a viditelný klávesnicový fokus.

- Tah má zrcadlové koncovky široké 11 až 14 px. Mezi nimi se barva kratšího toku mění na barvu delšího toku a pak na barvu nevyplněné části. Spotřeba má světlejší odstín. Značky s texturou štětce jsou široké 12 až 15 px a písmena jsou v nich vystředěná. Při hodnotě zaokrouhlené na nulu zůstává písmenová značka na začátku pruhu a výplň daného toku má nulovou délku. Úchyt posuvníku dostupnosti lze ovládat i na nule.
- Volitelná zásoba má vlastní pruh vpravo od toků. Nad levým koncem je tučný popisek „zásoba“, o 25 % větší než „produkce“. Pod levým koncem je výrazná šipka směru poslední změny zásoby, doprava při růstu a doleva při poklesu. Pod pravým koncem je aktuální množství s jednotkou, nejvýše s jedním desetinným místem. Značka Z ukazuje podíl na kapacitě. Původní štětcové znaky z Affinity zabírají polovinu šířky koncovky. Vlevo je červený znak s otvorem nahoru, vpravo zelený s otvorem dolů.

### Obecný obsah

- Údaje tvoří svislý blok: nadpis → hodnota s jednotkou → vzorec nebo přehled vstupů. Ve Fotosyntéze je vzorec nebo přehled vstupů v detailu.
- Detail Transpirace má vlastní posuv a je vpravo od údajů. V Semenaci je detail pod nadpisem. Hlavní okno používá variantu detailu pod údaji.
- Všechny detaily Fotosyntézy se otevírají vpravo vedle údajů. Při otevření detailu Cukrů nebo Vody se jejich zásoba posouvá až za detail a může přesáhnout pravý okraj obrazovky. Text detailu je zarovnaný doleva a vzorec má 12 až 15 px. Řádek se výškově přizpůsobí celému detailu bez vlastního posuvníku.
- Nadpis zůstává na jednom řádku bez zmenšování podle délky; při nedostatku místa je dostupný vodorovný posuv.
- Tlačítko +/− má vlastní prostor vedle nadpisu, odstup 8 px a viditelný fokus. Základní varianta má kruhový obrys o průměru 28 px.
- Ve Fotosyntéze tvoří tlačítko původní štětcový kroužek z Affinity, široký 19 až 25 px, se symbolem +/− v průhledném středu. Otvor kroužku míří od detailu. Klikací plocha je 28 až 35 px a kroužek se při najetí na okno zesvětlí.
- Konkrétní texty, hodnoty, ovládání a výchozí otevření detailů určuje [Obsah oken](okna.md).

- Doplňkové kruhové ukazatele cukrů a vody jsou ve Fotosyntéze vedle sebe pod ovládáním času. Výška hladké růžové či modré výplně odpovídá podílu na kapacitě. Kruhy mají stálou polohu a žádný obrys. Černá šipka uprostřed míří nahoru při růstu a dolů při poklesu. Množství s jednotkou je vedle kruhu ve výšce jeho středu. Text je na světlém pozadí černý. V režimu kruhů se vodorovné pruhy zásob ovládají jako procentuální posuvníky při zachování jejich vzhledu. Přepnutí popisují [Ovládací prvky](prvky.md).

### Rozložení

- Fotosyntéza má vlevo samostatný nadpis kapitoly a pod ním kontextového průvodce s vlastním svislým posuvem. Při změně věty se 15 sekund čeká, pak text 3 sekundy mizí a nový se 3 sekundy objevuje. Pod průvodcem jsou tlačítka přehrávání o velikosti 62 až 80 px rovnoměrně rozložená v řadě široké 200 až 300 px. Menší datum je u spodní hrany okna Voda a na úzké obrazovce pod posuvnou plochou oken. Ovládání i datum jsou zarovnané s levou hranou nadpisu.
- Kapitola Prototyp obsahuje tři ukazatele v písmu Nohemi Light. Volná plocha ukazatelů je šedá. První ukazuje zásobu cukrů jako sytě růžovou výplň v lehce nepravidelném kruhu. Výška hladiny odpovídá podílu na kapacitě. Hladina má jemné kreslené tahy a plynule se vlní. Ve druhém ukazateli dělí pohyblivé čáry kruh na části, větší tok je dole a podobné toky jsou vedle sebe. Tento kruh lze otáčet tažením nebo šipkami vlevo a vpravo. Třetí ukazatel je úzký obdélník napravo vedle stromu. Popisky P vlevo a S vpravo leží vně obdélníku, aby části mohly být nižší než písmena. Zásoba i toky ve druhé a třetí variantě jsou fialové. Větší tok má tmavší odstín. Nulové toky krátce dohasnou a jejich části se plynule stáhnou. Při omezení pohybu se hladina nevlní a změny hodnot se zobrazí okamžitě. Nad ukazateli je společné nastavení maxima v gramech. Pod prototypy je vlevo pro srovnání živé okno Cukry se stejnou šířkou jako ve Fotosyntéze. Řádky se při změně hodnot nezalamují.
- Období přebírá samostatný nadpis a průvodce vlevo z Fotosyntézy. Kruh ročních období a ovládání času zůstávají u stromu.
- Kruh období má krátké štětcové rysky mezi úseky. Pevná ryska dole je výrazná plná zelená čára, mírně vlevo od středu obrazovky v ose stromu. Začátek každého úseku míjí pevnou rysku v den začátku období. V tu chvíli se úsek i jeho popisek zbarví světle zeleně.

- Aktuální vzor oken: Transpirace; původní grafický podklad: [podklad rozhraní](../../web_assets/ui_from_af/Untitled.svg), přibližně 2020 × 1143 px; procenta se vztahují k ploše rozhraní.
- Transpirace má vlevo průvodce (32 % výšky) a hlavní okno dole; tematická okna jsou vpravo a střed zůstává volný pro strom.
- Fotosyntéza řadí vpravo od stromu okna Světlo, O₂, CO₂, Cukry a Voda pod sebe. Horní odstup je 7 %, dolní 6 % výšky a mezera před detailem nebo zásobou 16 až 30 px. Šířka okna je 13 % šířky obrazovky s mezemi 144 a 248 px. Posouvat lze celý sloupec.
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
- Vzorce i přehledy vstupů se mohou zalomit. Na úzké obrazovce začíná posuvná plocha oken Fotosyntézy pod ovládáním času. Jemný obrys písma pomáhá oddělit text od kresby stromu.

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
