/* ═══════════════════════════════════════════════════════════════
   AUDIO MANAGER
   One persistent HTMLAudioElement for the whole app. Handles the
   autoplay-restriction dance (nothing plays until a real user
   interaction), fades, ducking during screen transitions, and
   remembering the user's on/off choice across visits.

   Two separate concepts, deliberately kept apart:
     - musicPreferenceEnabled — the user's stored choice (localStorage),
       survives reloads, does NOT mean audio is currently sounding.
     - actual playback state   — driven entirely by the audio element's
       own 'playing'/'pause'/'ended' events. This is the only thing
       the UI is allowed to react to, so it can never show "ON" while
       nothing is audible, or "OFF" while it's still playing.

   A missing/broken audio file degrades to silence — it never
   throws, so it can't break the rest of the app.
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'portfolio_music_enabled';

export function createAudioManager({ src, defaultVolume = 0.3 }) {
  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0;
  audio.src = src;

  // A broken/missing file rejects play() (caught where it's called) and
  // may also fire 'error' — swallow it so it never surfaces as an app error.
  audio.addEventListener('error', () => {});

  let preferenceEnabled = true; // no stored preference yet -> defaults on
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) preferenceEnabled = saved === 'true';
  } catch { /* storage blocked (private mode, etc.) — just don't persist */ }

  let fadeTimer = null;
  const listeners = new Set();

  function isPlaying() {
    return !audio.paused && !audio.ended;
  }

  function notify() {
    const playing = isPlaying();
    listeners.forEach((fn) => fn(playing));
  }

  // These fire only on REAL state changes (browser-driven), which is
  // exactly what the UI should be keyed off — never off our own intent.
  audio.addEventListener('playing', notify);
  audio.addEventListener('pause', notify);
  audio.addEventListener('ended', notify);

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, String(preferenceEnabled)); } catch { /* ignore */ }
  }

  function clearFade() {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
  }

  function fadeTo(target, duration) {
    clearFade();
    const from = audio.volume;
    const t0 = performance.now();
    if (duration <= 0) { audio.volume = target; return; }
    fadeTimer = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / duration);
      audio.volume = from + (target - from) * p;
      if (p >= 1) clearFade();
    }, 40);
  }

  /* Tries to play without touching the stored preference — used for the
     "first interaction" attempt, which should retry on a later
     interaction rather than assume failure means the user opted out. */
  function attemptPlay() {
    return audio.play()
      .then(() => { fadeTo(defaultVolume, 1200); return true; })
      .catch(() => false); // autoplay blocked or file missing — stay silent, no throw
  }

  function turnOn() {
    preferenceEnabled = true;
    persist();
    return attemptPlay();
  }

  function turnOff() {
    preferenceEnabled = false;
    persist();
    clearFade();
    audio.pause(); // immediate — fires 'pause' synchronously so the UI updates instantly
  }

  function toggle() {
    if (isPlaying()) turnOff(); else turnOn();
  }

  /* subtle, self-clearing dip for screen transitions — never stacks,
     since fadeTo always cancels whatever fade was already running.
     Purely a volume change, so it never touches play/pause state or
     the ON/OFF indicator. */
  function duck(level = 0.6, duration = 250) {
    if (!isPlaying()) return;
    fadeTo(defaultVolume * level, duration);
  }
  function unduck(duration = 350) {
    if (!isPlaying()) return;
    fadeTo(defaultVolume, duration);
  }

  return {
    attemptPlay,
    turnOn,
    turnOff,
    toggle,
    duck,
    unduck,
    isPlaying,
    isPreferenceEnabled: () => preferenceEnabled,
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
}
