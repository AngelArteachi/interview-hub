export type Lang = 'es' | 'en';
/** Texto bilingüe */
export type L = { es: string; en: string };

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ItemType = 'algorithm' | 'concept' | 'design' | 'behavioral' | 'lesson' | 'custom';

export type Pattern =
  | 'hashing'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'graphs'
  | 'dp'
  | 'sorting';

export interface Algorithm {
  id: string;
  title: L;
  pattern: Pattern;
  difficulty: Difficulty;
  statement: L;
  example?: string;
  hints: L[];
  solution: L;
  code: string;
  time: string;
  space: string;
  leetcode?: string;
}

export interface Concept {
  id: string;
  topic: ConceptTopic;
  q: L;
  a: L;
}
export type ConceptTopic = 'oop' | 'ds' | 'bigo' | 'db' | 'web' | 'git' | 'os' | 'testing' | 'js';

export interface DesignCase {
  id: string;
  title: L;
  prompt: L;
  steps: { title: L; points: L[] }[];
  checklist: L[];
}

export type StoryTag = 'teamwork' | 'conflict' | 'failure' | 'achievement' | 'leadership' | 'learning' | 'pressure' | 'motivation';

export interface BehavioralQ {
  id: string;
  q: L;
  tags: StoryTag[];
  tip: L;
}

/** Ítem genérico que entra al sistema de repaso */
export interface ReviewItem {
  id: string;
  type: ItemType;
  front: L;
  back: L;
  tags: string[];
  difficulty?: Difficulty;
  /** ruta para ver el detalle */
  link?: string;
  /** Qué se espera que respondas (se muestra aparte del enunciado) */
  prompt?: L;
}

export interface SrsState {
  ease: number;
  interval: number;
  reps: number;
  lapses: number;
  due: string; // yyyy-mm-dd
  last: string;
  history: { d: string; r: Rating }[];
}
export type Rating = 1 | 2 | 3 | 4;

export interface CustomCard {
  id: string;
  type: ItemType;
  front: string;
  back: string;
  tags: string[];
  created: string;
}

export interface Story {
  id: string;
  title: string;
  tags: StoryTag[];
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface MockAnswer {
  itemId: string;
  question: string;
  answer: string;
  seconds: number;
  selfScore: number; // 1-5
  ai?: AIEvaluation;
}
export interface MockResult {
  id: string;
  date: string;
  kind: MockKind;
  durationMin: number;
  answers: MockAnswer[];
}
export type MockKind = 'mixed' | 'technical' | 'behavioral';

export interface AIEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  idealAnswerSummary: string;
  suggestedRating: Rating;
}

export interface DayActivity {
  reviews: number;
  newCards: number;
  lessons: number;
}

export interface AppData {
  version: 1;
  srs: Record<string, SrsState>;
  custom: CustomCard[];
  stories: Story[];
  lessons: Record<string, { completed: string; quizScore: number }>;
  mocks: MockResult[];
  activity: Record<string, DayActivity>;
  notes: Record<string, string>;
  settings: { newPerDay: number };
  /** Progreso en los ejercicios de práctica de las lecciones (clave: `<lessonId>:<exId>`) */
  exercises: Record<string, ExerciseProgress>;
}

export interface ExerciseProgress {
  ok: boolean;
  date: string;
  tries: number;
}

/* ---------- Lecciones ---------- */
export type TrackId = 'dsa' | 'design' | 'web' | 'systems' | 'interview';
export type VisualizerId = 'sorting' | 'binary-search' | 'sliding-window' | 'stack-queue' | 'bst' | 'graph' | 'dp';

export type Block =
  | { kind: 'md'; md: L }
  | { kind: 'code'; code: string; lang?: string; caption?: L }
  | { kind: 'viz'; id: VisualizerId }
  | { kind: 'callout'; tone: 'tip' | 'interview' | 'warning'; md: L }
  | { kind: 'exercise'; ex: Exercise };

/* ---------- Ejercicios de práctica (no cuentan para aprobar) ---------- */
export type ExerciseLevel = 'basic' | 'medium' | 'interview';

export type Exercise = { id: string; level: ExerciseLevel } & (
  /** Predice qué imprime el código. `walkthrough`: cómo funciona el algoritmo, sin dar la respuesta */
  | { kind: 'predict'; prompt: L; code: string; lang: 'python' | 'javascript'; answer: string; explanation: L; walkthrough?: L }
  /** Elige la línea que falta (marcada con ____ en el código) */
  | { kind: 'complete'; prompt: L; code: string; lang: 'python' | 'javascript'; options: string[]; answer: number; explanation: L; walkthrough?: L }
  /** Pregunta abierta: escribes y te autoevalúas */
  | { kind: 'recall'; q: L; a: L }
  /** Ordena los pasos (vienen en el orden correcto; se barajan al mostrarlos) */
  | { kind: 'order'; prompt: L; steps: L[]; explanation: L }
);

export interface QuizQ {
  q: L;
  options: L[];
  answer: number;
  explanation: L;
}

export interface Lesson {
  id: string;
  track: TrackId;
  title: L;
  summary: L;
  minutes: number;
  blocks: Block[];
  quiz: QuizQ[];
  concepts: { q: L; a: L }[];
  related?: string[]; // ids de algoritmos
  /** Banco de ejercicios de "Practica esta lección" */
  practice?: Exercise[];
}

export interface Track {
  id: TrackId;
  title: L;
  description: L;
  color: string;
}
