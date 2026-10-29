import type { Algorithm, L, Pattern } from '../types';

const l = (es: string, en: string): L => ({ es, en });
const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;

export const PATTERNS: Record<Pattern, { name: L; idea: L }> = {
  hashing: {
    name: l('Arrays y hashing', 'Arrays & hashing'),
    idea: l('Usa un hash map/set para recordar lo que ya viste y responder en O(1).', 'Use a hash map/set to remember what you have seen and answer in O(1).'),
  },
  'two-pointers': {
    name: l('Dos punteros', 'Two pointers'),
    idea: l('Dos índices que se mueven (desde los extremos o a distinta velocidad) sobre datos ordenados o secuencias.', 'Two indices moving (from both ends or at different speeds) over sorted data or sequences.'),
  },
  'sliding-window': {
    name: l('Ventana deslizante', 'Sliding window'),
    idea: l('Mantén un rango [izq, der] contiguo; expande a la derecha y contrae a la izquierda cuando deje de ser válido.', 'Keep a contiguous range [left, right]; expand right and shrink left when it becomes invalid.'),
  },
  stack: {
    name: l('Pila', 'Stack'),
    idea: l('LIFO: ideal para emparejar (paréntesis), deshacer, o encontrar el siguiente mayor/menor (pila monótona).', 'LIFO: great for matching (parentheses), undo, or finding the next greater/smaller (monotonic stack).'),
  },
  'binary-search': {
    name: l('Búsqueda binaria', 'Binary search'),
    idea: l('Si el espacio de búsqueda está ordenado o es monótono, descarta la mitad en cada paso: O(log n).', 'If the search space is sorted or monotonic, discard half at each step: O(log n).'),
  },
  'linked-list': {
    name: l('Listas enlazadas', 'Linked lists'),
    idea: l('Manipula punteros con cuidado; usa nodo dummy y punteros rápido/lento.', 'Manipulate pointers carefully; use a dummy node and fast/slow pointers.'),
  },
  trees: {
    name: l('Árboles', 'Trees'),
    idea: l('Piensa recursivamente: resuelve para los hijos y combina. DFS (pre/in/post) o BFS por niveles.', 'Think recursively: solve for the children and combine. DFS (pre/in/post) or level-order BFS.'),
  },
  graphs: {
    name: l('Grafos', 'Graphs'),
    idea: l('Modela nodos y aristas; recorre con BFS (camino más corto sin pesos) o DFS, marcando visitados.', 'Model nodes and edges; traverse with BFS (shortest path unweighted) or DFS, marking visited.'),
  },
  dp: {
    name: l('Programación dinámica', 'Dynamic programming'),
    idea: l('Define el estado, la recurrencia y el caso base; guarda subresultados (memo o tabla).', 'Define the state, the recurrence and the base case; store subresults (memo or table).'),
  },
  sorting: {
    name: l('Ordenamiento', 'Sorting'),
    idea: l('Ordenar primero (O(n log n)) suele simplificar el problema: intervalos, duplicados, dos punteros.', 'Sorting first (O(n log n)) often simplifies the problem: intervals, duplicates, two pointers.'),
  },
};

export const ALGORITHMS: Algorithm[] = [
  /* ---------------- Hashing ---------------- */
  {
    id: 'two-sum',
    title: l('Two Sum', 'Two Sum'),
    pattern: 'hashing',
    difficulty: 'easy',
    statement: l(
      'Te dan una lista de números `nums` y un número objetivo `target`. Encuentra **dos números distintos de la lista que sumados den `target`** y devuelve sus **posiciones** (índices, empezando en 0). Siempre existe exactamente un par que cumple.',
      'You get a list of numbers `nums` and a target number `target`. Find **two different numbers in the list that add up to `target`** and return their **positions** (indices, starting at 0). Exactly one such pair always exists.',
    ),
    example: 'nums = [2, 7, 11, 15], target = 9  →  [0, 1]\n(nums[0] + nums[1] = 2 + 7 = 9)',
    hints: [
      l('La fuerza bruta prueba todos los pares: O(n²). ¿Qué necesitas saber de cada número?', 'Brute force tries every pair: O(n²). What do you need to know about each number?'),
      l('Para cada x, buscas `target - x`. ¿Cómo lo encuentras en O(1)?', 'For each x you look for `target - x`. How can you find it in O(1)?'),
    ],
    solution: l(
      'Recorre la lista una sola vez. Para cada número `x`, el que te falta para llegar a `target` es `target - x` (su "complemento"). Guarda en un hash map cada número que ya viste junto con su posición (`valor → índice`): así puedes preguntar en O(1) si el complemento ya apareció. Si está, ese es el par. Ejemplo: con target 9, al llegar al 7 buscas el 2, que ya viste en la posición 0 → respuesta [0, 1].',
      'Walk the list once. For each number `x`, the one you still need to reach `target` is `target - x` (its "complement"). Store every number you have seen with its position in a hash map (`value → index`), so you can ask in O(1) whether the complement already appeared. If it did, that is the pair. Example: with target 9, when you reach 7 you look for 2, which you saw at position 0 → answer [0, 1].',
    ),
    code: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('two-sum'),
  },
  {
    id: 'contains-duplicate',
    title: l('Contiene duplicados', 'Contains Duplicate'),
    pattern: 'hashing',
    difficulty: 'easy',
    statement: l('Devuelve `true` si algún valor aparece al menos dos veces en el arreglo.', 'Return `true` if any value appears at least twice in the array.'),
    example: 'nums = [1,2,3,1]  →  true',
    hints: [l('¿Qué estructura te dice en O(1) si ya viste un valor?', 'Which structure tells you in O(1) whether you have seen a value?')],
    solution: l('Usa un set: si el número ya está, hay duplicado; si no, agrégalo.', 'Use a set: if the number is already there, there is a duplicate; otherwise add it.'),
    code: `def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('contains-duplicate'),
  },
  {
    id: 'valid-anagram',
    title: l('Anagrama válido', 'Valid Anagram'),
    pattern: 'hashing',
    difficulty: 'easy',
    statement: l('Dadas dos cadenas `s` y `t`, determina si `t` es un anagrama de `s`.', 'Given two strings `s` and `t`, determine whether `t` is an anagram of `s`.'),
    example: 's = "anagram", t = "nagaram"  →  true',
    hints: [
      l('Ordenar ambas funciona en O(n log n). ¿Puedes hacerlo en O(n)?', 'Sorting both works in O(n log n). Can you do it in O(n)?'),
      l('Cuenta la frecuencia de cada letra.', 'Count the frequency of each letter.'),
    ],
    solution: l('Si las longitudes difieren, es falso. Cuenta caracteres de `s` sumando y de `t` restando; todos los conteos deben quedar en 0. El espacio es O(1) porque el alfabeto es fijo (26 letras).', 'If lengths differ, return false. Count characters of `s` adding and of `t` subtracting; every count must end at 0. Space is O(1) because the alphabet is fixed (26 letters).'),
    code: `from collections import Counter

def is_anagram(s, t):
    return len(s) == len(t) and Counter(s) == Counter(t)`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('valid-anagram'),
  },
  {
    id: 'group-anagrams',
    title: l('Agrupar anagramas', 'Group Anagrams'),
    pattern: 'hashing',
    difficulty: 'medium',
    statement: l('Agrupa las cadenas que son anagramas entre sí.', 'Group the strings that are anagrams of each other.'),
    example: '["eat","tea","tan","ate","nat","bat"]  →  [["eat","tea","ate"],["tan","nat"],["bat"]]',
    hints: [
      l('Los anagramas comparten una "firma". ¿Cuál?', 'Anagrams share a "signature". Which one?'),
      l('La palabra ordenada (o el conteo de letras) sirve como clave de un hash map.', 'The sorted word (or letter count) works as a hash map key.'),
    ],
    solution: l('Para cada palabra, calcula su clave (letras ordenadas) y agrégala a `grupos[clave]`. Devuelve los valores del mapa.', 'For each word compute its key (sorted letters) and append it to `groups[key]`. Return the map values.'),
    code: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())`,
    time: 'O(n · k log k)',
    space: 'O(n · k)',
    leetcode: lc('group-anagrams'),
  },
  {
    id: 'top-k-frequent',
    title: l('Top K elementos frecuentes', 'Top K Frequent Elements'),
    pattern: 'hashing',
    difficulty: 'medium',
    statement: l('Devuelve los `k` elementos más frecuentes del arreglo.', 'Return the `k` most frequent elements of the array.'),
    example: 'nums = [1,1,1,2,2,3], k = 2  →  [1,2]',
    hints: [
      l('Primero cuenta frecuencias con un hash map.', 'First count frequencies with a hash map.'),
      l('Ordenar por frecuencia es O(n log n). Bucket sort por frecuencia logra O(n).', 'Sorting by frequency is O(n log n). Bucket sort by frequency achieves O(n).'),
    ],
    solution: l('Cuenta frecuencias. Crea "cubetas" donde `cubeta[f]` tiene los números con frecuencia f. Recorre de la frecuencia más alta a la más baja hasta juntar k.', 'Count frequencies. Build "buckets" where `bucket[f]` holds numbers with frequency f. Walk from the highest frequency down until you collect k.'),
    code: `from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, f in count.items():
        buckets[f].append(num)
    res = []
    for f in range(len(buckets) - 1, 0, -1):
        for num in buckets[f]:
            res.append(num)
            if len(res) == k:
                return res`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('top-k-frequent-elements'),
  },
  /* ---------------- Two pointers ---------------- */
  {
    id: 'valid-palindrome',
    title: l('Palíndromo válido', 'Valid Palindrome'),
    pattern: 'two-pointers',
    difficulty: 'easy',
    statement: l('Determina si una cadena es palíndromo considerando solo caracteres alfanuméricos e ignorando mayúsculas.', 'Determine whether a string is a palindrome considering only alphanumeric characters and ignoring case.'),
    example: '"A man, a plan, a canal: Panama"  →  true',
    hints: [l('Pon un puntero al inicio y otro al final.', 'Put one pointer at the start and one at the end.'), l('Salta los caracteres que no sean alfanuméricos.', 'Skip non-alphanumeric characters.')],
    solution: l('Mueve `i` desde la izquierda y `j` desde la derecha, saltando no alfanuméricos; compara en minúsculas. Si alguno difiere, no es palíndromo.', 'Move `i` from the left and `j` from the right, skipping non-alphanumerics; compare lowercase. If any differ, it is not a palindrome.'),
    code: `def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        while i < j and not s[i].isalnum():
            i += 1
        while i < j and not s[j].isalnum():
            j -= 1
        if s[i].lower() != s[j].lower():
            return False
        i, j = i + 1, j - 1
    return True`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('valid-palindrome'),
  },
  {
    id: 'two-sum-sorted',
    title: l('Two Sum II (arreglo ordenado)', 'Two Sum II (sorted array)'),
    pattern: 'two-pointers',
    difficulty: 'medium',
    statement: l('El arreglo está ordenado ascendentemente. Encuentra dos números que sumen `target` usando espacio O(1).', 'The array is sorted ascending. Find two numbers that add up to `target` using O(1) space.'),
    example: 'numbers = [2,7,11,15], target = 9  →  [1,2] (1-indexed)',
    hints: [l('Aprovecha el orden: si la suma es muy grande, ¿qué puntero mueves?', 'Use the ordering: if the sum is too big, which pointer do you move?')],
    solution: l('Punteros en ambos extremos. Si la suma es menor que target, avanza el izquierdo; si es mayor, retrocede el derecho.', 'Pointers at both ends. If the sum is less than target, move left forward; if greater, move right backward.'),
    code: `def two_sum_sorted(nums, target):
    i, j = 0, len(nums) - 1
    while i < j:
        s = nums[i] + nums[j]
        if s == target:
            return [i + 1, j + 1]
        if s < target:
            i += 1
        else:
            j -= 1`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('two-sum-ii-input-array-is-sorted'),
  },
  {
    id: 'three-sum',
    title: l('3Sum', '3Sum'),
    pattern: 'two-pointers',
    difficulty: 'medium',
    statement: l('Encuentra todos los tripletes únicos que sumen 0.', 'Find all unique triplets that sum to 0.'),
    example: '[-1,0,1,2,-1,-4]  →  [[-1,-1,2],[-1,0,1]]',
    hints: [
      l('Ordena el arreglo primero.', 'Sort the array first.'),
      l('Fija un número y resuelve Two Sum II en el resto.', 'Fix one number and solve Two Sum II on the rest.'),
      l('Salta duplicados para no repetir tripletes.', 'Skip duplicates to avoid repeated triplets.'),
    ],
    solution: l('Ordena. Para cada índice i (saltando repetidos), usa dos punteros en [i+1, n-1] buscando `-nums[i]`. Al encontrar uno, avanza ambos punteros saltando duplicados.', 'Sort. For each index i (skipping repeats), use two pointers on [i+1, n-1] searching for `-nums[i]`. When you find one, move both pointers skipping duplicates.'),
    code: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1
    return res`,
    time: 'O(n²)',
    space: 'O(1) extra',
    leetcode: lc('3sum'),
  },
  {
    id: 'container-water',
    title: l('Contenedor con más agua', 'Container With Most Water'),
    pattern: 'two-pointers',
    difficulty: 'medium',
    statement: l('Dadas alturas de líneas verticales, elige dos que, junto al eje x, contengan la mayor cantidad de agua.', 'Given heights of vertical lines, pick two that together with the x-axis hold the most water.'),
    example: '[1,8,6,2,5,4,8,3,7]  →  49',
    hints: [
      l('Área = min(h[i], h[j]) × (j − i).', 'Area = min(h[i], h[j]) × (j − i).'),
      l('Empieza con el ancho máximo. ¿Qué línea conviene mover?', 'Start with maximum width. Which line should you move?'),
    ],
    solution: l('Punteros en los extremos. Calcula el área y mueve siempre el puntero de la línea más baja: mover la alta nunca puede mejorar el resultado.', 'Pointers at both ends. Compute the area and always move the pointer at the shorter line: moving the taller one can never improve the result.'),
    code: `def max_area(h):
    i, j, best = 0, len(h) - 1, 0
    while i < j:
        best = max(best, min(h[i], h[j]) * (j - i))
        if h[i] < h[j]:
            i += 1
        else:
            j -= 1
    return best`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('container-with-most-water'),
  },
  /* ---------------- Sliding window ---------------- */
  {
    id: 'best-time-stock',
    title: l('Mejor momento para comprar y vender', 'Best Time to Buy and Sell Stock'),
    pattern: 'sliding-window',
    difficulty: 'easy',
    statement: l('Dado el precio de una acción por día, obtén la máxima ganancia comprando un día y vendiendo un día posterior.', 'Given a stock price per day, get the maximum profit buying one day and selling on a later day.'),
    example: '[7,1,5,3,6,4]  →  5',
    hints: [l('Lleva el precio mínimo visto hasta ahora.', 'Track the minimum price seen so far.')],
    solution: l('Recorre los precios manteniendo el mínimo; en cada día la ganancia posible es `precio - mínimo`. Guarda la máxima.', 'Walk prices keeping the minimum; each day the possible profit is `price - min`. Keep the maximum.'),
    code: `def max_profit(prices):
    lo, best = float("inf"), 0
    for p in prices:
        lo = min(lo, p)
        best = max(best, p - lo)
    return best`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('best-time-to-buy-and-sell-stock'),
  },
  {
    id: 'longest-substring',
    title: l('Subcadena más larga sin repetir', 'Longest Substring Without Repeating Characters'),
    pattern: 'sliding-window',
    difficulty: 'medium',
    statement: l('Encuentra la longitud de la subcadena más larga sin caracteres repetidos.', 'Find the length of the longest substring without repeating characters.'),
    example: '"abcabcbb"  →  3 ("abc")',
    hints: [
      l('Mantén una ventana que siempre sea válida (sin repetidos).', 'Keep a window that is always valid (no repeats).'),
      l('Cuando entra un repetido, mueve la izquierda hasta eliminarlo.', 'When a repeat enters, move left until it is removed.'),
    ],
    solution: l('Usa un set con los caracteres de la ventana. Expande `der`; mientras `s[der]` ya esté, saca `s[izq]` y avanza `izq`. Actualiza la mejor longitud. El set nunca guarda más de min(n, k) caracteres, donde k es el tamaño del alfabeto.', 'Use a set with the window characters. Expand `right`; while `s[right]` is already there, remove `s[left]` and advance `left`. Update the best length. The set never holds more than min(n, k) characters, where k is the alphabet size.'),
    code: `def length_of_longest_substring(s):
    seen, left, best = set(), 0, 0
    for right, c in enumerate(s):
        while c in seen:
            seen.remove(s[left])
            left += 1
        seen.add(c)
        best = max(best, right - left + 1)
    return best`,
    time: 'O(n)',
    space: 'O(min(n, k))',
    leetcode: lc('longest-substring-without-repeating-characters'),
  },
  {
    id: 'max-sum-subarray-k',
    title: l('Suma máxima de subarreglo de tamaño k', 'Maximum Sum Subarray of Size K'),
    pattern: 'sliding-window',
    difficulty: 'easy',
    statement: l('Encuentra la suma máxima de cualquier subarreglo contiguo de tamaño exactamente k.', 'Find the maximum sum of any contiguous subarray of size exactly k.'),
    example: '[2,1,5,1,3,2], k = 3  →  9',
    hints: [l('No recalcules la suma completa: al mover la ventana, suma el que entra y resta el que sale.', 'Do not recompute the whole sum: when sliding, add the incoming and subtract the outgoing element.')],
    solution: l('Ventana de tamaño fijo. Calcula la suma de los primeros k y desliza sumando `a[i]` y restando `a[i-k]`.', 'Fixed-size window. Compute the sum of the first k and slide adding `a[i]` and subtracting `a[i-k]`.'),
    code: `def max_sum_k(a, k):
    window = sum(a[:k])
    best = window
    for i in range(k, len(a)):
        window += a[i] - a[i - k]
        best = max(best, window)
    return best`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('maximum-average-subarray-i'),
  },
  {
    id: 'char-replacement',
    title: l('Reemplazo de caracteres más largo', 'Longest Repeating Character Replacement'),
    pattern: 'sliding-window',
    difficulty: 'medium',
    statement: l('Puedes cambiar hasta k caracteres. Devuelve la longitud de la subcadena más larga con todas las letras iguales.', 'You can change up to k characters. Return the length of the longest substring with all letters equal.'),
    example: 's = "AABABBA", k = 1  →  4',
    hints: [
      l('Una ventana es válida si `tamaño − frecuencia_máxima ≤ k`.', 'A window is valid if `size − max_frequency ≤ k`.'),
    ],
    solution: l('Cuenta letras en la ventana y lleva la frecuencia máxima. Si `(der − izq + 1) − maxf > k`, contrae por la izquierda.', 'Count letters in the window and track the max frequency. If `(right − left + 1) − maxf > k`, shrink from the left.'),
    code: `def character_replacement(s, k):
    count, left, maxf, best = {}, 0, 0, 0
    for right, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        maxf = max(maxf, count[c])
        while (right - left + 1) - maxf > k:
            count[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('longest-repeating-character-replacement'),
  },
  /* ---------------- Stack ---------------- */
  {
    id: 'valid-parentheses',
    title: l('Paréntesis válidos', 'Valid Parentheses'),
    pattern: 'stack',
    difficulty: 'easy',
    statement: l('Determina si una cadena con `()[]{}` está correctamente balanceada.', 'Determine whether a string with `()[]{}` is correctly balanced.'),
    example: '"([]{})"  →  true,  "(]"  →  false',
    hints: [l('El último paréntesis abierto debe ser el primero en cerrarse: LIFO.', 'The last opened bracket must be the first closed: LIFO.')],
    solution: l('Apila los de apertura. Con uno de cierre, la cima debe ser su pareja; si no, es inválido. Al final la pila debe estar vacía.', 'Push opening brackets. On a closing one, the top must be its pair; otherwise invalid. At the end the stack must be empty.'),
    code: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('valid-parentheses'),
  },
  {
    id: 'min-stack',
    title: l('Min Stack', 'Min Stack'),
    pattern: 'stack',
    difficulty: 'medium',
    statement: l('Diseña una pila que soporte push, pop, top y getMin, todos en O(1).', 'Design a stack supporting push, pop, top and getMin, all in O(1).'),
    example: 'push(-2), push(0), push(-3)\ngetMin() → -3\npop()\ntop() → 0\ngetMin() → -2',
    hints: [l('Guarda junto a cada elemento el mínimo hasta ese punto.', 'Store, next to each element, the minimum up to that point.')],
    solution: l('Usa una segunda pila (o pares) con el mínimo actual en cada nivel. Al hacer pop, el mínimo anterior queda automáticamente en la cima.', 'Use a second stack (or pairs) with the current minimum at each level. On pop, the previous minimum is automatically on top.'),
    code: `class MinStack:
    def __init__(self):
        self.stack = []  # (valor, minimo)

    def push(self, x):
        m = min(x, self.stack[-1][1]) if self.stack else x
        self.stack.append((x, m))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def get_min(self):
        return self.stack[-1][1]`,
    time: 'O(1)',
    space: 'O(n)',
    leetcode: lc('min-stack'),
  },
  {
    id: 'daily-temperatures',
    title: l('Temperaturas diarias', 'Daily Temperatures'),
    pattern: 'stack',
    difficulty: 'medium',
    statement: l('Para cada día, ¿cuántos días hay que esperar para una temperatura más alta? (0 si nunca).', 'For each day, how many days until a warmer temperature? (0 if never).'),
    example: '[73,74,75,71,69,72,76,73]  →  [1,1,4,2,1,1,0,0]',
    hints: [
      l('Fuerza bruta es O(n²). Busca "siguiente mayor".', 'Brute force is O(n²). Think "next greater element".'),
      l('Pila monótona decreciente de índices.', 'Monotonic decreasing stack of indices.'),
    ],
    solution: l('Mantén una pila de índices con temperaturas decrecientes. Cuando llega una más alta, saca índices y calcula la distancia.', 'Keep a stack of indices with decreasing temperatures. When a warmer one arrives, pop indices and compute the distance.'),
    code: `def daily_temperatures(t):
    res = [0] * len(t)
    stack = []
    for i, temp in enumerate(t):
        while stack and t[stack[-1]] < temp:
            j = stack.pop()
            res[j] = i - j
        stack.append(i)
    return res`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('daily-temperatures'),
  },
  {
    id: 'eval-rpn',
    title: l('Evaluar notación polaca inversa', 'Evaluate Reverse Polish Notation'),
    pattern: 'stack',
    difficulty: 'medium',
    statement: l('Evalúa una expresión en notación postfija, p. ej. ["2","1","+","3","*"].', 'Evaluate an expression in postfix notation, e.g. ["2","1","+","3","*"].'),
    example: '["2","1","+","3","*"]  →  9',
    hints: [l('Los números se apilan; un operador usa los dos últimos.', 'Numbers are pushed; an operator uses the last two.')],
    solution: l('Recorre los tokens: si es número, apílalo; si es operador, saca b y a, calcula `a op b` y apila el resultado.', 'Walk tokens: if a number, push it; if an operator, pop b and a, compute `a op b` and push the result.'),
    code: `def eval_rpn(tokens):
    stack = []
    for t in tokens:
        if t in "+-*/":
            b, a = stack.pop(), stack.pop()
            if t == "+": stack.append(a + b)
            elif t == "-": stack.append(a - b)
            elif t == "*": stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('evaluate-reverse-polish-notation'),
  },
  /* ---------------- Binary search ---------------- */
  {
    id: 'binary-search',
    title: l('Búsqueda binaria', 'Binary Search'),
    pattern: 'binary-search',
    difficulty: 'easy',
    statement: l('Encuentra el índice de `target` en un arreglo ordenado, o −1.', 'Find the index of `target` in a sorted array, or −1.'),
    example: '[-1,0,3,5,9,12], target = 9  →  4',
    hints: [l('Compara con el elemento del medio y descarta la mitad.', 'Compare with the middle element and discard half.')],
    solution: l('Mantén `lo` y `hi`. Mientras `lo ≤ hi`, calcula `mid`; si es menor que target, `lo = mid + 1`; si es mayor, `hi = mid − 1`.', 'Keep `lo` and `hi`. While `lo ≤ hi`, compute `mid`; if less than target, `lo = mid + 1`; if greater, `hi = mid − 1`.'),
    code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    time: 'O(log n)',
    space: 'O(1)',
    leetcode: lc('binary-search'),
  },
  {
    id: 'search-rotated',
    title: l('Buscar en arreglo rotado', 'Search in Rotated Sorted Array'),
    pattern: 'binary-search',
    difficulty: 'medium',
    statement: l('Un arreglo ordenado fue rotado en un pivote desconocido. Encuentra `target` en O(log n).', 'A sorted array was rotated at an unknown pivot. Find `target` in O(log n).'),
    example: '[4,5,6,7,0,1,2], target = 0  →  4',
    hints: [l('En cada paso, al menos una de las dos mitades está ordenada.', 'At each step at least one of the two halves is sorted.'), l('Revisa si target cae dentro de la mitad ordenada.', 'Check whether target falls inside the sorted half.')],
    solution: l('Calcula mid. Si `nums[lo] ≤ nums[mid]`, la izquierda está ordenada: si target está en [lo, mid) ve a la izquierda, si no a la derecha. Simétrico para la derecha.', 'Compute mid. If `nums[lo] ≤ nums[mid]` the left half is sorted: if target is in [lo, mid) go left, else go right. Symmetric for the right half.'),
    code: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    time: 'O(log n)',
    space: 'O(1)',
    leetcode: lc('search-in-rotated-sorted-array'),
  },
  {
    id: 'find-min-rotated',
    title: l('Mínimo en arreglo rotado', 'Find Minimum in Rotated Sorted Array'),
    pattern: 'binary-search',
    difficulty: 'medium',
    statement: l('Encuentra el mínimo de un arreglo ordenado y rotado (sin duplicados).', 'Find the minimum of a sorted, rotated array (no duplicates).'),
    example: '[3,4,5,1,2]  →  1',
    hints: [l('Compara `nums[mid]` con `nums[hi]`.', 'Compare `nums[mid]` with `nums[hi]`.')],
    solution: l('Si `nums[mid] > nums[hi]`, el mínimo está a la derecha (`lo = mid + 1`); si no, está en mid o a la izquierda (`hi = mid`).', 'If `nums[mid] > nums[hi]`, the minimum is to the right (`lo = mid + 1`); otherwise it is at mid or to the left (`hi = mid`).'),
    code: `def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
    time: 'O(log n)',
    space: 'O(1)',
    leetcode: lc('find-minimum-in-rotated-sorted-array'),
  },
  {
    id: 'first-bad-version',
    title: l('Primera versión defectuosa', 'First Bad Version'),
    pattern: 'binary-search',
    difficulty: 'easy',
    statement: l('Las versiones 1..n son buenas hasta cierto punto y luego todas malas. Encuentra la primera mala llamando lo menos posible a `isBadVersion`.', 'Versions 1..n are good up to a point and then all bad. Find the first bad one calling `isBadVersion` as few times as possible.'),
    example: 'n = 5  (1, 2, 3 ✓ · 4, 5 ✗)\nisBadVersion(3) → false\nisBadVersion(4) → true   →  4',
    hints: [l('El predicado es monótono: F F F T T T. Busca la frontera.', 'The predicate is monotonic: F F F T T T. Search for the boundary.')],
    solution: l('Búsqueda binaria sobre la respuesta: si mid es mala, la respuesta está en [lo, mid]; si no, en [mid+1, hi].', 'Binary search on the answer: if mid is bad the answer is in [lo, mid]; otherwise in [mid+1, hi].'),
    code: `def first_bad_version(n):
    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if is_bad_version(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    time: 'O(log n)',
    space: 'O(1)',
    leetcode: lc('first-bad-version'),
  },
  /* ---------------- Linked list ---------------- */
  {
    id: 'reverse-list',
    title: l('Invertir lista enlazada', 'Reverse Linked List'),
    pattern: 'linked-list',
    difficulty: 'easy',
    statement: l('Invierte una lista enlazada simple.', 'Reverse a singly linked list.'),
    example: '1→2→3→4→5  →  5→4→3→2→1',
    hints: [l('Necesitas tres punteros: anterior, actual y siguiente.', 'You need three pointers: previous, current and next.')],
    solution: l('Recorre la lista; guarda `sig = actual.next`, apunta `actual.next = prev`, y avanza `prev = actual`, `actual = sig`.', 'Walk the list; save `nxt = cur.next`, set `cur.next = prev`, then advance `prev = cur`, `cur = nxt`.'),
    code: `def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('reverse-linked-list'),
  },
  {
    id: 'merge-two-lists',
    title: l('Combinar dos listas ordenadas', 'Merge Two Sorted Lists'),
    pattern: 'linked-list',
    difficulty: 'easy',
    statement: l('Combina dos listas enlazadas ordenadas en una sola lista ordenada.', 'Merge two sorted linked lists into one sorted list.'),
    example: '1 → 2 → 4\n1 → 3 → 4   →  1 → 1 → 2 → 3 → 4 → 4',
    hints: [l('Un nodo "dummy" simplifica el manejo de la cabeza.', 'A "dummy" node simplifies handling the head.')],
    solution: l('Con un nodo dummy y un puntero `tail`, enlaza siempre el menor de los dos nodos actuales. Al final, enlaza lo que quede.', 'With a dummy node and a `tail` pointer, always link the smaller of the two current nodes. At the end, link whatever remains.'),
    code: `def merge_two_lists(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`,
    time: 'O(n + m)',
    space: 'O(1)',
    leetcode: lc('merge-two-sorted-lists'),
  },
  {
    id: 'linked-list-cycle',
    title: l('Ciclo en lista enlazada', 'Linked List Cycle'),
    pattern: 'linked-list',
    difficulty: 'easy',
    statement: l('Determina si una lista enlazada tiene un ciclo usando memoria O(1).', 'Determine whether a linked list has a cycle using O(1) memory.'),
    example: '3 → 2 → 0 → -4 ↺ (-4 → 2)  →  true\n1 → 2 → null              →  false',
    hints: [l('Algoritmo de la tortuga y la liebre (Floyd).', 'Tortoise and hare algorithm (Floyd).')],
    solution: l('Un puntero lento avanza 1 y uno rápido 2. Si hay ciclo, se encontrarán; si el rápido llega a None, no hay ciclo.', 'A slow pointer moves 1 and a fast one moves 2. If there is a cycle they meet; if fast reaches None, there is no cycle.'),
    code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('linked-list-cycle'),
  },
  {
    id: 'middle-list',
    title: l('Nodo medio de la lista', 'Middle of the Linked List'),
    pattern: 'linked-list',
    difficulty: 'easy',
    statement: l('Devuelve el nodo del medio (el segundo si hay dos).', 'Return the middle node (the second one if there are two).'),
    example: '1 → 2 → 3 → 4 → 5      →  3\n1 → 2 → 3 → 4 → 5 → 6  →  4',
    hints: [l('Si un puntero va al doble de velocidad, ¿dónde está el lento cuando el rápido termina?', 'If one pointer moves at double speed, where is the slow one when the fast one ends?')],
    solution: l('Punteros lento y rápido: cuando el rápido llega al final, el lento está en el medio.', 'Slow and fast pointers: when fast reaches the end, slow is in the middle.'),
    code: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('middle-of-the-linked-list'),
  },
  /* ---------------- Trees ---------------- */
  {
    id: 'max-depth',
    title: l('Profundidad máxima de un árbol', 'Maximum Depth of Binary Tree'),
    pattern: 'trees',
    difficulty: 'easy',
    statement: l('Devuelve la profundidad máxima de un árbol binario.', 'Return the maximum depth of a binary tree.'),
    example: '    3\n   / \\\n  9   20\n     /  \\\n    15   7     →  3',
    hints: [l('La profundidad de un nodo = 1 + máx(profundidad izquierda, derecha).', 'Depth of a node = 1 + max(left depth, right depth).')],
    solution: l('Recursión: caso base nodo nulo → 0. Si no, 1 + max(izq, der).', 'Recursion: base case null node → 0. Otherwise 1 + max(left, right).'),
    code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    time: 'O(n)',
    space: 'O(h)',
    leetcode: lc('maximum-depth-of-binary-tree'),
  },
  {
    id: 'invert-tree',
    title: l('Invertir árbol binario', 'Invert Binary Tree'),
    pattern: 'trees',
    difficulty: 'easy',
    statement: l('Convierte un árbol binario en su **reflejo**, como si lo vieras en un espejo: en cada nodo, el hijo izquierdo pasa a la derecha y el derecho a la izquierda. Devuelve la raíz.', 'Turn a binary tree into its **mirror image**: at every node, the left child moves to the right and the right child to the left. Return the root.'),
    example: '     4              4\n   /   \\          /   \\\n  2     7   →    7     2\n / \\   / \\      / \\   / \\\n1   3 6   9    9   6 3   1',
    hints: [l('Intercambia los hijos de cada nodo.', 'Swap the children of every node.')],
    solution: l('Para cada nodo, intercambia `left` y `right`, y repite recursivamente en ambos hijos.', 'For each node, swap `left` and `right`, then recurse on both children.'),
    code: `def invert_tree(root):
    if root:
        root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
    time: 'O(n)',
    space: 'O(h)',
    leetcode: lc('invert-binary-tree'),
  },
  {
    id: 'level-order',
    title: l('Recorrido por niveles', 'Binary Tree Level Order Traversal'),
    pattern: 'trees',
    difficulty: 'medium',
    statement: l('Devuelve los valores del árbol nivel por nivel.', 'Return the tree values level by level.'),
    example: '[3,9,20,null,null,15,7]  →  [[3],[9,20],[15,7]]',
    hints: [l('BFS con una cola; procesa `len(cola)` nodos por nivel.', 'BFS with a queue; process `len(queue)` nodes per level.')],
    solution: l('Usa una cola. En cada iteración, toma el tamaño actual (un nivel), saca esos nodos, guarda sus valores y encola sus hijos.', 'Use a queue. Each iteration takes the current size (one level), pops those nodes, records their values and enqueues their children.'),
    code: `from collections import deque

def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('binary-tree-level-order-traversal'),
  },
  {
    id: 'validate-bst',
    title: l('Validar BST', 'Validate Binary Search Tree'),
    pattern: 'trees',
    difficulty: 'medium',
    statement: l('Determina si un árbol binario es un árbol binario de búsqueda válido.', 'Determine whether a binary tree is a valid binary search tree.'),
    example: '  2          5\n / \\        / \\\n1   3      1   4\n              / \\\n             3   6\n→ true      → false (3 < 5)',
    hints: [
      l('No basta comparar con los hijos directos.', 'Comparing with direct children is not enough.'),
      l('Pasa un rango (mín, máx) permitido a cada nodo.', 'Pass an allowed range (min, max) to each node.'),
    ],
    solution: l('DFS con límites: el nodo debe estar en (lo, hi). A la izquierda el límite superior pasa a ser su valor; a la derecha, el inferior.', 'DFS with bounds: the node must be in (lo, hi). Going left the upper bound becomes its value; going right, the lower bound.'),
    code: `def is_valid_bst(root, lo=float("-inf"), hi=float("inf")):
    if not root:
        return True
    if not (lo < root.val < hi):
        return False
    return (is_valid_bst(root.left, lo, root.val) and
            is_valid_bst(root.right, root.val, hi))`,
    time: 'O(n)',
    space: 'O(h)',
    leetcode: lc('validate-binary-search-tree'),
  },
  {
    id: 'lca-bst',
    title: l('Ancestro común más bajo en BST', 'Lowest Common Ancestor of a BST'),
    pattern: 'trees',
    difficulty: 'medium',
    statement: l('Encuentra el ancestro común más bajo de dos nodos p y q en un BST.', 'Find the lowest common ancestor of two nodes p and q in a BST.'),
    example: '        6\n      /   \\\n     2     8\n    / \\   / \\\n   0   4 7   9\np = 2, q = 8  →  6\np = 2, q = 4  →  2',
    hints: [l('Si ambos son menores que el nodo, el LCA está a la izquierda.', 'If both are smaller than the node, the LCA is on the left.')],
    solution: l('Desde la raíz: si p y q son menores, baja a la izquierda; si ambos mayores, a la derecha; si no, el nodo actual es el punto de separación → LCA.', 'From the root: if p and q are smaller go left; if both larger go right; otherwise the current node is the split point → LCA.'),
    code: `def lowest_common_ancestor(root, p, q):
    node = root
    while node:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node`,
    time: 'O(h)',
    space: 'O(1)',
    leetcode: lc('lowest-common-ancestor-of-a-binary-search-tree'),
  },
  /* ---------------- Graphs ---------------- */
  {
    id: 'number-of-islands',
    title: l('Número de islas', 'Number of Islands'),
    pattern: 'graphs',
    difficulty: 'medium',
    statement: l('Cuenta las islas en una cuadrícula de "1" (tierra) y "0" (agua). Las islas se conectan horizontal/verticalmente.', 'Count islands in a grid of "1" (land) and "0" (water). Islands connect horizontally/vertically.'),
    example: '1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1   →  3',
    hints: [
      l('Cada celda es un nodo; sus vecinos son las 4 direcciones.', 'Each cell is a node; its neighbors are the 4 directions.'),
      l('Cada vez que encuentres tierra no visitada, "hunde" toda la isla con DFS/BFS.', 'Whenever you find unvisited land, "sink" the whole island with DFS/BFS.'),
    ],
    solution: l('Recorre la cuadrícula. Al encontrar un "1", suma una isla y haz DFS marcando como visitadas todas las celdas conectadas.', 'Scan the grid. On a "1", count an island and DFS marking every connected cell as visited.'),
    code: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count`,
    time: 'O(m × n)',
    space: 'O(m × n)',
    leetcode: lc('number-of-islands'),
  },
  {
    id: 'flood-fill',
    title: l('Relleno por inundación', 'Flood Fill'),
    pattern: 'graphs',
    difficulty: 'easy',
    statement: l('Desde (sr, sc), cambia a `color` todas las celdas conectadas que tengan el color original.', 'From (sr, sc), change to `color` every connected cell with the original color.'),
    example: '1 1 1        2 2 2\n1 1 0   →    2 2 0\n1 0 1        2 0 1\n(sr = 1, sc = 1, color = 2)',
    hints: [l('Cuidado si el color nuevo es igual al original (bucle infinito).', 'Careful if the new color equals the original (infinite loop).')],
    solution: l('DFS desde la celda inicial, pintando y expandiendo a los 4 vecinos con el color original.', 'DFS from the starting cell, painting and expanding to the 4 neighbors with the original color.'),
    code: `def flood_fill(image, sr, sc, color):
    orig = image[sr][sc]
    if orig == color:
        return image

    def dfs(r, c):
        if 0 <= r < len(image) and 0 <= c < len(image[0]) and image[r][c] == orig:
            image[r][c] = color
            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    dfs(sr, sc)
    return image`,
    time: 'O(n)',
    space: 'O(n)',
    leetcode: lc('flood-fill'),
  },
  {
    id: 'course-schedule',
    title: l('Horario de cursos', 'Course Schedule'),
    pattern: 'graphs',
    difficulty: 'medium',
    statement: l('Hay n cursos con prerrequisitos [a, b] (para tomar a debes tomar b). ¿Se pueden terminar todos?', 'There are n courses with prerequisites [a, b] (to take a you must take b). Can you finish all of them?'),
    example: 'n = 2, [[1, 0]]          →  true\nn = 2, [[1, 0], [0, 1]]  →  false (1 ⇄ 0)',
    hints: [
      l('Es un grafo dirigido: ¿qué impediría terminar?', 'It is a directed graph: what would make it impossible?'),
      l('Detecta ciclos. Orden topológico (Kahn) con grados de entrada.', 'Detect cycles. Topological order (Kahn) with in-degrees.'),
    ],
    solution: l('Construye la lista de adyacencia y los grados de entrada. Encola cursos con grado 0; al procesarlos, reduce el grado de sus vecinos. Si procesas los n cursos, no hay ciclo.', 'Build the adjacency list and in-degrees. Enqueue courses with in-degree 0; when processed, decrease neighbors\' in-degree. If you process all n courses, there is no cycle.'),
    code: `from collections import deque

def can_finish(n, prereqs):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prereqs:
        graph[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    done = 0
    while q:
        c = q.popleft()
        done += 1
        for nxt in graph[c]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return done == n`,
    time: 'O(V + E)',
    space: 'O(V + E)',
    leetcode: lc('course-schedule'),
  },
  {
    id: 'shortest-path-grid',
    title: l('Camino más corto en cuadrícula', 'Shortest Path in Binary Matrix'),
    pattern: 'graphs',
    difficulty: 'medium',
    statement: l('Encuentra la longitud del camino más corto de la esquina superior izquierda a la inferior derecha pasando solo por 0 (8 direcciones).', 'Find the length of the shortest path from top-left to bottom-right passing only through 0s (8 directions).'),
    example: '0 0 0\n1 1 0\n1 1 0   →  4',
    hints: [l('Sin pesos → BFS garantiza el camino más corto.', 'Unweighted → BFS guarantees the shortest path.')],
    solution: l('BFS desde (0,0) guardando la distancia; marca visitados al encolar. La primera vez que llegas al destino, esa es la distancia mínima.', 'BFS from (0,0) storing the distance; mark visited when enqueuing. The first time you reach the target, that is the minimum distance.'),
    code: `from collections import deque

def shortest_path(grid):
    n = len(grid)
    if grid[0][0] or grid[n-1][n-1]:
        return -1
    q = deque([(0, 0, 1)])
    grid[0][0] = 1
    while q:
        r, c, d = q.popleft()
        if (r, c) == (n - 1, n - 1):
            return d
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1
                    q.append((nr, nc, d + 1))
    return -1`,
    time: 'O(n²)',
    space: 'O(n²)',
    leetcode: lc('shortest-path-in-binary-matrix'),
  },
  /* ---------------- DP ---------------- */
  {
    id: 'climbing-stairs',
    title: l('Subir escaleras', 'Climbing Stairs'),
    pattern: 'dp',
    difficulty: 'easy',
    statement: l('Puedes subir 1 o 2 escalones a la vez. ¿De cuántas formas puedes llegar al escalón n?', 'You can climb 1 or 2 steps at a time. In how many ways can you reach step n?'),
    example: 'n = 3  →  3',
    hints: [l('Para llegar a n vienes de n−1 o de n−2.', 'To reach n you come from n−1 or n−2.')],
    solution: l('`ways(n) = ways(n−1) + ways(n−2)` (Fibonacci). Solo necesitas los dos valores anteriores.', '`ways(n) = ways(n−1) + ways(n−2)` (Fibonacci). You only need the two previous values.'),
    code: `def climb_stairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('climbing-stairs'),
  },
  {
    id: 'house-robber',
    title: l('Ladrón de casas', 'House Robber'),
    pattern: 'dp',
    difficulty: 'medium',
    statement: l('No puedes robar dos casas adyacentes. Maximiza el dinero robado.', 'You cannot rob two adjacent houses. Maximize the money robbed.'),
    example: '[2,7,9,3,1]  →  12',
    hints: [l('En cada casa decides: robarla (+ mejor hasta i−2) o saltarla (mejor hasta i−1).', 'At each house decide: rob it (+ best up to i−2) or skip it (best up to i−1).')],
    solution: l('`dp[i] = max(dp[i−1], dp[i−2] + nums[i])`. Con dos variables basta.', '`dp[i] = max(dp[i−1], dp[i−2] + nums[i])`. Two variables are enough.'),
    code: `def rob(nums):
    prev, cur = 0, 0
    for x in nums:
        prev, cur = cur, max(cur, prev + x)
    return cur`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('house-robber'),
  },
  {
    id: 'coin-change',
    title: l('Cambio de monedas', 'Coin Change'),
    pattern: 'dp',
    difficulty: 'medium',
    statement: l('Con monedas de ciertas denominaciones (ilimitadas), ¿cuál es el mínimo de monedas para formar `amount`? (−1 si no se puede).', 'With coins of certain denominations (unlimited), what is the minimum number of coins to make `amount`? (−1 if impossible).'),
    example: 'coins = [1,2,5], amount = 11  →  3',
    hints: [
      l('Greedy no siempre funciona (p. ej. [1,3,4], 6).', 'Greedy does not always work (e.g. [1,3,4], 6).'),
      l('`dp[x]` = mínimo de monedas para formar x.', '`dp[x]` = minimum coins to make x.'),
    ],
    solution: l('Tabla dp de 0..amount con infinito y `dp[0] = 0`. Para cada x y cada moneda c ≤ x: `dp[x] = min(dp[x], dp[x−c] + 1)`.', 'dp table 0..amount with infinity and `dp[0] = 0`. For each x and each coin c ≤ x: `dp[x] = min(dp[x], dp[x−c] + 1)`.'),
    code: `def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for x in range(1, amount + 1):
        for c in coins:
            if c <= x:
                dp[x] = min(dp[x], dp[x - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`,
    time: 'O(amount × coins)',
    space: 'O(amount)',
    leetcode: lc('coin-change'),
  },
  {
    id: 'max-subarray',
    title: l('Subarreglo de suma máxima', 'Maximum Subarray'),
    pattern: 'dp',
    difficulty: 'medium',
    statement: l('Encuentra el subarreglo contiguo con la suma más grande.', 'Find the contiguous subarray with the largest sum.'),
    example: '[-2,1,-3,4,-1,2,1,-5,4]  →  6',
    hints: [l('Algoritmo de Kadane: ¿te conviene extender el subarreglo actual o empezar de nuevo?', 'Kadane\'s algorithm: is it better to extend the current subarray or start over?')],
    solution: l('`cur = max(x, cur + x)`; `best = max(best, cur)`. Si la suma acumulada es negativa, empezar de nuevo es mejor.', '`cur = max(x, cur + x)`; `best = max(best, cur)`. If the running sum is negative, starting over is better.'),
    code: `def max_sub_array(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('maximum-subarray'),
  },
  {
    id: 'unique-paths',
    title: l('Caminos únicos', 'Unique Paths'),
    pattern: 'dp',
    difficulty: 'medium',
    statement: l('Un robot en una cuadrícula m×n solo se mueve a la derecha o abajo. ¿Cuántos caminos hay de la esquina superior izquierda a la inferior derecha?', 'A robot on an m×n grid can only move right or down. How many paths are there from top-left to bottom-right?'),
    example: 'm = 3, n = 7  →  28',
    hints: [l('Para llegar a (r, c) vienes de arriba o de la izquierda.', 'To reach (r, c) you come from above or from the left.')],
    solution: l('`dp[r][c] = dp[r−1][c] + dp[r][c−1]`, con la primera fila y columna en 1. Se puede reducir a una sola fila.', '`dp[r][c] = dp[r−1][c] + dp[r][c−1]`, with first row and column set to 1. It can be reduced to a single row.'),
    code: `def unique_paths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]
    return row[-1]`,
    time: 'O(m × n)',
    space: 'O(n)',
    leetcode: lc('unique-paths'),
  },
  /* ---------------- Sorting ---------------- */
  {
    id: 'merge-intervals',
    title: l('Combinar intervalos', 'Merge Intervals'),
    pattern: 'sorting',
    difficulty: 'medium',
    statement: l('Combina todos los intervalos que se traslapan.', 'Merge all overlapping intervals.'),
    example: '[[1,3],[2,6],[8,10],[15,18]]  →  [[1,6],[8,10],[15,18]]',
    hints: [l('Ordena por inicio.', 'Sort by start.'), l('Compara cada intervalo con el último del resultado.', 'Compare each interval with the last one in the result.')],
    solution: l('Ordena por inicio. Si el intervalo actual empieza antes de que termine el último combinado, extiende su fin; si no, agrégalo como nuevo.', 'Sort by start. If the current interval starts before the last merged one ends, extend its end; otherwise append it as new.'),
    code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = []
    for s, e in intervals:
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res`,
    time: 'O(n log n)',
    space: 'O(n)',
    leetcode: lc('merge-intervals'),
  },
  {
    id: 'meeting-rooms',
    title: l('Salas de reunión', 'Meeting Rooms'),
    pattern: 'sorting',
    difficulty: 'easy',
    statement: l('Dados intervalos de reuniones, ¿puede una persona asistir a todas?', 'Given meeting intervals, can a person attend all of them?'),
    example: '[[0, 30], [5, 10], [15, 20]]  →  false\n[[7, 10], [2, 4]]             →  true',
    hints: [l('Tras ordenar, solo necesitas comparar reuniones consecutivas.', 'After sorting, you only need to compare consecutive meetings.')],
    solution: l('Ordena por inicio; si alguna reunión empieza antes de que termine la anterior, no se puede.', 'Sort by start; if any meeting starts before the previous one ends, it is impossible.'),
    code: `def can_attend(intervals):
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True`,
    time: 'O(n log n)',
    space: 'O(1)',
    leetcode: lc('meeting-rooms'),
  },
  {
    id: 'sort-colors',
    title: l('Ordenar colores', 'Sort Colors'),
    pattern: 'sorting',
    difficulty: 'medium',
    statement: l('Ordena en su lugar un arreglo de 0s, 1s y 2s en una sola pasada.', 'Sort in place an array of 0s, 1s and 2s in a single pass.'),
    example: '[2,0,2,1,1,0]  →  [0,0,1,1,2,2]',
    hints: [l('Bandera holandesa (Dijkstra): tres punteros low, mid, high.', 'Dutch national flag (Dijkstra): three pointers low, mid, high.')],
    solution: l('Si `a[mid] == 0`, intercambia con low y avanza ambos; si es 1, avanza mid; si es 2, intercambia con high y retrocede high (sin avanzar mid).', 'If `a[mid] == 0`, swap with low and advance both; if 1, advance mid; if 2, swap with high and decrement high (without advancing mid).'),
    code: `def sort_colors(a):
    low, mid, high = 0, 0, len(a) - 1
    while mid <= high:
        if a[mid] == 0:
            a[low], a[mid] = a[mid], a[low]
            low += 1; mid += 1
        elif a[mid] == 1:
            mid += 1
        else:
            a[mid], a[high] = a[high], a[mid]
            high -= 1`,
    time: 'O(n)',
    space: 'O(1)',
    leetcode: lc('sort-colors'),
  },
];

export const algorithmById = (id: string) => ALGORITHMS.find((a) => a.id === id);
