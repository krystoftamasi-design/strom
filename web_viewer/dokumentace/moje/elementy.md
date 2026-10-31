---
history:
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
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Přepnutí kapitoly zachovává aktuální stažení linek bez jejich opětovného zobrazení.

---

# Elementy

### Voda linka

**Tag:** 🔵 `water`
Definice spojení

- Okna: [Voda](okna.md#voda) ve Fotosyntéze; [Transpirace](okna.md#transpirace), [Příjem vody](okna.md#příjem-vody) v Transpiraci.
- **Zvýraznění**
- při otevření okna modrá linka výrazně ztloustne a po její trase začne putovat pulzující vlna tloušťky.
- Zvýraznění trvá, dokud je v aktivní kapitole otevřen alespoň jeden související detail; po zavření všech se vrátí původní vzhled.

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
- Otevřený detail výrazně zesílí tloušťku celé fialové linky v kapitole Fotosyntéza a spustí po její trase putující pulzaci, včetně výchozího otevření.
- Při zavření se vrátí původní vzhled.
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

- Voda a glukóza jsou vždy stejně široké.
- Vyšší přísun vody rozšiřuje obě linky.
- Při nulovém přísunu zůstávají obě velmi tenké.

### O₂

**Tag:** 🔹 `oxygen`
Definice spojení

- Okno: [O₂](okna.md#o₂).
- Reakce na okno: není definovaná.

**Chování elementu**

- Světle modré částice odlétají od listů.

### CO₂

**Tag:** 🔶 `co2`
Definice spojení

- Okno: [CO₂](okna.md#co₂).
- Reakce na okno: není definovaná.

**Chování elementu**

- Červenooranžové částice přicházejí ke koruně.

### Fotony

**Tag:** nepřiřazený
Definice spojení

- Okno: nepřiřazené.
- Reakce na okno: není definovaná.

**Chování elementu**

- Žluté částice putují od slunce k listům.

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
- Před názvem tagu použij barevnou značku tématu: 🔵 `water`, 🟣 `sugar`, 🔹 `oxygen`, 🔶 `co2`, 🟡 `light`.
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
