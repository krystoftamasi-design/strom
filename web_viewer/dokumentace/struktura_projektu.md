---
history:
  - thread_id: 01a191dc-21ba-7b11-9e58-687e0a2cfbd7
    date: 2026-10-31
    change: Doplněn rozsah verzovaného webu, externí podklady a Git LFS.
  - thread_id: 01a191dc-21ba-7b11-9e58-687e0a2cfbd7
    date: 2026-10-31
    change: Upřesněno verzování assetů a rozsah kořenových pravidel ignorování.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Doplněn samostatný dokument vzhled_oken.md do uspořádání dokumentace.
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
