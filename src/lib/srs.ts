import type { Rating, SrsState } from '../types';

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return todayStr(new Date(y, m - 1, d + days));
}

export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function newState(today = todayStr()): SrsState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: today, last: today, history: [] };
}

/**
 * SM-2 simplificado (estilo Anki).
 * 1 = Otra vez, 2 = Difícil, 3 = Bien, 4 = Fácil
 */
export function review(prev: SrsState | undefined, rating: Rating, today = todayStr()): SrsState {
  const s = prev ? { ...prev } : newState(today);
  let { ease, interval, reps, lapses } = s;

  if (rating === 1) {
    lapses += 1;
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
    interval = 0;
  } else {
    if (rating === 2) {
      ease = Math.max(1.3, ease - 0.15);
      interval = reps === 0 ? 1 : Math.max(interval + 1, Math.round(interval * 1.2));
    } else if (rating === 3) {
      interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
    } else {
      ease = ease + 0.15;
      interval = reps === 0 ? 4 : Math.round(Math.max(interval + 1, interval * ease * 1.3));
    }
    reps += 1;
  }

  interval = Math.min(interval, 365);
  return {
    ease: Math.round(ease * 100) / 100,
    interval,
    reps,
    lapses,
    due: addDays(today, interval),
    last: today,
    history: [...s.history, { d: today, r: rating }].slice(-30),
  };
}

/** Texto del próximo intervalo para mostrar en los botones */
export function previewInterval(prev: SrsState | undefined, rating: Rating): number {
  return review(prev, rating).interval;
}

/** 0–1: qué tan dominado está un ítem */
export function mastery(s: SrsState | undefined): number {
  if (!s) return 0;
  return Math.min(1, s.interval / 21);
}

/** Debilidad: más alto = más débil */
export function weakness(s: SrsState | undefined): number {
  if (!s) return 0.5;
  const recentFails = s.history.slice(-5).filter((h) => h.r <= 2).length;
  return (2.5 - s.ease) + recentFails * 0.4 + s.lapses * 0.2 + (s.interval < 3 ? 0.3 : 0);
}
