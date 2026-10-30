import type { Exercise, ExerciseLevel, L } from '../../../types';

/* Atajos para escribir ejercicios de forma compacta (todos en Python). */

/** Predice la salida */
export const P = (id: string, level: ExerciseLevel, prompt: L, code: string, answer: string, explanation: L, walkthrough?: L): Exercise => ({
  id,
  level,
  kind: 'predict',
  prompt,
  code,
  lang: 'python',
  answer,
  explanation,
  walkthrough,
});

/** Completa el código (la línea que falta va como ____ en `code`) */
export const C = (id: string, level: ExerciseLevel, prompt: L, code: string, options: string[], answer: number, explanation: L, walkthrough?: L): Exercise => ({
  id,
  level,
  kind: 'complete',
  prompt,
  code,
  lang: 'python',
  options,
  answer,
  explanation,
  walkthrough,
});

/** Predice la salida, en JavaScript */
export const PJ = (id: string, level: ExerciseLevel, prompt: L, code: string, answer: string, explanation: L, walkthrough?: L): Exercise => ({
  ...P(id, level, prompt, code, answer, explanation, walkthrough),
  lang: 'javascript',
} as Exercise);

/** Completa el código, en JavaScript */
export const CJ = (id: string, level: ExerciseLevel, prompt: L, code: string, options: string[], answer: number, explanation: L, walkthrough?: L): Exercise => ({
  ...C(id, level, prompt, code, options, answer, explanation, walkthrough),
  lang: 'javascript',
} as Exercise);

/** Repaso rápido (pregunta abierta) */
export const R = (id: string, level: ExerciseLevel, q: L, a: L): Exercise => ({ id, level, kind: 'recall', q, a });

/** Ordena los pasos (en el orden correcto) */
export const O = (id: string, level: ExerciseLevel, prompt: L, steps: L[], explanation: L): Exercise => ({ id, level, kind: 'order', prompt, steps, explanation });

/** Clases de apoyo que se repiten en los ejercicios */
export const NODO_LISTA = `class Nodo:
    def __init__(self, val, sig=None):
        self.val = val
        self.sig = sig
`;

export const NODO_ARBOL = `class Nodo:
    def __init__(self, val, izq=None, der=None):
        self.val = val
        self.izq = izq
        self.der = der
`;
