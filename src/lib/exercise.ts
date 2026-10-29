import type { Exercise, Lesson } from '../types';

/** Compara salidas ignorando espacios de más y el tipo de comillas */
export function normalizeOutput(s: string) {
  return s
    .trim()
    .replace(/["“”‘’]/g, "'")
    .replace(/\s*,\s*/g, ', ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n');
}

/** Barajado determinista (mismo orden en cada render) que nunca deja la lista ya ordenada */
export function shuffledOrder(id: string, n: number): number[] {
  let seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (n > 1 && idx.every((v, i) => v === i)) idx.push(idx.shift()!);
  return idx;
}

/** Todos los ejercicios de una lección: los checkpoints del texto y el banco de práctica */
export function lessonExercises(lesson: Lesson): Exercise[] {
  const inline = lesson.blocks.flatMap((b) => (b.kind === 'exercise' ? [b.ex] : []));
  return [...inline, ...(lesson.practice ?? [])];
}
