/* ═══════════════════════════════════════════════════════════════
   STATE MACHINE
   You should not need to edit this file.
   Everything configurable lives in src/config/site.config.js
   ═══════════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { SCREENS, LOADOUT, SETTINGS, SITE, TOTAL_SECTIONS } from '../config/site.config.js';
import { createAudioManager } from '../audio/AudioManager.js';

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
  const mnavCountEl = $('#mnav-count');
  const mnavPrev = $('#mnav-prev');
  const mnavNext = $('#mnav-next');
  const mnavHome = $('#mnav-home');
  const toast    = $('#toast');
  const toastCash= $('#toast-cash');
  const backhint = $('#backhint');
  const wheel    = $('#wheel');
  const wheelIn  = $('#wheel-in');
  const musicToggle = $('#music-toggle');
  const musicLabel  = $('#music-label');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── music ──────────────────────────────────────────────────────
     The control reflects ACTUAL playback only (never the stored
     preference alone) — paintMusic is driven exclusively by the
     audio element's own play/pause events via onChange, so the UI
     can't drift from what's really audible. */
  const audio = createAudioManager({ src: '/audio/portfolio-theme.mp3', defaultVolume: 0.3 });

  function paintMusic(playing) {
    if (!musicToggle) return;
    musicToggle.classList.toggle('playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    if (musicLabel) musicLabel.innerHTML = playing ? 'MUSIC<br>ON' : 'MUSIC<br>OFF';
  }
  paintMusic(false); // nothing is playing on load — no fake animation, ever
  audio.onChange(paintMusic);

  if (musicToggle) musicToggle.addEventListener('click', () => audio.toggle());

  /* Nothing plays until a real interaction — browsers block autoplay.
     Only try if the user's stored preference is "on"; on failure the
     listener stays armed so the next interaction retries, and on
     success it detaches itself since it's no longer needed.

     If the interaction IS the music control itself (the M key, or a
     click on the toggle), skip — that path already calls attemptPlay
     via toggle(), and firing both here would race two play() calls
     against each other on the very first interaction. */
  if (audio.isPreferenceEnabled()) {
    const isMusicAction = (e) =>
      (e.type === 'keydown' && (e.key === 'm' || e.key === 'M')) ||
      (musicToggle && e.target === musicToggle);
    const tryStart = (e) => {
      if (isMusicAction(e)) return;
      audio.attemptPlay().then((ok) => {
        if (ok) {
          window.removeEventListener('pointerdown', tryStart);
          window.removeEventListener('keydown', tryStart);
        }
      });
    };
    window.addEventListener('pointerdown', tryStart);
    window.addEventListener('keydown', tryStart);
  }

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

  /* ── artwork transition ────────────────────────────────────────
     Cinematic slide + scale + fade between art plates, direction-
     aware (forward = deeper into the screen order, backward = the
     reverse), with a very subtle counter-parallax on the scrims so
     the artwork reads as layered rather than a flat image swap.
     GSAP owns all of it (kill + retarget) so rapid navigation can
     safely interrupt an in-flight transition instead of fighting it. */
  const ART_SHIFT = 7;   // % of plate width the art slides
  const ART_DUR = .85;   // seconds — within the 700-1000ms cinematic target
  const ART_EASE = 'power3.out';
  const scrims = [...document.querySelectorAll('.scrim')];

  function settlePlate(id) {
    const p = document.querySelector(`.plate[data-id="${id}"]`);
    if (p) gsap.set(p, { clearProps: 'opacity,x,scale,willChange' });
  }

  function transitionPlates(id, dir) {
    const plates = [...document.querySelectorAll('.plate')];
    const outgoing = plates.find((p) => p.classList.contains('on'));
    const incoming = plates.find((p) => p.dataset.id === id);
    if (!incoming) return;

    /* Any plate that isn't part of THIS transition gets hard-reset —
       guards against a stuck/duplicated layer if the user navigated
       again before a previous transition finished settling. */
    plates.forEach((p) => {
      if (p === outgoing || p === incoming) return;
      gsap.killTweensOf(p);
      gsap.set(p, { opacity: 0, x: 0, scale: 1, clearProps: 'willChange' });
      p.classList.remove('on');
      const v = p.querySelector('video');
      if (v) v.pause();
    });

    gsap.killTweensOf(incoming);
    if (outgoing) gsap.killTweensOf(outgoing);
    gsap.killTweensOf(scrims);

    if (reduced) {
      gsap.set(incoming, { opacity: 0, x: 0, scale: 1 });
      incoming.classList.add('on');
      gsap.to(incoming, { opacity: 1, duration: .2, ease: 'none' });
      if (outgoing) {
        gsap.set(outgoing, { opacity: 1, x: 0, scale: 1 });
        outgoing.classList.remove('on');
        gsap.to(outgoing, { opacity: 0, duration: .2, ease: 'none' });
      }
      return;
    }

    gsap.set(incoming, {
      opacity: 0, x: dir * ART_SHIFT + '%', scale: 1.07,
      willChange: 'transform, opacity'
    });
    incoming.classList.add('on');
    const iv = incoming.querySelector('video');
    if (iv) iv.play().catch(() => {});

    audio.duck(0.6, 250);
    gsap.to(incoming, {
      opacity: 1, x: '0%', scale: 1,
      duration: ART_DUR, ease: ART_EASE,
      onComplete: () => {
        settlePlate(incoming.dataset.id);
        audio.unduck(400);
      }
    });

    if (outgoing && outgoing !== incoming) {
      /* Lock in the outgoing plate's current visual state as explicit
         inline styles BEFORE touching the .on class — otherwise removing
         the class snaps opacity/transform to the idle CSS defaults a
         frame before GSAP reads its tween "from" values, which made the
         fade instant instead of gradual. */
      gsap.set(outgoing, { opacity: 1, x: 0, scale: 1, willChange: 'transform, opacity' });
      outgoing.classList.remove('on');
      gsap.to(outgoing, {
        opacity: 0, x: (-dir * ART_SHIFT) + '%', scale: .95,
        duration: ART_DUR, ease: ART_EASE,
        onComplete: () => {
          const v = outgoing.querySelector('video');
          if (v) v.pause();
          gsap.set(outgoing, { opacity: 0, x: 0, scale: 1, clearProps: 'willChange' });
        }
      });
    }

    /* subtle depth cue: scrims drift in from the opposite side, at a
       fraction of the artwork's own movement, and settle to rest */
    gsap.fromTo(scrims,
      { x: dir * (ART_SHIFT * .25) + '%' },
      { x: '0%', duration: ART_DUR, ease: ART_EASE }
    );
  }

  /* ── navigation ─────────────────────────────────────────────── */
  function go(id) {
    const idx = SCREENS.findIndex((s) => s.id === id);
    const meta = SCREENS[idx];
    if (!meta || id === current) return;

    const oldIdx = SCREENS.findIndex((s) => s.id === current);
    const dir = idx > oldIdx ? 1 : -1;

    stage.dataset.screen = id;
    const countText = String(idx + 1).padStart(2, '0') + ' / ' + String(SCREENS.length).padStart(2, '0');
    if (screenCountEl) screenCountEl.textContent = countText;
    if (mnavCountEl) mnavCountEl.textContent = countText;
    if (mnavPrev) mnavPrev.classList.toggle('disabled', idx === 0);
    if (mnavNext) mnavNext.classList.toggle('disabled', idx === SCREENS.length - 1);

    transitionPlates(id, dir);

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
    const was = wheelOpen;
    wheelOpen = force !== undefined ? force : !wheelOpen;
    if (wheelOpen !== was) { if (wheelOpen) audio.duck(0.45, 300); else audio.unduck(400); }
    wheel.classList.toggle('on', wheelOpen);
    if (wheelOpen && !reduced) {
      gsap.fromTo(wheelIn.querySelectorAll('.seg'),
        { scale: .6, opacity: 0 },
        { scale: 1, opacity: 1, duration: .35, stagger: .03, ease: 'back.out(1.7)', overwrite: true }
      );
    }
  }

  /* the avatar has no other purpose — use it as a tap/click target
     to open the tech-stack wheel where there's no Tab key (touch) */
  const avatarEl = $('.hud-avatar');
  if (avatarEl) avatarEl.addEventListener('click', () => toggleWheel());
  wheel.addEventListener('click', () => toggleWheel(false));

  /* ── buttons ────────────────────────────────────────────────── */
  document.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => go(b.dataset.go));
  });

  /* step forward/backward through the screen order — shared by the
     keyboard, the mobile prev/next buttons, and swipe gestures */
  function step(delta) {
    const i = SCREENS.findIndex((s) => s.id === current);
    const target = SCREENS[i + delta];
    if (target) { toggleWheel(false); go(target.id); }
  }

  if (mnavPrev) mnavPrev.addEventListener('click', () => step(-1));
  if (mnavNext) mnavNext.addEventListener('click', () => step(1));
  if (mnavHome) mnavHome.addEventListener('click', () => { toggleWheel(false); go(SCREENS[0].id); });

  /* ── keyboard ───────────────────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); toggleWheel(); return; }
    if (e.key === 'Escape') { toggleWheel(false); go(SCREENS[0].id); return; }
    if (e.key === 'm' || e.key === 'M') { audio.toggle(); return; }

    /* jump straight to a screen — 1 through 9 */
    if (/^[1-9]$/.test(e.key)) {
      const target = SCREENS[Number(e.key) - 1];
      if (target) { e.preventDefault(); toggleWheel(false); go(target.id); }
      return;
    }

    /* browse screen-to-screen without opening the menu */
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); step(1); return; }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')  { e.preventDefault(); step(-1); return; }

    if (current !== SCREENS[0].id) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % SCREENS.length; paintMenu(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); sel = (sel - 1 + SCREENS.length) % SCREENS.length; paintMenu(); }
    if (e.key === 'Enter')     { e.preventDefault(); go(SCREENS[sel].id); }
  });

  /* ── touch swipe (mobile) ──────────────────────────────────────
     Horizontal-dominant swipes step forward/back through the same
     screen order as the arrow keys. A vertical scroll inside the
     content column is left alone — we only act once a touch has
     moved clearly more horizontally than vertically. */
  let touchX = 0, touchY = 0, touchActive = false;
  const SWIPE_MIN = 48;      // px — ignore accidental micro-drags
  const SWIPE_RATIO = 1.3;   // horizontal must dominate vertical by this much

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { touchActive = false; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (!touchActive) return;
    touchActive = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
    if (wheelOpen) return;
    step(dx < 0 ? 1 : -1);
  }, { passive: true });

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
