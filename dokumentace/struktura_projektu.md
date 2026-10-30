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
