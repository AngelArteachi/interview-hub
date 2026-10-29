import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

/** JavaScript: cubre las flashcards js-* */
export const JS_LESSON: Lesson = {
  id: 'javascript-essentials',
  track: 'web',
  title: l('JavaScript esencial para entrevistas', 'JavaScript essentials for interviews'),
  summary: l('Variables, igualdad, closures, el event loop y código asíncrono.', 'Variables, equality, closures, the event loop and async code.'),
  minutes: 18,
  blocks: [
    md(
      `## var, let y const
- \`var\`: tiene ámbito de **función** y se "eleva" (*hoisting*): existe desde el inicio de la función con valor \`undefined\`.
- \`let\` y \`const\`: tienen ámbito de **bloque** (\`{ }\`). Antes de su declaración están en la **zona muerta temporal** (TDZ): usarlas ahí lanza un error.
- \`const\` impide **reasignar** la variable, pero si guarda un objeto o arreglo, su contenido **sí se puede modificar**.

Regla práctica: usa \`const\` por defecto, \`let\` si vas a reasignar, y evita \`var\`.

## == vs ===
- \`===\` (igualdad estricta) compara **valor y tipo** sin convertir nada: \`1 === "1"\` es \`false\`.
- \`==\` (igualdad débil) **convierte los tipos** antes de comparar: \`1 == "1"\` es \`true\`, y \`0 == ""\` también. Esto causa errores sutiles.

Usa \`===\` casi siempre.`,
      `## var, let and const
- \`var\`: has **function** scope and is "hoisted": it exists from the start of the function with value \`undefined\`.
- \`let\` and \`const\`: have **block** scope (\`{ }\`). Before their declaration they are in the **temporal dead zone** (TDZ): using them there throws an error.
- \`const\` prevents **reassigning** the variable, but if it holds an object or array, its contents **can still be changed**.

Rule of thumb: use \`const\` by default, \`let\` if you will reassign, and avoid \`var\`.

## == vs ===
- \`===\` (strict equality) compares **value and type** without converting anything: \`1 === "1"\` is \`false\`.
- \`==\` (loose equality) **converts types** before comparing: \`1 == "1"\` is \`true\`, and so is \`0 == ""\`. This causes subtle bugs.

Use \`===\` almost always.`,
    ),
    md(
      `## Closures
Un **closure** es una función que **recuerda las variables del ámbito donde se creó**, incluso después de que ese ámbito terminó. Sirven para encapsular estado privado y aparecen en todos los callbacks.`,
      `## Closures
A **closure** is a function that **remembers the variables of the scope where it was created**, even after that scope has finished. They are used to encapsulate private state and show up in every callback.`,
    ),
    code(`function crearContador() {
  let cuenta = 0;              // variable "privada"
  return () => ++cuenta;       // la función recuerda 'cuenta'
}

const siguiente = crearContador();
siguiente(); // 1
siguiente(); // 2`, 'javascript'),
    md(
      `## El event loop
JavaScript ejecuta tu código en **un solo hilo**. Lo que tarda (temporizadores, peticiones de red) no bloquea: se registra y su callback se ejecuta después. El **event loop** decide el orden:
1. Ejecuta una **tarea** completa: el script principal, un callback de \`setTimeout\`, un evento.
2. Cuando la pila de llamadas queda vacía, ejecuta **todas las microtareas** pendientes: callbacks de promesas (\`.then\`, \`await\`) y \`queueMicrotask\`.
3. Pasa a la siguiente tarea.

Por eso una promesa resuelta se atiende **antes** que un \`setTimeout(…, 0)\`.`,
      `## The event loop
JavaScript runs your code on **a single thread**. Slow work (timers, network requests) does not block: it is registered and its callback runs later. The **event loop** decides the order:
1. Run one complete **task**: the main script, a \`setTimeout\` callback, an event.
2. When the call stack is empty, run **all pending microtasks**: promise callbacks (\`.then\`, \`await\`) and \`queueMicrotask\`.
3. Move on to the next task.

That is why a resolved promise is handled **before** a \`setTimeout(…, 0)\`.`,
    ),
    code(`console.log('1');
setTimeout(() => console.log('4: tarea'), 0);
Promise.resolve().then(() => console.log('3: microtarea'));
console.log('2');
// Imprime: 1, 2, 3: microtarea, 4: tarea`, 'javascript'),
    md(
      `## Promesas y async/await
Una **Promise** representa un valor que estará disponible en el futuro (o un error). \`async/await\` es una forma más legible de usarlas: una función \`async\` **siempre devuelve una Promise**, y \`await\` pausa esa función hasta que la promesa se resuelve. Los errores se manejan con \`try/catch\`.`,
      `## Promises and async/await
A **Promise** represents a value that will be available in the future (or an error). \`async/await\` is a more readable way to use them: an \`async\` function **always returns a Promise**, and \`await\` pauses that function until the promise settles. Errors are handled with \`try/catch\`.`,
    ),
    code(`async function cargarUsuario(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('No se pudo cargar', err);
    return null;
  }
}`, 'javascript'),
    warn('Un error común: usar `await` dentro de un `forEach`. No espera a que termine cada vuelta; usa `for...of` o `Promise.all`.', 'A common mistake: using `await` inside `forEach`. It does not wait for each iteration; use `for...of` or `Promise.all`.'),
    interview('"¿Qué imprime este código?" con `setTimeout` y promesas es una pregunta muy común. Aplica el orden: código síncrono → microtareas → tareas.', '"What does this code print?" with `setTimeout` and promises is a very common question. Apply the order: synchronous code → microtasks → tasks.'),
  ],
  quiz: [
    q('¿Qué imprime `console.log(1 == "1", 1 === "1")`?', 'What does `console.log(1 == "1", 1 === "1")` print?', [['true true', 'true true'], ['true false', 'true false'], ['false true', 'false true'], ['false false', 'false false']], 1,
      '`==` convierte el string a número; `===` también compara el tipo.', '`==` converts the string to a number; `===` also compares the type.'),
    q('¿Qué se ejecuta primero: un `.then()` de una promesa ya resuelta o un `setTimeout(…, 0)`?', 'Which runs first: a `.then()` on an already-resolved promise or a `setTimeout(…, 0)`?', [['El setTimeout', 'The setTimeout'], ['El .then()', 'The .then()'], ['Depende del navegador', 'It depends on the browser'], ['Se ejecutan a la vez', 'They run at the same time']], 1,
      'Las microtareas se vacían antes de pasar a la siguiente tarea.', 'Microtasks are drained before moving to the next task.'),
    q('Con `const arr = [1, 2]`, ¿qué pasa con `arr.push(3)`?', 'With `const arr = [1, 2]`, what happens with `arr.push(3)`?', [['Error: es const', 'Error: it is const'], ['Funciona: const impide reasignar, no modificar', 'It works: const prevents reassignment, not mutation'], ['Crea una copia', 'It creates a copy'], ['No hace nada', 'Nothing happens']], 1,
      '`arr = []` sí daría error; modificar su contenido no.', '`arr = []` would throw; changing its contents does not.'),
  ],
  concepts: [
    concept('Orden de ejecución del event loop', 'Event loop execution order', 'Código síncrono (tarea actual) → todas las microtareas (promesas) → siguiente tarea (setTimeout, eventos).', 'Synchronous code (current task) → all microtasks (promises) → next task (setTimeout, events).'),
    concept('¿Qué es un closure? Da un ejemplo', 'What is a closure? Give an example', 'Una función que recuerda las variables del ámbito donde se creó. Ej.: un contador que devuelve una función que incrementa una variable privada.', 'A function that remembers the variables of the scope where it was created. E.g. a counter that returns a function incrementing a private variable.'),
  ],
};

/** Introducción a system design: cubre los casos de system design */
export const SYSTEM_DESIGN_LESSON: Lesson = {
  id: 'system-design-intro',
  track: 'web',
  title: l('Introducción a system design', 'Introduction to system design'),
  summary: l('Cómo diseñar un sistema en una entrevista: marco de trabajo y piezas básicas.', 'How to design a system in an interview: a framework and the basic building blocks.'),
  minutes: 20,
  blocks: [
    md(
      `## ¿Qué evalúan?
En una entrevista de system design no hay una única respuesta correcta. Para un puesto junior se espera que **razones con orden**: que aclares qué hay que construir, propongas algo simple que funcione y sepas explicar qué pasaría con más usuarios.

## Marco de 5 pasos
1. **Requisitos.** Funcionales (qué hace) y no funcionales (cuántos usuarios, latencia, disponibilidad). **Pregunta antes de diseñar.**
2. **Estimaciones.** Peticiones por segundo, proporción lecturas/escrituras, almacenamiento. Bastan números aproximados.
3. **API y modelo de datos.** Endpoints principales y tablas con sus claves.
4. **Diseño de alto nivel.** Dibuja el camino de una petición: cliente → balanceador → servidores → caché/base de datos.
5. **Escalar y trade-offs.** Dónde estaría el cuello de botella y cómo lo resolverías.`,
      `## What is evaluated?
A system design interview has no single right answer. For a junior role you are expected to **reason in an orderly way**: clarify what to build, propose something simple that works and explain what would happen with more users.

## 5-step framework
1. **Requirements.** Functional (what it does) and non-functional (how many users, latency, availability). **Ask before designing.**
2. **Estimates.** Requests per second, read/write ratio, storage. Rough numbers are enough.
3. **API and data model.** Main endpoints and tables with their keys.
4. **High-level design.** Draw the path of a request: client → load balancer → servers → cache/database.
5. **Scale and trade-offs.** Where the bottleneck would be and how you would solve it.`,
    ),
    md(
      `## Piezas básicas
| Pieza | Para qué sirve |
|---|---|
| **Balanceador de carga** | Reparte las peticiones entre varios servidores. |
| **Servidores sin estado** | No guardan sesión en memoria, así puedes agregar más (**escalado horizontal**). |
| **Caché** (Redis, CDN) | Responde rápido lo que se pide mucho y baja la carga de la base de datos. |
| **Réplicas de lectura** | Copias de la base de datos que atienden lecturas. |
| **Particionado (sharding)** | Divide los datos entre varias bases cuando una sola ya no alcanza. |
| **Colas de mensajes** | Procesan trabajo en segundo plano (correos, conteos) sin hacer esperar al usuario. |

## Trade-offs que conviene mencionar
- **Consistencia vs disponibilidad** cuando hay fallas de red (teorema CAP).
- **Latencia vs costo:** más caché y más servidores son más rápidos, pero cuestan más.
- **Simplicidad primero:** empieza con un diseño de una sola base de datos y explica cuándo y por qué lo cambiarías.`,
      `## Basic building blocks
| Block | What it is for |
|---|---|
| **Load balancer** | Spreads requests across several servers. |
| **Stateless servers** | They keep no session in memory, so you can add more (**horizontal scaling**). |
| **Cache** (Redis, CDN) | Answers popular requests fast and lowers database load. |
| **Read replicas** | Database copies that serve reads. |
| **Partitioning (sharding)** | Splits data across several databases when one is no longer enough. |
| **Message queues** | Process work in the background (emails, counters) without making the user wait. |

## Trade-offs worth mentioning
- **Consistency vs availability** during network failures (CAP theorem).
- **Latency vs cost:** more cache and more servers are faster but cost more.
- **Simplicity first:** start with a single-database design and explain when and why you would change it.`,
    ),
    tip('Practica el marco con los casos de **Practicar → System design** (acortador de URLs, rate limiter, chat…).', 'Practice the framework with the cases in **Practice → System design** (URL shortener, rate limiter, chat…).'),
    interview('Piensa en voz alta y dibuja. Si el entrevistador cambia un requisito ("¿y con 100 veces más usuarios?"), no es que tu diseño esté mal: quiere ver cómo lo adaptas.', 'Think out loud and draw. If the interviewer changes a requirement ("what about 100x more users?"), your design is not wrong: they want to see how you adapt it.'),
  ],
  quiz: [
    q('¿Qué es lo primero que deberías hacer en una entrevista de system design?', 'What should you do first in a system design interview?', [['Elegir la base de datos', 'Pick the database'], ['Aclarar los requisitos', 'Clarify the requirements'], ['Dibujar los servidores', 'Draw the servers'], ['Hablar de sharding', 'Talk about sharding']], 1,
      'Sin requisitos claros puedes diseñar algo que no resuelve el problema.', 'Without clear requirements you may design something that does not solve the problem.'),
    q('¿Qué permite el escalado horizontal?', 'What enables horizontal scaling?', [['Servidores sin estado detrás de un balanceador', 'Stateless servers behind a load balancer'], ['Un servidor más potente', 'A more powerful server'], ['Desnormalizar la base', 'Denormalizing the database'], ['Usar UDP', 'Using UDP']], 0,
      'Si los servidores no guardan estado, cualquiera puede atender cualquier petición.', 'If servers hold no state, any of them can serve any request.'),
    q('Enviar correos de confirmación sin hacer esperar al usuario se resuelve con…', 'Sending confirmation emails without making the user wait is solved with…', [['Una réplica de lectura', 'A read replica'], ['Una cola de mensajes', 'A message queue'], ['Un índice', 'An index'], ['Una CDN', 'A CDN']], 1,
      'La petición encola el trabajo y un proceso aparte lo hace después.', 'The request enqueues the work and a separate worker does it later.'),
  ],
  concepts: [
    concept('Los 5 pasos de una entrevista de system design', 'The 5 steps of a system design interview', 'Requisitos → estimaciones → API y datos → diseño de alto nivel → escalar y trade-offs.', 'Requirements → estimates → API and data → high-level design → scale and trade-offs.'),
    concept('¿Para qué sirven la caché, las réplicas y las colas?', 'What are caches, replicas and queues for?', 'Caché: responder rápido lo popular. Réplicas: repartir las lecturas. Colas: hacer trabajo en segundo plano sin bloquear al usuario.', 'Cache: answer popular data fast. Replicas: spread reads. Queues: do background work without blocking the user.'),
  ],
};

/** Entrevista conductual: cubre las preguntas conductuales */
export const BEHAVIORAL_LESSON: Lesson = {
  id: 'behavioral-star',
  track: 'interview',
  title: l('Entrevista conductual y el método STAR', 'Behavioral interviews and the STAR method'),
  summary: l('Qué buscan las preguntas "cuéntame de una vez que…" y cómo responderlas.', 'What "tell me about a time when…" questions look for and how to answer them.'),
  minutes: 14,
  blocks: [
    md(
      `## ¿Qué es una entrevista conductual?
Son preguntas sobre **situaciones reales que viviste**: "Cuéntame de una vez que tuviste un conflicto", "¿Cuál fue tu mayor error?". Parten de una idea simple: **cómo actuaste en el pasado es la mejor pista de cómo actuarás después**. Muchas empresas usan *entrevistas estructuradas*: hacen las mismas preguntas a todos los candidatos y las califican con criterios definidos de antemano.

Lo que evalúan: trabajo en equipo, comunicación, cómo manejas errores y presión, iniciativa y si aprendes rápido.

## El método STAR
Organiza cada respuesta en cuatro partes:
- **S — Situación:** el contexto, breve. Dónde estabas y qué pasaba.
- **T — Tarea:** cuál era **tu** responsabilidad o el reto.
- **A — Acción:** lo que **tú** hiciste, paso a paso. Es la parte más larga. Di "yo", no "nosotros".
- **R — Resultado:** qué pasó al final, idealmente con un dato concreto, y qué aprendiste.

Como guía, una respuesta dura **1.5 a 2 minutos**.`,
      `## What is a behavioral interview?
These are questions about **real situations you lived through**: "Tell me about a time you had a conflict", "What was your biggest mistake?". The idea is simple: **how you acted in the past is the best hint of how you will act later**. Many companies use *structured interviews*: they ask every candidate the same questions and score them with criteria defined in advance.

What they evaluate: teamwork, communication, how you handle mistakes and pressure, initiative and whether you learn fast.

## The STAR method
Organize every answer in four parts:
- **S — Situation:** the context, briefly. Where you were and what was going on.
- **T — Task:** what **your** responsibility or challenge was.
- **A — Action:** what **you** did, step by step. This is the longest part. Say "I", not "we".
- **R — Result:** what happened in the end, ideally with a concrete figure, and what you learned.

As a guide, an answer takes **1.5 to 2 minutes**.`,
    ),
    md(
      `## Prepara un banco de historias
No necesitas una historia por pregunta. Prepara **5 a 8 historias** (proyectos, prácticas, trabajos en equipo de la escuela) y etiquétalas: conflicto, error, logro, liderazgo, presión, aprendizaje. Una buena historia responde varias preguntas. Puedes escribirlas en **Practicar → Conductuales**.

## Errores comunes
- Contar solo lo que hizo el equipo y no dejar claro **tu** papel.
- Quedarte en la situación y nunca llegar al resultado.
- Elegir un "error" falso ("soy demasiado perfeccionista").
- Hablar mal de compañeros o jefes anteriores.`,
      `## Build a story bank
You do not need one story per question. Prepare **5 to 8 stories** (projects, internships, school team work) and tag them: conflict, mistake, achievement, leadership, pressure, learning. One good story answers several questions. You can write them in **Practice → Behavioral**.

## Common mistakes
- Telling only what the team did without making **your** role clear.
- Staying in the situation and never reaching the result.
- Picking a fake "mistake" ("I am too much of a perfectionist").
- Badmouthing former teammates or bosses.`,
    ),
    interview('Al final de la entrevista casi siempre te preguntan "¿Tienes preguntas para nosotros?". Lleva 2 o 3 preparadas: cómo es un día típico, cómo miden el éxito en el puesto, cómo es el onboarding.', 'At the end you are almost always asked "Do you have any questions for us?". Bring 2 or 3 ready: what a typical day looks like, how success is measured in the role, what onboarding is like.'),
  ],
  quiz: [
    q('¿Qué significa la "A" de STAR y cuánto peso debe tener?', 'What does the "A" in STAR mean and how much weight should it get?', [['Actitud; poco', 'Attitude; little'], ['Acción; es la parte más larga', 'Action; it is the longest part'], ['Análisis; lo mismo que las demás', 'Analysis; same as the others'], ['Aprendizaje; solo al final', 'Learning; only at the end']], 1,
      'Lo que tú hiciste es lo que más quieren conocer.', 'What you did is what they most want to know.'),
    q('¿Por qué decir "yo" en vez de "nosotros"?', 'Why say "I" instead of "we"?', [['Para sonar más seguro', 'To sound more confident'], ['Porque evalúan tu aporte individual', 'Because they evaluate your individual contribution'], ['Es una regla gramatical', 'It is a grammar rule'], ['No importa', 'It does not matter']], 1,
      'Quieren saber qué harías tú en su equipo.', 'They want to know what you would do on their team.'),
    q('¿Cuántas historias conviene preparar?', 'How many stories should you prepare?', [['Una por cada pregunta posible', 'One per possible question'], ['Una sola muy buena', 'A single great one'], ['Entre 5 y 8 reutilizables', 'Between 5 and 8 reusable ones'], ['Ninguna: es mejor improvisar', 'None: improvising is better']], 2,
      'Cada historia bien elegida cubre varias preguntas.', 'Each well-chosen story covers several questions.'),
  ],
  concepts: [
    concept('Las 4 partes del método STAR', 'The 4 parts of the STAR method', 'Situación, Tarea, Acción (la más larga, en primera persona) y Resultado (con un dato concreto y lo que aprendiste).', 'Situation, Task, Action (the longest, in first person) and Result (with a concrete figure and what you learned).'),
  ],
};
