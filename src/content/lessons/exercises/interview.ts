import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { O, R } from './builders';

/* Ejercicios: entrevista conductual y método STAR (de repaso y de orden). */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  'behavioral-star': {
    0: O('star-cp-order', 'basic',
      l('Ordena las partes de una respuesta STAR.', 'Order the parts of a STAR answer.'),
      [
        l('Situación: el contexto, breve.', 'Situation: the context, brief.'),
        l('Tarea: tu responsabilidad o el reto.', 'Task: your responsibility or the challenge.'),
        l('Acción: lo que tú hiciste, paso a paso.', 'Action: what you did, step by step.'),
        l('Resultado: qué pasó, con un dato, y qué aprendiste.', 'Result: what happened, with a number, and what you learned.'),
      ],
      l('La acción es la parte más larga (alrededor del 60%).', 'The action is the longest part (around 60%).')),
    1: R('star-cp-part', 'basic',
      l('¿A qué parte de STAR corresponde cada frase? (1) "Era mi primer mes en las prácticas y el reporte semanal tardaba 3 horas." (2) "Me pidieron reducir ese tiempo." (3) "Escribí un script en Python que juntaba los datos y armaba el reporte." (4) "Bajó a 10 minutos y lo usó todo el equipo."', 'Which STAR part does each sentence belong to? (1) "It was my first month as an intern and the weekly report took 3 hours." (2) "I was asked to cut that time." (3) "I wrote a Python script that gathered the data and built the report." (4) "It dropped to 10 minutes and the whole team used it."'),
      l('(1) **Situación**, (2) **Tarea**, (3) **Acción**, (4) **Resultado**. Fíjate en que el resultado tiene un dato concreto (de 3 horas a 10 minutos).', '(1) **Situation**, (2) **Task**, (3) **Action**, (4) **Result**. Notice the result has a concrete number (from 3 hours to 10 minutes).')),
    4: R('star-cp-weakness', 'medium',
      l('¿Por qué "soy demasiado perfeccionista" es una mala respuesta a "¿cuál es tu mayor debilidad?", y qué conviene responder?', 'Why is "I am too much of a perfectionist" a bad answer to "what is your biggest weakness?", and what should you answer?'),
      l('Porque suena a un **elogio disfrazado** y el entrevistador lo ha oído mil veces: no muestra autoconocimiento. Conviene una debilidad **real** que no sea central para el puesto, con **lo que estás haciendo para mejorarla** (por ejemplo: "me costaba pedir ayuda; ahora me pongo un límite de una hora antes de preguntar").', 'Because it sounds like **a disguised compliment** and the interviewer has heard it a thousand times: it shows no self-awareness. Better a **real** weakness not central to the role, with **what you are doing to improve it** (for example: "I struggled to ask for help; now I give myself a one-hour limit before asking").')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  'behavioral-star': [
    R('star-p-yo', 'basic',
      l('¿Por qué en una respuesta STAR conviene decir "yo" en vez de "nosotros"?', 'Why should a STAR answer say "I" instead of "we"?'),
      l('Porque el entrevistador quiere saber **qué hiciste tú**, no el equipo. Si todo es "nosotros", no puede evaluar tu aporte. Puedes mencionar al equipo, pero deja claro **tu** papel en cada paso.', 'Because the interviewer wants to know **what you did**, not the team. If everything is "we", they cannot assess your contribution. You can mention the team, but make **your** role clear at each step.')),
    O('star-p-story', 'basic',
      l('Ordena estas frases para armar una respuesta STAR a "un logro del que estés orgulloso".', 'Order these sentences to build a STAR answer to "an achievement you are proud of".'),
      [
        l('En un hackathon de 24 horas, mi equipo quería hacer una app para reportar baches.', 'In a 24-hour hackathon, my team wanted to build an app to report potholes.'),
        l('Yo me encargué del mapa, aunque nunca había usado una librería de mapas.', 'I took charge of the map, even though I had never used a mapping library.'),
        l('Leí la documentación, hice un prototipo en 2 horas y lo conecté con la base de datos de reportes.', 'I read the documentation, built a prototype in 2 hours and connected it to the reports database.'),
        l('Ganamos el segundo lugar y aprendí a dividir un problema nuevo en pasos pequeños.', 'We won second place and I learned to break a new problem into small steps.'),
      ],
      l('Situación, tarea, acción y resultado (con lo que aprendiste al final).', 'Situation, task, action and result (with what you learned at the end).')),
    R('star-p-result', 'basic',
      l('Mejora este resultado: "Y al final salió bien."', 'Improve this result: "And in the end it went well."'),
      l('Agrega **algo concreto y medible** y **lo que aprendiste**: por ejemplo, "entregamos dos días antes, el profesor la usó como ejemplo para el siguiente grupo, y aprendí a acordar las tareas desde el primer día". Los números (tiempo, porcentaje, usuarios) hacen creíble el resultado.', 'Add **something concrete and measurable** and **what you learned**: for example, "we delivered two days early, the professor used it as an example for the next group, and I learned to agree on tasks from day one". Numbers (time, percentage, users) make the result credible.')),
    R('star-p-bank', 'medium',
      l('¿Cómo armas tu banco de historias para no tener que preparar una por cada pregunta posible?', 'How do you build your story bank so you do not need one story per possible question?'),
      l('Eliges **de 5 a 8 historias** (proyectos, prácticas, trabajos en equipo, un hackathon), las escribes en formato STAR y les pones **etiquetas**: conflicto, error, logro, liderazgo, presión, aprendizaje. Una misma historia suele servir para varias preguntas; solo cambias en qué parte haces énfasis.', 'You pick **5 to 8 stories** (projects, internships, teamwork, a hackathon), write them in STAR format and **tag** them: conflict, mistake, achievement, leadership, pressure, learning. The same story often works for several questions; you just change which part you emphasize.')),
    R('star-p-about', 'medium',
      l('Arma la estructura de tu respuesta a "Háblame de ti".', 'Build the structure of your answer to "Tell me about yourself".'),
      l('**Presente → pasado → futuro**, en un minuto: qué haces hoy ("estudio ingeniería en sistemas y estoy terminando un proyecto con React y Python"), qué te trajo hasta aquí (un proyecto o experiencia relevante) y por qué te interesa **este** puesto. No es tu historia de vida ni repetir tu CV.', '**Present → past → future**, in one minute: what you do today ("I study computer engineering and I am finishing a project with React and Python"), what brought you here (a relevant project or experience) and why **this** role interests you. It is not your life story or a recital of your résumé.')),
    R('star-p-mistake', 'medium',
      l('Te preguntan "¿Cuál ha sido tu mayor error?". ¿Qué debe tener una buena respuesta?', 'You are asked "What has been your biggest mistake?". What should a good answer have?'),
      l('Un error **real** (no uno disfrazado de virtud), que **asumas como tuyo** sin culpar a otros, **qué hiciste para arreglarlo** y, sobre todo, **qué cambiaste desde entonces**. Por ejemplo: subir un cambio sin probarlo, cómo lo revertiste y que desde entonces corres las pruebas antes de cada push.', 'A **real** mistake (not one disguised as a virtue), that you **own** without blaming others, **what you did to fix it** and, above all, **what you have changed since**. For example: pushing a change without testing it, how you reverted it and that since then you run the tests before every push.')),
    R('star-p-questions', 'interview',
      l('¿Qué preguntas le harías al entrevistador al final? Da tres.', 'Which questions would you ask the interviewer at the end? Give three.'),
      l('Por ejemplo: "¿Cómo es un día típico en este puesto?", "¿Cómo miden el éxito en los primeros tres meses?" y "¿Cómo es el proceso de bienvenida y quién me apoyaría al principio?". Muestran interés real y te ayudan a decidir. Decir "no, ninguna" da la impresión contraria.', 'For example: "What does a typical day in this role look like?", "How do you measure success in the first three months?" and "What is onboarding like and who would support me at first?". They show real interest and help you decide. Saying "no, none" gives the opposite impression.')),
    R('star-p-conflict', 'interview',
      l('Arma (en tus palabras) el esquema STAR de una historia para "cuéntame de un conflicto con un compañero". ¿Qué debe quedar claro en la acción?', 'Outline (in your own words) the STAR structure of a story for "tell me about a conflict with a teammate". What must be clear in the action?'),
      l('**S:** el proyecto y el contexto, breve. **T:** tu papel y en qué no estaban de acuerdo. **A:** qué hiciste **tú** para resolverlo: escuchar su punto de vista, llevar datos o un prototipo, proponer una solución, hablarlo directamente y con respeto. **R:** cómo terminó (con un dato si se puede) y qué aprendiste. En la acción debe quedar claro que buscaste resolver el problema, no ganar la discusión.', '**S:** the project and context, brief. **T:** your role and what you disagreed on. **A:** what **you** did to resolve it: listen to their view, bring data or a prototype, propose a solution, talk it through directly and respectfully. **R:** how it ended (with a number if possible) and what you learned. The action must make clear you sought to solve the problem, not to win the argument.')),
  ],
};
