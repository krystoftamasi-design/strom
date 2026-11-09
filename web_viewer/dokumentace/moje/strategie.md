---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Odstraněn Průtok a doplněny vzorce i šablona číselného okna podle Fotosyntézy.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Vymezeny tři prioritní problémy porozumění.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Doplněn postup návrhu celé kapitoly podle vzoru a uplatnění v Transpiraci.
  - thread_id: d4bd5380-b7a9-4109-9dcd-32f5819e4b02
    date: 2026-10-31
    change: Doplněna hodnota produktu, cílové prostředí na počítači a žákovské miskoncepce fotosyntézy a transpirace z českých výzkumů.

---

# Produktová strategie

- Prioritní cíle porozumění: [Problémy k řešení](strategi_problems.md).

## Hodnota (Value) a scénář

- Hlavní hodnota (Value): skutečné pochopení tématu stromu jako propojeného živého systému (ne odříkání chemické rovnice nazpaměť).
- Cílový uživatel: student při domácím samostudiu.
- Kontext: samostatné otevření webu doma na počítači bez výkladu učitele a bez nápovědy.

## Cílové zařízení, distribuce a omezení prostředí

- Cílové zařízení: stolní počítač nebo notebook (ovládání myší/touchpadem, dostatečná plocha obrazovky pro 3D strom i postranní sloupce oken).
- Distribuce a prostředí (K dořešení – zaměřit se dále):
  - Způsob spuštění pro běžného studenta: přechod z lokálního spouštěče (`spustit_strom_web.bat`, Python, Git LFS) na okamžitě dostupnou veřejnou URL v prohlížeči bez instalace.
  - Hardwarová a síťová omezení: rychlost načtení 3D modelu (`strom_web_fast.glb`) na běžném domácím internetu a plynulost WebGL shaderů na běžných noteboocích s integrovanou grafikou.

## Co žáci nechápou a proč nestačí učebnice či video

Podle českých didaktických výzkumů na ZŠ a SŠ (např. *Brčáková 2022*, *Zástěra 2022*, *Musilová 2023*, *Boháčová 2023*, *Nováková* – PF JU; *Šantrůček* a *Hála* v časopise *Živa*) žáci u fotosyntézy a transpirace opakovaně selhávají v těchto bodech:

- **Mýtus „kyslík pro lidi“ místo tvorby vlastního těla (cukrů):** žáci si myslí, že cílem fotosyntézy je vyrábět O₂ pro lidi a zvířata; nechápou, že hlavním produktem pro strom jsou [Cukry](okna.md#cukry) jako palivo a stavební materiál.
- **Mýtus „strom jí hlínu kořeny“:** žáci věří, že dřevo a hmota stromu rostou z půdy; nedokážou si představit, že pevná hmota stromu vzniká ze vzduchu ([CO₂](okna.md#co₂)) a [Vody](okna.md#voda) za pomoci světla.
- **Záměna dvou tras v kmeni:** učebnice ukazují rovnici $6\text{CO}_2 + 6\text{H}_2\text{O} \rightarrow \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$, ale žák nevidí, že v kmeni vedou dvě oddělené cesty – [Voda linka](elementy.md#voda-linka) (xylém nahoru do listů) a [Glukóza linka](elementy.md#glukóza-linka) (floém z listů do kmene a kořenů).
- **Nepochopení tahu vody a transpirace:** žáci berou odpar jen jako „usychání listu“ nebo si myslí, že strom vodu aktivně pumpuje zdola jako srdce; nechápou, že právě odpařování v koruně ([Transpirace](okna.md#transpirace)) táhne vodu od kořenů přes xylém a zároveň strom chladí.
- **Proč nestačí učebnice ani běžné video:**
  - Učebnice vede k memorování mrtvé rovnice a pojmů (*asimilace, transpirace, xylém*) bez prostorové představy.
  - Video je pasivní: student v něm nemůže kliknout na konkrétní látku ([Cukry](okna.md#cukry), [Voda](okna.md#voda)), okamžitě si zvýraznit její trasu v kmeni ani zastavit čas a zkoumat příčinu a následek vlastním tempem.

## Metrika úspěchu

- Cíl porozumění (Time-to-Value ≤ 60 s): po 1 minutě volného prozkoumání kapitoly [Fotosyntéza](../architektura_obsahu.md#fotosyntéza) student bez nápovědy vyjmenuje klíčové prvky děje (světlo, voda, CO₂, O₂, cukry) a správně vysvětlí alespoň jednu přímou souvislost mezi nimi (např. že z vody a CO₂ za světla vznikají cukry a uvolňuje se O₂, nebo že cévní linka vede vodu/cukry mezi kořeny a korunou).
- Práh úspěchu: alespoň 4 z 5 testovaných studentů (80 %) splní úkol do 60 sekund.

## Rychlý test (5 uživatelů)

- Posaď studenta k otevřené kapitole [Fotosyntéza](okna.md#kapitola-fotosyntéza), dej mu 60 sekund na prozkoumání a nijak mu neraď.
- Během minuty tiše sleduj: zda klikne na nadpisy oken ([Cukry](okna.md#cukry), [Voda](okna.md#voda), [O₂](okna.md#o₂), [CO₂](okna.md#co₂)) a zda si všimne zvýraznění linek na kmeni ([Voda linka](elementy.md#voda-linka), [Glukóza linka](elementy.md#glukóza-linka)).
- Po 60 sekundách obrazovku skryj a polož 2 otázky:
  1. „Které látky nebo prvky se tu fotosyntézy účastní?“
  2. „Jak spolu v tom stromu souvisí alespoň dva z nich?“
- Zapiš pouze: splnil / nesplnil a kde se zasekl.

## Postup návrhu kapitoly podle vzoru

- Začni cílem porozumění: jednou větou popiš vztah, který má student po prozkoumání vysvětlit. Podle něj vyber obsah; počet oken nepřebírej mechanicky.
- Projdi vzorovou kapitolu v rozcestníku, definicích i implementaci. Převezmi hierarchii hlavního procesu a samostatných témat, skladbu hodnot a detailů, ovládání i vizuální jazyk.
- Hlavní okno pojmenuj podle procesu, ukaž jednu hlavní veličinu a krátké vysvětlení. Do tematických oken rozděl příčiny, vstupy a důsledky; každé musí přispívat k cíli porozumění.
- U každého tématu urči měřenou či modelovanou veličinu, jednotku, stručný detail a výchozí otevření. Nezaměňuj vstup, tok, zásobu a výsledek.
- Element vybírej podle děje: trasa ukazuje cestu látky, částice směr přenosu, schéma souvislost. Sdílej existující elementy; nový přidej jen s jasným vysvětlujícím účelem a implementovaným chováním.
- Propojení okna a elementu definuj společným tagem a konkrétní reakcí. Barva sama vazbu nezakládá; několik oken se stejným tagem musí spolupracovat.
- Rozděl dokumentaci podle účelu: rozcestník, obsah oken, vzhled, ovládání a elementy. Každou definici napiš jednou, ostatní místa na ni odkazují.
- Implementuj pomocí společných komponent vzoru, odstraň překonané souběžné bloky a ověř zachování výpočtů, jednotek a podstatných informací.
- Proveď průběžné kontroly, zapiš skutečné ověření a ulož společný commit podle [Pracovního postupu](../../../AGENTS.md#pracovní-postup). Vizuální test a test porozumění nezaměňuj za kontrolu syntaxe.

## Uplatnění v Semenaci

- Návrh cíle: student vysvětlí vývoj bukvic po opylení, možné osudy semen a rozdíl mezi množstvím vytvořených semen a malou částí, která doroste. Popíše, že část semen zůstává poblíž mateřského stromu a část se může dostat dál; šíření v dalších generacích umožňuje druhu osidlovat nová místa při změnách klimatu.
- [Roční fáze a okna](okna.md#kapitola-semenace) používají stávající ovládání období; dlouhodobé šíření je vysvětleno odděleně. [Kontext počtu semen](texty.md#kontext-počtu-semen) čeká na doložená čísla a [částice](elementy.md#padající-semena) na assety.
- Návrh ověření: „Jak se z květu stane semeno a co se s ním může stát?“, „Proč z mnoha bukvic vyroste málo dospělých stromů?“ a „Jak může druh postupně osídlit nové místo?“ Porozumění zatím nebylo ověřeno.

## Uplatnění v Transpiraci

- Cíl: student vysvětlí, že odpar v listech pomáhá táhnout vodu od kořenů a spotřebovává teplo; strom nepumpuje vodu jako srdce.
- Hlavní proces: [Transpirace](okna.md#transpirace) s odparem v litrech za hodinu.
- Tematická okna: [Příjem vody](okna.md#příjem-vody), [Chlazení](okna.md#chlazení), [Teplota](okna.md#teplota). Rozlišují příjem kořeny, energetický výkon a teplotní důsledek.
- Elementy: [Voda linka](elementy.md#voda-linka) ukazuje prostorovou trasu a reaguje na související vodní okna; [Cesta vody](elementy.md#cesta-vody) vysvětluje pořadí míst ve stálém přehledu kapitoly. Další dekorativní efekty nejsou cílem kapitoly.
- Při samostudiu má student nejprve vidět proces a trasu vody; po rozkliknutí zjistí rozdíl mezi příjmem a odparem a mezi výkonem chlazení a teplotou.
- Navržený test porozumění: po minutě se zeptej „Co táhne vodu od kořenů k listům?“ a „Proč odpar strom ochlazuje?“. Práh navrhni stejně jako u Fotosyntézy: správné vysvětlení obou souvislostí u alespoň 4 z 5 studentů. Výsledek tohoto testu dosud není doložený.

## Pravidla struktury

- Oblasti strategie mají nadpis `##` a stručné odrážky.
- Odkazy na existující kapitoly, okna a elementy směřují do hlavní dokumentace.
- Historii změn udržuj ve frontmatteru; tuto část se šablonou ponechávej na konci.

```markdown
# Název dokumentu

## Název oblasti

- Stručné pravidlo nebo definice.
```
