// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// ID určuje pevnou pozici v UI; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
  transpiration: [
    { id: 'transpirace', nadpis: 'Transpirace', tema: 'water', strana: 'left', hlavni: true },
    { id: 'odpar', nadpis: 'Odpar z listů', tema: 'temperature', strana: 'right' },
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
