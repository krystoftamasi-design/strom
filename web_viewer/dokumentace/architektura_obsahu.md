---
history:
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Sjednoceno pořadí kapitol s navigací a odstraněny nadbytečné mezery.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Upravena pravidla rozcestníku pro statická okna bez bodů připojení.
  - thread_id: 01a18f17-efd7-7a02-8369-186b681bfcc0
    date: 2026-10-31
    change: Uspořádána Fotosyntéza podle UI podkladu a sjednocena úroveň kapitoly.
  - thread_id: 01a18d15-6ca3-7241-81c2-fc807aeadc12
    date: 2026-10-30
    change: Změněn smajlík na konci pravidel dokumentu.
  - thread_id: 01a18d15-6ca3-7241-81c2-fc807aeadc12
    date: 2026-10-30
    change: Doplněny názvy kapitol webu.
---

# Architektura obsahu

## ÚVOD

### Text

- [Strom](texty.md#strom)

### Okna

### Ovládací prvky

- [Kapitoly](prvky.md#kapitoly)

### Elementy

## OBDOBÍ

### Text

### Okna

### Ovládací prvky

### Elementy

## FOTOSYNTÉZA

### Text

- [Datum](texty.md#datum)

### Okna

- [Fotosyntéza](okna.md#fotosyntéza)
- [O₂](okna.md#o₂)
- [CO₂](okna.md#co₂)
- [Cukry](okna.md#cukry)
- [Voda](okna.md#voda)

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

## TRANSPIRACE

### Text

### Okna

### Ovládací prvky

### Elementy

## SEMENACE

### Text

### Okna

### Ovládací prvky

### Elementy

## KOŘENY

### Text

### Okna

### Ovládací prvky

### Elementy

## Pravidla dokumentu

- Před každou úpravou si přečti tato pravidla.
- Popis existujícího webu ověř; změny zapisuj podle zadání uživatele.
- Definice určují požadované chování; stav implementace patří do [Změn](zmeny.md).
- Pevné rozdělení dokumentů a postup změn určuje [AGENTS.md](../../AGENTS.md).
- Kapitoly mají úroveň `##`.
- Pod nimi jsou `### Text`, `### Okna`, `### Ovládací prvky` a `### Elementy`.
- Uváděj jen krátké klikací názvy nebo značky; u linek přidej slovo „linka“.
- Podrobnosti patří do `texty.md`, `okna.md`, `prvky.md` a `elementy.md`.
- Každý prvek definuj pouze jednou; kapitoly na něj odkazují.
- Konkrétní definice mají úroveň `####`.
- Chování oken určuje společná definice [Statická okna](okna.md#statická-okna).
- Elementy jsou konkrétní prvky děje, například vodní a glukózová linka; ne obecné části scény jako strom, listy nebo slunce.
- U oken odkazuj na související element; body připojení a spojnice ke stromu se nepoužívají.
- Obecné chování a vzhled sdílej odkazem.
- Prázdné části nech prázdné.
- Zachovej uživatelovy úpravy a piš stručně. 😊
