---
history:
  - thread_id: 01a18d15-6ca3-7241-81c2-fc807aeadc12
    date: 2026-10-30
    change: Přidáno dohledání ID threadu přes API Codexu.
---

# Prohlížeč a kontrola

- Web otevírej a kontroluj pouze v Google Chrome; nikdy v integrovaném prohlížeči ani přes `open_in_codex`.
- Pokud Chrome není dostupný, předej URL.
- Finální testování nech uživateli, pokud výslovně nepožádá o test.

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

- Před úpravou přečti aktuální dokument a jeho pravidla.
- Piš stručně a bodově: jedna podstatná informace na bod, bez opakování a výplně.
- Používej krátké názvy, malé podnadpisy a mezery mezi tématy.
- Struktura: kapitola `##`, oblast `###`, konkrétní položka `####`; bez opakování slova „Okno“.
- Zachovej uživatelovy úpravy a nevracej smazaný obsah.
- Další dokumenty hromadně nepřepisuj bez zadání.

## Historie změn dokumentů

- U každého nově vytvořeného nebo upravovaného dokumentu Markdown udržuj historii posledních pěti změn v YAML frontmatteru.
- Před zápisem změny zavolej API Codexu `list_threads` a podle aktuálního chatu ověř jeho ID; zapiš nalezené `thread_id`, datum a stručný popis.
- Historii ve frontmatteru aktualizuj při každé změně dokumentu; ponechávej nejvýše pět nejnovějších záznamů.
- Použij formát `history` jako seznam položek s poli `thread_id`, `date` a `change`; předchozí frontmatter zachovej a sluč jej bez ztráty ostatních polí.
- Pokud ID není v prvním výsledku, stránkuj nebo zpřesni hledání `list_threads`; nikdy nevymýšlej `thread_id` ani nezapisuj `null` bez vyčerpání dostupného API hledání.

# Rozdělení dokumentace

Soubory jsou v `web_viewer/dokumentace`.

- `architektura_obsahu.md`: rozcestník; kapitoly → Text, Okna, Ovládací prvky, Elementy; pouze krátké klikací názvy.
- `texty.md`: samostatné nápisy, písmo, poloha a barva.
- `okna.md`: skutečná okna kolem stromu, obsah, hodnoty, „Napojení“ na element a „Bod linky“.
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
