// Cards, anatomy, range and specs: the small parts of the page that only toggle markup Astro already rendered.
import { commuteDays, gaugeMax, modes, range, routes, type Mode, type Route } from '../lib/model';
import { $, $$, phone, reduced } from './env';

// --- Cards: "+" opens the text; arrows page the row at 1440, swipe at 390. ---
for (const b of $$<HTMLButtonElement>('.card .plus')) {
  b.addEventListener('click', () => {
    const card = b.closest('.card')!, open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
  });
}
const row = $('[data-cards]'), prev = $<HTMLButtonElement>('[data-cards-prev]'), next = $<HTMLButtonElement>('[data-cards-next]');
const step = () => ($('.card', row) as HTMLElement).offsetWidth + 16;
prev.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
next.addEventListener('click', () => row.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
const arrows = () => {
  prev.disabled = row.scrollLeft < 8;
  next.disabled = row.scrollLeft > row.scrollWidth - row.clientWidth - 8;
};
row.addEventListener('scroll', arrows, { passive: true });
addEventListener('resize', arrows);
arrows();

// --- Anatomy: hotspot, list and keyboard all select a part. ---
const hots = $$<HTMLButtonElement>('[data-hot]'), items = $$<HTMLButtonElement>('[data-part]'), details = $$('[data-detail]');
const partIds = items.map((b) => b.dataset.part!);
let picked = false;
export function setPart(id: string, byUser = false) {
  if (byUser) picked = true;
  for (const b of hots) { b.classList.toggle('on', b.dataset.hot === id); b.setAttribute('aria-pressed', String(b.dataset.hot === id)); }
  for (const b of items) b.setAttribute('aria-pressed', String(b.dataset.part === id));
  for (const d of details) d.hidden = d.dataset.detail !== id;
  partChanged?.(id);
}
let partChanged: ((id: string) => void) | null = null;
export const onPart = (fn: (id: string) => void) => { partChanged = fn; };
// The tour walks the parts once, and stops for good as soon as the visitor picks one.
export const tourPart = (id: string) => { if (!picked) setPart(id); };
export const parts = partIds;
for (const b of [...hots, ...items]) b.addEventListener('click', () => setPart(b.dataset.hot ?? b.dataset.part!, true));
$('.part-list').addEventListener('keydown', (e) => {
  const k = (e as KeyboardEvent).key, i = items.indexOf(document.activeElement as HTMLButtonElement);
  if (i < 0 || !['ArrowDown', 'ArrowUp'].includes(k)) return;
  e.preventDefault();
  const j = (i + (k === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[j].focus();
  setPart(partIds[j], true);
});

// --- Range ---
const R = { mode: 'tour' as Mode, route: 'rolling' as Route, kg: 75 };
const km = $('[data-range-km]'), gauge = $('[data-gauge]'), note = $('[data-range-note]'), kg = $<HTMLInputElement>('[data-kg]');
let shown = range(R.mode, R.route, R.kg);
let animate: ((from: number, to: number, paint: (v: number) => void) => void) | null = null;
export const onRangeAnimate = (fn: typeof animate) => { animate = fn; };
function setRange() {
  for (const b of $$<HTMLButtonElement>('[data-seg="mode"] button')) b.setAttribute('aria-pressed', String(b.dataset.v === R.mode));
  for (const b of $$<HTMLButtonElement>('[data-seg="route"] button')) b.setAttribute('aria-pressed', String(b.dataset.v === R.route));
  $('[data-kg-out]').textContent = `${R.kg} kg`;
  const to = range(R.mode, R.route, R.kg);
  const paint = (v: number) => {
    km.innerHTML = `${Math.round(v)}<small>km</small>`;
    gauge.style.width = `${Math.min(100, (v / gaugeMax) * 100)}%`;
  };
  if (animate && !reduced) animate(shown, to, paint); else paint(to);
  shown = to;
  const days = commuteDays(to);
  note.textContent = `${modes[R.mode][0]} mode on a ${routes[R.route][0].toLowerCase()} route, ${R.kg} kg. An 8 km commute there and back: ${days} ${days === 1 ? 'day' : 'days'} per charge.`;
}
for (const b of $$<HTMLButtonElement>('[data-seg="mode"] button')) b.addEventListener('click', () => { R.mode = b.dataset.v as Mode; setRange(); });
for (const b of $$<HTMLButtonElement>('[data-seg="route"] button')) b.addEventListener('click', () => { R.route = b.dataset.v as Route; setRange(); });
kg.addEventListener('input', () => { R.kg = Number(kg.value); setRange(); });
setRange();

// --- Specs: open at 1440; accordions at 390 with the first two open. ---
if (phone()) for (const d of $$<HTMLDetailsElement>('.spec-g')) if (!d.hasAttribute('data-keep-open')) d.open = false;

// --- The footer name spans the full width at its real proportions: fit the viewBox to the set text. ---
const mark = $<SVGSVGElement>('[data-wordmark]');
document.fonts.ready.then(() => {
  const b = (mark.querySelector('text') as SVGTextElement).getBBox();
  mark.setAttribute('viewBox', `${b.x} ${b.y + b.height * 0.2} ${b.width} ${b.height * 0.66}`);
});
