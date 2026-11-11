---
history:
  - thread_id: 01a1943d-30ff-7d43-bbee-d60f487d7880
    date: 2026-11-01
    change: Zvětšeny částice O₂ a CO₂ a doplněno jejich zvýraznění při otevření příslušného okna.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Odstraněn Průtok a doplněny vzorce i šablona číselného okna podle Fotosyntézy.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zpřehledněna Transpirace podle poznatků z uživatelského testu.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura Transpirace, její okna a elementy podle vzoru Fotosyntézy.

---

# Elementy

- Zvýrazněné linky jsou přibližně tří- až 3,4násobně silné při zachování barvy; zvýrazněné částice H₂O, O₂ a CO₂ mají 2,5násobnou velikost. Zvýraznění i návrat trvají přibližně 180 ms; při omezení pohybu jsou okamžité.
- Definované zvýraznění spojení se spouští také při najetí na celou plochu souvisejícího okna nebo jeho otevřený detail. Trvá po dobu najetí nebo otevření alespoň jednoho souvisejícího detailu v aktivní kapitole; po skončení obou stavů se obnoví původní vzhled. Prázdná plocha nadále propouští ovládání stromu.

### Voda linka

**Tag:** 🔵 `water`
Definice spojení

- Okna: [Voda](okna.md#voda) ve Fotosyntéze; [Transpirace](okna.md#transpirace), [Příjem vody](okna.md#příjem-vody) v Transpiraci.
- **Zvýraznění**
- při otevření okna modrá linka zesílí a po její trase začne putovat pulzující vlna tloušťky.

**Chování elementu**

- Modrá linka vede z kořenů přes kmen k listům.
- Při fotosyntéze proudí nahoru.
- Při červenání prvního listu se stahuje od kořenů k listům.
- Při vstupu do kapitoly zachovává aktuální stav podle [Společného stahování linek](#společné-stahování-linek).
- Rychlost nočního stahování určuje [Společné stahování linek](#společné-stahování-linek).


### Glukóza linka

**Tag:** 🟣 `sugar`
Definice spojení

- Okno: [Cukry](okna.md#cukry).
- **Zvýraznění**
- Otevřený detail zesílí tloušťku celé fialové linky v kapitole Fotosyntéza a spustí po její trase putující pulzaci, včetně výchozího otevření.
- Mimo kapitolu Fotosyntéza se zvýraznění vypne.

**Chování elementu**

- Fialová linka vede po kmeni a dělí se do dvou kořenů.
- Rychlost animace je společná s vodní linkou podle [Společné rychlosti linek](#společná-rychlost-linek).
- Je odsazená od modré linky.
- Končí dřív uvnitř kořenů.
- Na jaře proudí ze zásob v kořenech a kmeni k novým listům.
- V létě proudí z listů do kmene a kořenů.
- Stahování se řídí vlastní délkou trasy.
- Rychlost nočního stahování určuje [Společné stahování linek](#společné-stahování-linek).

#### Společné stahování linek

- Přepnutí kapitoly neresetuje stažení ani stav červenání listů; skryté linky se při návratu krátce neobnovují na plnou délku.
- Při zastavení fotosyntézy se sluncem na obzoru nebo pod ním se obě linky plně stáhnou za přibližně 1,2 sekundy animace.
- Ranní rozvinutí a ostatní stahování trvá přibližně 3,6 sekundy animace.

#### Společná rychlost linek

- Voda a glukóza používají stejný plynulý čas přehrávání s pomalým základním tempem.
- Pauza a rychlosti modelového času 1×, 2× a 4× ovlivňují obě linky shodně včetně pulzace zvýraznění.
- Odpar, aktivita fotosyntézy a posuvník proudění rychlost obou linek nemění; zastavení fotosyntézy řídí jejich stahování, nikoli tempo animace.

#### Šířka linek

- Voda i glukóza mají stejnou základní šířku nezávisle na přísunu vody. Zvýraznění linky se řídí společným pravidlem elementů.

### H₂O

**Tag:** 🔵 `water`
Definice spojení

- Okna: [Transpirace](okna.md#transpirace), [Příjem vody](okna.md#příjem-vody).
- Reakce na okno: při otevření souvisejícího vodního detailu se částice zvětší stejným poměrem jako O₂ a CO₂; po zavření všech souvisejících detailů v aktivní kapitole se vrátí běžná velikost.

**Chování elementu**

- Modré nápisy H₂O představují vodní páru, nikoli kyslík vznikající při fotosyntéze.
- V Transpiraci vznikají s odstupem od konce vodní linky v koruně, stoupají a rozptylují se ve stejném kuželu jako O₂; při vzniku rostou a při zániku se zmenšují stejně jako ostatní plynové částice.
- Emise probíhá při kladném modelovém odparu a plně rozvinuté vodní lince; při jejím stažení se nové částice nevytvářejí. Mimo Transpiraci jsou skryté.
- Částice používají tři malované PNG textury H₂O a přehrávání částicového systému; jejich běžná velikost odpovídá O₂ a CO₂. Počet částic je schematický, nikoli měřítko litrů vody.

### O₂

**Tag:** 🔹 `oxygen`
Definice spojení

- Okno: [O₂](okna.md#o₂).
- Reakce na okno: při otevření detailu se částice výrazně zvětší.

**Chování elementu**

- Světle modré částice odlétají od listů; jejich běžná velikost odpovídá H₂O.

### CO₂

**Tag:** 🔶 `co2`
Definice spojení

- Okno: [CO₂](okna.md#co₂).
- Reakce na okno: při otevření detailu se částice výrazně zvětší.

**Chování elementu**

- Červenooranžové částice přicházejí ke koruně; jejich běžná velikost odpovídá H₂O.

### Fotony

**Tag:** nepřiřazený
Definice spojení

- Okno: [Světlo](okna.md#světlo).
- Reakce na okno: není definovaná.

**Chování elementu**

- Žluté částice putují od slunce k listům podle dostupnosti světla, nezávisle na vodě. Vznik kyslíku a spotřebu CO₂ nadále řídí aktivita fotosyntézy.

### Cesta vody

**Tag:** 🔵 `water`
Definice spojení

- Kapitola: [Transpirace](okna.md#kapitola-transpirace).
- **Viditelnost**
- Svislý přehled cesty vody je v Transpiraci viditelný bez ohledu na stav detailů oken.

**Chování elementu**

- Textové schéma Kořeny → Xylém → Listy → pára ukazuje cestu vody.
- Stálý přehled ukazuje kořeny dole, kmen uprostřed a listy nahoře; popisky rozlišují příjem, proudění vzhůru a odpar s chlazením.
- Je statické; šipky neudávají rychlost ani měřený průtok.

### Padající semena

**Tag:** 🟤 `seeds`
Definice spojení

- Okno: [Semena](okna.md#semena).
- **Zvýraznění**
- Při najetí na okno nebo otevření jeho detailu se uvolněná semena zvětší. Zvýraznění řídí společné pravidlo nahoře.

**Chování elementu**

- Ve druhé polovině jara se na větvích v koruně objeví malé modely. Přes léto rostou a na podzim hnědnou a rozevírají se směrem k zemi. Světlo a stín koruny ovlivňují jejich vzhled.
- V podzimní fázi se spustí pád dvou semen z každého modelu. Prázdné obaly padají v období opadu listů. Semena a obaly zůstávají pod stromem přes zimu.
- Průběh určuje ovládání období. Pauza zastaví pád a při omezení pohybu se výsledek zobrazí rovnou. Modely se zobrazují v Semenaci a jejich počet i měřítko jsou schematické.
- Šíření živočichy vysvětluje související okno.

### Pravidlo propojení

- Okno a související element spojuje stejný tag; barva tagu odpovídá barevnému tématu.
- Tag určuje vazbu, část „Definice spojení“ určuje její chování.
- Samotná shoda barvy ani výskyt barevného tagu ve vzorci nespouští zvýraznění.
- Reakce na okno se popisuje pouze u elementu; okno na něj odkazuje.
- Do „Definice spojení“ patří jen související okno a reakce elementu na jeho stav.
- Kliknutí, tlačítka, přepínání detailu a uchování jeho stavu popisuj v `okna.md`, nikoli u elementu.
- Vlastní vzhled, trasa a proudění patří do „Chování elementu“.

### Pravidla struktury

- Před úpravou tohoto dokumentu přečti pravidla na jeho konci.
- Každý element zapisuj ve stejném pořadí podle následující šablony.
- Název elementu má úroveň `###`.
- Před názvem tagu použij barevnou značku tématu: 🔵 `water`, 🟣 `sugar`, 🔹 `oxygen`, 🔶 `co2`, 🟡 `light`, 🟤 `seeds`.
- Používej běžný Markdown bez HTML stylů; značky rozlišují témata, nereprodukují přesné odstíny webu.
- Pokud tag, okno nebo reakce nejsou určené, výslovně to uveď; vazbu nevymýšlej.
- Typ reakce v definici spojení pojmenuj podle zadání; zvýraznění není povinné. Uváděj jen podmínky a reakce, které jsou definované.
- Společná pravidla, například šířku linek, popisuj samostatně bez šablony elementu.

```markdown
### Název elementu

**Tag:** 🔵 `tag`
Definice spojení

- Okno: [Název](okna.md#kotva).
- **Název reakce**
- Podmínka a odpovídající reakce elementu.
- Další definovaná podmínka a reakce.

**Chování elementu**

- Vzhled a průběh elementu.
- Další chování elementu.
```

[Zpět na obsah](../architektura_obsahu.md)
