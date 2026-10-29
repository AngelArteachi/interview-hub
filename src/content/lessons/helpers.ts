import type { Block, L, QuizQ, VisualizerId } from '../../types';

export const l = (es: string, en: string): L => ({ es, en });
export const md = (es: string, en: string): Block => ({ kind: 'md', md: { es, en } });
export const code = (src: string, lang = 'python'): Block => ({ kind: 'code', code: src, lang });
export const viz = (id: VisualizerId): Block => ({ kind: 'viz', id });
export const tip = (es: string, en: string): Block => ({ kind: 'callout', tone: 'tip', md: { es, en } });
export const interview = (es: string, en: string): Block => ({ kind: 'callout', tone: 'interview', md: { es, en } });
export const warn = (es: string, en: string): Block => ({ kind: 'callout', tone: 'warning', md: { es, en } });

/** Pregunta de quiz: opciones como pares [es, en] */
export const q = (es: string, en: string, options: [string, string][], answer: number, expEs: string, expEn: string): QuizQ => ({
  q: { es, en },
  options: options.map(([a, b]) => ({ es: a, en: b })),
  answer,
  explanation: { es: expEs, en: expEn },
});

export const concept = (qes: string, qen: string, aes: string, aen: string) => ({ q: { es: qes, en: qen }, a: { es: aes, en: aen } });
