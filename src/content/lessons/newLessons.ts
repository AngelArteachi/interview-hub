import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

/** JavaScript: cubre las flashcards js-* */
export const JS_LESSON: Lesson = {
  id: 'javascript-essentials',
  track: 'web',
  title: l('JavaScript esencial', 'Essential JavaScript'),
  summary: l('Lo que más preguntan de JavaScript: su sintaxis frente a Python, var/let/const, == vs ===, closures, el event loop y promesas con async/await.', 'What is asked most about JavaScript: its syntax compared to Python, var/let/const, == vs ===, closures, the event loop and promises with async/await.'),
  minutes: 24,
  blocks: [
    md(
      `## ¿Por qué JavaScript?
Es **el lenguaje del navegador**: todo lo interactivo de una página web corre en JavaScript. Con **Node.js** también corre en servidores. Por eso, en entrevistas de web casi siempre hay preguntas de JavaScript, aunque trabajes en otro lenguaje.

Si ya sabes Python, esto es lo básico para leerlo:
| Python | JavaScript |
|---|---|
| \`print(x)\` | \`console.log(x)\` |
| \`x = 5\` | \`let x = 5;\` o \`const x = 5;\` |
| \`def doble(n): return n * 2\` | \`function doble(n) { return n * 2; }\` o \`const doble = (n) => n * 2;\` |
| \`f"Hola {nombre}"\` | \`\` \`Hola \${nombre}\` \`\` (con acentos graves) |
| \`[1, 2, 3]\` / \`{"a": 1}\` | \`[1, 2, 3]\` / \`{ a: 1 }\` |
| \`True\`, \`False\`, \`None\` | \`true\`, \`false\`, \`null\` (y también \`undefined\`) |
| \`==\` | \`===\` (ya verás por qué) |

Los bloques van entre llaves \`{ }\` en vez de sangría, y las líneas suelen terminar en \`;\`. \`(n) => n * 2\` es una **función flecha**: una forma corta de escribir una función.`,
      `## Why JavaScript?
It is **the browser's language**: everything interactive on a web page runs in JavaScript. With **Node.js** it also runs on servers. That is why web interviews almost always include JavaScript questions, even if you work in another language.

If you already know Python, these are the basics to read it:
| Python | JavaScript |
|---|---|
| \`print(x)\` | \`console.log(x)\` |
| \`x = 5\` | \`let x = 5;\` or \`const x = 5;\` |
| \`def double(n): return n * 2\` | \`function double(n) { return n * 2; }\` or \`const double = (n) => n * 2;\` |
| \`f"Hi {name}"\` | \`\` \`Hi \${name}\` \`\` (with backticks) |
| \`[1, 2, 3]\` / \`{"a": 1}\` | \`[1, 2, 3]\` / \`{ a: 1 }\` |
| \`True\`, \`False\`, \`None\` | \`true\`, \`false\`, \`null\` (and also \`undefined\`) |
| \`==\` | \`===\` (you will see why) |

Blocks go between braces \`{ }\` instead of indentation, and lines usually end in \`;\`. \`(n) => n * 2\` is an **arrow function**: a short way to write a function.`,
    ),
    md(
      `## var, let y const
Hay tres formas de declarar una variable:
- \`let\`: una variable que **puedes reasignar**. Vive solo dentro del **bloque** \`{ }\` donde la declaraste.
- \`const\`: **no puedes reasignarla**. También vive en su bloque. Ojo: si guarda un arreglo u objeto, **su contenido sí se puede cambiar**; lo que no puedes es apuntarla a otro arreglo.
- \`var\`: la forma antigua. Vive en **toda la función** (no respeta los bloques) y se "eleva" (*hoisting*): existe desde el inicio de la función con valor \`undefined\`. Eso causa errores difíciles de ver.

Con \`let\` y \`const\`, usar la variable **antes** de la línea donde se declara lanza un error: ese tramo se llama **zona muerta temporal** (TDZ).

**Analogía de \`const\`:** una etiqueta pegada a una caja. No puedes despegarla y pegarla en otra caja, pero sí puedes cambiar lo que hay dentro.

**Regla práctica:** \`const\` por defecto, \`let\` si vas a reasignar, y evita \`var\`. \`typeof x\` dice el tipo de \`x\`, o \`"undefined"\` si no existe.`,
      `## var, let and const
There are three ways to declare a variable:
- \`let\`: a variable you **can reassign**. It lives only inside the **block** \`{ }\` where you declared it.
- \`const\`: you **cannot reassign** it. It also lives in its block. Careful: if it holds an array or object, **its contents can change**; what you cannot do is point it to another array.
- \`var\`: the old way. It lives in **the whole function** (it ignores blocks) and is "hoisted": it exists from the start of the function with the value \`undefined\`. That causes hard-to-see bugs.

With \`let\` and \`const\`, using the variable **before** the line where it is declared throws an error: that stretch is called the **temporal dead zone** (TDZ).

**Analogy for \`const\`:** a label stuck on a box. You cannot peel it off and stick it on another box, but you can change what is inside.

**Rule of thumb:** \`const\` by default, \`let\` if you will reassign, and avoid \`var\`. \`typeof x\` gives the type of \`x\`, or \`"undefined"\` if it does not exist.`,
    ),
    code(`const lista = [1, 2];
lista.push(3);                  // ✅ se puede: cambias el contenido, no la variable
console.log(lista.join(", "));  // imprime: 1, 2, 3

if (true) {
  var a = "soy var";            // ámbito de función: se ve fuera del bloque
  let b = "soy let";            // ámbito de bloque: solo existe dentro de { }
}
console.log(a);                 // imprime: soy var
console.log(typeof b);          // imprime: undefined`, 'javascript'),
    md(
      `## == vs ===
- \`===\` (**igualdad estricta**) compara **valor y tipo** sin convertir nada: \`1 === "1"\` es \`false\`.
- \`==\` (**igualdad débil**) **convierte los tipos** antes de comparar, con reglas que sorprenden: \`1 == "1"\` es \`true\`, \`0 == ""\` es \`true\` y \`null == undefined\` es \`true\`.

Usa \`===\` casi siempre.

**Valores "falsos" (*falsy*):** en un \`if\`, cuentan como falso \`false\`, \`0\`, \`""\` (texto vacío), \`null\`, \`undefined\` y \`NaN\` ("no es un número"). Todo lo demás cuenta como verdadero, **incluso** \`[]\` y \`{}\` vacíos (a diferencia de Python).`,
      `## == vs ===
- \`===\` (**strict equality**) compares **value and type** without converting anything: \`1 === "1"\` is \`false\`.
- \`==\` (**loose equality**) **converts types** before comparing, with surprising rules: \`1 == "1"\` is \`true\`, \`0 == ""\` is \`true\` and \`null == undefined\` is \`true\`.

Use \`===\` almost always.

**"Falsy" values:** in an \`if\`, these count as false: \`false\`, \`0\`, \`""\` (empty text), \`null\`, \`undefined\` and \`NaN\` ("not a number"). Everything else counts as true, **even** empty \`[]\` and \`{}\` (unlike Python).`,
    ),
    md(
      `## Closures
Un **closure** es una función que **recuerda las variables del lugar donde se creó**, aunque esa función de afuera ya haya terminado.

**Analogía:** una mochila. Cuando una función nace dentro de otra, se lleva en su mochila las variables que tenía alrededor, y las sigue usando después.

Sirven para tener **estado privado**: en el ejemplo, nadie de afuera puede tocar \`cuenta\` directamente, solo a través de la función. Y cada llamada a \`crearContador()\` crea **su propia** \`cuenta\`.`,
      `## Closures
A **closure** is a function that **remembers the variables of the place where it was created**, even after that outer function has finished.

**Analogy:** a backpack. When a function is born inside another, it carries in its backpack the variables that were around it, and keeps using them later.

They are useful for **private state**: in the example, nobody outside can touch \`cuenta\` directly, only through the function. And each call to \`crearContador()\` creates **its own** \`cuenta\`.`,
    ),
    code(`function crearContador() {
  let cuenta = 0;               // variable "privada"
  return () => ++cuenta;        // la función se lleva 'cuenta' en su mochila
}

const siguiente = crearContador();
siguiente();
console.log(siguiente());       // imprime: 2

const otro = crearContador();   // otro contador, con su propia 'cuenta'
console.log(otro());            // imprime: 1`, 'javascript'),
    md(
      `## El event loop
JavaScript ejecuta tu código en **un solo hilo**: hace una cosa a la vez. Pero lo que tarda (un temporizador, una petición de red) **no bloquea**: se registra, y su función (*callback*) se ejecuta después. El **event loop** decide el orden:
1. Ejecuta una **tarea** completa: el script principal, un callback de \`setTimeout\`, un clic.
2. Cuando termina, ejecuta **todas las microtareas** pendientes: los callbacks de promesas (\`.then\`, lo que sigue a un \`await\`) y \`queueMicrotask\`.
3. Pasa a la siguiente tarea.

Por eso una promesa ya resuelta se atiende **antes** que un \`setTimeout(…, 0)\`, aunque el 0 parezca "inmediato".

**Analogía:** un cocinero que atiende un pedido a la vez. Lo que va al horno (\`setTimeout\`) espera su turno en la fila de pedidos. Pero las notas urgentes (microtareas) las atiende en cuanto termina el pedido actual, antes de tomar el siguiente.`,
      `## The event loop
JavaScript runs your code on **a single thread**: it does one thing at a time. But what takes time (a timer, a network request) **does not block**: it is registered, and its function (*callback*) runs later. The **event loop** decides the order:
1. Run one complete **task**: the main script, a \`setTimeout\` callback, a click.
2. When it finishes, run **all pending microtasks**: promise callbacks (\`.then\`, what follows an \`await\`) and \`queueMicrotask\`.
3. Move to the next task.

That is why an already resolved promise is handled **before** a \`setTimeout(…, 0)\`, even though the 0 looks "immediate".

**Analogy:** a cook who handles one order at a time. What goes in the oven (\`setTimeout\`) waits its turn in the line of orders. But urgent notes (microtasks) are handled as soon as the current order is done, before taking the next one.`,
    ),
    code(`console.log("1: síncrono");
setTimeout(() => console.log("4: tarea"), 0);
Promise.resolve().then(() => console.log("3: microtarea"));
console.log("2: síncrono");
// imprime:
// 1: síncrono
// 2: síncrono
// 3: microtarea
// 4: tarea`, 'javascript'),
    md(
      `## Promesas y async/await
Una **Promise** (promesa) representa un valor que **estará listo en el futuro**, como la respuesta de una petición de red. Puede **resolverse** (con un valor) o **rechazarse** (con un error).

\`async/await\` es la forma legible de usarlas:
- Una función \`async\` **siempre devuelve una promesa**.
- \`await promesa\` **pausa esa función** hasta que la promesa se resuelve, y te da su valor. Mientras tanto, el resto del programa sigue corriendo.
- Los errores se atrapan con \`try { … } catch (err) { … }\`, el equivalente de \`try/except\`. \`throw new Error("…")\` lanza uno, como \`raise\`.

\`fetch(url)\` hace una petición HTTP y devuelve una promesa con la respuesta.`,
      `## Promises and async/await
A **Promise** represents a value that **will be ready in the future**, like the response of a network request. It can **resolve** (with a value) or **reject** (with an error).

\`async/await\` is the readable way to use them:
- An \`async\` function **always returns a promise**.
- \`await promise\` **pauses that function** until the promise resolves, and gives you its value. Meanwhile, the rest of the program keeps running.
- Errors are caught with \`try { … } catch (err) { … }\`, the equivalent of \`try/except\`. \`throw new Error("…")\` raises one, like \`raise\`.

\`fetch(url)\` makes an HTTP request and returns a promise with the response.`,
    ),
    code(`async function cargarUsuario(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);   // espera la respuesta sin bloquear la página
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();                         // espera a que se lea el body como JSON
  } catch (err) {
    console.error("No se pudo cargar", err);
    return null;
  }
}`, 'javascript'),
    warn('Un error común: usar `await` dentro de un `forEach`. `forEach` no espera a que termine cada vuelta; usa `for...of` (una por una) o `Promise.all` (todas a la vez).', 'A common mistake: using `await` inside a `forEach`. `forEach` does not wait for each iteration to finish; use `for...of` (one by one) or `Promise.all` (all at once).'),
    interview('"¿Qué imprime este código?" con `setTimeout` y promesas es muy común. Aplica el orden: primero todo el código síncrono, luego las microtareas (promesas) y al final las tareas (`setTimeout`).', '"What does this code print?" with `setTimeout` and promises is very common. Apply the order: first all synchronous code, then microtasks (promises) and finally tasks (`setTimeout`).'),
    md(
      `## Resumen
| Tema | En una frase |
|---|---|
| \`let\` / \`const\` / \`var\` | Bloque y reasignable / bloque y no reasignable (el contenido sí cambia) / función y con *hoisting*: evítalo |
| \`===\` vs \`==\` | Estricta sin conversiones / convierte tipos y sorprende: usa \`===\` |
| Falsy | \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`; \`[]\` y \`{}\` cuentan como verdaderos |
| Closure | Función que recuerda las variables de donde nació; sirve para estado privado |
| Event loop | Un hilo: tarea completa → todas las microtareas → siguiente tarea |
| Promesas | \`.then\` y \`await\` son microtareas: van antes que \`setTimeout\` |
| \`async/await\` | \`async\` devuelve una promesa; \`await\` pausa solo esa función; errores con \`try/catch\` |`,
      `## Summary
| Topic | In one sentence |
|---|---|
| \`let\` / \`const\` / \`var\` | Block and reassignable / block and not reassignable (contents can change) / function and hoisted: avoid it |
| \`===\` vs \`==\` | Strict with no conversions / converts types and surprises: use \`===\` |
| Falsy | \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`; \`[]\` and \`{}\` count as true |
| Closure | A function remembering the variables of where it was born; good for private state |
| Event loop | One thread: a whole task → all microtasks → next task |
| Promises | \`.then\` and \`await\` are microtasks: they go before \`setTimeout\` |
| \`async/await\` | \`async\` returns a promise; \`await\` pauses only that function; errors with \`try/catch\` |`,
    ),
  ],
  quiz: [
    q('¿Qué imprime `console.log(1 == "1", 1 === "1")`?', 'What does `console.log(1 == "1", 1 === "1")` print?', [['true true', 'true true'], ['true false', 'true false'], ['false true', 'false true'], ['false false', 'false false']], 1,
      '`==` convierte el texto a número; `===` también compara el tipo.', '`==` converts the text to a number; `===` also compares the type.'),
    q('¿Qué se ejecuta primero: un `.then()` de una promesa ya resuelta o un `setTimeout(…, 0)`?', 'What runs first: a `.then()` of an already resolved promise or a `setTimeout(…, 0)`?', [['El `setTimeout`', 'The `setTimeout`'], ['El `.then()`', 'The `.then()`'], ['Depende del navegador', 'It depends on the browser'], ['Al mismo tiempo', 'At the same time']], 1,
      'Las microtareas (promesas) se vacían antes de pasar a la siguiente tarea (`setTimeout`).', 'Microtasks (promises) are drained before moving to the next task (`setTimeout`).'),
    q('Con `const arr = [1, 2]`, ¿qué pasa con `arr.push(3)`?', 'With `const arr = [1, 2]`, what happens with `arr.push(3)`?', [['Error: es constante', 'Error: it is constant'], ['Funciona: `const` impide reasignar, no modificar el contenido', 'It works: `const` prevents reassignment, not changing the contents'], ['Crea una copia', 'It creates a copy'], ['No hace nada', 'It does nothing']], 1,
      'Lo que daría error es `arr = [5]`.', 'What would fail is `arr = [5]`.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('¿Cómo se escribe `print(x)` de Python en JavaScript?', 'How do you write Python\'s `print(x)` in JavaScript?', [['`echo(x)`', '`echo(x)`'], ['`console.log(x)`', '`console.log(x)`'], ['`print(x)`', '`print(x)`'], ['`System.out(x)`', '`System.out(x)`']], 1,
      'En el navegador lo verás en la consola de las herramientas de desarrollador.', 'In the browser you will see it in the developer tools console.'),
    q('¿Qué es `(n) => n * 2`?', 'What is `(n) => n * 2`?', [['Una comparación', 'A comparison'], ['Una función flecha: recibe `n` y devuelve `n * 2`', 'An arrow function: it receives `n` and returns `n * 2`'], ['Un objeto', 'An object'], ['Un error de sintaxis', 'A syntax error']], 1,
      'Es una forma corta de `function (n) { return n * 2; }`.', 'It is a short form of `function (n) { return n * 2; }`.'),
    q('Declaras `let b` dentro de un `if { }`. ¿Existe `b` fuera de esas llaves?', 'You declare `let b` inside an `if { }`. Does `b` exist outside those braces?', [['Sí, en toda la función', 'Yes, in the whole function'], ['No: `let` vive solo en su bloque', 'No: `let` lives only in its block'], ['Solo si es un número', 'Only if it is a number'], ['Solo en modo estricto', 'Only in strict mode']], 1,
      'Con `var` sí existiría fuera, porque `var` ignora los bloques.', 'With `var` it would exist outside, because `var` ignores blocks.'),
    q('¿Qué es la **zona muerta temporal** (TDZ)?', 'What is the **temporal dead zone** (TDZ)?', [['Un tiempo de espera de `setTimeout`', 'A `setTimeout` delay'], ['El tramo antes de la declaración de un `let`/`const`, donde usarla lanza un error', 'The stretch before a `let`/`const` declaration, where using it throws an error'], ['Una variable borrada', 'A deleted variable'], ['El final de una función', 'The end of a function']], 1,
      'Con `var`, en cambio, la variable existe desde el inicio con valor `undefined`.', 'With `var`, instead, the variable exists from the start with the value `undefined`.'),
    q('¿Cuál de estos valores es **verdadero** en un `if` de JavaScript?', 'Which of these values is **truthy** in a JavaScript `if`?', [['`0`', '`0`'], ['`""`', '`""`'], ['`null`', '`null`'], ['`[]` (un arreglo vacío)', '`[]` (an empty array)']], 3,
      'A diferencia de Python, un arreglo vacío cuenta como verdadero. Los falsy son `false`, `0`, `""`, `null`, `undefined` y `NaN`.', 'Unlike Python, an empty array counts as true. The falsy ones are `false`, `0`, `""`, `null`, `undefined` and `NaN`.'),
    q('¿Qué es un **closure**?', 'What is a **closure**?', [['Una función que recuerda las variables del lugar donde se creó', 'A function that remembers the variables of the place where it was created'], ['Una función que cierra el programa', 'A function that closes the program'], ['Un tipo de bucle', 'A kind of loop'], ['Una promesa rechazada', 'A rejected promise']], 0,
      'Sirve para tener estado privado, como el contador del ejemplo.', 'It is useful for private state, like the counter in the example.'),
    q('Creas dos contadores con `crearContador()` y llamas al primero dos veces. ¿Qué devuelve la primera llamada al segundo?', 'You create two counters with `crearContador()` and call the first one twice. What does the first call to the second return?', [['3', '3'], ['2', '2'], ['1', '1'], ['0', '0']], 2,
      'Cada llamada a `crearContador()` crea su propia variable `cuenta`.', 'Each call to `crearContador()` creates its own `cuenta` variable.'),
    q('¿En qué orden trabaja el event loop?', 'In what order does the event loop work?', [['Todas las tareas primero y luego las microtareas', 'All tasks first and then the microtasks'], ['Una tarea completa, luego todas las microtareas pendientes, luego la siguiente tarea', 'One whole task, then all pending microtasks, then the next task'], ['Al azar', 'At random'], ['Por orden alfabético', 'Alphabetically']], 1,
      'Por eso el código síncrono va primero, luego las promesas y al final los `setTimeout`.', 'That is why synchronous code goes first, then promises and finally the `setTimeout`s.'),
    q('¿Qué devuelve siempre una función `async`?', 'What does an `async` function always return?', [['Un número', 'A number'], ['`undefined`', '`undefined`'], ['Una promesa', 'A promise'], ['Un error', 'An error']], 2,
      'Aunque escribas `return 5`, quien la llama recibe una promesa que se resuelve con 5.', 'Even if you write `return 5`, the caller gets a promise that resolves to 5.'),
    q('¿Qué hace `await` dentro de una función `async`?', 'What does `await` do inside an `async` function?', [['Bloquea toda la página hasta que termine', 'Blocks the whole page until it finishes'], ['Pausa solo esa función hasta que la promesa se resuelva; el resto del programa sigue', 'Pauses only that function until the promise resolves; the rest of the program continues'], ['Repite la petición', 'Repeats the request'], ['Ignora los errores', 'Ignores errors']], 1,
      'Los errores de la promesa se atrapan con `try/catch`.', 'The promise\'s errors are caught with `try/catch`.'),
    q('¿Por qué no conviene usar `await` dentro de un `forEach`?', 'Why should you not use `await` inside a `forEach`?', [['Porque da error de sintaxis', 'Because it is a syntax error'], ['Porque `forEach` no espera a que termine cada vuelta; usa `for...of` o `Promise.all`', 'Because `forEach` does not wait for each iteration; use `for...of` or `Promise.all`'], ['Porque es más lento', 'Because it is slower'], ['Sí conviene', 'It is fine']], 1,
      '`for...of` espera una por una; `Promise.all` las lanza todas y espera a que terminen.', '`for...of` waits one by one; `Promise.all` starts them all and waits for them to finish.'),
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
  title: l('Introducción a system design', 'Intro to system design'),
  summary: l('Qué evalúan en una entrevista de diseño de sistemas, el marco de 5 pasos, cómo estimar, las piezas básicas (balanceador, caché, réplicas, sharding, colas) y un ejemplo completo: un acortador de URLs.', 'What a system design interview evaluates, the 5-step framework, how to estimate, the basic pieces (load balancer, cache, replicas, sharding, queues) and a full example: a URL shortener.'),
  minutes: 26,
  blocks: [
    md(
      `## ¿Qué evalúan?
En una entrevista de **system design** te piden diseñar un sistema completo ("diseña un acortador de URLs", "diseña un chat"). **No hay una única respuesta correcta.** Para un puesto junior se espera que **razones con orden**: que aclares qué hay que construir, propongas algo **simple que funcione** y sepas explicar qué pasaría con muchos más usuarios.

## El marco de 5 pasos
1. **Requisitos.** Qué debe hacer el sistema (**funcionales**: "acortar una URL y redirigir") y con qué exigencias (**no funcionales**: cuántos usuarios, qué tan rápido, qué tanto puede fallar). **Pregunta antes de diseñar.**
2. **Estimaciones.** Peticiones por segundo, proporción de lecturas y escrituras, almacenamiento. Bastan números aproximados.
3. **API y modelo de datos.** Los endpoints principales y las tablas con sus claves.
4. **Diseño de alto nivel.** Dibuja el camino de una petición: cliente → balanceador → servidores → caché / base de datos.
5. **Escalar y trade-offs.** Dónde estaría el cuello de botella y cómo lo resolverías, con sus pros y contras.`,
      `## What do they evaluate?
In a **system design** interview you are asked to design a whole system ("design a URL shortener", "design a chat"). **There is no single right answer.** For a junior role you are expected to **reason in order**: clarify what has to be built, propose something **simple that works** and explain what would happen with many more users.

## The 5-step framework
1. **Requirements.** What the system must do (**functional**: "shorten a URL and redirect") and under which demands (**non-functional**: how many users, how fast, how much downtime is acceptable). **Ask before designing.**
2. **Estimates.** Requests per second, read/write ratio, storage. Rough numbers are enough.
3. **API and data model.** The main endpoints and the tables with their keys.
4. **High-level design.** Draw a request's path: client → load balancer → servers → cache / database.
5. **Scaling and trade-offs.** Where the bottleneck would be and how you would fix it, with pros and cons.`,
    ),
    md(
      `## Estimar sin calculadora
Las estimaciones sirven para saber **qué tan grande** es el problema: no es lo mismo 10 peticiones por segundo que 100,000.
- Un día tiene **86,400 segundos**: unos **10⁵**. Para pasar de "por día" a "por segundo", divide entre 100,000 (aproximado).
- **Peticiones por segundo (QPS)** = usuarios al día × acciones por usuario ÷ 86,400. El **pico** suele ser varias veces el promedio.
- **Lecturas vs escrituras:** en muchos sistemas se lee mucho más de lo que se escribe (un enlace se crea una vez y se abre miles), y eso te dice dónde poner caché.
- **Almacenamiento** = cuántos elementos × tamaño de cada uno × cuánto tiempo los guardas.`,
      `## Estimating without a calculator
Estimates tell you **how big** the problem is: 10 requests per second is not the same as 100,000.
- A day has **86,400 seconds**: about **10⁵**. To go from "per day" to "per second", divide by 100,000 (roughly).
- **Queries per second (QPS)** = daily users × actions per user ÷ 86,400. The **peak** is usually several times the average.
- **Reads vs writes:** in many systems far more is read than written (a link is created once and opened thousands of times), and that tells you where to put a cache.
- **Storage** = how many items × size of each × how long you keep them.`,
    ),
    code(`usuarios_diarios = 1_000_000
acciones_por_usuario = 10
segundos_al_dia = 24 * 60 * 60                    # 86,400

qps = usuarios_diarios * acciones_por_usuario / segundos_al_dia
print(round(qps))                                  # imprime: 116   (peticiones por segundo en promedio)
print(round(qps * 3))                              # imprime: 347   (el pico suele ser varias veces el promedio)

urls_nuevas_al_dia = 100_000
bytes_por_url = 500
gb_en_5_anios = urls_nuevas_al_dia * 365 * 5 * bytes_por_url / 1_000_000_000
print(round(gb_en_5_anios))                        # imprime: 91    (GB: cabe de sobra en una sola base)`),
    md(
      `## Las piezas básicas
| Pieza | Para qué sirve | Analogía |
|---|---|---|
| **Balanceador de carga** | Reparte las peticiones entre varios servidores; si uno se cae, deja de mandarle | La recepcionista que manda a cada cliente a una caja libre |
| **Servidores sin estado** | No guardan nada de la sesión en su memoria, así que cualquiera puede atender cualquier petición | Cajeros intercambiables |
| **Caché** (Redis, CDN) | Responde rápido lo que se pide mucho y baja la carga de la base de datos | Los libros que más usas, en tu escritorio |
| **Réplicas de lectura** | Copias de la base de datos que atienden lecturas | Varias copias del mismo catálogo |
| **Particionado (sharding)** | Reparte los datos entre varias bases cuando una sola ya no alcanza | Dividir el archivero por letra |
| **Cola de mensajes** | Guarda trabajo para hacerlo en segundo plano (correos, procesar videos) sin hacer esperar al usuario | Un buzón: lo dejas y alguien lo atiende después |

## Escalar: vertical u horizontal
- **Vertical:** un servidor más potente. Simple, pero con techo, caro, y si ese servidor se cae, se cae todo.
- **Horizontal:** más servidores detrás de un balanceador. Para que funcione, los servidores deben ser **sin estado**: la sesión se guarda en un lugar compartido (como Redis) y no en la memoria de un servidor. Si no, el usuario "perdería" su sesión cada vez que el balanceador lo mandara a otro servidor.`,
      `## The basic pieces
| Piece | What it is for | Analogy |
|---|---|---|
| **Load balancer** | Spreads requests across several servers; if one goes down, it stops sending to it | The receptionist who sends each customer to a free counter |
| **Stateless servers** | They keep no session data in memory, so any of them can serve any request | Interchangeable cashiers |
| **Cache** (Redis, CDN) | Answers what is requested often quickly and lowers database load | The books you use most, on your desk |
| **Read replicas** | Copies of the database that serve reads | Several copies of the same catalog |
| **Partitioning (sharding)** | Splits data across several databases when one is no longer enough | Splitting the filing cabinet by letter |
| **Message queue** | Stores work to do in the background (emails, video processing) without making the user wait | A mailbox: you drop it off and someone handles it later |

## Scaling: vertical or horizontal
- **Vertical:** a more powerful server. Simple, but with a ceiling, expensive, and if that server goes down, everything does.
- **Horizontal:** more servers behind a load balancer. For it to work, servers must be **stateless**: the session is kept in a shared place (like Redis) and not in one server's memory. Otherwise the user would "lose" their session every time the load balancer sent them to another server.`,
    ),
    md(
      `## Ejemplo completo: un acortador de URLs
1. **Requisitos.** Funcionales: dada una URL larga, devolver una corta (\`ejem.pl/4c92\`); al abrir la corta, **redirigir** a la larga. No funcionales: muchísimas más lecturas que escrituras, redirección muy rápida, los enlaces no deben perderse.
2. **Estimaciones.** Con 100,000 URLs nuevas al día y 100 lecturas por cada una: ~1 escritura y ~116 lecturas por segundo en promedio. Unos 91 GB en 5 años (el cálculo de arriba).
3. **API y datos.** \`POST /urls\` con la URL larga → devuelve el código. \`GET /{codigo}\` → responde **301** o **302** con el header \`Location\` apuntando a la URL larga. Una tabla: \`codigo\` (clave primaria) → \`url_larga\`.
4. **Diseño.** Cliente → balanceador → servidores sin estado → **caché** (los códigos populares) → base de datos.
5. **Escalar.** Las lecturas dominan: caché para los enlaces populares y réplicas de lectura. Si los datos crecen muchísimo, sharding por código.

**¿Cómo se genera el código corto?** Una forma común es dar a cada URL un **id numérico** que crece (1, 2, 3…) y escribirlo en **base 62** (dígitos, minúsculas y mayúsculas): así es corto y nunca se repite. Con 7 caracteres caben 62⁷, unos 3.5 billones de códigos.`,
      `## Full example: a URL shortener
1. **Requirements.** Functional: given a long URL, return a short one (\`ejem.pl/4c92\`); when the short one is opened, **redirect** to the long one. Non-functional: far more reads than writes, very fast redirects, links must not be lost.
2. **Estimates.** With 100,000 new URLs a day and 100 reads each: ~1 write and ~116 reads per second on average. About 91 GB in 5 years (the calculation above).
3. **API and data.** \`POST /urls\` with the long URL → returns the code. \`GET /{code}\` → answers **301** or **302** with the \`Location\` header pointing to the long URL. One table: \`code\` (primary key) → \`long_url\`.
4. **Design.** Client → load balancer → stateless servers → **cache** (the popular codes) → database.
5. **Scaling.** Reads dominate: a cache for popular links and read replicas. If the data grows hugely, sharding by code.

**How is the short code generated?** A common way is to give each URL a growing **numeric id** (1, 2, 3…) and write it in **base 62** (digits, lowercase and uppercase): that way it is short and never repeats. With 7 characters there are 62⁷, about 3.5 trillion codes.`,
    ),
    code(`ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"   # 62 símbolos

def codigo_corto(n):              # convierte el id numérico en un código corto
    if n == 0:
        return ALFABETO[0]
    res = ""
    while n > 0:
        res = ALFABETO[n % 62] + res     # el residuo da el último símbolo
        n //= 62
    return res

print(codigo_corto(125), codigo_corto(1_000_000))   # imprime: 21 4c92`),
    md(
      `## Trade-offs que conviene mencionar
- **Consistencia vs disponibilidad** cuando hay fallas de red (el teorema CAP de la lección de NoSQL).
- **Latencia vs costo:** más caché y más servidores responden más rápido, pero cuestan más.
- **Simplicidad primero:** empieza con un diseño de **una sola base de datos** y explica cuándo y por qué lo cambiarías. Un diseño complicado sin necesidad no suma puntos.`,
      `## Trade-offs worth mentioning
- **Consistency vs availability** during network failures (the CAP theorem from the NoSQL lesson).
- **Latency vs cost:** more cache and more servers answer faster, but cost more.
- **Simplicity first:** start with a **single-database** design and explain when and why you would change it. An unnecessarily complicated design earns no points.`,
    ),
    tip('Practica el marco con los casos de **Practicar → System design** (acortador de URLs, rate limiter, chat…).', 'Practice the framework with the cases in **Practice → System design** (URL shortener, rate limiter, chat…).'),
    interview('Piensa en voz alta y dibuja. Si el entrevistador cambia un requisito ("¿y con 100 veces más usuarios?"), no es que tu diseño esté mal: quiere ver cómo lo adaptas.', 'Think out loud and draw. If the interviewer changes a requirement ("what about 100 times more users?"), it does not mean your design is wrong: they want to see how you adapt it.'),
    md(
      `## Resumen
| Paso o pieza | En una frase |
|---|---|
| Requisitos | Funcionales y no funcionales; **pregunta antes de diseñar** |
| Estimaciones | Un día ≈ 10⁵ segundos; QPS, lecturas vs escrituras, almacenamiento |
| API y datos | Endpoints principales y tablas con sus claves |
| Diseño de alto nivel | Cliente → balanceador → servidores → caché / base de datos |
| Escalar | Horizontal con servidores sin estado; caché y réplicas para lecturas; sharding para datos enormes; colas para trabajo en segundo plano |
| Trade-offs | Consistencia vs disponibilidad, latencia vs costo, simplicidad primero |`,
      `## Summary
| Step or piece | In one sentence |
|---|---|
| Requirements | Functional and non-functional; **ask before designing** |
| Estimates | A day ≈ 10⁵ seconds; QPS, reads vs writes, storage |
| API and data | Main endpoints and tables with their keys |
| High-level design | Client → load balancer → servers → cache / database |
| Scaling | Horizontal with stateless servers; cache and replicas for reads; sharding for huge data; queues for background work |
| Trade-offs | Consistency vs availability, latency vs cost, simplicity first |`,
    ),
  ],
  quiz: [
    q('¿Qué es lo primero que deberías hacer en una entrevista de system design?', 'What should you do first in a system design interview?', [['Dibujar la base de datos', 'Draw the database'], ['Aclarar los requisitos con preguntas', 'Clarify the requirements by asking questions'], ['Elegir el lenguaje', 'Pick the language'], ['Hablar de microservicios', 'Talk about microservices']], 1,
      'Sin requisitos claros puedes diseñar algo que nadie pidió.', 'Without clear requirements you may design something nobody asked for.'),
    q('¿Qué permite el escalado horizontal?', 'What does horizontal scaling allow?', [['Usar un servidor más grande', 'Using a bigger server'], ['Agregar más servidores detrás de un balanceador', 'Adding more servers behind a load balancer'], ['Usar menos memoria', 'Using less memory'], ['Evitar la base de datos', 'Avoiding the database']], 1,
      'Funciona bien si los servidores no guardan estado.', 'It works well if the servers keep no state.'),
    q('Enviar correos de confirmación sin hacer esperar al usuario se resuelve con…', 'Sending confirmation emails without making the user wait is solved with…', [['Un índice', 'An index'], ['Una cola de mensajes', 'A message queue'], ['Una réplica', 'A replica'], ['Un balanceador', 'A load balancer']], 1,
      'El trabajo se deja en la cola y se procesa en segundo plano.', 'The work is left in the queue and processed in the background.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('"Los enlaces deben redirigir en menos de 100 ms" es un requisito…', '"Links must redirect in under 100 ms" is a… requirement', [['Funcional', 'Functional'], ['No funcional', 'Non-functional'], ['De la base de datos', 'Database'], ['Opcional', 'Optional']], 1,
      'Los funcionales dicen qué hace el sistema; los no funcionales, con qué exigencias (velocidad, usuarios, disponibilidad).', 'Functional ones say what the system does; non-functional ones, under which demands (speed, users, availability).'),
    q('¿Cuántos segundos tiene un día, aproximadamente?', 'About how many seconds are in a day?', [['10³', '10³'], ['10⁵ (86,400)', '10⁵ (86,400)'], ['10⁷', '10⁷'], ['3,600', '3,600']], 1,
      'Para pasar de "por día" a "por segundo", divide entre unos 100,000.', 'To go from "per day" to "per second", divide by about 100,000.'),
    q('Un millón de usuarios hace 10 acciones al día cada uno. ¿Cuántas peticiones por segundo son en promedio, aproximadamente?', 'A million users make 10 actions a day each. About how many requests per second is that on average?', [['10', '10'], ['Unas 116', 'About 116'], ['10,000', '10,000'], ['1,000,000', '1,000,000']], 1,
      '10 millones ÷ 86,400 ≈ 116. El pico puede ser varias veces eso.', '10 million ÷ 86,400 ≈ 116. The peak may be several times that.'),
    q('¿Para qué sirve un **balanceador de carga**?', 'What is a **load balancer** for?', [['Para guardar datos', 'To store data'], ['Para repartir las peticiones entre varios servidores y dejar de mandarle a uno que se cayó', 'To spread requests across several servers and stop sending to one that went down'], ['Para cifrar', 'To encrypt'], ['Para crear tablas', 'To create tables']], 1,
      'Como una recepcionista que manda a cada cliente a una caja libre.', 'Like a receptionist sending each customer to a free counter.'),
    q('¿Por qué los servidores deben ser **sin estado** para escalar horizontalmente?', 'Why must servers be **stateless** to scale horizontally?', [['Para gastar menos', 'To spend less'], ['Para que cualquiera pueda atender cualquier petición; la sesión va en un lugar compartido', 'So any of them can serve any request; the session lives in a shared place'], ['Porque es más seguro', 'Because it is more secure'], ['No hace falta', 'It is not needed']], 1,
      'Si la sesión viviera en la memoria de un servidor, se perdería al cambiar de servidor.', 'If the session lived in one server\'s memory, it would be lost when switching servers.'),
    q('Tu sistema recibe 100 veces más lecturas que escrituras. ¿Qué agregas primero?', 'Your system gets 100 times more reads than writes. What do you add first?', [['Una cola de mensajes', 'A message queue'], ['Caché y réplicas de lectura', 'A cache and read replicas'], ['Sharding de escrituras', 'Write sharding'], ['Más índices de escritura', 'More write indexes']], 1,
      'Atienden las lecturas sin cargar la base de datos principal.', 'They serve reads without loading the main database.'),
    q('¿Cuándo hace falta el **sharding**?', 'When is **sharding** needed?', [['Siempre', 'Always'], ['Cuando los datos o las escrituras ya no caben en una sola base de datos', 'When the data or writes no longer fit in a single database'], ['Para tener respaldo', 'For backup'], ['Para hacer más rápido el balanceador', 'To speed up the load balancer']], 1,
      'Para respaldo y lecturas sirven las réplicas.', 'Replicas are for backup and reads.'),
    q('En un acortador de URLs, ¿qué responde `GET /4c92`?', 'In a URL shortener, what does `GET /4c92` answer?', [['200 con la URL larga en el body', '200 with the long URL in the body'], ['301 o 302 con el header `Location` apuntando a la URL larga', '301 or 302 with the `Location` header pointing to the long URL'], ['404 siempre', 'Always 404'], ['201', '201']], 1,
      'Es una redirección: el navegador va solo a la URL larga.', 'It is a redirect: the browser goes to the long URL by itself.'),
    q('¿Por qué se usa **base 62** para los códigos cortos?', 'Why is **base 62** used for short codes?', [['Porque es secreto', 'Because it is secret'], ['Porque con dígitos, minúsculas y mayúsculas un id numérico queda muy corto y no se repite', 'Because with digits, lowercase and uppercase a numeric id becomes very short and never repeats'], ['Porque es más rápido de leer', 'Because it is faster to read'], ['Porque lo exige HTTP', 'Because HTTP requires it']], 1,
      'Con 7 caracteres caben unos 3.5 billones de códigos.', 'With 7 characters there are about 3.5 trillion codes.'),
    q('El entrevistador pregunta "¿y con 100 veces más usuarios?". ¿Qué significa?', 'The interviewer asks "what about 100 times more users?". What does it mean?', [['Que tu diseño está mal', 'That your design is wrong'], ['Que quiere ver cómo adaptas el diseño y dónde estaría el cuello de botella', 'That they want to see how you adapt the design and where the bottleneck would be'], ['Que la entrevista terminó', 'That the interview is over'], ['Que debes empezar de nuevo', 'That you must start over']], 1,
      'Empieza simple y explica cómo lo escalarías.', 'Start simple and explain how you would scale it.'),
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
  title: l('Entrevista conductual y método STAR', 'Behavioral interviews and the STAR method'),
  summary: l('Qué evalúa una entrevista conductual, cómo armar respuestas con el método STAR (con un ejemplo completo), las preguntas más comunes, tu banco de historias y los errores que hay que evitar.', 'What a behavioral interview evaluates, how to build answers with the STAR method (with a full example), the most common questions, your story bank and the mistakes to avoid.'),
  minutes: 22,
  blocks: [
    md(
      `## ¿Qué es una entrevista conductual?
Son preguntas sobre **situaciones reales que viviste**: "Cuéntame de una vez que tuviste un conflicto con un compañero", "¿Cuál ha sido tu mayor error?". Parten de una idea simple: **cómo actuaste en el pasado es la mejor pista de cómo actuarás después**. Muchas empresas usan **entrevistas estructuradas**: hacen las mismas preguntas a todos los candidatos y las califican con criterios definidos de antemano.

**Lo que evalúan:** trabajo en equipo, comunicación, cómo manejas los errores y la presión, iniciativa y si aprendes rápido. Para un puesto junior pesan tanto como la parte técnica: una persona que aprende y colabora bien es una apuesta segura.

## El método STAR
Una respuesta desordenada se pierde en detalles y nunca llega al punto. **STAR** la organiza en cuatro partes:
- **S — Situación:** el contexto, **breve**. Dónde estabas y qué pasaba.
- **T — Tarea:** cuál era **tu** responsabilidad o el reto que tenías.
- **A — Acción:** lo que **tú** hiciste, paso a paso. Es **la parte más larga**: más o menos el 60% de la respuesta. Di "yo", no "nosotros".
- **R — Resultado:** qué pasó al final, idealmente **con un dato concreto**, y qué aprendiste.

Como guía, una respuesta dura **de 1.5 a 2 minutos**.`,
      `## What is a behavioral interview?
These are questions about **real situations you lived through**: "Tell me about a time you had a conflict with a teammate", "What has been your biggest mistake?". They start from a simple idea: **how you acted in the past is the best clue to how you will act later**. Many companies use **structured interviews**: they ask every candidate the same questions and score them with criteria defined beforehand.

**What they evaluate:** teamwork, communication, how you handle mistakes and pressure, initiative and whether you learn fast. For a junior role they weigh as much as the technical part: someone who learns and collaborates well is a safe bet.

## The STAR method
A disorganized answer gets lost in details and never reaches the point. **STAR** organizes it into four parts:
- **S — Situation:** the context, **brief**. Where you were and what was happening.
- **T — Task:** what **your** responsibility or challenge was.
- **A — Action:** what **you** did, step by step. It is **the longest part**: roughly 60% of the answer. Say "I", not "we".
- **R — Result:** what happened in the end, ideally **with a concrete number**, and what you learned.

As a guide, an answer lasts **1.5 to 2 minutes**.`,
    ),
    md(
      `## Un ejemplo completo
**Pregunta:** "Cuéntame de una vez que tuviste un desacuerdo con un compañero."

- **S:** "En la universidad hicimos en equipo de cuatro una app de reservas para la cafetería, con dos semanas de plazo."
- **T:** "Yo estaba a cargo del backend, y un compañero quería cambiar la base de datos a MongoDB a mitad del proyecto porque le parecía más moderna."
- **A:** "Le propuse que lo habláramos con datos antes de decidir. Hice una lista de lo que cambiaría: rehacer el modelo y las consultas, unos cuatro días de trabajo. Él explicó qué ventaja buscaba, que era guardar las opciones de cada platillo, que variaban mucho. Encontré que en PostgreSQL podíamos guardarlas en una columna JSON sin migrar todo, y le mostré un ejemplo funcionando esa misma tarde."
- **R:** "Nos quedamos con PostgreSQL, entregamos a tiempo y él mismo implementó la parte del JSON. Aprendí que un desacuerdo técnico se resuelve mejor con datos y un prototipo que discutiendo opiniones."

Fíjate en que la **acción** es la parte más larga, que dice **"yo"** y que el **resultado** cierra con lo que se aprendió.`,
      `## A full example
**Question:** "Tell me about a time you disagreed with a teammate."

- **S:** "At university four of us built a booking app for the cafeteria, with a two-week deadline."
- **T:** "I was in charge of the backend, and a teammate wanted to switch the database to MongoDB halfway through because it seemed more modern to him."
- **A:** "I suggested we discuss it with data before deciding. I listed what would change: redoing the model and the queries, about four days of work. He explained the advantage he was after, which was storing each dish's options, which varied a lot. I found that in PostgreSQL we could store them in a JSON column without migrating everything, and I showed him a working example that same afternoon."
- **R:** "We stayed with PostgreSQL, delivered on time and he implemented the JSON part himself. I learned that a technical disagreement is better solved with data and a prototype than by arguing opinions."

Notice that the **action** is the longest part, that it says **"I"** and that the **result** closes with what was learned.`,
    ),
    md(
      `## Las preguntas más comunes
| Pregunta | Lo que de verdad evalúan |
|---|---|
| "Cuéntame de un conflicto con un compañero" | Cómo colaboras y resuelves desacuerdos sin pelear |
| "¿Cuál ha sido tu mayor error?" | Honestidad, que asumas la responsabilidad y lo que aprendiste |
| "Un logro del que estés orgulloso" | Iniciativa e impacto concreto |
| "Una vez que trabajaste bajo presión o con poco tiempo" | Cómo priorizas y te organizas |
| "Algo que tuviste que aprender muy rápido" | Capacidad de aprender (clave para un junior) |
| "Una vez que no estuviste de acuerdo con una decisión" | Si sabes opinar con respeto y luego comprometerte |

**"Háblame de ti"** no se responde con STAR, sino con **presente → pasado → futuro**: qué haces hoy, qué te trajo hasta aquí (estudios, proyectos) y por qué te interesa este puesto. Un minuto, no tu historia de vida.`,
      `## The most common questions
| Question | What they really evaluate |
|---|---|
| "Tell me about a conflict with a teammate" | How you collaborate and resolve disagreements without fighting |
| "What has been your biggest mistake?" | Honesty, owning it and what you learned |
| "An achievement you are proud of" | Initiative and concrete impact |
| "A time you worked under pressure or with little time" | How you prioritize and organize |
| "Something you had to learn very fast" | Ability to learn (key for a junior) |
| "A time you disagreed with a decision" | Whether you can give your opinion respectfully and then commit |

**"Tell me about yourself"** is not answered with STAR, but with **present → past → future**: what you do today, what brought you here (studies, projects) and why this role interests you. One minute, not your life story.`,
    ),
    md(
      `## Prepara un banco de historias
No necesitas una historia por pregunta. Prepara **de 5 a 8 historias** (proyectos, prácticas, trabajos en equipo de la escuela, un hackathon) y **etiquétalas**: conflicto, error, logro, liderazgo, presión, aprendizaje. **Una buena historia responde varias preguntas**: la del ejemplo sirve para "un desacuerdo", "convencer a alguien" y "resolver un problema técnico".

¿No tienes experiencia laboral? No importa: los **proyectos escolares y personales cuentan**, siempre que digas con claridad qué hiciste **tú**. Puedes escribir tus historias en **Practicar → Conductuales**.`,
      `## Build a story bank
You do not need one story per question. Prepare **5 to 8 stories** (projects, internships, school teamwork, a hackathon) and **tag them**: conflict, mistake, achievement, leadership, pressure, learning. **A good story answers several questions**: the one in the example works for "a disagreement", "convincing someone" and "solving a technical problem".

No work experience? It does not matter: **school and personal projects count**, as long as you say clearly what **you** did. You can write your stories in **Practice → Behavioral**.`,
    ),
    md(
      `## Errores comunes
- Contar solo lo que hizo **el equipo** y no dejar claro **tu** papel.
- Quedarte en la situación y **nunca llegar al resultado**.
- Un resultado vago ("salió bien") en vez de algo concreto ("entregamos a tiempo y bajó 40% el tiempo de carga").
- Elegir un **"error" falso** ("soy demasiado perfeccionista"). Mejor un error real y pequeño, qué hiciste para arreglarlo y qué cambiaste desde entonces.
- **Hablar mal** de compañeros o jefes anteriores.
- **Inventar.** Las repreguntas ("¿y qué hiciste después?", "¿qué harías distinto?") descubren las historias inventadas.

**¿Tu mayor debilidad?** Algo **real** que no sea central para el puesto, y lo que estás haciendo para mejorarlo: "Me costaba pedir ayuda cuando me atoraba; ahora me pongo un límite de una hora antes de preguntar, y aprendí que preguntar a tiempo ahorra días".`,
      `## Common mistakes
- Talking only about what **the team** did and not making **your** role clear.
- Staying in the situation and **never reaching the result**.
- A vague result ("it went well") instead of something concrete ("we delivered on time and load time dropped 40%").
- Picking a **fake "mistake"** ("I am too much of a perfectionist"). Better a real, small mistake, what you did to fix it and what you have changed since.
- **Speaking badly** of former teammates or bosses.
- **Making things up.** Follow-up questions ("and what did you do next?", "what would you do differently?") expose made-up stories.

**Your biggest weakness?** Something **real** that is not central to the role, and what you are doing to improve it: "I used to struggle to ask for help when stuck; now I give myself a one-hour limit before asking, and I learned that asking early saves days".`,
    ),
    md(
      `## Durante la entrevista
- Está bien **tomarte unos segundos** para elegir la historia: "Déjame pensar en un buen ejemplo".
- Si no tienes un ejemplo exacto, dilo y usa el más parecido.
- Espera **repreguntas**: son normales y te dan la oportunidad de profundizar.
- Al final casi siempre te preguntan **"¿Tienes preguntas para nosotros?"**. Lleva 2 o 3 preparadas: cómo es un día típico en el puesto, cómo miden el éxito en los primeros meses, cómo es el proceso de bienvenida (*onboarding*) y quién te apoyaría. Decir "no, ninguna" da la impresión de poco interés.`,
      `## During the interview
- It is fine to **take a few seconds** to pick the story: "Let me think of a good example".
- If you do not have an exact example, say so and use the closest one.
- Expect **follow-up questions**: they are normal and give you the chance to go deeper.
- At the end you are almost always asked **"Do you have any questions for us?"**. Bring 2 or 3 ready: what a typical day in the role looks like, how success is measured in the first months, what the *onboarding* process is like and who would support you. Saying "no, none" gives an impression of little interest.`,
    ),
    interview('Practica tus historias **en voz alta** (o grábate). En papel parecen cortas, pero al contarlas suelen salir de 4 minutos y sin resultado claro. Ajusta hasta que cada una quepa en unos 2 minutos.', 'Practice your stories **out loud** (or record yourself). On paper they look short, but when told they often run 4 minutes with no clear result. Adjust until each fits in about 2 minutes.'),
    md(
      `## Resumen
| Concepto | En una frase |
|---|---|
| Entrevista conductual | Preguntas sobre situaciones reales: cómo actuaste predice cómo actuarás |
| S — Situación | El contexto, breve |
| T — Tarea | Tu responsabilidad o reto |
| A — Acción | Lo que **tú** hiciste, paso a paso (la parte más larga, ~60%) |
| R — Resultado | Qué pasó, con un dato concreto, y qué aprendiste |
| Duración | 1.5 a 2 minutos |
| "Háblame de ti" | Presente → pasado → futuro, en un minuto |
| Banco de historias | 5 a 8 historias etiquetadas; una sirve para varias preguntas |
| Al final | Lleva 2 o 3 preguntas para el entrevistador |`,
      `## Summary
| Concept | In one sentence |
|---|---|
| Behavioral interview | Questions about real situations: how you acted predicts how you will act |
| S — Situation | The context, brief |
| T — Task | Your responsibility or challenge |
| A — Action | What **you** did, step by step (the longest part, ~60%) |
| R — Result | What happened, with a concrete number, and what you learned |
| Length | 1.5 to 2 minutes |
| "Tell me about yourself" | Present → past → future, in one minute |
| Story bank | 5 to 8 tagged stories; one works for several questions |
| At the end | Bring 2 or 3 questions for the interviewer |`,
    ),
  ],
  quiz: [
    q('¿Qué significa la "A" de STAR y cuánto peso debe tener?', 'What does the "A" in STAR mean and how much weight should it have?', [['Análisis; poco', 'Analysis; little'], ['Acción: lo que tú hiciste; es la parte más larga', 'Action: what you did; it is the longest part'], ['Aprendizaje; la mitad', 'Learning; half'], ['Ayuda del equipo; todo', 'Team help; all of it']], 1,
      'Más o menos el 60% de la respuesta.', 'Roughly 60% of the answer.'),
    q('¿Por qué decir "yo" en vez de "nosotros"?', 'Why say "I" instead of "we"?', [['Para parecer más importante', 'To seem more important'], ['Porque evalúan lo que hiciste tú, no el equipo', 'Because they evaluate what you did, not the team'], ['Porque el equipo no importa', 'Because the team does not matter'], ['Es indiferente', 'It does not matter']], 1,
      'Puedes mencionar al equipo, pero deja claro tu papel.', 'You can mention the team, but make your role clear.'),
    q('¿Cuántas historias conviene preparar?', 'How many stories should you prepare?', [['Una por cada pregunta posible', 'One per possible question'], ['De 5 a 8, etiquetadas por tema', '5 to 8, tagged by topic'], ['Solo una muy buena', 'Just one very good one'], ['Ninguna: mejor improvisar', 'None: better to improvise']], 1,
      'Una buena historia responde varias preguntas.', 'A good story answers several questions.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('¿En qué idea se basan las entrevistas conductuales?', 'What idea are behavioral interviews based on?', [['En que el pasado no importa', 'That the past does not matter'], ['En que cómo actuaste en el pasado es la mejor pista de cómo actuarás después', 'That how you acted in the past is the best clue to how you will act later'], ['En adivinar tu personalidad', 'In guessing your personality'], ['En probar tus conocimientos técnicos', 'In testing your technical knowledge']], 1,
      'Por eso preguntan por situaciones reales que viviste.', 'That is why they ask about real situations you lived through.'),
    q('¿Cuál es el orden de STAR?', 'What is STAR\'s order?', [['Tarea, situación, resultado, acción', 'Task, situation, result, action'], ['Situación, tarea, acción, resultado', 'Situation, task, action, result'], ['Acción, resultado, situación, tarea', 'Action, result, situation, task'], ['Resultado primero, luego el resto', 'Result first, then the rest']], 1,
      'Contexto breve, tu reto, lo que hiciste y qué pasó.', 'Brief context, your challenge, what you did and what happened.'),
    q('"Yo estaba a cargo del backend y tenía que entregar el login en una semana" corresponde a…', '"I was in charge of the backend and had to deliver the login in a week" corresponds to…', [['La situación', 'The situation'], ['La tarea', 'The task'], ['La acción', 'The action'], ['El resultado', 'The result']], 1,
      'La tarea es tu responsabilidad o el reto que tenías.', 'The task is your responsibility or the challenge you had.'),
    q('¿Qué hace mejor a un resultado?', 'What makes a result better?', [['Que sea largo', 'That it is long'], ['Un dato concreto y lo que aprendiste', 'A concrete number and what you learned'], ['Decir que todo salió perfecto', 'Saying everything went perfectly'], ['No mencionarlo', 'Not mentioning it']], 1,
      '"Entregamos a tiempo y bajó 40% el tiempo de carga" vale más que "salió bien".', '"We delivered on time and load time dropped 40%" is worth more than "it went well".'),
    q('¿Cuánto debe durar, más o menos, una respuesta STAR?', 'About how long should a STAR answer last?', [['10 segundos', '10 seconds'], ['De 1.5 a 2 minutos', '1.5 to 2 minutes'], ['10 minutos', '10 minutes'], ['Lo que haga falta', 'As long as needed']], 1,
      'Practicar en voz alta ayuda a no pasarse.', 'Practicing out loud helps you not run over.'),
    q('¿Cómo se responde "Háblame de ti"?', 'How do you answer "Tell me about yourself"?', [['Con tu historia de vida completa', 'With your full life story'], ['Presente → pasado → futuro, en un minuto', 'Present → past → future, in one minute'], ['Con el método STAR', 'With the STAR method'], ['Leyendo tu CV', 'Reading your résumé']], 1,
      'Qué haces hoy, qué te trajo aquí y por qué te interesa el puesto.', 'What you do today, what brought you here and why the role interests you.'),
    q('No tienes experiencia laboral. ¿Qué historias puedes usar?', 'You have no work experience. Which stories can you use?', [['Ninguna', 'None'], ['Proyectos escolares y personales, prácticas o hackathons, dejando claro qué hiciste tú', 'School and personal projects, internships or hackathons, making clear what you did'], ['Historias inventadas', 'Made-up stories'], ['Las de tus amigos', 'Your friends\' stories']], 1,
      'Lo que evalúan es cómo actuaste, no dónde.', 'What they evaluate is how you acted, not where.'),
    q('Te preguntan por tu mayor debilidad. ¿Qué es mejor responder?', 'You are asked about your biggest weakness. What is better to answer?', [['"Soy demasiado perfeccionista"', '"I am too much of a perfectionist"'], ['Algo real que no sea central para el puesto y lo que haces para mejorarlo', 'Something real that is not central to the role and what you do to improve it'], ['"No tengo debilidades"', '"I have no weaknesses"'], ['Algo grave del puesto', 'Something serious about the role']], 1,
      'Una debilidad falsa se nota y resta confianza.', 'A fake weakness shows and undermines trust.'),
    q('Al final te preguntan "¿Tienes preguntas para nosotros?". ¿Qué haces?', 'At the end you are asked "Do you have any questions for us?". What do you do?', [['Decir que no', 'Say no'], ['Hacer 2 o 3 preguntas preparadas sobre el puesto y el equipo', 'Ask 2 or 3 prepared questions about the role and the team'], ['Preguntar por el sueldo de todos', 'Ask about everyone\'s salary'], ['Hablar de otro tema', 'Talk about something else']], 1,
      'Por ejemplo: cómo es un día típico o cómo miden el éxito en los primeros meses.', 'For example: what a typical day looks like or how success is measured in the first months.'),
  ],
  concepts: [
    concept('Las 4 partes del método STAR', 'The 4 parts of the STAR method', 'Situación, Tarea, Acción (la más larga, en primera persona) y Resultado (con un dato concreto y lo que aprendiste).', 'Situation, Task, Action (the longest, in first person) and Result (with a concrete figure and what you learned).'),
  ],
};
