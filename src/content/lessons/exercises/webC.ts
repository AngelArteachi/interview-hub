import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, O, P, R } from './builders';

/* Ejercicios: autenticación · caché · seguridad web · introducción a system design.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores. */

/** El hash de contraseñas de la lección de autenticación */
const HASHEAR = `import hashlib
import os

def hashear(password, sal):
    return hashlib.pbkdf2_hmac("sha256", password.encode(), sal, 100_000).hex()
`;

/** La caché LRU de la lección de caché */
const LRU = `from collections import OrderedDict

class LRU:
    def __init__(self, capacidad):
        self.capacidad = capacidad
        self.datos = OrderedDict()

    def get(self, clave):
        if clave not in self.datos:
            return None
        self.datos.move_to_end(clave)
        return self.datos[clave]

    def put(self, clave, valor):
        self.datos[clave] = valor
        self.datos.move_to_end(clave)
        if len(self.datos) > self.capacidad:
            self.datos.popitem(last=False)
`;

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Autenticación ---------------- */
  auth: {
    1: R('auth-cp-salt', 'basic',
      l('¿Por qué las contraseñas se guardan con un **hash** (y no cifradas), y para qué sirve la **sal**?', 'Why are passwords stored as a **hash** (and not encrypted), and what is the **salt** for?'),
      l('Un hash es de **un solo sentido**: no se puede revertir, mientras que lo cifrado se descifra con la llave. La **sal** es un valor aleatorio distinto por usuario: hace que contraseñas iguales tengan hashes distintos y que no sirvan las tablas precalculadas. Además, el hash debe ser **lento** (Argon2id) para frenar a quien prueba millones de contraseñas.', 'A hash is **one-way**: it cannot be reversed, while encrypted data is decrypted with the key. The **salt** is a random value per user: it makes equal passwords get different hashes and makes precomputed tables useless. Also, the hash must be **slow** (Argon2id) to hold back whoever tries millions of passwords.')),
    4: R('auth-cp-jwt', 'basic',
      l('¿Puede alguien **leer** el payload de un JWT? ¿Y **cambiarlo**? ¿Por qué?', 'Can someone **read** a JWT payload? And **change** it? Why?'),
      l('**Leerlo sí:** está firmado, no cifrado; es solo base64. **Cambiarlo sin que se note, no:** la firma se calcula con un secreto que solo tiene el servidor; si el payload cambia, la firma deja de coincidir y el token se rechaza. Por eso nunca se guardan secretos en el payload.', '**Reading it, yes:** it is signed, not encrypted; it is just base64. **Changing it unnoticed, no:** the signature is computed with a secret only the server has; if the payload changes, the signature stops matching and the token is rejected. That is why secrets are never stored in the payload.')),
    5: O('auth-cp-oauth', 'medium',
      l('Ordena el flujo de **"Iniciar sesión con Google"** (OAuth 2.0).', 'Order the **"Sign in with Google"** flow (OAuth 2.0).'),
      [
        l('La app te manda a la página de Google.', 'The app sends you to Google\'s page.'),
        l('Inicias sesión en Google y aceptas los permisos que pide la app.', 'You log in on Google and accept the permissions the app requests.'),
        l('Google te regresa a la app con un código temporal.', 'Google sends you back to the app with a temporary code.'),
        l('La app cambia el código por un access token, directamente con Google.', 'The app exchanges the code for an access token, directly with Google.'),
        l('La app usa el token para pedir solo lo que se le permitió.', 'The app uses the token to request only what it was allowed.'),
      ],
      l('En ningún paso la app ve tu contraseña: solo recibe un permiso limitado.', 'At no step does the app see your password: it only gets limited permission.')),
  },

  /* ---------------- Caché ---------------- */
  caching: {
    2: P('cache-cp-aside', 'basic', l('Cache-aside con otra secuencia de pedidos. ¿Qué imprime?', 'Cache-aside with another request sequence. What does it print?'),
      `cache = {}
consultas_bd = 0

def leer_bd(id):
    global consultas_bd
    consultas_bd += 1
    return f"usuario {id}"

def obtener(id):
    if id in cache:            # hit
        return cache[id]
    valor = leer_bd(id)        # miss
    cache[id] = valor
    return valor

for id in [1, 2, 1, 3, 2, 1]:
    obtener(id)
print(consultas_bd, len(cache))`,
      '3 3',
      l('Solo la **primera** vez que se pide cada id (1, 2 y 3) es un miss: **3** consultas. Los otros tres pedidos son hits. La caché termina con **3** claves.', 'Only the **first** request for each id (1, 2 and 3) is a miss: **3** queries. The other three requests are hits. The cache ends up with **3** keys.'),
      l('Marca cuáles ids ya se habían pedido antes.', 'Mark which ids had already been requested.')),
    3: R('cache-cp-stale', 'basic',
      l('Cambias el precio de un producto en la base de datos, pero la página sigue mostrando el viejo. ¿Por qué pasa y qué opciones tienes?', 'You change a product\'s price in the database, but the page keeps showing the old one. Why, and what are your options?'),
      l('La caché tiene una **copia obsoleta**. Opciones: **invalidar** la clave al escribir (borrarla para que la próxima lectura traiga el dato nuevo), **write-through** (actualizar caché y base a la vez) o un **TTL corto** (aceptar que el dato viejo dure poco).', 'The cache holds a **stale copy**. Options: **invalidate** the key on write (delete it so the next read brings the new data), **write-through** (update cache and database together) or a **short TTL** (accept that old data lasts briefly).')),
    4: P('cache-cp-lru', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `${LRU}
c = LRU(2)
c.put("x", 1)
c.put("y", 2)
c.put("z", 3)           # no cabe
print(c.get("x"), c.get("y"), list(c.datos))`,
      "None 2 ['z', 'y']",
      l('Al meter "z" no cabe y sale "x", la menos usada: `get("x")` da **None**. `get("y")` da **2** y la vuelve la más reciente, así que el orden queda **[\'z\', \'y\']**.', 'When "z" is added it does not fit and "x" leaves, the least used: `get("x")` gives **None**. `get("y")` gives **2** and makes it the most recent, so the order is **[\'z\', \'y\']**.'),
      l('`move_to_end` manda la clave al final (la más reciente) y `popitem(last=False)` saca la del principio.', '`move_to_end` sends the key to the end (most recent) and `popitem(last=False)` removes the one at the start.')),
  },

  /* ---------------- Seguridad web ---------------- */
  'web-security': {
    1: P('sec-cp-inject', 'medium', l('Otro intento de inyección. ¿Qué imprime?', 'Another injection attempt. What does it print?'),
      `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE productos (nombre TEXT, oculto INTEGER)")
db.execute("INSERT INTO productos VALUES ('libro', 0), ('prototipo', 1), ('pluma', 0)")

busqueda = "libro' OR oculto = 1 --"     # -- hace que el resto de la línea sea un comentario
peligrosa = f"SELECT nombre FROM productos WHERE nombre = '{busqueda}' AND oculto = 0"
segura = "SELECT nombre FROM productos WHERE nombre = ? AND oculto = 0"
print(db.execute(peligrosa).fetchall(), db.execute(segura, (busqueda,)).fetchall())`,
      "[('libro',), ('prototipo',)] []",
      l('En la versión pegada, la consulta queda `nombre = \'libro\' OR oculto = 1`, y el `--` anula el `AND oculto = 0`: el atacante ve el **prototipo oculto**. La parametrizada busca literalmente un producto con ese nombre raro: **ninguno**.', 'In the pasted version, the query becomes `nombre = \'libro\' OR oculto = 1`, and `--` cancels the `AND oculto = 0`: the attacker sees the **hidden prototype**. The parameterized one literally looks for a product with that odd name: **none**.'),
      l('Escribe la consulta peligrosa completa sustituyendo `{busqueda}`.', 'Write out the full dangerous query substituting `{busqueda}`.')),
    3: R('sec-cp-xss', 'basic',
      l('¿Qué es XSS y cuáles son sus defensas principales?', 'What is XSS and what are its main defenses?'),
      l('Que el **JavaScript de un atacante se ejecute en el navegador de otros usuarios** (por ejemplo, un comentario con `<script>`). Defensas: **escapar la salida** (`&lt;` en vez de `<`), no usar `innerHTML` con datos del usuario, **CSP** y cookies **`HttpOnly`** para que un script no pueda robar la sesión.', 'The **attacker\'s JavaScript running in other users\' browsers** (for example, a comment with `<script>`). Defenses: **escape the output** (`&lt;` instead of `<`), no `innerHTML` with user data, **CSP** and **`HttpOnly`** cookies so a script cannot steal the session.')),
    5: P('sec-cp-origin', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `from urllib.parse import urlparse

def mismo_origen(a, b):
    ua, ub = urlparse(a), urlparse(b)
    return (ua.scheme, ua.hostname, ua.port) == (ub.scheme, ub.hostname, ub.port)

print(mismo_origen("http://app.com", "https://app.com"),
      mismo_origen("https://app.com:8443/a", "https://app.com:8443/b"))`,
      'False True',
      l('El primer par cambia el **protocolo** (http vs https): otro origen, **False**. El segundo tiene mismo protocolo, dominio y puerto; solo cambia la ruta, que no cuenta: **True**.', 'The first pair changes the **protocol** (http vs https): another origin, **False**. The second has the same protocol, domain and port; only the path changes, which does not count: **True**.'),
      l('El origen es protocolo + dominio + puerto. La ruta no forma parte.', 'The origin is protocol + domain + port. The path is not part of it.')),
  },

  /* ---------------- Introducción a system design ---------------- */
  'system-design-intro': {
    0: O('sys-cp-steps', 'basic',
      l('Ordena el marco de 5 pasos de una entrevista de system design.', 'Order the 5-step framework of a system design interview.'),
      [
        l('Aclarar requisitos funcionales y no funcionales.', 'Clarify functional and non-functional requirements.'),
        l('Estimar: peticiones por segundo, lecturas vs escrituras, almacenamiento.', 'Estimate: requests per second, reads vs writes, storage.'),
        l('Definir la API y el modelo de datos.', 'Define the API and the data model.'),
        l('Dibujar el diseño de alto nivel.', 'Draw the high-level design.'),
        l('Encontrar el cuello de botella, escalar y explicar los trade-offs.', 'Find the bottleneck, scale and explain the trade-offs.'),
      ],
      l('Sin requisitos no sabes qué construir, y sin estimaciones no sabes qué tan grande debe ser.', 'Without requirements you do not know what to build, and without estimates you do not know how big it must be.')),
    2: P('sys-cp-qps', 'basic', l('Estima el tráfico de una app de notas. ¿Qué imprime?', 'Estimate the traffic of a notes app. What does it print?'),
      `usuarios_diarios = 500_000
notas_por_usuario = 4
segundos_al_dia = 24 * 60 * 60

escrituras_por_segundo = usuarios_diarios * notas_por_usuario / segundos_al_dia
print(round(escrituras_por_segundo), round(escrituras_por_segundo * 10))`,
      '23 231',
      l('2 millones de notas al día ÷ 86,400 s ≈ **23** escrituras por segundo. Si cada nota se lee 10 veces, serían unas **231** lecturas por segundo.', '2 million notes a day ÷ 86,400 s ≈ **23** writes per second. If each note is read 10 times, that is about **231** reads per second.'),
      l('`round` redondea al entero más cercano.', '`round` rounds to the nearest integer.')),
    3: R('sys-cp-stateless', 'basic',
      l('Agregas un segundo servidor detrás del balanceador y los usuarios empiezan a "perder" su sesión al azar. ¿Por qué pasa y cómo lo arreglas?', 'You add a second server behind the load balancer and users start randomly "losing" their session. Why, and how do you fix it?'),
      l('Las sesiones se guardaban en la **memoria de cada servidor**: si el balanceador manda al usuario al otro servidor, ese no conoce su sesión. Se arregla haciendo los servidores **sin estado**: la sesión va en un lugar **compartido** como Redis (o se usa un token como JWT).', 'Sessions were kept in **each server\'s memory**: if the load balancer sends the user to the other server, it does not know their session. The fix is making servers **stateless**: the session goes in a **shared** place like Redis (or a token like a JWT is used).')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Autenticación ---------------- */
  auth: [
    R('auth-p-authn-authz', 'basic',
      l('Un usuario inicia sesión correctamente pero intenta borrar la cuenta de otra persona. ¿Qué parte falla: la autenticación o la autorización? ¿Qué código HTTP devuelves?', 'A user logs in correctly but tries to delete someone else\'s account. Which part fails: authentication or authorization? Which HTTP code do you return?'),
      l('La **autorización**: ya se sabe quién es (autenticación correcta), pero no tiene permiso para esa acción. Se devuelve **403**. Un 401 sería si no se supiera quién es.', '**Authorization**: it is known who they are (authentication passed), but they lack permission for that action. You return **403**. A 401 would be if it were unknown who they are.')),
    P('auth-p-hash', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import hashlib

def h(texto):
    return hashlib.sha256(texto.encode()).hexdigest()

print(h("abc") == h("abc"), h("abc") == h("abd"))`,
      'True False',
      l('Un hash da **siempre lo mismo** para la misma entrada (**True**), y un cambio mínimo da un resultado totalmente distinto (**False**). Por eso sirve para comparar sin guardar la contraseña. (Para contraseñas reales se usa un hash lento con sal, no SHA-256 solo.)', 'A hash **always gives the same result** for the same input (**True**), and a tiny change gives a completely different result (**False**). That is why it works for comparing without storing the password. (Real passwords use a slow salted hash, not plain SHA-256.)'),
      l('`hexdigest()` devuelve el hash como texto.', '`hexdigest()` returns the hash as text.')),
    C('auth-p-login', 'medium',
      l('Verificar un login. ¿Qué va en el hueco? (con la correcta imprime `True False`)', 'Verifying a login. What goes in the blank? (the right one prints `True False`)'),
      `${HASHEAR}
sal = os.urandom(16)
guardado = hashear("gato123", sal)      # lo que hay en la base de datos

def login(intento):
    return hashear(intento, ____) == guardado

print(login("gato123"), login("perro"))`,
      ['os.urandom(16)', 'sal', 'b""', 'intento'],
      1,
      l('Hay que usar **la misma sal** que se usó al registrarse (por eso se guarda junto al hash). Con una sal nueva o vacía el hash nunca coincidiría, y `intento` ni siquiera son bytes.', 'You must use **the same salt** used at signup (that is why it is stored next to the hash). With a new or empty salt the hash would never match, and `intento` is not even bytes.'),
      l('El hash depende de la contraseña **y** de la sal.', 'The hash depends on the password **and** the salt.')),
    P('auth-p-parts', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c3VhcmlvIjoiYW5hIn0.firma123"
partes = token.split(".")
print(len(partes), partes[2])`,
      '3 firma123',
      l('Un JWT tiene **3** partes separadas por puntos: cabecera, payload y firma. La tercera es la firma: **firma123**.', 'A JWT has **3** parts separated by dots: header, payload and signature. The third is the signature: **firma123**.'),
      l('`split(".")` corta el texto en cada punto.', '`split(".")` cuts the text at each dot.')),
    R('auth-p-session-jwt', 'medium',
      l('Compara sesiones y JWT: ¿dónde vive el estado, qué tan fácil es revocarlos y cuándo conviene cada uno?', 'Compare sessions and JWTs: where does the state live, how easy are they to revoke and when does each fit?'),
      l('**Sesiones:** el estado vive en el **servidor** (la cookie solo trae el id); revocar es **fácil** (borras la sesión); necesitas un almacén compartido si hay varios servidores. **JWT:** el estado va **en el token**; el servidor no guarda nada y cualquier servicio con el secreto lo verifica, pero revocarlo es **difícil** (expiración corta y refresh tokens). Sesiones para una app web típica; JWT cuando muchos servicios deben verificar al usuario.', '**Sessions:** the state lives on the **server** (the cookie only carries the id); revoking is **easy** (you delete the session); you need a shared store with several servers. **JWT:** the state goes **in the token**; the server stores nothing and any service with the secret verifies it, but revoking is **hard** (short expiry and refresh tokens). Sessions for a typical web app; JWT when many services must verify the user.')),
    O('auth-p-session-flow', 'medium',
      l('Ordena cómo funciona un login con **sesiones**.', 'Order how a login with **sessions** works.'),
      [
        l('El usuario envía su email y contraseña.', 'The user sends their email and password.'),
        l('El servidor calcula el hash con la sal guardada y lo compara.', 'The server computes the hash with the stored salt and compares it.'),
        l('Si coincide, crea una sesión y guarda su id.', 'If it matches, it creates a session and stores its id.'),
        l('Responde con `Set-Cookie` con el id de la sesión.', 'It answers with `Set-Cookie` carrying the session id.'),
        l('El navegador manda esa cookie en cada petición siguiente.', 'The browser sends that cookie on every later request.'),
      ],
      l('Así se le da "memoria" a HTTP, que es sin estado.', 'That is how stateless HTTP gets "memory".')),
    R('auth-p-storage', 'interview',
      l('¿Dónde guardarías un token de sesión en una app web: `localStorage` o una cookie? ¿Con qué atributos?', 'Where would you store a session token in a web app: `localStorage` or a cookie? With which attributes?'),
      l('En una **cookie** con **`HttpOnly`** (JavaScript no puede leerla, así que un XSS no la roba), **`Secure`** (solo por HTTPS) y **`SameSite`** (no se manda desde otros sitios, lo que ayuda contra CSRF). `localStorage` lo puede leer cualquier script de la página.', 'In a **cookie** with **`HttpOnly`** (JavaScript cannot read it, so XSS cannot steal it), **`Secure`** (HTTPS only) and **`SameSite`** (not sent from other sites, which helps against CSRF). Any script on the page can read `localStorage`.')),
    R('auth-p-oauth-why', 'interview',
      l('¿Por qué una app usa OAuth para acceder a tu calendario de Google en vez de pedirte tu contraseña de Google?', 'Why does an app use OAuth to access your Google calendar instead of asking for your Google password?'),
      l('Con tu contraseña la app podría hacer **todo** con tu cuenta y no podrías quitarle el acceso sin cambiarla. Con OAuth le das un **permiso limitado** (solo el calendario), la app **nunca ve tu contraseña** y puedes **revocar** ese permiso cuando quieras.', 'With your password the app could do **everything** with your account and you could not remove its access without changing it. With OAuth you give it **limited permission** (just the calendar), the app **never sees your password** and you can **revoke** that permission anytime.')),
  ],

  /* ---------------- Caché ---------------- */
  caching: [
    R('cache-p-hit', 'basic',
      l('¿Qué es un hit, un miss y la tasa de aciertos de una caché?', 'What are a hit, a miss and a cache\'s hit ratio?'),
      l('**Hit:** lo buscado ya estaba en la caché (rápido). **Miss:** no estaba y hubo que ir a la fuente (lento). **Tasa de aciertos:** qué porcentaje de las búsquedas son hits; mientras más alta, más ayuda la caché.', '**Hit:** what you looked for was already in the cache (fast). **Miss:** it was not and you had to go to the source (slow). **Hit ratio:** what percentage of lookups are hits; the higher, the more the cache helps.')),
    P('cache-p-ttl', 'medium', l('Un TTL simulado con un reloj que avanzamos a mano. ¿Qué imprime?', 'A simulated TTL with a clock we move by hand. What does it print?'),
      `ahora = 0                        # un reloj de mentira, en segundos
cache = {}
consultas_bd = 0

def obtener(clave, ttl=60):
    global consultas_bd
    if clave in cache and cache[clave][1] > ahora:   # hit y no ha expirado
        return cache[clave][0]
    consultas_bd += 1                                 # miss o expirado: ir a la BD
    cache[clave] = ("dato", ahora + ttl)
    return "dato"

obtener("a")        # segundo 0
ahora = 30
obtener("a")        # segundo 30
ahora = 90
obtener("a")        # segundo 90
print(consultas_bd)`,
      '2',
      l('En el segundo 0 es miss (expira en el 60). En el 30 sigue vigente: hit. En el 90 ya expiró: otro miss. Total: **2** consultas.', 'At second 0 it is a miss (it expires at 60). At 30 it is still valid: hit. At 90 it has expired: another miss. Total: **2** queries.'),
      l('Cada entrada guarda (valor, momento en que expira).', 'Each entry stores (value, moment it expires).')),
    C('cache-p-invalidate', 'medium',
      l('Al actualizar el nombre hay que invalidar la caché. ¿Qué línea falta? (con la correcta imprime `Ana María`)', 'On updating the name the cache must be invalidated. Which line is missing? (the right one prints `Ana María`)'),
      `bd = {7: "Ana"}
cache = {}

def leer(id):
    if id not in cache:
        cache[id] = bd[id]
    return cache[id]

def actualizar(id, nombre):
    bd[id] = nombre
    ____

leer(7)                       # ahora "Ana" está en la caché
actualizar(7, "Ana María")
print(leer(7))`,
      ['cache[id] = bd[id - 1]', 'cache.pop(id, None)', 'bd.pop(id, None)', 'cache.clear(id)'],
      1,
      l('`cache.pop(id, None)` **borra** la copia vieja: la siguiente lectura es un miss y trae "Ana María" de la base. Borrar de la base perdería el dato, y `clear` no recibe argumentos.', '`cache.pop(id, None)` **deletes** the old copy: the next read is a miss and brings "Ana María" from the database. Deleting from the database would lose the data, and `clear` takes no arguments.'),
      l('Sin esa línea, `leer(7)` seguiría devolviendo "Ana" desde la caché.', 'Without that line, `leer(7)` would keep returning "Ana" from the cache.')),
    P('cache-p-lru', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `${LRU}
c = LRU(3)
for clave in ["a", "b", "c"]:
    c.put(clave, 0)
c.get("a")
c.get("b")
c.put("d", 0)
print(list(c.datos))`,
      "['a', 'b', 'd']",
      l('Después de leer "a" y "b", la menos usada es **"c"**, así que sale al entrar "d": quedan **[\'a\', \'b\', \'d\']**.', 'After reading "a" and "b", the least used is **"c"**, so it leaves when "d" comes in: **[\'a\', \'b\', \'d\']** remain.'),
      l('Cada `get` manda la clave al final; `put` saca la del principio cuando se pasa de la capacidad.', 'Each `get` sends the key to the end; `put` removes the first one when over capacity.')),
    R('cache-p-cdn', 'basic',
      l('¿Qué es una CDN y qué tipo de contenido conviene poner en ella?', 'What is a CDN and what kind of content should go on it?'),
      l('Una red de servidores repartidos por el mundo que guardan **copias cerca del usuario**. Conviene para contenido **estático** que muchos piden igual: imágenes, videos, CSS y JavaScript. Así viajan desde una ciudad cercana y se le quita carga a tu servidor.', 'A network of servers spread around the world keeping **copies close to the user**. It fits **static** content many people request the same way: images, videos, CSS and JavaScript. That way they travel from a nearby city and your server is relieved.')),
    R('cache-p-headers', 'medium',
      l('¿Qué hacen `Cache-Control: max-age=600`, `Cache-Control: no-store` y una respuesta `304 Not Modified`?', 'What do `Cache-Control: max-age=600`, `Cache-Control: no-store` and a `304 Not Modified` response do?'),
      l('`max-age=600`: el navegador puede usar su copia **10 minutos** sin preguntar. `no-store`: **no guardar nada** (datos sensibles). `304`: el navegador preguntó si cambió (con el `ETag` en `If-None-Match`) y el servidor responde que **no**, sin body: sigue usando su copia.', '`max-age=600`: the browser may use its copy for **10 minutes** without asking. `no-store`: **store nothing** (sensitive data). `304`: the browser asked whether it changed (with the `ETag` in `If-None-Match`) and the server answers **no**, with no body: keep using your copy.')),
    R('cache-p-strategies', 'interview',
      l('¿En qué se diferencian cache-aside y write-through? ¿Qué ventaja y qué costo tiene cada una?', 'How do cache-aside and write-through differ? What advantage and cost does each have?'),
      l('**Cache-aside:** la app llena la caché **al leer** (en cada miss). Solo guarda lo que se pide, pero el dato puede quedar viejo hasta que expire o se invalide. **Write-through:** cada **escritura** actualiza caché y base a la vez. La caché siempre está al día, pero cada escritura es un poco más lenta y puedes guardar datos que nadie lee.', '**Cache-aside:** the app fills the cache **on read** (on each miss). It only stores what is requested, but data can go stale until it expires or is invalidated. **Write-through:** every **write** updates cache and database together. The cache is always current, but each write is a bit slower and you may store data nobody reads.')),
    R('cache-p-lru-impl', 'interview',
      l('Te piden implementar una caché LRU con `get` y `put` en O(1) sin `OrderedDict`. ¿Qué estructuras usas?', 'You are asked to implement an LRU cache with O(1) `get` and `put` without `OrderedDict`. Which structures do you use?'),
      l('Un **hash map** (clave → nodo) para encontrar cualquier clave en O(1), y una **lista doblemente enlazada** que mantiene el orden de uso: al usar una clave mueves su nodo al frente (O(1) porque tienes el nodo), y al llenarse quitas el del final.', 'A **hash map** (key → node) to find any key in O(1), and a **doubly linked list** keeping the usage order: when a key is used you move its node to the front (O(1) because you have the node), and when full you remove the one at the end.')),
  ],

  /* ---------------- Seguridad web ---------------- */
  'web-security': [
    P('sec-p-escape', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import html

print(html.escape("<b>hola</b> & adiós"))`,
      '&lt;b&gt;hola&lt;/b&gt; &amp; adiós',
      l('`html.escape` cambia `<` por `&lt;`, `>` por `&gt;` y `&` por `&amp;`. El navegador muestra el texto tal cual en vez de interpretarlo como HTML.', '`html.escape` turns `<` into `&lt;`, `>` into `&gt;` and `&` into `&amp;`. The browser shows the text as is instead of interpreting it as HTML.'),
      l('Escapar convierte cada carácter especial de HTML en su versión de texto.', 'Escaping turns each special HTML character into its text version.')),
    C('sec-p-param', 'basic',
      l('¿Cuál es la forma **segura** de buscar al usuario? (con la correcta imprime `[]`)', 'Which is the **safe** way to look up the user? (the right one prints `[]`)'),
      `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE usuarios (email TEXT)")
db.execute("INSERT INTO usuarios VALUES ('ana@x.com')")

email = "x' OR '1'='1"
filas = ____
print(filas)`,
      ['db.execute(f"SELECT email FROM usuarios WHERE email = \'{email}\'").fetchall()', 'db.execute("SELECT email FROM usuarios WHERE email = ?", (email,)).fetchall()', 'db.execute("SELECT email FROM usuarios WHERE email = \'" + email + "\'").fetchall()', 'db.execute("SELECT email FROM usuarios").fetchall()'],
      1,
      l('Con el marcador `?` la entrada es solo un dato: no hay ningún usuario con ese email raro, **[]**. Pegarla con f-string o con `+` deja que el `OR \'1\'=\'1\'` devuelva a todos.', 'With the `?` placeholder the input is just data: no user has that odd email, **[]**. Pasting it with an f-string or `+` lets the `OR \'1\'=\'1\'` return everyone.'),
      l('Las dos formas de "pegar" el texto son igual de peligrosas.', 'Both ways of "pasting" the text are equally dangerous.')),
    R('sec-p-csrf', 'basic',
      l('¿Cómo funciona un ataque CSRF y cómo se previene?', 'How does a CSRF attack work and how is it prevented?'),
      l('Una página maliciosa hace que **tu navegador mande una petición** a un sitio donde tienes sesión, y el navegador **incluye tus cookies** solo, así que el sitio cree que fuiste tú. Se previene con un **token CSRF** en cada formulario, cookies **`SameSite`** y no cambiando datos con GET.', 'A malicious page makes **your browser send a request** to a site where you have a session, and the browser **includes your cookies** automatically, so the site thinks it was you. It is prevented with a **CSRF token** in each form, **`SameSite`** cookies and not changing data with GET.')),
    P('sec-p-csrf-token', 'medium', l('Validar un token CSRF. ¿Qué imprime?', 'Validating a CSRF token. What does it print?'),
      `import hmac
import secrets

token_de_la_sesion = secrets.token_hex(16)     # valor aleatorio que el servidor puso en el formulario

def aceptar(token_recibido):
    return hmac.compare_digest(token_recibido, token_de_la_sesion)

print(aceptar(token_de_la_sesion), aceptar("adivinado"))`,
      'True False',
      l('Tu formulario trae el token correcto: **True**. La página del atacante no puede leer ese valor, así que manda otro: **False**, y la petición se rechaza.', 'Your form carries the right token: **True**. The attacker\'s page cannot read that value, so it sends another: **False**, and the request is rejected.'),
      l('`secrets.token_hex(16)` genera un valor aleatorio imposible de adivinar.', '`secrets.token_hex(16)` generates an unguessable random value.')),
    R('sec-p-cors', 'medium',
      l('Tu frontend en `https://app.com` llama a tu API en `https://api.com` y el navegador bloquea la respuesta. ¿Qué pasa y cómo se arregla?', 'Your frontend at `https://app.com` calls your API at `https://api.com` and the browser blocks the response. What is happening and how is it fixed?'),
      l('Son **orígenes distintos** y la política del mismo origen impide que el JavaScript lea la respuesta. La **API** debe permitirlo con **CORS**: responder con `Access-Control-Allow-Origin: https://app.com` (y atender el *preflight* `OPTIONS` si hace falta). No es un problema de seguridad del servidor: es una protección del navegador.', 'They are **different origins** and the same-origin policy stops the JavaScript from reading the response. The **API** must allow it with **CORS**: answering with `Access-Control-Allow-Origin: https://app.com` (and handling the `OPTIONS` *preflight* if needed). It is not a server security problem: it is a browser protection.')),
    R('sec-p-innerhtml', 'medium',
      l('En JavaScript, ¿por qué es peligroso `elemento.innerHTML = comentario` con un comentario del usuario, y qué usas en su lugar?', 'In JavaScript, why is `element.innerHTML = comment` dangerous with a user comment, and what do you use instead?'),
      l('`innerHTML` **interpreta** el texto como HTML: si el comentario trae un `<script>` o un `<img onerror=…>`, ese código se ejecuta (**XSS**). Usa `elemento.textContent = comentario`, que lo muestra como texto, o un framework que escape por defecto.', '`innerHTML` **interprets** the text as HTML: if the comment carries a `<script>` or an `<img onerror=…>`, that code runs (**XSS**). Use `element.textContent = comment`, which shows it as text, or a framework that escapes by default.')),
    R('sec-p-secrets', 'interview',
      l('Un compañero subió al repositorio un archivo con la contraseña de la base de datos. Ya lo borró en el siguiente commit. ¿Basta con eso?', 'A teammate pushed a file with the database password to the repository. They deleted it in the next commit. Is that enough?'),
      l('**No:** el secreto sigue en el **historial** de git y cualquiera con acceso lo puede ver. Hay que **cambiar (rotar) esa contraseña** de inmediato y, a partir de ahí, guardar los secretos en **variables de entorno** o un gestor de secretos, con el archivo en el `.gitignore`.', '**No:** the secret is still in the git **history** and anyone with access can see it. You must **change (rotate) that password** immediately and, from then on, keep secrets in **environment variables** or a secrets manager, with the file in `.gitignore`.')),
    R('sec-p-owasp', 'interview',
      l('Te preguntan: "¿Qué harías para proteger el login de tu aplicación?". Da una respuesta completa pero corta.', 'You are asked: "What would you do to protect your application\'s login?". Give a complete but short answer.'),
      l('Contraseñas con **hash lento y sal** (Argon2id); **límite de intentos** contra fuerza bruta; **MFA** opcional u obligatorio; todo por **HTTPS**; sesión en cookie **`HttpOnly`, `Secure`, `SameSite`** con expiración; consultas **parametrizadas**; y mensajes de error que no revelen si el email existe.', 'Passwords with a **slow salted hash** (Argon2id); **rate limiting** against brute force; optional or required **MFA**; everything over **HTTPS**; session in an **`HttpOnly`, `Secure`, `SameSite`** cookie with expiration; **parameterized** queries; and error messages that do not reveal whether the email exists.')),
  ],

  /* ---------------- Introducción a system design ---------------- */
  'system-design-intro': [
    R('sys-p-requirements', 'basic',
      l('Te piden "diseña Instagram". ¿Qué preguntas haces antes de dibujar nada?', 'You are asked to "design Instagram". Which questions do you ask before drawing anything?'),
      l('**Funcionales:** ¿qué partes? (subir fotos, el feed, seguir, likes). **No funcionales:** ¿cuántos usuarios y cuántas fotos al día?, ¿qué tan rápido debe cargar el feed?, ¿se puede ver un like con retraso (consistencia eventual)?, ¿qué tanto puede fallar? Con eso decides el tamaño y las prioridades.', '**Functional:** which parts? (uploading photos, the feed, following, likes). **Non-functional:** how many users and photos a day?, how fast must the feed load?, can a like show up late (eventual consistency)?, how much downtime is acceptable? That tells you the size and priorities.')),
    P('sys-p-storage', 'basic', l('Estima el almacenamiento de fotos. ¿Qué imprime?', 'Estimate photo storage. What does it print?'),
      `fotos_al_dia = 1_000_000
mb_por_foto = 2
dias = 365

tb_al_anio = fotos_al_dia * mb_por_foto * dias / 1_000_000
print(tb_al_anio)`,
      '730.0',
      l('Un millón de fotos de 2 MB son 2 TB al día; por 365 días: **730 TB** al año. Esa cifra te dice que las fotos van en un almacenamiento de objetos con CDN, no en la base de datos.', 'A million 2 MB photos are 2 TB a day; times 365 days: **730 TB** a year. That number tells you photos go in object storage with a CDN, not in the database.'),
      l('1,000,000 MB = 1 TB.', '1,000,000 MB = 1 TB.')),
    O('sys-p-path', 'basic',
      l('Ordena el camino de una petición en un diseño típico.', 'Order a request\'s path in a typical design.'),
      [
        l('El usuario abre la app y DNS resuelve el dominio.', 'The user opens the app and DNS resolves the domain.'),
        l('El balanceador de carga recibe la petición.', 'The load balancer receives the request.'),
        l('La manda a uno de los servidores de la aplicación.', 'It sends it to one of the application servers.'),
        l('El servidor busca primero en la caché.', 'The server looks in the cache first.'),
        l('Si es un miss, consulta la base de datos.', 'On a miss, it queries the database.'),
      ],
      l('La caché va antes de la base de datos para que la mayoría de las lecturas no lleguen hasta ella.', 'The cache goes before the database so most reads never reach it.')),
    P('sys-p-base62', 'medium', l('El código corto de un acortador de URLs. ¿Qué imprime?', 'A URL shortener\'s short code. What does it print?'),
      `ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def codigo_corto(n):
    if n == 0:
        return ALFABETO[0]
    res = ""
    while n > 0:
        res = ALFABETO[n % 62] + res
        n //= 62
    return res

print(codigo_corto(61), codigo_corto(62), codigo_corto(3844))`,
      'Z 10 100',
      l('61 es el último símbolo: **Z**. 62 es "1 vez 62 y 0": **10**, como el 10 en base decimal. 3844 = 62²: **100**. Es contar en base 62.', '61 is the last symbol: **Z**. 62 is "once 62 and 0": **10**, like 10 in decimal. 3844 = 62²: **100**. It is counting in base 62.'),
      l('Cada vuelta toma el residuo entre 62 (el último símbolo) y divide entre 62.', 'Each iteration takes the remainder by 62 (the last symbol) and divides by 62.')),
    R('sys-p-queue', 'medium',
      l('Al subir un video, procesarlo tarda 2 minutos. ¿Cómo diseñas eso para que el usuario no espere?', 'After uploading a video, processing it takes 2 minutes. How do you design that so the user does not wait?'),
      l('El servidor guarda el video, deja un **mensaje en una cola** ("procesar video 42") y responde de inmediato ("lo estamos procesando"). Unos **workers** toman los mensajes de la cola y procesan en segundo plano; al terminar, actualizan el estado o avisan al usuario. Si llegan muchos videos, agregas más workers.', 'The server stores the video, drops a **message in a queue** ("process video 42") and answers right away ("we are processing it"). **Workers** take messages from the queue and process them in the background; when done, they update the status or notify the user. If many videos arrive, you add more workers.')),
    R('sys-p-replicas-shard', 'medium',
      l('¿Cuándo agregas réplicas de lectura y cuándo haces sharding?', 'When do you add read replicas and when do you shard?'),
      l('**Réplicas** cuando el problema son las **lecturas** (muchas más que escrituras): copias que las reparten y dan respaldo. **Sharding** cuando los **datos o las escrituras** ya no caben en una sola base: repartes los datos con una clave de partición. El sharding es más complejo, así que va después.', '**Replicas** when the problem is **reads** (far more than writes): copies that share them and provide backup. **Sharding** when the **data or writes** no longer fit in a single database: you split the data with a partition key. Sharding is more complex, so it comes later.')),
    R('sys-p-tradeoffs', 'interview',
      l('Menciona tres trade-offs que conviene nombrar en una entrevista de system design.', 'Name three trade-offs worth mentioning in a system design interview.'),
      l('**Consistencia vs disponibilidad** cuando falla la red (CAP). **Latencia vs costo**: más caché y servidores son más rápidos pero más caros. **Simplicidad vs escala**: empezar con una sola base de datos y explicar cuándo cambiarías. También: caché (velocidad) vs datos obsoletos.', '**Consistency vs availability** when the network fails (CAP). **Latency vs cost**: more cache and servers are faster but pricier. **Simplicity vs scale**: start with a single database and explain when you would change. Also: cache (speed) vs stale data.')),
    R('sys-p-shortener', 'interview',
      l('Resume en cinco pasos el diseño de un acortador de URLs.', 'Summarize the design of a URL shortener in five steps.'),
      l('1) **Requisitos:** acortar y redirigir; muchísimas más lecturas que escrituras. 2) **Estimación:** ~1 escritura y ~116 lecturas por segundo con 100k URLs al día. 3) **API y datos:** `POST /urls` y `GET /{codigo}` → 301/302; tabla `codigo → url_larga`. 4) **Diseño:** balanceador → servidores sin estado → caché → base de datos; códigos en base 62 a partir de un id. 5) **Escalar:** caché y réplicas para lecturas; sharding por código si crece mucho.', '1) **Requirements:** shorten and redirect; far more reads than writes. 2) **Estimate:** ~1 write and ~116 reads per second with 100k URLs a day. 3) **API and data:** `POST /urls` and `GET /{code}` → 301/302; table `code → long_url`. 4) **Design:** load balancer → stateless servers → cache → database; base-62 codes from an id. 5) **Scaling:** cache and replicas for reads; sharding by code if it grows a lot.')),
  ],
};
