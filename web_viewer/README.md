---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Odstraněn odkaz na archivovaný starší technický přehled.
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
- [Fungování vodní a glukózové linky](dokumentace/moje/elementy.md#voda)
- [Technická architektura oken](dokumentace/system/architektura_oken.md)
- [Přehled celého projektu](dokumentace/struktura_projektu.md)
- [Architektura aplikace](dokumentace/starsi/ARCHITEKTURA_IMPLEMENTACE.md)
- [Ekologické podklady](dokumentace/starsi/EKOLOGIE_PODKLADY.md)

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

## Pravidla struktury

- Název dokumentu má úroveň `#`, oblasti přehledu `##`.
- Řaď přehled složek, odkazy na dokumenty, spuštění a testy.
- Historii udržuj ve frontmatteru a tuto část ponechávej na konci.

```markdown
# Název projektu

Krátký popis vstupu a spuštění.

## Kde co najdeš

| Složka | Obsah |
| --- | --- |
| `cesta` | Účel. |

## Dokumenty

- [Název](soubor.md)

## Spuštění z klonu

- Pokyn ke spuštění.

## Existující testy

- Rozsah a omezení testů.

## Pravidla struktury

- Pravidlo členění.
```
