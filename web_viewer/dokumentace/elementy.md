---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zobecněna šablona a pravidla spojení pro libovolný definovaný typ reakce.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upřesněno oddělení reakce elementu od ovládání a stavu okna.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Nahrazeny nevykreslené HTML styly tagů barevnými značkami v Markdownu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Obarveny tagy přesnými barvami témat z webu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura všech elementů a přidána závazná šablona na konec dokumentu.
---

# Elementy

### Voda linka

**Tag:** 🔵 `water`
Definice spojení

- Okno: [Voda](okna.md#voda).
- **Zvýraznění**
- při otevření okna se modrá linka rozjasní.
- Při zavření se vrátí původní vzhled.

**Chování elementu**

- Modrá linka vede z kořenů přes kmen k listům.
- Při fotosyntéze proudí nahoru.
- Při červenání prvního listu se stahuje od kořenů k listům.
- Při vstupu do kapitoly je hned celá viditelná.


### Glukóza linka

**Tag:** 🟣 `sugar`
Definice spojení

- Okno: [Cukry](okna.md#cukry).
- **Zvýraznění**
- Otevřený detail rozjasní celou fialovou linku v kapitole Fotosyntéza, včetně výchozího otevření.
- Při zavření se vrátí původní vzhled.
- Mimo kapitolu Fotosyntéza se zvýraznění vypne.

**Chování elementu**

- Fialová linka vede po kmeni a dělí se do dvou kořenů.
- Je odsazená od modré linky.
- Končí dřív uvnitř kořenů.
- Na jaře proudí ze zásob v kořenech a kmeni k novým listům.
- V létě proudí z listů do kmene a kořenů.
- Stahování se řídí vlastní délkou trasy.

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

[Zpět na obsah](architektura_obsahu.md)
