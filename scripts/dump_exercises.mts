/**
 * Imprime en JSON todos los ejercicios de las lecciones (checkpoints y banco de práctica).
 * Lo usan scripts/check_exercises.py y scripts/gen_traces.py.
 *   npx tsx scripts/dump_exercises.mts
 */
import { LESSONS } from '../src/content/lessons/index.ts';
import { lessonExercises } from '../src/lib/exercise.ts';

const out = LESSONS.flatMap((les) => lessonExercises(les).map((ex) => ({ lesson: les.id, ...ex })));
process.stdout.write(JSON.stringify(out));
