---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upravena struktura podle ukázky Fotosyntézy s tučnými názvy kapitol a úplnou šablonou.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Sjednocena pravidla struktury na konci rozcestníku a doplněna šablona kapitoly.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Upřesněna úroveň nadpisů elementů odkazem na jejich vlastní pravidla.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Přidána k oknům kategorie Vzhled s odkazem na samostatný soubor.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Sjednoceno pořadí kapitol s navigací a odstraněny nadbytečné mezery.
---

# Architektura obsahu

**ÚVOD**

### Text

- [Strom](texty.md#strom)

### Okna

### Ovládací prvky

- [Kapitoly](prvky.md#kapitoly)

### Elementy

**OBDOBÍ**

### Text

### Okna

### Ovládací prvky

### Elementy

**FOTOSYNTÉZA**

### Text
- [Datum](texty.md#datum)

### Okna
- [Fotosyntéza](okna.md#fotosyntéza)
- [O₂](okna.md#o₂)
- [CO₂](okna.md#co₂)
- [Cukry](okna.md#cukry)
- [Voda](okna.md#voda)

### Vzhled
- [Okna](vzhled_oken.md)

### Ovládací prvky
- [Manager](prvky.md#manager)
- [Čas](prvky.md#ovládání-času)
- [Kapitoly](prvky.md#kapitoly)

### Elementy
- [Voda linka](elementy.md#voda-linka)
- [Glukóza linka](elementy.md#glukóza-linka)
- [O₂ částice](elementy.md#o₂)
- [CO₂ částice](elementy.md#co₂)
- [Fotony](elementy.md#fotony)

**TRANSPIRACE**

### Text

### Okna

### Ovládací prvky

### Elementy

**SEMENACE**

### Text

### Okna

### Ovládací prvky

### Elementy

**KOŘENY**

### Text

### Okna

### Ovládací prvky

### Elementy

## Pravidla struktury

- Před každou úpravou si přečti tato pravidla.
- Popis existujícího webu ověř; změny zapisuj podle zadání uživatele.
- Definice určují požadované chování; stav implementace patří do [Změn](zmeny.md).
- Pevné rozdělení dokumentů a postup změn určuje [AGENTS.md](../../AGENTS.md).
- Název kapitoly piš tučně bez značky nadpisu, například `**FOTOSYNTÉZA**`.
- Pod nimi jsou `### Text`, `### Okna`, `### Vzhled`, `### Ovládací prvky` a `### Elementy`.
- Uváděj jen krátké klikací názvy nebo značky; u linek přidej slovo „linka“.
- Podrobnosti patří do `texty.md`, `okna.md`, `vzhled_oken.md`, `prvky.md` a `elementy.md`.
- Každý prvek definuj pouze jednou; kapitoly na něj odkazují.
- Konkrétní definice mají úroveň `####`; elementy používají `###` podle [pravidel struktury](elementy.md#pravidla-struktury).
- Chování oken určuje společná definice [Statická okna](okna.md#statická-okna).
- Elementy jsou konkrétní prvky děje, například vodní a glukózová linka; ne obecné části scény jako strom, listy nebo slunce.
- U oken odkazuj na související element; body připojení a spojnice ke stromu se nepoužívají.
- Obecné chování a vzhled sdílej odkazem.
- Prázdné části nech prázdné.
- Zachovej uživatelovy úpravy a piš stručně. 😊

```markdown
**FOTOSYNTÉZA**

### Text
- [Datum](texty.md#datum)

### Okna
- [Fotosyntéza](okna.md#fotosyntéza)
- [O₂](okna.md#o₂)
- [CO₂](okna.md#co₂)
- [Cukry](okna.md#cukry)
- [Voda](okna.md#voda)

### Vzhled
- [Okna](vzhled_oken.md)

### Ovládací prvky
- [Manager](prvky.md#manager)
- [Čas](prvky.md#ovládání-času)
- [Kapitoly](prvky.md#kapitoly)

### Elementy
- [Voda linka](elementy.md#voda-linka)
- [Glukóza linka](elementy.md#glukóza-linka)
- [O₂ částice](elementy.md#o₂)
- [CO₂ částice](elementy.md#co₂)
- [Fotony](elementy.md#fotony)
```
