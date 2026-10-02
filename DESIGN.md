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

**Sky spectrum = category colors** (every color is sampled from the sky at some hour of the day, so it sits in harmony with the background glow):

| Token | Value | Source in the sky | Category |
|---|---|---|---|
| `--sky` | `#5FA8FF` | Daylight blue | Build / coding |
| `--amber` | `#FFB547` | Sun amber | Meetings |
| `--dusk` | `#9B8CFF` | Dusk lavender | Research |
| `--dawn` | `#FF7A59` | Sunrise coral (also the brand accent / REC) | Comms |
| `--rose` | `#E58BD0` | Twilight orchid | Design |
| `--ash` | `#8E8C99` | — | System (excluded from totals) |

Light/dark themes switch via `[data-theme]`, and the semantic variables stay the same: `--fg / --fg-2 / --fg-3 / --line / --surface`.

## 3. Type

- **Chinese display**: Noto Serif SC 600, tracking −0.035 to −0.055em, line-height ≈ 1.0
- **English accent**: Instrument Serif *Italic* (one short English phrase per heading, e.g. *at a glance.*)
- **UI / body**: Geist + Noto Sans SC
- **Data / time / labels**: Geist Mono 11–12px, uppercase with +0.08em letter-spacing

## 4. Liquid glass material

- One primitive, `.lg`: low-opacity tint + `backdrop-filter: blur(26px) saturate(170%)` + a 1px semi-transparent edge + a top inner highlight
- **Lit by the sky**: `main.js` writes the current sun color / horizon color into `--glow` / `--hor` every frame. The glass rim light (`::after` gradient ring) and the outer glow change with the time of day: warm white at noon, orange at dusk
- At most one layer: panels inside a window use `--lg-dense` (opaque-ish, no blur) to avoid stacking glass on glass
- Mobile turns off backdrop blur and raises opacity; `forced-colors` falls back to system colors

## 5. Components (map directly to the app)

- **App window**: traffic lights + center segmented control (时间线 / 回顾, Timeline / Review) + date capsule; 208px sidebar (navigation + today's category durations + recording status)
- **Vertical timeline**: time column + rail + glowing category dots + tinted cards (`color-mix` 16%); the expanded card shows the frame strip

- **Timeline band**: rounded-rectangle color blocks + subtle vertical frame texture; selected = solid ink outline; deleted = hatched + dashed outline
- **Card**: 4px category color bar on top or a 3px bar on the left; mono time range; serif title; editable
- **Chip**: 999px pill; selected = solid fg fill
- **Glass panel**: `--surface` + `backdrop-filter: blur(16–20px)` + 1px `--line`
- **Screenshot thumbnail**: `src/screens.js` draws real-looking work screens (editor with code, terminal, docs site, chat, document, design tool, meeting, lock screen); blocked apps = 45° hatching + "已屏蔽" (Blocked) label

## 6. Motion

- Easing: `expo.out` (`cubic-bezier(.16,1,.3,1)`) for entrances; `expo.inOut` for state changes
- Headings reveal line by line from below; body copy lights up character by character as you read
- Every capture: REC dot pulses + viewport-corner shutter flash + particle disturbance
- `prefers-reduced-motion`: animations shut off and the hero is no longer pinned

## 7. Files

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
