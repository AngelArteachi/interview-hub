/** Identificadores de tarjetas de repaso que nacen de las lecciones */
export const lessonConceptId = (lessonId: string, i: number) => `les:${lessonId}:${i}`;
/** Pregunta de quiz convertida en tarjeta de repaso (solo si la fallaste) */
export const quizItemId = (lessonId: string, i: number) => `qz:${lessonId}:${i}`;
/** Ejercicio de práctica convertido en tarjeta de repaso (solo si lo fallaste) */
export const exerciseItemId = (lessonId: string, exId: string) => `ex:${lessonId}:${exId}`;
