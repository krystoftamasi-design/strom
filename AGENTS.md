---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněna vlastní pravidla struktury a obecná šablona AGENTS.md.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zavedena povinná obecná šablona na konci každého upravovaného dokumentu a její průběžná aktualizace.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněno povinné čtení a ukládání pravidel struktury na konci dokumentů.
  - thread_id: 01a191dc-21ba-7b11-9e58-687e0a2cfbd7
    date: 2026-10-31
    change: Doplněn stručný princip YAGNI pro vývoj podle aktuálních potřeb.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Zpřesněno povinné sjednocení kódu a dokumentace v jednom kroku.
---

# Prohlížeč a kontrola

- Web otevírej a kontroluj pouze v Google Chrome; nikdy v integrovaném prohlížeči ani přes `open_in_codex`.
- Pokud Chrome není dostupný, předej URL.
- Finální testování nech uživateli, pokud výslovně nepožádá o test.

## YAGNI

- Implementuj jen funkce potřebné pro aktuální zadání.
- Nepřidávej funkce, abstrakce ani optimalizace pro hypotetické budoucí potřeby.
- Vol nejjednodušší řešení, které splňuje požadavky a zůstává srozumitelné a udržovatelné.
- Řešení rozšiřuj postupně podle skutečných potřeb a zpětné vazby; výkon optimalizuj na základě měření.

# Struktura souborů

- Před přidáním souboru přečti `web_viewer/dokumentace/struktura_projektu.md` a najdi příslušnou složku.
- Nové soubory ukládej podle účelu; související JavaScript a CSS drž pohromadě.
- Používej existující složky a názvosloví; nevytvářej duplicity ani zbytečné složky.
- Modely, textury a písma patří do `web_assets`, nástroje do `tools`, testy do `testy`.
- Pracovní výstupy ukládej mimo aktivní kód; starší verze do `old`, obrázky kontrol do `nahledy`.
- Při přesunu nebo přejmenování oprav importy, odkazy a cesty k assetům.
- Při změně uspořádání aktualizuj `struktura_projektu.md`.
- Bez zadání nepřesouvej ani nemaž nesouvisející soubory.

# Styl dokumentů

- Před každou úpravou přečti aktuální dokument včetně pravidel na jeho konci a postupuj podle nich.
- U každého vytvářeného nebo upravovaného dokumentu Markdown vytvoř na konci část „Pravidla struktury“, pokud chybí.
- Do této části patří pravidla členění a obecná šablona s úrovněmi nadpisů, pořadím částí a formátem položek; používej zástupné názvy místo konkrétního obsahu.
- Při změně struktury aktualizuj současně pravidla, šablonu i členění dokumentu; před dokončením ověř jejich shodu.
- Konkrétní strukturu určuje tato část; obecné členění níže použij, pokud dokument vlastní strukturu nemá.
- Piš stručně a bodově: jedna podstatná informace na bod, bez opakování a výplně.
- Používej krátké názvy, malé podnadpisy a mezery mezi tématy.
- Struktura: kapitola `##`, oblast `###`, konkrétní položka `####`; bez opakování slova „Okno“.
- Zachovej uživatelovy úpravy a nevracej smazaný obsah.
- Při změně systému automaticky aktualizuj všechny související definice, pravidla a odkazy.
- Každou změnu kódu, vzhledu nebo chování aktualizuj současně v příslušné dokumentaci; před dokončením porovnej kód s dokumentací.
- Samostatný commit změny kódu bez odpovídající dokumentace není dokončený úkol.
- Překonané popisy nahraď; odstraň duplicity a dodatky porovnávající staré a nové řešení.
- Uspořádej text do návazného pořadí; v definicích popisuj platné řešení, historii a stav drž odděleně.
- Nesouvisející dokumenty hromadně nepřepisuj bez zadání.

## Historie změn dokumentů

- U každého nově vytvořeného nebo upravovaného dokumentu Markdown udržuj historii posledních pěti změn v YAML frontmatteru.
- Před zápisem změny zavolej API Codexu `list_threads` a podle aktuálního chatu ověř jeho ID; zapiš nalezené `thread_id`, datum a stručný popis.
- Při každé změně Markdownu přidej nový záznam na začátek `history`; existující záznamy zachovej a nemaž ani nepřepisuj jen proto, že upravuješ tentýž soubor znovu.
- Po přidání záznamu ponechávej nejvýše pět nejnovějších položek `history` a starší odstraň až z konce seznamu.
- Použij formát `history` jako seznam položek s poli `thread_id`, `date` a `change`; předchozí frontmatter zachovej a sluč jej bez ztráty ostatních polí.
- Pokud ID není v prvním výsledku, stránkuj nebo zpřesni hledání `list_threads`; nikdy nevymýšlej `thread_id` ani nezapisuj `null` bez vyčerpání dostupného API hledání.
- Před dokončením zkontroluj, že existuje nový záznam pro právě provedenou změnu, má správné `thread_id`, datum a popis a že seznam obsahuje nejvýše pět položek.

# Rozdělení dokumentace

Soubory jsou v `web_viewer/dokumentace`.

- `architektura_obsahu.md`: rozcestník; kapitoly → Text, Okna, Vzhled, Ovládací prvky, Elementy; pouze krátké klikací názvy.
- `texty.md`: samostatné nápisy, písmo, poloha a barva.
- `okna.md`: chování statických oken, obsah, hodnoty a související elementy.
- `vzhled_oken.md`: samostatný vzhled oken, rozmístění, písmo a barvy.
- `prvky.md`: tlačítka a ovládání.
- `elementy.md`: linky, částice a jejich chování včetně reakcí na okna; bez zdrojových souborů a interních názvů.
- `zmeny.md`: stav změn a ověření, odkazy na definice.
- Každou věc popiš jednou; ostatní místa na ni odkazují.
- Technické podrobnosti drž odděleně od popisu obsahu.

# Změny

- Definice říkají, jak má web fungovat; neprokazují hotovou implementaci.
- Existující chování ověř v kódu nebo na webu; požadavky přebírej ze zadání uživatele.
- Před změnou čti související definice, pravidla rozcestníku a `zmeny.md`.
- Rozdíl proti kódu zapiš jako „Čeká“; schválené chování neoznačuj jako návrh.
- Kód měň na pokyn uživatele; samotné uložení dokumentu implementaci nespouští.
- Stavy: Čeká → Rozpracováno → Implementováno → Ověřeno; nejasnosti „K upřesnění“.
- Uveď skutečné ověření nebo „finální kontrola uživatelem“; neevidované neznamená hotové.
- Zachovej historii změn.

# Commity

- Po každé dokončené logické změně vytvoř lokální commit s krátkým popisem.
- Před commitem zkontroluj diff a zahrň jen změny daného úkolu; cizí úpravy vynech.
- Rozpracované kroky necommituj jednotlivě; commit neznamená ověření funkčnosti.
- Na vzdálený repozitář odesílej jen na výslovný pokyn uživatele.

# Pravidla struktury

- Oblasti projektových pravidel mají úroveň `#`, jejich podoblasti `##`.
- Pokyny piš jako stručné odrážky v rozkazovacím způsobu.
- Historii změn udržuj ve frontmatteru; tuto část se šablonou ponechávej na konci.

```markdown
# Název oblasti

- Pravidlo pro danou oblast.

## Název podoblasti

- Podrobnější pravidlo.
```
