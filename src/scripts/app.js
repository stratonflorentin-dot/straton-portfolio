/* ═══════════════════════════════════════════════════════════════
   STATE MACHINE
   You should not need to edit this file.
   Everything configurable lives in src/config/site.config.js
   ═══════════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { SCREENS, LOADOUT, SETTINGS, SITE, TOTAL_SECTIONS } from '../config/site.config.js';

const STORE_KEY = 'portfolio-progress-v1';

export function initApp() {
  const stage = document.getElementById('stage');
  if (!stage) return;

  const $ = (s) => document.querySelector(s);
  const menuEl   = $('#menu');
  const hl       = $('#menu-hl');
  const clockEl  = $('#clock');
  const moneyEl  = $('#money');
  const starsEl  = $('#stars');
  const xpBar    = $('#xp-bar');
  const blip     = $('#blip');
  const objEl    = $('#objective');
  const screenCountEl = $('#screen-count');
  const toast    = $('#toast');
  const toastCash= $('#toast-cash');
  const backhint = $('#backhint');
  const wheel    = $('#wheel');
  const wheelIn  = $('#wheel-in');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sel = 0;
  let current = null;
  let wheelOpen = false;
  const money = { value: 0 };

  /* ── restore progress ───────────────────────────────────────── */
  let visited = new Set();
  if (SETTINGS.saveProgress) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (Array.isArray(saved)) visited = new Set(saved);
    } catch { /* first visit, or storage blocked */ }
  }
  function persist() {
    if (!SETTINGS.saveProgress) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...visited])); } catch { /* ignore */ }
  }

  /* ── menu ───────────────────────────────────────────────────── */
  SCREENS.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'menu-item';
    el.dataset.i = i;
    el.dataset.id = s.id;
    el.innerHTML = `<span>${s.label}</span><span class="chev">›</span>`;
    el.addEventListener('mouseenter', () => { sel = i; paintMenu(); });
    el.addEventListener('click', () => { sel = i; paintMenu(); go(s.id); });
    menuEl.appendChild(el);
  });
  const nodes = [...menuEl.querySelectorAll('.menu-item')];

  function paintMenu() {
    nodes.forEach((n) => {
      n.classList.toggle('sel', +n.dataset.i === sel);
      n.classList.toggle('done', SETTINGS.progressionEnabled && visited.has(n.dataset.id));
    });
    const a = nodes[sel];
    if (!a) return;
    gsap.to(hl, { y: a.offsetTop, height: a.offsetHeight, duration: .22, ease: 'back.out(2)' });
  }

  /* ── stars ──────────────────────────────────────────────────── */
  const starNodes = [];
  if (SETTINGS.progressionEnabled) {
    for (let i = 0; i < SETTINGS.totalStars; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.textContent = '★';
      starsEl.appendChild(s);
      starNodes.push(s);
    }
  }

  /* Scales visited sections onto the available stars, so the two
     always finish together however many screens you configure. */
  function starsFor(n) {
    if (!TOTAL_SECTIONS) return 0;
    return Math.round((n / TOTAL_SECTIONS) * SETTINGS.totalStars);
  }

  function lightStars(n, animate = true) {
    const target = starsFor(n);
    starNodes.forEach((s, i) => {
      const on = i < target;
      const was = s.classList.contains('lit');
      s.classList.toggle('lit', on);
      if (on && !was && animate && !reduced) {
        gsap.fromTo(s,
          { scale: 1, rotate: 0 },
          { scale: 1.6, rotate: 14, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
      }
    });
  }

  /* ── clock ──────────────────────────────────────────────────── */
  function tickClock() {
    const d = new Date();
    clockEl.textContent =
      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  tickClock();
  setInterval(tickClock, 15000);

  /* ── money ──────────────────────────────────────────────────── */
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
  function addMoney(amount) {
    if (reduced) {
      money.value += amount;
      moneyEl.textContent = fmt(money.value);
      return;
    }
    gsap.to(money, {
      value: money.value + amount,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => { moneyEl.textContent = fmt(money.value); }
    });
  }

  /* ── toast ──────────────────────────────────────────────────── */
  function showToast(amount) {
    if (!SETTINGS.progressionEnabled) return;
    toastCash.textContent = '+' + fmt(amount);
    gsap.killTweensOf(toast);
    gsap.fromTo(toast, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: .45, ease: 'power3.out' });
    gsap.to(toast, { opacity: 0, x: 20, duration: .4, delay: 2.4, ease: 'power2.in' });
  }

  /* ── navigation ─────────────────────────────────────────────── */
  function go(id) {
    const idx = SCREENS.findIndex((s) => s.id === id);
    const meta = SCREENS[idx];
    if (!meta || id === current) return;

    stage.dataset.screen = id;
    if (screenCountEl) {
      screenCountEl.textContent =
        String(idx + 1).padStart(2, '0') + ' / ' + String(SCREENS.length).padStart(2, '0');
    }

    document.querySelectorAll('.plate').forEach((p) => {
      const on = p.dataset.id === id;
      p.classList.toggle('on', on);
      const v = p.querySelector('video');
      if (v) {
        if (on && !reduced) { v.play().catch(() => {}); }
        else { v.pause(); }
      }
    });

    const outgoing = document.querySelector('.screen.on');
    const incoming = document.querySelector(`.screen[data-s="${id}"]`);
    if (outgoing && outgoing !== incoming) outgoing.classList.remove('on');
    if (incoming) {
      incoming.classList.add('on');
      if (!reduced) {
        gsap.fromTo(incoming.querySelectorAll('.anim'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: .5, stagger: .06, ease: 'power3.out', overwrite: true }
        );
      }
    }

    current = id;
    backhint.classList.toggle('on', id !== SCREENS[0].id);
    objEl.innerHTML = meta.objective;
    gsap.to(blip, { left: meta.map[0] + '%', top: meta.map[1] + '%', duration: .6, ease: 'power2.inOut' });

    if (id === SCREENS[0].id) paintMenu();

    if (SETTINGS.progressionEnabled && meta.counts && !visited.has(id)) {
      visited.add(id);
      persist();
      const n = visited.size;
      lightStars(n);
      gsap.to(xpBar, {
        width: Math.min(100, (n / TOTAL_SECTIONS) * 100) + '%',
        duration: .7, ease: 'power3.out'
      });
      const bonus = SETTINGS.moneyPerSection + n * SETTINGS.moneyBonusPerSection;
      addMoney(bonus);
      showToast(bonus);
    }

    if (id === 'skills' && incoming) {
      const fills = incoming.querySelectorAll('.skill-f');
      gsap.fromTo(fills, { width: '0%' }, {
        width: (i, el) => el.dataset.v + '%',
        duration: .9, stagger: .07, ease: 'power3.out', delay: .2, overwrite: true
      });
    }
  }

  /* ── loadout wheel ──────────────────────────────────────────── */
  const R = 12.4;
  LOADOUT.items.forEach((t, i) => {
    const a = (i / LOADOUT.items.length) * Math.PI * 2 - Math.PI / 2;
    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.style.transform = `translate(${Math.cos(a) * R}cqw, ${Math.sin(a) * R}cqw)`;
    seg.innerHTML = `<b>${t.name}</b><span>${t.role}</span>`;
    wheelIn.appendChild(seg);
  });

  function toggleWheel(force) {
    wheelOpen = force !== undefined ? force : !wheelOpen;
    wheel.classList.toggle('on', wheelOpen);
    if (wheelOpen && !reduced) {
      gsap.fromTo(wheelIn.querySelectorAll('.seg'),
        { scale: .6, opacity: 0 },
        { scale: 1, opacity: 1, duration: .35, stagger: .03, ease: 'back.out(1.7)', overwrite: true }
      );
    }
  }

  /* ── buttons ────────────────────────────────────────────────── */
  document.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => go(b.dataset.go));
  });

  /* ── keyboard ───────────────────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); toggleWheel(); return; }
    if (e.key === 'Escape') { toggleWheel(false); go(SCREENS[0].id); return; }

    /* jump straight to a screen — 1 through 9 */
    if (/^[1-9]$/.test(e.key)) {
      const target = SCREENS[Number(e.key) - 1];
      if (target) { e.preventDefault(); toggleWheel(false); go(target.id); }
      return;
    }

    /* browse screen-to-screen without opening the menu */
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      const i = SCREENS.findIndex((s) => s.id === current);
      if (i > -1 && i < SCREENS.length - 1) { e.preventDefault(); toggleWheel(false); go(SCREENS[i + 1].id); }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      const i = SCREENS.findIndex((s) => s.id === current);
      if (i > 0) { e.preventDefault(); toggleWheel(false); go(SCREENS[i - 1].id); }
      return;
    }

    if (current !== SCREENS[0].id) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % SCREENS.length; paintMenu(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); sel = (sel - 1 + SCREENS.length) % SCREENS.length; paintMenu(); }
    if (e.key === 'Enter')     { e.preventDefault(); go(SCREENS[sel].id); }
  });

  /* ── missing-frame detection ────────────────────────────────
     Plates containing a <video> are skipped. Plates whose image
     fails to load keep their gradient fallback, so the site never
     shows a broken asset.                                        */
  document.querySelectorAll('.plate[data-src]').forEach((plate) => {
    if (plate.querySelector('video')) { plate.dataset.missing = 'false'; return; }
    const img = new Image();
    img.onload = () => {
      plate.style.backgroundImage = `url("${plate.dataset.src}")`;
      plate.dataset.missing = 'false';
    };
    img.onerror = () => { plate.dataset.missing = 'true'; };
    img.src = plate.dataset.src;
  });

  window.addEventListener('resize', () => { if (current === SCREENS[0].id) paintMenu(); });

  /* ── splash ─────────────────────────────────────────────────── */
  const splash = $('#splash');
  const splashFill = $('#splash-fill');
  const splashPct = $('#splash-pct');
  const dur = reduced ? 0.1 : SETTINGS.splashDuration;

  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100, duration: dur, ease: 'power1.inOut',
    onUpdate: () => {
      const p = Math.round(counter.v);
      if (splashFill) splashFill.style.width = p + '%';
      if (splashPct) splashPct.textContent = p + '%';
    },
    onComplete: () => {
      if (!splash) return;
      gsap.to(splash, {
        opacity: 0, duration: .5, ease: 'power2.inOut',
        onComplete: () => splash.remove()
      });
    }
  });

  /* ── boot ───────────────────────────────────────────────────── */
  if (SETTINGS.progressionEnabled && visited.size) {
    lightStars(visited.size, false);
    xpBar.style.width = Math.min(100, (visited.size / TOTAL_SECTIONS) * 100) + '%';
  }

  paintMenu();
  go(SCREENS[0].id);
  gsap.delayedCall(dur * 0.4, () => addMoney(SITE.moneyTarget));
}
