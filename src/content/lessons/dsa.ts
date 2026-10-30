import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, viz, warn } from './helpers';

export const DSA_LESSONS: Lesson[] = [
  {
    id: 'big-o',
    track: 'dsa',
    title: l('Complejidad y notación Big O', 'Complexity and Big O notation'),
    summary: l('Qué mide Big O, las complejidades más comunes, cómo simplificarlas y cómo calcular tiempo y espacio de tu código.', 'What Big O measures, the most common complexities, how to simplify them and how to work out the time and space of your code.'),
    minutes: 20,
    blocks: [
      md(
        `## ¿Qué problema resuelve Big O?
Dos programas resuelven lo mismo. Con 1,000 datos ambos tardan un instante, pero con un millón uno sigue tardando un segundo y el otro tarda horas. ¿Cómo lo sabes **antes** de probarlo?

Medir segundos no sirve: depende de la computadora. **Big O cuenta pasos.** Describe **cómo crece la cantidad de pasos** de un algoritmo cuando crece el tamaño de la entrada.
- **n** es el tamaño de la entrada: cuántos elementos tiene la lista, cuántas letras tiene el texto.
- Un **paso** es una operación simple: sumar, comparar dos números, leer \`lista[i]\`.

**Analogía:** buscas un nombre en una lista de invitados **en desorden**: la lees de arriba abajo. Si la lista tiene el doble de nombres, tardas el doble. En cambio, en un directorio **ordenado** abres a la mitad, ves si el nombre va antes o después y descartas la otra mitad: con el doble de nombres solo haces **un paso más**. Big O es la forma de decir esa diferencia con precisión.`,
        `## What problem does Big O solve?
Two programs solve the same task. With 1,000 items both take an instant, but with a million one still takes a second and the other takes hours. How can you tell **before** trying it?

Measuring seconds does not work: it depends on the computer. **Big O counts steps.** It describes **how the number of steps grows** as the input size grows.
- **n** is the input size: how many elements the list has, how many letters the text has.
- A **step** is a simple operation: adding, comparing two numbers, reading \`list[i]\`.

**Analogy:** you look for a name on a guest list **in no order**: you read it top to bottom. If the list has twice as many names, it takes twice as long. But in a **sorted** directory you open the middle, see whether the name comes before or after, and discard the other half: with twice the names you do only **one more step**. Big O is the precise way to state that difference.`,
      ),
      md(
        `## Las complejidades más comunes, de la mejor a la peor
| Big O | Nombre | Qué significa | Pasos con n = 1,000 |
|---|---|---|---|
| **O(1)** | constante | No depende de n: siempre los mismos pasos | 1 |
| **O(log n)** | logarítmica | Cada paso descarta la mitad de lo que queda | ≈ 10 |
| **O(n)** | lineal | Revisa cada elemento una vez | 1,000 |
| **O(n log n)** | linearítmica | Lo que tardan los buenos ordenamientos | ≈ 10,000 |
| **O(n²)** | cuadrática | Por cada elemento, revisa todos los demás | 1,000,000 |
| **O(2ⁿ)** | exponencial | Cada elemento extra duplica el trabajo | un número de 302 dígitos |

**log₂ n** es cuántas veces puedes dividir n entre 2 hasta llegar a 1. Por eso crece tan lento: 1,000 → unas 10 divisiones; un millón → unas 20.

Así se ve cada una en código:`,
        `## The most common complexities, from best to worst
| Big O | Name | What it means | Steps with n = 1,000 |
|---|---|---|---|
| **O(1)** | constant | Does not depend on n: always the same steps | 1 |
| **O(log n)** | logarithmic | Each step discards half of what is left | ≈ 10 |
| **O(n)** | linear | Checks each element once | 1,000 |
| **O(n log n)** | linearithmic | What good sorting algorithms take | ≈ 10,000 |
| **O(n²)** | quadratic | For each element, checks all the others | 1,000,000 |
| **O(2ⁿ)** | exponential | Each extra element doubles the work | a 302-digit number |

**log₂ n** is how many times you can divide n by 2 until you reach 1. That is why it grows so slowly: 1,000 → about 10 divisions; a million → about 20.

This is what each one looks like in code:`,
      ),
      code(`nums = [4, 8, 15, 16, 23, 42]        # n = 6

# O(1): un paso, sin importar cuántos elementos haya
primero = nums[0]

# O(n): un paso por cada elemento
total = 0
for x in nums:
    total += x

# O(n²): por cada elemento, recorre toda la lista otra vez
pares = 0
for x in nums:
    for y in nums:
        pares += 1                    # se ejecuta 6 × 6 = 36 veces

# O(log n): en cada vuelta el problema se reduce a la mitad
m = 1000
vueltas = 0
while m > 1:
    m = m // 2                        # // es división entera: 1000 → 500 → 250…
    vueltas += 1

print(primero, total, pares, vueltas)  # imprime: 4 108 36 9`),
      md(
        `**Cómo leerlo:**
- \`nums[0]\` es un solo paso aunque la lista tuviera un millón de elementos → **O(1)**.
- El primer \`for\` da una vuelta por elemento: con el doble de elementos, el doble de vueltas → **O(n)**.
- En los dos \`for\` anidados, el de adentro da **todas** sus vueltas por **cada** vuelta del de afuera: 6 × 6 → **O(n²)**.
- El \`while\` parte \`m\` a la mitad cada vez: 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 son 9 vueltas, y con 2,000 serían solo 10 → **O(log n)**.`,
        `**How to read it:**
- \`nums[0]\` is a single step even if the list had a million elements → **O(1)**.
- The first \`for\` runs once per element: with twice the elements, twice the iterations → **O(n)**.
- In the two nested \`for\` loops, the inner one runs **all** its iterations for **each** outer iteration: 6 × 6 → **O(n²)**.
- The \`while\` halves \`m\` each time: 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 is 9 iterations, and with 2,000 it would be just 10 → **O(log n)**.`,
      ),
      md(
        `## Las 3 reglas para simplificar
Big O solo describe **cómo crece** el costo cuando n es muy grande. Por eso se simplifica así:

1. **Quita las constantes:** O(2n) → **O(n)**. Si n se duplica, 2n también se duplica: el crecimiento es el mismo.
2. **Quédate con el término dominante:** O(n² + n) → **O(n²)**. Con n = 1,000, n² es 1,000,000 y n apenas suma 1,000 más (0.1%).
3. **Pasos uno después de otro se suman; pasos uno dentro de otro se multiplican:** un ciclo de n y después otro de n es O(n + n) = O(n). Un ciclo de n dentro de otro de n es O(n · n) = O(n²).`,
        `## The 3 simplification rules
Big O only describes **how the cost grows** when n is very large. That is why it is simplified like this:

1. **Drop constants:** O(2n) → **O(n)**. If n doubles, 2n doubles too: the growth is the same.
2. **Keep the dominant term:** O(n² + n) → **O(n²)**. With n = 1,000, n² is 1,000,000 and n only adds 1,000 more (0.1%).
3. **Steps one after another add; steps one inside another multiply:** a loop over n followed by another over n is O(n + n) = O(n). A loop over n inside another over n is O(n · n) = O(n²).`,
      ),
      code(`def ejemplo(nums):
    total = 0
    for x in nums:          # ciclo de n vueltas → O(n)
        total += x
    for x in nums:          # ciclo de n vueltas...
        for y in nums:      # ...con otro de n adentro → O(n · n) = O(n²)
            print(x, y)
    return total

# Uno después del otro se suman: O(n + n²). Te quedas con el dominante: O(n²)`),
      md(
        `## Peor caso y mejor caso
Muchos algoritmos a veces terminan rápido y a veces no. Esta función busca el primer número par:

\`\`\`python
def primer_par(nums):
    for x in nums:
        if x % 2 == 0:      # % es el residuo: x % 2 == 0 significa "x es par"
            return x
    return None
\`\`\`

- **Mejor caso:** el primer número ya es par → 1 paso.
- **Peor caso:** no hay pares, o el único está al final → revisa los n números.

Cuando alguien dice "este algoritmo es O(n)", normalmente habla del **peor caso**: es la garantía de que nunca será más lento que eso. En una entrevista suma puntos decir los dos: "en el mejor caso O(1), en el peor O(n)".`,
        `## Worst case and best case
Many algorithms sometimes finish quickly and sometimes do not. This function looks for the first even number:

\`\`\`python
def primer_par(nums):
    for x in nums:
        if x % 2 == 0:      # % is the remainder: x % 2 == 0 means "x is even"
            return x
    return None
\`\`\`

- **Best case:** the first number is already even → 1 step.
- **Worst case:** there are no even numbers, or the only one is last → it checks all n numbers.

When someone says "this algorithm is O(n)", they usually mean the **worst case**: the guarantee that it will never be slower than that. In an interview it earns points to say both: "best case O(1), worst case O(n)".`,
      ),
      md(
        `## Cuando hay dos entradas: O(n + m)
Si recorres una lista de tamaño **n** y **después** otra distinta de tamaño **m**, la complejidad es **O(n + m)**. No la simplifiques a O(n): son dos tamaños independientes y si m es mucho más grande que n, ignorarla sería un error.

Si en cambio por cada elemento de una recorres toda la otra (un ciclo dentro del otro), es **O(n · m)**.`,
        `## When there are two inputs: O(n + m)
If you walk a list of size **n** and **then** a different one of size **m**, the complexity is **O(n + m)**. Do not simplify it to O(n): they are two independent sizes, and if m is much larger than n, ignoring it would be wrong.

If instead for each element of one you walk the whole other one (a loop inside another), it is **O(n · m)**.`,
      ),
      md(
        `## Cuidado: operaciones que esconden un ciclo
Una sola línea no siempre es un solo paso. Algunas operaciones de Python recorren la lista por dentro:
- \`x in lista\` revisa los elementos uno por uno → **O(n)**.
- \`sorted(lista)\` ordena la lista → **O(n log n)**.

Si pones una de estas **dentro de un ciclo**, multiplicas su costo. Con un **set** (un conjunto: guarda elementos sin repetir y responde \`in\` sin recorrerlos) cada \`in\` cuesta **O(1)** en promedio. Lo verás a fondo en la lección de hash maps.`,
        `## Watch out: operations that hide a loop
A single line is not always a single step. Some Python operations walk the list internally:
- \`x in lista\` checks the elements one by one → **O(n)**.
- \`sorted(lista)\` sorts the list → **O(n log n)**.

If you put one of these **inside a loop**, you multiply its cost. With a **set** (it stores elements without repeats and answers \`in\` without walking them) each \`in\` costs **O(1)** on average. You will see it in depth in the hash maps lesson.`,
      ),
      code(`invitados = ["ana", "luis", "eva", "sofía"]     # n invitados
llegaron = ["eva", "rosa", "luis"]              # m personas que llegaron

# O(n · m): cada "in" recorre toda la lista de invitados
for p in llegaron:
    if p in invitados:
        print(p, "está invitada")

# O(n + m): se arma el set una vez (n pasos) y cada consulta es O(1)
invitados_set = set(invitados)
for p in llegaron:
    if p in invitados_set:
        print(p, "está invitada")

# Las dos versiones encuentran a las mismas personas.
# imprime:
# eva está invitada
# luis está invitada
# eva está invitada
# luis está invitada`),
      md(
        `## Complejidad de espacio
Además del tiempo, Big O mide la **memoria extra** que usa tu algoritmo, sin contar la entrada:
- Unas cuantas variables (\`total\`, \`i\`) → **O(1)** de espacio.
- Una lista nueva del tamaño de la entrada → **O(n)** de espacio.
- **La recursión también ocupa memoria:** cada llamada que todavía no termina queda guardada en la **pila de llamadas**, esperando su resultado. Si una función se llama a sí misma n veces antes de empezar a regresar, hay n llamadas guardadas a la vez → **O(n)** de espacio, aunque no cree ninguna lista.

**Analogía:** es como dejar notas de "cuando me respondas, sigo con esto" apiladas en tu escritorio: mientras más llamadas pendientes, más notas.`,
        `## Space complexity
Besides time, Big O measures the **extra memory** your algorithm uses, not counting the input:
- A few variables (\`total\`, \`i\`) → **O(1)** space.
- A new list as large as the input → **O(n)** space.
- **Recursion uses memory too:** each call that has not finished yet stays stored on the **call stack**, waiting for its result. If a function calls itself n times before it starts returning, there are n calls stored at once → **O(n)** space, even if it creates no list.

**Analogy:** it is like leaving "when you answer me, I will continue with this" notes stacked on your desk: the more pending calls, the more notes.`,
      ),
      code(`# Versión con ciclo: O(n) de tiempo, O(1) de espacio (solo la variable total)
def suma_ciclo(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Versión recursiva: O(n) de tiempo y O(n) de espacio
# suma_rec(4) espera a suma_rec(3), que espera a suma_rec(2)... hasta suma_rec(0)
def suma_rec(n):
    if n == 0:
        return 0
    return n + suma_rec(n - 1)

print(suma_ciclo(4), suma_rec(4))   # imprime: 10 10`),
      md(
        `## Complejidad amortizada
A veces una operación es casi siempre barata, pero de vez en cuando cuesta mucho. La **complejidad amortizada** es el costo **promedio por operación a lo largo de muchas operaciones**.

El ejemplo clásico es \`lista.append(x)\` en Python (agregar al final):
- Python reserva espacio de más. Casi siempre hay lugar libre y agregar cuesta **O(1)**.
- Cuando se llena, reserva un espacio más grande y **copia todos los elementos** ahí: esa vez cuesta **O(n)**.
- Como el espacio nuevo crece en proporción al tamaño (por ejemplo, al doble), las copias son cada vez más raras. Si sumas n inserciones, el trabajo total es O(n): cada una cuesta **O(1) amortizado**.

**Analogía:** al mudarte a una casa más grande cargas todas tus cosas (caro), pero pasa pocas veces. Repartido entre todos los días que vives ahí, el costo por día es pequeño.

No es lo mismo que el "caso promedio": el amortizado es una garantía sobre toda la secuencia de operaciones, no una cuestión de suerte.`,
        `## Amortized complexity
Sometimes an operation is almost always cheap but occasionally very expensive. **Amortized complexity** is the **average cost per operation over many operations**.

The classic example is \`list.append(x)\` in Python (adding at the end):
- Python reserves extra space. Almost always there is a free slot and appending costs **O(1)**.
- When it is full, it reserves a bigger space and **copies every element** there: that time it costs **O(n)**.
- Because the new space grows in proportion to the size (for example, double), copies get rarer and rarer. Over n appends the total work is O(n): each one costs **O(1) amortized**.

**Analogy:** moving to a bigger house means carrying all your stuff (expensive), but it happens rarely. Spread over all the days you live there, the cost per day is small.

It is not the same as the "average case": amortized is a guarantee over the whole sequence of operations, not a matter of luck.`,
      ),
      interview(
        'Si te preguntan la complejidad de `append` en una lista de Python o de `push` en un arreglo de JavaScript, la respuesta precisa es "O(1) amortizado".',
        'If asked the complexity of `append` on a Python list or `push` on a JavaScript array, the precise answer is "O(1) amortized".',
      ),
      interview(
        'Siempre di la complejidad de tiempo **y** espacio al terminar tu solución, sin que te la pidan. Si tu primera idea es O(n²), menciónala y luego pregunta "¿puedo optimizarla?".',
        'Always state time **and** space complexity when you finish your solution, without being asked. If your first idea is O(n²), say so and then ask "can I optimize it?".',
      ),
      md(
        `## Resumen
| Si ves… | Piensa en… |
|---|---|
| Un acceso directo (\`lista[i]\`, una suma) | O(1) |
| Un ciclo que parte el problema a la mitad | O(log n) |
| Un ciclo sobre los n elementos | O(n) |
| Ordenar con \`sorted\` | O(n log n) |
| Un ciclo sobre n dentro de otro sobre n | O(n²) |
| Dos entradas distintas recorridas por separado | O(n + m) |
| \`x in lista\` dentro de un ciclo | Un ciclo escondido: O(n) por cada vuelta |
| Recursión de profundidad n | O(n) de espacio por la pila de llamadas |
| \`append\` | O(1) amortizado |

**Para simplificar:** quita constantes, quédate con el término dominante, suma lo secuencial y multiplica lo anidado.`,
        `## Summary
| If you see… | Think of… |
|---|---|
| A direct access (\`list[i]\`, an addition) | O(1) |
| A loop that halves the problem | O(log n) |
| A loop over the n elements | O(n) |
| Sorting with \`sorted\` | O(n log n) |
| A loop over n inside another over n | O(n²) |
| Two different inputs walked separately | O(n + m) |
| \`x in list\` inside a loop | A hidden loop: O(n) per iteration |
| Recursion of depth n | O(n) space because of the call stack |
| \`append\` | O(1) amortized |

**To simplify:** drop constants, keep the dominant term, add sequential steps and multiply nested ones.`,
      ),
    ],
    quiz: [
      q('¿Cuál es la complejidad de un ciclo dentro de otro, ambos sobre n?', 'What is the complexity of a loop inside another, both over n?', [['O(n)', 'O(n)'], ['O(2n)', 'O(2n)'], ['O(n²)', 'O(n²)'], ['O(log n)', 'O(log n)']], 2,
        'Los ciclos anidados se multiplican: n × n.', 'Nested loops multiply: n × n.'),
      q('Simplifica O(3n + n log n + 50)', 'Simplify O(3n + n log n + 50)', [['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)'], ['O(3n)', 'O(3n)'], ['O(50)', 'O(50)']], 1,
        'n log n domina a n y a las constantes.', 'n log n dominates n and constants.'),
      q('¿Qué complejidad tiene dividir el problema a la mitad en cada paso?', 'What complexity does halving the problem at each step have?', [['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)'], ['O(1)', 'O(1)']], 1,
        'Solo puedes dividir n a la mitad log₂(n) veces.', 'You can only halve n log₂(n) times.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué describe Big O?', 'What does Big O describe?', [['Cuántos segundos tarda el programa en tu computadora', 'How many seconds the program takes on your computer'], ['Cómo crece la cantidad de pasos cuando crece el tamaño de la entrada', 'How the number of steps grows as the input size grows'], ['Cuántas líneas de código tiene el algoritmo', 'How many lines of code the algorithm has'], ['Si el programa tiene errores', 'Whether the program has bugs']], 1,
        'Los segundos dependen de la computadora; Big O cuenta pasos en función de n.', 'Seconds depend on the computer; Big O counts steps as a function of n.'),
      q('¿Qué complejidad tiene leer `nums[0]` en una lista de un millón de elementos?', 'What is the complexity of reading `nums[0]` in a list of a million elements?', [['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(1)', 'O(1)'], ['O(n²)', 'O(n²)']], 2,
        'Es un solo paso sin importar el tamaño: constante.', 'It is a single step regardless of size: constant.'),
      q('Recorres una lista de n elementos y **después**, en otro ciclo aparte, la recorres otra vez. ¿Complejidad?', 'You walk a list of n elements and **then**, in a separate loop, walk it again. Complexity?', [['O(n)', 'O(n)'], ['O(n²)', 'O(n²)'], ['O(2ⁿ)', 'O(2ⁿ)'], ['O(log n)', 'O(log n)']], 0,
        'Uno después del otro se suman: O(n + n) = O(2n) = O(n).', 'One after another add up: O(n + n) = O(2n) = O(n).'),
      q('Una función recorre la lista y se detiene en cuanto encuentra lo que busca. Cuando decimos que es O(n), hablamos del…', 'A function walks the list and stops as soon as it finds what it wants. When we say it is O(n), we mean the…', [['Mejor caso', 'Best case'], ['Caso amortizado', 'Amortized case'], ['Peor caso', 'Worst case'], ['Espacio que usa', 'Space it uses']], 2,
        'En el peor caso lo buscado no está o está al final y revisa los n elementos. En el mejor caso sería O(1).', 'In the worst case it is missing or last and it checks all n elements. The best case would be O(1).'),
      q('Recorres una lista de tamaño n y después otra distinta de tamaño m. ¿Complejidad?', 'You walk a list of size n and then a different one of size m. Complexity?', [['O(n)', 'O(n)'], ['O(n · m)', 'O(n · m)'], ['O(n + m)', 'O(n + m)'], ['O(1)', 'O(1)']], 2,
        'Son dos entradas independientes y van una después de la otra: se suman. Si estuvieran anidadas sería O(n · m).', 'They are two independent inputs, one after the other: they add up. If nested it would be O(n · m).'),
      q('¿Qué complejidad tiene `x in lista` cuando `lista` es una **lista** de Python?', 'What is the complexity of `x in lista` when `lista` is a Python **list**?', [['O(n): la revisa elemento por elemento', 'O(n): it checks element by element'], ['O(1): es una sola línea', 'O(1): it is a single line'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)']], 0,
        'Una sola línea puede esconder un ciclo. Con un set, en cambio, cada `in` es O(1) en promedio.', 'A single line can hide a loop. With a set, instead, each `in` is O(1) on average.'),
      q('Dentro de un ciclo de n vueltas llamas `if x in lista:` sobre una lista de n elementos. ¿Complejidad total?', 'Inside an n-iteration loop you call `if x in lista:` on a list of n elements. Total complexity?', [['O(n)', 'O(n)'], ['O(n²)', 'O(n²)'], ['O(n log n)', 'O(n log n)'], ['O(1)', 'O(1)']], 1,
        'n vueltas × O(n) por cada `in` = O(n²). Convertir la lista en set primero lo deja en O(n).', 'n iterations × O(n) per `in` = O(n²). Turning the list into a set first brings it to O(n).'),
      q('Una función recursiva se llama a sí misma n veces antes de empezar a regresar y no crea listas. ¿Cuánto espacio extra usa?', 'A recursive function calls itself n times before it starts returning and creates no lists. How much extra space does it use?', [['O(1), porque no crea listas', 'O(1), because it creates no lists'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)'], ['O(n), por las llamadas pendientes en la pila', 'O(n), because of the pending calls on the stack']], 3,
        'Cada llamada que no ha terminado ocupa lugar en la pila de llamadas, y llega a haber n a la vez.', 'Each unfinished call takes space on the call stack, and up to n are there at once.'),
      q('¿Qué complejidad tiene `lista.append(x)` en Python?', 'What is the complexity of `list.append(x)` in Python?', [['O(n) siempre', 'Always O(n)'], ['O(1) amortizado', 'O(1) amortized'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)']], 1,
        'Casi siempre es O(1); de vez en cuando copia todo (O(n)), pero repartido entre todas las inserciones da O(1) por operación.', 'Almost always O(1); occasionally it copies everything (O(n)), but spread over all appends it is O(1) per operation.'),
      q('¿En qué se diferencia la complejidad amortizada del caso promedio?', 'How does amortized complexity differ from the average case?', [['Son lo mismo', 'They are the same'], ['El amortizado es una garantía sobre toda la secuencia de operaciones, no una cuestión de suerte', 'Amortized is a guarantee over the whole sequence of operations, not a matter of luck'], ['El amortizado siempre es peor', 'Amortized is always worse'], ['El amortizado solo aplica a la recursión', 'Amortized only applies to recursion']], 1,
        'El caso promedio depende de qué entradas te tocan; el amortizado reparte el costo de las operaciones caras entre muchas baratas.', 'The average case depends on which inputs you get; amortized spreads the cost of expensive operations over many cheap ones.'),
      q('Ordenadas de menor a mayor crecimiento, ¿cuál es correcta?', 'Ordered from slowest to fastest growth, which is right?', [['O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)', 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)'], ['O(1) < O(n) < O(log n) < O(n²) < O(n log n) < O(2ⁿ)', 'O(1) < O(n) < O(log n) < O(n²) < O(n log n) < O(2ⁿ)'], ['O(log n) < O(1) < O(n) < O(2ⁿ) < O(n²)', 'O(log n) < O(1) < O(n) < O(2ⁿ) < O(n²)'], ['O(n) < O(n log n) < O(1) < O(n²)', 'O(n) < O(n log n) < O(1) < O(n²)']], 0,
        'Con n = 1,000: 1, ≈10, 1,000, ≈10,000, 1,000,000 y un número de 302 dígitos.', 'With n = 1,000: 1, ≈10, 1,000, ≈10,000, 1,000,000 and a 302-digit number.'),
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
    summary: l('Listas, diccionarios y sets: qué cuesta cada operación y el truco de "recordar lo que ya viste" para bajar de O(n²) a O(n).', 'Lists, dictionaries and sets: what each operation costs and the "remember what you saw" trick to go from O(n²) to O(n).'),
    minutes: 22,
    blocks: [
      md(
        `## Arrays (listas): elementos en fila
Una **lista** de Python (en otros lenguajes, *array* o arreglo) guarda sus elementos **uno junto al otro en memoria**, numerados desde 0. Ese número es el **índice**.

**Analogía:** una fila de casilleros numerados. Para abrir el casillero 500 vas directo a él, no abres los 499 anteriores. Por eso leer \`lista[i]\` es **O(1)**.

Pero si quieres meter un casillero nuevo **al inicio**, hay que recorrer a todos un lugar a la derecha. Por eso insertar o borrar al inicio (o en medio) es **O(n)**.

| Operación | Costo | Por qué |
|---|---|---|
| \`lista[i]\` | O(1) | Va directo a la posición |
| \`lista.append(x)\` | O(1) amortizado | Agrega al final (lo viste en Big O) |
| \`lista.insert(0, x)\` | O(n) | Mueve a todos un lugar |
| \`x in lista\` | O(n) | Revisa uno por uno |

Un **string** (texto) funciona parecido: es una fila de caracteres. Puedes leer \`texto[0]\`, medirlo con \`len(texto)\` y recorrerlo con \`for c in texto\`.`,
        `## Arrays (lists): elements in a row
A Python **list** (an *array* in other languages) stores its elements **next to each other in memory**, numbered from 0. That number is the **index**.

**Analogy:** a row of numbered lockers. To open locker 500 you go straight to it; you do not open the 499 before it. That is why reading \`list[i]\` is **O(1)**.

But if you want to put a new locker **at the start**, everyone has to move one place to the right. That is why inserting or deleting at the start (or in the middle) is **O(n)**.

| Operation | Cost | Why |
|---|---|---|
| \`list[i]\` | O(1) | Goes straight to the position |
| \`list.append(x)\` | O(1) amortized | Adds at the end (you saw it in Big O) |
| \`list.insert(0, x)\` | O(n) | Moves everyone one place |
| \`x in list\` | O(n) | Checks one by one |

A **string** (text) works similarly: it is a row of characters. You can read \`text[0]\`, measure it with \`len(text)\` and walk it with \`for c in text\`.`,
      ),
      code(`casilleros = ["a", "b", "c", "d"]
print(casilleros[2])          # imprime: c          (O(1): va directo a la posición 2)

casilleros.append("e")        # O(1) amortizado: al final
casilleros.insert(0, "z")     # O(n): mueve a todos un lugar a la derecha
print(casilleros)             # imprime: ['z', 'a', 'b', 'c', 'd', 'e']
print("d" in casilleros)      # imprime: True       (O(n): revisa uno por uno)

texto = "hola"
print(texto[0], len(texto))   # imprime: h 4        (un string se usa como una fila de letras)`),
      md(
        `## Hash maps (diccionarios): buscar por nombre, no por posición
**El problema:** quieres el teléfono de "Ana". Si los guardas en una lista, tienes que revisar uno por uno hasta encontrarla: O(n).

**La idea:** un **hash map** guarda pares **clave → valor**. Le das la clave y te devuelve el valor **sin recorrer nada**: **O(1)** en promedio. En Python el hash map se llama **diccionario** (\`dict\`).

**Analogía:** el guardarropa de un evento. Dejas tu abrigo y te dan un ticket con un número. Al regresar das el ticket y van directo al gancho correcto, sin revisar todos los abrigos.

Lo básico en Python:
- \`{}\` crea un diccionario vacío.
- \`d["ana"] = 111\` guarda el valor de la clave "ana". Si la clave ya existía, **reemplaza** el valor.
- \`d["ana"]\` lee el valor (da error si la clave no existe).
- \`d.get("ana", 0)\` lee el valor, o devuelve 0 si la clave no existe.
- \`"ana" in d\` pregunta si la clave existe: O(1).
- El diccionario recuerda el **orden en que agregaste** las claves.`,
        `## Hash maps (dictionaries): looking up by name, not by position
**The problem:** you want Ana's phone number. If you store them in a list, you must check one by one until you find her: O(n).

**The idea:** a **hash map** stores **key → value** pairs. You give it the key and it returns the value **without walking anything**: **O(1)** on average. In Python the hash map is called a **dictionary** (\`dict\`).

**Analogy:** an event's coat check. You leave your coat and get a ticket with a number. When you come back you hand in the ticket and they go straight to the right hook, without checking every coat.

The basics in Python:
- \`{}\` creates an empty dictionary.
- \`d["ana"] = 111\` stores the value for key "ana". If the key already existed, it **replaces** the value.
- \`d["ana"]\` reads the value (fails if the key does not exist).
- \`d.get("ana", 0)\` reads the value, or returns 0 if the key does not exist.
- \`"ana" in d\` asks whether the key exists: O(1).
- The dictionary remembers the **order in which you added** the keys.`,
      ),
      code(`telefonos = {}                       # diccionario vacío
telefonos["ana"] = 111               # guarda ana → 111
telefonos["luis"] = 222
telefonos["ana"] = 333               # "ana" ya existía: reemplaza su valor
print(telefonos)                     # imprime: {'ana': 333, 'luis': 222}
print(telefonos["luis"])             # imprime: 222
print(telefonos.get("eva", 0))       # imprime: 0      ("eva" no existe: devuelve el 0)
print("ana" in telefonos)            # imprime: True   (O(1): no recorre nada)`),
      md(
        `## Contar con un diccionario
El uso más común en entrevistas: **contar cuántas veces aparece cada cosa**. La línea clave es:

\`conteo[x] = conteo.get(x, 0) + 1\`

Se lee así: "toma el conteo actual de \`x\` (o 0 si es la primera vez que aparece), súmale 1 y guárdalo". Recorres los datos una vez y cada actualización es O(1), así que contar todo cuesta **O(n)**.

Con el conteo listo puedes hacer una **segunda pasada**. Por ejemplo, para encontrar el primer carácter que no se repite, recorres el texto otra vez y te detienes en el primero cuyo conteo sea 1.`,
        `## Counting with a dictionary
The most common use in interviews: **counting how many times each thing appears**. The key line is:

\`conteo[x] = conteo.get(x, 0) + 1\`

It reads: "take the current count of \`x\` (or 0 if this is the first time it appears), add 1 and store it". You walk the data once and each update is O(1), so counting everything costs **O(n)**.

With the count ready you can do a **second pass**. For example, to find the first character that does not repeat, you walk the text again and stop at the first one whose count is 1.`,
      ),
      code(`def frecuencias(palabras):
    conteo = {}
    for p in palabras:
        conteo[p] = conteo.get(p, 0) + 1
    return conteo

print(frecuencias(["sol", "mar", "sol"]))   # imprime: {'sol': 2, 'mar': 1}`),
      md(
        `## Sets (conjuntos): ¿ya lo vi?
A veces no necesitas un valor asociado, solo saber **si algo ya apareció**. Para eso está el **set**: guarda elementos **sin repetir** y responde "¿está o no?" en **O(1)** en promedio. Es como un diccionario que solo tiene claves.
- \`set()\` crea un set vacío. **Ojo:** \`{}\` crea un *diccionario* vacío, no un set.
- \`vistos.add(x)\` agrega \`x\`. Si ya estaba, no pasa nada (no se repite).
- \`x in vistos\` pregunta si está: O(1).
- \`set(lista)\` convierte una lista en set y quita los repetidos.`,
        `## Sets: have I seen it?
Sometimes you do not need an associated value, just to know **whether something already appeared**. That is what a **set** is for: it stores elements **without repeats** and answers "is it there or not?" in **O(1)** on average. It is like a dictionary that only has keys.
- \`set()\` creates an empty set. **Careful:** \`{}\` creates an empty *dictionary*, not a set.
- \`vistos.add(x)\` adds \`x\`. If it was already there, nothing happens (no repeats).
- \`x in vistos\` asks whether it is there: O(1).
- \`set(list)\` turns a list into a set and removes the repeats.`,
      ),
      code(`nums = [3, 1, 4, 1, 5]
vistos = set()                    # set vacío
for x in nums:
    if x in vistos:               # O(1): ¿ya apareció antes?
        print("repetido:", x)     # imprime: repetido: 1
    vistos.add(x)
print(len(vistos))                # imprime: 4      (3, 1, 4 y 5, sin repetir)`),
      md(
        `## El truco: cambiar memoria por tiempo
**El problema (Two Sum):** dada una lista y un número objetivo, encuentra dos números que sumen el objetivo.

**La forma lenta:** para cada número, revisar todos los demás con un segundo ciclo → **O(n²)**.

**La idea:** recorre la lista **una sola vez** y guarda en un diccionario los números que **ya viste**. Para cada número \`x\`, el que te falta es \`objetivo - x\`: pregúntale al diccionario si ya lo viste (O(1)). Gastas memoria extra (O(n)) a cambio de bajar el tiempo a **O(n)**. Este intercambio es el patrón más común de las entrevistas.

\`enumerate(nums)\` recorre la lista dándote **la posición y el valor** a la vez: \`for i, x in enumerate(nums)\`.`,
        `## The trick: trading memory for time
**The problem (Two Sum):** given a list and a target number, find two numbers that add up to the target.

**The slow way:** for each number, check all the others with a second loop → **O(n²)**.

**The idea:** walk the list **only once** and store in a dictionary the numbers you **have already seen**. For each number \`x\`, the one you need is \`target - x\`: ask the dictionary whether you have seen it (O(1)). You spend extra memory (O(n)) in exchange for bringing time down to **O(n)**. This trade is the most common interview pattern.

\`enumerate(nums)\` walks the list giving you **the position and the value** at once: \`for i, x in enumerate(nums)\`.`,
      ),
      code(`def two_sum(nums, objetivo):
    vistos = {}                        # valor → posición donde lo vi
    for i, x in enumerate(nums):       # i = posición, x = valor
        falta = objetivo - x
        if falta in vistos:            # ¿ya vi el número que me falta?
            return [vistos[falta], i]
        vistos[x] = i                  # si no, recuerdo este para después
    return []

print(two_sum([2, 7, 11, 15], 9))      # imprime: [0, 1]   (2 + 7 = 9)`),
      md(
        `## Agrupar: la clave decide quién va junto
Un diccionario también sirve para **agrupar**: todo lo que tenga la misma clave va a la misma lista. \`d.setdefault(clave, [])\` devuelve la lista de esa clave, y si la clave no existe primero la crea vacía.

Un caso clásico son los **anagramas**: palabras con las mismas letras en otro orden, como "eat" y "tea". Si ordenas sus letras, quedan iguales ("aet"), así que las letras ordenadas son una buena clave para agruparlas. \`sorted(palabra)\` da la lista de letras ordenadas y \`"".join(...)\` las vuelve a unir en un texto.`,
        `## Grouping: the key decides what goes together
A dictionary is also used to **group**: everything with the same key goes into the same list. \`d.setdefault(key, [])\` returns that key's list, and if the key does not exist it first creates it empty.

A classic case is **anagrams**: words with the same letters in a different order, like "eat" and "tea". If you sort their letters they become equal ("aet"), so the sorted letters make a good key to group them. \`sorted(word)\` gives the list of sorted letters and \`"".join(...)\` joins them back into a text.`,
      ),
      code(`grupos = {}
for nombre in ["ana", "beto", "alma", "bruno"]:
    clave = nombre[0]                          # agrupa por la primera letra
    grupos.setdefault(clave, []).append(nombre)
print(grupos)                   # imprime: {'a': ['ana', 'alma'], 'b': ['beto', 'bruno']}

print(sorted("tea"))            # imprime: ['a', 'e', 't']
print("".join(sorted("tea")))   # imprime: aet`),
      md(
        `## Por dentro: cómo logra O(1) un hash map
- Por dentro hay una lista de casilleros llamados **cubetas**. Una **función hash** convierte la clave en un número, y de ese número sale el índice de la cubeta. Calcular el hash y leer esa posición es O(1): por eso va directo, como el ticket del guardarropa.
- Una **colisión** es cuando dos claves distintas caen en la misma cubeta. Se resuelve de dos formas:
  - **Encadenamiento (chaining):** cada cubeta guarda una lista con todas las claves que caen ahí.
  - **Direccionamiento abierto (open addressing):** si la cubeta está ocupada, se busca otra libre siguiendo una regla. Los diccionarios de Python (CPython) usan esta.
- Con una buena función hash, y agrandando la tabla cuando se llena, las colisiones son pocas y todo sigue siendo O(1) en promedio. Pero en el **peor caso**, si todas las claves cayeran en la misma cubeta, buscar sería **O(n)**.
- **Las claves deben ser *hashables*:** su hash no puede cambiar, porque si cambiara ya no la encontrarías en su cubeta. Por eso en Python una **lista no puede ser clave** (se puede modificar). Una **tupla sí**, siempre que sus elementos también sean hashables.`,
        `## Under the hood: how a hash map achieves O(1)
- Inside there is a list of slots called **buckets**. A **hash function** turns the key into a number, and that number gives the bucket index. Computing the hash and reading that position is O(1): that is why it goes straight there, like the coat-check ticket.
- A **collision** is when two different keys land in the same bucket. It is resolved in two ways:
  - **Chaining:** each bucket stores a list of all the keys that land there.
  - **Open addressing:** if the bucket is taken, look for another free one following a rule. Python dictionaries (CPython) use this.
- With a good hash function, and growing the table when it fills up, collisions are rare and everything stays O(1) on average. But in the **worst case**, if every key landed in the same bucket, a lookup would be **O(n)**.
- **Keys must be *hashable*:** their hash cannot change, because if it did you would no longer find the key in its bucket. That is why in Python a **list cannot be a key** (it can be modified). A **tuple can**, as long as its elements are hashable too.`,
      ),
      tip('Cuando escuches "¿existe…?", "¿cuántas veces…?", "¿ya apareció…?" o "encuentra el par…", piensa primero en un **set** o un **diccionario**.',
        'When you hear "does it exist…?", "how many times…?", "has it appeared…?" or "find the pair…", think of a **set** or a **dictionary** first.'),
      interview('Pregunta típica: "¿Cuál es el peor caso de un hash map?". Respuesta: O(n) si todas las claves colisionan, aunque en la práctica es O(1) en promedio.', 'Typical question: "What is the worst case of a hash map?". Answer: O(n) if every key collides, though in practice it is O(1) on average.'),
      md(
        `## Resumen
| Necesitas… | Usa | Costo |
|---|---|---|
| Leer por posición | lista: \`lista[i]\` | O(1) |
| Agregar al final | \`lista.append(x)\` | O(1) amortizado |
| Insertar al inicio o en medio | \`lista.insert(i, x)\` | O(n) |
| Buscar un valor en una lista | \`x in lista\` | O(n) |
| Buscar por clave | diccionario: \`d[clave]\`, \`d.get(clave, 0)\` | O(1) promedio |
| Contar apariciones | \`conteo[x] = conteo.get(x, 0) + 1\` | O(n) en total |
| Saber si algo ya apareció | set: \`x in vistos\`, \`vistos.add(x)\` | O(1) promedio |
| Encontrar un par (Two Sum) | diccionario de lo ya visto | O(n) tiempo, O(n) espacio |
| Agrupar | \`d.setdefault(clave, []).append(x)\` | O(n) en total |`,
        `## Summary
| You need to… | Use | Cost |
|---|---|---|
| Read by position | list: \`list[i]\` | O(1) |
| Add at the end | \`list.append(x)\` | O(1) amortized |
| Insert at the start or middle | \`list.insert(i, x)\` | O(n) |
| Find a value in a list | \`x in list\` | O(n) |
| Look up by key | dictionary: \`d[key]\`, \`d.get(key, 0)\` | O(1) average |
| Count occurrences | \`count[x] = count.get(x, 0) + 1\` | O(n) total |
| Know whether something appeared | set: \`x in seen\`, \`seen.add(x)\` | O(1) average |
| Find a pair (Two Sum) | dictionary of what you have seen | O(n) time, O(n) space |
| Group | \`d.setdefault(key, []).append(x)\` | O(n) total |`,
      ),
    ],
    quiz: [
      q('¿Qué complejidad tiene buscar una clave en un hash map (promedio)?', 'What is the average complexity of looking up a key in a hash map?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n)', 'O(n)'], ['O(n²)', 'O(n²)']], 0,
        'La función hash lleva directo a la cubeta.', 'The hash function goes straight to the bucket.'),
      q('¿Por qué insertar al inicio de un array es O(n)?', 'Why is inserting at the start of an array O(n)?', [['Hay que recorrerlo para encontrar el inicio', 'You must traverse it to find the start'], ['Hay que desplazar todos los elementos', 'All elements must shift'], ['Hay que ordenar el array', 'The array must be sorted'], ['No es O(n), es O(1)', 'It is not O(n), it is O(1)']], 1,
        'La memoria es contigua: cada elemento se mueve una posición.', 'Memory is contiguous: every element moves one position.'),
      q('Para saber si un arreglo tiene duplicados en O(n), usas…', 'To check whether an array has duplicates in O(n), you use…', [['Dos ciclos anidados', 'Two nested loops'], ['Un set', 'A set'], ['Búsqueda binaria', 'Binary search'], ['Una pila', 'A stack']], 1,
        'Agregas al set y verificas si ya estaba.', 'Add to the set and check whether it was already there.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Por qué leer `lista[500]` es O(1)?', 'Why is reading `list[500]` O(1)?', [['Porque la lista está ordenada', 'Because the list is sorted'], ['Porque los elementos están juntos en memoria y se va directo a la posición', 'Because the elements are together in memory and it goes straight to the position'], ['Porque Python guarda una copia de cada elemento', 'Because Python keeps a copy of each element'], ['No es O(1), es O(n)', 'It is not O(1), it is O(n)']], 1,
        'Como un casillero numerado: vas directo al 500 sin abrir los anteriores.', 'Like a numbered locker: you go straight to 500 without opening the ones before.'),
      q('`d = {"a": 1}` y luego `d["a"] = 5`. ¿Qué queda en `d`?', '`d = {"a": 1}` and then `d["a"] = 5`. What is left in `d`?', [['`{"a": 1, "a": 5}`', '`{"a": 1, "a": 5}`'], ['Da error porque "a" ya existe', 'It fails because "a" already exists'], ['`{"a": 5}`', '`{"a": 5}`'], ['`{"a": 6}`', '`{"a": 6}`']], 2,
        'Una clave aparece una sola vez: asignar a una clave que ya existe reemplaza su valor.', 'A key appears only once: assigning to an existing key replaces its value.'),
      q('¿Qué devuelve `conteo.get("x", 0)` si "x" no está en el diccionario?', 'What does `conteo.get("x", 0)` return if "x" is not in the dictionary?', [['0', '0'], ['Da error', 'It fails'], ['None', 'None'], ['"x"', '"x"']], 0,
        'El segundo argumento es el valor por defecto. Por eso `conteo.get(x, 0) + 1` funciona aunque sea la primera vez.', 'The second argument is the default. That is why `conteo.get(x, 0) + 1` works even the first time.'),
      q('En Python, ¿qué crea `{}`?', 'In Python, what does `{}` create?', [['Un set vacío', 'An empty set'], ['Una lista vacía', 'An empty list'], ['Un diccionario vacío', 'An empty dictionary'], ['Una tupla vacía', 'An empty tuple']], 2,
        'Para un set vacío se escribe `set()`.', 'For an empty set you write `set()`.'),
      q('Tienes `vistos = {3, 1}` (un set) y haces `vistos.add(3)`. ¿Qué pasa?', 'You have `vistos = {3, 1}` (a set) and call `vistos.add(3)`. What happens?', [['Ahora tiene dos 3', 'Now it has two 3s'], ['No cambia: un set no guarda repetidos', 'Nothing changes: a set does not keep repeats'], ['Da error', 'It fails'], ['Reemplaza el 1 por el 3', 'It replaces the 1 with the 3']], 1,
        'Un set solo responde si algo está o no; agregar algo que ya está no hace nada.', 'A set only answers whether something is there; adding something already there does nothing.'),
      q('En Two Sum en O(n), ¿qué guarda el diccionario?', 'In O(n) Two Sum, what does the dictionary store?', [['Todas las sumas posibles', 'All possible sums'], ['Los números ya vistos y su posición', 'The numbers already seen and their position'], ['La lista ordenada', 'The sorted list'], ['Solo el objetivo', 'Only the target']], 1,
        'Para cada `x` preguntas si `objetivo - x` ya está en el diccionario (O(1)); si no, guardas `x` con su posición.', 'For each `x` you ask whether `target - x` is already in the dictionary (O(1)); if not, you store `x` with its position.'),
      q('¿Cuánto tiempo y espacio usa Two Sum con un diccionario?', 'How much time and space does Two Sum with a dictionary use?', [['O(n²) tiempo y O(1) espacio', 'O(n²) time and O(1) space'], ['O(n) tiempo y O(1) espacio', 'O(n) time and O(1) space'], ['O(log n) tiempo y O(n) espacio', 'O(log n) time and O(n) space'], ['O(n) tiempo y O(n) espacio', 'O(n) time and O(n) space']], 3,
        'Es el intercambio de memoria por tiempo: una pasada (O(n)) a cambio de un diccionario que puede llegar a n elementos.', 'It is the memory-for-time trade: one pass (O(n)) in exchange for a dictionary that can hold up to n elements.'),
      q('¿Qué te da `for i, x in enumerate(nums)` en cada vuelta?', 'What does `for i, x in enumerate(nums)` give you on each iteration?', [['La posición `i` y el valor `x`', 'The position `i` and the value `x`'], ['Dos valores seguidos de la lista', 'Two consecutive values of the list'], ['El valor y su conteo', 'The value and its count'], ['La lista ordenada', 'The sorted list']], 0,
        '`enumerate` numera los elementos mientras los recorres.', '`enumerate` numbers the elements as you walk them.'),
      q('Para agrupar anagramas ("eat", "tea", "ate"), ¿qué clave sirve?', 'To group anagrams ("eat", "tea", "ate"), which key works?', [['La primera letra', 'The first letter'], ['La longitud de la palabra', 'The word length'], ['Las letras ordenadas: `"".join(sorted(w))`', 'The sorted letters: `"".join(sorted(w))`'], ['La palabra tal cual', 'The word as is']], 2,
        'Los anagramas tienen las mismas letras: ordenadas quedan iguales ("aet"). La longitud o la primera letra juntarían palabras que no son anagramas.', 'Anagrams have the same letters: sorted they become equal ("aet"). Length or first letter would group words that are not anagrams.'),
      q('¿Qué es una **colisión** en un hash map?', 'What is a **collision** in a hash map?', [['Que dos claves distintas caigan en la misma cubeta', 'Two different keys landing in the same bucket'], ['Que se guarde dos veces la misma clave', 'The same key being stored twice'], ['Que el diccionario se quede sin memoria', 'The dictionary running out of memory'], ['Que una clave no exista', 'A key not existing']], 0,
        'Se resuelve con encadenamiento (una lista por cubeta) o direccionamiento abierto (buscar otra cubeta libre).', 'It is resolved with chaining (a list per bucket) or open addressing (looking for another free bucket).'),
      q('¿Cuál es el **peor caso** de buscar en un hash map?', 'What is the **worst case** of a hash map lookup?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n), si todas las claves caen en la misma cubeta', 'O(n), if every key lands in the same bucket'], ['O(n²)', 'O(n²)']], 2,
        'Con una buena función hash es muy raro; en la práctica es O(1) en promedio.', 'With a good hash function it is very rare; in practice it is O(1) on average.'),
      q('¿Por qué una lista no puede ser clave de un diccionario en Python?', 'Why can a list not be a dictionary key in Python?', [['Porque ocupa mucha memoria', 'Because it uses a lot of memory'], ['Porque se puede modificar, y su hash cambiaría', 'Because it can be modified, and its hash would change'], ['Porque las claves deben ser números', 'Because keys must be numbers'], ['Sí puede ser clave', 'It can be a key']], 1,
        'Si el hash de una clave cambiara, ya no la encontrarías en su cubeta. Una tupla (que no se modifica) sí puede ser clave.', 'If a key\'s hash changed, you would no longer find it in its bucket. A tuple (which cannot be modified) can be a key.'),
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
    summary: l('Dos técnicas para recorrer listas y textos en O(n) en vez de O(n²): punteros que se acercan desde los extremos y una ventana que avanza.', 'Two techniques to walk lists and texts in O(n) instead of O(n²): pointers closing in from both ends and a window that slides forward.'),
    minutes: 22,
    blocks: [
      md(
        `## El problema: comparar pares sin dos ciclos anidados
Muchos problemas piden comparar elementos entre sí: "¿este texto se lee igual al revés?", "¿qué dos números suman 13?". La forma obvia es un ciclo dentro de otro, que cuesta **O(n²)**.

Las dos técnicas de esta lección usan **dos índices** (llamados *punteros*) que se mueven por la lista siguiendo una regla. Como cada uno solo avanza en una dirección y nunca regresa, entre los dos dan como mucho n pasos: **O(n)**.

## Dos punteros desde los extremos
Un puntero \`i\` empieza al **inicio** y otro \`j\` al **final**. En cada paso comparas lo que señalan y acercas uno (o los dos) hacia el centro. Terminas cuando se cruzan.

**Analogía:** dos personas leen una palabra, una desde la primera letra y otra desde la última, y van caminando hacia el centro comparando letra por letra. Así se revisa un **palíndromo** (una palabra que se lee igual al revés, como "radar").`,
        `## The problem: comparing pairs without two nested loops
Many problems ask you to compare elements with each other: "does this text read the same backwards?", "which two numbers add up to 13?". The obvious way is a loop inside another, which costs **O(n²)**.

The two techniques in this lesson use **two indices** (called *pointers*) that move through the list following a rule. Since each one only moves in one direction and never goes back, together they take at most n steps: **O(n)**.

## Two pointers from both ends
One pointer \`i\` starts at the **beginning** and another \`j\` at the **end**. At each step you compare what they point to and move one (or both) toward the center. You stop when they cross.

**Analogy:** two people read a word, one from the first letter and the other from the last, walking toward the center and comparing letter by letter. That is how you check a **palindrome** (a word that reads the same backwards, like "radar").`,
      ),
      code(`def es_palindromo(s):
    i, j = 0, len(s) - 1          # i en la primera letra, j en la última
    while i < j:                  # hasta que se crucen
        if s[i] != s[j]:
            return False          # una pareja no coincide: no es palíndromo
        i += 1                    # i avanza hacia el centro
        j -= 1                    # j retrocede hacia el centro
    return True

print(es_palindromo("radar"), es_palindromo("casa"))   # imprime: True False`),
      md(
        `### Pares en una lista **ordenada**
**Problema:** en una lista ordenada, encuentra dos números que sumen un objetivo.

El orden te dice qué puntero mover:
- Si la suma es **menor** que el objetivo, necesitas un número más grande: avanza \`i\` (a la derecha están los mayores).
- Si la suma es **mayor**, necesitas uno más chico: retrocede \`j\`.
- Si es igual, encontraste el par.

Sin el orden no sabrías cuál mover. Por eso esta técnica casi siempre necesita datos **ordenados** (o simétricos, como un palíndromo).`,
        `### Pairs in a **sorted** list
**Problem:** in a sorted list, find two numbers that add up to a target.

The order tells you which pointer to move:
- If the sum is **less** than the target, you need a bigger number: move \`i\` forward (the larger ones are to the right).
- If the sum is **greater**, you need a smaller one: move \`j\` back.
- If it is equal, you found the pair.

Without the order you would not know which one to move. That is why this technique almost always needs **sorted** data (or symmetric, like a palindrome).`,
      ),
      code(`nums = [2, 4, 7, 11, 15]           # ordenada
objetivo = 18
i, j = 0, len(nums) - 1
while i < j:
    suma = nums[i] + nums[j]
    if suma == objetivo:
        break                       # encontrado
    elif suma < objetivo:
        i += 1                      # falta: busca un número más grande
    else:
        j -= 1                      # sobra: busca un número más chico
print(nums[i], nums[j])             # imprime: 7 11
# Recorrido: 2+15=17 (falta) → 4+15=19 (sobra) → 4+11=15 (falta) → 7+11=18 ✓`),
      md(
        `### Otra aplicación: el contenedor con más agua
Cada número es la altura de una línea vertical. Entre dos líneas cabe agua con área = **altura de la más baja × distancia entre ellas**. ¿Qué par guarda más agua?

Empiezas con un puntero en cada extremo (la distancia más grande posible) y en cada paso **mueves el puntero de la línea más baja**. ¿Por qué? Porque el agua la limita la línea baja: si movieras la alta, la distancia baja y la altura no puede mejorar. Moviendo la baja, al menos existe la posibilidad de encontrar una más alta. Una sola pasada: **O(n)**.

### Puntero rápido y lento
Otra variante: los dos empiezan al inicio, uno avanza **de 1 en 1** y el otro **de 2 en 2**. Cuando el rápido llega al final, el lento va **a la mitad**. Lo usarás en la lección de listas enlazadas para encontrar el medio o detectar ciclos.`,
        `### Another application: the container with most water
Each number is the height of a vertical line. Between two lines the water area = **height of the shorter one × distance between them**. Which pair holds the most water?

You start with a pointer at each end (the largest possible distance) and at each step **move the pointer of the shorter line**. Why? Because the shorter line limits the water: if you moved the taller one, the distance shrinks and the height cannot improve. Moving the shorter one at least gives a chance of finding a taller line. One pass: **O(n)**.

### Fast and slow pointers
Another variant: both start at the beginning, one moves **1 step at a time** and the other **2 at a time**. When the fast one reaches the end, the slow one is **in the middle**. You will use it in the linked lists lesson to find the middle or detect cycles.`,
      ),
      md(
        `## Ventana deslizante
**El problema:** preguntas sobre **subarreglos o subcadenas contiguas**, es decir, elementos **seguidos** (sin saltarse ninguno): "la suma más grande de 3 números seguidos", "la subcadena más larga sin letras repetidas". Probar todos los tramos posibles cuesta O(n²) o más.

**La idea:** mantienes una **ventana** \`[izq, der]\` sobre la lista. Cuando la mueves, en vez de recalcular todo, solo **sumas lo que entra y restas lo que sale**.

**Analogía:** una lupa que se desliza sobre un texto: al moverla un lugar, aparece una letra nueva por la derecha y desaparece una por la izquierda; las del medio siguen igual.

### Ventana de tamaño fijo
Si el tamaño k es fijo, la ventana avanza de uno en uno: entra \`a[i]\` y sale \`a[i - k]\`.`,
        `## Sliding window
**The problem:** questions about **contiguous subarrays or substrings**, that is, elements **in a row** (without skipping any): "the largest sum of 3 numbers in a row", "the longest substring without repeated letters". Trying every possible range costs O(n²) or more.

**The idea:** you keep a **window** \`[left, right]\` over the list. When you move it, instead of recomputing everything, you only **add what enters and subtract what leaves**.

**Analogy:** a magnifying glass sliding over a text: when you move it one place, a new letter appears on the right and one disappears on the left; the ones in the middle stay the same.

### Fixed-size window
If the size k is fixed, the window moves one step at a time: \`a[i]\` enters and \`a[i - k]\` leaves.`,
      ),
      code(`a = [4, 2, 1, 7, 8, 1, 2]
k = 3
ventana = sum(a[:k])              # a[:k] son los primeros k elementos: 4 + 2 + 1 = 7
mejor = ventana
for i in range(k, len(a)):
    ventana += a[i] - a[i - k]    # entra a[i] por la derecha, sale a[i - k] por la izquierda
    mejor = max(mejor, ventana)
print(mejor)                      # imprime: 16     (los tramos suman 7, 10, 16, 16, 11)`),
      md(
        `### Ventana de tamaño variable
Cuando el tamaño no es fijo, la ventana **crece y se encoge**. La plantilla siempre tiene 3 pasos:
1. **Expande** \`der\`: agrega el elemento nuevo a la ventana.
2. **Mientras la ventana no sea válida**, sácale el elemento \`s[izq]\` y avanza \`izq\`.
3. **Actualiza la mejor respuesta** con el tamaño actual, \`der - izq + 1\`.

Ejemplo: **la subcadena más larga sin letras repetidas**. La ventana es válida mientras no tenga letras repetidas; cuando entra una repetida, la encoges por la izquierda hasta que deje de estarlo. Un diccionario lleva cuántas veces está cada letra dentro de la ventana.`,
        `### Variable-size window
When the size is not fixed, the window **grows and shrinks**. The template always has 3 steps:
1. **Expand** \`right\`: add the new element to the window.
2. **While the window is invalid**, remove the element \`s[left]\` and advance \`left\`.
3. **Update the best answer** with the current size, \`right - left + 1\`.

Example: **the longest substring without repeated letters**. The window is valid while it has no repeated letters; when a repeated one enters, you shrink it from the left until it no longer is. A dictionary tracks how many times each letter is inside the window.`,
      ),
      viz('sliding-window'),
      code(`def mas_larga_sin_repetir(s):
    izq = 0
    conteo = {}                    # letra → cuántas veces está en la ventana
    mejor = 0
    for der, x in enumerate(s):
        conteo[x] = conteo.get(x, 0) + 1       # 1) entra x por la derecha
        while conteo[x] > 1:                   # 2) ¿quedó repetida? encoge por la izquierda
            conteo[s[izq]] -= 1
            izq += 1
        mejor = max(mejor, der - izq + 1)      # 3) mide la ventana
    return mejor

print(mas_larga_sin_repetir("abcabcbb"))       # imprime: 3     ("abc")`),
      md(
        `**¿Por qué es O(n) si tiene un \`while\` dentro del \`for\`?** Porque \`izq\` **solo avanza**, nunca retrocede. Cada letra entra a la ventana una vez (cuando \`der\` llega a ella) y sale como mucho una vez (cuando \`izq\` la pasa). En total son a lo más 2n movimientos.

### Variantes que te van a preguntar
- **El tramo más corto que cumple algo** (por ejemplo, suma ≥ 7): la lógica se invierte. **Mientras la ventana sí cumple**, anotas su tamaño y la encoges para ver si una más corta también cumple.
- **"A lo más k distintos"** (por ejemplo, la subcadena más larga con a lo más 2 letras distintas): llevas un diccionario con el conteo de cada letra en la ventana. Cuando el diccionario tiene **más de k claves**, encoges por la izquierda: bajas el conteo de la letra que sale y, si llega a 0, la borras con \`del conteo[letra]\`.`,
        `**Why is it O(n) if it has a \`while\` inside the \`for\`?** Because \`left\` **only moves forward**, never back. Each letter enters the window once (when \`right\` reaches it) and leaves at most once (when \`left\` passes it). In total that is at most 2n moves.

### Variants you will be asked about
- **The shortest range that meets a condition** (for example, sum ≥ 7): the logic flips. **While the window does meet it**, record its size and shrink it to see whether a shorter one also meets it.
- **"At most k distinct"** (for example, the longest substring with at most 2 distinct letters): keep a dictionary with each letter's count in the window. When the dictionary has **more than k keys**, shrink from the left: lower the count of the letter leaving and, if it reaches 0, delete it with \`del conteo[letter]\`.`,
      ),
      interview('Palabras clave: "subarreglo contiguo", "subcadena más larga/corta", "a lo más k" → ventana deslizante. Si la lista está **ordenada** y buscas pares → dos punteros.', 'Keywords: "contiguous subarray", "longest/shortest substring", "at most k" → sliding window. If the list is **sorted** and you need pairs → two pointers.'),
      md(
        `## Resumen
| Técnica | Cómo se mueve | Cuándo usarla |
|---|---|---|
| Dos punteros desde los extremos | \`i\` desde el inicio, \`j\` desde el final, hacia el centro | Palíndromos, pares en lista **ordenada**, contenedor con más agua |
| Rápido y lento | Uno de 1 en 1, otro de 2 en 2 | Encontrar el medio, detectar ciclos (listas enlazadas) |
| Ventana fija | Entra \`a[i]\`, sale \`a[i - k]\` | "La mejor suma de k elementos seguidos" |
| Ventana variable | Expande \`der\`; encoge \`izq\` mientras no sea válida | "La subcadena más larga/corta que…", "a lo más k distintos" |

Todas son **O(n)**: cada puntero solo avanza, así que cada elemento se visita un número fijo de veces.`,
        `## Summary
| Technique | How it moves | When to use it |
|---|---|---|
| Two pointers from both ends | \`i\` from the start, \`j\` from the end, toward the center | Palindromes, pairs in a **sorted** list, container with most water |
| Fast and slow | One 1 step at a time, the other 2 at a time | Finding the middle, detecting cycles (linked lists) |
| Fixed window | \`a[i]\` enters, \`a[i - k]\` leaves | "The best sum of k elements in a row" |
| Variable window | Expand \`right\`; shrink \`left\` while invalid | "The longest/shortest substring that…", "at most k distinct" |

They are all **O(n)**: each pointer only moves forward, so each element is visited a fixed number of times.`,
      ),
    ],
    quiz: [
      q('¿Qué condición suele necesitar "dos punteros desde los extremos"?', 'What condition does "two pointers from both ends" usually need?', [['Arreglo ordenado', 'Sorted array'], ['Arreglo con duplicados', 'Array with duplicates'], ['Lista enlazada', 'Linked list'], ['Árbol balanceado', 'Balanced tree']], 0,
        'El orden permite decidir qué puntero mover.', 'The ordering lets you decide which pointer to move.'),
      q('¿Por qué la ventana deslizante es O(n) aunque tenga un while dentro del for?', 'Why is sliding window O(n) even with a while inside the for?', [['Porque el while nunca se ejecuta', 'Because the while never runs'], ['Porque cada elemento entra y sale una sola vez', 'Because each element enters and leaves once'], ['Porque usa un hash map', 'Because it uses a hash map'], ['No es O(n), es O(n²)', 'It is not O(n), it is O(n²)']], 1,
        'izq solo avanza; en total se mueve como mucho n veces.', 'left only advances; in total it moves at most n times.'),
      q('¿Qué técnica usas para encontrar el medio de una lista enlazada en una pasada?', 'What technique finds the middle of a linked list in one pass?', [['Ventana deslizante', 'Sliding window'], ['Puntero rápido y lento', 'Fast and slow pointers'], ['Búsqueda binaria', 'Binary search'], ['Hash map', 'Hash map']], 1,
        'Cuando el rápido llega al final, el lento está en el medio.', 'When fast reaches the end, slow is in the middle.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('Para revisar si un texto es palíndromo con dos punteros, ¿dónde empiezan `i` y `j`?', 'To check whether a text is a palindrome with two pointers, where do `i` and `j` start?', [['Los dos al inicio', 'Both at the start'], ['`i` en la primera letra y `j` en la última', '`i` at the first letter and `j` at the last'], ['Los dos en el centro', 'Both in the middle'], ['`i` en la mitad y `j` al final', '`i` in the middle and `j` at the end']], 1,
        'Comparan pareja por pareja y se acercan al centro hasta cruzarse.', 'They compare pair by pair and move toward the center until they cross.'),
      q('Lista ordenada, buscas dos números que sumen 18 y `nums[i] + nums[j]` da 15. ¿Qué haces?', 'Sorted list, you look for two numbers adding up to 18 and `nums[i] + nums[j]` gives 15. What do you do?', [['Retroceder `j`', 'Move `j` back'], ['Avanzar `i`, para tomar un número más grande', 'Move `i` forward, to take a bigger number'], ['Reiniciar los dos punteros', 'Reset both pointers'], ['Terminar: no hay solución', 'Stop: there is no solution']], 1,
        'Falta suma: a la derecha de `i` están los números mayores. Si sobrara, retrocederías `j`.', 'The sum is short: the larger numbers are to the right of `i`. If it were too large, you would move `j` back.'),
      q('En "el contenedor con más agua", ¿qué puntero mueves en cada paso?', 'In "container with most water", which pointer do you move at each step?', [['El de la línea más alta', 'The one at the taller line'], ['Siempre `i`', 'Always `i`'], ['El de la línea más baja', 'The one at the shorter line'], ['Los dos a la vez', 'Both at once']], 2,
        'La línea baja limita el agua. Mover la alta solo reduce la distancia sin poder mejorar la altura.', 'The shorter line limits the water. Moving the taller one only reduces the distance without being able to improve the height.'),
      q('¿Qué significa que un subarreglo sea **contiguo**?', 'What does it mean for a subarray to be **contiguous**?', [['Que sus elementos están ordenados', 'That its elements are sorted'], ['Que sus elementos van seguidos, sin saltarse ninguno', 'That its elements are in a row, without skipping any'], ['Que no tiene repetidos', 'That it has no repeats'], ['Que empieza en la posición 0', 'That it starts at position 0']], 1,
        'Por ejemplo, en [4, 2, 1, 7], [2, 1, 7] es contiguo y [4, 1] no.', 'For example, in [4, 2, 1, 7], [2, 1, 7] is contiguous and [4, 1] is not.'),
      q('En una ventana de tamaño fijo k, al avanzar un lugar, ¿cómo actualizas la suma?', 'In a fixed-size window k, when you move one place, how do you update the sum?', [['Vuelves a sumar los k elementos', 'You add up the k elements again'], ['Sumas el que entra `a[i]` y restas el que sale `a[i - k]`', 'You add the one entering `a[i]` and subtract the one leaving `a[i - k]`'], ['Solo sumas `a[i]`', 'You only add `a[i]`'], ['Restas `a[i]`', 'You subtract `a[i]`']], 1,
        'Así cada paso es O(1) en vez de O(k).', 'That way each step is O(1) instead of O(k).'),
      q('¿Qué devuelve `a[:3]` si `a = [4, 2, 1, 7]`?', 'What does `a[:3]` return if `a = [4, 2, 1, 7]`?', [['`[4, 2, 1]`', '`[4, 2, 1]`'], ['`[1, 7]`', '`[1, 7]`'], ['`1`', '`1`'], ['`[2, 1, 7]`', '`[2, 1, 7]`']], 0,
        '`a[:k]` son los primeros k elementos (posiciones 0 a k − 1).', '`a[:k]` is the first k elements (positions 0 to k − 1).'),
      q('¿Cuál es el orden de la plantilla de ventana variable?', 'What is the order of the variable window template?', [['Encoger izq → expandir der → medir', 'Shrink left → expand right → measure'], ['Medir → expandir der → encoger izq', 'Measure → expand right → shrink left'], ['Expandir der → encoger izq mientras no sea válida → medir', 'Expand right → shrink left while invalid → measure'], ['Expandir der → medir → reiniciar la ventana', 'Expand right → measure → reset the window']], 2,
        'Primero creces, luego reparas la ventana si se rompió, y al final mides.', 'First grow, then repair the window if it broke, and finally measure.'),
      q('Buscas el tramo **más corto** con suma ≥ 7. ¿Cuándo encoges la ventana?', 'You look for the **shortest** range with sum ≥ 7. When do you shrink the window?', [['Mientras la suma sea menor que 7', 'While the sum is less than 7'], ['Mientras la suma sea ≥ 7: anotas el tamaño y pruebas si una más corta también cumple', 'While the sum is ≥ 7: you record the size and try whether a shorter one also works'], ['Nunca: solo la expandes', 'Never: you only expand it'], ['Solo al final', 'Only at the end']], 1,
        'Para el más corto la lógica se invierte: encoges mientras la ventana sí cumple.', 'For the shortest the logic flips: you shrink while the window does meet the condition.'),
      q('Subcadena más larga con **a lo más 2 letras distintas**. ¿Qué te dice que la ventana dejó de ser válida?', 'Longest substring with **at most 2 distinct letters**. What tells you the window stopped being valid?', [['Que el diccionario de conteos tiene más de 2 claves', 'The counts dictionary has more than 2 keys'], ['Que una letra aparece 2 veces', 'A letter appears twice'], ['Que der llegó al final', 'Right reached the end'], ['Que la ventana mide más de 2', 'The window is longer than 2']], 0,
        'Cada clave es una letra distinta dentro de la ventana; cuando un conteo llega a 0 se borra con `del`.', 'Each key is a distinct letter inside the window; when a count reaches 0 it is deleted with `del`.'),
      q('Escuchas "la subcadena más larga que…". ¿Qué técnica pruebas primero?', 'You hear "the longest substring that…". Which technique do you try first?', [['Búsqueda binaria', 'Binary search'], ['Dos ciclos anidados', 'Two nested loops'], ['Ordenar el texto', 'Sorting the text'], ['Ventana deslizante', 'Sliding window']], 3,
        '"Subarreglo contiguo", "subcadena más larga/corta" y "a lo más k" son señales de ventana deslizante.', '"Contiguous subarray", "longest/shortest substring" and "at most k" are sliding-window signals.'),
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
    summary: l('Nodos unidos por flechas: cómo recorrerlos, insertar, invertir, borrar con un nodo dummy y usar punteros rápido y lento.', 'Nodes joined by arrows: how to walk them, insert, reverse, delete with a dummy node and use fast and slow pointers.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Qué es una lista enlazada?
En una lista de Python los elementos están **juntos en memoria**, por eso insertar al inicio obliga a mover a todos (O(n)). Una **lista enlazada** los guarda **sueltos**: cada elemento, llamado **nodo**, guarda dos cosas:
- su **valor** (\`val\`), y
- una **flecha** (referencia) al **siguiente** nodo (\`sig\`).

El primer nodo se llama **cabeza**. El último no apunta a nadie: su \`sig\` es \`None\`.

**Analogía:** una búsqueda del tesoro. Cada pista te dice dónde está la siguiente. Para llegar a la quinta pista tienes que seguir las cuatro anteriores; no puedes saltar directo. Pero agregar una pista nueva al principio es fácil: solo escribes en ella dónde está la que antes era la primera.`,
        `## What is a linked list?
In a Python list the elements are **together in memory**, which is why inserting at the start forces everyone to move (O(n)). A **linked list** stores them **loose**: each element, called a **node**, stores two things:
- its **value** (\`val\`), and
- an **arrow** (reference) to the **next** node (\`sig\`).

The first node is called the **head**. The last one points to nobody: its \`sig\` is \`None\`.

**Analogy:** a treasure hunt. Each clue tells you where the next one is. To reach the fifth clue you must follow the four before it; you cannot jump straight there. But adding a new clue at the beginning is easy: you just write on it where the old first clue is.`,
      ),
      md(
        `## Cómo se escribe un nodo en Python
Para crear "cosas" con varios datos se usa una **clase**: un molde. \`Nodo(1)\` crea un nodo nuevo con el valor 1. Dentro de la clase, \`__init__\` se ejecuta al crear cada nodo y guarda sus datos con \`self.val = …\` (\`self\` es "este nodo"). La lección de OOP explica las clases a fondo; aquí basta con esto:`,
        `## How a node is written in Python
To create "things" with several pieces of data you use a **class**: a mold. \`Nodo(1)\` creates a new node with value 1. Inside the class, \`__init__\` runs when each node is created and stores its data with \`self.val = …\` (\`self\` is "this node"). The OOP lesson covers classes in depth; this is enough here:`,
      ),
      code(`class Nodo:
    def __init__(self, val, sig=None):
        self.val = val      # el dato que guarda
        self.sig = sig      # la flecha al siguiente nodo (None si es el último)

cabeza = Nodo(1, Nodo(2, Nodo(3)))   # 1 → 2 → 3 → None

actual = cabeza                      # empieza en la cabeza
while actual:                        # mientras no lleguemos a None
    print(actual.val)
    actual = actual.sig              # sigue la flecha al siguiente nodo
# imprime:
# 1
# 2
# 3`),
      md(
        `**Cómo leerlo:**
- \`sig=None\` en \`__init__\` significa que, si no le pasas un siguiente, el nodo apunta a \`None\` (es el último).
- \`Nodo(1, Nodo(2, Nodo(3)))\` se arma de adentro hacia afuera: primero el 3 (último), luego el 2 que apunta al 3, y el 1 que apunta al 2.
- \`while actual:\` se detiene cuando \`actual\` llega a \`None\`.
- \`actual = actual.sig\` es el paso que **avanza**. Si lo olvidas, el ciclo nunca termina.`,
        `**How to read it:**
- \`sig=None\` in \`__init__\` means that if you do not pass a next node, the node points to \`None\` (it is the last one).
- \`Nodo(1, Nodo(2, Nodo(3)))\` is built inside out: first the 3 (last), then the 2 pointing to the 3, and the 1 pointing to the 2.
- \`while actual:\` stops when \`actual\` reaches \`None\`.
- \`actual = actual.sig\` is the step that **advances**. If you forget it, the loop never ends.`,
      ),
      md(
        `## Lista enlazada vs lista de Python
| Operación | Lista de Python | Lista enlazada | Por qué |
|---|---|---|---|
| Leer el elemento k | O(1) | **O(k)** | Hay que seguir k flechas desde la cabeza |
| Insertar al inicio | O(n) | **O(1)** | Solo creas un nodo que apunte a la vieja cabeza |
| Insertar después de un nodo que ya tienes | O(n) | **O(1)** | Solo cambias dos flechas |
| Memoria | Solo los valores | Valor **+ una flecha** por nodo | |

Insertar al inicio es una sola línea: el nodo nuevo apunta a la cabeza actual y pasa a ser la cabeza.`,
        `## Linked list vs Python list
| Operation | Python list | Linked list | Why |
|---|---|---|---|
| Read element k | O(1) | **O(k)** | You must follow k arrows from the head |
| Insert at the start | O(n) | **O(1)** | You just create a node pointing to the old head |
| Insert after a node you already have | O(n) | **O(1)** | You just change two arrows |
| Memory | Just the values | Value **+ one arrow** per node | |

Inserting at the start is a single line: the new node points to the current head and becomes the head.`,
      ),
      code(`cabeza = Nodo(2, Nodo(3))            # 2 → 3
cabeza = Nodo(1, cabeza)             # el nuevo apunta a la vieja cabeza: 1 → 2 → 3
print(cabeza.val, cabeza.sig.val)    # imprime: 1 2`),
      md(
        `## Invertir una lista enlazada
**El problema:** convertir 1 → 2 → 3 en 3 → 2 → 1, sin crear nodos nuevos.

**La idea:** recorres la lista y **volteas cada flecha** para que apunte hacia atrás. Necesitas tres variables:
- \`actual\`: el nodo que estás volteando.
- \`prev\`: el nodo anterior (hacia donde debe apuntar ahora \`actual\`).
- \`sig\`: el que sigue. Hay que **guardarlo antes** de voltear la flecha, porque al voltearla pierdes el camino al resto de la lista.

**Analogía:** una fila de personas tomadas de la mano que tienen que voltearse. Si sueltas la mano antes de saber quién sigue, pierdes al resto de la fila.`,
        `## Reversing a linked list
**The problem:** turn 1 → 2 → 3 into 3 → 2 → 1, without creating new nodes.

**The idea:** walk the list and **flip each arrow** so it points backwards. You need three variables:
- \`actual\`: the node you are flipping.
- \`prev\`: the previous node (where \`actual\` must point now).
- \`sig\`: the next one. You must **save it before** flipping the arrow, because once flipped you lose the path to the rest of the list.

**Analogy:** a line of people holding hands who have to turn around. If you let go before knowing who comes next, you lose the rest of the line.`,
      ),
      code(`def invertir(cabeza):
    prev, actual = None, cabeza
    while actual:
        sig = actual.sig        # 1) guarda quién sigue (si no, lo pierdes)
        actual.sig = prev       # 2) voltea la flecha hacia atrás
        prev = actual           # 3) prev avanza
        actual = sig            # 4) actual avanza
    return prev                 # prev quedó en el que era el último: la nueva cabeza

n = invertir(Nodo(7, Nodo(8, Nodo(9))))   # 7 → 8 → 9  se vuelve  9 → 8 → 7
print(n.val, n.sig.val, n.sig.sig.val)    # imprime: 9 8 7`),
      md(
        `Recorre la lista una vez: **O(n)** de tiempo y **O(1)** de espacio (solo tres variables).

## Borrar nodos y el truco del nodo dummy
Para borrar un nodo hay que hacer que **el anterior** lo salte: \`anterior.sig = anterior.sig.sig\`. Nadie apunta ya al nodo borrado, así que desaparece de la lista.

**El problema:** la cabeza no tiene anterior. Borrarla sería un caso especial con su propio \`if\`.

**La idea:** crea un **nodo dummy** (falso) antes de la cabeza. Así **todo** nodo real tiene un anterior y el código es el mismo para todos. Al final devuelves \`dummy.sig\`, que es la cabeza real (pudo haber cambiado).`,
        `It walks the list once: **O(n)** time and **O(1)** space (just three variables).

## Deleting nodes and the dummy node trick
To delete a node, **the previous one** must skip it: \`previous.sig = previous.sig.sig\`. Nobody points to the deleted node anymore, so it disappears from the list.

**The problem:** the head has no previous node. Deleting it would be a special case with its own \`if\`.

**The idea:** create a **dummy** (fake) node before the head. Then **every** real node has a previous one and the code is the same for all. At the end you return \`dummy.sig\`, which is the real head (it may have changed).`,
      ),
      code(`def eliminar(cabeza, x):
    dummy = Nodo(0, cabeza)        # nodo falso antes de la cabeza
    n = dummy
    while n.sig:
        if n.sig.val == x:
            n.sig = n.sig.sig      # salta el nodo: desaparece de la lista
        else:
            n = n.sig              # solo avanza si no borró
    return dummy.sig               # la cabeza real

r = eliminar(Nodo(4, Nodo(5, Nodo(4, Nodo(6)))), 4)   # 4 → 5 → 4 → 6, sin los 4
print(r.val, r.sig.val, r.sig.sig)                     # imprime: 5 6 None`),
      md(
        `## Punteros rápido y lento
Dos punteros empiezan en la cabeza: el **lento** avanza 1 nodo por vuelta y el **rápido** avanza 2.
- **Encontrar el medio:** con \`while rapido and rapido.sig:\` el rápido llega al final cuando el lento va justo a la mitad. Una sola pasada.
- **Detectar un ciclo** (algoritmo de Floyd, "la tortuga y la liebre"): si la lista tiene un ciclo (un nodo que apunta a uno anterior), el rápido nunca llega a \`None\`; da vueltas y **alcanza al lento**. Si no hay ciclo, el rápido llega a \`None\`. Usa **O(n)** de tiempo y **O(1)** de espacio.

**Analogía:** dos corredores en una pista circular: el más rápido termina alcanzando al lento. En una pista recta, el rápido simplemente llega primero a la meta.

\`a is b\` pregunta si \`a\` y \`b\` son **el mismo nodo** (no solo si tienen el mismo valor).`,
        `## Fast and slow pointers
Two pointers start at the head: the **slow** one moves 1 node per iteration and the **fast** one moves 2.
- **Finding the middle:** with \`while rapido and rapido.sig:\` the fast one reaches the end exactly when the slow one is halfway. One pass.
- **Detecting a cycle** (Floyd's algorithm, "the tortoise and the hare"): if the list has a cycle (a node pointing back to an earlier one), the fast pointer never reaches \`None\`; it goes around and **catches the slow one**. If there is no cycle, the fast one reaches \`None\`. It uses **O(n)** time and **O(1)** space.

**Analogy:** two runners on a circular track: the faster one ends up lapping the slower one. On a straight track, the fast one simply reaches the finish first.

\`a is b\` asks whether \`a\` and \`b\` are **the same node** (not just whether they have the same value).`,
      ),
      code(`def tiene_ciclo(cabeza):
    lento = rapido = cabeza
    while rapido and rapido.sig:
        lento = lento.sig            # 1 paso
        rapido = rapido.sig.sig      # 2 pasos
        if lento is rapido:          # se alcanzaron: hay ciclo
            return True
    return False                     # el rápido llegó al final: no hay ciclo

a, b, c = Nodo(1), Nodo(2), Nodo(3)
a.sig = b
b.sig = c                            # 1 → 2 → 3
print(tiene_ciclo(a))                # imprime: False
c.sig = a                            # el 3 vuelve al 1: ahora hay un ciclo
print(tiene_ciclo(a))                # imprime: True`),
      md(
        `## Combinar dos listas ordenadas
Otra pregunta clásica: unir dos listas enlazadas ya ordenadas en una sola ordenada. Se usa otra vez un **dummy** y un puntero \`cola\` que marca el último nodo de la lista nueva:
1. Mientras las dos listas tengan nodos, enlaza a \`cola\` el **menor** de los dos primeros y avanza esa lista.
2. Avanza \`cola\` al nodo que acabas de enlazar.
3. Cuando una se vacía, enlaza **lo que quede** de la otra (ya está ordenado).
4. Devuelve \`dummy.sig\`.

Es **O(n + m)** y no crea nodos nuevos: solo cambia flechas.`,
        `## Merging two sorted lists
Another classic question: join two already sorted linked lists into one sorted list. Again you use a **dummy** and a pointer \`cola\` (tail) marking the last node of the new list:
1. While both lists have nodes, link to \`cola\` the **smaller** of the two first nodes and advance that list.
2. Move \`cola\` to the node you just linked.
3. When one runs out, link **whatever is left** of the other (it is already sorted).
4. Return \`dummy.sig\`.

It is **O(n + m)** and creates no new nodes: it only changes arrows.`,
      ),
      tip('Dibuja los nodos y las flechas en papel (o en la pizarra) antes de mover punteros. La mayoría de los errores son por perder la referencia al siguiente nodo.', 'Draw the nodes and arrows on paper (or the whiteboard) before moving pointers. Most bugs come from losing the reference to the next node.'),
      md(
        `## Resumen
| Tarea | Cómo | Costo |
|---|---|---|
| Recorrer | \`while actual:\` … \`actual = actual.sig\` | O(n) |
| Insertar al inicio | \`cabeza = Nodo(x, cabeza)\` | O(1) |
| Invertir | \`prev\`, \`actual\`, \`sig\`: guarda, voltea, avanza | O(n) tiempo, O(1) espacio |
| Borrar | El anterior lo salta: \`n.sig = n.sig.sig\`, con un **dummy** antes de la cabeza | O(n) |
| Encontrar el medio | Lento de 1 en 1, rápido de 2 en 2 | O(n) |
| Detectar un ciclo | Floyd: si el rápido alcanza al lento, hay ciclo | O(n) tiempo, O(1) espacio |
| Combinar dos ordenadas | Dummy + enlazar siempre el menor | O(n + m) |`,
        `## Summary
| Task | How | Cost |
|---|---|---|
| Walk | \`while actual:\` … \`actual = actual.sig\` | O(n) |
| Insert at the start | \`head = Nodo(x, head)\` | O(1) |
| Reverse | \`prev\`, \`actual\`, \`sig\`: save, flip, advance | O(n) time, O(1) space |
| Delete | The previous one skips it: \`n.sig = n.sig.sig\`, with a **dummy** before the head | O(n) |
| Find the middle | Slow 1 at a time, fast 2 at a time | O(n) |
| Detect a cycle | Floyd: if fast catches slow, there is a cycle | O(n) time, O(1) space |
| Merge two sorted lists | Dummy + always link the smaller | O(n + m) |`,
      ),
    ],
    quiz: [
      q('¿Para qué sirve un nodo dummy?', 'What is a dummy node for?', [['Ahorrar memoria', 'Save memory'], ['Evitar casos especiales en la cabeza', 'Avoid special cases at the head'], ['Ordenar la lista', 'Sort the list'], ['Detectar ciclos', 'Detect cycles']], 1,
        'Así la cabeza tiene un anterior, como cualquier otro nodo.', 'Then the head has a previous node, like any other node.'),
      q('Acceder al k-ésimo elemento de una lista enlazada cuesta…', 'Accessing the k-th element of a linked list costs…', [['O(1)', 'O(1)'], ['O(k)', 'O(k)'], ['O(log k)', 'O(log k)'], ['O(k²)', 'O(k²)']], 1,
        'Hay que seguir k flechas desde la cabeza.', 'You must follow k arrows from the head.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué guarda cada nodo de una lista enlazada?', 'What does each node of a linked list store?', [['Solo su valor', 'Only its value'], ['Su valor y una flecha al siguiente nodo', 'Its value and an arrow to the next node'], ['Su posición en la lista', 'Its position in the list'], ['Una copia de toda la lista', 'A copy of the whole list']], 1,
        'El valor (`val`) y la referencia al siguiente (`sig`).', 'The value (`val`) and the reference to the next (`sig`).'),
      q('¿A qué apunta el `sig` del último nodo?', 'What does the last node\'s `sig` point to?', [['A la cabeza', 'To the head'], ['A sí mismo', 'To itself'], ['A `None`', 'To `None`'], ['Al penúltimo', 'To the second to last']], 2,
        'Por eso `while actual:` se detiene al llegar al final.', 'That is why `while actual:` stops at the end.'),
      q('¿Cómo insertas `x` al inicio de una lista enlazada y cuánto cuesta?', 'How do you insert `x` at the start of a linked list and what does it cost?', [['`cabeza = Nodo(x, cabeza)`, O(1)', '`cabeza = Nodo(x, cabeza)`, O(1)'], ['Recorriendo hasta el final, O(n)', 'Walking to the end, O(n)'], ['Moviendo todos los nodos, O(n)', 'Moving every node, O(n)'], ['No se puede insertar al inicio', 'You cannot insert at the start']], 0,
        'El nodo nuevo apunta a la vieja cabeza y pasa a ser la cabeza: no se mueve nada más.', 'The new node points to the old head and becomes the head: nothing else moves.'),
      q('En `while actual:` olvidas escribir `actual = actual.sig`. ¿Qué pasa?', 'In `while actual:` you forget to write `actual = actual.sig`. What happens?', [['Recorre la lista dos veces', 'It walks the list twice'], ['Solo revisa la cabeza y termina', 'It only checks the head and ends'], ['El ciclo nunca termina', 'The loop never ends'], ['Da error de inmediato', 'It fails immediately']], 2,
        '`actual` nunca cambia, así que nunca llega a `None`.', '`actual` never changes, so it never reaches `None`.'),
      q('Al invertir una lista, ¿por qué guardas `sig = actual.sig` **antes** de voltear la flecha?', 'When reversing a list, why do you save `sig = actual.sig` **before** flipping the arrow?', [['Porque al voltearla pierdes el camino al resto de la lista', 'Because once flipped you lose the path to the rest of the list'], ['Para ahorrar memoria', 'To save memory'], ['Porque Python lo exige', 'Because Python requires it'], ['No hace falta guardarlo', 'There is no need to save it']], 0,
        'Después de `actual.sig = prev`, la flecha ya no apunta al resto: sin `sig` no podrías avanzar.', 'After `actual.sig = prev`, the arrow no longer points to the rest: without `sig` you could not move on.'),
      q('Al terminar de invertir, ¿qué variable es la nueva cabeza?', 'When the reversal finishes, which variable is the new head?', [['`actual`', '`actual`'], ['`sig`', '`sig`'], ['`cabeza`', '`cabeza`'], ['`prev`', '`prev`']], 3,
        '`actual` terminó en `None`; `prev` quedó en el que era el último nodo.', '`actual` ended at `None`; `prev` stayed on what used to be the last node.'),
      q('Para borrar el nodo que sigue a `n`, ¿qué línea usas?', 'To delete the node after `n`, which line do you use?', [['`n = n.sig.sig`', '`n = n.sig.sig`'], ['`n.sig = n.sig.sig`', '`n.sig = n.sig.sig`'], ['`n.sig = None`', '`n.sig = None`'], ['`n.val = n.sig.val`', '`n.val = n.sig.val`']], 1,
        'El anterior salta al nodo borrado. `n.sig = None` cortaría todo el resto de la lista.', 'The previous node skips the deleted one. `n.sig = None` would cut off the whole rest of the list.'),
      q('Con punteros rápido (2 pasos) y lento (1 paso), cuando el rápido llega al final, ¿dónde está el lento?', 'With fast (2 steps) and slow (1 step) pointers, when the fast one reaches the end, where is the slow one?', [['En la cabeza', 'At the head'], ['En el último nodo', 'At the last node'], ['A la mitad de la lista', 'In the middle of the list'], ['En `None`', 'At `None`']], 2,
        'El lento recorre la mitad de lo que recorre el rápido.', 'The slow one covers half of what the fast one covers.'),
      q('¿Cómo detecta un ciclo el algoritmo de Floyd y cuánta memoria usa?', 'How does Floyd\'s algorithm detect a cycle and how much memory does it use?', [['Guarda todos los nodos en un set: O(n)', 'It stores every node in a set: O(n)'], ['Si el rápido alcanza al lento hay ciclo: O(1)', 'If fast catches slow there is a cycle: O(1)'], ['Cuenta los nodos dos veces: O(n)', 'It counts the nodes twice: O(n)'], ['Invierte la lista: O(1)', 'It reverses the list: O(1)']], 1,
        'Como dos corredores en una pista circular. Si no hay ciclo, el rápido llega a `None`.', 'Like two runners on a circular track. Without a cycle, the fast one reaches `None`.'),
      q('Al combinar dos listas ordenadas, ¿qué nodo enlazas en cada paso?', 'When merging two sorted lists, which node do you link at each step?', [['El primero de la lista más larga', 'The first of the longer list'], ['Siempre el de la primera lista', 'Always the one from the first list'], ['El menor de los dos primeros', 'The smaller of the two first nodes'], ['El mayor de los dos primeros', 'The larger of the two first nodes']], 2,
        'Así la lista nueva queda ordenada; cuando una se vacía, enlazas lo que queda de la otra.', 'That keeps the new list sorted; when one runs out, you link what is left of the other.'),
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
    summary: l('La pila (el último en entrar sale primero) y la cola (el primero en llegar sale primero): cómo usarlas en Python y los problemas clásicos que resuelven.', 'The stack (last in, first out) and the queue (first in, first out): how to use them in Python and the classic problems they solve.'),
    minutes: 20,
    blocks: [
      md(
        `## Pila (stack): el último en entrar es el primero en salir
**Analogía:** una pila de platos. Pones platos encima y, cuando necesitas uno, tomas el de **arriba**: el último que pusiste. A esto se le llama **LIFO** (*Last In, First Out*).

Operaciones, todas **O(1)**:
- **push**: poner un elemento arriba. En Python, \`pila.append(x)\`.
- **pop**: sacar el de arriba. En Python, \`pila.pop()\`.
- **peek**: ver el de arriba sin sacarlo. En Python, \`pila[-1]\` (el índice -1 es el último elemento).

En Python una lista normal sirve como pila, porque agregar y sacar **al final** es O(1).

**Para qué sirve:** el botón "deshacer" (deshace lo último que hiciste), revisar paréntesis, la **pila de llamadas** de las funciones y recorrer grafos en profundidad (DFS).`,
        `## Stack: the last one in is the first one out
**Analogy:** a stack of plates. You put plates on top and, when you need one, you take the one on **top**: the last one you put there. This is called **LIFO** (*Last In, First Out*).

Operations, all **O(1)**:
- **push**: put an element on top. In Python, \`stack.append(x)\`.
- **pop**: take the top one off. In Python, \`stack.pop()\`.
- **peek**: look at the top one without removing it. In Python, \`stack[-1]\` (index -1 is the last element).

In Python a regular list works as a stack, because adding and removing **at the end** is O(1).

**What it is for:** the "undo" button (it undoes the last thing you did), checking parentheses, the functions' **call stack** and walking graphs in depth (DFS).`,
      ),
      code(`pila = []
pila.append("a")      # push
pila.append("b")
pila.append("c")
print(pila[-1])       # imprime: c          (peek: ve el de arriba sin sacarlo)
print(pila.pop())     # imprime: c          (pop: saca el último que entró)
print(pila)           # imprime: ['a', 'b']`),
      md(
        `## Cola (queue): el primero en llegar es el primero en salir
**Analogía:** la fila del banco. El primero que llegó es el primero en ser atendido, y los nuevos se forman al final. A esto se le llama **FIFO** (*First In, First Out*).

Operaciones:
- **encolar**: agregar al final.
- **desencolar**: sacar al **primero**.

**En Python no uses una lista para esto:** \`lista.pop(0)\` saca el primero, pero luego tiene que mover a todos los demás un lugar (como viste en arrays): **O(n)**. Usa \`deque\` de \`collections\`, que agrega y saca por los dos lados en **O(1)**: \`cola.append(x)\` para encolar y \`cola.popleft()\` para desencolar.

**Para qué sirve:** atender peticiones en orden de llegada, colas de tareas y recorrer grafos por niveles (BFS).`,
        `## Queue: the first one to arrive is the first one out
**Analogy:** the line at the bank. Whoever arrived first is served first, and newcomers join at the end. This is called **FIFO** (*First In, First Out*).

Operations:
- **enqueue**: add at the end.
- **dequeue**: take out the **first** one.

**In Python do not use a list for this:** \`list.pop(0)\` removes the first one, but then it must move everyone else one place (as you saw with arrays): **O(n)**. Use \`deque\` from \`collections\`, which adds and removes at both ends in **O(1)**: \`queue.append(x)\` to enqueue and \`queue.popleft()\` to dequeue.

**What it is for:** handling requests in arrival order, task queues and walking graphs level by level (BFS).`,
      ),
      code(`from collections import deque     # deque: cola eficiente por los dos lados

cola = deque()
cola.append("Ana")                 # llega Ana
cola.append("Luis")
cola.append("Eva")
print(cola.popleft())              # imprime: Ana             (sale la primera que llegó)
print(list(cola))                  # imprime: ['Luis', 'Eva']`),
      viz('stack-queue'),
      md(
        `## Problema clásico: ¿los paréntesis están balanceados?
"(())" está bien; "())" y "(()" no. ¿Por qué una pila? Porque el paréntesis que cierra siempre corresponde al **último que se abrió y sigue pendiente**: justo lo que está arriba de la pila.
- Si llega uno que **abre**, lo pones en la pila (queda pendiente).
- Si llega uno que **cierra**, sacas el de arriba. Si la pila está vacía (no había nada pendiente) o no es su pareja, está mal.
- Al final, la pila debe quedar **vacía**: si sobró alguno, quedó uno sin cerrar.

\`not pila\` es verdadero cuando la pila está vacía.`,
        `## Classic problem: are the parentheses balanced?
"(())" is fine; "())" and "(()" are not. Why a stack? Because a closing parenthesis always matches the **last one opened that is still pending**: exactly what is on top of the stack.
- If an **opening** one arrives, push it (it is pending).
- If a **closing** one arrives, pop the top. If the stack is empty (nothing was pending) or it is not its pair, it is wrong.
- At the end, the stack must be **empty**: if one is left over, something was never closed.

\`not stack\` is true when the stack is empty.`,
      ),
      code(`def balanceado(s):
    pareja = {")": "(", "]": "["}        # qué abre a cada uno que cierra
    pila = []
    for c in s:
        if c in "([":
            pila.append(c)               # abre: queda pendiente
        else:
            if not pila or pila.pop() != pareja[c]:
                return False             # cierra sin nada pendiente, o con la pareja equivocada
    return len(pila) == 0                # ¿quedó alguno sin cerrar?

print(balanceado("([])"), balanceado("(]"), balanceado("(("))   # imprime: True False False`),
      md(
        `## Más usos de una pila
- **Invertir:** si metes "h", "o", "l", "a" y luego los sacas, salen al revés: "a", "l", "o", "h".
- **Notación polaca inversa** (RPN): "8 3 -" significa 8 − 3. Los números se meten a la pila; al llegar un operador, sacas **dos**: el primero que sacas es el segundo número (\`b\`) y el siguiente es el primero (\`a\`), y metes \`a - b\`. El orden importa en la resta y la división.
- **Pila con mínimo:** para saber el mínimo en O(1) en cualquier momento, guarda en cada lugar una pareja **(valor, mínimo hasta aquí)**. Una pareja de valores entre paréntesis, como \`(5, 2)\`, se llama **tupla**; \`pila[-1][1]\` es el segundo dato de la última tupla.

Una expresión útil: \`a if condicion else b\` vale \`a\` si la condición es verdadera y \`b\` si no. Por ejemplo, \`m = min(x, pila[-1][1]) if pila else x\` usa \`x\` como mínimo cuando la pila está vacía.`,
        `## More uses of a stack
- **Reversing:** if you push "h", "o", "l", "a" and then pop them, they come out backwards: "a", "l", "o", "h".
- **Reverse Polish notation** (RPN): "8 3 -" means 8 − 3. Numbers are pushed; when an operator arrives you pop **two**: the first one you pop is the second number (\`b\`) and the next is the first (\`a\`), and you push \`a - b\`. The order matters for subtraction and division.
- **Min stack:** to know the minimum in O(1) at any moment, store in each slot a pair **(value, minimum so far)**. A pair of values in parentheses, like \`(5, 2)\`, is called a **tuple**; \`stack[-1][1]\` is the second item of the last tuple.

A handy expression: \`a if condition else b\` is \`a\` when the condition is true and \`b\` otherwise. For example, \`m = min(x, stack[-1][1]) if stack else x\` uses \`x\` as the minimum when the stack is empty.`,
      ),
      md(
        `## Pila monótona: "el siguiente mayor"
**El problema:** para cada número de una lista, ¿cuál es el siguiente número **mayor** a su derecha? (O, con temperaturas: ¿cuántos días faltan para un día más caluroso?). Revisar todo lo que sigue para cada número es O(n²).

**La idea:** guarda en una pila los que **todavía esperan** encontrar a uno mayor. Cuando llega un número nuevo, resuelve a todos los de arriba de la pila que sean menores que él: él es su "siguiente mayor". Luego él también se pone a esperar. La pila siempre queda ordenada (por eso se llama **monótona**).

Cada número entra a la pila una vez y sale como mucho una vez: **O(n)**.

\`[-1] * 4\` crea una lista con cuatro copias de -1: \`[-1, -1, -1, -1]\`.`,
        `## Monotonic stack: "the next greater"
**The problem:** for each number in a list, what is the next **greater** number to its right? (Or, with temperatures: how many days until a warmer day?). Checking everything that follows for each number is O(n²).

**The idea:** keep on a stack the numbers that **are still waiting** to find a greater one. When a new number arrives, it resolves everyone on top of the stack that is smaller than it: it is their "next greater". Then it waits too. The stack always stays ordered (that is why it is called **monotonic**).

Each number enters the stack once and leaves at most once: **O(n)**.

\`[-1] * 4\` creates a list with four copies of -1: \`[-1, -1, -1, -1]\`.`,
      ),
      code(`nums = [2, 1, 5, 3]
res = [-1] * len(nums)                 # -1 = no hay uno mayor a la derecha
pila = []                              # posiciones que todavía esperan a uno mayor
for i, x in enumerate(nums):
    while pila and nums[pila[-1]] < x:   # x es mayor que el que espera arriba
        j = pila.pop()
        res[j] = x                       # el siguiente mayor de nums[j] es x
    pila.append(i)                       # ahora x también espera
print(res)                             # imprime: [5, 5, -1, -1]`),
      interview('Pregunta clásica: "Implementa una cola usando dos pilas". Una pila (`entrada`) recibe todo lo que se encola. Para desencolar, si la otra (`salida`) está vacía, pasas todo de `entrada` a `salida` (así queda al revés: el más antiguo arriba) y haces pop de `salida`. Cada elemento se mueve una sola vez: O(1) amortizado.', 'Classic question: "Implement a queue using two stacks". One stack (`entrada`) receives everything enqueued. To dequeue, if the other (`salida`) is empty, move everything from `entrada` to `salida` (it ends up reversed: the oldest on top) and pop from `salida`. Each element moves only once: O(1) amortized.'),
      md(
        `## Resumen
| | Pila (stack) | Cola (queue) |
|---|---|---|
| Regla | LIFO: el último en entrar sale primero | FIFO: el primero en llegar sale primero |
| Analogía | Pila de platos | Fila del banco |
| En Python | lista: \`append\`, \`pop()\`, \`pila[-1]\` | \`deque\`: \`append\`, \`popleft()\` |
| Costo | O(1) | O(1) (con \`lista.pop(0)\` sería O(n)) |
| Usos | Deshacer, paréntesis, RPN, pila de llamadas, DFS, pila monótona | Orden de llegada, tareas, BFS |`,
        `## Summary
| | Stack | Queue |
|---|---|---|
| Rule | LIFO: last in, first out | FIFO: first in, first out |
| Analogy | Stack of plates | Line at the bank |
| In Python | list: \`append\`, \`pop()\`, \`stack[-1]\` | \`deque\`: \`append\`, \`popleft()\` |
| Cost | O(1) | O(1) (with \`list.pop(0)\` it would be O(n)) |
| Uses | Undo, parentheses, RPN, call stack, DFS, monotonic stack | Arrival order, tasks, BFS |`,
      ),
    ],
    quiz: [
      q('¿Qué estructura usa BFS?', 'Which structure does BFS use?', [['Pila', 'Stack'], ['Cola', 'Queue'], ['Heap', 'Heap'], ['Hash map', 'Hash map']], 1, 'BFS procesa en orden de llegada (FIFO).', 'BFS processes in arrival order (FIFO).'),
      q('¿Qué problema resuelve típicamente una pila monótona?', 'What problem does a monotonic stack typically solve?', [['Camino más corto', 'Shortest path'], ['Siguiente elemento mayor', 'Next greater element'], ['Ordenar', 'Sorting'], ['Buscar duplicados', 'Finding duplicates']], 1,
        'Mantiene los que esperan y los resuelve al llegar uno mayor.', 'It keeps the waiting ones and resolves them when a greater one arrives.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué significan LIFO y FIFO?', 'What do LIFO and FIFO mean?', [['LIFO: el último en entrar sale primero (pila). FIFO: el primero en llegar sale primero (cola)', 'LIFO: last in, first out (stack). FIFO: first in, first out (queue)'], ['Son dos nombres para lo mismo', 'They are two names for the same thing'], ['LIFO es la cola y FIFO la pila', 'LIFO is the queue and FIFO the stack'], ['Son tipos de hash map', 'They are kinds of hash maps']], 0,
        'Pila de platos (LIFO) y fila del banco (FIFO).', 'Stack of plates (LIFO) and bank line (FIFO).'),
      q('`pila = [1, 2, 3]`. ¿Qué devuelve `pila.pop()`?', '`pila = [1, 2, 3]`. What does `pila.pop()` return?', [['1', '1'], ['2', '2'], ['3', '3'], ['[1, 2]', '[1, 2]']], 2,
        'Saca el último que entró, el de arriba.', 'It takes out the last one in, the one on top.'),
      q('¿Qué hace `pila[-1]`?', 'What does `pila[-1]` do?', [['Saca el último elemento', 'Removes the last element'], ['Muestra el último elemento sin sacarlo (peek)', 'Shows the last element without removing it (peek)'], ['Da error', 'It fails'], ['Muestra el primero', 'Shows the first one']], 1,
        'El índice -1 es el último elemento de la lista.', 'Index -1 is the last element of the list.'),
      q('¿Por qué en Python se usa `deque` para una cola y no `lista.pop(0)`?', 'Why use `deque` for a queue in Python instead of `list.pop(0)`?', [['Porque `pop(0)` no existe', 'Because `pop(0)` does not exist'], ['Porque `deque` ordena los elementos', 'Because `deque` sorts the elements'], ['Porque `lista.pop(0)` es O(n): mueve a todos un lugar. `popleft()` es O(1)', 'Because `list.pop(0)` is O(n): it moves everyone one place. `popleft()` is O(1)'], ['No hay diferencia', 'There is no difference']], 2,
        'Es el mismo motivo por el que insertar al inicio de una lista es O(n).', 'It is the same reason inserting at the start of a list is O(n).'),
      q('`cola` es un `deque` con "Ana", "Luis", "Eva" (en ese orden de llegada). ¿Qué devuelve `cola.popleft()`?', '`cola` is a `deque` with "Ana", "Luis", "Eva" (in that arrival order). What does `cola.popleft()` return?', [['"Eva"', '"Eva"'], ['"Ana"', '"Ana"'], ['"Luis"', '"Luis"'], ['Una lista vacía', 'An empty list']], 1,
        'Sale la primera que llegó.', 'The first one to arrive leaves.'),
      q('¿Qué estructura usarías para el botón "deshacer"?', 'Which structure would you use for an "undo" button?', [['Una cola', 'A queue'], ['Un set', 'A set'], ['Una pila', 'A stack'], ['Un diccionario', 'A dictionary']], 2,
        'Deshacer quita lo último que hiciste: LIFO.', 'Undo removes the last thing you did: LIFO.'),
      q('Revisando paréntesis llega un ")" y la pila está vacía. ¿Qué significa?', 'Checking parentheses, a ")" arrives and the stack is empty. What does it mean?', [['Que está balanceado', 'That it is balanced'], ['Que hay que seguir revisando', 'That you should keep checking'], ['Que sobra un "("', 'That there is an extra "("'], ['Que cierra uno que nunca se abrió: no está balanceado', 'That it closes one that was never opened: it is not balanced']], 3,
        'Y al final, si la pila no queda vacía, quedó uno abierto sin cerrar.', 'And at the end, if the stack is not empty, one was left open.'),
      q('En notación polaca inversa, "8 3 -" vale…', 'In reverse Polish notation, "8 3 -" equals…', [['5', '5'], ['-5', '-5'], ['11', '11'], ['24', '24']], 0,
        'Al llegar "-" sacas `b` = 3 y luego `a` = 8, y metes `a - b` = 5.', 'When "-" arrives you pop `b` = 3 and then `a` = 8, and push `a - b` = 5.'),
      q('En una "pila con mínimo", ¿qué guardas en cada lugar?', 'In a "min stack", what do you store in each slot?', [['Solo el valor', 'Only the value'], ['Una tupla (valor, mínimo hasta aquí)', 'A tuple (value, minimum so far)'], ['La lista ordenada', 'The sorted list'], ['El máximo hasta aquí', 'The maximum so far']], 1,
        'Así el mínimo actual siempre está en `pila[-1][1]`, en O(1).', 'That way the current minimum is always at `pila[-1][1]`, in O(1).'),
      q('¿Por qué la pila monótona es O(n) aunque tenga un `while` dentro del `for`?', 'Why is the monotonic stack O(n) even with a `while` inside the `for`?', [['Porque el while nunca se ejecuta', 'Because the while never runs'], ['Porque usa un diccionario', 'Because it uses a dictionary'], ['Porque cada elemento entra a la pila una vez y sale como mucho una vez', 'Because each element enters the stack once and leaves at most once'], ['No es O(n)', 'It is not O(n)']], 2,
        'En total hay a lo más n pushes y n pops.', 'In total there are at most n pushes and n pops.'),
      q('¿Qué vale `x if len(pila) > 0 else 0` cuando la pila está vacía?', 'What is `x if len(pila) > 0 else 0` when the stack is empty?', [['x', 'x'], ['0', '0'], ['Da error', 'It fails'], ['None', 'None']], 1,
        '`a if condición else b` vale `b` cuando la condición es falsa.', '`a if condition else b` is `b` when the condition is false.'),
      q('Con una cola hecha de dos pilas, ¿cuándo pasas los elementos de `entrada` a `salida`?', 'With a queue made of two stacks, when do you move elements from `entrada` to `salida`?', [['En cada encolar', 'On every enqueue'], ['Solo cuando vas a desencolar y `salida` está vacía', 'Only when you dequeue and `salida` is empty'], ['Nunca', 'Never'], ['Cada vez que `entrada` tiene 2 elementos', 'Whenever `entrada` has 2 elements']], 1,
        'Al pasarlos quedan al revés (el más antiguo arriba). Cada elemento se mueve una vez: O(1) amortizado.', 'Moving them reverses them (the oldest on top). Each element moves once: O(1) amortized.'),
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
    summary: l('Funciones que se llaman a sí mismas: caso base, paso recursivo, la pila de llamadas, cómo escribirlas y cómo explorar todas las opciones con backtracking.', 'Functions that call themselves: base case, recursive step, the call stack, how to write them and how to explore every option with backtracking.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Qué es la recursión?
Algunos problemas están hechos de **copias más pequeñas de sí mismos**. El factorial de 5 (5 × 4 × 3 × 2 × 1) es 5 × *el factorial de 4*. Y el factorial de 4 es 4 × *el factorial de 3*…

La **recursión** es una función que **se llama a sí misma** con un problema más pequeño, hasta llegar a uno tan pequeño que se resuelve directo. Toda función recursiva tiene **dos partes**:
1. **Caso base:** el problema más pequeño, que se responde sin volver a llamarse. Es lo que hace que se detenga.
2. **Paso recursivo:** se llama a sí misma con un problema **más chico** y usa ese resultado.

**Analogía:** las muñecas rusas (matrioskas). Abres una y adentro hay otra más pequeña, y otra, hasta la más chica, que ya no se abre: ese es el caso base.`,
        `## What is recursion?
Some problems are made of **smaller copies of themselves**. The factorial of 5 (5 × 4 × 3 × 2 × 1) is 5 × *the factorial of 4*. And the factorial of 4 is 4 × *the factorial of 3*…

**Recursion** is a function that **calls itself** with a smaller problem, until it reaches one so small it is solved directly. Every recursive function has **two parts**:
1. **Base case:** the smallest problem, answered without calling itself again. It is what makes it stop.
2. **Recursive step:** it calls itself with a **smaller** problem and uses that result.

**Analogy:** Russian nesting dolls. You open one and inside there is a smaller one, and another, until the smallest one, which does not open: that is the base case.`,
      ),
      code(`def factorial(n):
    if n <= 1:                      # caso base: se responde directo
        return 1
    return n * factorial(n - 1)     # paso recursivo: el mismo problema, más chico

print(factorial(5))                 # imprime: 120`),
      md(
        `**Cómo se ejecuta:**
\`\`\`
factorial(5) = 5 * factorial(4)
                   factorial(4) = 4 * factorial(3)
                                      factorial(3) = 3 * factorial(2)
                                                         factorial(2) = 2 * factorial(1)
                                                                            factorial(1) = 1   ← caso base
\`\`\`
Cada llamada **espera** la respuesta de la que hizo. Cuando llega al caso base, las respuestas regresan hacia arriba: 1 → 2 → 6 → 24 → 120.

Mientras esperan, las llamadas quedan guardadas en la **pila de llamadas** (una pila: la última que entró es la primera en terminar). Por eso una recursión de profundidad n usa **O(n) de espacio**.

**Si no hay caso base** (o nunca se llega a él), la función se llama sin fin y la pila se llena: es un **stack overflow**. Python lo evita deteniéndose con un \`RecursionError\` al llegar a su límite, que por defecto es de unas 1,000 llamadas.`,
        `**How it runs:**
\`\`\`
factorial(5) = 5 * factorial(4)
                   factorial(4) = 4 * factorial(3)
                                      factorial(3) = 3 * factorial(2)
                                                         factorial(2) = 2 * factorial(1)
                                                                            factorial(1) = 1   ← base case
\`\`\`
Each call **waits** for the answer of the one it made. When the base case is reached, the answers travel back up: 1 → 2 → 6 → 24 → 120.

While they wait, the calls are stored on the **call stack** (a stack: the last one in is the first to finish). That is why a recursion of depth n uses **O(n) space**.

**If there is no base case** (or it is never reached), the function calls itself forever and the stack fills up: that is a **stack overflow**. Python prevents it by stopping with a \`RecursionError\` when it reaches its limit, which by default is about 1,000 calls.`,
      ),
      md(
        `## El orden: de ida y de regreso
Lo que está **antes** de la llamada recursiva se ejecuta "de ida", mientras se va haciendo más chico el problema. Lo que está **después** se ejecuta "de regreso", cuando las llamadas van terminando, en **orden inverso**.`,
        `## The order: on the way down and on the way back
What comes **before** the recursive call runs "on the way down", while the problem gets smaller. What comes **after** runs "on the way back", as the calls finish, in **reverse order**.`,
      ),
      code(`def baja(n):
    if n == 0:
        print("llegué al fondo")
        return
    print("bajando", n)     # antes de la llamada: de ida
    baja(n - 1)
    print("subiendo", n)    # después de la llamada: de regreso, en orden inverso

baja(2)
# imprime:
# bajando 2
# bajando 1
# llegué al fondo
# subiendo 1
# subiendo 2`),
      md(
        `## Cómo escribir una función recursiva
1. **Define qué devuelve** la función para un problema dado ("devuelve el máximo de \`nums\` desde la posición \`i\`").
2. **Escribe el caso base:** el problema más pequeño, que se resuelve directo.
3. **Confía** en que la llamada con un problema más chico ya funciona. No intentes seguirla mentalmente hasta el fondo.
4. **Combina** ese resultado para resolver el problema actual.

Dos cosas de Python que vas a ver:
- \`def maximo(nums, i=0):\` le da a \`i\` el valor 0 si no se lo pasas. Así llamas \`maximo([3, 9, 2])\` sin escribir el 0.
- \`a if condicion else b\` vale \`a\` si la condición es verdadera y \`b\` si no.`,
        `## How to write a recursive function
1. **Define what the function returns** for a given problem ("returns the maximum of \`nums\` from position \`i\` on").
2. **Write the base case:** the smallest problem, solved directly.
3. **Trust** that the call with a smaller problem already works. Do not try to follow it in your head all the way down.
4. **Combine** that result to solve the current problem.

Two Python features you will see:
- \`def maximo(nums, i=0):\` gives \`i\` the value 0 if you do not pass it. So you call \`maximo([3, 9, 2])\` without writing the 0.
- \`a if condition else b\` is \`a\` when the condition is true and \`b\` otherwise.`,
      ),
      code(`def maximo(nums, i=0):
    if i == len(nums) - 1:              # caso base: queda un solo elemento
        return nums[i]
    resto = maximo(nums, i + 1)         # confía: el máximo de lo que sigue ya funciona
    return nums[i] if nums[i] > resto else resto   # combina

print(maximo([3, 9, 2]))                # imprime: 9`),
      md(
        `### Partir a la mitad
Si cada llamada reduce el problema **a la mitad** en vez de en 1, solo hacen falta unas log₂(n) llamadas. Por ejemplo, para calcular bᵉ: bᵉ = (b^(e//2))², y si e es impar se multiplica una vez más por b. Para e = 1,000 son unas 10 llamadas en lugar de 1,000. Es la **potencia rápida**: **O(log e)**.`,
        `### Halving
If each call reduces the problem **by half** instead of by 1, only about log₂(n) calls are needed. For example, to compute bᵉ: bᵉ = (b^(e//2))², and if e is odd you multiply by b once more. For e = 1,000 that is about 10 calls instead of 1,000. It is **fast exponentiation**: **O(log e)**.`,
      ),
      md(
        `## Backtracking: probar todas las opciones
**El problema:** generar **todas** las combinaciones posibles: todos los subconjuntos de una lista, todas las formas de ordenarla (permutaciones), resolver un sudoku.

**La idea:** construyes la solución **paso a paso**. En cada paso **eliges** una opción, sigues construyendo con una llamada recursiva y, al regresar, **deshaces** esa elección para probar la siguiente.

**Analogía:** un laberinto. Avanzas por un camino; si no lleva a la salida, **regresas** al último cruce y pruebas otro. Así acabas probando todos los caminos.

Para los subconjuntos, cada elemento tiene dos opciones: **entra o no entra**. Con n elementos son 2 × 2 × … = **2ⁿ** subconjuntos.`,
        `## Backtracking: trying every option
**The problem:** generating **every** possible combination: all subsets of a list, all ways to order it (permutations), solving a sudoku.

**The idea:** you build the solution **step by step**. At each step you **choose** an option, keep building with a recursive call and, on the way back, **undo** that choice to try the next one.

**Analogy:** a maze. You go down a path; if it does not lead to the exit, you **go back** to the last junction and try another. That way you end up trying every path.

For subsets, each element has two options: **in or out**. With n elements that is 2 × 2 × … = **2ⁿ** subsets.`,
      ),
      code(`def subconjuntos(nums):
    res, actual = [], []

    def bt(i):                      # bt = backtracking; decide sobre nums[i]
        if i == len(nums):          # caso base: ya se decidió sobre todos
            res.append(actual[:])   # guarda una COPIA de la solución actual
            return
        actual.append(nums[i])      # 1) elegir: nums[i] entra
        bt(i + 1)                   # 2) seguir construyendo
        actual.pop()                # 3) deshacer la elección
        bt(i + 1)                   # 4) la otra opción: nums[i] no entra

    bt(0)
    return res

print(subconjuntos([1, 2]))         # imprime: [[1, 2], [1], [2], []]`),
      md(
        `**Cómo leerlo:**
- La función \`bt\` está **dentro** de \`subconjuntos\`, así que puede usar \`res\`, \`actual\` y \`nums\` sin recibirlos.
- \`actual[:]\` hace una **copia** de la lista. Hace falta porque \`actual\` sigue cambiando: si guardaras \`actual\` mismo, al final todas las soluciones guardadas serían la misma lista (vacía).
- El patrón es siempre **elegir → seguir → deshacer**. Sin el \`actual.pop()\`, la elección de un camino contaminaría a los demás.

**Permutaciones:** para cada posición eliges uno de los elementos que **quedan** y sigues con el resto. Hay n opciones para el primero, n − 1 para el segundo… en total **n!** (n factorial). \`xs[:i] + xs[i + 1:]\` es la lista sin el elemento de la posición \`i\`.

Estas recursiones generan **muchas** soluciones: subconjuntos es O(2ⁿ · n) y permutaciones O(n! · n). Solo sirven para n pequeños.`,
        `**How to read it:**
- The function \`bt\` is **inside** \`subconjuntos\`, so it can use \`res\`, \`actual\` and \`nums\` without receiving them.
- \`actual[:]\` makes a **copy** of the list. It is needed because \`actual\` keeps changing: if you saved \`actual\` itself, in the end every saved solution would be the same list (empty).
- The pattern is always **choose → continue → undo**. Without \`actual.pop()\`, one path's choice would contaminate the others.

**Permutations:** for each position you choose one of the elements **left** and continue with the rest. There are n options for the first, n − 1 for the second… in total **n!** (n factorial). \`xs[:i] + xs[i + 1:]\` is the list without the element at position \`i\`.

These recursions generate **many** solutions: subsets is O(2ⁿ · n) and permutations O(n! · n). They only work for small n.`,
      ),
      tip('Si una recursión calcula **los mismos subproblemas muchas veces** (como Fibonacci hecho de forma directa), guarda cada resultado la primera vez que lo calcules y reutilízalo. Eso se llama **memoización** y ya es programación dinámica: lo verás al final de esta ruta.', 'If a recursion computes **the same subproblems many times** (like Fibonacci done directly), store each result the first time you compute it and reuse it. That is called **memoization** and it is already dynamic programming: you will see it at the end of this track.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Caso base | El problema más chico, que se responde sin volver a llamarse. Sin él: \`RecursionError\` |
| Paso recursivo | Llamarse con un problema más chico y combinar el resultado |
| Pila de llamadas | Las llamadas que esperan respuesta. Profundidad n → O(n) de espacio |
| Antes / después de la llamada | Antes: de ida. Después: de regreso, en orden inverso |
| Partir a la mitad | Unas log₂(n) llamadas (potencia rápida) |
| Backtracking | Elegir → seguir → deshacer, para probar todas las opciones |
| Subconjuntos / permutaciones | 2ⁿ / n! soluciones |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Base case | The smallest problem, answered without calling itself again. Without it: \`RecursionError\` |
| Recursive step | Calling itself with a smaller problem and combining the result |
| Call stack | The calls waiting for an answer. Depth n → O(n) space |
| Before / after the call | Before: on the way down. After: on the way back, in reverse order |
| Halving | About log₂(n) calls (fast exponentiation) |
| Backtracking | Choose → continue → undo, to try every option |
| Subsets / permutations | 2ⁿ / n! solutions |`,
      ),
    ],
    quiz: [
      q('¿Qué pasa si una función recursiva no tiene caso base?', 'What happens if a recursive function has no base case?', [['Devuelve None', 'It returns None'], ['Recursión infinita / stack overflow', 'Infinite recursion / stack overflow'], ['Se vuelve iterativa', 'It becomes iterative'], ['Nada', 'Nothing']], 1,
        'Nunca deja de llamarse y agota la pila. Python lo detiene con un `RecursionError`.', 'It never stops calling itself and exhausts the stack. Python stops it with a `RecursionError`.'),
      q('¿Cuántos subconjuntos tiene un conjunto de n elementos?', 'How many subsets does a set of n elements have?', [['n', 'n'], ['n²', 'n²'], ['2ⁿ', '2ⁿ'], ['n!', 'n!']], 2,
        'Cada elemento está o no está: 2 opciones por elemento.', 'Each element is in or out: 2 options per element.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Cuáles son las dos partes de toda función recursiva?', 'What are the two parts of every recursive function?', [['Un ciclo y un contador', 'A loop and a counter'], ['El caso base y el paso recursivo', 'The base case and the recursive step'], ['Una pila y una cola', 'A stack and a queue'], ['Un if y un else', 'An if and an else']], 1,
        'El caso base la detiene; el paso recursivo se llama con un problema más chico.', 'The base case stops it; the recursive step calls itself with a smaller problem.'),
      q('Con `factorial(n) = n * factorial(n - 1)` y `factorial(1) = 1`, ¿cuánto vale `factorial(4)`?', 'With `factorial(n) = n * factorial(n - 1)` and `factorial(1) = 1`, what is `factorial(4)`?', [['4', '4'], ['10', '10'], ['24', '24'], ['16', '16']], 2,
        '4 × 3 × 2 × 1 = 24.', '4 × 3 × 2 × 1 = 24.'),
      q('¿Cuánto espacio extra usa una recursión de profundidad n que no crea listas?', 'How much extra space does a recursion of depth n that creates no lists use?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n), por las llamadas que esperan en la pila de llamadas', 'O(n), because of the calls waiting on the call stack'], ['O(n²)', 'O(n²)']], 2,
        'Cada llamada pendiente ocupa un lugar en la pila hasta que recibe su respuesta.', 'Each pending call takes a slot on the stack until it gets its answer.'),
      q('Una función imprime algo **después** de su llamada recursiva. ¿En qué orden salen esas impresiones?', 'A function prints something **after** its recursive call. In what order do those prints come out?', [['En el mismo orden de las llamadas', 'In the same order as the calls'], ['En orden inverso: de la llamada más profunda a la primera', 'In reverse order: from the deepest call to the first'], ['En orden aleatorio', 'In random order'], ['No se imprimen', 'They are not printed']], 1,
        'Lo de después se ejecuta "de regreso", cuando cada llamada termina.', 'What comes after runs "on the way back", as each call finishes.'),
      q('Al escribir el paso recursivo, ¿qué supones?', 'When writing the recursive step, what do you assume?', [['Que la llamada con un problema más chico ya devuelve la respuesta correcta', 'That the call with a smaller problem already returns the right answer'], ['Que nunca se llega al caso base', 'That the base case is never reached'], ['Que la lista está ordenada', 'That the list is sorted'], ['Que hay que seguir cada llamada mentalmente', 'That you must follow every call in your head']], 0,
        'Confías en la llamada más chica y solo te ocupas de combinar su resultado.', 'You trust the smaller call and only take care of combining its result.'),
      q('¿Qué vale `nums[i] if nums[i] > resto else resto` si `nums[i]` es 3 y `resto` es 9?', 'What is `nums[i] if nums[i] > resto else resto` when `nums[i]` is 3 and `resto` is 9?', [['3', '3'], ['9', '9'], ['12', '12'], ['True', 'True']], 1,
        '3 > 9 es falso, así que vale lo que está después del `else`: 9.', '3 > 9 is false, so it is what comes after `else`: 9.'),
      q('Si cada llamada recursiva parte el problema a la mitad, ¿cuántas llamadas hay aproximadamente?', 'If each recursive call halves the problem, roughly how many calls are there?', [['n', 'n'], ['n²', 'n²'], ['2ⁿ', '2ⁿ'], ['log₂(n)', 'log₂(n)']], 3,
        'Como la potencia rápida: para e = 1,000 son unas 10 llamadas.', 'Like fast exponentiation: for e = 1,000 it is about 10 calls.'),
      q('En backtracking, ¿para qué sirve deshacer la elección al regresar?', 'In backtracking, why do you undo the choice on the way back?', [['Para ahorrar memoria', 'To save memory'], ['Para que la elección de un camino no afecte a los demás caminos', 'So that one path\'s choice does not affect the other paths'], ['Para que termine más rápido', 'So it finishes faster'], ['No hace falta deshacerla', 'There is no need to undo it']], 1,
        'El patrón es elegir → seguir → deshacer, y luego probar la siguiente opción.', 'The pattern is choose → continue → undo, then try the next option.'),
      q('¿Por qué se guarda `actual[:]` y no `actual` al encontrar un subconjunto?', 'Why save `actual[:]` and not `actual` when a subset is found?', [['Porque `actual[:]` está ordenada', 'Because `actual[:]` is sorted'], ['Es lo mismo', 'It is the same'], ['Porque `actual[:]` es una copia; `actual` sigue cambiando y todas las soluciones guardadas terminarían iguales', 'Because `actual[:]` is a copy; `actual` keeps changing and every saved solution would end up the same'], ['Porque `actual` no existe dentro de `bt`', 'Because `actual` does not exist inside `bt`']], 2,
        'Sin la copia guardarías la misma lista varias veces.', 'Without the copy you would save the same list several times.'),
      q('¿Cuántas permutaciones (formas de ordenar) tiene una lista de 4 elementos distintos?', 'How many permutations (orderings) does a list of 4 distinct elements have?', [['8', '8'], ['16', '16'], ['4', '4'], ['24', '24']], 3,
        'n! = 4 × 3 × 2 × 1 = 24: 4 opciones para el primero, 3 para el segundo…', 'n! = 4 × 3 × 2 × 1 = 24: 4 options for the first, 3 for the second…'),
      q('Una recursión calcula los mismos subproblemas muchas veces. ¿Qué técnica lo arregla?', 'A recursion computes the same subproblems many times. Which technique fixes it?', [['Memoización: guardar cada resultado y reutilizarlo', 'Memoization: store each result and reuse it'], ['Quitar el caso base', 'Removing the base case'], ['Usar una cola', 'Using a queue'], ['Ordenar la entrada', 'Sorting the input']], 0,
        'Es la base de la programación dinámica.', 'It is the basis of dynamic programming.'),
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
    summary: l('Bubble, merge y quick sort paso a paso, qué es un ordenamiento estable y cómo ordenar en Python con sorted, sort y key.', 'Bubble, merge and quick sort step by step, what a stable sort is and how to sort in Python with sorted, sort and key.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Por qué estudiar ordenamientos?
En el trabajo casi siempre usas el ordenamiento que ya trae el lenguaje (\`sorted\` en Python). Pero en las entrevistas te preguntan **cómo funcionan** los clásicos y **cuánto cuestan**, porque usan ideas que aparecen en todas partes: comparar vecinos, dividir el problema en mitades y partir alrededor de un pivote. Además, **ordenar primero** vuelve fáciles muchos problemas.

Un detalle de Python que vas a ver mucho: \`a, b = b, a\` **intercambia** dos valores en una sola línea.

## Bubble sort: comparar vecinos
**La idea:** recorres la lista comparando cada par de **vecinos**. Si están en el orden equivocado, los intercambias. Al terminar una pasada, el número **más grande** quedó al final, como una burbuja que sube. Repites hasta que todo esté en su lugar.

**Analogía:** ordenar una fila de personas por estatura comparándolas de dos en dos: si la de la izquierda es más alta, cambian de lugar.

Después de la pasada \`i\`, los últimos \`i\` elementos ya están en su lugar, por eso el ciclo de adentro llega solo hasta \`n - 1 - i\`. Son dos ciclos anidados: **O(n²)**.`,
        `## Why study sorting?
At work you almost always use the language's built-in sort (\`sorted\` in Python). But interviews ask **how the classics work** and **what they cost**, because they use ideas that show up everywhere: comparing neighbors, splitting the problem in halves and partitioning around a pivot. Also, **sorting first** makes many problems easy.

A Python detail you will see a lot: \`a, b = b, a\` **swaps** two values in a single line.

## Bubble sort: comparing neighbors
**The idea:** you walk the list comparing each pair of **neighbors**. If they are in the wrong order, you swap them. At the end of a pass, the **largest** number has ended up at the end, like a bubble rising. You repeat until everything is in place.

**Analogy:** sorting a line of people by height comparing them two at a time: if the one on the left is taller, they swap places.

After pass \`i\`, the last \`i\` elements are already in place, which is why the inner loop only goes up to \`n - 1 - i\`. It is two nested loops: **O(n²)**.`,
      ),
      code(`a = [6, 3, 8, 1]
n = len(a)
for i in range(n):                          # pasada número i
    for j in range(n - 1 - i):              # los últimos i ya están en su lugar
        if a[j] > a[j + 1]:                 # vecinos en desorden:
            a[j], a[j + 1] = a[j + 1], a[j] # se intercambian
    print("pasada", i + 1, a)
# imprime:
# pasada 1 [3, 6, 1, 8]
# pasada 2 [3, 1, 6, 8]
# pasada 3 [1, 3, 6, 8]
# pasada 4 [1, 3, 6, 8]`),
      md(
        `## Merge sort: dividir y mezclar
**La idea** (se llama *divide y vencerás*):
1. Si la lista tiene 0 o 1 elementos, ya está ordenada (caso base).
2. Si no, pártela en **dos mitades** y ordena cada una con merge sort (recursión).
3. **Mezcla** las dos mitades ordenadas: compara el primero de cada una, toma el menor y avanza en esa mitad. Cuando una se acaba, agrega lo que queda de la otra.

**Analogía del paso de mezcla:** tienes dos montones de cartas, cada uno ya ordenado, boca arriba. Siempre tomas la carta más chica de las dos de arriba y la pones en tu montón final.

**Costo:** partir a la mitad da unos log₂(n) niveles, y en cada nivel la mezcla revisa los n elementos: **O(n log n) siempre**, incluso en el peor caso. Necesita **O(n) de memoria extra** para las listas nuevas, y es **estable** (lo explicamos más abajo).

Dos detalles de Python: \`izq[i:]\` es la lista desde la posición \`i\` hasta el final, y \`;\` permite poner dos instrucciones en la misma línea.`,
        `## Merge sort: split and merge
**The idea** (it is called *divide and conquer*):
1. If the list has 0 or 1 elements, it is already sorted (base case).
2. If not, split it into **two halves** and sort each with merge sort (recursion).
3. **Merge** the two sorted halves: compare the first of each, take the smaller and move forward in that half. When one runs out, add what is left of the other.

**Analogy for the merge step:** you have two piles of cards, each already sorted, face up. You always take the smaller of the two top cards and put it on your final pile.

**Cost:** halving gives about log₂(n) levels, and at each level the merge checks all n elements: **O(n log n) always**, even in the worst case. It needs **O(n) extra memory** for the new lists, and it is **stable** (explained below).

Two Python details: \`izq[i:]\` is the list from position \`i\` to the end, and \`;\` lets you put two statements on the same line.`,
      ),
      viz('sorting'),
      code(`def merge_sort(a):
    if len(a) <= 1:                          # caso base: ya está ordenada
        return a
    mid = len(a) // 2
    izq, der = merge_sort(a[:mid]), merge_sort(a[mid:])   # ordena cada mitad
    res, i, j = [], 0, 0
    while i < len(izq) and j < len(der):     # mezcla: toma siempre el menor
        if izq[i] <= der[j]:
            res.append(izq[i]); i += 1
        else:
            res.append(der[j]); j += 1
    return res + izq[i:] + der[j:]           # lo que sobró de alguna mitad

print(merge_sort([5, 2, 9, 1, 7]))           # imprime: [1, 2, 5, 7, 9]`),
      md(
        `## Quick sort: partir alrededor de un pivote
**La idea:**
1. Elige un elemento como **pivote** (por ejemplo, el último).
2. **Partición:** acomoda la lista para que los **menores** que el pivote queden a su izquierda y los **mayores** a su derecha. El pivote queda en su **posición final**.
3. Ordena con quick sort la parte izquierda y la derecha (recursión).

**Costo:** en promedio **O(n log n)**, y ordena **en el mismo lugar** (no crea listas nuevas), por eso suele ser muy rápido en la práctica. Pero si el pivote es siempre el más chico o el más grande (por ejemplo, una lista **ya ordenada** usando el último como pivote), cada partición solo separa un elemento y el costo sube a **O(n²)**. Se evita eligiendo el pivote **al azar**. Quick sort normalmente **no es estable**.`,
        `## Quick sort: partitioning around a pivot
**The idea:**
1. Pick an element as the **pivot** (for example, the last one).
2. **Partition:** arrange the list so the elements **smaller** than the pivot end up on its left and the **larger** ones on its right. The pivot ends up in its **final position**.
3. Quick sort the left part and the right part (recursion).

**Cost:** on average **O(n log n)**, and it sorts **in place** (it creates no new lists), which is why it is usually very fast in practice. But if the pivot is always the smallest or the largest (for example, an **already sorted** list using the last element as pivot), each partition separates only one element and the cost rises to **O(n²)**. It is avoided by choosing the pivot **at random**. Quick sort is usually **not stable**.`,
      ),
      code(`a = [3, 8, 1, 6, 4]
pivote = a[-1]                       # el último: 4
i = 0                                # hasta dónde van los menores que el pivote
for j in range(len(a) - 1):
    if a[j] < pivote:
        a[i], a[j] = a[j], a[i]      # manda el menor a la zona izquierda
        i += 1
a[i], a[-1] = a[-1], a[i]            # pone el pivote justo después de los menores
print(a, i)                          # imprime: [3, 1, 4, 6, 8] 2
# El 4 quedó en la posición 2: a su izquierda los menores (3, 1), a su derecha los mayores (6, 8)`),
      md(
        `## ¿Qué es un ordenamiento estable?
Un ordenamiento es **estable** si los elementos que empatan **conservan el orden que tenían**. Ejemplo: ordenas personas por edad; Ana y Eva tienen 25 y Ana estaba antes. En un ordenamiento estable, Ana sigue antes que Eva.

Importa cuando ordenas por una cosa y no quieres perder un orden anterior (por ejemplo, pedidos ya ordenados por hora que ahora ordenas por cliente). Merge sort y el ordenamiento de Python son estables; quick sort normalmente no.

## Ordenar en Python
- \`sorted(lista)\` devuelve una **lista nueva** ordenada; la original no cambia.
- \`lista.sort()\` ordena **la misma lista** (no crea otra).
- \`key=\` dice **por qué ordenar**: recibe una función que se aplica a cada elemento. \`lambda p: len(p)\` es una función corta (sin nombre) que recibe \`p\` y devuelve \`len(p)\`.

Python usa **Timsort**: O(n log n), estable y muy rápido con datos **casi ordenados**, porque detecta los tramos que ya vienen en orden y los aprovecha.`,
        `## What is a stable sort?
A sort is **stable** if elements that tie **keep the order they had**. Example: you sort people by age; Ana and Eva are both 25 and Ana was first. In a stable sort, Ana stays before Eva.

It matters when you sort by one thing and do not want to lose a previous order (for example, orders already sorted by time that you now sort by customer). Merge sort and Python's sort are stable; quick sort usually is not.

## Sorting in Python
- \`sorted(list)\` returns a **new** sorted list; the original does not change.
- \`list.sort()\` sorts **the same list** (it creates no other).
- \`key=\` says **what to sort by**: it takes a function applied to each element. \`lambda p: len(p)\` is a short (unnamed) function that receives \`p\` and returns \`len(p)\`.

Python uses **Timsort**: O(n log n), stable and very fast on **nearly sorted** data, because it detects the stretches that are already in order and takes advantage of them.`,
      ),
      code(`nums = [3, 1, 2]
print(sorted(nums), nums)          # imprime: [1, 2, 3] [3, 1, 2]   (sorted crea una lista nueva)
nums.sort()                        # .sort() ordena la misma lista
print(nums)                        # imprime: [1, 2, 3]

frutas = ["pera", "kiwi", "uva"]
print(sorted(frutas, key=lambda p: len(p)))   # imprime: ['uva', 'pera', 'kiwi']
# "pera" y "kiwi" empatan (4 letras): por ser estable, "pera" sigue antes que "kiwi"`),
      md(
        `## Ordenar primero simplifica el problema
Muchos problemas se vuelven fáciles si primero ordenas. Ejemplo clásico: **combinar intervalos que se traslapan**, como [1, 3], [2, 6] y [8, 10] → [1, 6] y [8, 10].
1. Ordena los intervalos por su **inicio**.
2. Recórrelos una vez: si el siguiente empieza **antes de que termine** el último que guardaste, se traslapan y extiendes ese final; si no, agregas un intervalo nuevo.

Cuesta **O(n log n)** por el ordenamiento más una sola pasada. Dos detalles de Python: \`for ini, fin in intervalos:\` separa cada par en dos variables, y \`res[-1][1]\` es el final del último intervalo guardado.`,
        `## Sorting first simplifies the problem
Many problems become easy if you sort first. A classic example: **merging overlapping intervals**, like [1, 3], [2, 6] and [8, 10] → [1, 6] and [8, 10].
1. Sort the intervals by their **start**.
2. Walk them once: if the next one starts **before the last one you saved ends**, they overlap and you extend that end; if not, you add a new interval.

It costs **O(n log n)** for the sort plus a single pass. Two Python details: \`for ini, fin in intervals:\` splits each pair into two variables, and \`res[-1][1]\` is the end of the last saved interval.`,
      ),
      interview('"Estable" significa que los elementos iguales conservan su orden original. Si te preguntan qué ordenamiento usar con 10 millones de datos casi ordenados en Python, la respuesta es el de la librería (`sorted` o `.sort()`): Timsort aprovecha los tramos ya ordenados.', '"Stable" means equal elements keep their original order. If asked which sort to use on 10 million nearly sorted items in Python, the answer is the library one (`sorted` or `.sort()`): Timsort takes advantage of the already sorted stretches.'),
      md(
        `## Resumen
| Algoritmo | Idea | Tiempo | Memoria extra | ¿Estable? |
|---|---|---|---|---|
| Bubble sort | Intercambiar vecinos en desorden; el mayor sube al final | O(n²) | O(1) | Sí |
| Merge sort | Partir en mitades, ordenar cada una y mezclar | O(n log n) **siempre** | O(n) | Sí |
| Quick sort | Partir alrededor de un pivote | O(n log n) promedio, **O(n²) peor caso** | En el mismo lugar | Normalmente no |
| Timsort (Python) | El de \`sorted\` y \`.sort()\` | O(n log n) | O(n) | Sí |`,
        `## Summary
| Algorithm | Idea | Time | Extra memory | Stable? |
|---|---|---|---|---|
| Bubble sort | Swap out-of-order neighbors; the largest rises to the end | O(n²) | O(1) | Yes |
| Merge sort | Split in halves, sort each and merge | O(n log n) **always** | O(n) | Yes |
| Quick sort | Partition around a pivot | O(n log n) average, **O(n²) worst case** | In place | Usually not |
| Timsort (Python) | The one behind \`sorted\` and \`.sort()\` | O(n log n) | O(n) | Yes |`,
      ),
    ],
    quiz: [
      q('¿Qué algoritmo garantiza O(n log n) en el peor caso?', 'Which algorithm guarantees O(n log n) in the worst case?', [['Quick sort', 'Quick sort'], ['Merge sort', 'Merge sort'], ['Bubble sort', 'Bubble sort'], ['Insertion sort', 'Insertion sort']], 1,
        'Quick sort puede degradarse a O(n²) con malos pivotes.', 'Quick sort can degrade to O(n²) with bad pivots.'),
      q('¿Qué significa que un ordenamiento sea estable?', 'What does it mean for a sort to be stable?', [['Que nunca falla', 'It never fails'], ['Que usa O(1) memoria', 'It uses O(1) memory'], ['Que los iguales conservan su orden relativo', 'Equal elements keep their relative order'], ['Que es O(n log n)', 'It is O(n log n)']], 2,
        'Si Ana estaba antes que Eva y empatan, Ana sigue antes.', 'If Ana was before Eva and they tie, Ana stays before.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué hace `a, b = b, a` en Python?', 'What does `a, b = b, a` do in Python?', [['Compara `a` y `b`', 'Compares `a` and `b`'], ['Intercambia los valores de `a` y `b`', 'Swaps the values of `a` and `b`'], ['Copia `a` en `b`', 'Copies `a` into `b`'], ['Da error', 'It fails']], 1,
        'Es la forma corta de intercambiar, la que usan bubble sort y la partición de quick sort.', 'It is the short way to swap, used by bubble sort and quick sort\'s partition.'),
      q('Después de la **primera pasada** de bubble sort, ¿qué se sabe con seguridad?', 'After the **first pass** of bubble sort, what is certain?', [['Que la lista ya está ordenada', 'That the list is already sorted'], ['Que el menor quedó al inicio', 'That the smallest is at the start'], ['Que el mayor quedó al final', 'That the largest is at the end'], ['Nada', 'Nothing']], 2,
        'El mayor "sube" como una burbuja; por eso cada pasada revisa uno menos.', 'The largest "rises" like a bubble; that is why each pass checks one fewer.'),
      q('¿Qué complejidad tiene bubble sort?', 'What is the complexity of bubble sort?', [['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)']], 3,
        'Son dos ciclos anidados sobre la lista.', 'It is two nested loops over the list.'),
      q('En el paso de **mezcla** de merge sort, ¿qué elemento tomas cada vez?', 'In merge sort\'s **merge** step, which element do you take each time?', [['El menor de los dos primeros de cada mitad', 'The smaller of the first elements of each half'], ['El primero de la mitad izquierda', 'The first of the left half'], ['El mayor de los dos', 'The larger of the two'], ['Uno al azar', 'A random one']], 0,
        'Como dos montones de cartas ordenados: siempre la más chica de arriba.', 'Like two sorted piles of cards: always the smaller top card.'),
      q('¿Cuál es el caso base de merge sort?', 'What is merge sort\'s base case?', [['Una lista de 0 o 1 elementos, que ya está ordenada', 'A list of 0 or 1 elements, which is already sorted'], ['Una lista ya ordenada', 'An already sorted list'], ['Una lista de 2 elementos', 'A list of 2 elements'], ['No tiene caso base', 'It has no base case']], 0,
        'A partir de ahí se mezclan las mitades hacia arriba.', 'From there the halves are merged on the way back up.'),
      q('¿Cuánta memoria extra usa merge sort?', 'How much extra memory does merge sort use?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n), por las listas nuevas de la mezcla', 'O(n), for the new lists of the merge'], ['O(n²)', 'O(n²)']], 2,
        'A cambio, garantiza O(n log n) y es estable.', 'In exchange, it guarantees O(n log n) and is stable.'),
      q('Después de la partición de quick sort, ¿dónde queda el pivote?', 'After quick sort\'s partition, where does the pivot end up?', [['Al inicio de la lista', 'At the start of the list'], ['En su posición final: menores a la izquierda, mayores a la derecha', 'In its final position: smaller on the left, larger on the right'], ['Al final de la lista', 'At the end of the list'], ['En el centro de la lista', 'In the center of the list']], 1,
        'Luego se ordena cada lado por separado.', 'Then each side is sorted separately.'),
      q('¿Cuándo cae quick sort en O(n²) y cómo se evita?', 'When does quick sort fall into O(n²) and how is it avoided?', [['Con listas cortas; usando bubble sort', 'With short lists; using bubble sort'], ['Nunca cae en O(n²)', 'It never falls into O(n²)'], ['Con datos repetidos; quitándolos', 'With repeated data; removing them'], ['Cuando el pivote es siempre el menor o el mayor (p. ej. lista ya ordenada); eligiendo el pivote al azar', 'When the pivot is always the smallest or largest (e.g. an already sorted list); choosing the pivot at random']], 3,
        'Cada partición solo separa un elemento y se hacen n niveles.', 'Each partition separates only one element and there are n levels.'),
      q('¿Qué diferencia hay entre `sorted(lista)` y `lista.sort()`?', 'What is the difference between `sorted(list)` and `list.sort()`?', [['Ninguna', 'None'], ['`sorted` devuelve una lista nueva; `.sort()` ordena la misma lista', '`sorted` returns a new list; `.sort()` sorts the same list'], ['`.sort()` es más lento', '`.sort()` is slower'], ['`sorted` no es estable', '`sorted` is not stable']], 1,
        'Con `sorted` la lista original queda igual.', 'With `sorted` the original list stays the same.'),
      q('¿Qué hace `sorted(gente, key=lambda p: p[1])` si cada persona es `("Ana", 25)`?', 'What does `sorted(gente, key=lambda p: p[1])` do if each person is `("Ana", 25)`?', [['Ordena por el nombre', 'Sorts by name'], ['Ordena por la edad (el segundo dato)', 'Sorts by age (the second item)'], ['Ordena al revés', 'Sorts in reverse'], ['Da error', 'It fails']], 1,
        '`lambda p: p[1]` es una función corta que devuelve el segundo dato de cada tupla.', '`lambda p: p[1]` is a short function returning the second item of each tuple.'),
      q('Tienes 10 millones de números casi ordenados en Python. ¿Qué usas?', 'You have 10 million nearly sorted numbers in Python. What do you use?', [['Bubble sort, porque ya casi están ordenados', 'Bubble sort, because they are almost sorted'], ['Tu propio quick sort', 'Your own quick sort'], ['`sorted` o `.sort()` (Timsort), que aprovecha los tramos ya ordenados', '`sorted` or `.sort()` (Timsort), which takes advantage of the sorted stretches'], ['No se puede ordenar tanto', 'You cannot sort that much']], 2,
        'Timsort es O(n log n), estable y muy rápido con datos casi ordenados.', 'Timsort is O(n log n), stable and very fast on nearly sorted data.'),
      q('Para combinar intervalos que se traslapan, ¿qué haces primero?', 'To merge overlapping intervals, what do you do first?', [['Ordenarlos por su inicio', 'Sort them by their start'], ['Ordenarlos por su longitud', 'Sort them by their length'], ['Meterlos en un set', 'Put them in a set'], ['Invertir la lista', 'Reverse the list']], 0,
        'Ordenados por inicio, basta una pasada comparando con el último intervalo guardado.', 'Sorted by start, one pass comparing with the last saved interval is enough.'),
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
    summary: l('Descartar la mitad en cada paso: la plantilla clásica, buscar "el primero que cumple", arreglos rotados y buscar sobre las respuestas posibles.', 'Discard half at each step: the classic template, finding "the first one that qualifies", rotated arrays and searching over possible answers.'),
    minutes: 20,
    blocks: [
      md(
        `## La idea
**El problema:** buscar un valor en una lista **ordenada**. Revisarla uno por uno cuesta O(n).

**La idea:** mira el elemento **del medio**. Si lo que buscas es mayor, ya sabes que no está en la mitad izquierda: la descartas entera. Si es menor, descartas la derecha. Repites con la mitad que queda.

**Analogía:** el juego de "adivina el número del 1 al 100". Preguntas "¿es 50?" y te dicen "mayor". Ya no pruebas del 1 al 50. Preguntas "¿75?"… Con 7 preguntas como mucho lo encuentras.

Cada paso parte el rango a la mitad, así que son **O(log n)** pasos: con un millón de elementos, unas **20 comparaciones** en lugar de un millón.

**Requisito:** el espacio debe estar **ordenado** (o, más en general, ser **monótono**, como veremos). Sin orden no sabes qué mitad descartar.`,
        `## The idea
**The problem:** finding a value in a **sorted** list. Checking one by one costs O(n).

**The idea:** look at the **middle** element. If what you want is greater, you know it is not in the left half: you discard it entirely. If it is smaller, you discard the right half. Repeat with the half that is left.

**Analogy:** the "guess the number from 1 to 100" game. You ask "is it 50?" and hear "higher". You no longer try 1 to 50. You ask "75?"… In at most 7 questions you find it.

Each step halves the range, so it takes **O(log n)** steps: with a million elements, about **20 comparisons** instead of a million.

**Requirement:** the space must be **sorted** (or, more generally, **monotonic**, as we will see). Without order you do not know which half to discard.`,
      ),
      md(
        `## La plantilla clásica
- \`lo\` y \`hi\` marcan el rango donde todavía puede estar el valor: al inicio, toda la lista.
- \`mid = (lo + hi) // 2\` es la posición del medio.
- Si \`a[mid]\` es el valor, terminas. Si es **menor**, el valor está a la derecha: \`lo = mid + 1\`. Si es **mayor**, está a la izquierda: \`hi = mid - 1\`.
- Se usa \`+ 1\` y \`- 1\` porque \`mid\` ya se revisó.
- Repites \`while lo <= hi\`: mientras el rango tenga al menos un elemento. Si se vacía (\`lo > hi\`), el valor no está.`,
        `## The classic template
- \`lo\` and \`hi\` mark the range where the value can still be: at first, the whole list.
- \`mid = (lo + hi) // 2\` is the middle position.
- If \`a[mid]\` is the value, you are done. If it is **smaller**, the value is to the right: \`lo = mid + 1\`. If it is **greater**, it is to the left: \`hi = mid - 1\`.
- \`+ 1\` and \`- 1\` are used because \`mid\` was already checked.
- You repeat \`while lo <= hi\`: while the range has at least one element. If it becomes empty (\`lo > hi\`), the value is not there.`,
      ),
      code(`def buscar(a, x):
    lo, hi = 0, len(a) - 1           # el rango: toda la lista
    while lo <= hi:                  # mientras quede al menos un candidato
        mid = (lo + hi) // 2
        if a[mid] == x:
            return mid               # encontrado: devuelve la posición
        if a[mid] < x:
            lo = mid + 1             # x está a la derecha de mid
        else:
            hi = mid - 1             # x está a la izquierda de mid
    return -1                        # el rango se vació: no está

a = [1, 3, 5, 7, 9, 11]
print(buscar(a, 9), buscar(a, 4))    # imprime: 4 -1
# Buscando 9: mid=2 (5, menor) → lo=3; mid=4 (9) ✓`),
      md(
        `**Errores típicos:**
- **\`lo < hi\` en vez de \`lo <= hi\`:** cuando \`lo == hi\` todavía queda **un** candidato por revisar. Con \`<\` lo saltarías; por ejemplo, buscando 11 en la lista de arriba.
- **\`lo = mid\` en vez de \`lo = mid + 1\`:** si el rango tiene dos elementos, \`mid\` puede quedarse siempre igual y el ciclo **nunca termina**.

Prueba mentalmente tu código con listas de 1 y 2 elementos: ahí aparecen estos errores.`,
        `**Typical bugs:**
- **\`lo < hi\` instead of \`lo <= hi\`:** when \`lo == hi\` there is still **one** candidate to check. With \`<\` you would skip it; for example, searching for 11 in the list above.
- **\`lo = mid\` instead of \`lo = mid + 1\`:** if the range has two elements, \`mid\` can stay the same forever and the loop **never ends**.

Test your code in your head with lists of 1 and 2 elements: that is where these bugs show up.`,
      ),
      viz('binary-search'),
      md(
        `## Buscar "el primero que cumple"
La búsqueda binaria sirve para algo más que encontrar un valor exacto. Sirve en cualquier situación **monótona**: una condición que es falsa hasta cierto punto y verdadera de ahí en adelante, como **F F F V V V**.

**Ejemplo:** versiones de un programa. A partir de la versión que introdujo un error, **todas** las siguientes también fallan. ¿Cuál fue la **primera** mala? O: en una lista de notas ordenada, ¿en qué posición está la **primera** nota aprobatoria?

La plantilla cambia un poco:
- \`while lo < hi\`: termina cuando \`lo\` y \`hi\` se juntan en la respuesta.
- Si \`mid\` **cumple**, la primera podría ser \`mid\` o estar a su izquierda: \`hi = mid\` (sin \`- 1\`, para no perderla).
- Si **no cumple**, la primera está a la derecha: \`lo = mid + 1\`.`,
        `## Finding "the first one that qualifies"
Binary search is good for more than finding an exact value. It works in any **monotonic** situation: a condition that is false up to some point and true from there on, like **F F F T T T**.

**Example:** versions of a program. From the version that introduced a bug, **every** later one fails too. Which was the **first** bad one? Or: in a sorted list of grades, at what position is the **first** passing grade?

The template changes a little:
- \`while lo < hi\`: it ends when \`lo\` and \`hi\` meet at the answer.
- If \`mid\` **qualifies**, the first one could be \`mid\` or to its left: \`hi = mid\` (no \`- 1\`, so you do not lose it).
- If it **does not qualify**, the first one is to the right: \`lo = mid + 1\`.`,
      ),
      code(`notas = [40, 55, 70, 70, 85, 90]      # ordenadas
lo, hi = 0, len(notas) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if notas[mid] >= 70:      # cumple: la primera es mid o está a su izquierda
        hi = mid
    else:                     # no cumple: la primera está a la derecha
        lo = mid + 1
print(lo)                     # imprime: 2      (la primera nota ≥ 70 está en la posición 2)`),
      md(
        `### Arreglo ordenado y rotado
Una lista ordenada que alguien "giró": [4, 5, 6, 7, 0, 1, 2]. ¿Dónde está el mínimo? Sigue habiendo orden que aprovechar: compara \`a[mid]\` con el último del rango, \`a[hi]\`. Si \`a[mid]\` es **mayor** que \`a[hi]\`, en medio hay un "salto" hacia abajo, así que el mínimo está a la derecha de \`mid\`. Si no, el mínimo es \`mid\` o está a su izquierda. Es la plantilla de "el primero que cumple": **O(log n)**.

## Búsqueda binaria sobre la respuesta
A veces **no hay lista**, pero las **respuestas posibles** están ordenadas y puedes revisar cada una con un sí/no monótono. Entonces buscas binariamente entre las respuestas. Por ejemplo: "¿cuál es el menor número k tal que k × k ≥ x?". Para k pequeños la respuesta es no; a partir de cierto k, siempre sí. Otros casos: "la velocidad mínima para terminar a tiempo" o "la capacidad mínima de un camión para repartir en d días".`,
        `### Sorted and rotated array
A sorted list that someone "rotated": [4, 5, 6, 7, 0, 1, 2]. Where is the minimum? There is still order to exploit: compare \`a[mid]\` with the last one in the range, \`a[hi]\`. If \`a[mid]\` is **greater** than \`a[hi]\`, there is a downward "jump" in between, so the minimum is to the right of \`mid\`. If not, the minimum is \`mid\` or to its left. It is the "first one that qualifies" template: **O(log n)**.

## Binary search on the answer
Sometimes **there is no list**, but the **possible answers** are ordered and you can check each one with a monotonic yes/no. Then you binary search among the answers. For example: "what is the smallest number k such that k × k ≥ x?". For small k the answer is no; from a certain k on, always yes. Other cases: "the minimum speed to finish on time" or "the minimum truck capacity to deliver in d days".`,
      ),
      code(`def menor_k(x):                 # el menor k tal que k * k >= x
    lo, hi = 0, x                  # las respuestas posibles van de 0 a x
    while lo < hi:
        mid = (lo + hi) // 2
        if mid * mid >= x:         # cumple: la respuesta es mid o una menor
            hi = mid
        else:                      # no cumple: hay que subir
            lo = mid + 1
    return lo

print(menor_k(17), menor_k(25))    # imprime: 5 5`),
      warn('En Java o C++, `(lo + hi) / 2` puede **desbordarse** si `lo + hi` pasa del máximo de un entero; por eso se escribe `lo + (hi - lo) / 2`. En Python los enteros no se desbordan, así que `(lo + hi) // 2` está bien.', 'In Java or C++, `(lo + hi) / 2` can **overflow** if `lo + hi` exceeds the maximum integer; that is why it is written `lo + (hi - lo) / 2`. In Python integers do not overflow, so `(lo + hi) // 2` is fine.'),
      md(
        `## Resumen
| Caso | Ciclo | Si \`mid\` cumple / es menor | Resultado |
|---|---|---|---|
| Buscar un valor exacto | \`while lo <= hi\` | \`lo = mid + 1\` o \`hi = mid - 1\` | La posición, o -1 si el rango se vacía |
| El primero que cumple (F F V V) | \`while lo < hi\` | Cumple: \`hi = mid\`; no cumple: \`lo = mid + 1\` | \`lo\` |
| Mínimo de un arreglo rotado | \`while lo < hi\` | \`a[mid] > a[hi]\`: \`lo = mid + 1\`; si no: \`hi = mid\` | \`a[lo]\` |
| Sobre la respuesta | Igual que "el primero que cumple" | Sobre el rango de respuestas posibles | La menor respuesta válida |

Todas son **O(log n)** de tiempo y **O(1)** de espacio. Requisito: orden o una condición **monótona**.`,
        `## Summary
| Case | Loop | If \`mid\` qualifies / is smaller | Result |
|---|---|---|---|
| Find an exact value | \`while lo <= hi\` | \`lo = mid + 1\` or \`hi = mid - 1\` | The position, or -1 if the range empties |
| The first one that qualifies (F F T T) | \`while lo < hi\` | Qualifies: \`hi = mid\`; does not: \`lo = mid + 1\` | \`lo\` |
| Minimum of a rotated array | \`while lo < hi\` | \`a[mid] > a[hi]\`: \`lo = mid + 1\`; otherwise: \`hi = mid\` | \`a[lo]\` |
| On the answer | Same as "the first one that qualifies" | Over the range of possible answers | The smallest valid answer |

All are **O(log n)** time and **O(1)** space. Requirement: order or a **monotonic** condition.`,
      ),
    ],
    quiz: [
      q('¿Qué requisito tiene la búsqueda binaria?', 'What does binary search require?', [['Arreglo sin duplicados', 'Array without duplicates'], ['Espacio ordenado o monótono', 'Sorted or monotonic space'], ['Lista enlazada', 'Linked list'], ['Tamaño potencia de 2', 'Size a power of 2']], 1,
        'Sin orden no puedes saber qué mitad descartar.', 'Without order you cannot know which half to discard.'),
      q('¿Cuántos pasos necesita, aproximadamente, para 1,000,000 de elementos?', 'Roughly how many steps for 1,000,000 elements?', [['20', '20'], ['1000', '1000'], ['500,000', '500,000'], ['1,000,000', '1,000,000']], 0, 'log₂(10⁶) ≈ 20.', 'log₂(10⁶) ≈ 20.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué complejidad tiene la búsqueda binaria?', 'What is the complexity of binary search?', [['O(n) de tiempo', 'O(n) time'], ['O(log n) de tiempo y O(1) de espacio', 'O(log n) time and O(1) space'], ['O(n log n)', 'O(n log n)'], ['O(1)', 'O(1)']], 1,
        'Cada paso parte el rango a la mitad y solo usa unas variables.', 'Each step halves the range and only uses a few variables.'),
      q('Buscas `x` y `a[mid]` es **menor** que `x`. ¿Qué haces?', 'You search for `x` and `a[mid]` is **smaller** than `x`. What do you do?', [['`hi = mid - 1`', '`hi = mid - 1`'], ['`lo = mid + 1`', '`lo = mid + 1`'], ['`lo = mid`', '`lo = mid`'], ['Terminar: no está', 'Stop: it is not there']], 1,
        'Si el del medio es menor, `x` solo puede estar a la derecha.', 'If the middle one is smaller, `x` can only be to the right.'),
      q('En la plantilla clásica, ¿por qué el ciclo es `while lo <= hi` y no `lo < hi`?', 'In the classic template, why is the loop `while lo <= hi` and not `lo < hi`?', [['Porque cuando `lo == hi` todavía queda un candidato por revisar', 'Because when `lo == hi` there is still one candidate to check'], ['Por costumbre: da igual', 'Out of habit: it does not matter'], ['Para que sea más rápido', 'To make it faster'], ['Porque `<` da error en Python', 'Because `<` fails in Python']], 0,
        'Con `<` te saltarías ese último elemento, por ejemplo al buscar el último de la lista.', 'With `<` you would skip that last element, for example when searching for the last one in the list.'),
      q('¿Qué puede pasar si escribes `lo = mid` en vez de `lo = mid + 1` en la plantilla clásica?', 'What can happen if you write `lo = mid` instead of `lo = mid + 1` in the classic template?', [['Nada, funciona igual', 'Nothing, it works the same'], ['Que encuentre el valor más rápido', 'That it finds the value faster'], ['Un ciclo infinito: `mid` puede quedarse siempre igual', 'An infinite loop: `mid` can stay the same forever'], ['Que devuelva -1 siempre', 'That it always returns -1']], 2,
        'Con un rango de dos elementos, `mid` es `lo` y el rango nunca se achica.', 'With a two-element range, `mid` is `lo` and the range never shrinks.'),
      q('¿Qué significa que una condición sea **monótona** en este contexto?', 'What does it mean for a condition to be **monotonic** here?', [['Que siempre es verdadera', 'That it is always true'], ['Que es falsa hasta cierto punto y verdadera de ahí en adelante (F F F V V)', 'That it is false up to some point and true from there on (F F F T T)'], ['Que alterna verdadero y falso', 'That it alternates true and false'], ['Que no depende de la posición', 'That it does not depend on the position']], 1,
        'Por eso se puede buscar "el primero que cumple" con búsqueda binaria.', 'That is why you can binary search "the first one that qualifies".'),
      q('Buscando el **primero** que cumple, `mid` cumple. ¿Qué haces?', 'Searching for the **first** one that qualifies, `mid` qualifies. What do you do?', [['`hi = mid`, porque `mid` podría ser el primero', '`hi = mid`, because `mid` could be the first'], ['`hi = mid - 1`', '`hi = mid - 1`'], ['`lo = mid + 1`', '`lo = mid + 1`'], ['Devolver `mid` de inmediato', 'Return `mid` immediately']], 0,
        'Con `hi = mid - 1` podrías perder justo al primero que cumple.', 'With `hi = mid - 1` you could lose the very first one that qualifies.'),
      q('Mínimo de `[4, 5, 6, 7, 0, 1, 2]` con búsqueda binaria: si `a[mid] > a[hi]`, ¿dónde está el mínimo?', 'Minimum of `[4, 5, 6, 7, 0, 1, 2]` with binary search: if `a[mid] > a[hi]`, where is the minimum?', [['En `mid`', 'At `mid`'], ['A la izquierda de `mid`', 'To the left of `mid`'], ['A la derecha de `mid`', 'To the right of `mid`'], ['En la posición 0', 'At position 0']], 2,
        'Hay un "salto" hacia abajo entre `mid` y `hi`: ahí está el mínimo.', 'There is a downward "jump" between `mid` and `hi`: the minimum is there.'),
      q('¿Qué es la **búsqueda binaria sobre la respuesta**?', 'What is **binary search on the answer**?', [['Buscar en la lista de respuestas de un examen', 'Searching a list of exam answers'], ['Buscar binariamente entre las respuestas posibles cuando se pueden revisar con un sí/no monótono', 'Binary searching among the possible answers when they can be checked with a monotonic yes/no'], ['Ordenar las respuestas primero', 'Sorting the answers first'], ['Buscar la respuesta con dos punteros', 'Finding the answer with two pointers']], 1,
        'Ejemplos: el menor k con k × k ≥ x, o la velocidad mínima para terminar a tiempo.', 'Examples: the smallest k with k × k ≥ x, or the minimum speed to finish on time.'),
      q('¿Por qué en Java o C++ se escribe `mid = lo + (hi - lo) / 2`?', 'Why do Java or C++ use `mid = lo + (hi - lo) / 2`?', [['Porque es más rápido', 'Because it is faster'], ['Para evitar que `lo + hi` se desborde del máximo de un entero', 'To avoid `lo + hi` overflowing the maximum integer'], ['Porque da otro resultado', 'Because it gives a different result'], ['Por estilo', 'For style']], 1,
        'En Python los enteros no se desbordan, así que `(lo + hi) // 2` está bien.', 'In Python integers do not overflow, so `(lo + hi) // 2` is fine.'),
      q('En la plantilla clásica, ¿qué significa que al final `lo > hi`?', 'In the classic template, what does it mean when `lo > hi` at the end?', [['Que el valor está en `lo`', 'That the value is at `lo`'], ['Que la lista no estaba ordenada', 'That the list was not sorted'], ['Que el rango se vació: el valor no está', 'That the range is empty: the value is not there'], ['Que hubo un error', 'That there was an error']], 2,
        'Por eso la función devuelve -1.', 'That is why the function returns -1.'),
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
    summary: l('Qué es un árbol, cómo resolver problemas de árboles con recursión, los 4 recorridos, los árboles binarios de búsqueda y el trie.', 'What a tree is, how to solve tree problems with recursion, the 4 traversals, binary search trees and the trie.'),
    minutes: 25,
    blocks: [
      md(
        `## ¿Qué es un árbol?
Un **árbol** guarda datos **jerárquicos**: las carpetas de tu computadora, el organigrama de una empresa. Se dibuja de arriba hacia abajo:
- Cada elemento es un **nodo**. El de hasta arriba es la **raíz**.
- Los nodos que cuelgan de otro son sus **hijos**, y él es su **padre**.
- Un nodo sin hijos es una **hoja**.
- La **altura** es cuántos niveles tiene: los nodos del camino más largo de la raíz a una hoja. (Algunos libros cuentan las flechas en vez de los niveles; con esa cuenta una hoja sola mide 0.)

En un **árbol binario** cada nodo tiene **como mucho dos hijos**: el **izquierdo** (\`izq\`) y el **derecho** (\`der\`). Igual que en una lista enlazada, cada nodo es un objeto con su valor y sus flechas; aquí son dos flechas en vez de una.`,
        `## What is a tree?
A **tree** stores **hierarchical** data: the folders on your computer, a company's org chart. It is drawn top to bottom:
- Each element is a **node**. The one at the very top is the **root**.
- The nodes hanging from another are its **children**, and it is their **parent**.
- A node with no children is a **leaf**.
- The **height** is how many levels it has: the nodes on the longest path from the root to a leaf. (Some books count arrows instead of levels; with that count a single leaf measures 0.)

In a **binary tree** each node has **at most two children**: the **left** one (\`izq\`) and the **right** one (\`der\`). Just like in a linked list, each node is an object with its value and its arrows; here there are two arrows instead of one.`,
      ),
      code(`class Nodo:
    def __init__(self, val, izq=None, der=None):
        self.val = val
        self.izq = izq      # hijo izquierdo (None si no tiene)
        self.der = der      # hijo derecho

#        1          ← raíz
#       / \\
#      2   3        ← 3 es una hoja
#     /
#    4              ← hoja
raiz = Nodo(1, Nodo(2, Nodo(4)), Nodo(3))
print(raiz.val, raiz.izq.val, raiz.der.val, raiz.izq.izq.val)   # imprime: 1 2 3 4`),
      md(
        `## Pensar en árboles con recursión
Cada hijo es, a su vez, la raíz de un árbol más pequeño (un **subárbol**). Por eso casi todos los problemas de árboles se resuelven con recursión, usando esta pregunta:

> "Si ya supiera la respuesta para el subárbol izquierdo y para el derecho, ¿cómo calculo la de este nodo?"

- **Caso base:** el árbol vacío (\`None\`). Su respuesta suele ser 0, \`True\` o una lista vacía.
- **Suma de todos los valores:** el valor de este nodo + la suma de la izquierda + la suma de la derecha.
- **Altura:** 1 (este nivel) + la altura del lado más alto.

Cada nodo se visita una vez: **O(n)** de tiempo. La pila de llamadas llega a la altura del árbol: **O(h)** de espacio.`,
        `## Thinking about trees with recursion
Each child is, in turn, the root of a smaller tree (a **subtree**). That is why almost every tree problem is solved with recursion, using this question:

> "If I already knew the answer for the left subtree and the right one, how would I compute this node's?"

- **Base case:** the empty tree (\`None\`). Its answer is usually 0, \`True\` or an empty list.
- **Sum of all values:** this node's value + the sum on the left + the sum on the right.
- **Height:** 1 (this level) + the height of the taller side.

Each node is visited once: **O(n)** time. The call stack reaches the tree's height: **O(h)** space.`,
      ),
      code(`def suma(n):
    if not n:                                    # caso base: árbol vacío
        return 0
    return n.val + suma(n.izq) + suma(n.der)     # este nodo + lo de cada lado

def altura(n):
    if not n:
        return 0
    return 1 + max(altura(n.izq), altura(n.der)) # este nivel + el lado más alto

print(suma(raiz), altura(raiz))                  # imprime: 10 3`),
      md(
        `## Los recorridos
Recorrer un árbol es visitar todos sus nodos. Los tres recorridos "en profundidad" bajan por un lado hasta el fondo antes de pasar al otro; solo cambia **cuándo visitas el nodo** respecto a sus hijos:
- **Preorden:** el nodo **antes** que sus hijos → nodo, izquierda, derecha. Sirve para copiar o guardar un árbol.
- **Inorden:** el nodo **en medio** → izquierda, nodo, derecha. En un árbol binario de búsqueda da los valores **ordenados**.
- **Postorden:** el nodo **después** de sus hijos → izquierda, derecha, nodo. Sirve cuando necesitas la respuesta de los hijos primero, como en \`altura\`.

**Truco para recordarlos:** pre/in/post dice cuándo va el nodo: antes, en medio o después.`,
        `## Traversals
Traversing a tree means visiting all its nodes. The three "depth-first" traversals go down one side to the bottom before moving to the other; the only thing that changes is **when you visit the node** relative to its children:
- **Preorder:** the node **before** its children → node, left, right. Useful for copying or saving a tree.
- **Inorder:** the node **in the middle** → left, node, right. On a binary search tree it yields the values **in sorted order**.
- **Postorder:** the node **after** its children → left, right, node. Useful when you need the children's answer first, as in \`altura\`.

**Trick to remember them:** pre/in/post says when the node goes: before, in the middle or after.`,
      ),
      code(`def preorden(n, out):
    if n:
        out.append(n.val)       # el nodo primero
        preorden(n.izq, out)
        preorden(n.der, out)

def inorden(n, out):
    if n:
        inorden(n.izq, out)
        out.append(n.val)       # el nodo en medio
        inorden(n.der, out)

def postorden(n, out):
    if n:
        postorden(n.izq, out)
        postorden(n.der, out)
        out.append(n.val)       # el nodo al final

a, b, c = [], [], []
preorden(raiz, a)
inorden(raiz, b)
postorden(raiz, c)
print(a)
print(b)
print(c)
# imprime:
# [1, 2, 4, 3]
# [4, 2, 1, 3]
# [4, 2, 3, 1]`),
      md(
        `### Recorrido por niveles (BFS)
El cuarto recorrido visita el árbol **nivel por nivel**, de arriba hacia abajo y de izquierda a derecha: 1, luego 2 y 3, luego 4. Usa una **cola**: sacas un nodo, lo visitas y formas a sus hijos al final. Como los hijos esperan detrás de los de su nivel, salen en orden de niveles.

\`deque([raiz])\` crea una cola que ya contiene la raíz. Si necesitas separar los niveles, al inicio de cada vuelta \`len(cola)\` es justo cuántos nodos tiene el nivel actual, y \`for _ in range(len(cola)):\` los saca a todos (el \`_\` es una variable que no vas a usar).`,
        `### Level-order traversal (BFS)
The fourth traversal visits the tree **level by level**, top to bottom and left to right: 1, then 2 and 3, then 4. It uses a **queue**: you take a node out, visit it and line up its children at the end. Since children wait behind the nodes of their level, they come out in level order.

\`deque([raiz])\` creates a queue that already contains the root. If you need to separate the levels, at the start of each round \`len(cola)\` is exactly how many nodes the current level has, and \`for _ in range(len(cola)):\` takes them all out (\`_\` is a variable you will not use).`,
      ),
      code(`from collections import deque

def por_niveles(raiz):
    orden = []
    cola = deque([raiz])          # empieza con la raíz
    while cola:
        n = cola.popleft()        # el primero que llegó
        orden.append(n.val)
        if n.izq:
            cola.append(n.izq)    # sus hijos se forman al final
        if n.der:
            cola.append(n.der)
    return orden

print(por_niveles(raiz))          # imprime: [1, 2, 3, 4]`),
      md(
        `## Árbol binario de búsqueda (BST)
Un **BST** (*binary search tree*) es un árbol binario con una regla: para **cada** nodo, **todo** lo que está a su izquierda es **menor** y **todo** lo que está a su derecha es **mayor**.

Es la búsqueda binaria en forma de árbol: para buscar un valor empiezas en la raíz y en cada nodo vas a la izquierda o a la derecha, **descartando un lado entero**.
- **Buscar e insertar** cuestan **O(h)**, donde h es la altura.
- **Insertar:** bajas como si buscaras el valor (menor → izquierda, mayor → derecha) hasta encontrar un lugar vacío, y ahí creas el nodo.
- El recorrido **inorden** de un BST da los valores **ordenados**, porque visita primero todo lo menor (izquierda), luego el nodo y luego todo lo mayor.`,
        `## Binary search tree (BST)
A **BST** is a binary tree with one rule: for **every** node, **everything** on its left is **smaller** and **everything** on its right is **larger**.

It is binary search in tree form: to find a value you start at the root and at each node go left or right, **discarding an entire side**.
- **Search and insert** cost **O(h)**, where h is the height.
- **Insert:** go down as if searching for the value (smaller → left, larger → right) until you find an empty spot, and create the node there.
- The **inorder** traversal of a BST yields the values **in sorted order**, because it visits everything smaller first (left), then the node, then everything larger.`,
      ),
      viz('bst'),
      code(`def insertar(n, v):
    if not n:
        return Nodo(v)                  # lugar vacío: aquí va el nodo nuevo
    if v < n.val:
        n.izq = insertar(n.izq, v)      # menor: a la izquierda
    else:
        n.der = insertar(n.der, v)      # mayor: a la derecha
    return n

def existe(n, v):
    while n:
        if v == n.val:
            return True
        n = n.izq if v < n.val else n.der   # descarta un lado completo
    return False

arbol = None
for v in [8, 3, 10, 1, 6]:
    arbol = insertar(arbol, v)
print(existe(arbol, 6), existe(arbol, 7))   # imprime: True False`),
      md(
        `### Balanceado vs degenerado
Que buscar cueste O(h) es bueno **si el árbol está balanceado**: sus lados tienen alturas parecidas y h ≈ log₂(n). Pero si insertas valores **ya ordenados** (1, 2, 3, 4, 5), cada uno va a la derecha del anterior y el árbol se vuelve una **lista**: h = n y buscar cuesta **O(n)**.

Los árboles **autobalanceados** (AVL, rojo-negro) se reacomodan solos al insertar para que la altura siga siendo O(log n). En una entrevista basta con mencionarlos; no te pedirán programarlos.

### Validar un BST
No basta con comparar cada nodo con sus dos hijos: la regla es sobre **todo** el subárbol. En el árbol 5 → (izq 1, der 4), el 4 es hijo derecho de 5 pero es menor que 5: no es un BST. La forma correcta es pasar a cada nodo el **rango permitido** (\`lo\`, \`hi\`): al bajar a la izquierda, el valor del nodo pasa a ser el nuevo máximo; al bajar a la derecha, el nuevo mínimo. \`float("inf")\` es infinito: sirve como rango inicial sin límites.`,
        `### Balanced vs degenerate
Search costing O(h) is good **if the tree is balanced**: its sides have similar heights and h ≈ log₂(n). But if you insert **already sorted** values (1, 2, 3, 4, 5), each goes to the right of the previous one and the tree becomes a **list**: h = n and search costs **O(n)**.

**Self-balancing** trees (AVL, red-black) rearrange themselves on insert so the height stays O(log n). In an interview it is enough to mention them; you will not be asked to code them.

### Validating a BST
Comparing each node with its two children is not enough: the rule is about the **whole** subtree. In the tree 5 → (left 1, right 4), 4 is the right child of 5 but smaller than 5: it is not a BST. The right way is to pass each node its **allowed range** (\`lo\`, \`hi\`): going down to the left, the node's value becomes the new maximum; going right, the new minimum. \`float("inf")\` is infinity: it works as the initial range with no limits.`,
      ),
      md(
        `## Trie (árbol de prefijos)
Un **trie** es un árbol especial para guardar **palabras**. Cada nodo representa una letra y el camino desde la raíz forma la palabra. Las palabras que empiezan igual **comparten** el camino: "sol" y "solo" usan los mismos nodos s → o → l.

Buscar una palabra o saber si alguna empieza con un prefijo cuesta **O(L)**, donde L es el largo de la palabra, **sin importar cuántas palabras** haya guardadas. Por eso se usa en el **autocompletado** y en los correctores.

Cada nodo guarda un diccionario \`hijos\` (letra → nodo siguiente) y una marca \`fin\` que dice si ahí termina una palabra (para distinguir "sol" de un simple prefijo de "solo").`,
        `## Trie (prefix tree)
A **trie** is a special tree for storing **words**. Each node represents a letter and the path from the root spells the word. Words that start the same way **share** the path: "sol" and "solo" use the same nodes s → o → l.

Searching a word or checking whether any word starts with a prefix costs **O(L)**, where L is the word length, **no matter how many words** are stored. That is why it is used for **autocomplete** and spell checkers.

Each node keeps a dictionary \`hijos\` (letter → next node) and a flag \`fin\` saying whether a word ends there (to tell "sol" apart from a mere prefix of "solo").`,
      ),
      code(`class Trie:
    def __init__(self):
        self.hijos = {}           # letra → nodo siguiente
        self.fin = False          # ¿termina una palabra aquí?

    def insertar(self, palabra):
        nodo = self               # empieza en la raíz
        for c in palabra:
            nodo = nodo.hijos.setdefault(c, Trie())   # crea el hijo si no existe y baja
        nodo.fin = True           # marca el fin de la palabra

    def empieza_con(self, prefijo):
        nodo = self
        for c in prefijo:
            if c not in nodo.hijos:
                return False      # el camino se corta: ninguna palabra empieza así
            nodo = nodo.hijos[c]
        return True

t = Trie()
for p in ["sol", "solo", "sal"]:
    t.insertar(p)
print(t.empieza_con("so"), t.empieza_con("su"))   # imprime: True False`),
      tip('Plantilla mental para cualquier problema de árboles: "si supiera la respuesta para el hijo izquierdo y el derecho, ¿cómo calculo la de este nodo?". Y no olvides el caso base: el árbol vacío.', 'Mental template for any tree problem: "if I knew the answer for the left and right child, how would I compute this node\'s?". And do not forget the base case: the empty tree.'),
      md(
        `## Resumen
| Concepto | En una frase | Costo |
|---|---|---|
| Recursión en árboles | Respuesta de este nodo = combinar la de sus dos hijos; caso base \`None\` | O(n) tiempo, O(h) espacio |
| Preorden / inorden / postorden | El nodo antes / en medio / después de sus hijos | O(n) |
| Por niveles (BFS) | Con una cola, nivel por nivel | O(n) |
| BST | Izquierda menor, derecha mayor; inorden da los valores ordenados | Buscar e insertar O(h) |
| Balanceado / degenerado | h ≈ log n / h = n (por insertar datos ordenados) | O(log n) / O(n) |
| Validar un BST | Pasar el rango permitido (\`lo\`, \`hi\`) a cada nodo | O(n) |
| Trie | Un nodo por letra; las palabras comparten prefijos | O(L) por palabra |`,
        `## Summary
| Concept | In one sentence | Cost |
|---|---|---|
| Recursion on trees | This node's answer = combine its two children's; base case \`None\` | O(n) time, O(h) space |
| Preorder / inorder / postorder | The node before / in the middle / after its children | O(n) |
| Level order (BFS) | With a queue, level by level | O(n) |
| BST | Left smaller, right larger; inorder yields sorted values | Search and insert O(h) |
| Balanced / degenerate | h ≈ log n / h = n (from inserting sorted data) | O(log n) / O(n) |
| Validating a BST | Pass the allowed range (\`lo\`, \`hi\`) to each node | O(n) |
| Trie | One node per letter; words share prefixes | O(L) per word |`,
      ),
    ],
    quiz: [
      q('¿Qué recorrido de un BST devuelve los valores ordenados?', 'Which BST traversal returns values in sorted order?', [['Preorden', 'Preorder'], ['Inorden', 'Inorder'], ['Postorden', 'Postorder'], ['Por niveles', 'Level order']], 1, 'izq < nodo < der.', 'left < node < right.'),
      q('¿Cuál es la complejidad de buscar en un BST desbalanceado (peor caso)?', 'What is the worst-case search complexity in an unbalanced BST?', [['O(1)', 'O(1)'], ['O(log n)', 'O(log n)'], ['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)']], 2,
        'Si se degenera en una lista, la altura es n.', 'If it degenerates into a list, the height is n.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es una **hoja** en un árbol?', 'What is a **leaf** in a tree?', [['La raíz', 'The root'], ['Un nodo sin hijos', 'A node with no children'], ['Un nodo con dos hijos', 'A node with two children'], ['El nodo más grande', 'The largest node']], 1,
        'En el árbol 1 → (2 → 4, 3), las hojas son 4 y 3.', 'In the tree 1 → (2 → 4, 3), the leaves are 4 and 3.'),
      q('Contando niveles, ¿qué altura tiene el árbol 1 → (izq 2 → (izq 4), der 3)?', 'Counting levels, what is the height of the tree 1 → (left 2 → (left 4), right 3)?', [['2', '2'], ['4', '4'], ['3', '3'], ['1', '1']], 2,
        'El camino más largo es 1 → 2 → 4: tres niveles.', 'The longest path is 1 → 2 → 4: three levels.'),
      q('En una función recursiva sobre un árbol, ¿cuál suele ser el caso base?', 'In a recursive function on a tree, what is the usual base case?', [['El árbol vacío (`None`)', 'The empty tree (`None`)'], ['La raíz', 'The root'], ['El nodo más grande', 'The largest node'], ['No hay caso base', 'There is no base case']], 0,
        'Para `None` se devuelve 0, `True` o una lista vacía, según el problema.', 'For `None` you return 0, `True` or an empty list, depending on the problem.'),
      q('¿En qué orden visita los nodos el **preorden**?', 'In what order does **preorder** visit the nodes?', [['Izquierda, nodo, derecha', 'Left, node, right'], ['Nodo, izquierda, derecha', 'Node, left, right'], ['Izquierda, derecha, nodo', 'Left, right, node'], ['Nivel por nivel', 'Level by level']], 1,
        'Pre = el nodo antes que sus hijos.', 'Pre = the node before its children.'),
      q('¿Cuándo visita el nodo el **postorden**?', 'When does **postorder** visit the node?', [['Antes que sus hijos', 'Before its children'], ['Entre el hijo izquierdo y el derecho', 'Between the left and right child'], ['Después de sus dos hijos', 'After both its children'], ['Nunca', 'Never']], 2,
        'Por eso sirve cuando necesitas la respuesta de los hijos primero, como en la altura.', 'That is why it is useful when you need the children\'s answer first, as with height.'),
      q('¿Qué estructura usa el recorrido por niveles?', 'Which structure does level-order traversal use?', [['Una pila', 'A stack'], ['Un set', 'A set'], ['Un heap', 'A heap'], ['Una cola', 'A queue']], 3,
        'Los hijos se forman al final y esperan detrás de los de su nivel.', 'Children line up at the end and wait behind the nodes of their level.'),
      q('¿Qué regla cumple un BST?', 'What rule does a BST follow?', [['Cada nodo tiene dos hijos', 'Every node has two children'], ['Para cada nodo, todo lo de su izquierda es menor y todo lo de su derecha es mayor', 'For every node, everything on its left is smaller and everything on its right is larger'], ['La raíz es el valor más pequeño', 'The root is the smallest value'], ['Está ordenado por niveles', 'It is sorted by levels']], 1,
        'La regla aplica a todo el subárbol, no solo a los hijos directos.', 'The rule applies to the whole subtree, not just the direct children.'),
      q('Insertas 5 en un BST cuya raíz es 8. ¿Hacia dónde vas?', 'You insert 5 into a BST whose root is 8. Which way do you go?', [['A la izquierda, porque 5 es menor que 8', 'Left, because 5 is smaller than 8'], ['A la derecha', 'Right'], ['Reemplazas la raíz', 'You replace the root'], ['Al final del árbol', 'To the end of the tree']], 0,
        'Bajas como si buscaras el 5 hasta encontrar un lugar vacío.', 'You go down as if searching for 5 until you find an empty spot.'),
      q('Insertas 1, 2, 3, 4, 5 en ese orden en un BST vacío. ¿Qué pasa?', 'You insert 1, 2, 3, 4, 5 in that order into an empty BST. What happens?', [['Queda perfectamente balanceado', 'It ends up perfectly balanced'], ['Da error', 'It fails'], ['Se vuelve una "lista": cada uno a la derecha del anterior y buscar cuesta O(n)', 'It becomes a "list": each to the right of the previous one and search costs O(n)'], ['Se ordena al revés', 'It sorts in reverse']], 2,
        'Por eso existen los árboles autobalanceados (AVL, rojo-negro).', 'That is why self-balancing trees (AVL, red-black) exist.'),
      q('¿Por qué no basta comparar cada nodo con sus dos hijos para validar un BST?', 'Why is comparing each node with its two children not enough to validate a BST?', [['Porque es muy lento', 'Because it is too slow'], ['Porque la regla es sobre todo el subárbol: hay que pasar el rango permitido a cada nodo', 'Because the rule is about the whole subtree: you must pass each node its allowed range'], ['Porque las hojas no tienen hijos', 'Because leaves have no children'], ['Sí basta', 'It is enough']], 1,
        'Un nieto puede romper la regla con un ancestro aunque cumpla con su padre.', 'A grandchild can break the rule with an ancestor even if it is fine with its parent.'),
      q('En un trie, ¿cuánto cuesta saber si alguna palabra empieza con un prefijo de largo L?', 'In a trie, how much does it cost to check whether any word starts with a prefix of length L?', [['O(n), donde n es el número de palabras', 'O(n), where n is the number of words'], ['O(L), sin importar cuántas palabras haya', 'O(L), no matter how many words there are'], ['O(1)', 'O(1)'], ['O(n · L)', 'O(n · L)']], 1,
        'Solo bajas una letra por nivel siguiendo el camino del prefijo.', 'You just go down one letter per level following the prefix path.'),
      q('¿Para qué se usa típicamente un trie?', 'What is a trie typically used for?', [['Ordenar números', 'Sorting numbers'], ['Encontrar el mínimo', 'Finding the minimum'], ['Autocompletado y correctores de palabras', 'Autocomplete and spell checkers'], ['Detectar ciclos', 'Detecting cycles']], 2,
        'Las palabras que empiezan igual comparten nodos.', 'Words that start the same way share nodes.'),
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
    summary: l('Cómo tener siempre a mano el elemento más pequeño (o más grande): qué es un heap, cómo se guarda, cuánto cuesta y cómo usarlo con heapq.', 'How to always have the smallest (or largest) element at hand: what a heap is, how it is stored, what it costs and how to use it with heapq.'),
    minutes: 20,
    blocks: [
      md(
        `## El problema: atender siempre lo más urgente
En una sala de urgencias no se atiende por orden de llegada: se atiende primero al paciente **más grave**, y siguen llegando pacientes todo el tiempo. Necesitas una estructura que te dé **siempre el más importante** y que acepte nuevos rápido. Eso es una **cola de prioridad**.

¿Y una lista ordenada? Ver el más importante sería O(1), pero **cada inserción** cuesta O(n), porque hay que mover elementos para hacerle lugar. Con muchas inserciones sale caro.

Un **heap** es la forma eficiente de implementar una cola de prioridad:
| Operación | Costo |
|---|---|
| Ver el mínimo | **O(1)** |
| Insertar | **O(log n)** |
| Sacar el mínimo | **O(log n)** |
| Construir un heap con n elementos | **O(n)** |

## ¿Qué es un heap?
Un **min-heap** es un árbol binario donde **cada padre es menor o igual que sus hijos**. Por eso el **mínimo siempre está en la raíz**. (En un **max-heap** es al revés: cada padre es mayor y el máximo está en la raíz.)

**Ojo:** un heap **no está ordenado** por completo. Solo garantiza que cada padre es menor que sus hijos; entre hermanos o entre ramas distintas no hay ningún orden.

**Analogía:** un organigrama donde cada jefe es más urgente que las personas a su cargo. No sabes cómo se comparan dos personas de áreas distintas, pero sí sabes que la más urgente de todas está hasta arriba.`,
        `## The problem: always handling the most urgent
In an emergency room patients are not seen in arrival order: the **most critical** one goes first, and patients keep arriving all the time. You need a structure that **always gives you the most important one** and accepts new ones quickly. That is a **priority queue**.

What about a sorted list? Seeing the most important would be O(1), but **every insertion** costs O(n), because elements must move to make room. With many insertions it gets expensive.

A **heap** is the efficient way to implement a priority queue:
| Operation | Cost |
|---|---|
| Peek at the minimum | **O(1)** |
| Insert | **O(log n)** |
| Remove the minimum | **O(log n)** |
| Build a heap from n elements | **O(n)** |

## What is a heap?
A **min-heap** is a binary tree where **every parent is less than or equal to its children**. That is why the **minimum is always at the root**. (In a **max-heap** it is the other way around: every parent is larger and the maximum is at the root.)

**Careful:** a heap is **not fully sorted**. It only guarantees each parent is smaller than its children; between siblings or different branches there is no order at all.

**Analogy:** an org chart where each boss is more urgent than the people under them. You do not know how two people from different areas compare, but you do know the most urgent of all is at the top.`,
      ),
      md(
        `## Se guarda en una lista
Un heap es un árbol **completo**: todos sus niveles están llenos, salvo quizá el último, que se llena de izquierda a derecha. Gracias a eso se guarda en una **lista normal**, sin nodos ni flechas, leyendo el árbol nivel por nivel:

\`\`\`
         1          posición 0
       /   \\
      3     2       posiciones 1 y 2
     / \\
    7   4           posiciones 3 y 4

lista: [1, 3, 2, 7, 4]
\`\`\`

Para el elemento de la posición \`i\`:
- sus hijos están en **\`2 * i + 1\`** y **\`2 * i + 2\`**;
- su padre está en **\`(i - 1) // 2\`**.`,
        `## It is stored in a list
A heap is a **complete** tree: all its levels are full except maybe the last, which fills left to right. Thanks to that it is stored in a **regular list**, with no nodes or arrows, reading the tree level by level:

\`\`\`
         1          position 0
       /   \\
      3     2       positions 1 and 2
     / \\
    7   4           positions 3 and 4

list: [1, 3, 2, 7, 4]
\`\`\`

For the element at position \`i\`:
- its children are at **\`2 * i + 1\`** and **\`2 * i + 2\`**;
- its parent is at **\`(i - 1) // 2\`**.`,
      ),
      code(`h = [1, 3, 2, 7, 4]
i = 1                                   # el 3
print(h[2 * i + 1], h[2 * i + 2])       # imprime: 7 4     (sus hijos)
print(h[(i - 1) // 2])                  # imprime: 1       (su padre)`),
      md(
        `## Insertar y sacar el mínimo
- **Insertar:** pones el elemento nuevo **al final** de la lista y lo **subes**: lo comparas con su padre y, si es menor, intercambian lugar. Repites hasta que su padre sea menor o llegue a la raíz.
- **Sacar el mínimo:** tomas la raíz. Pones en su lugar al **último** elemento y lo **bajas**: lo intercambias con el **menor** de sus hijos hasta que ya no sea mayor que ellos.

En los dos casos el elemento viaja por un solo camino de arriba abajo, y un árbol completo de n elementos tiene unos log₂(n) niveles: **O(log n)**.

**Construir** un heap a partir de una lista (\`heapify\`) cuesta **O(n)**, menos que insertar los n elementos uno por uno.`,
        `## Inserting and removing the minimum
- **Insert:** put the new element **at the end** of the list and move it **up**: compare it with its parent and, if it is smaller, they swap places. Repeat until its parent is smaller or it reaches the root.
- **Remove the minimum:** take the root. Put the **last** element in its place and move it **down**: swap it with the **smaller** of its children until it is no longer larger than them.

In both cases the element travels along a single path from top to bottom, and a complete tree with n elements has about log₂(n) levels: **O(log n)**.

**Building** a heap from a list (\`heapify\`) costs **O(n)**, less than inserting the n elements one by one.`,
      ),
      md(
        `## Heaps en Python: \`heapq\`
El módulo \`heapq\` trata una lista normal como **min-heap**:
- \`heapq.heappush(h, x)\` inserta \`x\`: O(log n).
- \`heapq.heappop(h)\` saca y devuelve el mínimo: O(log n).
- \`h[0]\` es el mínimo, sin sacarlo: O(1).
- \`heapq.heapify(lista)\` convierte una lista en heap: O(n).

**¿Y un max-heap?** \`heapq\` solo hace min-heaps. El truco: guarda los valores **con el signo contrario** (\`-x\`). El más grande queda como el más chico (el más negativo); al sacarlo, le vuelves a cambiar el signo.`,
        `## Heaps in Python: \`heapq\`
The \`heapq\` module treats a regular list as a **min-heap**:
- \`heapq.heappush(h, x)\` inserts \`x\`: O(log n).
- \`heapq.heappop(h)\` removes and returns the minimum: O(log n).
- \`h[0]\` is the minimum, without removing it: O(1).
- \`heapq.heapify(list)\` turns a list into a heap: O(n).

**What about a max-heap?** \`heapq\` only does min-heaps. The trick: store the values **with the opposite sign** (\`-x\`). The largest becomes the smallest (the most negative); when you take it out, you flip the sign back.`,
      ),
      code(`import heapq

h = []
for x in [6, 2, 9, 4]:
    heapq.heappush(h, x)          # O(log n) cada uno
print(h[0])                       # imprime: 2      (ver el mínimo: O(1))
print(heapq.heappop(h))           # imprime: 2      (sacar el mínimo: O(log n))
print(heapq.heappop(h))           # imprime: 4

datos = [8, 5, 3, 6]
heapq.heapify(datos)              # convierte la lista en heap: O(n)
print(datos[0])                   # imprime: 3

m = []                            # max-heap: con el signo contrario
for x in [6, 2, 9]:
    heapq.heappush(m, -x)
print(-heapq.heappop(m))          # imprime: 9`),
      md(
        `## Top-k: los k más grandes
**El problema:** de n números, quieres los k más grandes (por ejemplo, las 10 canciones más escuchadas de un millón).

**La idea:** usa un **min**-heap de tamaño k. Metes cada número y, si el heap pasa de k elementos, sacas el más chico: ese ya no puede estar entre los k mayores. Al final quedan justo los k más grandes, y la raíz es el k-ésimo mayor.

**¿Por qué un min-heap y no un max-heap con todo?** El heap nunca pasa de k elementos, así que cada operación cuesta O(log k) en vez de O(log n): en total **O(n log k)** de tiempo y **O(k)** de memoria. Meter los n en un max-heap usaría O(n) de memoria.`,
        `## Top-k: the k largest
**The problem:** out of n numbers, you want the k largest (for example, the 10 most played songs out of a million).

**The idea:** use a **min**-heap of size k. Push each number and, if the heap goes over k elements, pop the smallest: it can no longer be among the k largest. At the end exactly the k largest remain, and the root is the k-th largest.

**Why a min-heap and not a max-heap with everything?** The heap never goes over k elements, so each operation costs O(log k) instead of O(log n): **O(n log k)** time and **O(k)** memory in total. Putting all n into a max-heap would use O(n) memory.`,
      ),
      code(`import heapq

def k_mayores(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)      # saca el menor: no puede estar entre los k mayores
    return sorted(h)

print(k_mayores([4, 10, 2, 8, 6], 3))   # imprime: [6, 8, 10]`),
      md(
        `## Otros usos
- **"Siempre toma los dos más chicos":** por ejemplo, unir palos o cuerdas al menor costo total, donde cada unión cuesta la suma de los dos. Sacas los dos menores, los unes y metes el resultado otra vez al heap.
- **Mezclar k listas ordenadas:** el heap guarda el primer elemento de cada lista y te dice cuál es el menor de todos.
- **Dijkstra** (el camino más corto en un grafo con pesos) y la **planificación de tareas** por prioridad.`,
        `## Other uses
- **"Always take the two smallest":** for example, joining sticks or ropes at the lowest total cost, where each join costs the sum of the two. You pop the two smallest, join them and push the result back into the heap.
- **Merging k sorted lists:** the heap keeps the first element of each list and tells you which is the smallest of all.
- **Dijkstra** (the shortest path in a weighted graph) and **task scheduling** by priority.`,
      ),
      tip('En Python `heapq` es un min-heap. Para un max-heap, guarda los valores negados. Y si necesitas el mínimo una sola vez, `min(lista)` (O(n)) basta: el heap conviene cuando vas a sacar y meter muchas veces.', 'In Python `heapq` is a min-heap. For a max-heap, store negated values. And if you need the minimum only once, `min(list)` (O(n)) is enough: a heap pays off when you will push and pop many times.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Cola de prioridad | Siempre te da el elemento más importante |
| Min-heap | Cada padre ≤ sus hijos; el mínimo está en la raíz. No está ordenado por completo |
| Guardado en lista | Hijos de \`i\`: \`2i + 1\` y \`2i + 2\`; padre: \`(i - 1) // 2\` |
| Costos | Ver mínimo O(1); insertar y sacar O(log n); \`heapify\` O(n) |
| \`heapq\` | \`heappush\`, \`heappop\`, \`h[0]\`, \`heapify\`; max-heap con \`-x\` |
| Top-k | Min-heap de tamaño k: O(n log k) tiempo, O(k) memoria |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Priority queue | Always gives you the most important element |
| Min-heap | Every parent ≤ its children; the minimum is at the root. Not fully sorted |
| Stored in a list | Children of \`i\`: \`2i + 1\` and \`2i + 2\`; parent: \`(i - 1) // 2\` |
| Costs | Peek min O(1); insert and remove O(log n); \`heapify\` O(n) |
| \`heapq\` | \`heappush\`, \`heappop\`, \`h[0]\`, \`heapify\`; max-heap with \`-x\` |
| Top-k | Min-heap of size k: O(n log k) time, O(k) memory |`,
      ),
    ],
    quiz: [
      q('Para los k elementos más grandes de n, un min-heap de tamaño k cuesta…', 'For the k largest of n elements, a min-heap of size k costs…', [['O(n log n)', 'O(n log n)'], ['O(n log k)', 'O(n log k)'], ['O(k)', 'O(k)'], ['O(n²)', 'O(n²)']], 1,
        'n inserciones, cada una O(log k).', 'n insertions, each O(log k).'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué garantiza un **min-heap**?', 'What does a **min-heap** guarantee?', [['Que toda la lista está ordenada', 'That the whole list is sorted'], ['Que cada padre es menor o igual que sus hijos, así que el mínimo está en la raíz', 'That every parent is less than or equal to its children, so the minimum is at the root'], ['Que no hay repetidos', 'That there are no repeats'], ['Que el máximo está en la raíz', 'That the maximum is at the root']], 1,
        'Entre hermanos o ramas distintas no hay orden.', 'Between siblings or different branches there is no order.'),
      q('¿`[1, 3, 2, 7, 4]` es un min-heap válido aunque no esté ordenado?', 'Is `[1, 3, 2, 7, 4]` a valid min-heap even though it is not sorted?', [['No, un heap debe estar ordenado', 'No, a heap must be sorted'], ['Sí: cada padre es menor que sus hijos', 'Yes: every parent is smaller than its children'], ['No, el 2 debería ir antes que el 3', 'No, 2 should come before 3'], ['Solo si no tiene repetidos', 'Only if it has no repeats']], 1,
        '1 < 3 y 1 < 2; 3 < 7 y 3 < 4. Eso es todo lo que exige.', '1 < 3 and 1 < 2; 3 < 7 and 3 < 4. That is all it requires.'),
      q('En un heap guardado en una lista, ¿dónde están los hijos del elemento en la posición `i`?', 'In a heap stored in a list, where are the children of the element at position `i`?', [['En `i + 1` e `i + 2`', 'At `i + 1` and `i + 2`'], ['En `2 * i` y `2 * i + 1`', 'At `2 * i` and `2 * i + 1`'], ['En `2 * i + 1` y `2 * i + 2`', 'At `2 * i + 1` and `2 * i + 2`'], ['Al final de la lista', 'At the end of the list']], 2,
        'Y su padre está en `(i - 1) // 2`.', 'And its parent is at `(i - 1) // 2`.'),
      q('¿Dónde está el padre del elemento en la posición 4?', 'Where is the parent of the element at position 4?', [['En la posición 2', 'At position 2'], ['En la posición 1', 'At position 1'], ['En la posición 3', 'At position 3'], ['En la posición 0', 'At position 0']], 1,
        '(4 − 1) // 2 = 1.', '(4 − 1) // 2 = 1.'),
      q('¿Cuánto cuesta ver el mínimo de un min-heap?', 'How much does peeking at a min-heap\'s minimum cost?', [['O(1): está en la raíz, `h[0]`', 'O(1): it is at the root, `h[0]`'], ['O(log n)', 'O(log n)'], ['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)']], 0,
        'Sacarlo sí cuesta O(log n), porque hay que reacomodar.', 'Removing it does cost O(log n), because it has to rearrange.'),
      q('¿Por qué insertar en un heap cuesta O(log n)?', 'Why does inserting into a heap cost O(log n)?', [['Porque hay que ordenar toda la lista', 'Because the whole list must be sorted'], ['Porque el elemento sube por un solo camino y el árbol tiene unos log n niveles', 'Because the element moves up a single path and the tree has about log n levels'], ['Porque recorre todos los elementos', 'Because it walks every element'], ['No, cuesta O(1)', 'No, it costs O(1)']], 1,
        'Se agrega al final y se intercambia con su padre mientras sea menor.', 'It is added at the end and swapped with its parent while it is smaller.'),
      q('Al sacar el mínimo de un heap, ¿qué elemento se pone en la raíz antes de bajarlo?', 'When removing a heap\'s minimum, which element is put at the root before moving it down?', [['El segundo más chico', 'The second smallest'], ['El último elemento de la lista', 'The last element of the list'], ['El hijo izquierdo', 'The left child'], ['Ninguno: la raíz queda vacía', 'None: the root stays empty']], 1,
        'Luego se intercambia con el menor de sus hijos hasta que quede en su lugar.', 'Then it is swapped with the smaller of its children until it is in place.'),
      q('¿Cuánto cuesta `heapq.heapify(lista)` con n elementos?', 'How much does `heapq.heapify(list)` cost with n elements?', [['O(n)', 'O(n)'], ['O(n log n)', 'O(n log n)'], ['O(1)', 'O(1)'], ['O(n²)', 'O(n²)']], 0,
        'Menos que insertar los n elementos uno por uno.', 'Less than inserting the n elements one by one.'),
      q('`heapq` es un min-heap. ¿Cómo lo usas como max-heap?', '`heapq` is a min-heap. How do you use it as a max-heap?', [['Con `heapq.heappush(h, x, max=True)`', 'With `heapq.heappush(h, x, max=True)`'], ['Ordenando la lista al revés', 'Sorting the list in reverse'], ['Guardando `-x` y cambiando el signo al sacarlo', 'Storing `-x` and flipping the sign when popping'], ['No se puede', 'It cannot be done']], 2,
        'El más grande queda como el más negativo, es decir, el mínimo.', 'The largest becomes the most negative, that is, the minimum.'),
      q('Para los k mayores, ¿por qué un min-heap de tamaño k y no un max-heap con los n elementos?', 'For the k largest, why a min-heap of size k and not a max-heap with all n elements?', [['Porque el max-heap no existe en Python', 'Because max-heaps do not exist in Python'], ['Porque el heap nunca pasa de k: cada operación es O(log k) y la memoria es O(k)', 'Because the heap never goes over k: each operation is O(log k) and memory is O(k)'], ['Porque el min-heap ordena mejor', 'Because the min-heap sorts better'], ['Da igual', 'It does not matter']], 1,
        'Cada vez que pasa de k, sacas el más chico: ese no puede estar entre los k mayores.', 'Whenever it goes over k, you pop the smallest: it cannot be among the k largest.'),
      q('Necesitas atender siempre la tarea de mayor prioridad y llegan tareas nuevas todo el tiempo. ¿Por qué un heap y no una lista ordenada?', 'You must always handle the highest-priority task and new tasks keep arriving. Why a heap and not a sorted list?', [['Porque en la lista ordenada cada inserción cuesta O(n); en el heap, O(log n)', 'Because in a sorted list each insertion costs O(n); in a heap, O(log n)'], ['Porque el heap ocupa menos memoria', 'Because the heap uses less memory'], ['Porque la lista no puede tener prioridades', 'Because the list cannot have priorities'], ['No hay diferencia', 'There is no difference']], 0,
        'Con muchas inserciones, O(log n) contra O(n) hace mucha diferencia.', 'With many insertions, O(log n) versus O(n) makes a big difference.'),
      q('Para unir palos al menor costo (cada unión cuesta la suma de los dos), ¿qué par unes en cada paso?', 'To join sticks at the lowest cost (each join costs the sum of the two), which pair do you join at each step?', [['Los dos más grandes', 'The two largest'], ['Los dos primeros de la lista', 'The first two of the list'], ['Los dos más chicos, que sacas de un heap', 'The two smallest, which you pop from a heap'], ['Uno grande y uno chico', 'One large and one small']], 2,
        'El resultado se vuelve a meter al heap y se repite.', 'The result is pushed back into the heap and you repeat.'),
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
    summary: l('Qué es un grafo, cómo se guarda y cómo recorrerlo con BFS y DFS para resolver caminos más cortos, islas, componentes y dependencias.', 'What a graph is, how it is stored and how to traverse it with BFS and DFS to solve shortest paths, islands, components and dependencies.'),
    minutes: 25,
    blocks: [
      md(
        `## ¿Qué es un grafo?
Muchos problemas tratan de **relaciones**: amistades en una red social, ciudades unidas por carreteras, cursos que son requisito de otros, páginas web con enlaces. Un **grafo** representa justo eso:
- **Nodos** (o vértices, **V**): las cosas. Por ejemplo, personas.
- **Aristas** (**E**): las conexiones entre pares de nodos. Por ejemplo, "Ana es amiga de Luis".

Tipos de grafo:
- **No dirigido:** la conexión va en los dos sentidos (si Ana es amiga de Luis, Luis es amigo de Ana).
- **Dirigido:** la arista es una flecha con un sentido (Ana sigue a Luis, pero Luis no necesariamente a Ana).
- **Con pesos:** cada arista tiene un número, como los kilómetros de una carretera.

**Analogía:** el mapa del metro. Las estaciones son nodos y los tramos entre ellas son aristas. Los árboles y las listas enlazadas son grafos especiales.`,
        `## What is a graph?
Many problems are about **relationships**: friendships on a social network, cities joined by roads, courses that are prerequisites for others, web pages with links. A **graph** represents exactly that:
- **Nodes** (or vertices, **V**): the things. For example, people.
- **Edges** (**E**): the connections between pairs of nodes. For example, "Ana is friends with Luis".

Kinds of graph:
- **Undirected:** the connection goes both ways (if Ana is friends with Luis, Luis is friends with Ana).
- **Directed:** the edge is an arrow with a direction (Ana follows Luis, but Luis does not necessarily follow Ana).
- **Weighted:** each edge has a number, like the kilometers of a road.

**Analogy:** a subway map. Stations are nodes and the segments between them are edges. Trees and linked lists are special graphs.`,
      ),
      md(
        `## Cómo se guarda un grafo
- **Lista de adyacencia** (la más usada): un diccionario \`{nodo: [vecinos]}\`. Usa memoria **O(V + E)**. En un grafo no dirigido, cada arista se agrega **en los dos sentidos**.
- **Matriz de adyacencia:** una tabla de V × V donde \`m[i][j]\` dice si hay arista de i a j. Responde "¿hay arista?" en O(1), pero usa **O(V²)** de memoria: conviene cuando casi todos los nodos están conectados entre sí (grafo **denso**).
- **Cuadrícula:** un mapa de celdas también es un grafo. Cada celda tiene hasta **4 vecinos** (arriba, abajo, izquierda, derecha); antes de visitar uno, revisa que no te salgas de la cuadrícula.`,
        `## How a graph is stored
- **Adjacency list** (the most used): a dictionary \`{node: [neighbors]}\`. It uses **O(V + E)** memory. In an undirected graph, each edge is added **in both directions**.
- **Adjacency matrix:** a V × V table where \`m[i][j]\` says whether there is an edge from i to j. It answers "is there an edge?" in O(1), but uses **O(V²)** memory: it pays off when almost every node is connected to the others (a **dense** graph).
- **Grid:** a map of cells is a graph too. Each cell has up to **4 neighbors** (up, down, left, right); before visiting one, check that you do not go off the grid.`,
      ),
      code(`aristas = [("ana", "luis"), ("ana", "eva"), ("luis", "sofía")]   # amistades: no dirigido
amigos = {}
for a, b in aristas:
    amigos.setdefault(a, []).append(b)     # a es amiga de b...
    amigos.setdefault(b, []).append(a)     # ...y b es amiga de a
print(amigos)
# imprime:
# {'ana': ['luis', 'eva'], 'luis': ['ana', 'sofía'], 'eva': ['ana'], 'sofía': ['luis']}`),
      md(
        `## BFS: recorrer por niveles
**BFS** (*breadth-first search*, búsqueda en anchura) explora desde un nodo de inicio **por niveles**: primero sus vecinos (a distancia 1), luego los vecinos de esos (distancia 2), y así. Usa una **cola**, igual que el recorrido por niveles de un árbol.

**Analogía:** una piedra que cae en un estanque: las ondas se alejan en círculos, primero las cercanas y después las lejanas.

**Por qué encuentra el camino más corto** (en grafos **sin pesos**): como avanza por niveles, la **primera vez** que llega a un nodo es por el camino con menos aristas.

**Marca los nodos como visitados al meterlos a la cola** (no al sacarlos). Si esperas a sacarlos, un mismo nodo puede entrar varias veces a la cola mientras espera, porque varios vecinos lo encuentran. En grafos con ciclos, sin marcar visitados el recorrido nunca terminaría.`,
        `## BFS: traversing by levels
**BFS** (breadth-first search) explores from a start node **by levels**: first its neighbors (distance 1), then their neighbors (distance 2), and so on. It uses a **queue**, just like a tree's level-order traversal.

**Analogy:** a stone dropped in a pond: the ripples move away in circles, first the near ones and then the far ones.

**Why it finds the shortest path** (in **unweighted** graphs): since it advances level by level, the **first time** it reaches a node is along the path with the fewest edges.

**Mark nodes as visited when you put them in the queue** (not when you take them out). If you wait until taking them out, the same node can enter the queue several times while it waits, because several neighbors find it. In graphs with cycles, without marking visited nodes the traversal would never end.`,
      ),
      viz('graph'),
      code(`from collections import deque

def distancias(grafo, inicio):
    dist = {inicio: 0}                 # distancia desde el inicio; también sirve de "visitados"
    cola = deque([inicio])
    while cola:
        n = cola.popleft()
        for v in grafo[n]:
            if v not in dist:          # primera vez que lo vemos: es por el camino más corto
                dist[v] = dist[n] + 1  # se marca al meterlo a la cola
                cola.append(v)
    return dist

print(distancias(amigos, "eva"))
# imprime: {'eva': 0, 'ana': 1, 'luis': 2, 'sofía': 3}`),
      md(
        `## DFS: ir hasta el fondo
**DFS** (*depth-first search*, búsqueda en profundidad) sigue un camino **lo más lejos posible** antes de regresar a probar otro. Se escribe con **recursión** (o con una pila).

**Analogía:** explorar un laberinto siguiendo un pasillo hasta el final; si no hay salida, regresas al último cruce y tomas otro pasillo (como el backtracking).

DFS **no** garantiza el camino más corto: puede llegar a un nodo por un camino largo antes de encontrar el corto. Pero es ideal para preguntas como "¿se puede llegar de A a B?", contar **grupos conectados**, detectar **ciclos** y el **orden topológico**.

Ambos, BFS y DFS, visitan cada nodo una vez y revisan cada arista una vez: **O(V + E)**.`,
        `## DFS: going all the way down
**DFS** (depth-first search) follows a path **as far as possible** before coming back to try another. It is written with **recursion** (or with a stack).

**Analogy:** exploring a maze by following a corridor to the end; if there is no exit, you go back to the last junction and take another corridor (like backtracking).

DFS does **not** guarantee the shortest path: it can reach a node along a long path before finding the short one. But it is ideal for questions like "can you get from A to B?", counting **connected groups**, detecting **cycles** and **topological order**.

Both BFS and DFS visit each node once and check each edge once: **O(V + E)**.`,
      ),
      code(`def alcanzables(grafo, inicio):
    visto = set()
    def dfs(n):
        visto.add(n)
        for v in grafo[n]:
            if v not in visto:
                dfs(v)                 # baja lo más profundo posible antes de seguir
    dfs(inicio)
    return visto

g = {1: [2], 2: [3], 3: [], 4: [1]}    # dirigido: 4 → 1 → 2 → 3
print(sorted(alcanzables(g, 1)), sorted(alcanzables(g, 4)))   # imprime: [1, 2, 3] [1, 2, 3, 4]`),
      md(
        `## Contar grupos: islas en una cuadrícula
**El problema:** en un mapa de "1" (tierra) y "0" (agua), ¿cuántas islas hay? Una isla es un grupo de celdas de tierra unidas arriba, abajo, a la izquierda o a la derecha.

**La idea:** recorre todas las celdas. Cada vez que encuentres tierra **que no has visitado**, es una isla nueva: súmala y lanza un DFS desde ahí que **marque toda esa isla** como visitada (por ejemplo, cambiando sus "1" por "0", "hundiéndola"). Así no la vuelves a contar. Lo mismo sirve para contar **componentes conectados** en cualquier grafo.

\`list("1100")\` convierte el texto en una lista de caracteres: \`['1', '1', '0', '0']\`. En el DFS, lo primero es revisar que la celda **no esté fuera** de la cuadrícula.`,
        `## Counting groups: islands in a grid
**The problem:** on a map of "1" (land) and "0" (water), how many islands are there? An island is a group of land cells joined up, down, left or right.

**The idea:** walk every cell. Each time you find land **you have not visited**, it is a new island: count it and start a DFS from there that **marks the whole island** as visited (for example, turning its "1"s into "0"s, "sinking" it). That way you do not count it again. The same works for counting **connected components** in any graph.

\`list("1100")\` turns the text into a list of characters: \`['1', '1', '0', '0']\`. In the DFS, the first thing is to check that the cell is **not outside** the grid.`,
      ),
      code(`grid = [list("1100"),
        list("1001"),
        list("0011")]
filas, cols = len(grid), len(grid[0])

def hundir(r, c):
    if r < 0 or c < 0 or r >= filas or c >= cols or grid[r][c] != "1":
        return                          # fuera de la cuadrícula, agua o ya visitada
    grid[r][c] = "0"                    # la marca como visitada
    hundir(r + 1, c)                    # abajo, arriba, derecha, izquierda
    hundir(r - 1, c)
    hundir(r, c + 1)
    hundir(r, c - 1)

islas = 0
for r in range(filas):
    for c in range(cols):
        if grid[r][c] == "1":           # tierra sin visitar: una isla nueva
            islas += 1
            hundir(r, c)
print(islas)                            # imprime: 2`),
      md(
        `## Dependencias: orden topológico
**El problema:** tienes cursos con requisitos ("para tomar Cálculo 2 necesitas Cálculo 1"). ¿En qué orden los tomas? ¿Se pueden tomar todos? Es un grafo **dirigido**: una flecha del requisito al curso que desbloquea. Un orden que respeta todas las flechas se llama **orden topológico**, y solo existe si el grafo **no tiene ciclos** (un grafo así se llama **DAG**).

**Algoritmo de Kahn:**
1. Cuenta el **grado de entrada** de cada nodo: cuántos requisitos le faltan.
2. Mete a una cola los que tienen grado 0 (no les falta nada).
3. Saca uno, agrégalo al orden y **resta 1** al grado de los cursos que desbloquea. Si alguno llega a 0, métele a la cola.
4. Si al final procesaste **todos** los nodos, ese es el orden. Si no, hay un **ciclo**: unos cursos se esperan entre sí y ninguno llega a 0.

Atajos de Python que vas a ver: \`[i for i in range(n) if grado[i] == 0]\` crea la lista de los \`i\` que cumplen la condición (se llama *list comprehension*), y \`{i: [] for i in range(n)}\` crea un diccionario con una lista vacía para cada \`i\`.`,
        `## Dependencies: topological order
**The problem:** you have courses with prerequisites ("to take Calculus 2 you need Calculus 1"). In what order do you take them? Can you take them all? It is a **directed** graph: an arrow from the prerequisite to the course it unlocks. An order that respects every arrow is called a **topological order**, and it only exists if the graph **has no cycles** (such a graph is called a **DAG**).

**Kahn's algorithm:**
1. Count each node's **in-degree**: how many prerequisites it is missing.
2. Put the ones with in-degree 0 in a queue (they are missing nothing).
3. Take one out, add it to the order and **subtract 1** from the in-degree of the courses it unlocks. If one reaches 0, put it in the queue.
4. If at the end you processed **every** node, that is the order. If not, there is a **cycle**: some courses wait for each other and none reaches 0.

Python shortcuts you will see: \`[i for i in range(n) if grado[i] == 0]\` builds the list of the \`i\` that meet the condition (it is called a *list comprehension*), and \`{i: [] for i in range(n)}\` builds a dictionary with an empty list for each \`i\`.`,
      ),
      code(`from collections import deque

def orden_cursos(n, prereq):                 # prereq: pares (curso, requisito)
    g = {i: [] for i in range(n)}            # requisito → cursos que desbloquea
    grado = [0] * n                          # cuántos requisitos le faltan a cada curso
    for curso, req in prereq:
        g[req].append(curso)
        grado[curso] += 1
    cola = deque([i for i in range(n) if grado[i] == 0])   # los que no tienen requisitos
    orden = []
    while cola:
        actual = cola.popleft()
        orden.append(actual)
        for sig in g[actual]:
            grado[sig] -= 1                  # ya cumplió uno de sus requisitos
            if grado[sig] == 0:
                cola.append(sig)
    return orden if len(orden) == n else None   # None: hay un ciclo

print(orden_cursos(3, [(1, 0), (2, 1)]))     # imprime: [0, 1, 2]
print(orden_cursos(2, [(0, 1), (1, 0)]))     # imprime: None`),
      interview('Si te piden "el mínimo número de pasos/movimientos", casi siempre es BFS. Si te piden "¿se pueden completar todas las tareas con dependencias?", es detección de ciclos u orden topológico. Si te piden "cuántos grupos/islas", es DFS (o BFS) desde cada nodo sin visitar.', 'If asked for "the minimum number of steps/moves", it is almost always BFS. If asked "can all tasks with dependencies be completed?", it is cycle detection or topological sort. If asked "how many groups/islands", it is DFS (or BFS) from each unvisited node.'),
      md(
        `## Resumen
| Tema | Clave | Costo |
|---|---|---|
| Lista de adyacencia | \`{nodo: [vecinos]}\`; no dirigido → en los dos sentidos | O(V + E) memoria |
| Matriz de adyacencia | Tabla V × V; para grafos densos | O(V²) memoria |
| BFS | Cola, por niveles; marcar al encolar; camino más corto **sin pesos** | O(V + E) |
| DFS | Recursión o pila; hasta el fondo y regresa | O(V + E) |
| Islas / componentes | Por cada nodo sin visitar: +1 y DFS que marque el grupo | O(V + E) |
| Orden topológico (Kahn) | Grados de entrada + cola de los que tienen 0; si no salen todos, hay ciclo | O(V + E) |`,
        `## Summary
| Topic | Key | Cost |
|---|---|---|
| Adjacency list | \`{node: [neighbors]}\`; undirected → both directions | O(V + E) memory |
| Adjacency matrix | V × V table; for dense graphs | O(V²) memory |
| BFS | Queue, by levels; mark when enqueuing; shortest path **unweighted** | O(V + E) |
| DFS | Recursion or stack; all the way down and back | O(V + E) |
| Islands / components | For each unvisited node: +1 and a DFS marking the group | O(V + E) |
| Topological order (Kahn) | In-degrees + queue of the zeros; if not all come out, there is a cycle | O(V + E) |`,
      ),
    ],
    quiz: [
      q('¿Qué recorrido encuentra el camino más corto en un grafo sin pesos?', 'Which traversal finds the shortest path in an unweighted graph?', [['DFS', 'DFS'], ['BFS', 'BFS'], ['Inorden', 'Inorder'], ['Ninguno', 'Neither']], 1, 'BFS visita por distancia creciente.', 'BFS visits in increasing distance.'),
      q('¿Complejidad de BFS/DFS con listas de adyacencia?', 'BFS/DFS complexity with adjacency lists?', [['O(V)', 'O(V)'], ['O(E)', 'O(E)'], ['O(V + E)', 'O(V + E)'], ['O(V²)', 'O(V²)']], 2, 'Cada nodo y cada arista se procesan una vez.', 'Each node and edge is processed once.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('En un grafo, ¿qué son los nodos y las aristas?', 'In a graph, what are nodes and edges?', [['Los nodos son las cosas y las aristas las conexiones entre pares de ellas', 'Nodes are the things and edges the connections between pairs of them'], ['Son lo mismo', 'They are the same'], ['Las aristas son las cosas y los nodos los pesos', 'Edges are the things and nodes the weights'], ['Los nodos son solo números', 'Nodes are only numbers']], 0,
        'Por ejemplo: personas (nodos) y amistades (aristas).', 'For example: people (nodes) and friendships (edges).'),
      q('¿Qué diferencia hay entre un grafo dirigido y uno no dirigido?', 'What is the difference between a directed and an undirected graph?', [['El dirigido tiene pesos', 'The directed one has weights'], ['En el dirigido cada arista es una flecha con sentido; en el no dirigido va en los dos sentidos', 'In a directed one each edge is an arrow with a direction; in an undirected one it goes both ways'], ['El no dirigido no tiene aristas', 'The undirected one has no edges'], ['No hay diferencia', 'There is no difference']], 1,
        '"Ana sigue a Luis" es dirigida; "Ana es amiga de Luis" es no dirigida.', '"Ana follows Luis" is directed; "Ana is friends with Luis" is undirected.'),
      q('Construyendo la lista de adyacencia de un grafo **no dirigido**, por cada arista (a, b)…', 'Building the adjacency list of an **undirected** graph, for each edge (a, b)…', [['Agregas b a los vecinos de a, y también a a los vecinos de b', 'You add b to a\'s neighbors, and also a to b\'s neighbors'], ['Solo agregas b a los vecinos de a', 'You only add b to a\'s neighbors'], ['Creas una matriz', 'You create a matrix'], ['Ordenas a y b', 'You sort a and b']], 0,
        'La conexión va en los dos sentidos.', 'The connection goes both ways.'),
      q('¿Cuándo conviene una matriz de adyacencia en vez de una lista?', 'When does an adjacency matrix beat a list?', [['Siempre', 'Always'], ['Cuando el grafo tiene pocos nodos conectados', 'When the graph has few connected nodes'], ['Cuando el grafo es denso (casi todos conectados) o necesitas preguntar "¿hay arista?" en O(1)', 'When the graph is dense (almost all connected) or you need "is there an edge?" in O(1)'], ['Nunca', 'Never']], 2,
        'La matriz usa O(V²) de memoria; la lista, O(V + E).', 'The matrix uses O(V²) memory; the list, O(V + E).'),
      q('En una cuadrícula, ¿qué hay que revisar antes de visitar una celda vecina?', 'In a grid, what must you check before visiting a neighboring cell?', [['Que sea la última fila', 'That it is the last row'], ['Nada', 'Nothing'], ['Que esté ordenada', 'That it is sorted'], ['Que no esté fuera de la cuadrícula (y que no esté visitada)', 'That it is not off the grid (and not visited)']], 3,
        'Por eso `hundir` empieza revisando `r < 0 or c < 0 or r >= filas…`.', 'That is why `hundir` starts by checking `r < 0 or c < 0 or r >= filas…`.'),
      q('En BFS, ¿por qué se marca un nodo como visitado **al meterlo a la cola** y no al sacarlo?', 'In BFS, why is a node marked visited **when it enters the queue** and not when it leaves?', [['Para que no entre varias veces a la cola mientras espera', 'So it does not enter the queue several times while it waits'], ['Porque así se ordena la cola', 'Because it sorts the queue'], ['Da igual', 'It does not matter'], ['Para usar menos tiempo al sacarlo', 'To spend less time when taking it out']], 0,
        'Varios vecinos pueden encontrarlo antes de que salga.', 'Several neighbors can find it before it leaves.'),
      q('¿Qué usa cada recorrido?', 'What does each traversal use?', [['BFS una pila y DFS una cola', 'BFS a stack and DFS a queue'], ['Los dos usan un heap', 'Both use a heap'], ['BFS una cola; DFS recursión o una pila', 'BFS a queue; DFS recursion or a stack'], ['Los dos usan un diccionario ordenado', 'Both use a sorted dictionary']], 2,
        'La cola da el orden por niveles; la pila (o la recursión), ir hasta el fondo.', 'The queue gives level order; the stack (or recursion), going all the way down.'),
      q('¿Por qué DFS no garantiza el camino más corto?', 'Why does DFS not guarantee the shortest path?', [['Porque es más lento que BFS', 'Because it is slower than BFS'], ['Porque puede llegar a un nodo por un camino largo antes de encontrar el corto', 'Because it can reach a node along a long path before finding the short one'], ['Porque no visita todos los nodos', 'Because it does not visit every node'], ['Sí lo garantiza', 'It does guarantee it']], 1,
        'BFS sí, porque la primera vez que llega a un nodo es por la menor cantidad de aristas.', 'BFS does, because the first time it reaches a node is with the fewest edges.'),
      q('Para contar islas en una cuadrícula, ¿qué haces al encontrar tierra sin visitar?', 'To count islands in a grid, what do you do when you find unvisited land?', [['Sumar 1 por cada celda de tierra', 'Add 1 for every land cell'], ['Sumar 1 y lanzar un DFS que marque toda esa isla como visitada', 'Add 1 and start a DFS that marks that whole island as visited'], ['Ordenar la cuadrícula', 'Sort the grid'], ['Usar búsqueda binaria', 'Use binary search']], 1,
        'Así cada isla se cuenta una sola vez.', 'That way each island is counted only once.'),
      q('En el algoritmo de Kahn, ¿qué nodos entran primero a la cola?', 'In Kahn\'s algorithm, which nodes enter the queue first?', [['Los que tienen más vecinos', 'The ones with the most neighbors'], ['Los que tienen grado de entrada 0 (no les falta ningún requisito)', 'The ones with in-degree 0 (missing no prerequisite)'], ['El nodo 0', 'Node 0'], ['Todos', 'All of them']], 1,
        'Luego, al procesar uno, se resta 1 al grado de los que desbloquea.', 'Then, when you process one, you subtract 1 from the in-degree of the ones it unlocks.'),
      q('Con Kahn, ¿cómo sabes que hay un **ciclo**?', 'With Kahn, how do you know there is a **cycle**?', [['Si la cola nunca se vacía', 'If the queue never empties'], ['Si algún nodo tiene grado 0', 'If some node has in-degree 0'], ['Si al final no procesaste todos los nodos', 'If at the end you did not process every node'], ['Si el grafo tiene más aristas que nodos', 'If the graph has more edges than nodes']], 2,
        'Los nodos del ciclo se esperan entre sí y su grado nunca llega a 0.', 'The nodes in the cycle wait for each other and their in-degree never reaches 0.'),
      q('¿Qué crea `[i for i in range(4) if i % 2 == 0]`?', 'What does `[i for i in range(4) if i % 2 == 0]` create?', [['`[0, 2]`', '`[0, 2]`'], ['`[1, 3]`', '`[1, 3]`'], ['`[0, 1, 2, 3]`', '`[0, 1, 2, 3]`'], ['`2`', '`2`']], 0,
        'Es una *list comprehension*: la lista de los `i` de 0 a 3 que cumplen la condición.', 'It is a *list comprehension*: the list of the `i` from 0 to 3 that meet the condition.'),
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
    summary: l('Resolver cada subproblema una sola vez y reutilizarlo: memoización, tablas, la receta de 4 pasos y los problemas clásicos de entrevista.', 'Solve each subproblem only once and reuse it: memoization, tables, the 4-step recipe and the classic interview problems.'),
    minutes: 25,
    blocks: [
      md(
        `## El problema: calcular lo mismo muchas veces
Fibonacci se define así: cada número es la suma de los dos anteriores (0, 1, 1, 2, 3, 5, 8…), o sea \`fib(n) = fib(n - 1) + fib(n - 2)\`. Escrito como recursión directa, \`fib(5)\` llama a \`fib(4)\` y a \`fib(3)\`; pero \`fib(4)\` **también** llama a \`fib(3)\`, y así: los mismos cálculos se repiten una y otra vez. El número de llamadas crece como **O(2ⁿ)**.

**La idea de la programación dinámica (DP):** resolver cada subproblema **una sola vez**, guardar el resultado y **reutilizarlo** cuando se vuelva a necesitar. Fibonacci baja de O(2ⁿ) a **O(n)**.

**Analogía:** si sumaste 1 + 1 + 1 + 1 + 1 + 1 = 6 y te piden "ahora súmale 1", no vuelves a contar todo desde el principio: usas el 6 que ya tenías.

**¿Cuándo aplica DP?** Cuando el problema tiene:
1. **Subproblemas superpuestos:** los mismos casos se calculan muchas veces (como \`fib(3)\`).
2. **Subestructura óptima:** la mejor solución del problema se arma con las mejores soluciones de sus subproblemas.`,
        `## The problem: computing the same thing many times
Fibonacci is defined like this: each number is the sum of the two before it (0, 1, 1, 2, 3, 5, 8…), that is \`fib(n) = fib(n - 1) + fib(n - 2)\`. Written as direct recursion, \`fib(5)\` calls \`fib(4)\` and \`fib(3)\`; but \`fib(4)\` **also** calls \`fib(3)\`, and so on: the same computations repeat over and over. The number of calls grows like **O(2ⁿ)**.

**The idea of dynamic programming (DP):** solve each subproblem **only once**, store the result and **reuse it** when it is needed again. Fibonacci goes from O(2ⁿ) down to **O(n)**.

**Analogy:** if you added 1 + 1 + 1 + 1 + 1 + 1 = 6 and are asked "now add 1", you do not count everything again from the start: you use the 6 you already had.

**When does DP apply?** When the problem has:
1. **Overlapping subproblems:** the same cases are computed many times (like \`fib(3)\`).
2. **Optimal substructure:** the best solution to the problem is built from the best solutions to its subproblems.`,
      ),
      code(`llamadas = 0

def fib(n):
    global llamadas            # para poder modificar la variable de afuera
    llamadas += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(20), llamadas)       # imprime: 6765 21891     (¡casi 22 mil llamadas para n = 20!)`),
      md(
        `## Top-down: recursión + memoización
Escribes la misma recursión, pero con una **memoria** (un diccionario \`memo\`):
- Antes de calcular, preguntas: "¿ya lo calculé?". Si sí, devuelves lo guardado.
- Si no, lo calculas **una vez** y lo guardas en \`memo\` antes de devolverlo.

Esto se llama **memoización** y es la forma **top-down** (de arriba hacia abajo): empiezas por el problema grande y la recursión baja a los pequeños.

Python lo trae hecho: \`@lru_cache\` (de \`functools\`) guarda automáticamente los resultados de la función. La línea con \`@\` va justo encima de la función y le **agrega** ese comportamiento sin cambiar su código.`,
        `## Top-down: recursion + memoization
You write the same recursion, but with a **memory** (a dictionary \`memo\`):
- Before computing, you ask: "did I already compute it?". If so, you return what was stored.
- If not, you compute it **once** and store it in \`memo\` before returning it.

This is called **memoization** and it is the **top-down** approach: you start from the big problem and the recursion goes down to the small ones.

Python has it built in: \`@lru_cache\` (from \`functools\`) automatically stores the function's results. The line with \`@\` goes right above the function and **adds** that behavior without changing its code.`,
      ),
      code(`memo = {}
def fib_memo(n):
    if n < 2:
        return n
    if n in memo:                                  # ¿ya lo calculé? lo reutilizo
        return memo[n]
    memo[n] = fib_memo(n - 1) + fib_memo(n - 2)    # lo calculo una sola vez y lo guardo
    return memo[n]

from functools import lru_cache

@lru_cache(maxsize=None)                           # lo mismo que memo, pero automático
def fib_cache(n):
    return n if n < 2 else fib_cache(n - 1) + fib_cache(n - 2)

print(fib_memo(50), fib_cache(50))                 # imprime: 12586269025 12586269025  (al instante)`),
      md(
        `## Bottom-up: llenar una tabla
La otra forma es **bottom-up** (de abajo hacia arriba): sin recursión, llenas una lista \`dp\` en un ciclo, **del caso más pequeño al más grande**. Cuando llegas a \`dp[i]\`, los valores que necesitas ya están calculados.

Ventajas: no hay recursión, así que no existe el riesgo de un \`RecursionError\` con n grandes. Y muchas veces solo necesitas los **últimos valores** de la tabla: entonces guardas solo esos y el espacio baja a **O(1)**.`,
        `## Bottom-up: filling a table
The other approach is **bottom-up**: without recursion, you fill a list \`dp\` in a loop, **from the smallest case to the largest**. When you reach \`dp[i]\`, the values you need are already computed.

Advantages: there is no recursion, so there is no risk of a \`RecursionError\` with large n. And often you only need the **last few values** of the table: then you keep only those and space drops to **O(1)**.`,
      ),
      code(`def fib_tabla(n):
    dp = [0, 1]                            # casos base: fib(0) y fib(1)
    for i in range(2, n + 1):
        dp.append(dp[i - 1] + dp[i - 2])   # cada uno con los dos anteriores, ya calculados
    return dp[n]

def fib_dos(n):                            # igual, pero solo guarda los dos últimos: O(1) de espacio
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib_tabla(10), fib_dos(10))          # imprime: 55 55`),
      md(
        `## La receta en 4 pasos
Para cualquier problema de DP:
1. **Estado:** define qué significa \`dp[i]\` en palabras. Es el paso más importante.
2. **Recurrencia:** cómo se calcula \`dp[i]\` a partir de estados anteriores.
3. **Casos base:** los valores más pequeños, que se saben directo.
4. **Orden de cálculo** y **dónde queda la respuesta**.

**Ejemplo: ¿de cuántas formas puedes subir n escalones, de 1 o de 2 en 2?**
1. Estado: \`formas[i]\` = número de formas de llegar al escalón i.
2. Recurrencia: al escalón i llegas desde el i − 1 (con un paso de 1) o desde el i − 2 (con un paso de 2), así que \`formas[i] = formas[i - 1] + formas[i - 2]\`.
3. Casos base: \`formas[0] = 1\` (ya estás ahí) y \`formas[1] = 1\`.
4. Orden: de 2 hasta n. Respuesta: \`formas[n]\`.

¡Es Fibonacci disfrazado!`,
        `## The 4-step recipe
For any DP problem:
1. **State:** define in words what \`dp[i]\` means. It is the most important step.
2. **Recurrence:** how \`dp[i]\` is computed from earlier states.
3. **Base cases:** the smallest values, known directly.
4. **Computation order** and **where the answer ends up**.

**Example: in how many ways can you climb n stairs, 1 or 2 at a time?**
1. State: \`formas[i]\` = number of ways to reach stair i.
2. Recurrence: you reach stair i from i − 1 (a 1-step) or from i − 2 (a 2-step), so \`formas[i] = formas[i - 1] + formas[i - 2]\`.
3. Base cases: \`formas[0] = 1\` (you are already there) and \`formas[1] = 1\`.
4. Order: from 2 to n. Answer: \`formas[n]\`.

It is Fibonacci in disguise!`,
      ),
      md(
        `## Cambio de monedas
**El problema:** con monedas de ciertos valores, ¿cuál es el **mínimo de monedas** para formar una cantidad?

¿Por qué no tomar siempre la moneda más grande (un enfoque "greedy")? Porque a veces falla. Con monedas [1, 5, 6] y cantidad 10, greedy toma 6 + 1 + 1 + 1 + 1 = **5 monedas**, pero lo mejor es 5 + 5 = **2**.

Con la receta:
1. Estado: \`dp[x]\` = mínimo de monedas para formar x.
2. Recurrencia: prueba cada moneda m que quepa: usarla cuesta 1 moneda **más** lo mínimo para formar x − m. \`dp[x] = min(dp[x], dp[x - m] + 1)\`.
3. Caso base: \`dp[0] = 0\`. Los demás empiezan en **infinito** (\`float("inf")\`), que significa "todavía no sé formarlo"; así cualquier forma real es menor.
4. Orden: de 1 hasta la cantidad. Respuesta: \`dp[cantidad]\`.

\`[0] + [float("inf")] * 10\` une dos listas: un 0 seguido de diez infinitos.`,
        `## Coin change
**The problem:** with coins of certain values, what is the **minimum number of coins** to make an amount?

Why not always take the largest coin (a "greedy" approach)? Because it sometimes fails. With coins [1, 5, 6] and amount 10, greedy takes 6 + 1 + 1 + 1 + 1 = **5 coins**, but the best is 5 + 5 = **2**.

With the recipe:
1. State: \`dp[x]\` = minimum coins to make x.
2. Recurrence: try every coin m that fits: using it costs 1 coin **plus** the minimum to make x − m. \`dp[x] = min(dp[x], dp[x - m] + 1)\`.
3. Base case: \`dp[0] = 0\`. The rest start at **infinity** (\`float("inf")\`), meaning "I do not know how to make it yet"; that way any real way is smaller.
4. Order: from 1 up to the amount. Answer: \`dp[amount]\`.

\`[0] + [float("inf")] * 10\` joins two lists: a 0 followed by ten infinities.`,
      ),
      viz('dp'),
      code(`monedas = [1, 5, 6]
cantidad = 10
dp = [0] + [float("inf")] * cantidad      # dp[x] = mínimo de monedas para formar x
for x in range(1, cantidad + 1):
    for m in monedas:
        if m <= x:
            dp[x] = min(dp[x], dp[x - m] + 1)   # usar m: 1 moneda + lo mínimo para x - m
print(dp[10])                             # imprime: 2      (5 + 5)`),
      md(
        `## Más problemas clásicos
- **El ladrón de casas:** no puede robar dos casas seguidas; ¿cuánto es lo máximo que puede llevarse? En cada casa decide: **saltarla** (se queda con lo mejor hasta la anterior) o **robarla** (lo mejor hasta dos casas antes + lo de esta casa). Solo necesitas recordar **dos números**: el mejor botín hasta la casa anterior y hasta la actual.
- **Costo mínimo para subir una escalera:** igual que los escalones, pero cada escalón cuesta algo y buscas el **mínimo**: \`dp[i] = min(dp[i - 1] + costo[i - 1], dp[i - 2] + costo[i - 2])\`.
- **Caminos en una cuadrícula** (solo hacia la derecha o hacia abajo): a la celda (r, c) llegas desde arriba o desde la izquierda, así que \`dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\`. La primera fila y la primera columna valen 1 (solo hay un camino). Es una **tabla de 2 dimensiones**.

Para crear una tabla de 2 dimensiones en Python se usa \`[[1] * cols for _ in range(filas)]\`: una lista con \`filas\` listas **distintas**. **Ojo:** \`[[1] * cols] * filas\` parece igual, pero repite **la misma** lista: cambiar una fila cambiaría todas.`,
        `## More classic problems
- **House robber:** the robber cannot rob two houses in a row; what is the most they can take? At each house they decide: **skip it** (keep the best up to the previous one) or **rob it** (the best up to two houses back + this house). You only need to remember **two numbers**: the best haul up to the previous house and up to the current one.
- **Min cost climbing stairs:** like the stairs, but each stair costs something and you want the **minimum**: \`dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])\`.
- **Paths in a grid** (only right or down): you reach cell (r, c) from above or from the left, so \`dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\`. The first row and first column are 1 (there is only one path). It is a **2-dimensional table**.

To create a 2-dimensional table in Python you use \`[[1] * cols for _ in range(filas)]\`: a list of \`filas\` **separate** lists. **Careful:** \`[[1] * cols] * filas\` looks the same, but repeats **the same** list: changing one row would change them all.`,
      ),
      interview('Si te bloqueas, escribe primero la solución recursiva de fuerza bruta, identifica qué parámetros cambian entre llamadas (ese es tu estado) y agrégale memoización. Si hace falta, pásala a una tabla. Los entrevistadores valoran ver ese proceso.', 'If you get stuck, first write the brute-force recursive solution, identify which parameters change between calls (that is your state) and add memoization. If needed, turn it into a table. Interviewers value seeing that process.'),
      md(
        `## Resumen
| | Top-down (memoización) | Bottom-up (tabla) |
|---|---|---|
| Cómo | Recursión + guardar cada resultado (\`memo\` o \`@lru_cache\`) | Ciclo que llena \`dp\` de lo pequeño a lo grande |
| A favor | Natural de escribir a partir de la recursión | Sin recursión (sin \`RecursionError\`); se puede bajar el espacio a O(1) |

| Problema | Estado | Recurrencia |
|---|---|---|
| Fibonacci / escalones | \`dp[i]\` = valor / formas de llegar a i | \`dp[i - 1] + dp[i - 2]\` |
| Cambio de monedas | \`dp[x]\` = mínimo de monedas para x | \`min(dp[x], dp[x - m] + 1)\` |
| Ladrón de casas | Mejor botín hasta la casa i | \`max(saltarla, robarla)\` |
| Caminos en cuadrícula | \`dp[r][c]\` = caminos hasta (r, c) | \`dp[r - 1][c] + dp[r][c - 1]\` |

**DP aplica** cuando hay subproblemas superpuestos y subestructura óptima. **Receta:** estado → recurrencia → casos base → orden y respuesta.`,
        `## Summary
| | Top-down (memoization) | Bottom-up (table) |
|---|---|---|
| How | Recursion + storing each result (\`memo\` or \`@lru_cache\`) | A loop filling \`dp\` from small to large |
| Pros | Natural to write from the recursion | No recursion (no \`RecursionError\`); space can drop to O(1) |

| Problem | State | Recurrence |
|---|---|---|
| Fibonacci / stairs | \`dp[i]\` = value / ways to reach i | \`dp[i - 1] + dp[i - 2]\` |
| Coin change | \`dp[x]\` = minimum coins for x | \`min(dp[x], dp[x - m] + 1)\` |
| House robber | Best haul up to house i | \`max(skip it, rob it)\` |
| Grid paths | \`dp[r][c]\` = paths to (r, c) | \`dp[r - 1][c] + dp[r][c - 1]\` |

**DP applies** when there are overlapping subproblems and optimal substructure. **Recipe:** state → recurrence → base cases → order and answer.`,
      ),
    ],
    quiz: [
      q('¿Qué dos propiedades indican que aplica DP?', 'Which two properties indicate DP applies?', [['Orden y unicidad', 'Order and uniqueness'], ['Subproblemas superpuestos y subestructura óptima', 'Overlapping subproblems and optimal substructure'], ['Grafo y ciclo', 'Graph and cycle'], ['Recursión e iteración', 'Recursion and iteration']], 1,
        'Se repiten los mismos cálculos y la mejor solución se arma con las mejores de los subproblemas.', 'The same computations repeat and the best solution is built from the best of the subproblems.'),
      q('Fibonacci con memoización tiene complejidad…', 'Fibonacci with memoization has complexity…', [['O(2ⁿ)', 'O(2ⁿ)'], ['O(n²)', 'O(n²)'], ['O(n)', 'O(n)'], ['O(log n)', 'O(log n)']], 2, 'Cada valor se calcula una sola vez.', 'Each value is computed only once.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Por qué el Fibonacci recursivo directo es O(2ⁿ)?', 'Why is direct recursive Fibonacci O(2ⁿ)?', [['Porque usa un diccionario', 'Because it uses a dictionary'], ['Porque recalcula los mismos valores una y otra vez', 'Because it recomputes the same values over and over'], ['Porque suma números grandes', 'Because it adds big numbers'], ['No es O(2ⁿ), es O(n)', 'It is not O(2ⁿ), it is O(n)']], 1,
        '`fib(5)` y `fib(4)` llaman los dos a `fib(3)`, y así hacia abajo: para n = 20 son casi 22 mil llamadas.', '`fib(5)` and `fib(4)` both call `fib(3)`, and so on down: for n = 20 that is almost 22 thousand calls.'),
      q('En la memoización, ¿qué guarda el diccionario `memo`?', 'In memoization, what does the `memo` dictionary store?', [['Las llamadas pendientes', 'The pending calls'], ['El resultado de cada subproblema ya calculado', 'The result of each subproblem already computed'], ['Los números de entrada', 'The input numbers'], ['El orden de las llamadas', 'The order of the calls']], 1,
        'Antes de calcular preguntas si ya está; si no, lo calculas y lo guardas.', 'Before computing you ask whether it is there; if not, you compute it and store it.'),
      q('¿Qué hace `@lru_cache` puesto encima de una función?', 'What does `@lru_cache` placed above a function do?', [['Guarda automáticamente sus resultados para reutilizarlos', 'Automatically stores its results to reuse them'], ['La hace iterativa', 'Makes it iterative'], ['Ordena sus argumentos', 'Sorts its arguments'], ['La ejecuta en paralelo', 'Runs it in parallel']], 0,
        'Es memoización automática: no tienes que escribir el diccionario.', 'It is automatic memoization: you do not have to write the dictionary.'),
      q('¿Qué significa resolver un problema de DP **bottom-up**?', 'What does it mean to solve a DP problem **bottom-up**?', [['Empezar por el problema grande con recursión', 'Start from the big problem with recursion'], ['Llenar una tabla en un ciclo, del caso más pequeño al más grande', 'Fill a table in a loop, from the smallest case to the largest'], ['Ordenar la entrada primero', 'Sort the input first'], ['Probar todas las combinaciones', 'Try every combination']], 1,
        'Cuando llegas a `dp[i]`, los valores que necesitas ya están en la tabla.', 'When you reach `dp[i]`, the values you need are already in the table.'),
      q('`fib_dos` solo guarda `a` y `b`. ¿Cuánto espacio usa?', '`fib_dos` only keeps `a` and `b`. How much space does it use?', [['O(n)', 'O(n)'], ['O(2ⁿ)', 'O(2ⁿ)'], ['O(1)', 'O(1)'], ['O(log n)', 'O(log n)']], 2,
        'Como cada valor solo necesita los dos anteriores, no hace falta guardar toda la tabla.', 'Since each value only needs the two before it, there is no need to keep the whole table.'),
      q('¿Cuál es el **primer** paso de la receta de DP?', 'What is the **first** step of the DP recipe?', [['Escribir los casos base', 'Writing the base cases'], ['Definir el estado: qué significa `dp[i]`', 'Defining the state: what `dp[i]` means'], ['Elegir el orden de cálculo', 'Choosing the computation order'], ['Escribir el ciclo', 'Writing the loop']], 1,
        'Sin un estado bien definido, la recurrencia no tiene sentido.', 'Without a well-defined state, the recurrence makes no sense.'),
      q('Subes escalones de 1 o de 2 en 2. ¿Cuál es la recurrencia de `formas[i]`?', 'You climb stairs 1 or 2 at a time. What is the recurrence for `formas[i]`?', [['`formas[i - 1] * 2`', '`formas[i - 1] * 2`'], ['`formas[i - 1] + 1`', '`formas[i - 1] + 1`'], ['`formas[i - 1] + formas[i - 2]`', '`formas[i - 1] + formas[i - 2]`'], ['`i * 2`', '`i * 2`']], 2,
        'Al escalón i llegas desde el i − 1 o desde el i − 2.', 'You reach stair i from i − 1 or from i − 2.'),
      q('Monedas [1, 5, 6] y cantidad 10. ¿Cuántas monedas usa tomar siempre la más grande, y cuál es el mínimo real?', 'Coins [1, 5, 6] and amount 10. How many coins does always taking the largest use, and what is the real minimum?', [['2 y 2', '2 and 2'], ['5 y 2', '5 and 2'], ['3 y 1', '3 and 1'], ['4 y 3', '4 and 3']], 1,
        'Greedy: 6 + 1 + 1 + 1 + 1 = 5 monedas. Lo mejor: 5 + 5 = 2. Por eso hace falta DP.', 'Greedy: 6 + 1 + 1 + 1 + 1 = 5 coins. The best: 5 + 5 = 2. That is why DP is needed.'),
      q('En cambio de monedas, ¿por qué `dp` empieza con `float("inf")` (salvo `dp[0]`)?', 'In coin change, why does `dp` start with `float("inf")` (except `dp[0]`)?', [['Para que el programa sea más rápido', 'To make the program faster'], ['Significa "todavía no sé formarlo", así cualquier forma real es menor', 'It means "I do not know how to make it yet", so any real way is smaller'], ['Porque las monedas son infinitas', 'Because the coins are infinite'], ['Por error', 'By mistake']], 1,
        'Así `min(dp[x], dp[x - m] + 1)` siempre se queda con una forma real.', 'That way `min(dp[x], dp[x - m] + 1)` always keeps a real way.'),
      q('En el ladrón de casas, ¿qué decide en cada casa?', 'In house robber, what is decided at each house?', [['Robarla siempre', 'Always rob it'], ['Lo mejor entre saltarla (mejor hasta la anterior) o robarla (mejor hasta dos antes + esta casa)', 'The best between skipping it (best up to the previous) or robbing it (best up to two back + this house)'], ['Robar solo las pares', 'Rob only the even ones'], ['Robar la más cara', 'Rob the most expensive one']], 1,
        'Por eso basta con recordar dos números mientras recorres las casas.', 'That is why remembering two numbers while walking the houses is enough.'),
      q('Caminos en una cuadrícula moviéndote solo a la derecha o hacia abajo: ¿cuánto vale `dp[r][c]`?', 'Grid paths moving only right or down: what is `dp[r][c]`?', [['`dp[r - 1][c] + dp[r][c - 1]`', '`dp[r - 1][c] + dp[r][c - 1]`'], ['`dp[r - 1][c - 1]`', '`dp[r - 1][c - 1]`'], ['`r + c`', '`r + c`'], ['`dp[r][c - 1] * 2`', '`dp[r][c - 1] * 2`']], 0,
        'A (r, c) llegas desde arriba o desde la izquierda.', 'You reach (r, c) from above or from the left.'),
      q('¿Por qué `[[1] * 3] * 3` es un error para crear una tabla de 3 × 3?', 'Why is `[[1] * 3] * 3` a mistake for creating a 3 × 3 table?', [['Porque da error', 'Because it fails'], ['Porque crea 9 filas', 'Because it creates 9 rows'], ['Porque las tres filas son la misma lista: cambiar una cambia todas', 'Because the three rows are the same list: changing one changes all'], ['No es un error', 'It is not a mistake']], 2,
        'Se usa `[[1] * 3 for _ in range(3)]`, que crea tres listas distintas.', 'Use `[[1] * 3 for _ in range(3)]`, which creates three separate lists.'),
      q('Te bloqueas con un problema de DP en una entrevista. ¿Qué haces primero?', 'You get stuck on a DP problem in an interview. What do you do first?', [['Escribir directamente la tabla', 'Write the table directly'], ['Escribir la solución recursiva de fuerza bruta e identificar qué parámetros cambian', 'Write the brute-force recursive solution and identify which parameters change'], ['Probar un enfoque greedy', 'Try a greedy approach'], ['Ordenar la entrada', 'Sort the input']], 1,
        'Los parámetros que cambian son tu estado; luego agregas memoización.', 'The changing parameters are your state; then you add memoization.'),
    ],
    concepts: [
      concept('Receta de programación dinámica', 'Dynamic programming recipe', 'Estado → recurrencia → casos base → orden de cálculo/respuesta.', 'State → recurrence → base cases → computation order/answer.'),
      concept('Top-down vs bottom-up', 'Top-down vs bottom-up', 'Top-down: recursión + memo (natural de escribir). Bottom-up: tabla iterativa (sin riesgo de recursión profunda, permite optimizar espacio).', 'Top-down: recursion + memo (natural to write). Bottom-up: iterative table (no deep recursion risk, allows space optimization).'),
    ],
    related: ['climbing-stairs', 'house-robber', 'coin-change', 'max-subarray', 'unique-paths'],
  },
];
