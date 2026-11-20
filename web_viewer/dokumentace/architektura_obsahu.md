---
history:
  - thread_id: 01a1942e-d161-7933-b8f7-31bb2827f7a1
    date: 2026-11-01
    change: Odstraněna kapitola Úvod z rozcestníku, protože není položkou nabídky.
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

# Architektura obsahu

# **OBDOBÍ**

### Text

- [Období stromu](moje/texty.md#období-stromu)

### Okna

### Vzhled

### Ovládací prvky

- [Kruh ročních období](moje/prvky.md#kruh-ročních-období)
- [Čas](moje/prvky.md#ovládání-času)
- [Kapitoly](moje/prvky.md#kapitoly)

### Elementy

# **FOTOSYNTÉZA**

### Text

- [Datum](moje/texty.md#datum)
- [Fotosyntéza](moje/texty.md#fotosyntéza)

### Okna

- [Světlo](moje/okna.md#světlo)
- [O₂](moje/okna.md#o₂)
- [CO₂](moje/okna.md#co₂)
- [Cukry](moje/okna.md#cukry)
- [Voda](moje/okna.md#voda)

### Vzhled

- [Okna](moje/vzhled_oken.md)

### Ovládací prvky

- [Manager](moje/prvky.md#manager)
- [Čas](moje/prvky.md#ovládání-času)
- [Kapitoly](moje/prvky.md#kapitoly)

### Elementy

- [Voda linka](moje/elementy.md#voda-linka)
- [Glukóza linka](moje/elementy.md#glukóza-linka)
- [O₂ částice](moje/elementy.md#o₂)
- [CO₂ částice](moje/elementy.md#co₂)
- [Fotony](moje/elementy.md#fotony)

# **TRANSPIRACE**

### Text

- [Datum](moje/texty.md#datum)
- [Průvodce Transpirací](moje/texty.md#průvodce-transpirací)

### Okna

- [Transpirace](moje/okna.md#transpirace)
- [Příjem vody](moje/okna.md#příjem-vody)
- [Chlazení](moje/okna.md#chlazení)
- [Teplota](moje/okna.md#teplota)

### Vzhled

- [Okna](moje/vzhled_oken.md)

### Ovládací prvky

- [Manager](moje/prvky.md#manager)
- [Čas](moje/prvky.md#ovládání-času)
- [Kapitoly](moje/prvky.md#kapitoly)

### Elementy

- [Voda linka](moje/elementy.md#voda-linka)
- [H₂O částice](moje/elementy.md#h₂o)
- [Cesta vody](moje/elementy.md#cesta-vody)

# **SEMENACE**

### Text

- [Kontext počtu semen](moje/texty.md#kontext-počtu-semen)

### Okna

- [Semenace](moje/okna.md#semenace)
- [Květy](moje/okna.md#květy)
- [Bukvice](moje/okna.md#bukvice)
- [Semena](moje/okna.md#semena)

### Vzhled

- [Okna](moje/vzhled_oken.md)

### Ovládací prvky

- [Kapitoly](moje/prvky.md#kapitoly)
- [Kruh ročních období](moje/prvky.md#kruh-ročních-období)

### Elementy

- [Padající semena](moje/elementy.md#padající-semena)

# **KOŘENY**

### Text

- [Kořeny](moje/texty.md#kořeny)

### Okna

### Vzhled

### Ovládací prvky

- [Kapitoly](moje/prvky.md#kapitoly)
- [Čas](moje/prvky.md#ovládání-času)

### Elementy

## Pravidla struktury

- Před každou úpravou si přečti tato pravidla.
- Popis existujícího webu ověř; změny zapisuj podle zadání uživatele.
- Definice určují požadované chování; stav implementace patří do [Změn](zmeny.md).
- Pevné rozdělení dokumentů a postup změn určuje [AGENTS.md](../../AGENTS.md).
- Název kapitoly piš velkým tučným nadpisem `# **NÁZEV KAPITOLY**`.
- Pod nimi jsou `### Text`, `### Okna`, `### Vzhled`, `### Ovládací prvky` a `### Elementy`.

- Uváděj jen krátké klikací názvy nebo značky; u linek přidej slovo „linka“.
- Podrobnosti patří do `texty.md`, `okna.md`, `vzhled_oken.md`, `prvky.md` a `elementy.md`.
- Každý prvek definuj pouze jednou; kapitoly na něj odkazují.
- Konkrétní definice mají úroveň `####`; elementy používají `###` podle [pravidel struktury](moje/elementy.md#pravidla-struktury).
- Chování oken určuje společná definice [Statická okna](moje/vzhled_oken.md#statická-okna).
- Elementy jsou konkrétní prvky děje, například vodní a glukózová linka; ne obecné části scény jako strom, listy nebo slunce.
- U oken odkazuj na související element; body připojení a spojnice ke stromu se nepoužívají.
- Obecné chování a vzhled sdílej odkazem.
- Prázdné části nech prázdné.
- Zachovej uživatelovy úpravy a piš stručně. 😊

```markdown
# **NÁZEV KAPITOLY**

### Text

- [Název textu](moje/texty.md#kotva)

### Okna

- [Název okna](moje/okna.md#kotva)

### Vzhled

- [Název vzhledu](moje/vzhled_oken.md#kotva)

### Ovládací prvky

- [Název prvku](moje/prvky.md#kotva)

### Elementy

- [Název elementu](moje/elementy.md#kotva)
```
