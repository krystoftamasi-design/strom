---
history:
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Doplněny výukové texty do oken Fotosyntéza, Cukry, Voda, CO₂ a O₂.
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Sjednoceno zobrazení hodnot O₂, CO₂, Vody a Cukrů na jedno desetinné místo.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Odstraněn posuvník z okna Voda; dokumentace uvádí, že ovládání je vypnuté.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Rozlišeny produkce a spotřeba hodnot; CO₂ změněno z koncentrace na spotřebu v g/min a Voda na spotřebu v l/h.
  - thread_id: 01a192cd-90b3-7e21-8050-fdf9990fe825
    date: 2026-10-31
    change: Doplněny vstupy výpočtu a číselné hodnoty s jednotkami do oken O₂, CO₂ a Voda.
---

# Okna

## Kapitola Fotosyntéza

### Okna

#### Fotosyntéza

**Tag:** 🟡 `light`

- Nadpis: `Fotosyntéza`.
- Téma: světlo; strana: vlevo; hlavní okno.
- Detailní text: „Listy využívají světlo k tvorbě cukrů z vody a oxidu uhličitého. Při ději se uvolňuje kyslík. Cukry dodávají stromu energii i materiál pro růst. Rychlost procesu závisí na světle, vodě, ploše aktivních listů, CO₂ a teplotě.“
- Hodnota: `activity`, zobrazená v procentech.
- Vstupy výpočtu: zapnuté.
- Výsledná hodnota: zapnutá.
- Výchozí stav detailu: zavřený.

#### O₂

**Tag:** 🔹 `oxygen`

- Nadpis: `O₂`.
- Téma: kyslík; strana: vpravo.
- Detailní text: „Kyslík vzniká při štěpení vody ve světelné fázi a strom ho uvolňuje jako vedlejší produkt. Vyšší světlo a více aktivních listů obvykle zvyšují jeho produkci.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: produkce O₂ v `g/min`, zobrazena na jedno desetinné místo.
- Výchozí stav detailu: zavřený.
- Související element: [O₂ částice](elementy.md#o₂).

#### CO₂

**Tag:** 🔶 `co2`

- Nadpis: `CO₂`.
- Téma: CO₂; strana: vpravo.
- Detailní text: „CO₂ se při fotosyntéze spotřebovává jako vstup pro tvorbu cukrů. Zobrazená hodnota je okamžitá spotřeba podle aktivní plochy listů a fotosyntetické účinnosti. Průduchy regulují jeho příjem podle dostupné vody a podmínek prostředí.“
- Vstupy výpočtu: `Světlo × voda × listy × CO₂ × teplota`.
- Hodnota: spotřeba CO₂ v `g/min`, zobrazena na jedno desetinné místo.
- Výchozí stav detailu: zavřený.
- Související element: [CO₂ částice](elementy.md#co₂).

#### Cukry

**Tag:** 🟣 `sugar`

- Nadpis: `Cukry`.
- Téma: cukry; strana: vpravo.
- Popisek: „Tvorba cukrů ≈ glukóza“.
- Detailní text: „Fotosyntéza ukládá energii světla do glukózy. Ta slouží jako palivo i stavební materiál pro růst kmene, kořenů a nových listů. Hodnota ukazuje odhad okamžité produkce cukrů.“
- Hodnota: `glucoseGramsPerMinute`, jednotka `g/min`, jedno desetinné místo.
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
- Detailní text: „Při nedostatku vody se přivírají průduchy. Do listů proniká méně CO₂ a fotosyntéza slábne. Zkuste omezit přítok nebo snížit slunce pod obzor. Voda zároveň ochlazuje korunu odparem a pomáhá udržovat listy zavodněné.“
- Vstup výpočtu: `voda`.
- Hodnota: spotřeba vody v `l/h`, zobrazena na jedno desetinné místo.
- Ovládání: vypnuté; posuvník se v okně nezobrazuje.
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
