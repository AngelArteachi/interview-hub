import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, CJ, O, P, PJ, R } from './builders';

/* Ejercicios: cómo funciona la web · JavaScript esencial · APIs REST.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores.
 * Los de JavaScript se verifican ejecutándolos con Node. */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Cómo funciona la web ---------------- */
  'how-web-works': {
    1: O('http-cp-steps', 'basic',
      l('Ordena lo que pasa desde que escribes `https://tienda.com` hasta que ves la página.', 'Order what happens from typing `https://tienda.com` until you see the page.'),
      [
        l('DNS traduce `tienda.com` a una dirección IP.', 'DNS translates `tienda.com` into an IP address.'),
        l('Se abre una conexión TCP con esa IP.', 'A TCP connection to that IP is opened.'),
        l('TLS cifra la conexión y el servidor muestra su certificado.', 'TLS encrypts the connection and the server shows its certificate.'),
        l('El navegador envía la petición HTTP y recibe la respuesta.', 'The browser sends the HTTP request and gets the response.'),
        l('El navegador arma el DOM, descarga CSS/JS y pinta la página.', 'The browser builds the DOM, downloads CSS/JS and paints the page.'),
      ],
      l('Primero hay que saber **adónde** ir (DNS), luego **llegar** (TCP), **proteger** la conversación (TLS), **pedir** (HTTP) y al final **mostrar**.', 'First you must know **where** to go (DNS), then **get there** (TCP), **protect** the conversation (TLS), **ask** (HTTP) and finally **show**.')),
    4: R('http-cp-401-403', 'basic',
      l('¿Qué diferencia hay entre un **401** y un **403**? ¿Y entre un error **4xx** y uno **5xx**?', 'What is the difference between a **401** and a **403**? And between a **4xx** and a **5xx** error?'),
      l('**401**: no estás autenticado ("¿quién eres?"). **403**: sí sé quién eres, pero no tienes permiso. **4xx** es culpa de quien hizo la petición; **5xx**, del servidor.', '**401**: you are not authenticated ("who are you?"). **403**: I do know who you are, but you are not allowed. **4xx** is the requester\'s fault; **5xx**, the server\'s.')),
    6: P('http-cp-urlparse', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `from urllib.parse import urlparse

url = urlparse("https://blog.com/posts/7?tema=sql")
print(url.netloc, url.path, url.query)`,
      'blog.com /posts/7 tema=sql',
      l('`netloc` es el dominio (**blog.com**), `path` la ruta (**/posts/7**) y `query` lo que va después del `?` (**tema=sql**).', '`netloc` is the domain (**blog.com**), `path` the path (**/posts/7**) and `query` what comes after `?` (**tema=sql**).'),
      l('`urlparse` separa la URL en sus partes: protocolo, dominio, ruta y query string.', '`urlparse` splits the URL into its parts: protocol, domain, path and query string.')),
  },

  /* ---------------- JavaScript esencial ---------------- */
  'javascript-essentials': {
    2: PJ('js-cp-let', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `const nums = [5];
nums.push(6);
let total = 0;
for (const n of nums) {
  total += n;
}
console.log(nums.length, total);`,
      '2 11',
      l('`const` no impide **cambiar el contenido** del arreglo: `push` agrega el 6. Quedan 2 elementos que suman **11**. `total` usa `let` porque se reasigna.', '`const` does not prevent **changing the array\'s contents**: `push` adds 6. There are 2 elements adding up to **11**. `total` uses `let` because it is reassigned.'),
      l('`for (const n of nums)` recorre los valores del arreglo, como `for n in nums` en Python.', '`for (const n of nums)` walks the array values, like `for n in nums` in Python.')),
    5: PJ('js-cp-closure', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `function crearContador() {
  let cuenta = 0;
  return () => ++cuenta;
}
const a = crearContador();
const b = crearContador();
a();
a();
console.log(a(), b());`,
      '3 1',
      l('`a` y `b` tienen **cada uno su propia** `cuenta`. `a` ya se llamó dos veces, así que la tercera da **3**; `b` se llama por primera vez: **1**.', '`a` and `b` **each have their own** `cuenta`. `a` was already called twice, so the third call gives **3**; `b` is called for the first time: **1**.'),
      l('Cada llamada a `crearContador()` crea una variable `cuenta` nueva que solo ve la función que devuelve.', 'Each call to `crearContador()` creates a new `cuenta` that only the returned function sees.')),
    7: PJ('js-cp-loop', 'medium', l('¿Qué imprime? Escribe una salida por línea.', 'What does it print? Write one output per line.'),
      `setTimeout(() => console.log("C"), 0);
console.log("A");
Promise.resolve().then(() => console.log("B"));
console.log("D");`,
      'A\nD\nB\nC',
      l('Primero todo lo síncrono (**A**, **D**), luego las microtareas (la promesa: **B**) y al final la tarea del `setTimeout` (**C**), aunque se haya registrado primero.', 'First all synchronous code (**A**, **D**), then microtasks (the promise: **B**) and finally the `setTimeout` task (**C**), even though it was registered first.'),
      l('El orden en que aparecen las líneas no es el orden en que se ejecutan los callbacks.', 'The order the lines appear in is not the order the callbacks run.')),
  },

  /* ---------------- APIs REST ---------------- */
  'rest-apis': {
    0: R('rest-cp-route', 'basic',
      l('¿Qué método y qué ruta usarías para **borrar el pedido 7 del usuario 3**? ¿Y para **ver todos los pedidos** de ese usuario?', 'Which method and route would you use to **delete order 7 of user 3**? And to **see all orders** of that user?'),
      l('\`DELETE /users/3/orders/7\` (respuesta 204) y \`GET /users/3/orders\` (respuesta 200). Los recursos van en plural, anidados, y la acción la pone el método.', '\`DELETE /users/3/orders/7\` (response 204) and \`GET /users/3/orders\` (response 200). Resources are plural and nested, and the method gives the action.')),
    2: P('rest-cp-json', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import json

texto = '{"producto": "café", "precio": 45, "disponible": false}'
datos = json.loads(texto)
print(datos["precio"] * 2, datos["disponible"])`,
      '90 False',
      l('`json.loads` convierte el texto en un diccionario: el precio es el número 45 (×2 = **90**) y el `false` de JSON se vuelve `False` de Python.', '`json.loads` turns the text into a dictionary: the price is the number 45 (×2 = **90**) and JSON\'s `false` becomes Python\'s `False`.'),
      l('En JSON se escribe `false`; en Python, `False`.', 'In JSON it is written `false`; in Python, `False`.')),
    4: P('rest-cp-idem', 'medium', l('El cliente reintenta cada petición una vez. ¿Qué imprime?', 'The client retries every request once. What does it print?'),
      `pedidos = {}
siguiente = 1

def post(producto):
    global siguiente
    pedidos[siguiente] = producto
    siguiente += 1

def delete(id):
    pedidos.pop(id, None)      # si ya no existe, no pasa nada

post("libro")
post("libro")                  # reintento del POST
post("lápiz")
post("lápiz")                  # reintento del POST
delete(1)
delete(1)                      # reintento del DELETE
print(len(pedidos))`,
      '3',
      l('Los POST repetidos crearon **4** pedidos (dos duplicados). Borrar el 1 dos veces solo lo borra una vez: quedan **3**. DELETE es idempotente; POST no.', 'The repeated POSTs created **4** orders (two duplicates). Deleting 1 twice only deletes it once: **3** remain. DELETE is idempotent; POST is not.'),
      l('`pedidos.pop(id, None)` borra la clave si existe y no hace nada si no.', '`pedidos.pop(id, None)` deletes the key if it exists and does nothing otherwise.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Cómo funciona la web ---------------- */
  'how-web-works': [
    P('http-p-url', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `from urllib.parse import urlparse, parse_qs

url = urlparse("http://api.ejemplo.com:8080/v1/users?page=2&size=10")
print(url.port, url.path, parse_qs(url.query)["page"])`,
      "8080 /v1/users ['2']",
      l('El puerto es **8080**, la ruta **/v1/users**, y `parse_qs` devuelve cada parámetro como una **lista** de valores: `[\'2\']`.', 'The port is **8080**, the path **/v1/users**, and `parse_qs` returns each parameter as a **list** of values: `[\'2\']`.'),
      l('`parse_qs` convierte `page=2&size=10` en un diccionario.', '`parse_qs` turns `page=2&size=10` into a dictionary.')),
    R('http-p-dns', 'basic',
      l('¿Qué hace el **DNS** y por qué la segunda visita a un sitio suele resolverse más rápido?', 'What does **DNS** do and why is the second visit to a site usually resolved faster?'),
      l('Traduce el nombre del dominio a su **dirección IP**, como una agenda. La respuesta se **guarda en caché** un tiempo (en tu computadora, el navegador o el proveedor), así que no hay que volver a preguntar.', 'It translates the domain name into its **IP address**, like a contacts list. The answer is **cached** for a while (on your computer, the browser or the provider), so it does not have to be asked again.')),
    R('http-p-stateless', 'basic',
      l('Si HTTP es **sin estado**, ¿cómo sabe un sitio que ya iniciaste sesión?', 'If HTTP is **stateless**, how does a site know you already logged in?'),
      l('Con una **cookie** (el servidor manda `Set-Cookie` y el navegador la devuelve en cada petición) o con un **token** en el header `Authorization`. Cada petición lleva la prueba de quién eres.', 'With a **cookie** (the server sends `Set-Cookie` and the browser sends it back on every request) or with a **token** in the `Authorization` header. Each request carries proof of who you are.')),
    P('http-p-status', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `def familia(codigo):
    nombres = {2: "éxito", 3: "redirección", 4: "error del cliente", 5: "error del servidor"}
    return nombres[codigo // 100]

print(familia(201), "|", familia(404), "|", familia(503))`,
      'éxito | error del cliente | error del servidor',
      l('`codigo // 100` es el primer dígito: 201 → 2 (**éxito**), 404 → 4 (**error del cliente**), 503 → 5 (**error del servidor**).', '`codigo // 100` is the first digit: 201 → 2 (**success**), 404 → 4 (**client error**), 503 → 5 (**server error**).'),
      l('`//` es la división entera: 404 // 100 = 4.', '`//` is integer division: 404 // 100 = 4.')),
    C('http-p-code', 'medium',
      l('¿Qué código falta para que imprima `401 403 200`?', 'Which code is missing so it prints `401 403 200`?'),
      `def respuesta(usuario, es_admin):
    if usuario is None:          # no mandó credenciales válidas
        return ____
    if not es_admin:             # sabemos quién es, pero no puede
        return 403
    return 200

print(respuesta(None, False), respuesta("ana", False), respuesta("ana", True))`,
      ['404', '401', '403', '500'],
      1,
      l('Sin usuario válido no sabemos quién es: **401** (no autenticado). Con usuario pero sin permiso, 403.', 'Without a valid user we do not know who it is: **401** (unauthenticated). With a user but no permission, 403.'),
      l('Primero se revisa **quién eres** y después **qué puedes hacer**.', 'First it checks **who you are** and then **what you can do**.')),
    O('http-p-render', 'medium',
      l('Ordena lo que hace el navegador con la respuesta para mostrar la página.', 'Order what the browser does with the response to show the page.'),
      [
        l('Lee el HTML y arma el DOM.', 'It reads the HTML and builds the DOM.'),
        l('Descarga el CSS, el JavaScript y las imágenes que menciona el HTML.', 'It downloads the CSS, JavaScript and images the HTML mentions.'),
        l('Calcula dónde va cada elemento (layout).', 'It works out where each element goes (layout).'),
        l('Pinta la página en pantalla.', 'It paints the page on screen.'),
      ],
      l('Sin el DOM no sabe qué elementos hay; sin el CSS no sabe cómo se ven ni dónde van; al final, pinta.', 'Without the DOM it does not know which elements there are; without the CSS it does not know how they look or where they go; finally, it paints.')),
    R('http-p-https', 'interview',
      l('¿Qué te da **HTTPS** frente a HTTP?', 'What does **HTTPS** give you over HTTP?'),
      l('**Cifrado** (nadie en medio puede leer lo que envías, como tu contraseña), **integridad** (no pueden cambiarlo sin que se note) e **identidad**: el certificado prueba que hablas con el sitio real. HTTPS es HTTP encima de TLS.', '**Encryption** (nobody in between can read what you send, like your password), **integrity** (it cannot be changed unnoticed) and **identity**: the certificate proves you are talking to the real site. HTTPS is HTTP on top of TLS.')),
    R('http-p-google', 'interview',
      l('Te preguntan: "¿Qué pasa cuando escribes google.com en el navegador?". Da la respuesta corta.', 'You are asked: "What happens when you type google.com in the browser?". Give the short answer.'),
      l('1) **DNS** traduce el nombre a una IP. 2) Se abre una conexión **TCP**. 3) **TLS** la cifra y verifica el certificado. 4) Se envía la **petición HTTP** (`GET /`). 5) Llega la **respuesta** con el HTML. 6) El navegador arma el **DOM**, descarga CSS/JS/imágenes, calcula el layout y **pinta**.', '1) **DNS** translates the name into an IP. 2) A **TCP** connection is opened. 3) **TLS** encrypts it and verifies the certificate. 4) The **HTTP request** is sent (`GET /`). 5) The **response** arrives with the HTML. 6) The browser builds the **DOM**, downloads CSS/JS/images, computes the layout and **paints**.')),
  ],

  /* ---------------- JavaScript esencial ---------------- */
  'javascript-essentials': [
    PJ('js-p-equal', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `console.log(0 == "", 0 === "", null == undefined);`,
      'true false true',
      l('`==` convierte los tipos: `0 == ""` y `null == undefined` dan **true**. `===` no convierte, así que `0 === ""` es **false**.', '`==` converts types: `0 == ""` and `null == undefined` give **true**. `===` does not convert, so `0 === ""` is **false**.'),
      l('Compara qué hace `==` (convierte) contra `===` (no convierte).', 'Compare what `==` does (converts) with `===` (does not convert).')),
    PJ('js-p-const', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `const perfil = { nombre: "Ana", edad: 30 };
perfil.edad = 31;
console.log(perfil.nombre, perfil.edad);`,
      'Ana 31',
      l('`const` impide **reasignar** `perfil`, pero el objeto se puede modificar por dentro: la edad pasa a **31**.', '`const` prevents **reassigning** `perfil`, but the object can be modified inside: the age becomes **31**.'),
      l('`perfil.edad` es el campo `edad` del objeto, como `perfil["edad"]` en un diccionario de Python.', '`perfil.edad` is the object\'s `edad` field, like `perfil["edad"]` in a Python dictionary.')),
    R('js-p-var-let', 'basic',
      l('¿Por qué se recomienda usar `let` y `const` en vez de `var`?', 'Why is it recommended to use `let` and `const` instead of `var`?'),
      l('`var` ignora los bloques (vive en toda la función) y se "eleva": existe desde el inicio con valor `undefined`, lo que esconde errores. `let` y `const` viven solo en su bloque y dan error si los usas antes de declararlos. `const` además evita reasignaciones accidentales.', '`var` ignores blocks (it lives in the whole function) and is hoisted: it exists from the start with the value `undefined`, which hides bugs. `let` and `const` live only in their block and throw an error if used before being declared. `const` also prevents accidental reassignment.')),
    PJ('js-p-closure', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `function multiplicador(k) {
  return (x) => x * k;
}
const doble = multiplicador(2);
const triple = multiplicador(3);
console.log(doble(5), triple(5));`,
      '10 15',
      l('Cada función recuerda **su propio** `k`: `doble` multiplica por 2 (**10**) y `triple` por 3 (**15**). Es un closure.', 'Each function remembers **its own** `k`: `doble` multiplies by 2 (**10**) and `triple` by 3 (**15**). It is a closure.'),
      l('`multiplicador` devuelve una función flecha que usa `k` aunque `multiplicador` ya haya terminado.', '`multiplicador` returns an arrow function that uses `k` even though `multiplicador` has already finished.')),
    PJ('js-p-micro', 'medium', l('¿Qué imprime? Escribe una salida por línea.', 'What does it print? Write one output per line.'),
      `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");`,
      'A\nE\nC\nD\nB',
      l('Síncrono primero (**A**, **E**), luego **todas** las microtareas en el orden en que se agregaron (**C**, **D**) y al final la tarea del `setTimeout` (**B**).', 'Synchronous first (**A**, **E**), then **all** microtasks in the order they were added (**C**, **D**) and finally the `setTimeout` task (**B**).'),
      l('`.then` y `queueMicrotask` son microtareas; `setTimeout` es una tarea.', '`.then` and `queueMicrotask` are microtasks; `setTimeout` is a task.')),
    CJ('js-p-await', 'medium',
      l('¿Qué línea falta para que imprima `inicio`, luego `después de llamar`, y al final `fin`?', 'Which line is missing so it prints `inicio`, then `después de llamar`, and finally `fin`?'),
      `function esperar(ms) {
  return new Promise((listo) => setTimeout(listo, ms));
}

async function main() {
  console.log("inicio");
  ____
  console.log("fin");
}

main();
console.log("después de llamar");`,
      ['esperar(10);', 'await esperar(10);', 'return;', 'esperar;'],
      1,
      l('`await esperar(10)` **pausa solo `main`**: el programa sigue y escribe "después de llamar", y 10 ms después `main` continúa con "fin". Sin `await`, `main` no esperaría y "fin" saldría antes.', '`await esperar(10)` **pauses only `main`**: the program continues and prints "después de llamar", and 10 ms later `main` resumes with "fin". Without `await`, `main` would not wait and "fin" would come out earlier.'),
      l('`esperar` devuelve una promesa que se resuelve después de `ms` milisegundos.', '`esperar` returns a promise that resolves after `ms` milliseconds.')),
    O('js-p-loop-order', 'interview',
      l('Ordena cómo trabaja el **event loop** de JavaScript.', 'Order how JavaScript\'s **event loop** works.'),
      [
        l('Ejecuta una tarea completa (por ejemplo, el script principal).', 'It runs one whole task (for example, the main script).'),
        l('Cuando la pila de llamadas queda vacía, ejecuta todas las microtareas pendientes.', 'When the call stack is empty, it runs all pending microtasks.'),
        l('Toma la siguiente tarea de la cola (por ejemplo, un callback de `setTimeout`).', 'It takes the next task from the queue (for example, a `setTimeout` callback).'),
        l('Repite el ciclo.', 'It repeats the cycle.'),
      ],
      l('Por eso las promesas (microtareas) siempre van antes que el siguiente `setTimeout` (tarea).', 'That is why promises (microtasks) always go before the next `setTimeout` (task).')),
    R('js-p-foreach', 'interview',
      l('Tienes `ids.forEach(async (id) => { await guardar(id); })` y luego `console.log("listo")`. ¿Qué problema hay y cómo lo arreglas?', 'You have `ids.forEach(async (id) => { await guardar(id); })` and then `console.log("listo")`. What is the problem and how do you fix it?'),
      l('`forEach` **no espera** las funciones `async`: "listo" se imprime antes de que terminen los guardados. Usa `for (const id of ids) { await guardar(id); }` (una por una) o `await Promise.all(ids.map(guardar))` (todas a la vez).', '`forEach` **does not wait** for `async` functions: "listo" is printed before the saves finish. Use `for (const id of ids) { await guardar(id); }` (one by one) or `await Promise.all(ids.map(guardar))` (all at once).')),
  ],

  /* ---------------- APIs REST ---------------- */
  'rest-apis': [
    R('rest-p-patch', 'basic',
      l('¿Qué método y ruta usas para cambiar **solo el email** del usuario 5? ¿Por qué no PUT?', 'Which method and route do you use to change **only the email** of user 5? Why not PUT?'),
      l('\`PATCH /users/5\` con \`{"email": "nuevo@x.com"}\`. PUT reemplaza el recurso **completo**: tendrías que mandar todos los campos o los borrarías.', '\`PATCH /users/5\` with \`{"email": "new@x.com"}\`. PUT replaces the **whole** resource: you would have to send every field or you would erase them.')),
    P('rest-p-json', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import json

datos = json.loads('{"tags": ["sql", "api"], "autor": null}')
print(datos["tags"][1], datos["autor"])`,
      'api None',
      l('La lista `tags` tiene "sql" y "api": la posición 1 es **api**. El `null` de JSON se vuelve **None** en Python.', 'The `tags` list has "sql" and "api": position 1 is **api**. JSON\'s `null` becomes **None** in Python.'),
      l('`json.loads` convierte listas JSON en listas de Python y `null` en `None`.', '`json.loads` turns JSON lists into Python lists and `null` into `None`.')),
    R('rest-p-verbs', 'basic',
      l('¿Qué tiene de malo diseñar una API con rutas como `POST /crearUsuario` y `GET /obtenerUsuarios`?', 'What is wrong with designing an API with routes like `POST /createUser` and `GET /getUsers`?'),
      l('La acción ya la dice el **método**: la URL debe nombrar el **recurso**. Lo correcto es `POST /users` y `GET /users`. Así todas las rutas siguen la misma lógica y es fácil adivinarlas.', 'The **method** already states the action: the URL should name the **resource**. The right way is `POST /users` and `GET /users`. That way every route follows the same logic and is easy to guess.')),
    P('rest-p-paginate', 'medium', l('Paginación con offset. ¿Qué imprime?', 'Offset pagination. What does it print?'),
      `productos = list(range(1, 11))       # 10 productos: del 1 al 10

def pagina(limit, offset):
    return productos[offset:offset + limit]

print(pagina(3, 0), pagina(3, 9))`,
      '[1, 2, 3] [10]',
      l('La primera página toma 3 desde el inicio: **[1, 2, 3]**. Con offset 9 solo queda un producto: **[10]**. Un slice que se pasa del final no da error, solo devuelve lo que hay.', 'The first page takes 3 from the start: **[1, 2, 3]**. With offset 9 only one product is left: **[10]**. A slice running past the end does not fail, it just returns what is there.'),
      l('`productos[a:b]` son los elementos de la posición `a` hasta antes de `b`.', '`productos[a:b]` are the elements from position `a` up to before `b`.')),
    C('rest-p-status', 'medium',
      l('¿Qué código falta para que imprima `400 409 201`?', 'Which code is missing so it prints `400 409 201`?'),
      `def crear_usuario(datos, existentes):
    if "email" not in datos:
        return 400                       # faltan datos
    if datos["email"] in existentes:
        return ____                      # ya hay un usuario con ese email
    return 201

print(crear_usuario({}, set()),
      crear_usuario({"email": "a@x.com"}, {"a@x.com"}),
      crear_usuario({"email": "b@x.com"}, set()))`,
      ['200', '404', '409', '500'],
      2,
      l('El email ya registrado **choca** con lo que existe: **409 Conflict**. No es un error del servidor (500) ni algo que no existe (404).', 'The already registered email **clashes** with what exists: **409 Conflict**. It is not a server error (500) nor something missing (404).'),
      l('Cada `return` corresponde a un caso: datos incompletos, conflicto o creado.', 'Each `return` matches a case: incomplete data, conflict or created.')),
    R('rest-p-idempotent', 'medium',
      l('¿Qué métodos HTTP son idempotentes y por qué importa cuando una petición falla por timeout?', 'Which HTTP methods are idempotent and why does it matter when a request times out?'),
      l('**GET, PUT y DELETE** (y HEAD, OPTIONS). Repetirlos deja todo igual que hacerlos una vez, así que **reintentar es seguro**. POST (y PATCH) no lo garantizan: reintentar un POST puede crear duplicados.', '**GET, PUT and DELETE** (and HEAD, OPTIONS). Repeating them leaves everything as doing them once, so **retrying is safe**. POST (and PATCH) do not guarantee it: retrying a POST can create duplicates.')),
    R('rest-p-idem-key', 'interview',
      l('Un usuario aprieta "Pagar", su conexión se corta y la app reintenta. ¿Cómo diseñas la API para no cobrar dos veces?', 'A user presses "Pay", their connection drops and the app retries. How do you design the API to avoid charging twice?'),
      l('Con una **clave de idempotencia**: el cliente genera un identificador único por pago y lo manda en cada intento (por ejemplo, en un header). El servidor guarda qué claves ya procesó; si llega una repetida, **devuelve el resultado guardado** en vez de cobrar otra vez.', 'With an **idempotency key**: the client generates a unique identifier per payment and sends it on every attempt (for example, in a header). The server records which keys it has processed; if a repeated one arrives, it **returns the stored result** instead of charging again.')),
    R('rest-p-graphql', 'interview',
      l('¿Cuándo elegirías **GraphQL** o **gRPC** en vez de REST?', 'When would you choose **GraphQL** or **gRPC** instead of REST?'),
      l('**GraphQL** cuando muchos clientes (web, móvil) necesitan **campos distintos** de varios recursos y quieres evitar traer datos de más o hacer muchas peticiones. **gRPC** para comunicación **entre microservicios**, donde importa la eficiencia. Para una API pública sencilla, REST sigue siendo lo más simple.', '**GraphQL** when many clients (web, mobile) need **different fields** from several resources and you want to avoid over-fetching or many requests. **gRPC** for communication **between microservices**, where efficiency matters. For a simple public API, REST is still the simplest.')),
  ],
};
