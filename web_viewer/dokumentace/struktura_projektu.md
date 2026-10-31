---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zavedeno porovnání definic se skutečným webem v Chromu po deseti commitech.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Změněn výstup revize dokumentace na Markdown.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněn spouštěč revize po commitu a umístění výsledného reportu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněno umístění kontroloru dokumentace, hooku, testů a pracovního stavu revize.
  - thread_id: 01a191dc-21ba-7b11-9e58-687e0a2cfbd7
    date: 2026-10-31
    change: Doplněn rozsah verzovaného webu, externí podklady a Git LFS.

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
- `dokumentace` obsahuje technickou architekturu a odborné podklady.
- `README.md` slouží jako hlavní rozcestník.

Popis každé funkce patří do vlastního souboru.
Obsah a chování oken jsou v `okna.md`, jejich vzhled v `vzhled_oken.md`.
Technické podrobnosti o oknech jsou v `architektura_oken.md`.
Celkovou architekturu popisuje `ARCHITEKTURA_IMPLEMENTACE.md`.
Přehled přesunutých souborů je v `presun_souboru.json`.

## Podklady a nástroje

- `web_assets` obsahuje modely, textury, písma a knihovny.
- `tools` obsahuje pomocné nástroje.
- `tools/check_documentation.py` kontroluje dokumentaci; `tools/pre-commit` je zdroj kontroly před commitem.
- `tools/review_documentation.py` spouští revizi po deseti commitech; `tools/post-commit` ji propojuje s Gitem a zachovává Git LFS.
- `tools/review_browser.mjs` získává pozorování kapitol a oken v Google Chromu; snímky a data jsou v `old/browser_review_<hash>`.
- `old/revize_dokumentace.md` obsahuje poslední pracovní report; stav a logy revize zůstávají v ignorovaném `old`.
- `testy/test_documentation_check.py` ověřuje kontrolor v dočasných repozitářích.
- [Kontrola dokumentace](kontrola_dokumentace.md) popisuje instalaci, rozsah a pravidelnou revizi.
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
