# Lokální predikce pozornosti UNISAL

## Spuštění

- Z kořene projektu spusť v PowerShellu:

```powershell
web_viewer/old/unisal-env/Scripts/python.exe web_viewer/tools/unisal_predict.py "cesta/ke/snimku.png" --output "web_viewer/nahledy/unisal/vysledek"
```

- Zdroj a váhy jsou v `web_viewer/old/unisal`, izolovaný Python 3.11 v `web_viewer/old/unisal-env`.
- Instalace závislostí: `torch torchvision numpy scipy opencv-python pillow fire tensorboardX` z PyPI.
- Oficiální zdroj: https://github.com/rdroste/unisal, revize `7f8ca1a7ecb3dbc1bf7fca837cb6186a85ac27d9`; archivovaný výzkumný projekt ECCV 2020.

## Video

```powershell
web_viewer/old/unisal-env/Scripts/python.exe web_viewer/tools/unisal_video.py "zaznam.mp4" --output "web_viewer/nahledy/unisal/video"
```

- Vyžaduje `ffmpeg` na PATH; předává video ve zdrojové snímkové frekvenci.
- Používá video režim DHF1K, `static=False` a průběžný skrytý stav mezi snímky; nejde o sadu nezávislých statických predikcí.
- Výstup `overlay.mp4` je H.264 bez zvuku; `saliency.npy` obsahuje mapy v pracovním rozlišení a `metadata.json` parametry.
- Barevná škála je společná pro celý klip. Nesrovnávej intenzity barev mezi různými klipy bez společného měřítka.
- Záznam prohlížeče z jednotlivých snímků může mít nepravidelné intervaly; před predikcí je nutné jej převést na pravidelnou frekvenci podle časových značek. Ukázka Vody je převzorkovaná na 8 fps a nezachycuje všechny rychlé změny.
- Video model nezná záměr kliknutí, neumí prokázat porozumění a není validovaný specificky pro tento výukový web.

## Kliknutí a myš

```powershell
web_viewer/old/unisal-env/Scripts/python.exe web_viewer/tools/unisal_interaction.py zaznam.mp4 --prediction slozka-predikce --events udalosti.json --output slozka-srovnani
```

- Události jsou JSON: `{"events":[{"type":"click","time":3.0,"x":0.75,"y":0.7,"roi":[0.8,0.65,0.98,0.85]}]}`. Souřadnice i obdélník detailu jsou relativní k celému snímku 0–1; čas je v sekundách od začátku videa.
- `pointer` označuje skutečný vzorek polohy myši; `roi` je volitelný obdélník otevřeného detailu u kliknutí. Chybějící události se nevymýšlejí.
- Výstup `comparison.mp4`: vlevo čistý UNISAL, vpravo kombinovaný heuristický odhad, se společnou barevnou škálou. `hybrid.npy` obsahuje kombinované mapy; původní predikce se nemění.
- Zvolený nenaučený předpoklad: kliknutí má počáteční váhu 0,55 a exponenciální pokles s konstantou 1,5 s, končí po 6 s. Myš má váhu 0,08, konstantu 0,3 s a konec po 1 s.
- S detailem jde 35 % interakční váhy na okolí kliknutí a 65 % rovnoměrně na obdélník detailu. Bez detailu jde váha na okolí kliknutí.
- Váhy nejsou kalibrované na lidech; zvýraznění detailu v kombinované mapě je vložený předpoklad, nikoli nezávislé potvrzení jeho účinnosti. Vazba na linku ve stromu se automaticky nevynucuje.
- Ukázka Vody zaznamenává automatické kliknutí: střed tlačítka je náhradní souřadnice, nikoli měřená lidská myš či pohled. Obdélník detailu pochází z DOM po otevření.

## Výstupy a význam

- `overlay.png`: predikce přes původní snímek; `heatmap.png`: barevná mapa.
- `saliency.npy`: hustota predikce v původním rozlišení; `metadata.json`: nastavení a význam.
- Režim statického snímku SALICON, oficiální `weights_best.pth`, normalizace RGB ImageNet; před zpracováním se obraz přepočítá na výšku 384 a šířku dělitelnou 32.
- Barvy mapy jsou relativní k jednomu snímku, nikoli procenta uživatelů. Vyšší intenzita znamená vyšší predikovanou vizuální pozornost.
- Model neměří porozumění, skutečný pohyb očí, klikání ani kognitivní zátěž. Statický snímek nepopisuje celou animaci.
- Porovnávej stejné rozlišení, kapitolu, denní dobu a stav detailů; u animací více okamžiků. Výsledek doplň testem porozumění.
- Výpočet probíhá lokálně bez nahrávání snímků externí službě; spuštění nevyžaduje síť.

## Pravidla struktury

- Postup spuštění → video → kliknutí a myš → výstupy a omezení → pravidla struktury.
- Udržuj příkaz, umístění modelu a význam map aktuální.
