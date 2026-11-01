# Lokální predikce pozornosti UNISAL

## Spuštění

- Z kořene projektu spusť v PowerShellu:

```powershell
web_viewer/old/unisal-env/Scripts/python.exe web_viewer/tools/unisal_predict.py "cesta/ke/snimku.png" --output "web_viewer/nahledy/unisal/vysledek"
```

- Zdroj a váhy jsou v `web_viewer/old/unisal`, izolovaný Python 3.11 v `web_viewer/old/unisal-env`.
- Instalace závislostí: `torch torchvision numpy scipy opencv-python pillow fire tensorboardX` z PyPI.
- Oficiální zdroj: https://github.com/rdroste/unisal, revize `7f8ca1a7ecb3dbc1bf7fca837cb6186a85ac27d9`; archivovaný výzkumný projekt ECCV 2020.

## Výstupy a význam

- `overlay.png`: predikce přes původní snímek; `heatmap.png`: barevná mapa.
- `saliency.npy`: hustota predikce v původním rozlišení; `metadata.json`: nastavení a význam.
- Režim statického snímku SALICON, oficiální `weights_best.pth`, normalizace RGB ImageNet; před zpracováním se obraz přepočítá na výšku 384 a šířku dělitelnou 32.
- Barvy mapy jsou relativní k jednomu snímku, nikoli procenta uživatelů. Vyšší intenzita znamená vyšší predikovanou vizuální pozornost.
- Model neměří porozumění, skutečný pohyb očí, klikání ani kognitivní zátěž. Statický snímek nepopisuje celou animaci.
- Porovnávej stejné rozlišení, kapitolu, denní dobu a stav detailů; u animací více okamžiků. Výsledek doplň testem porozumění.
- Výpočet probíhá lokálně bez nahrávání snímků externí službě; spuštění nevyžaduje síť.

## Pravidla struktury

- Postup spuštění → výstupy a omezení → pravidla struktury.
- Udržuj příkaz, umístění modelu a význam map aktuální.
