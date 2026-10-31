---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Skryto konzolové okno podprocesu automatické revize.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Změněn výstup revize dokumentace na Markdown.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Sladěna dokumentace vzhledu se současným rozložením detailů a tahů oken.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Napojena revize dokumentace na každý pátý commit a určeno umístění výsledku.
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Zkráceny texty oken Fotosyntéza, Cukry, Voda, CO₂ a O₂ na jeden odstavec.

---

# Změny

## Čeká

## Rozpracováno

## Implementováno

#### Z015 — Revize bez konzolového okna

- Zadání: [Kontrola dokumentace](kontrola_dokumentace.md).
- Výsledek: podproces Codex CLI ve Windows používá `CREATE_NO_WINDOW`.
- Stav: Implementováno.
- Ověření: integrační test kontroluje příznak spuštění podprocesu; vizuální kontrola uživatelem.

#### Z014 — Report revize v Markdownu

- Zadání: [Kontrola dokumentace](kontrola_dokumentace.md).
- Výsledek: report se ukládá jako `revize_dokumentace.md`.
- Stav: Implementováno.
- Ověření: kontrola cest a integrační testy spouštěče.

#### Z013 — Současný vzhled oken

- Zadání: [Vzhled oken](vzhled_oken.md).
- Výsledek: dokumentace popisuje horní zarovnání detailů, společný začátek pravého sloupce, mezeru 15 px a samostatné délky barevných tahů.
- Stav: Implementováno.
- Ověření: porovnání s aktuálním CSS a definicemi obsahu; předchozí kontrola v Chromu naměřila odstup dlouhého vzorce přibližně 15 px. Poslední změna zakončení Vody je ověřena pouze v kódu.

#### Z012 — Revize bez hodinového čekání

- Zadání: [Revize po pěti commitech](kontrola_dokumentace.md#revize-po-pěti-commitech).
- Výsledek: pátý commit spustí revizi agentem na pozadí; výsledek je v `old/revize_dokumentace.md` a hodinová automatizace je pozastavená.
- Stav: Implementováno.
- Ověření: integrační testy spouštěče a výstupů, ověření neinteraktivního Codex CLI; ruční spuštění vstupní revize.

#### Z011 — Zkrácené texty oken

- Zadání: [Fotosyntéza](okna.md#fotosyntéza), [Cukry](okna.md#cukry), [Voda](okna.md#voda), [CO₂](okna.md#co₂), [O₂](okna.md#o₂).
- Výsledek: každé okno má jeden stručný odstavec místo více dlouhých odstavců.
- Stav: Implementováno.
- Ověření: kontrola počtu textových položek v definici oken, syntaxe a validační test oken.

#### Z010 — Výukové texty oken

- Zadání: [Fotosyntéza](okna.md#fotosyntéza), [Cukry](okna.md#cukry), [Voda](okna.md#voda), [CO₂](okna.md#co₂), [O₂](okna.md#o₂).
- Výsledek: okna vysvětlují roli vstupů, produkci cukrů a kyslíku, spotřebu CO₂ a význam vody pro fotosyntézu.
- Stav: Implementováno.
- Ověření: kontrola textů proti definici oken, syntaxe a validační test oken.

#### Z010 — Automatická kontrola dokumentace

- Zadání: [Kontrola dokumentace](kontrola_dokumentace.md).
- Výsledek: kontrolor připraveného commitu a lokální hook; spouštění revizí určuje [Revize po pěti commitech](kontrola_dokumentace.md#revize-po-pěti-commitech).
- Stav: Implementováno.
- Ověření: integrační testy kontroloru v dočasných repozitářích; úplná kontrola hlásí existující nálezy, první pravidelná revize čeká na spuštění.

#### Z009 — Jedno desetinné místo hodnot

- Zadání: [O₂](okna.md#o₂), [CO₂](okna.md#co₂), [Cukry](okna.md#cukry), [Voda](okna.md#voda).
- Výsledek: hodnoty produkce a spotřeby se zobrazují s jedním desetinným místem.
- Stav: Implementováno.
- Ověření: kontrola formátování hodnot, validační test oken a kontrola zobrazení v Chromu.

#### Z009 — Detail bez překrytí a vypnuté ovládání Vody

- Zadání: [Voda](okna.md#voda), [Vzhled oken](vzhled_oken.md#obecný-obsah).
- Stav: Implementováno.
- Ověření: kontrola změněného JavaScriptu a CSS; finální vizuální kontrola uživatelem.

#### Z007 — Hodnoty a vstupy oken O₂, CO₂ a Voda

- Zadání: [O₂](okna.md#o₂), [CO₂](okna.md#co₂), [Voda](okna.md#voda).
- Výsledek: O₂ zobrazuje produkci v `g/min`, CO₂ spotřebu v `g/min` a Voda spotřebu v `l/h`; každé okno zobrazuje své vstupy výpočtu.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z008 — Rozlišení produkce a spotřeby

- Zadání: [O₂](okna.md#o₂), [CO₂](okna.md#co₂), [Cukry](okna.md#cukry), [Voda](okna.md#voda).
- Výsledek: hodnoty O₂ a Cukrů mají popisek „produkce“, hodnoty CO₂ a Vody „spotřeba“; CO₂ se počítá z aktivní plochy listů, fotosyntetické účinnosti a převodu molů na gramy.
- Stav: Implementováno.
- Ověření: kontrola syntaxe, validační test oken a kontrola zobrazení v Chromu.

#### Z006 — Pulzující zvýraznění linek

- Zadání: [Voda linka](elementy.md#voda-linka), [Glukóza linka](elementy.md#glukóza-linka), zvýraznění zesílením tloušťky a pulzací bez zesvětlení.
- Stav: Implementováno.
- Ověření: kontrola shaderu a syntaxe změněného JavaScriptu; finální vizuální kontrola uživatelem.

#### Z004 — Propojení tagy

- Zadání: [Pravidlo propojení](elementy.md#pravidlo-propojení), společný tag okna a elementu.
- Stav: Implementováno.
- Ověření: kontrola napojení `tema` → `setElementHighlight` → materiály linek v kódu; syntaxe a `test_ui_okna_kontrola.mjs` prošly.
- Přepnutí zvýraznění probíhá přímo při změně otevření detailu; aktualizace kapitoly zachovává jeho soulad s viditelností okna.
- Vizuální a funkční ověření: finální kontrola uživatelem.

#### Z001 — Voda

- Zadání: [Voda linka](elementy.md#voda-linka), zvýraznění při otevření okna Voda a návrat při zavření.
- Stav: Implementováno.
- Ověření: kontrola vazby tagu `water` na uniform materiálu v kódu; finální kontrola uživatelem.

#### Z005 — Noční stahování linek

- Zadání: [Společné stahování linek](elementy.md#společné-stahování-linek).
- Stav: Implementováno.
- Ověření: kontrola syntaxe hlavního modulu a diffu; finální vizuální kontrola uživatelem.

#### Z002 — Glukóza

- Zadání: [Glukóza linka](elementy.md#glukóza-linka), zvýraznění při otevření okna Cukry a návrat při zavření.
- Stav: Implementováno.
- Ověření: porovnání vazby okna s uniformem shaderu v kódu; finální kontrola uživatelem.

#### Z003 — UI podle SVG

- Zadání: [Fotosyntéza](architektura_obsahu.md#fotosyntéza), [statická okna](okna.md#statická-okna), [vzhled bloků](vzhled_oken.md), [Kapitoly](prvky.md#kapitoly).
- Stav: Implementováno.
- Ověření: kontrola syntaxe změněných modulů a `test_ui_okna_kontrola.mjs` prošly; test zahrnuje spuštění bez bodů stromu.
- Omezení: širší `test_tree_ecology.mjs` selhává na „Excess inflow stops at capacity“ v nezměněném ekologickém modelu.
- Vizuální a závěrečné ověření: finální kontrola uživatelem.

## Ověřeno

## K upřesnění

## Pravidla evidence

- Postup dokončení určuje [Pracovní postup](../../AGENTS.md#pracovní-postup), význam stavů [Změny](../../AGENTS.md#změny).
- Každá změna má stálé ID, odkaz na zadání, stav a výsledek ověření.
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
