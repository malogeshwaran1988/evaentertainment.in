/**
 * Audio focus: only one clip on the page may play sound at a time.
 *
 * Every player registers with an id and a `yield` callback. When a player gains sound
 * (autoSound, a Sound button, or native play/unmute) it calls `claimAudio(id)`; every other
 * player's `yield` runs at once (mute or pause, button back to off) and an `eva:audio-focus`
 * event is dispatched on window. A document-level guard also watches `play` and `volumechange`
 * on every <video>/<audio>, so native controls and untracked media follow the same rule.
 * Players should check `otherHasAudio(id)` before taking sound automatically.
 */
export const AUDIO_FOCUS_EVENT = "eva:audio-focus";

type Yield = () => void;
const players = new Map<string, Yield>();
let owner: string | null = null;
let guarded = false;
let strayCount = 0;
const strayIds = new WeakMap<HTMLMediaElement, string>();

const audible = (m: HTMLMediaElement) => !m.paused && !m.muted && m.volume > 0;
const idOf = (m: HTMLMediaElement) => {
  const tagged = m.dataset.audioFocus;
  if (tagged) return tagged;
  let id = strayIds.get(m);
  if (!id) strayIds.set(m, (id = `media-${++strayCount}`));
  return id;
};

export function claimAudio(id: string) {
  if (owner === id) return;
  owner = id;
  players.forEach((fn, key) => { if (key !== id) fn(); });
  // Untracked media elements (no registered player) are simply muted.
  document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((m) => {
    if (!m.dataset.audioFocus && idOf(m) !== id && !m.muted) m.muted = true;
  });
  window.dispatchEvent(new CustomEvent(AUDIO_FOCUS_EVENT, { detail: { id } }));
}

export function releaseAudio(id: string) {
  if (owner === id) owner = null;
}

/** True when a different player currently has sound. */
export function otherHasAudio(id: string) {
  return owner !== null && owner !== id;
}

function guard() {
  if (guarded || typeof document === "undefined") return;
  guarded = true;
  const onChange = (e: Event) => {
    const m = e.target;
    if (!(m instanceof HTMLMediaElement)) return;
    const id = idOf(m);
    if (audible(m)) claimAudio(id);
    else if (owner === id) releaseAudio(id);
  };
  // Media events do not bubble, so listen in the capture phase.
  document.addEventListener("play", onChange, true);
  document.addEventListener("volumechange", onChange, true);
  document.addEventListener("pause", onChange, true);
  document.addEventListener("ended", onChange, true);
}

export function registerAudio(id: string, onYield: Yield) {
  guard();
  players.set(id, onYield);
  return () => {
    players.delete(id);
    releaseAudio(id);
  };
}

/** Clicks on these never act as the "first tap unlocks sound" gesture for other players. */
export const SOUND_BTN_SELECTOR = "[data-audio-btn]";
