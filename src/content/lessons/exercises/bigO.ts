import type { Exercise, Lesson } from '../../../types';
import { code, concept, interview, l, md, q, tip } from '../helpers';

/* =====================================================================
 * Big O — checkpoints dentro de la lección, banco de práctica y
 * la lección "Big O en la práctica" (ejemplos resueltos + "ahora tú").
 * Todas las respuestas de tipo predict/complete se verifican ejecutando
 * el código (ver script de pruebas).
 * ===================================================================== */

/** Checkpoints para insertar en la lección `big-o` (clave = índice del bloque tras el que van) */
export const BIG_O_CHECKPOINTS: Record<number, Exercise> = {
  4: {
    id: 'cp-rules',
    level: 'basic',
    kind: 'recall',
    q: l('¿Por qué decimos que un algoritmo O(2n + 10) es simplemente O(n)?', 'Why do we say an O(2n + 10) algorithm is simply O(n)?'),
    a: l(
      'Porque Big O describe **cómo crece** el costo cuando n se hace grande: las constantes (el 2) y los términos que crecen más lento (el 10) dejan de importar frente a n.',
      'Because Big O describes **how the cost grows** as n gets large: constants (the 2) and slower-growing terms (the 10) stop mattering compared to n.',
    ),
  },
  5: {
    id: 'cp-nested',
    level: 'basic',
    kind: 'predict',
    prompt: l('¿Qué imprime este código? Piensa cuántas veces se ejecuta la línea de adentro.', 'What does this code print? Think about how many times the inner line runs.'),
    code: `n = 4
pasos = 0
for i in range(n):
    for j in range(n):
        pasos += 1
print(pasos)`,
    lang: 'python',
    walkthrough: l(
      'Hay un ciclo dentro de otro. Por cada valor de `i`, el ciclo de `j` da todas sus vueltas, y en cada una suma 1 a `pasos`. Cuenta cuántas veces se llega a `pasos += 1`.',
      'There is a loop inside another. For each value of `i`, the `j` loop runs all its iterations, and each one adds 1 to `pasos`. Count how many times `pasos += 1` is reached.',
    ),
    answer: '16',
    explanation: l('El ciclo de adentro corre n veces por cada vuelta del de afuera: 4 × 4 = 16. Con n elementos son n × n pasos → **O(n²)**.', 'The inner loop runs n times for each outer iteration: 4 × 4 = 16. With n elements that is n × n steps → **O(n²)**.'),
  },
  11: {
    id: 'cp-space',
    level: 'basic',
    kind: 'recall',
    q: l('Una función recursiva se llama a sí misma n veces antes de empezar a regresar, y no crea listas. ¿Cuánto espacio extra usa?', 'A recursive function calls itself n times before it starts returning, and creates no lists. How much extra space does it use?'),
    a: l('**O(n)**: cada llamada pendiente ocupa un marco en la pila de llamadas, y llega a haber n a la vez.', '**O(n)**: each pending call takes a frame on the call stack, and up to n are there at once.'),
  },
  12: {
    id: 'cp-amortized',
    level: 'medium',
    kind: 'predict',
    prompt: l(
      'Este código simula un arreglo dinámico que **duplica su capacidad** cuando se llena y cuenta cuántos elementos copia en total al hacer 8 inserciones. ¿Qué imprime?',
      'This code simulates a dynamic array that **doubles its capacity** when full and counts how many elements it copies in total over 8 insertions. What does it print?',
    ),
    code: `capacidad, copias = 1, 0
for tam in range(1, 9):       # 8 inserciones
    if tam > capacidad:       # se llenó: duplicar y copiar todo
        copias += capacidad
        capacidad *= 2
print(copias)`,
    lang: 'python',
    walkthrough: l(
      '`tam` es cuántos elementos hay después de cada inserción. Mientras quepan en la `capacidad`, insertar es barato. Cuando `tam` la supera, se copian todos los elementos (`copias += capacidad`) y la capacidad se duplica. Fíjate en qué valores de `tam` pasa eso.',
      '`tam` is how many elements there are after each insertion. While they fit in `capacidad`, inserting is cheap. When `tam` exceeds it, every element is copied (`copias += capacidad`) and the capacity doubles. Notice at which values of `tam` that happens.',
    ),
    answer: '7',
    explanation: l(
      'Copia 1 + 2 + 4 = **7** elementos para 8 inserciones: menos de 1 copia por inserción en promedio. Por eso agregar al final es **O(1) amortizado**, aunque algunas inserciones cuesten O(n).',
      'It copies 1 + 2 + 4 = **7** elements for 8 insertions: less than 1 copy per insertion on average. That is why appending is **O(1) amortized**, even though some insertions cost O(n).',
    ),
  },
};

/** Banco "Practica esta lección" de `big-o` (4 básicos, 4 intermedios, 4 tipo entrevista) */
export const BIG_O_PRACTICE: Exercise[] = [
  {
    id: 'p-halving',
    level: 'basic',
    kind: 'predict',
    prompt: l('¿Qué imprime?', 'What does it print?'),
    code: `n = 16
pasos = 0
while n > 1:
    n //= 2
    pasos += 1
print(pasos)`,
    lang: 'python',
    walkthrough: l(
      'En cada vuelta `n` se divide entre 2 (división entera, `//`) y `pasos` aumenta en 1. El ciclo se detiene cuando `n` ya no es mayor que 1.',
      'Each iteration divides `n` by 2 (integer division, `//`) and adds 1 to `pasos`. The loop stops when `n` is no longer greater than 1.',
    ),
    answer: '4',
    explanation: l('16 → 8 → 4 → 2 → 1: son 4 pasos = log₂(16). Dividir a la mitad en cada vuelta es **O(log n)**.', '16 → 8 → 4 → 2 → 1: that is 4 steps = log₂(16). Halving every iteration is **O(log n)**.'),
  },
  {
    id: 'p-simplify',
    level: 'basic',
    kind: 'recall',
    q: l('Simplifica: O(5n² + 3n + 100)', 'Simplify: O(5n² + 3n + 100)'),
    a: l('**O(n²)**: te quedas con el término que crece más rápido y quitas la constante 5.', '**O(n²)**: keep the fastest-growing term and drop the constant 5.'),
  },
  {
    id: 'p-n-squared',
    level: 'basic',
    kind: 'complete',
    prompt: l(
      'Completa la línea para que el código dé exactamente **n × n** pasos (con n = 3 debe imprimir 9).',
      'Complete the line so the code takes exactly **n × n** steps (with n = 3 it must print 9).',
    ),
    code: `n = 3
pasos = 0
for i in range(n):
    ____
        pasos += 1
print(pasos)`,
    lang: 'python',
    walkthrough: l(
      'El ciclo de afuera da n vueltas y el de adentro otras n por cada una, así que `pasos += 1` se ejecuta n × n veces.',
      'The outer loop runs n times and the inner one another n for each, so `pasos += 1` runs n × n times.',
    ),
    options: ['for j in range(n):', 'for j in range(i):', 'for j in range(3, n):', 'if i < n:'],
    answer: 0,
    explanation: l(
      'Un segundo ciclo de **n vueltas dentro** del primero da n × n = 9 pasos → **O(n²)**. Con `range(i)` serían 0 + 1 + 2 = 3; con `range(3, n)` ninguna vuelta; y el `if` solo suma 1 por vuelta → n pasos.',
      'A second loop of **n iterations inside** the first gives n × n = 9 steps → **O(n²)**. With `range(i)` it would be 0 + 1 + 2 = 3; with `range(3, n)` no iterations; and the `if` only adds 1 per iteration → n steps.',
    ),
  },
  {
    id: 'p-steps',
    level: 'basic',
    kind: 'order',
    prompt: l('Ordena los pasos para calcular la complejidad de un fragmento de código.', 'Put in order the steps to work out the complexity of a code snippet.'),
    steps: [
      l('Identifica qué es **n** (el tamaño de la entrada).', 'Identify what **n** is (the input size).'),
      l('Cuenta cuántas veces se repite cada ciclo en función de n.', 'Count how many times each loop repeats as a function of n.'),
      l('**Multiplica** los ciclos anidados y **suma** los secuenciales.', '**Multiply** nested loops and **add** sequential ones.'),
      l('Quédate con el término dominante y quita las constantes.', 'Keep the dominant term and drop the constants.'),
    ],
    explanation: l('Primero defines n, luego cuentas, combinas y al final simplificas.', 'First define n, then count, combine and finally simplify.'),
  },
  {
    id: 'p-dependent',
    level: 'medium',
    kind: 'predict',
    prompt: l('Aquí el ciclo de adentro depende de `i`. ¿Qué imprime?', 'Here the inner loop depends on `i`. What does it print?'),
    code: `n = 5
pasos = 0
for i in range(n):
    for j in range(i):
        pasos += 1
print(pasos)`,
    lang: 'python',
    walkthrough: l(
      'El ciclo de adentro depende de `i`: cuando `i` = 0 no da vueltas, cuando `i` = 1 da una, y así sucesivamente. Suma cuántas vueltas da en total.',
      'The inner loop depends on `i`: when `i` = 0 it does not run, when `i` = 1 it runs once, and so on. Add up how many iterations it does in total.',
    ),
    answer: '10',
    explanation: l(
      '0 + 1 + 2 + 3 + 4 = **10**. En general la suma es n(n−1)/2, que sigue siendo **O(n²)**: dividir entre 2 es una constante.',
      '0 + 1 + 2 + 3 + 4 = **10**. In general the sum is n(n−1)/2, which is still **O(n²)**: dividing by 2 is a constant.',
    ),
  },
  {
    id: 'p-in-list',
    level: 'medium',
    kind: 'recall',
    q: l('¿Por qué poner `if x in lista:` dentro de un ciclo que recorre n elementos puede volver el algoritmo O(n²)?', 'Why can putting `if x in lista:` inside a loop over n elements make the algorithm O(n²)?'),
    a: l(
      'Porque `in` sobre una **lista** la recorre completa: es O(n). Hacerlo n veces da O(n²). Con un **set** cada consulta es O(1) en promedio y el total queda O(n).',
      'Because `in` on a **list** scans it entirely: it is O(n). Doing it n times gives O(n²). With a **set** each lookup is O(1) on average and the total stays O(n).',
    ),
  },
  {
    id: 'p-log-loop',
    level: 'medium',
    kind: 'complete',
    prompt: l('Completa la línea para que el ciclo sea **O(log n)**.', 'Complete the line so the loop is **O(log n)**.'),
    code: `def pasos_hasta_uno(n):
    pasos = 0
    while n > 1:
        ____
        pasos += 1
    return pasos

print(pasos_hasta_uno(1024))`,
    lang: 'python',
    walkthrough: l(
      'Cada vuelta divide `n` entre 2 hasta llegar a 1; `pasos` cuenta cuántas divisiones hicieron falta.',
      'Each iteration divides `n` by 2 until it reaches 1; `pasos` counts how many divisions were needed.',
    ),
    options: ['n -= 1', 'n //= 2', 'n *= 2', 'n -= 2'],
    answer: 1,
    explanation: l(
      'Dividir entre 2 en cada vuelta llega a 1 en log₂(1024) = 10 pasos. Restar 1 o 2 sería O(n), y multiplicar nunca terminaría.',
      'Dividing by 2 each iteration reaches 1 in log₂(1024) = 10 steps. Subtracting 1 or 2 would be O(n), and multiplying would never finish.',
    ),
  },
  {
    id: 'p-recursion',
    level: 'medium',
    kind: 'predict',
    prompt: l('¿Qué imprime? Luego piensa: ¿qué complejidad de tiempo y de espacio tiene?', 'What does it print? Then think: what are its time and space complexity?'),
    code: `def cuenta(n):
    if n == 0:
        return 0
    return 1 + cuenta(n - 1)

print(cuenta(5))`,
    lang: 'python',
    walkthrough: l(
      '`cuenta(n)` se llama a sí misma con `n - 1` hasta llegar a 0 (el caso base, que devuelve 0). Al regresar, cada llamada suma 1 a lo que le devolvió la siguiente.',
      '`cuenta(n)` calls itself with `n - 1` until it reaches 0 (the base case, which returns 0). On the way back, each call adds 1 to what the next one returned.',
    ),
    answer: '5',
    explanation: l('Hace 5 llamadas que se apilan antes de regresar: **O(n) de tiempo y O(n) de espacio** (por la pila de llamadas).', 'It makes 5 calls that stack up before returning: **O(n) time and O(n) space** (because of the call stack).'),
  },
  {
    id: 'p-two-inputs',
    level: 'interview',
    kind: 'recall',
    q: l(
      'Recorres un arreglo de tamaño n y **después**, por separado, otro de tamaño m. ¿Cuál es la complejidad? ¿Por qué no es O(n)?',
      'You walk an array of size n and **then**, separately, another of size m. What is the complexity? Why is it not O(n)?',
    ),
    a: l(
      '**O(n + m)**. Son dos entradas independientes: si m es mucho más grande que n, ignorarla sería un error. Si los ciclos estuvieran anidados sería O(n · m).',
      '**O(n + m)**. They are two independent inputs: if m is much larger than n, ignoring it would be wrong. If the loops were nested it would be O(n · m).',
    ),
  },
  {
    id: 'p-sorted-loop',
    level: 'interview',
    kind: 'predict',
    prompt: l('¿Qué imprime? Después identifica el problema de rendimiento.', 'What does it print? Then spot the performance problem.'),
    code: `datos = [5, 3, 8]
total = 0
for x in datos:
    total += len(sorted(datos))
print(total)`,
    lang: 'python',
    walkthrough: l(
      'Por cada elemento de `datos` se ordena la lista completa y se suma su longitud a `total`. `sorted` no modifica `datos`: devuelve una lista nueva del mismo tamaño.',
      'For each element of `datos` the whole list is sorted and its length is added to `total`. `sorted` does not modify `datos`: it returns a new list of the same size.',
    ),
    answer: '9',
    explanation: l(
      'Imprime 3 + 3 + 3 = **9**. Pero ordena la lista **en cada vuelta**: n veces O(n log n) = **O(n² log n)**. Ordenar una sola vez fuera del ciclo deja el costo en O(n log n).',
      'It prints 3 + 3 + 3 = **9**. But it sorts the list **on every iteration**: n times O(n log n) = **O(n² log n)**. Sorting once outside the loop keeps the cost at O(n log n).',
    ),
  },
  {
    id: 'p-growth-order',
    level: 'interview',
    kind: 'order',
    prompt: l('Ordena de **menor a mayor** crecimiento.', 'Order from **slowest to fastest** growth.'),
    steps: [l('O(1)', 'O(1)'), l('O(log n)', 'O(log n)'), l('O(n)', 'O(n)'), l('O(n log n)', 'O(n log n)'), l('O(n²)', 'O(n²)'), l('O(2ⁿ)', 'O(2ⁿ)')],
    explanation: l('Con n = 1,000,000: log n ≈ 20, n log n ≈ 20 millones, n² = un billón, y 2ⁿ es imposible de calcular.', 'With n = 1,000,000: log n ≈ 20, n log n ≈ 20 million, n² = a trillion, and 2ⁿ is impossible to compute.'),
  },
  {
    id: 'p-worst-case',
    level: 'interview',
    kind: 'predict',
    prompt: l(
      '¿Qué imprime? Después piensa: si a veces termina en la primera vuelta, ¿su complejidad es O(1) u O(n)?',
      'What does it print? Then think: if it sometimes finishes on the first iteration, is its complexity O(1) or O(n)?',
    ),
    code: `def primer_par(nums):
    for x in nums:
        if x % 2 == 0:
            return x
    return None

print(primer_par([1, 3, 5, 6, 7]))`,
    lang: 'python',
    walkthrough: l(
      'Recorre la lista en orden y devuelve el primer número par. `x % 2 == 0` significa que el residuo de dividir `x` entre 2 es 0.',
      'It walks the list in order and returns the first even number. `x % 2 == 0` means the remainder of dividing `x` by 2 is 0.',
    ),
    answer: '6',
    explanation: l(
      'Imprime **6**. Si el primer número fuera par terminaría en 1 paso, pero Big O describe el **peor caso**: si no hay ningún par (o está al final) recorre los n elementos → **O(n)**. En la entrevista conviene decir ambos: "en el mejor caso O(1), en el peor O(n)".',
      'It prints **6**. If the first number were even it would finish in 1 step, but Big O describes the **worst case**: if there is no even number (or it is last) it walks all n elements → **O(n)**. In the interview it helps to say both: "best case O(1), worst case O(n)".',
    ),
  },
];

/* ---------------- Lección nueva: Big O en la práctica ---------------- */

const tryIt = (es: string, en: string) => md(`### ✍️ Ahora tú\n${es}`, `### ✍️ Your turn\n${en}`);

export const BIG_O_PRACTICE_LESSON: Lesson = {
  id: 'big-o-practice',
  track: 'dsa',
  title: l('Big O en la práctica', 'Big O in practice'),
  summary: l('Analiza código paso a paso: ejemplos resueltos y luego los resuelves tú.', 'Analyze code step by step: worked examples, then you solve them.'),
  minutes: 20,
  blocks: [
    md(
      `## Cómo analizar cualquier fragmento
Leer la teoría no basta: Big O se aprende **analizando muchos ejemplos**. En esta lección cada ejemplo viene resuelto y justo después hay uno parecido para que lo hagas tú.

El método siempre es el mismo:
1. ¿Qué es **n**? (el tamaño de la entrada)
2. ¿Cuántas veces se repite cada ciclo **en función de n**?
3. Ciclos **anidados se multiplican**, ciclos **seguidos se suman**.
4. Quédate con el **término dominante**, sin constantes.`,
      `## How to analyze any snippet
Reading the theory is not enough: Big O is learned by **analyzing many examples**. In this lesson each example comes solved and right after it there is a similar one for you to do.

The method is always the same:
1. What is **n**? (the input size)
2. How many times does each loop repeat **as a function of n**?
3. **Nested** loops **multiply**, **consecutive** loops **add**.
4. Keep the **dominant term**, without constants.`,
    ),

    md(`## Ejemplo 1: ciclos seguidos`, `## Example 1: consecutive loops`),
    code(`def resumen(nums):
    total = 0
    for x in nums:        # n vueltas
        total += x
    maximo = nums[0]
    for x in nums:        # otras n vueltas
        maximo = max(maximo, x)
    return total, maximo`),
    md(
      'Dos ciclos **uno después del otro**: n + n = 2n → **O(n)**. No importa que sean dos; no están anidados.',
      'Two loops **one after the other**: n + n = 2n → **O(n)**. It does not matter that there are two; they are not nested.',
    ),
    tryIt('', ''),
    {
      kind: 'exercise',
      ex: {
        id: 'w1',
        level: 'basic',
        kind: 'recall',
        q: l(
          '¿Qué complejidad tiene?\n\n```python\ndef f(a, b):\n    for x in a:\n        print(x)\n    for y in b:\n        print(y)\n```',
          'What is its complexity?\n\n```python\ndef f(a, b):\n    for x in a:\n        print(x)\n    for y in b:\n        print(y)\n```',
        ),
        a: l('**O(a + b)**, donde a y b son los tamaños de cada lista. Son dos entradas distintas, así que se nombran por separado.', '**O(a + b)**, where a and b are the sizes of each list. They are two different inputs, so each gets its own name.'),
      },
    },

    md(`## Ejemplo 2: ciclos anidados`, `## Example 2: nested loops`),
    code(`def hay_duplicado(nums):
    for i in range(len(nums)):            # n vueltas
        for j in range(i + 1, len(nums)): # hasta n vueltas por cada i
            if nums[i] == nums[j]:
                return True
    return False`),
    md(
      'Por cada elemento compara con todos los siguientes: del orden de n × n → **O(n²)**. (Con un set se resuelve en O(n), como viste en la lección de hash maps.)',
      'For each element it compares with all the following ones: on the order of n × n → **O(n²)**. (With a set it is solved in O(n), as you saw in the hash maps lesson.)',
    ),
    tryIt('Ojo: no todo ciclo anidado es O(n²).', 'Careful: not every nested loop is O(n²).'),
    {
      kind: 'exercise',
      ex: {
        id: 'w2',
        level: 'medium',
        kind: 'recall',
        q: l(
          '¿Qué complejidad tiene?\n\n```python\nfor x in nums:          # n elementos\n    for k in range(10):  # siempre 10\n        print(x, k)\n```',
          'What is its complexity?\n\n```python\nfor x in nums:          # n elements\n    for k in range(10):  # always 10\n        print(x, k)\n```',
        ),
        a: l('**O(n)**: el ciclo de adentro da siempre 10 vueltas, sin importar n. Son 10 · n pasos, y el 10 es una constante.', '**O(n)**: the inner loop always runs 10 times, regardless of n. That is 10 · n steps, and 10 is a constant.'),
      },
    },

    md(`## Ejemplo 3: dividir a la mitad`, `## Example 3: halving`),
    code(`def busqueda_binaria(a, x):
    lo, hi = 0, len(a) - 1
    while lo <= hi:            # el rango se reduce a la mitad cada vuelta
        mid = (lo + hi) // 2
        if a[mid] == x:
            return mid
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`),
    md(
      'Cada vuelta descarta la mitad del rango. ¿Cuántas veces puedes partir n a la mitad hasta llegar a 1? log₂(n) → **O(log n)**.',
      'Each iteration discards half the range. How many times can you halve n until you reach 1? log₂(n) → **O(log n)**.',
    ),
    tryIt('', ''),
    {
      kind: 'exercise',
      ex: {
        id: 'w3',
        level: 'medium',
        kind: 'predict',
        prompt: l('Ahora se divide entre **4**. ¿Qué imprime? ¿Sigue siendo O(log n)?', 'Now it divides by **4**. What does it print? Is it still O(log n)?'),
        code: `n = 64
pasos = 0
while n > 1:
    n //= 4
    pasos += 1
print(pasos)`,
        lang: 'python',
        walkthrough: l(
          'Igual que dividir a la mitad, pero ahora `n` se divide entre 4 en cada vuelta. Cuenta las vueltas hasta que `n` deje de ser mayor que 1.',
          'Like halving, but now `n` is divided by 4 every iteration. Count the iterations until `n` is no longer greater than 1.',
        ),
        answer: '3',
        explanation: l('64 → 16 → 4 → 1: **3** pasos = log₄(64). La base del logaritmo es solo una constante, así que sigue siendo **O(log n)**.', '64 → 16 → 4 → 1: **3** steps = log₄(64). The base of the logarithm is only a constant, so it is still **O(log n)**.'),
      },
    },

    md(`## Ejemplo 4: un ciclo que depende del otro`, `## Example 4: a loop that depends on the other`),
    code(`def pares(nums):
    resultado = []
    for i in range(len(nums)):
        for j in range(i):          # 0, 1, 2, ..., n-1 vueltas
            resultado.append((nums[j], nums[i]))
    return resultado`),
    md(
      'El ciclo de adentro da 0, 1, 2, … n−1 vueltas. La suma es n(n−1)/2 ≈ n²/2 → **O(n²)**. Aunque haga "la mitad" del trabajo, sigue creciendo como n².',
      'The inner loop runs 0, 1, 2, … n−1 times. The sum is n(n−1)/2 ≈ n²/2 → **O(n²)**. Even though it does "half" the work, it still grows like n².',
    ),
    tryIt('', ''),
    {
      kind: 'exercise',
      ex: {
        id: 'w4',
        level: 'medium',
        kind: 'predict',
        prompt: l('¿Qué imprime?', 'What does it print?'),
        code: `n = 4
pasos = 0
for i in range(n):
    for j in range(i, n):
        pasos += 1
print(pasos)`,
        lang: 'python',
        walkthrough: l(
          'Ahora `j` empieza en `i` y llega hasta `n - 1`: cuando `i` = 0 da n vueltas, cuando `i` = 1 da una menos, y así.',
          'Now `j` starts at `i` and goes up to `n - 1`: when `i` = 0 it runs n times, when `i` = 1 one fewer, and so on.',
        ),
        answer: '10',
        explanation: l('4 + 3 + 2 + 1 = **10** = n(n+1)/2 → también **O(n²)**.', '4 + 3 + 2 + 1 = **10** = n(n+1)/2 → also **O(n²)**.'),
      },
    },

    md(`## Ejemplo 5: recursión que se ramifica`, `## Example 5: branching recursion`),
    code(`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)   # cada llamada hace 2 más`),
    md(
      'Cada llamada abre **dos** llamadas nuevas, y el árbol de llamadas crece de forma exponencial → **O(2ⁿ)** (cota superior). Con memoización cada valor se calcula una vez → O(n).',
      'Each call opens **two** new calls, and the call tree grows exponentially → **O(2ⁿ)** (upper bound). With memoization each value is computed once → O(n).',
    ),
    tryIt('', ''),
    {
      kind: 'exercise',
      ex: {
        id: 'w5',
        level: 'interview',
        kind: 'predict',
        prompt: l('Este código cuenta cuántas veces se llama `fib`. ¿Qué imprime?', 'This code counts how many times `fib` is called. What does it print?'),
        code: `llamadas = 0

def fib(n):
    global llamadas
    llamadas += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

fib(5)
print(llamadas)`,
        lang: 'python',
        walkthrough: l(
          '`fib(n)` llama a `fib(n - 1)` y a `fib(n - 2)`, salvo que `n` sea menor que 2. Cada vez que entra a la función suma 1 a `llamadas`. Fíjate cómo una llamada abre otras dos.',
          '`fib(n)` calls `fib(n - 1)` and `fib(n - 2)`, unless `n` is less than 2. Every time it enters the function it adds 1 to `llamadas`. Notice how one call opens two more.',
        ),
        answer: '15',
        explanation: l('**15** llamadas para calcular fib(5), y el número casi se duplica con cada n más. Es el crecimiento exponencial que la programación dinámica evita.', '**15** calls to compute fib(5), and the number nearly doubles with each extra n. This is the exponential growth that dynamic programming avoids.'),
      },
    },

    md(
      `## Ejemplo 6: trampas que esconden un O(n)
Algunas operaciones parecen de una línea pero recorren toda la colección:

| Código | Costo | Mejor opción |
|---|---|---|
| \`x in lista\` | O(n) | \`x in conjunto\` (set): O(1) promedio |
| \`lista.pop(0)\` / \`lista.insert(0, x)\` | O(n) | \`collections.deque\`: O(1) |
| \`texto += parte\` dentro de un ciclo | puede ser O(n²) en total | \`"".join(partes)\` |
| \`sorted(lista)\` dentro de un ciclo | O(n log n) en cada vuelta | ordenar una vez antes |
| \`lista[1:]\` | O(k): copia k elementos | pasar índices en vez de copiar |

La documentación de Python advierte que construir una secuencia inmutable concatenando repetidamente tiene un **costo cuadrático** en su longitud total.`,
      `## Example 6: traps that hide an O(n)
Some operations look like one line but walk the whole collection:

| Code | Cost | Better option |
|---|---|---|
| \`x in list\` | O(n) | \`x in a_set\`: O(1) average |
| \`list.pop(0)\` / \`list.insert(0, x)\` | O(n) | \`collections.deque\`: O(1) |
| \`text += part\` inside a loop | can be O(n²) overall | \`"".join(parts)\` |
| \`sorted(list)\` inside a loop | O(n log n) every iteration | sort once beforehand |
| \`list[1:]\` | O(k): copies k elements | pass indices instead of copying |

The Python documentation warns that building an immutable sequence by repeated concatenation has a **quadratic runtime cost** in its total length.`,
    ),
    tryIt('', ''),
    {
      kind: 'exercise',
      ex: {
        id: 'w6',
        level: 'medium',
        kind: 'complete',
        prompt: l('Completa para unir las partes en un solo texto **sin** concatenar en un ciclo.', 'Complete it to join the parts into a single text **without** concatenating in a loop.'),
        code: `partes = ["a", "b", "c"]
texto = ____
print(texto)`,
        lang: 'python',
        walkthrough: l(
          '`"".join(partes)` recorre la lista una vez y pega todas las partes usando `""` (nada) como separador.',
          '`"".join(partes)` walks the list once and glues all the parts using `""` (nothing) as the separator.',
        ),
        options: ['"".join(partes)', 'partes.join("")', 'str(partes)', '" ".join(partes)'],
        answer: 0,
        explanation: l(
          '`"".join(partes)` recorre las partes una vez: **O(n)**. `join` es un método del separador (el string), no de la lista; `" ".join` metería espacios ("a b c").',
          '`"".join(partes)` walks the parts once: **O(n)**. `join` is a method of the separator (the string), not of the list; `" ".join` would add spaces ("a b c").',
        ),
      },
    },
    interview(
      'En la entrevista di la complejidad **y explica por qué** en una frase: "es O(n²) porque por cada elemento recorro el resto". Esa justificación vale tanto como el resultado.',
      'In the interview state the complexity **and explain why** in one sentence: "it is O(n²) because for each element I walk the rest". That justification is worth as much as the result.',
    ),
    tip('¿Quieres más? Al final de la lección anterior está **Practica esta lección** con 12 ejercicios de Big O en 3 niveles.', 'Want more? At the end of the previous lesson there is **Practice this lesson** with 12 Big O exercises in 3 levels.'),
  ],
  quiz: [
    q('`for x in nums: for k in range(5): ...` — ¿complejidad?', '`for x in nums: for k in range(5): ...` — complexity?', [['O(n²)', 'O(n²)'], ['O(n)', 'O(n)'], ['O(5)', 'O(5)'], ['O(log n)', 'O(log n)']], 1,
      'El ciclo interno es constante (5): 5n → O(n).', 'The inner loop is constant (5): 5n → O(n).'),
    q('Un ciclo que divide n entre 3 en cada vuelta es…', 'A loop that divides n by 3 every iteration is…', [['O(n/3)', 'O(n/3)'], ['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(3ⁿ)', 'O(3ⁿ)']], 2,
      'La base del logaritmo no cambia la clase de complejidad.', 'The base of the logarithm does not change the complexity class.'),
    q('¿Cuál de estas operaciones sobre una lista de Python es O(n)?', 'Which of these operations on a Python list is O(n)?', [['lista.append(x)', 'list.append(x)'], ['lista[i]', 'list[i]'], ['x in lista', 'x in list'], ['len(lista)', 'len(list)']], 2,
      '`in` recorre la lista; append es O(1) amortizado y len e indexar son O(1).', '`in` scans the list; append is O(1) amortized and len and indexing are O(1).'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('Dos ciclos sobre `nums`, uno después del otro (no anidados). ¿Complejidad?', 'Two loops over `nums`, one after the other (not nested). Complexity?', [['O(n²)', 'O(n²)'], ['O(2ⁿ)', 'O(2ⁿ)'], ['O(n)', 'O(n)'], ['O(log n)', 'O(log n)']], 2,
      'n + n = 2n → O(n). Que sean dos no importa: no están anidados.', 'n + n = 2n → O(n). Having two does not matter: they are not nested.'),
    q('Recorres la lista `a` y después la lista `b`, de tamaños distintos. ¿Complejidad?', 'You walk list `a` and then list `b`, of different sizes. Complexity?', [['O(a)', 'O(a)'], ['O(a + b)', 'O(a + b)'], ['O(a · b)', 'O(a · b)'], ['O(1)', 'O(1)']], 1,
      'Son dos entradas distintas: se nombran por separado y se suman.', 'They are two different inputs: you name them separately and add them.'),
    q('¿Cuántas vueltas da `while n > 1: n //= 2` empezando con n = 1024?', 'How many iterations does `while n > 1: n //= 2` run starting at n = 1024?', [['1024', '1024'], ['512', '512'], ['10', '10'], ['32', '32']], 2,
      '1024 = 2¹⁰: se puede partir a la mitad 10 veces. Es O(log n).', '1024 = 2¹⁰: it can be halved 10 times. It is O(log n).'),
    q('`for i in range(n): for j in range(i): ...` hace 0 + 1 + … + (n − 1) vueltas. ¿Complejidad?', '`for i in range(n): for j in range(i): ...` does 0 + 1 + … + (n − 1) iterations. Complexity?', [['O(n)', 'O(n)'], ['O(n²)', 'O(n²)'], ['O(n log n)', 'O(n log n)'], ['O(n/2)', 'O(n/2)']], 1,
      'La suma es n(n − 1)/2 ≈ n²/2. El /2 es una constante: sigue siendo O(n²).', 'The sum is n(n − 1)/2 ≈ n²/2. The /2 is a constant: it is still O(n²).'),
    q('¿Qué complejidad tiene `fib(n)` recursivo que llama a `fib(n - 1)` y a `fib(n - 2)` sin memoria?', 'What is the complexity of recursive `fib(n)` calling `fib(n - 1)` and `fib(n - 2)` with no memory?', [['O(n)', 'O(n)'], ['O(n²)', 'O(n²)'], ['O(log n)', 'O(log n)'], ['O(2ⁿ)', 'O(2ⁿ)']], 3,
      'Cada llamada se ramifica en dos: el número de llamadas casi se duplica con cada n más.', 'Each call branches in two: the number of calls nearly doubles with each extra n.'),
    q('Construir un texto con `texto += parte` dentro de un ciclo puede costar O(n²). ¿Qué usas en su lugar?', 'Building a text with `text += part` inside a loop can cost O(n²). What do you use instead?', [['`"".join(partes)`', '`"".join(parts)`'], ['`str(partes)`', '`str(parts)`'], ['`partes.join("")`', '`parts.join("")`'], ['Un set', 'A set']], 0,
      '`join` recorre las partes una sola vez: O(n). `join` es un método del separador, no de la lista.', '`join` walks the parts once: O(n). `join` is a method of the separator, not of the list.'),
    q('¿Cuánto cuesta `lista.pop(0)` y qué usas para una cola?', 'What does `list.pop(0)` cost and what do you use for a queue?', [['O(1); una lista', 'O(1); a list'], ['O(log n); un heap', 'O(log n); a heap'], ['O(n); `collections.deque`', 'O(n); `collections.deque`'], ['O(n²); un set', 'O(n²); a set']], 2,
      'Sacar el primero obliga a mover a todos los demás. `deque.popleft()` es O(1).', 'Removing the first forces moving everyone else. `deque.popleft()` is O(1).'),
    q('¿Qué cuesta `lista[1:]`?', 'What does `list[1:]` cost?', [['O(1): solo cambia el inicio', 'O(1): it just changes the start'], ['O(k): copia los k elementos que toma', 'O(k): it copies the k elements it takes'], ['O(log n)', 'O(log n)'], ['Nada', 'Nothing']], 1,
      'Un slice crea una lista nueva. En una recursión que lo hace en cada llamada, el costo se multiplica.', 'A slice creates a new list. In a recursion doing it on every call, the cost multiplies.'),
  ],
  concepts: [
    concept('Método para calcular la complejidad de un fragmento', 'Method to compute the complexity of a snippet', 'Define n → cuenta repeticiones de cada ciclo → anidados se multiplican, seguidos se suman → término dominante sin constantes.', 'Define n → count each loop\'s repetitions → nested multiply, consecutive add → dominant term without constants.'),
    concept('Operaciones de una línea que esconden O(n) en Python', 'One-line operations that hide O(n) in Python', '`x in lista`, `lista.pop(0)`/`insert(0, x)`, copiar con slices (`lista[1:]`) y concatenar strings en un ciclo (usar `"".join`).', '`x in list`, `list.pop(0)`/`insert(0, x)`, copying with slices (`list[1:]`) and concatenating strings in a loop (use `"".join`).'),
  ],
};
