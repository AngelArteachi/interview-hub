import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

export const WEB_LESSONS: Lesson[] = [
  {
    id: 'how-web-works',
    track: 'web',
    title: l('Cómo funciona la web y HTTP', 'How the web and HTTP work'),
    summary: l('Qué pasa desde que escribes una URL hasta que ves la página.', 'What happens from typing a URL to seeing the page.'),
    minutes: 15,
    blocks: [
      md(
        `## De la URL a la página
1. **DNS**: traduce \`ejemplo.com\` a una dirección IP.
2. **TCP**: se abre una conexión (y **TLS** si es HTTPS, para cifrarla).
3. **Petición HTTP**: \`GET /index.html\` con sus headers.
4. **Respuesta**: código de estado, headers y body (HTML).
5. **Renderizado**: el navegador parsea el HTML, descarga CSS/JS/imágenes, construye el DOM y el CSSOM, calcula el layout y pinta.

## Anatomía de HTTP
- **Método**: GET, POST, PUT, PATCH, DELETE.
- **Headers**: \`Content-Type\`, \`Authorization\`, \`Cache-Control\`, \`Cookie\`…
- **Códigos**: 2xx éxito, 3xx redirección, 4xx error del cliente, 5xx error del servidor.
- HTTP es **sin estado**: cada petición es independiente. Las cookies y los tokens añaden "memoria".`,
        `## From URL to page
1. **DNS**: translates \`example.com\` into an IP address.
2. **TCP**: a connection is opened (plus **TLS** for HTTPS, to encrypt it).
3. **HTTP request**: \`GET /index.html\` with its headers.
4. **Response**: status code, headers and body (HTML).
5. **Rendering**: the browser parses HTML, downloads CSS/JS/images, builds the DOM and CSSOM, computes layout and paints.

## Anatomy of HTTP
- **Method**: GET, POST, PUT, PATCH, DELETE.
- **Headers**: \`Content-Type\`, \`Authorization\`, \`Cache-Control\`, \`Cookie\`…
- **Codes**: 2xx success, 3xx redirect, 4xx client error, 5xx server error.
- HTTP is **stateless**: each request is independent. Cookies and tokens add "memory".`,
      ),
      code(`GET /api/users/42 HTTP/1.1
Host: api.ejemplo.com
Authorization: Bearer eyJhbGciOi...
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"id": 42, "name": "Ana"}`, 'http'),
      interview('"¿Qué pasa cuando escribes google.com en el navegador?" es una de las preguntas más comunes. Recorre los pasos en orden y profundiza donde te pregunten.', '"What happens when you type google.com into the browser?" is one of the most common questions. Walk through the steps in order and go deeper where asked.'),
    ],
    quiz: [
      q('¿Qué hace el DNS?', 'What does DNS do?', [['Cifra la conexión', 'Encrypts the connection'], ['Traduce nombres de dominio a IPs', 'Translates domain names to IPs'], ['Renderiza HTML', 'Renders HTML'], ['Guarda cookies', 'Stores cookies']], 1, 'Es la "agenda telefónica" de Internet.', 'It is the Internet\'s "phone book".'),
      q('Un 404 indica…', 'A 404 means…', [['Error del servidor', 'Server error'], ['Recurso no encontrado', 'Resource not found'], ['No autenticado', 'Not authenticated'], ['Redirección', 'Redirect']], 1, '4xx = error del cliente.', '4xx = client error.'),
      q('401 vs 403', '401 vs 403', [['Son iguales', 'They are the same'], ['401 no autenticado, 403 sin permiso', '401 unauthenticated, 403 no permission'], ['401 sin permiso, 403 no autenticado', '401 no permission, 403 unauthenticated'], ['Ambos son errores del servidor', 'Both are server errors']], 1,
        '401: ¿quién eres? 403: sé quién eres, pero no puedes.', '401: who are you? 403: I know who you are, but you cannot.'),
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
    summary: l('Recursos, verbos, idempotencia, paginación y versionado.', 'Resources, verbs, idempotency, pagination and versioning.'),
    minutes: 14,
    blocks: [
      md(
        `## Principios
- Las URLs nombran **recursos** (sustantivos, en plural): \`/users\`, \`/users/42/orders\`.
- Los **métodos** indican la acción:

| Acción | Método | Ruta | Respuesta |
|---|---|---|---|
| Listar | GET | /users | 200 |
| Obtener | GET | /users/42 | 200 / 404 |
| Crear | POST | /users | 201 |
| Reemplazar | PUT | /users/42 | 200 |
| Actualizar parcial | PATCH | /users/42 | 200 |
| Borrar | DELETE | /users/42 | 204 |

## Idempotencia
Una operación es idempotente si repetirla tiene el mismo efecto que hacerla una vez. Lo son los métodos seguros (GET, HEAD, OPTIONS), PUT y DELETE; **POST y PATCH no garantizan serlo**. Importa cuando el cliente reintenta tras un timeout.

## Buenas prácticas
Paginación (\`?limit=20&cursor=...\`), filtros por query string, versionado (\`/v1/\`), errores con un formato consistente y validación de entrada.`,
        `## Principles
- URLs name **resources** (plural nouns): \`/users\`, \`/users/42/orders\`.
- **Methods** state the action:

| Action | Method | Route | Response |
|---|---|---|---|
| List | GET | /users | 200 |
| Get | GET | /users/42 | 200 / 404 |
| Create | POST | /users | 201 |
| Replace | PUT | /users/42 | 200 |
| Partial update | PATCH | /users/42 | 200 |
| Delete | DELETE | /users/42 | 204 |

## Idempotency
An operation is idempotent if repeating it has the same effect as doing it once. Safe methods (GET, HEAD, OPTIONS), PUT and DELETE are; **POST and PATCH are not guaranteed to be**. It matters when the client retries after a timeout.

## Good practices
Pagination (\`?limit=20&cursor=...\`), query-string filters, versioning (\`/v1/\`), consistently formatted errors and input validation.`,
      ),
      code(`// Express (Node.js)
app.post('/v1/users', async (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: 'email es requerido' });
  const user = await db.users.create({ name, email });
  res.status(201).json(user);
});

app.get('/v1/users/:id', async (req, res) => {
  const user = await db.users.find(req.params.id);
  if (!user) return res.status(404).json({ error: 'no encontrado' });
  res.json(user);
});`, 'javascript'),
      tip('REST no es la única opción: **GraphQL** deja que el cliente pida exactamente los campos que necesita, y **gRPC** es eficiente entre microservicios. Conocer los trade-offs suma puntos.', 'REST is not the only option: **GraphQL** lets the client request exactly the fields it needs, and **gRPC** is efficient between microservices. Knowing the trade-offs earns points.'),
    ],
    quiz: [
      q('¿Qué método NO es idempotente?', 'Which method is NOT idempotent?', [['GET', 'GET'], ['PUT', 'PUT'], ['POST', 'POST'], ['DELETE', 'DELETE']], 2, 'Repetir un POST puede crear duplicados.', 'Repeating a POST may create duplicates.'),
      q('Código correcto al crear un recurso', 'Correct code when creating a resource', [['200', '200'], ['201', '201'], ['204', '204'], ['302', '302']], 1, '201 Created.', '201 Created.'),
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
    summary: l('Consultas, JOINs, índices, normalización y transacciones.', 'Queries, JOINs, indexes, normalization and transactions.'),
    minutes: 20,
    blocks: [
      md(
        `## Lo esencial
- **Tablas** con filas y columnas; **clave primaria** (PK) identifica cada fila; **clave foránea** (FK) relaciona tablas.
- Relaciones: 1–1, 1–N (un usuario, muchos pedidos), N–M (tabla intermedia).

## JOINs
- **INNER JOIN**: solo las filas con coincidencia en ambas tablas.
- **LEFT JOIN**: todas las filas de la izquierda, más las coincidencias de la derecha (o NULL).

## Índices
Aceleran \`WHERE\`, \`JOIN\` y \`ORDER BY\` (B-tree: O(log n)). A cambio ocupan espacio y hacen las escrituras más lentas.

## Transacciones (ACID)
Agrupan operaciones que deben ocurrir **todas o ninguna**, como una transferencia bancaria.`,
        `## Essentials
- **Tables** with rows and columns; a **primary key** (PK) identifies each row; a **foreign key** (FK) relates tables.
- Relations: 1–1, 1–N (one user, many orders), N–M (join table).

## JOINs
- **INNER JOIN**: only rows that match in both tables.
- **LEFT JOIN**: every row from the left, plus matches from the right (or NULL).

## Indexes
They speed up \`WHERE\`, \`JOIN\` and \`ORDER BY\` (B-tree: O(log n)). In exchange they take space and make writes slower.

## Transactions (ACID)
They group operations that must happen **all or nothing**, like a bank transfer.`,
      ),
      code(`-- Usuarios con su número de pedidos (incluye los que no tienen)
SELECT u.name, COUNT(o.id) AS pedidos
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY pedidos DESC;

-- Índice para acelerar búsquedas por email
CREATE INDEX idx_users_email ON users(email);

-- Transacción
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`, 'sql'),
      interview('Ejercicio típico: "Encuentra el segundo salario más alto" o "los clientes sin pedidos". Practica GROUP BY, HAVING, subconsultas y LEFT JOIN … WHERE x IS NULL.', 'Typical exercise: "Find the second highest salary" or "customers without orders". Practice GROUP BY, HAVING, subqueries and LEFT JOIN … WHERE x IS NULL.'),
      tip('WHERE filtra filas **antes** de agrupar; HAVING filtra grupos **después** de agrupar.', 'WHERE filters rows **before** grouping; HAVING filters groups **after** grouping.'),
    ],
    quiz: [
      q('Para listar clientes sin pedidos usas…', 'To list customers without orders you use…', [['INNER JOIN', 'INNER JOIN'], ['LEFT JOIN … WHERE o.id IS NULL', 'LEFT JOIN … WHERE o.id IS NULL'], ['GROUP BY', 'GROUP BY'], ['UNION', 'UNION']], 1, 'Los que no tienen coincidencia quedan con NULL.', 'Those without a match end up with NULL.'),
      q('Diferencia entre WHERE y HAVING', 'Difference between WHERE and HAVING', [['Ninguna', 'None'], ['WHERE filtra filas, HAVING filtra grupos', 'WHERE filters rows, HAVING filters groups'], ['HAVING es más rápido', 'HAVING is faster'], ['WHERE solo funciona con JOIN', 'WHERE only works with JOIN']], 1, 'HAVING actúa tras GROUP BY.', 'HAVING acts after GROUP BY.'),
      q('Un índice hace más lentas…', 'An index makes slower…', [['Las lecturas', 'Reads'], ['Las escrituras', 'Writes'], ['Ambas', 'Both'], ['Ninguna', 'Neither']], 1, 'Cada INSERT/UPDATE debe actualizar el índice.', 'Every INSERT/UPDATE must update the index.'),
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
    summary: l('Documentos, clave-valor, columnas, grafos y el teorema CAP.', 'Documents, key-value, column, graph and the CAP theorem.'),
    minutes: 10,
    blocks: [
      md(
        `## Tipos
- **Documentos** (MongoDB): objetos JSON flexibles. Perfiles, catálogos.
- **Clave-valor** (Redis, DynamoDB): muy rápidos. Caché, sesiones, contadores.
- **Columnares** (Cassandra): escrituras masivas, series de tiempo.
- **Grafos** (Neo4j): relaciones complejas, como redes sociales o recomendaciones.

## Teorema CAP
Ante una **partición** de red, un sistema distribuido debe elegir entre **consistencia** (todos ven el mismo dato) y **disponibilidad** (siempre responde). Su autor, Eric Brewer, aclaró que el famoso "elige 2 de 3" es engañoso: la elección solo es obligatoria **mientras hay una partición**, y puede hacerse distinta para cada operación. Muchas bases NoSQL priorizan la disponibilidad con **consistencia eventual**.`,
        `## Types
- **Document** (MongoDB): flexible JSON objects. Profiles, catalogs.
- **Key-value** (Redis, DynamoDB): very fast. Caching, sessions, counters.
- **Wide-column** (Cassandra): massive writes, time series.
- **Graph** (Neo4j): complex relationships, like social networks or recommendations.

## CAP theorem
During a network **partition**, a distributed system must choose between **consistency** (everyone sees the same data) and **availability** (it always responds). Its author, Eric Brewer, clarified that the famous "pick 2 of 3" is misleading: the choice is only forced **while a partition is happening**, and it can differ per operation. Many NoSQL databases favor availability with **eventual consistency**.`,
      ),
      interview('Respuesta segura para un junior: "Empezaría con SQL (PostgreSQL) por las transacciones y la flexibilidad de consultas, y agregaría Redis como caché si hace falta".', 'Safe answer for a junior: "I would start with SQL (PostgreSQL) for transactions and query flexibility, and add Redis as a cache if needed".'),
    ],
    quiz: [
      q('¿Qué tipo de BD es Redis?', 'What kind of DB is Redis?', [['Documentos', 'Document'], ['Clave-valor en memoria', 'In-memory key-value'], ['Grafos', 'Graph'], ['Relacional', 'Relational']], 1, 'Muy usada como caché.', 'Widely used as a cache.'),
    ],
    concepts: [concept('Teorema CAP', 'CAP theorem', 'Ante una partición de red, un sistema distribuido elige entre consistencia y disponibilidad.', 'During a network partition, a distributed system chooses between consistency and availability.')],
  },
  {
    id: 'auth',
    track: 'web',
    title: l('Autenticación: sesiones, JWT y OAuth', 'Authentication: sessions, JWT and OAuth'),
    summary: l('Cómo una app sabe quién eres y qué puedes hacer.', 'How an app knows who you are and what you can do.'),
    minutes: 14,
    blocks: [
      md(
        `## Autenticación vs autorización
**Autenticación** = quién eres. **Autorización** = qué puedes hacer.

## Sesiones (stateful)
Tras el login, el servidor guarda la sesión y envía una **cookie** con su ID. Es fácil revocarla, pero hay que compartir el almacén de sesiones entre servidores.

## JWT (stateless)
El servidor firma un token con los datos del usuario. Cada petición lo envía en \`Authorization: Bearer ...\`. No requiere almacén, pero **revocarlo es difícil**; por eso se usan expiraciones cortas y refresh tokens.

## OAuth 2.0
Permite que una app acceda a recursos de otra **en nombre del usuario** sin conocer su contraseña ("Iniciar sesión con Google"). **OpenID Connect** agrega identidad encima de OAuth.

## Contraseñas
Nunca en texto plano: usa un **hash lento con sal**. OWASP recomienda **Argon2id**; si no está disponible, scrypt; bcrypt solo en sistemas heredados (y PBKDF2 si se exige FIPS-140).`,
        `## Authentication vs authorization
**Authentication** = who you are. **Authorization** = what you can do.

## Sessions (stateful)
After login, the server stores the session and sends a **cookie** with its ID. Easy to revoke, but the session store must be shared across servers.

## JWT (stateless)
The server signs a token with the user's data. Each request sends it as \`Authorization: Bearer ...\`. No store needed, but **revocation is hard**, which is why short expirations and refresh tokens are used.

## OAuth 2.0
Lets an app access another app's resources **on behalf of the user** without knowing their password ("Sign in with Google"). **OpenID Connect** adds identity on top of OAuth.

## Passwords
Never in plain text: use a **slow salted hash**. OWASP recommends **Argon2id**; if unavailable, scrypt; bcrypt only for legacy systems (and PBKDF2 when FIPS-140 is required).`,
      ),
      warn('Guardar el JWT en localStorage lo expone a XSS. Una cookie `HttpOnly; Secure; SameSite` es más segura para apps web.', 'Storing a JWT in localStorage exposes it to XSS. An `HttpOnly; Secure; SameSite` cookie is safer for web apps.'),
    ],
    quiz: [
      q('¿Cómo se deben guardar las contraseñas?', 'How should passwords be stored?', [['Cifradas con AES', 'Encrypted with AES'], ['Con hash lento y sal (p. ej. Argon2id)', 'With a slow salted hash (e.g. Argon2id)'], ['En Base64', 'In Base64'], ['En texto plano en una BD segura', 'Plain text in a secure DB']], 1, 'Un hash no se puede revertir y la sal evita las rainbow tables.', 'A hash cannot be reversed and salt defeats rainbow tables.'),
      q('Desventaja principal de JWT', 'Main drawback of JWT', [['Es lento', 'It is slow'], ['Difícil de revocar antes de expirar', 'Hard to revoke before expiry'], ['No funciona con móviles', 'Does not work on mobile'], ['Requiere una BD de sesiones', 'Requires a session DB']], 1, 'Es válido hasta que expira.', 'It is valid until it expires.'),
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
    summary: l('Dónde cachear, estrategias e invalidación.', 'Where to cache, strategies and invalidation.'),
    minutes: 10,
    blocks: [
      md(
        `## Niveles de caché
Navegador (\`Cache-Control\`), **CDN** (archivos estáticos cerca del usuario), caché de aplicación (**Redis**) y caché de la base de datos.

## Estrategias
- **Cache-aside**: la app busca en caché; si falla (*miss*), lee de la BD y guarda en caché. Es la más común.
- **Write-through**: escribe en caché y BD a la vez.
- **TTL**: los datos expiran solos después de un tiempo.
- **Desalojo**: LRU (*least recently used*) saca lo menos usado recientemente.

> "Solo hay dos cosas difíciles en computación: invalidar la caché y ponerle nombre a las cosas." — Phil Karlton`,
        `## Cache levels
Browser (\`Cache-Control\`), **CDN** (static files close to the user), application cache (**Redis**) and database cache.

## Strategies
- **Cache-aside**: the app checks the cache; on a *miss* it reads from the DB and stores the result. The most common.
- **Write-through**: write to cache and DB together.
- **TTL**: data expires on its own after a while.
- **Eviction**: LRU (*least recently used*) removes the least recently used items.

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton`,
      ),
      code(`def obtener_usuario(id):
    clave = f"user:{id}"
    if (u := redis.get(clave)) is not None:   # hit
        return json.loads(u)
    u = db.query("SELECT * FROM users WHERE id = %s", id)   # miss
    redis.setex(clave, 300, json.dumps(u))   # TTL 5 min
    return u`),
      interview('Pregunta clásica: "Implementa una caché LRU". Se resuelve con hash map + lista doblemente enlazada (u `OrderedDict` en Python), con get/put en O(1).', 'Classic question: "Implement an LRU cache". Solved with a hash map + doubly linked list (or `OrderedDict` in Python), get/put in O(1).'),
    ],
    quiz: [
      q('En cache-aside, ante un miss…', 'In cache-aside, on a miss…', [['Se devuelve error', 'An error is returned'], ['Se lee de la BD y se guarda en caché', 'Read from DB and store in cache'], ['Se limpia toda la caché', 'The whole cache is cleared'], ['Se espera al TTL', 'Wait for the TTL']], 1, 'Es el flujo del patrón.', 'That is the pattern\'s flow.'),
    ],
    concepts: [concept('Estructura de una caché LRU', 'LRU cache structure', 'Hash map (clave → nodo) + lista doblemente enlazada (orden de uso). get/put en O(1).', 'Hash map (key → node) + doubly linked list (usage order). get/put in O(1).')],
  },
  {
    id: 'web-security',
    track: 'web',
    title: l('Seguridad web básica (OWASP)', 'Basic web security (OWASP)'),
    summary: l('XSS, inyección SQL, CSRF y CORS.', 'XSS, SQL injection, CSRF and CORS.'),
    minutes: 12,
    blocks: [
      md(
        `| Ataque | Qué es | Prevención |
|---|---|---|
| **Inyección SQL** | Meter SQL en una entrada | Consultas **parametrizadas** / ORM |
| **XSS** | Inyectar JS que corre en el navegador de otros | Escapar la salida, CSP, no usar \`innerHTML\` con datos del usuario |
| **CSRF** | Hacer que el navegador de la víctima envíe una petición con sus cookies | Tokens CSRF, cookies \`SameSite\` |
| **Autenticación rota** | Contraseñas débiles, sesiones eternas | Hash Argon2id, MFA, expiración, rate limiting |

**CORS** no es un ataque: es la política del navegador que bloquea peticiones a otro origen salvo que el servidor las permita.`,
        `| Attack | What it is | Prevention |
|---|---|---|
| **SQL injection** | Sneaking SQL into an input | **Parameterized** queries / ORM |
| **XSS** | Injecting JS that runs in other users' browsers | Escape output, CSP, no \`innerHTML\` with user data |
| **CSRF** | Making the victim's browser send a request with their cookies | CSRF tokens, \`SameSite\` cookies |
| **Broken auth** | Weak passwords, endless sessions | Argon2id hashing, MFA, expiry, rate limiting |

**CORS** is not an attack: it is the browser policy that blocks cross-origin requests unless the server allows them.`,
      ),
      code(`# ❌ Vulnerable a inyección SQL
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# ✅ Parametrizada
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))`),
    ],
    quiz: [
      q('La defensa principal contra inyección SQL es…', 'The main defense against SQL injection is…', [['Validar con regex', 'Validate with regex'], ['Consultas parametrizadas', 'Parameterized queries'], ['HTTPS', 'HTTPS'], ['CORS', 'CORS']], 1, 'Los datos nunca se interpretan como SQL.', 'Data is never interpreted as SQL.'),
      q('¿Qué protege CORS?', 'What does CORS protect?', [['Al servidor de DDoS', 'The server from DDoS'], ['Al usuario, limitando peticiones cross-origin desde su navegador', 'The user, limiting cross-origin requests from their browser'], ['La base de datos', 'The database'], ['Las contraseñas', 'Passwords']], 1, 'Es una política del navegador.', 'It is a browser policy.'),
    ],
    concepts: [
      concept('XSS y cómo prevenirlo', 'XSS and how to prevent it', 'Inyectar scripts que se ejecutan en el navegador de otros. Se previene escapando la salida, con CSP y evitando innerHTML con datos del usuario.', 'Injecting scripts that run in others\' browsers. Prevented by escaping output, CSP and avoiding innerHTML with user data.'),
      concept('¿Qué es CSRF?', 'What is CSRF?', 'Un sitio malicioso hace que el navegador de la víctima envíe una petición autenticada con sus cookies. Se previene con tokens CSRF y SameSite.', 'A malicious site makes the victim\'s browser send an authenticated request with their cookies. Prevented with CSRF tokens and SameSite.'),
    ],
  },
];
