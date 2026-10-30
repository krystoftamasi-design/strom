# Čas a období v projektu STROM

Tento soubor popisuje nastavení času, denního cyklu, noci a ročních období ve webovém vieweru.

## Denní čas

Posuvník času dne používá hodnoty od `0:00` do `24:00`.

- den: `6:00–18:00`
- noc: `18:00–6:00`
- svítání a soumrak se dopočítávají podle výšky Slunce
- čas se při zapnutém cyklu posouvá automaticky
- tlačítko pauzy čas zastaví
- rychlost lze ovládat tlačítky `1×`, `2×` a `4×`

Základní modelová rychlost je `24 modelových minut za skutečnou sekundu`.

## Rychlost noci

Rychlost je nastavena v souboru `index.html` ve funkci `getDayClockSpeed()`.

### Běžné části projektu

- násobič noci: `12×`
- délka celé noci `12 hodin`: přibližně `2,5 skutečné sekundy` při rychlosti `1×`
- při rychlosti `2×`: přibližně `1,25 sekundy`
- při rychlosti `4×`: přibližně `0,63 sekundy`

### Úvod projektu

- násobič noci: `0,6×`
- úvod má vlastní časový násobič `10×`
- délka celé noci: přibližně `5 skutečných sekund` při rychlosti `1×`

Úvod je proto záměrně pomalejší než ostatní části projektu.

## Roční období

Projekt používá tato období:

- `Jaro`: listy `65 %`, poptávka vody `65 %`, přítok vody `68 %`
- `Léto`: listy `100 %`, poptávka vody `100 %`, přítok vody `55 %`
- `Podzim`: listy `35 %`, poptávka vody `35 %`, přítok vody `38 %`
- `Zima`: listy `0 %`, poptávka vody `4 %`, přítok vody `6 %`

Nastavení období je v souboru `ekologie/tree_ecology.js` v objektu `SEASONS`.

## Historie změn

### 25. 10. 2026

- běžná noc byla zrychlena z násobiče `2×` na `6×`
- běžná noc byla následně zrychlena z `6×` na `12×`
- běžná noc nyní trvá přibližně `2,5 sekundy`
- úvod byl nastaven na násobič `0,6×`
- noc v úvodu nyní trvá přibližně `5 sekund`

## Zdrojové nastavení

Aktuální řádek v `index.html` má tento význam:

```js
const nightSpeed = isNight ? (chapterApp.introduction ? 0.6 : 12) : 1;
```

Při budoucí změně rychlostí se má aktualizovat také část **Historie změn** v tomto souboru.

