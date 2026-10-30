// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// Bod odkazuje na pojmenovaný bod stromu; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
  photosynthesis: [
    {
      id: 'fotosynteza',
      nadpis: 'Fotosyntéza',
      tema: 'light',
      bod: 'leaves',
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
      nadpis: 'Cukry',
      tema: 'sugar',
      bod: 'sugars',
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
      bod: 'water',
      strana: 'left',
      text: [
        'Při nedostatku vody se přivírají průduchy. Do listů proniká méně CO₂ a fotosyntéza slábne. Zkuste omezit přítok nebo snížit slunce pod obzor.',
      ],
      ovladani: { id: 'sliderTreeWater', popis: 'Voda' },
    },
    {
      id: 'co2',
      nadpis: 'CO₂',
      tema: 'co2',
      bod: 'co2Air',
      strana: 'right',
      text: [
        'Oproti předindustriální hodnotě jde přibližně o nárůst 50 %.',
        'Vyšší CO₂ může podpořit fotosyntézu.',
      ],
    },
    {
      id: 'kyslik',
      nadpis: 'O₂',
      tema: 'oxygen',
      bod: 'oxygen',
      strana: 'right',
      text: ['Při ději se uvolňuje kyslík.'],
    },
  ],
};
