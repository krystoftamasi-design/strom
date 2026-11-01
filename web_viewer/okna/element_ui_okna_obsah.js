// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// ID určuje pevnou pozici v UI; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
  transpiration: [
    { id: 'transpirace', nadpis: 'Transpirace', tema: 'water', viditelnyPrepinac: true, strana: 'left', hlavni: true, otevrene: true,
      vypocet: 'transpiration', zobrazitVzorec: true, vzorecText: 'min(základ × listy × světlo × voda; spotřeba)', zobrazitHodnotu: true,
      text: ['Voda se odpařuje z listů. Tím pomáhá táhnout další vodu od kořenů a spotřebovává teplo. Strom vodu nepumpuje jako srdce.'] },
    { id: 'prijem-vody', nadpis: 'Příjem vody', tema: 'water', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'inflow', zobrazitVzorec: true, vzorecText: 'min(přísun; limit kořenů)', zobrazitHodnotu: true,
      text: ['Kořeny přijímají vodu a doplňují její zásobu ve stromu. Příjem a odpar nemusí být v danou chvíli stejné.'] },
    { id: 'chlazeni', nadpis: 'Chlazení', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'coolingKW', zobrazitVzorec: true, vzorecText: 'odpar × 2450 / 3600', zobrazitHodnotu: true,
      text: ['Odpaření vody spotřebovává teplo. Číslo ukazuje odhad chladicího výkonu, nikoli pokles teploty.'] },
    { id: 'teplota', nadpis: 'Teplota', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'temperatureNearCanopy', zobrazitVzorec: true, vzorecText: 'okolí − ochlazení + noční efekt', zobrazitHodnotu: true,
      text: ['Číslo ukazuje teplotu u koruny. Ve dne ji odpar pomáhá snižovat; v noci může být u koruny mírně tepleji. Jde o výukový odhad založený na normálech ČHMÚ 1991–2020, nikoli měření nebo předpověď.'] },
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
  nadpis: 'Odpar v listech táhne vodu vzhůru.',
};
