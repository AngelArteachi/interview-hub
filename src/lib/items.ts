import type { AppData, ItemType, L, ReviewItem } from '../types';
import { ALGORITHMS, PATTERNS } from '../data/algorithms';
import { CONCEPTS, CONCEPT_TOPICS } from '../data/fundamentals';
import { DESIGN_CASES } from '../data/systemDesign';
import { BEHAVIORAL } from '../data/behavioral';
import { LESSONS, lessonConceptId } from '../content/lessons';
import { todayStr } from './srs';

const same = (s: string): L => ({ es: s, en: s });

const BUILTIN: ReviewItem[] = [
  ...ALGORITHMS.map<ReviewItem>((a) => ({
    id: `alg:${a.id}`,
    type: 'algorithm',
    front: { es: `**${a.title.es}**\n\n${a.statement.es}`, en: `**${a.title.en}**\n\n${a.statement.en}` },
    back: {
      es: `${a.solution.es}\n\n**Patrón:** ${PATTERNS[a.pattern].name.es} · **Tiempo:** ${a.time} · **Espacio:** ${a.space}`,
      en: `${a.solution.en}\n\n**Pattern:** ${PATTERNS[a.pattern].name.en} · **Time:** ${a.time} · **Space:** ${a.space}`,
    },
    tags: [a.pattern],
    difficulty: a.difficulty,
    link: `/practice/algorithms/${a.id}`,
  })),
  ...CONCEPTS.map<ReviewItem>((c) => ({ id: `con:${c.id}`, type: 'concept', front: c.q, back: c.a, tags: [c.topic] })),
  ...DESIGN_CASES.map<ReviewItem>((d) => ({
    id: `des:${d.id}`,
    type: 'design',
    front: { es: `**${d.title.es}**\n\n${d.prompt.es}`, en: `**${d.title.en}**\n\n${d.prompt.en}` },
    back: {
      es: d.steps.map((s) => `**${s.title.es}**\n${s.points.map((p) => `- ${p.es}`).join('\n')}`).join('\n\n'),
      en: d.steps.map((s) => `**${s.title.en}**\n${s.points.map((p) => `- ${p.en}`).join('\n')}`).join('\n\n'),
    },
    tags: ['design'],
    link: `/practice/design/${d.id}`,
  })),
  ...BEHAVIORAL.map<ReviewItem>((b) => ({ id: `beh:${b.id}`, type: 'behavioral', front: b.q, back: b.tip, tags: b.tags })),
];

const LESSON_ITEMS: ReviewItem[] = LESSONS.flatMap((les) =>
  les.concepts.map<ReviewItem>((c, i) => ({
    id: lessonConceptId(les.id, i),
    type: 'lesson',
    front: c.q,
    back: c.a,
    tags: [les.track, les.id],
    link: `/learn/${les.id}`,
  })),
);

export function allItems(data: AppData): ReviewItem[] {
  const custom = data.custom.map<ReviewItem>((c) => ({
    id: `cus:${c.id}`,
    type: 'custom',
    front: same(c.front),
    back: same(c.back),
    tags: [c.type, ...c.tags],
  }));
  // Los conceptos de lecciones solo entran al repaso al completar la lección
  const lessonItems = LESSON_ITEMS.filter((it) => data.srs[it.id]);
  return [...custom, ...lessonItems, ...BUILTIN];
}

export function itemMap(data: AppData): Map<string, ReviewItem> {
  return new Map(allItems(data).map((i) => [i.id, i]));
}

/** Interleave por tipo para que la sesión no sea monótona */
function interleave(items: ReviewItem[]): ReviewItem[] {
  const groups = new Map<ItemType, ReviewItem[]>();
  for (const it of items) groups.set(it.type, [...(groups.get(it.type) ?? []), it]);
  const lists = [...groups.values()];
  const out: ReviewItem[] = [];
  for (let i = 0; out.length < items.length; i++) for (const g of lists) if (g[i]) out.push(g[i]);
  return out;
}

export function dailyQueue(data: AppData, today = todayStr()) {
  const items = allItems(data);
  const due = items.filter((i) => data.srs[i.id] && data.srs[i.id].due <= today);
  due.sort((a, b) => data.srs[a.id].due.localeCompare(data.srs[b.id].due));
  const introducedToday = data.activity[today]?.newCards ?? 0;
  const newLimit = Math.max(0, data.settings.newPerDay - introducedToday);
  const fresh = interleave(items.filter((i) => !data.srs[i.id])).slice(0, newLimit);
  return { due: interleave(due), fresh, all: [...interleave(due), ...fresh] };
}

export const TYPE_LABEL: Record<ItemType, L> = {
  algorithm: { es: 'Algoritmo', en: 'Algorithm' },
  concept: { es: 'Concepto', en: 'Concept' },
  design: { es: 'System design', en: 'System design' },
  behavioral: { es: 'Conductual', en: 'Behavioral' },
  lesson: { es: 'Lección', en: 'Lesson' },
  custom: { es: 'Propia', en: 'Custom' },
};

export const TYPE_COLOR: Record<ItemType, string> = {
  algorithm: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  concept: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  design: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  behavioral: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  lesson: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  custom: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
};

export const tagLabel = (tag: string): L | undefined =>
  (PATTERNS as Record<string, { name: L }>)[tag]?.name ?? (CONCEPT_TOPICS as Record<string, L>)[tag];
