# Ladeira

The launch site of **Ladeira L1**, a city e-bike for Brazilian cities built on hills, launched first in Belo Horizonte. One long page sells the bike and takes a refundable R$ 300 reservation through a configurator.

Live: [ladeira.pages.dev](https://ladeira.pages.dev)

**Ladeira is invented.** The brand, the bike, its prices, its delivery dates and Rua do Morro Alto, the street the page climbs, are all made up for a portfolio. The reservation and the newsletter are mocked in the browser: nothing is charged, stored or sent.

## What's on the page

- **The climb.** Rua do Morro Alto is 600 m long and rises 63 m, at grades of 4, 10, 18, 12 and 6%. Scroll (or the slider) rides it, and the readout splits the work between your legs and the motor: the power to hold 12 km/h is gravity plus rolling resistance (Crr 0.006) for a 75 kg rider on the 23.5 kg bike. The legs hold about 120 W and the motor gives the rest, up to 600 W. The height is drawn 2.7 times its scale, and the sheet says so.
- **Range.** Mode, route and weight give km per charge: 540 Wh over 4.9, 6.2 or 7.7 Wh/km (Eco, Tour, Climb), times 1, 1.3 or 1.75 for the route, times (kg / 75)^0.6. That gives the page's own claims at 75 kg: 110 km in Eco on the flat, 40 km in Climb on steep streets.
- **The configurator.** Two frames (Crossbar in Graphite, Step-through in Fog), a size suggested from your height, four extras, and the states of a reservation: idle, reserving, done, and a failed payment that keeps your choices.
- **Motion.** GSAP with ScrollTrigger and SplitText: the hero settles, the statement lights word by word, the climb is pinned to scroll, headings rise out of a mask. With `prefers-reduced-motion: reduce` none of it runs and the page reads the same.

The licence answer in the FAQ follows CONTRAN Resolution 996/2023, which treats an e-bike as a bicycle when its motor is rated at up to 1000 W, assists only while pedalling and stops at 32 km/h, with no throttle.

## Photos

The product photos are [KBO Bike](https://unsplash.com/@kbobike)'s free series on Unsplash, used under the [Unsplash License](https://unsplash.com/license). The KBO logo is retouched out of every photo, and Ladeira presents their bikes as its own two frames. KBO Bike has nothing to do with this project.

## Run it

Needs Node 22.23 or later (`.node-version` pins 24 for Cloudflare Pages).

```sh
npm install
npm run dev        # http://localhost:4321
npm test           # the climb, range and size models (Vitest)
npm run build      # type check and static build into dist/
npm run test:e2e   # every state at 1440 and 390, with axe (Playwright, on the build)
```

Some states can be opened straight from the address: `?motion=reduced` shows the reduced-motion version, and `?state=busy`, `?state=done` or `?state=failed` opens the reservation in that state.

## Stack

- [Astro](https://astro.build) with TypeScript, static output. The interactive parts (climb, anatomy, range, configurator) are plain TypeScript modules over markup Astro renders.
- [GSAP](https://gsap.com) 3.13 with ScrollTrigger and SplitText.
- Red Hat Display and Red Hat Mono, self-hosted through Fontsource (SIL Open Font License).
- Images built to responsive WebP by Astro's `<Image>` from the retouched originals in `src/assets/photos`.
- Hosted on Cloudflare Pages.

## Layout

```
src/
  lib/          data, the three models and their tests, icons, the climb drawing
  components/   the sections that need their own file, the icon, symbol and scenes
  scripts/      climb, cards, anatomy, range, configurator, newsletter, motion
  pages/        the launch page and the 404
  styles/       the one stylesheet
tests/          Playwright states
```
