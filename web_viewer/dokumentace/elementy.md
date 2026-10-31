---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena struktura všech elementů a přidána závazná šablona na konec dokumentu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upraven zápis tagu a definice spojení vodní linky podle ukázky.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunuto pravidlo propojení na konec dokumentu pod definice elementů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Uspořádány definice podle společného tagu, spojení a chování elementu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upřesněno ovládání a rozsah zvýraznění glukózové linky.
---

# Elementy

### Voda linka

**Tag:** `water`
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

**Tag:** `sugar`
Definice spojení

- Okno: [Cukry](okna.md#cukry).
- Akce: kliknutí na nadpis Cukry nebo tlačítko +/− přepne detail.
- **Zvýraznění**
- Otevřený detail rozjasní celou fialovou linku v kapitole Fotosyntéza, včetně výchozího otevření.
- Při zavření se vrátí původní vzhled.
- Mimo kapitolu Fotosyntéza se zvýraznění vypne; stav detailu zůstává zachovaný.

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

**Tag:** `oxygen`
Definice spojení

- Okno: [O₂](okna.md#o₂).
- **Zvýraznění**
- Není definované.

**Chování elementu**

- Světle modré částice odlétají od listů.

### CO₂

**Tag:** `co2`
Definice spojení

- Okno: [CO₂](okna.md#co₂).
- **Zvýraznění**
- Není definované.

**Chování elementu**

- Červenooranžové částice přicházejí ke koruně.

### Fotony

**Tag:** nepřiřazený
Definice spojení

- Okno: nepřiřazené.
- **Zvýraznění**
- Není definované.

**Chování elementu**

- Žluté částice putují od slunce k listům.

### Pravidlo propojení

- Okno a související element spojuje stejný tag; barva tagu odpovídá barevnému tématu.
- Tag určuje vazbu, část „Definice spojení“ určuje její chování.
- Samotná shoda barvy ani výskyt barevného tagu ve vzorci nespouští zvýraznění.
- Reakce na okno se popisuje pouze u elementu; okno na něj odkazuje.

### Pravidla struktury

- Před úpravou tohoto dokumentu přečti pravidla na jeho konci.
- Každý element zapisuj ve stejném pořadí podle následující šablony.
- Název elementu má úroveň `###`.
- Za tag nepřidávej název barvy; vzhled popiš v chování elementu.
- Pokud tag, okno nebo zvýraznění nejsou určené, výslovně to uveď; vazbu nevymýšlej.
- Společná pravidla, například šířku linek, popisuj samostatně bez šablony elementu.

```markdown
### Název elementu

**Tag:** `tag`
Definice spojení

- Okno: [Název](okna.md#kotva).
- **Zvýraznění**
- Chování při otevření okna.
- Chování při zavření okna.

**Chování elementu**

- Vzhled a průběh elementu.
- Další chování elementu.
```

[Zpět na obsah](architektura_obsahu.md)
