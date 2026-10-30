import type { Block, Exercise, Lesson } from '../../../types';
import { code, concept, interview, l, md, q } from '../helpers';
import { C, NODO_ARBOL, P } from './builders';

/* "Parte 2: en la práctica" de los temas más difíciles de la ruta DSA:
 * cada ejemplo resuelto va seguido de un "Ahora tú" parecido. */

const tryIt = (ex: Exercise): Block[] => [md('### ✍️ Ahora tú', '### ✍️ Your turn'), { kind: 'exercise', ex }];

/* ======================= Recursión en la práctica ======================= */
export const RECURSION_PRACTICE_LESSON: Lesson = {
  id: 'recursion-practice',
  track: 'dsa',
  title: l('Recursión en la práctica', 'Recursion in practice'),
  summary: l('Cuatro patrones de recursión resueltos paso a paso, y luego los haces tú.', 'Four recursion patterns solved step by step, then you do them.'),
  minutes: 20,
  blocks: [
    md(
      `## El método de siempre
1. ¿Qué **devuelve** la función para un problema dado?
2. ¿Cuál es el **caso más pequeño** que se resuelve directo? (caso base)
3. **Confía** en que la llamada con un problema más chico ya funciona.
4. **Combina** ese resultado con el trabajo de esta llamada.

No intentes seguir todas las llamadas en tu cabeza: concéntrate en una sola llamada y en el caso base.`,
      `## The usual method
1. What does the function **return** for a given problem?
2. What is the **smallest case** solved directly? (base case)
3. **Trust** that the call on a smaller problem already works.
4. **Combine** that result with this call's work.

Do not try to follow every call in your head: focus on a single call and the base case.`,
    ),

    md('## Ejemplo 1: recursión sobre un número', '## Example 1: recursion on a number'),
    code(`def suma_digitos(n):
    if n < 10:                          # un solo dígito: caso base
        return n
    return n % 10 + suma_digitos(n // 10)   # último dígito + el resto

print(suma_digitos(472))   # 4 + 7 + 2 = 13`),
    md(
      '`n % 10` es el último dígito y `n // 10` quita ese dígito. Cada llamada resuelve un número con un dígito menos.',
      '`n % 10` is the last digit and `n // 10` removes it. Each call solves a number with one fewer digit.',
    ),
    ...tryIt(P('rcp-digits', 'basic', l('Ahora cuenta los dígitos en vez de sumarlos. ¿Qué imprime?', 'Now count the digits instead of adding them. What does it print?'),
      `def contar_digitos(n):
    if n < 10:
        return 1
    return 1 + contar_digitos(n // 10)

print(contar_digitos(12345))`,
      '5',
      l('Cada llamada quita un dígito y suma 1; el caso base cuenta el último dígito. 12345 tiene **5** dígitos.', 'Each call removes a digit and adds 1; the base case counts the last digit. 12345 has **5** digits.'),
      l('Misma estructura que `suma_digitos`, pero cada nivel aporta 1 en vez del dígito.', 'Same structure as `suma_digitos`, but each level contributes 1 instead of the digit.'))),

    md('## Ejemplo 2: recursión sobre un string', '## Example 2: recursion on a string'),
    code(`def invertir(s):
    if len(s) <= 1:                 # "" o una letra ya están invertidos
        return s
    return invertir(s[1:]) + s[0]   # invierte el resto y pon la primera al final

print(invertir("hola"))   # aloh`),
    md(
      'El problema más chico es el string sin su primera letra. Ojo: `s[1:]` copia el string, así que esta versión es O(n²); en una entrevista conviene mencionarlo.',
      'The smaller problem is the string without its first letter. Note: `s[1:]` copies the string, so this version is O(n²); worth mentioning in an interview.',
    ),
    ...tryIt(C('rcp-palindrome', 'medium', l('Palíndromo recursivo. ¿Qué va en el último `return`? (con la correcta imprime `True False`)', 'Recursive palindrome. What goes in the last `return`? (the right one prints `True False`)'),
      `def es_pal(s):
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return ____

print(es_pal("reconocer"), es_pal("abca"))`,
      ['es_pal(s[1:-1])', 'es_pal(s[1:])', 'es_pal(s[:-1])', 'True'],
      0,
      l('Si los extremos coinciden, falta revisar **lo de en medio**: `s[1:-1]` quita la primera y la última letra. Devolver `True` sin revisar el centro diría que "abca" es palíndromo.', 'If both ends match, you still need to check **the middle**: `s[1:-1]` drops the first and last letters. Returning `True` without checking the middle would call "abca" a palindrome.'),
      l('Compara la primera y la última letra; si son iguales, el problema se reduce al string sin ellas.', 'It compares the first and last letters; if equal, the problem shrinks to the string without them.'))),

    md('## Ejemplo 3: construir el resultado al regresar', '## Example 3: building the result on the way back'),
    code(`def maximo(xs):
    if len(xs) == 1:
        return xs[0]
    resto = maximo(xs[1:])            # el máximo de todo menos el primero
    return xs[0] if xs[0] > resto else resto

print(maximo([3, 9, 2, 7]))   # 9`),
    md(
      'La llamada recursiva devuelve la respuesta del resto, y esta llamada solo decide entre su elemento y esa respuesta.',
      'The recursive call returns the answer for the rest, and this call only decides between its element and that answer.',
    ),
    ...tryIt(P('rcp-binary', 'medium', l('Convertir a binario. ¿Qué imprime?', 'Convert to binary. What does it print?'),
      `def binario(n):
    if n < 2:
        return str(n)
    return binario(n // 2) + str(n % 2)

print(binario(10))`,
      '1010',
      l('10 → 5 r0 → 2 r1 → 1 r0 → "1". Al regresar se pegan los residuos: "1" + "0" + "1" + "0" = **1010**.', '10 → 5 r0 → 2 r1 → 1 r0 → "1". On the way back the remainders are appended: "1" + "0" + "1" + "0" = **1010**.'),
      l('`n % 2` es el último bit y `n // 2` el número sin ese bit. El último bit se agrega **después** de la llamada, por eso queda al final.', '`n % 2` is the last bit and `n // 2` the number without it. The last bit is appended **after** the call, so it ends up last.'))),

    md('## Ejemplo 4: backtracking con combinaciones', '## Example 4: backtracking with combinations'),
    code(`def combinaciones(n, k):
    res = []
    def bt(inicio, actual):
        if len(actual) == k:          # ya elegí k números
            res.append(actual[:])
            return
        for i in range(inicio, n + 1):
            actual.append(i)          # elegir i
            bt(i + 1, actual)         # seguir con números mayores
            actual.pop()              # deshacer
    bt(1, [])
    return res

print(combinaciones(4, 2))
# [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]`),
    md(
      'Empezar en `i + 1` evita repetir combinaciones en otro orden ([2, 1] sería la misma que [1, 2]).',
      'Starting at `i + 1` avoids repeating combinations in another order ([2, 1] would be the same as [1, 2]).',
    ),
    ...tryIt(P('rcp-comb', 'interview', l('¿Cuántas combinaciones de 3 números hay entre 1 y 5? ¿Qué imprime?', 'How many 3-number combinations are there from 1 to 5? What does it print?'),
      `def combinaciones(n, k):
    res = []
    def bt(inicio, actual):
        if len(actual) == k:
            res.append(actual[:])
            return
        for i in range(inicio, n + 1):
            actual.append(i)
            bt(i + 1, actual)
            actual.pop()
    bt(1, [])
    return res

print(len(combinaciones(5, 3)))`,
      '10',
      l('Son "5 en 3" = 5! / (3! · 2!) = **10**. El backtracking las genera todas sin repetir.', 'It is "5 choose 3" = 5! / (3! · 2!) = **10**. Backtracking generates all of them without repeats.'),
      l('Igual que el ejemplo, pero con n = 5 y k = 3. Cada camino del árbol de decisiones que llega a 3 números es una combinación.', 'Same as the example but with n = 5 and k = 3. Every path of the decision tree that reaches 3 numbers is one combination.'))),
    interview(
      'Al resolver con recursión en voz alta, di primero el **caso base** y luego "supongamos que la llamada con n − 1 funciona". Al entrevistador le muestra que piensas de forma estructurada.',
      'When solving recursively out loud, state the **base case** first and then "assume the call with n − 1 works". It shows the interviewer you think in a structured way.',
    ),
  ],
  quiz: [
    q('En `suma_digitos`, ¿qué hace `n // 10`?', 'In `suma_digitos`, what does `n // 10` do?', [['Toma el último dígito', 'Takes the last digit'], ['Quita el último dígito', 'Removes the last digit'], ['Divide entre 10 con decimales', 'Divides by 10 with decimals'], ['Suma 10', 'Adds 10']], 1,
      'La división entera entre 10 elimina el último dígito; `n % 10` es el que se toma.', 'Integer division by 10 drops the last digit; `n % 10` is the one taken.'),
    q('¿Por qué `combinaciones` llama con `i + 1` y no con `inicio`?', 'Why does `combinaciones` recurse with `i + 1` and not `inicio`?', [['Para ir más rápido', 'To go faster'], ['Para no repetir combinaciones en otro orden', 'To avoid repeating combinations in another order'], ['Porque Python lo exige', 'Because Python requires it'], ['Para incluir el 0', 'To include 0']], 1,
      'Solo se eligen números mayores que el último elegido.', 'Only numbers larger than the last chosen one are picked.'),
    q('`invertir(s)` con `s[1:]` en cada llamada cuesta…', '`invertir(s)` with `s[1:]` in each call costs…', [['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(n²)', 'O(n²)'], ['O(1)', 'O(1)']], 2,
      'Son n llamadas y cada slice copia hasta n caracteres.', 'There are n calls and each slice copies up to n characters.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('En `suma_digitos(n)`, ¿cuál es el caso base?', 'In `suma_digitos(n)`, what is the base case?', [['`n == 0`', '`n == 0`'], ['`n < 10`: un solo dígito, que se devuelve tal cual', '`n < 10`: a single digit, returned as is'], ['`n > 10`', '`n > 10`'], ['No tiene', 'It has none']], 1,
      'Un número de un dígito ya es la suma de sus dígitos.', 'A one-digit number already is the sum of its digits.'),
    q('¿Qué devuelve `n % 10`?', 'What does `n % 10` return?', [['El último dígito de n', 'The last digit of n'], ['n sin su último dígito', 'n without its last digit'], ['n dividido entre 10', 'n divided by 10'], ['El primer dígito', 'The first digit']], 0,
      'Es el residuo de dividir entre 10. `n // 10` es el que quita ese dígito.', 'It is the remainder of dividing by 10. `n // 10` is the one that removes it.'),
    q('`invertir(s)` devuelve `invertir(s[1:]) + s[0]`. ¿Qué da `invertir("hola")`?', '`invertir(s)` returns `invertir(s[1:]) + s[0]`. What does `invertir("hola")` give?', [['"hola"', '"hola"'], ['"ahol"', '"ahol"'], ['"aloh"', '"aloh"'], ['"h"', '"h"']], 2,
      'Invierte el resto ("ola" → "alo") y pone la primera letra al final.', 'It reverses the rest ("ola" → "alo") and puts the first letter at the end.'),
    q('Para saber si un texto es palíndromo con recursión, después de comparar la primera y la última letra…', 'To check whether a text is a palindrome recursively, after comparing the first and last letters…', [['Llamas con `s[1:]`', 'You call with `s[1:]`'], ['Devuelves `True`', 'You return `True`'], ['Llamas con `s[:-1]`', 'You call with `s[:-1]`'], ['Llamas con `s[1:-1]`: el texto sin sus dos extremos', 'You call with `s[1:-1]`: the text without both ends']], 3,
      'Si los extremos coinciden, falta revisar lo de en medio.', 'If the ends match, what is left to check is the middle.'),
    q('En `maximo(xs)`, ¿en qué momento se decide cuál es el mayor?', 'In `maximo(xs)`, when is the largest decided?', [['Antes de la llamada recursiva', 'Before the recursive call'], ['Al regresar: compara `xs[0]` con el máximo del resto', 'On the way back: it compares `xs[0]` with the maximum of the rest'], ['Nunca: devuelve el primero', 'Never: it returns the first'], ['En el caso base', 'In the base case']], 1,
      'Primero obtiene el máximo del resto y luego combina con el primero.', 'It first gets the maximum of the rest and then combines it with the first.'),
    q('¿Cuántas listas devuelve `combinaciones(4, 2)` (elegir 2 números entre 1 y 4, sin importar el orden)?', 'How many lists does `combinaciones(4, 2)` return (choosing 2 numbers from 1 to 4, order not mattering)?', [['4', '4'], ['8', '8'], ['6', '6'], ['16', '16']], 2,
      '[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4].', '[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4].'),
    q('Al escribir una recursión, ¿en qué conviene concentrarse?', 'When writing a recursion, what should you focus on?', [['En seguir todas las llamadas hasta el fondo', 'Following every call to the bottom'], ['En una sola llamada y en el caso base, confiando en que la llamada más chica funciona', 'On a single call and the base case, trusting that the smaller call works'], ['En el orden de las impresiones', 'The order of the prints'], ['En usar ciclos', 'Using loops']], 1,
      'Es el método: qué devuelve, caso base, confiar y combinar.', 'That is the method: what it returns, base case, trust and combine.'),
  ],
  concepts: [
    concept('Los 4 pasos para escribir una función recursiva', 'The 4 steps to write a recursive function', 'Qué devuelve → caso base → confiar en la llamada más pequeña → combinar.', 'What it returns → base case → trust the smaller call → combine.'),
    concept('¿Por qué un slice dentro de una recursión puede costar O(n²)?', 'Why can a slice inside recursion cost O(n²)?', 'Porque cada slice copia elementos (O(k)) y se hace en cada una de las n llamadas. Se evita pasando índices.', 'Because each slice copies elements (O(k)) and it happens in each of the n calls. Passing indices avoids it.'),
  ],
};

/* ======================= Árboles en la práctica ======================= */
export const TREES_PRACTICE_LESSON: Lesson = {
  id: 'trees-practice',
  track: 'dsa',
  title: l('Árboles en la práctica', 'Trees in practice'),
  summary: l('La plantilla "resuelve los hijos y combina" aplicada a cuatro problemas típicos.', 'The "solve the children and combine" template applied to four typical problems.'),
  minutes: 20,
  blocks: [
    md(
      `## Una sola plantilla
Casi todos los problemas de árboles se resuelven igual:
1. **Caso base:** ¿qué devuelves para un nodo vacío (\`None\`)?
2. **Llamadas:** resuelve el problema para el hijo izquierdo y para el derecho.
3. **Combina:** con esas dos respuestas y el valor del nodo, calcula la respuesta de este nodo.

En todos los ejemplos se usa esta clase:`,
      `## A single template
Almost every tree problem is solved the same way:
1. **Base case:** what do you return for an empty node (\`None\`)?
2. **Calls:** solve the problem for the left child and the right child.
3. **Combine:** with those two answers and the node's value, compute this node's answer.

Every example uses this class:`,
    ),
    code(NODO_ARBOL),

    md('## Ejemplo 1: sumar todos los valores', '## Example 1: adding all values'),
    code(`${NODO_ARBOL}
def suma(n):
    if not n:                 # árbol vacío: suma 0
        return 0
    return n.val + suma(n.izq) + suma(n.der)

print(suma(Nodo(1, Nodo(2), Nodo(3))))   # 6`),
    ...tryIt(P('trp-leaves', 'basic', l('Ahora cuenta las **hojas** (nodos sin hijos). ¿Qué imprime?', 'Now count the **leaves** (nodes with no children). What does it print?'),
      `${NODO_ARBOL}
def hojas(n):
    if not n:
        return 0
    if not n.izq and not n.der:     # es una hoja
        return 1
    return hojas(n.izq) + hojas(n.der)

print(hojas(Nodo(1, Nodo(2, Nodo(4), Nodo(5)), Nodo(3))))`,
      '3',
      l('Las hojas son 4, 5 y 3 → **3**. Un nodo con hijos no cuenta; solo suma las hojas de sus subárboles.', 'The leaves are 4, 5 and 3 → **3**. A node with children does not count; it only adds its subtrees\' leaves.'),
      l('Hay dos casos base: el nodo vacío (0) y la hoja (1). Los demás nodos suman lo de sus hijos.', 'There are two base cases: the empty node (0) and the leaf (1). Other nodes add up their children.'))),

    md('## Ejemplo 2: comparar dos árboles', '## Example 2: comparing two trees'),
    code(`${NODO_ARBOL}
def altura(n):
    if not n:
        return 0
    return 1 + max(altura(n.izq), altura(n.der))

def balanceado(n):
    if not n:
        return True
    if abs(altura(n.izq) - altura(n.der)) > 1:
        return False
    return balanceado(n.izq) and balanceado(n.der)

print(balanceado(Nodo(1, Nodo(2, Nodo(3)))))   # False: la izquierda mide 2 y la derecha 0`),
    ...tryIt(C('trp-same', 'medium', l('¿Son **el mismo árbol**? Completa el `return` (con la correcta imprime `True False`).', 'Are they **the same tree**? Complete the `return` (the right one prints `True False`).'),
      `${NODO_ARBOL}
def igual(a, b):
    if not a and not b:
        return True
    if not a or not b or a.val != b.val:
        return False
    return ____

t1 = Nodo(1, Nodo(2), Nodo(3))
t2 = Nodo(1, Nodo(2), Nodo(3))
t3 = Nodo(1, Nodo(2), Nodo(4))
print(igual(t1, t2), igual(t1, t3))`,
      ['igual(a.izq, b.izq) and igual(a.der, b.der)', 'igual(a.izq, b.der) and igual(a.der, b.izq)', 'igual(a.izq, b.izq) or igual(a.der, b.der)', 'True'],
      0,
      l('Dos árboles son iguales si las raíces coinciden **y** los izquierdos son iguales **y** los derechos también. Con `or` bastaría un lado; cruzar izquierda con derecha revisa si son espejo.', 'Two trees are equal if the roots match **and** the left subtrees are equal **and** the right ones too. With `or` one side would suffice; crossing left with right checks for mirrors.'),
      l('Recorre los dos árboles a la vez, nodo por nodo.', 'It walks both trees at once, node by node.'))),

    md('## Ejemplo 3: aprovechar el orden de un BST', '## Example 3: using the BST order'),
    code(`${NODO_ARBOL}
def buscar(n, x):
    while n:                      # no hace falta recursión: bajas por un solo camino
        if x == n.val:
            return True
        n = n.izq if x < n.val else n.der
    return False

raiz = Nodo(8, Nodo(3, Nodo(1), Nodo(6)), Nodo(10))
print(buscar(raiz, 6), buscar(raiz, 7))   # True False`),
    ...tryIt(P('trp-min', 'basic', l('¿Cuál es el valor **mínimo** del BST? ¿Qué imprime?', 'What is the BST\'s **minimum** value? What does it print?'),
      `${NODO_ARBOL}
raiz = Nodo(8, Nodo(3, Nodo(1), Nodo(6)), Nodo(10))
n = raiz
while n.izq:
    n = n.izq
print(n.val)`,
      '1',
      l('En un BST el mínimo está **lo más a la izquierda posible**: 8 → 3 → 1. Cuesta O(h), sin revisar todo el árbol.', 'In a BST the minimum is **as far left as possible**: 8 → 3 → 1. It costs O(h), without checking the whole tree.'),
      l('Baja siempre a la izquierda mientras haya hijo izquierdo.', 'It always goes left while there is a left child.'))),

    md('## Ejemplo 4: ancestro común más bajo en un BST', '## Example 4: lowest common ancestor in a BST'),
    code(`${NODO_ARBOL}
def lca(n, p, q):
    while n:
        if p < n.val and q < n.val:     # los dos están a la izquierda
            n = n.izq
        elif p > n.val and q > n.val:   # los dos están a la derecha
            n = n.der
        else:                           # se separan aquí: este es el ancestro
            return n.val

raiz = Nodo(8, Nodo(3, Nodo(1), Nodo(6)), Nodo(10))
print(lca(raiz, 1, 10))   # 8`),
    ...tryIt(P('trp-lca', 'interview', l('¿Qué imprime?', 'What does it print?'),
      `${NODO_ARBOL}
def lca(n, p, q):
    while n:
        if p < n.val and q < n.val:
            n = n.izq
        elif p > n.val and q > n.val:
            n = n.der
        else:
            return n.val

raiz = Nodo(8, Nodo(3, Nodo(1), Nodo(6)), Nodo(10))
print(lca(raiz, 1, 6), lca(raiz, 6, 3))`,
      '3 3',
      l('1 y 6 están ambos a la izquierda de 8 y se separan en **3**. Para 6 y 3, el 3 es ancestro de sí mismo: el camino "se separa" justo en él → **3**.', '1 and 6 are both left of 8 and split at **3**. For 6 and 3, 3 is its own ancestor: the path "splits" right at it → **3**.'),
      l('Mientras los dos valores queden del mismo lado, se baja por ese lado. El primer nodo donde ya no es así es el ancestro común.', 'While both values are on the same side, it goes down that side. The first node where that stops being true is the common ancestor.'))),
    interview(
      'Antes de programar, pregunta: "¿es un árbol binario cualquiera o un BST?". Si es BST, casi siempre puedes bajar por **un solo camino** (O(h)) en vez de recorrer todo (O(n)).',
      'Before coding, ask: "is it any binary tree or a BST?". If it is a BST you can almost always go down **a single path** (O(h)) instead of visiting everything (O(n)).',
    ),
  ],
  quiz: [
    q('¿Qué devuelve casi siempre el caso base de un problema de árboles?', 'What does a tree problem\'s base case usually return?', [['La raíz', 'The root'], ['El valor para un nodo vacío (None)', 'The value for an empty node (None)'], ['El hijo izquierdo', 'The left child'], ['Una lista', 'A list']], 1,
      'El nodo vacío es el caso más pequeño posible.', 'The empty node is the smallest possible case.'),
    q('Buscar un valor en un BST balanceado cuesta…', 'Searching a value in a balanced BST costs…', [['O(n)', 'O(n)'], ['O(log n)', 'O(log n)'], ['O(1)', 'O(1)'], ['O(n log n)', 'O(n log n)']], 1,
      'Bajas por un solo camino de altura log n.', 'You go down a single path of height log n.'),
    q('Para saber si dos árboles son iguales, comparas…', 'To know whether two trees are equal, you compare…', [['Solo las raíces', 'Only the roots'], ['Raíces, y luego izquierdo con izquierdo y derecho con derecho', 'Roots, then left with left and right with right'], ['Izquierdo con derecho', 'Left with right'], ['La altura', 'The height']], 1,
      'Las tres condiciones deben cumplirse a la vez.', 'All three conditions must hold at once.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('¿Qué combina `suma(n)` en cada nodo?', 'What does `suma(n)` combine at each node?', [['Solo el valor del nodo', 'Only the node\'s value'], ['El valor del nodo + la suma de la izquierda + la de la derecha', 'The node\'s value + the left sum + the right sum'], ['El máximo de los dos hijos', 'The maximum of the two children'], ['La altura', 'The height']], 1,
      'Es la plantilla: resuelve los hijos y combina con el nodo.', 'It is the template: solve the children and combine with the node.'),
    q('Un árbol se considera **balanceado** si en cada nodo…', 'A tree is considered **balanced** if at every node…', [['Los dos hijos tienen el mismo valor', 'Both children have the same value'], ['Las alturas de la izquierda y la derecha difieren en a lo más 1', 'The left and right heights differ by at most 1'], ['Hay exactamente dos hijos', 'There are exactly two children'], ['Está ordenado', 'It is sorted']], 1,
      'El árbol 1 → 2 → 3 (todo a la izquierda) no lo es: en la raíz la izquierda mide 2 y la derecha 0.', 'The tree 1 → 2 → 3 (all to the left) is not: at the root the left measures 2 and the right 0.'),
    q('¿Por qué buscar en un BST no necesita recorrer todo el árbol?', 'Why does searching a BST not need to visit the whole tree?', [['Porque el árbol es pequeño', 'Because the tree is small'], ['Porque en cada nodo sabes de qué lado está el valor y bajas por un solo camino', 'Because at each node you know which side the value is on and go down a single path'], ['Porque usa una cola', 'Because it uses a queue'], ['Sí necesita recorrerlo todo', 'It does need to visit it all']], 1,
      'Por eso cuesta O(h) en vez de O(n).', 'That is why it costs O(h) instead of O(n).'),
    q('¿Dónde está el valor **mínimo** de un BST?', 'Where is the **minimum** value of a BST?', [['En la raíz', 'At the root'], ['En la hoja más a la derecha', 'At the rightmost leaf'], ['Lo más a la izquierda posible', 'As far left as possible'], ['En cualquier hoja', 'At any leaf']], 2,
      'Bajas siempre a la izquierda mientras haya hijo izquierdo: O(h).', 'You keep going left while there is a left child: O(h).'),
    q('En un BST, el ancestro común más bajo de p y q es…', 'In a BST, the lowest common ancestor of p and q is…', [['Siempre la raíz', 'Always the root'], ['El primer nodo, bajando desde la raíz, donde p y q quedan de lados distintos (o uno es el propio nodo)', 'The first node, going down from the root, where p and q end up on different sides (or one is the node itself)'], ['El padre de p', 'p\'s parent'], ['El nodo más profundo', 'The deepest node']], 1,
      'Mientras los dos estén del mismo lado, bajas por ese lado.', 'While both are on the same side, you go down that side.'),
    q('Antes de resolver un problema de árboles en una entrevista, ¿qué conviene preguntar?', 'Before solving a tree problem in an interview, what should you ask?', [['Si el árbol es un BST, porque entonces suele bastar un solo camino (O(h))', 'Whether the tree is a BST, because then a single path (O(h)) usually suffices'], ['Cuántos nodos tiene exactamente', 'Exactly how many nodes it has'], ['En qué lenguaje se escribió', 'Which language it was written in'], ['Nada', 'Nothing']], 0,
      'En un árbol binario cualquiera normalmente hay que visitar todo: O(n).', 'In an arbitrary binary tree you usually have to visit everything: O(n).'),
  ],
  concepts: [
    concept('Plantilla para problemas de árboles', 'Template for tree problems', 'Caso base para None → resolver hijo izquierdo y derecho → combinar con el valor del nodo.', 'Base case for None → solve left and right child → combine with the node\'s value.'),
    concept('¿Dónde está el mínimo de un BST?', 'Where is a BST\'s minimum?', 'En el nodo más a la izquierda: se baja por izquierda hasta que no haya más. O(h).', 'At the leftmost node: go left until there is no more. O(h).'),
  ],
};

/* ======================= Grafos en la práctica ======================= */
export const GRAPHS_PRACTICE_LESSON: Lesson = {
  id: 'graphs-practice',
  track: 'dsa',
  title: l('Grafos en la práctica', 'Graphs in practice'),
  summary: l('Componentes, caminos en cuadrículas y dependencias, resueltos y luego por tu cuenta.', 'Components, grid paths and dependencies, solved and then on your own.'),
  minutes: 22,
  blocks: [
    md(
      `## Antes de programar, pregúntate
1. ¿Qué son los **nodos** y qué son las **aristas**? (en una cuadrícula, cada celda es un nodo y sus vecinos son las 4 direcciones)
2. ¿Me piden el **camino más corto** sin pesos? → **BFS**.
3. ¿Me piden explorar todo lo conectado, contar grupos o detectar ciclos? → **DFS** (o BFS).
4. ¿Hay **dependencias** ("A antes que B")? → **orden topológico**.

Y siempre: marca los **visitados** para no entrar en ciclos.`,
      `## Before coding, ask yourself
1. What are the **nodes** and what are the **edges**? (in a grid each cell is a node and its neighbors are the 4 directions)
2. Am I asked for the **shortest path** without weights? → **BFS**.
3. Am I asked to explore everything connected, count groups or detect cycles? → **DFS** (or BFS).
4. Are there **dependencies** ("A before B")? → **topological sort**.

And always: mark **visited** nodes so you do not loop forever.`,
    ),

    md('## Ejemplo 1: contar componentes conexas', '## Example 1: counting connected components'),
    code(`g = {1: [2], 2: [1, 3], 3: [2], 4: [5], 5: [4]}
visto = set()

def dfs(n):
    visto.add(n)
    for v in g[n]:
        if v not in visto:
            dfs(v)

componentes = 0
for n in g:
    if n not in visto:       # nodo nuevo: empieza un grupo
        componentes += 1
        dfs(n)               # marca todo su grupo
print(componentes)   # 2: {1, 2, 3} y {4, 5}`),
    ...tryIt(P('grp-components', 'basic', l('¿Cuántas componentes tiene este grafo? ¿Qué imprime?', 'How many components does this graph have? What does it print?'),
      `g = {1: [2], 2: [1], 3: [], 4: [5], 5: [4]}
visto = set()

def dfs(n):
    visto.add(n)
    for v in g[n]:
        if v not in visto:
            dfs(v)

componentes = 0
for n in g:
    if n not in visto:
        componentes += 1
        dfs(n)
print(componentes)`,
      '3',
      l('Los grupos son {1, 2}, {3} y {4, 5} → **3**. Un nodo sin aristas (el 3) es una componente por sí solo.', 'The groups are {1, 2}, {3} and {4, 5} → **3**. A node with no edges (3) is a component on its own.'),
      l('Cada vez que el `for` encuentra un nodo no visitado, empieza una componente nueva y DFS marca todo lo conectado a él.', 'Each time the `for` finds an unvisited node, a new component starts and DFS marks everything connected to it.'))),

    md('## Ejemplo 2: camino más corto en una cuadrícula', '## Example 2: shortest path in a grid'),
    code(`from collections import deque

grid = ["..#",
        ".#.",
        "..."]
filas, cols = len(grid), len(grid[0])
dist = {(0, 0): 0}
cola = deque([(0, 0)])
while cola:
    r, c = cola.popleft()
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:     # 4 direcciones
        nr, nc = r + dr, c + dc
        if 0 <= nr < filas and 0 <= nc < cols and grid[nr][nc] == "." and (nr, nc) not in dist:
            dist[(nr, nc)] = dist[(r, c)] + 1
            cola.append((nr, nc))
print(dist[(2, 2)])   # 4: baja por la izquierda y sigue por abajo`),
    ...tryIt(P('grp-grid', 'medium', l('Ahora con otra cuadrícula, del (0, 0) al (2, 0). ¿Qué imprime?', 'Now with another grid, from (0, 0) to (2, 0). What does it print?'),
      `from collections import deque

grid = ["....",
        "##.#",
        "...."]
filas, cols = len(grid), len(grid[0])
dist = {(0, 0): 0}
cola = deque([(0, 0)])
while cola:
    r, c = cola.popleft()
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < filas and 0 <= nc < cols and grid[nr][nc] == "." and (nr, nc) not in dist:
            dist[(nr, nc)] = dist[(r, c)] + 1
            cola.append((nr, nc))
print(dist[(2, 0)])`,
      '6',
      l('El muro solo tiene un hueco en la columna 2: hay que ir a la derecha 2, bajar 2 y volver a la izquierda 2 → **6** pasos.', 'The wall has a single gap at column 2: go right 2, down 2 and back left 2 → **6** steps.'),
      l('Cada celda libre es un nodo. BFS sale de (0, 0) y anota la distancia de cada celda la primera vez que la alcanza.', 'Each free cell is a node. BFS starts at (0, 0) and records each cell\'s distance the first time it reaches it.'))),

    md('## Ejemplo 3: dependencias con orden topológico', '## Example 3: dependencies with topological sort'),
    code(`from collections import deque

prereq = [("b", "a"), ("c", "b")]        # (tarea, requisito): b necesita a, c necesita b
tareas = ["a", "b", "c"]
g = {t: [] for t in tareas}
grado = {t: 0 for t in tareas}
for t, r in prereq:
    g[r].append(t)
    grado[t] += 1
cola = deque([t for t in tareas if grado[t] == 0])
orden = []
while cola:
    t = cola.popleft()
    orden.append(t)
    for v in g[t]:
        grado[v] -= 1
        if grado[v] == 0:
            cola.append(v)
print(orden)   # ['a', 'b', 'c']`),
    ...tryIt(P('grp-topo', 'medium', l('Cursos 0 a 3 con requisitos. ¿En qué orden se toman? ¿Qué imprime?', 'Courses 0 to 3 with prerequisites. In which order are they taken? What does it print?'),
      `from collections import deque

prereq = [(1, 0), (2, 0), (3, 1), (3, 2)]      # (curso, requisito)
g = {i: [] for i in range(4)}
grado = [0] * 4
for c, r in prereq:
    g[r].append(c)
    grado[c] += 1
cola = deque([i for i in range(4) if grado[i] == 0])
orden = []
while cola:
    n = cola.popleft()
    orden.append(n)
    for v in g[n]:
        grado[v] -= 1
        if grado[v] == 0:
            cola.append(v)
print(orden)`,
      '[0, 1, 2, 3]',
      l('0 no tiene requisitos; al terminarlo se liberan 1 y 2; el 3 necesita ambos, así que va al final → **[0, 1, 2, 3]**.', '0 has no prerequisites; finishing it frees 1 and 2; 3 needs both, so it goes last → **[0, 1, 2, 3]**.'),
      l('Un curso entra a la cola cuando ya no le falta ningún requisito (grado 0).', 'A course enters the queue once it has no pending prerequisites (in-degree 0).'))),

    md('## Ejemplo 4: el detalle que más errores causa', '## Example 4: the detail that causes the most bugs'),
    md(
      'En BFS hay que marcar el nodo como visitado **al meterlo a la cola**. Si lo marcas al sacarlo, un nodo con varios vecinos puede entrar a la cola varias veces.',
      'In BFS you must mark the node visited **when putting it in the queue**. If you mark it when taking it out, a node with several neighbors can enter the queue several times.',
    ),
    ...tryIt(C('grp-mark', 'interview', l('¿Dónde va la marca de visitado? (con la correcta imprime `4`: cada nodo se encola una vez)', 'Where does the visited mark go? (the right one prints `4`: each node is enqueued once)'),
      `from collections import deque
g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
visitados = {"A"}
cola = deque(["A"])
encolados = 1
while cola:
    n = cola.popleft()
    for v in g[n]:
        if v not in visitados:
            ____
            cola.append(v)
            encolados += 1
print(encolados)`,
      ['visitados.add(v)', 'visitados.add(n)', 'pass', 'visitados.discard(v)'],
      0,
      l('Marcar `v` justo al encolarlo hace que D (vecino de B y de C) entre **una sola vez**. Si no se marca, D se encola dos veces y el total da 5.', 'Marking `v` right when enqueuing it makes D (neighbor of both B and C) enter **only once**. Without it, D is enqueued twice and the total is 5.'),
      l('`encolados` cuenta cuántas veces entra algo a la cola. Lo ideal es una vez por nodo.', '`encolados` counts how many times something enters the queue. Ideally once per node.'))),
    interview(
      'Muchos problemas no dicen "grafo": "islas", "laberinto", "cambiar una palabra por otra letra a letra", "red de amigos". Practica traducir el enunciado a nodos y aristas.',
      'Many problems never say "graph": "islands", "maze", "change one word into another letter by letter", "friend network". Practice translating the statement into nodes and edges.',
    ),
  ],
  quiz: [
    q('En una cuadrícula, ¿qué es una arista?', 'In a grid, what is an edge?', [['Una fila', 'A row'], ['La conexión entre una celda y una vecina', 'The connection between a cell and a neighbor'], ['Un muro', 'A wall'], ['La celda final', 'The target cell']], 1,
      'Cada celda se conecta con sus vecinas (normalmente 4 direcciones).', 'Each cell connects to its neighbors (usually 4 directions).'),
    q('Te piden el mínimo número de movimientos en un laberinto. Usas…', 'You are asked for the minimum number of moves in a maze. You use…', [['DFS', 'DFS'], ['BFS', 'BFS'], ['Ordenamiento', 'Sorting'], ['Un heap de máximo', 'A max-heap']], 1,
      'Sin pesos, BFS da la distancia mínima.', 'Without weights, BFS gives the minimum distance.'),
    q('Si al hacer orden topológico no se procesan todos los nodos, significa que…', 'If topological sort does not process every node, it means…', [['El grafo está vacío', 'The graph is empty'], ['Hay un ciclo', 'There is a cycle'], ['Faltan aristas', 'Edges are missing'], ['Hay que usar DFS', 'You must use DFS']], 1,
      'Los nodos de un ciclo nunca llegan a grado 0.', 'Nodes in a cycle never reach in-degree 0.'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('¿Cómo se cuentan las componentes conexas de un grafo?', 'How do you count the connected components of a graph?', [['Contando las aristas', 'Counting the edges'], ['Por cada nodo sin visitar: sumas 1 y lanzas un DFS que marque todo su grupo', 'For each unvisited node: add 1 and start a DFS marking its whole group'], ['Con orden topológico', 'With topological sort'], ['Contando los nodos', 'Counting the nodes']], 1,
      'Cada DFS recorre un grupo completo; los nodos ya marcados no inician otro.', 'Each DFS covers a whole group; already marked nodes do not start another.'),
    q('En BFS sobre una cuadrícula, ¿qué es cada nodo y cómo se obtienen sus vecinos?', 'In BFS on a grid, what is each node and how do you get its neighbors?', [['Cada fila; con la fila siguiente', 'Each row; with the next row'], ['Cada celda libre (r, c); sumando las 4 direcciones (1, 0), (-1, 0), (0, 1), (0, -1)', 'Each free cell (r, c); adding the 4 directions (1, 0), (-1, 0), (0, 1), (0, -1)'], ['Cada muro; con los muros cercanos', 'Each wall; with the nearby walls'], ['Cada número; con el siguiente', 'Each number; with the next one']], 1,
      'Y antes de usar un vecino revisas que esté dentro, que sea libre y que no se haya visitado.', 'And before using a neighbor you check that it is inside, free and not visited.'),
    q('¿Qué revisa `0 <= nr < filas and 0 <= nc < cols`?', 'What does `0 <= nr < filas and 0 <= nc < cols` check?', [['Que la celda esté libre', 'That the cell is free'], ['Que la celda vecina esté dentro de la cuadrícula', 'That the neighboring cell is inside the grid'], ['Que ya se visitó', 'That it was already visited'], ['Que es la meta', 'That it is the target']], 1,
      'Sin esa revisión intentarías leer fuera de la cuadrícula.', 'Without that check you would try to read outside the grid.'),
    q('En el BFS de la cuadrícula, el diccionario `dist` sirve para…', 'In the grid BFS, the `dist` dictionary serves to…', [['Guardar los muros', 'Store the walls'], ['Guardar la distancia de cada celda y, a la vez, saber cuáles ya se visitaron', 'Store each cell\'s distance and, at the same time, know which were visited'], ['Ordenar las celdas', 'Sort the cells'], ['Contar las filas', 'Count the rows']], 1,
      'Si una celda ya está en `dist`, no se vuelve a encolar.', 'If a cell is already in `dist`, it is not enqueued again.'),
    q('Tareas: b necesita a, y c necesita b. ¿Qué orden da Kahn?', 'Tasks: b needs a, and c needs b. What order does Kahn give?', [['c, b, a', 'c, b, a'], ['b, a, c', 'b, a, c'], ['a, b, c', 'a, b, c'], ['No hay orden', 'There is no order']], 2,
      'Solo a tiene grado 0; al terminarla se libera b, y después c.', 'Only a has in-degree 0; finishing it frees b, and then c.'),
    q('En BFS, si marcas el nodo como visitado **al sacarlo** de la cola en vez de al meterlo, ¿qué pasa?', 'In BFS, if you mark the node visited **when taking it out** instead of when putting it in, what happens?', [['Nada', 'Nothing'], ['Un nodo con varios vecinos puede entrar varias veces a la cola', 'A node with several neighbors can enter the queue several times'], ['El BFS se vuelve DFS', 'The BFS becomes a DFS'], ['Nunca visita el inicio', 'It never visits the start']], 1,
      'En el ejemplo, D (vecino de B y de C) entraría dos veces.', 'In the example, D (neighbor of B and C) would enter twice.'),
    q('"Islas", "laberinto" o "red de amigos" son problemas de…', '"Islands", "maze" or "friend network" are problems about…', [['Ordenamiento', 'Sorting'], ['Grafos: hay que traducir el enunciado a nodos y aristas', 'Graphs: you must translate the statement into nodes and edges'], ['Programación dinámica', 'Dynamic programming'], ['Búsqueda binaria', 'Binary search']], 1,
      'Muchos problemas de grafos nunca dicen "grafo".', 'Many graph problems never say "graph".'),
  ],
  concepts: [
    concept('¿Cómo cuentas las componentes conexas de un grafo?', 'How do you count a graph\'s connected components?', 'Recorre los nodos; cada vez que encuentres uno no visitado suma 1 y marca todo lo conectado con DFS o BFS. O(V + E).', 'Walk the nodes; each time you find an unvisited one add 1 and mark everything connected with DFS or BFS. O(V + E).'),
    concept('Convertir una cuadrícula en grafo', 'Turning a grid into a graph', 'Cada celda libre es un nodo; sus aristas van a las celdas vecinas (arriba, abajo, izquierda, derecha) que estén dentro y libres.', 'Each free cell is a node; its edges go to neighboring cells (up, down, left, right) that are in bounds and free.'),
  ],
};

/* ======================= Programación dinámica en la práctica ======================= */
export const DP_PRACTICE_LESSON: Lesson = {
  id: 'dp-practice',
  track: 'dsa',
  title: l('Programación dinámica en la práctica', 'Dynamic programming in practice'),
  summary: l('DP en una y dos dimensiones con la receta de 4 pasos, resuelta y luego por tu cuenta.', '1D and 2D DP with the 4-step recipe, solved and then on your own.'),
  minutes: 25,
  blocks: [
    md(
      `## La receta, aplicada
En cada ejemplo responde las mismas 4 preguntas:
1. **Estado:** ¿qué significa \`dp[i]\` (o \`dp[r][c]\`)?
2. **Recurrencia:** ¿de qué estados anteriores depende?
3. **Casos base:** ¿qué valores conoces sin calcular?
4. **Respuesta:** ¿en qué celda queda?`,
      `## The recipe, applied
In every example answer the same 4 questions:
1. **State:** what does \`dp[i]\` (or \`dp[r][c]\`) mean?
2. **Recurrence:** which earlier states does it depend on?
3. **Base cases:** which values do you know without computing?
4. **Answer:** in which cell does it end up?`,
    ),

    md('## Ejemplo 1: contar formas (1D)', '## Example 1: counting ways (1D)'),
    code(`# Formas de subir n escalones dando pasos de 1 o 2
# Estado: formas[i] = formas de llegar al escalón i
# Recurrencia: formas[i] = formas[i-1] + formas[i-2]
n = 5
formas = [1, 1]
for i in range(2, n + 1):
    formas.append(formas[i - 1] + formas[i - 2])
print(formas[n])   # 8`),
    ...tryIt(P('dpp-three', 'basic', l('Ahora se puede subir de 1, 2 **o 3** escalones. ¿De cuántas formas se llega al 4?', 'Now you can climb 1, 2 **or 3** steps. In how many ways do you reach step 4?'),
      `n = 4
formas = [1, 1, 2]          # escalones 0, 1 y 2
for i in range(3, n + 1):
    formas.append(formas[i - 1] + formas[i - 2] + formas[i - 3])
print(formas[n])`,
      '7',
      l('Ahora al escalón i se llega desde i−1, i−2 o i−3: 1, 1, 2, 4, **7**. Cambió la recurrencia, no el método.', 'Now step i is reached from i−1, i−2 or i−3: 1, 1, 2, 4, **7**. The recurrence changed, not the method.'),
      l('Cada valor nuevo es la suma de los **tres** anteriores.', 'Each new value is the sum of the **three** previous ones.'))),

    md('## Ejemplo 2: mejor subarreglo (decidir en cada paso)', '## Example 2: best subarray (deciding at each step)'),
    code(`# Estado: cur = mejor suma de un subarreglo que TERMINA en el elemento actual
# Recurrencia: cur = max(x, cur + x)   → empezar de nuevo o extender
nums = [2, -5, 3, 4, -1]
cur = mejor = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    mejor = max(mejor, cur)
print(mejor)   # 7 (el subarreglo [3, 4])`),
    ...tryIt(P('dpp-kadane', 'medium', l('Algoritmo de Kadane. ¿Qué imprime?', 'Kadane\'s algorithm. What does it print?'),
      `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
cur = mejor = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    mejor = max(mejor, cur)
print(mejor)`,
      '6',
      l('El mejor subarreglo es [4, −1, 2, 1] = **6**. Cuando la suma acumulada se vuelve negativa conviene empezar de nuevo.', 'The best subarray is [4, −1, 2, 1] = **6**. When the running sum turns negative it pays to start over.'),
      l('`cur` es el mejor subarreglo que termina en `x`; `mejor` recuerda el máximo visto en cualquier punto.', '`cur` is the best subarray ending at `x`; `mejor` remembers the maximum seen anywhere.'))),

    md('## Ejemplo 3: DP en 2D sobre una cuadrícula', '## Example 3: 2D DP on a grid'),
    code(`# Camino de costo mínimo de arriba-izquierda a abajo-derecha (solo derecha o abajo)
# Estado: dp[r][c] = costo mínimo para llegar a (r, c)
grid = [[1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]]
F, K = len(grid), len(grid[0])
dp = [[0] * K for _ in range(F)]
for r in range(F):
    for c in range(K):
        if r == 0 and c == 0:
            dp[r][c] = grid[0][0]
        elif r == 0:
            dp[r][c] = grid[r][c] + dp[r][c - 1]      # solo se llega desde la izquierda
        elif c == 0:
            dp[r][c] = grid[r][c] + dp[r - 1][c]      # solo se llega desde arriba
        else:
            dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])
print(dp[F - 1][K - 1])   # 7: 1 → 3 → 1 → 1 → 1`),
    ...tryIt(C('dpp-max-path', 'medium', l('Ahora se busca el camino de **mayor** suma. ¿Qué va en la recurrencia? (con la correcta imprime 12)', 'Now we want the path with the **largest** sum. What goes in the recurrence? (the right one prints 12)'),
      `grid = [[1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]]
F, K = 3, 3
dp = [[0] * K for _ in range(F)]
for r in range(F):
    for c in range(K):
        if r == 0 and c == 0:
            dp[r][c] = grid[0][0]
        elif r == 0:
            dp[r][c] = grid[r][c] + dp[r][c - 1]
        elif c == 0:
            dp[r][c] = grid[r][c] + dp[r - 1][c]
        else:
            dp[r][c] = grid[r][c] + ____
print(dp[2][2])`,
      ['max(dp[r - 1][c], dp[r][c - 1])', 'min(dp[r - 1][c], dp[r][c - 1])', 'dp[r - 1][c] + dp[r][c - 1]', 'dp[r - 1][c - 1]'],
      0,
      l('Para la suma **mayor** te quedas con el mejor de los dos caminos que llegan (arriba o izquierda): `max`. El camino es 1 → 3 → 5 → 2 → 1 = **12**. Sumar ambos contaría caminos distintos a la vez.', 'For the **largest** sum you keep the better of the two incoming paths (above or left): `max`. The path is 1 → 3 → 5 → 2 → 1 = **12**. Adding both would count two different paths at once.'),
      l('Igual que el ejemplo, pero cambiando qué camino de llegada conviene.', 'Same as the example, but changing which incoming path is best.'))),

    md('## Ejemplo 4: DP en 2D sobre dos strings', '## Example 4: 2D DP on two strings'),
    code(`# Subsecuencia común más larga (LCS)
# Estado: dp[i][j] = LCS de a[:i] y b[:j]
a, b = "abcde", "ace"
dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i in range(1, len(a) + 1):
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1               # la letra coincide: se suma 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])    # se descarta una letra
print(dp[len(a)][len(b)])   # 3 ("ace")`),
    ...tryIt(P('dpp-lcs', 'interview', l('¿Qué imprime?', 'What does it print?'),
      `a, b = "ABCBDAB", "BDCABA"
dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i in range(1, len(a) + 1):
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
print(dp[len(a)][len(b)])`,
      '4',
      l('Una subsecuencia común más larga es "BCBA" (también "BDAB"): longitud **4**. La tabla cuesta O(n · m) en tiempo y memoria.', 'A longest common subsequence is "BCBA" (also "BDAB"): length **4**. The table costs O(n · m) time and memory.'),
      l('Si las letras actuales coinciden, se alarga la LCS de los prefijos sin ellas; si no, se toma lo mejor de quitar una letra de a o de b.', 'If the current letters match, the LCS of the prefixes without them grows by one; otherwise take the best of dropping a letter from a or from b.'))),
    interview(
      'Di el **estado en voz alta** antes de escribir la tabla ("dp[i][j] es la LCS de los primeros i de a y j de b"). La mayoría de los errores en DP vienen de un estado mal definido.',
      'Say the **state out loud** before writing the table ("dp[i][j] is the LCS of the first i of a and j of b"). Most DP bugs come from a badly defined state.',
    ),
  ],
  quiz: [
    q('En Kadane, `cur = max(x, cur + x)` significa…', 'In Kadane, `cur = max(x, cur + x)` means…', [['Sumar todo', 'Add everything'], ['Empezar un subarreglo nuevo en x o extender el actual', 'Start a new subarray at x or extend the current one'], ['Ordenar', 'Sort'], ['Tomar el máximo global', 'Take the global maximum']], 1,
      'Si lo acumulado es negativo, conviene empezar en x.', 'If the running total is negative, it is better to start at x.'),
    q('En la cuadrícula de costo mínimo, a la celda (r, c) se llega desde…', 'In the minimum-cost grid, cell (r, c) is reached from…', [['Cualquier celda', 'Any cell'], ['Arriba o izquierda', 'Above or left'], ['Abajo o derecha', 'Below or right'], ['La diagonal', 'The diagonal']], 1,
      'Solo se permiten movimientos a la derecha o hacia abajo.', 'Only right and down moves are allowed.'),
    q('La tabla de LCS para strings de tamaños n y m cuesta…', 'The LCS table for strings of sizes n and m costs…', [['O(n + m)', 'O(n + m)'], ['O(n · m)', 'O(n · m)'], ['O(2ⁿ)', 'O(2ⁿ)'], ['O(log n)', 'O(log n)']], 1,
      'Hay (n + 1) × (m + 1) celdas y cada una se llena en O(1).', 'There are (n + 1) × (m + 1) cells and each one is filled in O(1).'),
    // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
    q('¿De cuántas formas se suben 5 escalones dando pasos de 1 o 2?', 'In how many ways can you climb 5 stairs taking steps of 1 or 2?', [['5', '5'], ['10', '10'], ['8', '8'], ['32', '32']], 2,
      'formas = 1, 1, 2, 3, 5, 8: cada una es la suma de las dos anteriores.', 'ways = 1, 1, 2, 3, 5, 8: each is the sum of the two before.'),
    q('Si se puede subir de 1, 2 **o 3** escalones, ¿cuál es la recurrencia?', 'If you can climb 1, 2 **or 3** stairs, what is the recurrence?', [['`formas[i - 1] + formas[i - 2]`', '`formas[i - 1] + formas[i - 2]`'], ['`formas[i - 1] + formas[i - 2] + formas[i - 3]`', '`formas[i - 1] + formas[i - 2] + formas[i - 3]`'], ['`formas[i - 1] * 3`', '`formas[i - 1] * 3`'], ['`formas[i - 3]`', '`formas[i - 3]`']], 1,
      'Al escalón i se llega desde i − 1, i − 2 o i − 3.', 'You reach stair i from i − 1, i − 2 or i − 3.'),
    q('En Kadane, ¿qué significa `cur`?', 'In Kadane, what does `cur` mean?', [['La suma de toda la lista', 'The sum of the whole list'], ['La mejor suma de un subarreglo que **termina** en el elemento actual', 'The best sum of a subarray **ending** at the current element'], ['El elemento más grande', 'The largest element'], ['El número de subarreglos', 'The number of subarrays']], 1,
      '`mejor` es el que recuerda el máximo visto en cualquier punto.', '`mejor` is the one that remembers the maximum seen anywhere.'),
    q('¿Qué complejidad tiene Kadane?', 'What is Kadane\'s complexity?', [['O(n²) tiempo', 'O(n²) time'], ['O(n) tiempo y O(1) espacio', 'O(n) time and O(1) space'], ['O(n log n)', 'O(n log n)'], ['O(2ⁿ)', 'O(2ⁿ)']], 1,
      'Una pasada guardando solo dos números.', 'One pass keeping only two numbers.'),
    q('En la cuadrícula de costo mínimo, ¿desde dónde se llega a una celda de la **primera fila**?', 'In the minimum-cost grid, where is a cell in the **first row** reached from?', [['Solo desde la izquierda', 'Only from the left'], ['Solo desde arriba', 'Only from above'], ['Desde arriba o la izquierda', 'From above or the left'], ['Desde abajo', 'From below']], 0,
      'Arriba de la primera fila no hay nada; por eso es un caso aparte.', 'There is nothing above the first row; that is why it is a separate case.'),
    q('Para el camino de **mayor** suma en vez del de menor costo, ¿qué cambias en la recurrencia?', 'For the path with the **largest** sum instead of the lowest cost, what do you change in the recurrence?', [['Nada', 'Nothing'], ['`min` por `max`', '`min` for `max`'], ['La suma por una resta', 'The sum for a subtraction'], ['El orden de los ciclos', 'The loop order']], 1,
      'Mismo estado y mismos vecinos; solo cambia qué se busca.', 'Same state and same neighbors; only what you look for changes.'),
    q('En LCS (subsecuencia común más larga), si `a[i - 1] == b[j - 1]`, ¿cuánto vale `dp[i][j]`?', 'In LCS (longest common subsequence), if `a[i - 1] == b[j - 1]`, what is `dp[i][j]`?', [['`dp[i - 1][j - 1] + 1`', '`dp[i - 1][j - 1] + 1`'], ['`max(dp[i - 1][j], dp[i][j - 1])`', '`max(dp[i - 1][j], dp[i][j - 1])`'], ['0', '0'], ['`dp[i][j - 1]`', '`dp[i][j - 1]`']], 0,
      'La letra coincide: se suma 1 a la LCS de lo anterior. Si no coincide, se descarta una letra con el `max`.', 'The letter matches: add 1 to the LCS of what came before. If not, drop one letter with the `max`.'),
  ],
  concepts: [
    concept('Estado de Kadane (subarreglo de suma máxima)', 'Kadane state (maximum subarray)', 'cur = mejor suma de un subarreglo que termina en el elemento actual; cur = max(x, cur + x). O(n), O(1).', 'cur = best sum of a subarray ending at the current element; cur = max(x, cur + x). O(n), O(1).'),
    concept('Recurrencia de la subsecuencia común más larga', 'Longest common subsequence recurrence', 'Si a[i−1] == b[j−1]: dp[i][j] = dp[i−1][j−1] + 1; si no: max(dp[i−1][j], dp[i][j−1]).', 'If a[i−1] == b[j−1]: dp[i][j] = dp[i−1][j−1] + 1; else: max(dp[i−1][j], dp[i][j−1]).'),
  ],
};
