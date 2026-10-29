import type { DesignCase, L } from '../types';

const l = (es: string, en: string): L => ({ es, en });

/** Marco general que se aplica a cualquier caso */
export const DESIGN_FRAMEWORK: { title: L; desc: L }[] = [
  { title: l('1. Requisitos', '1. Requirements'), desc: l('Funcionales (qué hace) y no funcionales (escala, latencia, disponibilidad). Pregunta antes de diseñar.', 'Functional (what it does) and non-functional (scale, latency, availability). Ask before designing.') },
  { title: l('2. Estimaciones', '2. Estimates'), desc: l('Usuarios, peticiones por segundo, lecturas vs escrituras, almacenamiento. Números aproximados bastan.', 'Users, requests per second, reads vs writes, storage. Rough numbers are enough.') },
  { title: l('3. API y datos', '3. API & data'), desc: l('Endpoints principales y modelo de datos (tablas, claves).', 'Main endpoints and data model (tables, keys).') },
  { title: l('4. Diseño de alto nivel', '4. High-level design'), desc: l('Cliente → balanceador → servidores → BD/caché. Dibuja el flujo de una petición.', 'Client → load balancer → servers → DB/cache. Draw the flow of a request.') },
  { title: l('5. Escalar y trade-offs', '5. Scale & trade-offs'), desc: l('Cuellos de botella, caché, réplicas, colas, consistencia vs disponibilidad.', 'Bottlenecks, caching, replicas, queues, consistency vs availability.') },
];

export const DESIGN_CASES: DesignCase[] = [
  {
    id: 'url-shortener',
    title: l('Acortador de URLs', 'URL shortener'),
    prompt: l('Diseña un servicio como bit.ly: recibe una URL larga y devuelve un código corto que redirige a ella.', 'Design a service like bit.ly: it takes a long URL and returns a short code that redirects to it.'),
    steps: [
      { title: l('Requisitos', 'Requirements'), points: [l('Crear URL corta; redirigir al visitarla; (opcional) expiración y estadísticas.', 'Create short URL; redirect on visit; (optional) expiration and stats.'), l('Muchas más lecturas que escrituras (≈100:1); redirección rápida.', 'Far more reads than writes (≈100:1); fast redirects.')] },
      { title: l('API', 'API'), points: [l('`POST /urls {longUrl}` → `{code}`', '`POST /urls {longUrl}` → `{code}`'), l('`GET /{code}` → 301/302 a la URL larga', '`GET /{code}` → 301/302 to the long URL')] },
      { title: l('Datos', 'Data'), points: [l('Tabla `urls(code PK, long_url, created_at, user_id)`.', 'Table `urls(code PK, long_url, created_at, user_id)`.'), l('Código: contador autoincremental en Base62 (7 caracteres ≈ 3.5 billones) o hash + manejo de colisiones.', 'Code: auto-increment counter in Base62 (7 chars ≈ 3.5 trillion) or hash + collision handling.')] },
      { title: l('Escalado', 'Scaling'), points: [l('Caché (Redis) para códigos populares.', 'Cache (Redis) for popular codes.'), l('Réplicas de lectura de la BD; servidores sin estado detrás de un balanceador.', 'DB read replicas; stateless servers behind a load balancer.')] },
    ],
    checklist: [l('¿Aclaré requisitos y proporción lecturas/escrituras?', 'Did I clarify requirements and read/write ratio?'), l('¿Expliqué cómo genero códigos únicos?', 'Did I explain how I generate unique codes?'), l('¿Mencioné caché?', 'Did I mention caching?'), l('¿Distinguí 301 vs 302?', 'Did I distinguish 301 vs 302?')],
  },
  {
    id: 'page-counter',
    title: l('Contador de visitas', 'Page view counter'),
    prompt: l('Diseña un sistema que cuente las visitas de cada página de un sitio con mucho tráfico y las muestre casi en tiempo real.', 'Design a system that counts views for each page of a high-traffic site and shows them in near real time.'),
    steps: [
      { title: l('Requisitos', 'Requirements'), points: [l('Registrar visitas; consultar el total por página.', 'Record views; query total per page.'), l('Muchas escrituras; se tolera un pequeño retraso en el conteo.', 'Write-heavy; a small delay in the count is acceptable.')] },
      { title: l('Diseño', 'Design'), points: [l('No hacer `UPDATE count = count + 1` en la BD por cada visita (contención).', 'Avoid `UPDATE count = count + 1` in the DB per view (contention).'), l('Usar `INCR` atómico en Redis y volcar periódicamente a la BD (batching).', 'Use atomic `INCR` in Redis and flush periodically to the DB (batching).'), l('Alternativa: enviar eventos a una cola (Kafka/SQS) y agregarlos con un worker.', 'Alternative: send events to a queue (Kafka/SQS) and aggregate them with a worker.')] },
      { title: l('Trade-offs', 'Trade-offs'), points: [l('Consistencia eventual vs exacta; qué pasa si Redis cae (persistencia/AOF).', 'Eventual vs exact consistency; what if Redis goes down (persistence/AOF).')] },
    ],
    checklist: [l('¿Identifiqué el problema de contención en escrituras?', 'Did I identify the write contention problem?'), l('¿Propuse batching o una cola?', 'Did I propose batching or a queue?'), l('¿Hablé de consistencia eventual?', 'Did I talk about eventual consistency?')],
  },
  {
    id: 'notes-app',
    title: l('App de notas (tipo Google Keep)', 'Notes app (like Google Keep)'),
    prompt: l('Diseña el backend de una app de notas con usuarios, notas con etiquetas y sincronización entre dispositivos.', 'Design the backend of a notes app with users, tagged notes and sync across devices.'),
    steps: [
      { title: l('API', 'API'), points: [l('CRUD REST: `GET/POST /notes`, `PATCH/DELETE /notes/:id`, filtrado por etiqueta y búsqueda.', 'REST CRUD: `GET/POST /notes`, `PATCH/DELETE /notes/:id`, filter by tag and search.'), l('Autenticación con sesiones o JWT.', 'Authentication with sessions or JWT.')] },
      { title: l('Datos', 'Data'), points: [l('`users`, `notes(id, user_id, title, body, updated_at)`, `tags`, `note_tags` (muchos a muchos).', '`users`, `notes(id, user_id, title, body, updated_at)`, `tags`, `note_tags` (many-to-many).'), l('Índice en `(user_id, updated_at)`.', 'Index on `(user_id, updated_at)`.')] },
      { title: l('Sincronización', 'Sync'), points: [l('El cliente pide cambios desde `updated_at > última_sync`.', 'Client fetches changes with `updated_at > last_sync`.'), l('Conflictos: last-write-wins o versionado.', 'Conflicts: last-write-wins or versioning.')] },
    ],
    checklist: [l('¿Modelé la relación muchos a muchos?', 'Did I model the many-to-many relation?'), l('¿Pensé en la sincronización y los conflictos?', 'Did I think about sync and conflicts?'), l('¿Agregué índices adecuados?', 'Did I add appropriate indexes?')],
  },
  {
    id: 'rate-limiter',
    title: l('Rate limiter', 'Rate limiter'),
    prompt: l('Diseña un limitador que permita como máximo N peticiones por minuto por usuario en una API.', 'Design a limiter that allows at most N requests per minute per user on an API.'),
    steps: [
      { title: l('Algoritmos', 'Algorithms'), points: [l('**Ventana fija**: contador por minuto; simple, pero permite picos en los bordes.', '**Fixed window**: counter per minute; simple but allows bursts at the edges.'), l('**Ventana deslizante**: más precisa.', '**Sliding window**: more accurate.'), l('**Token bucket**: permite ráfagas controladas; el más común.', '**Token bucket**: allows controlled bursts; the most common.')] },
      { title: l('Implementación', 'Implementation'), points: [l('Middleware en el API gateway; estado en Redis (`INCR` + `EXPIRE`) para compartir entre servidores.', 'Middleware at the API gateway; state in Redis (`INCR` + `EXPIRE`) shared across servers.'), l('Responder 429 Too Many Requests con el header `Retry-After`.', 'Respond 429 Too Many Requests with a `Retry-After` header.')] },
    ],
    checklist: [l('¿Comparé al menos dos algoritmos?', 'Did I compare at least two algorithms?'), l('¿Dónde vive el estado con varios servidores?', 'Where does state live with multiple servers?'), l('¿Qué código HTTP devuelvo?', 'Which HTTP code do I return?')],
  },
  {
    id: 'news-feed',
    title: l('Feed de noticias simple', 'Simple news feed'),
    prompt: l('Diseña el feed de una red social: los usuarios siguen a otros y ven sus publicaciones recientes.', 'Design a social network feed: users follow others and see their recent posts.'),
    steps: [
      { title: l('Datos', 'Data'), points: [l('`users`, `follows(follower_id, followee_id)`, `posts(id, user_id, content, created_at)`.', '`users`, `follows(follower_id, followee_id)`, `posts(id, user_id, content, created_at)`.')] },
      { title: l('Generar el feed', 'Building the feed'), points: [l('**Pull** (al leer): consulta los posts de los que sigues y ordena. Simple, pero lento con muchos seguidos.', '**Pull** (on read): query posts from followees and sort. Simple but slow with many followees.'), l('**Push** (al escribir): al publicar, insertas el post en el feed precalculado de cada seguidor. Lectura rápida, pero costoso para celebridades.', '**Push** (on write): when posting, insert into each follower\'s precomputed feed. Fast reads but expensive for celebrities.'), l('Híbrido: push para usuarios normales y pull para cuentas con millones de seguidores.', 'Hybrid: push for normal users, pull for accounts with millions of followers.')] },
      { title: l('Extras', 'Extras'), points: [l('Paginación por cursor; caché del feed; las imágenes van a un CDN.', 'Cursor pagination; feed cache; images on a CDN.')] },
    ],
    checklist: [l('¿Expliqué push vs pull?', 'Did I explain push vs pull?'), l('¿Consideré el caso de las celebridades?', 'Did I consider the celebrity case?'), l('¿Paginación?', 'Pagination?')],
  },
  {
    id: 'chat',
    title: l('Chat uno a uno', '1:1 chat'),
    prompt: l('Diseña un chat básico entre dos usuarios con mensajes en tiempo real e historial.', 'Design a basic chat between two users with real-time messages and history.'),
    steps: [
      { title: l('Comunicación', 'Communication'), points: [l('**WebSockets** para tiempo real (conexión persistente y bidireccional); polling como alternativa simple.', '**WebSockets** for real time (persistent, bidirectional connection); polling as a simple fallback.')] },
      { title: l('Datos', 'Data'), points: [l('`conversations`, `messages(id, conversation_id, sender_id, body, created_at)`, índice en `(conversation_id, created_at)`.', '`conversations`, `messages(id, conversation_id, sender_id, body, created_at)`, index on `(conversation_id, created_at)`.')] },
      { title: l('Escalado', 'Scaling'), points: [l('Varios servidores de WebSocket: usa pub/sub (Redis) para entregar mensajes al servidor donde está conectado el destinatario.', 'Multiple WebSocket servers: use pub/sub (Redis) to route messages to the server where the recipient is connected.'), l('Usuario desconectado: guardar el mensaje y enviar una notificación push.', 'Offline user: store the message and send a push notification.')] },
    ],
    checklist: [l('¿Justifiqué WebSockets?', 'Did I justify WebSockets?'), l('¿Cómo entrego mensajes entre servidores?', 'How do messages travel between servers?'), l('¿Qué pasa si el usuario está offline?', 'What if the user is offline?')],
  },
];
