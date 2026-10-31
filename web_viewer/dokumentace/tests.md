---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunut záznam uživatelského testu do samostatného tests.md.
---

# Uživatelské testy

- Záznamy testování použitelnosti a porozumění; cíle návrhu určuje [Strategie](strategie.md).

## Test s mámou — 31. 10. 2026

- Kontext: jeden neformální test s mámou, popsaný autorem projektu; nejde o test na cílové skupině studentů ani o splnění testu s pěti uživateli.
- Zjištění jsou podněty pro další návrh a ověření; neprokazují četnost problémů u všech uživatelů.

### Pozorované potíže

- **Úvod:** klikala na Úvod a nepoznala, že už v této kapitole je.
- **Částice O₂ a CO₂:** byly příliš malé.
- **Detaily oken:** nepoznala, že názvy oken fungují jako tlačítka a po kliknutí zobrazí další text.
- **Zvýraznění:** zvýraznění souvisejících elementů si málo všimla.
- **Spojení s dějem:** nepochopila vazbu oken na elementy ani to, že představují prvky fotosyntézy; chtěla text, který je takto pojmenuje.

### Co fungovalo

- Pochopila fungování a ovládání Období; kruh fungoval srozumitelně.

### Podněty k řešení a ověření

- Zřetelněji ukázat aktuální kapitolu, zejména Úvod při prvním otevření.
- Prověřit větší částice O₂ a CO₂ a viditelnější reakci elementu po kliknutí.
- Naznačit klikatelnost názvů oken a přítomnost vysvětlujícího textu.
- Doplnit srozumitelné označení prvků fotosyntézy a vysvětlení jejich vazby na okna.
- Zvážit mírné zvětšení ovládání Období; jde o námět, nikoli pozorované selhání kruhu.
- Stav podnětů: K řešení. Při dalším testu sledovat rozpoznání aktuální kapitoly, samostatné otevření detailu a přiřazení elementu k tématu.

## Pravidla struktury

- Každý test má nadpis `##` s označením a datem, následuje kontext, zdroj pozorování a omezení závěrů.
- Oddíly `###` řaď jako pozorované potíže, co fungovalo a podněty k řešení a ověření.
- Pozorování odděluj od návrhů; jeden test neprokazuje četnost potíží v cílové skupině.
- Vyřešení podnětů podlož dalším ověřením; automatické kontroly kódu nejsou uživatelským testem.
- Historii udržuj ve frontmatteru; pravidla a šablonu ponechávej na konci.

```markdown
## Název testu — datum

- Kontext: účastníci, zdroj pozorování a omezení závěrů.

### Pozorované potíže

- Pozorování.

### Co fungovalo

- Pozorování.

### Podněty k řešení a ověření

- Návrh a způsob dalšího ověření.
- Stav podnětů: stav řešení.
```
