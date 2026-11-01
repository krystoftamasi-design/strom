---
history:
  - thread_id: 01a19439-ee7f-71f1-af82-4e2ff1146c5f
    date: 2026-11-01
    change: Zkrácena specifikace vzhledu, sloučeny duplicity a odstraněna pravidla obsahu a technické návody.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zjednodušena komponenta na nezávislý blok údajů a detailu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Sjednoceny společné části oken a datové varianty jejich vzhledu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-11-01
    change: Zachována definovaná velikost nadpisů bez zmenšování podle obsahu.
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Zakázáno zalamování nadpisů oken a upraven prostor záhlaví.

---

# Vzhled oken

## Statická okna

- Okna mají pevné místo v rozhraní, nezávisle na stromu a kameře; nemají pohybové animace ani spojnice ke stromu.
- Změny hodnot a otevření detailu neposouvají údaje ani sousední okna.
- Bloky jsou bez výplně a rámečku, s nepravidelným svislým tahem vlevo v barvě tématu.

### Obecný obsah

- Údaje tvoří svislý blok: nadpis → hodnota s jednotkou → vzorec nebo přehled vstupů.
- Tematické okno má detail vpravo, zarovnaný k hornímu okraji, s vlastním posuvem a mezerou 15 px. Hlavní okno používá variantu detailu nad údaji.
- Nadpis zůstává na jednom řádku bez zmenšování podle délky; při nedostatku místa je dostupný vodorovný posuv.
- Viditelné tlačítko +/− je kruhové, široké 28 px, s odstupem 8 px od nadpisu a vlastním prostorem; fokus je viditelný.
- Konkrétní texty, hodnoty, ovládání a výchozí otevření detailů určuje [Obsah oken](okna.md).

### Rozložení

- Vzor: [podklad rozhraní](../../web_assets/ui_from_af/Untitled.svg), přibližně 2020 × 1143 px; procenta se vztahují k ploše rozhraní.
- Hlavní okno je vlevo dole, tematická okna vpravo; střed zůstává volný pro strom.
- Fotosyntéza: vpravo shora O₂, CO₂, Cukry a Voda; detaily mají společný začátek druhého sloupce.
- Transpirace: vpravo shora Příjem vody, Chlazení a Teplota; první sloupec se přizpůsobuje nezalomenému nadpisu a tlačítku.
- Pravá okna Transpirace: levý okraj 68 %, šířka 29 %, horní okraje 28 / 48 / 68 %, výška 14 %, nejméně 85 px.
- Tahy O₂, CO₂ a Cukrů mají 65 % výšky okna, hlavní okno 100 %; tah Vody sleduje výšku údajů.
- Mezi okny zůstává volný prostor; dlouhý detail se posouvá uvnitř svého okna.

### Úzká obrazovka

- Do šířky 700 px zůstávají dva pevné sloupce; tematický detail je pod údaji, hlavní detail zůstává nad nimi. Oba mají vlastní posuv.
- Pravý sloupec začíná na 52 % a má šířku 44 %; okna Transpirace mají horní okraje 22 / 46 / 70 % a výšku 17 %.
- Používá se společná typografická škála pro úzkou obrazovku, bez výjimek podle délky nadpisu.
- Fotosyntéza skrývá přehled vstupů; skutečné vzorce Transpirace zůstávají viditelné a mohou se zalomit.

### Písmo

- Nadpisy: Nohemi Regular, na referenčním plátně přibližně 53 px; hlavní nadpis přibližně 92 px a výraznější řez.
- Hodnoty: Nohemi v barvě tématu; hlavní okno má větší hodnotu než tematická okna.
- Popisky, jednotky a detaily: Satoshi Light; vzorce a přehled vstupů: drobné Satoshi Medium.

### Barvy

- Běžný text a vstupy jsou ve dne tmavé, v noci světlé; barvy témat se nemění.
- Světlo a aktivita: žlutá; voda: modrá; kyslík: světle modrá; CO₂: červenooranžová.
- Cukry: fialová; listy: zelená; kořeny: hnědá; teplota: růžovočervená.

### Šablona jednoho okna podle Fotosyntézy

- Společný základ tvoří barevný tah, blok údajů a samostatný detail podle pravidel výše.
- U dalšího okna určuj pouze roli, umístění, rozměry a případnou vzhledovou odlišnost; obsah patří do [Obsahu oken](okna.md).
- Technické použití společné komponenty popisuje [Architektura oken](../system/architektura_oken.md#rozložení).

### Šablona hlavního okna

- Nadpis, hodnota a vzorec zůstávají na pevném místě vlevo dole.
- Detail se otevírá nad oknem, 14 px nad jeho horním okrajem; šířka nejvýše 44 znakových jednotek a zároveň uvnitř šířky okna.
- Detail má vlastní posuv a maximální výšku 24 % výšky obrazovky; do šířky 700 px 20 %.
- Otevření ani délka textu neposouvá údaje a sousední okna. Stejná varianta platí pro hlavní okna všech kapitol.
- Výchozí otevření určuje obsah okna, nikoli šablona.

[Obsah oken](okna.md) · [Obsah](../architektura_obsahu.md)

## Pravidla struktury

- Název dokumentu má úroveň `#`, společná oblast `##` a témata `###`.
- Témata řaď: obecný obsah → rozložení → úzká obrazovka → písmo → barvy → šablona okna → šablona hlavního okna.
- Každé pravidlo vzhledu uveď jednou; obsah a ovládání odkazuj do `okna.md`, technické návody do architektury.
- U rozměrů uváděj jednotky, vztažnou plochu procent a mezní šířku obrazovky.
- Historii ponechávej ve frontmatteru a odkazy před touto závěrečnou částí.

```markdown
# Název dokumentu

## Název oblasti

- Společný vzhled.

### Obecný obsah

- Skladba okna a odkaz na obsah.

### Rozložení

- Poloha, rozměry a odlišnosti kapitol.

### Úzká obrazovka

- Mezní šířka a přizpůsobení rozložení.

### Písmo

- Typografické pravidlo.

### Barvy

- Barevné pravidlo.

### Šablona jednoho okna podle vzoru

- Společný základ a odkaz na použití.

### Šablona hlavního okna

- Poloha detailu nad údaji, odstup a omezení posuvu.

[Související dokument](../soubor.md)

## Pravidla struktury

- Pravidlo členění.
```
