"""Copy the original embedded brush assets from the Affinity SVG export."""
import base64
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'obrazky/textury/UI/ui_new.svg'
DESTINATION = ROOT / 'web_viewer/web_assets'
ASSETS = {
    '_Image6': 'ui_linka_svisla_1.png',
    '_Image7': 'ui_linka_svisla_2.png',
    '_Image9': 'ui_linka_svisla_3.png',
    '_Image10': 'ui_linka_svisla_4.png',
    '_Image11': 'ui_linka_svisla_5.png',
    '_Image1': 'ui_linka_vodorovna_1.png',
    '_Image2': 'ui_linka_vodorovna_2.png',
    '_Image8': 'ui_linka_vodorovna_3.png',
}

def main():
    tree = ET.parse(SOURCE)
    images = {image.get('id'): image for image in tree.iter('{http://www.w3.org/2000/svg}image')}
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for image_id, filename in ASSETS.items():
        image = images[image_id]
        uri = image.get('{http://www.w3.org/1999/xlink}href')
        prefix, payload = uri.split(',', 1)
        if prefix != 'data:image/png;base64':
            raise ValueError(f'Unexpected image format: {image_id}')
        (DESTINATION / filename).write_bytes(base64.b64decode(payload, validate=True))
        print(f'{filename}: {image.get("width")} × {image.get("height")}')

if __name__ == '__main__':
    main()
