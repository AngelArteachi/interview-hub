import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, O, P, R } from './builders';

/* Ejercicios: recursión · ordenamiento · búsqueda binaria.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores. */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Recursión y backtracking ---------------- */
  recursion: {
    2: R('rc-cp-parts', 'basic',
      l('¿Qué dos partes necesita toda función recursiva?', 'What two parts does every recursive function need?'),
      l('Un **caso base** (cuándo parar sin volver a llamarse) y un **paso recursivo** que se llama con un problema **más pequeño** y combina el resultado.', 'A **base case** (when to stop without calling itself again) and a **recursive step** that calls itself on a **smaller** problem and combines the result.')),
    9: P('rc-cp-subsets', 'medium',
      l('¿Qué imprime? (cuenta cuántos subconjuntos genera)', 'What does it print? (count how many subsets it generates)'),
      `def subconjuntos(nums):
    res, actual = [], []
    def bt(i):
        if i == len(nums):
            res.append(actual[:])
            return
        actual.append(nums[i])     # elegir nums[i]
        bt(i + 1)
        actual.pop()               # deshacer
        bt(i + 1)                  # no elegir nums[i]
    bt(0)
    return res

print(len(subconjuntos([1, 2, 3])))`,
      '8',
      l('Cada número tiene 2 opciones (estar o no estar): 2 × 2 × 2 = **8** subconjuntos, incluido el vacío.', 'Each number has 2 options (in or out): 2 × 2 × 2 = **8** subsets, including the empty one.'),
      l('`bt(i)` decide sobre `nums[i]`: primero lo agrega y sigue, luego lo quita y sigue sin él. Al llegar al final guarda una copia de `actual`.', '`bt(i)` decides about `nums[i]`: first it adds it and continues, then it removes it and continues without it. At the end it stores a copy of `actual`.')),
    10: O('rc-cp-backtracking', 'basic',
      l('Ordena el ciclo básico del **backtracking**.', 'Order the basic **backtracking** cycle.'),
      [
        l('Elige una opción y agrégala a la solución parcial.', 'Choose an option and add it to the partial solution.'),
        l('Llama recursivamente para seguir construyendo.', 'Call recursively to keep building.'),
        l('Al regresar, deshaz esa elección.', 'When it returns, undo that choice.'),
        l('Prueba la siguiente opción.', 'Try the next option.'),
      ],
      l('Deshacer la elección es lo que permite explorar todas las combinaciones con una sola lista.', 'Undoing the choice is what lets you explore every combination with a single list.')),
  },

  /* ---------------- Ordenamiento ---------------- */
  sorting: {
    6: R('so-cp-merge-quick', 'basic',
      l('Merge sort vs quick sort: ¿cuál **garantiza** O(n log n) en el peor caso y cuál ordena **sin memoria extra**?', 'Merge sort vs quick sort: which one **guarantees** O(n log n) in the worst case and which sorts **without extra memory**?'),
      l('**Merge sort** garantiza O(n log n) siempre, pero usa O(n) de memoria extra. **Quick sort** ordena en el mismo arreglo (in-place), pero su peor caso es O(n²).', '**Merge sort** always guarantees O(n log n) but uses O(n) extra memory. **Quick sort** sorts in the same array (in-place) but its worst case is O(n²).')),
    1: P('so-cp-bubble-pass', 'basic',
      l('Una sola pasada de bubble sort. ¿Qué imprime?', 'A single bubble sort pass. What does it print?'),
      `a = [5, 1, 4, 2]
for j in range(len(a) - 1):        # una sola pasada
    if a[j] > a[j + 1]:
        a[j], a[j + 1] = a[j + 1], a[j]
print(a)`,
      '[1, 4, 2, 5]',
      l('En una pasada el mayor (5) "burbujea" hasta el final, pero el resto todavía no queda ordenado: hacen falta más pasadas.', 'In one pass the largest (5) "bubbles" to the end, but the rest is not sorted yet: more passes are needed.'),
      l('Compara cada par de vecinos y los intercambia si están al revés.', 'It compares each pair of neighbors and swaps them if they are out of order.')),
    4: C('so-cp-merge', 'medium',
      l('Paso de **mezcla** de merge sort. ¿Qué va en el `else`? (con la correcta imprime la lista ordenada)', 'Merge sort\'s **merge** step. What goes in the `else`? (the right one prints the sorted list)'),
      `izq, der = [1, 4, 7], [2, 3, 9]
res, i, j = [], 0, 0
while i < len(izq) and j < len(der):
    if izq[i] <= der[j]:
        res.append(izq[i]); i += 1
    else:
        ____
res += izq[i:] + der[j:]
print(res)`,
      ['res.append(der[j]); j += 1', 'res.append(der[j]); i += 1', 'res.append(izq[i]); j += 1', 'j += 1'],
      0,
      l('Si el de la derecha es menor, **ese** se agrega y se avanza su índice `j`. Al final se pega lo que sobre de cualquiera de las dos.', 'If the right one is smaller, **that one** is added and its index `j` advances. At the end whatever is left of either list is appended.'),
      l('Compara el primer elemento pendiente de cada mitad y toma el menor.', 'It compares the first pending element of each half and takes the smaller one.')),
  },

  /* ---------------- Búsqueda binaria ---------------- */
  'binary-search': {
    0: R('bs-cp-requirement', 'basic',
      l('¿Qué condición debe cumplir el espacio de búsqueda para poder usar búsqueda binaria?', 'What condition must the search space meet to use binary search?'),
      l('Debe estar **ordenado** o, en general, ser **monótono** (todo lo de un lado cumple algo y todo lo del otro no): así sabes qué mitad descartar.', 'It must be **sorted** or, more generally, **monotonic** (everything on one side meets a condition and everything on the other does not): that tells you which half to discard.')),
    2: P('bs-cp-steps', 'basic',
      l('¿Qué imprime? (posición encontrada y cuántas vueltas dio)', 'What does it print? (position found and how many iterations it took)'),
      `a = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
x = 23
lo, hi, vueltas = 0, len(a) - 1, 0
while lo <= hi:
    vueltas += 1
    mid = (lo + hi) // 2
    if a[mid] == x:
        break
    if a[mid] < x:
        lo = mid + 1
    else:
        hi = mid - 1
print(mid, vueltas)`,
      '5 3',
      l('Mira 16 (posición 4), luego 56 (posición 7) y luego 23 (posición 5): lo encuentra en **3** vueltas, en vez de las 6 de una búsqueda lineal.', 'It looks at 16 (position 4), then 56 (position 7) and then 23 (position 5): found in **3** iterations instead of 6 with a linear search.'),
      l('`mid` es el centro del rango [lo, hi]. Si el valor del centro es menor que x, la mitad izquierda se descarta; si es mayor, la derecha.', '`mid` is the center of the range [lo, hi]. If the center value is less than x, the left half is discarded; if greater, the right half.')),
    3: C('bs-cp-condition', 'medium',
      l('¿Qué condición va en el `while`? (con la correcta imprime `2 -1`)', 'Which condition goes in the `while`? (the right one prints `2 -1`)'),
      `def buscar(a, x):
    lo, hi = 0, len(a) - 1
    while ____:
        mid = (lo + hi) // 2
        if a[mid] == x:
            return mid
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(buscar([1, 3, 5], 5), buscar([1, 3, 5], 4))`,
      ['lo <= hi', 'lo < hi', 'lo != hi', 'hi > 0'],
      0,
      l('Con `lo <= hi` también se revisa el rango de **un solo elemento** (lo == hi). Con `lo < hi` se salta ese último candidato y no encuentra el 5.', 'With `lo <= hi` the **single-element** range (lo == hi) is also checked. With `lo < hi` that last candidate is skipped and 5 is not found.'),
      l('El rango [lo, hi] incluye ambos extremos; cuando se vacía (lo > hi) el valor no está.', 'The range [lo, hi] includes both ends; when it becomes empty (lo > hi) the value is not there.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Recursión y backtracking ---------------- */
  recursion: [
    P('rc-p-fact', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(4))`,
      '24',
      l('fact(4) = 4 × fact(3) = 4 × 3 × fact(2) = 4 × 3 × 2 × 1 = **24**.', 'fact(4) = 4 × fact(3) = 4 × 3 × fact(2) = 4 × 3 × 2 × 1 = **24**.'),
      l('Cada llamada espera el resultado de la siguiente; el caso base `n <= 1` devuelve 1 y entonces las llamadas pendientes multiplican al regresar.', 'Each call waits for the next one\'s result; the base case `n <= 1` returns 1 and the pending calls multiply on the way back.')),
    C('rc-p-base', 'basic',
      l('Falta el **caso base**. ¿Cuál es? (con el correcto imprime 15)', 'The **base case** is missing. Which is it? (the right one prints 15)'),
      `def suma(nums, i=0):
    if ____:
        return 0
    return nums[i] + suma(nums, i + 1)

print(suma([4, 5, 6]))`,
      ['i == len(nums)', 'i == 0', 'nums[i] == 0', 'i > 10'],
      0,
      l('Cuando `i` llega al final de la lista ya no quedan números: la suma de "nada" es 0. Las otras condiciones paran demasiado pronto o se salen de la lista.', 'When `i` reaches the end there are no numbers left: the sum of "nothing" is 0. The other conditions stop too early or go past the list.'),
      l('`suma(nums, i)` suma desde la posición i hasta el final: el número actual más la suma del resto.', '`suma(nums, i)` adds from position i to the end: the current number plus the sum of the rest.')),
    R('rc-p-no-base', 'basic',
      l('¿Qué pasa si una función recursiva nunca llega a su caso base?', 'What happens if a recursive function never reaches its base case?'),
      l('Se llama infinitamente y cada llamada ocupa espacio en la pila hasta agotarla: **stack overflow**. En Python se ve como `RecursionError`.', 'It calls itself forever and each call takes stack space until it runs out: **stack overflow**. In Python it shows up as `RecursionError`.')),
    P('rc-p-order', 'medium', l('¿Qué imprime? (ojo con el orden)', 'What does it print? (watch the order)'),
      `def f(n):
    if n == 0:
        return
    print("entra", n)
    f(n - 1)
    print("sale", n)

f(2)`,
      'entra 2\nentra 1\nsale 1\nsale 2',
      l('Lo que va **después** de la llamada recursiva se ejecuta al **regresar**, en orden inverso: primero termina la llamada más profunda. Así funciona la pila de llamadas.', 'What comes **after** the recursive call runs on the **way back**, in reverse order: the deepest call finishes first. That is how the call stack works.'),
      l('f(2) imprime "entra 2", llama a f(1), que imprime "entra 1" y llama a f(0), que regresa de inmediato.', 'f(2) prints "entra 2", calls f(1), which prints "entra 1" and calls f(0), which returns immediately.')),
    P('rc-p-power', 'medium', l('Potencia rápida. ¿Qué imprime?', 'Fast power. What does it print?'),
      `def potencia(b, e):
    if e == 0:
        return 1
    mitad = potencia(b, e // 2)
    if e % 2 == 0:
        return mitad * mitad
    return mitad * mitad * b

print(potencia(2, 10))`,
      '1024',
      l('2¹⁰ = **1024**. Como el exponente se divide a la mitad en cada llamada, solo hace unas 4 llamadas: **O(log e)** en vez de O(e).', '2¹⁰ = **1024**. Because the exponent is halved in each call, it only makes about 4 calls: **O(log e)** instead of O(e).'),
      l('Usa que bᵉ = (b^(e/2))². Si e es impar, sobra una b que se multiplica al final.', 'It uses bᵉ = (b^(e/2))². If e is odd, one extra b is multiplied at the end.')),
    O('rc-p-how-to', 'medium',
      l('Ordena los pasos para **escribir** una función recursiva.', 'Order the steps to **write** a recursive function.'),
      [
        l('Define qué devuelve la función para un problema dado.', 'Define what the function returns for a given problem.'),
        l('Escribe el caso base (el problema más pequeño, que se resuelve directo).', 'Write the base case (the smallest problem, solved directly).'),
        l('Supón que la llamada con un problema más chico ya funciona.', 'Assume the call on a smaller problem already works.'),
        l('Combina ese resultado para resolver el problema actual.', 'Combine that result to solve the current problem.'),
      ],
      l('El paso 3 es la clave: no sigas todas las llamadas en tu cabeza, confía en que la más chica funciona.', 'Step 3 is the key: do not follow every call in your head, trust that the smaller one works.')),
    R('rc-p-space', 'interview',
      l('¿Cuánto espacio usa `fact(n)` recursivo y por qué Python limita la profundidad de la recursión?', 'How much space does recursive `fact(n)` use and why does Python limit recursion depth?'),
      l('**O(n)**: hay n llamadas esperando en la pila al mismo tiempo. Python pone un límite (1000 por defecto) para no desbordar la pila; para entradas grandes conviene una versión iterativa.', '**O(n)**: n calls wait on the stack at the same time. Python sets a limit (1000 by default) to avoid overflowing the stack; for large inputs an iterative version is better.')),
    P('rc-p-perms', 'interview', l('¿Qué imprime?', 'What does it print?'),
      `def permutaciones(xs):
    if len(xs) <= 1:
        return [xs]
    res = []
    for i in range(len(xs)):
        resto = xs[:i] + xs[i + 1:]        # todos menos el de la posición i
        for p in permutaciones(resto):
            res.append([xs[i]] + p)
    return res

print(len(permutaciones([1, 2, 3])), permutaciones([1, 2]))`,
      '6 [[1, 2], [2, 1]]',
      l('Con n elementos hay **n!** permutaciones: 3! = **6**. Por eso generar todas es O(n · n!), algo que solo es viable con n pequeño.', 'With n elements there are **n!** permutations: 3! = **6**. That is why generating all of them is O(n · n!), only feasible for small n.'),
      l('Para cada posición i pone `xs[i]` primero y lo combina con todas las permutaciones del resto.', 'For each position i it puts `xs[i]` first and combines it with every permutation of the rest.')),
  ],

  /* ---------------- Ordenamiento ---------------- */
  sorting: [
    P('so-p-stable', 'basic', l('Ordenamiento **estable**. ¿Qué imprime?', '**Stable** sorting. What does it print?'),
      `gente = [("Ana", 25), ("Luis", 20), ("Eva", 25)]
print(sorted(gente, key=lambda p: p[1]))     # ordena por la edad (segundo valor)`,
      "[('Luis', 20), ('Ana', 25), ('Eva', 25)]",
      l('Ana y Eva tienen la misma edad y conservan su orden original (Ana antes que Eva) porque el sort de Python es **estable**.', 'Ana and Eva have the same age and keep their original order (Ana before Eva) because Python\'s sort is **stable**.'),
      l('`key=lambda p: p[1]` le dice a `sorted` que compare solo la edad de cada tupla.', '`key=lambda p: p[1]` tells `sorted` to compare only each tuple\'s age.')),
    R('so-p-stable-why', 'basic',
      l('¿Qué significa que un ordenamiento sea **estable**? Da un caso donde importe.', 'What does it mean for a sort to be **stable**? Give a case where it matters.'),
      l('Que los elementos **iguales conservan su orden original**. Importa al ordenar por varias claves: por ejemplo, ordenar empleados por fecha y luego (estable) por departamento deja cada departamento ordenado por fecha.', 'That **equal elements keep their original order**. It matters when sorting by several keys: e.g. sorting employees by date and then (stably) by department leaves each department sorted by date.')),
    O('so-p-merge-steps', 'basic',
      l('Ordena los pasos de **merge sort**.', 'Order the steps of **merge sort**.'),
      [
        l('Si la lista tiene 0 o 1 elementos, ya está ordenada.', 'If the list has 0 or 1 elements, it is already sorted.'),
        l('Divide la lista en dos mitades.', 'Split the list into two halves.'),
        l('Ordena cada mitad recursivamente.', 'Sort each half recursively.'),
        l('Mezcla las dos mitades ordenadas en una sola.', 'Merge the two sorted halves into one.'),
      ],
      l('Hay log n niveles de divisiones y en cada nivel se mezclan n elementos → O(n log n).', 'There are log n levels of splits and each level merges n elements → O(n log n).')),
    P('so-p-partition', 'medium', l('Partición de quick sort (pivote = el último). ¿Qué imprime?', 'Quick sort partition (pivot = the last one). What does it print?'),
      `a = [7, 2, 9, 4, 5]
pivote = a[-1]
i = 0
for j in range(len(a) - 1):
    if a[j] < pivote:
        a[i], a[j] = a[j], a[i]
        i += 1
a[i], a[-1] = a[-1], a[i]
print(a, i)`,
      '[2, 4, 5, 7, 9] 2',
      l('Los menores que 5 (2 y 4) quedan a la izquierda y el pivote termina en la posición **2**, su lugar definitivo. Que aquí todo quede ordenado es casualidad: en general los lados todavía hay que ordenarlos.', 'Those smaller than 5 (2 and 4) end up on the left and the pivot lands at position **2**, its final place. Everything being sorted here is a coincidence: in general both sides still need sorting.'),
      l('`i` marca dónde va el siguiente número menor que el pivote. Al final el pivote se pone en la posición `i`.', '`i` marks where the next number smaller than the pivot goes. At the end the pivot is placed at position `i`.')),
    C('so-p-bubble-bound', 'medium',
      l('Bubble sort completo. ¿Hasta dónde llega el ciclo de adentro? (con la correcta imprime `[1, 2, 3, 4]`)', 'Full bubble sort. How far does the inner loop go? (the right one prints `[1, 2, 3, 4]`)'),
      `a = [4, 3, 2, 1]
n = len(a)
for i in range(n):
    for j in range(____):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(a)`,
      ['n - 1 - i', 'n', 'i', '1'],
      0,
      l('Tras cada pasada, el mayor de lo que falta ya está al final, así que se revisa un elemento menos: `n - 1 - i`. Con `n` se sale de la lista (`a[j + 1]`).', 'After each pass the largest remaining element is already at the end, so one fewer is checked: `n - 1 - i`. With `n` it goes out of the list (`a[j + 1]`).'),
      l('El ciclo de afuera cuenta pasadas; el de adentro compara vecinos en la parte que aún no está ordenada.', 'The outer loop counts passes; the inner one compares neighbors in the part that is not sorted yet.')),
    R('so-p-library', 'medium',
      l('Tienes 10 millones de números casi ordenados. ¿Qué haces en Python y por qué?', 'You have 10 million nearly sorted numbers. What do you do in Python and why?'),
      l('Usar `sorted()` o `lista.sort()`: es **Timsort**, O(n log n) en el peor caso, estable y aprovecha el orden que ya tienen los datos. Escribir tu propio ordenamiento solo tiene sentido si te lo piden en la entrevista.', 'Use `sorted()` or `list.sort()`: it is **Timsort**, O(n log n) worst case, stable, and it takes advantage of the existing order. Writing your own sort only makes sense if the interview asks for it.')),
    P('so-p-intervals', 'interview', l('Ordenar primero simplifica el problema. ¿Qué imprime?', 'Sorting first simplifies the problem. What does it print?'),
      `ints = [[8, 10], [1, 3], [2, 6]]
ints.sort()                        # ordena por el inicio
res = []
for ini, fin in ints:
    if res and ini <= res[-1][1]:
        res[-1][1] = max(res[-1][1], fin)
    else:
        res.append([ini, fin])
print(res)`,
      '[[1, 6], [8, 10]]',
      l('Tras ordenar, [1, 3] y [2, 6] se traslapan → se combinan en [1, 6]; [8, 10] queda aparte. El costo lo domina el sort: **O(n log n)**.', 'After sorting, [1, 3] and [2, 6] overlap → merged into [1, 6]; [8, 10] stays apart. The sort dominates the cost: **O(n log n)**.'),
      l('Con los intervalos ordenados, solo hay que comparar cada uno con el último combinado.', 'With the intervals sorted, each one only needs comparing with the last merged one.')),
    R('so-p-quick-worst', 'interview',
      l('¿Cuándo es O(n²) quick sort y cómo se evita en la práctica?', 'When is quick sort O(n²) and how is that avoided in practice?'),
      l('Cuando el pivote es siempre el menor o el mayor (por ejemplo, tomar el último de una lista ya ordenada): cada partición deja n − 1 elementos de un lado. Se evita eligiendo el pivote **al azar** o con la **mediana de tres**.', 'When the pivot is always the smallest or largest (e.g. taking the last element of an already sorted list): each partition leaves n − 1 elements on one side. It is avoided by picking the pivot **at random** or with the **median of three**.')),
  ],

  /* ---------------- Búsqueda binaria ---------------- */
  'binary-search': [
    P('bs-p-million', 'basic', l('¿Cuántas veces puedes dividir un millón a la mitad? ¿Qué imprime?', 'How many times can you halve a million? What does it print?'),
      `n, pasos = 1000000, 0
while n > 1:
    n //= 2
    pasos += 1
print(pasos)`,
      '19',
      l('**19** divisiones (≈ log₂ de un millón). Por eso una búsqueda binaria en un millón de elementos necesita unas 20 comparaciones.', '**19** divisions (≈ log₂ of a million). That is why binary search over a million elements needs about 20 comparisons.'),
      l('Igual que en Big O: cada vuelta divide `n` entre 2 y cuenta un paso.', 'Same as in Big O: each iteration divides `n` by 2 and counts one step.')),
    R('bs-p-vs-linear', 'basic',
      l('Una búsqueda lineal en 1,000,000 de elementos hace hasta 1,000,000 de comparaciones. ¿Y una binaria?', 'A linear search over 1,000,000 elements does up to 1,000,000 comparisons. What about binary search?'),
      l('Unas **20** (log₂ 1,000,000 ≈ 20), pero solo si los datos están **ordenados**.', 'About **20** (log₂ 1,000,000 ≈ 20), but only if the data is **sorted**.')),
    O('bs-p-steps', 'basic',
      l('Ordena los pasos de la búsqueda binaria.', 'Order the binary search steps.'),
      [
        l('Pon `lo` al inicio y `hi` al final.', 'Set `lo` to the start and `hi` to the end.'),
        l('Calcula `mid`, el centro del rango.', 'Compute `mid`, the center of the range.'),
        l('Si `a[mid]` es el valor buscado, termina.', 'If `a[mid]` is the target, stop.'),
        l('Si es menor, descarta la izquierda (`lo = mid + 1`); si es mayor, la derecha (`hi = mid - 1`).', 'If it is smaller, discard the left (`lo = mid + 1`); if larger, the right (`hi = mid - 1`).'),
        l('Repite mientras `lo <= hi`; si el rango se vacía, no está.', 'Repeat while `lo <= hi`; if the range empties, it is not there.'),
      ],
      l('Cada vuelta descarta la mitad del rango → O(log n).', 'Each iteration discards half the range → O(log n).')),
    P('bs-p-first-true', 'medium', l('Buscar el **primer** `True` (como "primera versión defectuosa"). ¿Qué imprime?', 'Find the **first** `True` (like "first bad version"). What does it print?'),
      `malas = [False, False, False, True, True]
lo, hi = 0, len(malas) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if malas[mid]:
        hi = mid          # mid podría ser la primera mala
    else:
        lo = mid + 1      # la primera mala está a la derecha
print(lo)`,
      '3',
      l('La primera mala está en la posición **3**. Aquí no se busca un valor exacto sino la **frontera** entre False y True: la condición es monótona.', 'The first bad one is at position **3**. Here you are not looking for an exact value but for the **boundary** between False and True: the condition is monotonic.'),
      l('Si `mid` es mala, la respuesta está en [lo, mid] (incluye mid); si no, en [mid + 1, hi]. Termina cuando lo y hi se juntan.', 'If `mid` is bad, the answer is in [lo, mid] (including mid); otherwise in [mid + 1, hi]. It stops when lo and hi meet.')),
    C('bs-p-rotated-min', 'medium',
      l('Mínimo de un arreglo ordenado y **rotado**. ¿Qué condición va? (con la correcta imprime 0)', 'Minimum of a sorted, **rotated** array. Which condition goes there? (the right one prints 0)'),
      `a = [4, 5, 6, 7, 0, 1, 2]
lo, hi = 0, len(a) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if ____:
        lo = mid + 1
    else:
        hi = mid
print(a[lo])`,
      ['a[mid] > a[hi]', 'a[mid] < a[hi]', 'a[mid] > a[lo]', 'a[mid] == a[hi]'],
      0,
      l('Si el centro es **mayor que el extremo derecho**, la "caída" (y el mínimo) está a la derecha de `mid`. Si no, el mínimo está en `mid` o a su izquierda.', 'If the center is **greater than the right end**, the "drop" (and the minimum) is to the right of `mid`. Otherwise the minimum is at `mid` or to its left.'),
      l('Un arreglo rotado son dos tramos ordenados; el mínimo es donde empieza el segundo tramo.', 'A rotated array is two sorted runs; the minimum is where the second run starts.')),
    R('bs-p-on-answer', 'medium',
      l('¿Qué es la **búsqueda binaria sobre la respuesta**? Da un ejemplo.', 'What is **binary search on the answer**? Give an example.'),
      l('Buscar binariamente el **mínimo (o máximo) valor que cumple una condición monótona**, aunque no haya un arreglo explícito. Ej.: la raíz cuadrada entera de x (el mayor m con m² ≤ x), o la menor capacidad de un camión para entregar todo en D días.', 'Binary searching the **smallest (or largest) value that meets a monotonic condition**, even without an explicit array. E.g. the integer square root of x (the largest m with m² ≤ x), or the smallest truck capacity to ship everything in D days.')),
    P('bs-p-sqrt', 'interview', l('Búsqueda binaria sobre la respuesta. ¿Qué imprime?', 'Binary search on the answer. What does it print?'),
      `def raiz_entera(x):
    lo, hi = 0, x
    while lo <= hi:
        mid = (lo + hi) // 2
        if mid * mid <= x:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi

print(raiz_entera(17), raiz_entera(25))`,
      '4 5',
      l('Busca el mayor m con m² ≤ x: para 17 es **4** (16 ≤ 17 < 25) y para 25 es **5**. Son O(log x) pasos sin calcular raíces.', 'It finds the largest m with m² ≤ x: for 17 it is **4** (16 ≤ 17 < 25) and for 25 it is **5**. That is O(log x) steps without computing roots.'),
      l('Si `mid²` cabe en x, la respuesta es al menos mid (sube `lo`); si no, es menor (baja `hi`). Al terminar, `hi` es el último que cupo.', 'If `mid²` fits in x, the answer is at least mid (raise `lo`); otherwise it is smaller (lower `hi`). At the end, `hi` is the last one that fit.')),
    R('bs-p-overflow', 'interview',
      l('¿Por qué en Java o C++ se recomienda `mid = lo + (hi - lo) / 2` en vez de `(lo + hi) / 2`?', 'Why do Java or C++ recommend `mid = lo + (hi - lo) / 2` instead of `(lo + hi) / 2`?'),
      l('Porque con enteros de tamaño fijo `lo + hi` puede **desbordarse** si ambos son muy grandes. En Python los enteros no tienen límite, así que ahí no pasa, pero conviene mencionarlo.', 'Because with fixed-size integers `lo + hi` can **overflow** when both are large. Python integers are unbounded so it does not happen there, but it is worth mentioning.')),
  ],
};
