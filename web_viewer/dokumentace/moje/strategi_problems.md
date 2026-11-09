---
history:
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Přesunut záznam uživatelského testu do samostatného tests.md.
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
- **„Většina sluneční energie jde do fotosyntézy“:** odlišit tvorbu cukrů od spotřeby energie při výparu; podíly závisejí na podmínkách. Ověření: „Na co strom kromě fotosyntézy využívá dopadající energii?“ Viz [Fotosyntéza](okna.md#fotosyntéza) a [Chlazení](okna.md#chlazení). Zdroj: [Metodika pro 9. ročník, kap. 3](#zdroje).
- **„Všechna přijatá voda zůstává ve stromu“:** propojit příjem kořeny s odchodem vody do vzduchu. Ověření: „Kam se dostává voda, kterou kořeny přijmou?“ Viz [Příjem vody](okna.md#příjem-vody) a [Transpirace](okna.md#transpirace). Zdroj: [Metodika pro 9. ročník, kap. 3](#zdroje).

- **„Strom chladí jen stínem nebo fotosyntézou“:** rozlišit zastínění a odvod tepla výparem, závislý na dostupnosti vody. Ověření: „Proč nestačí znát jen velikost stínu, abychom určili chlazení stromem?“ Viz [Chlazení](okna.md#chlazení) a [Teplota](okna.md#teplota). Zdroj: [Metodika pro 9. ročník, kap. 3](#zdroje).

- **„Fotosyntéza je dýchání rostlin“:** odlišit tvorbu cukrů při fotosyntéze od jejich využívání buněčným dýcháním. Ověření: „Jsou tvorba cukrů a získávání energie z cukrů stejný děj?“ Viz [Fotosyntéza](okna.md#fotosyntéza) a [Cukry](okna.md#cukry). Zdroj: [Čipková a kol., s. 26](#zdroje).
- **„Rostliny dýchají pouze v noci“:** vysvětlit, že buněčné dýchání probíhá i ve dne současně s fotosyntézou. Ověření: „Přestane strom ve dne buněčně dýchat? Proč?“ Viz [O₂](okna.md#o₂) a [Cukry](okna.md#cukry). Zdroj: [Čipková a kol., s. 26](#zdroje).
- **„Dýchají jen listy“:** vztáhnout buněčné dýchání i k živým buňkám kořenů a kmene, nikoli ke všem buňkám dřeva. Ověření: „Potřebují také živé buňky kořenů získávat energii z cukrů?“ Viz [Cukry](okna.md#cukry). Zdroj: [Čipková a kol., s. 26](#zdroje).

- Stav všech témat: K řešení; vyřešení musí potvrdit ověření porozumění u studentů.
- Odkazy na okna určují vhodné místo vysvětlení, nikoli potvrzení implementace; zejména buněčné dýchání vyžaduje kontrolu rozsahu modelu před nasazením.

- Poznatky z uživatelského ověřování: [Testy](tests.md).

## Zdroje

- [Ryplová, Pokorný, Hesslerová, Jirka a Vácha (2021): Sluneční energie – voda v krajině – vegetace](https://projekty.pf.jcu.cz/svv/files/Metodika_ZS.pdf), metodika pro 9. ročníky ZŠ a víceletá gymnázia, kap. 3, tištěná s. 6. Dokládá miskoncepce o energii, výparu, termoregulaci a chlazení; nejde o výsledky testu našeho webu.
- [Čipková, Karolčík a Vörösová (2017): Korekcia miskoncepcií žiakov o fotosyntéze a dýchaní rastlín](https://bichez.pedf.cuni.cz/archive/2017/3/4.pdf), přehled miskoncepcí na s. 26. Vlastní šetření článku proběhlo ve 2. ročníku gymnázia; nezaměňovat s výzkumem deváťáků.
- Nadpisy mýtů jsou naše stručné parafráze. Ověřovací otázky a přiřazení k oknům jsou návrhy pro tento projekt, nikoli převzaté otázky výzkumů.

## Pravidla struktury

- Mýty seskup do jedné kapitoly `##`; každý shrň jedním bodem s cílem, ověřovací otázkou a odkazem na obsah. Společný stav uveď jednou; u doplněných témat připoj dohledatelný zdroj.
- Záznamy uživatelských testů udržuj v `tests.md`; zde na ně pouze odkazuj.
- Vyřešení podlož novým ověřením, nikoli samotnou implementací.
- Historii udržuj ve frontmatteru; pravidla a šablonu ponechávej na konci.

```markdown
## Mýty a porozumění

- **Název mýtu:** cíl. Ověření: „Otázka?“ Viz [Obsah](../soubor.md#kotva). Zdroj: [Autor, strana](#zdroje).
- Stav témat: stav řešení.

[Poznatky z testování](tests.md)

## Zdroje

- [Autor: název](https://example.org/zdroj), rok, kapitola nebo strana a rozsah zjištění.
```
