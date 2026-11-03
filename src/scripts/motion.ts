// Every motion on the page. Under reduced motion none of it runs: headings and numbers are in place, the climb
// shows a fixed point with its slider still working, and the configurator swaps photos without a fade.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { length } from '../lib/model';
import { setClimb, onScrub } from './climb';
import { onPart, onRangeAnimate, parts, tourPart } from './parts';
import { onCrossfade } from './reserve';
import { $, $$, reduced } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Splitting text and measuring triggers is most of the page's start-up cost on a phone. Only the hero's entrance
// runs at once; everything else waits for the page to load and paint, and each section's motion is then built
// when the section comes within a screen and a half of the viewport.
const near = (el: Element, build: () => void) => {
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    idle(build); // each section in its own task, so no single task blocks input for long
  }, { rootMargin: '150% 0px 150% 0px' });
  io.observe(el);
};
const idle = (fn: () => void) => { if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1200 }); else setTimeout(fn, 1); };
const afterLoad = (fn: () => void) => (document.readyState === 'complete' ? idle(fn) : addEventListener('load', () => idle(fn), { once: true }));

// Hero: the photo settles from a slow zoom, "L1" rises letter by letter, the intro fades in.
if (reduced) {
  setClimb(length * 0.62);
} else {
  gsap.from('[data-hero-photo] img', { scale: 1.18, duration: 2.2, ease: 'power3.out' });
  SplitText.create('[data-hero-model]', {
    // The visible "L1" is aria-hidden beside a screen-reader copy, so the split adds no labels of its own.
    type: 'chars', mask: 'chars', aria: 'none',
    onSplit: (s) => gsap.from(s.chars, { yPercent: 100, duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.3 }),
  });
  gsap.from('[data-hero-intro], [data-hero-reserve]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.9, ease: 'power2.out' });
}

afterLoad(() => {
  // The nav pill rises to the top once the announcement bar scrolls away; the buy bar shows from the statement
  // down to the reservation. Both run under reduced motion too: they are state, not decoration.
  const nav = $('[data-nav]'), buybar = $('[data-buybar]'), buyBtn = $('[data-buybar-btn]');
  ScrollTrigger.create({ start: 30, end: 'max', onToggle: (s) => nav.classList.toggle('stuck', s.isActive) });
  ScrollTrigger.create({
    trigger: '#statement', start: 'top 80%', endTrigger: '#reserve', end: 'top 80%',
    onToggle: (s) => { buybar.classList.toggle('show', s.isActive); buyBtn.tabIndex = s.isActive ? 0 : -1; },
  });
  if (!reduced) motion();
});

function motion() {
  // The photo drifts on scroll.
  gsap.to('[data-hero-photo] img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // The climb: pinned for 1,600 px of scroll, and scroll rides the street. The pin adds that height to the page,
  // so it is built first and every trigger below it is measured again after.
  {
    const ride = { d: 0 };
    const climbTween = gsap.to(ride, {
      d: length, ease: 'none', onUpdate: () => setClimb(ride.d),
      scrollTrigger: { trigger: '#climb', start: 'top top', end: '+=1600', pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    onScrub((d) => {
      const st = climbTween.scrollTrigger!;
      scrollTo({ top: st.start + (st.end - st.start) * (d / length), behavior: 'instant' });
      return true;
    });
  }

  // Statement: each word lights up as the paragraph scrolls through the middle of the screen.
  near($('[data-statement]'), () => SplitText.create('[data-statement]', {
    // A paragraph can't carry aria-label, and word spans read fine as they are.
    type: 'words', wordsClass: 'word', aria: 'none',
    onSplit: (s) => gsap.to(s.words, { color: '#F1F1EC', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '[data-statement]', start: 'top 75%', end: 'bottom 45%', scrub: true } }),
  }));

  // Section titles rise line by line out of a mask.
  for (const h of $$('[data-split]')) {
    near(h, () => SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }),
    }));
  }

  // Performance: the photo pushes in while the numbers count up once.
  near($('.perf'), () => {
    gsap.fromTo('.perf .photo img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.perf', start: 'top bottom', end: 'bottom top', scrub: true } });
    for (const b of $$('.perf-numbers b')) {
      const to = Number(b.dataset.to), unit = b.querySelector('small')!.outerHTML, o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 1.2, ease: 'power2.out',
        onUpdate: () => { b.innerHTML = (to % 1 ? o.v.toFixed(1) : Math.round(o.v)) + unit; },
        scrollTrigger: { trigger: '.perf', start: 'top 60%', once: true },
      });
    }
  });

  // Cards slide in from the right as a row.
  near($('[data-cards]'), () => gsap.from('.card', { x: 120, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '[data-cards]', start: 'top 80%', once: true } }));

  // Hotspots pop in, then walk the six parts once, back to the motor.
  near($('[data-anatomy]'), () => gsap.from('[data-hot]', {
    scale: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '[data-anatomy]', start: 'top 70%', once: true,
      onEnter: () => [...parts.slice(1), parts[0]].forEach((id, i) => gsap.delayedCall(0.6 + i * 0.5, () => tourPart(id))),
    },
  }));
  // The detail slides in without fading, so its text never drops under 4.5:1 while it moves.
  onPart((id) => gsap.from(`[data-detail="${id}"] > *`, { y: 12, duration: 0.4, stagger: 0.05, ease: 'power2.out' }));

  // Photos open from a clip and drift inside it.
  for (const p of $$('[data-reveal]')) {
    near(p, () => {
      gsap.fromTo(p, { clipPath: 'inset(18% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'power2.out', scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 45%', scrub: true } });
      gsap.fromTo(p.querySelector('img'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
  near($('[data-specs]'), () => gsap.from('.spec-g', { y: 24, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '[data-specs]', start: 'top 85%', once: true } }));

  // Range: the number and the gauge run to the new value.
  onRangeAnimate((from, to, paint) => {
    const o = { v: from };
    gsap.to(o, { v: to, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: () => paint(o.v) });
  });

  // Configurator: the frame photos crossfade with a small scale.
  onCrossfade((on, off) => {
    gsap.to(off, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    gsap.fromTo(on, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
  });

  // Fonts change line breaks and heights; by load they are in, so one measure covers the pin and the fonts.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
