// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// ID určuje pevnou pozici v UI; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
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
        'Listy využívají světlo k tvorbě cukrů z vody a oxidu uhličitého. Při ději se uvolňuje kyslík. Cukry dodávají stromu energii i materiál pro růst.',
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
        'Při nedostatku vody se přivírají průduchy. Do listů proniká méně CO₂ a fotosyntéza slábne. Zkuste omezit přítok nebo snížit slunce pod obzor.',
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
        'CO₂ se při fotosyntéze spotřebovává jako vstup pro tvorbu cukrů.',
        'Zobrazená hodnota je okamžitá spotřeba podle aktivní plochy listů a fotosyntetické účinnosti.',
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
      text: ['Při ději se uvolňuje kyslík.'],
    },
  ],
};
