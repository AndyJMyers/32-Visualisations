from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"
PLAY_ASSETS = ROOT / "docs" / "play-store" / "assets"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def polished_square(source: Image.Image, size: int, zoom: float = 1.0) -> Image.Image:
    crop_size = int(min(source.size) / zoom)
    left = (source.width - crop_size) // 2
    top = (source.height - crop_size) // 2
    image = source.crop((left, top, left + crop_size, top + crop_size))
    image = image.resize((size, size), Image.Resampling.LANCZOS)
    image = ImageEnhance.Contrast(image).enhance(1.08)
    image = ImageEnhance.Color(image).enhance(1.08)
    image = ImageEnhance.Sharpness(image).enhance(1.12)
    return image


def save_round_icon(image: Image.Image, output: Path, size: int) -> None:
    icon = image.resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    icon.putalpha(mask)
    icon.save(output)


def generate_launcher_icons(source: Image.Image) -> None:
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    master = polished_square(source, 1024, zoom=1.04)
    for folder, size in sizes.items():
        target_dir = RES / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        icon = master.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(target_dir / "ic_launcher.png")
        save_round_icon(master, target_dir / "ic_launcher_round.png", size)

    foreground = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    glyph = polished_square(source, 372, zoom=1.10)
    foreground.alpha_composite(glyph, (30, 30))
    foreground.save(RES / "drawable" / "ic_launcher_foreground.png")

    master.resize((512, 512), Image.Resampling.LANCZOS).save(PLAY_ASSETS / "icon-512.png")


def generate_feature_graphic(source: Image.Image) -> None:
    width, height = 1024, 500
    canvas = Image.new("RGB", (width, height), "#03050a")
    draw = ImageDraw.Draw(canvas)

    for y in range(height):
        blue = int(10 + 28 * (y / height))
        magenta = int(4 + 18 * (1 - y / height))
        draw.line((0, y, width, y), fill=(2, blue, 18 + magenta))

    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    for radius, alpha in [(440, 32), (330, 42), (230, 58)]:
        glow_draw.ellipse((70 - radius // 2, 250 - radius // 2, 70 + radius // 2, 250 + radius // 2), fill=(0, 210, 255, alpha))
        glow_draw.ellipse((840 - radius // 2, 260 - radius // 2, 840 + radius // 2, 260 + radius // 2), fill=(225, 0, 255, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(42))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow)

    hero = polished_square(source, 430, zoom=1.02)
    canvas.alpha_composite(hero, (42, 35))

    draw = ImageDraw.Draw(canvas)
    title_font = font(60, bold=True)
    sub_font = font(34, bold=False)
    small_font = font(27, bold=False)

    x = 500
    draw.text((x + 2, 124 + 2), "32 Visualisations", font=title_font, fill=(0, 0, 0, 190))
    draw.text((x, 124), "32 Visualisations", font=title_font, fill=(235, 246, 255, 255))
    draw.text((x, 220), "Boutique local music player", font=sub_font, fill=(0, 220, 255, 255))
    draw.text((x, 270), "Your music, alive in motion.", font=small_font, fill=(238, 76, 255, 255))

    for i, colour in enumerate(["#00e8ff", "#008dff", "#714dff", "#ff2de7"]):
        draw.rounded_rectangle((x + i * 88, 346, x + 68 + i * 88, 358), radius=6, fill=colour)

    canvas.convert("RGB").save(PLAY_ASSETS / "feature-graphic-1024x500.png")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Android and Google Play visual assets.")
    parser.add_argument("source", type=Path, help="Source square image.")
    args = parser.parse_args()

    PLAY_ASSETS.mkdir(parents=True, exist_ok=True)
    source_path = args.source.expanduser().resolve()
    source = Image.open(source_path).convert("RGBA")

    generate_launcher_icons(source)
    generate_feature_graphic(source)
    shutil.copy2(source_path, PLAY_ASSETS / "source-32-visualisations.png")


if __name__ == "__main__":
    main()
