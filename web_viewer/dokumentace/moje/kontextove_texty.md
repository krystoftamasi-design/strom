# Kontextové texty

- Stav: návrh k implementaci; tento dokument sám nemění web.
- Cíl: krátkou větou vysvětlit právě sledovanou souvislost a pomoci řešit [Mýty a porozumění](strategi_problems.md#mýty-a-porozumění).
- Návrh vychází ze [Strategie](strategie.md). Aktuálně nasazené samostatné texty popisují [Texty](texty.md).

## Zobrazení

- Věta má být ve stálé oblasti průvodce; v Transpiraci na místě současného „Odpar v listech táhne vodu vzhůru.“.
- Ve Fotosyntéze použít stejnou roli průvodce a návaznost na hlavní proces.
- Zobrazovat vždy jednu krátkou myšlenku; neopakovat celý detail okna.
- Výchozí text vysvětluje hlavní smysl kapitoly. Otevření souvisejícího okna zaměří větu na dané téma.
- Popisek nesmí tvrdit děj, který aktuální stav modelu neumožňuje; samotné přepínání dne a noci není cílem sdělení.
- Text musí zůstat dost dlouho na přečtení; neměnit jej při každé drobné změně hodnot.

## Fotosyntéza

- Texty cílí na [Mýty a porozumění](strategi_problems.md#mýty-a-porozumění); jde o návrh sdělení, nikoli potvrzení nasazení nebo rozsahu modelu.

| Kontext | Navržený text | Cíl porozumění |
|---|---|---|
| Výchozí | Strom si vytváří cukry pro vlastní růst. Kyslík se přitom uvolňuje. | Přínos fotosyntézy pro strom; kyslík není jejím účelem pro lidi. |
| Otevřené [CO₂](okna.md#co₂) | Uhlík pro tvorbu dřeva pochází z CO₂ ve vzduchu. | Původ uhlíku v těle stromu, nikoli z hlíny. |
| Otevřené [Cukry](okna.md#cukry) | Z cukrů strom staví své tělo. Živé buňky listů, kmene i kořenů z nich získávají energii. | Cukry jako stavební materiál a palivo; buněčné dýchání i mimo listy. |
| Otevřená [Voda](okna.md#voda) | Kořeny nepřijímají hlínu, ale vodu a minerální živiny. Část přijaté vody odchází z listů jako pára. | Příjem kořeny a výpar; přijatá voda nezůstává všechna ve stromu. |
| Otevřené [O₂](okna.md#o₂) | Při fotosyntéze se kyslík uvolňuje. Buněčným dýcháním ho strom také spotřebovává, ve dne i v noci. | Rozlišit fotosyntézu a buněčné dýchání; nejde o střídání dvou dějů podle dne a noci. |
| Noc, bez vybraného tématu | Bez světla fotosyntéza ustává. Strom dál získává energii buněčným dýcháním z uložených cukrů. | Zastavení fotosyntézy neznamená zastavení života stromu. |
| Téma využití světla — spouštěč k dopracování | Sluneční energie slouží i k odpařování vody. Fotosyntéza využívá jen část dopadající energie. | Fotosyntéza není jediným ani automaticky největším využitím sluneční energie; návaznost na Transpiraci. |

- U noční varianty a textu O₂ ověřit rozsah modelovaného dýchání; nezaměnit čistou bilanci plynů s jednotlivými procesy. Obecné vysvětlení nesmí předstírat další zobrazený tok.
- Při nedostatku vody nebo listů ponechat vysvětlení tématu, ale netvrdit aktivní tvorbu cukrů; přesné stavové varianty a priorita při více otevřených oknech zůstávají k dopracování.

## Transpirace

- Výchozí text: „Odpar v listech táhne vodu od kořenů a spotřebovává teplo — tím strom ochlazuje.“
- Cíl: propojit tah vody a chlazení podle [Mýtů a porozumění](strategi_problems.md#mýty-a-porozumění).
- Tematické varianty pro jednotlivá okna zatím nejsou navržené.

## K dopracování a ověření

- Určit prioritu textů při více otevřených oknech a návrat po zavření; výchozí hlavní detail je otevřený současně s tematickými.
- Doplnit pravidla pro noc, nedostatek vody a nepřítomnost listů, aby věty odpovídaly modelu.
- Ověřit u studentů původ uhlíku, přínos cukrů a vztah odparu k tahu vody a chlazení; samotná heatmapa porozumění neprokazuje.
- Po implementaci sjednotit definice v [Textech](texty.md) a evidovat skutečné nasazení; tento návrh nesmí současně působit jako druhá platná definice.

## Pravidla struktury

- Za hlavním nadpisem uvést stav, cíl a odkazy na strategii a platné definice.
- Oddíly řadit: zobrazení → kapitoly → k dopracování a ověření → pravidla struktury.
- U každé varianty uvést kontext, přesné znění a cíl porozumění; více variant zapisovat tabulkou.
- Návrhy oddělit od doložené implementace; pravidla a obecnou šablonu ponechat na konci.

```markdown
# Kontextové texty

- Stav: návrh nebo doložený stav.
- Cíl: zamýšlené porozumění.

## Zobrazení

- Pravidlo výběru a zobrazení věty.

## Název kapitoly

| Kontext | Navržený text | Cíl porozumění |
|---|---|---|
| Podmínka | Přesné znění. | Vysvětlovaný vztah. |

## K dopracování a ověření

- Neuzavřené pravidlo nebo způsob ověření.

## Pravidla struktury

- Pravidlo členění.
```
