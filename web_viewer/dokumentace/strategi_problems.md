---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněn neformální test s mámou a mýty zkráceny do jedné kapitoly.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vymezeny tři prioritní problémy porozumění.
---

# Problémy k řešení

- Podklady pro návrh webu podle [Strategie](strategie.md); samotné změny webu se řeší samostatně.

## Mýty a porozumění

- **„Strom jí hlínu kořeny“:** vysvětlit, že uhlík pro růst pochází z CO₂ ve vzduchu; kořeny přijímají vodu a minerální živiny. Ověření: „Odkud strom získává uhlík pro tvorbu dřeva?“ Viz [CO₂](okna.md#co₂) a [Cukry](okna.md#cukry).
- **Tah vody a transpirace:** vysvětlit, že odpar v listech pomáhá táhnout vodu xylémem od kořenů a spotřebovává teplo. Ověření: „Co táhne vodu nahoru a proč odpar ochlazuje?“ Viz [Transpirace](okna.md#transpirace).
- **„Kyslík pro lidi“:** vysvětlit, že strom fotosyntézou vytváří cukry pro vlastní růst a získávání energie; kyslík se přitom uvolňuje. Ověření: „Co fotosyntéza přináší samotnému stromu?“ Viz [Fotosyntéza](okna.md#fotosyntéza).
- Stav všech tří témat: K řešení; vyřešení musí potvrdit ověření porozumění u studentů.

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

- Mýty seskup do jedné kapitoly `##`; každý shrň jedním bodem s cílem, ověřovací otázkou a odkazem na obsah. Společný stav uveď jednou.
- Test má nadpis `##` s datem, kontext a omezení; oddíly `###` oddělují pozorované potíže, co fungovalo a podněty k řešení.
- Pozorování odděluj od návrhů; jeden test neprokazuje četnost potíží v cílové skupině.
- Vyřešení podlož novým ověřením, nikoli samotnou implementací.
- Historii udržuj ve frontmatteru; pravidla a šablonu ponechávej na konci.

```markdown
## Mýty a porozumění

- **Název mýtu:** cíl. Ověření: „Otázka?“ Viz [Obsah](soubor.md#kotva).
- Stav témat: stav řešení.

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
