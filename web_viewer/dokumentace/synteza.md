# Syntéza projektu STROM

- Zpracováno 12. 11. 2026 z místních Markdown dokumentů, včetně rozpracovaných změn. Jde o interpretační přehled; platné definice zůstávají v původních dokumentech.
- Inventura našla 127 MD mimo Git: 69 projektových dokumentů, 4 pracovní záznamy agentů, 18 pracovních listů mapy projektu a 36 převzatých dokumentů nástrojů a knihoven. Obsahově byly zpracovány projektové a pracovní podklady; převzaté licence a podrobné návody cizích nástrojů byly inventarizovány, nikoli převáděny na požadavky STROM.
- Syntéza neověřuje současný běh webu ani původní vědecké publikace, na které výpisky odkazují.

## Společný smysl projektu

STROM je výukový projekt, který má studentovi umožnit pochopit strom jako propojený živý systém. Jeho hlavním tématem nejsou jednotlivé názvy částí stromu, ale vztahy: odkud pochází hmota nového dřeva, jak se voda dostane do listů, proč odpar ochlazuje a k čemu strom potřebuje cukry.

Dokumenty zachycují posun od technického 3D prohlížeče a experimentů s projekcí k samostatně použitelné vzdělávací aplikaci. Současná strategie míří na studenta doma u počítače, bez učitele a bez průběžné nápovědy. Model buku, animace, texty a ovládání mají společně vysvětlovat příčiny a následky.

Nejsilnější společný závěr podkladů je tento: **3D strom potřebuje jasný výklad, který propojí pozorovaný pohyb s jeho významem.** Autorova reflexe připouští, že jednoduchý text někdy vztah vysvětlí lépe než samotný model. To nevyvrací přínos 3D; vymezuje jeho užitečnou úlohu při ukazování prostoru, tras a proměn v čase.

Zdroje: [Strategie](moje/strategie.md), [problémy porozumění](moje/strategi_problems.md), [uvědomění](moje/uvedomení.md), [uživatelské testy](moje/tests.md).

## Jeden systém: voda, uhlík, energie a čas

Biologické podklady lze spojit do následujícího řetězce:

1. **Kořeny a půda:** příjem vody a minerálních živin, vztahy s mykorhizou a mechanické ukotvení stromu.
2. **Xylém a koruna:** doprava vody ke koruně v souvislosti s výparem z listů. Voda zároveň ovlivňuje stav pletiv a možnosti dalšího metabolismu.
3. **Průduchy:** společné místo výměny plynů a vodní páry; propojují příjem CO₂ s vodním hospodařením a chlazením.
4. **Fotosyntéza a cukry:** světlo umožňuje tvorbu cukrů z vstupních látek. Cukry poskytují materiál pro růst i zdroj energie pro živé buňky.
5. **Floém, zásoby a růst:** produkty fotosyntézy se přesouvají ze zdrojů do míst spotřeby nebo ukládání. Směr nelze obecně redukovat na pohyb dolů; na jaře mohou zásoby zásobovat nové listy.
6. **Obrana a stabilita:** růst, zásoby, ohraničování poškození a mechanická stavba pomáhají stromu přežívat změny prostředí.

Nedostatek vody proto není izolovaný efekt modré linky. V pojetí podkladů se promítá do výparu, příjmu CO₂, chlazení a růstu. Právě tyto vazby poskytují společný příběh pro různé kapitoly.

Čas má několik měřítek: denní změny světla a vody, sezonní rašení a opad, růst letokruhů, dlouhodobé změny vitality a šíření druhu přes generace. Jedna roční animace nemůže současně představovat všechny tyto procesy ve skutečném měřítku.

Zdroje: [kartotéka procesů](../../KARTOTEKA_STROMU.md), [dashboard biologických karet](../../STROM_VAULT/00_DASHBOARD.md), [anatomické podklady](../../dokumentace/Milos_Pejchal_Morfologie_a_Anatomie_Drevin_MENDELU.md), [biologický přehled](../../dokumentace/ISA_Tree_Biology_Chapter_1_Comprehensive_Guide.md), [obrana stromu](../../dokumentace/Alex_Shigo_Tree_Basics_Core_Principles.md).

## Jak se tento příběh promítá do webu

| Kapitola | Hlavní souvislost | Stav popsaný dokumenty |
| --- | --- | --- |
| Období | Změna stromu v průběhu roku a orientace v modelovém čase. | Ovládání kruhem je definované; obsahový rozcestník má dosud prázdné části. |
| Fotosyntéza | Světlo, voda a CO₂ souvisejí s tvorbou cukrů a uvolňováním O₂. | Podrobně definovaná okna, linky, částice a tematické texty; evidence obsahuje řadu implementovaných úprav. |
| Transpirace | Odpar v listech pomáhá táhnout vodu od kořenů a spotřebovává teplo. | Definovaná okna Transpirace, Příjem vody, Chlazení a Teplota, vodní trasa a částice páry. |
| Semenace | Od opylení přes vývoj bukvic k pádu, přezimování a možnému klíčení. | Evidence popisuje modely v koruně a pád semen; původní návrh navazuje na záznamy implementace. Přesné počty a přežití vyžadují zdroje. |
| Kořeny | Příjem, zásoby, vztahy s půdou a ukotvení. | Bohaté biologické podklady; samotný obsahový rozcestník kapitolu podrobně nerozepisuje. |

Úvodní animace zůstává součástí zkušenosti, ale Úvod podle současné definice není položkou nabídky. Biologická kartotéka má širší rozsah než hlavní web: CODIT, kavitace, letokruhy, kořenové srůsty nebo veteráni jsou zásobníkem témat, nikoli automaticky hotovými kapitolami.

Zdroje: [architektura obsahu](architektura_obsahu.md), [okna](moje/okna.md), [elementy](moje/elementy.md), [ovládání](moje/prvky.md), [evidence změn](zmeny.md).

## Společný jazyk rozhraní

- Každá kapitola má hlavní proces a tematická okna. Okno spojuje název, hodnotu s jednotkou, vztah nebo vstupy výpočtu a stručné vysvětlení.
- Okna mají pevnou polohu v rozhraní. Detail se otevírá nadpisem nebo tlačítkem +/−; jeho otevření nemá posouvat hodnoty a sousední okna.
- Vazbu na děj ve stromu určuje společný tematický tag. Otevření nebo najetí na související okno zvýrazní konkrétní linku či částice; samotná shoda barvy vazbu nevytváří.
- Barvy a kreslené tahy rozlišují témata, písma Nohemi a Satoshi vytvářejí hierarchii. Přístupnost zahrnuje ovládání klávesnicí, viditelný fokus a čitelné detaily.
- Krátký průvodní text vysvětluje smysl sledovaného děje. Neměl by vyžadovat, aby student nejdřív rozluštil čísla nebo odborné názvy.

Z toho vyplývá vhodná výkladová posloupnost: **krátké vysvětlení → pozorování děje → prozkoumání příčiny → detail a čísla**. Jde o závěr syntézy, nikoli nově schválenou úpravu rozhraní.

Zdroje: [vzhled oken](moje/vzhled_oken.md), [texty](moje/texty.md), [kontextové texty](moje/kontextove_texty.md), [technická architektura oken](system/architektura_oken.md).

## Technický základ a jeho hranice

Dokumentace popisuje jednu scénu stromu a sdílený model, nad nimiž se přepínají kapitoly. Výpočty vody, fotosyntézy a cukrů patří do `ekologie`; listy, období, vykreslování, okna a kapitoly mají vlastní moduly. Společná okna přijímají obsah jako data, aby každá kapitola nevytvářela odlišnou komponentu.

Grafická vrstva převádí podklady z Blenderu do webového vykreslování: pracuje s maskami, texturami, sezonními atributy, světlem a stíny. Geometrické trasování vytváří křivky pro znázornění transportu. Odlehčení modelu a ukládání stínových map řešily výkon; starší benchmark omezený obnovovací frekvencí ale nedokládá univerzální zrychlení na každém zařízení.

Výukový model je zjednodušení. Geometrický objem není měření skutečného stromu, počet vykreslených listů není automaticky listová plocha a počet částic není množství látky. Zásoba vody a tok vody jsou různé veličiny. Chladicí výkon v kW není pokles teploty ve °C. Zobrazená tvorba cukrů v ekvivalentu glukózy není měřená zásoba cukrů ani úplný popis transportovaných látek.

Samostatnou experimentální větev tvoří sledování hlavy a asymetrická projekce v Blenderu, Unity a webu. Jejím tématem je monitor jako virtuální okno reagující na polohu pozorovatele. Dokumentace těchto variant nedokládá jejich zapojení do současného hlavního webu.

Zdroje: [struktura projektu](struktura_projektu.md), [architektonický brief](../../architektura.md), [pracovní poznámky](../../architektura_pracovni_poznamky.md), [shadery](../../README_SHADER_EXPLANATION.md), [trasování](../../README_CEVNI_SYSTEM_TRASOVANI.md), [off-axis výklad](../../dokumentace/KOOIMA_OFF_AXIS_CESKY.md).

## Co skutečně víme z ověřování

Strategie stanoví cíl: po minutě samostatného prozkoumání Fotosyntézy má student pojmenovat klíčové prvky a vysvětlit alespoň jednu souvislost. Zamýšlený práh je čtyři úspěšní studenti z pěti. Dokumenty neobsahují doložené splnění tohoto testu.

Neformální test s mámou ukázal nejasné otevírání detailů, malé částice a slabé propojení oken s dějem. Kruh období byl srozumitelný. Komentovaná ukázka s Pavlem upozornila na soupeření textů, čísel a stromu o pozornost, souběžné změny textů, kontrast a nejasnou orientaci v období. Jsou to konkrétní podněty, nikoli reprezentativní výsledky cílové skupiny.

Evidence změn obsahovala při zpracování 120 zápisů se stavem Implementováno a jeden Čeká; oddíl Ověřeno byl prázdný. Některé zápisy přitom popisují úspěšné dílčí testy nebo kontrolu v Chromu. Prázdný oddíl tedy neznamená, že nic nebylo testováno; znamená, že evidence nedokládá plošné finální ověření.

UNISAL předpovídá vizuální pozornost ze snímku nebo videa. Mapa doplněná klikáním a myší obsahuje další heuristické předpoklady. Ani jeden výstup neměří skutečný pohled studenta ani jeho porozumění.

Zdroje: [testy](moje/tests.md), [strategie](moje/strategie.md), [změny](zmeny.md), [UNISAL](../tools/UNISAL.md). Starý [report fotosyntézy](../../qa_fotosynteza_20261025/BUG_REPORT.md) výslovně uvádí opravu tehdejších tří závad; nelze je bez další kontroly označit za dnešní chyby.

## Stav zjištěných nesouladů

- Kontextové texty a číselné výstupy O₂ a CO₂ jsou upřesněny v přehledu struktury a technické architektuře. Rozměry pravých oken Transpirace odpovídají společnému pravidlu 70 % / 27 %.
- Evidence návrhu Semenace navazuje na novější implementaci; duplicitní označení záznamu zvýraznění je změněno na Z124.
- U xylému a CODIT označují biologické karty stav jako neověřený. Nepodložená srovnání teplot a chybná jednotka výkonu byly odstraněny; příklad cév letokruhů je omezen na kruhovitě pórovité dřeviny.
- Starší architektura a pracovní postupy zůstávají historickými podklady; aktuální pravidla určuje [AGENTS.md](../../AGENTS.md).
- Pět dříve nalezených dvojic souborů představovalo kopie. Kartotéky byly upraveny souběžně, další archivní kopie zůstávají zachovány.

## Priority vyplývající ze syntézy

1. **Ověřit porozumění hlavním vztahům.** Největší otevřená otázka je, zda student samostatně vysvětlí původ uhlíku, účel cukrů a vztah odparu k tahu vody a chlazení.
2. **Ujasnit pořadí pozornosti.** Text, čísla, strom a otevřené detaily mají tvořit srozumitelný postup. Poznatky z ukázek zatím neprokazují, že poslední úpravy problém vyřešily.
3. **Sjednotit stav dokumentace.** Oddělit současné definice, rozpracované varianty a historii; vyřešit konkrétní rozpory bez plošného přepisování podkladů.
4. **Zpřesnit biologické hranice modelu.** U důležitých čísel uvádět původ a podmínky, rozlišovat skutečný proces od jeho grafické zkratky a příklady vztahovat k buku.
5. **Dořešit dostupnost pro studenta.** Strategie stále označuje veřejnou URL, načítání modelu a výkon běžných notebooků za otevřené otázky.

To jsou doporučení odvozená ze společného čtení dokumentů. Nápady jako zvuk, sandbox, další biologické kapitoly nebo prostorové instalace zůstávají možnostmi dalšího rozvoje, nikoli novými požadavky na realizaci.

## Mapa zpracovaných podkladů

Počty zachycují stav před vytvořením této syntézy. Soubor se započítává i tehdy, když je kopií nebo je prázdný.

| Umístění | Počet MD | Role v syntéze |
| --- | ---: | --- |
| Kořen projektu | 7 | AGENTS, hlavní README, kartotéka, dvě architektury, shadery a trasování. |
| `DOKUMENTACE STROM` | 5 | Knihovna literatury, kartotéka a tři biologické výpisky. |
| Kořenové `dokumentace` | 7 | Tři biologické výpisky a čtyři návody k prostorovému zobrazení. |
| `STROM_VAULT` | 16 | Třináct procesních karet, dashboard, šablona a prázdný Untitled. |
| `web_viewer/README.md`, `FUNKCE`, `tools` | 3 | Rozcestník webu, chování oken a UNISAL. |
| `web_viewer/dokumentace` přímo | 3 | Obsah, struktura a evidence změn. |
| `web_viewer/dokumentace/moje` | 11 | Definice, strategie, problémy, testy, návrhy a reflexe. |
| `web_viewer/dokumentace/system` | 2 | Architektura oken a kontroly dokumentace. |
| `web_viewer/dokumentace/starsi` | 3 | Historická architektura, čas a ekologické předpoklady. |
| Obě složky `qa_*` | 2 | Záloha architektury a historický report fotosyntézy. |
| Kořenové `old` | 2 | Historická optimalizace a výkon. |
| `web_viewer/old` bez cizích knihoven | 8 | Starší definice, pracovní kopie a report revize. |
| `.agents/teamwork/orchestrator` | 4 | Historické zadání a koordinace; nejde o aktuální příkazy. |
| `floorplan/.cache/worksheets` | 18 | Pracovní mapa modulů a vztahů, nikoli potvrzení implementace. |
| `floorplan/.tool/floorplan-main` | 19 | Převzatá dokumentace mapovacího nástroje, inventarizovaná odděleně. |
| `web_viewer/old/unisal` | 2 | Převzaté přehledy modelu predikce pozornosti. |
| `web_viewer/old/unisal-env/Lib/site-packages` | 15 | README a licence instalovaných knihoven, pouze inventura. |
| **Celkem** | **127** | **91 projektových/pracovních a 36 převzatých dokumentů.** |

PDF, DOCX, obrázky, zdrojový kód a externí odkazy nebyly součástí obsahového čtení. Syntéza neodstraňuje žádný původní soubor a nenahrazuje podrobné definice.

## Pravidla struktury

- Zachovej rozlišení mezi syntézou, definicí, evidencí implementace a výsledkem testu.
- Shrnutí doprovázej odkazy; přesné parametry ponechávej v jejich původní definici.
- Při aktualizaci uveď datum a rozsah podkladů. Zjištěný rozpor neřeš odhadem.
- Tuto část ponechávej na konci.

```markdown
## Název oblasti

Shrnutí společného významu podkladů.

Zdroje: [Dokument](soubor.md).
```
