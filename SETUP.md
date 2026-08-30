# SETUP GUIDE
### Get your portfolio live in about 30 minutes.

---

## What you bought

A portfolio that works like a game pause menu. Tab-driven navigation,
a persistent live HUD, and nine full-screen art plates that each
recolour the entire interface to match.

**Everything you need to change lives in one file:** `src/config/site.config.js`

You will not need to open any other file to launch.

---

## STEP 1 — Run it (5 min)

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open **http://localhost:4321**

You'll see the site running with colour-gradient placeholders instead
of art. That's intentional — it means you can set up all your text
before you have a single image.

---

## STEP 2 — Make it yours (15 min)

Open `src/config/site.config.js`. Work top to bottom.

### Your name and identity

```js
export const SITE = {
  titleLine1: 'YOUR',
  titleLine2: 'NAME',
  subtitle: 'Portfolio',
  ...
};
```

The title is two lines because that's what makes the big display type
work. If you have a one-word name, use your name and your role:

```js
titleLine1: 'MAYA',
titleLine2: 'BUILDS',
```

### Your content

Scroll down to `ABOUT`, `SKILLS`, `PROJECTS`, `EXPERIENCE`,
`ACHIEVEMENTS`, `SERVICES`, `CONTACT`. Each is a plain object. Change
the strings.

Save the file and the browser updates instantly.

### Icons

Copy any of these into an `icon:` field:

```
◆  ◉  ✦  ▲  ●  ◇  ★  ⚡  ✈  ◷  ⬢  ◈  ▣  ✧
```

---

## STEP 3 — Add your art (10 min)

### If you're generating images with AI

Read **PROMPTS.md** — it has the complete system, including the
technique that stops nine images looking like nine different artists.
That guide is the hard-won part; don't skip it.

### If you have your own photos or illustrations

Even better. Nine images, 1920×1080, named:

```
01-hero.avif        06-achievements.avif
02-about.avif       07-services.avif
03-skills.avif      08-contact.avif
04-projects.avif    09-outro.avif
05-experience.avif
```

Drop them in `public/frames/`.

### ⚠️ The one rule that matters

**Each image must have empty space on the left third.**

That's where your text sits. An image with the subject dead-centre
will fight your content. Compose with the subject right-of-centre and
leave the left clear.

The layout zones:

```
┌─────────────────┬───────────────────────────┬──────────┐
│  TITLE          │                           │   HUD    │
│                 │                           │          │
│  YOUR CONTENT   │      KEEP SUBJECT HERE    │          │
│                 │                           │          │
│  MINIMAP  OBJ   │                           │   QUOTE  │
└─────────────────┴───────────────────────────┴──────────┘
```

### Using JPG or PNG instead

Fine. Just update the extensions in `site.config.js`:

```js
frame: '/frames/01-hero.jpg',
```

---

## STEP 4 — Match your colours (5 min)

**This is the step that makes it look expensive. Don't skip it.**

Each screen has an `accent` and `accent2`. The HUD, minimap dot, menu
highlight, skill bars, buttons and script subtitles all inherit them.

Open one of your images. Eyedropper two colours:

- **accent** — the brightest, most saturated colour in the image
- **accent2** — a warm highlight, usually from the light source

```js
{
  id: 'skills',
  accent: '#7fb2d9',    // cold blue from the monitor glow
  accent2: '#ffb238',   // warm desk lamp
}
```

Then update the matching line in `src/styles/global.css` (around line 44):

```css
[data-screen="skills"] { --accent: #7fb2d9; --accent-2: #ffb238; }
```

> **Why two places?** The config drives the JavaScript; the CSS drives
> the paint. Keeping them in sync takes ten seconds per screen and is
> the difference between "nice template" and "did they design this?"

### The gradient fallbacks

Each screen also has `fallback: ['#hex', '#hex', '#hex']` — sky,
middle, horizon. These show if an image is missing. Set them roughly
to your image's palette and a slow connection still looks intentional.

---

## STEP 5 — Deploy (5 min)

```bash
npm run build
```

Output lands in `dist/`. It's a static site — host it anywhere.

**Netlify or Vercel:** push to GitHub, connect the repo, done.
Build command `npm run build`, publish directory `dist`.

**Before you deploy,** change the domain in `astro.config.mjs`:

```js
site: 'https://yoursite.com',
```

That's what makes your link previews work on social.

---

## OPTIONAL — Video loops

Want a screen to breathe? Drop a short loop in `public/loops/` and
change its plate in `src/pages/index.astro`:

```astro
<div class="plate" data-id="hero">
  <video autoplay muted loop playsinline preload="none"
         poster="/frames/01-hero.avif">
    <source src="/loops/01-hero.webm" type="video/webm">
    <source src="/loops/01-hero.mp4" type="video/mp4">
  </video>
</div>
```

The state machine already pauses hidden videos automatically.

**Animate 3–4 screens at most.** A site where everything moves feels
like a screensaver. A site where four things breathe and five hold
still feels art-directed.

`preload="none"` is not optional — without it every loop downloads on
page load.

---

## CUSTOMISING FURTHER

### Change the section names

In `site.config.js`, change any screen's `id` and `label`, rename the
matching file in `src/components/screens/`, update its import in
`src/pages/index.astro`, and add a `[data-screen="newid"]` line in
`global.css`.

### Add a tenth screen

Same process — append to the `SCREENS` array, create the component,
import it. The menu, HUD, minimap and progression all pick it up
automatically.

### Turn off the game mechanics

```js
export const SETTINGS = {
  progressionEnabled: false,   // no stars, no ticks, no toasts
  saveProgress: false,         // don't remember between visits
  showKeyHints: false          // hide the keyboard bar
};
```

### Tune the splash screen

```js
splashDuration: 2.2   // seconds. Set to 0.1 to effectively skip it.
```

---

## TROUBLESHOOTING

**My images don't show**
Filenames must match `site.config.js` exactly, including extension.
Check `public/frames/`, not `src/`.

**Text is hard to read on a bright image**
The scrims handle most cases. If one image is still too bright,
darken its left third in any editor before exporting.

**The layout looks cramped**
It's locked to 16:9. On a very wide or very tall window you'll see
letterboxing — that's intended, it keeps the composition intact.

**Colours don't change between screens**
You updated `site.config.js` but not `global.css`. Both need the
accent values. See Step 4.

**Skill bars don't animate**
The screen id must be exactly `skills` — that's what the animation
hooks onto.

---

## WHAT'S IN THE BOX

```
src/config/site.config.js   ← the only file you need to edit
src/components/screens/     ← one file per screen
src/scripts/app.js          ← state machine (don't edit)
src/styles/global.css       ← design system
public/frames/              ← your images go here
public/loops/               ← optional video loops
PROMPTS.md                  ← the AI art system
SETUP.md                    ← this file
```

---

## LICENCE

Use it for your own portfolio or for client work. Modify it freely.

Don't resell or redistribute the template itself.

---

*Inspired by arcade and console pause-menu interfaces. Not affiliated
with, endorsed by, or connected to any game or publisher.*
