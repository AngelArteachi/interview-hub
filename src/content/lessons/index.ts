import type { Exercise, Lesson, Track, TrackId } from '../../types';
import { l } from './helpers';
import { DSA_LESSONS } from './dsa';
import { DESIGN_LESSONS } from './design';
import { WEB_LESSONS } from './web';
import { SYSTEMS_LESSONS } from './systems';
import { EXTRA_BLOCKS } from './extras';
import { BEHAVIORAL_LESSON, JS_LESSON, SYSTEM_DESIGN_LESSON } from './newLessons';
import { BIG_O_CHECKPOINTS, BIG_O_PRACTICE, BIG_O_PRACTICE_LESSON } from './exercises/bigO';
import { CHECKPOINTS as BASICS_CHECKPOINTS, PRACTICE as BASICS_PRACTICE } from './exercises/dsaBasics';
import { CHECKPOINTS as MID_CHECKPOINTS, PRACTICE as MID_PRACTICE } from './exercises/dsaMid';
import { CHECKPOINTS as ADV_CHECKPOINTS, PRACTICE as ADV_PRACTICE } from './exercises/dsaAdvanced';
import { CHECKPOINTS as WEB_B_CHECKPOINTS, PRACTICE as WEB_B_PRACTICE, SQL_PRACTICE_LESSON } from './exercises/webB';
import { CHECKPOINTS as WEB_C_CHECKPOINTS, PRACTICE as WEB_C_PRACTICE } from './exercises/webC';
import { CHECKPOINTS as SYS_A_CHECKPOINTS, PRACTICE as SYS_A_PRACTICE } from './exercises/sysA';
import { CHECKPOINTS as SYS_B_CHECKPOINTS, PRACTICE as SYS_B_PRACTICE } from './exercises/sysB';
import { CHECKPOINTS as INTERVIEW_CHECKPOINTS, PRACTICE as INTERVIEW_PRACTICE } from './exercises/interview';
import { CHECKPOINTS as WEB_A_CHECKPOINTS, PRACTICE as WEB_A_PRACTICE } from './exercises/webA';
import { CHECKPOINTS as DESIGN_CHECKPOINTS, PRACTICE as DESIGN_PRACTICE } from './exercises/design';
import { DP_PRACTICE_LESSON, GRAPHS_PRACTICE_LESSON, RECURSION_PRACTICE_LESSON, TREES_PRACTICE_LESSON } from './exercises/dsaPart2';

export const TRACKS: Track[] = [
  {
    id: 'dsa',
    title: l('Estructuras de datos y algoritmos', 'Data structures & algorithms'),
    description: l('La base de toda entrevista técnica: complejidad, estructuras y patrones.', 'The foundation of every technical interview: complexity, structures and patterns.'),
    color: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'design',
    title: l('Programación y diseño', 'Programming & design'),
    description: l('OOP, SOLID, patrones, código limpio y testing.', 'OOP, SOLID, patterns, clean code and testing.'),
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'web',
    title: l('Web y backend', 'Web & backend'),
    description: l('HTTP, APIs, bases de datos, autenticación, caché y seguridad.', 'HTTP, APIs, databases, authentication, caching and security.'),
    color: 'from-sky-500 to-cyan-500',
  },
  {
    id: 'systems',
    title: l('Sistemas y herramientas', 'Systems & tools'),
    description: l('Sistemas operativos, concurrencia, redes, Git, Linux, Docker y CI/CD.', 'Operating systems, concurrency, networking, Git, Linux, Docker and CI/CD.'),
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'interview',
    title: l('Preparación de entrevista', 'Interview preparation'),
    description: l('Cómo responder preguntas conductuales con el método STAR.', 'How to answer behavioral questions with the STAR method.'),
    color: 'from-pink-500 to-rose-500',
  },
];

// JavaScript va justo después de "Cómo funciona la web"; system design cierra la ruta web
const [firstWeb, ...restWeb] = WEB_LESSONS;

/** Checkpoints (ejercicios entre secciones) y banco de práctica por lección */
const CHECKPOINTS: Record<string, Record<number, Exercise>> = { 'big-o': BIG_O_CHECKPOINTS, ...BASICS_CHECKPOINTS, ...MID_CHECKPOINTS, ...ADV_CHECKPOINTS, ...DESIGN_CHECKPOINTS, ...WEB_A_CHECKPOINTS, ...WEB_B_CHECKPOINTS, ...WEB_C_CHECKPOINTS, ...SYS_A_CHECKPOINTS, ...SYS_B_CHECKPOINTS, ...INTERVIEW_CHECKPOINTS };
const PRACTICE: Record<string, Exercise[]> = { 'big-o': BIG_O_PRACTICE, ...BASICS_PRACTICE, ...MID_PRACTICE, ...ADV_PRACTICE, ...DESIGN_PRACTICE, ...WEB_A_PRACTICE, ...WEB_B_PRACTICE, ...WEB_C_PRACTICE, ...SYS_A_PRACTICE, ...SYS_B_PRACTICE, ...INTERVIEW_PRACTICE };

function withExercises(les: Lesson): Lesson {
  const blocks = [...les.blocks, ...(EXTRA_BLOCKS[les.id] ?? [])];
  const cps = CHECKPOINTS[les.id] ?? {};
  // Inserta cada checkpoint justo después de su bloque (de atrás hacia adelante para no mover índices)
  for (const idx of Object.keys(cps).map(Number).sort((a, b) => b - a)) {
    blocks.splice(idx + 1, 0, { kind: 'exercise', ex: cps[idx] });
  }
  return { ...les, blocks, practice: les.practice ?? PRACTICE[les.id] };
}

const [bigO, ...restDsa] = DSA_LESSONS;

/** "Parte 2: en la práctica" va justo después de su lección base */
const PART2_AFTER: Record<string, Lesson> = {
  recursion: RECURSION_PRACTICE_LESSON,
  trees: TREES_PRACTICE_LESSON,
  graphs: GRAPHS_PRACTICE_LESSON,
  'dp-intro': DP_PRACTICE_LESSON,
};

export const LESSONS: Lesson[] = [
  bigO,
  BIG_O_PRACTICE_LESSON,
  ...restDsa.flatMap((les) => (PART2_AFTER[les.id] ? [les, PART2_AFTER[les.id]] : [les])),
  ...DESIGN_LESSONS,
  firstWeb,
  JS_LESSON,
  ...restWeb.flatMap((les) => (les.id === 'sql' ? [les, SQL_PRACTICE_LESSON] : [les])),
  SYSTEM_DESIGN_LESSON,
  ...SYSTEMS_LESSONS,
  BEHAVIORAL_LESSON,
].map(withExercises);

export const lessonsByTrack = (t: TrackId) => LESSONS.filter((x) => x.track === t);
export const lessonById = (id: string) => LESSONS.find((x) => x.id === id);
export const trackById = (id: TrackId) => TRACKS.find((t) => t.id === id)!;
export { exerciseItemId, lessonConceptId, quizItemId } from './ids';
