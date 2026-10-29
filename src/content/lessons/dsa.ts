import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, viz, warn } from './helpers';

export const DSA_LESSONS: Lesson[] = [
  {
    id: 'big-o',
    track: 'dsa',
    title: l('Complejidad y notación Big O', 'Complexity and Big O notation'),
    summary: l('Cómo medir qué tan rápido crece el costo de un algoritmo.', 'How to measure how fast an algorithm\'s cost grows.'),
    minutes: 12,
    blocks: [
      md(
        `## ¿Por qué importa?
En una entrevista no basta con que tu código funcione: te preguntarán **qué tan eficiente es**. Big O describe cómo crece el tiempo (o la memoria) cuando la entrada \`n\` se hace grande.

Reglas básicas:
- **Ignora constantes**: \`O(2n)\` → \`O(n)\`.
- **Quédate con el término dominante**: \`O(n² + n)\` → \`O(n²)\`.
- **Pasos secuenciales se suman**, **anidados se multiplican**.

| Complejidad | Nombre | Ejemplo |
|---|---|---|
| O(1) | constante | acceder a \`arr[i]\`, buscar en un hash map |
| O(log n) | logarítmica | búsqueda binaria |
| O(n) | lineal | recorrer un arreglo |
| O(n log n) | linearítmica | merge sort |
| O(n²) | cuadrática | dos ciclos anidados |
| O(2ⁿ) | exponencial | todos los subconjuntos |`,
        `## Why does it matter?
In an interview it is not enough for your code to work: you will be asked **how efficient it is**. Big O describes how time (or memory) grows as the input \`n\` gets large.

Basic rules:
- **Drop constants**: \`O(2n)\` → \`O(n)\`.
- **Keep the dominant term**: \`O(n² + n)\` → \`O(n²)\`.
- **Sequential steps add**, **nested ones multiply**.

| Complexity | Name | Example |
|---|---|---|
| O(1) | constant | access \`arr[i]\`, hash map lookup |
| O(log n) | logarithmic | binary search |
| O(n) | linear | walk an array |
| O(n log n) | linearithmic | merge sort |
| O(n²) | quadratic | two nested loops |
| O(2ⁿ) | exponential | all subsets |`,
      ),
      code(`def ejemplo(nums):
    total = 0
    for x in nums:          # O(n)
        total += x
    for x in nums:          # O(n)
        for y in nums:      #   × O(n)  → O(n²)
            print(x, y)
    return total            # Total: O(n + n²) = O(n²)`),
      md(
        `## Espacio
La complejidad de **espacio** cuenta la memoria extra que usas: estructuras auxiliares y la **pila de recursión**. Una función recursiva de profundidad \`n\` usa O(n) espacio aunque no cree arreglos.`,
        `## Space
**Space** complexity counts the extra memory you use: auxiliary structures and the **recursion stack**. A recursive function with depth \`n\` uses O(n) space even if it creates no arrays.`,
      ),
      interview(
        'Siempre di la complejidad de tiempo **y** espacio al terminar tu solución, sin que te la pidan. Si tu primera idea es O(n²), menciónala y luego pregunta "¿puedo optimizarla?".',
        'Always state time **and** space complexity when you finish your solution, without being asked. If your first idea is O(n²), say so and then ask "can I optimize it?".',
      ),
    ],
    quiz: [
      q('¿Cuál es la complejidad de un ciclo dentro de otro, ambos sobre n?', 'What is the complexity of a loop inside another, both over n?', [['O(n)', 'O(n)'], ['O(2n)', 'O(2n)'], ['O(n²)', 'O(n²)'], ['O(log n)', 'O(log n)']], 2,
        'Los ciclos anidados se multiplican: n × n.', 'Nested loops multiply: n × n.'),
      q('Simplifica O(3n + n log n + 50)', 'Simplify O(3n + n log n + 50)', [['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)'], ['O(3n)', 'O(3n)'], ['O(50)', 'O(50)']], 1,
        'n log n domina a n y a las constantes.', 'n log n dominates n and constants.'),
      q('¿Qué complejidad tiene dividir el problema a la mitad en cada paso?', 'What complexity does halving the problem at each step have?', [['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)'], ['O(1)', 'O(1)']], 1,
        'Solo puedes dividir n a la mitad log₂(n) veces.', 'You can only halve n log₂(n) times.'),
    ],
    concepts: [
      concept('¿Cómo combinas complejidades de pasos secuenciales vs anidados?', 'How do you combine complexities of sequential vs nested steps?', 'Secuenciales se suman (y te quedas con el mayor); anidados se multiplican.', 'Sequential add (keep the largest); nested multiply.'),
      concept('¿Cuánto espacio usa una recursión de profundidad n?', 'How much space does a recursion of depth n use?', 'O(n), por los marcos en la pila de llamadas.', 'O(n), because of the frames on the call stack.'),
    ],
  },
  {
    id: 'arrays-hashing',
    track: 'dsa',
    title: l('Arrays, strings y hash maps', 'Arrays, strings and hash maps'),
    summary: l('Las estructuras más usadas en entrevistas y el truco de "recordar lo visto".', 'The most used structures in interviews and the "remember what you saw" trick.'),
    minutes: 15,
    blocks: [
      md(
        `## Arrays
Un array guarda elementos en **memoria contigua**, por eso acceder por índice es O(1). Insertar o borrar en medio cuesta O(n), porque hay que desplazar elementos.

## Hash maps (diccionarios) y sets
Un hash map asocia **clave → valor** usando una función hash que calcula en qué "cubeta" guardar cada clave. En promedio, insertar, buscar y borrar son **O(1)**.

El patrón más común en entrevistas: **cambiar tiempo por memoria**. En vez de buscar con otro ciclo (O(n²)), guardas lo que ya viste en un hash map y consultas en O(1).`,
        `## Arrays
An array stores elements in **contiguous memory**, which is why index access is O(1). Inserting or deleting in the middle costs O(n), because elements must shift.

## Hash maps (dictionaries) and sets
A hash map associates **key → value** using a hash function that computes which "bucket" stores each key. On average, insert, lookup and delete are **O(1)**.

The most common interview pattern: **trade memory for time**. Instead of searching with another loop (O(n²)), store what you have seen in a hash map and look it up in O(1).`,
      ),
      code(`# Contar frecuencias: patrón clásico
def frecuencias(palabras):
    conteo = {}
    for p in palabras:
        conteo[p] = conteo.get(p, 0) + 1
    return conteo

frecuencias(["a", "b", "a"])  # {'a': 2, 'b': 1}`),
      tip('Cuando escuches "¿existe…?", "¿cuántas veces…?", "¿ya apareció…?" o "encuentra el par…", piensa primero en un **set** o **hash map**.',
        'When you hear "does it exist…?", "how many times…?", "has it appeared…?" or "find the pair…", think of a **set** or **hash map** first.'),
      warn('Las claves de un hash map deben ser inmutables (en Python: no puedes usar una lista como clave, pero sí una tupla).', 'Hash map keys must be immutable (in Python you cannot use a list as a key, but you can use a tuple).'),
      interview('Pregunta típica: "¿Cuál es el peor caso de un hash map?". Respuesta: O(n) si todas las claves colisionan, aunque en la práctica es O(1) promedio.', 'Typical question: "What is the worst case of a hash map?". Answer: O(n) if every key collides, though in practice it is O(1) on average.'),
    ],
    quiz: [
      q('¿Qué complejidad tiene buscar una clave en un hash map (promedio)?', 'What is the average complexity of looking up a key in a hash map?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n)', 'O(n)'], ['O(n²)', 'O(n²)']], 0,
        'La función hash lleva directo a la cubeta.', 'The hash function goes straight to the bucket.'),
      q('¿Por qué insertar al inicio de un array es O(n)?', 'Why is inserting at the start of an array O(n)?', [['Hay que recorrerlo para encontrar el inicio', 'You must traverse it to find the start'], ['Hay que desplazar todos los elementos', 'All elements must shift'], ['Hay que ordenar el array', 'The array must be sorted'], ['No es O(n), es O(1)', 'It is not O(n), it is O(1)']], 1,
        'La memoria es contigua: cada elemento se mueve una posición.', 'Memory is contiguous: every element moves one position.'),
      q('Para saber si un arreglo tiene duplicados en O(n), usas…', 'To check whether an array has duplicates in O(n), you use…', [['Dos ciclos anidados', 'Two nested loops'], ['Un set', 'A set'], ['Búsqueda binaria', 'Binary search'], ['Una pila', 'A stack']], 1,
        'Agregas al set y verificas si ya estaba.', 'Add to the set and check whether it was already there.'),
    ],
    concepts: [
      concept('¿Qué es una colisión en un hash map?', 'What is a hash map collision?', 'Cuando dos claves distintas dan la misma cubeta; se resuelve con encadenamiento o direccionamiento abierto.', 'When two different keys map to the same bucket; resolved with chaining or open addressing.'),
      concept('Patrón "cambiar memoria por tiempo"', 'The "trade memory for time" pattern', 'Guardar lo visto en un hash map/set para responder en O(1) y bajar de O(n²) a O(n).', 'Store what you have seen in a hash map/set to answer in O(1), going from O(n²) to O(n).'),
    ],
    related: ['two-sum', 'contains-duplicate', 'valid-anagram', 'group-anagrams', 'top-k-frequent'],
  },
  {
    id: 'two-pointers-window',
    track: 'dsa',
    title: l('Dos punteros y ventana deslizante', 'Two pointers and sliding window'),
    summary: l('Técnicas para recorrer secuencias en O(n) en vez de O(n²).', 'Techniques to walk sequences in O(n) instead of O(n²).'),
    minutes: 15,
    blocks: [
      md(
        `## Dos punteros
Usa dos índices que se mueven según una regla:
- **Desde los extremos hacia el centro**: palíndromos, pares en arreglos **ordenados**.
- **Rápido y lento**: detectar ciclos, encontrar el medio de una lista.

## Ventana deslizante
Para problemas de **subarreglos o subcadenas contiguas**. Mantienes un rango \`[izq, der]\`:
1. Expandes \`der\` agregando un elemento.
2. Mientras la ventana no sea válida, contraes \`izq\`.
3. Actualizas la mejor respuesta.

Cada elemento entra y sale de la ventana **una sola vez**, por eso el total es O(n).`,
        `## Two pointers
Use two indices that move according to a rule:
- **From both ends toward the center**: palindromes, pairs in **sorted** arrays.
- **Fast and slow**: detect cycles, find the middle of a list.

## Sliding window
For **contiguous subarray or substring** problems. Keep a range \`[left, right]\`:
1. Expand \`right\` adding an element.
2. While the window is invalid, shrink \`left\`.
3. Update the best answer.

Each element enters and leaves the window **only once**, so the total is O(n).`,
      ),
      viz('sliding-window'),
      code(`def ventana_plantilla(s):
    izq = 0
    estado = {}
    mejor = 0
    for der, x in enumerate(s):
        # 1) agregar x al estado
        estado[x] = estado.get(x, 0) + 1
        # 2) contraer mientras sea inválida
        while estado[x] > 1:
            estado[s[izq]] -= 1
            izq += 1
        # 3) actualizar respuesta
        mejor = max(mejor, der - izq + 1)
    return mejor`),
      interview('Palabras clave: "subarreglo contiguo", "subcadena más larga/corta", "a lo más k". Si el arreglo está **ordenado** y buscas pares, piensa en dos punteros.', 'Keywords: "contiguous subarray", "longest/shortest substring", "at most k". If the array is **sorted** and you need pairs, think two pointers.'),
    ],
    quiz: [
      q('¿Qué condición suele necesitar "dos punteros desde los extremos"?', 'What condition does "two pointers from both ends" usually need?', [['Arreglo ordenado', 'Sorted array'], ['Arreglo con duplicados', 'Array with duplicates'], ['Lista enlazada', 'Linked list'], ['Árbol balanceado', 'Balanced tree']], 0,
        'El orden permite decidir qué puntero mover.', 'The ordering lets you decide which pointer to move.'),
      q('¿Por qué la ventana deslizante es O(n) aunque tenga un while dentro del for?', 'Why is sliding window O(n) even with a while inside the for?', [['Porque el while nunca se ejecuta', 'Because the while never runs'], ['Porque cada elemento entra y sale una sola vez', 'Because each element enters and leaves once'], ['Porque usa un hash map', 'Because it uses a hash map'], ['No es O(n), es O(n²)', 'It is not O(n), it is O(n²)']], 1,
        'izq solo avanza; en total se mueve como mucho n veces.', 'left only advances; in total it moves at most n times.'),
      q('¿Qué técnica usas para encontrar el medio de una lista enlazada en una pasada?', 'What technique finds the middle of a linked list in one pass?', [['Ventana deslizante', 'Sliding window'], ['Puntero rápido y lento', 'Fast and slow pointers'], ['Búsqueda binaria', 'Binary search'], ['Hash map', 'Hash map']], 1,
        'Cuando el rápido llega al final, el lento está en el medio.', 'When fast reaches the end, slow is in the middle.'),
    ],
    concepts: [
      concept('Pasos de la plantilla de ventana deslizante', 'Steps of the sliding window template', 'Expandir der → contraer izq mientras sea inválida → actualizar la respuesta.', 'Expand right → shrink left while invalid → update the answer.'),
      concept('¿Cuándo usar dos punteros desde los extremos?', 'When to use two pointers from both ends?', 'Con datos ordenados o simétricos: pares que suman X, palíndromos, contenedor con más agua.', 'With sorted or symmetric data: pairs summing to X, palindromes, container with most water.'),
    ],
    related: ['valid-palindrome', 'two-sum-sorted', 'three-sum', 'longest-substring', 'max-sum-subarray-k'],
  },
  {
    id: 'linked-lists',
    track: 'dsa',
    title: l('Listas enlazadas', 'Linked lists'),
    summary: l('Nodos, punteros y los trucos del nodo dummy y rápido/lento.', 'Nodes, pointers and the dummy node and fast/slow tricks.'),
    minutes: 12,
    blocks: [
      md(
        `## ¿Qué es?
Una secuencia de **nodos**; cada uno guarda un valor y un puntero al siguiente. No necesita memoria contigua.

| Operación | Array | Lista enlazada |
|---|---|---|
| Acceso por índice | O(1) | O(n) |
| Insertar al inicio | O(n) | O(1) |
| Insertar con referencia al nodo | O(n) | O(1) |

## Trucos clave
- **Nodo dummy**: un nodo falso antes de la cabeza evita casos especiales al insertar o borrar el primer elemento.
- **Rápido/lento**: detecta ciclos (Floyd) y encuentra el medio.
- **Invertir**: tres punteros (\`prev\`, \`cur\`, \`next\`).`,
        `## What is it?
A sequence of **nodes**; each stores a value and a pointer to the next one. It does not need contiguous memory.

| Operation | Array | Linked list |
|---|---|---|
| Index access | O(1) | O(n) |
| Insert at head | O(n) | O(1) |
| Insert given the node | O(n) | O(1) |

## Key tricks
- **Dummy node**: a fake node before the head avoids special cases when inserting or deleting the first element.
- **Fast/slow**: detects cycles (Floyd) and finds the middle.
- **Reverse**: three pointers (\`prev\`, \`cur\`, \`next\`).`,
      ),
      code(`class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def eliminar_valor(head, val):
    dummy = ListNode(0, head)
    cur = dummy
    while cur.next:
        if cur.next.val == val:
            cur.next = cur.next.next   # saltar el nodo
        else:
            cur = cur.next
    return dummy.next`),
      tip('Dibuja los nodos y flechas en papel (o en la pizarra) antes de mover punteros. La mayoría de los errores son por perder la referencia a `next`.', 'Draw the nodes and arrows on paper (or the whiteboard) before moving pointers. Most bugs come from losing the reference to `next`.'),
    ],
    quiz: [
      q('¿Para qué sirve un nodo dummy?', 'What is a dummy node for?', [['Ahorrar memoria', 'Save memory'], ['Evitar casos especiales en la cabeza', 'Avoid special cases at the head'], ['Ordenar la lista', 'Sort the list'], ['Detectar ciclos', 'Detect cycles']], 1,
        'Así la cabeza se trata como cualquier otro nodo.', 'The head is then treated like any other node.'),
      q('Acceder al k-ésimo elemento de una lista enlazada cuesta…', 'Accessing the k-th element of a linked list costs…', [['O(1)', 'O(1)'], ['O(k)', 'O(k)'], ['O(log k)', 'O(log k)'], ['O(k²)', 'O(k²)']], 1,
        'Hay que recorrer desde la cabeza.', 'You must walk from the head.'),
    ],
    concepts: [
      concept('Algoritmo de Floyd (tortuga y liebre)', 'Floyd\'s algorithm (tortoise and hare)', 'Lento avanza 1, rápido avanza 2; si se encuentran hay ciclo. O(n) tiempo, O(1) espacio.', 'Slow moves 1, fast moves 2; if they meet there is a cycle. O(n) time, O(1) space.'),
      concept('¿Cómo inviertes una lista enlazada?', 'How do you reverse a linked list?', 'Con prev, cur, next: guarda next, apunta cur.next a prev, avanza ambos. O(n), O(1).', 'With prev, cur, next: save next, point cur.next to prev, advance both. O(n), O(1).'),
    ],
    related: ['reverse-list', 'merge-two-lists', 'linked-list-cycle', 'middle-list'],
  },
  {
    id: 'stacks-queues',
    track: 'dsa',
    title: l('Pilas y colas', 'Stacks and queues'),
    summary: l('LIFO vs FIFO y la pila monótona.', 'LIFO vs FIFO and the monotonic stack.'),
    minutes: 10,
    blocks: [
      md(
        `## Pila (stack): LIFO
El último en entrar es el primero en salir. Operaciones \`push\`, \`pop\` y \`peek\`, todas O(1).
Usos: paréntesis balanceados, botón "deshacer", la **pila de llamadas** de las funciones y DFS iterativo.

## Cola (queue): FIFO
El primero en entrar es el primero en salir. En Python usa \`collections.deque\` (con \`list.pop(0)\` es O(n)).
Usos: **BFS**, colas de tareas, buffers.

## Pila monótona
Una pila que mantienes **ordenada** (creciente o decreciente). Sirve para "el siguiente elemento mayor/menor" en O(n).`,
        `## Stack: LIFO
Last in, first out. Operations \`push\`, \`pop\` and \`peek\`, all O(1).
Uses: balanced parentheses, "undo", the function **call stack** and iterative DFS.

## Queue: FIFO
First in, first out. In Python use \`collections.deque\` (\`list.pop(0)\` is O(n)).
Uses: **BFS**, task queues, buffers.

## Monotonic stack
A stack you keep **ordered** (increasing or decreasing). Solves "next greater/smaller element" in O(n).`,
      ),
      viz('stack-queue'),
      code(`from collections import deque

pila = []
pila.append(1); pila.append(2)
pila.pop()        # 2

cola = deque()
cola.append(1); cola.append(2)
cola.popleft()    # 1`),
      interview('Pregunta clásica: "Implementa una cola usando dos pilas". Una pila recibe los push; cuando necesitas sacar y la otra está vacía, pasas todo de una a otra (O(1) amortizado).', 'Classic question: "Implement a queue using two stacks". One stack receives pushes; when you need to pop and the other is empty, move everything over (O(1) amortized).'),
    ],
    quiz: [
      q('¿Qué estructura usa BFS?', 'Which structure does BFS use?', [['Pila', 'Stack'], ['Cola', 'Queue'], ['Heap', 'Heap'], ['Hash map', 'Hash map']], 1, 'BFS procesa en orden de llegada (FIFO).', 'BFS processes in arrival order (FIFO).'),
      q('¿Qué problema resuelve típicamente una pila monótona?', 'What problem does a monotonic stack typically solve?', [['Camino más corto', 'Shortest path'], ['Siguiente elemento mayor', 'Next greater element'], ['Ordenar', 'Sorting'], ['Buscar duplicados', 'Finding duplicates']], 1,
        'Mantiene candidatos ordenados y los resuelve al llegar uno mayor.', 'It keeps ordered candidates and resolves them when a greater one arrives.'),
    ],
    concepts: [
      concept('¿Por qué usar deque en vez de lista para una cola en Python?', 'Why use deque instead of list for a queue in Python?', 'Porque `list.pop(0)` es O(n) y `deque.popleft()` es O(1).', 'Because `list.pop(0)` is O(n) and `deque.popleft()` is O(1).'),
    ],
    related: ['valid-parentheses', 'min-stack', 'daily-temperatures', 'eval-rpn'],
  },
  {
    id: 'recursion',
    track: 'dsa',
    title: l('Recursión y backtracking', 'Recursion and backtracking'),
    summary: l('Caso base, llamada recursiva y cómo explorar todas las opciones.', 'Base case, recursive call and how to explore every option.'),
    minutes: 14,
    blocks: [
      md(
        `## Recursión
Una función que se llama a sí misma sobre un problema más pequeño. Siempre necesita:
1. **Caso base**: cuándo parar.
2. **Paso recursivo**: reducir el problema y combinar resultados.

Cada llamada ocupa un marco en la **pila de llamadas**; demasiada profundidad causa *stack overflow*.

## Backtracking
Explora todas las opciones construyendo una solución paso a paso y **deshaciendo** la última decisión al regresar. Se usa para permutaciones, subconjuntos, sudoku o N-reinas.`,
        `## Recursion
A function that calls itself on a smaller problem. It always needs:
1. **Base case**: when to stop.
2. **Recursive step**: reduce the problem and combine results.

Each call takes a frame on the **call stack**; too much depth causes a *stack overflow*.

## Backtracking
Explores every option by building a solution step by step and **undoing** the last choice on the way back. Used for permutations, subsets, sudoku or N-queens.`,
      ),
      code(`def subconjuntos(nums):
    res, actual = [], []

    def bt(i):
        if i == len(nums):          # caso base
            res.append(actual[:])
            return
        actual.append(nums[i])      # elegir
        bt(i + 1)
        actual.pop()                # deshacer
        bt(i + 1)                   # no elegir

    bt(0)
    return res                      # O(2ⁿ · n)`),
      tip('Si una recursión recalcula los mismos subproblemas (como Fibonacci ingenuo), agrega **memoización**: ya es programación dinámica.', 'If a recursion recomputes the same subproblems (like naive Fibonacci), add **memoization**: that is already dynamic programming.'),
    ],
    quiz: [
      q('¿Qué pasa si una función recursiva no tiene caso base?', 'What happens if a recursive function has no base case?', [['Devuelve None', 'It returns None'], ['Recursión infinita / stack overflow', 'Infinite recursion / stack overflow'], ['Se vuelve iterativa', 'It becomes iterative'], ['Nada', 'Nothing']], 1,
        'Nunca deja de llamarse y agota la pila.', 'It never stops calling itself and exhausts the stack.'),
      q('¿Cuántos subconjuntos tiene un conjunto de n elementos?', 'How many subsets does a set of n elements have?', [['n', 'n'], ['n²', 'n²'], ['2ⁿ', '2ⁿ'], ['n!', 'n!']], 2,
        'Cada elemento está o no está: 2 opciones por elemento.', 'Each element is in or out: 2 options per element.'),
    ],
    concepts: [
      concept('Partes de toda función recursiva', 'Parts of every recursive function', 'Caso base (cuándo parar) y paso recursivo (problema más pequeño + combinar).', 'Base case (when to stop) and recursive step (smaller problem + combine).'),
      concept('¿Qué es backtracking?', 'What is backtracking?', 'Construir soluciones paso a paso, explorando opciones y deshaciendo la última elección al regresar.', 'Building solutions step by step, exploring options and undoing the last choice on the way back.'),
    ],
  },
  {
    id: 'sorting',
    track: 'dsa',
    title: l('Algoritmos de ordenamiento', 'Sorting algorithms'),
    summary: l('Bubble, merge y quick sort: cómo funcionan y cuándo usarlos.', 'Bubble, merge and quick sort: how they work and when to use them.'),
    minutes: 15,
    blocks: [
      md(
        `## Los que debes conocer
- **Bubble sort**: intercambia vecinos desordenados hasta que no haya cambios. O(n²). Solo didáctico.
- **Merge sort**: divide a la mitad, ordena cada mitad recursivamente y **mezcla**. O(n log n) siempre, usa O(n) memoria extra y es **estable**.
- **Quick sort**: elige un **pivote**, deja los menores a la izquierda y los mayores a la derecha, y repite. O(n log n) promedio, O(n²) en el peor caso, in-place.

En la práctica usas el sort del lenguaje (Python usa **Timsort**, O(n log n) y estable).`,
        `## The ones you must know
- **Bubble sort**: swaps out-of-order neighbors until nothing changes. O(n²). Teaching only.
- **Merge sort**: split in half, sort each half recursively and **merge**. Always O(n log n), O(n) extra memory and **stable**.
- **Quick sort**: pick a **pivot**, put smaller elements left and larger right, and repeat. O(n log n) average, O(n²) worst case, in-place.

In practice you use the language's sort (Python uses **Timsort**, O(n log n) and stable).`,
      ),
      viz('sorting'),
      code(`def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    izq, der = merge_sort(a[:mid]), merge_sort(a[mid:])
    res, i, j = [], 0, 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            res.append(izq[i]); i += 1
        else:
            res.append(der[j]); j += 1
    return res + izq[i:] + der[j:]`),
      interview('"Estable" significa que elementos iguales conservan su orden original. Importa cuando ordenas por una clave y quieres mantener un orden previo.', '"Stable" means equal elements keep their original order. It matters when sorting by one key while keeping a previous order.'),
    ],
    quiz: [
      q('¿Qué algoritmo garantiza O(n log n) en el peor caso?', 'Which algorithm guarantees O(n log n) in the worst case?', [['Quick sort', 'Quick sort'], ['Merge sort', 'Merge sort'], ['Bubble sort', 'Bubble sort'], ['Insertion sort', 'Insertion sort']], 1,
        'Quick sort puede degradarse a O(n²) con malos pivotes.', 'Quick sort can degrade to O(n²) with bad pivots.'),
      q('¿Qué significa que un ordenamiento sea estable?', 'What does it mean for a sort to be stable?', [['Que nunca falla', 'It never fails'], ['Que usa O(1) memoria', 'It uses O(1) memory'], ['Que los iguales conservan su orden relativo', 'Equal elements keep their relative order'], ['Que es O(n log n)', 'It is O(n log n)']], 2, 'Es la definición.', 'That is the definition.'),
    ],
    concepts: [
      concept('Merge sort vs quick sort', 'Merge sort vs quick sort', 'Merge: O(n log n) garantizado, O(n) memoria, estable. Quick: O(n log n) promedio, O(n²) peor, in-place.', 'Merge: guaranteed O(n log n), O(n) memory, stable. Quick: O(n log n) average, O(n²) worst, in-place.'),
    ],
    related: ['merge-intervals', 'sort-colors', 'meeting-rooms'],
  },
  {
    id: 'binary-search',
    track: 'dsa',
    title: l('Búsqueda binaria', 'Binary search'),
    summary: l('Descartar la mitad en cada paso, también sobre "el espacio de respuestas".', 'Discard half at each step, also over "the answer space".'),
    minutes: 12,
    blocks: [
      md(
        `## Idea
En un arreglo **ordenado**, comparas con el elemento del medio y descartas la mitad donde no puede estar el objetivo. Son **O(log n)** pasos: con un millón de elementos, unas 20 comparaciones.

## Más allá de arreglos
Funciona sobre cualquier condición **monótona** (F F F T T T). Ejemplos: "primera versión defectuosa" o "mínima velocidad para terminar a tiempo". Esto se llama *binary search on the answer*.`,
        `## Idea
In a **sorted** array, compare with the middle element and discard the half where the target cannot be. That is **O(log n)** steps: about 20 comparisons for a million elements.

## Beyond arrays
It works on any **monotonic** condition (F F F T T T). Examples: "first bad version" or "minimum speed to finish on time". This is called *binary search on the answer*.`,
      ),
      viz('binary-search'),
      warn('Errores comunes: usar `lo < hi` vs `lo <= hi` sin pensar, y bucles infinitos por no mover `lo`/`hi`. Prueba mentalmente con arreglos de 1 y 2 elementos.', 'Common bugs: using `lo < hi` vs `lo <= hi` without thinking, and infinite loops from not moving `lo`/`hi`. Test mentally with arrays of 1 and 2 elements.'),
    ],
    quiz: [
      q('¿Qué requisito tiene la búsqueda binaria?', 'What does binary search require?', [['Arreglo sin duplicados', 'Array without duplicates'], ['Espacio ordenado o monótono', 'Sorted or monotonic space'], ['Lista enlazada', 'Linked list'], ['Tamaño potencia de 2', 'Size a power of 2']], 1, 'Sin orden no puedes descartar mitades.', 'Without order you cannot discard halves.'),
      q('¿Cuántos pasos necesita, aproximadamente, para 1,000,000 de elementos?', 'Roughly how many steps for 1,000,000 elements?', [['20', '20'], ['1000', '1000'], ['500,000', '500,000'], ['1,000,000', '1,000,000']], 0, 'log₂(10⁶) ≈ 20.', 'log₂(10⁶) ≈ 20.'),
    ],
    concepts: [
      concept('¿Qué es "binary search on the answer"?', 'What is "binary search on the answer"?', 'Buscar binariamente el valor mínimo/máximo que cumple una condición monótona, aunque no haya un arreglo explícito.', 'Binary searching the min/max value that satisfies a monotonic condition, even without an explicit array.'),
    ],
    related: ['binary-search', 'search-rotated', 'find-min-rotated', 'first-bad-version'],
  },
  {
    id: 'trees',
    track: 'dsa',
    title: l('Árboles binarios y BST', 'Binary trees and BSTs'),
    summary: l('Recorridos, recursión sobre árboles y árboles binarios de búsqueda.', 'Traversals, recursion on trees and binary search trees.'),
    minutes: 16,
    blocks: [
      md(
        `## Vocabulario
**Raíz**, **hijos**, **hoja** (sin hijos), **altura** (camino más largo de la raíz a una hoja).

## Recorridos
- **Preorden**: nodo → izq → der.
- **Inorden**: izq → nodo → der. En un **BST** da los valores **ordenados**.
- **Postorden**: izq → der → nodo.
- **Por niveles (BFS)**: con una cola.

## BST
Para cada nodo: todo lo de la izquierda es menor y todo lo de la derecha, mayor. Buscar, insertar y borrar cuestan **O(h)**: O(log n) si está balanceado y O(n) si se degenera en una "lista".`,
        `## Vocabulary
**Root**, **children**, **leaf** (no children), **height** (longest path from root to a leaf).

## Traversals
- **Preorder**: node → left → right.
- **Inorder**: left → node → right. On a **BST** it yields values **in sorted order**.
- **Postorder**: left → right → node.
- **Level order (BFS)**: with a queue.

## BST
For every node: everything on the left is smaller and everything on the right is larger. Search, insert and delete cost **O(h)**: O(log n) if balanced and O(n) if it degenerates into a "list".`,
      ),
      viz('bst'),
      code(`def inorden(nodo, res):
    if not nodo:
        return
    inorden(nodo.left, res)
    res.append(nodo.val)
    inorden(nodo.right, res)`),
      tip('Plantilla mental: "si supiera la respuesta para el hijo izquierdo y el derecho, ¿cómo calculo la de este nodo?".', 'Mental template: "if I knew the answer for the left and right child, how would I compute this node\'s?".'),
    ],
    quiz: [
      q('¿Qué recorrido de un BST devuelve los valores ordenados?', 'Which BST traversal returns values in sorted order?', [['Preorden', 'Preorder'], ['Inorden', 'Inorder'], ['Postorden', 'Postorder'], ['Por niveles', 'Level order']], 1, 'izq < nodo < der.', 'left < node < right.'),
      q('¿Cuál es la complejidad de buscar en un BST desbalanceado (peor caso)?', 'What is the worst-case search complexity in an unbalanced BST?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)']], 2,
        'Si se degenera en una lista, la altura es n.', 'If it degenerates into a list, the height is n.'),
    ],
    concepts: [
      concept('Los 4 recorridos de un árbol binario', 'The 4 binary tree traversals', 'Preorden (N-I-D), inorden (I-N-D), postorden (I-D-N) y por niveles (BFS con cola).', 'Preorder (N-L-R), inorder (L-N-R), postorder (L-R-N) and level order (BFS with a queue).'),
      concept('Complejidad de las operaciones de un BST', 'BST operation complexity', 'O(h): O(log n) balanceado, O(n) degenerado.', 'O(h): O(log n) balanced, O(n) degenerate.'),
    ],
    related: ['max-depth', 'invert-tree', 'level-order', 'validate-bst', 'lca-bst'],
  },
  {
    id: 'heaps',
    track: 'dsa',
    title: l('Heaps y colas de prioridad', 'Heaps and priority queues'),
    summary: l('Obtener siempre el mínimo o máximo de forma eficiente.', 'Always get the min or max efficiently.'),
    minutes: 10,
    blocks: [
      md(
        `## ¿Qué es un heap?
Un árbol binario **completo** donde cada padre es menor (min-heap) o mayor (max-heap) que sus hijos. Se guarda en un arreglo: los hijos de \`i\` están en \`2i+1\` y \`2i+2\`.

| Operación | Costo |
|---|---|
| Ver mínimo | O(1) |
| Insertar | O(log n) |
| Extraer mínimo | O(log n) |
| Construir con n elementos | O(n) |

Usos: **top-k**, mezclar k listas ordenadas, Dijkstra y planificación de tareas.`,
        `## What is a heap?
A **complete** binary tree where each parent is smaller (min-heap) or larger (max-heap) than its children. It is stored in an array: the children of \`i\` are at \`2i+1\` and \`2i+2\`.

| Operation | Cost |
|---|---|
| Peek min | O(1) |
| Insert | O(log n) |
| Extract min | O(log n) |
| Build from n elements | O(n) |

Uses: **top-k**, merging k sorted lists, Dijkstra and task scheduling.`,
      ),
      code(`import heapq

def k_mayores(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)   # saca el menor
    return heap                   # O(n log k)`),
      tip('En Python `heapq` es un min-heap. Para un max-heap, guarda los valores negados.', 'In Python `heapq` is a min-heap. For a max-heap, store negated values.'),
    ],
    quiz: [
      q('Para los k elementos más grandes de n, un min-heap de tamaño k cuesta…', 'For the k largest of n elements, a min-heap of size k costs…', [['O(n log n)', 'O(n log n)'], ['O(n log k)', 'O(n log k)'], ['O(k)', 'O(k)'], ['O(n²)', 'O(n²)']], 1,
        'n inserciones, cada una O(log k).', 'n insertions, each O(log k).'),
    ],
    concepts: [
      concept('Complejidades de un heap', 'Heap complexities', 'Ver tope O(1), insertar/extraer O(log n), construir O(n).', 'Peek O(1), insert/extract O(log n), build O(n).'),
    ],
    related: ['top-k-frequent'],
  },
  {
    id: 'graphs',
    track: 'dsa',
    title: l('Grafos: BFS y DFS', 'Graphs: BFS and DFS'),
    summary: l('Representar grafos y recorrerlos para resolver caminos, componentes y dependencias.', 'Represent graphs and traverse them to solve paths, components and dependencies.'),
    minutes: 18,
    blocks: [
      md(
        `## Representación
- **Lista de adyacencia**: \`{nodo: [vecinos]}\`. O(V + E) memoria. La más usada.
- **Matriz de adyacencia**: V×V. Útil en grafos densos.
- Una **cuadrícula** también es un grafo: cada celda tiene hasta 4 vecinos.

## BFS (anchura)
Usa una **cola** y explora por niveles. Encuentra el **camino más corto** en grafos sin pesos.

## DFS (profundidad)
Usa **recursión o una pila**. Sirve para componentes conectados, detectar ciclos y orden topológico.

En ambos: marca los nodos **visitados** para no entrar en ciclos infinitos. Complejidad: **O(V + E)**.`,
        `## Representation
- **Adjacency list**: \`{node: [neighbors]}\`. O(V + E) memory. The most used.
- **Adjacency matrix**: V×V. Useful for dense graphs.
- A **grid** is a graph too: each cell has up to 4 neighbors.

## BFS (breadth)
Uses a **queue** and explores level by level. Finds the **shortest path** in unweighted graphs.

## DFS (depth)
Uses **recursion or a stack**. Good for connected components, cycle detection and topological sort.

In both: mark nodes as **visited** to avoid infinite loops. Complexity: **O(V + E)**.`,
      ),
      viz('graph'),
      code(`from collections import deque

def bfs(grafo, inicio):
    visitados = {inicio}
    cola = deque([inicio])
    orden = []
    while cola:
        nodo = cola.popleft()
        orden.append(nodo)
        for v in grafo[nodo]:
            if v not in visitados:
                visitados.add(v)     # marcar al encolar
                cola.append(v)
    return orden`),
      interview('Si te piden "el mínimo número de pasos/movimientos", casi siempre es BFS. Si te piden "¿se pueden completar todas las tareas con dependencias?", es detección de ciclos u orden topológico.', 'If asked for "the minimum number of steps/moves", it is almost always BFS. If asked "can all tasks with dependencies be completed?", it is cycle detection or topological sort.'),
    ],
    quiz: [
      q('¿Qué recorrido encuentra el camino más corto en un grafo sin pesos?', 'Which traversal finds the shortest path in an unweighted graph?', [['DFS', 'DFS'], ['BFS', 'BFS'], ['Inorden', 'Inorder'], ['Ninguno', 'Neither']], 1, 'BFS visita por distancia creciente.', 'BFS visits in increasing distance.'),
      q('¿Complejidad de BFS/DFS con listas de adyacencia?', 'BFS/DFS complexity with adjacency lists?', [['O(V)', 'O(V)'], ['O(E)', 'O(E)'], ['O(V + E)', 'O(V + E)'], ['O(V²)', 'O(V²)']], 2, 'Cada nodo y cada arista se procesan una vez.', 'Each node and edge is processed once.'),
    ],
    concepts: [
      concept('¿Cuándo usar BFS y cuándo DFS?', 'When to use BFS vs DFS?', 'BFS: camino más corto sin pesos, niveles. DFS: componentes, ciclos, orden topológico, backtracking.', 'BFS: unweighted shortest path, levels. DFS: components, cycles, topological sort, backtracking.'),
      concept('¿Qué es el orden topológico?', 'What is a topological sort?', 'Un orden de los nodos de un DAG en el que cada arista u→v pone a u antes que v. Se hace con Kahn (grados de entrada) o con DFS.', 'An ordering of a DAG\'s nodes where every edge u→v puts u before v. Done with Kahn (in-degrees) or DFS.'),
    ],
    related: ['number-of-islands', 'flood-fill', 'course-schedule', 'shortest-path-grid'],
  },
  {
    id: 'dp-intro',
    track: 'dsa',
    title: l('Programación dinámica (introducción)', 'Dynamic programming (intro)'),
    summary: l('Resolver subproblemas una vez y reutilizarlos.', 'Solve subproblems once and reuse them.'),
    minutes: 18,
    blocks: [
      md(
        `## ¿Cuándo aplica?
Cuando el problema tiene:
1. **Subproblemas superpuestos**: se recalculan los mismos casos.
2. **Subestructura óptima**: la mejor solución se construye con las mejores soluciones de los subproblemas.

## Receta en 4 pasos
1. **Estado**: ¿qué significa \`dp[i]\`?
2. **Recurrencia**: ¿cómo se calcula \`dp[i]\` a partir de estados anteriores?
3. **Casos base**.
4. **Orden de cálculo** y dónde está la respuesta.

**Top-down** = recursión + memo. **Bottom-up** = llenar una tabla iterativamente.`,
        `## When does it apply?
When the problem has:
1. **Overlapping subproblems**: the same cases get recomputed.
2. **Optimal substructure**: the best solution is built from the best solutions of subproblems.

## 4-step recipe
1. **State**: what does \`dp[i]\` mean?
2. **Recurrence**: how is \`dp[i]\` computed from earlier states?
3. **Base cases**.
4. **Computation order** and where the answer lives.

**Top-down** = recursion + memo. **Bottom-up** = fill a table iteratively.`,
      ),
      code(`from functools import lru_cache

# Fibonacci ingenuo: O(2ⁿ)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

# Top-down con memo: O(n)
@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

# Bottom-up: O(n) tiempo, O(1) espacio
def fib_tabla(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`),
      viz('dp'),
      interview('Si te bloqueas, escribe primero la solución recursiva de fuerza bruta, identifica qué parámetros cambian (ese es tu estado) y agrega memo. Los entrevistadores valoran ver ese proceso.', 'If you get stuck, first write the brute-force recursive solution, identify which parameters change (that is your state) and add memo. Interviewers value seeing that process.'),
    ],
    quiz: [
      q('¿Qué dos propiedades indican que aplica DP?', 'Which two properties indicate DP applies?', [['Orden y unicidad', 'Order and uniqueness'], ['Subproblemas superpuestos y subestructura óptima', 'Overlapping subproblems and optimal substructure'], ['Grafo y ciclo', 'Graph and cycle'], ['Recursión y pila', 'Recursion and stack']], 1, 'Es la definición clásica.', 'That is the classic definition.'),
      q('Fibonacci con memoización tiene complejidad…', 'Fibonacci with memoization has complexity…', [['O(2ⁿ)', 'O(2ⁿ)'], ['O(n²)', 'O(n²)'], ['O(n)', 'O(n)'], ['O(log n)', 'O(log n)']], 2, 'Cada valor se calcula una sola vez.', 'Each value is computed only once.'),
    ],
    concepts: [
      concept('Receta de programación dinámica', 'Dynamic programming recipe', 'Estado → recurrencia → casos base → orden de cálculo/respuesta.', 'State → recurrence → base cases → computation order/answer.'),
      concept('Top-down vs bottom-up', 'Top-down vs bottom-up', 'Top-down: recursión + memo (natural de escribir). Bottom-up: tabla iterativa (sin riesgo de recursión profunda, permite optimizar espacio).', 'Top-down: recursion + memo (natural to write). Bottom-up: iterative table (no deep recursion risk, allows space optimization).'),
    ],
    related: ['climbing-stairs', 'house-robber', 'coin-change', 'max-subarray', 'unique-paths'],
  },
];
