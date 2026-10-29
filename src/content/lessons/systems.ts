import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

export const SYSTEMS_LESSONS: Lesson[] = [
  {
    id: 'processes-threads',
    track: 'systems',
    title: l('Procesos, hilos y memoria', 'Processes, threads and memory'),
    summary: l('Cómo el sistema operativo ejecuta tus programas.', 'How the operating system runs your programs.'),
    minutes: 12,
    blocks: [
      md(
        `## Proceso
Un programa en ejecución con **su propio espacio de memoria**, archivos abiertos y al menos un hilo. Si uno falla, no tumba a los demás.

## Hilo
Una unidad de ejecución **dentro** de un proceso. Los hilos de un mismo proceso **comparten memoria**, así que comunicarse es barato pero arriesgado (condiciones de carrera).

## Memoria de un proceso
- **Stack**: variables locales y marcos de llamada. Rápida, automática y limitada.
- **Heap**: objetos dinámicos. Se libera manualmente (C) o con el *garbage collector* (Java, Python, JS).

## Concurrencia vs paralelismo
**Concurrencia**: gestionar varias tareas a la vez (pueden turnarse en un solo núcleo). **Paralelismo**: ejecutarlas literalmente al mismo tiempo en varios núcleos.`,
        `## Process
A running program with **its own memory space**, open files and at least one thread. If one crashes, it does not take the others down.

## Thread
A unit of execution **inside** a process. Threads of the same process **share memory**, so communicating is cheap but risky (race conditions).

## Process memory
- **Stack**: local variables and call frames. Fast, automatic and limited.
- **Heap**: dynamic objects. Freed manually (C) or by the *garbage collector* (Java, Python, JS).

## Concurrency vs parallelism
**Concurrency**: managing several tasks at once (they may take turns on one core). **Parallelism**: running them literally at the same time on several cores.`,
      ),
      tip('En CPython (el Python estándar), el GIL hace que solo un hilo ejecute bytecode a la vez; se libera durante la E/S. Por eso se usan hilos o `asyncio` para tareas de E/S y `multiprocessing` para tareas de CPU. Desde Python 3.13 existe una versión opcional sin GIL (*free-threaded*, PEP 703).', 'In CPython (standard Python), the GIL lets only one thread execute bytecode at a time; it is released during I/O. That is why threads or `asyncio` are used for I/O-bound work and `multiprocessing` for CPU-bound work. Since Python 3.13 there is an optional build without the GIL (*free-threaded*, PEP 703).'),
    ],
    quiz: [
      q('Los hilos de un mismo proceso…', 'Threads of the same process…', [['Tienen memoria separada', 'Have separate memory'], ['Comparten memoria', 'Share memory'], ['No pueden comunicarse', 'Cannot communicate'], ['Siempre corren en paralelo', 'Always run in parallel']], 1, 'Comparten el heap del proceso.', 'They share the process heap.'),
      q('Concurrencia vs paralelismo', 'Concurrency vs parallelism', [['Son lo mismo', 'They are the same'], ['Paralelismo requiere varios núcleos ejecutando a la vez', 'Parallelism requires several cores running at once'], ['Concurrencia requiere varios núcleos', 'Concurrency requires several cores'], ['Ninguna existe en Python', 'Neither exists in Python']], 1,
        'La concurrencia puede ser intercalada en un solo núcleo.', 'Concurrency can be interleaved on one core.'),
    ],
    concepts: [
      concept('Concurrencia vs paralelismo', 'Concurrency vs parallelism', 'Concurrencia: gestionar varias tareas intercalándolas. Paralelismo: ejecutarlas simultáneamente en varios núcleos.', 'Concurrency: managing several tasks by interleaving. Parallelism: running them simultaneously on several cores.'),
    ],
  },
  {
    id: 'concurrency',
    track: 'systems',
    title: l('Concurrencia: carreras, locks y deadlocks', 'Concurrency: races, locks and deadlocks'),
    summary: l('Los problemas clásicos al compartir datos entre hilos.', 'The classic problems of sharing data between threads.'),
    minutes: 14,
    blocks: [
      md(
        `## Condición de carrera
\`contador += 1\` en realidad es **leer → sumar → escribir**. Si dos hilos lo intercalan, se pierde un incremento.

## Sincronización
- **Mutex / lock**: solo un hilo entra a la *sección crítica* a la vez.
- **Semáforo**: permite hasta N hilos.
- **Operaciones atómicas** y estructuras thread-safe (colas).

## Deadlock
Dos o más hilos se esperan mutuamente para siempre. Requiere 4 condiciones (Coffman): **exclusión mutua**, **retener y esperar**, **sin expropiación** y **espera circular**. La prevención más práctica: **adquirir los locks siempre en el mismo orden**.`,
        `## Race condition
\`counter += 1\` is really **read → add → write**. If two threads interleave it, an increment is lost.

## Synchronization
- **Mutex / lock**: only one thread enters the *critical section* at a time.
- **Semaphore**: allows up to N threads.
- **Atomic operations** and thread-safe structures (queues).

## Deadlock
Two or more threads wait on each other forever. It needs 4 conditions (Coffman): **mutual exclusion**, **hold and wait**, **no preemption** and **circular wait**. The most practical prevention: **always acquire locks in the same order**.`,
      ),
      code(`import threading

contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    for _ in range(100_000):
        with lock:            # sección crítica
            contador += 1

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
print(contador)  # 400000 siempre (sin el lock podría ser menor)`),
      interview('Si te preguntan por concurrencia en un sistema web, menciona también la concurrencia en la **base de datos**: transacciones, niveles de aislamiento y bloqueo optimista (con un número de versión).', 'If asked about concurrency in a web system, also mention **database** concurrency: transactions, isolation levels and optimistic locking (with a version number).'),
    ],
    quiz: [
      q('La forma más práctica de evitar deadlocks es…', 'The most practical way to avoid deadlocks is…', [['Usar más hilos', 'Use more threads'], ['Adquirir locks siempre en el mismo orden', 'Always acquire locks in the same order'], ['No usar locks nunca', 'Never use locks'], ['Aumentar la memoria', 'Increase memory']], 1, 'Rompe la espera circular.', 'It breaks circular wait.'),
    ],
    concepts: [
      concept('Las 4 condiciones de Coffman', 'The 4 Coffman conditions', 'Exclusión mutua, retener y esperar, sin expropiación y espera circular.', 'Mutual exclusion, hold and wait, no preemption and circular wait.'),
      concept('¿Por qué `x += 1` no es seguro entre hilos?', 'Why is `x += 1` not thread-safe?', 'Son tres pasos (leer, sumar, escribir) que otro hilo puede intercalar, y se pierden actualizaciones.', 'It is three steps (read, add, write) another thread can interleave, losing updates.'),
    ],
  },
  {
    id: 'networking',
    track: 'systems',
    title: l('Redes: TCP/IP, DNS y más', 'Networking: TCP/IP, DNS and more'),
    summary: l('Las capas de red que usas cada día.', 'The network layers you use every day.'),
    minutes: 12,
    blocks: [
      md(
        `## Modelo simplificado (TCP/IP)
1. **Aplicación**: HTTP, DNS, SMTP, WebSocket.
2. **Transporte**: TCP / UDP (puertos).
3. **Red**: IP (direcciones y enrutamiento).
4. **Enlace**: Ethernet, Wi-Fi.

## TCP vs UDP
| TCP | UDP |
|---|---|
| Orientado a conexión (*3-way handshake*) | Sin conexión |
| Confiable y ordenado (retransmite) | Sin garantías |
| Web, APIs, correo | Video en vivo, juegos, DNS |

## Otros conceptos
- **Puerto**: identifica el proceso (80 HTTP, 443 HTTPS, 5432 Postgres).
- **Balanceador de carga**: reparte el tráfico entre servidores.
- **WebSocket**: conexión bidireccional persistente sobre TCP.`,
        `## Simplified model (TCP/IP)
1. **Application**: HTTP, DNS, SMTP, WebSocket.
2. **Transport**: TCP / UDP (ports).
3. **Network**: IP (addresses and routing).
4. **Link**: Ethernet, Wi-Fi.

## TCP vs UDP
| TCP | UDP |
|---|---|
| Connection-oriented (*3-way handshake*) | Connectionless |
| Reliable and ordered (retransmits) | No guarantees |
| Web, APIs, email | Live video, games, DNS |

## Other concepts
- **Port**: identifies the process (80 HTTP, 443 HTTPS, 5432 Postgres).
- **Load balancer**: spreads traffic across servers.
- **WebSocket**: persistent bidirectional connection over TCP.`,
      ),
    ],
    quiz: [
      q('¿Qué protocolo usarías para videollamadas en tiempo real?', 'Which protocol would you use for real-time video calls?', [['TCP', 'TCP'], ['UDP', 'UDP'], ['FTP', 'FTP'], ['SMTP', 'SMTP']], 1, 'Prefiere baja latencia a retransmitir.', 'It prefers low latency over retransmission.'),
      q('El handshake de TCP tiene…', 'TCP\'s handshake has…', [['1 paso', '1 step'], ['2 pasos', '2 steps'], ['3 pasos (SYN, SYN-ACK, ACK)', '3 steps (SYN, SYN-ACK, ACK)'], ['4 pasos', '4 steps']], 2, 'Three-way handshake.', 'Three-way handshake.'),
    ],
    concepts: [concept('TCP vs UDP', 'TCP vs UDP', 'TCP: conexión, confiable y ordenado. UDP: sin conexión ni garantías, pero con menor latencia.', 'TCP: connection, reliable and ordered. UDP: connectionless with no guarantees but lower latency.')],
  },
  {
    id: 'git',
    track: 'systems',
    title: l('Git a fondo', 'Git in depth'),
    summary: l('Commits, ramas, merge vs rebase y flujo de trabajo en equipo.', 'Commits, branches, merge vs rebase and team workflow.'),
    minutes: 14,
    blocks: [
      md(
        `## Modelo mental
- Un **commit** es una foto del proyecto con un puntero a su(s) padre(s).
- Una **rama** es solo un puntero móvil a un commit.
- **HEAD** apunta a la rama (o commit) actual.
- Tres zonas: **working directory** → \`git add\` → **staging** → \`git commit\` → **repositorio**.

## Merge vs rebase
- **merge**: crea un commit de unión y conserva la historia real.
- **rebase**: reescribe tus commits encima de otra rama y deja una historia lineal. **No hagas rebase de ramas compartidas.**

## Flujo típico en equipo (GitHub flow)
Rama por funcionalidad → commits pequeños → push → **Pull Request** → code review → CI verde → merge a main.`,
        `## Mental model
- A **commit** is a snapshot of the project with a pointer to its parent(s).
- A **branch** is just a movable pointer to a commit.
- **HEAD** points to the current branch (or commit).
- Three areas: **working directory** → \`git add\` → **staging** → \`git commit\` → **repository**.

## Merge vs rebase
- **merge**: creates a join commit and keeps the real history.
- **rebase**: rewrites your commits on top of another branch for a linear history. **Do not rebase shared branches.**

## Typical team flow (GitHub flow)
Feature branch → small commits → push → **Pull Request** → code review → green CI → merge to main.`,
      ),
      code(`git switch -c feature/login        # nueva rama
git add -p                          # agregar cambios por partes
git commit -m "Agrega formulario de login"
git fetch origin
git rebase origin/main              # actualizar tu rama (solo si es tuya)
git push -u origin feature/login
# ...abre el Pull Request

git log --oneline --graph           # ver historia
git stash / git stash pop           # guardar cambios temporales
git revert <sha>                    # deshacer de forma segura`, 'bash'),
      warn('`git push --force` en una rama compartida puede borrar el trabajo de otros. Si necesitas forzar, usa `--force-with-lease`.', '`git push --force` on a shared branch can erase other people\'s work. If you must force, use `--force-with-lease`.'),
    ],
    quiz: [
      q('Una rama en Git es…', 'A Git branch is…', [['Una copia de todos los archivos', 'A copy of all files'], ['Un puntero móvil a un commit', 'A movable pointer to a commit'], ['Un servidor remoto', 'A remote server'], ['Un tag', 'A tag']], 1, 'Por eso crear ramas es tan barato.', 'That is why branching is so cheap.'),
      q('Para deshacer un commit ya publicado de forma segura usas…', 'To safely undo an already-pushed commit you use…', [['git reset --hard', 'git reset --hard'], ['git revert', 'git revert'], ['git rm', 'git rm'], ['git stash', 'git stash']], 1, 'Crea un commit nuevo inverso.', 'It creates a new inverse commit.'),
    ],
    concepts: [
      concept('Las tres zonas de Git', 'Git\'s three areas', 'Working directory → staging (git add) → repositorio (git commit).', 'Working directory → staging (git add) → repository (git commit).'),
      concept('¿Qué es HEAD?', 'What is HEAD?', 'Un puntero a la rama o commit en el que estás trabajando.', 'A pointer to the branch or commit you are working on.'),
    ],
  },
  {
    id: 'linux',
    track: 'systems',
    title: l('Linux y la terminal', 'Linux and the terminal'),
    summary: l('Los comandos que un desarrollador usa todos los días.', 'The commands a developer uses every day.'),
    minutes: 10,
    blocks: [
      md(
        `## Esenciales
| Comando | Para qué |
|---|---|
| \`ls\`, \`cd\`, \`pwd\` | navegar |
| \`cat\`, \`less\`, \`head\`, \`tail -f\` | ver archivos y logs |
| \`grep -r "texto" .\` | buscar texto |
| \`find . -name "*.py"\` | buscar archivos |
| \`chmod\`, \`chown\` | permisos |
| \`ps aux\`, \`top\`, \`kill\` | procesos |
| \`curl\` | hacer peticiones HTTP |
| \`ssh\`, \`scp\` | conectarte a servidores |

## Tuberías y redirección
\`|\` pasa la salida de un comando a otro; \`>\` escribe a un archivo y \`>>\` agrega al final.

## Permisos
\`rwx\` para dueño, grupo y otros. \`chmod 755 script.sh\` → el dueño puede todo; los demás, leer y ejecutar.`,
        `## Essentials
| Command | For |
|---|---|
| \`ls\`, \`cd\`, \`pwd\` | navigate |
| \`cat\`, \`less\`, \`head\`, \`tail -f\` | view files and logs |
| \`grep -r "text" .\` | search text |
| \`find . -name "*.py"\` | find files |
| \`chmod\`, \`chown\` | permissions |
| \`ps aux\`, \`top\`, \`kill\` | processes |
| \`curl\` | make HTTP requests |
| \`ssh\`, \`scp\` | connect to servers |

## Pipes and redirection
\`|\` sends one command's output to another; \`>\` writes to a file and \`>>\` appends.

## Permissions
\`rwx\` for owner, group and others. \`chmod 755 script.sh\` → the owner can do everything; others can read and execute.`,
      ),
      code(`# Las 5 IPs con más peticiones en un log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5

# Seguir un log en vivo filtrando errores
tail -f app.log | grep ERROR`, 'bash'),
    ],
    quiz: [
      q('¿Qué hace `tail -f app.log`?', 'What does `tail -f app.log` do?', [['Borra el log', 'Deletes the log'], ['Muestra el final del archivo y sigue mostrando lo nuevo', 'Shows the end of the file and keeps following new lines'], ['Comprime el log', 'Compresses the log'], ['Cuenta las líneas', 'Counts lines']], 1, '-f = follow.', '-f = follow.'),
    ],
    concepts: [concept('Significado de chmod 755', 'Meaning of chmod 755', 'Dueño rwx (7); grupo y otros r-x (5).', 'Owner rwx (7); group and others r-x (5).')],
  },
  {
    id: 'docker-cloud',
    track: 'systems',
    title: l('Docker y cloud básico', 'Docker and cloud basics'),
    summary: l('Contenedores, imágenes y servicios de nube comunes.', 'Containers, images and common cloud services.'),
    minutes: 14,
    blocks: [
      md(
        `## Contenedores
Empaquetan tu app **con sus dependencias** para que corra igual en cualquier lugar ("en mi máquina sí funciona" ya no aplica). Son más ligeros que una VM porque comparten el kernel del sistema anfitrión.

- **Imagen**: plantilla inmutable, construida desde un \`Dockerfile\`.
- **Contenedor**: una instancia en ejecución de una imagen.
- **docker compose**: levanta varios servicios juntos (app + BD + Redis).

## Cloud: conceptos clave
- **IaaS / PaaS / SaaS**: cuánto administras tú vs el proveedor.
- Servicios típicos (AWS): **EC2** (servidores), **S3** (archivos), **RDS** (BD administrada) y **Lambda** (serverless).
- **Escalado vertical** (máquina más grande) vs **horizontal** (más máquinas).`,
        `## Containers
They package your app **with its dependencies** so it runs the same anywhere ("works on my machine" no longer applies). They are lighter than a VM because they share the host kernel.

- **Image**: immutable template built from a \`Dockerfile\`.
- **Container**: a running instance of an image.
- **docker compose**: runs several services together (app + DB + Redis).

## Cloud: key concepts
- **IaaS / PaaS / SaaS**: how much you manage vs the provider.
- Typical services (AWS): **EC2** (servers), **S3** (files), **RDS** (managed DB) and **Lambda** (serverless).
- **Vertical scaling** (bigger machine) vs **horizontal** (more machines).`,
      ),
      code(`# Dockerfile para una app Node
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`, 'dockerfile'),
      interview('Si te preguntan "¿contenedor vs máquina virtual?": la VM virtualiza el hardware e incluye un SO completo; el contenedor virtualiza a nivel de SO y comparte el kernel, así que arranca en segundos y pesa menos.', 'If asked "container vs virtual machine?": a VM virtualizes hardware and includes a full OS; a container virtualizes at the OS level and shares the kernel, so it starts in seconds and is lighter.'),
    ],
    quiz: [
      q('Imagen vs contenedor', 'Image vs container', [['Son lo mismo', 'They are the same'], ['La imagen es la plantilla; el contenedor, la instancia en ejecución', 'The image is the template; the container is the running instance'], ['El contenedor construye la imagen', 'The container builds the image'], ['La imagen es una VM', 'The image is a VM']], 1, 'Como clase vs objeto.', 'Like class vs object.'),
      q('Agregar más servidores detrás de un balanceador es escalado…', 'Adding more servers behind a load balancer is … scaling', [['Vertical', 'Vertical'], ['Horizontal', 'Horizontal'], ['Diagonal', 'Diagonal'], ['Serverless', 'Serverless']], 1, 'Más máquinas = horizontal.', 'More machines = horizontal.'),
    ],
    concepts: [
      concept('Contenedor vs máquina virtual', 'Container vs virtual machine', 'La VM incluye un SO completo y virtualiza hardware; el contenedor comparte el kernel y es más ligero y rápido.', 'A VM includes a full OS and virtualizes hardware; a container shares the kernel and is lighter and faster.'),
      concept('Escalado vertical vs horizontal', 'Vertical vs horizontal scaling', 'Vertical: una máquina más potente. Horizontal: más máquinas con un balanceador de carga.', 'Vertical: a more powerful machine. Horizontal: more machines behind a load balancer.'),
    ],
  },
  {
    id: 'cicd',
    track: 'systems',
    title: l('CI/CD', 'CI/CD'),
    summary: l('Integración y despliegue continuos.', 'Continuous integration and deployment.'),
    minutes: 8,
    blocks: [
      md(
        `## CI: integración continua
Con cada push o PR, un servidor (GitHub Actions, GitLab CI) **instala, compila, corre linters y pruebas**. Si algo falla, no se hace merge.

## CD: entrega / despliegue continuo
- **Continuous delivery**: el código siempre está listo para desplegarse con un clic.
- **Continuous deployment**: cada cambio que pasa la CI se despliega solo a producción.

Estrategias para desplegar con menos riesgo: **blue-green**, **canary** (a un % pequeño de usuarios primero) y *feature flags*.`,
        `## CI: continuous integration
On every push or PR, a server (GitHub Actions, GitLab CI) **installs, builds, runs linters and tests**. If something fails, nothing gets merged.

## CD: continuous delivery / deployment
- **Continuous delivery**: the code is always ready to deploy with one click.
- **Continuous deployment**: every change that passes CI ships to production automatically.

Lower-risk deployment strategies: **blue-green**, **canary** (to a small % of users first) and *feature flags*.`,
      ),
      code(`# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npm test`, 'yaml'),
      tip('Agregar CI a tus proyectos personales (aunque sea solo correr las pruebas) se ve muy bien en tu portafolio.', 'Adding CI to your personal projects (even just running tests) looks great in your portfolio.'),
    ],
    quiz: [
      q('Un despliegue canary consiste en…', 'A canary deployment means…', [['Desplegar a todos de golpe', 'Deploy to everyone at once'], ['Desplegar primero a un porcentaje pequeño de usuarios', 'Deploy to a small % of users first'], ['Desplegar solo de noche', 'Deploy only at night'], ['No desplegar nunca', 'Never deploy']], 1, 'Si algo falla, afecta a pocos.', 'If something breaks, few are affected.'),
    ],
    concepts: [concept('Continuous delivery vs deployment', 'Continuous delivery vs deployment', 'Delivery: siempre listo para desplegar (con aprobación manual). Deployment: cada cambio que pasa la CI se despliega automáticamente.', 'Delivery: always ready to deploy (manual approval). Deployment: every change that passes CI deploys automatically.')],
  },
];
