"""Matrix rain GIF for the portfolio website thumbnail.

Green falling katakana/latin characters on a transparent background.
Columns of characters fall at different speeds, with bright
leading character and fading trail.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT    = '/Users/andrew/WEBSITE/website/public/images/thumb_website.gif'
W_PX, H_PX = 300, 207

# ── Palette ───────────────────────────────────────────────────────────────────
BG       = MATTE              # site background — becomes transparent
BRIGHT   = (0,   200, 60)     # leading char
MID      = (0,   150, 40)     # main trail
DIM      = (0,   90,  25)     # fading
DIMMER   = (0,   45,  12)     # tail end

# ── Character set (katakana + ASCII) ─────────────────────────────────────────
KATAKANA = [chr(c) for c in range(0x30A0, 0x30FF)]  # ァ-ン
ASCII    = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&')
CHARS    = KATAKANA + ASCII

# ── Font ─────────────────────────────────────────────────────────────────────
FONT_SIZE = 13
# Try to find a monospace font
FONT_PATHS = [
    '/System/Library/Fonts/Supplemental/Courier New.ttf',
    '/System/Library/Fonts/Courier New.ttf',
    '/Library/Fonts/Courier New.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
]
font = None
for fp in FONT_PATHS:
    if os.path.exists(fp):
        font = ImageFont.truetype(fp, FONT_SIZE)
        break
if font is None:
    font = ImageFont.load_default()

CELL = FONT_SIZE + 1   # character cell height = width (monospace)
COLS = W_PX // CELL
ROWS = H_PX // CELL

# ── Column state ─────────────────────────────────────────────────────────────
rng = np.random.default_rng(42)

# Each column: head position (float rows), speed, trail length, chars
col_heads  = rng.uniform(-ROWS, 0, COLS)          # start staggered above screen
col_speeds = rng.uniform(0.4, 1.1, COLS)          # rows per frame
col_trails = rng.integers(8, 22, COLS)            # trail length
col_chars  = [[rng.choice(CHARS) for _ in range(ROWS + 20)] for _ in range(COLS)]
# Occasionally randomise a character mid-stream for flicker
col_flicker = rng.random((COLS, ROWS + 20)) < 0.03

TRAIL_COLORS = [BRIGHT, MID, MID, DIM, DIM, DIMMER]

TOTAL_FRAMES = 80
HOLD_FRAMES  = 6   # extra hold at end before loop

frames    = []
durations = []

for fi in range(TOTAL_FRAMES + HOLD_FRAMES):
    img  = Image.new('RGB', (W_PX, H_PX), MATTE)
    draw = ImageDraw.Draw(img)

    for col in range(COLS):
        head = col_heads[col]
        trail_len = col_trails[col]

        for t in range(trail_len):
            row = int(head) - t
            if row < 0 or row >= ROWS:
                continue

            # Pick color based on distance from head
            if t == 0:
                color = BRIGHT
            elif t == 1:
                color = BRIGHT
            elif t < trail_len // 2:
                color = MID
            elif t < trail_len - 2:
                color = DIM
            else:
                color = DIMMER

            # Flicker: randomly swap character
            char_idx = row % len(col_chars[col])
            if fi > 0 and col_flicker[col][row]:
                col_chars[col][char_idx] = rng.choice(CHARS)
            ch = col_chars[col][char_idx]

            x = col * CELL
            y = row * CELL
            draw.text((x, y), ch, font=font, fill=color)

    frames.append(img)

    # Advance columns (only during animation frames)
    if fi < TOTAL_FRAMES:
        for col in range(COLS):
            col_heads[col] += col_speeds[col]
            # Reset column when trail has fully passed off screen
            if col_heads[col] - col_trails[col] > ROWS:
                col_heads[col]  = rng.uniform(-ROWS // 2, -2)
                col_speeds[col] = rng.uniform(0.4, 1.1)
                col_trails[col] = rng.integers(6, 18)
                col_chars[col]  = [rng.choice(CHARS) for _ in range(ROWS + 20)]
        durations.append(50)
    else:
        durations.append(80)

save_transparent_gif(frames, OUT, durations)
print(f'Saved {OUT} ({W_PX}x{H_PX}, {len(frames)} frames)')
