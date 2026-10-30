import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, NODO_ARBOL, O, P, R } from './builders';

/* Ejercicios: árboles · heaps · grafos · programación dinámica.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores. */

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Árboles binarios y BST ---------------- */
  trees: {
    10: R('tr-cp-inorder', 'basic',
      l('¿Qué recorrido de un BST devuelve los valores **ordenados**, y por qué?', 'Which BST traversal returns the values **sorted**, and why?'),
      l('El **inorden** (izquierda → nodo → derecha): en un BST todo lo de la izquierda es menor y todo lo de la derecha mayor, así que visita los valores de menor a mayor.', '**Inorder** (left → node → right): in a BST everything on the left is smaller and everything on the right larger, so it visits values from smallest to largest.')),
    5: P('tr-cp-preorder', 'basic', l('Recorrido en **preorden**. ¿Qué imprime?', '**Preorder** traversal. What does it print?'),
      `${NODO_ARBOL}
def pre(n, out):
    if n:
        out.append(n.val)     # primero el nodo
        pre(n.izq, out)       # luego la izquierda
        pre(n.der, out)       # luego la derecha

raiz = Nodo(2, Nodo(1), Nodo(3))
res = []
pre(raiz, res)
print(res)`,
      '[2, 1, 3]',
      l('Preorden visita **el nodo antes que sus hijos**: 2, luego el subárbol izquierdo (1), luego el derecho (3). En inorden sería [1, 2, 3].', 'Preorder visits **the node before its children**: 2, then the left subtree (1), then the right one (3). Inorder would be [1, 2, 3].'),
      l('La raíz es 2, con 1 a la izquierda y 3 a la derecha. La función se llama a sí misma con cada hijo; con `None` no hace nada.', 'The root is 2, with 1 on the left and 3 on the right. The function calls itself on each child; with `None` it does nothing.')),
    13: O('tr-cp-trie', 'medium',
      l('Ordena los pasos para **insertar una palabra** en un trie.', 'Order the steps to **insert a word** into a trie.'),
      [
        l('Empieza en la raíz.', 'Start at the root.'),
        l('Para cada letra: si no hay un hijo con esa letra, créalo.', 'For each letter: if there is no child with that letter, create it.'),
        l('Baja a ese hijo.', 'Move down to that child.'),
        l('Al terminar la palabra, marca el nodo como fin de palabra.', 'When the word ends, mark the node as end of word.'),
      ],
      l('Cuesta O(L), con L la longitud de la palabra, sin importar cuántas palabras haya.', 'It costs O(L), where L is the word length, no matter how many words there are.')),
  },

  /* ---------------- Heaps ---------------- */
  heaps: {
    2: R('hp-cp-top', 'basic',
      l('En un min-heap, ¿dónde está siempre el elemento más pequeño y cuánto cuesta verlo?', 'In a min-heap, where is the smallest element always, and what does it cost to see it?'),
      l('En la **raíz** (la posición 0 del arreglo): verlo cuesta **O(1)**. Sacarlo cuesta O(log n) porque hay que reacomodar el heap.', 'At the **root** (position 0 of the array): seeing it costs **O(1)**. Removing it costs O(log n) because the heap must be rearranged.')),
    4: P('hp-cp-pop', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `import heapq
h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h), heapq.heappop(h))`,
      '1 3',
      l('`heappop` siempre saca el **menor**: primero 1 y luego 3, sin importar el orden en que entraron.', '`heappop` always removes the **smallest**: first 1, then 3, regardless of insertion order.'),
      l('`heappush` agrega manteniendo la propiedad del heap; `heappop` saca la raíz.', '`heappush` adds while keeping the heap property; `heappop` removes the root.')),
    5: C('hp-cp-max', 'medium',
      l('`heapq` es un **min-heap**. ¿Cómo lo usas como max-heap? (con la correcta imprime 8)', '`heapq` is a **min-heap**. How do you use it as a max-heap? (the right one prints 8)'),
      `import heapq
h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, ____)
print(-heapq.heappop(h))`,
      ['-x', 'x', 'abs(x)', 'x * 2'],
      0,
      l('Guardando los valores **negados**, el menor del heap (−8) corresponde al mayor original. Al sacarlo se vuelve a negar → 8.', 'By storing **negated** values, the heap\'s smallest (−8) corresponds to the original largest. Negating it again on the way out → 8.'),
      l('Se guarda cada número con el signo cambiado y al final se le vuelve a cambiar.', 'Each number is stored with its sign flipped and flipped back at the end.')),
  },

  /* ---------------- Grafos: BFS y DFS ---------------- */
  graphs: {
    6: R('gr-cp-bfs-shortest', 'basic',
      l('¿Por qué BFS encuentra el camino más corto en un grafo **sin pesos** y DFS no?', 'Why does BFS find the shortest path in an **unweighted** graph and DFS does not?'),
      l('BFS visita por **niveles**: primero todo lo que está a 1 paso, luego a 2, etc. La primera vez que llega a un nodo es por el camino más corto. DFS se va a fondo por una rama y puede llegar por un camino largo.', 'BFS visits by **levels**: first everything 1 step away, then 2, etc. The first time it reaches a node is via the shortest path. DFS goes deep down one branch and may arrive by a long path.')),
    5: P('gr-cp-bfs-order', 'basic', l('¿En qué orden visita BFS los nodos? ¿Qué imprime?', 'In which order does BFS visit the nodes? What does it print?'),
      `from collections import deque
g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
visitados = {"A"}
cola = deque(["A"])
orden = []
while cola:
    n = cola.popleft()
    orden.append(n)
    for v in g[n]:
        if v not in visitados:
            visitados.add(v)
            cola.append(v)
print(orden)`,
      "['A', 'B', 'C', 'D']",
      l('Primero A, luego sus vecinos B y C (nivel 1), y después D (nivel 2). D se encola una sola vez porque se marca al encolarlo.', 'First A, then its neighbors B and C (level 1), then D (level 2). D is enqueued only once because it is marked when enqueued.'),
      l('`g` es una lista de adyacencia: cada nodo con la lista de sus vecinos. La cola decide el orden de visita.', '`g` is an adjacency list: each node with its list of neighbors. The queue decides the visiting order.')),
    4: O('gr-cp-bfs-steps', 'basic',
      l('Ordena los pasos de **BFS**.', 'Order the steps of **BFS**.'),
      [
        l('Marca el inicio como visitado y ponlo en la cola.', 'Mark the start as visited and put it in the queue.'),
        l('Saca el primer nodo de la cola.', 'Take the first node out of the queue.'),
        l('Para cada vecino no visitado: márcalo y ponlo en la cola.', 'For each unvisited neighbor: mark it and put it in the queue.'),
        l('Repite mientras la cola no esté vacía.', 'Repeat while the queue is not empty.'),
      ],
      l('Cada nodo entra y sale de la cola una vez y cada arista se revisa una vez → O(V + E).', 'Each node enters and leaves the queue once and each edge is checked once → O(V + E).')),
  },

  /* ---------------- Programación dinámica ---------------- */
  'dp-intro': {
    6: O('dp-cp-recipe', 'basic',
      l('Ordena la **receta** de programación dinámica.', 'Order the dynamic programming **recipe**.'),
      [
        l('Define el estado: qué significa `dp[i]`.', 'Define the state: what `dp[i]` means.'),
        l('Escribe la recurrencia: cómo se calcula `dp[i]` con estados anteriores.', 'Write the recurrence: how `dp[i]` is computed from earlier states.'),
        l('Define los casos base.', 'Define the base cases.'),
        l('Elige el orden de cálculo y ubica dónde queda la respuesta.', 'Choose the computation order and locate where the answer ends up.'),
      ],
      l('Sin un estado bien definido, la recurrencia no tiene sentido: por eso va primero.', 'Without a well-defined state the recurrence makes no sense: that is why it comes first.')),
    5: P('dp-cp-fib', 'basic', l('Fibonacci de abajo hacia arriba. ¿Qué imprime?', 'Bottom-up Fibonacci. What does it print?'),
      `a, b = 0, 1
for _ in range(7):
    a, b = b, a + b
print(a)`,
      '13',
      l('La secuencia es 0, 1, 1, 2, 3, 5, 8, **13**: tras 7 vueltas `a` vale fib(7). Solo guarda los dos últimos valores → O(n) tiempo y O(1) espacio.', 'The sequence is 0, 1, 1, 2, 3, 5, 8, **13**: after 7 iterations `a` is fib(7). It only keeps the last two values → O(n) time and O(1) space.'),
      l('En cada vuelta, `a` pasa a ser el siguiente número y `b` el que le sigue (la suma de los dos anteriores).', 'Each iteration, `a` becomes the next number and `b` the one after it (the sum of the previous two).')),
    9: P('dp-cp-coins', 'medium', l('Cambio de monedas con monedas [1, 3, 4] y cantidad 6. ¿Qué imprime?', 'Coin change with coins [1, 3, 4] and amount 6. What does it print?'),
      `monedas = [1, 3, 4]
cantidad = 6
dp = [0] + [float("inf")] * cantidad      # dp[x] = mínimo de monedas para formar x
for x in range(1, cantidad + 1):
    for m in monedas:
        if m <= x:
            dp[x] = min(dp[x], dp[x - m] + 1)
print(dp[6])`,
      '2',
      l('6 = 3 + 3 → **2** monedas. Un enfoque "greedy" (tomar siempre la moneda más grande) daría 4 + 1 + 1 = 3 monedas: por eso aquí hace falta DP.', '6 = 3 + 3 → **2** coins. A "greedy" approach (always take the largest coin) would give 4 + 1 + 1 = 3 coins: that is why DP is needed here.'),
      l('Para cada cantidad x prueba cada moneda m: usar m cuesta 1 moneda más lo mínimo para formar x − m.', 'For each amount x it tries each coin m: using m costs 1 coin plus the minimum to make x − m.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Árboles binarios y BST ---------------- */
  trees: [
    P('tr-p-height', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${NODO_ARBOL}
def altura(n):
    if not n:
        return 0
    return 1 + max(altura(n.izq), altura(n.der))

print(altura(Nodo(1, Nodo(2, Nodo(4)), Nodo(3))))`,
      '3',
      l('El camino más largo es 1 → 2 → 4: **3** niveles. La altura de un nodo es 1 más la mayor altura de sus hijos.', 'The longest path is 1 → 2 → 4: **3** levels. A node\'s height is 1 plus the larger height of its children.'),
      l('Caso base: un nodo vacío mide 0. Cada nodo pregunta la altura de sus dos hijos y se queda con la mayor.', 'Base case: an empty node has height 0. Each node asks for its two children\'s heights and keeps the larger.')),
    R('tr-p-bst', 'basic',
      l('¿Qué propiedad cumple un **árbol binario de búsqueda** (BST)?', 'What property does a **binary search tree** (BST) satisfy?'),
      l('Para cada nodo, **todos** los valores de su subárbol izquierdo son menores y **todos** los del derecho son mayores (no solo los hijos directos).', 'For every node, **all** values in its left subtree are smaller and **all** in its right subtree are larger (not just the direct children).')),
    O('tr-p-insert', 'basic',
      l('Ordena los pasos para **insertar** un valor en un BST.', 'Order the steps to **insert** a value into a BST.'),
      [
        l('Compara el valor con el nodo actual (empezando por la raíz).', 'Compare the value with the current node (starting at the root).'),
        l('Si es menor, ve a la izquierda; si es mayor, a la derecha.', 'If it is smaller, go left; if larger, go right.'),
        l('Repite hasta encontrar un lugar vacío.', 'Repeat until you find an empty spot.'),
        l('Crea ahí el nodo nuevo.', 'Create the new node there.'),
      ],
      l('Cuesta O(h): O(log n) si el árbol está balanceado.', 'It costs O(h): O(log n) if the tree is balanced.')),
    P('tr-p-bst-inorder', 'medium', l('Se insertan 5, 3, 8, 1, 4 en un BST y se recorre en inorden. ¿Qué imprime?', '5, 3, 8, 1, 4 are inserted into a BST and traversed inorder. What does it print?'),
      `${NODO_ARBOL}
def insertar(n, v):
    if not n:
        return Nodo(v)
    if v < n.val:
        n.izq = insertar(n.izq, v)
    else:
        n.der = insertar(n.der, v)
    return n

def inorden(n, out):
    if n:
        inorden(n.izq, out)
        out.append(n.val)
        inorden(n.der, out)

raiz = None
for v in [5, 3, 8, 1, 4]:
    raiz = insertar(raiz, v)
res = []
inorden(raiz, res)
print(res)`,
      '[1, 3, 4, 5, 8]',
      l('Sin importar el orden de inserción, el inorden de un BST sale **ordenado**. Es una forma de ordenar: insertar todo y recorrer.', 'Whatever the insertion order, a BST\'s inorder comes out **sorted**. It is a way to sort: insert everything and traverse.'),
      l('`insertar` baja comparando hasta un lugar vacío. `inorden` visita izquierda, nodo y derecha.', '`insertar` goes down comparing until an empty spot. `inorden` visits left, node and right.')),
    C('tr-p-count', 'medium',
      l('Cuenta los nodos del árbol. ¿Qué va en el `return`? (con la correcta imprime 4)', 'Count the tree\'s nodes. What goes in the `return`? (the right one prints 4)'),
      `${NODO_ARBOL}
def contar(n):
    if not n:
        return 0
    return ____

print(contar(Nodo(1, Nodo(2), Nodo(3, Nodo(4)))))`,
      ['1 + contar(n.izq) + contar(n.der)', 'contar(n.izq) + contar(n.der)', '1 + contar(n.izq)', 'max(contar(n.izq), contar(n.der))'],
      0,
      l('Este nodo cuenta **1** más todos los de la izquierda y todos los de la derecha. Olvidar el 1 da 0; olvidar un lado deja nodos sin contar.', 'This node counts **1** plus everything on the left and everything on the right. Forgetting the 1 gives 0; forgetting a side misses nodes.'),
      l('Es la plantilla de árboles: resuelve para cada hijo y combina.', 'It is the tree template: solve for each child and combine.')),
    P('tr-p-levels', 'medium', l('Recorrido por **niveles** (BFS) en un árbol. ¿Qué imprime?', '**Level-order** traversal (BFS) in a tree. What does it print?'),
      `${NODO_ARBOL}
from collections import deque
raiz = Nodo(1, Nodo(2, Nodo(4)), Nodo(3))
cola, niveles = deque([raiz]), []
while cola:
    nivel = []
    for _ in range(len(cola)):      # todos los nodos de este nivel
        n = cola.popleft()
        nivel.append(n.val)
        if n.izq:
            cola.append(n.izq)
        if n.der:
            cola.append(n.der)
    niveles.append(nivel)
print(niveles)`,
      '[[1], [2, 3], [4]]',
      l('La cola procesa un nivel completo por vuelta del `while`: [1], luego sus hijos [2, 3], luego [4].', 'The queue processes one full level per `while` iteration: [1], then its children [2, 3], then [4].'),
      l('Al empezar cada vuelta, la cola tiene exactamente los nodos de un nivel; `len(cola)` dice cuántos son.', 'At the start of each iteration the queue holds exactly one level\'s nodes; `len(cola)` says how many.')),
    R('tr-p-degenerate', 'interview',
      l('¿Por qué buscar en un BST puede volverse O(n) y cómo se evita?', 'Why can searching a BST become O(n), and how is that avoided?'),
      l('Si insertas valores **ya ordenados** (1, 2, 3, …) cada nodo queda a la derecha del anterior y el árbol se vuelve una "lista": altura n. Se evita con árboles **auto-balanceados** (AVL, rojo-negro), que mantienen la altura en O(log n).', 'If you insert **already sorted** values (1, 2, 3, …) each node goes to the right of the previous one and the tree becomes a "list": height n. It is avoided with **self-balancing** trees (AVL, red-black), which keep the height at O(log n).')),
    C('tr-p-validate', 'interview',
      l('Validar un BST pasando un rango permitido. ¿Qué va al final? (con la correcta imprime `True False`)', 'Validate a BST by passing an allowed range. What goes at the end? (the right one prints `True False`)'),
      `${NODO_ARBOL}
def valido(n, lo=float("-inf"), hi=float("inf")):
    if not n:
        return True
    if not (lo < n.val < hi):
        return False
    return valido(n.izq, lo, n.val) and ____

print(valido(Nodo(5, Nodo(1), Nodo(7, Nodo(6), Nodo(8)))),
      valido(Nodo(5, Nodo(1), Nodo(4))))`,
      ['valido(n.der, n.val, hi)', 'valido(n.der, lo, n.val)', 'valido(n.der, lo, hi)', 'True'],
      0,
      l('Al bajar a la **derecha**, todo debe ser mayor que el nodo actual: su valor pasa a ser el nuevo **mínimo** (`lo`). En el segundo árbol el 4 está a la derecha del 5 → no es BST.', 'Going **right**, everything must be greater than the current node: its value becomes the new **minimum** (`lo`). In the second tree 4 is to the right of 5 → not a BST.'),
      l('Cada nodo recibe el rango (lo, hi) donde debe estar. A la izquierda el máximo pasa a ser n.val; a la derecha, el mínimo.', 'Each node receives the range (lo, hi) it must fall in. Going left the maximum becomes n.val; going right, the minimum.')),
  ],

  /* ---------------- Heaps ---------------- */
  heaps: [
    P('hp-p-indices', 'basic', l('Un heap se guarda en un arreglo. ¿Qué imprime? (hijos y padre del índice 2)', 'A heap is stored in an array. What does it print? (children and parent of index 2)'),
      `i = 2
print(2 * i + 1, 2 * i + 2, (i - 1) // 2)`,
      '5 6 0',
      l('Los hijos de `i` están en `2i + 1` y `2i + 2`, y su padre en `(i − 1) // 2`. No hacen falta punteros: la forma del árbol sale de las posiciones.', 'The children of `i` are at `2i + 1` and `2i + 2`, and its parent at `(i − 1) // 2`. No pointers needed: the tree shape comes from the positions.'),
      l('Solo aplica las fórmulas con i = 2.', 'It just applies the formulas with i = 2.')),
    R('hp-p-costs', 'basic',
      l('¿Cuánto cuesta en un heap: ver el mínimo, insertar y extraer el mínimo?', 'What does a heap cost to: peek the minimum, insert, and extract the minimum?'),
      l('Ver el mínimo **O(1)**; insertar **O(log n)**; extraer el mínimo **O(log n)**. Construirlo con n elementos de golpe (`heapify`) es O(n).', 'Peek **O(1)**; insert **O(log n)**; extract min **O(log n)**. Building it from n elements at once (`heapify`) is O(n).')),
    O('hp-p-sift-up', 'basic',
      l('Ordena lo que pasa al **insertar** en un min-heap.', 'Order what happens when **inserting** into a min-heap.'),
      [
        l('Agrega el elemento al final del arreglo.', 'Add the element at the end of the array.'),
        l('Compáralo con su padre.', 'Compare it with its parent.'),
        l('Si es menor que su padre, intercámbialos.', 'If it is smaller than its parent, swap them.'),
        l('Repite hasta que el padre sea menor o llegues a la raíz.', 'Repeat until the parent is smaller or you reach the root.'),
      ],
      l('Sube como mucho la altura del árbol, que es log n → O(log n).', 'It rises at most the tree height, which is log n → O(log n).')),
    P('hp-p-top-k', 'medium', l('Los 2 mayores con un heap de tamaño 2. ¿Qué imprime?', 'The 2 largest with a heap of size 2. What does it print?'),
      `import heapq
h = []
for x in [3, 9, 1, 7, 5]:
    heapq.heappush(h, x)
    if len(h) > 2:
        heapq.heappop(h)          # saca el menor de los guardados
print(sorted(h))`,
      '[7, 9]',
      l('El heap nunca guarda más de 2 elementos: siempre saca el menor de los que tiene, así que al final quedan los **2 mayores**. Cuesta O(n log k).', 'The heap never holds more than 2 elements: it always removes the smallest it has, so at the end the **2 largest** remain. It costs O(n log k).'),
      l('Cada número entra; si el heap pasa de 2, sale el menor.', 'Each number goes in; if the heap exceeds 2, the smallest leaves.')),
    R('hp-p-why-min', 'medium',
      l('Para los k mayores, ¿por qué se usa un **min**-heap de tamaño k y no meter todo en un max-heap?', 'For the k largest, why use a **min**-heap of size k instead of putting everything in a max-heap?'),
      l('Porque la raíz del min-heap es el **menor de los k candidatos**: justo el que hay que descartar cuando llega uno mayor. Así usas O(k) de memoria y O(n log k) de tiempo, en vez de O(n) de memoria.', 'Because the min-heap\'s root is the **smallest of the k candidates**: exactly the one to discard when a larger one arrives. That uses O(k) memory and O(n log k) time, instead of O(n) memory.')),
    P('hp-p-heapify', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `import heapq
a = [9, 4, 7, 1]
heapq.heapify(a)          # convierte la lista en heap en O(n)
print(a[0], len(a))`,
      '1 4',
      l('Tras `heapify`, el menor queda en `a[0]` (la raíz) y la lista conserva sus 4 elementos. El resto **no** queda ordenado: solo cumple la propiedad del heap.', 'After `heapify` the smallest is at `a[0]` (the root) and the list keeps its 4 elements. The rest is **not** sorted: it only satisfies the heap property.'),
      l('`heapify` reacomoda la lista en el mismo lugar.', '`heapify` rearranges the list in place.')),
    P('hp-p-sticks', 'interview', l('Unir palos: cada unión cuesta la suma de los dos. ¿Qué imprime?', 'Joining sticks: each join costs the sum of both. What does it print?'),
      `import heapq
palos = [4, 3, 2, 6]
heapq.heapify(palos)
costo = 0
while len(palos) > 1:
    a = heapq.heappop(palos)
    b = heapq.heappop(palos)
    costo += a + b
    heapq.heappush(palos, a + b)
print(costo)`,
      '29',
      l('Siempre une los **dos más chicos**: 2+3=5, 4+5=9, 6+9=15 → 5 + 9 + 15 = **29**, el costo mínimo. El heap da los dos menores en O(log n).', 'It always joins the **two smallest**: 2+3=5, 4+5=9, 6+9=15 → 5 + 9 + 15 = **29**, the minimum cost. The heap yields the two smallest in O(log n).'),
      l('Saca los dos menores, suma su costo y mete el palo nuevo al heap, hasta que queda uno.', 'It removes the two smallest, adds their cost and puts the new stick back, until one is left.')),
    R('hp-p-priority', 'interview',
      l('Necesitas atender siempre la tarea de **mayor prioridad**, con muchas inserciones. ¿Qué estructura usas y por qué no una lista ordenada?', 'You must always serve the **highest-priority** task, with many insertions. Which structure and why not a sorted list?'),
      l('Un **heap** (cola de prioridad): insertar y sacar cuestan O(log n). Una lista ordenada saca rápido pero cada inserción cuesta **O(n)** porque hay que mover elementos.', 'A **heap** (priority queue): insert and extract cost O(log n). A sorted list extracts fast but each insertion costs **O(n)** because elements must shift.')),
  ],

  /* ---------------- Grafos: BFS y DFS ---------------- */
  graphs: [
    P('gr-p-dfs', 'basic', l('DFS recursivo. ¿Qué imprime?', 'Recursive DFS. What does it print?'),
      `g = {1: [2, 3], 2: [4], 3: [], 4: []}
visto, orden = set(), []

def dfs(n):
    visto.add(n)
    orden.append(n)
    for v in g[n]:
        if v not in visto:
            dfs(v)

dfs(1)
print(orden)`,
      '[1, 2, 4, 3]',
      l('DFS se va **a fondo** primero: de 1 baja a 2 y de 2 a 4; solo al regresar visita 3. BFS habría dado [1, 2, 3, 4].', 'DFS goes **deep** first: from 1 down to 2 and from 2 to 4; only on the way back does it visit 3. BFS would give [1, 2, 3, 4].'),
      l('Cada llamada marca el nodo y llama a `dfs` con cada vecino no visitado.', 'Each call marks the node and calls `dfs` on each unvisited neighbor.')),
    R('gr-p-repr', 'basic',
      l('Lista de adyacencia vs matriz de adyacencia: ¿cuándo conviene cada una?', 'Adjacency list vs adjacency matrix: when is each one better?'),
      l('**Lista**: O(V + E) de memoria, ideal para grafos con pocas aristas (lo más común). **Matriz**: V × V de memoria, pero saber si existe una arista es O(1); conviene en grafos densos.', '**List**: O(V + E) memory, ideal for graphs with few edges (most common). **Matrix**: V × V memory, but checking an edge is O(1); good for dense graphs.')),
    C('gr-p-undirected', 'basic',
      l('Construye un grafo **no dirigido** a partir de aristas. ¿Qué línea falta?', 'Build an **undirected** graph from edges. Which line is missing?'),
      `aristas = [(1, 2), (1, 3), (2, 3)]
g = {}
for a, b in aristas:
    g.setdefault(a, []).append(b)     # crea la lista si no existe y agrega b
    ____
print(g)`,
      ['g.setdefault(b, []).append(a)', 'g[b] = [a]', 'g.setdefault(a, []).append(a)', 'g[a].append(b)'],
      0,
      l('En un grafo no dirigido cada arista va **en ambos sentidos**: si a conecta con b, b también conecta con a. `g[b] = [a]` borraría los vecinos que b ya tenía.', 'In an undirected graph each edge goes **both ways**: if a connects to b, b also connects to a. `g[b] = [a]` would erase b\'s existing neighbors.'),
      l('Por cada arista (a, b) se anota b como vecino de a y a como vecino de b.', 'For each edge (a, b), b is recorded as a\'s neighbor and a as b\'s neighbor.')),
    P('gr-p-distance', 'medium', l('Distancia mínima con BFS. ¿Qué imprime?', 'Shortest distance with BFS. What does it print?'),
      `from collections import deque
g = {"A": ["B", "C"], "B": ["D"], "C": ["E"], "D": ["E"], "E": []}
dist = {"A": 0}
cola = deque(["A"])
while cola:
    n = cola.popleft()
    for v in g[n]:
        if v not in dist:
            dist[v] = dist[n] + 1
            cola.append(v)
print(dist["E"])`,
      '2',
      l('E se alcanza por A → C → E (2 pasos) antes que por A → B → D → E (3). BFS lo encuentra primero por el camino corto → **2**.', 'E is reached via A → C → E (2 steps) before A → B → D → E (3). BFS finds it first via the short path → **2**.'),
      l('`dist` sirve también como "visitados": la distancia de un vecino es la del nodo actual más 1.', '`dist` also works as "visited": a neighbor\'s distance is the current node\'s plus 1.')),
    P('gr-p-islands', 'medium', l('Número de islas en una cuadrícula. ¿Qué imprime?', 'Number of islands in a grid. What does it print?'),
      `grid = [list("110"),
        list("010"),
        list("001")]

def hundir(r, c):
    if r < 0 or c < 0 or r >= 3 or c >= 3 or grid[r][c] != "1":
        return
    grid[r][c] = "0"                 # marcar como visitada
    hundir(r + 1, c)
    hundir(r - 1, c)
    hundir(r, c + 1)
    hundir(r, c - 1)

islas = 0
for r in range(3):
    for c in range(3):
        if grid[r][c] == "1":
            islas += 1
            hundir(r, c)
print(islas)`,
      '2',
      l('Las tres celdas de arriba a la izquierda están conectadas (una isla) y la de la esquina inferior derecha está sola (otra). Las diagonales **no** cuentan → **2**.', 'The three top-left cells are connected (one island) and the bottom-right corner is alone (another). Diagonals do **not** count → **2**.'),
      l('Cada vez que encuentra tierra cuenta una isla y la "hunde" entera con DFS para no contarla de nuevo.', 'Each time it finds land it counts an island and "sinks" all of it with DFS so it is not counted again.')),
    O('gr-p-kahn', 'medium',
      l('Ordena los pasos del **orden topológico** con el algoritmo de Kahn.', 'Order the steps of **topological sort** with Kahn\'s algorithm.'),
      [
        l('Cuenta el grado de entrada de cada nodo (cuántas flechas le llegan).', 'Count each node\'s in-degree (how many arrows point to it).'),
        l('Pon en la cola los nodos con grado 0.', 'Put the nodes with in-degree 0 in the queue.'),
        l('Saca un nodo, agrégalo al orden y resta 1 al grado de sus vecinos.', 'Remove a node, add it to the order and subtract 1 from its neighbors\' in-degree.'),
        l('Si un vecino queda en grado 0, ponlo en la cola.', 'If a neighbor reaches in-degree 0, put it in the queue.'),
        l('Si al final procesaste todos los nodos, no hay ciclo.', 'If at the end you processed every node, there is no cycle.'),
      ],
      l('Un nodo con grado 0 no depende de nada pendiente, así que puede ir ya.', 'A node with in-degree 0 depends on nothing pending, so it can go now.')),
    R('gr-p-mark-early', 'interview',
      l('En BFS, ¿por qué se marca un nodo como visitado **al encolarlo** y no al sacarlo?', 'In BFS, why is a node marked visited **when enqueued** rather than when dequeued?'),
      l('Si lo marcaras al sacarlo, el mismo nodo podría **encolarse varias veces** (desde distintos vecinos) antes de procesarse: harías trabajo repetido y podrías pasar de O(V + E).', 'If you marked it when dequeuing, the same node could be **enqueued several times** (from different neighbors) before being processed: you would repeat work and could exceed O(V + E).')),
    P('gr-p-cycle', 'interview', l('¿Se pueden tomar todos los cursos? ¿Qué imprime?', 'Can all courses be taken? What does it print?'),
      `from collections import deque
cursos = 3
prereq = [(1, 0), (2, 1), (0, 2)]       # (curso, requisito)
g = {i: [] for i in range(cursos)}      # lista de adyacencia vacía
grado = [0] * cursos
for c, r in prereq:
    g[r].append(c)
    grado[c] += 1
cola = deque([i for i in range(cursos) if grado[i] == 0])
hechos = 0
while cola:
    n = cola.popleft()
    hechos += 1
    for v in g[n]:
        grado[v] -= 1
        if grado[v] == 0:
            cola.append(v)
print(hechos == cursos)`,
      'False',
      l('0 requiere 2, 2 requiere 1 y 1 requiere 0: es un **ciclo**. Ningún curso empieza con grado 0, así que no se procesa ninguno → **False**.', '0 needs 2, 2 needs 1 and 1 needs 0: it is a **cycle**. No course starts with in-degree 0, so none is processed → **False**.'),
      l('Es el algoritmo de Kahn: si al final no se pudieron "hacer" todos los cursos, hay un ciclo de requisitos.', 'It is Kahn\'s algorithm: if not every course could be "done" at the end, there is a prerequisite cycle.')),
  ],

  /* ---------------- Programación dinámica ---------------- */
  'dp-intro': [
    P('dp-p-stairs', 'basic', l('Formas de subir 5 escalones (de 1 o 2 en 2). ¿Qué imprime?', 'Ways to climb 5 stairs (1 or 2 at a time). What does it print?'),
      `n = 5
formas = [1, 1]                  # formas de llegar al escalón 0 y al 1
for i in range(2, n + 1):
    formas.append(formas[i - 1] + formas[i - 2])
print(formas[n])`,
      '8',
      l('Al escalón i llegas desde i − 1 o desde i − 2, así que formas[i] = formas[i−1] + formas[i−2]: 1, 1, 2, 3, 5, **8**.', 'You reach step i from i − 1 or from i − 2, so formas[i] = formas[i−1] + formas[i−2]: 1, 1, 2, 3, 5, **8**.'),
      l('La tabla se llena de abajo hacia arriba usando los dos valores anteriores.', 'The table is filled bottom-up using the two previous values.')),
    R('dp-p-properties', 'basic',
      l('¿Qué dos propiedades indican que un problema se puede resolver con programación dinámica?', 'Which two properties indicate a problem can be solved with dynamic programming?'),
      l('**Subproblemas superpuestos** (se repiten los mismos cálculos) y **subestructura óptima** (la mejor solución se arma con las mejores soluciones de los subproblemas).', '**Overlapping subproblems** (the same computations repeat) and **optimal substructure** (the best solution is built from the best solutions of subproblems).')),
    C('dp-p-memo', 'basic',
      l('Fibonacci con **memoización**. ¿Qué línea falta? (con la correcta imprime 832040 al instante)', 'Fibonacci with **memoization**. Which line is missing? (the right one prints 832040 instantly)'),
      `memo = {}
def fib(n):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    ____
    return memo[n]

print(fib(30))`,
      ['memo[n] = fib(n - 1) + fib(n - 2)', 'memo[n] = n', 'fib(n - 1) + fib(n - 2)', 'memo[n - 1] = fib(n - 1)'],
      0,
      l('Hay que **calcular y guardar** el resultado en `memo[n]` para que la próxima vez se devuelva sin recalcular. Así cada valor se calcula una vez → O(n).', 'You must **compute and store** the result in `memo[n]` so next time it is returned without recomputing. Each value is computed once → O(n).'),
      l('Antes de calcular revisa si ya está en `memo`; si no, lo calcula, lo guarda y lo devuelve.', 'Before computing it checks whether it is already in `memo`; if not, it computes, stores and returns it.')),
    P('dp-p-robber', 'medium', l('Ladrón de casas (no puede robar dos casas seguidas). ¿Qué imprime?', 'House robber (cannot rob two adjacent houses). What does it print?'),
      `casas = [2, 7, 9, 3, 1]
prev, cur = 0, 0           # mejor botín hasta la casa anterior y hasta la actual
for x in casas:
    prev, cur = cur, max(cur, prev + x)
print(cur)`,
      '12',
      l('Lo mejor es robar 2 + 9 + 1 = **12**. En cada casa decides: saltarla (te quedas con `cur`) o robarla (sumas x a lo mejor de dos casas atrás, `prev`).', 'The best is 2 + 9 + 1 = **12**. At each house you decide: skip it (keep `cur`) or rob it (add x to the best from two houses back, `prev`).'),
      l('`prev` y `cur` son la tabla dp comprimida a dos variables.', '`prev` and `cur` are the dp table compressed into two variables.')),
    R('dp-p-top-bottom', 'medium',
      l('Top-down vs bottom-up: ¿en qué se diferencian?', 'Top-down vs bottom-up: how do they differ?'),
      l('**Top-down**: la recursión natural más un memo; solo calcula los estados que se necesitan. **Bottom-up**: llenas una tabla en orden, sin recursión (sin riesgo de pila profunda) y a veces puedes reducir la memoria a unas cuantas variables.', '**Top-down**: the natural recursion plus a memo; it only computes needed states. **Bottom-up**: you fill a table in order, without recursion (no deep-stack risk), and sometimes you can shrink memory to a few variables.')),
    P('dp-p-grid', 'medium', l('Caminos únicos en una cuadrícula 3 × 3 (solo derecha o abajo). ¿Qué imprime?', 'Unique paths in a 3 × 3 grid (only right or down). What does it print?'),
      `filas, cols = 3, 3
dp = [[1] * cols for _ in range(filas)]      # tabla 3 × 3 llena de 1
for r in range(1, filas):
    for c in range(1, cols):
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
print(dp[2][2])`,
      '6',
      l('A cada celda llegas desde arriba o desde la izquierda, así que se suman ambos: la esquina final tiene **6** caminos.', 'You reach each cell from above or from the left, so both are added: the final corner has **6** paths.'),
      l('La primera fila y la primera columna valen 1 (solo hay un camino recto). El resto se llena sumando arriba + izquierda.', 'The first row and column are 1 (only one straight path). The rest is filled by adding above + left.')),
    O('dp-p-interview', 'interview',
      l('Ordena cómo **atacar** un problema de DP en una entrevista.', 'Order how to **approach** a DP problem in an interview.'),
      [
        l('Escribe la solución recursiva de fuerza bruta.', 'Write the brute-force recursive solution.'),
        l('Identifica qué parámetros cambian entre llamadas: ese es el estado.', 'Identify which parameters change between calls: that is the state.'),
        l('Agrega memoización para no recalcular estados.', 'Add memoization so states are not recomputed.'),
        l('Si hace falta, conviértela a una tabla iterativa (bottom-up).', 'If needed, turn it into an iterative table (bottom-up).'),
      ],
      l('Mostrar este proceso vale más que llegar directo a la tabla sin explicar de dónde sale.', 'Showing this process is worth more than jumping straight to the table without explaining where it comes from.')),
    P('dp-p-min-cost', 'interview', l('Costo mínimo para subir una escalera. ¿Qué imprime?', 'Minimum cost to climb stairs. What does it print?'),
      `costo = [10, 15, 20]           # pagar costo[i] al pisar el escalón i
dp = [0, 0]                    # puedes empezar en el escalón 0 o en el 1 gratis
for i in range(2, len(costo) + 1):
    dp.append(min(dp[i - 1] + costo[i - 1], dp[i - 2] + costo[i - 2]))
print(dp[-1])`,
      '15',
      l('Lo más barato es empezar en el escalón 1, pagar 15 y saltar 2 hasta arriba → **15**. dp[i] es el costo mínimo para llegar al escalón i.', 'The cheapest is starting at step 1, paying 15 and jumping 2 to the top → **15**. dp[i] is the minimum cost to reach step i.'),
      l('A i llegas desde i − 1 (pagando su costo) o desde i − 2 (pagando el suyo); te quedas con lo más barato.', 'You reach i from i − 1 (paying its cost) or from i − 2 (paying its cost); keep the cheaper.')),
  ],
};
