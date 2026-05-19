"""Super Slim Pwnagotchi thumbnail GIF: rounded box with pixel e-ink display."""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

from PIL import Image, ImageDraw, ImageFont

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_pwnagotchi.gif'

W_PX, H_PX = 420, 290
SCALE = 3
FRAMES = 72

INK = (24, 23, 21)
DIM = (99, 98, 93)
CASE = (27, 28, 27)
CASE_SIDE = (48, 49, 47)
SCREEN = (242, 241, 235)
SCREEN_EDGE = (178, 175, 165)
PCB = (42, 97, 70)
BATTERY = (20, 34, 52)
FACE_FONT = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
LABEL_FONT = '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'


def shade(color, factor):
    return tuple(max(0, min(255, int(c * factor))) for c in color)


def rr(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def scaled_box(cx, cy, w, h):
    return (
        int((cx - w / 2) * SCALE),
        int((cy - h / 2) * SCALE),
        int((cx + w / 2) * SCALE),
        int((cy + h / 2) * SCALE),
    )


GLYPHS = {
    '0': ('111', '101', '101', '101', '111'),
    '1': ('010', '110', '010', '010', '111'),
    'A': ('111', '101', '111', '101', '101'),
    'C': ('111', '100', '100', '100', '111'),
    'G': ('111', '100', '101', '101', '111'),
    'H': ('101', '101', '111', '101', '101'),
    'I': ('111', '010', '010', '010', '111'),
    'N': ('101', '111', '111', '111', '101'),
    'O': ('111', '101', '101', '101', '111'),
    'P': ('111', '101', '111', '100', '100'),
    'S': ('111', '100', '111', '001', '111'),
    'T': ('111', '010', '010', '010', '010'),
    'U': ('101', '101', '101', '101', '111'),
    'W': ('101', '101', '111', '111', '101'),
    'a': ('000', '111', '101', '111', '101'),
    'c': ('000', '111', '100', '100', '111'),
    'e': ('000', '111', '111', '100', '111'),
    'g': ('111', '101', '111', '001', '111'),
    'h': ('100', '100', '111', '101', '101'),
    'i': ('010', '000', '010', '010', '010'),
    'k': ('100', '101', '110', '101', '101'),
    'l': ('100', '100', '100', '100', '111'),
    'n': ('000', '110', '101', '101', '101'),
    'o': ('000', '111', '101', '101', '111'),
    'p': ('000', '111', '101', '111', '100'),
    't': ('010', '111', '010', '010', '011'),
    'w': ('000', '101', '101', '111', '101'),
    ':': ('0', '1', '0', '1', '0'),
    '(': ('01', '10', '10', '10', '01'),
    ')': ('10', '01', '01', '01', '10'),
    '!': ('1', '1', '1', '0', '1'),
    ' ': ('0', '0', '0', '0', '0'),
}


def pixel_text(draw, text, x, y, px=2.0, color=DIM, squash=1.0):
    cursor = x
    for ch in text:
        glyph = GLYPHS.get(ch, GLYPHS[' '])
        gw = max(len(row) for row in glyph)
        for row_i, row in enumerate(glyph):
            for col_i, bit in enumerate(row):
                if bit == '1':
                    x0 = int((cursor + col_i * px * squash) * SCALE)
                    y0 = int((y + row_i * px) * SCALE)
                    x1 = int((cursor + (col_i + 0.84) * px * squash) * SCALE)
                    y1 = int((y + (row_i + 0.84) * px) * SCALE)
                    draw.rectangle((x0, y0, x1, y1), fill=color)
        cursor += (gw + 1) * px * squash


def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def draw_text_face(draw, cx, cy):
    try:
        font = ImageFont.truetype(FACE_FONT, 42 * SCALE)
    except OSError:
        font = ImageFont.load_default()

    text = '(◕‿‿◕)'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = int((cx * SCALE) - tw / 2)
    y = int((cy * SCALE) - th / 2 - 7 * SCALE)
    draw.text((x, y), text, font=font, fill=DIM)


def draw_label(draw, text, x, y):
    font = load_font(LABEL_FONT, 11 * SCALE)
    draw.text((int(x * SCALE), int(y * SCALE)), text, font=font, fill=DIM)


def draw_eink_ui(img, draw, cx, cy, panel_w, panel_h, squash):
    left = cx - panel_w / 2 + 13 * squash
    right = cx + panel_w / 2 - 13 * squash
    top = cy - panel_h / 2 + 10
    bottom = cy + panel_h / 2 - 9

    # Draw the e-ink contents on a flat logical screen, then squash the whole
    # layer with the screen. The face is the actual awake/normal text.
    logical_w = int((panel_w / max(squash, 0.001)) * SCALE)
    logical_h = int(panel_h * SCALE)
    ui = Image.new('RGBA', (logical_w, logical_h), (0, 0, 0, 0))
    ui_draw = ImageDraw.Draw(ui)

    label_font = load_font(LABEL_FONT, 11 * SCALE)
    face_font = load_font(FACE_FONT, 42 * SCALE)
    face = '(◕‿‿◕)'

    ui_draw.text((13 * SCALE, 3 * SCALE), 'pwnagotchi', font=label_font, fill=(*DIM, 255))
    bbox = ui_draw.textbbox((0, 0), face, font=face_font)
    face_w = bbox[2] - bbox[0]
    face_h = bbox[3] - bbox[1]
    ui_draw.text(
        ((logical_w - face_w) // 2, int(logical_h * 0.52 - face_h / 2)),
        face,
        font=face_font,
        fill=(*DIM, 255),
    )

    ui = ui.resize((int(panel_w * SCALE), logical_h), Image.Resampling.BICUBIC)
    img.paste(ui, (int((cx - panel_w / 2) * SCALE), int((cy - panel_h / 2) * SCALE)), ui)

    # Fixed right-side e-ink flex/button shape, like the reference, not flipping ports.
    tab_x = right + 4 * squash
    draw.rectangle(
        (int(tab_x * SCALE), int((top + 1) * SCALE),
         int((tab_x + 12 * squash) * SCALE), int((bottom - 1) * SCALE)),
        fill=shade(SCREEN_EDGE, 0.88),
    )


def make_frame(fi):
    t = fi / FRAMES
    yaw = math.sin(2 * math.pi * t)
    squash = 1.0 - 0.10 * abs(yaw)
    side_x = 26 * yaw
    side_y = 17 - 10 * abs(yaw)

    img = Image.new('RGB', (W_PX * SCALE, H_PX * SCALE), MATTE)
    draw = ImageDraw.Draw(img)

    cx, cy = W_PX / 2, H_PX / 2 + 4
    body_w = 292 * squash
    body_h = 149
    r = int(18 * SCALE)

    rr(draw, scaled_box(cx + side_x, cy + side_y + 22, body_w + 32, body_h + 18),
       r, BATTERY, outline=shade(BATTERY, 0.45), width=2 * SCALE)
    rr(draw, scaled_box(cx + side_x * 0.55, cy + side_y * 0.55 + 8, body_w + 24, body_h + 8),
       r, PCB, outline=shade(PCB, 0.55), width=2 * SCALE)

    side_color = shade(CASE_SIDE, 0.84 + 0.10 * max(0, yaw))
    rr(draw, scaled_box(cx + side_x * 0.35, cy + side_y * 0.35, body_w + 12, body_h + 12),
       r, side_color, outline=shade(side_color, 0.55), width=2 * SCALE)

    rr(draw, scaled_box(cx, cy, body_w, body_h),
       r, CASE, outline=shade(CASE, 0.45), width=2 * SCALE)

    panel_w = 252 * squash
    panel_h = 114
    rr(draw, scaled_box(cx, cy - 5, panel_w, panel_h),
       int(11 * SCALE), SCREEN_EDGE,
       outline=shade(SCREEN_EDGE, 0.65), width=1 * SCALE)
    rr(draw, scaled_box(cx - 3 * squash, cy - 7, panel_w - 20 * squash, panel_h - 15),
       int(7 * SCALE), SCREEN)

    draw_eink_ui(img, draw, cx - 3 * squash, cy - 7, panel_w - 20 * squash, panel_h - 15, squash)
    draw.rectangle(
        (int((cx + 73 * squash) * SCALE), int((cy - 75) * SCALE),
         int((cx + 100 * squash) * SCALE), int((cy - 67) * SCALE)),
        fill=shade(CASE, 1.35),
    )

    return img.resize((W_PX, H_PX), Image.Resampling.LANCZOS)


frames = [make_frame(fi) for fi in range(FRAMES)]
save_transparent_gif(frames, OUT, durations=55)
