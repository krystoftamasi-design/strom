---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zavedena jednotná předběžná kontrola vybraných souborů před commitem.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Odděleny tři překonané dokumenty do pracovního archivu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunut záznam uživatelského testu do samostatného tests.md.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vymezeny tři prioritní problémy porozumění.

---

# Uspořádání projektu

Hlavní stránka `index.html` zůstává přímo ve `web_viewer`.
Stránka `strom_web_viewer.html` je další existující vstup.
Stránka `fotosynteza.html` zobrazuje samostatné schéma fotosyntézy.
Soubor `spustit_web_viewer.bat` spouští projekt.

## Kód

- `okna` obsahuje společný systém informačních oken.
- `ekologie` obsahuje model stromu a společné vzorce.
- `listy` obsahuje ovládání a animace listů.
- `obdobi` obsahuje kalendář, kruh období a úvod.
- `vykreslovani` obsahuje materiály, zakrytí světla, linky a částice.
- `kapitoly` obsahuje přepínání kapitol, nabídky a schéma fotosyntézy.

Související JavaScript a CSS jsou ve stejné složce.
Importy mezi složkami používají relativní cesty.
Přesun souboru vyžaduje opravu jeho importů a odkazů na assety.

## Dokumentace

- `FUNKCE` obsahuje krátké popisy chování pro uživatele.
- `dokumentace/moje` obsahuje tvoje definice obsahu a vzhledu, strategii a uživatelské testy.
- `dokumentace/system` obsahuje technickou architekturu oken a postup automatických kontrol pro práci agenta.
- `dokumentace/starsi` obsahuje původní implementační, časové a ekologické podklady a mapu dřívějšího přesunu souborů; nejde o aktuální definice vzhledu.
- V kořeni `dokumentace` zůstává rozcestník, tento přehled a evidence `zmeny.md`.
- Stáří původních podkladů je určené podle obsahu; Git je převzal hromadně 31. 10. 2026 a neprokazuje jejich přesné datum vzniku.
- `README.md` slouží jako hlavní rozcestník.
- `old/dokumentace` uchovává překonané podklady mimo aktivní dokumentaci: zálohu rozcestníku před rozdělením, starší technický přehled a původní popis barevného posunu a vody.
- Archiv je ignorovaný Gitem; původní verzované dokumenty lze obnovit také z historie repozitáře. Relativní odkazy archivních kopií odpovídají jejich původnímu umístění.

Popis každé funkce patří do vlastního souboru.
Obsah a chování oken jsou v `moje/okna.md`, jejich vzhled v `moje/vzhled_oken.md`.
Technické podrobnosti o oknech jsou v `system/architektura_oken.md`.
Původní architekturu popisuje `starsi/ARCHITEKTURA_IMPLEMENTACE.md`.
Produktovou strategii a metriky popisuje [Strategie](moje/strategie.md).
Prioritní problémy porozumění vymezuje [Problémy k řešení](moje/strategi_problems.md).
Záznamy uživatelského ověřování jsou v [Testech](moje/tests.md).
Nerealizované návrhy jsou v [Nápadech](moje/napady.md); nejde o definice hotového webu.
Přehled původních přesunů souborů je v `starsi/presun_souboru.json`.

## Podklady a nástroje

- `web_assets` obsahuje modely, textury, písma a knihovny.
- `tools` obsahuje pomocné nástroje.
- `tools/unisal_predict.py` vytváří lokální predikce pozornosti; postup je v [UNISAL](../tools/UNISAL.md), model a prostředí v ignorovaném `old`, výsledky v `nahledy/unisal`.
- `tools/check_documentation.py` kontroluje dokumentaci a přes `--files` předběžně vybrané pracovní soubory včetně syntaxe JS v HTML; `tools/pre-commit` je zdroj kontroly před commitem.
- `tools/review_documentation.py` spouští revizi po deseti commitech; `tools/post-commit` ji propojuje s Gitem a zachovává Git LFS.
- `tools/review_browser.mjs` získává pozorování kapitol a oken v Google Chromu; snímky a data jsou v `old/browser_review_<hash>`.
- `old/revize_dokumentace.md` obsahuje poslední pracovní report; stav a logy revize zůstávají v ignorovaném `old`.
- `testy/test_documentation_check.py` ověřuje kontrolor v dočasných repozitářích; `testy/test_preflight.py` kontroluje předběžnou kontrolu vybraných souborů a skriptů HTML.
- [Kontrola dokumentace](system/kontrola_dokumentace.md) popisuje instalaci, rozsah a pravidelnou revizi.
- `testy` obsahuje existující testovací skripty.
- `nahledy` obsahuje uložené obrázky z dřívějších kontrol.
- `old` obsahuje staré verze a pracovní výstupy.

Testovací skripty s cestami od kořene projektu se spouštějí ze složky `STROM`.
Obrázky z kontrol patří do `nahledy`.
Starší kopie hlavní stránky a pracovní diff jsou ve složce `old`.

## Verzování

- Kořenový `.gitignore` vylučuje závislosti, cache, zálohy, pracovní výstupy a osobní nastavení Obsidianu v celém projektu.
- `web_viewer/.gitignore` navíc vylučuje dokumentové exporty podle přípony.
- Obrázky, textury, modely a binární geometrie nejsou plošně ignorované; potřebné assety lze přidat do Gitu.
- Složky `old`, `nahledy` a `tmp` zůstávají ignorované i pro obrázky a modely.

- Git obsahuje web, dokumentaci, testy, nástroje a jejich podklady; nepoužitý model `strom_web_decimated.glb` se nepřidává.
- Kořenová `.gitattributes` ukládá GLB, binární geometrii a velké procedurální textury z `web_assets` přes Git LFS.
- Kořenový `spustit_strom_web.bat` a použité podklady ve složce `obrazky` jsou součástí verzovaného webu.
- Výjimkou z pracovního archivu je jednotlivě verzovaný podklad `old/leaf_light_calibration.json` pro existující test.
- Požadavky na spuštění a omezení starších testů uvádí [README](../README.md).

## Pravidla struktury

- Hlavní oblasti mají nadpis `##` a popisují umístění souborů podle účelu.
- Uváděj relativní cesty a krátké odpovědnosti; postupy sdílej odkazy.
- Pravidla a obecnou šablonu ponechávej na konci.

```markdown
## Název oblasti

- `cesta` obsahuje soubory daného účelu.
- [Postup](soubor.md#kotva) určuje podrobnosti.
```
