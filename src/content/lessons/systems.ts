import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

export const SYSTEMS_LESSONS: Lesson[] = [
  {
    id: 'processes-threads',
    track: 'systems',
    title: l('Procesos e hilos', 'Processes and threads'),
    summary: l('Qué es un proceso y qué es un hilo, cómo se organiza la memoria (stack y heap), la diferencia entre concurrencia y paralelismo, y el GIL de Python.', 'What a process and a thread are, how memory is organized (stack and heap), the difference between concurrency and parallelism, and Python\'s GIL.'),
    minutes: 20,
    blocks: [
      md(
        `## Programa, proceso e hilo
- Un **programa** es un archivo en el disco: instrucciones que todavía no hacen nada. Como una receta guardada en un libro.
- Un **proceso** es un programa **en ejecución**. El sistema operativo le da **su propia memoria**, sus archivos abiertos y al menos un hilo. Los procesos están **aislados**: uno no puede tocar la memoria de otro, y si uno falla, los demás siguen. Por eso los navegadores suelen usar procesos separados por pestaña: si una se traba, no se cae todo.
- Un **hilo** (*thread*) es una línea de ejecución **dentro** de un proceso. Un proceso puede tener varios, y todos **comparten la memoria** del proceso.

**Analogía:** un proceso es una cocina con sus propios ingredientes; los hilos son los cocineros de esa cocina. Comparten los ingredientes (es barato pasarse cosas), pero si dos agarran el mismo frasco a la vez, hay problemas: lo verás en la lección de concurrencia.

| | Proceso | Hilo |
|---|---|---|
| Memoria | Propia, aislada | Compartida con los demás hilos del proceso |
| Costo de crearlo | Alto | Bajo |
| Comunicarse | Más difícil (mecanismos del sistema operativo) | Fácil: leen y escriben las mismas variables |
| Si falla | Los demás procesos siguen | Puede tumbar todo el proceso |

En Python, \`threading.Thread(target=funcion, args=(…,))\` crea un hilo que ejecutará esa función. \`start()\` lo arranca y \`join()\` **espera** a que termine.`,
        `## Program, process and thread
- A **program** is a file on disk: instructions that do nothing yet. Like a recipe saved in a book.
- A **process** is a program **running**. The operating system gives it **its own memory**, its open files and at least one thread. Processes are **isolated**: one cannot touch another's memory, and if one fails, the others keep going. That is why browsers usually use separate processes per tab: if one freezes, everything does not crash.
- A **thread** is a line of execution **inside** a process. A process can have several, and they all **share the process's memory**.

**Analogy:** a process is a kitchen with its own ingredients; threads are that kitchen's cooks. They share the ingredients (passing things is cheap), but if two grab the same jar at once, there is trouble: you will see it in the concurrency lesson.

| | Process | Thread |
|---|---|---|
| Memory | Its own, isolated | Shared with the process's other threads |
| Cost to create | High | Low |
| Communicating | Harder (operating system mechanisms) | Easy: they read and write the same variables |
| If it fails | Other processes keep going | It can bring down the whole process |

In Python, \`threading.Thread(target=function, args=(…,))\` creates a thread that will run that function. \`start()\` starts it and \`join()\` **waits** for it to finish.`,
      ),
      code(`import threading

resultados = []                       # memoria del proceso: la ven todos sus hilos

def trabajar(nombre):
    resultados.append(nombre)         # cada hilo escribe en la MISMA lista

hilos = [threading.Thread(target=trabajar, args=(f"hilo {i}",)) for i in range(3)]
for h in hilos:
    h.start()                         # arranca cada hilo
for h in hilos:
    h.join()                          # espera a que cada uno termine
print(len(resultados))                # imprime: 3`),
      md(
        `## La memoria de un proceso: stack y heap
- **Stack** (pila): guarda las **variables locales** y los **marcos de las llamadas** a funciones. Funciona como la pila de llamadas que viste en recursión: cada llamada pone un marco y al terminar lo quita. Es rápida y automática, pero **pequeña**: una recursión demasiado profunda la llena (*stack overflow*; en Python, \`RecursionError\`). **Cada hilo tiene su propio stack.**
- **Heap** (montón): guarda los datos que se crean mientras el programa corre y pueden durar más que la función que los creó: listas, diccionarios, objetos. Es más grande y **lo comparten todos los hilos**. Hay que liberarlo cuando ya no se usa: en C se hace a mano (si se te olvida, hay una **fuga de memoria**); en Python, Java o JavaScript lo hace el **recolector de basura** (*garbage collector*).

En Python, una variable local es un nombre en el stack que **apunta** a un objeto en el heap.`,
        `## A process's memory: stack and heap
- **Stack:** holds **local variables** and the **frames of function calls**. It works like the call stack you saw in recursion: each call pushes a frame and removes it when done. It is fast and automatic, but **small**: too deep a recursion fills it (*stack overflow*; in Python, \`RecursionError\`). **Each thread has its own stack.**
- **Heap:** holds data created while the program runs that can outlive the function that created it: lists, dictionaries, objects. It is larger and **shared by all threads**. It must be freed when no longer used: in C it is done by hand (forget it and you get a **memory leak**); in Python, Java or JavaScript the **garbage collector** does it.

In Python, a local variable is a name on the stack that **points** to an object on the heap.`,
      ),
      md(
        `## Concurrencia vs paralelismo
- **Concurrencia:** **manejar** varias tareas que avanzan a la vez, aunque sea **turnándose** en un solo núcleo del procesador.
- **Paralelismo:** **ejecutarlas literalmente al mismo tiempo**, en varios núcleos.

**Analogía:** un cocinero que alterna entre tres platos (pica, revuelve uno, mientras hierve pasa a otro) es concurrencia. Tres cocineros, cada uno con su plato, es paralelismo.

## Tareas de E/S y tareas de CPU
- **Limitadas por E/S** (entrada/salida): pasan la mayor parte del tiempo **esperando** (la red, el disco, una base de datos). Ejemplo: descargar 100 páginas.
- **Limitadas por CPU:** pasan el tiempo **calculando**. Ejemplo: procesar imágenes, cálculos matemáticos.

## Python y el GIL
En CPython (el Python estándar), el **GIL** (*Global Interpreter Lock*) hace que **solo un hilo ejecute código de Python a la vez**. Pero el GIL **se libera mientras un hilo espera** E/S. Por eso:
- Para tareas de **E/S**, los hilos (o \`asyncio\`) sí ayudan mucho: mientras uno espera la red, otro avanza.
- Para tareas de **CPU**, los hilos no dan paralelismo real: se usa \`multiprocessing\` (varios procesos, cada uno con su propio GIL).

Desde Python 3.13 existe una versión opcional **sin GIL** (*free-threaded*, PEP 703).

En el ejemplo, \`time.sleep\` simula esperar a la red: con hilos, las 5 esperas ocurren a la vez.`,
        `## Concurrency vs parallelism
- **Concurrency:** **managing** several tasks that progress at the same time, even if **taking turns** on a single processor core.
- **Parallelism:** **running them literally at the same time**, on several cores.

**Analogy:** one cook alternating between three dishes (chop, stir one, while it boils move to another) is concurrency. Three cooks, each with their own dish, is parallelism.

## I/O tasks and CPU tasks
- **I/O-bound** (input/output): they spend most of their time **waiting** (the network, the disk, a database). Example: downloading 100 pages.
- **CPU-bound:** they spend their time **computing**. Example: processing images, math.

## Python and the GIL
In CPython (standard Python), the **GIL** (*Global Interpreter Lock*) lets **only one thread run Python code at a time**. But the GIL **is released while a thread waits** for I/O. So:
- For **I/O** tasks, threads (or \`asyncio\`) do help a lot: while one waits for the network, another progresses.
- For **CPU** tasks, threads give no real parallelism: you use \`multiprocessing\` (several processes, each with its own GIL).

Since Python 3.13 there is an optional build **without the GIL** (*free-threaded*, PEP 703).

In the example, \`time.sleep\` simulates waiting for the network: with threads, the 5 waits happen at the same time.`,
      ),
      code(`import threading
import time

def descargar(n):
    time.sleep(0.2)                    # simula esperar a la red (E/S): libera el GIL

inicio = time.time()
for i in range(5):
    descargar(i)                       # una tras otra
seguido = time.time() - inicio

inicio = time.time()
hilos = [threading.Thread(target=descargar, args=(i,)) for i in range(5)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
con_hilos = time.time() - inicio

print(round(seguido, 1), round(con_hilos, 1))   # imprime: 1.0 0.2`),
      interview('Pregunta clásica: "¿Proceso o hilo?". Responde con el trade-off: los hilos comparten memoria (comunicación barata, pero riesgo de condiciones de carrera); los procesos están aislados (más seguros y más costosos). En Python, agrega lo del GIL: hilos para E/S, procesos para CPU.', 'Classic question: "Process or thread?". Answer with the trade-off: threads share memory (cheap communication, but risk of race conditions); processes are isolated (safer and more costly). In Python, add the GIL point: threads for I/O, processes for CPU.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Proceso | Programa en ejecución con su propia memoria, aislado de los demás |
| Hilo | Ejecución dentro de un proceso; comparte su memoria |
| Stack | Variables locales y marcos de llamada; uno por hilo; pequeño |
| Heap | Objetos creados en ejecución; compartido; lo limpia el recolector de basura |
| Concurrencia / paralelismo | Turnarse en varias tareas / hacerlas al mismo tiempo en varios núcleos |
| E/S vs CPU | Esperar (red, disco) / calcular |
| GIL | Un hilo de Python a la vez; se libera en E/S: hilos para E/S, procesos para CPU |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Process | A running program with its own memory, isolated from others |
| Thread | Execution inside a process; it shares its memory |
| Stack | Local variables and call frames; one per thread; small |
| Heap | Objects created at runtime; shared; cleaned by the garbage collector |
| Concurrency / parallelism | Taking turns on several tasks / doing them at the same time on several cores |
| I/O vs CPU | Waiting (network, disk) / computing |
| GIL | One Python thread at a time; released on I/O: threads for I/O, processes for CPU |`,
      ),
    ],
    quiz: [
      q('Los hilos de un mismo proceso…', 'Threads of the same process…', [['Tienen memoria separada', 'Have separate memory'], ['Comparten memoria', 'Share memory'], ['No pueden comunicarse', 'Cannot communicate'], ['Siempre corren en paralelo', 'Always run in parallel']], 1,
        'Por eso comunicarse es barato, pero hay riesgo de condiciones de carrera.', 'That is why communicating is cheap, but race conditions are a risk.'),
      q('Concurrencia vs paralelismo', 'Concurrency vs parallelism', [['Son lo mismo', 'They are the same'], ['Concurrencia es gestionar varias tareas a la vez; paralelismo es ejecutarlas al mismo tiempo', 'Concurrency is managing several tasks at once; parallelism is running them at the same time'], ['El paralelismo necesita un solo núcleo', 'Parallelism needs a single core'], ['La concurrencia es más rápida', 'Concurrency is faster']], 1,
        'Un cocinero que alterna platos frente a varios cocineros.', 'One cook alternating dishes versus several cooks.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué diferencia hay entre un programa y un proceso?', 'What is the difference between a program and a process?', [['Ninguna', 'None'], ['El programa es el archivo en disco; el proceso es ese programa en ejecución', 'The program is the file on disk; the process is that program running'], ['El proceso es más pequeño', 'The process is smaller'], ['El programa tiene hilos y el proceso no', 'The program has threads and the process does not']], 1,
        'Como una receta guardada frente a alguien cocinándola.', 'Like a saved recipe versus someone cooking it.'),
      q('Si un proceso falla, ¿qué pasa con los demás procesos?', 'If a process fails, what happens to the other processes?', [['Fallan también', 'They fail too'], ['Siguen funcionando, porque cada uno tiene su memoria aislada', 'They keep working, because each has its isolated memory'], ['Se reinician', 'They restart'], ['Pierden sus datos', 'They lose their data']], 1,
        'Por eso los navegadores suelen aislar las pestañas en procesos.', 'That is why browsers usually isolate tabs in processes.'),
      q('¿Qué hace `h.join()` con un hilo?', 'What does `h.join()` do with a thread?', [['Lo crea', 'Creates it'], ['Lo arranca', 'Starts it'], ['Espera a que termine', 'Waits for it to finish'], ['Lo une con otro hilo', 'Merges it with another thread']], 2,
        '`start()` lo arranca; `join()` espera.', '`start()` starts it; `join()` waits.'),
      q('¿Qué se guarda en el **stack**?', 'What is stored on the **stack**?', [['Todos los objetos del programa', 'Every object in the program'], ['Las variables locales y los marcos de las llamadas a funciones', 'Local variables and function call frames'], ['Los archivos abiertos', 'Open files'], ['El código fuente', 'The source code']], 1,
        'Es pequeño y cada hilo tiene el suyo.', 'It is small and each thread has its own.'),
      q('¿Qué pasa si una recursión es demasiado profunda?', 'What happens if a recursion is too deep?', [['Se vuelve más rápida', 'It gets faster'], ['Se llena el stack (stack overflow; en Python, RecursionError)', 'The stack fills up (stack overflow; in Python, RecursionError)'], ['Se llena el heap', 'The heap fills up'], ['Nada', 'Nothing']], 1,
        'Cada llamada pendiente ocupa un marco en el stack.', 'Each pending call takes a frame on the stack.'),
      q('¿Quién libera la memoria del heap en Python?', 'Who frees heap memory in Python?', [['El programador, a mano', 'The programmer, by hand'], ['El recolector de basura', 'The garbage collector'], ['El sistema operativo al apagar la computadora', 'The operating system when the computer shuts down'], ['Nadie: nunca se libera', 'Nobody: it is never freed']], 1,
        'En C se hace a mano, y olvidarlo produce fugas de memoria.', 'In C it is done by hand, and forgetting it causes memory leaks.'),
      q('Descargar 100 páginas web es una tarea limitada por…', 'Downloading 100 web pages is a task bound by…', [['CPU', 'CPU'], ['E/S: pasa el tiempo esperando la red', 'I/O: it spends its time waiting for the network'], ['Memoria', 'Memory'], ['El GIL', 'The GIL']], 1,
        'Procesar imágenes, en cambio, es limitada por CPU.', 'Processing images, instead, is CPU-bound.'),
      q('¿Qué hace el GIL de CPython?', 'What does CPython\'s GIL do?', [['Permite que varios hilos ejecuten Python a la vez', 'Lets several threads run Python at once'], ['Hace que solo un hilo ejecute código de Python a la vez', 'Lets only one thread run Python code at a time'], ['Cifra la memoria', 'Encrypts memory'], ['Borra los hilos que no se usan', 'Deletes unused threads']], 1,
        'Se libera mientras un hilo espera E/S.', 'It is released while a thread waits for I/O.'),
      q('Tienes que hacer un cálculo pesado en Python usando los 8 núcleos. ¿Qué usas?', 'You must run a heavy computation in Python using all 8 cores. What do you use?', [['Hilos con `threading`', 'Threads with `threading`'], ['`multiprocessing`: varios procesos, cada uno con su propio GIL', '`multiprocessing`: several processes, each with its own GIL'], ['`time.sleep`', '`time.sleep`'], ['Un solo hilo', 'A single thread']], 1,
        'Con hilos, el GIL impediría el paralelismo real en tareas de CPU.', 'With threads, the GIL would prevent real parallelism on CPU tasks.'),
      q('¿Por qué los hilos sí aceleran tareas de E/S en Python?', 'Why do threads speed up I/O tasks in Python?', [['Porque desactivan el GIL para siempre', 'Because they disable the GIL forever'], ['Porque el GIL se libera mientras un hilo espera, y otro puede avanzar', 'Because the GIL is released while a thread waits, so another can progress'], ['Porque usan más memoria', 'Because they use more memory'], ['No las aceleran', 'They do not']], 1,
        'Como las 5 descargas del ejemplo, que esperan a la vez.', 'Like the 5 downloads in the example, which wait at the same time.'),
    ],
    concepts: [
      concept('Concurrencia vs paralelismo', 'Concurrency vs parallelism', 'Concurrencia: gestionar varias tareas intercalándolas. Paralelismo: ejecutarlas simultáneamente en varios núcleos.', 'Concurrency: managing several tasks by interleaving. Parallelism: running them simultaneously on several cores.'),
    ],
  },
  {
    id: 'concurrency',
    track: 'systems',
    title: l('Concurrencia: carreras, locks y deadlocks', 'Concurrency: races, locks and deadlocks'),
    summary: l('Qué es una condición de carrera, cómo se evita con locks, semáforos y colas, qué es un deadlock y cómo se previene, y la concurrencia en bases de datos.', 'What a race condition is, how locks, semaphores and queues prevent it, what a deadlock is and how to prevent it, and concurrency in databases.'),
    minutes: 22,
    blocks: [
      md(
        `## El problema: condición de carrera
\`contador += 1\` parece una sola operación, pero en realidad son **tres pasos**: **leer** el valor, **sumarle** 1 y **escribir** el resultado. Si dos hilos hacen esos pasos intercalados, se pierde un incremento:

| Paso | Hilo A | Hilo B | contador |
|---|---|---|---|
| 1 | lee 5 | | 5 |
| 2 | | lee 5 | 5 |
| 3 | escribe 6 | | 6 |
| 4 | | escribe 6 | 6 ← debería ser 7 |

Eso es una **condición de carrera** (*race condition*): el resultado depende de **en qué orden** se intercalaron los hilos. Es de los errores más difíciles de encontrar, porque casi siempre "funciona" y falla solo a veces.

**Analogía:** dos personas editan la misma celda de una hoja de cálculo al mismo tiempo; el último en guardar borra lo que puso el otro.`,
        `## The problem: race condition
\`contador += 1\` looks like a single operation, but it is really **three steps**: **read** the value, **add** 1 and **write** the result. If two threads do those steps interleaved, an increment is lost:

| Step | Thread A | Thread B | counter |
|---|---|---|---|
| 1 | reads 5 | | 5 |
| 2 | | reads 5 | 5 |
| 3 | writes 6 | | 6 |
| 4 | | writes 6 | 6 ← should be 7 |

That is a **race condition**: the result depends on **the order** in which the threads were interleaved. It is one of the hardest bugs to find, because it almost always "works" and fails only sometimes.

**Analogy:** two people edit the same spreadsheet cell at once; whoever saves last erases what the other wrote.`,
      ),
      code(`contador = 5
a = contador          # hilo A lee 5
b = contador          # hilo B lee 5 (antes de que A escriba)
contador = a + 1      # A escribe 6
contador = b + 1      # B escribe 6: ¡se perdió el incremento de A!
print(contador)       # imprime: 6`),
      md(
        `## Sincronizar: que solo uno entre a la vez
La parte del código que toca datos compartidos se llama **sección crítica**. Las herramientas para protegerla:
- **Lock** (o **mutex**): solo **un** hilo puede tenerlo a la vez. Los demás esperan a que se libere. En Python, \`with lock:\` lo toma al entrar al bloque y lo suelta al salir, incluso si hay un error.
- **Semáforo:** como un lock, pero deja pasar **hasta N** hilos a la vez. Sirve, por ejemplo, para no abrir más de 10 conexiones a la vez a un servidor.
- **Estructuras seguras entre hilos**, como \`queue.Queue\`, que ya traen su propia sincronización.

**Analogía:** un lock es la llave única del baño: quien la tiene entra y los demás esperan. Un semáforo es un estacionamiento con N lugares.`,
        `## Synchronizing: only one at a time
The part of the code that touches shared data is called the **critical section**. The tools to protect it:
- **Lock** (or **mutex**): only **one** thread can hold it at a time. The others wait until it is released. In Python, \`with lock:\` takes it when entering the block and releases it when leaving, even if there is an error.
- **Semaphore:** like a lock, but lets **up to N** threads through at once. It is useful, for example, to never open more than 10 connections to a server at the same time.
- **Thread-safe structures**, like \`queue.Queue\`, which come with their own synchronization.

**Analogy:** a lock is the only key to the bathroom: whoever has it goes in and the rest wait. A semaphore is a parking lot with N spaces.`,
      ),
      code(`import threading

contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    for _ in range(100_000):
        with lock:                    # sección crítica: un hilo a la vez
            contador += 1

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
print(contador)                       # imprime: 400000   (sin el lock podría salir menos)`),
      md(
        `## Productor y consumidor con una cola
Un patrón muy común: unos hilos **producen** trabajo y otros lo **consumen**. En vez de compartir una lista con locks, se usa una **cola segura** (\`queue.Queue\`): \`put\` deja algo en la cola y \`get\` **espera** hasta que haya algo que sacar. Para avisarle al consumidor que ya no habrá más trabajo se manda una **señal** (aquí, \`None\`).`,
        `## Producer and consumer with a queue
A very common pattern: some threads **produce** work and others **consume** it. Instead of sharing a list with locks, you use a **safe queue** (\`queue.Queue\`): \`put\` drops something in the queue and \`get\` **waits** until there is something to take. To tell the consumer no more work is coming, you send a **signal** (here, \`None\`).`,
      ),
      code(`import queue
import threading

trabajos = queue.Queue()             # cola segura entre hilos
hechos = []

def trabajador():
    while True:
        n = trabajos.get()            # espera hasta que haya algo
        if n is None:                 # la señal de que ya no hay más trabajo
            break
        hechos.append(n * n)

t = threading.Thread(target=trabajador)
t.start()
for n in [1, 2, 3]:
    trabajos.put(n)                   # el productor deja trabajo
trabajos.put(None)
t.join()
print(hechos)                         # imprime: [1, 4, 9]`),
      md(
        `## Deadlock: esperarse para siempre
Un **deadlock** (interbloqueo) pasa cuando dos o más hilos **se esperan mutuamente** y ninguno puede avanzar. Ejemplo: el hilo 1 tiene el lock A y espera el B; el hilo 2 tiene el B y espera el A. Ninguno suelta el suyo.

**Analogía:** dos coches frente a frente en un puente de un solo carril: ninguno retrocede y se quedan ahí para siempre.

Para que haya deadlock tienen que cumplirse **cuatro condiciones** a la vez (las **condiciones de Coffman**):
1. **Exclusión mutua:** el recurso solo lo puede usar uno a la vez.
2. **Retener y esperar:** quien tiene un recurso espera otro sin soltar el primero.
3. **Sin expropiación:** nadie puede quitarle el recurso a quien lo tiene.
4. **Espera circular:** A espera a B, que espera a A (o un círculo más grande).

Basta con romper **una** para evitarlo. La forma más práctica: **tomar los locks siempre en el mismo orden** (así no puede haber espera circular). Otra: usar tiempos de espera máximos (*timeouts*) al pedir un lock.`,
        `## Deadlock: waiting forever
A **deadlock** happens when two or more threads **wait for each other** and none can progress. Example: thread 1 holds lock A and waits for B; thread 2 holds B and waits for A. Neither lets go of theirs.

**Analogy:** two cars facing each other on a one-lane bridge: neither backs up and they stay there forever.

For a deadlock, **four conditions** must hold at once (the **Coffman conditions**):
1. **Mutual exclusion:** the resource can be used by only one at a time.
2. **Hold and wait:** whoever holds a resource waits for another without releasing the first.
3. **No preemption:** nobody can take the resource away from whoever holds it.
4. **Circular wait:** A waits for B, which waits for A (or a bigger circle).

Breaking **one** is enough to avoid it. The most practical way: **always acquire locks in the same order** (so there can be no circular wait). Another: use maximum wait times (*timeouts*) when requesting a lock.`,
      ),
      code(`import threading

lock_a = threading.Lock()
lock_b = threading.Lock()

# ❌ Si un hilo toma A y luego B, y otro toma B y luego A, pueden esperarse para siempre.
# ✅ Todos toman siempre primero A y luego B: no puede haber espera circular.
def transferir():
    with lock_a:
        with lock_b:
            pass              # aquí se moverían los datos protegidos por los dos locks`),
      md(
        `## Concurrencia en la base de datos
Las carreras también pasan con la base de datos: dos personas compran al mismo tiempo el **último** producto en existencia; las dos leen "stock = 1" y las dos lo compran. Formas de evitarlo:
- **Transacciones** con el nivel de **aislamiento** adecuado (la I de ACID).
- **Bloqueo pesimista:** bloquear la fila mientras la usas (\`SELECT … FOR UPDATE\` en PostgreSQL), para que nadie más la toque.
- **Bloqueo optimista:** cada fila tiene un **número de versión**. Al actualizar, exiges que la versión sea la que leíste (\`WHERE id = ? AND version = ?\`) y la subes en 1. Si alguien la cambió antes, tu UPDATE no modifica ninguna fila y sabes que tienes que reintentar.

En sqlite3, \`cursor.rowcount\` dice cuántas filas modificó la última instrucción.`,
        `## Concurrency in the database
Races also happen with the database: two people buy the **last** item in stock at the same time; both read "stock = 1" and both buy it. Ways to avoid it:
- **Transactions** with the right **isolation** level (the I in ACID).
- **Pessimistic locking:** lock the row while you use it (\`SELECT … FOR UPDATE\` in PostgreSQL), so nobody else touches it.
- **Optimistic locking:** each row has a **version number**. When updating, you require the version to be the one you read (\`WHERE id = ? AND version = ?\`) and raise it by 1. If someone changed it first, your UPDATE modifies no row and you know you must retry.

In sqlite3, \`cursor.rowcount\` says how many rows the last statement modified.`,
      ),
      code(`import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE productos (id INTEGER PRIMARY KEY, stock INTEGER, version INTEGER)")
db.execute("INSERT INTO productos VALUES (1, 10, 1)")

def vender(version_leida):
    cur = db.execute(
        "UPDATE productos SET stock = stock - 1, version = version + 1 WHERE id = 1 AND version = ?",
        (version_leida,))
    return cur.rowcount == 1            # ¿se modificó la fila? si no, alguien la cambió antes

print(vender(1), vender(1))             # imprime: True False   (el segundo leyó una versión vieja)`),
      interview('Si te preguntan por concurrencia en un sistema web, no hables solo de hilos: menciona la concurrencia en la **base de datos** (transacciones, aislamiento, bloqueo optimista con un número de versión). Es donde más carreras aparecen en la vida real.', 'If asked about concurrency in a web system, do not talk only about threads: mention concurrency in the **database** (transactions, isolation, optimistic locking with a version number). That is where most races show up in real life.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Condición de carrera | El resultado depende de cómo se intercalan los hilos; \`x += 1\` son tres pasos |
| Sección crítica | El código que toca datos compartidos |
| Lock / mutex | Un solo hilo a la vez (\`with lock:\`) |
| Semáforo | Hasta N hilos a la vez |
| \`queue.Queue\` | Cola segura entre hilos: productor y consumidor |
| Deadlock | Hilos que se esperan para siempre |
| Coffman | Exclusión mutua, retener y esperar, sin expropiación, espera circular |
| Prevenir deadlocks | Tomar los locks siempre en el mismo orden; timeouts |
| Bloqueo optimista | Número de versión: si cambió, reintentar |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Race condition | The result depends on how threads interleave; \`x += 1\` is three steps |
| Critical section | The code touching shared data |
| Lock / mutex | One thread at a time (\`with lock:\`) |
| Semaphore | Up to N threads at a time |
| \`queue.Queue\` | Thread-safe queue: producer and consumer |
| Deadlock | Threads waiting for each other forever |
| Coffman | Mutual exclusion, hold and wait, no preemption, circular wait |
| Preventing deadlocks | Always acquire locks in the same order; timeouts |
| Optimistic locking | Version number: if it changed, retry |`,
      ),
    ],
    quiz: [
      q('La forma más práctica de evitar deadlocks es…', 'The most practical way to avoid deadlocks is…', [['Usar más hilos', 'Using more threads'], ['Adquirir los locks siempre en el mismo orden', 'Always acquiring locks in the same order'], ['No usar locks', 'Not using locks'], ['Reiniciar el programa', 'Restarting the program']], 1,
        'Así no puede haber espera circular.', 'That way there can be no circular wait.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Por qué `contador += 1` no es seguro entre hilos?', 'Why is `counter += 1` not safe between threads?', [['Porque es lento', 'Because it is slow'], ['Porque son tres pasos (leer, sumar, escribir) que otro hilo puede intercalar', 'Because it is three steps (read, add, write) that another thread can interleave'], ['Porque Python no permite sumar en hilos', 'Because Python does not allow adding in threads'], ['Sí es seguro', 'It is safe']], 1,
        'Si dos hilos leen el mismo valor, uno de los incrementos se pierde.', 'If two threads read the same value, one of the increments is lost.'),
      q('¿Qué es una **condición de carrera**?', 'What is a **race condition**?', [['Un hilo muy rápido', 'A very fast thread'], ['Un error donde el resultado depende del orden en que se intercalan los hilos', 'A bug where the result depends on the order threads interleave'], ['Una competencia de algoritmos', 'An algorithm competition'], ['Un deadlock', 'A deadlock']], 1,
        'Por eso falla solo a veces y es difícil de encontrar.', 'That is why it fails only sometimes and is hard to find.'),
      q('¿Qué hace un **lock** (mutex)?', 'What does a **lock** (mutex) do?', [['Acelera los hilos', 'Speeds up threads'], ['Deja que solo un hilo a la vez entre a la sección crítica', 'Lets only one thread at a time into the critical section'], ['Borra los datos compartidos', 'Deletes shared data'], ['Crea un proceso', 'Creates a process']], 1,
        'Como la llave única del baño.', 'Like the only bathroom key.'),
      q('¿En qué se diferencia un **semáforo** de un lock?', 'How does a **semaphore** differ from a lock?', [['No hay diferencia', 'There is no difference'], ['El semáforo deja pasar hasta N hilos a la vez', 'The semaphore lets up to N threads through at once'], ['El semáforo es más lento', 'The semaphore is slower'], ['El semáforo solo sirve en bases de datos', 'The semaphore only works in databases']], 1,
        'Como un estacionamiento con N lugares.', 'Like a parking lot with N spaces.'),
      q('¿Qué ventaja tiene `with lock:` frente a tomar y soltar el lock a mano?', 'What advantage does `with lock:` have over taking and releasing the lock by hand?', [['Es más rápido', 'It is faster'], ['Lo suelta siempre al salir del bloque, incluso si hay un error', 'It always releases it when leaving the block, even if there is an error'], ['No usa memoria', 'It uses no memory'], ['Ninguna', 'None']], 1,
        'Si se te olvidara soltarlo, los demás hilos esperarían para siempre.', 'If you forgot to release it, the other threads would wait forever.'),
      q('En el productor-consumidor, ¿qué hace `trabajos.get()` si la cola está vacía?', 'In producer-consumer, what does `trabajos.get()` do if the queue is empty?', [['Devuelve None', 'Returns None'], ['Espera hasta que haya algo', 'Waits until there is something'], ['Da error', 'Fails'], ['Termina el hilo', 'Ends the thread']], 1,
        'Por eso se manda una señal (como `None`) para avisar que ya no habrá más trabajo.', 'That is why a signal (like `None`) is sent to announce no more work.'),
      q('¿Qué es un **deadlock**?', 'What is a **deadlock**?', [['Un hilo que terminó', 'A finished thread'], ['Dos o más hilos que se esperan mutuamente y ninguno avanza', 'Two or more threads waiting for each other so none progresses'], ['Un lock que se rompió', 'A broken lock'], ['Una base de datos llena', 'A full database']], 1,
        'Como dos coches frente a frente en un puente de un solo carril.', 'Like two cars facing each other on a one-lane bridge.'),
      q('¿Cuál de estas **no** es una condición de Coffman?', 'Which of these is **not** a Coffman condition?', [['Exclusión mutua', 'Mutual exclusion'], ['Espera circular', 'Circular wait'], ['Que haya más de 4 hilos', 'Having more than 4 threads'], ['Retener y esperar', 'Hold and wait']], 2,
        'Las cuatro son exclusión mutua, retener y esperar, sin expropiación y espera circular.', 'The four are mutual exclusion, hold and wait, no preemption and circular wait.'),
      q('Dos clientes compran a la vez el último producto y los dos ven "stock = 1". ¿Qué es esto?', 'Two customers buy the last item at once and both see "stock = 1". What is this?', [['Un deadlock', 'A deadlock'], ['Una condición de carrera en la base de datos', 'A race condition in the database'], ['Un problema de red', 'A network problem'], ['Una fuga de memoria', 'A memory leak']], 1,
        'Se evita con transacciones, bloqueo pesimista u optimista.', 'It is avoided with transactions, pessimistic or optimistic locking.'),
      q('En el **bloqueo optimista**, ¿qué pasa si otra persona cambió la fila antes que tú?', 'In **optimistic locking**, what happens if someone else changed the row before you?', [['Se sobrescribe su cambio', 'Their change is overwritten'], ['Tu UPDATE no modifica ninguna fila (la versión ya no coincide) y reintentas', 'Your UPDATE modifies no row (the version no longer matches) and you retry'], ['La base se bloquea', 'The database locks up'], ['Se borra la fila', 'The row is deleted']], 1,
        'Por eso se revisa cuántas filas se modificaron.', 'That is why you check how many rows were modified.'),
    ],
    concepts: [
      concept('Las 4 condiciones de Coffman', 'The 4 Coffman conditions', 'Exclusión mutua, retener y esperar, sin expropiación y espera circular.', 'Mutual exclusion, hold and wait, no preemption and circular wait.'),
      concept('¿Por qué `x += 1` no es seguro entre hilos?', 'Why is `x += 1` not thread-safe?', 'Son tres pasos (leer, sumar, escribir) que otro hilo puede intercalar, y se pierden actualizaciones.', 'It is three steps (read, add, write) another thread can interleave, losing updates.'),
    ],
  },
  {
    id: 'networking',
    track: 'systems',
    title: l('Redes para programadores', 'Networking for programmers'),
    summary: l('Las capas de una red, direcciones IP y subredes, puertos, TCP frente a UDP, sockets y WebSockets: lo que necesitas para entender cómo viaja una petición.', 'Network layers, IP addresses and subnets, ports, TCP versus UDP, sockets and WebSockets: what you need to understand how a request travels.'),
    minutes: 20,
    blocks: [
      md(
        `## Las capas
Una red se organiza en **capas**: cada una hace un solo trabajo y se apoya en la de abajo. El modelo **TCP/IP** simplificado tiene cuatro:

| Capa | Qué hace | Ejemplos |
|---|---|---|
| **Aplicación** | El "idioma" de cada programa | HTTP, DNS, SMTP (correo), WebSocket |
| **Transporte** | Lleva los datos entre **programas**, usando puertos | TCP, UDP |
| **Red** | Lleva los paquetes entre **computadoras**, eligiendo la ruta | IP |
| **Enlace** | Mueve los bits por el medio físico | Ethernet, Wi-Fi |

**Analogía:** mandar un paquete por mensajería. El **contenido** del paquete es la aplicación; el **servicio de entrega** (con o sin confirmación de recibido) es el transporte; la **dirección** y la ruta entre ciudades es la red; el **camión** o el avión es el enlace.`,
        `## The layers
A network is organized in **layers**: each one does a single job and relies on the one below. The simplified **TCP/IP** model has four:

| Layer | What it does | Examples |
|---|---|---|
| **Application** | Each program's "language" | HTTP, DNS, SMTP (email), WebSocket |
| **Transport** | Carries data between **programs**, using ports | TCP, UDP |
| **Network** | Carries packets between **computers**, choosing the route | IP |
| **Link** | Moves the bits over the physical medium | Ethernet, Wi-Fi |

**Analogy:** sending a parcel by courier. The parcel's **contents** are the application; the **delivery service** (with or without delivery confirmation) is the transport; the **address** and the route between cities is the network; the **truck** or plane is the link.`,
      ),
      md(
        `## Direcciones IP
Cada computadora en una red tiene una **dirección IP**. En **IPv4** son cuatro números del 0 al 255: \`192.168.1.42\`. Como se acabaron, existe **IPv6**, con direcciones mucho más largas (\`2001:db8::1\`).
- **IPs privadas:** rangos reservados para redes internas (tu casa, una oficina): \`10.x.x.x\`, \`172.16.x.x\` a \`172.31.x.x\` y \`192.168.x.x\`. No se pueden usar directamente en internet.
- **NAT:** tu router tiene **una IP pública** y traduce el tráfico de todos los aparatos de tu casa, que usan IPs privadas.
- **localhost** (\`127.0.0.1\`): "esta misma computadora". Por eso tu servidor de desarrollo se abre en \`http://localhost:5173\`.

**Subredes (CIDR):** \`192.168.1.0/24\` significa "los primeros 24 bits son fijos": todas las direcciones de \`192.168.1.0\` a \`192.168.1.255\`, o sea **256**. Con \`/28\` quedan fijos 28 de los 32 bits, y los 4 restantes dan 2⁴ = **16** direcciones. En Python, el módulo \`ipaddress\` hace estos cálculos.`,
        `## IP addresses
Every computer on a network has an **IP address**. In **IPv4** they are four numbers from 0 to 255: \`192.168.1.42\`. Since they ran out, there is **IPv6**, with much longer addresses (\`2001:db8::1\`).
- **Private IPs:** ranges reserved for internal networks (your home, an office): \`10.x.x.x\`, \`172.16.x.x\` to \`172.31.x.x\` and \`192.168.x.x\`. They cannot be used directly on the internet.
- **NAT:** your router has **one public IP** and translates the traffic of every device in your home, which use private IPs.
- **localhost** (\`127.0.0.1\`): "this same computer". That is why your dev server opens at \`http://localhost:5173\`.

**Subnets (CIDR):** \`192.168.1.0/24\` means "the first 24 bits are fixed": every address from \`192.168.1.0\` to \`192.168.1.255\`, that is **256**. With \`/28\`, 28 of the 32 bits are fixed, and the remaining 4 give 2⁴ = **16** addresses. In Python, the \`ipaddress\` module does these calculations.`,
      ),
      code(`import ipaddress

red = ipaddress.ip_network("192.168.1.0/24")
print(red.num_addresses)                                 # imprime: 256
print(ipaddress.ip_address("192.168.1.42") in red)       # imprime: True
print(ipaddress.ip_address("8.8.8.8").is_private)        # imprime: False`),
      md(
        `## Puertos
La IP encuentra **la computadora**; el **puerto** encuentra **el programa** dentro de ella. Es un número del 0 al 65535.

**Analogía:** la IP es la dirección del edificio y el puerto, el número de departamento.

Puertos que conviene reconocer: **22** SSH, **53** DNS, **80** HTTP, **443** HTTPS, **5432** PostgreSQL, **6379** Redis. Los servidores de desarrollo suelen usar puertos como 3000 o 5173.

## TCP vs UDP
| | TCP | UDP |
|---|---|---|
| Conexión | Se establece antes de enviar (*3-way handshake*) | No hay conexión: se envía y ya |
| Garantías | Todo llega, **completo y en orden** (retransmite lo que se pierde) | Ninguna: algo puede perderse o llegar desordenado |
| Velocidad | Más lento por las confirmaciones | Más rápido y ligero |
| Se usa en | Web, APIs, correo, descargas | Video y llamadas en vivo, juegos en línea, DNS |

**El handshake de TCP** tiene 3 pasos: el cliente manda **SYN** ("¿hablamos?"), el servidor responde **SYN-ACK** ("sí, ¿me oyes?") y el cliente confirma con **ACK** ("te oigo"). Ya conectados, cada parte confirma lo que recibe.

**¿Por qué UDP para una videollamada?** Un paquete que llega tarde ya no sirve: es mejor saltarlo que detener todo esperando a que se reenvíe.

**Analogía:** TCP es una llamada telefónica (la estableces y confirmas que te escuchan); UDP es mandar postales (rápido, pero sin saber si llegaron).`,
        `## Ports
The IP finds **the computer**; the **port** finds **the program** inside it. It is a number from 0 to 65535.

**Analogy:** the IP is the building's address and the port, the apartment number.

Ports worth recognizing: **22** SSH, **53** DNS, **80** HTTP, **443** HTTPS, **5432** PostgreSQL, **6379** Redis. Dev servers usually use ports like 3000 or 5173.

## TCP vs UDP
| | TCP | UDP |
|---|---|---|
| Connection | Set up before sending (*3-way handshake*) | No connection: you just send |
| Guarantees | Everything arrives, **complete and in order** (it retransmits what is lost) | None: something may be lost or arrive out of order |
| Speed | Slower due to acknowledgments | Faster and lighter |
| Used for | Web, APIs, email, downloads | Live video and calls, online games, DNS |

**TCP's handshake** has 3 steps: the client sends **SYN** ("shall we talk?"), the server answers **SYN-ACK** ("yes, can you hear me?") and the client confirms with **ACK** ("I hear you"). Once connected, each side acknowledges what it receives.

**Why UDP for a video call?** A packet that arrives late is useless: it is better to skip it than to stop everything waiting for it to be resent.

**Analogy:** TCP is a phone call (you set it up and confirm they hear you); UDP is sending postcards (fast, but without knowing whether they arrived).`,
      ),
      md(
        `## Sockets: cómo un programa usa la red
Un **socket** es el "enchufe" que un programa usa para hablar por la red: una combinación de IP y puerto. Un **servidor** abre un socket, lo **ata** (*bind*) a un puerto y **escucha**; un **cliente** se **conecta** a esa IP y ese puerto, y los dos se mandan bytes. HTTP, por ejemplo, funciona encima de un socket TCP.

En el ejemplo, un servidor en un hilo recibe un mensaje y lo devuelve en mayúsculas, todo dentro de tu computadora (\`127.0.0.1\`). El puerto 0 le pide al sistema operativo cualquier puerto libre.`,
        `## Sockets: how a program uses the network
A **socket** is the "plug" a program uses to talk over the network: a combination of IP and port. A **server** opens a socket, **binds** it to a port and **listens**; a **client** **connects** to that IP and port, and the two send each other bytes. HTTP, for example, runs on top of a TCP socket.

In the example, a server in a thread receives a message and sends it back in uppercase, all inside your computer (\`127.0.0.1\`). Port 0 asks the operating system for any free port.`,
      ),
      code(`import socket
import threading

servidor = socket.socket()                       # un socket TCP
servidor.bind(("127.0.0.1", 0))                  # se ata a un puerto libre de esta computadora
servidor.listen()
puerto = servidor.getsockname()[1]

def atender():
    conexion, _ = servidor.accept()              # espera a que un cliente se conecte
    conexion.sendall(conexion.recv(1024).upper())   # recibe y responde en mayúsculas
    conexion.close()

threading.Thread(target=atender).start()

cliente = socket.create_connection(("127.0.0.1", puerto))   # aquí ocurre el handshake TCP
cliente.sendall(b"hola")                         # b"..." son bytes: lo que viaja por la red
print(cliente.recv(1024).decode())               # imprime: HOLA`),
      md(
        `## Tiempo real: WebSockets
HTTP funciona con **petición y respuesta**: el servidor solo puede contestar cuando el cliente pregunta. Para un chat, el cliente tendría que preguntar "¿hay mensajes nuevos?" cada segundo (*polling*), lo que desperdicia recursos.

Un **WebSocket** abre una conexión **persistente y en los dos sentidos** sobre TCP: una vez abierta, el servidor puede mandar mensajes **cuando quiera**. Se usa en chats, notificaciones en vivo y juegos.

Dato extra: **HTTP/2** permite varias peticiones a la vez por una sola conexión, y **HTTP/3** funciona sobre **QUIC**, un protocolo construido encima de UDP para conectar más rápido.`,
        `## Real time: WebSockets
HTTP works with **request and response**: the server can only answer when the client asks. For a chat, the client would have to ask "any new messages?" every second (*polling*), which wastes resources.

A **WebSocket** opens a **persistent, two-way** connection over TCP: once open, the server can send messages **whenever it wants**. It is used in chats, live notifications and games.

Extra fact: **HTTP/2** allows several requests at once over a single connection, and **HTTP/3** runs on **QUIC**, a protocol built on top of UDP to connect faster.`,
      ),
      interview('Si te preguntan "TCP o UDP", responde con el caso de uso: TCP cuando necesitas que todo llegue completo y en orden (web, pagos); UDP cuando importa más la velocidad que perder algún paquete (video en vivo, juegos). Y menciona el handshake de 3 pasos.', 'If asked "TCP or UDP", answer with the use case: TCP when everything must arrive complete and in order (web, payments); UDP when speed matters more than losing a packet (live video, games). And mention the 3-step handshake.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Capas | Aplicación (HTTP) → transporte (TCP/UDP) → red (IP) → enlace (Wi-Fi) |
| IP | La dirección de una computadora; privadas (192.168…) y públicas, NAT |
| CIDR | \`/24\` = 256 direcciones; \`/28\` = 16 |
| Puerto | Qué programa dentro de la computadora: 80 HTTP, 443 HTTPS, 22 SSH |
| TCP | Con conexión (SYN, SYN-ACK, ACK), completo y en orden |
| UDP | Sin conexión ni garantías, más rápido: video en vivo, juegos, DNS |
| Socket | IP + puerto: el "enchufe" de un programa a la red |
| WebSocket | Conexión persistente en los dos sentidos: chats y notificaciones |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Layers | Application (HTTP) → transport (TCP/UDP) → network (IP) → link (Wi-Fi) |
| IP | A computer's address; private (192.168…) and public, NAT |
| CIDR | \`/24\` = 256 addresses; \`/28\` = 16 |
| Port | Which program inside the computer: 80 HTTP, 443 HTTPS, 22 SSH |
| TCP | Connection-based (SYN, SYN-ACK, ACK), complete and in order |
| UDP | No connection or guarantees, faster: live video, games, DNS |
| Socket | IP + port: a program's "plug" into the network |
| WebSocket | A persistent two-way connection: chats and notifications |`,
      ),
    ],
    quiz: [
      q('¿Qué protocolo usarías para videollamadas en tiempo real?', 'Which protocol would you use for real-time video calls?', [['TCP', 'TCP'], ['UDP', 'UDP'], ['SMTP', 'SMTP'], ['FTP', 'FTP']], 1,
        'Un paquete que llega tarde ya no sirve; es mejor saltarlo.', 'A late packet is useless; better to skip it.'),
      q('El handshake de TCP tiene…', 'The TCP handshake has…', [['1 paso', '1 step'], ['2 pasos', '2 steps'], ['3 pasos: SYN, SYN-ACK, ACK', '3 steps: SYN, SYN-ACK, ACK'], ['4 pasos', '4 steps']], 2,
        '"¿Hablamos?", "sí, ¿me oyes?", "te oigo".', '"Shall we talk?", "yes, can you hear me?", "I hear you".'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿En qué capa trabaja HTTP?', 'Which layer does HTTP work in?', [['Enlace', 'Link'], ['Red', 'Network'], ['Transporte', 'Transport'], ['Aplicación', 'Application']], 3,
        'Funciona encima de TCP (transporte), que va encima de IP (red).', 'It runs on top of TCP (transport), which runs on top of IP (network).'),
      q('¿Qué hace la capa de **red** (IP)?', 'What does the **network** layer (IP) do?', [['Cifrar los datos', 'Encrypt data'], ['Llevar los paquetes entre computadoras eligiendo la ruta', 'Carry packets between computers, choosing the route'], ['Mostrar la página', 'Show the page'], ['Elegir el puerto', 'Pick the port']], 1,
        'Los puertos son cosa de la capa de transporte.', 'Ports belong to the transport layer.'),
      q('¿Cuál de estas es una IP **privada**?', 'Which of these is a **private** IP?', [['8.8.8.8', '8.8.8.8'], ['192.168.0.15', '192.168.0.15'], ['142.250.80.46', '142.250.80.46'], ['1.1.1.1', '1.1.1.1']], 1,
        'Los rangos privados son 10.x, 172.16–31.x y 192.168.x.', 'The private ranges are 10.x, 172.16–31.x and 192.168.x.'),
      q('¿Qué hace el **NAT** de tu router?', 'What does your router\'s **NAT** do?', [['Cifra el Wi-Fi', 'Encrypts the Wi-Fi'], ['Traduce el tráfico de los aparatos de tu casa (IPs privadas) a su única IP pública', 'Translates your home devices\' traffic (private IPs) to its single public IP'], ['Asigna puertos a los programas', 'Assigns ports to programs'], ['Bloquea virus', 'Blocks viruses']], 1,
        'Por eso muchos aparatos comparten una sola IP pública.', 'That is why many devices share a single public IP.'),
      q('¿Cuántas direcciones tiene la red `10.0.0.0/28`?', 'How many addresses does the `10.0.0.0/28` network have?', [['28', '28'], ['16', '16'], ['256', '256'], ['4', '4']], 1,
        'Quedan 32 − 28 = 4 bits libres: 2⁴ = 16.', '32 − 28 = 4 free bits: 2⁴ = 16.'),
      q('¿Para qué sirve el **puerto**?', 'What is the **port** for?', [['Para encontrar la computadora', 'To find the computer'], ['Para encontrar el programa dentro de la computadora', 'To find the program inside the computer'], ['Para cifrar', 'To encrypt'], ['Para nombrar el dominio', 'To name the domain']], 1,
        'La IP es el edificio; el puerto, el departamento.', 'The IP is the building; the port, the apartment.'),
      q('¿Qué puerto usa HTTPS por defecto?', 'Which port does HTTPS use by default?', [['80', '80'], ['22', '22'], ['443', '443'], ['5432', '5432']], 2,
        '80 es HTTP, 22 SSH y 5432 PostgreSQL.', '80 is HTTP, 22 SSH and 5432 PostgreSQL.'),
      q('¿Qué garantiza TCP que UDP no?', 'What does TCP guarantee that UDP does not?', [['Más velocidad', 'More speed'], ['Que todo llegue completo y en orden', 'That everything arrives complete and in order'], ['Cifrado', 'Encryption'], ['Que no haya puertos', 'That there are no ports']], 1,
        'A cambio es más lento por las confirmaciones y retransmisiones.', 'In exchange it is slower due to acknowledgments and retransmissions.'),
      q('¿Qué es un **socket**?', 'What is a **socket**?', [['Un cable de red', 'A network cable'], ['El "enchufe" de un programa a la red: una IP y un puerto', 'A program\'s "plug" into the network: an IP and a port'], ['Un tipo de base de datos', 'A kind of database'], ['Un header de HTTP', 'An HTTP header']], 1,
        'El servidor hace bind, listen y accept; el cliente se conecta.', 'The server does bind, listen and accept; the client connects.'),
      q('¿Por qué un chat usa WebSockets en vez de preguntar cada segundo con HTTP?', 'Why does a chat use WebSockets instead of asking every second with HTTP?', [['Porque HTTP no existe en el navegador', 'Because HTTP does not exist in the browser'], ['Porque la conexión queda abierta en los dos sentidos y el servidor puede mandar mensajes cuando quiera', 'Because the connection stays open both ways and the server can send messages whenever it wants'], ['Porque es más seguro', 'Because it is more secure'], ['Porque usa UDP', 'Because it uses UDP']], 1,
        'Preguntar cada segundo (polling) desperdicia recursos.', 'Asking every second (polling) wastes resources.'),
    ],
    concepts: [concept('TCP vs UDP', 'TCP vs UDP', 'TCP: conexión, confiable y ordenado. UDP: sin conexión ni garantías, pero con menor latencia.', 'TCP: connection, reliable and ordered. UDP: connectionless with no guarantees but lower latency.')],
  },
  {
    id: 'git',
    track: 'systems',
    title: l('Git y control de versiones', 'Git and version control'),
    summary: l('Commits, las tres zonas, ramas y HEAD, merge frente a rebase, cómo resolver conflictos, reset frente a revert y el flujo de trabajo en equipo con pull requests.', 'Commits, the three areas, branches and HEAD, merge versus rebase, how to resolve conflicts, reset versus revert and the team workflow with pull requests.'),
    minutes: 26,
    blocks: [
      md(
        `## ¿Para qué sirve Git?
**Git** es un sistema de **control de versiones**: guarda la **historia** de los cambios de tu proyecto. Con él puedes volver a cualquier versión anterior, ver quién cambió qué y por qué, trabajar en varias cosas a la vez sin mezclarlas y colaborar con otras personas sin pisarse.

**Analogía:** los puntos de guardado de un videojuego. Cada vez que guardas, puedes volver ahí si algo sale mal.

Un **commit** es uno de esos puntos de guardado: una **foto completa del proyecto** en un momento, con un mensaje que explica el cambio, el autor, la fecha y un **puntero a su commit padre** (el anterior). Cada commit se identifica con un **hash**, un código como \`a1b2c3d\`. La carpeta con toda esa historia es el **repositorio**.`,
        `## What is Git for?
**Git** is a **version control** system: it keeps the **history** of your project's changes. With it you can go back to any earlier version, see who changed what and why, work on several things at once without mixing them and collaborate without stepping on each other.

**Analogy:** a video game's save points. Every time you save, you can go back there if something goes wrong.

A **commit** is one of those save points: a **full snapshot of the project** at a moment, with a message explaining the change, the author, the date and a **pointer to its parent commit** (the previous one). Each commit is identified by a **hash**, a code like \`a1b2c3d\`. The folder with all that history is the **repository**.`,
      ),
      md(
        `## Las tres zonas
Un cambio pasa por tres lugares antes de quedar en la historia:
1. **Directorio de trabajo** (*working directory*): tus archivos tal como los estás editando.
2. **Staging** (área de preparación): lo que elegiste para el próximo commit, con \`git add\`.
3. **Repositorio:** la historia guardada, con \`git commit\`.

¿Por qué existe el staging? Para **elegir qué entra en cada commit**: si arreglaste un error y además empezaste otra cosa, puedes guardar solo el arreglo.

**Analogía:** preparar una caja de envío. Eliges qué poner adentro (\`add\`) y luego la sellas con una etiqueta (\`commit\`).`,
        `## The three areas
A change goes through three places before landing in the history:
1. **Working directory:** your files as you are editing them.
2. **Staging** (staging area): what you chose for the next commit, with \`git add\`.
3. **Repository:** the saved history, with \`git commit\`.

Why does staging exist? To **choose what goes into each commit**: if you fixed a bug and also started something else, you can save just the fix.

**Analogy:** packing a shipping box. You pick what goes inside (\`add\`) and then seal it with a label (\`commit\`).`,
      ),
      code(`git init                          # crea un repositorio en esta carpeta
git status                        # qué cambió y qué está en staging
git add login.py                  # pasa login.py al staging
git commit -m "Agrega el login"   # guarda un commit con ese mensaje
git log --oneline                 # la historia, un commit por línea`, 'bash'),
      md(
        `## Ramas y HEAD
Una **rama** no es una copia del proyecto: es solo un **puntero** (una etiqueta) que apunta a un commit. Por eso crear una es instantáneo. Cuando haces un commit en una rama, **su puntero avanza** al commit nuevo; las demás ramas se quedan donde estaban.

**HEAD** dice **dónde estás parado**: normalmente apunta a la rama en la que trabajas.

\`git switch -c feature/login\` crea una rama nueva que apunta al mismo commit donde estás y te cambia a ella. Así trabajas el login sin tocar \`main\`.

**Analogía:** marcadores en un libro. Puedes tener varios marcadores en distintas páginas, y moverlos sin cambiar el libro.

En Python podemos simular esta idea: cada commit guarda quién es su padre, y cada rama solo guarda a qué commit apunta.`,
        `## Branches and HEAD
A **branch** is not a copy of the project: it is just a **pointer** (a label) pointing to a commit. That is why creating one is instant. When you commit on a branch, **its pointer moves** to the new commit; the other branches stay where they were.

**HEAD** tells **where you are standing**: it usually points to the branch you are working on.

\`git switch -c feature/login\` creates a new branch pointing to the same commit you are on and switches you to it. That way you work on the login without touching \`main\`.

**Analogy:** bookmarks in a book. You can have several bookmarks on different pages, and move them without changing the book.

In Python we can simulate this idea: each commit stores who its parent is, and each branch only stores which commit it points to.`,
      ),
      code(`padre = {"a1": None, "b2": "a1"}     # commit → su commit padre
ramas = {"main": "b2"}                # cada rama es solo un puntero a un commit

ramas["feature"] = ramas["main"]      # git switch -c feature: un puntero nuevo al mismo commit
padre["c3"] = ramas["feature"]        # un commit nuevo en feature, hijo de b2...
ramas["feature"] = "c3"               # ...y el puntero de feature avanza

print(ramas["main"], ramas["feature"], padre["c3"])   # imprime: b2 c3 b2`),
      md(
        `## Integrar cambios: merge vs rebase
Cuando tu rama está lista, hay que unirla con \`main\`. Dos formas:
- **merge:** crea un **commit de unión** que tiene dos padres (el último de cada rama). **Conserva la historia tal como pasó.** Si \`main\` no avanzó mientras trabajabas, Git solo mueve el puntero hacia adelante (*fast-forward*), sin commit de unión.
- **rebase:** **vuelve a aplicar tus commits encima** de la otra rama, como si hubieras empezado a trabajar desde su último commit. Deja una historia **lineal**, pero **reescribe** tus commits (se crean commits nuevos, con otros hashes).

**Regla de oro:** **no hagas rebase de una rama que otros ya están usando.** Ellos tienen los commits viejos y sus historias dejarían de coincidir.

## Resolver un conflicto
Un **conflicto** aparece cuando las dos ramas cambiaron **las mismas líneas** de un archivo y Git no sabe con cuál quedarse. Lo marca así:

\`\`\`text
<<<<<<< HEAD
color = "azul"      ← tu versión
=======
color = "verde"     ← la versión que estás integrando
>>>>>>> feature/colores
\`\`\`

Para resolverlo: edita el archivo y deja el código correcto (una versión, la otra o una mezcla), **borra los marcadores**, prueba que funcione y luego \`git add\` y \`git commit\` (o \`git rebase --continue\` si estabas en un rebase). Si te arrepientes, \`git merge --abort\` o \`git rebase --abort\` te regresan al estado anterior.`,
        `## Integrating changes: merge vs rebase
When your branch is ready, it must be joined with \`main\`. Two ways:
- **merge:** creates a **merge commit** with two parents (the last of each branch). **It keeps the history as it happened.** If \`main\` did not move while you worked, Git just moves the pointer forward (*fast-forward*), with no merge commit.
- **rebase:** **re-applies your commits on top** of the other branch, as if you had started working from its latest commit. It leaves a **linear** history, but **rewrites** your commits (new commits are created, with other hashes).

**Golden rule:** **do not rebase a branch others are already using.** They have the old commits and their histories would stop matching.

## Resolving a conflict
A **conflict** happens when both branches changed **the same lines** of a file and Git does not know which to keep. It marks it like this:

\`\`\`text
<<<<<<< HEAD
color = "azul"      ← your version
=======
color = "verde"     ← the version you are integrating
>>>>>>> feature/colores
\`\`\`

To resolve it: edit the file and leave the right code (one version, the other or a mix), **delete the markers**, test that it works and then \`git add\` and \`git commit\` (or \`git rebase --continue\` if you were rebasing). If you change your mind, \`git merge --abort\` or \`git rebase --abort\` take you back to the previous state.`,
      ),
      md(
        `## Deshacer: reset vs revert
| | \`git reset\` | \`git revert\` |
|---|---|---|
| Qué hace | Mueve la rama a un commit anterior | Crea un commit **nuevo** que deshace otro |
| Historia | La **reescribe**: los commits "desaparecen" | La **conserva** |
| ¿Seguro en ramas compartidas? | ❌ No | ✅ Sí |

\`reset\` tiene tres modos: \`--soft\` conserva tus cambios en staging, \`--mixed\` (el de por defecto) los deja en el directorio de trabajo sin preparar, y \`--hard\` **los borra**: úsalo con mucho cuidado.

## Trabajar en equipo
- El repositorio en GitHub (u otro servidor) es el **remoto**, normalmente llamado \`origin\`.
- \`git fetch\` **descarga** los cambios del remoto sin tocar tus archivos; \`git pull\` es \`fetch\` + **integrarlos** (merge o rebase) en tu rama; \`git push\` **sube** tus commits.
- \`git stash\` guarda tus cambios sin terminar para dejar limpio el directorio, y \`git stash pop\` los regresa.

**El flujo típico (GitHub flow):** creas una rama por funcionalidad → haces commits pequeños con buenos mensajes → \`push\` → abres un **Pull Request** (PR) → tus compañeros hacen **code review** y la **CI** corre las pruebas → si todo está bien, se hace **merge** a \`main\`.`,
        `## Undoing: reset vs revert
| | \`git reset\` | \`git revert\` |
|---|---|---|
| What it does | Moves the branch to an earlier commit | Creates a **new** commit that undoes another |
| History | **Rewrites** it: commits "disappear" | **Keeps** it |
| Safe on shared branches? | ❌ No | ✅ Yes |

\`reset\` has three modes: \`--soft\` keeps your changes in staging, \`--mixed\` (the default) leaves them in the working directory unstaged, and \`--hard\` **deletes them**: use it very carefully.

## Working as a team
- The repository on GitHub (or another server) is the **remote**, usually called \`origin\`.
- \`git fetch\` **downloads** the remote's changes without touching your files; \`git pull\` is \`fetch\` + **integrating them** (merge or rebase) into your branch; \`git push\` **uploads** your commits.
- \`git stash\` stores your unfinished changes to leave the working directory clean, and \`git stash pop\` brings them back.

**The typical flow (GitHub flow):** create a branch per feature → make small commits with good messages → \`push\` → open a **Pull Request** (PR) → teammates do **code review** and **CI** runs the tests → if all is well, **merge** into \`main\`.`,
      ),
      code(`git switch -c feature/login        # rama nueva para la funcionalidad
git add -p                          # agregar cambios por partes (eliges cuáles)
git commit -m "Agrega formulario de login"
git fetch origin                    # descarga lo nuevo del remoto
git rebase origin/main              # pone tus commits encima de main (solo si la rama es tuya)
git push -u origin feature/login    # sube tu rama
# ...y abres el Pull Request

git log --oneline --graph           # la historia como un dibujo de ramas
git stash                           # guarda cambios sin terminar
git stash pop                       # los regresa
git revert a1b2c3d                  # deshace ese commit de forma segura`, 'bash'),
      warn('`git push --force` en una rama compartida puede borrar el trabajo de otros. Si de verdad necesitas forzar (por ejemplo, después de un rebase de tu propia rama), usa `--force-with-lease`, que se niega si alguien más subió cambios.', '`git push --force` on a shared branch can erase other people\'s work. If you really need to force (for example, after rebasing your own branch), use `--force-with-lease`, which refuses if someone else pushed changes.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Commit | Foto del proyecto con mensaje y un puntero a su padre |
| Tres zonas | Directorio de trabajo → \`add\` → staging → \`commit\` → repositorio |
| Rama | Un puntero que avanza con cada commit |
| HEAD | Dónde estás parado (normalmente, tu rama actual) |
| merge / rebase | Commit de unión y conserva la historia / historia lineal que reescribe commits (nunca en ramas compartidas) |
| Conflicto | Las dos ramas cambiaron las mismas líneas: editas, borras los marcadores, \`add\` y \`commit\` |
| reset / revert | Mueve la rama atrás y reescribe / commit nuevo que deshace, seguro |
| fetch / pull / push | Descargar / descargar e integrar / subir |
| GitHub flow | Rama → commits → push → PR → review y CI → merge |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Commit | A project snapshot with a message and a pointer to its parent |
| Three areas | Working directory → \`add\` → staging → \`commit\` → repository |
| Branch | A pointer that moves forward with each commit |
| HEAD | Where you are standing (usually, your current branch) |
| merge / rebase | Merge commit, keeps history / linear history that rewrites commits (never on shared branches) |
| Conflict | Both branches changed the same lines: edit, delete markers, \`add\` and \`commit\` |
| reset / revert | Moves the branch back and rewrites / a new commit that undoes, safe |
| fetch / pull / push | Download / download and integrate / upload |
| GitHub flow | Branch → commits → push → PR → review and CI → merge |`,
      ),
    ],
    quiz: [
      q('Una rama en Git es…', 'A branch in Git is…', [['Una copia completa del repositorio', 'A full copy of the repository'], ['Un puntero móvil a un commit', 'A movable pointer to a commit'], ['Un servidor remoto', 'A remote server'], ['Un archivo de configuración', 'A config file']], 1,
        'Por eso crear una rama es instantáneo.', 'That is why creating a branch is instant.'),
      q('Para deshacer un commit ya publicado de forma segura usas…', 'To safely undo an already pushed commit you use…', [['git reset --hard', 'git reset --hard'], ['git revert', 'git revert'], ['git push --force', 'git push --force'], ['Borrar la carpeta .git', 'Delete the .git folder']], 1,
        'Crea un commit nuevo que deshace el cambio, sin reescribir la historia.', 'It creates a new commit that undoes the change, without rewriting history.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué guarda un commit?', 'What does a commit store?', [['Solo el archivo que cambió', 'Only the file that changed'], ['Una foto del proyecto con mensaje, autor y un puntero a su commit padre', 'A project snapshot with message, author and a pointer to its parent commit'], ['La contraseña del repositorio', 'The repository password'], ['Una rama', 'A branch']], 1,
        'Cada commit se identifica con un hash.', 'Each commit is identified by a hash.'),
      q('¿Cuál es el orden de las tres zonas de Git?', 'What is the order of Git\'s three areas?', [['Repositorio → staging → directorio de trabajo', 'Repository → staging → working directory'], ['Directorio de trabajo → staging (`git add`) → repositorio (`git commit`)', 'Working directory → staging (`git add`) → repository (`git commit`)'], ['Staging → repositorio → remoto', 'Staging → repository → remote'], ['No hay zonas', 'There are no areas']], 1,
        'El staging te deja elegir qué entra en cada commit.', 'Staging lets you choose what goes into each commit.'),
      q('¿Qué es HEAD?', 'What is HEAD?', [['El primer commit del proyecto', 'The project\'s first commit'], ['El puntero que dice dónde estás parado (normalmente tu rama actual)', 'The pointer saying where you are standing (usually your current branch)'], ['El servidor principal', 'The main server'], ['El último commit de main siempre', 'Always the latest commit of main']], 1,
        'Al cambiar de rama, HEAD pasa a apuntar a la otra rama.', 'When you switch branches, HEAD points to the other branch.'),
      q('Haces un commit en la rama `feature`. ¿Qué pasa con `main`?', 'You commit on the `feature` branch. What happens to `main`?', [['Avanza también', 'It moves forward too'], ['Se queda donde estaba: solo avanza el puntero de `feature`', 'It stays where it was: only `feature`\'s pointer moves'], ['Se borra', 'It is deleted'], ['Se une con feature', 'It merges with feature']], 1,
        'Cada rama es un puntero independiente.', 'Each branch is an independent pointer.'),
      q('¿Qué diferencia hay entre merge y rebase?', 'What is the difference between merge and rebase?', [['Ninguna', 'None'], ['merge conserva la historia con un commit de unión; rebase reaplica tus commits encima y deja una historia lineal reescrita', 'merge keeps history with a merge commit; rebase re-applies your commits on top leaving a rewritten linear history'], ['rebase es más seguro en ramas compartidas', 'rebase is safer on shared branches'], ['merge borra commits', 'merge deletes commits']], 1,
        'Por eso no se hace rebase de ramas que otros usan.', 'That is why you do not rebase branches others use.'),
      q('¿Qué es un merge **fast-forward**?', 'What is a **fast-forward** merge?', [['Un merge con conflictos', 'A merge with conflicts'], ['Cuando la rama destino no avanzó: Git solo mueve su puntero hacia adelante, sin commit de unión', 'When the target branch did not move: Git just moves its pointer forward, with no merge commit'], ['Un rebase rápido', 'A quick rebase'], ['Un push forzado', 'A forced push']], 1,
        'No hay nada que unir: la historia ya es lineal.', 'There is nothing to join: the history is already linear.'),
      q('¿Cuándo aparece un conflicto de merge?', 'When does a merge conflict appear?', [['Cuando dos ramas cambiaron las mismas líneas de un archivo', 'When two branches changed the same lines of a file'], ['Cuando dos personas usan Git a la vez', 'When two people use Git at the same time'], ['Cuando el repositorio es muy grande', 'When the repository is very large'], ['Siempre que haces merge', 'Every time you merge']], 0,
        'Si cambiaron partes distintas, Git las une solo.', 'If they changed different parts, Git merges them by itself.'),
      q('Después de editar un archivo con conflicto y borrar los marcadores, ¿qué haces?', 'After editing a conflicted file and deleting the markers, what do you do?', [['`git reset --hard`', '`git reset --hard`'], ['Probar que funcione y luego `git add` y `git commit`', 'Test that it works and then `git add` and `git commit`'], ['Borrar la rama', 'Delete the branch'], ['`git push --force`', '`git push --force`']], 1,
        'O `git rebase --continue` si estabas en un rebase.', 'Or `git rebase --continue` if you were rebasing.'),
      q('¿Qué hace `git reset --hard` con tus cambios sin guardar?', 'What does `git reset --hard` do with your unsaved changes?', [['Los guarda en staging', 'Keeps them in staging'], ['Los borra', 'Deletes them'], ['Los sube al remoto', 'Pushes them to the remote'], ['Los convierte en un commit', 'Turns them into a commit']], 1,
        '`--soft` los deja en staging y `--mixed` en el directorio de trabajo.', '`--soft` leaves them in staging and `--mixed` in the working directory.'),
      q('¿Qué diferencia hay entre `git fetch` y `git pull`?', 'What is the difference between `git fetch` and `git pull`?', [['Son iguales', 'They are the same'], ['fetch solo descarga los cambios; pull descarga e integra en tu rama', 'fetch only downloads changes; pull downloads and integrates them into your branch'], ['pull sube cambios', 'pull uploads changes'], ['fetch borra tu rama', 'fetch deletes your branch']], 1,
        'Para subir tus commits se usa `git push`.', 'To upload your commits you use `git push`.'),
      q('¿Por qué es peligroso `git push --force` en una rama compartida?', 'Why is `git push --force` dangerous on a shared branch?', [['Porque es lento', 'Because it is slow'], ['Porque puede borrar los commits que otros subieron', 'Because it can erase commits others pushed'], ['Porque no funciona', 'Because it does not work'], ['No es peligroso', 'It is not dangerous']], 1,
        '`--force-with-lease` se niega si alguien más subió cambios.', '`--force-with-lease` refuses if someone else pushed changes.'),
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
    summary: l('Los comandos esenciales, rutas, tuberías y redirección, permisos con chmod, procesos y señales, y cómo revisar un servidor que va lento.', 'The essential commands, paths, pipes and redirection, permissions with chmod, processes and signals, and how to check a slow server.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Por qué Linux?
Casi todos los servidores de internet corren **Linux**, y muchas veces no tienen interfaz gráfica: se manejan desde la **terminal**, escribiendo comandos en un programa llamado **shell** (el más común es **bash**). Saber moverte ahí es básico para revisar logs, desplegar y depurar.

Un comando tiene la forma \`comando -opciones argumentos\`: \`ls -l /var/log\` lista (\`ls\`) en formato largo (\`-l\`) la carpeta \`/var/log\`. \`man comando\` o \`comando --help\` explican cada uno.

**Rutas:**
- **Absoluta:** empieza en la raíz \`/\`: \`/home/ana/proyecto\`.
- **Relativa:** desde donde estás: \`proyecto/src\`.
- \`.\` es la carpeta actual, \`..\` la de arriba y \`~\` tu carpeta personal.

## Los comandos esenciales
| Comando | Para qué |
|---|---|
| \`pwd\`, \`ls -la\`, \`cd\` | Dónde estoy, qué hay (incluso ocultos), moverme |
| \`mkdir\`, \`cp\`, \`mv\`, \`rm\` | Crear carpetas, copiar, mover o renombrar, borrar (**sin papelera**: \`rm\` no se deshace) |
| \`cat\`, \`less\`, \`head\`, \`tail\` | Ver archivos: completo, por páginas, el inicio, el final |
| \`tail -f app.log\` | Seguir un log **en vivo**: muestra lo nuevo conforme se escribe |
| \`grep "texto" archivo\`, \`grep -r "texto" .\` | Buscar texto en un archivo o en toda una carpeta |
| \`find . -name "*.py"\` | Buscar archivos por nombre |
| \`chmod\`, \`chown\` | Cambiar permisos y dueño |
| \`ps aux\`, \`top\`, \`kill\` | Ver procesos, ver el uso de CPU y memoria en vivo, detener un proceso |
| \`df -h\`, \`free -h\` | Espacio en disco y memoria libre |
| \`curl https://…\` | Hacer peticiones HTTP desde la terminal |
| \`ssh usuario@servidor\`, \`scp\` | Conectarte a otro servidor y copiar archivos hacia él |`,
        `## Why Linux?
Almost every server on the internet runs **Linux**, and many have no graphical interface: they are run from the **terminal**, typing commands into a program called a **shell** (the most common is **bash**). Knowing your way around it is basic for checking logs, deploying and debugging.

A command looks like \`command -options arguments\`: \`ls -l /var/log\` lists (\`ls\`) in long format (\`-l\`) the \`/var/log\` folder. \`man command\` or \`command --help\` explain each one.

**Paths:**
- **Absolute:** starts at the root \`/\`: \`/home/ana/project\`.
- **Relative:** from where you are: \`project/src\`.
- \`.\` is the current folder, \`..\` the one above and \`~\` your home folder.

## The essential commands
| Command | What for |
|---|---|
| \`pwd\`, \`ls -la\`, \`cd\` | Where am I, what is here (even hidden), move around |
| \`mkdir\`, \`cp\`, \`mv\`, \`rm\` | Create folders, copy, move or rename, delete (**no recycle bin**: \`rm\` cannot be undone) |
| \`cat\`, \`less\`, \`head\`, \`tail\` | View files: whole, page by page, the start, the end |
| \`tail -f app.log\` | Follow a log **live**: shows what is new as it is written |
| \`grep "text" file\`, \`grep -r "text" .\` | Search text in a file or a whole folder |
| \`find . -name "*.py"\` | Find files by name |
| \`chmod\`, \`chown\` | Change permissions and owner |
| \`ps aux\`, \`top\`, \`kill\` | List processes, see CPU and memory use live, stop a process |
| \`df -h\`, \`free -h\` | Disk space and free memory |
| \`curl https://…\` | Make HTTP requests from the terminal |
| \`ssh user@server\`, \`scp\` | Connect to another server and copy files to it |`,
      ),
      md(
        `## Tuberías y redirección
La filosofía de Linux: **programas pequeños que hacen una sola cosa** y se combinan.
- \`|\` (**tubería** o *pipe*) pasa la **salida** de un comando como **entrada** del siguiente.
- \`>\` escribe la salida en un archivo (**lo reemplaza**); \`>>\` la **agrega al final**.
- \`2>\` redirige los **errores** (que salen por otro canal).

Ejemplo clásico: las 5 IPs que más peticiones hicieron, leyendo un log de acceso, pieza por pieza:`,
        `## Pipes and redirection
Linux's philosophy: **small programs that do one thing** and are combined.
- \`|\` (**pipe**) passes one command's **output** as the next one's **input**.
- \`>\` writes the output to a file (**replacing it**); \`>>\` **appends it to the end**.
- \`2>\` redirects **errors** (which come out on another channel).

Classic example: the 5 IPs that made the most requests, reading an access log, piece by piece:`,
      ),
      code(`# Las 5 IPs con más peticiones en un log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
#   cat         lee el archivo
#   awk         se queda con la primera columna (la IP)
#   sort        ordena, para que las IPs iguales queden juntas
#   uniq -c     cuenta cuántas veces se repite cada una
#   sort -rn    ordena por ese número, de mayor a menor
#   head -5     se queda con las primeras 5

# Seguir un log en vivo y ver solo los errores
tail -f app.log | grep ERROR

# Guardar la lista de procesos en un archivo (reemplaza) y agregar la fecha al final
ps aux > procesos.txt
date >> procesos.txt`, 'bash'),
      md(
        `Para entender qué hace esa tubería, este código de Python hace lo mismo con un log pequeño. \`conteo.items()\` da los pares (clave, valor) del diccionario, y \`reverse=True\` ordena de mayor a menor.`,
        `To understand what that pipeline does, this Python code does the same with a small log. \`conteo.items()\` gives the dictionary's (key, value) pairs, and \`reverse=True\` sorts largest first.`,
      ),
      code(`log = """10.0.0.1 GET /
10.0.0.2 GET /login
10.0.0.1 POST /login
10.0.0.3 GET /
10.0.0.1 GET /perfil"""

conteo = {}
for linea in log.split("\\n"):
    ip = linea.split()[0]                       # awk '{print $1}': la primera columna
    conteo[ip] = conteo.get(ip, 0) + 1          # sort | uniq -c: contar cada IP

top = sorted(conteo.items(), key=lambda par: par[1], reverse=True)   # sort -rn
print(top[:2])                                  # imprime: [('10.0.0.1', 3), ('10.0.0.2', 1)]   (como head -2)`),
      md(
        `## Permisos
Cada archivo tiene permisos para tres grupos de personas: el **dueño**, el **grupo** y **los demás**. Para cada uno hay tres permisos: **r** (leer), **w** (escribir) y **x** (ejecutar; en una carpeta, entrar). \`ls -l\` los muestra así: \`-rwxr-xr-x\` (el primer carácter dice si es archivo \`-\` o carpeta \`d\`).

Con números, cada permiso vale: **r = 4, w = 2, x = 1**, y se suman por grupo:
- \`7\` = 4 + 2 + 1 = **rwx** (todo).
- \`5\` = 4 + 1 = **r-x** (leer y ejecutar).
- \`4\` = **r--** (solo leer).

\`chmod 755 script.sh\` → el dueño puede todo; el grupo y los demás, leer y ejecutar. \`chmod 644 notas.txt\` → el dueño lee y escribe; los demás solo leen. \`chmod +x script.sh\` agrega permiso de ejecución. \`sudo\` ejecuta un comando como administrador.`,
        `## Permissions
Each file has permissions for three groups of people: the **owner**, the **group** and **others**. For each there are three permissions: **r** (read), **w** (write) and **x** (execute; for a folder, enter it). \`ls -l\` shows them like this: \`-rwxr-xr-x\` (the first character says whether it is a file \`-\` or a folder \`d\`).

As numbers, each permission is worth: **r = 4, w = 2, x = 1**, added up per group:
- \`7\` = 4 + 2 + 1 = **rwx** (everything).
- \`5\` = 4 + 1 = **r-x** (read and execute).
- \`4\` = **r--** (read only).

\`chmod 755 script.sh\` → the owner can do everything; group and others, read and execute. \`chmod 644 notes.txt\` → the owner reads and writes; others only read. \`chmod +x script.sh\` adds execute permission. \`sudo\` runs a command as an administrator.`,
      ),
      code(`def a_octal(permisos):                  # "rwxr-xr-x" → "755"
    valores = {"r": 4, "w": 2, "x": 1, "-": 0}
    res = ""
    for i in range(0, 9, 3):            # tres grupos de 3 letras: dueño, grupo, otros
        total = 0
        for letra in permisos[i:i + 3]:
            total += valores[letra]
        res += str(total)
    return res

print(a_octal("rwxr-xr-x"), a_octal("rw-r--r--"))   # imprime: 755 644`),
      md(
        `## Procesos y señales
- \`ps aux\` lista los procesos; cada uno tiene un **PID** (su número). \`top\` (o \`htop\`) muestra en vivo cuáles usan más CPU y memoria.
- \`kill PID\` le pide al proceso que **termine** (señal **SIGTERM**): puede cerrar archivos y despedirse bien. \`kill -9 PID\` lo **mata de inmediato** (señal **SIGKILL**), sin darle oportunidad de limpiar: úsalo solo si el otro no funciona.
- Agregar \`&\` al final de un comando lo corre en **segundo plano**.
- Los logs del sistema suelen estar en \`/var/log\`.

**Variables de entorno:** valores de configuración que heredan los procesos. \`export API_KEY=…\` crea una; \`echo $PATH\` muestra \`PATH\`, la lista de carpetas donde la shell busca los comandos. Por eso los secretos de una app se pasan como variables de entorno y no dentro del código.

**Si un servidor va lento**, un primer recorrido: \`top\` (¿algún proceso usa toda la CPU o la memoria?), \`free -h\` (¿queda memoria?), \`df -h\` (¿se llenó el disco?) y \`tail -f\` o \`grep\` sobre los logs (¿hay errores?).`,
        `## Processes and signals
- \`ps aux\` lists processes; each has a **PID** (its number). \`top\` (or \`htop\`) shows live which use the most CPU and memory.
- \`kill PID\` asks the process to **finish** (**SIGTERM** signal): it can close files and exit cleanly. \`kill -9 PID\` **kills it immediately** (**SIGKILL** signal), with no chance to clean up: use it only if the other does not work.
- Adding \`&\` at the end of a command runs it in the **background**.
- System logs are usually in \`/var/log\`.

**Environment variables:** configuration values processes inherit. \`export API_KEY=…\` creates one; \`echo $PATH\` shows \`PATH\`, the list of folders where the shell looks for commands. That is why an app's secrets are passed as environment variables and not inside the code.

**If a server is slow**, a first pass: \`top\` (is some process using all the CPU or memory?), \`free -h\` (is there memory left?), \`df -h\` (is the disk full?) and \`tail -f\` or \`grep\` on the logs (are there errors?).`,
      ),
      md(
        `## Resumen
| Tema | En una frase |
|---|---|
| Rutas | Absoluta desde \`/\`; relativa desde donde estás; \`.\` aquí, \`..\` arriba, \`~\` tu carpeta |
| Ver archivos | \`cat\`, \`less\`, \`head\`, \`tail\`; \`tail -f\` sigue un log en vivo |
| Buscar | \`grep\` busca texto; \`find\` busca archivos |
| \`\\|\` | La salida de un comando entra al siguiente |
| \`>\` / \`>>\` | Escribir reemplazando / agregar al final |
| Permisos | r = 4, w = 2, x = 1 por dueño, grupo y otros: 755, 644 |
| Procesos | \`ps aux\`, \`top\`; \`kill\` (SIGTERM) antes que \`kill -9\` (SIGKILL) |
| Variables de entorno | Configuración y secretos fuera del código; \`$PATH\` |
| Servidor lento | \`top\`, \`free -h\`, \`df -h\` y los logs |`,
        `## Summary
| Topic | In one sentence |
|---|---|
| Paths | Absolute from \`/\`; relative from where you are; \`.\` here, \`..\` up, \`~\` your folder |
| Viewing files | \`cat\`, \`less\`, \`head\`, \`tail\`; \`tail -f\` follows a log live |
| Searching | \`grep\` searches text; \`find\` finds files |
| \`\\|\` | One command's output goes into the next |
| \`>\` / \`>>\` | Write replacing / append to the end |
| Permissions | r = 4, w = 2, x = 1 for owner, group and others: 755, 644 |
| Processes | \`ps aux\`, \`top\`; \`kill\` (SIGTERM) before \`kill -9\` (SIGKILL) |
| Environment variables | Configuration and secrets outside the code; \`$PATH\` |
| Slow server | \`top\`, \`free -h\`, \`df -h\` and the logs |`,
      ),
    ],
    quiz: [
      q('¿Qué hace `tail -f app.log`?', 'What does `tail -f app.log` do?', [['Borra el log', 'Deletes the log'], ['Muestra el final del log y sigue mostrando lo nuevo en vivo', 'Shows the end of the log and keeps showing new lines live'], ['Comprime el log', 'Compresses the log'], ['Busca errores', 'Searches for errors']], 1,
        'Muy útil para ver qué pasa en un servidor mientras ocurre.', 'Very useful to see what is happening on a server as it happens.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es `..` en una ruta?', 'What is `..` in a path?', [['La carpeta actual', 'The current folder'], ['La carpeta de arriba (la que la contiene)', 'The folder above (the one containing it)'], ['Tu carpeta personal', 'Your home folder'], ['La raíz', 'The root']], 1,
        '`.` es la carpeta actual y `~` tu carpeta personal.', '`.` is the current folder and `~` your home folder.'),
      q('¿Qué tiene de especial `rm` frente a borrar un archivo en el explorador?', 'What is special about `rm` compared with deleting a file in the file explorer?', [['Nada', 'Nothing'], ['No hay papelera: no se puede deshacer', 'There is no recycle bin: it cannot be undone'], ['Es más lento', 'It is slower'], ['Solo borra carpetas', 'It only deletes folders']], 1,
        'Por eso hay que revisar bien antes de borrar, sobre todo con `rm -r`.', 'That is why you check carefully before deleting, especially with `rm -r`.'),
      q('¿Qué hace `|` entre dos comandos?', 'What does `|` do between two commands?', [['Los ejecuta en paralelo', 'Runs them in parallel'], ['Pasa la salida del primero como entrada del segundo', 'Passes the first one\'s output as the second one\'s input'], ['Guarda en un archivo', 'Saves to a file'], ['Compara sus resultados', 'Compares their results']], 1,
        'Así se combinan programas pequeños.', 'That is how small programs are combined.'),
      q('¿Qué diferencia hay entre `> archivo` y `>> archivo`?', 'What is the difference between `> file` and `>> file`?', [['Ninguna', 'None'], ['`>` reemplaza el contenido; `>>` lo agrega al final', '`>` replaces the contents; `>>` appends to the end'], ['`>>` borra el archivo', '`>>` deletes the file'], ['`>` solo escribe errores', '`>` only writes errors']], 1,
        'Los errores se redirigen con `2>`.', 'Errors are redirected with `2>`.'),
      q('En `sort | uniq -c`, ¿por qué hace falta el `sort` antes?', 'In `sort | uniq -c`, why is the `sort` needed first?', [['Para que se vea bonito', 'To make it look nice'], ['Porque `uniq` solo junta líneas iguales que están seguidas', 'Because `uniq` only groups identical lines that are next to each other'], ['Porque `uniq` borra todo', 'Because `uniq` deletes everything'], ['No hace falta', 'It is not needed']], 1,
        'Ordenar deja juntas las líneas iguales para poder contarlas.', 'Sorting puts identical lines together so they can be counted.'),
      q('¿Qué significa `chmod 755 script.sh`?', 'What does `chmod 755 script.sh` mean?', [['Nadie puede ejecutarlo', 'Nobody can run it'], ['El dueño puede todo; el grupo y los demás, leer y ejecutar', 'The owner can do everything; group and others can read and execute'], ['Todos pueden todo', 'Everyone can do everything'], ['Solo el dueño puede leer', 'Only the owner can read']], 1,
        '7 = rwx (4+2+1) y 5 = r-x (4+1).', '7 = rwx (4+2+1) and 5 = r-x (4+1).'),
      q('¿Qué número de permisos corresponde a `rw-r--r--`?', 'Which permission number matches `rw-r--r--`?', [['755', '755'], ['644', '644'], ['777', '777'], ['600', '600']], 1,
        'rw- = 4+2 = 6, r-- = 4 y r-- = 4.', 'rw- = 4+2 = 6, r-- = 4 and r-- = 4.'),
      q('¿Qué diferencia hay entre `kill PID` y `kill -9 PID`?', 'What is the difference between `kill PID` and `kill -9 PID`?', [['Ninguna', 'None'], ['`kill` pide terminar (SIGTERM) y deja limpiar; `-9` mata de inmediato (SIGKILL)', '`kill` asks to finish (SIGTERM) and allows cleanup; `-9` kills immediately (SIGKILL)'], ['`-9` reinicia el proceso', '`-9` restarts the process'], ['`kill` borra el programa', '`kill` deletes the program'], ], 1,
        'Primero se intenta con SIGTERM.', 'First you try SIGTERM.'),
      q('¿Qué guarda la variable de entorno `PATH`?', 'What does the `PATH` environment variable hold?', [['Tu contraseña', 'Your password'], ['La lista de carpetas donde la shell busca los comandos', 'The list of folders where the shell looks for commands'], ['La carpeta actual', 'The current folder'], ['El historial de comandos', 'The command history']], 1,
        'Si un programa no está en esas carpetas, tienes que escribir su ruta completa.', 'If a program is not in those folders, you have to type its full path.'),
      q('Un servidor va muy lento. ¿Qué revisas primero?', 'A server is very slow. What do you check first?', [['Reinstalar Linux', 'Reinstall Linux'], ['`top` (CPU y memoria), `free -h`, `df -h` y los logs', '`top` (CPU and memory), `free -h`, `df -h` and the logs'], ['`rm -rf /`', '`rm -rf /`'], ['Nada, esperar', 'Nothing, wait']], 1,
        'Así ves si es la CPU, la memoria, el disco lleno o un error.', 'That shows whether it is the CPU, memory, a full disk or an error.'),
    ],
    concepts: [concept('Significado de chmod 755', 'Meaning of chmod 755', 'Dueño rwx (7); grupo y otros r-x (5).', 'Owner rwx (7); group and others r-x (5).')],
  },
  {
    id: 'docker-cloud',
    track: 'systems',
    title: l('Docker y la nube', 'Docker and the cloud'),
    summary: l('Qué problema resuelven los contenedores, en qué se diferencian de una máquina virtual, imágenes y Dockerfiles, docker compose, y los conceptos básicos de la nube.', 'What problem containers solve, how they differ from a virtual machine, images and Dockerfiles, docker compose, and the basic concepts of the cloud.'),
    minutes: 22,
    blocks: [
      md(
        `## El problema: "en mi máquina sí funciona"
Tu app funciona en tu laptop, pero en el servidor falla: hay otra versión de Python, falta una librería o el sistema operativo es distinto. Un **contenedor** empaqueta tu aplicación **junto con todo lo que necesita** (el lenguaje, las librerías, la configuración) para que corra **igual en cualquier lugar**: tu laptop, la de tu compañero o el servidor.

**Analogía:** los contenedores de los barcos. Antes cada carga se acomodaba distinto; con un contenedor estándar, cualquier barco, grúa o camión lo puede mover sin saber qué lleva adentro.

## Contenedor vs máquina virtual
| | Máquina virtual (VM) | Contenedor |
|---|---|---|
| Qué virtualiza | El **hardware**: cada VM trae su **sistema operativo completo** | El **sistema operativo**: comparte el **kernel** del anfitrión y aísla solo el proceso |
| Tamaño | Gigabytes | Megabytes |
| Arranque | Minutos | Segundos |
| Aislamiento | Más fuerte | Suficiente para la mayoría de las apps |

El **kernel** es el núcleo del sistema operativo: la parte que maneja la memoria, los procesos y el hardware.`,
        `## The problem: "it works on my machine"
Your app works on your laptop, but on the server it fails: there is another Python version, a library is missing or the operating system is different. A **container** packages your application **together with everything it needs** (the language, the libraries, the configuration) so it runs **the same anywhere**: your laptop, your teammate's or the server.

**Analogy:** shipping containers. Before, each cargo was packed differently; with a standard container, any ship, crane or truck can move it without knowing what is inside.

## Container vs virtual machine
| | Virtual machine (VM) | Container |
|---|---|---|
| What it virtualizes | The **hardware**: each VM carries its **full operating system** | The **operating system**: it shares the host's **kernel** and isolates just the process |
| Size | Gigabytes | Megabytes |
| Startup | Minutes | Seconds |
| Isolation | Stronger | Enough for most apps |

The **kernel** is the core of the operating system: the part that manages memory, processes and hardware.`,
      ),
      md(
        `## Imagen y contenedor
- Una **imagen** es la **plantilla** inmutable: el sistema de archivos con tu app y sus dependencias, lista para usarse. Se construye a partir de un **Dockerfile**.
- Un **contenedor** es una **instancia en ejecución** de una imagen. De una misma imagen puedes levantar muchos contenedores.

Es la misma relación que **clase y objeto** de la lección de OOP: la imagen es el molde y el contenedor, la cosa concreta. Las imágenes se comparten en un **registro** como Docker Hub.

## El Dockerfile
Es la **receta** para construir la imagen, paso a paso:
| Instrucción | Qué hace |
|---|---|
| \`FROM\` | La imagen base de la que partes (por ejemplo, una con Node o Python ya instalado) |
| \`WORKDIR\` | La carpeta de trabajo dentro de la imagen |
| \`COPY\` | Copia archivos de tu proyecto a la imagen |
| \`RUN\` | Ejecuta un comando **al construir** (instalar dependencias) |
| \`EXPOSE\` | Documenta en qué puerto escucha la app |
| \`CMD\` | El comando que se ejecuta **al arrancar** el contenedor |

**Las capas y el caché:** cada instrucción crea una **capa**, y Docker reutiliza las capas que no cambiaron. Por eso se copia primero solo \`package.json\` y se instalan las dependencias, y **después** el resto del código: si solo cambias tu código, Docker no reinstala todo.`,
        `## Image and container
- An **image** is the immutable **template**: the filesystem with your app and its dependencies, ready to use. It is built from a **Dockerfile**.
- A **container** is a **running instance** of an image. From the same image you can start many containers.

It is the same relationship as **class and object** from the OOP lesson: the image is the mold and the container, the concrete thing. Images are shared in a **registry** like Docker Hub.

## The Dockerfile
It is the **recipe** for building the image, step by step:
| Instruction | What it does |
|---|---|
| \`FROM\` | The base image you start from (for example, one with Node or Python already installed) |
| \`WORKDIR\` | The working folder inside the image |
| \`COPY\` | Copies files from your project into the image |
| \`RUN\` | Runs a command **at build time** (installing dependencies) |
| \`EXPOSE\` | Documents which port the app listens on |
| \`CMD\` | The command run **when the container starts** |

**Layers and cache:** each instruction creates a **layer**, and Docker reuses layers that did not change. That is why you first copy only \`package.json\` and install dependencies, and **then** the rest of the code: if you only change your code, Docker does not reinstall everything.`,
      ),
      code(`# Dockerfile para una app de Node
# (en un Dockerfile los comentarios van en su propia línea)

# Imagen base con Node 22 (alpine = una versión pequeña de Linux)
FROM node:22-alpine
WORKDIR /app

# Primero solo la lista de dependencias, y se instalan:
# esta capa se reutiliza mientras package.json no cambie
COPY package*.json ./
RUN npm ci --omit=dev

# Después el resto del código
COPY . .
EXPOSE 3000

# Lo que corre al arrancar el contenedor
CMD ["node", "server.js"]`, 'dockerfile'),
      code(`docker build -t mi-app .            # construye la imagen desde el Dockerfile de esta carpeta
docker run -p 8080:3000 mi-app      # arranca un contenedor; el puerto 8080 de tu máquina va al 3000 del contenedor
docker ps                           # contenedores corriendo
docker logs <id>                    # lo que imprimió un contenedor
docker compose up                   # levanta todos los servicios de docker-compose.yml`, 'bash'),
      md(
        `## docker compose: varios servicios juntos
Una app real suele necesitar varias piezas: la app, una base de datos, Redis. **docker compose** las describe en un archivo YAML y las levanta juntas con un solo comando. Dos ideas importantes:
- **Puertos:** \`"8080:3000"\` significa "el puerto 8080 de mi máquina va al 3000 del contenedor".
- **Volúmenes:** el sistema de archivos de un contenedor **se pierde** cuando lo borras. Para datos que deben durar (los de la base de datos), se usa un **volumen**, que vive fuera del contenedor.
- **Variables de entorno** para la configuración y los secretos, nunca escritos dentro de la imagen.`,
        `## docker compose: several services together
A real app usually needs several pieces: the app, a database, Redis. **docker compose** describes them in a YAML file and starts them together with a single command. Important ideas:
- **Ports:** \`"8080:3000"\` means "port 8080 on my machine goes to the container's 3000".
- **Volumes:** a container's filesystem **is lost** when you delete it. For data that must last (the database's), you use a **volume**, which lives outside the container.
- **Environment variables** for configuration and secrets, never written into the image.`,
      ),
      code(`# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "8080:3000"
    environment:
      DATABASE_URL: postgres://app:secreto@db:5432/tienda   # "db" es el nombre del otro servicio
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secreto
    volumes:
      - datos:/var/lib/postgresql/data    # los datos sobreviven aunque borres el contenedor
volumes:
  datos:`, 'yaml'),
      md(
        `## La nube
La **nube** es usar servidores, almacenamiento y servicios de otra empresa (AWS, Google Cloud, Azure) en vez de comprar y mantener los tuyos: pagas por lo que usas y puedes crecer en minutos.

**IaaS, PaaS y SaaS** dicen **cuánto administras tú**:
| Modelo | Tú administras | Ejemplo |
|---|---|---|
| **IaaS** (infraestructura) | El sistema operativo, el runtime y tu app; el proveedor da las máquinas | AWS EC2 (servidores virtuales) |
| **PaaS** (plataforma) | Solo tu app y sus datos; el proveedor corre todo lo demás | Heroku, Vercel |
| **SaaS** (software) | Nada técnico: solo lo usas | Gmail, Slack |

**Analogía de la pizza:** IaaS es rentar una cocina equipada (tú cocinas todo); PaaS es pedir a domicilio (solo pones la mesa); SaaS es comer en el restaurante.

**Servicios típicos de AWS:** **EC2** (servidores virtuales), **S3** (guardar archivos como imágenes o respaldos), **RDS** (una base de datos administrada: el proveedor hace los respaldos y las actualizaciones) y **Lambda** (*serverless*: subes una función y se ejecuta solo cuando la llaman; pagas por ejecución, aunque la primera llamada después de un rato puede tardar más, el *cold start*).

**Escalar** en la nube: **vertical** (una máquina más grande) u **horizontal** (más máquinas detrás de un balanceador), como viste en system design.`,
        `## The cloud
The **cloud** is using another company's servers, storage and services (AWS, Google Cloud, Azure) instead of buying and maintaining your own: you pay for what you use and can grow in minutes.

**IaaS, PaaS and SaaS** say **how much you manage**:
| Model | You manage | Example |
|---|---|---|
| **IaaS** (infrastructure) | The operating system, runtime and your app; the provider gives the machines | AWS EC2 (virtual servers) |
| **PaaS** (platform) | Only your app and its data; the provider runs everything else | Heroku, Vercel |
| **SaaS** (software) | Nothing technical: you just use it | Gmail, Slack |

**Pizza analogy:** IaaS is renting an equipped kitchen (you cook everything); PaaS is ordering delivery (you just set the table); SaaS is eating at the restaurant.

**Typical AWS services:** **EC2** (virtual servers), **S3** (storing files like images or backups), **RDS** (a managed database: the provider handles backups and updates) and **Lambda** (*serverless*: you upload a function and it runs only when called; you pay per execution, although the first call after a while may take longer, the *cold start*).

**Scaling** in the cloud: **vertical** (a bigger machine) or **horizontal** (more machines behind a load balancer), as you saw in system design.`,
      ),
      interview('Si te preguntan "¿contenedor o máquina virtual?": la VM virtualiza el hardware e incluye un sistema operativo completo; el contenedor virtualiza a nivel del sistema operativo y comparte el kernel, así que pesa megabytes y arranca en segundos. Las VMs aíslan más.', 'If asked "container or virtual machine?": the VM virtualizes hardware and includes a full operating system; the container virtualizes at the operating system level and shares the kernel, so it weighs megabytes and starts in seconds. VMs isolate more.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Contenedor | Tu app con todo lo que necesita, para que corra igual en cualquier lugar |
| VM vs contenedor | La VM trae un sistema operativo completo; el contenedor comparte el kernel: más ligero y rápido |
| Imagen / contenedor | La plantilla / una instancia corriendo (como clase y objeto) |
| Dockerfile | La receta: \`FROM\`, \`WORKDIR\`, \`COPY\`, \`RUN\`, \`EXPOSE\`, \`CMD\` |
| Capas | Copia primero las dependencias para aprovechar el caché |
| compose | Varios servicios juntos; \`"8080:3000"\` mapea puertos; volúmenes para datos que deben durar |
| IaaS / PaaS / SaaS | Tú administras mucho / solo tu app / nada |
| EC2, S3, RDS, Lambda | Servidores, archivos, base de datos administrada, funciones serverless |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Container | Your app with everything it needs, so it runs the same anywhere |
| VM vs container | The VM carries a full operating system; the container shares the kernel: lighter and faster |
| Image / container | The template / a running instance (like class and object) |
| Dockerfile | The recipe: \`FROM\`, \`WORKDIR\`, \`COPY\`, \`RUN\`, \`EXPOSE\`, \`CMD\` |
| Layers | Copy dependencies first to take advantage of the cache |
| compose | Several services together; \`"8080:3000"\` maps ports; volumes for data that must last |
| IaaS / PaaS / SaaS | You manage a lot / only your app / nothing |
| EC2, S3, RDS, Lambda | Servers, files, managed database, serverless functions |`,
      ),
    ],
    quiz: [
      q('Imagen vs contenedor', 'Image vs container', [['Son lo mismo', 'They are the same'], ['La imagen es la plantilla; el contenedor es una instancia en ejecución', 'The image is the template; the container is a running instance'], ['El contenedor se construye con un Dockerfile y la imagen corre', 'The container is built with a Dockerfile and the image runs'], ['La imagen es una máquina virtual', 'The image is a virtual machine']], 1,
        'Como clase y objeto.', 'Like class and object.'),
      q('Agregar más servidores detrás de un balanceador es escalado…', 'Adding more servers behind a load balancer is… scaling', [['Vertical', 'Vertical'], ['Horizontal', 'Horizontal'], ['Diagonal', 'Diagonal'], ['Serverless', 'Serverless']], 1,
        'Vertical sería una máquina más grande.', 'Vertical would be a bigger machine.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué problema resuelven los contenedores?', 'What problem do containers solve?', [['Que el código tenga errores', 'Code having bugs'], ['"En mi máquina sí funciona": la app corre igual en cualquier lugar con sus dependencias', '"It works on my machine": the app runs the same anywhere with its dependencies'], ['Que la base de datos sea lenta', 'The database being slow'], ['Que falte internet', 'Missing internet']], 1,
        'Empaquetan la app con el lenguaje, las librerías y la configuración.', 'They package the app with the language, libraries and configuration.'),
      q('¿Por qué un contenedor arranca mucho más rápido que una máquina virtual?', 'Why does a container start much faster than a virtual machine?', [['Porque usa otro lenguaje', 'Because it uses another language'], ['Porque comparte el kernel del anfitrión en vez de arrancar un sistema operativo completo', 'Because it shares the host\'s kernel instead of booting a full operating system'], ['Porque no tiene archivos', 'Because it has no files'], ['No arranca más rápido', 'It does not start faster']], 1,
        'A cambio, una VM aísla más.', 'In exchange, a VM isolates more.'),
      q('¿Qué hace la instrucción `RUN` en un Dockerfile?', 'What does the `RUN` instruction do in a Dockerfile?', [['Arranca el contenedor', 'Starts the container'], ['Ejecuta un comando al construir la imagen (por ejemplo, instalar dependencias)', 'Runs a command when building the image (for example, installing dependencies)'], ['Abre un puerto', 'Opens a port'], ['Copia archivos', 'Copies files']], 1,
        'Lo que corre al arrancar el contenedor es `CMD`.', 'What runs when the container starts is `CMD`.'),
      q('¿Por qué se copia primero `package.json` y se instala, y después el resto del código?', 'Why copy `package.json` and install first, and the rest of the code afterwards?', [['Por orden alfabético', 'Alphabetical order'], ['Para que, si solo cambia el código, Docker reutilice la capa de dependencias y no reinstale todo', 'So that, if only the code changes, Docker reuses the dependencies layer and does not reinstall everything'], ['Porque Docker lo exige', 'Because Docker requires it'], ['Para que la imagen pese menos', 'To make the image smaller']], 1,
        'Cada instrucción es una capa, y las capas que no cambiaron se reutilizan.', 'Each instruction is a layer, and unchanged layers are reused.'),
      q('¿Qué significa `docker run -p 8080:3000 mi-app`?', 'What does `docker run -p 8080:3000 mi-app` mean?', [['La app usa 8080 MB de memoria', 'The app uses 8080 MB of memory'], ['El puerto 8080 de tu máquina se conecta al 3000 del contenedor', 'Port 8080 on your machine connects to the container\'s 3000'], ['Arranca 8080 contenedores', 'It starts 8080 containers'], ['El contenedor dura 3000 segundos', 'The container lasts 3000 seconds']], 1,
        'Primero va el puerto de afuera y luego el de adentro.', 'The outside port comes first, then the inside one.'),
      q('¿Para qué sirve un **volumen** en Docker?', 'What is a Docker **volume** for?', [['Para subir el volumen del audio', 'To turn up the audio'], ['Para que los datos (como los de la base de datos) sobrevivan aunque borres el contenedor', 'So data (like the database\'s) survives even if you delete the container'], ['Para hacer la imagen más grande', 'To make the image bigger'], ['Para abrir puertos', 'To open ports']], 1,
        'El sistema de archivos del contenedor se pierde al borrarlo.', 'The container\'s filesystem is lost when it is deleted.'),
      q('¿Para qué sirve **docker compose**?', 'What is **docker compose** for?', [['Para escribir música', 'To write music'], ['Para describir y levantar juntos varios servicios (app, base de datos, Redis)', 'To describe and start several services together (app, database, Redis)'], ['Para comprimir imágenes', 'To compress images'], ['Para subir a la nube', 'To upload to the cloud']], 1,
        'Se describen en un archivo YAML y se levantan con `docker compose up`.', 'They are described in a YAML file and started with `docker compose up`.'),
      q('Vercel, donde solo subes tu app y ellos corren todo lo demás, es un ejemplo de…', 'Vercel, where you just upload your app and they run everything else, is an example of…', [['IaaS', 'IaaS'], ['PaaS', 'PaaS'], ['SaaS', 'SaaS'], ['Una máquina virtual', 'A virtual machine']], 1,
        'Con IaaS (como EC2) administrarías el sistema operativo; SaaS es solo usar el software (como Gmail).', 'With IaaS (like EC2) you would manage the operating system; SaaS is just using the software (like Gmail).'),
      q('¿Qué servicio de AWS usarías para guardar las fotos que suben los usuarios?', 'Which AWS service would you use to store photos users upload?', [['EC2', 'EC2'], ['S3', 'S3'], ['RDS', 'RDS'], ['Lambda', 'Lambda']], 1,
        'S3 guarda archivos; RDS es para bases de datos y EC2 para servidores.', 'S3 stores files; RDS is for databases and EC2 for servers.'),
      q('¿Qué es **serverless** (como AWS Lambda)?', 'What is **serverless** (like AWS Lambda)?', [['Que no hay servidores en ningún lado', 'That there are no servers anywhere'], ['Subes una función que corre solo cuando la llaman; pagas por ejecución y el proveedor maneja los servidores', 'You upload a function that runs only when called; you pay per execution and the provider handles the servers'], ['Una base de datos', 'A database'], ['Un tipo de contenedor', 'A kind of container']], 1,
        'La primera llamada después de un rato puede tardar más (cold start).', 'The first call after a while may take longer (cold start).'),
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
    summary: l('Qué es la integración continua, cómo funciona un pipeline, la diferencia entre continuous delivery y continuous deployment, y las estrategias para desplegar con menos riesgo.', 'What continuous integration is, how a pipeline works, the difference between continuous delivery and continuous deployment, and strategies for deploying with less risk.'),
    minutes: 18,
    blocks: [
      md(
        `## CI: integración continua
**El problema:** si cada quien trabaja semanas en su rama y luego todos intentan unir sus cambios, aparecen conflictos y errores difíciles de rastrear. Y si las pruebas se corren "cuando alguien se acuerda", los errores llegan a producción.

**La idea:** integrar cambios **pequeños y seguido**, y que **un servidor revise automáticamente cada uno**. Con cada push o Pull Request, un servicio como **GitHub Actions** o GitLab CI **instala las dependencias, compila, revisa el estilo (*linter*) y corre las pruebas**. Si algo falla, el PR queda en **rojo** y no se hace merge hasta arreglarlo.

**Analogía:** el control de calidad de una línea de producción: cada pieza se revisa en cuanto se fabrica, no al final cuando ya armaste mil coches.

## Un pipeline por dentro
Un **pipeline** es una serie de **pasos que corren en orden**. Si uno falla, **los siguientes ya no corren**: no tiene sentido desplegar algo cuyas pruebas fallaron. En GitHub Actions se describe en un archivo YAML dentro de \`.github/workflows/\`:
- \`on\`: qué lo dispara (un push, un pull request).
- \`jobs\` y \`runs-on\`: los trabajos y en qué tipo de máquina corren.
- \`steps\`: los pasos. \`uses\` usa una acción ya hecha (como descargar tu código); \`run\` ejecuta un comando.`,
        `## CI: continuous integration
**The problem:** if everyone works for weeks on their branch and then they all try to join their changes, conflicts and hard-to-trace bugs appear. And if tests run "when someone remembers", bugs reach production.

**The idea:** integrate **small changes often**, and have **a server check each one automatically**. On every push or Pull Request, a service like **GitHub Actions** or GitLab CI **installs dependencies, builds, checks style (*linter*) and runs the tests**. If anything fails, the PR goes **red** and is not merged until fixed.

**Analogy:** quality control on a production line: each part is checked as soon as it is made, not at the end when a thousand cars are already assembled.

## Inside a pipeline
A **pipeline** is a series of **steps that run in order**. If one fails, **the following ones do not run**: there is no point deploying something whose tests failed. In GitHub Actions it is described in a YAML file inside \`.github/workflows/\`:
- \`on\`: what triggers it (a push, a pull request).
- \`jobs\` and \`runs-on\`: the jobs and which kind of machine they run on.
- \`steps\`: the steps. \`uses\` uses a ready-made action (like downloading your code); \`run\` runs a command.`,
      ),
      code(`# .github/workflows/ci.yml
name: CI
on: [push, pull_request]           # corre con cada push y cada pull request
jobs:
  test:
    runs-on: ubuntu-latest         # una máquina Linux nueva para cada ejecución
    steps:
      - uses: actions/checkout@v4  # descarga tu código
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci                # instala dependencias
      - run: npm run lint          # revisa el estilo
      - run: npm test              # corre las pruebas: si fallan, el pipeline se detiene aquí`, 'yaml'),
      code(`def correr_pipeline(pasos):
    for nombre, salio_bien in pasos:
        if not salio_bien:
            return f"falló en: {nombre}"       # los pasos siguientes ya no corren
    return "todo verde"

print(correr_pipeline([("instalar", True), ("lint", True), ("pruebas", False), ("desplegar", True)]))
# imprime: falló en: pruebas`),
      md(
        `## CD: entregar y desplegar
- **Continuous delivery** (entrega continua): cada cambio que pasa la CI queda **listo para desplegarse**, pero una persona decide cuándo (con un clic).
- **Continuous deployment** (despliegue continuo): cada cambio que pasa la CI **se despliega solo** a producción, sin intervención.

Normalmente hay varios **ambientes**: **desarrollo**, **staging** (una copia de producción para probar) y **producción** (lo que ven los usuarios).

## Desplegar con menos riesgo
- **Rolling:** se actualizan los servidores **de a poco**, uno tras otro.
- **Blue-green:** tienes **dos ambientes iguales**. Uno (azul) atiende a los usuarios mientras despliegas en el otro (verde); cuando está listo, **cambias todo el tráfico** al verde. Si algo sale mal, regresas al azul de inmediato.
- **Canary:** la versión nueva se manda primero a un **porcentaje pequeño de usuarios** (por ejemplo, 5%). Si los errores no suben, se amplía poco a poco. El nombre viene de los canarios que los mineros llevaban para detectar gases.
- **Feature flags:** el código nuevo ya está desplegado pero **apagado**, y se enciende con un interruptor (para ciertos usuarios o para todos), sin volver a desplegar.
- **Rollback:** poder **volver rápido** a la versión anterior si algo falla.

En el ejemplo, cada usuario cae siempre en la misma versión según su id, y un 10% ve la nueva.`,
        `## CD: delivering and deploying
- **Continuous delivery:** every change that passes CI is **ready to deploy**, but a person decides when (with a click).
- **Continuous deployment:** every change that passes CI **deploys itself** to production, without intervention.

There are usually several **environments**: **development**, **staging** (a copy of production for testing) and **production** (what users see).

## Deploying with less risk
- **Rolling:** servers are updated **gradually**, one after another.
- **Blue-green:** you have **two identical environments**. One (blue) serves users while you deploy to the other (green); when ready, you **switch all traffic** to green. If something goes wrong, you go back to blue immediately.
- **Canary:** the new version goes first to a **small percentage of users** (for example, 5%). If errors do not rise, it is widened little by little. The name comes from the canaries miners carried to detect gas.
- **Feature flags:** the new code is already deployed but **turned off**, and is switched on (for certain users or for everyone) without redeploying.
- **Rollback:** being able to **go back quickly** to the previous version if something fails.

In the example, each user always lands on the same version based on their id, and 10% see the new one.`,
      ),
      code(`def version_para(usuario_id, porcentaje_canary=10):
    # el mismo usuario siempre cae en la misma versión
    return "nueva" if usuario_id % 100 < porcentaje_canary else "estable"

nuevos = 0
for usuario in range(1000):
    if version_para(usuario) == "nueva":
        nuevos += 1
print(nuevos)                       # imprime: 100     (el 10% de 1000 usuarios ve la versión nueva)`),
      md(
        `## Buenas prácticas
- **Pipelines rápidos:** si tarda una hora, la gente deja de esperarlo.
- **PRs pequeños:** más fáciles de revisar y de revertir.
- **Pruebas confiables:** una prueba "inestable" (*flaky*), que a veces pasa y a veces falla sin que cambie nada, hace que todos ignoren el rojo. Hay que arreglarla o quitarla.
- **Secretos en el gestor de secretos de la CI**, nunca escritos en el YAML ni en el repositorio.
- **Vigilar después de desplegar:** errores, tiempos de respuesta, métricas.`,
        `## Good practices
- **Fast pipelines:** if it takes an hour, people stop waiting for it.
- **Small PRs:** easier to review and to revert.
- **Reliable tests:** a *flaky* test, which sometimes passes and sometimes fails with nothing changed, makes everyone ignore red. Fix it or remove it.
- **Secrets in the CI's secrets manager**, never written in the YAML or the repository.
- **Watch after deploying:** errors, response times, metrics.`,
      ),
      tip('Agregar CI a tus proyectos personales (aunque sea solo correr las pruebas en cada push) se ve muy bien en tu portafolio: muestra que trabajas como en un equipo real.', 'Adding CI to your personal projects (even if it only runs the tests on each push) looks great in your portfolio: it shows you work like a real team.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| CI | Cada push o PR se instala, compila, revisa y prueba automáticamente |
| Pipeline | Pasos en orden; si uno falla, los siguientes no corren |
| Continuous delivery / deployment | Listo para desplegar con un clic / se despliega solo |
| Ambientes | Desarrollo, staging, producción |
| Blue-green | Dos ambientes iguales; cambias el tráfico de uno al otro |
| Canary | Primero a un % pequeño de usuarios, luego a todos |
| Feature flags | Código desplegado pero apagado, que se enciende sin redesplegar |
| Rollback | Volver rápido a la versión anterior |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| CI | Every push or PR is installed, built, checked and tested automatically |
| Pipeline | Steps in order; if one fails, the next ones do not run |
| Continuous delivery / deployment | Ready to deploy with a click / deploys itself |
| Environments | Development, staging, production |
| Blue-green | Two identical environments; you switch traffic from one to the other |
| Canary | First to a small % of users, then everyone |
| Feature flags | Code deployed but switched off, turned on without redeploying |
| Rollback | Going back quickly to the previous version |`,
      ),
    ],
    quiz: [
      q('Un despliegue canary consiste en…', 'A canary deployment consists of…', [['Desplegar todo de una vez', 'Deploying everything at once'], ['Liberar la versión nueva primero a un porcentaje pequeño de usuarios', 'Releasing the new version to a small percentage of users first'], ['Desplegar solo de noche', 'Deploying only at night'], ['Tener dos ambientes iguales', 'Having two identical environments']], 1,
        'Si los errores no suben, se amplía poco a poco.', 'If errors do not rise, it is widened little by little.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué hace la **integración continua** (CI)?', 'What does **continuous integration** (CI) do?', [['Despliega a producción cada noche', 'Deploys to production every night'], ['Revisa automáticamente cada push o PR: instala, compila, linter y pruebas', 'Automatically checks every push or PR: install, build, lint and tests'], ['Escribe las pruebas por ti', 'Writes the tests for you'], ['Hace el code review', 'Does the code review']], 1,
        'Si algo falla, el PR queda en rojo y no se hace merge.', 'If anything fails, the PR goes red and is not merged.'),
      q('En un pipeline fallan las pruebas. ¿Qué pasa con el paso de desplegar que va después?', 'In a pipeline the tests fail. What happens to the deploy step that comes after?', [['Corre igual', 'It runs anyway'], ['No corre: el pipeline se detiene en el paso que falló', 'It does not run: the pipeline stops at the failing step'], ['Corre dos veces', 'It runs twice'], ['Se despliega solo la mitad', 'Only half is deployed']], 1,
        'No tiene sentido desplegar algo cuyas pruebas fallaron.', 'There is no point deploying something whose tests failed.'),
      q('En GitHub Actions, ¿qué diferencia hay entre `uses` y `run` en un paso?', 'In GitHub Actions, what is the difference between `uses` and `run` in a step?', [['Ninguna', 'None'], ['`uses` usa una acción ya hecha; `run` ejecuta un comando', '`uses` uses a ready-made action; `run` runs a command'], ['`run` es para Windows', '`run` is for Windows'], ['`uses` despliega', '`uses` deploys']], 1,
        'Por ejemplo `uses: actions/checkout@v4` y `run: npm test`.', 'For example `uses: actions/checkout@v4` and `run: npm test`.'),
      q('¿Qué diferencia hay entre continuous delivery y continuous deployment?', 'What is the difference between continuous delivery and continuous deployment?', [['Son lo mismo', 'They are the same'], ['Delivery deja todo listo para desplegar con un clic; deployment despliega solo cada cambio que pasa la CI', 'Delivery leaves everything ready to deploy with a click; deployment deploys every change that passes CI by itself'], ['Deployment no usa pruebas', 'Deployment uses no tests'], ['Delivery es para móviles', 'Delivery is for mobile']], 1,
        'La diferencia es si una persona decide cuándo desplegar.', 'The difference is whether a person decides when to deploy.'),
      q('¿Para qué sirve el ambiente de **staging**?', 'What is the **staging** environment for?', [['Para que lo usen los clientes', 'For customers to use'], ['Para probar en una copia de producción antes de desplegar de verdad', 'To test on a copy of production before deploying for real'], ['Para guardar respaldos', 'To store backups'], ['Para escribir código', 'To write code']], 1,
        'Los ambientes suelen ser desarrollo, staging y producción.', 'Environments are usually development, staging and production.'),
      q('¿Cómo funciona un despliegue **blue-green**?', 'How does a **blue-green** deployment work?', [['Se pintan los servidores', 'Servers are painted'], ['Hay dos ambientes iguales: despliegas en el que no recibe tráfico y luego cambias todo el tráfico a él', 'There are two identical environments: you deploy to the one without traffic and then switch all traffic to it'], ['Se despliega al 5% de los usuarios', 'It deploys to 5% of users'], ['Se apagan las funciones nuevas', 'New features are turned off']], 1,
        'Si algo sale mal, se regresa al otro ambiente de inmediato.', 'If something goes wrong, you go back to the other environment immediately.'),
      q('¿Qué es un **feature flag**?', 'What is a **feature flag**?', [['Una bandera en la interfaz', 'A flag in the UI'], ['Un interruptor para encender o apagar código ya desplegado sin volver a desplegar', 'A switch to turn deployed code on or off without redeploying'], ['Un tipo de prueba', 'A kind of test'], ['Una rama de Git', 'A Git branch']], 1,
        'Permite encender algo solo para algunos usuarios.', 'It lets you turn something on for just some users.'),
      q('¿Qué es una prueba **flaky** y por qué es un problema?', 'What is a **flaky** test and why is it a problem?', [['Una prueba muy lenta', 'A very slow test'], ['Una prueba que a veces pasa y a veces falla sin que cambie nada; hace que la gente ignore el rojo', 'A test that sometimes passes and sometimes fails with nothing changed; it makes people ignore red'], ['Una prueba sin assert', 'A test without assert'], ['No es un problema', 'It is not a problem']], 1,
        'Hay que arreglarla o quitarla para que el rojo vuelva a significar algo.', 'It must be fixed or removed so red means something again.'),
      q('¿Dónde van las contraseñas y llaves que necesita la CI?', 'Where do the passwords and keys CI needs go?', [['En el archivo YAML', 'In the YAML file'], ['En el gestor de secretos de la CI', 'In the CI\'s secrets manager'], ['En el README', 'In the README'], ['En un commit aparte', 'In a separate commit']], 1,
        'Nunca escritas en el YAML ni en el repositorio.', 'Never written in the YAML or the repository.'),
    ],
    concepts: [concept('Continuous delivery vs deployment', 'Continuous delivery vs deployment', 'Delivery: siempre listo para desplegar (con aprobación manual). Deployment: cada cambio que pasa la CI se despliega automáticamente.', 'Delivery: always ready to deploy (manual approval). Deployment: every change that passes CI deploys automatically.')],
  },
];
