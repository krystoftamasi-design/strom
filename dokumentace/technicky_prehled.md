# 🌲 3D Strom — Webový Prohlížeč (WebGL / Three.js)

Aktuální aplikace obsahuje úvod a kapitoly Fotosyntéza, Transpirace, Kořeny a Semenace se společnou vodní bilancí a ovládáním období a slunce. Vstup je `index.html`; starší přehled níže popisuje původní technické možnosti. Aktuální model, předvolby a omezení popisuje [ARCHITEKTURA_IMPLEMENTACE.md](./ARCHITEKTURA_IMPLEMENTACE.md). Uživatel nastavuje vodu dodanou ke kořenům, zobrazovanou v l/h; skutečný příjem omezuje sezónní maximum a zásoba se vypočítává.

Interaktivní 3D prohlížeč stylizovaného stromu s replikací EEVEE Toon/Cel-shading shaderu z Blenderu, procedurálním trasováním cévního systému, simulací hydratace/sucha a interaktivní okapovou linií koruny.

---

## 📂 Struktura složek projektu

```
STROM/
├── web_viewer/                  # 🌐 KOMPLETNÍ WEBOVÝ PROHLÍŽEČ
│   ├── index.html               # Vstupní soubor webové aplikace
│   ├── strom_web_viewer.html    # Hlavní aplikace 3D prohlížeče
│   ├── spustit_web_viewer.bat   # Lokální spouštěč prohlížeče
│   ├── README.md                # Technická dokumentace webu
│   └── web_assets/              # 3D modely, textury a Three.js knihovny
│       ├── strom_web_fast.glb   # Výchozí web: 162k trojúhelníků, ~8 MB
│       ├── strom_web.glb        # Předchozí webový model, 492k trojúhelníků
│       ├── strom_full.glb       # Detailní plný 3D model (~100 MB)
│       ├── leaf_alpha_1.png     # Štětcová alpha maska listů (Typ 1)
│       ├── leaf_alpha_2.png     # Štětcová alpha maska listů (Typ 2)
│       ├── oxygen_bubble_1.png  # Textura z obrazky/textury/02/Untitled.png
│       ├── oxygen_bubble_2.png  # Textura z obrazky/textury/02/o2.png
│       ├── oxygen_bubble_3.png  # Textura z obrazky/textury/02/3.png
│       ├── oxygen_bubble_4.png  # Textura z obrazky/textury/02/4.png
│       ├── vendor/              # Three.js ES modul
│       └── jsm/                 # OrbitControls, GLTFLoader
│
├── BLENDER/                     # 🎨 Skripty a podklady pro Blender
│   ├── root_generator.py        # Generátor kořenového systému
│   └── optimize_tree.py         # Skript pro decimaci a export geometrie
│
├── Unity_OffAxis/               # 🕶️ Projekt pro Off-Axis virtuální 3D okno
├── STROM_VAULT/                 # 📚 Obsidian znalostní báze o stromu
├── fotosynteza/                 # 🍃 Modul pro simulaci fotosyntézy
├── old/                         # 🗄️ Archiv starých/debugovacích skriptů a logů
├── spustit_strom_web.bat        # 🚀 Hlavní spouštěcí skript aplikace (Root)
└── README.md                    # Tento přehledový dokument
```

---

## 🚀 Jak aplikaci spustit

1. Dvakrát klikněte na soubor **`spustit_strom_web.bat`** v kořenové složce (nebo ve složce `web_viewer/spustit_web_viewer.bat`).
2. Skript automaticky spustí lokální webový server na portu `8080` a otevře prohlížeč na adrese:
   ```
   http://localhost:8080/web_viewer/strom_web_viewer.html
   ```

---

## 🌟 Přehled klíčových funkcí na webu

### 1. 🎨 Cel-Shading Toon Shader Listů (Blender EEVEE Replikace)
Shader věrně napodobuje node tree z Blenderu (`Material.003` a `Material.005`):
- **Constant Color Ramp (2 barvy):** Ostrý zlom světla a stínu s nastavitelným prahem (`1.0`).
- **Černo-modrý stín:** Barva stínu je laděna do hluboké indigové modři `vec3(0.022105465, 0.015532205, 0.060965665)` (modrá složka je 3× silnější než červená a zelená).
- **Alfa z Blenderu:** `Material.003` čte přímo `list2.png`, `Material.005` používá vlastní alfa rampu. Výchozí stochastický ořez má plný zápis hloubky; lze přepnout na MSAA coverage nebo ostrý ořez.
- **Oboustranné osvětlení:** Výpočet skalárního součinu $N \cdot L$ přes `gl_FrontFacing` pro přirozené oslunění tenkých listových ploch.

### 2. 🍂 Sezónní systém koruny (Season Engine)
- **4 rychlé předvolby:** Jaro 🌸, Léto ☀️, Podzim 🍁, Zima/Pozdní podzim ❄️.
- **Plynulý slider sezóny:** Umožňuje plynule přecházet od svěží letní zeleně přes zlatou a oranžovou až po pozdní podzim.
- **Zachování stínového kontrastu:** Podzimní zabarvení mění pouze barvu osvětlené části listu. Stín zůstává temně černo-modrý, takže strom nikdy neztrácí plasticitu a hloubku.

### 3. 💧 Cévní systém a tok mízy (Vascular System & Sap Flow)
- **Automatické trasování kmene (Ring Walker):** Algoritmus analyzuje buffer vrcholů a detekuje švy prstenců geometrie ($< 0.0015\text{ m}$). Prochází kmen od paty po vidlice a počítá přesnou osu bez manuálního nastavování.
- **Trasování kořenů (Dijkstra):** Algoritmus nejkratší cesty hledá v grafu vrcholů sítě kořenů přirozené trajektorie od paty kmene k jednotlivým kořenovým špičkám.
- **3D Trubice:** Křivky jsou vyhlazeny pomocí `CatmullRomCurve3` a převedeny na 3D geometrii `TubeGeometry`.
- **Neonově modrý pulzující proud:** Vlastní GLSL shader simuluje tok mízy pulzující od kořenů vzhůru kmenem do větví.
- **Čistý tmavě modrý text H₂O (font Satoshi, chemický dolní index):** Po straně vodní linky je umístěn čistý tmavě modrý nápis **H₂O** (`#003399`) v moderním geometrickém řezu písma **Satoshi** (Black 900) s chemickým dolním indexem dvojky bez efektů, rámečků či animací, posunutý do spodní části kmene (cca 2,6 m výšky). Text má pevnou 3D prostorovou orientaci přímo zepředu (směr $+Z$) a neotáčí se s kamerou.
- **Slider opacity mízy (`0–100 %`):** Plynulé nastavení průhlednosti a záře modrého toku mízy i navázaného textu H₂O.

### 3.1 🫧 Textury a vznik kyslíkových bublin
- **Čtyři textury:** Bubliny střídají assety `oxygen_bubble_1.png` až `oxygen_bubble_4.png`, převzaté ze složky `obrazky/textury/02`.
- **Posunutý vznik:** Každá bublina vzniká 1,5 3D jednotky od původního reakčního bodu ve směru své rozptylové trajektorie.
- **Slider vzdálenosti:** Vzdálenost vzniku lze během běhu měnit v rozsahu 0–30 bodů po 0,1; výchozí hodnota je 1,5.
- **Nepravidelné podzimní pigmenty:** Každý list má stabilní náhodnou odezvu na červený pigment. Přibližně 25 % listů navíc dostane zpoždění barevného přechodu o 18–40 % fáze; všechny ale při 100 % stále dosáhnou hnědého konce.
- **Pevná orientace textury:** Náhodné otáčení sprite textury je vypnuté.

### 4. 🚰 Dynamika vody v litrech a usychání koruny (Water Volume & Drought)
- **Slider zásoby vody (`0 až 1 500 litrů`, nominálně `800 L`):**
  - **Tloušťka cévy:** Objem vody přímo ovlivňuje tloušťku modré trubice toku mízy (při 1 500 L je céva maximálně napumpovaná, při nedostatku se tenčí).
  - **Rychlost toku:** Hydratovaný strom má svižný pulzující tok mízy, při suchu tok téměř ustává.
- **Simulace sucha a senescence koruny:**
  - Pokud zásoba vody klesne pod **350 litrů**, strom po **2,5sekundové prodlevě** začne viditelně trpět suchem.
  - Listí začne postupně a plynule schnout a žloutnout/hnědnout.
  - Při opětovném doplnění vody nad 350 L se usychání zastaví a koruna se plynule rehydratuje zpět do barvy aktuální sezóny.
  - V rozhraní se zobrazuje stavový řádek v reálném čase.

### 5. ⚪ Okapová linie koruny stromu (Canopy Drip Line)
- **Čistá bílá architektonická linie (`#ffffff`):** Stabilní bílá kontura průmětu koruny na terénu bez rušivých shaderových efektů.
- **Slider tloušťky linie:** Nastavitelná šířka obrysu okapové zóny.
- **Slider viditelnosti (opacity):** Plynulé nastavení průhlednosti od 0 % do 100 %.
- **Interaktivní odezva na myš (Hit-Proxy):** Přejetím kurzoru myši přes okapovou linii se aktivuje padající déšť kapek po obvodu a soustředné vlnky (ripples) na zemi.

### 6. ☀️ Osvětlení a 4-Sun systém (EEVEE Lighting Match)
- **4 směrová slunce:** Nakonfigurována přesně podle úhlů a parametrů z Blenderu (hlavní klíčové slunce + 3 doplňková směrová světla).
- **Měkké stínové mapy (PCFSoftShadowMap):** Realistické stíny pod korunou a kolem kmene.
- **Rotace a sklon slunce:** Slidery pro interaktivní změnu azimutu a výšky slunce na obloze.

### 7. 🎥 Pohledové předvolby a Studio režimy
- **5 režimů kamery s plynulým přechodem:**
  - 🎯 **Celý strom** (tříčtvrteční přehledový pohled)
  - 🍃 **Koruna** (detailní pohled do listoví)
  - 💧 **Kmen & Cévy** (zaměření na cévní svazek kmene)
  - 🌱 **Kořeny** (detailní pohled na kořenové náběhy)
  - 📐 **Půdorys** (kolmý pohled shora na okapovou linii)
- **Přepínání pozadí:** Elegantní tmavé studio (`#0f1115`) vs. světlé výstavní studio (`#dcded0`).
- **Výběr modelu:** Přepínač mezi lehkým webovým modelem (`8 MB`) a detailním plným modelem (`100 MB`).
- **Screenshot:** Tlačítko pro export čistého renderu ve vysokém rozlišení.

Podrobnosti převodu původních uzlů, atlasů a správné interpretace CONSTANT rampy: [README_SHADER_EXPLANATION.md](../../README_SHADER_EXPLANATION.md).

### Osvětlení ze všech stran

Aktuální verze používá jedno slunce s uloženým alfa stínem a měkké světlo
oblohy. Hloubka zastínění koruny ovládá předpočítanou viditelnost oblohy
uvnitř listoví. Výpočet běží v workeru po změně listů nebo modelu a je
nezávislý na pohybu kamery. Panel obsahuje samostatné posuvníky pro slunce,
oblohu a zastínění koruny.

### Štětcová vodní linka

`vykreslovani/water_brush.js` používá alfa kanál uživatelského `obrazky/cara.png`, jehož
nezměněná kopie je v `web_assets/water_brush.png`. Černé RGB se nepoužívá;
tah se barví vodní modrou a světle modrými impulsy. Hlavní tah je vybrán
souřadnicemi textury, bez drobného odlehlého bodu v původním PNG.

Textura proudí podél skutečné délky tras a u paty kmene navazuje na kořeny.
Její šířka se promítá přes viditelný průměr trubice, takže se při otočení
kamery neschová na zadní stranu. Statické atributy se vytvářejí jen při
přestavbě geometrie; animace běží ve shaderu. Dosavadní ovladače rychlosti,
průhlednosti, tloušťky, záře a zobrazení skrz strom jsou zachované.

Ověření zdrojové alfy, modré barvy, pohybu, zastavení, průhlednosti,
tloušťky a pohledů ze strany: `web_viewer/testy/test_water_brush.mjs`.

Opakování používá pouze prostřední část tahové masky (řádky 40–920), před
zeslabenými konci. Navazující úseky se zrcadlí a spojují na shodném řádku
textury. Tah se proto nepřerušuje ani nezeslabuje na švech; rychlost proudění
zůstává stejná. Test kontroluje souvislost skutečného GPU obrazu dlouhé linky.
