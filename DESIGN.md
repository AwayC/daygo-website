# Daygo · Chronolight design system

> **One scroll = one day.** The site turns Daygo's core idea ("discrete frames → AI organizes them → a continuous timeline") into a visual language.
> This doc doubles as the reference for the upcoming app redesign: the tokens live in `src/styles.css` `:root`.

## 1. Concept

| Motif | Meaning | Where it shows up |
|---|---|---|
| **Frame** | One discrete screenshot | Hero particles, cursor viewfinder brackets, the screen-wide shutter flash on capture, every thumbnail |
| **Ribbon** | Frames woven into a timeline | Hero WebGL ribbon, timeline color bars, the visit timeline |
| **Sun** | The day itself; slices = frames | Logo (sun cut into slices + horizon), the WebGL sun, time-of-day sky colors |

The page goes **05:30 dawn → 12:00 noon (light) → 18:40 dusk → 23:30 midnight**. The top HUD clock advances with scroll, and at the end every frame of the day becomes a star.

## 2. Color

**Neutrals**: `ink #08080B` · `ink-2 #111116` · `bone #F3EFE7` · `bone-2 #E9E3D7`

**Day spectrum = category colors** (one palette for both the brand and the data):

| Token | Value | Category |
|---|---|---|
| `--tide` | `#3ED6B5` | Build / coding |
| `--amber` | `#FFB03B` | Meetings |
| `--dusk` | `#8C7CFF` | Research |
| `--dawn` | `#FF5B36` | Comms (also the brand accent / REC) |
| `--rose` | `#FF8FB8` | Design |
| `--ash` | `#8E8C99` | System (excluded from totals) |

Light/dark themes switch via `[data-theme]`, and the semantic variables stay the same: `--fg / --fg-2 / --fg-3 / --line / --surface`.

## 3. Type

- **Chinese display**: Noto Serif SC 600, tracking −0.035 to −0.055em, line-height ≈ 1.0
- **English accent**: Instrument Serif *Italic* (one short English phrase per heading, e.g. *at a glance.*)
- **UI / body**: Geist + Noto Sans SC
- **Data / time / labels**: Geist Mono 11–12px, uppercase with +0.08em letter-spacing

## 4. Components (map directly to the app)

- **Timeline band**: rounded-rectangle color blocks + subtle vertical frame texture; selected = solid ink outline; deleted = hatched + dashed outline
- **Card**: 4px category color bar on top or a 3px bar on the left; mono time range; serif title; editable
- **Chip**: 999px pill; selected = solid fg fill
- **Glass panel**: `--surface` + `backdrop-filter: blur(16–20px)` + 1px `--line`
- **Screenshot thumbnail**: `src/screens.js` generates abstract UI skeletons procedurally (code / browser / chat / doc / design / meeting / terminal); blocked apps = 45° hatching + "已屏蔽" (Blocked) label

## 5. Motion

- Easing: `expo.out` (`cubic-bezier(.16,1,.3,1)`) for entrances; `expo.inOut` for state changes
- Headings reveal line by line from below; body copy lights up character by character as you read
- Every capture: REC dot pulses + viewport-corner shutter flash + particle disturbance
- `prefers-reduced-motion`: animations shut off and the hero is no longer pinned

## 6. Files

```
index.html          structure and copy
src/styles.css      tokens + all styles
src/gl.js           WebGL: time-of-day sky shader + frame particles (scatter → ribbon → stars)
src/main.js         Lenis scroll, time-of-day mapping, HUD, loader, cursor, reveals
src/sections.js     section interactions (capture demo, timeline editing/reprocessing, sundial, vault, fallback chain, menu bar…)
src/screens.js      procedural screenshot SVGs
```

```bash
npm run dev     # http://127.0.0.1:5180
npm run build   # outputs dist/, deployable to any static host
```
