import type { Lesson, Track, TrackId } from '../../types';
import { l } from './helpers';
import { DSA_LESSONS } from './dsa';
import { DESIGN_LESSONS } from './design';
import { WEB_LESSONS } from './web';
import { SYSTEMS_LESSONS } from './systems';
import { EXTRA_BLOCKS } from './extras';
import { BEHAVIORAL_LESSON, JS_LESSON, SYSTEM_DESIGN_LESSON } from './newLessons';

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

export const LESSONS: Lesson[] = [
  ...DSA_LESSONS,
  ...DESIGN_LESSONS,
  firstWeb,
  JS_LESSON,
  ...restWeb,
  SYSTEM_DESIGN_LESSON,
  ...SYSTEMS_LESSONS,
  BEHAVIORAL_LESSON,
].map((les) => (EXTRA_BLOCKS[les.id] ? { ...les, blocks: [...les.blocks, ...EXTRA_BLOCKS[les.id]] } : les));

export const lessonsByTrack = (t: TrackId) => LESSONS.filter((x) => x.track === t);
export const lessonById = (id: string) => LESSONS.find((x) => x.id === id);
export const trackById = (id: TrackId) => TRACKS.find((t) => t.id === id)!;
export const lessonConceptId = (lessonId: string, i: number) => `les:${lessonId}:${i}`;
/** Pregunta de quiz convertida en tarjeta de repaso (solo si la fallaste) */
export const quizItemId = (lessonId: string, i: number) => `qz:${lessonId}:${i}`;
