---
history:
  - thread_id: 01a191dc-21ba-7b11-9e58-687e0a2cfbd7
    date: 2026-10-31
    change: Doplněny požadavky na klonování, spuštění a omezení existujících testů.
---

# Webový prohlížeč stromu

Hlavní stránka je `index.html`.
Projekt spustíš souborem `spustit_web_viewer.bat`.

## Kde co najdeš

| Složka | Obsah |
| --- | --- |
| `okna` | Texty, hodnoty, vzhled a pohyb oken kolem stromu. |
| `ekologie` | Výpočty vody, fotosyntézy a cukrů. |
| `listy` | Ovládání, vítr, růst, pád a usychání listů. |
| `obdobi` | Kalendář, kruh období a úvodní animace. |
| `vykreslovani` | Materiály, světlo, vodní linky a částice. |
| `kapitoly` | Kapitoly, nabídky a samostatné schéma fotosyntézy. |
| `FUNKCE` | Krátké popisy toho, jak se jednotlivé části chovají. |
| `dokumentace` | Architektura, odborné podklady a přehled souborů. |
| `web_assets` | Modely, textury, písma a knihovny. |
| `tools` | Pomocné nástroje. |
| `testy` | Existující testovací skripty. |
| `nahledy` | Uložené obrázky z dřívějších kontrol. |
| `old` | Staré verze a pracovní výstupy. |

## Dokumenty

- [Fungování oken](FUNKCE/okna_u_stromu.md)
- [Fungování vodní a glukózové linky](dokumentace/elementy.md#voda)
- [Technická architektura oken](dokumentace/architektura_oken.md)
- [Přehled celého projektu](dokumentace/struktura_projektu.md)
- [Architektura aplikace](dokumentace/ARCHITEKTURA_IMPLEMENTACE.md)
- [Ekologické podklady](dokumentace/EKOLOGIE_PODKLADY.md)
- [Starší technický přehled](dokumentace/technicky_prehled.md)

## Spuštění z klonu

- Nainstaluj Git LFS a po naklonování spusť z kořene repozitáře `git lfs pull` pro stažení modelů, geometrie a velkých procedurálních textur.
- Spouštěč vyžaduje Python 3 a Google Chrome; `spustit_web_viewer.bat` volá kořenový `spustit_strom_web.bat`.
- Server používá kořen repozitáře; stránka je na `http://localhost:8080/web_viewer/index.html`.
- Textura kruhu období zůstává v `obrazky/textury/OVLADACI LINKA/LINKA.png`; zdroj pro nástroj extrakce linek je v `obrazky/textury/UI/ui_new.svg`.

## Existující testy

- Testy se spouštějí z kořene repozitáře; některé vyžadují Node.js, Playwright a Sharp.
- Některé skripty obsahují původní absolutní cestu k lokálním závislostem, používají Edge nebo porovnávají nyní odlišné vstupní HTML; před použitím potřebují samostatnou úpravu.
- Kalibrační podklad `old/leaf_light_calibration.json` je verzovaný jednotlivě; ostatní pracovní výstupy v `old` zůstávají ignorované.
- V rámci přidání souborů do Gitu se funkční ani prohlížečové testy nespouštěly; finální kontrola uživatelem.
