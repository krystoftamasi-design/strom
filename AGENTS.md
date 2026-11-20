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
    change: Omezeno spouštění revize webu na výslovné vyžádání.
  - thread_id: 01a19424-3d45-7e81-9ea4-3cd6ef98d1fa
    date: 2026-10-31
    change: Doplněno používání skillů pro vzhled a responzivní webové komponenty.
  - thread_id: 01a192c9-24b4-7642-a56f-53abd8bf4304
    date: 2026-10-31
    change: Roztříděna dokumentace a opraveny cesty podle účelu souborů.

---

# Pracovní postup

- Na začátku úkolu přečti tento soubor a přímo související definice v dokumentaci. Znovu je čti jen při jejich změně nebo souběžné práci, ne opakovaně během stejné úpravy.
- Proveď pouze zadanou změnu nejjednodušším srozumitelným řešením. Nepřidávej funkce, frameworky a závislosti pro budoucí potřeby.
- Zachovej uživatelovy i cizí rozpracované úpravy. Při chybě zastav závislé kroky a nejprve oprav příčinu.
- Přímé pokyny uživatele mají přednost. Jednorázová výjimka platí jen pro daný úkol.

# Prohlížeč a spuštění

- Web otevírej pouze v Google Chrome, nikdy v integrovaném prohlížeči ani přes `open_in_codex`. Pokud Chrome není dostupný, předej URL.
- Použij `spustit_strom_web.bat`; `web_viewer/spustit_web_viewer.bat` volá stejný spouštěč.
- Nejprve ověř běžící server a znovu jej použij. Výchozí URL je `http://localhost:8080/web_viewer/index.html`.
- Zveřejněný web je na https://krystoftamasi-design.github.io/strom/web_viewer/index.html.
- Server musí obsluhovat kořen projektu. Automatické spuštění: `python -m http.server 8080 --bind 127.0.0.1` na pozadí se skrytým oknem; nepoužívej `file://`.
- Je-li port obsazen jinou službou, použij volný; cizí službu nezastavuj.
- Finální vizuální a funkční test nech uživateli, pokud o něj výslovně nepožádá.

# Změny

- Před úpravou ověř příslušný kód a dokumentaci; definice jsou požadavky, nikoli důkaz implementace.
- Změnu chování nebo ovládání ověř cíleným existujícím testem. Pro změnu textu či drobné CSS nespouštěj automaticky celou sadu testů a nepřidávej test kopírující implementaci.
- Testy vyžadující DOM nebo WebGL nespouštěj jako běžný Node test bez odpovídajícího prostředí. Neúspěšný test neoznačuj za důkaz absence regrese.
- Před commitem zkontroluj vlastní diff. Git hook jednou prověří připravenou dokumentaci, mezery a syntaxi JS včetně inline skriptů HTML; stejné kontroly nemusíš ručně opakovat.
- Volitelná diagnostika před commitem: `python web_viewer/tools/check_documentation.py --files cesta1 cesta2`. Použij ji při nejistotě nebo opravě chyby, ne jako další povinný krok.
- Úplnou revizi webu spouštěj pouze na výslovné vyžádání. Report s doloženými neshodami patří do `web_viewer/old/revize_dokumentace.md`; opravy jsou samostatné úkoly.
- Ve výsledku uveď skutečné změny, ověření, případná omezení a hash vytvořeného commitu. Syntaxe neprokazuje funkčnost ani vzhled.

# Dokumentace

- Aktuální definice jsou v `web_viewer/dokumentace/moje`, technické postupy v `system`; `starsi` je archiv.
- `architektura_obsahu.md` je rozcestník kapitol: Text, Okna, Vzhled, Ovládací prvky, Elementy; pouze krátké odkazy.
- `moje/okna.md` určuje obsah a chování oken; `moje/vzhled_oken.md` jejich replikovatelný vzhled.
- `moje/elementy.md` určuje linky, částice a reakce na okna; `moje/prvky.md` ovládání; `moje/texty.md` samostatné texty.
- Každou věc definuj jednou a odkazuj na ni. Změny definovaného chování a schváleného vzhledu promítni do příslušných definic.
- Piš stručně, bez duplicit a interních názvů v uživatelských definicích; schválené tagy jsou výjimka. Šablona ani pravidla struktury nejsou povinné.
- Historie drobných změn patří do Gitu. Do `zmeny.md` zapisuj jen významné otevřené úkoly nebo důležité výsledky ověření; jeho úprava není podmínkou změny webu.
- Pokud evidenci doplníš, uveď skutečný rozsah ověření a případná omezení. Stav Ověřeno znamená ověření uvedeného rozsahu, nikoli celého webu.
- Historii souborů vede Git. YAML historie ani ID chatu nejsou povinné; kvůli dokumentaci nevolej `list_threads`. Existující frontmatter ponech jako historický záznam, bez přidávání a zkracování seznamu.
- Toto pravidlo nahrazuje starší pokyny jednotlivých dokumentů k udržování historie ve frontmatteru. Ostatní pole frontmatteru zachovej; existující YAML musí zůstat syntakticky platný.

# Komponenty a struktura projektu

- Před přidáním nebo přesunem souboru přečti `web_viewer/dokumentace/struktura_projektu.md`. Použij existující složku a názvosloví, bez nesouvisejícího přesouvání nebo mazání.
- Modely, textury a písma patří do `web_assets`, nástroje do `tools`, testy do `testy`, snímky do `nahledy` a pracovní výstupy do `old`.
- Související JS a CSS drž pohromadě. Při změně uspořádání oprav cesty a aktualizuj přehled struktury.
- Okna vytvářej společnou komponentou; obsah předávej jako data. Sdílej nadpis, hodnotu, vzorec, detail a ovládání; pozice kapitoly odděl od společného vzhledu.
- Při novém návrhu vzhledu použij `frontend-design`; při návrhu či změně společné struktury komponenty `web-component-design`. Kvůli jedné hodnotě CSS nebo opravě textu je znovu nenačítej.
- Zachovej dostupnost klávesnicí, viditelný fokus, čitelnost, responzivitu a posuv dlouhého detailu.

# Převod podle vzoru

- Při převodu podle jiné kapitoly převezmi vzhled i členění obsahu, hlavní a tematická okna, vazby elementů a dokumentaci; zachovej platné výpočty. Respektuj výslovné omezení pouze na vzhled.

# AI model oční pozornosti

- Když uživatel řekne „hoď mi to do AI modelu očního“ nebo obdobně, pořiď aktuální snímek požadovaného webu v Google Chrome, spusť lokální UNISAL a vrať výsledný heatmapový výstup s jasným označením, že jde o predikci vizuální pozornosti, ne o skutečné měření očí.

# Commity

- U větších funkcí nabídni samostatnou větev a worktree. Drobné opravy prováděj ve stávající pracovní větvi; novou větev ani worktree pro ně automaticky nezakládej.
- Před sloučením zkontroluj stav obou pracovních složek, případné konflikty a připravenost výsledku. Sloučení proveď až na pokyn uživatele.
- Po dokončené logické změně ulož kód a odpovídající dokumentaci společně do lokálního commitu. Push pouze na výslovný pokyn.
- Ve sdíleném adresáři použij `git commit --only -m "Popis" -- cesta1 cesta2`; necommituj obecně celý společný index. Příkaz zahrnuje celé soubory: nejprve ověř, že neobsahují cizí změny.
- Při souběžné úpravě stejného souboru použij samostatné worktree nebo nejprve odděl vlastní obsah. Cizí změny nevracej ani necommituj.
- Po změně HEAD jiným chatem znovu načti dotčené podklady. Po commitu ověř jeho hash a seznam souborů; cizí commit nevydávej za vlastní.
- Při známém omezení zápisu do `.git` použij rovnou schvalovaný běh konkrétního commitu. Neměň oprávnění a nemaž zámky; blokaci výslovně oznam.
- V PowerShellu po externím příkazu s navazujícími kroky ověř `$LASTEXITCODE`; po chybě nepokračuj k commitu a neobcházej hook.
- Předaný výsledek je bez výhrady uzavřený; mlčení uživatele neznamená provedení testu. Při výslovné výhradě proveď další logickou opravu.

# Pravidla struktury

- Oblasti mají úroveň `#`; používej stručné odrážky. Tuto část ponechávej na konci.

```markdown
# Název oblasti

- Pravidlo pro danou oblast.
```
