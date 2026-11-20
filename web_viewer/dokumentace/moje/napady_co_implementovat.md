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


## Obecné

### Výzvy k ovládání stromu

- Návrh: po vstupu do kapitoly nabídnout jednu krátkou výzvu. Uživatel ji splní přímo ovládáním modelu. Po akci se ukáže, co se změnilo, a zpřístupní se další výzva. Volba „Přeskočit“ umožní volné zkoumání.
- **Najdi první listy.** Otoč kruhem na jaro a zastav, jakmile se začnou objevovat listy. Splnění ověří datum v období rašení.
- **Zhasni stromu.** Otevři Světlo a stáhni dostupnost na nulu. Zpětná vazba porovná produkci a spotřebu cukrů před změnou a po ní.
- **Vrať stromu vodu.** V připravené situaci s omezeným přísunem vody nastav zarážku zase doprava. Splnění ověří obnovení přísunu a zvýrazní ukazatel vody.
- **Připrav strom na jaro.** Posuň se od zimy k rašení a sleduj kruh zásoby cukrů. Po dosažení rašení výzva ukáže, jak se zásoba změnila a proč.
- Cíl: přimět uživatele něco předpovědět, změnit a pak si výsledek přečíst přímo v grafu nebo na stromě.
- Stav: Nápad. Jako první vyzkoušet výzvu se světlem a ověřit, zda uživatel najde správný posuvník a všimne si změny u cukrů.

### Sound design

- Návrh: promyslet zvukový design webu.
- Cíl: zvážit, jak může zvuk podpořit uživatelský zážitek.
- Stav: Nápad.

## Období

### Umístění testu kapitoly

- Návrh: posoudit, zda test kapitoly Období nepatří spíše do kapitoly Ovládání.
- Cíl: najít pro test vhodné místo.
- Stav: Nápad.


## Fotosyntéza

### Zdůraznění cukrů

- Zavedeno. Chování určuje [obsah oken](okna.md#cukry) a umístění [rozložení](vzhled_oken.md#rozložení).

## Transpirace

### ❗ Propojení oken s místem děje


## Sandbox

- Návrh: vytvořit kapitolu Sandbox; její obsah a účel je třeba upřesnit.
- Stav: Nápad.








### Vizuální déšť

- Návrh: doplnit k automatickému kolísání dostupnosti vody krátké vizuální přeháňky (např. 2–3 sekundy v rámci jednoho vizuálního dne, který představuje měsíc), kdy přes slunce přejede mrak s jemným deštěm a voda v půdě se doplní.
- Cíl: propojit kolísání dostupnosti vody v UI s viditelným počasím ve 3D scéně, aniž by pršelo nepřirozeně celý „den“.
- Stav: Nápad; v modelu je zatím jen plynulé kolísání automatické dostupnosti vody bez 3D efektu deště.

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
