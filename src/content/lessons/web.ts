import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, warn } from './helpers';
import { TIENDA } from './exercises/webB';

export const WEB_LESSONS: Lesson[] = [
  {
    id: 'how-web-works',
    track: 'web',
    title: l('Cómo funciona la web y HTTP', 'How the web and HTTP work'),
    summary: l('Qué pasa desde que escribes una URL hasta que ves la página: las partes de una URL, DNS, TCP, TLS, peticiones y respuestas HTTP, códigos de estado y cookies.', 'What happens from typing a URL to seeing the page: the parts of a URL, DNS, TCP, TLS, HTTP requests and responses, status codes and cookies.'),
    minutes: 22,
    blocks: [
      md(
        `## Qué pasa cuando escribes una URL
Escribes una dirección, das Enter y en menos de un segundo ves la página. Por debajo pasan varios pasos, y "¿qué pasa cuando escribes google.com en el navegador?" es de las preguntas más comunes de entrevista.

**Analogía:** mandar una carta y recibir respuesta. Primero averiguas la **dirección** del destinatario, luego **llegas** hasta allá, hablan en un **idioma** que los dos entienden y, si es algo privado, lo mandas en un **sobre sellado**.

## Las partes de una URL
\`https://tienda.com:443/productos/42?color=rojo#reseñas\`
| Parte | En el ejemplo | Para qué sirve |
|---|---|---|
| Protocolo | \`https\` | Cómo hablar con el servidor (HTTP con cifrado) |
| Dominio | \`tienda.com\` | El nombre del servidor |
| Puerto | \`443\` | La "puerta" del servidor (443 es el de HTTPS y casi nunca se escribe) |
| Ruta | \`/productos/42\` | Qué recurso quieres |
| Query string | \`?color=rojo\` | Parámetros extra, en pares \`clave=valor\` separados por \`&\` |
| Fragmento | \`#reseñas\` | Una sección de la página; **no se envía** al servidor |`,
        `## What happens when you type a URL
You type an address, press Enter and in under a second you see the page. Underneath there are several steps, and "what happens when you type google.com in the browser?" is one of the most common interview questions.

**Analogy:** sending a letter and getting a reply. First you find out the recipient's **address**, then you **get** there, you speak a **language** both understand and, if it is private, you send it in a **sealed envelope**.

## The parts of a URL
\`https://tienda.com:443/productos/42?color=rojo#reseñas\`
| Part | In the example | What it is for |
|---|---|---|
| Protocol | \`https\` | How to talk to the server (HTTP with encryption) |
| Domain | \`tienda.com\` | The server's name |
| Port | \`443\` | The server's "door" (443 is HTTPS's and is almost never written) |
| Path | \`/productos/42\` | Which resource you want |
| Query string | \`?color=rojo\` | Extra parameters, in \`key=value\` pairs separated by \`&\` |
| Fragment | \`#reseñas\` | A section of the page; it is **not sent** to the server |`,
      ),
      md(
        `## Paso a paso
1. **DNS: buscar la dirección.** Las computadoras se encuentran por su **dirección IP** (como \`142.250.80.46\`), no por nombres. El **DNS** traduce \`tienda.com\` a su IP, como una agenda de contactos. La respuesta se guarda un rato en caché para no preguntar cada vez.
2. **TCP: abrir la conexión.** El navegador abre una conexión **TCP** con esa IP. TCP garantiza que los datos lleguen **completos y en orden**.
3. **TLS: cifrar** (solo con HTTPS). Navegador y servidor acuerdan claves para **cifrar** todo lo que se digan, y el servidor muestra un **certificado** que prueba que de verdad es \`tienda.com\`. **HTTPS = HTTP + TLS.**
4. **Petición HTTP.** El navegador pide lo que quiere: \`GET /productos/42\`.
5. **Respuesta HTTP.** El servidor contesta con un **código de estado** (por ejemplo 200, "todo bien"), unos **headers** y el **body**: normalmente el HTML de la página.
6. **Mostrar la página.** El navegador lee el HTML y arma el **DOM** (el árbol de elementos de la página), descarga el CSS, el JavaScript y las imágenes que el HTML menciona, calcula dónde va cada cosa (*layout*) y la **pinta** en pantalla.`,
        `## Step by step
1. **DNS: finding the address.** Computers find each other by **IP address** (like \`142.250.80.46\`), not by names. **DNS** translates \`tienda.com\` into its IP, like a contacts list. The answer is cached for a while so it is not asked every time.
2. **TCP: opening the connection.** The browser opens a **TCP** connection to that IP. TCP guarantees the data arrives **complete and in order**.
3. **TLS: encrypting** (HTTPS only). Browser and server agree on keys to **encrypt** everything they say, and the server shows a **certificate** proving it really is \`tienda.com\`. **HTTPS = HTTP + TLS.**
4. **HTTP request.** The browser asks for what it wants: \`GET /productos/42\`.
5. **HTTP response.** The server answers with a **status code** (for example 200, "all good"), some **headers** and the **body**: usually the page's HTML.
6. **Showing the page.** The browser reads the HTML and builds the **DOM** (the tree of the page's elements), downloads the CSS, JavaScript and images the HTML mentions, works out where everything goes (*layout*) and **paints** it on screen.`,
      ),
      md(
        `## Anatomía de una petición y una respuesta
Una petición HTTP es **texto** con tres partes:
- **Línea inicial:** método, ruta y versión (\`GET /api/users/42 HTTP/1.1\`).
- **Headers:** datos extra en pares \`Nombre: valor\`. Algunos comunes: \`Host\` (a qué dominio va), \`Authorization\` (quién eres), \`Accept\` (qué formato aceptas), \`Content-Type\` (en qué formato va el body).
- **Body** (opcional): los datos que envías, por ejemplo al crear algo con POST.

La respuesta tiene la misma forma: una línea con el **código de estado**, headers (como \`Content-Type\`, \`Cache-Control\` o \`Set-Cookie\`) y el body.`,
        `## Anatomy of a request and a response
An HTTP request is **text** with three parts:
- **Start line:** method, path and version (\`GET /api/users/42 HTTP/1.1\`).
- **Headers:** extra data in \`Name: value\` pairs. Some common ones: \`Host\` (which domain it goes to), \`Authorization\` (who you are), \`Accept\` (which format you accept), \`Content-Type\` (which format the body is in).
- **Body** (optional): the data you send, for example when creating something with POST.

The response has the same shape: a line with the **status code**, headers (like \`Content-Type\`, \`Cache-Control\` or \`Set-Cookie\`) and the body.`,
      ),
      code(`GET /api/users/42 HTTP/1.1
Host: api.ejemplo.com
Authorization: Bearer eyJhbGciOi...
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"id": 42, "name": "Ana"}`, 'http'),
      md(
        `## Métodos y códigos de estado
**Métodos** (la acción que pides): \`GET\` leer, \`POST\` crear, \`PUT\` reemplazar, \`PATCH\` modificar una parte, \`DELETE\` borrar. GET es **seguro**: no cambia nada en el servidor, por eso no lleva body. En la lección de APIs REST los verás a fondo.

**Códigos de estado** (cómo le fue a tu petición). El primer dígito dice la familia:
| Código | Significado |
|---|---|
| **2xx — éxito** | **200** OK · **201** Created (se creó algo) · **204** No Content (todo bien, sin body) |
| **3xx — redirección** | **301** se movió para siempre · **302** se movió por ahora · **304** Not Modified (usa tu copia en caché) |
| **4xx — error del cliente** | **400** petición inválida · **401** no autenticado ("¿quién eres?") · **403** sin permiso ("sé quién eres, pero no puedes") · **404** no existe · **429** demasiadas peticiones |
| **5xx — error del servidor** | **500** error interno · **503** servicio no disponible (caído o saturado) |

La diferencia clave: **4xx** es culpa de quien hizo la petición; **5xx**, del servidor.`,
        `## Methods and status codes
**Methods** (the action you ask for): \`GET\` read, \`POST\` create, \`PUT\` replace, \`PATCH\` modify a part, \`DELETE\` delete. GET is **safe**: it changes nothing on the server, which is why it has no body. You will see them in depth in the REST APIs lesson.

**Status codes** (how your request went). The first digit gives the family:
| Code | Meaning |
|---|---|
| **2xx — success** | **200** OK · **201** Created (something was created) · **204** No Content (all good, no body) |
| **3xx — redirect** | **301** moved permanently · **302** moved for now · **304** Not Modified (use your cached copy) |
| **4xx — client error** | **400** invalid request · **401** unauthenticated ("who are you?") · **403** forbidden ("I know who you are, but you cannot") · **404** not found · **429** too many requests |
| **5xx — server error** | **500** internal error · **503** service unavailable (down or overloaded) |

The key difference: **4xx** is the requester's fault; **5xx**, the server's.`,
      ),
      md(
        `## HTTP no tiene memoria
HTTP es **sin estado** (*stateless*): el servidor **no recuerda** tus peticiones anteriores; cada una llega como si fuera la primera. Entonces, ¿cómo sigue la página sabiendo que iniciaste sesión?
- **Cookies:** el servidor responde con \`Set-Cookie: sesion=abc123\`, y desde ahí el navegador manda \`Cookie: sesion=abc123\` **en cada petición** a ese sitio.
- **Tokens:** la app guarda un token y lo manda en el header \`Authorization: Bearer …\`.

**Analogía:** un cajero que no recuerda a nadie: cada vez que te acercas muestras tu credencial.

En Python, \`urllib.parse\` separa una URL en sus partes:`,
        `## HTTP has no memory
HTTP is **stateless**: the server **does not remember** your previous requests; each one arrives as if it were the first. So how does the page keep knowing you logged in?
- **Cookies:** the server answers with \`Set-Cookie: session=abc123\`, and from then on the browser sends \`Cookie: session=abc123\` **with every request** to that site.
- **Tokens:** the app stores a token and sends it in the \`Authorization: Bearer …\` header.

**Analogy:** a cashier who remembers nobody: every time you come up you show your ID.

In Python, \`urllib.parse\` splits a URL into its parts:`,
      ),
      code(`from urllib.parse import urlparse, parse_qs

url = urlparse("https://tienda.com/productos/42?color=rojo&talla=m")
print(url.scheme, url.netloc, url.path)   # imprime: https tienda.com /productos/42
print(parse_qs(url.query))                # imprime: {'color': ['rojo'], 'talla': ['m']}`),
      interview('"¿Qué pasa cuando escribes google.com en el navegador?": recorre los pasos en orden (DNS → TCP → TLS → petición → respuesta → mostrar la página) y profundiza en el que te pregunten.', '"What happens when you type google.com in the browser?": walk through the steps in order (DNS → TCP → TLS → request → response → showing the page) and go deeper where you are asked.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| DNS | Traduce el nombre (\`tienda.com\`) a una dirección IP |
| TCP | Conexión que garantiza que los datos lleguen completos y en orden |
| TLS / HTTPS | Cifra la comunicación y prueba la identidad del servidor con un certificado |
| Petición | Método + ruta, headers y body opcional |
| Respuesta | Código de estado, headers y body |
| 2xx / 3xx / 4xx / 5xx | Éxito / redirección / error del cliente / error del servidor |
| 401 vs 403 | No sé quién eres / sé quién eres, pero no tienes permiso |
| Sin estado | El servidor no recuerda; las cookies y los tokens le dan "memoria" |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| DNS | Translates the name (\`tienda.com\`) into an IP address |
| TCP | A connection that guarantees data arrives complete and in order |
| TLS / HTTPS | Encrypts the communication and proves the server's identity with a certificate |
| Request | Method + path, headers and an optional body |
| Response | Status code, headers and body |
| 2xx / 3xx / 4xx / 5xx | Success / redirect / client error / server error |
| 401 vs 403 | I do not know who you are / I know who you are, but you are not allowed |
| Stateless | The server does not remember; cookies and tokens give it "memory" |`,
      ),
    ],
    quiz: [
      q('¿Qué hace el DNS?', 'What does DNS do?', [['Cifra la conexión', 'Encrypts the connection'], ['Traduce nombres de dominio a IPs', 'Translates domain names to IPs'], ['Renderiza HTML', 'Renders HTML'], ['Guarda cookies', 'Stores cookies']], 1, 'Como una agenda: del nombre a la dirección.', 'Like a contacts list: from the name to the address.'),
      q('Un 404 indica…', 'A 404 means…', [['Error del servidor', 'Server error'], ['Recurso no encontrado', 'Resource not found'], ['No autenticado', 'Not authenticated'], ['Redirección', 'Redirect']], 1, '4xx = error del cliente: pidió algo que no existe.', '4xx = client error: it asked for something that does not exist.'),
      q('401 vs 403', '401 vs 403', [['Son iguales', 'They are the same'], ['401 no autenticado, 403 sin permiso', '401 unauthenticated, 403 no permission'], ['401 sin permiso, 403 no autenticado', '401 no permission, 403 unauthenticated'], ['Ambos son errores del servidor', 'Both are server errors']], 1,
        '401: ¿quién eres? 403: sé quién eres, pero no puedes.', '401: who are you? 403: I know who you are, but you cannot.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('En `https://tienda.com/buscar?q=zapatos#arriba`, ¿qué parte es la query string?', 'In `https://tienda.com/buscar?q=zapatos#arriba`, which part is the query string?', [['`/buscar`', '`/buscar`'], ['`q=zapatos`', '`q=zapatos`'], ['`#arriba`', '`#arriba`'], ['`tienda.com`', '`tienda.com`']], 1,
        'Va después del `?`. El fragmento `#arriba` ni siquiera se envía al servidor.', 'It comes after `?`. The fragment `#arriba` is not even sent to the server.'),
      q('¿Qué garantiza TCP?', 'What does TCP guarantee?', [['Que los datos lleguen completos y en orden', 'That data arrives complete and in order'], ['Que los datos estén cifrados', 'That data is encrypted'], ['Que el dominio exista', 'That the domain exists'], ['Que la página cargue rápido', 'That the page loads fast']], 0,
        'El cifrado lo agrega TLS, encima de TCP.', 'Encryption is added by TLS, on top of TCP.'),
      q('¿Qué agrega TLS (la "S" de HTTPS)?', 'What does TLS (the "S" in HTTPS) add?', [['Más velocidad', 'More speed'], ['Cifrado y un certificado que prueba la identidad del servidor', 'Encryption and a certificate proving the server\'s identity'], ['Cookies', 'Cookies'], ['Compresión de imágenes', 'Image compression']], 1,
        'Nadie en medio puede leer ni cambiar lo que se envía.', 'Nobody in between can read or change what is sent.'),
      q('¿Qué tres partes tiene una petición HTTP?', 'What three parts does an HTTP request have?', [['Línea inicial (método y ruta), headers y body opcional', 'Start line (method and path), headers and an optional body'], ['Dominio, IP y puerto', 'Domain, IP and port'], ['HTML, CSS y JavaScript', 'HTML, CSS and JavaScript'], ['Usuario, contraseña y token', 'User, password and token']], 0,
        'La respuesta tiene la misma forma, con el código de estado en la primera línea.', 'The response has the same shape, with the status code on the first line.'),
      q('¿Por qué se dice que GET es un método **seguro**?', 'Why is GET called a **safe** method?', [['Porque va cifrado', 'Because it is encrypted'], ['Porque no cambia nada en el servidor: solo lee', 'Because it changes nothing on the server: it only reads'], ['Porque necesita contraseña', 'Because it needs a password'], ['Porque nunca falla', 'Because it never fails']], 1,
        'Por eso no lleva body.', 'That is why it has no body.'),
      q('¿Qué código devuelves cuando se creó un recurso nuevo?', 'Which code do you return when a new resource was created?', [['200', '200'], ['204', '204'], ['201', '201'], ['301', '301']], 2,
        '201 Created. 204 es "todo bien, pero sin body".', '201 Created. 204 is "all good, but no body".'),
      q('Tu servidor se cae por un error en tu código. ¿Qué familia de códigos corresponde?', 'Your server crashes because of a bug in your code. Which code family applies?', [['2xx', '2xx'], ['3xx', '3xx'], ['4xx', '4xx'], ['5xx', '5xx']], 3,
        '5xx es culpa del servidor (500); 4xx, de quien hizo la petición.', '5xx is the server\'s fault (500); 4xx, the requester\'s.'),
      q('Un cliente hace miles de peticiones por segundo y el servidor lo frena. ¿Qué código recibe?', 'A client makes thousands of requests per second and the server throttles it. Which code does it get?', [['429 Too Many Requests', '429 Too Many Requests'], ['404', '404'], ['500', '500'], ['301', '301']], 0,
        'Es el código de los límites de velocidad (*rate limiting*).', 'It is the code used for rate limiting.'),
      q('¿Qué significa que HTTP sea **sin estado**?', 'What does it mean that HTTP is **stateless**?', [['Que no tiene códigos de estado', 'That it has no status codes'], ['Que el servidor no recuerda las peticiones anteriores', 'That the server does not remember previous requests'], ['Que no puede enviar datos', 'That it cannot send data'], ['Que no usa TCP', 'That it does not use TCP']], 1,
        'Las cookies y los tokens son la forma de darle "memoria".', 'Cookies and tokens are how it gets "memory".'),
      q('¿Cómo hace una cookie para que el servidor te "recuerde"?', 'How does a cookie make the server "remember" you?', [['El servidor la manda con `Set-Cookie` y el navegador la devuelve en cada petición con `Cookie`', 'The server sends it with `Set-Cookie` and the browser sends it back on each request with `Cookie`'], ['El navegador la guarda en el servidor', 'The browser stores it on the server'], ['Va dentro de la URL', 'It goes inside the URL'], ['Solo se envía una vez', 'It is sent only once']], 0,
        'Así cada petición lleva el identificador de tu sesión.', 'That way each request carries your session identifier.'),
      q('Al recibir el HTML, ¿qué construye el navegador para representar los elementos de la página?', 'On receiving the HTML, what does the browser build to represent the page\'s elements?', [['El DNS', 'The DNS'], ['El DOM', 'The DOM'], ['Un certificado', 'A certificate'], ['Una cookie', 'A cookie']], 1,
        'Luego descarga CSS, JavaScript e imágenes, calcula el layout y pinta.', 'Then it downloads CSS, JavaScript and images, computes the layout and paints.'),
    ],
    concepts: [
      concept('Pasos desde escribir una URL hasta ver la página', 'Steps from typing a URL to seeing the page', 'DNS → TCP (+TLS) → petición HTTP → respuesta → parseo, DOM/CSSOM, layout y pintado.', 'DNS → TCP (+TLS) → HTTP request → response → parsing, DOM/CSSOM, layout and paint.'),
      concept('¿Qué significa que HTTP sea sin estado?', 'What does it mean that HTTP is stateless?', 'El servidor no recuerda peticiones anteriores; el estado se mantiene con cookies, sesiones o tokens.', 'The server does not remember previous requests; state is kept with cookies, sessions or tokens.'),
    ],
  },
  {
    id: 'rest-apis',
    track: 'web',
    title: l('APIs REST y su diseño', 'REST APIs and their design'),
    summary: l('Qué es una API, cómo se diseña una REST (recursos, métodos y códigos), JSON, idempotencia, paginación, versionado y cuándo usar GraphQL o gRPC.', 'What an API is, how a REST one is designed (resources, methods and codes), JSON, idempotency, pagination, versioning and when to use GraphQL or gRPC.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Qué es una API?
Una **API** (*Application Programming Interface*) es un **contrato** para que dos programas se comuniquen: dice qué puedes pedir, cómo pedirlo y qué te van a responder. La app de tu celular, por ejemplo, le pide tus pedidos al servidor a través de una API.

**Analogía:** el menú de un restaurante. Te dice qué puedes pedir y cómo, pero no ves la cocina ni necesitas saber cómo se prepara cada plato.

**REST** es el estilo más común para diseñar APIs sobre HTTP:
- Todo es un **recurso** (usuarios, pedidos, productos) con su propia **URL**.
- Los **métodos HTTP** dicen qué hacer con ese recurso.
- Los datos viajan normalmente en **JSON**.
- Cada petición trae todo lo necesario (es **sin estado**, como HTTP).

## Recursos y métodos
Las URLs nombran **recursos** con **sustantivos en plural**: \`/users\`, \`/users/42\`. Si un recurso pertenece a otro, se anida: \`/users/42/orders\` son los pedidos del usuario 42. La **acción** la pone el método, no la URL: \`POST /users\`, no \`POST /crearUsuario\`.

| Acción | Método | Ruta | Respuesta típica |
|---|---|---|---|
| Listar | GET | /users | 200 |
| Obtener uno | GET | /users/42 | 200, o 404 si no existe |
| Crear | POST | /users | 201 |
| Reemplazar completo | PUT | /users/42 | 200 |
| Modificar una parte | PATCH | /users/42 | 200 |
| Borrar | DELETE | /users/42 | 204 (sin body) |

**PUT vs PATCH:** PUT manda el recurso **completo** y lo reemplaza; PATCH manda **solo los campos que cambian** (por ejemplo, solo el email).`,
        `## What is an API?
An **API** (*Application Programming Interface*) is a **contract** for two programs to talk: it says what you can ask for, how to ask and what you will get back. Your phone app, for example, asks the server for your orders through an API.

**Analogy:** a restaurant menu. It tells you what you can order and how, but you do not see the kitchen or need to know how each dish is made.

**REST** is the most common style for designing APIs over HTTP:
- Everything is a **resource** (users, orders, products) with its own **URL**.
- **HTTP methods** say what to do with that resource.
- Data usually travels as **JSON**.
- Each request carries everything needed (it is **stateless**, like HTTP).

## Resources and methods
URLs name **resources** with **plural nouns**: \`/users\`, \`/users/42\`. If a resource belongs to another, it is nested: \`/users/42/orders\` are user 42's orders. The **action** comes from the method, not the URL: \`POST /users\`, not \`POST /createUser\`.

| Action | Method | Route | Typical response |
|---|---|---|---|
| List | GET | /users | 200 |
| Get one | GET | /users/42 | 200, or 404 if missing |
| Create | POST | /users | 201 |
| Replace entirely | PUT | /users/42 | 200 |
| Modify a part | PATCH | /users/42 | 200 |
| Delete | DELETE | /users/42 | 204 (no body) |

**PUT vs PATCH:** PUT sends the **whole** resource and replaces it; PATCH sends **only the fields that change** (for example, just the email).`,
      ),
      md(
        `## JSON: el formato de los datos
**JSON** es texto con una forma parecida a los diccionarios y listas de Python: \`{"id": 42, "nombre": "Ana", "activo": true}\`. Diferencias con Python: los textos van con comillas **dobles**, y se escribe \`true\`, \`false\` y \`null\` (en vez de \`True\`, \`False\` y \`None\`).

En Python, el módulo \`json\` convierte entre los dos:
- \`json.dumps(dato)\`: de diccionario a **texto** JSON (para enviarlo).
- \`json.loads(texto)\`: de texto JSON a **diccionario** (al recibirlo).`,
        `## JSON: the data format
**JSON** is text shaped much like Python dictionaries and lists: \`{"id": 42, "name": "Ana", "active": true}\`. Differences from Python: strings use **double** quotes, and you write \`true\`, \`false\` and \`null\` (instead of \`True\`, \`False\` and \`None\`).

In Python, the \`json\` module converts between the two:
- \`json.dumps(data)\`: from dictionary to JSON **text** (to send it).
- \`json.loads(text)\`: from JSON text to a **dictionary** (when receiving it).`,
      ),
      code(`import json

usuario = {"id": 42, "nombre": "Ana", "activo": True}
texto = json.dumps(usuario)        # de diccionario a texto JSON
print(texto)                       # imprime: {"id": 42, "nombre": "Ana", "activo": true}

de_vuelta = json.loads(texto)      # de texto JSON a diccionario
print(de_vuelta["nombre"])         # imprime: Ana`),
      md(
        `## Idempotencia: ¿qué pasa si la petición se repite?
Una operación es **idempotente** si **repetirla tiene el mismo efecto que hacerla una vez**.
- **GET, PUT y DELETE son idempotentes.** Reemplazar el usuario 42 con los mismos datos dos veces lo deja igual; borrarlo dos veces lo deja borrado.
- **POST no lo es:** cada POST **crea algo nuevo**, así que repetirlo crea duplicados. **PATCH** tampoco lo garantiza (por ejemplo, "suma 1 al contador").

**Por qué importa:** en internet las peticiones fallan. Si tu app manda un pago y no recibe respuesta (*timeout*), ¿lo reintenta? Con una operación idempotente reintentar es seguro. Con POST podrías **cobrar dos veces**. La solución común es una **clave de idempotencia**: el cliente manda un identificador único con la petición, y si el servidor ya lo vio, devuelve el resultado anterior en vez de cobrar otra vez.

**Analogía:** apretar varias veces el botón del elevador no lo llama varias veces (idempotente); apretar varias veces "comprar" sí podría hacer varias compras.`,
        `## Idempotency: what if the request is repeated?
An operation is **idempotent** if **repeating it has the same effect as doing it once**.
- **GET, PUT and DELETE are idempotent.** Replacing user 42 with the same data twice leaves it the same; deleting it twice leaves it deleted.
- **POST is not:** each POST **creates something new**, so repeating it creates duplicates. **PATCH** does not guarantee it either (for example, "add 1 to the counter").

**Why it matters:** on the internet requests fail. If your app sends a payment and gets no answer (*timeout*), does it retry? With an idempotent operation retrying is safe. With POST you could **charge twice**. The common fix is an **idempotency key**: the client sends a unique identifier with the request, and if the server has already seen it, it returns the previous result instead of charging again.

**Analogy:** pressing the elevator button several times does not call it several times (idempotent); pressing "buy" several times could make several purchases.`,
      ),
      code(`usuarios = {}
siguiente_id = 1

def post(datos):                     # crea uno nuevo cada vez
    global siguiente_id
    usuarios[siguiente_id] = datos
    siguiente_id += 1

def put(id, datos):                  # deja el recurso id con estos datos
    usuarios[id] = datos

post({"nombre": "Ana"})
post({"nombre": "Ana"})              # el cliente reintentó: ¡quedó duplicada!
put(10, {"nombre": "Luis"})
put(10, {"nombre": "Luis"})          # reintento: queda igual
print(len(usuarios))                 # imprime: 3`),
      md(
        `## Diseñar bien una API
- **Códigos correctos:** 400 si los datos son inválidos (falta el email), 404 si no existe, **409 Conflict** si choca con lo que ya hay (el email ya está registrado), 201 al crear.
- **Errores con un formato consistente:** siempre algo como \`{"error": "email es requerido"}\`, para que el cliente sepa dónde buscar.
- **Valida la entrada** antes de usarla.
- **Paginación:** no devuelvas un millón de filas de golpe. Con **offset** (\`?limit=20&offset=40\`, "dame 20 a partir del 40") es simple; con **cursor** (\`?limit=20&cursor=abc\`, "dame 20 después de este elemento") es más estable cuando se agregan datos mientras paginas.
- **Filtros y orden** en la query string: \`/products?color=rojo&sort=precio\`.
- **Versionado:** \`/v1/users\`. Si cambias la API de forma incompatible, publicas \`/v2/\` y las apps viejas siguen funcionando con \`/v1/\`.

Así se ve en **Express** (un framework de Node.js): \`req.params\` trae las partes de la ruta (el \`:id\`), \`req.body\` el JSON recibido, y \`res.status(201).json(…)\` responde con ese código y ese JSON.`,
        `## Designing an API well
- **Correct codes:** 400 if the data is invalid (missing email), 404 if it does not exist, **409 Conflict** if it clashes with what is there (the email is already registered), 201 on create.
- **Errors in a consistent format:** always something like \`{"error": "email is required"}\`, so the client knows where to look.
- **Validate input** before using it.
- **Pagination:** do not return a million rows at once. With **offset** (\`?limit=20&offset=40\`, "give me 20 starting at 40") it is simple; with a **cursor** (\`?limit=20&cursor=abc\`, "give me 20 after this item") it is more stable when data is added while you page.
- **Filters and sorting** in the query string: \`/products?color=red&sort=price\`.
- **Versioning:** \`/v1/users\`. If you change the API in an incompatible way, you publish \`/v2/\` and old apps keep working with \`/v1/\`.

This is how it looks in **Express** (a Node.js framework): \`req.params\` holds the route parts (the \`:id\`), \`req.body\` the received JSON, and \`res.status(201).json(…)\` answers with that code and that JSON.`,
      ),
      code(`// Express (Node.js)
app.post('/v1/users', async (req, res) => {
  const { name, email } = req.body;                       // el JSON que mandó el cliente
  if (!email) return res.status(400).json({ error: 'email es requerido' });
  if (await db.users.existe(email)) return res.status(409).json({ error: 'email ya registrado' });
  const user = await db.users.create({ name, email });
  res.status(201).json(user);                             // 201: se creó
});

app.get('/v1/users/:id', async (req, res) => {
  const user = await db.users.find(req.params.id);        // :id de la ruta
  if (!user) return res.status(404).json({ error: 'no encontrado' });
  res.json(user);                                         // 200 por defecto
});`, 'javascript'),
      md(
        `## Alternativas a REST
- **GraphQL:** un solo endpoint donde el cliente **pide exactamente los campos que necesita**, incluso de varios recursos a la vez. Evita traer datos de más o hacer muchas peticiones, pero es más complejo de montar y de cachear.
- **gRPC:** mensajes binarios muy eficientes, ideal **entre microservicios** dentro de una empresa. Menos práctico para llamar directo desde el navegador.

REST sigue siendo la opción por defecto: simple, entendida por todos y fácil de cachear con HTTP.`,
        `## Alternatives to REST
- **GraphQL:** a single endpoint where the client **asks for exactly the fields it needs**, even from several resources at once. It avoids over-fetching or making many requests, but it is more complex to set up and to cache.
- **gRPC:** very efficient binary messages, ideal **between microservices** within a company. Less practical to call straight from the browser.

REST is still the default option: simple, understood by everyone and easy to cache with HTTP.`,
      ),
      md(
        `## Resumen
| Tema | En una frase |
|---|---|
| Recursos | Sustantivos en plural en la URL (\`/users/42/orders\`); la acción la pone el método |
| Métodos | GET leer, POST crear (201), PUT reemplazar, PATCH modificar una parte, DELETE borrar (204) |
| JSON | \`json.dumps\` de dato a texto, \`json.loads\` de texto a dato |
| Idempotencia | Repetir = hacer una vez. GET, PUT y DELETE sí; POST no (claves de idempotencia) |
| Códigos | 400 datos inválidos, 404 no existe, 409 conflicto, 201 creado |
| Paginación | Offset (simple) o cursor (estable) |
| Versionado | \`/v1/\`, \`/v2/\` para cambios incompatibles |
| GraphQL / gRPC | Campos a la medida / binario entre microservicios |`,
        `## Summary
| Topic | In one sentence |
|---|---|
| Resources | Plural nouns in the URL (\`/users/42/orders\`); the method gives the action |
| Methods | GET read, POST create (201), PUT replace, PATCH modify a part, DELETE delete (204) |
| JSON | \`json.dumps\` from data to text, \`json.loads\` from text to data |
| Idempotency | Repeating = doing once. GET, PUT and DELETE yes; POST no (idempotency keys) |
| Codes | 400 invalid data, 404 not found, 409 conflict, 201 created |
| Pagination | Offset (simple) or cursor (stable) |
| Versioning | \`/v1/\`, \`/v2/\` for incompatible changes |
| GraphQL / gRPC | Tailored fields / binary between microservices |`,
      ),
    ],
    quiz: [
      q('¿Qué método NO es idempotente?', 'Which method is NOT idempotent?', [['GET', 'GET'], ['PUT', 'PUT'], ['POST', 'POST'], ['DELETE', 'DELETE']], 2, 'Repetir un POST puede crear duplicados.', 'Repeating a POST may create duplicates.'),
      q('Código correcto al crear un recurso', 'Correct code when creating a resource', [['200', '200'], ['201', '201'], ['204', '204'], ['302', '302']], 1, '201 Created.', '201 Created.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es una API?', 'What is an API?', [['Una base de datos', 'A database'], ['Un contrato para que dos programas se comuniquen: qué se puede pedir y qué se responde', 'A contract for two programs to talk: what can be asked and what is answered'], ['Un lenguaje de programación', 'A programming language'], ['Una página web', 'A web page']], 1,
        'Como el menú de un restaurante: qué puedes pedir, sin ver la cocina.', 'Like a restaurant menu: what you can order, without seeing the kitchen.'),
      q('¿Cuál es la mejor ruta REST para crear un usuario?', 'Which is the best REST route to create a user?', [['`GET /crearUsuario`', '`GET /createUser`'], ['`POST /users`', '`POST /users`'], ['`POST /users/crear`', '`POST /users/create`'], ['`PUT /nuevoUsuario`', '`PUT /newUser`']], 1,
        'Sustantivo en plural en la URL; la acción la pone el método.', 'Plural noun in the URL; the method gives the action.'),
      q('Quieres cambiar **solo el email** del usuario 5. ¿Qué método usas?', 'You want to change **only the email** of user 5. Which method do you use?', [['PUT /users/5', 'PUT /users/5'], ['PATCH /users/5', 'PATCH /users/5'], ['POST /users/5', 'POST /users/5'], ['GET /users/5', 'GET /users/5']], 1,
        'PATCH manda solo los campos que cambian; PUT reemplazaría el usuario completo.', 'PATCH sends only the changing fields; PUT would replace the whole user.'),
      q('¿Qué código suele devolver un DELETE que salió bien?', 'What code does a successful DELETE usually return?', [['201', '201'], ['204: todo bien, sin body', '204: all good, no body'], ['404', '404'], ['500', '500']], 1,
        'No hay nada que devolver, así que va sin body.', 'There is nothing to return, so there is no body.'),
      q('¿Qué hace `json.loads(texto)` en Python?', 'What does `json.loads(text)` do in Python?', [['Convierte un diccionario en texto JSON', 'Turns a dictionary into JSON text'], ['Convierte texto JSON en un diccionario (o lista)', 'Turns JSON text into a dictionary (or list)'], ['Envía el JSON al servidor', 'Sends the JSON to the server'], ['Valida el email', 'Validates the email']], 1,
        '`json.dumps` hace lo contrario: de dato a texto.', '`json.dumps` does the opposite: from data to text.'),
      q('¿Qué significa que una operación sea **idempotente**?', 'What does it mean for an operation to be **idempotent**?', [['Que es muy rápida', 'That it is very fast'], ['Que repetirla tiene el mismo efecto que hacerla una vez', 'That repeating it has the same effect as doing it once'], ['Que no cambia nada', 'That it changes nothing'], ['Que necesita autenticación', 'That it needs authentication']], 1,
        'DELETE cambia algo (borra), pero borrar dos veces deja lo mismo que borrar una.', 'DELETE changes something (it deletes), but deleting twice leaves the same as deleting once.'),
      q('Tu app manda un pago con POST y no recibe respuesta. ¿Cómo evitas cobrar dos veces si reintenta?', 'Your app sends a payment with POST and gets no answer. How do you avoid charging twice if it retries?', [['No reintentando nunca', 'Never retrying'], ['Con una clave de idempotencia: el servidor reconoce la petición repetida y devuelve el resultado anterior', 'With an idempotency key: the server recognizes the repeated request and returns the previous result'], ['Cambiando a GET', 'Switching to GET'], ['Esperando más tiempo', 'Waiting longer']], 1,
        'El cliente manda un identificador único con la petición.', 'The client sends a unique identifier with the request.'),
      q('Alguien intenta registrarse con un email que ya existe. ¿Qué código es el más adecuado?', 'Someone tries to sign up with an email that already exists. Which code fits best?', [['200', '200'], ['404', '404'], ['409 Conflict', '409 Conflict'], ['500', '500']], 2,
        'La petición choca con lo que ya hay. 400 sería si los datos fueran inválidos (por ejemplo, sin email).', 'The request clashes with what is there. 400 would be for invalid data (for example, no email).'),
      q('¿Para qué sirve paginar una API?', 'What is paginating an API for?', [['Para que se vea más bonita', 'To make it look nicer'], ['Para no devolver todos los resultados de golpe, sino de a poco', 'To avoid returning every result at once, but a bit at a time'], ['Para cifrar los datos', 'To encrypt the data'], ['Para versionarla', 'To version it']], 1,
        'Con offset (`?limit=20&offset=40`) o con cursor.', 'With offset (`?limit=20&offset=40`) or with a cursor.'),
      q('¿Qué ventaja tiene la paginación con **cursor** frente a la de offset?', 'What advantage does **cursor** pagination have over offset?', [['Es más fácil de escribir', 'It is easier to write'], ['Es más estable si se agregan datos mientras paginas', 'It is more stable if data is added while you page'], ['Devuelve más datos', 'It returns more data'], ['No necesita servidor', 'It needs no server']], 1,
        'Con offset, si se agregan filas, puedes ver una repetida o saltarte una.', 'With offset, if rows are added, you may see one twice or skip one.'),
      q('¿Para qué sirve poner `/v1/` en las rutas?', 'What is putting `/v1/` in routes for?', [['Para que sea más rápida', 'To make it faster'], ['Para poder publicar cambios incompatibles en `/v2/` sin romper las apps que usan `/v1/`', 'To publish incompatible changes in `/v2/` without breaking apps using `/v1/`'], ['Para la seguridad', 'For security'], ['Es obligatorio en HTTP', 'It is required by HTTP']], 1,
        'Es el versionado de la API.', 'It is API versioning.'),
      q('¿Qué permite **GraphQL** que REST no hace fácilmente?', 'What does **GraphQL** allow that REST does not easily do?', [['Usar HTTP', 'Using HTTP'], ['Que el cliente pida exactamente los campos que necesita en una sola petición', 'That the client asks for exactly the fields it needs in a single request'], ['Guardar archivos', 'Storing files'], ['Ser más simple de cachear', 'Being simpler to cache']], 1,
        'A cambio es más complejo de montar y de cachear. gRPC, en cambio, brilla entre microservicios.', 'In exchange it is more complex to set up and cache. gRPC, instead, shines between microservices.'),
    ],
    concepts: [
      concept('¿Qué es la idempotencia en HTTP?', 'What is idempotency in HTTP?', 'Repetir la misma petición tiene el mismo efecto que hacerla una vez. Lo son GET, HEAD, OPTIONS, PUT y DELETE; POST y PATCH no garantizan serlo.', 'Repeating the same request has the same effect as doing it once. GET, HEAD, OPTIONS, PUT and DELETE are; POST and PATCH are not guaranteed to be.'),
      concept('PUT vs PATCH', 'PUT vs PATCH', 'PUT reemplaza el recurso completo; PATCH modifica solo algunos campos.', 'PUT replaces the whole resource; PATCH modifies only some fields.'),
    ],
  },
  {
    id: 'sql',
    track: 'web',
    title: l('Bases de datos SQL', 'SQL databases'),
    summary: l('Tablas y claves, consultas con SELECT, agrupar con GROUP BY y HAVING, JOINs, subconsultas, índices, transacciones ACID, normalización y el problema N+1.', 'Tables and keys, queries with SELECT, grouping with GROUP BY and HAVING, JOINs, subqueries, indexes, ACID transactions, normalization and the N+1 problem.'),
    minutes: 30,
    blocks: [
      md(
        `## ¿Qué es una base de datos relacional?
Guarda los datos en **tablas**, parecidas a hojas de cálculo: cada **fila** es un registro (un cliente) y cada **columna** un dato de ese registro (su nombre, su ciudad). Para hablar con ella se usa **SQL**, un lenguaje para pedir datos ("dame los clientes de CDMX").

En toda la lección usamos estas dos tablas de una tienda:

**clientes**
| id | nombre | ciudad |
|---|---|---|
| 1 | Ana | CDMX |
| 2 | Luis | Monterrey |
| 3 | Eva | CDMX |

**pedidos**
| id | cliente_id | total |
|---|---|---|
| 1 | 1 | 300 |
| 2 | 1 | 150 |
| 3 | 2 | 500 |

- La **clave primaria** (*primary key*, PK) identifica cada fila sin repetirse: el \`id\` de cada tabla.
- La **clave foránea** (*foreign key*, FK) apunta a la clave primaria de otra tabla: \`pedidos.cliente_id\` dice de qué cliente es cada pedido. Así, los pedidos 1 y 2 son de Ana, el 3 de Luis, y Eva no tiene pedidos.
- **Relaciones:** **1–N** (un cliente tiene muchos pedidos), **1–1** (un usuario tiene un perfil) y **N–M** (un pedido tiene muchos productos y un producto está en muchos pedidos), que necesita una **tabla intermedia** con las dos claves.`,
        `## What is a relational database?
It stores data in **tables**, similar to spreadsheets: each **row** is a record (a customer) and each **column** a piece of data about it (their name, their city). To talk to it you use **SQL**, a language for asking for data ("give me the customers in CDMX").

Throughout the lesson we use these two tables from a store:

**clientes** (customers)
| id | nombre | ciudad |
|---|---|---|
| 1 | Ana | CDMX |
| 2 | Luis | Monterrey |
| 3 | Eva | CDMX |

**pedidos** (orders)
| id | cliente_id | total |
|---|---|---|
| 1 | 1 | 300 |
| 2 | 1 | 150 |
| 3 | 2 | 500 |

- The **primary key** (PK) identifies each row without repeating: each table's \`id\`.
- The **foreign key** (FK) points to another table's primary key: \`pedidos.cliente_id\` says whose order each one is. So orders 1 and 2 are Ana's, 3 is Luis's, and Eva has no orders.
- **Relationships:** **1–N** (a customer has many orders), **1–1** (a user has one profile) and **N–M** (an order has many products and a product is in many orders), which needs a **join table** with both keys.`,
      ),
      md(
        `## Consultar: SELECT
\`\`\`sql
SELECT columnas FROM tabla WHERE condición ORDER BY columna LIMIT n;
\`\`\`
- \`SELECT\`: qué columnas quieres (\`*\` = todas).
- \`FROM\`: de qué tabla.
- \`WHERE\`: qué filas (\`ciudad = 'CDMX'\`, \`total >= 300\`). Los textos van entre comillas simples.
- \`ORDER BY\`: en qué orden (\`DESC\` = de mayor a menor).
- \`LIMIT\`: cuántas filas como máximo.`,
        `## Querying: SELECT
\`\`\`sql
SELECT columns FROM table WHERE condition ORDER BY column LIMIT n;
\`\`\`
- \`SELECT\`: which columns you want (\`*\` = all).
- \`FROM\`: from which table.
- \`WHERE\`: which rows (\`ciudad = 'CDMX'\`, \`total >= 300\`). Text goes in single quotes.
- \`ORDER BY\`: in what order (\`DESC\` = largest first).
- \`LIMIT\`: how many rows at most.`,
      ),
      code(`SELECT nombre FROM clientes WHERE ciudad = 'CDMX' ORDER BY nombre;
-- resultado: Ana, Eva

SELECT total FROM pedidos ORDER BY total DESC LIMIT 2;
-- resultado: 500, 300`, 'sql'),
      md(
        `## Probar SQL desde Python
Python trae **sqlite3**, una base de datos completa que no hay que instalar. Es la forma más fácil de practicar, y la usan los ejercicios de esta lección:
- \`sqlite3.connect(":memory:")\` crea una base de datos temporal, en memoria.
- \`db.executescript(…)\` ejecuta varias instrucciones SQL seguidas (crear tablas, insertar datos).
- \`db.execute(sql).fetchall()\` devuelve **una lista de tuplas**, una por fila: \`[('Luis', 'Monterrey')]\`.

Para no repetir código, los ejercicios usan dos funciones de ayuda: \`nombres(sql)\` devuelve la **primera columna** de cada fila en una lista, y \`uno(sql)\` devuelve **un solo valor** (útil para \`COUNT\` o \`SUM\`).`,
        `## Trying SQL from Python
Python ships with **sqlite3**, a complete database that needs no install. It is the easiest way to practice, and this lesson's exercises use it:
- \`sqlite3.connect(":memory:")\` creates a temporary in-memory database.
- \`db.executescript(…)\` runs several SQL statements in a row (create tables, insert data).
- \`db.execute(sql).fetchall()\` returns **a list of tuples**, one per row: \`[('Luis', 'Monterrey')]\`.

To avoid repeating code, the exercises use two helper functions: \`nombres(sql)\` returns the **first column** of each row in a list, and \`uno(sql)\` returns **a single value** (handy for \`COUNT\` or \`SUM\`).`,
      ),
      code(`${TIENDA}
print(nombres("SELECT nombre FROM clientes ORDER BY nombre"))          # imprime: ['Ana', 'Eva', 'Luis']
print(uno("SELECT COUNT(*) FROM pedidos"))                             # imprime: 3
print(db.execute("SELECT nombre, ciudad FROM clientes WHERE id = 2").fetchall())   # imprime: [('Luis', 'Monterrey')]`),
      md(
        `## Agrupar: GROUP BY y HAVING
Las **funciones de agregación** resumen muchas filas en un valor: \`COUNT(*)\` (cuántas), \`SUM\`, \`AVG\` (promedio), \`MIN\` y \`MAX\`.

\`GROUP BY columna\` junta las filas que tienen el mismo valor en esa columna y calcula la agregación **por cada grupo**: "cuánto gastó **cada** cliente".

- \`WHERE\` filtra **filas**, **antes** de agrupar ("solo pedidos de más de 100").
- \`HAVING\` filtra **grupos**, **después** de agrupar ("solo clientes que gastaron más de 460"). Por eso \`HAVING\` puede usar \`SUM\` o \`COUNT\` y \`WHERE\` no.`,
        `## Grouping: GROUP BY and HAVING
**Aggregate functions** summarize many rows into one value: \`COUNT(*)\` (how many), \`SUM\`, \`AVG\` (average), \`MIN\` and \`MAX\`.

\`GROUP BY column\` gathers the rows with the same value in that column and computes the aggregate **per group**: "how much **each** customer spent".

- \`WHERE\` filters **rows**, **before** grouping ("only orders over 100").
- \`HAVING\` filters **groups**, **after** grouping ("only customers who spent more than 460"). That is why \`HAVING\` can use \`SUM\` or \`COUNT\` and \`WHERE\` cannot.`,
      ),
      code(`SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS gastado
FROM pedidos
GROUP BY cliente_id;
-- resultado: (1, 2, 450), (2, 1, 500)

SELECT cliente_id FROM pedidos GROUP BY cliente_id HAVING SUM(total) > 460;
-- resultado: 2`, 'sql'),
      md(
        `## Combinar tablas: JOIN
Un **JOIN** une filas de dos tablas usando la relación entre ellas (\`ON p.cliente_id = c.id\`). Las letras \`c\` y \`p\` son **alias**: nombres cortos para no escribir el de la tabla completo.
- **INNER JOIN** (o solo \`JOIN\`): solo las filas que tienen pareja en **las dos** tablas. Eva no aparece, porque no tiene pedidos.
- **LEFT JOIN**: **todas** las filas de la tabla de la izquierda, con su pareja de la derecha si la tiene, o \`NULL\` (vacío) si no. Eva aparece con su pedido en \`NULL\`.

**Clientes sin pedidos:** haces un LEFT JOIN y te quedas con los que no tuvieron pareja: \`WHERE p.id IS NULL\`. (Para comparar con \`NULL\` se usa \`IS NULL\`, no \`= NULL\`.)

**Analogía:** tienes la lista de invitados y la lista de regalos. INNER JOIN es "los invitados que trajeron regalo"; LEFT JOIN es "todos los invitados, con su regalo si trajeron".`,
        `## Combining tables: JOIN
A **JOIN** joins rows from two tables using the relationship between them (\`ON p.cliente_id = c.id\`). The letters \`c\` and \`p\` are **aliases**: short names so you do not write the full table name.
- **INNER JOIN** (or just \`JOIN\`): only rows that have a match in **both** tables. Eva does not appear, because she has no orders.
- **LEFT JOIN**: **every** row of the left table, with its match from the right if any, or \`NULL\` (empty) if not. Eva appears with her order as \`NULL\`.

**Customers without orders:** you do a LEFT JOIN and keep the ones with no match: \`WHERE p.id IS NULL\`. (To compare with \`NULL\` you use \`IS NULL\`, not \`= NULL\`.)

**Analogy:** you have the guest list and the gift list. INNER JOIN is "guests who brought a gift"; LEFT JOIN is "every guest, with their gift if they brought one".`,
      ),
      code(`SELECT c.nombre, p.total
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id
ORDER BY p.id;
-- resultado: (Ana, 300), (Ana, 150), (Luis, 500)

SELECT c.nombre, COUNT(p.id) AS pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id
ORDER BY c.id;
-- resultado: (Ana, 2), (Luis, 1), (Eva, 0)

SELECT c.nombre
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
-- resultado: Eva`, 'sql'),
      md(
        `## Subconsultas
Una **subconsulta** es una consulta dentro de otra, entre paréntesis. Ejemplo clásico de entrevista, **el segundo total más alto**: primero calculas el más alto y luego buscas el mayor de los que son menores que él.
\`\`\`sql
SELECT MAX(total) FROM pedidos
WHERE total < (SELECT MAX(total) FROM pedidos);
-- resultado: 300
\`\`\`

## Índices
Sin índice, para encontrar \`WHERE email = 'ana@x.com'\` la base revisa **todas** las filas: O(n). Un **índice** es una estructura extra (normalmente un **árbol B**, parecido a un BST) que permite encontrarlo en **O(log n)**.

**Analogía:** el índice al final de un libro: en vez de hojear todas las páginas, buscas la palabra y vas directo.

- Aceleran \`WHERE\`, \`JOIN\` y \`ORDER BY\` sobre las columnas indexadas. La clave primaria ya tiene uno.
- A cambio **ocupan espacio** y hacen **más lentas las escrituras**: cada \`INSERT\` o \`UPDATE\` también debe actualizar el índice. Por eso no se indexa todo, solo las columnas por las que más se busca.
- Se crean con \`CREATE INDEX idx_clientes_ciudad ON clientes(ciudad);\`.`,
        `## Subqueries
A **subquery** is a query inside another, in parentheses. Classic interview example, **the second highest total**: first you compute the highest and then look for the largest among those below it.
\`\`\`sql
SELECT MAX(total) FROM pedidos
WHERE total < (SELECT MAX(total) FROM pedidos);
-- result: 300
\`\`\`

## Indexes
Without an index, to find \`WHERE email = 'ana@x.com'\` the database checks **every** row: O(n). An **index** is an extra structure (usually a **B-tree**, similar to a BST) that finds it in **O(log n)**.

**Analogy:** the index at the back of a book: instead of flipping through every page, you look up the word and go straight there.

- They speed up \`WHERE\`, \`JOIN\` and \`ORDER BY\` on indexed columns. The primary key already has one.
- In exchange they **take space** and make **writes slower**: each \`INSERT\` or \`UPDATE\` must also update the index. That is why you do not index everything, only the columns searched the most.
- They are created with \`CREATE INDEX idx_clientes_ciudad ON clientes(ciudad);\`.`,
      ),
      md(
        `## Transacciones y ACID
Una **transacción** agrupa varias operaciones que deben pasar **todas o ninguna**. El ejemplo clásico es una transferencia: restar 100 de una cuenta y sumarlos a otra. Si el servidor se cae entre los dos pasos, no puede quedar el dinero restado pero no sumado.
- \`BEGIN\` empieza la transacción, \`COMMIT\` confirma los cambios y \`ROLLBACK\` los **deshace** todos.

Las bases relacionales garantizan cuatro propiedades, **ACID**:
- **A — Atomicidad:** todo o nada. Si una parte falla, se deshace todo.
- **C — Consistencia:** la base pasa de un estado válido a otro, respetando sus reglas (claves foráneas, restricciones como "el saldo no puede ser negativo").
- **I — Aislamiento** (*isolation*): las transacciones que corren al mismo tiempo no ven los cambios a medias de las otras.
- **D — Durabilidad:** lo confirmado con \`COMMIT\` sobrevive aunque se caiga el servidor.`,
        `## Transactions and ACID
A **transaction** groups several operations that must happen **all or none**. The classic example is a transfer: subtract 100 from one account and add it to another. If the server crashes between the two steps, the money cannot end up subtracted but not added.
- \`BEGIN\` starts the transaction, \`COMMIT\` confirms the changes and \`ROLLBACK\` **undoes** them all.

Relational databases guarantee four properties, **ACID**:
- **A — Atomicity:** all or nothing. If one part fails, everything is undone.
- **C — Consistency:** the database moves from one valid state to another, respecting its rules (foreign keys, constraints like "the balance cannot be negative").
- **I — Isolation:** transactions running at the same time do not see each other's half-done changes.
- **D — Durability:** what was confirmed with \`COMMIT\` survives even if the server crashes.`,
      ),
      code(`BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;      -- si algo falló antes de aquí, ROLLBACK deja las dos cuentas como estaban`, 'sql'),
      md(
        `## Normalización
Organizar las tablas para **no repetir datos**. Si la ciudad del cliente se guarda en cada pedido y el cliente se muda, tendrías que cambiarla en todos sus pedidos; si se te olvida uno, los datos se contradicen.
- **1FN:** cada celda tiene **un solo valor**; nada de listas dentro de una columna ("A1, B3, C2").
- **2FN:** cada columna depende de **toda** la clave primaria, no solo de una parte (importa cuando la clave tiene varias columnas).
- **3FN:** las columnas no dependen de **otras columnas que no son clave**. La ciudad depende del cliente, no del pedido: va en la tabla de clientes.

A veces se **desnormaliza** a propósito (se repite algo de información) para que ciertas lecturas sean más rápidas, aceptando el costo de mantener las copias.

## El problema N+1
Haces **1 consulta** para traer N registros y luego **N consultas más**, una por registro, para traer sus datos relacionados. Con 100 clientes son 101 consultas, y cada una tiene el costo de ir y volver a la base de datos. Pasa mucho con los **ORM** (librerías que te dejan usar la base como objetos, sin escribir SQL). Se resuelve trayendo todo **en una sola consulta con JOIN**, o con la **carga anticipada** (*eager loading*) del ORM.`,
        `## Normalization
Organizing tables to **avoid repeating data**. If the customer's city is stored in every order and the customer moves, you would have to change it in all their orders; if you forget one, the data contradicts itself.
- **1NF:** each cell holds **a single value**; no lists inside a column ("A1, B3, C2").
- **2NF:** each column depends on the **whole** primary key, not just part of it (it matters when the key has several columns).
- **3NF:** columns do not depend on **other non-key columns**. The city depends on the customer, not the order: it goes in the customers table.

Sometimes you **denormalize** on purpose (repeat some information) so certain reads are faster, accepting the cost of keeping the copies in sync.

## The N+1 problem
You make **1 query** to fetch N records and then **N more queries**, one per record, to fetch their related data. With 100 customers that is 101 queries, each paying the cost of a round trip to the database. It happens a lot with **ORMs** (libraries that let you use the database as objects, without writing SQL). It is fixed by fetching everything **in a single query with a JOIN**, or with the ORM's **eager loading**.`,
      ),
      code(`# ❌ N+1: una consulta por cliente
clientes = db.execute("SELECT id, nombre FROM clientes").fetchall()
for id, nombre in clientes:
    pedidos = db.execute("SELECT total FROM pedidos WHERE cliente_id = ?", (id,)).fetchall()

# ✅ Una sola consulta con JOIN
filas = db.execute("""
    SELECT c.nombre, p.total
    FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
""").fetchall()`),
      interview('Ejercicios típicos: "el segundo salario más alto", "los clientes sin pedidos", "los departamentos con más de 5 empleados". Practica GROUP BY con HAVING, subconsultas y LEFT JOIN … WHERE x IS NULL. Recuerda: WHERE filtra filas antes de agrupar; HAVING filtra grupos después.', 'Typical exercises: "the second highest salary", "customers without orders", "departments with more than 5 employees". Practice GROUP BY with HAVING, subqueries and LEFT JOIN … WHERE x IS NULL. Remember: WHERE filters rows before grouping; HAVING filters groups after.'),
      md(
        `## Resumen
| Tema | En una frase |
|---|---|
| PK / FK | La PK identifica cada fila; la FK apunta a la PK de otra tabla |
| SELECT | \`SELECT … FROM … WHERE … ORDER BY … LIMIT …\` |
| GROUP BY | Agrupa filas iguales y calcula \`COUNT\`, \`SUM\`, \`AVG\`… por grupo |
| WHERE vs HAVING | WHERE filtra filas antes de agrupar; HAVING filtra grupos después |
| INNER / LEFT JOIN | Solo las que tienen pareja / todas las de la izquierda (o NULL) |
| Sin pareja | \`LEFT JOIN … WHERE x.id IS NULL\` |
| Índice | Búsquedas O(log n); a cambio, espacio y escrituras más lentas |
| ACID | Atomicidad, consistencia, aislamiento, durabilidad |
| Normalización | No repetir datos (1FN, 2FN, 3FN) |
| N+1 | 1 + N consultas; se arregla con un JOIN o eager loading |`,
        `## Summary
| Topic | In one sentence |
|---|---|
| PK / FK | The PK identifies each row; the FK points to another table's PK |
| SELECT | \`SELECT … FROM … WHERE … ORDER BY … LIMIT …\` |
| GROUP BY | Groups equal rows and computes \`COUNT\`, \`SUM\`, \`AVG\`… per group |
| WHERE vs HAVING | WHERE filters rows before grouping; HAVING filters groups after |
| INNER / LEFT JOIN | Only those with a match / every left row (or NULL) |
| No match | \`LEFT JOIN … WHERE x.id IS NULL\` |
| Index | O(log n) lookups; in exchange, space and slower writes |
| ACID | Atomicity, consistency, isolation, durability |
| Normalization | Do not repeat data (1NF, 2NF, 3NF) |
| N+1 | 1 + N queries; fixed with a JOIN or eager loading |`,
      ),
    ],
    quiz: [
      q('Para listar clientes sin pedidos usas…', 'To list customers without orders you use…', [['INNER JOIN', 'INNER JOIN'], ['LEFT JOIN … WHERE o.id IS NULL', 'LEFT JOIN … WHERE o.id IS NULL'], ['GROUP BY', 'GROUP BY'], ['UNION', 'UNION']], 1,
        'LEFT JOIN conserva a todos los clientes; los que no tienen pedido quedan con NULL.', 'LEFT JOIN keeps every customer; those without orders end up with NULL.'),
      q('Diferencia entre WHERE y HAVING', 'Difference between WHERE and HAVING', [['Ninguna', 'None'], ['WHERE filtra filas, HAVING filtra grupos', 'WHERE filters rows, HAVING filters groups'], ['HAVING es más rápido', 'HAVING is faster'], ['WHERE solo sirve con JOIN', 'WHERE only works with JOIN']], 1,
        'WHERE va antes de agrupar; HAVING, después.', 'WHERE goes before grouping; HAVING, after.'),
      q('Un índice hace más lentas…', 'An index makes slower…', [['Las lecturas', 'Reads'], ['Las escrituras', 'Writes'], ['Ambas', 'Both'], ['Ninguna', 'Neither']], 1, 'Cada INSERT/UPDATE debe actualizar el índice.', 'Every INSERT/UPDATE must update the index.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es una clave foránea?', 'What is a foreign key?', [['La columna que identifica cada fila', 'The column identifying each row'], ['Una columna que apunta a la clave primaria de otra tabla', 'A column pointing to another table\'s primary key'], ['Un índice', 'An index'], ['Una contraseña de la base', 'A database password']], 1,
        'Como `pedidos.cliente_id`, que dice de qué cliente es cada pedido.', 'Like `pedidos.cliente_id`, which says whose order each one is.'),
      q('Un pedido tiene muchos productos y un producto está en muchos pedidos. ¿Qué necesitas?', 'An order has many products and a product is in many orders. What do you need?', [['Una sola tabla', 'A single table'], ['Una tabla intermedia con las dos claves', 'A join table with both keys'], ['Una columna con una lista de productos', 'A column with a list of products'], ['Nada especial', 'Nothing special']], 1,
        'Es una relación N–M. Una lista dentro de una columna rompería la 1FN.', 'It is an N–M relationship. A list inside a column would break 1NF.'),
      q('¿Qué devuelve `SELECT total FROM pedidos ORDER BY total DESC LIMIT 1`?', 'What does `SELECT total FROM pedidos ORDER BY total DESC LIMIT 1` return?', [['El total más bajo', 'The lowest total'], ['El total más alto', 'The highest total'], ['Todos los totales', 'Every total'], ['El primer pedido que se creó', 'The first order created']], 1,
        '`DESC` ordena de mayor a menor y `LIMIT 1` se queda con el primero.', '`DESC` sorts largest first and `LIMIT 1` keeps the first one.'),
      q('¿Qué devuelve `db.execute(sql).fetchall()` en sqlite3?', 'What does `db.execute(sql).fetchall()` return in sqlite3?', [['Un número', 'A number'], ['Una lista de tuplas, una por fila', 'A list of tuples, one per row'], ['Un diccionario', 'A dictionary'], ['El texto de la consulta', 'The query text']], 1,
        'Por ejemplo `[(\'Luis\', \'Monterrey\')]`.', 'For example `[(\'Luis\', \'Monterrey\')]`.'),
      q('¿Qué hace `GROUP BY cliente_id` junto con `SUM(total)`?', 'What does `GROUP BY cliente_id` together with `SUM(total)` do?', [['Suma todos los pedidos en un solo número', 'Adds every order into a single number'], ['Calcula la suma de los totales de cada cliente por separado', 'Computes the sum of totals for each customer separately'], ['Ordena por cliente', 'Sorts by customer'], ['Borra los repetidos', 'Deletes duplicates']], 1,
        'Hay una fila de resultado por cada valor distinto de `cliente_id`.', 'There is one result row per distinct `cliente_id` value.'),
      q('¿Por qué `WHERE SUM(total) > 460` da error?', 'Why does `WHERE SUM(total) > 460` fail?', [['Porque falta un punto y coma', 'Because a semicolon is missing'], ['Porque WHERE filtra filas antes de agrupar y la suma aún no existe; se usa HAVING', 'Because WHERE filters rows before grouping and the sum does not exist yet; you use HAVING'], ['Porque 460 es muy grande', 'Because 460 is too big'], ['No da error', 'It does not fail']], 1,
        'Las agregaciones por grupo se filtran con HAVING.', 'Per-group aggregates are filtered with HAVING.'),
      q('¿En qué se diferencian INNER JOIN y LEFT JOIN?', 'How do INNER JOIN and LEFT JOIN differ?', [['No hay diferencia', 'There is no difference'], ['INNER solo deja filas con pareja en ambas tablas; LEFT deja todas las de la izquierda (con NULL si no tienen pareja)', 'INNER keeps only rows matched in both tables; LEFT keeps every left row (with NULL if unmatched)'], ['LEFT es más rápido', 'LEFT is faster'], ['INNER une más tablas', 'INNER joins more tables']], 1,
        'Por eso Eva sale con LEFT JOIN y no con INNER JOIN.', 'That is why Eva shows up with LEFT JOIN and not with INNER JOIN.'),
      q('¿Cómo se comprueba que una columna está vacía en SQL?', 'How do you check that a column is empty in SQL?', [['`= NULL`', '`= NULL`'], ['`IS NULL`', '`IS NULL`'], ['`== None`', '`== None`'], ['`EMPTY`', '`EMPTY`']], 1,
        'Cualquier comparación con `= NULL` da desconocido, nunca verdadero.', 'Any comparison with `= NULL` gives unknown, never true.'),
      q('¿Cómo encuentras el **segundo** total más alto?', 'How do you find the **second** highest total?', [['`SELECT MAX(total) FROM pedidos`', '`SELECT MAX(total) FROM pedidos`'], ['El máximo de los totales que son menores que el máximo, con una subconsulta', 'The maximum of the totals below the maximum, with a subquery'], ['`SELECT MIN(total) FROM pedidos`', '`SELECT MIN(total) FROM pedidos`'], ['Con `GROUP BY total`', 'With `GROUP BY total`']], 1,
        '`WHERE total < (SELECT MAX(total) FROM pedidos)`.', '`WHERE total < (SELECT MAX(total) FROM pedidos)`.'),
      q('¿Qué complejidad tiene buscar por una columna con índice?', 'What is the complexity of searching by an indexed column?', [['O(1)', 'O(1)'], ['O(log n), con un árbol B', 'O(log n), with a B-tree'], ['O(n)', 'O(n)'], ['O(n²)', 'O(n²)']], 1,
        'Sin índice habría que revisar todas las filas: O(n).', 'Without an index every row would have to be checked: O(n).'),
      q('En una transferencia, falla el segundo UPDATE. ¿Qué garantiza la **atomicidad**?', 'In a transfer, the second UPDATE fails. What does **atomicity** guarantee?', [['Que el primer UPDATE se queda', 'That the first UPDATE stays'], ['Que se deshace todo (ROLLBACK): las dos cuentas quedan como estaban', 'That everything is undone (ROLLBACK): both accounts stay as they were'], ['Que se reintenta solo', 'That it retries itself'], ['Nada', 'Nothing']], 1,
        'Todo o nada: no puede quedar el dinero restado pero no sumado.', 'All or nothing: the money cannot be subtracted but not added.'),
      q('¿Qué garantiza la **durabilidad** (la D de ACID)?', 'What does **durability** (the D in ACID) guarantee?', [['Que la consulta es rápida', 'That the query is fast'], ['Que lo confirmado con COMMIT sobrevive aunque se caiga el servidor', 'That what was confirmed with COMMIT survives even if the server crashes'], ['Que no hay datos repetidos', 'That there is no repeated data'], ['Que las tablas tienen índices', 'That tables have indexes']], 1,
        'Aislamiento, en cambio, es que las transacciones simultáneas no vean cambios a medias.', 'Isolation, instead, is that simultaneous transactions do not see half-done changes.'),
      q('Guardas la ciudad del cliente en cada uno de sus pedidos. ¿Qué problema de diseño es?', 'You store the customer\'s city in each of their orders. What design problem is it?', [['Falta un índice', 'A missing index'], ['Falta de normalización: si el cliente se muda hay que cambiarla en muchos lugares', 'Lack of normalization: if the customer moves it must be changed in many places'], ['Es el problema N+1', 'It is the N+1 problem'], ['Ninguno', 'None']], 1,
        'La ciudad depende del cliente, no del pedido (3FN).', 'The city depends on the customer, not the order (3NF).'),
      q('Traes 100 clientes y luego haces una consulta por cada uno para traer sus pedidos. ¿Cómo se llama y cómo se arregla?', 'You fetch 100 customers and then make one query per customer for their orders. What is it called and how is it fixed?', [['Desnormalización; con más índices', 'Denormalization; with more indexes'], ['El problema N+1; con un JOIN o carga anticipada', 'The N+1 problem; with a JOIN or eager loading'], ['Una transacción; con COMMIT', 'A transaction; with COMMIT'], ['No es un problema', 'It is not a problem']], 1,
        'Son 101 consultas; con un JOIN es una sola.', 'That is 101 queries; with a JOIN it is a single one.'),
    ],
    concepts: [
      concept('WHERE vs HAVING', 'WHERE vs HAVING', 'WHERE filtra filas antes del GROUP BY; HAVING filtra grupos después.', 'WHERE filters rows before GROUP BY; HAVING filters groups after.'),
      concept('Clave primaria vs clave foránea', 'Primary vs foreign key', 'PK identifica de forma única cada fila; FK referencia la PK de otra tabla para relacionarlas.', 'A PK uniquely identifies each row; a FK references another table\'s PK to relate them.'),
    ],
  },
  {
    id: 'nosql',
    track: 'web',
    title: l('NoSQL y cuándo usarlo', 'NoSQL and when to use it'),
    summary: l('Por qué existen las bases NoSQL, sus cuatro tipos, cómo se comparan con SQL, cómo escalan (réplicas y sharding) y qué dice el teorema CAP.', 'Why NoSQL databases exist, their four types, how they compare with SQL, how they scale (replicas and sharding) and what the CAP theorem says.'),
    minutes: 18,
    blocks: [
      md(
        `## ¿Por qué existe NoSQL?
Las bases relacionales son excelentes, pero tienen dos límites: un **esquema rígido** (todas las filas de una tabla tienen las mismas columnas) y, tradicionalmente, crecen sobre **un solo servidor**, cada vez más grande. Cuando una aplicación tiene datos de forma muy variable o necesita repartirlos entre **muchos servidores**, aparecen las bases **NoSQL** ("not only SQL"): otras formas de guardar datos, con **esquema flexible** y pensadas para **escalar horizontalmente**.

**Analogía:** una base SQL es un archivero con formularios idénticos, todos con las mismas casillas. Una base de documentos es una carpeta donde cada ficha puede tener los campos que necesite.

## Los cuatro tipos
| Tipo | Cómo guarda | Ejemplos | Para qué se usa |
|---|---|---|---|
| **Documentos** | Objetos tipo JSON, anidados y flexibles | MongoDB | Perfiles, catálogos de productos, contenido |
| **Clave-valor** | Un diccionario gigante: clave → valor | Redis, DynamoDB | Caché, sesiones, contadores (muy rápidos) |
| **Columnares** | Filas con muchísimas columnas, repartidas | Cassandra | Escrituras masivas, series de tiempo, registros |
| **Grafos** | Nodos y aristas | Neo4j | Redes sociales, recomendaciones |

En una base de **documentos**, todo lo de un pedido puede ir **junto** (el cliente y sus productos adentro), en vez de repartido en varias tablas que luego unes con JOIN:`,
        `## Why does NoSQL exist?
Relational databases are excellent, but they have two limits: a **rigid schema** (every row in a table has the same columns) and, traditionally, they grow on **a single server**, bigger and bigger. When an application has very variable data or needs to spread it across **many servers**, **NoSQL** databases ("not only SQL") come in: other ways of storing data, with a **flexible schema** and designed to **scale horizontally**.

**Analogy:** an SQL database is a filing cabinet of identical forms, all with the same boxes. A document database is a folder where each card can have whatever fields it needs.

## The four types
| Type | How it stores | Examples | What it is used for |
|---|---|---|---|
| **Document** | JSON-like objects, nested and flexible | MongoDB | Profiles, product catalogs, content |
| **Key-value** | A giant dictionary: key → value | Redis, DynamoDB | Cache, sessions, counters (very fast) |
| **Wide-column** | Rows with very many columns, spread out | Cassandra | Massive writes, time series, logs |
| **Graph** | Nodes and edges | Neo4j | Social networks, recommendations |

In a **document** database, everything about an order can go **together** (the customer and products inside it), instead of spread over several tables you later join:`,
      ),
      code(`pedido = {                                    # un documento: todo junto y anidado
    "id": 7,
    "cliente": {"nombre": "Ana", "ciudad": "CDMX"},
    "productos": [{"sku": "A1", "cantidad": 2}, {"sku": "B3", "cantidad": 1}],
}
print(pedido["cliente"]["nombre"], len(pedido["productos"]))   # imprime: Ana 2`),
      md(
        `## SQL vs NoSQL
| | SQL (relacional) | NoSQL |
|---|---|---|
| Esquema | Fijo: todas las filas iguales | Flexible: cada documento puede variar |
| Relaciones | JOINs entre tablas | Normalmente se **embeben** los datos (se repiten a propósito) |
| Transacciones | ACID completas | Varían; muchas priorizan velocidad y disponibilidad |
| Escalar | Sobre todo vertical (un servidor más grande) | Horizontal (más servidores) |
| Consultas | SQL, muy flexible | Depende de la base; suelen pensarse para consultas ya conocidas |

**¿Cuál elegir?** SQL cuando los datos tienen relaciones claras y necesitas consistencia (dinero, inventario, pedidos). NoSQL cuando el esquema cambia mucho, necesitas muchísima velocidad para operaciones simples (caché, sesiones) o volúmenes enormes de escrituras. Muchas apps usan **las dos**: PostgreSQL para los datos principales y Redis como caché.`,
        `## SQL vs NoSQL
| | SQL (relational) | NoSQL |
|---|---|---|
| Schema | Fixed: every row the same | Flexible: each document may vary |
| Relationships | JOINs between tables | Data is usually **embedded** (repeated on purpose) |
| Transactions | Full ACID | It varies; many favor speed and availability |
| Scaling | Mostly vertical (a bigger server) | Horizontal (more servers) |
| Queries | SQL, very flexible | Depends on the database; usually designed for known queries |

**Which one to pick?** SQL when data has clear relationships and you need consistency (money, inventory, orders). NoSQL when the schema changes a lot, you need huge speed for simple operations (cache, sessions) or enormous write volumes. Many apps use **both**: PostgreSQL for the main data and Redis as a cache.`,
      ),
      md(
        `## Cómo escalan las bases de datos
- **Escalar verticalmente:** un servidor más potente (más memoria, más CPU). Es simple, pero tiene un techo y sale caro.
- **Escalar horizontalmente:** **más servidores** que se reparten el trabajo.
  - **Réplicas:** copias de los mismos datos en varios servidores. Reparten las **lecturas** y, si uno se cae, otro responde.
  - **Sharding (particionado):** se **reparten los datos**: cada servidor guarda una parte. Para saber dónde está algo se usa una **clave de partición**, por ejemplo el id del usuario: \`id % 3\` dice en cuál de 3 servidores vive. Así, un mismo usuario siempre cae en el mismo servidor.`,
        `## How databases scale
- **Scaling vertically:** a more powerful server (more memory, more CPU). It is simple, but it has a ceiling and gets expensive.
- **Scaling horizontally:** **more servers** sharing the work.
  - **Replicas:** copies of the same data on several servers. They share the **reads** and, if one goes down, another answers.
  - **Sharding (partitioning):** the **data is split**: each server stores a part. To know where something is you use a **partition key**, for example the user id: \`id % 3\` says which of 3 servers it lives on. That way the same user always lands on the same server.`,
      ),
      code(`servidores = 3

def servidor_de(usuario_id):
    return usuario_id % servidores    # cada usuario cae siempre en el mismo servidor

print(servidor_de(10), servidor_de(11), servidor_de(12))   # imprime: 1 2 0`),
      md(
        `## El teorema CAP
Cuando los datos están repartidos en varios servidores, la red entre ellos puede fallar y dejarlos incomunicados: eso es una **partición**. El teorema CAP dice que, **mientras hay una partición**, un sistema tiene que elegir entre:
- **Consistencia (C):** todos ven el mismo dato, aunque para eso algunos servidores tengan que dejar de responder.
- **Disponibilidad (A):** siempre responde, aunque algún servidor dé un dato viejo.

(La **P**, tolerancia a particiones, no es opcional en un sistema distribuido: las fallas de red pasan.) Su autor, Eric Brewer, aclaró que el famoso "elige 2 de 3" es engañoso: la elección solo se vuelve obligatoria **durante una partición** y puede hacerse distinta para cada operación.

**Consistencia eventual:** muchas bases NoSQL eligen disponibilidad. Las copias pueden estar un momento desactualizadas, pero **terminan coincidiendo**. Por ejemplo, el contador de "me gusta" puede verse distinto en dos teléfonos por unos segundos.

**Analogía:** dos sucursales de un banco que se quedan sin teléfono entre ellas. O dejan de atender hasta reconectarse (consistencia), o siguen atendiendo y se ponen al día después (disponibilidad).`,
        `## The CAP theorem
When data is spread across several servers, the network between them can fail and cut them off from each other: that is a **partition**. The CAP theorem says that, **while there is a partition**, a system must choose between:
- **Consistency (C):** everyone sees the same data, even if some servers have to stop answering for that.
- **Availability (A):** it always answers, even if some server gives stale data.

(The **P**, partition tolerance, is not optional in a distributed system: network failures happen.) Its author, Eric Brewer, clarified that the famous "pick 2 of 3" is misleading: the choice only becomes mandatory **during a partition** and can be made differently for each operation.

**Eventual consistency:** many NoSQL databases choose availability. Copies can be briefly out of date, but they **end up matching**. For example, a "likes" counter may look different on two phones for a few seconds.

**Analogy:** two bank branches that lose the phone line between them. Either they stop serving until they reconnect (consistency), or they keep serving and catch up later (availability).`,
      ),
      interview('Respuesta segura para un junior: "Empezaría con SQL (PostgreSQL) por las transacciones y la flexibilidad de consultas, y agregaría Redis como caché si hace falta". Y si te preguntan por NoSQL, di para qué tipo de dato y de consulta lo usarías.', 'Safe answer for a junior: "I would start with SQL (PostgreSQL) for transactions and query flexibility, and add Redis as a cache if needed". And if asked about NoSQL, say which kind of data and query you would use it for.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| NoSQL | Otras formas de guardar datos: esquema flexible y pensadas para escalar horizontalmente |
| Documentos / clave-valor / columnares / grafos | MongoDB / Redis / Cassandra / Neo4j |
| SQL o NoSQL | SQL para relaciones y consistencia; NoSQL para esquemas cambiantes, velocidad o volúmenes enormes |
| Vertical / horizontal | Un servidor más grande / más servidores |
| Réplicas | Copias de los datos: reparten lecturas y dan respaldo |
| Sharding | Repartir los datos entre servidores con una clave de partición |
| CAP | Durante una partición: consistencia o disponibilidad |
| Consistencia eventual | Las copias pueden atrasarse un momento, pero terminan coincidiendo |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| NoSQL | Other ways of storing data: flexible schema and designed to scale horizontally |
| Document / key-value / wide-column / graph | MongoDB / Redis / Cassandra / Neo4j |
| SQL or NoSQL | SQL for relationships and consistency; NoSQL for changing schemas, speed or huge volumes |
| Vertical / horizontal | A bigger server / more servers |
| Replicas | Copies of the data: share reads and provide backup |
| Sharding | Splitting data across servers with a partition key |
| CAP | During a partition: consistency or availability |
| Eventual consistency | Copies may lag briefly, but they end up matching |`,
      ),
    ],
    quiz: [
      q('¿Qué tipo de BD es Redis?', 'What kind of DB is Redis?', [['Documentos', 'Document'], ['Clave-valor en memoria', 'In-memory key-value'], ['Grafos', 'Graph'], ['Relacional', 'Relational']], 1, 'Muy usada como caché.', 'Widely used as a cache.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué significa que una base NoSQL tenga **esquema flexible**?', 'What does it mean for a NoSQL database to have a **flexible schema**?', [['Que no guarda datos', 'That it stores no data'], ['Que cada documento puede tener campos distintos', 'That each document can have different fields'], ['Que no tiene claves', 'That it has no keys'], ['Que se borra sola', 'That it deletes itself']], 1,
        'En SQL todas las filas de una tabla tienen las mismas columnas.', 'In SQL every row in a table has the same columns.'),
      q('¿Qué tipo de base NoSQL usarías para una red social con "amigos de mis amigos"?', 'Which kind of NoSQL database would you use for a social network with "friends of my friends"?', [['Clave-valor', 'Key-value'], ['Columnar', 'Wide-column'], ['Grafos, como Neo4j', 'Graph, like Neo4j'], ['Ninguna', 'None']], 2,
        'Las relaciones son el dato principal: nodos (personas) y aristas (amistades).', 'Relationships are the main data: nodes (people) and edges (friendships).'),
      q('Para un catálogo donde cada producto tiene atributos distintos (talla, voltaje, sabor…), ¿qué tipo encaja mejor?', 'For a catalog where each product has different attributes (size, voltage, flavor…), which type fits best?', [['Documentos', 'Document'], ['Grafos', 'Graph'], ['Columnar', 'Wide-column'], ['Clave-valor', 'Key-value']], 0,
        'Cada producto es un documento con sus propios campos.', 'Each product is a document with its own fields.'),
      q('¿Qué suele hacerse en una base de documentos en vez de un JOIN?', 'What is usually done in a document database instead of a JOIN?', [['Crear más tablas', 'Create more tables'], ['Embeber los datos relacionados dentro del documento', 'Embed the related data inside the document'], ['Usar índices', 'Use indexes'], ['Borrar los duplicados', 'Delete duplicates']], 1,
        'Se repiten datos a propósito para leer todo de una vez.', 'Data is repeated on purpose to read everything at once.'),
      q('Para guardar los saldos de las cuentas de un banco, ¿qué conviene más?', 'To store a bank\'s account balances, what fits best?', [['Una base SQL con transacciones ACID', 'An SQL database with ACID transactions'], ['Una caché clave-valor', 'A key-value cache'], ['Una base de grafos', 'A graph database'], ['Un archivo de texto', 'A text file']], 0,
        'Con dinero importa la consistencia y que las operaciones sean todo o nada.', 'With money, consistency and all-or-nothing operations matter.'),
      q('¿Qué es escalar **horizontalmente**?', 'What is scaling **horizontally**?', [['Comprar un servidor más potente', 'Buying a more powerful server'], ['Agregar más servidores que se reparten el trabajo', 'Adding more servers that share the work'], ['Borrar datos viejos', 'Deleting old data'], ['Agregar columnas', 'Adding columns']], 1,
        'Escalar verticalmente es hacer más grande un solo servidor, y tiene un techo.', 'Scaling vertically is making a single server bigger, and it has a ceiling.'),
      q('¿En qué se diferencian las réplicas del sharding?', 'How do replicas differ from sharding?', [['Son lo mismo', 'They are the same'], ['Las réplicas copian todos los datos en varios servidores; el sharding reparte los datos y cada servidor guarda una parte', 'Replicas copy all data to several servers; sharding splits the data and each server holds a part'], ['El sharding es solo para SQL', 'Sharding is only for SQL'], ['Las réplicas borran datos', 'Replicas delete data']], 1,
        'Las réplicas reparten lecturas y dan respaldo; el sharding reparte el volumen de datos.', 'Replicas share reads and provide backup; sharding splits the data volume.'),
      q('Con 3 servidores y la regla `id % 3`, ¿en qué servidor vive el usuario 14?', 'With 3 servers and the rule `id % 3`, which server does user 14 live on?', [['0', '0'], ['1', '1'], ['2', '2'], ['14', '14']], 2,
        '14 entre 3 da 4 y sobran 2. El mismo usuario siempre cae en el mismo servidor.', '14 divided by 3 is 4 with 2 left over. The same user always lands on the same server.'),
      q('¿Qué dice el teorema CAP?', 'What does the CAP theorem say?', [['Que toda base debe tener tres servidores', 'That every database must have three servers'], ['Que durante una partición de red hay que elegir entre consistencia y disponibilidad', 'That during a network partition you must choose between consistency and availability'], ['Que SQL es mejor que NoSQL', 'That SQL is better than NoSQL'], ['Que hay que cifrar los datos', 'That data must be encrypted']], 1,
        'La elección solo es obligatoria mientras hay una partición.', 'The choice is only mandatory while there is a partition.'),
      q('¿Qué es la **consistencia eventual**?', 'What is **eventual consistency**?', [['Que los datos nunca coinciden', 'That data never matches'], ['Que las copias pueden estar un momento desactualizadas, pero terminan coincidiendo', 'That copies may be briefly out of date, but they end up matching'], ['Que los datos se borran después de un tiempo', 'That data is deleted after a while'], ['Que solo hay una copia', 'That there is only one copy']], 1,
        'Como un contador de "me gusta" que se ve distinto unos segundos en dos teléfonos.', 'Like a "likes" counter that looks different on two phones for a few seconds.'),
    ],
    concepts: [concept('Teorema CAP', 'CAP theorem', 'Ante una partición de red, un sistema distribuido elige entre consistencia y disponibilidad.', 'During a network partition, a distributed system chooses between consistency and availability.')],
  },
  {
    id: 'auth',
    track: 'web',
    title: l('Autenticación: sesiones, JWT y OAuth', 'Authentication: sessions, JWT and OAuth'),
    summary: l('Cómo una app sabe quién eres y qué puedes hacer: guardar contraseñas con hash y sal, sesiones con cookies, cómo funciona un JWT y para qué sirve OAuth.', 'How an app knows who you are and what you can do: storing passwords with hash and salt, cookie sessions, how a JWT works and what OAuth is for.'),
    minutes: 26,
    blocks: [
      md(
        `## Autenticación vs autorización
- **Autenticación:** comprobar **quién eres** (con tu contraseña, un código, tu huella).
- **Autorización:** decidir **qué puedes hacer** una vez que se sabe quién eres (ver tus pedidos, pero no los de otros; borrar usuarios solo si eres administrador).

**Analogía:** en un edificio de oficinas, mostrar tu credencial en la entrada es la autenticación; las llaves que te dan, que abren solo ciertas puertas, son la autorización. Por eso los códigos HTTP son distintos: **401** cuando no se sabe quién eres y **403** cuando se sabe pero no tienes permiso.

## Cómo guardar contraseñas
**Nunca en texto plano:** si alguien roba la base de datos, tendría todas las contraseñas (y mucha gente repite la misma en varios sitios). Tampoco **cifradas**: lo cifrado se puede descifrar con la llave, y si roban la llave, roban todo.

Se guarda un **hash**: una función de **un solo sentido** que convierte la contraseña en un texto fijo del que no se puede volver atrás. Al iniciar sesión, se calcula el hash de lo que escribió el usuario y se compara con el guardado.
- **Sal** (*salt*): un valor **aleatorio distinto para cada usuario** que se mezcla con la contraseña antes del hash. Así, dos personas con la misma contraseña tienen hashes distintos, y un atacante no puede usar tablas de hashes ya calculados.
- **Lento a propósito:** los hashes rápidos (como SHA-256 solo) permiten probar miles de millones de contraseñas por segundo. Se usan algoritmos **lentos y costosos**: OWASP recomienda **Argon2id**; si no está disponible, scrypt; bcrypt para sistemas heredados; y PBKDF2 si se exige el estándar FIPS-140.`,
        `## Authentication vs authorization
- **Authentication:** checking **who you are** (with your password, a code, your fingerprint).
- **Authorization:** deciding **what you can do** once it is known who you are (see your orders but not other people's; delete users only if you are an admin).

**Analogy:** in an office building, showing your badge at the entrance is authentication; the keys you get, which open only certain doors, are authorization. That is why the HTTP codes differ: **401** when it is not known who you are and **403** when it is known but you are not allowed.

## How to store passwords
**Never in plain text:** if someone steals the database, they would have every password (and many people reuse the same one on several sites). Not **encrypted** either: what is encrypted can be decrypted with the key, and if the key is stolen, everything is.

You store a **hash**: a **one-way** function that turns the password into a fixed text you cannot go back from. On login, you hash what the user typed and compare it with the stored one.
- **Salt:** a **random value different for each user** mixed with the password before hashing. That way, two people with the same password have different hashes, and an attacker cannot use tables of precomputed hashes.
- **Slow on purpose:** fast hashes (like plain SHA-256) allow trying billions of passwords per second. You use **slow, costly** algorithms: OWASP recommends **Argon2id**; if unavailable, scrypt; bcrypt for legacy systems; and PBKDF2 if the FIPS-140 standard is required.`,
      ),
      code(`import hashlib
import os

def hashear(password, sal):
    # PBKDF2 repite el hash 100,000 veces a propósito: así adivinar contraseñas es lento
    return hashlib.pbkdf2_hmac("sha256", password.encode(), sal, 100_000).hex()

sal_ana = os.urandom(16)                     # una sal aleatoria por usuario
sal_luis = os.urandom(16)
guardado_ana = hashear("gato123", sal_ana)   # en la base se guardan la sal y el hash
guardado_luis = hashear("gato123", sal_luis)

print(guardado_ana == guardado_luis)          # imprime: False   (misma contraseña, distinta sal)
print(hashear("gato123", sal_ana) == guardado_ana)   # imprime: True    (así se verifica el login)
print(hashear("perro", sal_ana) == guardado_ana)     # imprime: False   (contraseña incorrecta)`),
      md(
        `**Cómo leerlo:** \`os.urandom(16)\` genera 16 bytes aleatorios (la sal). \`.encode()\` convierte el texto en bytes, que es lo que necesitan las funciones de hash, y \`.hex()\` convierte el resultado en un texto legible. \`100_000\` es 100000; el guion bajo solo hace el número más fácil de leer.

## Sesiones: el servidor recuerda
1. Inicias sesión y el servidor verifica tu contraseña.
2. Crea una **sesión**: guarda en su memoria o en una base (por ejemplo Redis) "la sesión \`abc123\` es de Ana".
3. Te responde con una **cookie** que contiene solo ese id: \`Set-Cookie: sesion=abc123\`.
4. En cada petición, tu navegador manda la cookie y el servidor busca de quién es esa sesión.

- **Ventaja:** **revocarla es fácil**: el servidor borra la sesión y listo (cerrar sesión, robo de cuenta).
- **Desventaja:** el servidor guarda estado. Si tienes varios servidores, todos deben consultar el **mismo almacén** de sesiones.
- **Cookies seguras:** \`HttpOnly\` (JavaScript no puede leerla, lo que limita el daño de un ataque XSS), \`Secure\` (solo viaja por HTTPS) y \`SameSite\` (no se manda en peticiones que vienen de otros sitios, lo que ayuda contra CSRF).`,
        `**How to read it:** \`os.urandom(16)\` generates 16 random bytes (the salt). \`.encode()\` turns the text into bytes, which is what hash functions need, and \`.hex()\` turns the result into readable text. \`100_000\` is 100000; the underscore just makes the number easier to read.

## Sessions: the server remembers
1. You log in and the server checks your password.
2. It creates a **session**: it stores in memory or a database (for example Redis) "session \`abc123\` belongs to Ana".
3. It answers with a **cookie** containing only that id: \`Set-Cookie: session=abc123\`.
4. On every request, your browser sends the cookie and the server looks up whose session it is.

- **Advantage:** **revoking it is easy**: the server deletes the session and that is it (logout, stolen account).
- **Drawback:** the server keeps state. If you have several servers, they all must check the **same session store**.
- **Secure cookies:** \`HttpOnly\` (JavaScript cannot read it, which limits the damage of an XSS attack), \`Secure\` (it only travels over HTTPS) and \`SameSite\` (it is not sent on requests coming from other sites, which helps against CSRF).`,
      ),
      md(
        `## JWT: el token lleva los datos
Un **JWT** (*JSON Web Token*) es un token que **contiene los datos del usuario** y una **firma**. Tiene tres partes separadas por puntos, cada una codificada en base64 (una forma de escribir datos como texto):

\`cabecera.payload.firma\`

- **Cabecera:** qué algoritmo se usó para firmar.
- **Payload:** los datos, por ejemplo \`{"usuario": "ana", "rol": "lector", "exp": …}\` (\`exp\` es cuándo expira).
- **Firma:** se calcula con la cabecera, el payload y un **secreto que solo conoce el servidor**.

Cuando llega un JWT, el servidor recalcula la firma. Si alguien cambió el payload (por ejemplo, de "lector" a "admin"), la firma ya no coincide y el token se rechaza. **Ojo: el payload está firmado, no cifrado: cualquiera puede leerlo.** Nunca guardes ahí datos secretos.

- **Ventaja:** es **sin estado**: el servidor no guarda nada, solo verifica la firma. Cualquier servidor que tenga el secreto puede verificarlo, lo que facilita escalar.
- **Desventaja:** **revocarlo es difícil**, porque es válido hasta que expira. Por eso se usan **expiraciones cortas** (minutos) y un **refresh token** para pedir uno nuevo.
- El cliente lo manda en el header \`Authorization: Bearer <token>\`.`,
        `## JWT: the token carries the data
A **JWT** (*JSON Web Token*) is a token that **contains the user's data** and a **signature**. It has three parts separated by dots, each encoded in base64 (a way of writing data as text):

\`header.payload.signature\`

- **Header:** which algorithm was used to sign.
- **Payload:** the data, for example \`{"user": "ana", "role": "reader", "exp": …}\` (\`exp\` is when it expires).
- **Signature:** computed from the header, the payload and a **secret only the server knows**.

When a JWT arrives, the server recomputes the signature. If someone changed the payload (for example, from "reader" to "admin"), the signature no longer matches and the token is rejected. **Careful: the payload is signed, not encrypted: anyone can read it.** Never put secret data in it.

- **Advantage:** it is **stateless**: the server stores nothing, it only verifies the signature. Any server holding the secret can verify it, which makes scaling easier.
- **Drawback:** **revoking it is hard**, because it is valid until it expires. That is why **short expirations** (minutes) and a **refresh token** to request a new one are used.
- The client sends it in the \`Authorization: Bearer <token>\` header.`,
      ),
      code(`import base64
import hashlib
import hmac
import json

SECRETO = b"solo-lo-sabe-el-servidor"

def b64(datos):                                   # base64 "para URLs", sin el relleno "="
    return base64.urlsafe_b64encode(datos).rstrip(b"=").decode()

def firma(cabecera, cuerpo):
    return b64(hmac.new(SECRETO, f"{cabecera}.{cuerpo}".encode(), hashlib.sha256).digest())

def crear_token(payload):
    cabecera = b64(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    cuerpo = b64(json.dumps(payload).encode())
    return f"{cabecera}.{cuerpo}.{firma(cabecera, cuerpo)}"

def es_valido(token):
    cabecera, cuerpo, f = token.split(".")
    return hmac.compare_digest(firma(cabecera, cuerpo), f)   # ¿la firma coincide?

token = crear_token({"usuario": "ana", "rol": "lector"})
print(token.count("."), es_valido(token))          # imprime: 2 True

# Cualquiera puede LEER el payload: no está cifrado
cuerpo = token.split(".")[1]
print(json.loads(base64.urlsafe_b64decode(cuerpo + "=" * (-len(cuerpo) % 4))))   # imprime: {'usuario': 'ana', 'rol': 'lector'}

# Pero si alguien lo cambia, la firma deja de coincidir
cabecera, _, f = token.split(".")
falso = b64(json.dumps({"usuario": "ana", "rol": "admin"}).encode())
print(es_valido(f"{cabecera}.{falso}.{f}"))       # imprime: False`),
      md(
        `**Cómo leerlo:** \`hmac\` calcula una firma con el secreto: sin el secreto no se puede producir una firma válida. \`hmac.compare_digest\` compara dos firmas sin dar pistas por el tiempo que tarda. El \`"=" * (-len(cuerpo) % 4)\` solo devuelve el relleno que se le quitó al base64 para poder decodificarlo.

**¿Sesiones o JWT?** Para una app web tradicional, las **sesiones con cookies** son simples y fáciles de revocar. Los JWT convienen cuando muchos servicios distintos necesitan verificar al usuario sin consultar un almacén central. Y si guardas el token en el navegador, una cookie \`HttpOnly\` es más segura que \`localStorage\`, que cualquier script de la página puede leer.

## OAuth 2.0: "Iniciar sesión con Google"
**El problema:** una app quiere acceder a tus datos de otro servicio (por ejemplo, tu calendario de Google). Darle tu contraseña de Google sería peligrosísimo: podría hacer **todo** con tu cuenta.

**OAuth 2.0** es un protocolo de **autorización delegada**: le das a la app un permiso **limitado** (por ejemplo, solo leer tu calendario) **sin darle tu contraseña**:
1. La app te manda a la página de Google.
2. Inicias sesión **en Google** (la app nunca ve tu contraseña) y aceptas los permisos que pide (*scopes*).
3. Google te regresa a la app con un **código** temporal.
4. La app cambia ese código por un **access token**, directamente con Google.
5. La app usa el token para pedir a la API de Google solo lo que se le permitió.

**OpenID Connect** es una capa encima de OAuth que además dice **quién eres** (un *ID token* con tu identidad). Es lo que hay detrás del botón "Iniciar sesión con Google".`,
        `**How to read it:** \`hmac\` computes a signature with the secret: without the secret you cannot produce a valid signature. \`hmac.compare_digest\` compares two signatures without leaking hints through timing. The \`"=" * (-len(body) % 4)\` just restores the padding removed from the base64 so it can be decoded.

**Sessions or JWT?** For a traditional web app, **cookie sessions** are simple and easy to revoke. JWTs pay off when many different services need to verify the user without querying a central store. And if you keep the token in the browser, an \`HttpOnly\` cookie is safer than \`localStorage\`, which any script on the page can read.

## OAuth 2.0: "Sign in with Google"
**The problem:** an app wants to access your data on another service (for example, your Google calendar). Giving it your Google password would be extremely dangerous: it could do **everything** with your account.

**OAuth 2.0** is a **delegated authorization** protocol: you give the app a **limited** permission (for example, only reading your calendar) **without giving it your password**:
1. The app sends you to Google's page.
2. You log in **on Google** (the app never sees your password) and accept the permissions it asks for (*scopes*).
3. Google sends you back to the app with a temporary **code**.
4. The app exchanges that code for an **access token**, directly with Google.
5. The app uses the token to ask Google's API only for what it was allowed.

**OpenID Connect** is a layer on top of OAuth that also says **who you are** (an *ID token* with your identity). It is what sits behind the "Sign in with Google" button.`,
      ),
      md(
        `## Más capas de protección
- **MFA** (autenticación de varios factores): además de la contraseña, algo que **tienes** (un código en tu teléfono) o que **eres** (tu huella). Aunque roben la contraseña, no basta.
- **Límite de intentos** (*rate limiting*): bloquear o frenar después de varios intentos fallidos evita que prueben miles de contraseñas.
- **Expiración:** las sesiones y los tokens deben vencer.`,
        `## More layers of protection
- **MFA** (multi-factor authentication): besides the password, something you **have** (a code on your phone) or **are** (your fingerprint). Even if the password is stolen, it is not enough.
- **Rate limiting**: blocking or slowing down after several failed attempts stops thousands of passwords from being tried.
- **Expiration:** sessions and tokens must expire.`,
      ),
      warn('Guardar el JWT en `localStorage` lo expone a XSS: cualquier script que logre correr en tu página puede leerlo. Una cookie `HttpOnly; Secure; SameSite` es más segura para apps web.', 'Storing a JWT in `localStorage` exposes it to XSS: any script that manages to run on your page can read it. An `HttpOnly; Secure; SameSite` cookie is safer for web apps.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Autenticación / autorización | Quién eres / qué puedes hacer (401 / 403) |
| Contraseñas | Hash lento con sal única por usuario (Argon2id); nunca texto plano ni cifradas |
| Sesión | El servidor guarda la sesión; la cookie solo lleva el id. Fácil de revocar |
| Cookie segura | \`HttpOnly\`, \`Secure\`, \`SameSite\` |
| JWT | \`cabecera.payload.firma\`; sin estado; el payload se puede leer; difícil de revocar (expiración corta + refresh token) |
| OAuth 2.0 | Autorización delegada: permisos limitados sin dar tu contraseña |
| OpenID Connect | OAuth + identidad ("Iniciar sesión con Google") |
| MFA | Un segundo factor además de la contraseña |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Authentication / authorization | Who you are / what you can do (401 / 403) |
| Passwords | Slow hash with a unique salt per user (Argon2id); never plain text or encrypted |
| Session | The server keeps the session; the cookie only carries the id. Easy to revoke |
| Secure cookie | \`HttpOnly\`, \`Secure\`, \`SameSite\` |
| JWT | \`header.payload.signature\`; stateless; the payload can be read; hard to revoke (short expiry + refresh token) |
| OAuth 2.0 | Delegated authorization: limited permissions without giving your password |
| OpenID Connect | OAuth + identity ("Sign in with Google") |
| MFA | A second factor besides the password |`,
      ),
    ],
    quiz: [
      q('¿Cómo se deben guardar las contraseñas?', 'How should passwords be stored?', [['Cifradas con AES', 'Encrypted with AES'], ['Con hash lento y sal (p. ej. Argon2id)', 'With a slow salted hash (e.g. Argon2id)'], ['En Base64', 'In Base64'], ['En texto plano en una tabla protegida', 'In plain text in a protected table']], 1,
        'El hash no se puede revertir; la sal y la lentitud frenan a los atacantes.', 'A hash cannot be reversed; the salt and slowness hold attackers back.'),
      q('Desventaja principal de JWT', 'Main drawback of JWT', [['Es lento', 'It is slow'], ['Difícil de revocar antes de expirar', 'Hard to revoke before expiry'], ['No funciona con móviles', 'Does not work on mobile'], ['Requiere HTTPS', 'Requires HTTPS']], 1,
        'Por eso se usan expiraciones cortas y refresh tokens.', 'That is why short expirations and refresh tokens are used.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué diferencia hay entre autenticación y autorización?', 'What is the difference between authentication and authorization?', [['Son lo mismo', 'They are the same'], ['Autenticación es quién eres; autorización es qué puedes hacer', 'Authentication is who you are; authorization is what you can do'], ['Autorización va antes que autenticación', 'Authorization comes before authentication'], ['Autenticación es solo para administradores', 'Authentication is only for admins']], 1,
        'La credencial en la entrada (quién eres) frente a las llaves que abren ciertas puertas (qué puedes hacer).', 'The badge at the entrance (who you are) versus the keys opening certain doors (what you can do).'),
      q('¿Por qué no basta con **cifrar** las contraseñas?', 'Why is **encrypting** passwords not enough?', [['Porque cifrar es lento', 'Because encrypting is slow'], ['Porque lo cifrado se puede descifrar con la llave; si la roban, roban todas', 'Because what is encrypted can be decrypted with the key; if it is stolen, all are'], ['Porque ocupa más espacio', 'Because it takes more space'], ['Sí basta', 'It is enough']], 1,
        'Un hash es de un solo sentido: no hay llave que lo revierta.', 'A hash is one-way: no key can reverse it.'),
      q('¿Para qué sirve la **sal** en el hash de una contraseña?', 'What is the **salt** in a password hash for?', [['Para que el hash sea más corto', 'To make the hash shorter'], ['Para que dos personas con la misma contraseña tengan hashes distintos y no sirvan las tablas precalculadas', 'So two people with the same password get different hashes and precomputed tables are useless'], ['Para cifrar la contraseña', 'To encrypt the password'], ['Para que el usuario la recuerde', 'So the user remembers it']], 1,
        'Es un valor aleatorio distinto para cada usuario, guardado junto al hash.', 'It is a random value different per user, stored next to the hash.'),
      q('¿Por qué se usan hashes **lentos** (Argon2id, bcrypt) para contraseñas?', 'Why are **slow** hashes (Argon2id, bcrypt) used for passwords?', [['Por error', 'By mistake'], ['Para que probar millones de contraseñas sea demasiado costoso para un atacante', 'So trying millions of passwords is too costly for an attacker'], ['Porque los rápidos no existen', 'Because fast ones do not exist'], ['Para ahorrar memoria', 'To save memory']], 1,
        'Para el usuario, que tarde unos milisegundos no se nota.', 'For the user, a few milliseconds go unnoticed.'),
      q('Con sesiones, ¿qué lleva la cookie del usuario?', 'With sessions, what does the user\'s cookie carry?', [['Su contraseña', 'Their password'], ['Solo el id de la sesión; los datos están en el servidor', 'Only the session id; the data is on the server'], ['Todos sus datos firmados', 'All their data, signed'], ['Nada', 'Nothing']], 1,
        'Por eso revocarla es fácil: el servidor borra la sesión.', 'That is why revoking it is easy: the server deletes the session.'),
      q('¿Qué hace el atributo `HttpOnly` de una cookie?', 'What does a cookie\'s `HttpOnly` attribute do?', [['Que solo viaje por HTTP sin cifrar', 'Makes it travel only over unencrypted HTTP'], ['Que JavaScript no pueda leerla, lo que limita el daño de un XSS', 'Prevents JavaScript from reading it, which limits the damage of XSS'], ['Que expire al cerrar el navegador', 'Makes it expire when the browser closes'], ['Que se mande a otros sitios', 'Makes it be sent to other sites']], 1,
        '`Secure` hace que solo viaje por HTTPS y `SameSite` que no se mande desde otros sitios.', '`Secure` makes it travel only over HTTPS and `SameSite` keeps it from being sent from other sites.'),
      q('¿Cuáles son las tres partes de un JWT?', 'What are the three parts of a JWT?', [['Usuario, contraseña y fecha', 'User, password and date'], ['Cabecera, payload y firma', 'Header, payload and signature'], ['Dominio, ruta y puerto', 'Domain, path and port'], ['Clave, valor y sal', 'Key, value and salt']], 1,
        'Separadas por puntos y codificadas en base64.', 'Separated by dots and encoded in base64.'),
      q('¿Está cifrado el payload de un JWT?', 'Is a JWT payload encrypted?', [['Sí, nadie puede leerlo', 'Yes, nobody can read it'], ['No: está firmado, pero cualquiera puede leerlo', 'No: it is signed, but anyone can read it'], ['Solo si usa HTTPS', 'Only if it uses HTTPS'], ['Solo el rol', 'Only the role']], 1,
        'Por eso nunca se guardan datos secretos en él.', 'That is why secret data is never stored in it.'),
      q('Alguien cambia en un JWT el rol de "lector" a "admin". ¿Qué pasa?', 'Someone changes a JWT\'s role from "reader" to "admin". What happens?', [['Se vuelve administrador', 'They become an admin'], ['La firma ya no coincide y el servidor rechaza el token', 'The signature no longer matches and the server rejects the token'], ['El token se renueva', 'The token is renewed'], ['Nada', 'Nothing']], 1,
        'Sin el secreto del servidor no puede generar una firma válida.', 'Without the server\'s secret they cannot produce a valid signature.'),
      q('¿Cómo se manda normalmente un JWT en cada petición?', 'How is a JWT usually sent on each request?', [['En la URL', 'In the URL'], ['En el header `Authorization: Bearer <token>`', 'In the `Authorization: Bearer <token>` header'], ['En el body de un GET', 'In a GET body'], ['No se manda', 'It is not sent']], 1,
        'Poner tokens en la URL los deja en historiales y logs.', 'Putting tokens in the URL leaves them in histories and logs.'),
      q('¿Para qué sirve OAuth 2.0?', 'What is OAuth 2.0 for?', [['Para cifrar contraseñas', 'To encrypt passwords'], ['Para dar a una app un permiso limitado sobre tus datos en otro servicio sin darle tu contraseña', 'To give an app limited permission over your data on another service without giving it your password'], ['Para guardar sesiones', 'To store sessions'], ['Para hacer más rápido el login', 'To make login faster']], 1,
        'Es autorización delegada. OpenID Connect le agrega la identidad.', 'It is delegated authorization. OpenID Connect adds identity.'),
      q('En el flujo de OAuth, ¿quién ve tu contraseña de Google?', 'In the OAuth flow, who sees your Google password?', [['La app que pide acceso', 'The app requesting access'], ['Solo Google', 'Only Google'], ['Los dos', 'Both'], ['Nadie: no se usa contraseña', 'Nobody: no password is used']], 1,
        'La app solo recibe un código y luego un token con permisos limitados.', 'The app only receives a code and then a token with limited permissions.'),
      q('¿Qué agrega MFA?', 'What does MFA add?', [['Una contraseña más larga', 'A longer password'], ['Un segundo factor (un código en tu teléfono, tu huella) además de la contraseña', 'A second factor (a code on your phone, your fingerprint) besides the password'], ['Un JWT', 'A JWT'], ['Una cookie más', 'One more cookie']], 1,
        'Aunque roben la contraseña, no basta para entrar.', 'Even if the password is stolen, it is not enough to get in.'),
    ],
    concepts: [
      concept('Sesiones vs JWT', 'Sessions vs JWT', 'Sesiones: estado en el servidor, fácil de revocar. JWT: sin estado y escalable, pero difícil de revocar.', 'Sessions: server-side state, easy to revoke. JWT: stateless and scalable but hard to revoke.'),
      concept('¿Para qué sirve OAuth 2.0?', 'What is OAuth 2.0 for?', 'Autorización delegada: una app accede a recursos de otra en nombre del usuario sin su contraseña.', 'Delegated authorization: an app accesses another app\'s resources on behalf of the user without their password.'),
    ],
  },
  {
    id: 'caching',
    track: 'web',
    title: l('Caché y rendimiento', 'Caching and performance'),
    summary: l('Qué es una caché, dónde se pone, la estrategia cache-aside, el TTL y la invalidación, la política LRU y los headers de caché de HTTP.', 'What a cache is, where it goes, the cache-aside strategy, TTL and invalidation, the LRU policy and HTTP caching headers.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Qué es una caché?
Una **caché** guarda una **copia** de un resultado costoso (una consulta a la base de datos, una página, una imagen) **cerca de quien la necesita**, para no tener que calcularlo o ir a buscarlo cada vez.
- **Hit:** lo que buscas ya está en la caché. Respuesta rapidísima.
- **Miss:** no está. Hay que ir a la fuente original (lento) y, normalmente, guardarlo en la caché para la próxima.
- **Tasa de aciertos** (*hit ratio*): qué porcentaje de las búsquedas son hits. Mientras más alta, mejor está funcionando.

**Analogía:** tener en tu escritorio los libros que más usas en vez de ir a la biblioteca cada vez. El escritorio es chico, así que no caben todos: hay que decidir cuáles se quedan.

## Dónde se pone una caché
- **En el navegador:** guarda archivos según los headers \`Cache-Control\` que manda el servidor.
- **En una CDN** (*Content Delivery Network*): servidores repartidos por el mundo que guardan copias de archivos estáticos (imágenes, CSS, JavaScript) **cerca del usuario**.
- **En la aplicación:** una caché en memoria como **Redis**, para resultados de consultas o datos que se piden mucho.
- **En la base de datos:** las bases también guardan en memoria lo que se lee seguido.`,
        `## What is a cache?
A **cache** keeps a **copy** of an expensive result (a database query, a page, an image) **close to whoever needs it**, so it does not have to be computed or fetched every time.
- **Hit:** what you want is already in the cache. Very fast answer.
- **Miss:** it is not. You must go to the original source (slow) and, usually, store it in the cache for next time.
- **Hit ratio:** what percentage of lookups are hits. The higher, the better it is working.

**Analogy:** keeping the books you use most on your desk instead of going to the library each time. The desk is small, so not all of them fit: you must decide which ones stay.

## Where a cache goes
- **In the browser:** it stores files according to the \`Cache-Control\` headers the server sends.
- **In a CDN** (*Content Delivery Network*): servers spread around the world that keep copies of static files (images, CSS, JavaScript) **close to the user**.
- **In the application:** an in-memory cache like **Redis**, for query results or frequently requested data.
- **In the database:** databases also keep in memory what is read often.`,
      ),
      md(
        `## Cache-aside: la estrategia más común
1. La app busca en la caché.
2. Si está (**hit**), la devuelve.
3. Si no (**miss**), la lee de la base de datos, **la guarda en la caché** y la devuelve.

Cada dato se guarda con un **TTL** (*time to live*): un tiempo después del cual **expira solo**. Así, aunque nadie la borre, la copia vieja no dura para siempre.

En el ejemplo, un diccionario hace de caché (en producción sería Redis) y contamos cuántas veces se va a la base de datos. \`time.time()\` da la hora actual en segundos.`,
        `## Cache-aside: the most common strategy
1. The app looks in the cache.
2. If it is there (**hit**), it returns it.
3. If not (**miss**), it reads it from the database, **stores it in the cache** and returns it.

Each item is stored with a **TTL** (*time to live*): a time after which it **expires by itself**. That way, even if nobody deletes it, the old copy does not last forever.

In the example, a dictionary acts as the cache (in production it would be Redis) and we count how many times the database is hit. \`time.time()\` gives the current time in seconds.`,
      ),
      code(`import time

cache = {}                          # clave → (valor, momento en que expira)
consultas_bd = 0

def leer_bd(id):
    global consultas_bd
    consultas_bd += 1               # cada visita a la base de datos es lenta: la contamos
    return {"id": id, "nombre": f"usuario {id}"}

def obtener_usuario(id, ttl=300):
    clave = f"user:{id}"
    if clave in cache and cache[clave][1] > time.time():   # hit, y no ha expirado
        return cache[clave][0]
    valor = leer_bd(id)                                     # miss: ir a la base de datos
    cache[clave] = (valor, time.time() + ttl)               # guardar con TTL de 300 s
    return valor

for _ in range(3):
    obtener_usuario(7)
print(consultas_bd)                 # imprime: 1      (la primera fue miss; las otras dos, hits)`),
      md(
        `## El problema difícil: datos viejos
Si alguien cambia su nombre en la base de datos, la caché sigue teniendo el nombre viejo hasta que expire. Eso es un **dato obsoleto** (*stale*). Opciones:
- **Invalidar al escribir:** al actualizar la base, **borra esa clave de la caché**. La próxima lectura será un miss y traerá el dato nuevo.
- **Write-through:** al escribir, se actualizan la caché **y** la base de datos a la vez. La caché siempre está al día, pero cada escritura cuesta un poco más.
- **TTL corto:** aceptas que el dato pueda estar viejo unos segundos o minutos.

> "Solo hay dos cosas difíciles en computación: invalidar la caché y ponerle nombre a las cosas." — Phil Karlton

## ¿Qué sale cuando se llena? LRU
La caché tiene un tamaño limitado. Cuando se llena, hay que **desalojar** algo. La política más común es **LRU** (*least recently used*): sale lo que **lleva más tiempo sin usarse**.

En Python, \`OrderedDict\` es un diccionario que recuerda el orden: \`move_to_end(clave)\` manda una clave al final (la más reciente) y \`popitem(last=False)\` saca la del principio (la menos reciente). Con eso, \`get\` y \`put\` son **O(1)**.`,
        `## The hard problem: stale data
If someone changes their name in the database, the cache still holds the old name until it expires. That is **stale** data. Options:
- **Invalidate on write:** when updating the database, **delete that key from the cache**. The next read will be a miss and bring the new data.
- **Write-through:** on write, both the cache **and** the database are updated at once. The cache is always up to date, but each write costs a bit more.
- **Short TTL:** you accept the data may be old for a few seconds or minutes.

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

## What leaves when it fills up? LRU
The cache has a limited size. When it fills up, something must be **evicted**. The most common policy is **LRU** (*least recently used*): what **has gone unused the longest** leaves.

In Python, \`OrderedDict\` is a dictionary that remembers order: \`move_to_end(key)\` sends a key to the end (the most recent) and \`popitem(last=False)\` removes the one at the start (the least recent). With that, \`get\` and \`put\` are **O(1)**.`,
      ),
      code(`from collections import OrderedDict

class LRU:
    def __init__(self, capacidad):
        self.capacidad = capacidad
        self.datos = OrderedDict()            # recuerda el orden de uso

    def get(self, clave):
        if clave not in self.datos:
            return None
        self.datos.move_to_end(clave)         # se acaba de usar: pasa al final
        return self.datos[clave]

    def put(self, clave, valor):
        self.datos[clave] = valor
        self.datos.move_to_end(clave)
        if len(self.datos) > self.capacidad:
            self.datos.popitem(last=False)    # sale la del principio: la usada hace más tiempo

c = LRU(2)
c.put("a", 1)
c.put("b", 2)
c.get("a")                                    # "a" se vuelve la más reciente
c.put("c", 3)                                 # no cabe: sale "b", la menos reciente
print(list(c.datos))                          # imprime: ['a', 'c']`),
      md(
        `## Caché en HTTP
El servidor le dice al navegador (y a las CDN) qué puede guardar con el header **\`Cache-Control\`**:
- \`Cache-Control: max-age=3600\`: puedes usar esta copia durante 3600 segundos sin volver a preguntar.
- \`Cache-Control: no-store\`: no guardes nada (por ejemplo, datos bancarios).

Cuando la copia ya venció, el navegador puede preguntar "¿cambió?" en vez de descargarla de nuevo. El servidor mandó antes un **\`ETag\`** (una huella de la versión); el navegador lo devuelve en \`If-None-Match\`, y si no cambió, el servidor responde **304 Not Modified** sin body: el navegador sigue usando su copia.`,
        `## Caching in HTTP
The server tells the browser (and CDNs) what it can store with the **\`Cache-Control\`** header:
- \`Cache-Control: max-age=3600\`: you may use this copy for 3600 seconds without asking again.
- \`Cache-Control: no-store\`: do not store anything (for example, banking data).

When the copy has expired, the browser can ask "did it change?" instead of downloading it again. The server previously sent an **\`ETag\`** (a fingerprint of the version); the browser sends it back in \`If-None-Match\`, and if nothing changed, the server answers **304 Not Modified** with no body: the browser keeps using its copy.`,
      ),
      interview('Pregunta clásica: "Implementa una caché LRU". Se resuelve con un hash map (clave → nodo) + una lista doblemente enlazada (orden de uso), o con `OrderedDict` en Python, con `get` y `put` en O(1).', 'Classic question: "Implement an LRU cache". It is solved with a hash map (key → node) + a doubly linked list (usage order), or with `OrderedDict` in Python, with `get` and `put` in O(1).'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Hit / miss | Estaba en la caché / hubo que ir a la fuente |
| Niveles | Navegador, CDN, aplicación (Redis), base de datos |
| Cache-aside | Busca en caché; si falla, lee de la BD y guarda en la caché |
| TTL | La copia expira sola después de un tiempo |
| Datos obsoletos | Invalidar al escribir, write-through o TTL corto |
| LRU | Al llenarse, sale lo que lleva más tiempo sin usarse; O(1) con hash map + lista |
| \`Cache-Control\` | \`max-age\` (cuánto guardar) o \`no-store\` (no guardar) |
| ETag / 304 | "¿Cambió?" → "No, usa tu copia" |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Hit / miss | It was in the cache / you had to go to the source |
| Levels | Browser, CDN, application (Redis), database |
| Cache-aside | Look in the cache; on a miss, read from the DB and store it in the cache |
| TTL | The copy expires by itself after a while |
| Stale data | Invalidate on write, write-through or a short TTL |
| LRU | When full, what has gone unused the longest leaves; O(1) with a hash map + list |
| \`Cache-Control\` | \`max-age\` (how long to keep) or \`no-store\` (do not keep) |
| ETag / 304 | "Did it change?" → "No, use your copy" |`,
      ),
    ],
    quiz: [
      q('En cache-aside, ante un miss…', 'In cache-aside, on a miss…', [['Se devuelve error', 'An error is returned'], ['Se lee de la BD y se guarda en caché', 'Read from DB and store in cache'], ['Se limpia toda la caché', 'The whole cache is cleared'], ['Se espera a que alguien la llene', 'It waits for someone to fill it']], 1,
        'Así la próxima lectura ya es un hit.', 'That way the next read is already a hit.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es un **hit** de caché?', 'What is a cache **hit**?', [['Un error de la caché', 'A cache error'], ['Cuando lo que buscas ya está en la caché', 'When what you look for is already in the cache'], ['Cuando la caché se llena', 'When the cache fills up'], ['Cuando se borra la caché', 'When the cache is cleared']], 1,
        'Un miss es cuando no está y hay que ir a la fuente.', 'A miss is when it is not there and you must go to the source.'),
      q('¿Qué hace una **CDN**?', 'What does a **CDN** do?', [['Guarda contraseñas', 'Stores passwords'], ['Guarda copias de archivos estáticos en servidores cerca del usuario', 'Keeps copies of static files on servers close to the user'], ['Reemplaza la base de datos', 'Replaces the database'], ['Cifra la conexión', 'Encrypts the connection']], 1,
        'Así una imagen viaja desde una ciudad cercana y no desde el otro lado del mundo.', 'That way an image travels from a nearby city and not from the other side of the world.'),
      q('Pides el mismo usuario 3 veces con cache-aside y la caché empezó vacía. ¿Cuántas veces se va a la base de datos?', 'You request the same user 3 times with cache-aside and the cache started empty. How many times is the database hit?', [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']], 1,
        'La primera es un miss y guarda el dato; las otras dos son hits.', 'The first is a miss and stores the data; the other two are hits.'),
      q('¿Para qué sirve el **TTL** de una entrada de caché?', 'What is a cache entry\'s **TTL** for?', [['Para que expire sola después de un tiempo', 'So it expires by itself after a while'], ['Para cifrarla', 'To encrypt it'], ['Para que nunca se borre', 'So it is never deleted'], ['Para contar visitas', 'To count visits']], 0,
        'Limita cuánto tiempo puede durar una copia vieja.', 'It limits how long an old copy can last.'),
      q('Un usuario cambia su nombre, pero la página sigue mostrando el viejo por la caché. ¿Qué haces al guardar el cambio?', 'A user changes their name, but the page keeps showing the old one because of the cache. What do you do when saving the change?', [['Nada, se arregla solo algún día', 'Nothing, it fixes itself someday'], ['Borrar (invalidar) esa clave de la caché o actualizarla (write-through)', 'Delete (invalidate) that cache key or update it (write-through)'], ['Borrar la base de datos', 'Delete the database'], ['Reiniciar el servidor', 'Restart the server']], 1,
        'La próxima lectura será un miss y traerá el dato nuevo.', 'The next read will be a miss and bring the new data.'),
      q('¿Qué es **write-through**?', 'What is **write-through**?', [['Escribir solo en la caché', 'Writing only to the cache'], ['Al escribir, actualizar a la vez la caché y la base de datos', 'On write, updating the cache and the database at once'], ['Leer siempre de la base', 'Always reading from the database'], ['Borrar la caché al escribir', 'Clearing the cache on write']], 1,
        'La caché queda al día a cambio de escrituras un poco más lentas.', 'The cache stays up to date at the cost of slightly slower writes.'),
      q('Una caché **LRU** está llena y llega un dato nuevo. ¿Cuál sale?', 'An **LRU** cache is full and new data arrives. Which item leaves?', [['El más nuevo', 'The newest'], ['El que lleva más tiempo sin usarse', 'The one unused for the longest'], ['Uno al azar', 'A random one'], ['El más grande', 'The largest']], 1,
        'LRU = least recently used: el usado hace más tiempo.', 'LRU = least recently used.'),
      q('En una caché LRU de capacidad 2: `put a`, `put b`, `get a`, `put c`. ¿Qué queda?', 'In an LRU cache of capacity 2: `put a`, `put b`, `get a`, `put c`. What remains?', [['a y b', 'a and b'], ['b y c', 'b and c'], ['a y c', 'a and c'], ['solo c', 'only c']], 2,
        'Leer `a` la hizo la más reciente, así que la que sale es `b`.', 'Reading `a` made it the most recent, so `b` is the one that leaves.'),
      q('¿Con qué estructuras se implementa una caché LRU con `get` y `put` en O(1)?', 'Which structures implement an LRU cache with O(1) `get` and `put`?', [['Una lista ordenada', 'A sorted list'], ['Un hash map + una lista doblemente enlazada (u `OrderedDict` en Python)', 'A hash map + a doubly linked list (or `OrderedDict` in Python)'], ['Un heap', 'A heap'], ['Un árbol BST', 'A BST']], 1,
        'El hash map encuentra la clave; la lista mantiene el orden de uso.', 'The hash map finds the key; the list keeps the usage order.'),
      q('¿Qué le dice al navegador `Cache-Control: max-age=3600`?', 'What does `Cache-Control: max-age=3600` tell the browser?', [['Que no guarde nada', 'Not to store anything'], ['Que puede usar su copia durante 3600 segundos sin volver a preguntar', 'That it can use its copy for 3600 seconds without asking again'], ['Que la página pesa 3600 bytes', 'That the page weighs 3600 bytes'], ['Que hay 3600 usuarios', 'That there are 3600 users']], 1,
        'Con `no-store`, en cambio, no se guarda nada.', 'With `no-store`, instead, nothing is stored.'),
      q('¿Qué significa una respuesta **304 Not Modified**?', 'What does a **304 Not Modified** response mean?', [['Que la página no existe', 'That the page does not exist'], ['Que no cambió desde tu copia (según el ETag): sigue usándola', 'That it did not change since your copy (per the ETag): keep using it'], ['Que hubo un error', 'That there was an error'], ['Que se movió', 'That it moved']], 1,
        'Se ahorra volver a descargar el archivo completo.', 'It saves downloading the whole file again.'),
    ],
    concepts: [concept('Estructura de una caché LRU', 'LRU cache structure', 'Hash map (clave → nodo) + lista doblemente enlazada (orden de uso). get/put en O(1).', 'Hash map (key → node) + doubly linked list (usage order). get/put in O(1).')],
  },
  {
    id: 'web-security',
    track: 'web',
    title: l('Seguridad web', 'Web security'),
    summary: l('Los ataques que más preguntan (inyección SQL, XSS y CSRF), cómo funcionan y cómo se previenen, qué es CORS y otras prácticas básicas de seguridad.', 'The attacks asked about most (SQL injection, XSS and CSRF), how they work and how they are prevented, what CORS is and other basic security practices.'),
    minutes: 22,
    blocks: [
      md(
        `## La regla de oro: nunca confíes en lo que manda el usuario
Todo lo que llega de afuera (formularios, la URL, headers, archivos) puede venir de un atacante. Casi todos los ataques web consisten en **mandar datos que el sistema termina tratando como código**. La organización **OWASP** publica el *Top 10* de los riesgos más comunes en aplicaciones web; en esta lección vemos los que más aparecen en entrevistas.

## Inyección SQL
**El ataque:** si armas una consulta **pegando** lo que escribió el usuario, él puede escribir SQL que cambie la consulta. Por ejemplo, en un campo de email escribe \`nadie' OR '1'='1\`. La consulta queda \`… WHERE email = 'nadie' OR '1'='1'\`, y como \`'1'='1'\` siempre es verdadero, devuelve **todas** las filas.

**La defensa: consultas parametrizadas.** En vez de pegar el dato en el texto del SQL, pones un **marcador** (\`?\` en sqlite, \`%s\` en otras librerías) y pasas el dato aparte. La base de datos lo trata **siempre como dato, nunca como código**. Los ORM lo hacen por ti.`,
        `## The golden rule: never trust what the user sends
Everything that comes from outside (forms, the URL, headers, files) may come from an attacker. Almost every web attack consists of **sending data that the system ends up treating as code**. The **OWASP** organization publishes the *Top 10* most common risks in web applications; this lesson covers the ones that come up most in interviews.

## SQL injection
**The attack:** if you build a query by **pasting** what the user typed, they can write SQL that changes the query. For example, in an email field they type \`nobody' OR '1'='1\`. The query becomes \`… WHERE email = 'nobody' OR '1'='1'\`, and since \`'1'='1'\` is always true, it returns **every** row.

**The defense: parameterized queries.** Instead of pasting the data into the SQL text, you put a **placeholder** (\`?\` in sqlite, \`%s\` in other libraries) and pass the data separately. The database treats it **always as data, never as code**. ORMs do this for you.`,
      ),
      code(`import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE usuarios (email TEXT, secreto TEXT)")
db.execute("INSERT INTO usuarios VALUES ('ana@x.com', 'A1'), ('luis@x.com', 'L2')")

entrada = "nadie' OR '1'='1"              # lo que escribe un atacante en el formulario

# ❌ Pegar la entrada dentro del SQL: el atacante cambia la consulta
peligrosa = f"SELECT secreto FROM usuarios WHERE email = '{entrada}'"
print(len(db.execute(peligrosa).fetchall()))             # imprime: 2   (se llevó todos los secretos)

# ✅ Consulta parametrizada: la entrada se trata solo como dato
segura = "SELECT secreto FROM usuarios WHERE email = ?"
print(len(db.execute(segura, (entrada,)).fetchall()))    # imprime: 0`),
      md(
        `\`(entrada,)\` es una tupla con un solo elemento: los valores de los marcadores se pasan siempre en una tupla.

## XSS (Cross-Site Scripting)
**El ataque:** el atacante logra que **su JavaScript se ejecute en el navegador de otros usuarios**. Por ejemplo, deja un comentario que en vez de texto contiene \`<script>…</script>\`. Si la página muestra el comentario tal cual, cada persona que lo vea ejecuta ese script, que puede robar sus cookies o actuar en su nombre.

**Las defensas:**
- **Escapar la salida:** convertir los caracteres especiales de HTML (\`<\`, \`>\`, \`&\`, comillas) en su versión de texto (\`&lt;\`, \`&gt;\`…). Así el navegador **muestra** \`<script>\` como texto en vez de ejecutarlo. Frameworks como React escapan por defecto.
- **No insertar datos del usuario con \`innerHTML\`** (que interpreta HTML); usar \`textContent\`.
- **CSP** (*Content Security Policy*): un header que le dice al navegador de dónde puede cargar scripts.
- **Cookies \`HttpOnly\`:** aunque corra un script malicioso, no podrá leer la cookie de sesión.`,
        `\`(entrada,)\` is a one-element tuple: placeholder values are always passed in a tuple.

## XSS (Cross-Site Scripting)
**The attack:** the attacker manages to get **their JavaScript to run in other users' browsers**. For example, they leave a comment that instead of text contains \`<script>…</script>\`. If the page shows the comment as is, everyone who sees it runs that script, which can steal their cookies or act on their behalf.

**The defenses:**
- **Escape the output:** turn HTML's special characters (\`<\`, \`>\`, \`&\`, quotes) into their text version (\`&lt;\`, \`&gt;\`…). That way the browser **shows** \`<script>\` as text instead of running it. Frameworks like React escape by default.
- **Do not insert user data with \`innerHTML\`** (which interprets HTML); use \`textContent\`.
- **CSP** (*Content Security Policy*): a header telling the browser where it may load scripts from.
- **\`HttpOnly\` cookies:** even if a malicious script runs, it cannot read the session cookie.`,
      ),
      code(`import html

comentario = '<script>robar(document.cookie)</script>'
print(html.escape(comentario))   # imprime: &lt;script&gt;robar(document.cookie)&lt;/script&gt;`),
      md(
        `## CSRF (Cross-Site Request Forgery)
**El ataque:** tienes la sesión abierta en tu banco. Visitas otra página, maliciosa, que tiene un formulario oculto que se envía solo a \`tubanco.com/transferir\`. Tu navegador **manda tus cookies automáticamente** con esa petición, así que el banco cree que fuiste tú.

**Las defensas:**
- **Token CSRF:** el servidor pone en cada formulario un valor aleatorio y secreto, y solo acepta la petición si trae ese valor. La página maliciosa no puede leerlo, así que no puede incluirlo.
- **Cookies \`SameSite\`:** el navegador no manda la cookie en peticiones que vienen de otro sitio.
- **No cambiar nada con GET:** las acciones que modifican datos van con POST, PUT o DELETE.

## CORS: no es un ataque
Por la **política del mismo origen** (*same-origin policy*), el JavaScript de una página **no puede leer** las respuestas de **otro origen**. El origen es la combinación de **protocolo + dominio + puerto**: \`https://app.com\` y \`https://api.com\` son orígenes distintos, y también \`http://app.com\` y \`https://app.com\`.

**CORS** (*Cross-Origin Resource Sharing*) es la forma en que un servidor **permite** esas lecturas: responde con \`Access-Control-Allow-Origin: https://app.com\`. Para algunas peticiones, el navegador primero pregunta con una petición \`OPTIONS\` (*preflight*).

Ojo con un malentendido común: **CORS lo aplica el navegador**; no protege a tu servidor de otros programas (un script con \`curl\` lo ignora). La seguridad de tu API viene de la autenticación, no de CORS.`,
        `## CSRF (Cross-Site Request Forgery)
**The attack:** you have a session open at your bank. You visit another, malicious page that has a hidden form auto-submitting to \`yourbank.com/transfer\`. Your browser **sends your cookies automatically** with that request, so the bank thinks it was you.

**The defenses:**
- **CSRF token:** the server puts a random secret value in each form, and only accepts the request if it carries that value. The malicious page cannot read it, so it cannot include it.
- **\`SameSite\` cookies:** the browser does not send the cookie on requests coming from another site.
- **Do not change anything with GET:** actions that modify data use POST, PUT or DELETE.

## CORS: not an attack
Because of the **same-origin policy**, a page's JavaScript **cannot read** responses from **another origin**. The origin is the combination of **protocol + domain + port**: \`https://app.com\` and \`https://api.com\` are different origins, and so are \`http://app.com\` and \`https://app.com\`.

**CORS** (*Cross-Origin Resource Sharing*) is how a server **allows** those reads: it answers with \`Access-Control-Allow-Origin: https://app.com\`. For some requests, the browser first asks with an \`OPTIONS\` request (*preflight*).

Watch out for a common misunderstanding: **CORS is enforced by the browser**; it does not protect your server from other programs (a \`curl\` script ignores it). Your API's security comes from authentication, not from CORS.`,
      ),
      code(`from urllib.parse import urlparse

def mismo_origen(a, b):
    ua, ub = urlparse(a), urlparse(b)
    return (ua.scheme, ua.hostname, ua.port) == (ub.scheme, ub.hostname, ub.port)

print(mismo_origen("https://app.com/perfil", "https://app.com/api/datos"))   # imprime: True
print(mismo_origen("https://app.com", "https://api.app.com"))               # imprime: False`),
      md(
        `## Otras prácticas básicas
- **Contraseñas** con hash lento y sal, **MFA** y **límite de intentos** contra la fuerza bruta (lo viste en autenticación).
- **HTTPS en todo**, para que nadie lea ni cambie lo que viaja.
- **Secretos fuera del código:** las contraseñas de la base de datos y las llaves de APIs van en variables de entorno o un gestor de secretos, **nunca en el repositorio**.
- **Mínimo privilegio:** cada usuario y cada servicio con solo los permisos que necesita.
- **Mantener actualizadas las dependencias**, porque se descubren fallas en librerías populares todo el tiempo.`,
        `## Other basic practices
- **Passwords** with a slow salted hash, **MFA** and **rate limiting** against brute force (you saw this in authentication).
- **HTTPS everywhere**, so nobody can read or change what travels.
- **Secrets out of the code:** database passwords and API keys go in environment variables or a secrets manager, **never in the repository**.
- **Least privilege:** each user and each service with only the permissions it needs.
- **Keep dependencies updated**, because flaws are found in popular libraries all the time.`,
      ),
      md(
        `## Resumen
| Ataque | Qué es | Prevención |
|---|---|---|
| **Inyección SQL** | Meter SQL en una entrada para cambiar la consulta | Consultas **parametrizadas** u ORM |
| **XSS** | Inyectar JavaScript que corre en el navegador de otros | **Escapar la salida**, no usar \`innerHTML\` con datos del usuario, CSP, cookies \`HttpOnly\` |
| **CSRF** | Que tu navegador mande una petición con tus cookies desde otro sitio | **Token CSRF**, cookies \`SameSite\`, no cambiar datos con GET |
| **Autenticación débil** | Contraseñas débiles, sin límite de intentos, sesiones eternas | Hash Argon2id, MFA, límite de intentos, expiración |

**CORS** no es un ataque: es cómo un servidor permite que JavaScript de otro origen lea sus respuestas, y lo aplica el navegador.`,
        `## Summary
| Attack | What it is | Prevention |
|---|---|---|
| **SQL injection** | Slipping SQL into an input to change the query | **Parameterized** queries or an ORM |
| **XSS** | Injecting JavaScript that runs in other people's browsers | **Escape the output**, no \`innerHTML\` with user data, CSP, \`HttpOnly\` cookies |
| **CSRF** | Getting your browser to send a request with your cookies from another site | **CSRF token**, \`SameSite\` cookies, no data changes with GET |
| **Weak authentication** | Weak passwords, no attempt limits, endless sessions | Argon2id hash, MFA, rate limiting, expiration |

**CORS** is not an attack: it is how a server allows JavaScript from another origin to read its responses, and it is enforced by the browser.`,
      ),
    ],
    quiz: [
      q('La defensa principal contra inyección SQL es…', 'The main defense against SQL injection is…', [['Escapar comillas a mano', 'Escaping quotes by hand'], ['Consultas parametrizadas', 'Parameterized queries'], ['Usar HTTPS', 'Using HTTPS'], ['Ocultar los errores', 'Hiding errors']], 1,
        'La base trata el dato siempre como dato, nunca como código.', 'The database always treats the data as data, never as code.'),
      q('¿Qué protege CORS?', 'What does CORS protect?', [['Al servidor de cualquier petición', 'The server from any request'], ['Controla qué orígenes pueden leer respuestas desde el navegador', 'It controls which origins can read responses from the browser'], ['Cifra las cookies', 'It encrypts cookies'], ['Evita la inyección SQL', 'It prevents SQL injection']], 1,
        'Lo aplica el navegador; un script fuera del navegador lo ignora.', 'The browser enforces it; a script outside the browser ignores it.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Cuál es la idea detrás de casi todos los ataques web?', 'What is the idea behind almost every web attack?', [['Adivinar contraseñas', 'Guessing passwords'], ['Mandar datos que el sistema termina tratando como código', 'Sending data the system ends up treating as code'], ['Apagar el servidor', 'Shutting down the server'], ['Usar HTTP en vez de HTTPS', 'Using HTTP instead of HTTPS']], 1,
        'Por eso la regla de oro es no confiar en lo que manda el usuario.', 'That is why the golden rule is not to trust what the user sends.'),
      q('Un atacante escribe `nadie\' OR \'1\'=\'1` en el campo de email y la consulta pega ese texto. ¿Qué pasa?', 'An attacker types `nobody\' OR \'1\'=\'1` into the email field and the query pastes that text. What happens?', [['No encuentra nada', 'It finds nothing'], ['La condición siempre es verdadera y devuelve todas las filas', 'The condition is always true and it returns every row'], ['Da error de sintaxis siempre', 'It always gives a syntax error'], ['Borra la tabla', 'It deletes the table']], 1,
        '`\'1\'=\'1\'` siempre se cumple, así que el `WHERE` deja pasar todo.', '`\'1\'=\'1\'` always holds, so the `WHERE` lets everything through.'),
      q('¿Qué hace una consulta parametrizada como `execute("… WHERE email = ?", (entrada,))`?', 'What does a parameterized query like `execute("… WHERE email = ?", (entrada,))` do?', [['Pega la entrada en el SQL', 'Pastes the input into the SQL'], ['Pasa la entrada aparte, y la base la trata solo como dato', 'Passes the input separately, and the database treats it only as data'], ['Cifra la entrada', 'Encrypts the input'], ['Borra las comillas', 'Removes the quotes']], 1,
        'El marcador `?` nunca se interpreta como código SQL.', 'The `?` placeholder is never interpreted as SQL code.'),
      q('¿Qué es **XSS**?', 'What is **XSS**?', [['Inyectar SQL en un formulario', 'Injecting SQL into a form'], ['Lograr que JavaScript del atacante se ejecute en el navegador de otros usuarios', 'Getting the attacker\'s JavaScript to run in other users\' browsers'], ['Un tipo de cifrado', 'A kind of encryption'], ['Una cookie segura', 'A secure cookie']], 1,
        'Por ejemplo, un comentario con `<script>` que la página muestra tal cual.', 'For example, a comment with `<script>` that the page shows as is.'),
      q('¿Qué hace `html.escape("<b>hola</b>")`?', 'What does `html.escape("<b>hola</b>")` do?', [['Borra el texto', 'Deletes the text'], ['Convierte `<` y `>` en `&lt;` y `&gt;`, para que el navegador lo muestre como texto', 'Turns `<` and `>` into `&lt;` and `&gt;`, so the browser shows it as text'], ['Pone el texto en negritas', 'Makes the text bold'], ['Cifra el texto', 'Encrypts the text']], 1,
        'Escapar la salida es la defensa principal contra XSS.', 'Escaping output is the main defense against XSS.'),
      q('¿Por qué una cookie `HttpOnly` reduce el daño de un XSS?', 'Why does an `HttpOnly` cookie reduce the damage of XSS?', [['Porque cifra la página', 'Because it encrypts the page'], ['Porque JavaScript no puede leerla, así que el script malicioso no roba la sesión', 'Because JavaScript cannot read it, so the malicious script does not steal the session'], ['Porque bloquea todos los scripts', 'Because it blocks every script'], ['No lo reduce', 'It does not reduce it']], 1,
        'No impide el XSS, pero limita lo que puede robar.', 'It does not prevent XSS, but it limits what it can steal.'),
      q('¿En qué consiste un ataque **CSRF**?', 'What does a **CSRF** attack consist of?', [['En robar la base de datos', 'Stealing the database'], ['En que otro sitio haga que tu navegador mande una petición con tus cookies a un sitio donde tienes sesión', 'Another site making your browser send a request with your cookies to a site where you have a session'], ['En inyectar SQL', 'Injecting SQL'], ['En adivinar contraseñas', 'Guessing passwords']], 1,
        'El servidor cree que fuiste tú porque llegan tus cookies.', 'The server thinks it was you because your cookies arrive.'),
      q('¿Cómo protege un **token CSRF**?', 'How does a **CSRF token** protect?', [['Cifrando la cookie', 'By encrypting the cookie'], ['El servidor exige un valor secreto en cada formulario que la página maliciosa no puede leer', 'The server requires a secret value in each form that the malicious page cannot read'], ['Bloqueando JavaScript', 'By blocking JavaScript'], ['Con HTTPS', 'With HTTPS']], 1,
        'Las cookies `SameSite` y no cambiar datos con GET son las otras defensas.', '`SameSite` cookies and not changing data with GET are the other defenses.'),
      q('¿Qué forma el **origen** de una página?', 'What makes up a page\'s **origin**?', [['Solo el dominio', 'Only the domain'], ['Protocolo + dominio + puerto', 'Protocol + domain + port'], ['La ruta completa', 'The full path'], ['La IP del usuario', 'The user\'s IP']], 1,
        '`https://app.com` y `https://api.app.com` son orígenes distintos.', '`https://app.com` and `https://api.app.com` are different origins.'),
      q('¿Por qué CORS **no** protege tu API de un atacante?', 'Why does CORS **not** protect your API from an attacker?', [['Porque está desactivado', 'Because it is disabled'], ['Porque lo aplica el navegador; un programa como `curl` lo ignora', 'Because the browser enforces it; a program like `curl` ignores it'], ['Porque solo funciona con GET', 'Because it only works with GET'], ['Sí la protege', 'It does protect it']], 1,
        'La protección de una API viene de la autenticación.', 'An API\'s protection comes from authentication.'),
      q('¿Dónde deben ir las contraseñas de la base de datos y las llaves de APIs?', 'Where should database passwords and API keys go?', [['En el código, para tenerlas a mano', 'In the code, to keep them handy'], ['En variables de entorno o un gestor de secretos, nunca en el repositorio', 'In environment variables or a secrets manager, never in the repository'], ['En un comentario', 'In a comment'], ['En el README', 'In the README']], 1,
        'Lo que se sube a un repositorio puede quedar expuesto para siempre en su historial.', 'Whatever is pushed to a repository can stay exposed forever in its history.'),
    ],
    concepts: [
      concept('XSS y cómo prevenirlo', 'XSS and how to prevent it', 'Inyectar scripts que se ejecutan en el navegador de otros. Se previene escapando la salida, con CSP y evitando innerHTML con datos del usuario.', 'Injecting scripts that run in others\' browsers. Prevented by escaping output, CSP and avoiding innerHTML with user data.'),
      concept('¿Qué es CSRF?', 'What is CSRF?', 'Un sitio malicioso hace que el navegador de la víctima envíe una petición autenticada con sus cookies. Se previene con tokens CSRF y SameSite.', 'A malicious site makes the victim\'s browser send an authenticated request with their cookies. Prevented with CSRF tokens and SameSite.'),
    ],
  },
];
