---
history:
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Doplněny možné otázky k ověření porozumění fotosyntéze.
  - thread_id: 01a19445-cca8-7da2-a034-14d5bea3af17
    date: 2026-11-01
    change: Doplněn návrh pořadí pravých oken Fotosyntézy podle příčiny a následku.
---

# Nápady co implementovat

- Návrhy k dalšímu posouzení podle [Strategie](strategie.md); samy nezadávají změnu webu.

## Doporučený postup

1. Dokončit okna Fotosyntézy: vzhled, hodnoty, ovládání a vazby na děje ve stromu. Zvážit naznačení ovládání pruhů a ověřit, zda je srozumitelné.
2. Dokončit průvodce Fotosyntézou: dopracovat kontextové texty a jejich výběr podle stavu a otevřených oken; podrobnosti jsou v [Kontextových textech](kontextove_texty.md#k-dopracování-a-ověření).
3. Projít vzhled a funkčnost kapitoly a potom otestovat porozumění se studenty podle [Strategie](strategie.md). Využít i níže uvedené otázky a podle výsledků upravit nejasná místa.
4. Teprve po ověření pokračovat další kapitolou; hotovou Fotosyntézu použít jako vzor a obsah přizpůsobit cíli dané kapitoly. U Transpirace prověřit propojení oken s místem děje.
5. Umístění testu Období, sandbox a zvukový design ponechat k pozdějšímu posouzení; nejsou podmínkou dokončení Fotosyntézy.

## Obecné

### Sound design

- Návrh: promyslet zvukový design webu.
- Cíl: zvážit, jak může zvuk podpořit uživatelský zážitek.
- Stav: Nápad.

## Období

### Umístění testu kapitoly

- Návrh: posoudit, zda test kapitoly Období nepatří spíše do kapitoly Ovládání.
- Cíl: najít pro test vhodné místo.
- Stav: Nápad.

## Okna

### Naznačit ovládání pruhů

- Návrh: naznačit, že spodní pruhy dostupnosti světla a vody se dají táhnout, například drobným úchytem.
- Cíl: aby uživatel poznal, které pruhy může ovládat.
- Stav: Nápad.

## Transpirace

### ❗ Propojení oken s místem děje


## Sandbox

- Návrh: vytvořit kapitolu Sandbox; její obsah a účel je třeba upřesnit.
- Stav: Nápad.

## Fotosyntéza

### Zásoba cukrů a čas

- Návrh: doplnit jednoduchou názornou zásobu cukrů, která se v průběhu simulovaného času zvyšuje o přebytek produkce a snižuje při vyšší spotřebě. Po vyčerpání zásoby omezit spotřebu na dostupnou produkci a sladit s ní dýchání v oknech O₂ a CO₂.
- Zobrazit produkci nejsvětlejším, zásobu středním a spotřebu nejtmavším odstínem stejné barvy; hodnoty označit textem. Při čerpání vysvětlit, že strom využívá uložené cukry.
- Cíl: srozumitelně ukázat, proč může spotřeba po určitou dobu převyšovat produkci; jde o zjednodušené znázornění, nikoli přesný model růstu.
- Stav: Nápad; počáteční stav zásoby a chování při změně rychlosti či přeskočení času je třeba dopracovat.

### Možné otázky k ověření porozumění

- Návrh: ptát se „Odkud se bere většina hmoty nového dřeva a listů?“.
- Návrh: ptát se „Co se stane s vodou a CO₂ v listu?“.
- Návrh: očekávat vysvětlení, že za pomoci světla list vyrábí cukry a uvolňuje kyslík.
- Cíl: ověřit, zda student chápe vztah mezi vstupy fotosyntézy a výslednými látkami, ne jen jejich názvy.
- Stav: Nápad; otázky nejsou implementované ani ověřené na žácích.






## Pravidla struktury

- Kapitoly mají úroveň `##`, jednotlivé nápady `###`.
- U nápadu uveď návrh, cíl a stav; schválenou implementaci definuj v obsahové dokumentaci.

```markdown
## Název kapitoly

### Název nápadu

- Návrh: možné řešení.
- Cíl: očekávaný přínos.
- Stav: nápad nebo rozhodnutí.
```
