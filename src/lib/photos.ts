// KBO Bike's photos on Unsplash (Unsplash License, read 2026-11-02), with the KBO logo retouched out.
// Keys are the place each photo takes on the page; the Unsplash photo id is kept beside it for the credit.
import hero from '../assets/photos/hero.jpg';
import perf from '../assets/photos/perf.jpg';
import side from '../assets/photos/side.jpg';
import step from '../assets/photos/step.jpg';
import life from '../assets/photos/life.jpg';
import specs from '../assets/photos/specs.jpg';
import cta from '../assets/photos/cta.jpg';
import card1 from '../assets/photos/card1.jpg';
import card2 from '../assets/photos/card2.jpg';
import card3 from '../assets/photos/card3.jpg';
import card4 from '../assets/photos/card4.jpg';
import card5 from '../assets/photos/card5.jpg';
import card6 from '../assets/photos/card6.jpg';

export const photos = {
  hero: { src: hero, id: '1635816047399-76858585e45d', alt: 'Ladeira L1, crossbar frame in Graphite, standing on a gravel hilltop at sunset' },
  perf: { src: perf, id: '1635816279318-562ce14fde7b', alt: 'A rider climbs a dusty hill on Ladeira L1 against the low sun' },
  side: { src: side, id: '1636512956594-b717994705ae', alt: 'Ladeira L1 crossbar frame from the side, on grass' },
  step: { src: step, id: '1621394445346-c7b502f07206', alt: 'Ladeira L1, step-through frame in Fog, parked by a bench over the sea' },
  life: { src: life, id: '1638157527959-a374fcf0040e', alt: 'A woman rides Ladeira L1, step-through frame in Fog, across a sunny street' },
  specs: { src: specs, id: '1635816015419-98a328dc0a87', alt: 'A rider on Ladeira L1 kicks up dust on a hill road at sunset' },
  cta: { src: cta, id: '1638754886376-2d41f7e75d27', alt: 'A rider walks Ladeira L1, step-through frame, up a ramp above the beach at sunset' },
  card1: { src: card1, id: '1636945265811-1b99a940e762', alt: 'A hand unlocks the battery from the down tube' },
  card2: { src: card2, id: '1635816048695-51dc43a7b24c', alt: 'A rider climbs a dirt trail seated' },
  card3: { src: card3, id: '1637543340955-a275827870ed', alt: 'The step-through frame parked in front of a white building' },
  card4: { src: card4, id: '1636512957897-f3c28ba56e9f', alt: 'Close-up of the crossbar frame and the headlight' },
  card5: { src: card5, id: '1636945254054-e951648b0ec2', alt: 'A rider on the step-through frame on a city street' },
  card6: { src: card6, id: '1636945253418-c5607b8c9848', alt: 'The crossbar frame parked on a kerb, its rider sitting beside it' },
};

export type PhotoKey = keyof typeof photos;
