import type { Block } from '../../types';
import { code, interview, md, tip } from './helpers';

/**
 * Secciones que se agregan al final de lecciones existentes para que cubran
 * todo lo que preguntan sus tarjetas de repaso (flashcards de Fundamentos).
 */
export const EXTRA_BLOCKS: Record<string, Block[]> = {
  'big-o': [
    md(
      `## Complejidad amortizada
A veces una operación es casi siempre barata, pero de vez en cuando cuesta mucho. La **complejidad amortizada** es el costo **promedio por operación a lo largo de una secuencia larga** de operaciones.

El ejemplo clásico es agregar al final de un arreglo dinámico (\`list.append\` en Python):
- Casi siempre hay espacio libre y agregar cuesta **O(1)**.
- Cuando se llena, el arreglo reserva uno más grande (por ejemplo, del doble) y **copia todos los elementos**: esa vez cuesta **O(n)**.
- Como el tamaño se multiplica, las copias son cada vez más raras. Sumando n inserciones, el trabajo total es O(n), así que cada una cuesta **O(1) amortizado**.

No es lo mismo que el "caso promedio": el amortizado es una garantía sobre la secuencia completa, no una probabilidad.`,
      `## Amortized complexity
Sometimes an operation is almost always cheap but occasionally very expensive. **Amortized complexity** is the **average cost per operation over a long sequence** of operations.

The classic example is appending to a dynamic array (\`list.append\` in Python):
- Almost always there is free space and appending costs **O(1)**.
- When it is full, the array allocates a bigger one (e.g. double the size) and **copies every element**: that time it costs **O(n)**.
- Because the size multiplies, copies get rarer and rarer. Over n appends the total work is O(n), so each one costs **O(1) amortized**.

It is not the same as the "average case": amortized is a guarantee over the whole sequence, not a probability.`,
    ),
    interview(
      'Si te preguntan la complejidad de `append` en una lista de Python o de `push` en un arreglo de JavaScript, la respuesta precisa es "O(1) amortizado".',
      'If asked the complexity of `append` on a Python list or `push` on a JavaScript array, the precise answer is "O(1) amortized".',
    ),
  ],

  'arrays-hashing': [
    md(
      `## Colisiones en un hash map
Dos claves distintas pueden caer en la misma cubeta: eso es una **colisión**. Hay dos formas comunes de resolverlas:
- **Encadenamiento (chaining):** cada cubeta guarda una lista con todas las claves que caen ahí.
- **Direccionamiento abierto (open addressing):** si la cubeta está ocupada, se busca otra libre siguiendo una regla. Los diccionarios de CPython usan esta técnica.

Con una buena función hash y redimensionando la tabla cuando se llena, las colisiones son pocas y las operaciones siguen siendo **O(1) en promedio**.`,
      `## Collisions in a hash map
Two different keys can land in the same bucket: that is a **collision**. There are two common ways to resolve it:
- **Chaining:** each bucket stores a list of all the keys that land there.
- **Open addressing:** if the bucket is taken, look for another free one following a rule. CPython dictionaries use this technique.

With a good hash function and resizing the table when it fills up, collisions are rare and operations stay **O(1) on average**.`,
    ),
  ],

  trees: [
    md(
      `## Trie (árbol de prefijos)
Un **trie** es un árbol especial para guardar palabras: cada nodo representa un carácter, y el camino desde la raíz forma la palabra. Las palabras que comparten prefijo comparten nodos.

Buscar una palabra o saber si alguna empieza con un prefijo cuesta **O(L)**, donde L es la longitud de la palabra, sin importar cuántas palabras haya guardadas. Por eso se usa en **autocompletado** y correctores.`,
      `## Trie (prefix tree)
A **trie** is a special tree for storing words: each node represents a character, and the path from the root spells the word. Words sharing a prefix share nodes.

Searching a word or checking whether any word starts with a prefix costs **O(L)**, where L is the word length, no matter how many words are stored. That is why it is used for **autocomplete** and spell checkers.`,
    ),
    code(`class Trie:
    def __init__(self):
        self.hijos = {}
        self.fin = False          # ¿termina una palabra aquí?

    def insertar(self, palabra):
        nodo = self
        for c in palabra:
            nodo = nodo.hijos.setdefault(c, Trie())
        nodo.fin = True

    def empieza_con(self, prefijo):
        nodo = self
        for c in prefijo:
            if c not in nodo.hijos:
                return False
            nodo = nodo.hijos[c]
        return True`),
  ],

  'oop-pillars': [
    md(
      `## Composición vs herencia
- **Herencia** = relación "**es un**": un \`Perro\` *es un* \`Animal\`.
- **Composición** = relación "**tiene un**": un \`Auto\` *tiene un* \`Motor\`. El objeto delega trabajo en otros objetos que guarda como atributos.

Se suele preferir **composición sobre herencia**: la herencia acopla fuertemente a la clase hija con la padre (un cambio en la padre puede romper a las hijas) y crea jerarquías rígidas. Con composición puedes cambiar piezas, incluso en tiempo de ejecución.

## Interfaces y clases abstractas
- Una **interfaz** define un **contrato**: qué métodos debe tener una clase, sin implementarlos ni guardar estado. En Java una clase puede implementar varias interfaces.
- Una **clase abstracta** no se puede instanciar; puede tener **estado e implementación parcial** y métodos abstractos que las hijas deben completar. En Java solo se hereda de una clase.
- En Python ambas ideas se expresan con \`abc.ABC\` y \`@abstractmethod\`, como \`Figura\` en el ejemplo de arriba.

## Sobrecarga vs sobrescritura
- **Sobrecarga (overloading):** varios métodos con el **mismo nombre y distintos parámetros**; el compilador elige cuál usar. Existe en Java y C++. **Python no tiene sobrecarga real**: se imita con parámetros opcionales o \`functools.singledispatch\`.
- **Sobrescritura (overriding):** una subclase **redefine** un método del padre con la misma firma; se decide en tiempo de ejecución según el objeto (polimorfismo). \`area()\` en \`Circulo\` y \`Cuadrado\` es sobrescritura.`,
      `## Composition vs inheritance
- **Inheritance** = "**is a**" relation: a \`Dog\` *is an* \`Animal\`.
- **Composition** = "**has a**" relation: a \`Car\` *has an* \`Engine\`. The object delegates work to other objects it stores as attributes.

**Composition over inheritance** is usually preferred: inheritance tightly couples child and parent (a change in the parent can break the children) and creates rigid hierarchies. With composition you can swap parts, even at runtime.

## Interfaces and abstract classes
- An **interface** defines a **contract**: which methods a class must have, without implementing them or holding state. In Java a class can implement many interfaces.
- An **abstract class** cannot be instantiated; it can have **state and partial implementation**, plus abstract methods the children must complete. In Java you inherit from only one class.
- In Python both ideas are expressed with \`abc.ABC\` and \`@abstractmethod\`, like \`Shape\` in the example above.

## Overloading vs overriding
- **Overloading:** several methods with the **same name and different parameters**; the compiler picks which one to use. It exists in Java and C++. **Python has no real overloading**: it is emulated with optional parameters or \`functools.singledispatch\`.
- **Overriding:** a subclass **redefines** a parent method with the same signature; which one runs is decided at runtime by the object (polymorphism). \`area()\` in \`Circle\` and \`Square\` is overriding.`,
    ),
  ],

  solid: [
    md(
      `## Inyección de dependencias
La forma práctica de aplicar la **D** de SOLID es la **inyección de dependencias**: en vez de que una clase cree sus dependencias por dentro, **se las pasas desde fuera** (normalmente por el constructor). Así la clase depende de una abstracción, y en las pruebas puedes pasarle una versión falsa.`,
      `## Dependency injection
The practical way to apply SOLID's **D** is **dependency injection**: instead of a class creating its dependencies inside, **you pass them in from outside** (usually through the constructor). The class then depends on an abstraction, and in tests you can pass a fake version.`,
    ),
    code(`class ServicioPedidos:
    def __init__(self, repositorio):      # la dependencia llega desde fuera
        self.repo = repositorio

    def crear(self, pedido):
        self.repo.guardar(pedido)

# En producción
servicio = ServicioPedidos(PostgresRepo())

# En una prueba: un repositorio falso, sin base de datos
class RepoFalso:
    def __init__(self): self.guardados = []
    def guardar(self, p): self.guardados.append(p)

servicio_prueba = ServicioPedidos(RepoFalso())`),
  ],

  sql: [
    md(
      `## ACID en detalle
Las transacciones de una base de datos relacional garantizan cuatro propiedades:
- **A — Atomicidad:** todo o nada. Si una parte falla, se deshace todo (*rollback*).
- **C — Consistencia:** la transacción lleva la base de un estado válido a otro, respetando reglas como claves foráneas y restricciones.
- **I — Aislamiento (isolation):** las transacciones que corren al mismo tiempo no ven los cambios a medias de las otras.
- **D — Durabilidad:** lo que se confirmó (*commit*) persiste aunque se caiga el servidor.

## Normalización
Organizar las tablas para **evitar datos repetidos** y las inconsistencias que eso provoca (actualizar un dato en un lugar y olvidarlo en otro):
- **1FN:** cada celda tiene un valor atómico; nada de listas dentro de una columna.
- **2FN:** cada columna depende de **toda** la clave primaria, no solo de una parte (importa cuando la clave es compuesta).
- **3FN:** las columnas no dependen de otras columnas que no sean clave (sin dependencias transitivas). Ejemplo: no guardes la ciudad del cliente en cada pedido; guárdala en la tabla de clientes.

A veces se **desnormaliza** a propósito, duplicando algo de información, para que las lecturas sean más rápidas.

## El problema N+1
Ocurre cuando haces **1 consulta** para traer N registros y luego **N consultas más**, una por registro, para traer sus datos relacionados. Con 100 usuarios son 101 consultas. Se resuelve trayendo todo en una consulta con **JOIN** o con la **carga anticipada** (*eager loading*) del ORM.`,
      `## ACID in detail
Relational database transactions guarantee four properties:
- **A — Atomicity:** all or nothing. If one part fails, everything is undone (*rollback*).
- **C — Consistency:** the transaction takes the database from one valid state to another, respecting rules such as foreign keys and constraints.
- **I — Isolation:** transactions running at the same time do not see each other's half-done changes.
- **D — Durability:** what was confirmed (*commit*) persists even if the server crashes.

## Normalization
Organizing tables to **avoid repeated data** and the inconsistencies it causes (updating a value in one place and forgetting another):
- **1NF:** each cell holds an atomic value; no lists inside a column.
- **2NF:** every column depends on the **whole** primary key, not just part of it (matters when the key is composite).
- **3NF:** columns do not depend on other non-key columns (no transitive dependencies). Example: do not store the customer's city in every order; store it in the customers table.

Sometimes you **denormalize** on purpose, duplicating some information, to make reads faster.

## The N+1 problem
It happens when you make **1 query** to fetch N records and then **N more queries**, one per record, to fetch related data. With 100 users that is 101 queries. It is solved by fetching everything in one query with a **JOIN** or with the ORM's **eager loading**.`,
    ),
    code(`# ❌ N+1: una consulta por usuario
usuarios = db.query("SELECT * FROM users")
for u in usuarios:
    pedidos = db.query("SELECT * FROM orders WHERE user_id = %s", u.id)

# ✅ Una sola consulta con JOIN
filas = db.query("""
    SELECT u.id, u.name, o.id AS order_id, o.total
    FROM users u LEFT JOIN orders o ON o.user_id = u.id
""")`),
  ],

  git: [
    md(
      `## Resolver un conflicto de merge
Un conflicto aparece cuando dos ramas cambiaron **las mismas líneas** de un archivo y Git no sabe con cuál quedarse. Git marca la zona así:

\`\`\`text
<<<<<<< HEAD
color = "azul"      ← tu versión
=======
color = "verde"     ← la versión que estás integrando
>>>>>>> feature/colores
\`\`\`

Para resolverlo: edita el archivo y deja el código correcto (una versión, la otra o una mezcla), **borra los marcadores**, prueba que funcione y luego ejecuta \`git add\` y \`git commit\` (o \`git rebase --continue\` si estabas en un rebase).

## reset vs revert
| | \`git reset\` | \`git revert\` |
|---|---|---|
| Qué hace | Mueve la rama a un commit anterior | Crea un commit **nuevo** que deshace otro |
| Historia | La **reescribe** (los commits "desaparecen") | La **conserva** |
| ¿Seguro en ramas compartidas? | ❌ No | ✅ Sí |

\`reset --soft\` conserva tus cambios preparados, \`--mixed\` (por defecto) los deja sin preparar y \`--hard\` **los borra**: úsalo con cuidado.`,
      `## Resolving a merge conflict
A conflict appears when two branches changed **the same lines** of a file and Git does not know which to keep. Git marks the area like this:

\`\`\`text
<<<<<<< HEAD
color = "blue"      ← your version
=======
color = "green"     ← the version you are merging in
>>>>>>> feature/colors
\`\`\`

To resolve it: edit the file and keep the right code (one version, the other or a mix), **remove the markers**, check that it works, then run \`git add\` and \`git commit\` (or \`git rebase --continue\` during a rebase).

## reset vs revert
| | \`git reset\` | \`git revert\` |
|---|---|---|
| What it does | Moves the branch to an earlier commit | Creates a **new** commit that undoes another |
| History | **Rewrites** it (commits "disappear") | **Keeps** it |
| Safe on shared branches? | ❌ No | ✅ Yes |

\`reset --soft\` keeps your staged changes, \`--mixed\` (default) leaves them unstaged and \`--hard\` **deletes them**: use it carefully.`,
    ),
    tip('Si te equivocas en un merge o rebase, `git merge --abort` o `git rebase --abort` te devuelven al estado anterior.', 'If you mess up a merge or rebase, `git merge --abort` or `git rebase --abort` take you back to the previous state.'),
  ],
};
