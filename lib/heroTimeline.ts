// Maps hero scroll progress (0..1) to a camera position measured in "word units".
// s = 0 means the camera is parked in front of word 0, s = 1 in front of word 1, and so on.
// Both the WebGL scene and the HTML overlay read from this file so they never drift apart.

export const WORD_COUNT = 5;
export const INTRO = 0.1; // 0 → INTRO: headline is visible while word 0 flies in from the depth
export const OUT = 0.94; //  OUT → 1: camera punches through the last word and the hero dissolves
const DWELL = 0.42; //     fraction of each segment the camera rests on a word so it can be read
const LAST_HOLD = 0.6; //   extra rest on the final word (in segment units)
const TOTAL_UNITS = WORD_COUNT - 1 + LAST_HOLD;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const smoothstep = (a: number, b: number, v: number) => smooth(clamp((v - a) / (b - a)));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

/** Camera position (in word units) for a given scroll progress. */
export function cameraS(p: number): number {
  if (p < INTRO) return -1.15 + 1.15 * easeOut(p / INTRO);
  if (p <= OUT) {
    const u = ((p - INTRO) / (OUT - INTRO)) * TOTAL_UNITS;
    const i = Math.min(Math.floor(u), WORD_COUNT - 1);
    if (i >= WORD_COUNT - 1) return WORD_COUNT - 1;
    const f = u - i;
    return i + smooth(clamp((f - DWELL) / (1 - DWELL)));
  }
  return WORD_COUNT - 1 + 1.6 * easeIn((p - OUT) / (1 - OUT));
}

/** Scroll progress at which the camera is resting in the middle of word `i`'s hold. */
export function progressForWord(i: number): number {
  const u = i + (i >= WORD_COUNT - 1 ? LAST_HOLD * 0.3 : DWELL * 0.55);
  return INTRO + (u / TOTAL_UNITS) * (OUT - INTRO);
}

/** Index of the word currently in focus, or -1 during the intro / outro. */
export function activeWord(p: number): number {
  if (p < INTRO * 0.55 || p > OUT + 0.02) return -1;
  return clamp(Math.round(cameraS(p)), 0, WORD_COUNT - 1);
}
