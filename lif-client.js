/* líf.is gluggasamningur v1. Engin formgögn, auðkenni eða aðgangslyklar fara til foreldravefs. */
(function () {
 'use strict';
 if (window.Lif) return;
 const PARENTS = new Set(['https://xn--lf-nja.is', 'https://www.xn--lf-nja.is']);
 const FAMILY = new Set(['https://myndarsogur.is', 'https://www.myndarsogur.is', 'https://verslun.myndarsogur.is']);
 const loopback = h => ['localhost', '127.0.0.1', '[::1]'].includes(h);
 let parentOrigin = null, connected = false, custom = {}, last = '', timer;
 const clean = text => typeof text === 'string' ? text.trim().slice(0, 180) : '';
 const publicURL = () => {
  const url = new URL(location.href);
  const allowed = new Set(['saga', 'bls', 'mal', 'episode', 't', 'room', 'r', 'verkefni', 'efni', 'innfellt']);
  for (const key of [...url.searchParams.keys()]) if (!allowed.has(key)) url.searchParams.delete(key);
  url.username = url.password = '';
  return url.href;
 };
 function trusted(origin) {
  if (PARENTS.has(origin)) return true;
  if (/^\/lesa\//.test(location.pathname) && FAMILY.has(location.origin) && FAMILY.has(origin)) return true;
  try { return loopback(location.hostname) && loopback(new URL(origin).hostname); } catch { return false; }
 }
 function send(type, value = {}) {
  if (connected && parentOrigin && window.parent !== window) window.parent.postMessage({lif: 1, type, ...value}, parentOrigin);
 }
 function position() {
  const title = clean(custom.title || document.querySelector('h1')?.textContent || document.title);
  const state = {url: publicURL(), title, label: clean(custom.label || title), scroll: Math.round(scrollY)};
  const key = JSON.stringify(state);
  if (key !== last) { last = key; send('position', state); }
 }
 function soon() { clearTimeout(timer); timer = setTimeout(position, 350); }
 window.Lif = Object.freeze({
  get connected() { return connected; },
  update(value = {}) { custom = {title: clean(value.title), label: clean(value.label)}; soon(); },
  report(value = {}) {
   // Verslunin getur miðlað stöðu úr sínum eigin, sérstaklega sannreynda lesaraglugga.
   try {
    const url = new URL(value.url);
    if (FAMILY.has(location.origin) && FAMILY.has(url.origin) && /^\/lesa\//.test(url.pathname)) {
     send('position', {url: url.href, title: clean(value.title), label: clean(value.label), scroll: Math.max(0, Math.min(100000, Number(value.scroll) || 0)), nested: true});
    }
   } catch {}
  },
  close() { send('close'); },
  fullscreen(value = true) { send('fullscreen', {value: Boolean(value)}); },
  navigate(url) { try { send('navigate', {url: new URL(url, location.href).href}); } catch {} },
 });
 addEventListener('message', event => {
  if (event.source !== window.parent || !trusted(event.origin) || event.data?.lif !== 1) return;
  if (event.data.type === 'init') {
   const wasConnected = connected;
   connected = true; parentOrigin = event.origin;
   document.documentElement.classList.add('in-lif');
   const resume = event.data.resume;
   if (!wasConnected && resume && resume.url === publicURL() && Number.isFinite(resume.scroll)) {
    const y = Math.max(0, Math.min(100000, resume.scroll));
    // Áfangastaðir sem sækja efni geta verið tilbúnir eftir load.
    for (const delay of [0, 400, 1200]) setTimeout(() => { if (!document.hidden) scrollTo(0, y); }, delay);
   }
   if (!wasConnected) dispatchEvent(new CustomEvent('lif:connected'));
   last = ''; position();
  } else if (event.data.type === 'snapshot') { last = ''; position(); }
 });
 // Aðeins líf.is fær kveðjuna. '*' er aldrei notað.
 function ready() {
  if (window.parent === window) return;
  let referrer; try { referrer = new URL(document.referrer).origin; } catch {}
  const origins = trusted(referrer) ? [referrer] : [...PARENTS];
  for (const origin of origins) window.parent.postMessage({lif: 1, type: 'ready'}, origin);
 }
 for (const name of ['pushState', 'replaceState']) {
  const original = history[name];
  history[name] = function (...args) { const result = original.apply(this, args); custom = {}; soon(); return result; };
 }
 addEventListener('popstate', () => { custom = {}; soon(); });
 addEventListener('hashchange', soon);
 addEventListener('scroll', soon, {passive: true});
 addEventListener('pagehide', position);
 document.addEventListener('visibilitychange', () => { if (document.hidden) position(); });
 document.addEventListener('click', event => {
  if (!connected || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.download || (link.target && link.target !== '_self')) return;
  let url; try { url = new URL(link.href); } catch { return; }
  // Undirsíður Myndarsagna fylgja sama glugga. Aðrir tenglar halda eigin hegðun.
  const family = /^(www\.)?myndarsogur\.is$|^(verslun|innsendingar)\.myndarsogur\.is$/;
  if (url.origin !== location.origin && url.protocol === 'https:' && family.test(location.hostname) && family.test(url.hostname)) {
   event.preventDefault(); window.Lif.navigate(url.href);
  }
 });
 document.addEventListener('keydown', event => {
  if (!connected || event.defaultPrevented || event.key !== 'Escape' || event.target.closest('input,textarea,select,[contenteditable]')) return;
  // Escape lokar fyrst glugga sem vefurinn sjálfur hefur opnað.
  if (document.querySelector('dialog[open], [aria-modal="true"]:not([hidden])')) return;
  setTimeout(() => { if (!event.defaultPrevented) window.Lif.close(); }, 0);
 });
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, {once: true}); else ready();
 addEventListener('load', () => { ready(); soon(); }, {once: true});
})();
