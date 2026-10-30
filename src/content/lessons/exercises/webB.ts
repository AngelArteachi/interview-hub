import type { Block, Exercise, Lesson } from '../../../types';
import { code, concept, interview, l, md, q } from '../helpers';
import { C, P, R } from './builders';

/* Ejercicios: SQL · NoSQL, y la lección "SQL en la práctica".
 * Los de SQL se hacen en Python con sqlite3, así que se verifican ejecutándolos. */

/** Base de datos de la tienda que usan la lección de SQL y sus ejercicios */
export const TIENDA = `import sqlite3

db = sqlite3.connect(":memory:")          # una base de datos temporal, en memoria
db.executescript("""
CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), total INTEGER);
INSERT INTO clientes VALUES (1, 'Ana', 'CDMX'), (2, 'Luis', 'Monterrey'), (3, 'Eva', 'CDMX');
INSERT INTO pedidos VALUES (1, 1, 300), (2, 1, 150), (3, 2, 500);
""")

def nombres(sql):                          # la primera columna de cada fila, en una lista
    return [fila[0] for fila in db.execute(sql)]

def uno(sql):                              # el primer valor de la primera fila
    return db.execute(sql).fetchone()[0]
`;

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- SQL ---------------- */
  sql: {
    4: P('sql-cp-where', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${TIENDA}
print(nombres("SELECT nombre FROM clientes WHERE ciudad = 'CDMX' ORDER BY nombre DESC"))`,
      "['Eva', 'Ana']",
      l('`WHERE` deja a los clientes de CDMX (Ana y Eva) y `ORDER BY nombre DESC` los ordena de la Z a la A: **Eva, Ana**.', '`WHERE` keeps the CDMX customers (Ana and Eva) and `ORDER BY nombre DESC` sorts them Z to A: **Eva, Ana**.'),
      l('`nombres(sql)` devuelve la primera columna de cada fila del resultado.', '`nombres(sql)` returns the first column of each result row.')),
    6: R('sql-cp-having', 'basic',
      l('¿En qué se diferencian `WHERE` y `HAVING`? Da un ejemplo de cada uno con la tabla de pedidos.', 'How do `WHERE` and `HAVING` differ? Give an example of each with the orders table.'),
      l('`WHERE` filtra **filas antes** de agrupar (\`WHERE total > 100\`: solo los pedidos de más de 100). `HAVING` filtra **grupos después** de agrupar (\`GROUP BY cliente_id HAVING SUM(total) > 460\`: solo los clientes que gastaron más de 460).', '`WHERE` filters **rows before** grouping (\`WHERE total > 100\`: only orders over 100). `HAVING` filters **groups after** grouping (\`GROUP BY cliente_id HAVING SUM(total) > 460\`: only customers who spent more than 460).')),
    8: P('sql-cp-left', 'medium', l('INNER JOIN contra LEFT JOIN. ¿Qué imprime?', 'INNER JOIN versus LEFT JOIN. What does it print?'),
      `${TIENDA}
interno = uno("SELECT COUNT(*) FROM clientes c INNER JOIN pedidos p ON p.cliente_id = c.id")
izquierdo = uno("SELECT COUNT(*) FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id")
print(interno, izquierdo)`,
      '3 4',
      l('El INNER JOIN da una fila por cada pedido con su cliente: **3**. El LEFT JOIN además conserva a Eva, que no tiene pedidos (con NULL): **4**.', 'The INNER JOIN gives one row per order with its customer: **3**. The LEFT JOIN also keeps Eva, who has no orders (with NULL): **4**.'),
      l('Cuenta las filas que produce cada JOIN antes de contar.', 'Count the rows each JOIN produces before counting.')),
  },

  /* ---------------- NoSQL ---------------- */
  nosql: {
    1: P('nosql-cp-doc', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `usuario = {
    "nombre": "luis",
    "direcciones": [{"ciudad": "Monterrey"}, {"ciudad": "CDMX"}],
}
print(usuario["direcciones"][1]["ciudad"], len(usuario))`,
      'CDMX 2',
      l('`direcciones` es una lista y la posición 1 es la segunda dirección: **CDMX**. El documento tiene **2** campos de primer nivel (nombre y direcciones).', '`direcciones` is a list and position 1 is the second address: **CDMX**. The document has **2** top-level fields (nombre and direcciones).'),
      l('Un documento se navega igual que diccionarios y listas de Python.', 'A document is navigated just like Python dictionaries and lists.')),
    2: R('nosql-cp-which', 'basic',
      l('¿Qué base usarías para: (a) las sesiones de los usuarios, (b) un catálogo donde cada producto tiene atributos distintos, (c) las transferencias de un banco?', 'Which database would you use for: (a) user sessions, (b) a catalog where each product has different attributes, (c) bank transfers?'),
      l('(a) **Clave-valor** como Redis: muy rápida para buscar por clave. (b) **Documentos** como MongoDB: cada producto con sus propios campos. (c) **SQL** con transacciones ACID: con dinero importa la consistencia.', '(a) **Key-value** like Redis: very fast lookups by key. (b) **Document** like MongoDB: each product with its own fields. (c) **SQL** with ACID transactions: with money, consistency matters.')),
    4: P('nosql-cp-shard', 'basic', l('Ahora hay 4 servidores. ¿Qué imprime?', 'Now there are 4 servers. What does it print?'),
      `servidores = 4

def servidor_de(usuario_id):
    return usuario_id % servidores

print(servidor_de(7), servidor_de(8), servidor_de(13))`,
      '3 0 1',
      l('7 % 4 = **3**, 8 % 4 = **0** y 13 % 4 = **1**. La clave de partición (el id) decide en qué servidor vive cada usuario.', '7 % 4 = **3**, 8 % 4 = **0** and 13 % 4 = **1**. The partition key (the id) decides which server each user lives on.'),
      l('`%` es el residuo de la división.', '`%` is the remainder of the division.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- SQL ---------------- */
  sql: [
    P('sql-p-count', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${TIENDA}
print(uno("SELECT COUNT(*) FROM pedidos WHERE total >= 300"))`,
      '2',
      l('Los pedidos de 300 y de 500 cumplen; el de 150 no: **2**.', 'The 300 and 500 orders qualify; the 150 one does not: **2**.'),
      l('`COUNT(*)` cuenta las filas que dejó pasar el `WHERE`.', '`COUNT(*)` counts the rows the `WHERE` let through.')),
    R('sql-p-keys', 'basic',
      l('¿Qué es una clave primaria y qué es una clave foránea? Usa las tablas de clientes y pedidos.', 'What is a primary key and what is a foreign key? Use the customers and orders tables.'),
      l('La **clave primaria** identifica cada fila sin repetirse: \`clientes.id\`, \`pedidos.id\`. La **clave foránea** apunta a la clave primaria de otra tabla: \`pedidos.cliente_id\` dice de qué cliente es cada pedido.', 'The **primary key** identifies each row without repeating: \`clientes.id\`, \`pedidos.id\`. The **foreign key** points to another table\'s primary key: \`pedidos.cliente_id\` says whose order each one is.')),
    C('sql-p-max', 'basic',
      l('¿Qué va en el hueco para obtener el total **más alto**? (con la correcta imprime 500)', 'What goes in the blank to get the **highest** total? (the right one prints 500)'),
      `${TIENDA}
print(uno("SELECT total FROM pedidos ____ LIMIT 1"))`,
      ['ORDER BY total', 'ORDER BY total DESC', 'ORDER BY id', 'WHERE total > 0'],
      1,
      l('`ORDER BY total DESC` pone el mayor primero y `LIMIT 1` se queda con él: **500**. Sin `DESC` el orden es de menor a mayor (150).', '`ORDER BY total DESC` puts the largest first and `LIMIT 1` keeps it: **500**. Without `DESC` the order is smallest first (150).'),
      l('`LIMIT 1` toma la primera fila del resultado ya ordenado.', '`LIMIT 1` takes the first row of the already sorted result.')),
    P('sql-p-group', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `${TIENDA}
print(db.execute("SELECT cliente_id, SUM(total) FROM pedidos GROUP BY cliente_id ORDER BY cliente_id").fetchall())`,
      '[(1, 450), (2, 500)]',
      l('Hay un grupo por cliente con pedidos: Ana (1) suma 300 + 150 = **450** y Luis (2) **500**. Eva no aparece porque no tiene filas en pedidos.', 'There is one group per customer with orders: Ana (1) adds 300 + 150 = **450** and Luis (2) **500**. Eva does not appear because she has no rows in orders.'),
      l('`fetchall()` devuelve una tupla por grupo: (cliente_id, suma).', '`fetchall()` returns one tuple per group: (cliente_id, sum).')),
    C('sql-p-having', 'medium',
      l('Clientes que gastaron **más de 400** en total. ¿Qué va en el hueco? (con la correcta imprime `[\'Ana\', \'Luis\']`)', 'Customers who spent **more than 400** in total. What goes in the blank? (the right one prints `[\'Ana\', \'Luis\']`)'),
      `${TIENDA}
print(nombres("""
    SELECT c.nombre FROM clientes c
    JOIN pedidos p ON p.cliente_id = c.id
    GROUP BY c.id
    ____
    ORDER BY c.nombre
"""))`,
      ['WHERE SUM(p.total) > 400', 'HAVING SUM(p.total) > 400', 'HAVING COUNT(*) > 400', 'HAVING SUM(p.total) > 460'],
      1,
      l('Se filtran **grupos** (la suma por cliente), así que va `HAVING`: Ana gastó 450 y Luis 500. `WHERE` no puede usar `SUM`, y contar pedidos (`COUNT`) no es lo que se pide.', 'You filter **groups** (the per-customer sum), so it is `HAVING`: Ana spent 450 and Luis 500. `WHERE` cannot use `SUM`, and counting orders (`COUNT`) is not what is asked.'),
      l('Primero se agrupa por cliente y luego se decide qué grupos quedan.', 'First it groups by customer and then decides which groups stay.')),
    P('sql-p-second', 'interview', l('El segundo total más alto con una subconsulta. ¿Qué imprime?', 'The second highest total with a subquery. What does it print?'),
      `${TIENDA}
print(uno("SELECT MAX(total) FROM pedidos WHERE total < (SELECT MAX(total) FROM pedidos)"))`,
      '300',
      l('La subconsulta da el máximo (500). De los totales menores que 500 (300 y 150), el mayor es **300**.', 'The subquery gives the maximum (500). Of the totals below 500 (300 and 150), the largest is **300**.'),
      l('Primero se calcula lo que está entre paréntesis.', 'What is in parentheses is computed first.')),
    R('sql-p-acid', 'medium',
      l('Explica ACID con el ejemplo de una transferencia de 100 de la cuenta A a la B.', 'Explain ACID with the example of transferring 100 from account A to B.'),
      l('**Atomicidad:** restar de A y sumar a B pasa completo o nada. **Consistencia:** se respetan las reglas (por ejemplo, ningún saldo negativo). **Aislamiento:** otra transacción no ve el momento en que A ya bajó pero B no ha subido. **Durabilidad:** después del COMMIT, la transferencia sobrevive aunque se caiga el servidor.', '**Atomicity:** subtracting from A and adding to B happens completely or not at all. **Consistency:** the rules hold (for example, no negative balance). **Isolation:** another transaction does not see the moment when A dropped but B has not risen. **Durability:** after COMMIT, the transfer survives even if the server crashes.')),
    R('sql-p-n1', 'interview',
      l('Tu página lista 50 artículos con el nombre de su autor y tarda mucho. En los logs ves 51 consultas. ¿Qué pasa y cómo lo arreglas?', 'Your page lists 50 articles with their author\'s name and is slow. In the logs you see 51 queries. What is happening and how do you fix it?'),
      l('Es el **problema N+1**: 1 consulta para los artículos y 50 más, una por autor. Se arregla trayendo todo en **una sola consulta con JOIN** (artículos JOIN autores) o con la **carga anticipada** (*eager loading*) del ORM.', 'It is the **N+1 problem**: 1 query for the articles and 50 more, one per author. It is fixed by fetching everything in **a single query with a JOIN** (articles JOIN authors) or with the ORM\'s **eager loading**.')),
  ],

  /* ---------------- NoSQL ---------------- */
  nosql: [
    R('nosql-p-types', 'basic',
      l('Nombra los cuatro tipos de bases NoSQL con un ejemplo y un uso de cada uno.', 'Name the four types of NoSQL databases with an example and a use for each.'),
      l('**Documentos** (MongoDB): perfiles, catálogos. **Clave-valor** (Redis): caché, sesiones. **Columnares** (Cassandra): escrituras masivas, series de tiempo. **Grafos** (Neo4j): redes sociales, recomendaciones.', '**Document** (MongoDB): profiles, catalogs. **Key-value** (Redis): cache, sessions. **Wide-column** (Cassandra): massive writes, time series. **Graph** (Neo4j): social networks, recommendations.')),
    P('nosql-p-embed', 'basic', l('Un carrito guardado como documento. ¿Qué imprime?', 'A cart stored as a document. What does it print?'),
      `carrito = {
    "usuario": "ana",
    "items": [{"sku": "A1", "cant": 2}, {"sku": "C9", "cant": 3}],
}
total = 0
for item in carrito["items"]:
    total += item["cant"]
print(total)`,
      '5',
      l('Los productos van **embebidos** en el documento: 2 + 3 = **5** piezas, sin JOIN.', 'The products are **embedded** in the document: 2 + 3 = **5** items, with no JOIN.'),
      l('`carrito["items"]` es una lista de diccionarios.', '`carrito["items"]` is a list of dictionaries.')),
    R('nosql-p-when-sql', 'basic',
      l('¿Cuándo conviene una base SQL en vez de una NoSQL?', 'When does an SQL database beat a NoSQL one?'),
      l('Cuando los datos tienen **relaciones claras** (clientes, pedidos, productos), necesitas **transacciones ACID** (dinero, inventario) o consultas flexibles que todavía no conoces. NoSQL brilla con esquemas cambiantes, operaciones simples muy rápidas o volúmenes enormes.', 'When data has **clear relationships** (customers, orders, products), you need **ACID transactions** (money, inventory) or flexible queries you do not know yet. NoSQL shines with changing schemas, very fast simple operations or huge volumes.')),
    C('nosql-p-counter', 'medium',
      l('Un contador de visitas tipo clave-valor. ¿Qué va en el hueco? (con la correcta imprime `{\'/\': 2, \'/blog\': 1}`)', 'A key-value style visit counter. What goes in the blank? (the right one prints `{\'/\': 2, \'/blog\': 1}`)'),
      `visitas = {}
for pagina in ["/", "/blog", "/"]:
    visitas[pagina] = ____
print(visitas)`,
      ['visitas[pagina] + 1', 'visitas.get(pagina, 0) + 1', '1', 'visitas.get(pagina) + 1'],
      1,
      l('`visitas.get(pagina, 0)` da 0 la primera vez y el conteo actual después. `visitas[pagina]` falla con una clave nueva, `get` sin el 0 devuelve `None`, y poner `1` nunca suma.', '`visitas.get(pagina, 0)` gives 0 the first time and the current count afterwards. `visitas[pagina]` fails on a new key, `get` without the 0 returns `None`, and setting `1` never adds up.'),
      l('Es el mismo patrón de contar que viste con diccionarios.', 'It is the same counting pattern you saw with dictionaries.')),
    R('nosql-p-replicas', 'medium',
      l('¿Qué diferencia hay entre usar **réplicas** y hacer **sharding**? ¿Qué problema resuelve cada uno?', 'What is the difference between using **replicas** and **sharding**? Which problem does each solve?'),
      l('Las **réplicas** copian **todos** los datos en varios servidores: reparten las lecturas y dan respaldo si uno se cae. El **sharding** **reparte** los datos (cada servidor guarda una parte, según una clave de partición): resuelve que los datos o las escrituras ya no quepan en un solo servidor.', '**Replicas** copy **all** the data onto several servers: they share reads and provide backup if one goes down. **Sharding** **splits** the data (each server holds a part, by a partition key): it solves the data or writes no longer fitting on a single server.')),
    P('nosql-p-eventual', 'medium', l('Una réplica que se pone al día después. ¿Qué imprime?', 'A replica that catches up later. What does it print?'),
      `principal = {"likes": 10}
replica = dict(principal)        # una copia de los datos en otro servidor
principal["likes"] += 1          # llega un "me gusta" al servidor principal
antes = replica["likes"]         # alguien lee de la réplica antes de que se sincronice
replica.update(principal)        # la réplica se pone al día
print(antes, replica["likes"])`,
      '10 11',
      l('Quien leyó de la réplica antes de sincronizar vio **10** (un dato viejo); después de ponerse al día ya dice **11**. Eso es **consistencia eventual**.', 'Whoever read from the replica before syncing saw **10** (stale data); after catching up it says **11**. That is **eventual consistency**.'),
      l('`dict(principal)` crea una copia independiente; `update` copia los valores del principal.', '`dict(principal)` creates an independent copy; `update` copies the main one\'s values.')),
    R('nosql-p-cap', 'interview',
      l('Explica el teorema CAP sin caer en el "elige 2 de 3".', 'Explain the CAP theorem without falling into "pick 2 of 3".'),
      l('En un sistema distribuido las fallas de red (**particiones**) van a pasar. **Mientras hay una partición**, el sistema debe elegir entre **consistencia** (todos ven el mismo dato, aunque algunos dejen de responder) y **disponibilidad** (siempre responde, aunque sea con un dato viejo). Sin partición puede tener ambas, y la elección puede ser distinta para cada operación.', 'In a distributed system network failures (**partitions**) will happen. **While there is a partition**, the system must choose between **consistency** (everyone sees the same data, even if some stop answering) and **availability** (it always answers, even with stale data). Without a partition it can have both, and the choice can differ per operation.')),
    R('nosql-p-junior', 'interview',
      l('Te piden elegir la base de datos para una app nueva de reservas de restaurantes. ¿Qué respondes?', 'You are asked to choose the database for a new restaurant booking app. What do you answer?'),
      l('Empezaría con **SQL** (por ejemplo PostgreSQL): reservas, mesas y clientes tienen relaciones claras y no puede haber dos reservas para la misma mesa a la misma hora (transacciones). Si hace falta velocidad para lecturas frecuentes, agregaría **Redis como caché**.', 'I would start with **SQL** (for example PostgreSQL): bookings, tables and customers have clear relationships and two bookings for the same table at the same time cannot happen (transactions). If frequent reads need speed, I would add **Redis as a cache**.')),
  ],
};

/* ======================= SQL en la práctica ======================= */

const tryIt = (ex: Exercise): Block[] => [md('### ✍️ Ahora tú', '### ✍️ Your turn'), { kind: 'exercise', ex }];

export const SQL_PRACTICE_LESSON: Lesson = {
  id: 'sql-practice',
  track: 'web',
  title: l('SQL en la práctica', 'SQL in practice'),
  summary: l('Las consultas típicas de entrevista resueltas paso a paso (sin pareja, el segundo más alto, agrupar y filtrar grupos, transacciones) y luego las haces tú.', 'Typical interview queries solved step by step (unmatched rows, the second highest, grouping and filtering groups, transactions), then you do them.'),
  minutes: 22,
  blocks: [
    md(
      `## Antes de escribir una consulta, pregúntate
1. ¿De qué **tablas** salen los datos?
2. ¿Hay que **unirlas**? ¿Necesito solo las que tienen pareja (**INNER JOIN**) o todas las de un lado (**LEFT JOIN**)?
3. ¿Hay que **agrupar**? ¿Filtro **filas** (\`WHERE\`, antes) o **grupos** (\`HAVING\`, después)?
4. ¿En qué **orden** y **cuántas** filas (\`ORDER BY\`, \`LIMIT\`)?

Todos los ejemplos usan la tienda de la lección anterior: Ana (CDMX) tiene pedidos de 300 y 150, Luis (Monterrey) uno de 500 y Eva (CDMX) ninguno.`,
      `## Before writing a query, ask yourself
1. Which **tables** does the data come from?
2. Do they need to be **joined**? Do I need only matched rows (**INNER JOIN**) or every row on one side (**LEFT JOIN**)?
3. Do I need to **group**? Do I filter **rows** (\`WHERE\`, before) or **groups** (\`HAVING\`, after)?
4. In what **order** and **how many** rows (\`ORDER BY\`, \`LIMIT\`)?

Every example uses the store from the previous lesson: Ana (CDMX) has orders of 300 and 150, Luis (Monterrey) one of 500 and Eva (CDMX) none.`,
    ),
    code(TIENDA),

    md('## Ejemplo 1: los que no tienen pareja', '## Example 1: the unmatched ones'),
    code(`${TIENDA}
print(nombres("""
    SELECT c.nombre
    FROM clientes c
    LEFT JOIN pedidos p ON p.cliente_id = c.id
    WHERE p.id IS NULL
"""))   # imprime: ['Eva']`),
    md(
      'El LEFT JOIN conserva a todos los clientes; los que no tienen pedidos quedan con `p.id` en NULL, y el `WHERE` se queda justo con esos. Al revés, con un **INNER JOIN** obtienes los que **sí** tienen pareja; si un cliente tiene varios pedidos aparecería varias veces, y `SELECT DISTINCT` quita los repetidos.',
      'The LEFT JOIN keeps every customer; those without orders end up with `p.id` as NULL, and the `WHERE` keeps exactly those. Conversely, with an **INNER JOIN** you get the ones that **do** have a match; a customer with several orders would appear several times, and `SELECT DISTINCT` removes the repeats.',
    ),
    ...tryIt(P('sqlp-distinct', 'basic', l('Clientes con al menos un pedido de 300 o más. ¿Qué imprime?', 'Customers with at least one order of 300 or more. What does it print?'),
      `${TIENDA}
print(nombres("""
    SELECT DISTINCT c.nombre
    FROM clientes c
    JOIN pedidos p ON p.cliente_id = c.id
    WHERE p.total >= 300
    ORDER BY c.nombre
"""))`,
      "['Ana', 'Luis']",
      l('Ana tiene un pedido de 300 y Luis uno de 500; Eva no tiene pedidos, así que el JOIN ni la incluye: **[\'Ana\', \'Luis\']**. `DISTINCT` evitaría repetir a Ana si tuviera dos pedidos que cumplan.', 'Ana has a 300 order and Luis a 500 one; Eva has no orders, so the JOIN does not even include her: **[\'Ana\', \'Luis\']**. `DISTINCT` would avoid repeating Ana if she had two qualifying orders.'),
      l('Primero se unen las tablas, luego el `WHERE` filtra los pedidos y al final se quitan los nombres repetidos.', 'First the tables are joined, then the `WHERE` filters orders and finally repeated names are removed.'))),

    md('## Ejemplo 2: el segundo más alto', '## Example 2: the second highest'),
    code(`${TIENDA}
# Forma 1: el máximo de los que son menores que el máximo
print(uno("SELECT MAX(total) FROM pedidos WHERE total < (SELECT MAX(total) FROM pedidos)"))   # imprime: 300

# Forma 2: ordenar de mayor a menor, saltarse 1 (OFFSET 1) y tomar 1
print(uno("SELECT total FROM pedidos ORDER BY total DESC LIMIT 1 OFFSET 1"))                   # imprime: 300`),
    md(
      '`OFFSET n` se salta las primeras n filas. Ojo con los empates: si hubiera dos pedidos de 500, la forma 2 devolvería 500 (el segundo pedido), mientras que la forma 1 sigue dando el segundo **valor** distinto. Pregunta en la entrevista cuál de las dos quieren.',
      '`OFFSET n` skips the first n rows. Watch out for ties: if there were two 500 orders, form 2 would return 500 (the second order), while form 1 still gives the second distinct **value**. Ask in the interview which one they want.',
    ),
    ...tryIt(P('sqlp-offset', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `${TIENDA}
print(uno("SELECT total FROM pedidos ORDER BY total DESC LIMIT 1 OFFSET 2"))`,
      '150',
      l('Ordenados de mayor a menor: 500, 300, 150. `OFFSET 2` se salta los dos primeros y `LIMIT 1` toma el siguiente: **150**.', 'Sorted largest first: 500, 300, 150. `OFFSET 2` skips the first two and `LIMIT 1` takes the next: **150**.'),
      l('Escribe la lista ordenada y cuenta cuántas filas se saltan.', 'Write the sorted list and count how many rows are skipped.'))),

    md('## Ejemplo 3: agrupar y filtrar grupos', '## Example 3: grouping and filtering groups'),
    code(`${TIENDA}
print(db.execute("""
    SELECT c.ciudad, SUM(p.total)
    FROM clientes c
    JOIN pedidos p ON p.cliente_id = c.id
    GROUP BY c.ciudad
    ORDER BY c.ciudad
""").fetchall())   # imprime: [('CDMX', 450), ('Monterrey', 500)]`),
    md(
      'Se unen las tablas para saber la ciudad de cada pedido y luego se agrupa por ciudad. Para quedarte solo con algunos grupos, agrega `HAVING` después del `GROUP BY`.',
      'The tables are joined to know each order\'s city and then grouped by city. To keep only some groups, add `HAVING` after the `GROUP BY`.',
    ),
    ...tryIt(C('sqlp-having', 'medium', l('Ciudades con **más de un pedido**. ¿Qué va en el hueco? (con la correcta imprime `[\'CDMX\']`)', 'Cities with **more than one order**. What goes in the blank? (the right one prints `[\'CDMX\']`)'),
      `${TIENDA}
print(nombres("""
    SELECT c.ciudad
    FROM clientes c
    JOIN pedidos p ON p.cliente_id = c.id
    GROUP BY c.ciudad
    ____
"""))`,
      ['WHERE COUNT(*) > 1', 'HAVING COUNT(*) > 0', 'HAVING COUNT(*) > 1', 'HAVING SUM(p.total) > 1'],
      2,
      l('CDMX tiene 2 pedidos (los de Ana) y Monterrey 1. Se filtran grupos con `HAVING COUNT(*) > 1`: **[\'CDMX\']**. `WHERE` no puede usar `COUNT`.', 'CDMX has 2 orders (Ana\'s) and Monterrey 1. Groups are filtered with `HAVING COUNT(*) > 1`: **[\'CDMX\']**. `WHERE` cannot use `COUNT`.'),
      l('`COUNT(*)` dentro de un grupo cuenta sus filas, es decir, sus pedidos.', '`COUNT(*)` inside a group counts its rows, that is, its orders.'))),

    md('## Ejemplo 4: una transacción que se deshace', '## Example 4: a transaction that is undone'),
    code(`import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE cuentas (id INTEGER PRIMARY KEY, saldo INTEGER CHECK (saldo >= 0))")
db.execute("INSERT INTO cuentas VALUES (1, 100), (2, 50)")
db.commit()

try:
    db.execute("UPDATE cuentas SET saldo = saldo + 200 WHERE id = 2")   # se suma a la 2...
    db.execute("UPDATE cuentas SET saldo = saldo - 200 WHERE id = 1")   # ...pero la 1 quedaría en -100: falla
    db.commit()
except sqlite3.IntegrityError:
    db.rollback()                                                       # se deshace TODO, también la suma

print(db.execute("SELECT saldo FROM cuentas ORDER BY id").fetchall())   # imprime: [(100,), (50,)]`),
    md(
      '`CHECK (saldo >= 0)` es una regla de la tabla (la **C** de ACID): la base rechaza cualquier saldo negativo con un `IntegrityError`. Gracias a la **atomicidad**, el `rollback()` deshace también la suma a la cuenta 2, que ya se había hecho. `(100,)` es una tupla de un solo elemento.',
      '`CHECK (saldo >= 0)` is a table rule (the **C** in ACID): the database rejects any negative balance with an `IntegrityError`. Thanks to **atomicity**, `rollback()` also undoes the addition to account 2, which had already happened. `(100,)` is a one-element tuple.',
    ),
    ...tryIt(P('sqlp-commit', 'medium', l('Ahora se transfieren solo 30. ¿Qué imprime?', 'Now only 30 is transferred. What does it print?'),
      `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE cuentas (id INTEGER PRIMARY KEY, saldo INTEGER CHECK (saldo >= 0))")
db.execute("INSERT INTO cuentas VALUES (1, 100), (2, 50)")
db.commit()

try:
    db.execute("UPDATE cuentas SET saldo = saldo + 30 WHERE id = 2")
    db.execute("UPDATE cuentas SET saldo = saldo - 30 WHERE id = 1")
    db.commit()
except sqlite3.IntegrityError:
    db.rollback()

print(db.execute("SELECT saldo FROM cuentas ORDER BY id").fetchall())`,
      '[(70,), (80,)]',
      l('Ningún saldo queda negativo, así que no hay error y el `commit()` confirma las dos operaciones: la cuenta 1 baja a **70** y la 2 sube a **80**.', 'No balance goes negative, so there is no error and `commit()` confirms both operations: account 1 drops to **70** and account 2 rises to **80**.'),
      l('El `except` solo corre si alguna regla se rompe.', 'The `except` only runs if some rule is broken.'))),
    interview(
      'Antes de escribir, di en voz alta el plan: "uno clientes con pedidos con un LEFT JOIN, agrupo por cliente y filtro con HAVING". Y pregunta por los casos raros: empates, valores NULL, clientes sin pedidos.',
      'Before writing, say the plan out loud: "I LEFT JOIN customers with orders, group by customer and filter with HAVING". And ask about edge cases: ties, NULL values, customers without orders.',
    ),
  ],
  quiz: [
    q('Para encontrar los clientes **sin** pedidos usas…', 'To find customers **without** orders you use…', [['INNER JOIN', 'INNER JOIN'], ['LEFT JOIN … WHERE p.id IS NULL', 'LEFT JOIN … WHERE p.id IS NULL'], ['GROUP BY', 'GROUP BY'], ['ORDER BY', 'ORDER BY']], 1,
      'El LEFT JOIN conserva a todos; los que no tienen pareja quedan en NULL.', 'The LEFT JOIN keeps everyone; the unmatched ones end up NULL.'),
    q('¿Qué hace `SELECT DISTINCT`?', 'What does `SELECT DISTINCT` do?', [['Ordena', 'Sorts'], ['Quita las filas repetidas del resultado', 'Removes repeated rows from the result'], ['Cuenta filas', 'Counts rows'], ['Une tablas', 'Joins tables']], 1,
      'Útil después de un JOIN, cuando alguien aparece una vez por cada pareja.', 'Useful after a JOIN, when someone appears once per match.'),
    q('¿Qué hace `LIMIT 1 OFFSET 1`?', 'What does `LIMIT 1 OFFSET 1` do?', [['Toma la primera fila', 'Takes the first row'], ['Se salta la primera fila y toma la siguiente', 'Skips the first row and takes the next'], ['Toma dos filas', 'Takes two rows'], ['Da error', 'It fails']], 1,
      'Con `ORDER BY total DESC` da el segundo más alto (si no hay empates).', 'With `ORDER BY total DESC` it gives the second highest (if there are no ties).'),
    q('Hay dos pedidos de 500. ¿Qué devuelve `ORDER BY total DESC LIMIT 1 OFFSET 1`?', 'There are two orders of 500. What does `ORDER BY total DESC LIMIT 1 OFFSET 1` return?', [['300', '300'], ['500, el segundo pedido de 500', '500, the second 500 order'], ['Nada', 'Nothing'], ['Da error', 'It fails']], 1,
      'Por eso conviene preguntar si quieren el segundo **valor** distinto (con la subconsulta) o la segunda fila.', 'That is why you should ask whether they want the second distinct **value** (with the subquery) or the second row.'),
    q('Para quedarte con las ciudades que tienen más de un pedido, después del GROUP BY usas…', 'To keep the cities with more than one order, after GROUP BY you use…', [['`WHERE COUNT(*) > 1`', '`WHERE COUNT(*) > 1`'], ['`HAVING COUNT(*) > 1`', '`HAVING COUNT(*) > 1`'], ['`LIMIT 1`', '`LIMIT 1`'], ['`DISTINCT`', '`DISTINCT`']], 1,
      'Se filtran grupos, así que va HAVING.', 'Groups are filtered, so it is HAVING.'),
    q('En el ejemplo 4, el segundo UPDATE rompe la regla `CHECK (saldo >= 0)`. ¿Qué pasa con el primer UPDATE?', 'In example 4, the second UPDATE breaks the `CHECK (saldo >= 0)` rule. What happens to the first UPDATE?', [['Se queda', 'It stays'], ['Se deshace con el `rollback()`', 'It is undone by `rollback()`'], ['Se repite', 'It is repeated'], ['Se guarda a medias', 'It is half saved']], 1,
      'Atomicidad: todo o nada.', 'Atomicity: all or nothing.'),
    q('¿Qué parte de ACID representa una regla como `CHECK (saldo >= 0)`?', 'Which part of ACID does a rule like `CHECK (saldo >= 0)` represent?', [['Atomicidad', 'Atomicity'], ['Consistencia', 'Consistency'], ['Aislamiento', 'Isolation'], ['Durabilidad', 'Durability']], 1,
      'La base solo pasa de un estado válido a otro.', 'The database only moves from one valid state to another.'),
  ],
  concepts: [
    concept('El segundo valor más alto en SQL', 'The second highest value in SQL', '`SELECT MAX(x) FROM t WHERE x < (SELECT MAX(x) FROM t)` (segundo valor distinto) o `ORDER BY x DESC LIMIT 1 OFFSET 1` (segunda fila, cuidado con empates).', '`SELECT MAX(x) FROM t WHERE x < (SELECT MAX(x) FROM t)` (second distinct value) or `ORDER BY x DESC LIMIT 1 OFFSET 1` (second row, watch for ties).'),
    concept('Plan para escribir una consulta SQL', 'Plan for writing an SQL query', 'Tablas → ¿unir (INNER o LEFT)? → ¿agrupar y filtrar filas (WHERE) o grupos (HAVING)? → orden y límite.', 'Tables → join (INNER or LEFT)? → group and filter rows (WHERE) or groups (HAVING)? → order and limit.'),
  ],
};
