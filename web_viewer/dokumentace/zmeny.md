---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Odstraněn doplňkový řádek s porovnáním teplot v detailu.
  - thread_id: 01a19439-ee7f-71f1-af82-4e2ff1146c5f
    date: 2026-11-01
    change: Zjednodušen dokument vzhledu oken bez změny webu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Upřesněn bezpečný postup commitů a kontrol při souběžné práci.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zjednodušena komponenta na nezávislý blok údajů a detailu.
  - thread_id: 01a1942e-d161-7933-b8f7-31bb2827f7a1
    date: 2026-11-01
    change: Odstraněna položka Úvod z nabídky a odpovídající část z platné dokumentace.

---

# Změny

## Čeká

## Rozpracováno

## Implementováno

#### Z049 — Zkrácení detailu Teploty

- Zadání: odstranit dovětek na konci detailu Teploty.
- Výsledek: odstraněn přidaný řádek s teplotou mimo strom a rozdílem; hlavní hodnota, vzorec a vysvětlení zachovány.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken a kontrola dokumentace; finální kontrola uživatelem.

#### Z048 — Úklid vzhledu oken

- Zadání: zkrátit [Vzhled oken](moje/vzhled_oken.md) a odstranit zastaralá pravidla.
- Výsledek: sloučeny opakované definice, zkrácena šablona, obsah a technické použití nahrazeny odkazy; zachovány rozměry a platné rozdíly kapitol. Kód webu se nemění.
- Stav: Implementováno.
- Ověření: porovnání s obsahem oken a CSS, kontrola YAML historie, jedinečnosti ID a místních odkazů; bez vizuálního testu webu.

#### Z047 — Bezpečnější postup ukládání změn

- Zadání: vyřešit opakované chyby historie, oprávnění a smíšených commitů.
- Výsledek: pravidla explicitního commitu podle cest, oddělení práce na společných souborech, zastavení po chybě a kontroly YAML před commitem; upřesněn rozsah kontroly indexu.
- Stav: Implementováno.
- Ověření: kontrola postupů chatu 01a1942e-d161-7933-b8f7-31bb2827f7a1, test odděleného commitu v dočasném repozitáři a kontrola dokumentace.

#### Z046 — Jednoduché okno bez posunů údajů

- Zadání: zjednodušit komponentu a odstranit posun hodnoty a vzorce po otevření textu.
- Výsledek: jeden svislý blok nadpisu, hodnoty a vzorce; druhý nezávislý blok detailu s posuvem. Odstraněno sdílení tří řádků mezi údaji a detailem.
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; v Chromu otevření a zavření Teploty zachovává polohy údajů vůči oknu 0 / 40,9 / 65,9 px. Finální kontrola ostatních oken uživatelem.

#### Z045 — Odstranění Úvodu z nabídky

- Zadání: odstranit Úvod z nabídky a dokumentace, protože uživatel nepoznal, že se v této kapitole nachází.
- Výsledek: položka Úvod není v nabídce; výchozí úvodní animace zůstává zachovaná. Z rozcestníku a definice pořadí navigace byla odstraněna samostatná položka Úvod.
- Stav: Implementováno.
- Ověření: kontrola diffu, syntaxe JavaScriptu, vyhledání zbývajících odkazů na položku nabídky a kontrola YAML historie; finální kontrola uživatelem.

#### Z044 — Kompaktní zavřené okno

- Zadání: roztažené řádky okna Teplota.
- Výsledek: skrytý detail se neúčastní výpočtu výšky řádků společné komponenty; nadpis, hodnota a vzorec nejsou roztahovány dlouhým skrytým textem.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; finální vizuální kontrola uživatelem.

#### Z043 — Společné části komponenty okna

- Zadání: společný nadpis, hodnota, vzorec a předávaný obsah.
- Výsledek: centralizovány velikosti a odstupy; viditelný přepínač a skutečná rovnice jsou datové varianty místo stylových vazeb na kapitolu. Zachován společný renderer a doplněn postup použití v [architektuře](system/architektura_oken.md#rozložení).
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; kontrola dokumentace; finální vizuální kontrola uživatelem.

#### Z042 — Zachování velikosti nadpisů

- Zadání: nezmenšovat nadpis kvůli nezalamování.
- Výsledek: odstraněny zmenšující výjimky Transpirace; nadpisy používají společnou typografickou škálu Fotosyntézy. Zachován jeden řádek a případný posuv záhlaví. Pravidlo upraveno v definici i šabloně.
- Stav: Implementováno.
- Ověření: kontrola odstraněných CSS výjimek a dokumentace; finální vizuální kontrola uživatelem.

#### Z041 — Nezalamované nadpisy oken

- Zadání: nadpis okna vždy na jednom řádku.
- Výsledek: odstraněno zalamování, sloupec Transpirace se přizpůsobuje nadpisu a tlačítku; na úzké obrazovce menší písmo a případný vodorovný posuv záhlaví. Pravidlo přeneseno do šablony vzhledu.
- Stav: Implementováno.
- Ověření: kontrola CSS a dokumentace; finální vizuální kontrola uživatelem.

#### Z040 — Replikovatelná specifikace vzhledu oken

- Zadání: [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: zapsán účel replikovatelnosti, konkrétní rozestupy Transpirace, vlastní prostor tlačítka a obecné položky přenositelné šablony včetně úzkých obrazovek.
- Stav: Implementováno.
- Ověření: porovnání rozměrů a pozic s aktuálním CSS, kontrola dokumentace; web se nemění a jeho finální vizuální kontrola zůstává uživateli.

#### Z039 — Větší odstupy oken Transpirace

- Zadání: přidat mezery mezi okny.
- Výsledek: zvětšeny svislé rozestupy pravých oken posunem Chlazení a Teploty; samostatné rozmístění pro úzké obrazovky.
- Stav: Implementováno.
- Ověření: kontrola změněných pozic a připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z038 — Prostor pro tlačítka detailů

- Zadání: odstranit překrytí tlačítek a textu v Transpiraci.
- Výsledek: záhlaví má samostatný pevný sloupec pro +/− a zmenšitelný sloupec pro zalamovaný nadpis; tlačítko zůstává uvnitř záhlaví.
- Stav: Implementováno.
- Ověření: kontrola CSS a připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z037 — Viditelné přepínače Transpirace

- Zadání: tlačítko + vedle nadpisů oken Transpirace.
- Výsledek: stávající přepínače detailů jsou viditelné jako +/−; rozložení a obsah oken zachovány.
- Stav: Implementováno.
- Ověření: validační test oken a kontrola připravené dokumentace; finální vizuální kontrola uživatelem.

#### Z036 — Okna Transpirace podle šablony Fotosyntézy

- Zadání: [Šablona vzhledu](moje/vzhled_oken.md#šablona-jednoho-okna-podle-fotosyntézy), [Transpirace](moje/okna.md#kapitola-transpirace).
- Výsledek: společné písmo, sloupce, barevné tahy a ovládací plocha nad nadpisem; odstraněny odlišné kruhové přepínače, duplicitní shrnutí a stavové nápisy uvnitř oken. Zachovány čtyři hodnoty, vzorce, výpočty, samostatné detaily a průvodce mimo okna. Zápisy všech čtyř oken sjednoceny podle obsahové šablony.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola připravené dokumentace; finální vizuální a funkční kontrola uživatelem.

#### Z035 — Obnovení stromu po změně oken

- Zadání: odstranění zmizení stromu ve všech kapitolách.
- Výsledek: ošetřen chybějící výstup při aktualizaci hodnot a obnoveny verze navazujících modulů; starší záznamy oken z cache už nepřerušují vykreslování.
- Stav: Implementováno.
- Vizuální ověření: strom a živé hodnoty potvrzeny agentem v otevřeném Chromu uživatele.
- Ověření: před opravou opakovaný pád `out()` u chybějícího `ecoCanopyTemperatureDifference`; po opravě viditelný strom v Úvodu a Transpiraci, živé hodnoty a žádná nová chyba tohoto pádu. Syntaxe a validační test oken prošly.

#### Z034 — Zjednodušení Transpirace a vzorce oken

- Zadání: [Transpirace](moje/okna.md#kapitola-transpirace).
- Výsledek: odstraněno samostatné okno Průtok, jeho výstup a detail; pravá okna řazena bez mezery. Vodní linka a stálý přehled cesty vody zůstávají. Čtyři zbývající okna mají vzorce; pravidla a šablona číselného okna je vyžadují. Ve vzhledu je samostatná šablona převzatá z Fotosyntézy.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken, kontrola odkazů a průběžná kontrola čtyř viditelných vzorců i klikání v Chromu; finální vizuální kontrola uživatelem.

#### Z033 — Srozumitelný vstup do Transpirace

- Zadání: [Průvodce Transpirací](moje/texty.md#průvodce-transpirací), [poznatky z testu](moje/tests.md).
- Výsledek: viditelné vysvětlení děje a cesty vody, označení prvků, stručná shrnutí mimo detaily a viditelná tlačítka +/−; otevřená vodní témata odkazují na zvýraznění linky. Fotosyntéza používá původní vzhled.
- Stav: Implementováno.
- Ověření: syntaxe, validační test oken a průběžná kontrola v Google Chromu při 1440 × 1000 — pět oken, shrnutí, kliknutí a absence běhových chyb; finální kontrola uživatelem a test porozumění zbývají.

#### Z032 — Rozdělení dokumentace do složek

- Zadání: [Uspořádání dokumentace](struktura_projektu.md#dokumentace).
- Výsledek: složky `moje`, `system` a `starsi`; rozcestník, struktura a evidence zůstávají v kořeni. Opraveny odkazy, pravidla a cesty kontroloru.
- Stav: Implementováno.
- Ověření: úplná formální kontrola dokumentace a testy kontroloru.

#### Z031 — Úklid dokumentace

- Zadání: [Uspořádání dokumentace](struktura_projektu.md#dokumentace).
- Výsledek: záloha rozcestníku před rozdělením, starší technický přehled a původní popis barevného posunu a vody přesunuty do `old/dokumentace`; odstraněn odkaz ze vstupního README.
- Stav: Implementováno.
- Ověření: kontrola odkazů na přesunuté soubory a zachování archivních kopií.

#### Z030 — Samostatné záznamy uživatelských testů

- Zadání: [Testy](moje/tests.md).
- Výsledek: test s mámou přesunut beze změny pozorování do `tests.md`; u strategických problémů zůstaly mýty a odkaz.
- Stav: Implementováno.
- Ověření: porovnání přesunutého textu s původním záznamem, kontrola odkazů a struktury.

#### Z029 — Poznatky z neformálního testu

- Zadání: [Problémy k řešení](moje/strategi_problems.md).
- Výsledek: zapsán test s mámou včetně fungujícího Období; odděleny návrhy od pozorování a mýty zkráceny do jedné kapitoly.
- Stav: Implementováno.
- Ověření: porovnání se zprávou uživatele, kontrola členění a odkazů; nejde o nový test webu ani ověření cílové skupiny.

#### Z028 — Tři prioritní problémy porozumění

- Zadání: [Problémy k řešení](moje/strategi_problems.md).
- Výsledek: dokument vymezuje tři mylné představy, cíle a ověřovací otázky; samotné problémy zůstávají k řešení.
- Stav: Implementováno.
- Ověření: kontrola struktury a místních odkazů.

#### Z027 — Úplná struktura Transpirace podle Fotosyntézy

- Zadání: [Transpirace](moje/okna.md#transpirace), [Převod podle vzoru](../../AGENTS.md#převod-podle-vzoru).
- Výsledek: hlavní proces a čtyři tematická okna se samostatnými hodnotami a detaily, společné definice i vykreslení, vazba na vodní linku a schéma cesty vody. Doplněno pravidlo pro budoucí převody a [postup ve strategii](moje/strategie.md#postup-návrhu-kapitoly-podle-vzoru).
- Stav: Implementováno.
- Ověření: syntaxe a validační test oken; finální vizuální a funkční kontrola uživatelem.

#### Z026 — Zachování linek při přepnutí kapitoly

- Zadání: [Společné stahování linek](moje/elementy.md#společné-stahování-linek).
- Výsledek: přepnutí kapitoly zachovává stažení vody a glukózy i stav červenání; před zobrazením skupin aktualizuje hranice linek bez posunu animace.
- Stav: Implementováno.
- Ověření: kontrola syntaxe a odstranění resetu v přepínači kapitol; finální vizuální kontrola uživatelem.

#### Z025 — Transpirace ve stylu Fotosyntézy

- Zadání: [Transpirace](moje/okna.md#transpirace), [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: společný vzhled hlavního okna a Odparu z listů, barevné tahy a pevné sloupce; zachovány původní texty, živé hodnoty a výpočty. Doplněny definice a rozcestník.
- Stav: Implementováno.
- Ověření: syntaxe JavaScriptu a validační test oken; finální vizuální kontrola uživatelem.

#### Z024 — Plynulé tempo linek

- Zadání: [Společná rychlost linek](moje/elementy.md#společná-rychlost-linek).
- Výsledek: obě linky používají čas přehrávání bez násobení proměnlivým odparem a bez zrychlení ekologických hodin.
- Stav: Implementováno.
- Ověření: kontrola syntaxe; test pauzy a násobičů přehrávání v Chromu.

#### Z023 — Společná pomalejší animace linek

- Zadání: [Společná rychlost linek](moje/elementy.md#společná-rychlost-linek).
- Výsledek: voda a glukóza sdílí čas a rychlost; animace běží poloviční rychlostí vody a reaguje na pauzu a zrychlení času.
- Stav: Implementováno.
- Ověření: syntaxe hlavního modulu a kontrola společných uniformů; finální vizuální kontrola uživatelem.

#### Z022 — Stálá rychlost glukózy

- Zadání: [Glukóza linka](moje/elementy.md#glukóza-linka).
- Výsledek: animace glukózy používá vlastní reálný čas a pevnou rychlost 1× místo dynamické rychlosti vody a modelových hodin.
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a vazeb uniformů; finální vizuální kontrola uživatelem.

#### Z021 — Report pouze s neshodami

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: report vypisuje jen doložené neshody, bez shod a neověřených položek; upraven i existující report.
- Stav: Implementováno.
- Ověření: kontrola výsledného diffu, syntaxe spouštěče a formátu zkráceného reportu.

#### Z020 — Shoda dokumentace s webem po deseti commitech

- Zadání: [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Výsledek: revize porovnává všechny obsahové definice s kódem a pozorováním skutečného Google Chromu; hlásí doložené neshody bez oprav.
- Stav: Implementováno.
- Ověření: integrační testy spouštěče a ruční kontrola sběru v Chromu; úplnost všech scénářů není zaručena.

#### Z018 — Jedinečné identifikátory změn

- Zadání: [Změny](../../AGENTS.md#změny).
- Výsledek: odstraněny duplicity ID, doplněno načtení aktuální evidence a kontrola kolizí před commitem; existující kontrolor duplicity automaticky hlásí.
- Stav: Implementováno.
- Ověření: kontrola jedinečnosti ID, vyhledání odkazů a testy kontroloru dokumentace.

#### Z015 — Revize bez konzolového okna

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: podproces Codex CLI ve Windows používá `CREATE_NO_WINDOW`.
- Stav: Implementováno.
- Ověření: integrační test kontroluje příznak spuštění podprocesu; vizuální kontrola uživatelem.

#### Z014 — Report revize v Markdownu

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: report se ukládá jako `revize_dokumentace.md`.
- Stav: Implementováno.
- Ověření: kontrola cest a integrační testy spouštěče.

#### Z013 — Současný vzhled oken

- Zadání: [Vzhled oken](moje/vzhled_oken.md).
- Výsledek: dokumentace popisuje horní zarovnání detailů, společný začátek pravého sloupce, mezeru 15 px a samostatné délky barevných tahů.
- Stav: Implementováno.
- Ověření: porovnání s aktuálním CSS a definicemi obsahu; předchozí kontrola v Chromu naměřila odstup dlouhého vzorce přibližně 15 px. Poslední změna zakončení Vody je ověřena pouze v kódu.

#### Z012 — Revize bez hodinového čekání

- Zadání: [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Výsledek: desátý commit spustí revizi agentem na pozadí; výsledek je v `old/revize_dokumentace.md` a hodinová automatizace je pozastavená.
- Stav: Implementováno.
- Ověření: integrační testy spouštěče a výstupů, ověření neinteraktivního Codex CLI; ruční spuštění vstupní revize.

#### Z011 — Zkrácené texty oken

- Zadání: [Fotosyntéza](moje/okna.md#fotosyntéza), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda), [CO₂](moje/okna.md#co₂), [O₂](moje/okna.md#o₂).
- Výsledek: každé okno má jeden stručný odstavec místo více dlouhých odstavců.
- Stav: Implementováno.
- Ověření: kontrola počtu textových položek v definici oken, syntaxe a validační test oken.

#### Z010 — Výukové texty oken

- Zadání: [Fotosyntéza](moje/okna.md#fotosyntéza), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda), [CO₂](moje/okna.md#co₂), [O₂](moje/okna.md#o₂).
- Výsledek: okna vysvětlují roli vstupů, produkci cukrů a kyslíku, spotřebu CO₂ a význam vody pro fotosyntézu.
- Stav: Implementováno.
- Ověření: kontrola textů proti definici oken, syntaxe a validační test oken.

#### Z019 — Automatická kontrola dokumentace

- Zadání: [Kontrola dokumentace](system/kontrola_dokumentace.md).
- Výsledek: kontrolor připraveného commitu a lokální hook; spouštění revizí určuje [Revize po deseti commitech](system/kontrola_dokumentace.md#revize-po-deseti-commitech).
- Stav: Implementováno.
- Ověření: integrační testy kontroloru v dočasných repozitářích; úplná kontrola hlásí existující nálezy, první pravidelná revize čeká na spuštění.

#### Z009 — Jedno desetinné místo hodnot

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda).
- Výsledek: hodnoty produkce a spotřeby se zobrazují s jedním desetinným místem.
- Stav: Implementováno.
- Ověření: kontrola formátování hodnot, validační test oken a kontrola zobrazení v Chromu.

#### Z017 — Detail bez překrytí a vypnuté ovládání Vody

- Zadání: [Voda](moje/okna.md#voda), [Vzhled oken](moje/vzhled_oken.md#obecný-obsah).
- Stav: Implementováno.
- Ověření: kontrola změněného JavaScriptu a CSS; finální vizuální kontrola uživatelem.

#### Z007 — Hodnoty a vstupy oken O₂, CO₂ a Voda

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Voda](moje/okna.md#voda).
- Výsledek: O₂ zobrazuje produkci v `g/min`, CO₂ spotřebu v `g/min` a Voda spotřebu v `l/h`; každé okno zobrazuje své vstupy výpočtu.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z008 — Rozlišení produkce a spotřeby

- Zadání: [O₂](moje/okna.md#o₂), [CO₂](moje/okna.md#co₂), [Cukry](moje/okna.md#cukry), [Voda](moje/okna.md#voda).
- Výsledek: hodnoty O₂ a Cukrů mají popisek „produkce“, hodnoty CO₂ a Vody „spotřeba“; CO₂ se počítá z aktivní plochy listů, fotosyntetické účinnosti a převodu molů na gramy.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z006 — Pulzující zvýraznění linek

- Zadání: [Voda linka](moje/elementy.md#voda-linka), [Glukóza linka](moje/elementy.md#glukóza-linka), zvýraznění zesílením tloušťky a pulzací bez zesvětlení.
- Stav: Implementováno.
- Ověření: kontrola shaderu a syntaxe změněného JavaScriptu; finální vizuální kontrola uživatelem.

#### Z004 — Propojení tagy

- Zadání: [Pravidlo propojení](moje/elementy.md#pravidlo-propojení), společný tag okna a elementu.
- Stav: Implementováno.
- Ověření: kontrola napojení `tema` → `setElementHighlight` → materiály linek v kódu; syntaxe a `test_ui_okna_kontrola.mjs` prošly.
- Přepnutí zvýraznění probíhá přímo při změně otevření detailu; aktualizace kapitoly zachovává jeho soulad s viditelností okna.
- Vizuální a funkční ověření: finální kontrola uživatelem.

#### Z001 — Voda

- Zadání: [Voda linka](moje/elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Implementováno.
- Ověření: kontrola vazby tagu `water` na uniform materiálu v kódu; finální kontrola uživatelem.

#### Z005 — Noční stahování linek

- Zadání: [Společné stahování linek](moje/elementy.md#společné-stahování-linek).
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a diffu; finální vizuální kontrola uživatelem.

#### Z002 — Glukóza

- Zadání: [Glukóza linka](moje/elementy.md#glukóza-linka), zvýraznění při otevření okna Cukry a návrat při zavření.
- Stav: Implementováno.
- Ověření: porovnání vazby okna s uniformem shaderu v kódu; finální kontrola uživatelem.

#### Z003 — UI podle SVG

- Zadání: [Fotosyntéza](architektura_obsahu.md#fotosyntéza), [statická okna](moje/vzhled_oken.md#statická-okna), [vzhled bloků](moje/vzhled_oken.md), [Kapitoly](moje/prvky.md#kapitoly).
- Stav: Implementováno.
- Ověření: kontrola syntaxe změněných modulů a `test_ui_okna_kontrola.mjs` prošly; test zahrnuje spuštění bez bodů stromu.
- Omezení: širší `test_tree_ecology.mjs` selhává na „Excess inflow stops at capacity“ v nezměněném ekologickém modelu.
- Vizuální a závěrečné ověření: finální kontrola uživatelem.

## Ověřeno

## K upřesnění

## Pravidla evidence

- Postup dokončení určuje [Pracovní postup](../../AGENTS.md#pracovní-postup), význam stavů [Změny](../../AGENTS.md#změny).
- Každá změna má stálé ID, odkaz na zadání, stav a výsledek ověření.
- Přidělování ID a řešení souběžných kolizí určuje [AGENTS.md](../../AGENTS.md#změny); každé ID použij pouze jednou v celém dokumentu.
- Eviduj i drobné vizuální ladění celého webu; související pokusy sluč do jedné dokončené logické změny.
- U drobných úprav stačí stručný výsledný popis a skutečné ověření; podrobné definice nepřepisuj, pokud se jejich význam nemění.
- Za logickou změnu přidej jeden záznam YAML historie s ověřeným `thread_id`; evidenci commituj společně s příslušným kódem.
- Při změně stavu přesuň záznam do příslušné části.
- Předaný výsledek ber jako vyhovující a uzavřený bez dalšího schválení, pokud uživatel výslovně nevznese výhradu nebo požadavek na úpravu.
- Přijetí bez výhrady neprokazuje provedení testu; bez doložené finální kontroly ponech stav „Implementováno“. Po potvrzení skutečné kontroly zapiš rozsah ověření, přesuň záznam do „Ověřeno“ a evidenci ulož samostatným commitem.
- Neevidované části webu nejsou tímto dokumentem ověřené.

[Zpět na obsah](architektura_obsahu.md)

## Pravidla struktury

- Změny seskupuj podle stavu v kapitolách `##`; jednotlivé záznamy mají nadpis `####` se stálým ID a názvem.
- U záznamu uváděj odkaz na zadání, stav a skutečné ověření; případná omezení uveď samostatně.
- U vizuálního ladění přidej stručný bod „Výsledek“ s konečnou úpravou; mezikroky do šablony nepatří.
- Význam stavů a přesuny záznamů určují pravidla evidence výše.
- Tuto část s obecnou šablonou ponechávej na konci dokumentu.

```markdown
## Název stavu

#### ZXXX — Název změny

- Zadání: [Definice](soubor.md#kotva).
- Výsledek: stručný popis výsledné úpravy.
- Stav: odpovídající stav.
- Ověření: provedená kontrola nebo finální kontrola uživatelem.
```
