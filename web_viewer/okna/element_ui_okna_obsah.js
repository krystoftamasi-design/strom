// Obsah oken: jeden záznam pro každé okno, bez vykreslování a výpočtů.
// ID určuje pevnou pozici v UI; téma odkazuje na barvy v CSS.
export const oknaPodleKapitol = {
  seeds: [
    { id: 'semenace', nadpis: 'Semenace', tema: 'neutral', viditelnyPrepinac: true, strana: 'left', hlavni: true, otevrene: true,
      stavObdobi: { spring: 'Kvetení', summer: 'Vývoj bukvic', autumn: 'Šíření semen', latefall: 'Přezimování' },
      text: ['Z opylených květů vznikají bukvice. Na jaře mohou semena vyklíčit.'] },
    { id: 'kvety', nadpis: 'Květy', tema: 'neutral', viditelnyPrepinac: true, strana: 'right',
      stavObdobi: { spring: 'Kvetou', summer: 'Po odkvětu', autumn: 'Mimo období', latefall: 'Mimo období' },
      text: ['Na jaře vítr přenáší pyl mezi květy.'] },
    { id: 'bukvice', nadpis: 'Bukvice', tema: 'neutral', viditelnyPrepinac: true, strana: 'right',
      stavObdobi: { spring: 'Po opylení', summer: 'Vyvíjejí se', autumn: 'Dozrávají', latefall: 'Mimo období' },
      text: ['Bukvice vznikají po opylení. Bohatá úroda není každý rok.'] },
    { id: 'semena', nadpis: 'Semena', tema: 'seeds', viditelnyPrepinac: true, strana: 'right',
      stavObdobi: { spring: 'Mohou klíčit', summer: 'Ve vývoji', autumn: 'Padají', latefall: 'Přezimují' },
      text: ['Bukvice padají poblíž stromu; živočichové část přenesou dál.', 'Za generace se tak druh může šířit při změnách klimatu.'] },
  ],
  transpiration: [
    { id: 'transpirace', nadpis: 'Transpirace', tema: 'water', viditelnyPrepinac: true, strana: 'left', hlavni: true, otevrene: true,
      vypocet: 'transpiration', zobrazitVzorec: true, vzorecText: 'min(základ × listy × světlo × voda; spotřeba)', zobrazitHodnotu: true,
      text: ['Voda se odpařuje z listů. Tím pomáhá táhnout další vodu od kořenů a spotřebovává teplo. Strom vodu nepumpuje jako srdce.'] },
    { id: 'teplota', nadpis: 'Teplota', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'temperatureNearCanopy', zobrazitVzorec: true, vzorecText: 'okolí − ochlazení + noční efekt', zobrazitHodnotu: true,
      text: ['Číslo ukazuje teplotu u koruny. Ve dne ji odpar pomáhá snižovat; v noci může být u koruny mírně tepleji. Jde o výukový odhad založený na normálech ČHMÚ 1991–2020, nikoli měření nebo předpověď.'] },
    { id: 'chlazeni', nadpis: 'Chlazení', tema: 'temperature', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'coolingKW', zobrazitVzorec: true, vzorecText: 'odpar × 2450 / 3600', zobrazitHodnotu: true,
      text: ['Odpaření vody spotřebovává teplo. Číslo ukazuje odhad chladicího výkonu, nikoli pokles teploty.'] },
    { id: 'prijem-vody', nadpis: 'Příjem vody', tema: 'water', viditelnyPrepinac: true, strana: 'right',
      vypocet: 'inflow', zobrazitVzorec: true, vzorecText: 'min(přísun; limit kořenů)', zobrazitHodnotu: true,
      text: ['Kořeny přijímají vodu a doplňují její zásobu ve stromu. Příjem a odpar nemusí být v danou chvíli stejné.'] },
  ],
  photosynthesis: [
    {
      id: 'svetlo',
      viditelnyPrepinac: true,
      nadpis: 'Světlo',
      tema: 'light',
      strana: 'left',
      otevrene: false,
      vypocet: 'activity',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'Dostupné světlo dopadá na listy. Jeho využití při fotosyntéze závisí také na vodě a dalších podmínkách.',
      ],
    },
    {
      id: 'cukry',
      viditelnyPrepinac: true,
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
      viditelnyPrepinac: true,
      nadpis: 'Voda',
      tema: 'water',
      strana: 'right',
      vypocet: 'waterConsumptionLitresPerHour',
      zobrazitVzorec: true,
      zobrazitHodnotu: true,
      text: [
        'Voda proudí do listů, ochlazuje korunu odparem a pomáhá udržovat listy zavodněné.',
      ],
    },
    {
      id: 'co2',
      viditelnyPrepinac: true,
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
      viditelnyPrepinac: true,
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

export const kontextoveTexty = {
  seeds: {
    vychozi: 'Z mnoha bukvic jen malá část doroste ve strom.',
    varianty: {},
  },
  photosynthesis: {
    vychozi: 'Strom si vytváří cukry pro vlastní růst. Kyslík je odpad tohoto procesu.',
    varianty: {
      co2: 'Uhlík pro tvorbu dřeva pochází z CO₂ ve vzduchu.',
      cukry: 'Z cukrů strom staví své tělo. Živé buňky listů, kmene i kořenů z nich získávají energii.',
      voda: 'Kořeny nepřijímají hlínu, ale vodu a minerální živiny. Část přijaté vody odchází z listů jako pára.',
      kyslik: 'Při fotosyntéze se kyslík uvolňuje. Buněčným dýcháním ho strom také spotřebovává, ve dne i v noci.',
    },
  },
};

export const pruvodceTranspiraci = {
  nadpis: 'Odpar v listech táhne vodu vzhůru.',
};
