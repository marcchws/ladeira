// Page-wide switches. ?motion=reduced previews the reduced-motion version; ?state=busy|done|failed opens the
// reservation in that state, so every state of the mocked checkout can be linked to and checked.
const params = new URLSearchParams(location.search);

export const reduced = params.get('motion') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
export const phone = () => matchMedia('(max-width: 1023px)').matches;

const state = params.get('state');
export const startState = state === 'busy' || state === 'done' || state === 'failed' ? state : 'idle';

export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)!;
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
