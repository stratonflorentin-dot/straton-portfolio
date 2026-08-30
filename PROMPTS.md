# THE AI ART SYSTEM
### How to generate nine images that look like one artist made them.

---

## Why this document exists

The template is the easy part. The hard part — the part that took
dozens of failed generations to work out — is **consistency**.

Generate nine images one at a time and you'll get nine different art
styles, nine different faces, and nine different colour grades. It
looks broken even when each individual image looks fine.

This is the system that fixes it.

---

# THE FOUR RULES

### 1. One conversation. All nine images.
Every image in the same chat thread. A new chat means a new
interpretation of your character and your style. Never restart.

### 2. Attach your reference photo to every prompt.
Don't rely on the model remembering. Attach it each time. This is
more reliable than any amount of description.

### 3. No text in any image.
Every title, menu item, stat bar and HUD element is rendered in code.
Text baked into an image can't be fixed, can't be translated, and AI
lettering is almost always subtly wrong. Keep the art clean.

### 4. Every bright scene needs a dark anchor.
This is the technique nobody tells you. See below.

---

# ★ THE DARK ANCHOR TECHNIQUE

**The problem:** ask for a bold illustrated style and the model gives
it to you — until the scene goes bright. Then it silently reverts to
soft, generic illustration or straight photography.

**Why:** heavy black linework and crushed shadows are what read as
"key art." In a high-key daylight scene there are no shadows to crush,
so the model has nothing to build contrast against and falls back on
its default.

**The fix:** force one genuinely dark, hard-edged element into every
bright frame.

```
CRITICAL — DARK ANCHOR: A large palm frond casts a deep, hard-edged,
NEAR-BLACK shadow across the immediate foreground. This shadow must be
genuinely dark with a crisp graphic outline, not soft or grey. It
anchors the contrast.
```

Add a dark object too — a silhouetted car, a shaded doorway, a figure
in shadow. Two dark shapes in a bright scene and the style holds.

This single instruction is the difference between a coherent set and a
mess.

---

# THE BUILDING BLOCKS

## Style lock — paste into every prompt

```
Bold cel-shaded key art illustration. VISIBLE BLACK INK OUTLINES on
every edge and contour, including in the brightest sunlit areas.
Hard-edged cel shading with only three tonal steps — no soft gradients,
no airbrushing, no blur. Screen-printed poster look with a limited,
saturated palette. Every bright scene must still contain one area of
deep, near-black shadow to hold contrast.

NOT a photograph. NOT a 3D render. NOT architectural visualization.
NOT soft anime. NOT flat vector art.
```

## Character lock — if you're in the images

```
Use the person in the attached reference photo. Preserve their exact
facial structure, skin tone, hair volume and texture, and any glasses
or distinguishing features. Do not alter the likeness — stylize only
the rendering technique.

WARDROBE (keep identical in every image): [describe one outfit
precisely — colour, cut, sleeve length, any accessory]
```

Write the wardrobe once and paste it verbatim every time. Changing
even one word produces a different jacket.

## Composition lock — every prompt

```
COMPOSITION: The subject sits right-of-center. The entire LEFT THIRD of
the frame must be uncluttered and simple — this is where interface text
will be placed.

16:9. No text, no lettering, no logos, no UI anywhere in the image.
```

---

# THE DAY CYCLE

Nine screens in one palette looks like a filter. Nine screens across a
day looks like art direction.

| Screen | Time | Palette |
|---|---|---|
| Hero | Magic hour | Orange → crimson → violet |
| About | Early morning | Pale gold, peach, mint |
| Skills | Storm afternoon | Grey-teal, slate, cold white |
| Projects | Bright midday | Turquoise, white, coral |
| Experience | Blue hour | Indigo, lilac, warm gold |
| Achievements | Deep night | Magenta, black, wet asphalt |
| Services | Clear midday | Cyan, coral, chrome |
| Contact | Late night | Near-black, cool blue |
| Outro | Sunrise | Rose, apricot, powder blue |

**Do the daylight ones first.** They're the hard ones. If your model
holds the style in bright light, everything else is downhill.

---

# TEMPLATE PROMPT

Assemble each of your nine like this:

```
[STYLE LOCK]

[CHARACTER LOCK — if a person appears]

SCENE: [what's happening, where, what time of day]

CRITICAL — DARK ANCHOR: [the dark element, if it's a bright scene]

PALETTE: [from the day cycle table]

COMPOSITION: [which third stays clear]

16:9. No text, no lettering, no logos, no UI anywhere.
```

---

# WHEN IT GOES WRONG

Don't start over. Correct it in the same thread.

| Problem | Say this |
|---|---|
| Went photoreal | `This came out photorealistic. Redo the same scene as a bold cel-shaded painted illustration — thick visible linework, flat blocked shading, high contrast. Not a render, not a photo.` |
| Went flat vector | `Too flat and graphic. Redo with painted volume and modelled form, cel-shaded with thick linework — not flat vector shapes.` |
| Went soft anime | `Too soft and gradient-heavy. Redo with hard-edged cel shading, banded colour steps and visible black outlines.` |
| Face drifted | `The face doesn't match the reference. Regenerate this exact scene and restore the face precisely — same jaw, same nose, same eye shape, same hair volume.` |
| Too dark | `Redo in bright daylight — high-key, sunlit, hard shadows. Remove all night lighting.` |
| Text appeared | `Remove all text and lettering. Keep the composition identical but leave those surfaces blank.` |
| Subject too centred | `Shift the subject right so the left third is completely clear. Keep everything else identical.` |
| Too busy | `Simplify the background significantly. Fewer objects, more atmospheric haze, more negative space.` |

**The strongest fix of all:** attach your best approved image alongside
the prompt and write:

```
Reference the attached image for linework weight, shadow depth and
colour blocking — match it exactly. Only the scene changes.
```

A concrete exemplar beats any amount of description.

---

# LOGOS AND BRANDING

If you want a logo on clothing or a sign — **generate the frame without
it.** Every AI attempt at your logo will be slightly different.

Instead:
1. Generate the surface plain
2. Composite your real logo in Photopea (free), Photoshop or Canva
3. Warp it slightly to follow the fabric or surface angle
4. Blend mode Screen or Linear Dodge, 85–95% opacity
5. Add a soft shadow on the light side

Ten minutes once, and it's pixel-identical across every frame.

---

# EXPORT

| Setting | Value |
|---|---|
| Resolution | 1920×1080 |
| Format | AVIF, quality 60–70 |
| Fallback | One JPG of the hero for older Safari |
| Keep | Full-res originals — you'll want them for social |

---

# QUALITY CHECK

Lay all nine out as a 3×3 grid and look at them together.

- [ ] Same person recognisable in every frame
- [ ] Same wardrobe throughout
- [ ] Same rendering style — no photoreal, no vector, no anime outliers
- [ ] Zero baked-in text
- [ ] Every frame's left third is genuinely clear
- [ ] The day cycle reads as deliberate, not random

If one image breaks the set, it's usually a bright one. Add a dark
anchor and regenerate that frame only.
