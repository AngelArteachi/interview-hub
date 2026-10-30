import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, O, P, R } from './builders';

/* Ejercicios: Git · Linux · Docker y la nube · CI/CD.
 * Los comandos de terminal no se ejecutan aquí: esos ejercicios son de repaso u orden,
 * y los de código usan Python para simular la idea (punteros de Git, permisos, pipelines). */

/** El convertidor de permisos de la lección de Linux */
const A_OCTAL = `def a_octal(permisos):
    valores = {"r": 4, "w": 2, "x": 1, "-": 0}
    res = ""
    for i in range(0, 9, 3):
        total = 0
        for letra in permisos[i:i + 3]:
            total += valores[letra]
        res += str(total)
    return res
`;

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Git ---------------- */
  git: {
    1: R('git-cp-zones', 'basic',
      l('¿Cuáles son las tres zonas de Git y qué comando pasa un cambio de una a otra? ¿Para qué sirve el staging?', 'What are Git\'s three areas and which command moves a change from one to the next? What is staging for?'),
      l('**Directorio de trabajo** → \`git add\` → **staging** → \`git commit\` → **repositorio**. El staging sirve para **elegir qué entra en cada commit**: puedes guardar solo una parte de lo que cambiaste.', '**Working directory** → \`git add\` → **staging** → \`git commit\` → **repository**. Staging lets you **choose what goes into each commit**: you can save only part of what you changed.')),
    4: P('git-cp-branch', 'basic', l('Simulación de ramas como punteros. ¿Qué imprime?', 'Simulating branches as pointers. What does it print?'),
      `padre = {"a1": None}
ramas = {"main": "a1"}

ramas["fix"] = ramas["main"]       # git switch -c fix
padre["b2"] = ramas["fix"]         # commit en fix
ramas["fix"] = "b2"
padre["c3"] = ramas["fix"]         # otro commit en fix
ramas["fix"] = "c3"

print(ramas["main"], ramas["fix"], padre["c3"], padre["b2"])`,
      'a1 c3 b2 a1',
      l('`main` se queda en **a1**: los commits nuevos solo mueven el puntero de `fix`, que termina en **c3**. Cada commit apunta a su padre: c3 → **b2** → **a1**.', '`main` stays at **a1**: new commits only move `fix`\'s pointer, which ends at **c3**. Each commit points to its parent: c3 → **b2** → **a1**.'),
      l('Una rama es solo un puntero; al hacer commit, avanza solo la rama en la que estás.', 'A branch is just a pointer; on commit, only the branch you are on moves.')),
    5: O('git-cp-conflict', 'medium',
      l('Ordena los pasos para resolver un conflicto de merge.', 'Order the steps to resolve a merge conflict.'),
      [
        l('Abre el archivo y busca los marcadores `<<<<<<<`, `=======` y `>>>>>>>`.', 'Open the file and find the `<<<<<<<`, `=======` and `>>>>>>>` markers.'),
        l('Deja el código correcto: una versión, la otra o una mezcla.', 'Leave the right code: one version, the other or a mix.'),
        l('Borra los marcadores y prueba que funcione.', 'Delete the markers and test that it works.'),
        l('Marca el conflicto como resuelto con `git add`.', 'Mark the conflict as resolved with `git add`.'),
        l('Termina con `git commit` (o `git rebase --continue` si era un rebase).', 'Finish with `git commit` (or `git rebase --continue` if it was a rebase).'),
      ],
      l('Si te equivocas a medio camino, `git merge --abort` te regresa al estado anterior.', 'If you go wrong halfway, `git merge --abort` takes you back to the previous state.')),
  },

  /* ---------------- Linux ---------------- */
  linux: {
    0: R('lin-cp-commands', 'basic',
      l('¿Qué comando usarías para: (a) ver en vivo lo nuevo de un log, (b) buscar la palabra "ERROR" en todos los archivos de una carpeta, (c) saber en qué carpeta estás, (d) ver qué procesos usan más CPU?', 'Which command would you use to: (a) watch new lines of a log live, (b) search for "ERROR" in every file of a folder, (c) know which folder you are in, (d) see which processes use the most CPU?'),
      l('(a) `tail -f app.log`, (b) `grep -r "ERROR" .`, (c) `pwd`, (d) `top` (o `htop`).', '(a) `tail -f app.log`, (b) `grep -r "ERROR" .`, (c) `pwd`, (d) `top` (or `htop`).')),
    4: P('lin-cp-pipe', 'medium', l('Lo mismo que `… | sort | uniq -c | sort -rn | head -1`, pero contando rutas. ¿Qué imprime?', 'The same as `… | sort | uniq -c | sort -rn | head -1`, but counting paths. What does it print?'),
      `log = """10.0.0.1 GET /
10.0.0.2 GET /login
10.0.0.3 GET /login
10.0.0.1 GET /
10.0.0.4 GET /login"""

conteo = {}
for linea in log.split("\\n"):
    ruta = linea.split()[2]                     # la tercera columna
    conteo[ruta] = conteo.get(ruta, 0) + 1

top = sorted(conteo.items(), key=lambda par: par[1], reverse=True)
print(top[0])`,
      "('/login', 3)",
      l('La tercera columna es la ruta: "/" aparece 2 veces y "/login" **3**. Ordenadas de mayor a menor, la primera es **(\'/login\', 3)**.', 'The third column is the path: "/" appears 2 times and "/login" **3**. Sorted largest first, the first is **(\'/login\', 3)**.'),
      l('`linea.split()` separa la línea por espacios; la posición 2 es la tercera columna.', '`linea.split()` splits the line on spaces; position 2 is the third column.')),
    6: R('lin-cp-chmod', 'basic',
      l('¿Qué permisos da `chmod 640 datos.txt`? Explica cada dígito.', 'Which permissions does `chmod 640 datos.txt` give? Explain each digit.'),
      l('**6** = 4 + 2: el **dueño** puede leer y escribir. **4**: el **grupo** solo puede leer. **0**: **los demás** no pueden nada. Es decir, `rw-r-----`.', '**6** = 4 + 2: the **owner** can read and write. **4**: the **group** can only read. **0**: **others** can do nothing. That is, `rw-r-----`.')),
  },

  /* ---------------- Docker y la nube ---------------- */
  'docker-cloud': {
    0: R('dock-cp-vm', 'basic',
      l('¿En qué se diferencia un contenedor de una máquina virtual?', 'How does a container differ from a virtual machine?'),
      l('La **VM** virtualiza el **hardware** y trae su **sistema operativo completo**: pesa gigabytes y tarda minutos en arrancar, pero aísla más. El **contenedor** comparte el **kernel** del anfitrión y solo aísla el proceso: pesa megabytes y arranca en segundos.', 'The **VM** virtualizes **hardware** and carries its **full operating system**: it weighs gigabytes and takes minutes to start, but isolates more. The **container** shares the host\'s **kernel** and isolates just the process: it weighs megabytes and starts in seconds.')),
    2: O('dock-cp-order', 'medium',
      l('Ordena las instrucciones de un Dockerfile para que aproveche bien el caché.', 'Order a Dockerfile\'s instructions so it makes good use of the cache.'),
      [
        l('`FROM node:22-alpine`', '`FROM node:22-alpine`'),
        l('`WORKDIR /app`', '`WORKDIR /app`'),
        l('`COPY package*.json ./`', '`COPY package*.json ./`'),
        l('`RUN npm ci`', '`RUN npm ci`'),
        l('`COPY . .`', '`COPY . .`'),
        l('`CMD ["node", "server.js"]`', '`CMD ["node", "server.js"]`'),
      ],
      l('Las dependencias se instalan **antes** de copiar el resto del código: así, si solo cambias tu código, Docker reutiliza la capa de `npm ci`.', 'Dependencies are installed **before** copying the rest of the code: that way, if you only change your code, Docker reuses the `npm ci` layer.')),
    6: R('dock-cp-cloud', 'basic',
      l('Clasifica como IaaS, PaaS o SaaS: (a) AWS EC2, (b) Vercel, (c) Gmail. ¿Qué administras tú en cada caso?', 'Classify as IaaS, PaaS or SaaS: (a) AWS EC2, (b) Vercel, (c) Gmail. What do you manage in each case?'),
      l('(a) **IaaS**: te dan la máquina y tú administras el sistema operativo y todo lo demás. (b) **PaaS**: solo subes tu app; ellos corren el resto. (c) **SaaS**: solo usas el software.', '(a) **IaaS**: you get the machine and you manage the operating system and everything else. (b) **PaaS**: you just upload your app; they run the rest. (c) **SaaS**: you just use the software.')),
  },

  /* ---------------- CI/CD ---------------- */
  cicd: {
    2: P('ci-cp-pipeline', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `def correr_pipeline(pasos):
    corridos = []
    for nombre, salio_bien in pasos:
        corridos.append(nombre)
        if not salio_bien:
            return corridos             # se detiene en el paso que falló
    return corridos

print(correr_pipeline([("instalar", True), ("lint", False), ("pruebas", True), ("desplegar", True)]))`,
      "['instalar', 'lint']",
      l('El linter falla, así que el pipeline se detiene ahí: solo corrieron **instalar** y **lint**. Las pruebas y el despliegue nunca se ejecutan.', 'The linter fails, so the pipeline stops there: only **instalar** and **lint** ran. The tests and the deploy never run.'),
      l('Cada paso se agrega a `corridos` antes de revisar si salió bien.', 'Each step is added to `corridos` before checking whether it went well.')),
    3: R('ci-cp-delivery', 'basic',
      l('¿Qué diferencia hay entre continuous delivery y continuous deployment?', 'What is the difference between continuous delivery and continuous deployment?'),
      l('En **continuous delivery**, cada cambio que pasa la CI queda **listo para desplegarse**, pero una persona decide cuándo. En **continuous deployment**, cada cambio que pasa la CI **se despliega solo** a producción.', 'In **continuous delivery**, every change that passes CI is **ready to deploy**, but a person decides when. In **continuous deployment**, every change that passes CI **deploys itself** to production.')),
    4: R('ci-cp-strategies', 'medium',
      l('Explica en una frase cada estrategia: blue-green, canary y feature flags.', 'Explain each strategy in one sentence: blue-green, canary and feature flags.'),
      l('**Blue-green:** dos ambientes iguales; despliegas en el que no tiene tráfico y luego cambias todo el tráfico a él (y regresas si falla). **Canary:** la versión nueva va primero a un porcentaje pequeño de usuarios y se amplía si va bien. **Feature flags:** el código ya está desplegado pero apagado, y se enciende sin redesplegar.', '**Blue-green:** two identical environments; you deploy to the one without traffic and then switch all traffic to it (and go back if it fails). **Canary:** the new version goes first to a small percentage of users and is widened if all goes well. **Feature flags:** the code is already deployed but switched off, and is turned on without redeploying.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Git ---------------- */
  git: [
    R('git-p-commit', 'basic',
      l('¿Qué es un commit y qué información guarda?', 'What is a commit and what information does it store?'),
      l('Un **punto de guardado**: una foto completa del proyecto en un momento, con un **mensaje**, el **autor**, la **fecha** y un **puntero a su commit padre**. Se identifica con un **hash**.', 'A **save point**: a full snapshot of the project at a moment, with a **message**, the **author**, the **date** and a **pointer to its parent commit**. It is identified by a **hash**.')),
    P('git-p-ff', 'basic', l('Un merge fast-forward, simulado. ¿Qué imprime?', 'A fast-forward merge, simulated. What does it print?'),
      `ramas = {"main": "a1", "feature": "c3"}   # feature tiene dos commits más que main (b2 y c3)

# main no avanzó mientras se trabajaba en feature: el merge solo mueve el puntero
ramas["main"] = ramas["feature"]

print(ramas["main"], ramas["main"] == ramas["feature"])`,
      'c3 True',
      l('Como `main` no tenía commits nuevos, el merge es un **fast-forward**: el puntero de `main` avanza hasta **c3** y las dos ramas apuntan al mismo commit (**True**). No se crea commit de unión.', 'Since `main` had no new commits, the merge is a **fast-forward**: `main`\'s pointer moves up to **c3** and both branches point to the same commit (**True**). No merge commit is created.'),
      l('Merge fast-forward = mover el puntero hacia adelante.', 'Fast-forward merge = moving the pointer forward.')),
    O('git-p-flow', 'basic',
      l('Ordena el flujo de trabajo en equipo (GitHub flow).', 'Order the team workflow (GitHub flow).'),
      [
        l('Crea una rama para la funcionalidad.', 'Create a branch for the feature.'),
        l('Haz commits pequeños con buenos mensajes.', 'Make small commits with good messages.'),
        l('Sube la rama con `git push`.', 'Push the branch with `git push`.'),
        l('Abre un Pull Request.', 'Open a Pull Request.'),
        l('Code review de tus compañeros y CI en verde.', 'Code review from teammates and green CI.'),
        l('Merge a `main`.', 'Merge into `main`.'),
      ],
      l('Así ningún cambio llega a `main` sin revisión ni pruebas.', 'That way no change reaches `main` without review or tests.')),
    P('git-p-revert-reset', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `historia = ["inicio", "agrega login", "rompe el pago"]

con_revert = historia + ["revierte 'rompe el pago'"]   # git revert: un commit nuevo que deshace
con_reset = historia[:2]                                # git reset: la rama vuelve atrás

print(len(con_revert), len(con_reset), "rompe el pago" in con_revert)`,
      '4 2 True',
      l('**revert** agrega un commit (**4**) y **conserva** el commit malo en la historia (**True**); por eso es seguro en ramas compartidas. **reset** mueve la rama atrás (**2**): el commit "desaparece" y la historia se reescribe.', '**revert** adds a commit (**4**) and **keeps** the bad commit in history (**True**); that is why it is safe on shared branches. **reset** moves the branch back (**2**): the commit "disappears" and history is rewritten.'),
      l('`historia[:2]` son los dos primeros elementos.', '`historia[:2]` is the first two elements.')),
    R('git-p-fetch-pull', 'medium',
      l('¿Qué diferencia hay entre `git fetch`, `git pull` y `git push`?', 'What is the difference between `git fetch`, `git pull` and `git push`?'),
      l('`fetch` **descarga** los cambios del remoto sin tocar tus archivos ni tu rama. `pull` es `fetch` + **integrarlos** (merge o rebase) en tu rama. `push` **sube** tus commits al remoto.', '`fetch` **downloads** the remote\'s changes without touching your files or branch. `pull` is `fetch` + **integrating them** (merge or rebase) into your branch. `push` **uploads** your commits to the remote.')),
    R('git-p-merge-rebase', 'medium',
      l('¿Cuándo usarías merge y cuándo rebase? ¿Qué regla nunca debes romper?', 'When would you use merge and when rebase? Which rule must you never break?'),
      l('**Merge** para integrar ramas conservando la historia real (con un commit de unión). **Rebase** para poner tus commits al día encima de \`main\` y dejar una historia lineal, **solo en ramas tuyas**. La regla: **no hagas rebase de una rama que otros ya usan**, porque reescribe sus commits.', '**Merge** to integrate branches keeping the real history (with a merge commit). **Rebase** to bring your commits up to date on top of \`main\` and leave a linear history, **only on your own branches**. The rule: **do not rebase a branch others already use**, because it rewrites its commits.')),
    R('git-p-reset-modes', 'interview',
      l('Hiciste un commit con un error y todavía no lo subes. Explica qué harían `git reset --soft HEAD~1`, `--mixed` y `--hard`.', 'You made a commit with a mistake and have not pushed it. Explain what `git reset --soft HEAD~1`, `--mixed` and `--hard` would do.'),
      l('Los tres quitan el último commit de la rama (`HEAD~1` es el commit anterior). **--soft:** tus cambios quedan en **staging**, listos para volver a hacer commit. **--mixed** (el de por defecto): quedan en el **directorio de trabajo**, sin preparar. **--hard:** los cambios **se borran**. Como no lo has subido, reescribir la historia no afecta a nadie.', 'All three remove the last commit from the branch (`HEAD~1` is the previous commit). **--soft:** your changes stay in **staging**, ready to commit again. **--mixed** (the default): they stay in the **working directory**, unstaged. **--hard:** the changes **are deleted**. Since you have not pushed it, rewriting history affects nobody.')),
    R('git-p-force', 'interview',
      l('Hiciste rebase de tu propia rama y ahora `git push` se rechaza. ¿Qué haces y qué evitas?', 'You rebased your own branch and now `git push` is rejected. What do you do and what do you avoid?'),
      l('Como el rebase reescribió tus commits, hay que forzar el push, pero con **`git push --force-with-lease`**: solo sobrescribe si nadie más subió cambios a esa rama. Evitas `--force` a secas, que borraría el trabajo de otros, y nunca lo haces en ramas compartidas como `main`.', 'Since the rebase rewrote your commits, you must force the push, but with **`git push --force-with-lease`**: it only overwrites if nobody else pushed to that branch. You avoid plain `--force`, which would erase others\' work, and never do it on shared branches like `main`.')),
  ],

  /* ---------------- Linux ---------------- */
  linux: [
    R('lin-p-paths', 'basic',
      l('Estás en `/home/ana/proyecto`. ¿A dónde te lleva `cd ..`, `cd ~` y `cd /var/log`? ¿Cuál es una ruta absoluta?', 'You are in `/home/ana/proyecto`. Where do `cd ..`, `cd ~` and `cd /var/log` take you? Which one is an absolute path?'),
      l('`cd ..` → `/home/ana` (la carpeta de arriba). `cd ~` → tu carpeta personal (`/home/ana`). `cd /var/log` → `/var/log`: es una ruta **absoluta** porque empieza con `/`.', '`cd ..` → `/home/ana` (the folder above). `cd ~` → your home folder (`/home/ana`). `cd /var/log` → `/var/log`: it is an **absolute** path because it starts with `/`.')),
    P('lin-p-octal', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${A_OCTAL}
print(a_octal("rwx------"), a_octal("r-xr-xr-x"))`,
      '700 555',
      l('`rwx------`: el dueño todo (7) y nadie más nada: **700**. `r-xr-xr-x`: leer y ejecutar (4 + 1 = 5) para los tres: **555**.', '`rwx------`: the owner everything (7) and nobody else anything: **700**. `r-xr-xr-x`: read and execute (4 + 1 = 5) for all three: **555**.'),
      l('r = 4, w = 2, x = 1, y se suman por cada grupo de tres letras.', 'r = 4, w = 2, x = 1, added up for each group of three letters.')),
    O('lin-p-pipeline', 'medium',
      l('Ordena las piezas de la tubería que muestra las 3 IPs que más aparecen en un log.', 'Order the pieces of the pipeline that shows the 3 IPs appearing most in a log.'),
      [
        l('`cat access.log` lee el archivo.', '`cat access.log` reads the file.'),
        l('`awk \'{print $1}\'` se queda con la primera columna (la IP).', '`awk \'{print $1}\'` keeps the first column (the IP).'),
        l('`sort` junta las IPs iguales.', '`sort` groups identical IPs together.'),
        l('`uniq -c` cuenta cuántas veces aparece cada una.', '`uniq -c` counts how many times each appears.'),
        l('`sort -rn` ordena por ese número, de mayor a menor.', '`sort -rn` sorts by that number, largest first.'),
        l('`head -3` se queda con las 3 primeras.', '`head -3` keeps the first 3.'),
      ],
      l('`uniq` solo cuenta líneas iguales que están seguidas: por eso va un `sort` antes.', '`uniq` only counts identical lines that are adjacent: that is why a `sort` goes first.')),
    R('lin-p-redirect', 'basic',
      l('¿Qué diferencia hay entre `echo hola > notas.txt` y `echo hola >> notas.txt`?', 'What is the difference between `echo hola > notas.txt` and `echo hola >> notas.txt`?'),
      l('`>` **reemplaza** todo el contenido del archivo por "hola". `>>` **agrega** "hola" al final, conservando lo que había. (Y `2>` redirige los errores.)', '`>` **replaces** the file\'s whole content with "hola". `>>` **appends** "hola" to the end, keeping what was there. (And `2>` redirects errors.)')),
    P('lin-p-grep', 'medium', l('Lo que hace `grep -c ERROR app.log`. ¿Qué imprime?', 'What `grep -c ERROR app.log` does. What does it print?'),
      `log = """INFO arranque
ERROR sin conexión a la base
INFO petición /
ERROR timeout en /pagos
WARN memoria alta"""

cuenta = 0
for linea in log.split("\\n"):
    if "ERROR" in linea:            # grep se queda con las líneas que contienen el texto
        cuenta += 1                 # -c: en vez de mostrarlas, las cuenta
print(cuenta)`,
      '2',
      l('Dos líneas contienen "ERROR": **2**. `grep` sin `-c` las mostraría; con `-c` solo dice cuántas son.', 'Two lines contain "ERROR": **2**. `grep` without `-c` would show them; with `-c` it only says how many.'),
      l('`texto in linea` revisa si la línea contiene ese texto.', '`texto in linea` checks whether the line contains that text.')),
    R('lin-p-kill', 'medium',
      l('Un proceso de tu app está colgado. ¿Cómo lo encuentras y lo detienes? ¿Por qué no empezar con `kill -9`?', 'A process of your app is hung. How do you find and stop it? Why not start with `kill -9`?'),
      l('Lo encuentras con `ps aux | grep miapp` (o `top`) para ver su **PID**, y lo detienes con `kill PID`, que manda **SIGTERM**: le pide terminar y le deja cerrar archivos y conexiones. `kill -9` (**SIGKILL**) lo mata de golpe sin limpiar; se usa solo si `kill` no funcionó.', 'You find it with `ps aux | grep myapp` (or `top`) to see its **PID**, and stop it with `kill PID`, which sends **SIGTERM**: it asks it to finish and lets it close files and connections. `kill -9` (**SIGKILL**) kills it abruptly without cleanup; use it only if `kill` did not work.')),
    R('lin-p-env', 'interview',
      l('¿Por qué se pasan las contraseñas y llaves de una app como variables de entorno en vez de escribirlas en el código?', 'Why are an app\'s passwords and keys passed as environment variables instead of written in the code?'),
      l('Porque así **no quedan en el repositorio** (donde cualquiera con acceso, o el historial, las vería) y puedes usar **valores distintos** en desarrollo, staging y producción sin cambiar el código. La app las lee al arrancar, por ejemplo con `os.environ["API_KEY"]` en Python.', 'Because then they **do not end up in the repository** (where anyone with access, or the history, would see them) and you can use **different values** in development, staging and production without changing the code. The app reads them at startup, for example with `os.environ["API_KEY"]` in Python.')),
    R('lin-p-slow', 'interview',
      l('Te conectas por SSH a un servidor que responde muy lento. ¿Qué revisas y con qué comandos?', 'You SSH into a server that responds very slowly. What do you check and with which commands?'),
      l('`top` o `htop` (¿algún proceso usa toda la CPU o la memoria?), `free -h` (¿queda memoria?), `df -h` (¿se llenó el disco?) y los logs con `tail -f` o `grep ERROR` (¿hay errores?). Con eso sabes si el problema es CPU, memoria, disco o un error de la app.', '`top` or `htop` (is some process using all the CPU or memory?), `free -h` (is there memory left?), `df -h` (is the disk full?) and the logs with `tail -f` or `grep ERROR` (are there errors?). That tells you whether the problem is CPU, memory, disk or an app error.')),
  ],

  /* ---------------- Docker y la nube ---------------- */
  'docker-cloud': [
    R('dock-p-image', 'basic',
      l('¿Qué diferencia hay entre una imagen y un contenedor? Usa una analogía.', 'What is the difference between an image and a container? Use an analogy.'),
      l('La **imagen** es la plantilla inmutable (tu app con sus dependencias), construida desde un Dockerfile. El **contenedor** es una instancia **en ejecución** de esa imagen; de una imagen puedes levantar muchos. Como **clase y objeto**: el molde y la cosa concreta.', 'The **image** is the immutable template (your app with its dependencies), built from a Dockerfile. The **container** is a **running** instance of that image; from one image you can start many. Like **class and object**: the mold and the concrete thing.')),
    R('dock-p-run-cmd', 'basic',
      l('En un Dockerfile, ¿qué diferencia hay entre `RUN` y `CMD`?', 'In a Dockerfile, what is the difference between `RUN` and `CMD`?'),
      l('`RUN` se ejecuta **al construir** la imagen (por ejemplo, `RUN npm ci` para instalar dependencias) y su resultado queda guardado en una capa. `CMD` es lo que se ejecuta **al arrancar** el contenedor (por ejemplo, `CMD ["node", "server.js"]`).', '`RUN` runs **at build time** (for example, `RUN npm ci` to install dependencies) and its result is stored in a layer. `CMD` is what runs **when the container starts** (for example, `CMD ["node", "server.js"]`).')),
    R('dock-p-ports', 'basic',
      l('Tu app escucha en el puerto 3000 dentro del contenedor y quieres abrirla en `http://localhost:8080`. ¿Cómo lo haces?', 'Your app listens on port 3000 inside the container and you want to open it at `http://localhost:8080`. How do you do it?'),
      l('Con `docker run -p 8080:3000 mi-app` (o `ports: - "8080:3000"` en compose): primero va el puerto de **tu máquina** y luego el **del contenedor**.', 'With `docker run -p 8080:3000 my-app` (or `ports: - "8080:3000"` in compose): first comes **your machine\'s** port and then **the container\'s**.')),
    R('dock-p-volume', 'medium',
      l('Borraste y volviste a crear el contenedor de tu base de datos, y desaparecieron todos los datos. ¿Qué faltó?', 'You deleted and recreated your database container, and all the data disappeared. What was missing?'),
      l('Un **volumen**. El sistema de archivos de un contenedor se pierde al borrarlo; un volumen guarda los datos **fuera** del contenedor (por ejemplo, `datos:/var/lib/postgresql/data`), así sobreviven aunque lo borres y lo vuelvas a crear.', 'A **volume**. A container\'s filesystem is lost when it is deleted; a volume keeps the data **outside** the container (for example, `datos:/var/lib/postgresql/data`), so it survives even if you delete and recreate it.')),
    R('dock-p-compose', 'medium',
      l('¿Para qué te sirve docker compose si tu app necesita una base de datos PostgreSQL y Redis?', 'What does docker compose do for you if your app needs a PostgreSQL database and Redis?'),
      l('Describe los tres servicios (app, base de datos y Redis) en un solo `docker-compose.yml`, con sus puertos, variables de entorno y volúmenes, y los levanta juntos con `docker compose up`. Dentro de compose, cada servicio encuentra a los otros por su nombre (por ejemplo, `db`).', 'It describes the three services (app, database and Redis) in a single `docker-compose.yml`, with their ports, environment variables and volumes, and starts them together with `docker compose up`. Inside compose, each service finds the others by name (for example, `db`).')),
    R('dock-p-serverless', 'medium',
      l('¿Qué ventajas y qué desventaja tiene usar funciones serverless como AWS Lambda?', 'What advantages and what drawback does using serverless functions like AWS Lambda have?'),
      l('**Ventajas:** no administras servidores, **pagas solo por ejecución** y escala solo con la demanda. **Desventaja:** el **cold start**: la primera llamada después de un rato sin uso tarda más. Además, las funciones tienen límites de tiempo y no guardan estado entre llamadas.', '**Advantages:** you manage no servers, **pay only per execution** and it scales with demand by itself. **Drawback:** the **cold start**: the first call after a while unused takes longer. Also, functions have time limits and keep no state between calls.')),
    R('dock-p-aws', 'basic',
      l('¿Qué servicio de AWS usarías para: (a) un servidor virtual, (b) guardar las fotos de los usuarios, (c) una base de datos PostgreSQL con respaldos automáticos, (d) una función que corre cada vez que se sube una foto?', 'Which AWS service would you use for: (a) a virtual server, (b) storing users\' photos, (c) a PostgreSQL database with automatic backups, (d) a function that runs each time a photo is uploaded?'),
      l('(a) **EC2**, (b) **S3**, (c) **RDS**, (d) **Lambda**.', '(a) **EC2**, (b) **S3**, (c) **RDS**, (d) **Lambda**.')),
    R('dock-p-why', 'interview',
      l('Te preguntan: "¿Por qué usarías Docker en un proyecto?". Da una respuesta corta.', 'You are asked: "Why would you use Docker in a project?". Give a short answer.'),
      l('Para que la app corra **igual en todas partes** (mi laptop, la de mis compañeros, CI y producción), con sus dependencias empaquetadas. Facilita que alguien nuevo levante el proyecto con un comando (`docker compose up`), que la CI pruebe exactamente lo que se despliega, y escalar levantando más contenedores de la misma imagen.', 'So the app runs **the same everywhere** (my laptop, my teammates\', CI and production), with its dependencies packaged. It makes it easy for a newcomer to start the project with one command (`docker compose up`), for CI to test exactly what gets deployed, and to scale by starting more containers from the same image.')),
  ],

  /* ---------------- CI/CD ---------------- */
  cicd: [
    P('ci-p-canary', 'basic', l('Ahora el canary va al 25%. ¿Qué imprime?', 'Now the canary goes to 25%. What does it print?'),
      `def version_para(usuario_id, porcentaje_canary):
    return "nueva" if usuario_id % 100 < porcentaje_canary else "estable"

nuevos = 0
for usuario in range(400):
    if version_para(usuario, 25) == "nueva":
        nuevos += 1
print(nuevos, version_para(7, 25), version_para(30, 25))`,
      '100 nueva estable',
      l('De cada 100 ids, los que terminan en 0–24 van a la versión nueva: 25 por cada 100, así que **100** de 400. El usuario 7 cae en la **nueva** y el 30 en la **estable**, siempre igual.', 'Out of every 100 ids, those ending in 0–24 go to the new version: 25 per 100, so **100** out of 400. User 7 lands on the **new** one and user 30 on the **stable** one, always the same.'),
      l('`usuario_id % 100` da un número del 0 al 99.', '`usuario_id % 100` gives a number from 0 to 99.')),
    O('ci-p-flow', 'basic',
      l('Ordena el camino de un cambio desde tu computadora hasta producción.', 'Order a change\'s path from your computer to production.'),
      [
        l('Haces push de tu rama y abres un Pull Request.', 'You push your branch and open a Pull Request.'),
        l('La CI instala, corre el linter y las pruebas.', 'CI installs, runs the linter and the tests.'),
        l('Code review y merge a `main`.', 'Code review and merge into `main`.'),
        l('Se despliega a staging y se prueba.', 'It is deployed to staging and tested.'),
        l('Se despliega a producción (por ejemplo, con canary).', 'It is deployed to production (for example, with canary).'),
      ],
      l('Cada etapa es una oportunidad de detectar el error antes de que llegue a los usuarios.', 'Each stage is a chance to catch the bug before it reaches users.')),
    C('ci-p-stop', 'medium',
      l('¿Qué línea hace que el pipeline se detenga en el primer paso que falla? (con la correcta imprime `falló en: pruebas`)', 'Which line makes the pipeline stop at the first failing step? (the right one prints `falló en: pruebas`)'),
      `def correr(pasos):
    for nombre, salio_bien in pasos:
        if not salio_bien:
            ____
    return "todo verde"

print(correr([("lint", True), ("pruebas", False), ("e2e", False)]))`,
      ['continue', 'return f"falló en: {nombre}"', 'print(nombre)', 'pass'],
      1,
      l('`return` sale de la función en ese momento, así que los pasos siguientes ya no corren y el resultado dice dónde falló. Con `continue` o `pass` seguiría y diría "todo verde" aunque algo falló.', '`return` leaves the function right then, so later steps do not run and the result says where it failed. With `continue` or `pass` it would carry on and say "todo verde" even though something failed.'),
      l('Hay que salir de la función en cuanto un paso falla.', 'You must leave the function as soon as a step fails.')),
    R('ci-p-blue-green', 'medium',
      l('¿Qué ventaja tiene un despliegue blue-green si la versión nueva tiene un error grave?', 'What advantage does a blue-green deployment have if the new version has a serious bug?'),
      l('El **rollback es inmediato**: el ambiente anterior (azul) sigue intacto, así que basta con regresar el tráfico a él. No hay que volver a desplegar nada. La desventaja es mantener dos ambientes completos.', 'The **rollback is immediate**: the previous environment (blue) is still intact, so you just send traffic back to it. Nothing needs to be redeployed. The drawback is maintaining two full environments.')),
    R('ci-p-flags', 'medium',
      l('Tu equipo quiere hacer merge a `main` de una funcionalidad a medio terminar sin que los usuarios la vean. ¿Cómo?', 'Your team wants to merge a half-finished feature into `main` without users seeing it. How?'),
      l('Con un **feature flag**: el código se despliega **apagado** y se enciende cuando esté listo (primero para el equipo o un grupo de usuarios, luego para todos), sin volver a desplegar. Así se evitan ramas que viven semanas y se integran cambios pequeños.', 'With a **feature flag**: the code is deployed **switched off** and turned on when ready (first for the team or a group of users, then for everyone), without redeploying. That avoids branches that live for weeks and keeps changes small.')),
    R('ci-p-flaky', 'medium',
      l('Una prueba falla una de cada diez veces sin que nadie cambie nada. ¿Por qué es un problema y qué haces?', 'A test fails one in ten times with nobody changing anything. Why is it a problem and what do you do?'),
      l('Es una prueba **flaky** (inestable): el equipo se acostumbra a reintentar y a **ignorar el rojo**, y un error real se cuela. Hay que encontrar la causa (dependencia del tiempo, del orden de las pruebas, de la red, datos compartidos) y arreglarla; si no se puede pronto, se aparta y se marca para arreglar.', 'It is a **flaky** test: the team gets used to retrying and **ignoring red**, and a real bug slips through. You find the cause (dependence on time, test order, the network, shared data) and fix it; if that is not possible soon, you quarantine it and mark it for fixing.')),
    R('ci-p-why', 'interview',
      l('¿Qué ganas al agregar CI a un proyecto, aunque sea personal?', 'What do you gain by adding CI to a project, even a personal one?'),
      l('Cada cambio se **prueba automáticamente**: los errores se detectan en minutos, no en producción; nadie hace merge de código que rompe las pruebas; y te obliga a que el proyecto se instale desde cero (si funciona en la CI, no depende de tu máquina). En un portafolio muestra que trabajas como en un equipo real.', 'Every change is **tested automatically**: bugs are caught in minutes, not in production; nobody merges code that breaks the tests; and it forces the project to install from scratch (if it works in CI, it does not depend on your machine). In a portfolio it shows you work like a real team.')),
    R('ci-p-secrets', 'interview',
      l('Tu pipeline necesita una llave para desplegar a la nube. ¿Dónde la pones?', 'Your pipeline needs a key to deploy to the cloud. Where do you put it?'),
      l('En el **gestor de secretos de la CI** (por ejemplo, los *secrets* de GitHub Actions), que la inyecta como variable de entorno al correr. **Nunca** escrita en el YAML ni en el repositorio, y con los **permisos mínimos** necesarios para desplegar.', 'In the **CI\'s secrets manager** (for example, GitHub Actions *secrets*), which injects it as an environment variable at runtime. **Never** written in the YAML or the repository, and with the **minimum permissions** needed to deploy.')),
  ],
};
