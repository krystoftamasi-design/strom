---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunuto ovládání a uchování stavu Cukrů k oknu a doplněna pravidla struktury.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Nahrazeny nevykreslené HTML styly tagů barevnými značkami v Markdownu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Obarveny tagy přesnými barvami témat z webu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněny tagy oken shodné s tématy a souvisejícími elementy.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Doplněn přesný obsah oken podle záznamů v element_ui_okna_obsah.js.
---

# Okna

## Kapitola Fotosyntéza

### Okna

#### Fotosyntéza

**Tag:** 🟡 `light`

- Nadpis: `Fotosyntéza`.
- Téma: světlo; strana: vlevo; hlavní okno.
- Detailní text: „Listy využívají světlo k tvorbě cukrů z vody a oxidu uhličitého. Při ději se uvolňuje kyslík. Cukry dodávají stromu energii i materiál pro růst.“
- Hodnota: `activity`, zobrazená v procentech.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.

#### O₂

**Tag:** 🔹 `oxygen`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „Při ději se uvolňuje kyslík.“
- Číselná hodnota a vstupy výpočtu: nejsou zapnuté.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „Oproti předindustriální hodnotě jde přibližně o nárůst 50 %. Vyšší CO₂ může podpořit fotosyntézu.“
- Číselná hodnota a vstupy výpočtu: nejsou zapnuté.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Hodnota: `glucoseGramsPerMinute`, jednotka `g/min`.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: otevřený.
- Ovládání detailu: kliknutí na nadpis Cukry nebo tlačítko +/− přepne detail.
- Stav detailu zůstává zachovaný při změně kapitoly.
- Související element: [Glukóza linka](elementy.md#glukóza-linka).

#### Voda

**Tag:** 🔵 `water`

- Nadpis: `Voda`.
- Téma: voda; strana: vpravo.
- Detailní text: „Při nedostatku vody se přivírají průduchy. Do listů proniká méně CO₂ a fotosyntéza slábne. Zkuste omezit přítok nebo snížit slunce pod obzor.“
- Ovládání: posuvník `sliderTreeWater`, popisek `Voda`.
- Výchozí stav detailu: otevřený.
- Související element: [Voda linka](elementy.md#voda-linka).

## Související dokumenty

- [Vzhled oken](vzhled_oken.md)

- [Technická architektura](architektura_oken.md)
- [Stav změn](zmeny.md)
- [Obsah](architektura_obsahu.md)

## Pravidla struktury

- Kapitola má úroveň `##`, oblast `###` a konkrétní okno `####`.
- U okna uváděj tag a stručné body s obsahem, hodnotami, ovládáním a stavem detailu.
- Ovládání okna a uchování stavu popisuj zde; reakci souvisejícího elementu definuj pouze v `elementy.md` a odkaž na ni.
- Uváděj pouze položky, které se daného okna týkají.
- Odkazy na související dokumenty ponechávej před těmito pravidly.

```markdown
## Kapitola Název

### Okna

#### Název okna

**Tag:** 🔵 `tag`

- Nadpis: `Název`.
- Obsah: popis obsahu okna.
- Hodnota: veličina a jednotka.
- Ovládání detailu: způsob otevření a zavření.
- Výchozí stav detailu: otevřený nebo zavřený.
- Související element: [Název](elementy.md#kotva).
```
