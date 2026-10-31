// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// ID určuje pevnou pozici v UI; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
  transpiration: [
    { id: 'transpirace', nadpis: 'Transpirace', tema: 'water', viditelnyPrepinac: true, strana: 'left', hlavni: true,
      vypocet: 'transpiration', zobrazitVzorec: true, vzorecText: 'min(základ × listy × světlo × voda; spotřeba)', zobrazitHodnotu: true,
      text: ['Voda se odpařuje převážně průduchy listů. Odpar pomáhá táhnout vodu od kořenů a spotřebovává teplo. Za světla bývá vyšší; nedostatek vody vede k omezení ztrát průduchy.'] },
    { id: 'prijem-vody', nadpis: 'Příjem vody', tema: 'water', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'inflow', zobrazitVzorec: true, vzorecText: 'min(přísun; limit kořenů)', zobrazitHodnotu: true,
      text: ['Kořeny doplňují zásobu vody ve stromu. Příjem omezuje dostupná voda a sezónní maximum kořenů; nemusí být stejný jako okamžitý odpar.'] },
    { id: 'chlazeni', nadpis: 'Chlazení', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'coolingKW', zobrazitVzorec: true, vzorecText: 'odpar × 2450 / 3600', zobrazitHodnotu: true,
      text: ['Odpařování vody spotřebovává teplo. Chladicí výkon je fyzikální odhad, nikoli změna teploty; při omezení odparu klesá.'] },
    { id: 'teplota', nadpis: 'Teplota', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'temperatureNearCanopy', zobrazitVzorec: true, vzorecText: 'okolí − ochlazení + noční efekt', zobrazitHodnotu: true,
      text: ['Ve dne odpar ochlazuje okolí koruny; v noci olistěná koruna omezuje vyzařování tepla a u ní může být mírně tepleji. Základem jsou normály ČHMÚ 1991–2020. Denní kolísání a teplá či chladná období jsou výukový odhad, nikoli měření nebo předpověď počasí.'] },
  ],
  photosynthesis: [
    {
      id: 'fotosynteza',
      nadpis: 'Fotosyntéza',
      tema: 'light',
      strana: 'left',
      hlavni: true,
      vypocet: 'activity',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'Listy využívají světlo, vodu a CO₂ k tvorbě cukrů; při fotosyntéze se uvolňuje O₂.',
      ],
    },
    {
      id: 'cukry',
      otevrene: true,
      nadpis: 'Cukry',
      tema: 'sugar',
      strana: 'right',
      popis: 'Tvorba cukrů ≈ glukóza',
      vypocet: 'glucoseGramsPerMinute',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'Cukry ukládají energii ze světla a slouží jako palivo i stavební materiál pro růst stromu.',
      ],
    },
    {
      id: 'voda',
      nadpis: 'Voda',
      tema: 'water',
      strana: 'right',
      otevrene: true,
      vypocet: 'waterConsumptionLitresPerHour',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'Voda proudí do listů, ochlazuje korunu odparem a pomáhá udržovat listy zavodněné.',
      ],
    },
    {
      id: 'co2',
      nadpis: 'CO₂',
      tema: 'co2',
      strana: 'right',
      vypocet: 'co2GramsPerMinute',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'CO₂ je vstupní látka fotosyntézy; průduchy regulují jeho příjem podle vody a podmínek prostředí.',
      ],
    },
    {
      id: 'kyslik',
      nadpis: 'O₂',
      tema: 'oxygen',
      strana: 'right',
      vypocet: 'oxygenGramsPerMinute',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'O₂ vzniká při štěpení vody a strom ho při fotosyntéze uvolňuje do vzduchu.',
      ],
    },
  ],
};

export const pruvodceTranspiraci = {
  kapitola: 'Právě prohlížíš · Transpirace',
  nadpis: 'Odpar v listech táhne vodu vzhůru.',
  vysvetleni: 'Kořeny vodu přijímají. Xylém ji vede do listů, kde se odpařuje a spotřebovává teplo.',
  cesta: ['Kořeny · příjem', 'Kmen · voda vzhůru', 'Listy · odpar a chlazení'],
  legenda: 'Modrá linka ve stromu = cesta vody',
  temata: 'Prozkoumej prvky transpirace',
  ovladani: 'Klikni na nadpis okna. Otevřeš vysvětlení; vodní témata zvýrazní modrou linku.',
};
