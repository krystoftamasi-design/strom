---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Popsána kontrola dokumentace před commitem a automatická revize po pěti commitech.
---

# Kontrola dokumentace

## Před commitem

- `python web_viewer/tools/check_documentation.py --staged` kontroluje obsah Git indexu, který bude skutečně commitovaný.
- Kontrola ověřuje YAML, položky historie a jejich limit, část „Pravidla struktury“, místní Markdown odkazy a kotvy a povinné položky záznamů změn.
- Změna těla dokumentu vyžaduje aktualizaci jeho YAML historie.
- Změny JavaScriptu, CSS a HTML webu vyžadují připravenou úpravu `zmeny.md`; testy, nástroje a assety jsou z této kontroly evidence vyjmuté.
- Nové nálezy commit zastaví; existující stejné nálezy proti `HEAD` se vypíší jako `EXISTING` a neblokují nesouvisející práci.
- Kontrolor ověřuje přítomnost a formát evidence; neumí prokázat její pravdivost, původ ID chatu ani významovou shodu s kódem.

## Instalace

- Vyžaduje Git, Python 3 a PyYAML 6; v tomto prostředí je závislost dostupná.
- Případná instalace závislosti: `python -m pip install "PyYAML>=6,<7"`.
- Zdroj hooku je `web_viewer/tools/pre-commit`; zkopíruj jej jako soubor `pre-commit` do aktivního adresáře Git hooků, jen pokud tam vlastní hook dosud není.
- Existující hooky včetně Git LFS zachovej; při existujícím `pre-commit` nejprve sjednoť jeho volání místo přepsání.
- Hook je lokální nastavení repozitáře; nový klon ho musí nainstalovat znovu.

## Úplná kontrola

- `python web_viewer/tools/check_documentation.py` kontroluje pracovní soubory hlavní obsahové dokumentace, její technickou architekturu, uspořádání projektu, tento dokument a `AGENTS.md`.
- Historické a odborné přílohy se plošně nekontrolují; změněný Markdown v `dokumentace` se kontroluje před commitem.
- Kontrola ignoruje ukázky v blocích kódu a prověřuje místní přímé Markdown odkazy; vzdálené weby, referenční odkazy a vlastní HTML kotvy neověřuje.
- Návratový kód `0` znamená bez nalezených formálních chyb; `1` znamená nálezy. Soubory se neopravují.
- Testy: `python -m unittest discover -s web_viewer/testy -p test_documentation_check.py`.

## Revize po pěti commitech

- Automatizace „Revize dokumentace STROM po 5 commitech“ každou hodinu ověří počet nových commitů; nejde o okamžitou událost při pátém commitu.
- `--review-status` vrací aktuální commit, poslední prověřený commit, počet nových commitů a příznak `review_due`.
- Při prvním běhu nebo neplatném výchozím bodu proběhne vstupní revize; další revize nastane po alespoň pěti nových commitech.
- Agent spustí úplnou kontrolu, projde nové commity a porovná související definice s kódem: rozpory, duplicity, zastaralé popisy, evidenci a doložení ověření.
- Zpráva obsahuje „bez nálezu“ nebo konkrétní problémy s odkazy; pokud revize není splatná, automatizace zůstává potichu.
- Revize nic neopravuje ani necommituje. Jediný pracovní zápis je stav v ignorovaném `web_viewer/old/documentation_review_state.json`.
- Po dokončené revizi se stav uloží příkazem `python web_viewer/tools/check_documentation.py --review-complete HEAD_SHA` s přesným prověřeným hashem; při změně `HEAD` příkaz stav neuloží.
- Problémy mohou být oznámeny i při úspěšně dokončené revizi; neúspěšně provedená revize se za dokončenou nepovažuje.
- Spuštění závisí na dostupnosti lokální automatizace a projektu; „bez nálezu“ není záruka bezchybnosti ani finální test webu.

## Pravidla struktury

- Oblasti kontroly mají nadpis `##`, postupy a omezení popisuj stručnými odrážkami.
- Příkazy uváděj od kořene projektu; pravidla pracovního postupu odkazuj na [AGENTS.md](../../AGENTS.md).
- Tuto část a obecnou šablonu ponechávej na konci.

```markdown
## Název kontroly

- Spuštění: `příkaz`.
- Rozsah: kontrolované soubory a podmínky.
- Výsledek: způsob oznámení nálezů.
- Omezení: co kontrola neověřuje.
```
