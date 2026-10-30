import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, NODO_LISTA, O, P, R } from './builders';

/* Ejercicios: arrays y hash maps · dos punteros y ventana · listas enlazadas · pilas y colas.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores. */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Arrays, strings y hash maps ---------------- */
  'arrays-hashing': {
    1: R('ah-cp-index', 'basic',
      l('¿Por qué leer `arr[i]` cuesta O(1) pero insertar al inicio de un arreglo cuesta O(n)?', 'Why does reading `arr[i]` cost O(1) but inserting at the start of an array cost O(n)?'),
      l('Porque la memoria es **contigua**: la posición de `arr[i]` se calcula directo. Al insertar al inicio hay que **mover todos** los elementos un lugar.', 'Because memory is **contiguous**: the position of `arr[i]` is computed directly. Inserting at the start means **shifting every** element one place.')),
    5: P('ah-cp-count', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `conteo = {}
for letra in "banana":
    conteo[letra] = conteo.get(letra, 0) + 1
print(conteo)`,
      "{'b': 1, 'a': 3, 'n': 2}",
      l('Cuenta cada letra: b 1 vez, a 3 veces, n 2 veces. Un diccionario de Python conserva el **orden en que se agregó** cada clave.', 'It counts each letter: b once, a 3 times, n twice. A Python dictionary keeps the **order in which each key was added**.'),
      l('`conteo.get(letra, 0)` devuelve el conteo actual o 0 si la letra aún no está; luego se le suma 1. Recorre "banana" letra por letra.', '`conteo.get(letra, 0)` returns the current count or 0 if the letter is not there yet; then 1 is added. It walks "banana" letter by letter.')),
    12: O('ah-cp-buckets', 'medium',
      l('Ordena lo que pasa al **guardar una clave** en un hash map con encadenamiento.', 'Order what happens when **storing a key** in a hash map with chaining.'),
      [
        l('Se calcula el **hash** de la clave.', 'The key\'s **hash** is computed.'),
        l('El hash se convierte en el índice de una **cubeta**.', 'The hash is turned into a **bucket** index.'),
        l('Si la cubeta ya tiene claves (colisión), la nueva se agrega a su lista.', 'If the bucket already has keys (collision), the new one is added to its list.'),
        l('Para buscarla después, se repite el cálculo y solo se revisa esa cubeta.', 'To look it up later, the computation is repeated and only that bucket is checked.'),
      ],
      l('Por eso buscar es O(1) en promedio: no se revisa toda la tabla, solo una cubeta.', 'That is why lookup is O(1) on average: not the whole table, just one bucket.')),
  },

  /* ---------------- Dos punteros y ventana deslizante ---------------- */
  'two-pointers-window': {
    3: R('tp-cp-when', 'basic',
      l('¿Cuándo conviene usar **dos punteros desde los extremos**?', 'When is it a good idea to use **two pointers from both ends**?'),
      l('Cuando los datos están **ordenados** o son simétricos (pares que suman X, palíndromos, contenedor con más agua): el orden te dice qué puntero mover.', 'When the data is **sorted** or symmetric (pairs summing to X, palindromes, container with most water): the order tells you which pointer to move.')),
    7: O('tp-cp-template', 'basic',
      l('Ordena los pasos de la plantilla de **ventana deslizante**.', 'Order the steps of the **sliding window** template.'),
      [
        l('Expande `der` y agrega el nuevo elemento a la ventana.', 'Expand `der` and add the new element to the window.'),
        l('Mientras la ventana no sea válida, saca `s[izq]` y avanza `izq`.', 'While the window is invalid, remove `s[izq]` and advance `izq`.'),
        l('Actualiza la mejor respuesta con el tamaño actual.', 'Update the best answer with the current size.'),
        l('Repite hasta que `der` llegue al final.', 'Repeat until `der` reaches the end.'),
      ],
      l('Primero creces, luego reparas la ventana si se rompió, y al final mides.', 'First grow, then repair the window if it broke, and finally measure.')),
    10: P('tp-cp-abba', 'medium',
      l('Subcadena más larga sin letras repetidas. ¿Qué imprime con `"abba"`?', 'Longest substring without repeated letters. What does it print for `"abba"`?'),
      `s = "abba"
izq, mejor, vistos = 0, 0, set()
for der in range(len(s)):
    while s[der] in vistos:
        vistos.remove(s[izq])
        izq += 1
    vistos.add(s[der])
    mejor = max(mejor, der - izq + 1)
print(mejor)`,
      '2',
      l('"ab" mide 2. Al llegar la segunda "b" hay que sacar "a" y "b" de la izquierda; después "ba" también mide 2. La mejor longitud es **2**.', '"ab" has length 2. When the second "b" arrives, "a" and "b" must leave from the left; then "ba" also has length 2. The best length is **2**.'),
      l('`vistos` guarda las letras de la ventana. Si la letra nueva ya está, se saca por la izquierda hasta que deje de estar. `der - izq + 1` es el tamaño de la ventana.', '`vistos` holds the window\'s letters. If the new letter is already there, letters leave from the left until it is not. `der - izq + 1` is the window size.')),
  },

  /* ---------------- Listas enlazadas ---------------- */
  'linked-lists': {
    4: R('ll-cp-access', 'basic',
      l('¿Por qué llegar al elemento k de una lista enlazada cuesta O(k)?', 'Why does reaching element k of a linked list cost O(k)?'),
      l('Porque los nodos no están juntos en memoria: solo conoces la cabeza y tienes que **seguir los punteros** `sig` uno por uno.', 'Because nodes are not together in memory: you only know the head and must **follow the `sig` pointers** one by one.')),
    3: P('ll-cp-sum', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `${NODO_LISTA}
cabeza = Nodo(1, Nodo(2, Nodo(3)))
actual = cabeza
total = 0
while actual:
    total += actual.val
    actual = actual.sig
print(total)`,
      '6',
      l('Recorre 1 → 2 → 3 sumando cada valor: **6**. El ciclo termina cuando `actual` es `None` (después del último nodo).', 'It walks 1 → 2 → 3 adding each value: **6**. The loop ends when `actual` is `None` (after the last node).'),
      l('`Nodo(1, Nodo(2, Nodo(3)))` arma la lista 1 → 2 → 3. El ciclo avanza con `actual = actual.sig` hasta que no hay más nodos.', '`Nodo(1, Nodo(2, Nodo(3)))` builds the list 1 → 2 → 3. The loop advances with `actual = actual.sig` until there are no more nodes.')),
    7: O('ll-cp-reverse', 'medium',
      l('Ordena los 4 pasos que se repiten en cada vuelta al **invertir** una lista enlazada.', 'Order the 4 steps repeated in each iteration when **reversing** a linked list.'),
      [
        l('Guarda el siguiente: `sig = actual.sig`', 'Save the next one: `sig = actual.sig`'),
        l('Voltea la flecha: `actual.sig = prev`', 'Flip the arrow: `actual.sig = prev`'),
        l('Avanza `prev = actual`', 'Advance `prev = actual`'),
        l('Avanza `actual = sig`', 'Advance `actual = sig`'),
      ],
      l('Si volteas la flecha antes de guardar el siguiente, pierdes el resto de la lista.', 'If you flip the arrow before saving the next one, you lose the rest of the list.')),
  },

  /* ---------------- Pilas y colas ---------------- */
  'stacks-queues': {
    4: R('sq-cp-which', 'basic',
      l('¿Qué estructura usarías para el botón **"deshacer"** y cuál para atender clientes **por orden de llegada**?', 'Which structure would you use for an **"undo"** button and which for serving customers **in arrival order**?'),
      l('"Deshacer" → **pila** (lo último que hiciste se deshace primero, LIFO). Clientes → **cola** (el primero que llegó se atiende primero, FIFO).', '"Undo" → **stack** (the last thing you did is undone first, LIFO). Customers → **queue** (the first to arrive is served first, FIFO).')),
    1: P('sq-cp-stack', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `pila = []
for x in [1, 2, 3]:
    pila.append(x)
pila.pop()
pila.append(4)
print(pila.pop(), pila)`,
      '4 [1, 2]',
      l('Tras apilar 1, 2, 3 se saca el 3 y entra el 4. El último `pop()` saca el **4** (lo último que entró) y quedan **[1, 2]**.', 'After pushing 1, 2, 3 the 3 is popped and 4 is pushed. The last `pop()` takes **4** (the last one in) leaving **[1, 2]**.'),
      l('`append` pone arriba y `pop` saca lo de arriba: siempre lo último que entró.', '`append` puts on top and `pop` takes the top: always the last one in.')),
    3: P('sq-cp-queue', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `from collections import deque
cola = deque()
for x in "ABC":
    cola.append(x)
print(cola.popleft(), cola.popleft(), list(cola))`,
      "A B ['C']",
      l('En una cola sale **primero lo que entró primero**: A, luego B, y queda C.', 'In a queue **what came in first leaves first**: A, then B, and C remains.'),
      l('`append` agrega al final y `popleft` saca del frente.', '`append` adds at the back and `popleft` removes from the front.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Arrays, strings y hash maps ---------------- */
  'arrays-hashing': [
    P('ah-p-overwrite', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `d = {"a": 1}
d["b"] = 2
d["a"] = 5
print(d)`,
      "{'a': 5, 'b': 2}",
      l('Asignar a una clave que ya existe **reemplaza** su valor; no crea otra. "a" conserva su lugar (fue la primera en agregarse).', 'Assigning to an existing key **replaces** its value; it does not create another. "a" keeps its place (it was added first).'),
      l('Un diccionario guarda pares clave → valor y cada clave aparece una sola vez.', 'A dictionary stores key → value pairs and each key appears only once.')),
    C('ah-p-set', 'basic',
      l('Elige cómo crear `vistos` para que preguntar `x in vistos` sea **O(1)** en promedio y el código funcione.', 'Choose how to create `vistos` so that asking `x in vistos` is **O(1)** on average and the code works.'),
      `____
for x in [3, 1, 3]:
    if x in vistos:
        print("duplicado", x)
    vistos.add(x)`,
      ['vistos = []      # lista vacía', 'vistos = set()   # conjunto (set) vacío', 'vistos = {}      # diccionario vacío', 'vistos = 0       # un número'],
      1,
      l('Un **set** responde `in` en O(1) promedio y tiene `.add`. Una lista lo haría en O(n) (y no tiene `.add`); `{}` crea un diccionario, no un set.', 'A **set** answers `in` in O(1) on average and has `.add`. A list would take O(n) (and has no `.add`); `{}` creates a dictionary, not a set.'),
      l('Recorre 3, 1, 3: el primer 3 se guarda, el 1 se guarda, y el segundo 3 ya está → imprime "duplicado 3".', 'It walks 3, 1, 3: the first 3 is stored, 1 is stored, and the second 3 is already there → prints "duplicado 3".')),
    R('ah-p-word-count', 'basic',
      l('¿Qué estructura usarías para contar cuántas veces aparece cada palabra de un texto, y cuánto cuesta?', 'Which structure would you use to count how many times each word appears in a text, and what does it cost?'),
      l('Un **diccionario** palabra → conteo. Cada actualización es O(1) en promedio, así que todo el texto cuesta **O(n)**.', 'A **dictionary** word → count. Each update is O(1) on average, so the whole text costs **O(n)**.')),
    P('ah-p-repeated', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `nums = [4, 1, 4, 2, 1, 4]
visto = set()
repetidos = []
for x in nums:
    if x in visto and x not in repetidos:
        repetidos.append(x)
    visto.add(x)
print(repetidos)`,
      '[4, 1]',
      l('El 4 se repite primero (posición 2) y luego el 1 (posición 4). El tercer 4 ya está en `repetidos`, así que no se agrega de nuevo.', '4 repeats first (position 2) and then 1 (position 4). The third 4 is already in `repetidos`, so it is not added again.'),
      l('`visto` recuerda todo lo que ya apareció; `repetidos` guarda cada número repetido una sola vez, en el orden en que se descubrió.', '`visto` remembers everything seen; `repetidos` stores each repeated number once, in the order it was discovered.')),
    C('ah-p-anagram-key', 'medium',
      l('Agrupa las palabras que son anagramas. ¿Qué clave usarías? (con la correcta imprime 2)', 'Group the words that are anagrams. Which key would you use? (the right one prints 2)'),
      `grupos = {}
for w in ["eat", "tea", "tan", "ate"]:
    clave = ____
    grupos.setdefault(clave, []).append(w)   # crea la lista si no existe y agrega w
print(len(grupos))`,
      ['"".join(sorted(w))', 'w', 'len(w)', 'w[0]'],
      0,
      l('Los anagramas tienen **las mismas letras**: al ordenarlas dan la misma clave ("aet" para eat/tea/ate y "ant" para tan) → 2 grupos. Con la palabra tal cual habría 4 grupos, con la longitud 1, y con la primera letra 3.', 'Anagrams have **the same letters**: sorting them gives the same key ("aet" for eat/tea/ate and "ant" for tan) → 2 groups. Using the word itself gives 4 groups, the length 1, and the first letter 3.'),
      l('Cada palabra se convierte en su clave y se agrega a la lista de esa clave en el diccionario.', 'Each word is turned into its key and added to that key\'s list in the dictionary.')),
    O('ah-p-two-sum', 'medium',
      l('Ordena los pasos de **Two Sum** con un hash map (O(n)).', 'Order the steps of **Two Sum** with a hash map (O(n)).'),
      [
        l('Crea un diccionario vacío `vistos` (valor → posición).', 'Create an empty dictionary `vistos` (value → position).'),
        l('Recorre la lista y para cada `x` calcula `target - x`.', 'Walk the list and for each `x` compute `target - x`.'),
        l('Si `target - x` está en `vistos`, devuelve las dos posiciones.', 'If `target - x` is in `vistos`, return both positions.'),
        l('Si no, guarda `x` con su posición en `vistos` y sigue.', 'Otherwise store `x` with its position in `vistos` and continue.'),
      ],
      l('Se pregunta por el complemento **antes** de guardar x, para no emparejar un número consigo mismo.', 'You ask for the complement **before** storing x, so a number is not paired with itself.')),
    R('ah-p-first-unique', 'interview',
      l('Te piden la posición del **primer carácter que no se repite** en un string. ¿Cómo lo harías en O(n)?', 'You are asked for the position of the **first non-repeating character** in a string. How would you do it in O(n)?'),
      l('Dos pasadas: 1) cuenta las frecuencias con un diccionario; 2) recorre el string otra vez y devuelve la primera posición cuyo conteo sea 1. Tiempo **O(n)**, espacio O(k) (k = letras distintas).', 'Two passes: 1) count frequencies with a dictionary; 2) walk the string again and return the first position whose count is 1. Time **O(n)**, space O(k) (k = distinct letters).')),
    P('ah-p-first-unique-code', 'interview', l('¿Qué imprime?', 'What does it print?'),
      `def primer_unico(s):
    conteo = {}
    for c in s:
        conteo[c] = conteo.get(c, 0) + 1
    for i, c in enumerate(s):      # i = posición, c = carácter
        if conteo[c] == 1:
            return i
    return -1

print(primer_unico("leetcode"), primer_unico("aabb"))`,
      '0 -1',
      l('En "leetcode" la "l" aparece una vez y está en la posición **0**. En "aabb" todas se repiten → **-1**.', 'In "leetcode" the "l" appears once and is at position **0**. In "aabb" every letter repeats → **-1**.'),
      l('Primero cuenta todas las letras; después busca, en orden, la primera con conteo 1.', 'First it counts every letter; then it looks, in order, for the first one with count 1.')),
  ],

  /* ---------------- Dos punteros y ventana deslizante ---------------- */
  'two-pointers-window': [
    P('tp-p-palindrome', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `s = "radar"
i, j = 0, len(s) - 1
es = True
while i < j:
    if s[i] != s[j]:
        es = False
    i += 1
    j -= 1
print(es)`,
      'True',
      l('Compara r-r y a-a desde los extremos hacia el centro; todas coinciden → **True**. La "d" del centro no necesita compararse.', 'It compares r-r and a-a from both ends toward the center; all match → **True**. The middle "d" needs no comparison.'),
      l('`i` empieza al inicio y `j` al final; se acercan hasta cruzarse.', '`i` starts at the beginning and `j` at the end; they move closer until they cross.')),
    C('tp-p-sorted-pair', 'basic',
      l('Lista **ordenada**: busca dos números que sumen 13. Completa la línea (con la correcta imprime `4 9`).', '**Sorted** list: find two numbers that add up to 13. Complete the line (the right one prints `4 9`).'),
      `nums = [1, 3, 4, 6, 9]
target = 13
i, j = 0, len(nums) - 1
while i < j:
    suma = nums[i] + nums[j]
    if suma == target:
        break
    elif suma < target:
        ____
    else:
        j -= 1
print(nums[i], nums[j])`,
      ['i += 1', 'j += 1', 'i -= 1', 'j -= 1'],
      0,
      l('Si la suma es **chica**, necesitas un número más grande: avanzas `i` (a la derecha hay valores mayores). Si es grande, retrocedes `j`.', 'If the sum is **too small** you need a larger number: advance `i` (larger values are to the right). If too big, move `j` back.'),
      l('1+9=10 es poco → avanza i; 3+9=12 es poco → avanza i; 4+9=13 ✓.', '1+9=10 is too little → advance i; 3+9=12 too little → advance i; 4+9=13 ✓.')),
    R('tp-p-why-on', 'basic',
      l('En la ventana deslizante hay un `while` dentro del `for`. ¿Por qué el total sigue siendo O(n)?', 'Sliding window has a `while` inside the `for`. Why is the total still O(n)?'),
      l('Porque `izq` **solo avanza** y nunca retrocede: cada elemento entra a la ventana una vez y sale como mucho una vez → a lo más 2n movimientos.', 'Because `izq` **only moves forward**: each element enters the window once and leaves at most once → at most 2n moves.')),
    P('tp-p-fixed-window', 'medium', l('Ventana de tamaño fijo k = 3. ¿Qué imprime?', 'Fixed-size window k = 3. What does it print?'),
      `a = [2, 1, 5, 1, 3, 2]
k = 3
ventana = sum(a[:k])
mejor = ventana
for i in range(k, len(a)):
    ventana += a[i] - a[i - k]
    mejor = max(mejor, ventana)
print(mejor)`,
      '9',
      l('Las sumas de cada ventana son 8, 7, 9, 6. La mayor es **9** ([5, 1, 3]). Cada movimiento cuesta O(1): suma el que entra y resta el que sale.', 'The window sums are 8, 7, 9, 6. The largest is **9** ([5, 1, 3]). Each slide costs O(1): add the incoming, subtract the outgoing.'),
      l('`ventana` empieza con la suma de los primeros 3. Al deslizar, `a[i]` entra y `a[i - k]` sale.', '`ventana` starts with the sum of the first 3. When sliding, `a[i]` enters and `a[i - k]` leaves.')),
    O('tp-p-container', 'medium',
      l('Ordena los pasos para resolver **"contenedor con más agua"** con dos punteros.', 'Order the steps to solve **"container with most water"** with two pointers.'),
      [
        l('Pon un puntero en cada extremo.', 'Put a pointer at each end.'),
        l('Calcula el área usando la línea más baja y la distancia entre punteros.', 'Compute the area using the shorter line and the distance between pointers.'),
        l('Guarda el área si es la mejor hasta ahora.', 'Keep the area if it is the best so far.'),
        l('Mueve hacia adentro el puntero de la línea **más baja**.', 'Move the pointer at the **shorter** line inward.'),
        l('Repite hasta que los punteros se crucen.', 'Repeat until the pointers cross.'),
      ],
      l('Mover la línea alta nunca mejora el área: la altura la limita la baja y el ancho solo se reduce.', 'Moving the taller line never improves the area: the shorter one limits the height and the width only shrinks.')),
    C('tp-p-min-window', 'medium',
      l('Subarreglo **más corto** con suma ≥ 7. ¿Qué condición va en el `while`? (con la correcta imprime 2)', '**Shortest** subarray with sum ≥ 7. Which condition goes in the `while`? (the right one prints 2)'),
      `nums = [2, 3, 1, 2, 4, 3]
objetivo = 7
izq, suma, mejor = 0, 0, len(nums) + 1
for der in range(len(nums)):
    suma += nums[der]
    while ____:
        mejor = min(mejor, der - izq + 1)
        suma -= nums[izq]
        izq += 1
print(mejor)`,
      ['suma >= objetivo', 'suma < objetivo', 'suma == objetivo', 'suma > 0'],
      0,
      l('Mientras la ventana **ya cumple** (suma ≥ 7) intentas achicarla por la izquierda para encontrar una más corta. La más corta es [4, 3] → **2**.', 'While the window **already qualifies** (sum ≥ 7) you try shrinking it from the left to find a shorter one. The shortest is [4, 3] → **2**.'),
      l('`der` agrega números; cuando la suma alcanza el objetivo, se mide la ventana y se saca el de la izquierda para ver si sigue alcanzando.', '`der` adds numbers; when the sum reaches the target, the window is measured and the leftmost one is removed to see if it still reaches it.')),
    R('tp-p-two-distinct', 'interview',
      l('Te piden la subcadena más larga con **a lo más 2 caracteres distintos**. ¿Qué técnica y qué estructura usas?', 'You are asked for the longest substring with **at most 2 distinct characters**. Which technique and which structure do you use?'),
      l('**Ventana deslizante** + un **diccionario** con el conteo de cada carácter en la ventana. Cuando el diccionario tiene más de 2 claves, contraes por la izquierda (bajas el conteo y borras la clave al llegar a 0). **O(n)**.', '**Sliding window** + a **dictionary** with each character\'s count in the window. When it has more than 2 keys, shrink from the left (decrease the count and delete the key at 0). **O(n)**.')),
    P('tp-p-water', 'interview', l('¿Qué imprime?', 'What does it print?'),
      `h = [1, 8, 6, 2, 5, 4, 8, 3, 7]
i, j, mejor = 0, len(h) - 1, 0
while i < j:
    mejor = max(mejor, min(h[i], h[j]) * (j - i))
    if h[i] < h[j]:
        i += 1
    else:
        j -= 1
print(mejor)`,
      '49',
      l('La mejor pareja son las líneas de altura 8 (posición 1) y 7 (posición 8): min(8, 7) × 7 = **49**.', 'The best pair is the lines of height 8 (position 1) and 7 (position 8): min(8, 7) × 7 = **49**.'),
      l('El área es la línea más baja por la distancia. En cada vuelta se descarta la línea más baja.', 'The area is the shorter line times the distance. Each iteration discards the shorter line.')),
  ],

  /* ---------------- Listas enlazadas ---------------- */
  'linked-lists': [
    P('ll-p-push-front', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${NODO_LISTA}
cabeza = Nodo(2, Nodo(3))
cabeza = Nodo(1, cabeza)        # insertar al inicio
vals = []
n = cabeza
while n:
    vals.append(n.val)
    n = n.sig
print(vals)`,
      '[1, 2, 3]',
      l('Insertar al inicio solo crea un nodo que apunta a la cabeza vieja: **O(1)**. La lista queda 1 → 2 → 3.', 'Inserting at the head just creates a node pointing to the old head: **O(1)**. The list becomes 1 → 2 → 3.'),
      l('El nodo nuevo (1) apunta a la cabeza anterior (2), y pasa a ser la cabeza.', 'The new node (1) points to the previous head (2) and becomes the head.')),
    R('ll-p-dummy', 'basic',
      l('¿Para qué sirve un **nodo dummy** al modificar una lista enlazada?', 'What is a **dummy node** for when modifying a linked list?'),
      l('Es un nodo falso antes de la cabeza: así la cabeza se trata como cualquier otro nodo y no necesitas casos especiales al borrarla o insertar antes de ella. Al final devuelves `dummy.sig`.', 'It is a fake node before the head: the head is then treated like any other node, with no special cases when deleting it or inserting before it. At the end you return `dummy.sig`.')),
    C('ll-p-advance', 'basic',
      l('Completa el recorrido para contar los nodos (con la correcta imprime 3).', 'Complete the traversal to count the nodes (the right one prints 3).'),
      `${NODO_LISTA}
cabeza = Nodo(5, Nodo(7, Nodo(9)))
n, cuenta = cabeza, 0
while n:
    cuenta += 1
    ____
print(cuenta)`,
      ['n = n.sig', 'n.sig = n', 'n = cabeza', 'cuenta += 1'],
      0,
      l('Hay que **avanzar** al siguiente nodo; si no, el ciclo nunca termina (las otras opciones se quedan dando vueltas para siempre).', 'You must **advance** to the next node; otherwise the loop never ends (the other options loop forever).'),
      l('Cada vuelta cuenta un nodo y pasa al siguiente hasta llegar a `None`.', 'Each iteration counts one node and moves to the next until reaching `None`.')),
    P('ll-p-reverse', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `${NODO_LISTA}
def invertir(cabeza):
    prev, actual = None, cabeza
    while actual:
        sig = actual.sig
        actual.sig = prev
        prev = actual
        actual = sig
    return prev

n = invertir(Nodo(1, Nodo(2, Nodo(3))))
print(n.val, n.sig.val, n.sig.sig.val)`,
      '3 2 1',
      l('Cada nodo pasa a apuntar al anterior; al final `prev` es la nueva cabeza: 3 → 2 → 1.', 'Each node ends up pointing to the previous one; at the end `prev` is the new head: 3 → 2 → 1.'),
      l('`prev` va construyendo la lista invertida; `actual` recorre la original.', '`prev` builds the reversed list; `actual` walks the original one.')),
    P('ll-p-middle', 'medium', l('Puntero rápido y lento. ¿Qué imprime?', 'Fast and slow pointers. What does it print?'),
      `${NODO_LISTA}
lento = rapido = Nodo(1, Nodo(2, Nodo(3, Nodo(4, Nodo(5)))))
while rapido and rapido.sig:
    lento = lento.sig
    rapido = rapido.sig.sig
print(lento.val)`,
      '3',
      l('`rapido` avanza 2 por cada 1 de `lento`: cuando `rapido` llega al final, `lento` está en el **medio** (3).', '`rapido` moves 2 for every 1 of `lento`: when `rapido` reaches the end, `lento` is in the **middle** (3).'),
      l('Los dos empiezan en la cabeza. El ciclo sigue mientras `rapido` pueda dar dos pasos.', 'Both start at the head. The loop continues while `rapido` can take two steps.')),
    C('ll-p-delete', 'medium',
      l('Borra todos los nodos con valor 1 usando un **dummy**. ¿Qué línea va? (con la correcta imprime `2 None`)', 'Delete every node with value 1 using a **dummy**. Which line goes there? (the right one prints `2 None`)'),
      `${NODO_LISTA}
def eliminar(cabeza, x):
    dummy = Nodo(0, cabeza)
    n = dummy
    while n.sig:
        if n.sig.val == x:
            ____
        else:
            n = n.sig
    return dummy.sig

r = eliminar(Nodo(1, Nodo(2, Nodo(1))), 1)
print(r.val, r.sig)`,
      ['n.sig = n.sig.sig', 'n = n.sig.sig', 'n.sig = None', 'n.val = x'],
      0,
      l('Para borrar el siguiente nodo, `n` lo **salta**: apunta directo al de después. No se avanza `n` porque el nuevo siguiente también podría ser un 1.', 'To delete the next node, `n` **skips** it: it points straight to the one after. `n` does not advance because the new next one could also be a 1.'),
      l('El dummy permite borrar también la cabeza (el primer 1) sin casos especiales.', 'The dummy also lets you delete the head (the first 1) with no special cases.')),
    R('ll-p-cycle', 'interview',
      l('¿Cómo detectas si una lista enlazada tiene un **ciclo** usando memoria O(1)?', 'How do you detect whether a linked list has a **cycle** using O(1) memory?'),
      l('Con el algoritmo de **Floyd** (tortuga y liebre): `lento` avanza 1 y `rapido` 2. Si hay ciclo, en algún momento se encuentran; si `rapido` llega a `None`, no hay ciclo. O(n) tiempo, O(1) espacio.', 'With **Floyd\'s** algorithm (tortoise and hare): `lento` moves 1 and `rapido` 2. If there is a cycle they eventually meet; if `rapido` reaches `None`, there is none. O(n) time, O(1) space.')),
    O('ll-p-merge', 'interview',
      l('Ordena los pasos para **combinar dos listas ordenadas**.', 'Order the steps to **merge two sorted lists**.'),
      [
        l('Crea un nodo dummy y un puntero `cola` en él.', 'Create a dummy node and a `cola` pointer on it.'),
        l('Mientras ambas listas tengan nodos, enlaza a `cola` el menor de los dos y avanza esa lista.', 'While both lists have nodes, link the smaller of the two to `cola` and advance that list.'),
        l('Avanza `cola` al nodo que acabas de enlazar.', 'Move `cola` to the node you just linked.'),
        l('Cuando una se vacía, enlaza lo que quede de la otra.', 'When one runs out, link whatever remains of the other.'),
        l('Devuelve `dummy.sig`.', 'Return `dummy.sig`.'),
      ],
      l('Es O(n + m) y no necesita memoria extra: solo cambia punteros.', 'It is O(n + m) and needs no extra memory: it only changes pointers.')),
  ],

  /* ---------------- Pilas y colas ---------------- */
  'stacks-queues': [
    C('sq-p-balanced', 'basic',
      l('Completa la línea para revisar si los paréntesis están balanceados (con la correcta imprime `True False`).', 'Complete the line to check whether the parentheses are balanced (the right one prints `True False`).'),
      `def balanceado(s):
    pila = []
    for c in s:
        if c == "(":
            pila.append(c)
        else:
            if not pila:
                return False
            ____
    return len(pila) == 0

print(balanceado("(()())"), balanceado("())"))`,
      ['pila.pop()', 'pila.append(c)', 'return True', 'return False'],
      0,
      l('Cada `)` **cierra** el último `(` abierto: lo sacas de la pila. Al final la pila debe quedar vacía.', 'Each `)` **closes** the last open `(`: you pop it from the stack. At the end the stack must be empty.'),
      l('Los `(` se apilan; cada `)` saca uno. Si llega un `)` con la pila vacía, sobra un cierre.', '`(` are pushed; each `)` pops one. If a `)` arrives with an empty stack, there is an extra closing one.')),
    R('sq-p-lifo-fifo', 'basic',
      l('¿Qué significan LIFO y FIFO, y qué estructura es cada una?', 'What do LIFO and FIFO mean, and which structure is each?'),
      l('**LIFO** (último en entrar, primero en salir) = **pila**. **FIFO** (primero en entrar, primero en salir) = **cola**.', '**LIFO** (last in, first out) = **stack**. **FIFO** (first in, first out) = **queue**.')),
    P('sq-p-reverse', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `pila = list("hola")
res = ""
while pila:
    res += pila.pop()
print(res)`,
      'aloh',
      l('Sacar todo de una pila da los elementos **al revés**: "aloh". Por eso una pila sirve para invertir.', 'Popping everything from a stack gives the elements **in reverse**: "aloh". That is why a stack is used to reverse things.'),
      l('`list("hola")` es [\'h\', \'o\', \'l\', \'a\']; `pop()` saca siempre el último.', '`list("hola")` is [\'h\', \'o\', \'l\', \'a\']; `pop()` always removes the last one.')),
    P('sq-p-monotonic', 'medium', l('Pila monótona: ¿cuántos días hay que esperar a una temperatura mayor? ¿Qué imprime?', 'Monotonic stack: how many days until a warmer temperature? What does it print?'),
      `temps = [73, 74, 75, 71, 69, 72]
res = [0] * len(temps)
pila = []                        # índices que esperan un día más caluroso
for i, t in enumerate(temps):    # i = día, t = temperatura
    while pila and temps[pila[-1]] < t:
        j = pila.pop()
        res[j] = i - j
    pila.append(i)
print(res)`,
      '[1, 1, 0, 2, 1, 0]',
      l('Cuando llega un día más caluroso, resuelve a todos los días más fríos que esperaban en la pila. 75 y 72 nunca encuentran uno mayor → 0.', 'When a warmer day arrives, it resolves every colder day waiting on the stack. 75 and 72 never find a warmer one → 0.'),
      l('La pila guarda los días **sin respuesta todavía**, de más caluroso (abajo) a más frío (arriba).', 'The stack holds days **with no answer yet**, from warmest (bottom) to coldest (top).')),
    O('sq-p-two-stacks', 'medium',
      l('Cola hecha con **dos pilas** (`entrada` y `salida`). Ordena cómo se desencola.', 'Queue built from **two stacks** (`entrada` and `salida`). Order how dequeuing works.'),
      [
        l('Para encolar, siempre haz push en `entrada`.', 'To enqueue, always push onto `entrada`.'),
        l('Para desencolar, revisa si `salida` está vacía.', 'To dequeue, check whether `salida` is empty.'),
        l('Si lo está, pasa todo de `entrada` a `salida` (pop de una y push en la otra).', 'If it is, move everything from `entrada` to `salida` (pop from one, push onto the other).'),
        l('Haz pop de `salida`: ese es el elemento más antiguo.', 'Pop from `salida`: that is the oldest element.'),
      ],
      l('Al pasar de una pila a otra el orden se invierte, así que el más antiguo queda arriba. Cada elemento se mueve una sola vez → O(1) amortizado.', 'Moving from one stack to the other reverses the order, so the oldest ends on top. Each element moves only once → O(1) amortized.')),
    C('sq-p-rpn', 'medium',
      l('Evaluando notación polaca inversa `8 3 -`. ¿Qué va en el `append`? (con la correcta imprime 5)', 'Evaluating reverse Polish notation `8 3 -`. What goes in the `append`? (the right one prints 5)'),
      `pila = []
for tok in ["8", "3", "-"]:
    if tok == "-":
        b = pila.pop()
        a = pila.pop()
        pila.append(____)
    else:
        pila.append(int(tok))
print(pila[0])`,
      ['a - b', 'b - a', 'a + b', 'a * b'],
      0,
      l('El primer `pop` saca el **último** número (3) → `b`; el segundo saca el 8 → `a`. La operación es `a - b` = 8 − 3 = **5**.', 'The first `pop` takes the **last** number (3) → `b`; the second takes 8 → `a`. The operation is `a - b` = 8 − 3 = **5**.'),
      l('Los números se apilan; al llegar un operador se sacan los dos últimos y se apila el resultado.', 'Numbers are pushed; when an operator arrives, the last two are popped and the result is pushed.')),
    R('sq-p-pop0', 'interview',
      l('¿Por qué `lista.pop(0)` es mala idea para una cola grande en Python, y qué usas en su lugar?', 'Why is `list.pop(0)` a bad idea for a large queue in Python, and what do you use instead?'),
      l('`pop(0)` mueve todos los elementos restantes un lugar: **O(n)** por operación. `collections.deque` saca del frente con `popleft()` en **O(1)**.', '`pop(0)` shifts every remaining element one place: **O(n)** per operation. `collections.deque` removes from the front with `popleft()` in **O(1)**.')),
    P('sq-p-min-stack', 'interview', l('Pila que recuerda su mínimo. ¿Qué imprime?', 'A stack that remembers its minimum. What does it print?'),
      `pila = []        # guarda (valor, mínimo hasta aquí)
for x in [5, 2, 7, 1]:
    m = min(x, pila[-1][1]) if pila else x
    pila.append((x, m))
pila.pop()
print(pila[-1][1])`,
      '2',
      l('Tras sacar el 1, la cima es (7, 2): el mínimo de lo que queda (5, 2, 7) es **2**, y se obtiene en O(1) sin recorrer la pila.', 'After popping 1, the top is (7, 2): the minimum of what remains (5, 2, 7) is **2**, obtained in O(1) without scanning the stack.'),
      l('Cada elemento se guarda junto con el mínimo que había **hasta ese momento**.', 'Each element is stored together with the minimum **up to that point**.')),
  ],
};
