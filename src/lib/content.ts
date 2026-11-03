// The page's copy that repeats in lists: specs, FAQ, cards and the anatomy's parts.

export const specs: [string, [string, string][]][] = [
  ['Motor', [['Type', 'Rear hub, torque sensor'], ['Torque', '85 Nm'], ['Rated / peak power', '250 W / 600 W'], ['Assist', 'Up to 25 km/h, no throttle']]],
  ['Battery', [['Capacity', '540 Wh, removable with a key'], ['Charge', '0–80% in 2 h 30, full in 4 h'], ['Range', '40–110 km, by mode and hills'], ['Charger', '4 A, 1.1 kg']]],
  ['Ride', [['Drive', 'Chain, 8-speed'], ['Display', 'Speed, assist and battery on the bar'], ['Brakes', 'Hydraulic discs, 180 / 160 mm'], ['Tyres', '27.5 × 2.4" puncture-resistant']]],
  ['Frame', [['Frames', 'Step-through or crossbar, 6061 aluminium'], ['Weight', '23.5 kg with battery'], ['Max load', '140 kg; rear rack 25 kg'], ['Sizes', 'S 155–170 · M 168–182 · L 180–195 cm']]],
  ['Safety', [['Lights', 'Integrated, 60 lux front, brake light'], ['Lock', 'Motor lock and alarm from the app'], ['Tracking', 'GPS, two years included'], ['Warranty', '5 years frame, 2 years motor and battery']]],
];

// The licence answer follows CONTRAN Resolution 996/2023, art. 2: an electric bicycle has a motor of up to 1000 W
// rated, assists only while pedalling, stops assisting at 32 km/h, has no throttle, and is treated as a bicycle
// (read 2026-11-02 at urbes.com.br and aliancabike.org.br). L1 is 250 W rated and stops at 25 km/h.
export const faq: [string, string][] = [
  ['Do I need a licence or a plate?', 'No. L1’s motor is rated at 250 W, assists only while you pedal and stops at 25 km/h, with no throttle. Under CONTRAN’s rule for electric bicycles that makes it a bicycle: bike lanes, no licence, no plate.'],
  ['Can it really climb an 18% street?', 'Yes, seated. In Climb mode the motor gives up to 600 W while your legs give about 120 W, which holds 12 km/h on 18% with a 75 kg rider.'],
  ['How far does one charge go?', '40 km in Climb mode on a hilly route, up to 110 km in Eco on the flat. Try the range tool with your own weight and route.'],
  ['What does the R$ 300 reservation do?', 'It holds your frame and size in the first batch, delivered from March 2027 in Belo Horizonte. You pay the rest when your bike is ready, and you can cancel for a full refund until then.'],
  ['Where do I service it?', 'At home: a mechanic comes to you in Belo Horizonte, São Paulo and Florianópolis, and the first service at 500 km is free.'],
];

export const cards: { photo: string; title: string; text: string }[] = [
  { photo: 'card1', title: 'Battery out in one turn', text: 'Unlock it with the key, lift it out and charge it at your desk: 0–80% in 2 h 30 from a normal socket.' },
  { photo: 'card2', title: 'Climbs seated', text: 'Climb mode gives up to 600 W while your legs give about 120 W. You never have to stand on the pedals.' },
  { photo: 'card3', title: 'Step through, or swing over', text: 'Two frames, the same motor and battery. The step-through gets on in a skirt; the crossbar is stiffer on rough streets.' },
  { photo: 'card4', title: 'Takes a load', text: 'A rack rated for 25 kg and mounts for a child seat. The motor doesn’t notice the extra weight on a hill; you do less.' },
  { photo: 'card5', title: 'Beats traffic', text: 'Assist up to 25 km/h on the bike lane while the avenue waits at the light.' },
  { photo: 'card6', title: 'Service at your door', text: 'A mechanic comes to you in Belo Horizonte, and the first service at 500 km is free.' },
];

// Hotspots on the side photo, as % of its width and height, set on the retouched photo.
export const parts: { id: string; title: string; text: string; x: number; y: number }[] = [
  { id: 'motor', title: '85 Nm rear motor', text: 'A torque sensor reads your pedal force and the hub matches it. No throttle, no lurch at the lights.', x: 26.5, y: 63 },
  { id: 'battery', title: '540 Wh in the down tube', text: 'Removable with a key, 0–80% in 2 h 30. Good for 40 km in Climb mode on a hilly route.', x: 55.5, y: 48 },
  { id: 'gears', title: '8 gears', text: 'The motor does the hill; the gears keep your cadence easy from 5 to 25 km/h.', x: 31, y: 75 },
  { id: 'brakes', title: 'Hydraulic discs', text: '180 mm at the front, for the way back down a street that drops as fast as it climbed.', x: 75, y: 62 },
  { id: 'display', title: 'Display on the bar', text: 'Speed, assist level and battery at a glance. Five assist levels on a thumb switch.', x: 61.5, y: 24 },
  { id: 'lights', title: 'Lights that stay on', text: 'Headlight and brake light run from the main battery and switch on with the bike.', x: 70.7, y: 37.5 },
];
