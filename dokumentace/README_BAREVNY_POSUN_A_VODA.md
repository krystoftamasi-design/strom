# Barevný posun listů a voda

Tento dokument popisuje pouze dvě části webového stromu:

1. barevný posun listů mezi sezónami,
2. vliv zásoby vody na schnutí listů a tok mízy.

Hlavní logika je v:

- `index.html` — hodnoty ze sliderů a stav vody,
- `listy/leaf_controls.js` — stabilní data pro jednotlivé listy,
- `vykreslovani/leaf_material.js` — výsledný GPU shader barvy listů.

## 1. Vstupní hodnoty ze sliderů

### Sezóna

Slider `sliderSeason` má rozsah `0–100 %`.

| Hodnota | Význam |
|---:|---|
| `0 %` | jaro |
| `25 %` | léto |
| `50 %` | podzim |
| `100 %` | pozdní podzim |

Hodnota se ukládá do:

```js
userSeasonShift
```

Výchozí hodnota je:

```js
userSeasonShift = 0.50;
```

To znamená podzim.

### Rychlost přechodu

```js
uDryingSpeed
```

Ovládá, jak rychle list projde barevným přechodem. Nezmění pořadí větví, jen délku přechodu.

### Délka žluté fáze

Slider `sliderYellowPhase` ovládá uniform:

```js
uYellowPhaseWidth
```

Rozsah je `0–100 %`, výchozí hodnota je `65 %`.

- `0 %`: žlutá fáze je krátká a list rychleji přejde do červené,
- `100 %`: žlutá fáze trvá téměř až do konce sezónního průběhu.

Shader nyní používá samostatnou barevnou posloupnost:

```text
zelená → žlutá → červená → hnědý konec
```

### Opadávání listů

Opadávání není řízené sliderem ani další barvicí křivkou. U každého listu se použije jeho existující hodnota červené fáze `autumn`. Jakmile dosáhne `1.0` (100 % červené), zapíše se jednorázový čas opadu. Každý list dostane stabilní hodnoty:

Opadávání lze kdykoli zapnout nebo vypnout tlačítkem `Opadávání: zapnuto/vypnuto`. Při vypnutí se vynulují časy pádu a listy se vrátí na původní pozice. Po opětovném zapnutí se automatika může znovu spustit u listů, které už jsou na 100 % červené.

```text
leafFallSeed
leafFallDelay
leafFallDistance
```

Po dosažení `autumn = 1.0` se k času přidá krátká stabilní náhodná prodleva. Potom už pád není navázaný na žádnou hodnotu barvy ani sezóny, ale pouze na čas pádu. List postupně dostane:

- svislý pád,
- malý náhodný posun do stran,
- lehké houpání ve větru,
- na konci se skryje.

Spouštěcí podmínka:

```glsl
if (autumn >= 1.0) {
  leafFallStartTime = currentTime + randomDelay;
}
```

Samotný pád:

```glsl
float fallProgress =
  smoothstep(leafFallStartTime, leafFallStartTime + 2.6, currentTime);
```

List tedy začne padat až při své vlastní hodnotě `autumn = 1.0`. Náhodná prodleva pouze určuje okamžik spuštění; nepoužívá se jako další barevný práh.

### Ostrost hranice

```js
uDryingSharpness
```

- nízká hodnota: širší a měkčí barevná hranice,
- vysoká hodnota: užší hranice mezi oblastmi,
- při vysoké hodnotě se změna drží přibližně v jedné až dvou sousedních skupinách listů.

## 2. Stav vody

Hodnota ze slideru vody se ukládá do:

```js
treeWaterLiters
```

Slider má:

```text
minimum: 0 L
maximum: 1500 L
krok: 10 L
výchozí hodnota: 800 L
```

Pro výpočet toku se používá normovaná voda:

```js
normWater = treeWaterLiters / 800.0;
```

Hodnota `800 L` je považována za normální hydrataci.

## 3. Kdy začne strom schnout

```js
DROUGHT_WATER_THRESHOLD = 350;
```

Pokud je:

```text
treeWaterLiters >= 350
```

strom není v akutním suchu.

Pokud je:

```text
treeWaterLiters < 350
```

začne odpočet:

```js
droughtDelayTimer
```

Odpočet trvá:

```js
DROUGHT_DELAY_SEC = 2.5;
```

Prvních 2,5 sekundy se barva ještě nemění. Strom simuluje čerpání vnitřních zásob.

## 4. Průběh schnutí

Po uplynutí odpočtu roste:

```js
droughtDryProgress
```

Rozsah je:

```text
0.0 = zdravý stav
1.0 = úplně suchý stav
```

Rychlost schnutí:

```js
DROUGHT_DRY_SPEED = 0.22;
```

Při této hodnotě trvá přechod do plného sucha přibližně 4,5 sekundy.

Aktuální stav se každý snímek přibližně chová takto:

```js
droughtDryProgress += delta * DROUGHT_DRY_SPEED;
```

Hodnota je omezená na maximum `1.0`.

## 5. Regenerace po doplnění vody

Když voda znovu dosáhne alespoň `350 L`:

- odpočet schnutí se vrací zpět,
- `droughtDryProgress` začne klesat,
- listy se začnou barevně regenerovat.

Rychlost regenerace:

```js
DROUGHT_RECOVER_SPEED = 0.32;
```

Přibližná doba návratu z úplného sucha:

```text
1.0 / 0.32 ≈ 3,1 sekundy
```

Regenerace je v současné implementaci vratná. To znamená, že po doplnění vody se listy mohou vrátit zpět k barvě sezóny.

## 6. Jak se spojí sezóna a sucho

Nejdříve se vytvoří efektivní sezónní hodnota:

```js
const dryTargetShift = 1.08;

const effectiveShift =
  userSeasonShift * (1.0 - droughtDryProgress)
  + dryTargetShift * droughtDryProgress;
```

Význam:

- při `droughtDryProgress = 0` se používá čistě sezóna ze slideru,
- při `droughtDryProgress = 1` se používá suchý stav `1.08`,
- mezi tím se obě hodnoty plynule smíchají.

Potom se hodnota převede do shaderu:

```js
uSeasonOffset = (effectiveShift - 0.5) * 0.44;
```

Shader ji převede na rozsah `0–1`:

```glsl
float seasonProgress =
  clamp(uSeasonOffset / 0.44 + 0.5, 0.0, 1.0);
```

## 7. Pořadí schnutí podle větví

Každý list má předpočítané hodnoty:

```text
dryingPriority
dryingRegionPriority
```

Ty určují, kdy list začne měnit barvu vzhledem k ostatním listům.

V shaderu se vybere priorita:

```glsl
float priority =
  mix(vDryingPriority, vDryingRegionPriority, sharpness);
```

Začátek změny listu:

```glsl
float leafStart =
  0.385 + (1.0 - clamp(priority, 0.0, 1.0)) * 0.38;
```

Tím vzniká postup:

```text
jedna oblast větví → další oblast → vzdálenější větve → zbytek koruny
```

Barevná hranice se vyhladí funkcí:

```glsl
smoothstep(...)
```

Proto listy nepřepínají barvu skokem.

## 8. Stabilní randomizace listů

Randomizace se počítá jednou ze stabilního ID listu. Nepoužívá se `Math.random()` každý snímek.

Díky tomu:

- list při pohybu kamery nebliká,
- každý list má stále stejnou odchylku,
- náhodné rozložení je reprodukovatelné.

### Odezva na červený pigment

Každý list dostane:

```text
seasonalRedResponse = 0.25–1.0
```

Ve shaderu tato hodnota posouvá začátek červenohnědé fáze. Některé listy proto zůstávají déle zelenější nebo žlutější, ale randomizace už nesnižuje konečný stav.

### Zpoždění přibližně 25 % listů

Přibližně čtvrtina listů dostane:

```text
seasonalDelay = 0.18–0.40
```

U ostatních listů je:

```text
seasonalDelay = 0.0
```

Zpožděný průběh:

```glsl
float delayedSeasonProgress = clamp(
  (seasonProgress - seasonalDelay) /
  (1.0 - seasonalDelay),
  0.0,
  1.0
);
```

Zpožděné listy tedy začnou později, ale normalizace zajišťuje, že při konci fáze také dosáhnou stejného koncového stavu.

U červenohnědé fáze se náhodná hodnota používá jako posun začátku:

```glsl
float redStart = mix(0.35, 0.70, 1.0 - redResponse);
float yellowPhaseWidth = clamp(uYellowPhaseWidth, 0.0, 1.0);
float yellowStart = 0.12;
float yellowEnd = mix(redStart + 0.04, 0.95, yellowPhaseWidth);
float yellow = smoothstep(yellowStart, yellowEnd, leafProgress);
float autumn = smoothstep(yellowEnd, 1.0, leafProgress);
```

Žlutá barva se mezi `yellowStart` a `yellowEnd` míchá do listu před červeným pigmentem. Při `leafProgress = 1.0` je `autumn` vždy `1.0`, takže na konci nezůstanou zelenější listy.

## 9. Barevné fáze v shaderu

Zjednodušený průběh je:

```text
zelená
  ↓
sezónní varianta zelené
  ↓
žlutá fáze řízená sliderem
  ↓
červený pigment
  ↓
suchý hnědý konec
```

Základní barva listu se skládá z:

```glsl
base = zelená barva + procedurální detail listu
```

Stínová barva je oddělená:

```glsl
shadowBase = tmavý modro-fialový stín + procedurální detail
```

Sezónní barevný posun se aplikuje hlavně na osvětlenou část listu. Stín zůstává tmavý, aby se neztratil toon kontrast.

Výstup shaderu je zjednodušeně:

```glsl
finalColor =
  mix(shadowBase, seasonalColor, lightRamp);
```

## 10. Jak voda ovlivňuje tok mízy

Voda nemění pouze barvu listů. Ovlivňuje také rychlost a záři toku mízy.

### Rychlost toku

```js
const waterFlowMult =
  normWater <= 0.001
    ? 0.0
    : Math.min(1.4, Math.pow(normWater, 0.65));
```

Výsledná rychlost:

```js
sapUniforms.uSpeed.value =
  userSpeed * waterFlowMult;
```

Při `0 L` se tok zastaví. Při nízké vodě se zpomalí.

### Záře toku

```js
const waterGlowMult =
  normWater <= 0.001
    ? 0.30
    : Math.min(1.2, 0.45 + 0.55 * normWater);
```

Výsledná záře:

```js
sapUniforms.uGlow.value =
  userGlow * waterGlowMult;
```

Při nedostatku vody tedy tok:

- teče pomaleji,
- má menší záři,
- při `0 L` se pohyb zastaví, ale slabá minimální záře zůstává.

## 11. Celý výpočet v krátké podobě

```text
slider sezóny
      +
stabilní priorita listu
      +
stabilní randomizace pigmentu
      +
stabilní zpoždění části listů
      +
stabilní pořadí opadávání
      +
zásoba vody
      ↓
průběh schnutí
      ↓
efektivní sezónní hodnota
      ↓
GPU shader
      ↓
zelená → žlutá → oranžová → červená → hnědá
      ↓
červená fáze dosáhne prahu → pád listů
```

Současně:

```text
zásoba vody
      ↓
rychlost toku mízy
      +
záře toku mízy
```
