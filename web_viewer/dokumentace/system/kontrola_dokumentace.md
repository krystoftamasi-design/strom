---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zavedena jednotná předběžná kontrola vybraných souborů před commitem.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Upřesněn bezpečný postup commitů a kontrol při souběžné práci.
  - thread_id: 01a19424-3d45-7e81-9ea4-3cd6ef98d1fa
    date: 2026-10-31
    change: Zrušeno automatické spouštění revize webu po commitech.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Omezen obsah reportu revize na doložené neshody.

---

# Kontrola dokumentace

## Před commitem

- Jednotná kontrola pracovních souborů: `python web_viewer/tools/check_documentation.py --files cesta1 cesta2`. Použij stejný výslovný seznam jako u následného `commit --only`; při návratovém kódu 1 nejprve oprav příčinu.
- Režim `--files` kontroluje vybrané soubory z disku nad verzí ostatních souborů v `HEAD`; nepoužívá ani nemění sdílený Git index. Zastaví se na mezerách v diffu, chybné syntaxi JS nebo dokumentaci. U nových souborů kontroluje mezery v celém textu.
- HTML se neodesílá celé do Node.js: kontrolují se inline klasické a modulové JavaScripty, datové bloky JSON a importmap se přeskočí. Externí JS uveď samostatně v seznamu. Node ověřuje jen syntaxi, nespouští kód ani importy a nepotřebuje `document`.
- U změněných dokumentů režim `--files` vyžaduje platný YAML, nejvýše pět položek historie a aktualizaci historie; prověřuje i odkazy a evidenci. Staré chyby přímo vybraného dokumentu nejsou omluvené stavem v `HEAD`.
- Změna `HEAD` nebo vybraného souboru během kontroly vyžaduje nové spuštění. Výsledek je předběžný: následný Git hook zůstává rozhodující kontrolou skutečného commitu. Kontrola neověřuje autorství řádků, obsahovou správnost ani běh webu.
- Testy tohoto režimu: `python -m unittest discover -s web_viewer/testy -p test_preflight.py`.

- Ve sdíleném adresáři ukládej jen výslovně vyjmenované vlastní soubory přes `git commit --only`; podmínky a souběžné úpravy stejného souboru řeší [Commity](../../../AGENTS.md#commity).
- `--staged` hodnotí současný index, nikoli automaticky soubory budoucího `commit --only`. Rozhodující hook kontroluje dočasný index přesného commitu připravený Gitem; dřívější úspěch po selhání `git add` není ověřením zamýšlené změny.
- Před commitem zkontroluj YAML změněných dokumentů parserem a limit historie; při chybě příkazu zastav další závislé kroky podle [pravidel](../../../AGENTS.md#commity).

- `python web_viewer/tools/check_documentation.py --staged` kontroluje obsah Git indexu, který bude skutečně commitovaný.
- Kontrola ověřuje YAML, položky historie a jejich limit, část „Pravidla struktury“, místní Markdown odkazy a kotvy a povinné položky záznamů změn.
- Změna těla dokumentu vyžaduje aktualizaci jeho YAML historie.
- Změny JavaScriptu, CSS a HTML webu vyžadují připravenou úpravu `zmeny.md`; testy, nástroje a assety jsou z této kontroly evidence vyjmuté.
- Nové nálezy commit zastaví; existující stejné nálezy proti `HEAD` se vypíší jako `EXISTING` a neblokují nesouvisející práci.
- Kontrolor ověřuje přítomnost a formát evidence; neumí prokázat její pravdivost, původ ID chatu ani významovou shodu s kódem.

## Instalace

- Vyžaduje Git, Python 3 a PyYAML 6; v tomto prostředí je závislost dostupná.
- Případná instalace závislosti: `python -m pip install "PyYAML>=6,<7"`.
- Zdroj hooku je `web_viewer/tools/pre-commit`; zkopíruj jej jako soubor `pre-commit` do aktivního adresáře Git hooků, jen pokud tam vlastní hook dosud není.
- Existující hooky včetně Git LFS zachovej; při existujícím `pre-commit` nejprve sjednoť jeho volání místo přepsání.
- Hook je lokální nastavení repozitáře; nový klon ho musí nainstalovat znovu.

## Úplná kontrola

- `python web_viewer/tools/check_documentation.py` kontroluje pracovní soubory hlavní obsahové dokumentace, její technickou architekturu, uspořádání projektu, tento dokument a `AGENTS.md`.
- Historické a odborné přílohy se plošně nekontrolují; změněný Markdown v `dokumentace` se kontroluje před commitem.
- Kontrola ignoruje ukázky v blocích kódu a prověřuje místní přímé Markdown odkazy; vzdálené weby, referenční odkazy a vlastní HTML kotvy neověřuje.
- Návratový kód `0` znamená bez nalezených formálních chyb; `1` znamená nálezy. Soubory se neopravují.
- Testy: `python -m unittest discover -s web_viewer/testy -p test_documentation_check.py`.

## Revize po deseti commitech

- Automatické spouštění po deseti commitech je vypnuté; nadpis zůstává kvůli odkazům z historie změn.

- Revizi spouštěj pouze na výslovné vyžádání uživatele příkazem uvedeným níže; po commitech ani pravidelně se nespouští.
- Lokální Git `post-commit` hook zachovává pouze Git LFS; zdroj je `web_viewer/tools/post-commit`. Při instalaci zachovej ostatní vlastní hooky a nepřidávej automatické volání revize.
- Revize vyžaduje dostupný a přihlášený Codex CLI; používá jeho uložené přihlášení a výchozí model v režimu `read-only`, bez trvalého nového chatu.
- Ve Windows se Codex CLI spouští s `CREATE_NO_WINDOW`, aby revize neotevírala konzolové okno.
- Délka ručně vyžádané revize závisí na rozsahu kontroly a dostupnosti služby.
- Výsledek je v ignorovaném `web_viewer/old/revize_dokumentace.md`: `PROBIHA`, `DOKONCENA` nebo `SELHANI`, prověřený hash a zpráva agenta.
- Výsledek čti v reportu; zpráva se automaticky nevkládá do hlavního chatu ani do aplikace.
- Technický průběh je v `web_viewer/old/revize_dokumentace.log`; report se při další revizi aktualizuje.
- Agent porovnává přesný zachycený commit a odpovídající definice s kódem, odděluje nové a staré nálezy a nesmí nic opravovat ani commitovat. Podklady z prohlížeče získává samostatný sběr v Google Chromu.
- `tools/review_browser.mjs` spustí skutečný Google Chrome bez okna, projde kapitoly, zachytí texty a okna, přepne detaily a uloží snímky i chyby.
- Web obsluhuje dočasný server z přesného Git commitu na volném místním portu; u LFS ověřuje hash dostupného podkladu. Server i Chrome se po sběru ukončí.
- Agent vždy porovnává všechny hlavní obsahové definice jako zdroj požadavků, nejen změněné soubory. Report vypisuje pouze doložené neshody: odkaz na definici, očekávání, skutečnost a důkaz. Shody, neověřené položky a popis průběhu vynechává; bez nálezu uvede pouze „Žádná doložená neshoda“.
- Snímky a JSON jsou v `old/browser_review_<hash>`; samotné otevření webu neprokazuje správnost animací ani všech interakcí. Chybějící pokrytí není neshoda; technické podklady zůstávají v JSON a logu. Stav selhání samotného spouštěče zůstává viditelný.
- Vyžaduje Node.js, Google Chrome a Playwright z existujícího lokálního runtime Codexu; jiný prohlížeč se nepoužije.
- Pracovní změny ostatních chatů se nehodnotí jako součást prověřeného commitu.
- Souběžné revize chrání systémový zámek; během vyžádaného běhu může pracovní proces zahrnout další mezitím přidané commity.
- Po úspěšné revizi se uloží prověřený hash do `web_viewer/old/documentation_review_state.json`; při selhání se výchozí bod neposouvá. Další spuštění vyžaduje nový pokyn uživatele.
- Ruční spuštění úplné revize: `python web_viewer/tools/review_documentation.py --force`.
- Původní hodinová automatizace je pozastavená. „Bez nálezu“ není záruka bezchybnosti ani finální test webu.

## Pravidla struktury

- Oblasti kontroly mají nadpis `##`, postupy a omezení popisuj stručnými odrážkami.
- Příkazy uváděj od kořene projektu; pravidla pracovního postupu odkazuj na [AGENTS.md](../../../AGENTS.md).
- Tuto část a obecnou šablonu ponechávej na konci.

```markdown
## Název kontroly

- Spuštění: `příkaz`.
- Rozsah: kontrolované soubory a podmínky.
- Výsledek: způsob oznámení nálezů.
- Omezení: co kontrola neověřuje.
```
