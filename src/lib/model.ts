// Ladeira L1's data and the three small models the page runs on: the climb, the range and the size rule.
// Every number is invented, and they agree with each other.

export const bike = {
  name: 'Ladeira L1',
  price: 14900, // BRL
  deposit: 300, // BRL, refundable
  firstDeliveries: 'March 2027',
  city: 'Belo Horizonte',
  battery: 540, // Wh
  weight: 23.5, // kg, with the battery in
  riderWatts: 120, // W a commuter holds without breaking a sweat
  motorPeak: 600, // W
  maxAssist: 25, // km/h
};

export const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

// --- The climb: Rua do Morro Alto, an invented street, as segments of [length m, grade]. ---
export const street = {
  name: 'Rua do Morro Alto',
  segments: [[100, 0.04], [150, 0.1], [130, 0.18], [120, 0.12], [100, 0.06]] as [number, number][],
};

export const profile: [number, number][] = (() => {
  const pts: [number, number][] = [[0, 0]];
  let d = 0, e = 0;
  for (const [len, g] of street.segments) { d += len; e += len * g; pts.push([d, e]); }
  return pts;
})();

export const length = profile[profile.length - 1][0]; // 600 m
export const rise = profile[profile.length - 1][1]; // 63 m

export function gradeAt(d: number) {
  let acc = 0;
  for (const [len, g] of street.segments) { acc += len; if (d <= acc) return g; }
  return street.segments[street.segments.length - 1][1];
}

export function elevationAt(d: number) {
  for (let i = 1; i < profile.length; i++) {
    if (d <= profile[i][0]) {
      const [d0, e0] = profile[i - 1], [d1, e1] = profile[i];
      return e0 + (e1 - e0) * (d - d0) / (d1 - d0);
    }
  }
  return rise;
}

export const climbSpeed = 12; // km/h
export const riderKg = 75;

// Power to hold 12 km/h up a grade: gravity plus rolling resistance (Crr 0.006). Air drag is small at that speed
// and left out. The legs give up to riderWatts and the motor the rest, up to its peak.
export function climb(d: number, kg = riderKg) {
  const g = gradeAt(d), m = kg + bike.weight, v = climbSpeed / 3.6; // m/s
  const need = m * 9.81 * v * (g + 0.006);
  const motor = Math.min(bike.motorPeak, Math.max(0, need - bike.riderWatts));
  return { grade: g, need: Math.round(need), motor: Math.round(motor), legs: Math.round(need - motor), elevation: elevationAt(d) };
}

// --- Range: battery over use. Wh/km by mode, times a route factor, times load. ---
// The Wh/km are set so the model gives the page's own claims at 75 kg: 110 km in Eco on the flat and
// 40 km in Climb on steep streets, the two ends of the specs' "40–110 km".
export const modes = { eco: ['Eco', 4.9], tour: ['Tour', 6.2], climb: ['Climb', 7.7] } as const;
export const routes = { flat: ['Flat', 1], rolling: ['Rolling', 1.3], steep: ['Steep', 1.75] } as const;
export type Mode = keyof typeof modes;
export type Route = keyof typeof routes;
export const gaugeMax = 140; // km, the gauge's end: Eco on the flat at the lightest 50 kg gives 141

export function range(mode: Mode, route: Route, kg: number) {
  const whPerKm = modes[mode][1] * routes[route][1] * Math.pow(kg / 75, 0.6);
  return Math.round(bike.battery / whPerKm);
}

export const commuteKm = 16; // an 8 km commute, there and back
export const commuteDays = (km: number) => Math.floor(km / commuteKm);

// --- Sizes. They overlap on purpose: the suggestion picks the size whose middle is closest. ---
export const sizes: [string, number, number][] = [['S', 155, 170], ['M', 168, 182], ['L', 180, 195]];
export const heightMin = 150, heightMax = 200; // cm, the slider's ends

export function sizeFor(h: number): string | null {
  if (h < 155 || h > 195) return null;
  return h <= 168 ? 'S' : h <= 181 ? 'M' : 'L';
}

// --- The configurator ---
export const frames = {
  crossbar: { name: 'Crossbar', paint: 'Graphite', why: 'Stiffer on rough streets' },
  step: { name: 'Step-through', paint: 'Fog', why: 'Get on without lifting a leg' },
} as const;
export type Frame = keyof typeof frames;

export const extras = [
  { id: 'bag', name: 'Rack bag, 22 L', price: 390, icon: 'rack' },
  { id: 'seat', name: 'Child seat, rear', price: 690, icon: 'seat' },
  { id: 'lock', name: 'Folding lock', price: 340, icon: 'lock' },
  { id: 'charger', name: 'Second charger', price: 450, icon: 'charge' },
] as const;

export const reservationCode = 'LD-0412';
export const reserveDelay = 1200; // ms the mocked payment takes

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
