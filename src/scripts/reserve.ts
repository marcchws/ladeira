// The reservation configurator and the newsletter. Both are mocked in the browser: nothing is sent anywhere.
import { bike, brl, extras, frames, isEmail, reserveDelay, sizeFor, type Frame } from '../lib/model';
import { iconPaths } from '../lib/icons';
import { $, $$, reduced, startState } from './env';

const icon = (n: keyof typeof iconPaths) => `<svg class="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[n]}</svg>`;

type State = 'idle' | 'busy' | 'done' | 'failed';
const C = { frame: 'crossbar' as Frame, height: 174, size: 'M', extras: new Set<string>(), state: 'idle' as State };

const root = $('[data-config]');
const form = $<HTMLFormElement>('[data-view="form"]', root);
const views = { form, done: $('[data-view="done"]', root), failed: $('[data-view="failed"]', root) };
const stages = $$<HTMLImageElement>('[data-stage]', root);
const heightIn = $<HTMLInputElement>('[data-height]', root);
const reserveBtn = $<HTMLButtonElement>('[data-reserve]', root);

let crossfade: ((on: HTMLImageElement, off: HTMLImageElement) => void) | null = null;
export const onCrossfade = (fn: typeof crossfade) => { crossfade = fn; };

function showFrame(animate: boolean) {
  const on = stages.find((i) => i.dataset.stage === C.frame)!, off = stages.find((i) => i.dataset.stage !== C.frame)!;
  const f = frames[C.frame];
  on.alt = `Ladeira L1, ${f.name.toLowerCase()} frame in ${f.paint}`;
  off.alt = '';
  if (animate && crossfade && !reduced) crossfade(on, off);
  else { on.style.opacity = '1'; off.style.opacity = '0'; }
}

function render() {
  const f = frames[C.frame];
  const chosen = extras.filter((e) => C.extras.has(e.id));
  const extrasTotal = chosen.reduce((t, e) => t + e.price, 0), total = bike.price + extrasTotal;
  $('[data-config-cap]', root).textContent = `${f.name} · ${f.paint} · size ${C.size}`;
  $('[data-config-price]', root).textContent = brl(total);
  for (const b of $$<HTMLButtonElement>('[data-frame]', root)) b.setAttribute('aria-pressed', String(b.dataset.frame === C.frame));
  for (const b of $$<HTMLButtonElement>('[data-size] button', root)) b.setAttribute('aria-pressed', String(b.dataset.v === C.size));
  $('[data-height-out]', root).textContent = `${C.height} cm`;

  const fit = sizeFor(C.height), hint = $('[data-hint]', root);
  hint.classList.toggle('out', !fit);
  hint.innerHTML = fit
    ? `At ${C.height} cm we suggest ${fit}.${C.size !== fit ? ` You picked ${C.size}.` : ''}`
    : `${icon('alert')}<span>Outside our sizes. Write to us and we'll find a fit.</span>`;

  const er = $('[data-extras-row]', root);
  er.hidden = !extrasTotal;
  $('[data-extras-total]', root).textContent = brl(extrasTotal);
  $('[data-total]', root).textContent = brl(total);

  const busy = C.state === 'busy';
  reserveBtn.disabled = busy || !fit;
  reserveBtn.setAttribute('aria-busy', String(busy));
  $('[data-reserve-label]', root).innerHTML = busy ? '<span class="spin" aria-hidden="true"></span>Reserving…' : `Reserve for ${brl(bike.deposit)}`;

  const view = C.state === 'done' ? 'done' : C.state === 'failed' ? 'failed' : 'form';
  for (const [k, el] of Object.entries(views)) el.hidden = k !== view;
  if (view === 'done') {
    $('[data-done-summary]', root).textContent = `Ladeira L1, ${f.name.toLowerCase()} in ${f.paint}, size ${C.size}${chosen.length ? ', with ' + chosen.map((e) => e.name.toLowerCase()).join(', ') : ''}. We charged ${brl(bike.deposit)} and sent the details to your email.`;
  }
}

function setState(s: State, focus = true) {
  C.state = s;
  render();
  if (focus && (s === 'done' || s === 'failed')) $<HTMLElement>(`[data-view="${s}"] h3`, root).focus({ preventScroll: true });
}

// The mock fails only when the page was opened with ?state=failed, so the failed state can be seen and retried.
let failNext = startState === 'failed';
function reserve() {
  if (C.state === 'busy') return;
  setState('busy');
  setTimeout(() => {
    const fail = failNext;
    failNext = false;
    setState(fail ? 'failed' : 'done');
  }, reserveDelay);
}

for (const b of $$<HTMLButtonElement>('[data-frame]', root)) b.addEventListener('click', () => {
  if (C.frame === b.dataset.frame) return;
  C.frame = b.dataset.frame as Frame;
  showFrame(true);
  render();
});
heightIn.addEventListener('input', () => {
  C.height = Number(heightIn.value);
  C.size = sizeFor(C.height) ?? C.size;
  render();
});
for (const b of $$<HTMLButtonElement>('[data-size] button', root)) b.addEventListener('click', () => { C.size = b.dataset.v!; render(); });
for (const x of $$<HTMLInputElement>('[data-extra]', root)) x.addEventListener('change', () => {
  if (x.checked) C.extras.add(x.dataset.extra!); else C.extras.delete(x.dataset.extra!);
  render();
});
form.addEventListener('submit', (e) => { e.preventDefault(); reserve(); });
$('[data-retry]', root).addEventListener('click', reserve);
$('[data-back]', root).addEventListener('click', () => { setState('idle'); $<HTMLButtonElement>('[data-frame]', root).focus(); });
$('[data-again]', root).addEventListener('click', () => { setState('idle'); $<HTMLButtonElement>('[data-frame]', root).focus(); });

showFrame(false);
setState(startState, false);
if (startState === 'failed') failNext = false; // Try again from the opened failed state succeeds

// --- Newsletter ---
const news = $<HTMLFormElement>('[data-news]'), email = $<HTMLInputElement>('input', news), msg = $('[data-news-msg]', news);
news.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = isEmail(email.value);
  news.dataset.state = ok ? 'sent' : 'invalid';
  email.setAttribute('aria-invalid', String(!ok));
  msg.innerHTML = `${icon(ok ? 'check' : 'alert')}<span>${ok ? "You're on the list. One email a month, no more." : "That doesn't look like an email address. Check it and try again."}</span>`;
  if (!ok) email.focus();
});
