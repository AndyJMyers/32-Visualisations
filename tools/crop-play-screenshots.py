from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
FULL_DIR = ROOT / "docs" / "play-store" / "screenshots" / "desktop-full-corrected"
CROP_DIR = ROOT / "docs" / "play-store" / "screenshots" / "desktop-cropped-corrected"

# Coordinates in the rendered full-page screenshot for the desktop visual stage.
VISUAL_STAGE_BOX = (160, 488, 1264, 1320)


def crop_visuals() -> list[Path]:
    CROP_DIR.mkdir(parents=True, exist_ok=True)
    output_paths: list[Path] = []

    for source in sorted(FULL_DIR.glob("*-full.png")):
        image = Image.open(source).convert("RGB")
        width, height = image.size
        left, top, right, bottom = VISUAL_STAGE_BOX
        box = (
            min(left, width),
            min(top, height),
            min(right, width),
            min(bottom, height),
        )
        output = CROP_DIR / source.name.replace("-full.png", ".png")
        image.crop(box).save(output)
        output_paths.append(output)

    return output_paths


def build_contact_sheet(paths: list[Path]) -> Path:
    thumb_width = 276
    thumb_height = 208
    label_height = 30
    columns = 4
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_width, rows * (thumb_height + label_height)), (5, 8, 16))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, path in enumerate(paths):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        x = column * thumb_width + (thumb_width - image.width) // 2
        y = row * (thumb_height + label_height)
        sheet.paste(image, (x, y))
        label = path.stem[3:].replace("-", " ").title()
        draw.text((column * thumb_width + 8, y + thumb_height + 8), f"{index + 1:02d} {label}", fill=(220, 235, 255), font=font)

    output = CROP_DIR / "contact-sheet-corrected.png"
    sheet.save(output)
    return output


def main() -> None:
    paths = crop_visuals()
    contact_sheet = build_contact_sheet(paths)
    print(f"Cropped {len(paths)} screenshots to {CROP_DIR}")
    print(contact_sheet)


if __name__ == "__main__":
    main()
