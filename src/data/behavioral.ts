import type { BehavioralQ, L, StoryTag } from '../types';

const l = (es: string, en: string): L => ({ es, en });

export const STORY_TAGS: Record<StoryTag, L> = {
  teamwork: l('Trabajo en equipo', 'Teamwork'),
  conflict: l('Conflicto', 'Conflict'),
  failure: l('Error / fracaso', 'Failure'),
  achievement: l('Logro', 'Achievement'),
  leadership: l('Liderazgo / iniciativa', 'Leadership / initiative'),
  learning: l('Aprendizaje rápido', 'Fast learning'),
  pressure: l('Presión / plazos', 'Pressure / deadlines'),
  motivation: l('Motivación', 'Motivation'),
};

export const STAR_GUIDE: { key: 'situation' | 'task' | 'action' | 'result'; title: L; help: L }[] = [
  { key: 'situation', title: l('Situación', 'Situation'), help: l('Contexto breve: dónde, cuándo, qué estaba pasando (10–15%).', 'Brief context: where, when, what was going on (10–15%).') },
  { key: 'task', title: l('Tarea', 'Task'), help: l('Tu responsabilidad o el reto concreto (10–15%).', 'Your responsibility or the concrete challenge (10–15%).') },
  { key: 'action', title: l('Acción', 'Action'), help: l('Lo que **tú** hiciste, paso a paso. Usa "yo", no "nosotros" (50–60%).', 'What **you** did, step by step. Say "I", not "we" (50–60%).') },
  { key: 'result', title: l('Resultado', 'Result'), help: l('Impacto medible y lo que aprendiste (15–20%).', 'Measurable impact and what you learned (15–20%).') },
];

const b = (id: string, q: L, tags: StoryTag[], tip: L): BehavioralQ => ({ id, q, tags, tip });

export const BEHAVIORAL: BehavioralQ[] = [
  b('tell-me', l('Háblame de ti.', 'Tell me about yourself.'), ['motivation'],
    l('Fórmula presente → pasado → futuro en 1–2 min: qué haces ahora, qué te trajo aquí (proyectos clave) y por qué este puesto encaja.', 'Present → past → future formula in 1–2 min: what you do now, what brought you here (key projects) and why this role fits.')),
  b('why-company', l('¿Por qué quieres trabajar aquí?', 'Why do you want to work here?'), ['motivation'],
    l('Investiga la empresa: menciona algo específico de su producto, cultura o tecnología, y conéctalo con tus metas.', 'Research the company: mention something specific about its product, culture or tech, and connect it to your goals.')),
  b('proud-project', l('¿De qué proyecto te sientes más orgulloso?', 'What project are you most proud of?'), ['achievement'],
    l('Elige uno técnico donde tuviste un papel claro. Explica el reto, tus decisiones técnicas y el resultado.', 'Pick a technical one where you had a clear role. Explain the challenge, your technical decisions and the outcome.')),
  b('mistake', l('Cuéntame de un error que cometiste.', 'Tell me about a mistake you made.'), ['failure', 'learning'],
    l('Un error real (no "soy perfeccionista"). Asume la responsabilidad y enfócate en cómo lo corregiste y qué cambiaste después.', 'A real mistake (not "I am a perfectionist"). Own it and focus on how you fixed it and what you changed afterwards.')),
  b('conflict-teammate', l('Describe un conflicto con un compañero y cómo lo resolviste.', 'Describe a conflict with a teammate and how you resolved it.'), ['conflict', 'teamwork'],
    l('Muestra empatía y comunicación: escuchaste su punto de vista, buscaste datos y llegaron a un acuerdo. Nunca hables mal de la otra persona.', 'Show empathy and communication: you listened, looked for data and reached agreement. Never badmouth the other person.')),
  b('disagree', l('¿Alguna vez no estuviste de acuerdo con una decisión? ¿Qué hiciste?', 'Have you ever disagreed with a decision? What did you do?'), ['conflict'],
    l('"Disentir y comprometerse": diste tu opinión con argumentos y, una vez tomada la decisión, la apoyaste.', '"Disagree and commit": you gave your opinion with arguments and, once the decision was made, you supported it.')),
  b('tight-deadline', l('Cuéntame de una vez que trabajaste con un plazo muy ajustado.', 'Tell me about a time you worked under a tight deadline.'), ['pressure'],
    l('Habla de cómo priorizaste, comunicaste riesgos a tiempo y qué recortaste (o no) para cumplir.', 'Talk about how you prioritized, communicated risks early and what you cut (or not) to deliver.')),
  b('learn-fast', l('¿Cuándo tuviste que aprender algo nuevo muy rápido?', 'When did you have to learn something new very quickly?'), ['learning'],
    l('Describe tu método de aprendizaje (documentación, prototipos, pedir ayuda) y el resultado concreto.', 'Describe your learning method (docs, prototypes, asking for help) and the concrete result.')),
  b('initiative', l('Cuéntame de una vez que tomaste la iniciativa.', 'Tell me about a time you took initiative.'), ['leadership'],
    l('Algo que nadie te pidió: detectaste un problema, propusiste una solución y la llevaste a cabo.', 'Something nobody asked for: you spotted a problem, proposed a solution and carried it out.')),
  b('difficult-bug', l('Describe el bug más difícil que has resuelto.', 'Describe the hardest bug you have solved.'), ['achievement', 'learning'],
    l('Cuenta tu proceso de depuración: hipótesis, cómo lo aislaste, herramientas usadas y cómo evitaste que volviera a pasar.', 'Walk through your debugging process: hypotheses, how you isolated it, tools used and how you prevented it from happening again.')),
  b('feedback', l('Cuéntame de una vez que recibiste una crítica difícil.', 'Tell me about a time you received tough feedback.'), ['learning'],
    l('Muestra madurez: no te pusiste a la defensiva, entendiste el punto y cambiaste algo concreto.', 'Show maturity: you did not get defensive, understood the point and changed something concrete.')),
  b('team-project', l('Háblame de un proyecto en equipo. ¿Cuál fue tu papel?', 'Tell me about a team project. What was your role?'), ['teamwork'],
    l('Deja claro tu aporte individual dentro del equipo y cómo coordinaron (reuniones, Git, tareas).', 'Make your individual contribution clear within the team and how you coordinated (meetings, Git, tasks).')),
  b('failure-project', l('Háblame de un proyecto que no salió como esperabas.', 'Tell me about a project that did not go as planned.'), ['failure'],
    l('Enfócate en lo que aprendiste y en qué harías distinto. Cierra con algo positivo.', 'Focus on what you learned and what you would do differently. End on a positive note.')),
  b('help-someone', l('Cuéntame de una vez que ayudaste a un compañero.', 'Tell me about a time you helped a teammate.'), ['teamwork', 'leadership'],
    l('Ejemplos: mentoría, pair programming o desbloquear a alguien. Resalta el impacto en el equipo.', 'Examples: mentoring, pair programming or unblocking someone. Highlight the impact on the team.')),
  b('ambiguity', l('¿Cómo manejas requisitos ambiguos?', 'How do you handle ambiguous requirements?'), ['learning', 'pressure'],
    l('Haces preguntas, documentas suposiciones, entregas algo pequeño pronto para validarlo e iteras.', 'You ask questions, document assumptions, ship something small early to validate and iterate.')),
  b('prioritize', l('¿Cómo priorizas cuando tienes varias tareas a la vez?', 'How do you prioritize when you have several tasks at once?'), ['pressure'],
    l('Impacto vs urgencia, alineación con tu líder y comunicación clara de lo que no alcanzará a hacerse.', 'Impact vs urgency, alignment with your lead and clear communication of what will not get done.')),
  b('strength-weakness', l('¿Cuál es tu mayor fortaleza y tu mayor debilidad?', 'What are your greatest strength and weakness?'), ['motivation', 'learning'],
    l('Fortaleza con un ejemplo concreto. Debilidad real pero no crítica para el puesto, y qué estás haciendo para mejorarla.', 'Strength with a concrete example. A real weakness that is not critical for the role, and what you are doing to improve it.')),
  b('five-years', l('¿Dónde te ves en 5 años?', 'Where do you see yourself in 5 years?'), ['motivation'],
    l('Crecimiento técnico y de impacto, coherente con lo que ofrece la empresa. Evita sonar como si fueras a irte pronto.', 'Technical and impact growth consistent with what the company offers. Avoid sounding like you will leave soon.')),
  b('code-review', l('¿Cómo reaccionas cuando alguien critica tu código en un code review?', 'How do you react when someone criticizes your code in a code review?'), ['learning', 'teamwork'],
    l('Lo ves como aprendizaje: preguntas el porqué, aplicas lo útil y, si no estás de acuerdo, lo discutes con argumentos.', 'You see it as learning: ask why, apply what is useful and, if you disagree, discuss it with arguments.')),
  b('questions', l('¿Tienes alguna pregunta para nosotros?', 'Do you have any questions for us?'), ['motivation'],
    l('Siempre ten 2–3 listas: cómo es un día típico, cómo miden el éxito en el puesto, cómo es el onboarding y el proceso de code review.', 'Always have 2–3 ready: what a typical day looks like, how success is measured, what onboarding and code review are like.')),
];
