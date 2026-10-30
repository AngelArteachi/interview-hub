import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, O, P, R } from './builders';

/* Ejercicios: procesos e hilos · concurrencia · redes.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores.
 * Los que usan hilos están escritos para dar siempre el mismo resultado. */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Procesos e hilos ---------------- */
  'processes-threads': {
    1: R('proc-cp-vs', 'basic',
      l('¿Qué diferencia hay entre un proceso y un hilo? Menciona la memoria y qué pasa si uno falla.', 'What is the difference between a process and a thread? Mention memory and what happens if one fails.'),
      l('Un **proceso** es un programa en ejecución con **su propia memoria**, aislada: si falla, los demás procesos siguen. Un **hilo** vive **dentro** de un proceso y **comparte su memoria** con los otros hilos: comunicarse es barato, pero un fallo puede tumbar todo el proceso y hay riesgo de condiciones de carrera.', 'A **process** is a running program with **its own memory**, isolated: if it fails, the other processes keep going. A **thread** lives **inside** a process and **shares its memory** with the other threads: communicating is cheap, but a failure can bring down the whole process and race conditions are a risk.')),
    2: R('proc-cp-stack', 'basic',
      l('¿Qué se guarda en el **stack** y qué en el **heap**? ¿Cuál tiene cada hilo por separado?', 'What goes on the **stack** and what on the **heap**? Which one does each thread have separately?'),
      l('El **stack** guarda las variables locales y los marcos de las llamadas; es pequeño y **cada hilo tiene el suyo**. El **heap** guarda los objetos creados en ejecución (listas, diccionarios, objetos), es más grande y lo **comparten** todos los hilos; en Python lo limpia el recolector de basura.', 'The **stack** holds local variables and call frames; it is small and **each thread has its own**. The **heap** holds objects created at runtime (lists, dictionaries, objects), is larger and **shared** by all threads; in Python the garbage collector cleans it.')),
    4: R('proc-cp-gil', 'medium',
      l('En Python, ¿usarías hilos o procesos para (a) descargar 500 imágenes de internet y (b) redimensionarlas? ¿Por qué?', 'In Python, would you use threads or processes to (a) download 500 images from the internet and (b) resize them? Why?'),
      l('(a) **Hilos** (o `asyncio`): descargar es E/S, y el GIL se libera mientras cada hilo espera la red. (b) **Procesos** (`multiprocessing`): redimensionar es CPU, y con hilos el GIL dejaría trabajar a uno solo a la vez.', '(a) **Threads** (or `asyncio`): downloading is I/O, and the GIL is released while each thread waits for the network. (b) **Processes** (`multiprocessing`): resizing is CPU work, and with threads the GIL would let only one work at a time.')),
  },

  /* ---------------- Concurrencia ---------------- */
  concurrency: {
    1: P('conc-cp-race', 'basic', l('Tres hilos se intercalan así. ¿Qué imprime?', 'Three threads interleave like this. What does it print?'),
      `saldo = 100
a = saldo             # hilo A lee
b = saldo             # hilo B lee
saldo = a + 50        # A deposita 50
c = saldo             # hilo C lee (después de A)
saldo = b + 20        # B deposita 20, con lo que leyó antes
saldo = c + 10        # C deposita 10
print(saldo)`,
      '160',
      l('B escribe 120 usando el valor viejo y **borra** el depósito de A. Luego C escribe 150 + 10 = **160**, borrando el de B. Debería ser 180: dos depósitos se pisaron.', 'B writes 120 using the old value and **erases** A\'s deposit. Then C writes 150 + 10 = **160**, erasing B\'s. It should be 180: two deposits clobbered each other.'),
      l('Sigue el valor de `saldo` línea por línea; cada hilo escribe con lo que leyó, no con el valor actual.', 'Track `saldo` line by line; each thread writes with what it read, not with the current value.')),
    3: R('conc-cp-lock', 'basic',
      l('¿Qué es una sección crítica, y qué diferencia hay entre un lock y un semáforo?', 'What is a critical section, and how does a lock differ from a semaphore?'),
      l('La **sección crítica** es el código que toca datos compartidos. Un **lock** (mutex) deja entrar a **un solo** hilo a la vez; un **semáforo** deja entrar **hasta N** (por ejemplo, máximo 10 conexiones a la vez).', 'The **critical section** is the code touching shared data. A **lock** (mutex) lets **only one** thread in at a time; a **semaphore** lets **up to N** in (for example, at most 10 connections at once).')),
    7: R('conc-cp-deadlock', 'medium',
      l('¿Qué cuatro condiciones se necesitan para un deadlock y cuál es la forma más práctica de evitarlo?', 'Which four conditions are needed for a deadlock and what is the most practical way to avoid it?'),
      l('**Exclusión mutua**, **retener y esperar**, **sin expropiación** y **espera circular** (condiciones de Coffman). Basta con romper una; lo más práctico es **tomar los locks siempre en el mismo orden**, lo que elimina la espera circular.', '**Mutual exclusion**, **hold and wait**, **no preemption** and **circular wait** (Coffman conditions). Breaking one is enough; the most practical is **always acquiring locks in the same order**, which removes circular wait.')),
  },

  /* ---------------- Redes ---------------- */
  networking: {
    0: O('net-cp-layers', 'basic',
      l('Ordena las capas de TCP/IP **de arriba hacia abajo**.', 'Order the TCP/IP layers **from top to bottom**.'),
      [
        l('Aplicación (HTTP, DNS)', 'Application (HTTP, DNS)'),
        l('Transporte (TCP, UDP)', 'Transport (TCP, UDP)'),
        l('Red (IP)', 'Network (IP)'),
        l('Enlace (Ethernet, Wi-Fi)', 'Link (Ethernet, Wi-Fi)'),
      ],
      l('Del "idioma" del programa al medio físico. Cada capa se apoya en la de abajo.', 'From the program\'s "language" to the physical medium. Each layer relies on the one below.')),
    2: P('net-cp-ip', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import ipaddress

red = ipaddress.ip_network("10.0.0.0/28")
print(red.num_addresses, ipaddress.ip_address("10.0.0.20") in red)`,
      '16 False',
      l('Con `/28` quedan 4 bits libres: 2⁴ = **16** direcciones, de 10.0.0.0 a 10.0.0.15. La .20 queda fuera: **False**.', 'With `/28` there are 4 free bits: 2⁴ = **16** addresses, from 10.0.0.0 to 10.0.0.15. The .20 falls outside: **False**.'),
      l('El número después de `/` dice cuántos bits (de 32) están fijos.', 'The number after `/` says how many bits (of 32) are fixed.')),
    3: R('net-cp-tcp', 'basic',
      l('¿Qué diferencia hay entre TCP y UDP, y para qué usarías cada uno?', 'What is the difference between TCP and UDP, and what would you use each for?'),
      l('**TCP** establece una conexión (handshake de 3 pasos) y garantiza que todo llegue **completo y en orden**: web, APIs, correo. **UDP** no tiene conexión ni garantías, pero es más rápido: video y llamadas en vivo, juegos, DNS.', '**TCP** sets up a connection (3-step handshake) and guarantees everything arrives **complete and in order**: web, APIs, email. **UDP** has no connection or guarantees, but is faster: live video and calls, games, DNS.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Procesos e hilos ---------------- */
  'processes-threads': [
    P('proc-p-shared', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import threading

cuadrados = {}

def calcular(n):
    cuadrados[n] = n * n            # todos los hilos escriben en el mismo diccionario

hilos = [threading.Thread(target=calcular, args=(n,)) for n in range(1, 5)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
print(sorted(cuadrados.values()))`,
      '[1, 4, 9, 16]',
      l('Los 4 hilos comparten la memoria del proceso, así que todos escriben en el **mismo** diccionario. Como cada uno usa una clave distinta, no se pisan: **[1, 4, 9, 16]**.', 'The 4 threads share the process memory, so they all write to the **same** dictionary. Since each uses a different key, they do not clobber each other: **[1, 4, 9, 16]**.'),
      l('`sorted` ordena los valores porque los hilos pueden terminar en cualquier orden.', '`sorted` orders the values because threads may finish in any order.')),
    O('proc-p-thread-steps', 'basic',
      l('Ordena los pasos para usar un hilo en Python.', 'Order the steps to use a thread in Python.'),
      [
        l('Escribe la función que hará el hilo.', 'Write the function the thread will run.'),
        l('Crea el hilo con `threading.Thread(target=…, args=(…,))`.', 'Create the thread with `threading.Thread(target=…, args=(…,))`.'),
        l('Arráncalo con `start()`.', 'Start it with `start()`.'),
        l('Espera a que termine con `join()` antes de usar sus resultados.', 'Wait for it to finish with `join()` before using its results.'),
      ],
      l('Sin el `join`, podrías leer los resultados antes de que el hilo termine.', 'Without `join`, you could read the results before the thread finishes.')),
    P('proc-p-recursion', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `def bajar(n):
    return bajar(n + 1)        # nunca llega a un caso base

try:
    bajar(0)
except RecursionError:
    print("se llenó la pila")`,
      'se llenó la pila',
      l('Cada llamada pendiente ocupa un marco en el **stack**, que es limitado. Sin caso base se llena y Python lanza `RecursionError`.', 'Each pending call takes a frame on the **stack**, which is limited. Without a base case it fills up and Python raises `RecursionError`.'),
      l('Python corta la recursión al llegar a su límite (unas 1,000 llamadas).', 'Python cuts the recursion off at its limit (about 1,000 calls).')),
    R('proc-p-crash', 'medium',
      l('¿Por qué los navegadores suelen poner cada pestaña en su propio **proceso** y no en un hilo?', 'Why do browsers usually put each tab in its own **process** and not in a thread?'),
      l('Por el **aislamiento**: si una página se traba o falla, solo cae su proceso y las demás pestañas siguen. Además, una página no puede leer la memoria de otra, lo que es más seguro. El costo es usar más memoria.', 'For **isolation**: if a page freezes or crashes, only its process goes down and the other tabs keep going. Also, one page cannot read another\'s memory, which is safer. The cost is using more memory.')),
    R('proc-p-gc', 'medium',
      l('¿Qué es una **fuga de memoria** y por qué es más rara en Python que en C?', 'What is a **memory leak** and why is it rarer in Python than in C?'),
      l('Memoria del heap que ya no se usa pero **nunca se libera**, así que el programa ocupa cada vez más. En C hay que liberarla a mano y es fácil olvidarlo; en Python el **recolector de basura** libera los objetos que nadie usa. (En Python todavía puede pasar si guardas referencias que no necesitas, por ejemplo en una caché que crece sin límite.)', 'Heap memory no longer used but **never freed**, so the program takes more and more. In C you must free it by hand and it is easy to forget; in Python the **garbage collector** frees objects nobody uses. (In Python it can still happen if you keep references you do not need, for example in a cache that grows without limit.)')),
    R('proc-p-io-cpu', 'medium',
      l('Clasifica como E/S o CPU: (a) consultar una API externa, (b) calcular números primos, (c) leer muchos archivos del disco, (d) comprimir un video.', 'Classify as I/O or CPU: (a) calling an external API, (b) computing prime numbers, (c) reading many files from disk, (d) compressing a video.'),
      l('(a) **E/S** (espera la red), (b) **CPU**, (c) **E/S** (espera el disco), (d) **CPU**. En Python: hilos o `asyncio` para E/S; procesos para CPU.', '(a) **I/O** (waits for the network), (b) **CPU**, (c) **I/O** (waits for the disk), (d) **CPU**. In Python: threads or `asyncio` for I/O; processes for CPU.')),
    R('proc-p-concurrency', 'interview',
      l('Explica con un ejemplo la diferencia entre concurrencia y paralelismo.', 'Explain the difference between concurrency and parallelism with an example.'),
      l('**Concurrencia** es manejar varias tareas que avanzan a la vez aunque se **turnen**: un cocinero que alterna entre tres platos. **Paralelismo** es hacerlas **al mismo tiempo**: tres cocineros. Un programa con varios hilos en un solo núcleo es concurrente pero no paralelo.', '**Concurrency** is managing several tasks that progress at the same time even if they **take turns**: one cook alternating between three dishes. **Parallelism** is doing them **at the same time**: three cooks. A multithreaded program on a single core is concurrent but not parallel.')),
    R('proc-p-gil', 'interview',
      l('¿Qué es el GIL y cómo afecta la forma en que escribes programas concurrentes en Python?', 'What is the GIL and how does it affect the way you write concurrent programs in Python?'),
      l('El **Global Interpreter Lock** de CPython deja que **solo un hilo ejecute código de Python a la vez**, aunque se libera durante la E/S. Por eso los hilos (o `asyncio`) sirven para tareas de **E/S**, pero para tareas de **CPU** se usa `multiprocessing`. Desde Python 3.13 hay una versión opcional sin GIL.', 'CPython\'s **Global Interpreter Lock** lets **only one thread run Python code at a time**, though it is released during I/O. So threads (or `asyncio`) work for **I/O** tasks, but for **CPU** tasks you use `multiprocessing`. Since Python 3.13 there is an optional build without the GIL.')),
  ],

  /* ---------------- Concurrencia ---------------- */
  concurrency: [
    P('conc-p-steps', 'basic', l('Dos hilos incrementan `x` intercalando sus pasos. ¿Qué imprime?', 'Two threads increment `x` interleaving their steps. What does it print?'),
      `x = 0
for vuelta in range(3):
    a = x          # hilo A lee
    b = x          # hilo B lee el mismo valor
    x = a + 1      # A escribe
    x = b + 1      # B escribe encima
print(x)`,
      '3',
      l('Debería ser 6 (dos hilos × 3 vueltas), pero en cada vuelta los dos leen el mismo valor y uno pisa al otro: solo cuenta **un** incremento por vuelta: **3**.', 'It should be 6 (two threads × 3 rounds), but in each round both read the same value and one overwrites the other: only **one** increment counts per round: **3**.'),
      l('En cada vuelta, `a` y `b` leen el mismo número.', 'In each round, `a` and `b` read the same number.')),
    C('conc-p-signal', 'medium',
      l('Sin la señal de fin, el consumidor esperaría para siempre. ¿Qué línea falta? (con la correcta imprime `[2, 4, 6]`)', 'Without the end signal, the consumer would wait forever. Which line is missing? (the right one prints `[2, 4, 6]`)'),
      `import queue
import threading

trabajos = queue.Queue()
hechos = []

def trabajador():
    while True:
        n = trabajos.get()
        if n is None:
            break
        hechos.append(n * 2)

t = threading.Thread(target=trabajador)
t.start()
for n in [1, 2, 3]:
    trabajos.put(n)
____
t.join()
print(hechos)`,
      ['trabajos.put(0)', 'trabajos.put(None)', 'pass', 'hechos.clear()'],
      1,
      l('`trabajos.put(None)` manda la **señal** que el consumidor reconoce para salir del ciclo. Con `0` lo procesaría como un trabajo más y seguiría esperando; sin nada, `join()` esperaría para siempre.', '`trabajos.put(None)` sends the **signal** the consumer recognizes to leave the loop. With `0` it would process it as one more job and keep waiting; with nothing, `join()` would wait forever.'),
      l('`trabajos.get()` se queda esperando mientras la cola esté vacía.', '`trabajos.get()` keeps waiting while the queue is empty.')),
    P('conc-p-optimistic', 'medium', l('Bloqueo optimista con dos intentos. ¿Qué imprime?', 'Optimistic locking with two attempts. What does it print?'),
      `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE asientos (id INTEGER PRIMARY KEY, dueño TEXT, version INTEGER)")
db.execute("INSERT INTO asientos VALUES (7, NULL, 1)")

def reservar(nombre, version_leida):
    cur = db.execute("UPDATE asientos SET dueño = ?, version = version + 1 WHERE id = 7 AND version = ?",
                     (nombre, version_leida))
    return cur.rowcount == 1

ana = reservar("Ana", 1)        # Ana y Luis leyeron la versión 1
luis = reservar("Luis", 1)
print(ana, luis, db.execute("SELECT dueño FROM asientos").fetchone()[0])`,
      'True False Ana',
      l('Ana reserva primero y la versión sube a 2. Luis intenta con la versión 1, que ya no coincide: su UPDATE no modifica nada (**False**) y el asiento sigue siendo de **Ana**. Luis tendría que volver a leer y decidir.', 'Ana books first and the version goes up to 2. Luis tries with version 1, which no longer matches: his UPDATE modifies nothing (**False**) and the seat stays **Ana**\'s. Luis would have to read again and decide.'),
      l('`rowcount` dice cuántas filas modificó el UPDATE.', '`rowcount` says how many rows the UPDATE modified.')),
    R('conc-p-semaphore', 'basic',
      l('Tu programa descarga 1,000 archivos con hilos, pero el servidor solo acepta 5 conexiones a la vez. ¿Qué usas?', 'Your program downloads 1,000 files with threads, but the server accepts only 5 connections at once. What do you use?'),
      l('Un **semáforo** con valor 5: cada hilo lo toma antes de conectarse y lo suelta al terminar, así nunca hay más de 5 descargas a la vez. (Otra opción: un grupo fijo de 5 hilos que toman trabajos de una cola.)', 'A **semaphore** with value 5: each thread takes it before connecting and releases it when done, so there are never more than 5 downloads at once. (Another option: a fixed pool of 5 threads taking jobs from a queue.)')),
    R('conc-p-deadlock-example', 'medium',
      l('El hilo 1 hace `with lock_a: with lock_b:` y el hilo 2 hace `with lock_b: with lock_a:`. ¿Qué puede pasar y cómo lo arreglas?', 'Thread 1 does `with lock_a: with lock_b:` and thread 2 does `with lock_b: with lock_a:`. What can happen and how do you fix it?'),
      l('Un **deadlock**: el hilo 1 toma A, el hilo 2 toma B, y cada uno espera el lock que tiene el otro, para siempre. Se arregla haciendo que **los dos tomen los locks en el mismo orden** (primero A y luego B).', 'A **deadlock**: thread 1 takes A, thread 2 takes B, and each waits for the lock the other holds, forever. The fix is making **both acquire the locks in the same order** (first A then B).')),
    O('conc-p-race-steps', 'medium',
      l('Ordena cómo se pierde un incremento cuando dos hilos hacen `contador += 1` sin lock.', 'Order how an increment is lost when two threads do `counter += 1` without a lock.'),
      [
        l('El hilo A lee el contador (5).', 'Thread A reads the counter (5).'),
        l('El hilo B lee el contador, que todavía vale 5.', 'Thread B reads the counter, still 5.'),
        l('El hilo A escribe 6.', 'Thread A writes 6.'),
        l('El hilo B escribe 6 encima: el incremento de A se perdió.', 'Thread B writes 6 on top: A\'s increment is lost.'),
      ],
      l('Con un lock, B no podría leer hasta que A terminara de escribir.', 'With a lock, B could not read until A finished writing.')),
    R('conc-p-last-item', 'interview',
      l('Queda un solo boleto y dos personas lo compran al mismo tiempo. ¿Cómo evitas venderlo dos veces?', 'One ticket is left and two people buy it at the same time. How do you avoid selling it twice?'),
      l('Hacer la venta en la **base de datos** de forma atómica: una **transacción** con bloqueo de la fila (`SELECT … FOR UPDATE`), un **bloqueo optimista** con número de versión, o un UPDATE condicional como `UPDATE boletos SET vendido = 1 WHERE id = ? AND vendido = 0` y revisar si modificó la fila. Solo uno lo logra; al otro se le avisa que ya no hay.', 'Do the sale atomically in the **database**: a **transaction** locking the row (`SELECT … FOR UPDATE`), **optimistic locking** with a version number, or a conditional UPDATE like `UPDATE tickets SET sold = 1 WHERE id = ? AND sold = 0` and check whether it modified the row. Only one succeeds; the other is told it is sold out.')),
    R('conc-p-why', 'interview',
      l('¿Por qué las condiciones de carrera son tan difíciles de encontrar?', 'Why are race conditions so hard to find?'),
      l('Porque dependen del **orden exacto** en que se intercalan los hilos, que cambia en cada ejecución: casi siempre todo sale bien y falla solo de vez en cuando, a veces solo con mucha carga. Por eso se previenen por diseño (locks, colas, datos que no se comparten) en vez de esperar a verlas.', 'Because they depend on the **exact order** threads interleave, which changes on every run: things almost always go well and fail only now and then, sometimes only under heavy load. That is why they are prevented by design (locks, queues, unshared data) instead of waiting to see them.')),
  ],

  /* ---------------- Redes ---------------- */
  networking: [
    P('net-p-private', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import ipaddress

for ip in ["10.2.3.4", "172.20.0.1", "1.1.1.1"]:
    print(ipaddress.ip_address(ip).is_private, end=" ")`,
      'True True False',
      l('10.x y 172.16–31.x son rangos **privados**; 1.1.1.1 es una IP **pública** (un servidor DNS conocido).', '10.x and 172.16–31.x are **private** ranges; 1.1.1.1 is a **public** IP (a well-known DNS server).'),
      l('`end=" "` hace que `print` ponga un espacio en vez de un salto de línea.', '`end=" "` makes `print` add a space instead of a line break.')),
    P('net-p-ports', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `puertos = {22: "SSH", 53: "DNS", 80: "HTTP", 443: "HTTPS", 5432: "PostgreSQL"}

def servicio(puerto):
    return puertos.get(puerto, "desconocido")

print(servicio(443), servicio(22), servicio(8080))`,
      'HTTPS SSH desconocido',
      l('443 es **HTTPS** y 22 **SSH**. El 8080 no está en el diccionario, así que `get` devuelve **desconocido** (es un puerto común para servidores de prueba, pero no tiene un servicio fijo).', '443 is **HTTPS** and 22 **SSH**. 8080 is not in the dictionary, so `get` returns **desconocido** (it is a common port for test servers, but has no fixed service).'),
      l('`get(clave, valor)` devuelve el valor por defecto si la clave no existe.', '`get(key, value)` returns the default if the key does not exist.')),
    O('net-p-handshake', 'basic',
      l('Ordena el **handshake** de TCP y lo que sigue.', 'Order the TCP **handshake** and what follows.'),
      [
        l('El cliente manda SYN.', 'The client sends SYN.'),
        l('El servidor responde SYN-ACK.', 'The server answers SYN-ACK.'),
        l('El cliente confirma con ACK.', 'The client confirms with ACK.'),
        l('Ya conectados, envían datos y cada parte confirma lo que recibe.', 'Once connected, they send data and each side acknowledges what it receives.'),
      ],
      l('Por eso TCP puede retransmitir lo que no se confirmó.', 'That is why TCP can retransmit what was not acknowledged.')),
    P('net-p-socket', 'medium', l('Un cliente y un servidor en la misma computadora. ¿Qué imprime?', 'A client and a server on the same computer. What does it print?'),
      `import socket
import threading

servidor = socket.socket()
servidor.bind(("127.0.0.1", 0))
servidor.listen()
puerto = servidor.getsockname()[1]

def atender():
    conexion, _ = servidor.accept()
    texto = conexion.recv(1024).decode()
    conexion.sendall(str(len(texto)).encode())     # responde cuántas letras recibió
    conexion.close()

threading.Thread(target=atender).start()
cliente = socket.create_connection(("127.0.0.1", puerto))
cliente.sendall(b"redes")
print(cliente.recv(1024).decode())`,
      '5',
      l('El servidor recibe "redes", cuenta **5** letras y lo manda de vuelta como texto. Todo viaja por TCP dentro de tu computadora (`127.0.0.1`).', 'The server receives "redes", counts **5** letters and sends it back as text. Everything travels over TCP inside your computer (`127.0.0.1`).'),
      l('Por la red viajan bytes: `encode()` convierte texto en bytes y `decode()` al revés.', 'Bytes travel over the network: `encode()` turns text into bytes and `decode()` does the opposite.')),
    R('net-p-udp', 'medium',
      l('¿Por qué un juego en línea o una videollamada prefieren UDP aunque se pierdan paquetes?', 'Why do online games or video calls prefer UDP even though packets get lost?'),
      l('Porque un dato que llega **tarde ya no sirve**: la posición de un jugador de hace medio segundo es inútil. TCP detendría todo esperando a reenviar lo perdido; UDP sigue con lo más nuevo y el programa tolera las pérdidas.', 'Because data that arrives **late is useless**: a player\'s position from half a second ago is worthless. TCP would stop everything waiting to resend what was lost; UDP moves on with the newest data and the program tolerates losses.')),
    R('net-p-nat', 'medium',
      l('Tu laptop tiene la IP 192.168.1.20, pero un sitio web dice que tu IP es 189.x.x.x. ¿Por qué?', 'Your laptop has IP 192.168.1.20, but a website says your IP is 189.x.x.x. Why?'),
      l('192.168.1.20 es una IP **privada**, solo válida dentro de tu red. Tu router hace **NAT**: sale a internet con su **IP pública** (189.x.x.x) y traduce el tráfico de todos tus aparatos.', '192.168.1.20 is a **private** IP, only valid inside your network. Your router does **NAT**: it goes out to the internet with its **public IP** (189.x.x.x) and translates the traffic of all your devices.')),
    R('net-p-websocket', 'interview',
      l('Diseñas un chat. ¿Por qué usarías WebSockets en vez de HTTP normal?', 'You are designing a chat. Why would you use WebSockets instead of plain HTTP?'),
      l('Con HTTP el servidor solo responde cuando el cliente pregunta, así que tendrías que preguntar cada segundo si hay mensajes (*polling*), desperdiciando recursos y con retraso. Un **WebSocket** deja una conexión **abierta en los dos sentidos** y el servidor manda cada mensaje **en cuanto llega**.', 'With HTTP the server only answers when the client asks, so you would have to ask every second for messages (*polling*), wasting resources and adding delay. A **WebSocket** keeps a connection **open both ways** and the server sends each message **as soon as it arrives**.')),
    R('net-p-layers-journey', 'interview',
      l('Cuando tu navegador pide `https://tienda.com`, ¿qué hace cada capa de red?', 'When your browser requests `https://tienda.com`, what does each network layer do?'),
      l('**Aplicación:** DNS encuentra la IP y HTTP (con TLS) forma la petición. **Transporte:** TCP abre la conexión al puerto 443 y garantiza que llegue todo en orden. **Red:** IP lleva los paquetes hasta la IP del servidor, saltando entre routers. **Enlace:** Wi-Fi o Ethernet mueven los bits en cada tramo.', '**Application:** DNS finds the IP and HTTP (with TLS) builds the request. **Transport:** TCP opens the connection to port 443 and guarantees everything arrives in order. **Network:** IP carries the packets to the server\'s IP, hopping between routers. **Link:** Wi-Fi or Ethernet move the bits on each hop.')),
  ],
};
