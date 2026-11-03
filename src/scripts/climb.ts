import { climb, length, street } from '../lib/model';
import { px, py, riderAngle } from '../lib/climb-drawing';
import { $, $$, phone } from './env';

const root = $('[data-climb]');
const rider = $('[data-rider]', root);
const done = $<SVGPathElement>('[data-done]', root);
const labels = $$('[data-seg-i]', root);
const scrub = $<HTMLInputElement>('[data-scrub]', root);
const scrubOut = $('[data-scrub-out]', root);
const h = (k: string) => $(`[data-h="${k}"]`, root);
const total = done.getTotalLength();
done.style.strokeDasharray = String(total);

let last = -1;
export function setClimb(d: number) {
  d = Math.max(0, Math.min(length, d));
  if (Math.abs(d - last) < 0.05) return;
  last = d;
  const c = climb(d);
  // The drawing shrinks to a third at 390, so the rider grows to stay readable.
  const k = phone() ? 1.8 : 1;
  rider.setAttribute('transform', `translate(${px(d).toFixed(1)} ${py(c.elevation).toFixed(1)}) rotate(${riderAngle(c.grade).toFixed(1)}) scale(${k})`);
  done.style.strokeDashoffset = String(total * (1 - d / length));
  let acc = 0;
  street.segments.forEach(([len], i) => {
    labels[i].classList.toggle('on', (d > acc && d <= acc + len) || (d === 0 && i === 0));
    acc += len;
  });
  const legsPct = (c.legs / c.need) * 100;
  h('grade').textContent = `${Math.round(c.grade * 100)}%`;
  h('dist').textContent = `${Math.round(d)} m`;
  h('up').textContent = `+${c.elevation.toFixed(0)} m`;
  h('legs').textContent = `${c.legs} W`;
  h('legs-bar').style.width = `${legsPct}%`;
  h('motor-bar').style.width = `${100 - legsPct}%`;
  h('legs-key').textContent = `${c.legs} W`;
  h('motor-key').textContent = `${c.motor} W`;
  scrub.value = String(Math.round(d / 5) * 5);
  scrubOut.textContent = `${Math.round(d)} m`;
}

// The slider rides the street directly, or moves the page when the section is pinned to scroll.
let toScroll: ((d: number) => boolean) | null = null;
export const onScrub = (fn: typeof toScroll) => { toScroll = fn; };
scrub.addEventListener('input', () => {
  const d = Number(scrub.value);
  if (!toScroll?.(d)) setClimb(d);
});

setClimb(0);
