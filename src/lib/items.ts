import type { AppData, ItemType, L, Pattern, ReviewItem } from '../types';
import { ALGORITHMS, PATTERNS } from '../data/algorithms';
import { CONCEPTS, CONCEPT_TOPICS } from '../data/fundamentals';
import { DESIGN_CASES } from '../data/systemDesign';
import { BEHAVIORAL } from '../data/behavioral';
import { LESSONS, lessonConceptId, quizItemId } from '../content/lessons';
import { todayStr } from './srs';

const same = (s: string): L => ({ es: s, en: s });

const BUILTIN: ReviewItem[] = [
  ...ALGORITHMS.map<ReviewItem>((a) => ({
    id: `alg:${a.id}`,
    type: 'algorithm',
    // Frente: problema + ejemplo
    front: {
      es: `**${a.title.es}**\n\n${a.statement.es}${a.example ? `\n\n**Ejemplo:**\n\n\`\`\`text\n${a.example}\n\`\`\`` : ''}`,
      en: `**${a.title.en}**\n\n${a.statement.en}${a.example ? `\n\n**Example:**\n\n\`\`\`text\n${a.example}\n\`\`\`` : ''}`,
    },
    // Reverso: explicación + código + complejidad
    back: {
      es: `${a.solution.es}\n\n\`\`\`python\n${a.code}\n\`\`\`\n\n**Patrón:** ${PATTERNS[a.pattern].name.es} · **Tiempo:** ${a.time} · **Espacio:** ${a.space}`,
      en: `${a.solution.en}\n\n\`\`\`python\n${a.code}\n\`\`\`\n\n**Pattern:** ${PATTERNS[a.pattern].name.en} · **Time:** ${a.time} · **Space:** ${a.space}`,
    },
    prompt: {
      es: 'Explica cómo lo resolverías: la idea principal, qué estructura de datos usarías y su complejidad. No hace falta escribir el código.',
      en: 'Explain how you would solve it: the main idea, which data structure you would use and its complexity. No need to write the code.',
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
    prompt: {
      es: 'Esboza tu diseño: requisitos, API y datos, diseño general y cómo escalaría.',
      en: 'Sketch your design: requirements, API and data, high-level design and how it would scale.',
    },
    tags: ['design'],
    link: `/practice/design/${d.id}`,
  })),
  ...BEHAVIORAL.map<ReviewItem>((b) => ({
    id: `beh:${b.id}`,
    type: 'behavioral',
    front: b.q,
    back: b.tip,
    prompt: {
      es: 'Responde como en la entrevista, con una historia real y el formato STAR: Situación, Tarea, Acción y Resultado.',
      en: 'Answer as in the interview, with a real story and the STAR format: Situation, Task, Action and Result.',
    },
    tags: b.tags,
  })),
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
).concat(
  LESSONS.flatMap((les) =>
    les.quiz.map<ReviewItem>((q, i) => ({
      id: quizItemId(les.id, i),
      type: 'lesson',
      front: q.q,
      back: {
        es: `**${q.options[q.answer].es}**\n\n${q.explanation.es}`,
        en: `**${q.options[q.answer].en}**\n\n${q.explanation.en}`,
      },
      tags: [les.track, les.id],
      link: `/learn/${les.id}`,
    })),
  ),
);

export function allItems(data: AppData): ReviewItem[] {
  const custom = data.custom.map<ReviewItem>((c) => ({
    id: `cus:${c.id}`,
    type: 'custom',
    front: same(c.front),
    back: same(c.back),
    tags: [c.type, ...c.tags],
  }));
  // Los conceptos de lecciones entran al aprobar la lección; las preguntas de quiz, al fallarlas
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

/* ---------- Qué lección desbloquea cada pregunta ---------- */

const PATTERN_LESSON: Record<Pattern, string> = {
  hashing: 'arrays-hashing',
  'two-pointers': 'two-pointers-window',
  'sliding-window': 'two-pointers-window',
  stack: 'stacks-queues',
  'binary-search': 'binary-search',
  'linked-list': 'linked-lists',
  trees: 'trees',
  graphs: 'graphs',
  dp: 'dp-intro',
  sorting: 'sorting',
};

const CONCEPT_LESSON: Record<string, string> = {
  'oop-pillars': 'oop-pillars',
  'oop-solid': 'solid',
  'oop-composition': 'oop-pillars',
  'oop-interface-abstract': 'oop-pillars',
  'oop-di': 'solid',
  'oop-overload-override': 'oop-pillars',
  'ds-array-list': 'linked-lists',
  'ds-hashmap': 'arrays-hashing',
  'ds-stack-queue': 'stacks-queues',
  'ds-heap': 'heaps',
  'ds-bst': 'trees',
  'ds-graph-repr': 'graphs',
  'ds-bfs-dfs': 'graphs',
  'ds-trie': 'trees',
  'bigo-what': 'big-o',
  'bigo-order': 'big-o',
  'bigo-sorts': 'sorting',
  'bigo-recursion-space': 'recursion',
  'bigo-amortized': 'big-o',
  'db-acid': 'sql',
  'db-index': 'sql',
  'db-joins': 'sql',
  'db-normalization': 'sql',
  'db-sql-nosql': 'nosql',
  'db-n-plus-1': 'sql',
  'web-http-methods': 'rest-apis',
  'web-status': 'how-web-works',
  'web-rest': 'rest-apis',
  'web-url': 'how-web-works',
  'web-auth': 'auth',
  'web-jwt': 'auth',
  'web-cors': 'web-security',
  'web-cache': 'caching',
  'web-xss-sqli': 'web-security',
  'git-merge-rebase': 'git',
  'git-conflict': 'git',
  'git-reset-revert': 'git',
  'os-process-thread': 'processes-threads',
  'os-race': 'concurrency',
  'os-deadlock': 'concurrency',
  'os-stack-heap-mem': 'processes-threads',
  'os-tcp-udp': 'networking',
  'test-pyramid': 'testing',
  'test-mock': 'testing',
  'test-tdd': 'testing',
  'js-event-loop': 'javascript-essentials',
  'js-closure': 'javascript-essentials',
  'js-var-let-const': 'javascript-essentials',
  'js-equality': 'javascript-essentials',
  'js-promise-async': 'javascript-essentials',
};

/** Lección que hay que completar para que una pregunta aparezca como nueva (null = siempre disponible) */
export function requiredLesson(itemId: string): string | null {
  const [prefix, id] = itemId.split(':');
  if (prefix === 'alg') {
    const a = ALGORITHMS.find((x) => x.id === id);
    return a ? PATTERN_LESSON[a.pattern] : null;
  }
  if (prefix === 'con') return CONCEPT_LESSON[id] ?? null;
  if (prefix === 'des') return 'system-design-intro';
  if (prefix === 'beh') return 'behavioral-star';
  return null; // tarjetas propias y conceptos/preguntas de lecciones
}

export function isUnlocked(itemId: string, data: AppData): boolean {
  const lesson = requiredLesson(itemId);
  return !lesson || Boolean(data.lessons[lesson]);
}

export function dailyQueue(data: AppData, today = todayStr()) {
  const items = allItems(data);
  const due = items.filter((i) => data.srs[i.id] && data.srs[i.id].due <= today);
  due.sort((a, b) => data.srs[a.id].due.localeCompare(data.srs[b.id].due));
  const introducedToday = data.activity[today]?.newCards ?? 0;
  const newLimit = Math.max(0, data.settings.newPerDay - introducedToday);
  const unseen = items.filter((i) => !data.srs[i.id]);
  // Solo preguntas nuevas de temas cuya lección ya completaste
  const fresh = interleave(unseen.filter((i) => isUnlocked(i.id, data))).slice(0, newLimit);
  const locked = unseen.filter((i) => !isUnlocked(i.id, data)).length;
  return { due: interleave(due), fresh, locked, all: [...interleave(due), ...fresh] };
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
