from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PLAY = ROOT / "docs" / "play-store"
ASSETS = PLAY / "assets"
CURATED = PLAY / "screenshots" / "curated"
OUTPUT = PLAY / "pitch"


PANELS = [
    {
        "file": "01-your-music-alive.png",
        "image": "25-cathedral-organism.png",
        "headline": "Your Music, Alive In Motion",
        "body": "A boutique local music player that turns your own audio into vivid responsive visualisations.",
    },
    {
        "file": "02-thirty-two-visions.png",
        "image": "27-kaleidoscope.png",
        "headline": "32 Visualisations",
        "body": "Glowing waveforms, kinetic figures, colour storms, strange gardens, and other audio-reactive ceremonies.",
    },
    {
        "file": "03-local-offline-yours.png",
        "image": "24-turtle-river.png",
        "headline": "Local. Offline. Yours.",
        "body": "Play audio files from your Android device without streaming accounts, rented libraries, or algorithmic sermonising.",
    },
    {
        "file": "04-cockpit-for-sound.png",
        "image": "31-lingerie.png",
        "headline": "A Cockpit For Sound",
        "body": "Simple controls, bold visual response, and a road-trip interface built for atmosphere.",
    },
    {
        "file": "05-made-strange.png",
        "image": "10-butterfly-host.png",
        "headline": "Your Own Music, Made Strange",
        "body": "A small fee, a lifetime of playing, and a crafted player for people who still own music.",
    },
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(image.convert("RGB"), size, Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def paste_rounded(base: Image.Image, image: Image.Image, xy: tuple[int, int], radius: int) -> None:
    mask = rounded_mask(image.size, radius)
    base.paste(image, xy, mask)


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], text_font: ImageFont.ImageFont, fill: tuple[int, int, int], width: int, line_gap: int = 8) -> int:
    x, y = xy
    lines: list[str] = []
    for paragraph in text.split("\n"):
        words = paragraph.split()
        line = ""
        for word in words:
            trial = f"{line} {word}".strip()
            if draw.textbbox((0, 0), trial, font=text_font)[2] <= width:
                line = trial
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)

    for line in lines:
        draw.text((x, y), line, font=text_font, fill=fill)
        y += text_font.size + line_gap
    return y


def panel_background(size: tuple[int, int]) -> Image.Image:
    width, height = size
    bg = Image.new("RGB", size, "#03050a")
    draw = ImageDraw.Draw(bg)
    for y in range(height):
        blue = int(8 + 34 * y / height)
        magenta = int(18 + 25 * (1 - y / height))
        draw.line((0, y, width, y), fill=(3, blue, 18 + magenta))

    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-260, 150, 520, 930), fill=(0, 220, 255, 36))
    glow_draw.ellipse((620, 800, 1440, 1620), fill=(235, 0, 255, 42))
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    return Image.alpha_composite(bg.convert("RGBA"), glow)


def make_panel(config: dict[str, str]) -> Path:
    canvas = panel_background((1080, 1920))
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(ASSETS / "icon-512.png").convert("RGBA")
    icon = icon.resize((112, 112), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (70, 70))

    draw.text((206, 82), "32 Visualisations", font=font(42, True), fill=(238, 246, 255))
    draw.text((208, 132), "A boutique local music player", font=font(24), fill=(0, 224, 255))

    screenshot = cover(Image.open(CURATED / config["image"]), (900, 675))
    screenshot = ImageEnhance.Contrast(screenshot).enhance(1.05)
    shadow = Image.new("RGBA", (940, 715), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((20, 20, 920, 695), radius=48, fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    canvas.alpha_composite(shadow, (70, 358))
    paste_rounded(canvas, screenshot, (90, 360), 42)
    draw.rounded_rectangle((90, 360, 989, 1034), radius=42, outline=(70, 230, 255, 120), width=3)

    after_headline = draw_wrapped(draw, config["headline"], (82, 1132), font(66, True), (245, 250, 255), 900, 10)
    draw_wrapped(draw, config["body"], (86, after_headline + 28), font(36), (210, 230, 242), 900, 13)

    draw.rounded_rectangle((86, 1648, 994, 1785), radius=42, fill=(3, 14, 28, 190), outline=(70, 230, 255, 110), width=2)
    draw_wrapped(
        draw,
        "Pay once. No streaming account. No subscription. Your files, your speakers, your ceremony.",
        (132, 1680),
        font(25),
        (229, 238, 245),
        810,
        8,
    )

    output = OUTPUT / "panels" / config["file"]
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output, quality=96)
    return output


def make_hero() -> Path:
    canvas = panel_background((1600, 600))
    draw = ImageDraw.Draw(canvas)
    icon = Image.open(ASSETS / "icon-512.png").convert("RGBA").resize((300, 300), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (72, 150))

    draw.text((430, 104), "32 Visualisations", font=font(92, True), fill=(245, 250, 255))
    draw_wrapped(
        draw,
        "A crafted local music player for people who still believe sound deserves ceremony.",
        (436, 214),
        font(32),
        (0, 224, 255),
        980,
        6,
    )
    draw_wrapped(
        draw,
        "Pay once. No streaming account. No subscription. Your own music, made strange.",
        (438, 314),
        font(30),
        (235, 92, 255),
        980,
        6,
    )

    tiles = ["25-cathedral-organism.png", "27-kaleidoscope.png", "31-lingerie.png"]
    for index, tile in enumerate(tiles):
        image = cover(Image.open(CURATED / tile), (250, 170))
        x = 470 + index * 285
        y = 390
        paste_rounded(canvas, image, (x, y), 24)
        draw.rounded_rectangle((x, y, x + 249, y + 169), radius=24, outline=(255, 255, 255, 70), width=2)

    output = OUTPUT / "github-hero-1600x600.png"
    OUTPUT.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output, quality=96)
    return output


def make_contact_sheet(paths: list[Path], hero: Path) -> Path:
    canvas = panel_background((1800, 1200))
    draw = ImageDraw.Draw(canvas)

    draw.text((72, 58), "32 Visualisations Play Pitch", font=font(58, True), fill=(245, 250, 255))
    draw.text((76, 128), "Store panels, hero artwork, and public voice in one glance.", font=font(30), fill=(0, 224, 255))

    hero_preview = cover(Image.open(hero), (760, 285))
    paste_rounded(canvas, hero_preview, (72, 218), 32)
    draw.rounded_rectangle((72, 218, 831, 502), radius=32, outline=(255, 255, 255, 70), width=2)
    draw.text((880, 236), "Positioning", font=font(42, True), fill=(245, 250, 255))
    draw_wrapped(
        draw,
        "A boutique local music player for people who want their own music to look as good as it sounds.",
        (884, 298),
        font(30),
        (220, 234, 244),
        780,
        10,
    )
    draw_wrapped(
        draw,
        "A small fee, no subscription, and a lifetime of playing your own music.",
        (884, 424),
        font(26),
        (235, 92, 255),
        780,
        8,
    )

    thumb_w, thumb_h = 280, 498
    gap = 54
    start_x = 72
    y = 620
    for index, path in enumerate(paths):
        thumb = cover(Image.open(path), (thumb_w, thumb_h))
        x = start_x + index * (thumb_w + gap)
        paste_rounded(canvas, thumb, (x, y), 26)
        draw.rounded_rectangle((x, y, x + thumb_w - 1, y + thumb_h - 1), radius=26, outline=(255, 255, 255, 80), width=2)
        draw.text((x, y + thumb_h + 18), f"Panel {index + 1}", font=font(24, True), fill=(238, 246, 255))

    output = OUTPUT / "pitch-contact-sheet.png"
    canvas.convert("RGB").save(output, quality=95)
    return output


def write_pitch_brief(paths: list[Path], hero: Path, contact_sheet: Path) -> Path:
    brief = OUTPUT / "PLAY_PITCH.md"
    relative_paths = [path.relative_to(PLAY).as_posix() for path in paths]
    hero_path = hero.relative_to(PLAY).as_posix()
    contact_sheet_path = contact_sheet.relative_to(PLAY).as_posix()
    brief.write_text(
        "# 32 Visualisations Play Pitch Pack\n\n"
        "## Positioning\n\n"
        "32 Visualisations is a boutique local music player for people who want their own music to look as good as it sounds, without signing up to another rented library.\n\n"
        "The public voice should lead with art, atmosphere, and authorship. The app is paid, but the price should remain a quiet Play Store fact rather than a sales headline: a small fee, no subscription, and a lifetime of playing your own music.\n\n"
        "## Core Lines\n\n"
        "- Your music, alive in motion.\n"
        "- A crafted local music player for people who still believe sound deserves ceremony.\n"
        "- No streaming account. No subscription. Your own music, made strange.\n"
        "- Pay once. Keep playing.\n"
        "- 32 vivid audio-reactive visualisations.\n"
        "- A cockpit for sound.\n\n"
        "## Play Panels\n\n"
        + "\n".join(f"- `{path}`" for path in relative_paths)
        + "\n\n## Hero\n\n"
        f"- `{hero_path}`\n\n"
        "## Overview\n\n"
        f"- `{contact_sheet_path}`\n\n"
        "## Pricing Posture\n\n"
        "Set the app as paid in Play Console, with the selected UK price handled by Google Play. The value message is simple: a small fee and a lifetime of playing. Do not turn the artwork into a price sticker. The listing should feel like an artefact, not a stall.\n",
        encoding="utf-8",
    )
    return brief


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    panel_paths = [make_panel(panel) for panel in PANELS]
    hero = make_hero()
    contact_sheet = make_contact_sheet(panel_paths, hero)
    brief = write_pitch_brief(panel_paths, hero, contact_sheet)
    print("Generated Play pitch artifacts:")
    for path in panel_paths:
        print(path)
    print(hero)
    print(contact_sheet)
    print(brief)


if __name__ == "__main__":
    main()
