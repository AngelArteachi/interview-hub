import type { Exercise } from '../../../types';
import { l } from '../helpers';
import { C, O, P, R } from './builders';

/* Ejercicios: OOP · SOLID · patrones de diseño · código limpio · testing · manejo de errores.
 * Regla: cada ejercicio usa solo lo enseñado en su lección o en las anteriores
 * (try/except, por ejemplo, solo aparece desde "Manejo de errores"). */

/** El publicador del patrón Observer, igual que en la lección */
const EVENTO = `class Evento:
    def __init__(self):
        self._suscriptores = []
    def suscribir(self, fn):
        self._suscriptores.append(fn)
    def emitir(self, dato):
        for fn in self._suscriptores:
            fn(dato)
`;

export const CHECKPOINTS: Record<string, Record<number, Exercise>> = {
  /* ---------------- Los 4 pilares de la OOP ---------------- */
  'oop-pillars': {
    2: P('oo-cp-class', 'basic',
      l('Cada objeto guarda sus propios datos. ¿Qué imprime?', 'Each object keeps its own data. What does it print?'),
      `class Contador:
    def __init__(self):
        self.valor = 0
    def sumar(self):
        self.valor += 1

a = Contador()
b = Contador()
a.sumar()
a.sumar()
b.sumar()
print(a.valor, b.valor)`,
      '2 1',
      l('`a` y `b` salen del mismo molde, pero cada uno tiene su propio `valor`. A `a` se le sumó dos veces y a `b` una: **2 1**.', '`a` and `b` come from the same mold, but each has its own `valor`. `a` was incremented twice and `b` once: **2 1**.'),
      l('Al crear cada contador, `__init__` le pone `valor = 0`. En `a.sumar()`, el `self` es `a`, así que solo cambia el valor de `a`.', 'When each counter is created, `__init__` sets `valor = 0`. In `a.sumar()`, `self` is `a`, so only the value of `a` changes.')),
    8: R('oo-cp-encap-abs', 'basic',
      l('¿En qué se diferencian el **encapsulamiento** y la **abstracción**?', 'How do **encapsulation** and **abstraction** differ?'),
      l('**Encapsulamiento**: proteger el estado interno; los demás usan métodos en vez de tocar los atributos. **Abstracción**: exponer **qué** hace algo y ocultar **cómo** lo hace (usas `lista.sort()` sin saber que es Timsort).', '**Encapsulation**: protect the internal state; others use methods instead of touching attributes. **Abstraction**: expose **what** something does and hide **how** (you call `list.sort()` without knowing it is Timsort).')),
    17: P('oo-cp-poly', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `from abc import ABC, abstractmethod

class Figura(ABC):
    @abstractmethod
    def area(self):
        pass

class Cuadrado(Figura):
    def __init__(self, lado):
        self._lado = lado
    def area(self):
        return self._lado ** 2

class Rectangulo(Figura):
    def __init__(self, base, altura):
        self._base = base
        self._altura = altura
    def area(self):
        return self._base * self._altura

total = 0
for f in [Cuadrado(3), Rectangulo(2, 5)]:
    total += f.area()
print(total)`,
      '19',
      l('9 (cuadrado de 3) + 10 (rectángulo 2 × 5) = **19**. Es **polimorfismo**: el ciclo siempre llama `f.area()` y cada clase responde con su propia fórmula.', '9 (square of 3) + 10 (2 × 5 rectangle) = **19**. That is **polymorphism**: the loop always calls `f.area()` and each class answers with its own formula.'),
      l('El ciclo no sabe qué figura tiene: solo sabe que toda `Figura` tiene `area()`. Fíjate qué clase es cada objeto de la lista y qué devuelve su `area()`.', 'The loop does not know which shape it has: it only knows every `Figura` has `area()`. Check which class each object in the list is and what its `area()` returns.')),
    20: C('oo-cp-compose', 'medium',
      l('Un `Auto` **tiene un** `Motor` (composición). ¿Qué línea falta para que imprima `Auto: rrrum`?', 'A `Auto` (car) **has a** `Motor` (engine): composition. Which line is missing so it prints `Auto: rrrum`?'),
      `class Motor:
    def encender(self):
        return "rrrum"

class Auto:
    def __init__(self, motor):
        ____
    def arrancar(self):
        return "Auto: " + self.motor.encender()

print(Auto(Motor()).arrancar())`,
      ['motor = self.motor', 'self.motor = motor', 'self.motor = motor()', 'return motor'],
      1,
      l('El auto **guarda el motor como atributo** (`self.motor = motor`) y luego le **delega** el trabajo: `self.motor.encender()`. Eso es composición. `motor()` intentaría llamar al objeto como si fuera función, y `__init__` no debe devolver nada.', 'The car **stores the engine as an attribute** (`self.motor = motor`) and then **delegates** the work to it: `self.motor.encender()`. That is composition. `motor()` would try to call the object like a function, and `__init__` must not return anything.'),
      l('`arrancar` usa `self.motor`, así que alguien tuvo que crear ese atributo al construir el auto.', '`arrancar` uses `self.motor`, so something had to create that attribute when the car was built.')),
  },

  /* ---------------- SOLID ---------------- */
  solid: {
    8: R('sd-cp-letters', 'basic',
      l('Di en una frase qué pide cada letra de **SOLID**.', 'Say in one sentence what each letter of **SOLID** asks for.'),
      l('**S**: una sola razón para cambiar. **O**: extender sin modificar lo que ya funciona. **L**: una subclase debe poder usarse donde se espera la padre. **I**: varias interfaces pequeñas mejor que una enorme. **D**: depender de abstracciones, no de clases concretas.', '**S**: one reason to change. **O**: extend without modifying working code. **L**: a subclass must work wherever the parent is expected. **I**: several small interfaces beat one huge one. **D**: depend on abstractions, not concrete classes.')),
    3: P('sd-cp-ocp', 'basic',
      l('Se agregó `Efectivo` como nuevo método de pago. ¿Qué imprime?', '`Efectivo` (cash) was added as a new payment method. What does it print?'),
      `class MetodoPago:
    def pagar(self, monto):
        raise NotImplementedError

class Tarjeta(MetodoPago):
    def pagar(self, monto):
        return f"Cobrando {monto} a tarjeta"

class Efectivo(MetodoPago):
    def pagar(self, monto):
        return f"Recibiendo {monto} en efectivo"

def procesar(metodo, monto):
    print(metodo.pagar(monto))

procesar(Efectivo(), 50)`,
      'Recibiendo 50 en efectivo',
      l('`procesar` llama al `pagar` de `Efectivo`. Lo importante: para agregar el nuevo método **no hubo que tocar `procesar`**, solo crear una clase. Eso es el principio **abierto/cerrado**.', '`procesar` calls the `pagar` of `Efectivo`. The key point: adding the new method **did not require touching `procesar`**, only creating a class. That is the **open/closed** principle.'),
      l('`procesar` no pregunta qué tipo de pago es: solo llama `metodo.pagar(monto)`. Busca qué clase se le pasa.', '`procesar` does not ask which payment type it is: it just calls `metodo.pagar(monto)`. Look at which class is passed in.')),
    6: C('sd-cp-di', 'medium',
      l('En una prueba quieres revisar qué guardó el servicio. ¿Qué línea falta para que imprima `[\'pedido-1\']`?', 'In a test you want to check what the service saved. Which line is missing so it prints `[\'pedido-1\']`?'),
      `class RepoFalso:
    def __init__(self):
        self.guardados = []
    def guardar(self, p):
        self.guardados.append(p)

class ServicioPedidos:
    def __init__(self, repositorio):
        self.repo = repositorio
    def crear(self, pedido):
        self.repo.guardar(pedido)

repo = RepoFalso()
____
servicio.crear("pedido-1")
print(repo.guardados)`,
      ['servicio = ServicioPedidos(RepoFalso())', 'servicio = ServicioPedidos(repo)', 'servicio = ServicioPedidos()', 'servicio = ServicioPedidos(RepoFalso)'],
      1,
      l('Hay que **inyectar** el mismo `repo` que luego revisas. Con `RepoFalso()` el servicio guardaría en *otro* repositorio y `repo.guardados` seguiría vacío; sin argumento falta la dependencia, y `RepoFalso` sin paréntesis es la clase, no un objeto.', 'You must **inject** the same `repo` you check afterwards. With `RepoFalso()` the service would save into *another* repository and `repo.guardados` would stay empty; with no argument the dependency is missing, and `RepoFalso` without parentheses is the class, not an object.'),
      l('El `print` revisa la variable `repo`. ¿Qué repositorio debe recibir el servicio para que lo que guarde aparezca ahí?', 'The `print` checks the `repo` variable. Which repository must the service receive so what it saves shows up there?')),
  },

  /* ---------------- Patrones de diseño ---------------- */
  'design-patterns': {
    11: R('pt-cp-which', 'basic',
      l('¿Qué patrón usarías para: (a) avisar a varios módulos cuando se crea un pedido, (b) usar una librería externa con la interfaz que espera tu código, (c) cambiar el cálculo del envío mientras el programa corre?', 'Which pattern would you use to: (a) notify several modules when an order is created, (b) use an external library through the interface your code expects, (c) switch the shipping calculation while the program runs?'),
      l('(a) **Observer**, (b) **Adapter**, (c) **Strategy**.', '(a) **Observer**, (b) **Adapter**, (c) **Strategy**.')),
    4: P('pt-cp-observer', 'basic',
      l('¿Qué imprime?', 'What does it print?'),
      `${EVENTO}
avisos = []
pedido_creado = Evento()
pedido_creado.suscribir(lambda p: avisos.append("correo " + p))
pedido_creado.suscribir(lambda p: avisos.append("inventario " + p))
pedido_creado.emitir("A1")
pedido_creado.emitir("B2")
print(len(avisos))`,
      '4',
      l('Hay 2 suscriptores y se emiten 2 eventos: cada `emitir` llama a **todos** los suscriptores → 2 × 2 = **4** avisos.', 'There are 2 subscribers and 2 events are emitted: each `emitir` calls **all** subscribers → 2 × 2 = **4** notices.'),
      l('`suscribir` guarda cada función en una lista. `emitir` recorre esa lista y llama a cada función con el dato.', '`suscribir` stores each function in a list. `emitir` walks that list and calls each function with the data.')),
    2: C('pt-cp-strategy', 'medium',
      l('Cada estrategia de envío es una función. ¿Qué línea cambia la estrategia a `express` mientras el programa corre?', 'Each shipping strategy is a function. Which line switches the strategy to `express` while the program runs?'),
      `def normal(kg):
    return 50 + 10 * kg

def express(kg):
    return 120 + 15 * kg

class Envio:
    def __init__(self, estrategia):
        self.estrategia = estrategia
    def costo(self, kg):
        return self.estrategia(kg)

envio = Envio(normal)
a = envio.costo(2)
____
b = envio.costo(2)
print(a, b)`,
      ['envio.estrategia = express(2)', 'Envio.estrategia = express', 'envio.estrategia = express', 'envio = Envio(express(2))'],
      2,
      l('Se reemplaza la función guardada en el objeto: `envio.estrategia = express` (sin paréntesis, porque pasas la función, no su resultado). Imprime `70 150`. Eso es **Strategy**: algoritmos intercambiables detrás de la misma llamada `costo(kg)`.', 'You replace the function stored in the object: `envio.estrategia = express` (no parentheses, because you pass the function, not its result). It prints `70 150`. That is **Strategy**: interchangeable algorithms behind the same `costo(kg)` call.'),
      l('Como en Observer, aquí una función se guarda y se llama después. `express(2)` ya no es una función: es el número que devuelve.', 'Like in Observer, a function is stored here and called later. `express(2)` is no longer a function: it is the number it returns.')),
  },

  /* ---------------- Código limpio ---------------- */
  'clean-code': {
    6: R('cc-cp-yagni', 'basic',
      l('Un compañero agrega un sistema de plugins "por si algún día lo necesitamos", aunque hoy nadie lo usa. ¿Qué principio rompe?', 'A teammate adds a plugin system "in case we need it someday", even though nobody uses it today. Which principle does it break?'),
      l('**YAGNI** (*You Aren\'t Gonna Need It*): no construyas lo que aún no necesitas. Además va contra **KISS**: agrega complejidad sin beneficio actual.', '**YAGNI** (*You Aren\'t Gonna Need It*): do not build what you do not need yet. It also goes against **KISS**: it adds complexity with no current benefit.')),
    3: P('cc-cp-early', 'basic',
      l('La versión con retornos tempranos de la lección. ¿Qué imprime?', 'The early-return version from the lesson. What does it print?'),
      `class Usuario:
    def __init__(self, activo, saldo):
        self.activo = activo
        self.saldo = saldo

def puede_comprar(usuario):
    if not usuario or not usuario.activo:
        return False
    return usuario.saldo > 0

print(puede_comprar(Usuario(True, 0)), puede_comprar(None), puede_comprar(Usuario(True, 5)))`,
      'False False True',
      l('Activo pero con saldo 0 → `False`. `None` → sale en el primer `if` → `False`. Activo con saldo 5 → `True`. Los casos inválidos salen primero y el caso principal queda al final, sin `if`s anidados.', 'Active but balance 0 → `False`. `None` → exits at the first `if` → `False`. Active with balance 5 → `True`. Invalid cases leave first and the main case stays at the end, with no nested `if`s.'),
      l('El primer `if` atrapa al usuario inexistente o inactivo. Si pasa, la respuesta es simplemente `saldo > 0`.', 'The first `if` catches a missing or inactive user. If it gets past that, the answer is simply `saldo > 0`.')),
    5: C('cc-cp-dry', 'medium',
      l('Para no repetir el cálculo del IVA (DRY) se extrajo `con_iva`. ¿Qué línea falta para sumar el carrito? Debe imprimir `266`.', 'To avoid repeating the tax calculation (DRY), `con_iva` was extracted. Which line is missing to add up the cart? It must print `266`.'),
      `def con_iva(precio):
    return precio * 116 // 100

carrito = [100, 50]
envio = 80
total = 0
for p in carrito:
    ____
total += con_iva(envio)
print(total)`,
      ['total = con_iva(p)', 'total += con_iva(p)', 'total += con_iva(total)', 'con_iva(p)'],
      1,
      l('116 + 58 del carrito y 92 del envío = **266**. Cada precio pasa por la **misma** función, así que si el IVA cambia lo corriges en un solo lugar. `total = …` sobrescribiría el acumulado y `con_iva(p)` solo calcularía sin guardar.', '116 + 58 from the cart and 92 for shipping = **266**. Every price goes through the **same** function, so if the tax changes you fix it in one place. `total = …` would overwrite the running sum and `con_iva(p)` would compute without saving.'),
      l('Dentro del ciclo hay que **acumular** el precio con IVA de cada producto.', 'Inside the loop you must **accumulate** each product\'s price with tax.')),
  },

  /* ---------------- Testing ---------------- */
  testing: {
    8: O('ts-cp-tdd', 'basic',
      l('Ordena el ciclo de **TDD**.', 'Order the **TDD** cycle.'),
      [
        l('🔴 Escribe una prueba que falle.', '🔴 Write a failing test.'),
        l('🟢 Escribe el código mínimo para que pase.', '🟢 Write the minimum code to make it pass.'),
        l('🔵 Refactoriza sin cambiar el comportamiento.', '🔵 Refactor without changing the behavior.'),
        l('Repite con la siguiente prueba.', 'Repeat with the next test.'),
      ],
      l('Rojo → verde → refactor. La prueba va **primero**: así confirmas que de verdad detecta el error antes de que exista el código.', 'Red → green → refactor. The test comes **first**: that way you confirm it really catches the error before the code exists.')),
    3: P('ts-cp-palindromo', 'basic',
      l('Los casos que revisarían las pruebas de la lección, y uno más. ¿Qué imprime?', 'The cases the lesson\'s tests would check, plus one more. What does it print?'),
      `def es_palindromo(s):
    limpio = ""
    for c in s:
        if c.isalnum():
            limpio += c.lower()
    return limpio == limpio[::-1]

print(es_palindromo("Anita lava la tina"), es_palindromo(""), es_palindromo("ab"))`,
      'True True False',
      l('"anitalavalatina" se lee igual al revés → `True`. La cadena vacía también (es un **caso borde** que conviene probar) → `True`. "ab" al revés es "ba" → `False`.', '"anitalavalatina" reads the same backwards → `True`. So does the empty string (an **edge case** worth testing) → `True`. "ab" reversed is "ba" → `False`.'),
      l('Primero se queda solo con letras y números en minúscula; luego compara con `limpio[::-1]`, que es el texto al revés.', 'First it keeps only lowercase letters and digits; then it compares with `limpio[::-1]`, the text reversed.')),
    4: R('ts-cp-edges', 'basic',
      l('Terminaste `maximo(lista)` en una entrevista. ¿Qué casos de prueba propones?', 'You finished `maximo(lista)` (max of a list) in an interview. Which test cases do you propose?'),
      l('Lista **vacía**, **un** elemento, **duplicados**, **negativos** (y cero), valores **muy grandes** y entradas inválidas. Además del caso normal.', '**Empty** list, **one** element, **duplicates**, **negatives** (and zero), **very large** values and invalid input. Plus the normal case.')),
  },

  /* ---------------- Manejo de errores ---------------- */
  'error-handling': {
    6: R('eh-cp-edges', 'basic',
      l('¿Qué significa "validar en los bordes" y "fallar rápido"?', 'What do "validate at the edges" and "fail fast" mean?'),
      l('**Validar en los bordes**: revisar los datos donde entran al sistema (usuario, APIs externas) y después confiar en ellos. **Fallar rápido**: detectar el error lo antes posible con un mensaje claro, en vez de seguir con datos inválidos.', '**Validate at the edges**: check data where it enters the system (users, external APIs) and trust it afterwards. **Fail fast**: detect the error as early as possible with a clear message instead of continuing with invalid data.')),
    2: P('eh-cp-specific', 'basic',
      l('`int("hola")` lanza `ValueError`. ¿Qué imprime?', '`int("hola")` raises `ValueError`. What does it print?'),
      `def convertir(texto):
    try:
        return int(texto)
    except ValueError:
        return 0

print(convertir("42") + convertir("hola"))`,
      '42',
      l('"42" se convierte a 42. "hola" lanza `ValueError`, que se captura y devuelve 0. 42 + 0 = **42**. Se captura **solo** el error que sabes manejar.', '"42" becomes 42. "hola" raises `ValueError`, which is caught and returns 0. 42 + 0 = **42**. Only the error you know how to handle is caught.'),
      l('Si dentro del `try` algo lanza la excepción que nombra el `except`, se salta a ese bloque.', 'If something inside the `try` raises the exception named in the `except`, it jumps to that block.')),
    10: R('eh-cp-leak', 'basic',
      l('Tu API falla por un error de la base de datos. ¿Qué le respondes al usuario?', 'Your API fails because of a database error. What do you send back to the user?'),
      l('Un **500** con un mensaje genérico ("ocurrió un error"). **Sin** stack trace ni mensajes de la BD, porque revelan información útil para un atacante. Los detalles van al log.', 'A **500** with a generic message ("an error occurred"). **No** stack trace or DB messages, because they reveal information useful to an attacker. The details go to the log.')),
  },
};

export const PRACTICE: Record<string, Exercise[]> = {
  /* ---------------- Los 4 pilares de la OOP ---------------- */
  'oop-pillars': [
    P('oo-p-override', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `class Animal:
    def sonido(self):
        return "..."

class Perro(Animal):
    def sonido(self):
        return "guau"

class Gato(Animal):
    def nombre(self):
        return "gato"

print(Perro().sonido(), Gato().sonido())`,
      'guau ...',
      l('`Perro` **sobrescribe** `sonido` y devuelve "guau". `Gato` no lo redefine, así que **hereda** el de `Animal`: "...".', '`Perro` **overrides** `sonido` and returns "guau". `Gato` does not redefine it, so it **inherits** the one from `Animal`: "...".'),
      l('Cuando una clase no tiene un método, Python lo busca en su clase padre.', 'When a class does not have a method, Python looks for it in its parent class.')),
    R('oo-p-isa', 'basic',
      l('¿Herencia o composición? (a) `Gerente` y `Empleado`. (b) `Pedido` y sus `Producto`s.', 'Inheritance or composition? (a) `Manager` and `Employee`. (b) `Order` and its `Product`s.'),
      l('(a) **Herencia**: un gerente *es un* empleado. (b) **Composición**: un pedido *tiene* productos (los guarda como atributo).', '(a) **Inheritance**: a manager *is an* employee. (b) **Composition**: an order *has* products (it stores them as an attribute).')),
    R('oo-p-overload', 'basic',
      l('¿Qué es sobrecarga y qué es sobrescritura? ¿Cuál tiene Python?', 'What is overloading and what is overriding? Which one does Python have?'),
      l('**Sobrecarga**: mismo nombre de método con distintos parámetros (Java, C++). **Sobrescritura**: una subclase redefine un método del padre. Python tiene **sobrescritura**; la sobrecarga se imita con parámetros opcionales.', '**Overloading**: same method name with different parameters (Java, C++). **Overriding**: a subclass redefines a parent method. Python has **overriding**; overloading is emulated with optional parameters.')),
    P('oo-p-encap', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `class Cuenta:
    def __init__(self):
        self._saldo = 0
    def depositar(self, monto):
        if monto > 0:
            self._saldo += monto
    def saldo(self):
        return self._saldo

c = Cuenta()
c.depositar(100)
c.depositar(-50)
print(c.saldo())`,
      '100',
      l('El depósito de −50 se rechaza dentro de `depositar`: **100**. Es **encapsulamiento**: el saldo solo cambia a través de un método que protege las reglas (el `_` indica que no se toca desde fuera).', 'The −50 deposit is rejected inside `depositar`: **100**. That is **encapsulation**: the balance only changes through a method that protects the rules (the `_` signals it is not touched from outside).'),
      l('`depositar` solo suma si el monto es positivo.', '`depositar` only adds when the amount is positive.')),
    C('oo-p-poly-loop', 'medium',
      l('¿Qué línea falta para que imprima `guau` y luego `miau`?', 'Which line is missing so it prints `guau` and then `miau`?'),
      `class Animal:
    def hablar(self):
        return "..."

class Perro(Animal):
    def hablar(self):
        return "guau"

class Gato(Animal):
    def hablar(self):
        return "miau"

def presentar(animales):
    for a in animales:
        ____

presentar([Perro(), Gato()])`,
      ['print(hablar(a))', 'print(a.hablar)', 'print(a.hablar())', 'print(Animal.hablar())'],
      2,
      l('`a.hablar()` le manda el mismo mensaje a cada objeto y cada uno responde a su manera (**polimorfismo**). Sin paréntesis imprimirías el método en sí, `hablar(a)` no existe como función suelta y `Animal.hablar()` no tiene objeto.', '`a.hablar()` sends the same message to each object and each one answers its own way (**polymorphism**). Without parentheses you would print the method itself, `hablar(a)` does not exist as a standalone function, and `Animal.hablar()` has no object.'),
      l('`presentar` no sabe si recibe un perro o un gato: solo llama al método.', '`presentar` does not know whether it gets a dog or a cat: it just calls the method.')),
    P('oo-p-swap', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `class MotorGasolina:
    def tipo(self):
        return "gasolina"

class MotorElectrico:
    def tipo(self):
        return "eléctrico"

class Auto:
    def __init__(self, motor):
        self.motor = motor
    def describir(self):
        return "Auto " + self.motor.tipo()

auto = Auto(MotorGasolina())
auto.motor = MotorElectrico()
print(auto.describir())`,
      'Auto eléctrico',
      l('El auto empieza con motor de gasolina, pero se le cambia la pieza antes de describirlo: **Auto eléctrico**. Con **composición** puedes cambiar piezas incluso mientras el programa corre; con herencia, "auto de gasolina" quedaría fijo en la clase.', 'The car starts with a gasoline engine, but the part is swapped before describing it: **Auto eléctrico**. With **composition** you can swap parts even while the program runs; with inheritance, "gasoline car" would be fixed in the class.'),
      l('`describir` usa el motor que el auto tenga **en ese momento**.', '`describir` uses whatever engine the car has **at that moment**.')),
    R('oo-p-why-composition', 'interview',
      l('¿Por qué se suele preferir **composición sobre herencia**?', 'Why is **composition over inheritance** usually preferred?'),
      l('La herencia **acopla** fuertemente a la hija con la padre (un cambio en la padre puede romper a las hijas) y crea jerarquías rígidas. Con composición el objeto delega en piezas que guarda como atributos y que puedes **cambiar**, incluso en tiempo de ejecución.', 'Inheritance **tightly couples** child and parent (a change in the parent can break the children) and creates rigid hierarchies. With composition the object delegates to parts it stores as attributes, which you can **swap**, even at runtime.')),
    R('oo-p-interface-abstract', 'interview',
      l('¿Qué diferencia hay entre una **interfaz** y una **clase abstracta**?', 'What is the difference between an **interface** and an **abstract class**?'),
      l('La **interfaz** es solo un contrato: qué métodos debe tener una clase, sin implementación ni estado; en Java una clase puede implementar varias. La **clase abstracta** no se puede instanciar pero puede tener **estado e implementación parcial**; en Java solo heredas de una. En Python ambas se expresan con `ABC` y `@abstractmethod`.', 'An **interface** is only a contract: which methods a class must have, with no implementation or state; in Java a class can implement several. An **abstract class** cannot be instantiated but can have **state and partial implementation**; in Java you inherit from only one. In Python both are expressed with `ABC` and `@abstractmethod`.')),
  ],

  /* ---------------- SOLID ---------------- */
  solid: [
    R('sd-p-srp', 'basic',
      l('La clase `Usuario` valida los datos, los guarda en la base de datos y manda el correo de bienvenida. ¿Qué principio viola y cómo lo arreglas?', 'The `User` class validates data, saves it to the database and sends the welcome email. Which principle does it break and how do you fix it?'),
      l('**Responsabilidad única (S)**: tiene tres razones para cambiar. Sepáralo en clases con un solo trabajo cada una, por ejemplo un validador, un repositorio y un notificador.', '**Single responsibility (S)**: it has three reasons to change. Split it into classes with one job each, e.g. a validator, a repository and a notifier.')),
    P('sd-p-dip', 'basic', l('`Saludo` recibe por dónde escribir. ¿Qué imprime el último `print`?', '`Saludo` receives where to write. What does the last `print` print?'),
      `class Memoria:
    def __init__(self):
        self.lineas = []
    def escribir(self, texto):
        self.lineas.append(texto)

class Saludo:
    def __init__(self, salida):
        self.salida = salida
    def saludar(self, nombre):
        self.salida.escribir("Hola " + nombre)

m = Memoria()
s = Saludo(m)
s.saludar("Ana")
s.saludar("Luis")
print(m.lineas)`,
      "['Hola Ana', 'Hola Luis']",
      l('Los dos saludos se guardan en la `Memoria` que se inyectó. `Saludo` no sabe si escribe en memoria, en pantalla o en un archivo: depende de una **abstracción** (algo con `escribir`). Eso es la **D** de SOLID.', 'Both greetings are saved in the injected `Memoria`. `Saludo` does not know whether it writes to memory, the screen or a file: it depends on an **abstraction** (anything with `escribir`). That is SOLID\'s **D**.'),
      l('`saludar` delega en `self.salida.escribir(...)`, y `self.salida` es el objeto `m`.', '`saludar` delegates to `self.salida.escribir(...)`, and `self.salida` is the object `m`.')),
    R('sd-p-lsp', 'basic',
      l('¿Qué dice el principio de **sustitución de Liskov**?', 'What does the **Liskov substitution** principle say?'),
      l('Que una subclase debe poder usarse **en cualquier lugar donde se espera su clase padre** sin romper nada ni cambiar el comportamiento esperado.', 'That a subclass must be usable **anywhere its parent class is expected** without breaking anything or changing the expected behavior.')),
    C('sd-p-ocp', 'medium',
      l('`DescuentoFijo` debe restar 30 al precio. ¿Qué línea falta para que imprima `50.0 70`?', '`DescuentoFijo` must subtract 30 from the price. Which line is missing so it prints `50.0 70`?'),
      `class Descuento:
    def aplicar(self, precio):
        return precio

class DescuentoMitad(Descuento):
    def aplicar(self, precio):
        return precio / 2

class DescuentoFijo(Descuento):
    def aplicar(self, precio):
        ____

def cobrar(precio, descuento):
    return descuento.aplicar(precio)

print(cobrar(100, DescuentoMitad()), cobrar(100, DescuentoFijo()))`,
      ['precio - 30', 'return self - 30', 'return precio - 30', 'return Descuento.aplicar(precio) - 30'],
      2,
      l('`return precio - 30` → 70. Sin `return` el método devolvería `None`. Fíjate que el descuento nuevo se agregó **sin tocar `cobrar`**: abierto/cerrado.', '`return precio - 30` → 70. Without `return` the method would return `None`. Notice the new discount was added **without touching `cobrar`**: open/closed.'),
      l('Copia la forma de `DescuentoMitad`: recibe el precio y **devuelve** el precio nuevo.', 'Copy the shape of `DescuentoMitad`: it receives the price and **returns** the new price.')),
    O('sd-p-refactor', 'medium',
      l('Tienes `def pagar(tipo, monto)` con un `if/elif` por cada método de pago. Ordena los pasos para que cumpla **abierto/cerrado**.', 'You have `def pagar(tipo, monto)` with an `if/elif` per payment method. Order the steps to make it follow **open/closed**.'),
      [
        l('Crea una clase base `MetodoPago` con el método `pagar`.', 'Create a base class `MetodoPago` with the `pagar` method.'),
        l('Crea una subclase por cada tipo (`Tarjeta`, `PayPal`) con su propio `pagar`.', 'Create one subclass per type (`Tarjeta`, `PayPal`) with its own `pagar`.'),
        l('Haz que `procesar` reciba un `MetodoPago` y solo llame a `metodo.pagar(monto)`.', 'Make `procesar` receive a `MetodoPago` and just call `metodo.pagar(monto)`.'),
        l('Para un método nuevo, agrega otra subclase sin tocar `procesar`.', 'For a new method, add another subclass without touching `procesar`.'),
      ],
      l('Primero la abstracción, luego las implementaciones, después el código que depende solo de la abstracción. Al final, extender ya no obliga a modificar.', 'First the abstraction, then the implementations, then the code that depends only on the abstraction. In the end, extending no longer requires modifying.')),
    P('sd-p-lsp-break', 'interview',
      l('`agrandar` espera que `set_base` cambie **solo la base**. ¿Qué imprime?', '`agrandar` expects `set_base` to change **only the base**. What does it print?'),
      `class Rectangulo:
    def __init__(self, base, altura):
        self.base = base
        self.altura = altura
    def set_base(self, b):
        self.base = b
    def area(self):
        return self.base * self.altura

class Cuadrado(Rectangulo):
    def __init__(self, lado):
        self.base = lado
        self.altura = lado
    def set_base(self, b):     # un cuadrado debe seguir siendo cuadrado
        self.base = b
        self.altura = b

def agrandar(r):
    r.set_base(10)
    return r.area()

print(agrandar(Rectangulo(3, 3)), agrandar(Cuadrado(3)))`,
      '30 100',
      l('Con un rectángulo de 3 × 3, cambiar la base a 10 da 10 × 3 = **30**. Con un cuadrado de lado 3, que también mide 3 × 3, da **100**, porque su `set_base` cambia también la altura. La subclase no se comporta como se espera de la padre: **viola Liskov**. Por eso `Cuadrado` heredando de `Rectangulo` es el ejemplo clásico.', 'With a 3 × 3 rectangle, setting the base to 10 gives 10 × 3 = **30**. With a square of side 3, also 3 × 3, it gives **100**, because its `set_base` changes the height too. The subclass does not behave as expected of the parent: it **violates Liskov**. That is why `Cuadrado` inheriting from `Rectangulo` is the classic example.'),
      l('Las dos figuras empiezan midiendo 3 × 3. Mira qué hace el `set_base` de cada clase.', 'Both shapes start at 3 × 3. Look at what each class\'s `set_base` does.')),
    R('sd-p-di-tests', 'interview',
      l('¿Por qué la **inyección de dependencias** facilita las pruebas?', 'Why does **dependency injection** make testing easier?'),
      l('Porque la clase no crea sus dependencias: las recibe. En la prueba le pasas una versión **falsa** (un repositorio en memoria en vez de la base de datos real) y la prueba queda rápida y sin efectos externos.', 'Because the class does not create its dependencies: it receives them. In the test you pass a **fake** version (an in-memory repository instead of the real database), so the test is fast and has no external side effects.')),
    R('sd-p-overeng', 'interview',
      l('¿Siempre conviene aplicar SOLID al pie de la letra?', 'Should you always apply SOLID to the letter?'),
      l('No. En código pequeño, demasiadas clases y abstracciones también es un problema (**sobreingeniería**). Se aplica cuando el código realmente va a crecer o cambiar.', 'No. In small code, too many classes and abstractions is a problem too (**over-engineering**). Apply it when the code is really going to grow or change.')),
  ],

  /* ---------------- Patrones de diseño ---------------- */
  'design-patterns': [
    R('pt-p-types', 'basic',
      l('Clasifica Singleton, Factory, Strategy, Observer y Adapter: ¿creacional, de comportamiento o estructural?', 'Classify Singleton, Factory, Strategy, Observer and Adapter: creational, behavioral or structural?'),
      l('**Creacionales**: Singleton y Factory. **De comportamiento**: Strategy y Observer. **Estructural**: Adapter.', '**Creational**: Singleton and Factory. **Behavioral**: Strategy and Observer. **Structural**: Adapter.')),
    P('pt-p-factory', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `class Correo:
    def enviar(self, msg):
        return "correo: " + msg

class SMS:
    def enviar(self, msg):
        return "sms: " + msg

def crear_notificador(tipo):
    if tipo == "sms":
        return SMS()
    return Correo()

n = crear_notificador("sms")
print(n.enviar("hola"))`,
      'sms: hola',
      l('`crear_notificador("sms")` devuelve un `SMS`, así que imprime **sms: hola**. Es una **Factory**: quien la usa pide un tipo y recibe un objeto, sin mencionar la clase concreta.', '`crear_notificador("sms")` returns an `SMS`, so it prints **sms: hola**. It is a **Factory**: the caller asks for a type and gets an object without naming the concrete class.'),
      l('Sigue qué objeto devuelve la función para "sms" y luego qué hace su `enviar`.', 'Follow which object the function returns for "sms" and then what its `enviar` does.')),
    O('pt-p-observer-steps', 'basic',
      l('Ordena cómo funciona **Observer**.', 'Order how **Observer** works.'),
      [
        l('El publicador empieza con una lista de suscriptores vacía.', 'The publisher starts with an empty list of subscribers.'),
        l('Cada interesado se suscribe pasando una función.', 'Each interested party subscribes by passing a function.'),
        l('Algo cambia y el publicador llama a `emitir(dato)`.', 'Something changes and the publisher calls `emitir(dato)`.'),
        l('`emitir` recorre la lista y llama a cada función con el dato.', '`emitir` walks the list and calls each function with the data.'),
      ],
      l('El publicador no sabe qué hace cada suscriptor: solo los avisa. Así puedes agregar reacciones nuevas sin tocarlo.', 'The publisher does not know what each subscriber does: it just notifies them. So you can add new reactions without touching it.')),
    C('pt-p-adapter', 'medium',
      l('La librería externa cobra en **centavos** con `hacer_cargo`, pero tu app llama a `pagar(pesos)`. ¿Qué línea completa el adaptador para que imprima `cargo de 2500 centavos`?', 'The external library charges in **cents** with `hacer_cargo`, but your app calls `pagar(pesos)`. Which line completes the adapter so it prints `cargo de 2500 centavos`?'),
      `class PagosViejos:              # librería externa: no la puedes cambiar
    def hacer_cargo(self, centavos):
        return f"cargo de {centavos} centavos"

class AdaptadorPagos:           # lo que tu app espera: pagar(pesos)
    def __init__(self, externo):
        self.externo = externo
    def pagar(self, pesos):
        ____

pago = AdaptadorPagos(PagosViejos())
print(pago.pagar(25))`,
      ['return self.externo.pagar(pesos)', 'return self.externo.hacer_cargo(pesos)', 'return PagosViejos.hacer_cargo(pesos * 100)', 'return self.externo.hacer_cargo(pesos * 100)'],
      3,
      l('El **Adapter** traduce tu interfaz a la de la librería: convierte pesos a centavos y llama a `hacer_cargo`. La librería no tiene `pagar`, y sin `* 100` cobraría 25 centavos.', 'The **Adapter** translates your interface into the library\'s: it converts pesos to cents and calls `hacer_cargo`. The library has no `pagar`, and without `* 100` it would charge 25 cents.'),
      l('El adaptador guarda la librería (composición) y le pasa la llamada ya traducida.', 'The adapter stores the library (composition) and forwards the call already translated.')),
    P('pt-p-late-sub', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `${EVENTO}
log = []
e = Evento()
e.suscribir(lambda d: log.append(d * 2))
e.emitir(1)
e.suscribir(lambda d: log.append(d * 10))
e.emitir(2)
print(log)`,
      '[2, 4, 20]',
      l('El primer `emitir(1)` solo tiene un suscriptor → 2. Luego se suscribe el segundo, y `emitir(2)` llama a ambos → 4 y 20. Un suscriptor nuevo **no recibe** los eventos que ya pasaron.', 'The first `emitir(1)` has only one subscriber → 2. Then the second subscribes, and `emitir(2)` calls both → 4 and 20. A new subscriber **does not receive** past events.'),
      l('Revisa cuántos suscriptores hay en la lista en el momento de cada `emitir`.', 'Check how many subscribers are in the list at the moment of each `emitir`.')),
    R('pt-p-singleton', 'medium',
      l('Tu `Logger` es un Singleton y las pruebas empiezan a afectarse entre sí. ¿Por qué pasa?', 'Your `Logger` is a Singleton and your tests start affecting each other. Why?'),
      l('Porque la única instancia es **estado global compartido**: lo que una prueba deja ahí lo ve la siguiente. Además no puedes sustituirlo fácilmente por uno falso. Por eso Singleton dificulta el testing.', 'Because the single instance is **shared global state**: what one test leaves there, the next one sees. You also cannot easily swap it for a fake. That is why Singleton hurts testing.')),
    R('pt-p-ifs', 'interview',
      l('Tienes `if tipo == "tarjeta": … elif tipo == "paypal": …` repetido en cinco lugares del código. ¿Qué patrón aplicas y qué ganas?', 'You have `if tipo == "tarjeta": … elif tipo == "paypal": …` repeated in five places. Which pattern do you apply and what do you gain?'),
      l('**Strategy**: una clase (o función) por método de pago con la misma interfaz, y el código solo llama `metodo.pagar(monto)`. Si hace falta elegir la clase según un texto, una **Factory** lo hace en un solo lugar. Ganas que agregar un método nuevo no obligue a editar cinco `if`s (abierto/cerrado).', '**Strategy**: one class (or function) per payment method with the same interface, and the code just calls `metodo.pagar(monto)`. If you need to pick the class from a string, a **Factory** does it in one place. You gain that adding a new method does not force editing five `if`s (open/closed).')),
    R('pt-p-story', 'interview',
      l('Te preguntan: "¿Qué patrón de diseño has usado en un proyecto?". Arma una respuesta corta.', 'You are asked: "Which design pattern have you used in a project?". Put together a short answer.'),
      l('Cuenta un caso concreto: el problema, el patrón y el resultado. Por ejemplo: "Usé **Strategy** para soportar varios métodos de pago sin llenar el código de if/else; agregar uno nuevo era crear una clase". Ten la historia lista antes de la entrevista.', 'Tell a concrete case: the problem, the pattern and the result. For example: "I used **Strategy** to support several payment methods without filling the code with if/else; adding one meant creating a class". Have the story ready before the interview.')),
  ],

  /* ---------------- Código limpio ---------------- */
  'clean-code': [
    P('cc-p-guard', 'basic', l('¿Qué imprime?', 'What does it print?'),
      `def tarifa(edad):
    if edad < 0:
        return "inválida"
    if edad < 12:
        return "niño"
    if edad >= 65:
        return "mayor"
    return "normal"

print(tarifa(70), tarifa(12), tarifa(-1))`,
      'mayor normal inválida',
      l('70 → "mayor". 12 no es menor que 12 ni mayor o igual a 65 → "normal". −1 sale en el primer `if` → "inválida". Cada `return` temprano termina la función: no hacen falta `if`s anidados.', '70 → "mayor". 12 is not less than 12 nor at least 65 → "normal". −1 exits at the first `if` → "inválida". Each early `return` ends the function: no nested `if`s needed.'),
      l('Revisa los `if` en orden: el primero que se cumpla devuelve el resultado y ya no se revisan los demás.', 'Check the `if`s in order: the first one that holds returns the result and the rest are not checked.')),
    R('cc-p-comments', 'basic',
      l('¿Qué debe explicar un comentario: el **qué** o el **porqué**?', 'What should a comment explain: the **what** or the **why**?'),
      l('El **porqué**. El qué ya lo dice el código (si no, mejora los nombres). Un buen comentario explica una decisión: "usamos 3 reintentos porque la API falla a veces al arrancar".', 'The **why**. The code already says what (if not, improve the names). A good comment explains a decision: "we use 3 retries because the API sometimes fails at startup".')),
    O('cc-p-refactor', 'basic',
      l('Ordena los pasos para quitar `if`s anidados con **retornos tempranos**.', 'Order the steps to remove nested `if`s with **early returns**.'),
      [
        l('Identifica los casos que deben terminar pronto (datos inválidos o incompletos).', 'Identify the cases that should end early (invalid or incomplete data).'),
        l('Ponlos al inicio de la función, cada uno con su `return`.', 'Put them at the start of the function, each with its own `return`.'),
        l('Deja el caso principal al final, sin anidar.', 'Leave the main case at the end, without nesting.'),
        l('Comprueba con los mismos casos que el resultado no cambió.', 'Check with the same cases that the result did not change.'),
      ],
      l('Así queda como `puede_comprar` de la lección: primero se descartan los casos inválidos y el camino feliz se lee de corrido.', 'That is how `puede_comprar` from the lesson ends up: invalid cases are discarded first and the happy path reads straight through.')),
    P('cc-p-dry-bug', 'medium',
      l('La lógica del total estaba copiada en dos funciones y solo se corrigió una. ¿Qué imprime?', 'The total logic was copied into two functions and only one was fixed. What does it print?'),
      `def total_tienda(precios):
    total = 0
    for p in precios:
        if p > 0:          # corregido: ignorar precios inválidos
            total += p
    return total

def total_app(precios):    # copia de la versión vieja
    total = 0
    for p in precios:
        total += p
    return total

precios = [100, -20, 50]
print(total_tienda(precios), total_app(precios))`,
      '150 130',
      l('La versión corregida ignora el −20 → 150; la copia vieja lo suma → 130. Con código duplicado, un arreglo en una copia **no llega** a la otra. Por eso **DRY**: una sola función usada en ambos lugares.', 'The fixed version ignores −20 → 150; the old copy adds it → 130. With duplicated code, a fix in one copy **does not reach** the other. That is why **DRY**: a single function used in both places.'),
      l('Compara las dos funciones línea por línea: solo una tiene el `if`.', 'Compare both functions line by line: only one has the `if`.')),
    C('cc-p-early', 'medium',
      l('¿Qué línea falta para que imprima `5.0 None`?', 'Which line is missing so it prints `5.0 None`?'),
      `def dividir(a, b):
    ____
        return None
    return a / b

print(dividir(10, 2), dividir(1, 0))`,
      ['if b:', 'if b == 0:', 'if a == 0:', 'if b != 0:'],
      1,
      l('El caso inválido (dividir entre 0) sale primero con un **retorno temprano**; el caso normal queda al final. Con las otras condiciones, `dividir(1, 0)` llegaría a `1 / 0` y fallaría.', 'The invalid case (dividing by 0) leaves first with an **early return**; the normal case stays at the end. With the other conditions, `dividir(1, 0)` would reach `1 / 0` and crash.'),
      l('¿Qué caso no se puede calcular? Ese es el que debe salir antes de llegar a `a / b`.', 'Which case cannot be computed? That is the one that must leave before reaching `a / b`.')),
    R('cc-p-kiss-yagni', 'medium',
      l('¿En qué se diferencian **KISS** y **YAGNI**?', 'How do **KISS** and **YAGNI** differ?'),
      l('**KISS**: para lo que sí necesitas, elige la solución **más simple** que funcione. **YAGNI**: **no construyas** lo que todavía no necesitas. Uno habla de cómo lo haces; el otro, de si lo haces.', '**KISS**: for what you do need, choose the **simplest** solution that works. **YAGNI**: **do not build** what you do not need yet. One is about how you build it; the other, about whether you build it.')),
    R('cc-p-interview-names', 'interview',
      l('En una entrevista ya tienes una solución que funciona, pero con nombres como `a`, `b` y `x`. ¿Vale la pena mejorarla?', 'In an interview you already have a working solution, but with names like `a`, `b` and `x`. Is it worth improving?'),
      l('Sí. Renombrar (`izq`, `der`, `mejor`) y extraer funciones auxiliares **suma puntos** aunque el algoritmo sea el mismo: muestra que escribes código que otros pueden mantener.', 'Yes. Renaming (`left`, `right`, `best`) and extracting helper functions **earns points** even if the algorithm is the same: it shows you write code others can maintain.')),
    R('cc-p-long-function', 'interview',
      l('En una revisión de código ves una función de 80 líneas que valida datos, calcula el total y guarda en la base de datos. ¿Qué sugieres?', 'In a code review you see an 80-line function that validates data, computes the total and saves to the database. What do you suggest?'),
      l('Dividirla en **funciones pequeñas que hagan una sola cosa** (`validar`, `calcular_total`, `guardar`) con nombres que revelen intención. Cada una se entiende y se prueba por separado.', 'Split it into **small functions that do one thing** (`validate`, `compute_total`, `save`) with intention-revealing names. Each one can be understood and tested on its own.')),
  ],

  /* ---------------- Testing ---------------- */
  testing: [
    O('ts-p-pyramid', 'basic',
      l('Ordena los tipos de prueba de los que deberías tener **más** a los que deberías tener **menos**.', 'Order the test types from the ones you should have **most** of to the ones you should have **fewest** of.'),
      [
        l('Unitarias', 'Unit'),
        l('De integración', 'Integration'),
        l('End-to-end (E2E)', 'End-to-end (E2E)'),
      ],
      l('Es la **pirámide de pruebas**: muchas unitarias (rápidas), menos de integración y pocas E2E (lentas y frágiles).', 'It is the **testing pyramid**: many unit tests (fast), fewer integration tests and few E2E tests (slow and brittle).')),
    R('ts-p-double', 'basic',
      l('Tu función consulta una API del clima. ¿Cómo la pruebas sin internet?', 'Your function calls a weather API. How do you test it without internet?'),
      l('Con un **doble de prueba** (mock, stub o fake) que reemplaza a la API y devuelve una respuesta fija. Así la prueba es rápida y **determinista**: siempre da lo mismo.', 'With a **test double** (mock, stub or fake) that replaces the API and returns a fixed response. The test is then fast and **deterministic**: it always gives the same result.')),
    C('ts-p-assert', 'basic',
      l('¿Qué línea va en el **Assert** para que la prueba pase e imprima `ok`?', 'Which line goes in the **Assert** step so the test passes and prints `ok`?'),
      `def aplicar_descuento(precio, porcentaje):
    return precio - precio * porcentaje // 100

def test_descuento_20():
    precio = 200                                # Arrange
    resultado = aplicar_descuento(precio, 20)   # Act
    ____                                        # Assert

test_descuento_20()
print("ok")`,
      ['assert resultado == 180', 'assert resultado == 160', 'assert precio == 160', 'assert resultado == 40'],
      1,
      l('20% de 200 es 40, así que el precio con descuento es **160**. El assert revisa el **resultado** de la acción, no la entrada (`precio` sigue siendo 200). Si el assert es falso, la prueba falla y nunca llega al `print`.', '20% of 200 is 40, so the discounted price is **160**. The assert checks the action\'s **result**, not the input (`precio` is still 200). If the assert is false, the test fails and never reaches the `print`.'),
      l('Calcula `200 - 200 * 20 // 100` y piensa qué variable guarda ese valor.', 'Compute `200 - 200 * 20 // 100` and think about which variable holds that value.')),
    P('ts-p-fake-clock', 'medium', l('¿Qué imprime?', 'What does it print?'),
      `class RelojFalso:
    def __init__(self, hora):
        self.hora = hora
    def ahora(self):
        return self.hora

def saludo(reloj):
    if reloj.ahora() < 12:
        return "Buenos días"
    return "Buenas tardes"

print(saludo(RelojFalso(9)), "|", saludo(RelojFalso(15)))`,
      'Buenos días | Buenas tardes',
      l('A las 9 → "Buenos días"; a las 15 → "Buenas tardes". Con un **reloj falso inyectado** pruebas las dos ramas cuando quieras, sin esperar a que sea de tarde: la prueba es determinista.', 'At 9 → "Buenos días"; at 15 → "Buenas tardes". With an **injected fake clock** you test both branches whenever you want, without waiting for the afternoon: the test is deterministic.'),
      l('`saludo` no lee la hora real: le pregunta al reloj que recibe.', '`saludo` does not read the real time: it asks the clock it receives.')),
    P('ts-p-edge-bug', 'medium',
      l('Un caso borde destapa un error. ¿Qué imprime?', 'An edge case uncovers a bug. What does it print?'),
      `def maximo(nums):
    mayor = 0
    for n in nums:
        if n > mayor:
            mayor = n
    return mayor

print(maximo([3, 8, 2]), maximo([-5, -2, -9]))`,
      '8 0',
      l('Con positivos funciona (8). Con **solo negativos** devuelve 0, que ni siquiera está en la lista: debería ser −2. El caso borde "negativos" encuentra el error; se arregla empezando con `mayor = nums[0]`.', 'With positives it works (8). With **only negatives** it returns 0, which is not even in the list: it should be −2. The "negatives" edge case finds the bug; the fix is to start with `mayor = nums[0]`.'),
      l('¿Algún número negativo es mayor que el valor inicial de `mayor`?', 'Is any negative number greater than the starting value of `mayor`?')),
    C('ts-p-tdd-green', 'medium',
      l('TDD, paso verde: ya tienes las dos pruebas. ¿Cuál es el **código mínimo** que las hace pasar?', 'TDD, green step: you already have both tests. What is the **minimum code** that makes them pass?'),
      `def es_bisiesto(anio):
    ____

def test_2024():
    assert es_bisiesto(2024) is True

def test_2023():
    assert es_bisiesto(2023) is False

test_2024()
test_2023()
print("las 2 pruebas pasan")`,
      ['return True', 'return anio % 4', 'return anio % 4 == 0', 'return anio == 2023'],
      2,
      l('`anio % 4 == 0` pasa ambas pruebas. `return True` falla con 2023, y `anio % 4` devuelve un número (0 o 3), no `True`/`False`. Después vendría el 🔵 refactor y otra prueba roja (p. ej. 1900, que no es bisiesto) que obligue a completar la regla.', '`anio % 4 == 0` passes both tests. `return True` fails for 2023, and `anio % 4` returns a number (0 or 3), not `True`/`False`. Then would come the 🔵 refactor and another red test (e.g. 1900, which is not a leap year) forcing you to complete the rule.'),
      l('Revisa cada opción con 2024 y con 2023. `is True` exige exactamente `True`.', 'Check each option with 2024 and with 2023. `is True` requires exactly `True`.')),
    R('ts-p-real-db', 'interview',
      l('¿Por qué tus pruebas **unitarias** no deberían usar la base de datos real?', 'Why should your **unit** tests not use the real database?'),
      l('Porque serían **lentas**, dependerían del estado de la BD (no deterministas) y fallarían por causas ajenas al código. Para eso se usan dobles de prueba; la BD real se prueba en las pruebas de **integración**.', 'Because they would be **slow**, depend on the DB state (non-deterministic) and fail for reasons unrelated to the code. That is what test doubles are for; the real DB is covered by **integration** tests.')),
    R('ts-p-before-done', 'interview',
      l('Terminaste de programar en una entrevista. ¿Qué haces antes de decir "listo"?', 'You finished coding in an interview. What do you do before saying "done"?'),
      l('**Propones casos de prueba** y recorres el código con ellos: entrada vacía, un elemento, duplicados, negativos o cero, valores grandes. Muestra mentalidad de ingeniero y suele destapar errores.', 'You **propose test cases** and walk the code through them: empty input, one element, duplicates, negatives or zero, large values. It shows an engineering mindset and often uncovers bugs.')),
  ],

  /* ---------------- Manejo de errores ---------------- */
  'error-handling': [
    P('eh-p-keyerror', 'basic',
      l('Buscar una clave que no existe en un diccionario lanza `KeyError`. ¿Qué imprime?', 'Looking up a missing key in a dictionary raises `KeyError`. What does it print?'),
      `def leer(datos, clave):
    try:
        return datos[clave]
    except KeyError:
        return "falta " + clave

config = {"puerto": 8080}
print(leer(config, "puerto"), leer(config, "host"))`,
      '8080 falta host',
      l('"puerto" existe → 8080. "host" no existe → `KeyError` → se captura y devuelve "falta host". Se captura solo esa excepción específica.', '"puerto" exists → 8080. "host" does not → `KeyError` → it is caught and returns "falta host". Only that specific exception is caught.'),
      l('Si `datos[clave]` funciona, el `return` sale de inmediato; si lanza `KeyError`, se ejecuta el `except`.', 'If `datos[clave]` works, the `return` leaves immediately; if it raises `KeyError`, the `except` runs.')),
    C('eh-p-raise', 'basic',
      l('Falla rápido: ¿qué línea falta para que imprima `error: edad inválida`?', 'Fail fast: which line is missing so it prints `error: edad inválida`?'),
      `def crear_usuario(edad):
    if edad < 0:
        ____
    return {"edad": edad}

try:
    crear_usuario(-3)
    print("creado")
except ValueError as e:
    print("error:", e)`,
      ['return ValueError("edad inválida")', 'print("edad inválida")', 'raise ValueError("edad inválida")', 'raise "edad inválida"'],
      2,
      l('`raise` **lanza** la excepción y detiene la función en ese momento; el `except ValueError as e` la recibe con su mensaje. Con `return` solo devolverías el objeto del error sin lanzarlo, y en Python no puedes lanzar un texto.', '`raise` **throws** the exception and stops the function right there; `except ValueError as e` receives it with its message. With `return` you would just hand back the error object without raising it, and in Python you cannot raise a plain string.'),
      l('La lección usa `raise ValueError(...)` para avisar que una config es inválida.', 'The lesson uses `raise ValueError(...)` to signal that a config is invalid.')),
    C('eh-p-which-except', 'basic',
      l('¿Qué excepción hay que capturar para que imprima `2.0 None`?', 'Which exception must be caught so it prints `2.0 None`?'),
      `def dividir(a, b):
    try:
        return a / b
    except ____:
        return None

print(dividir(6, 3), dividir(1, 0))`,
      ['ValueError', 'KeyError', 'FileNotFoundError', 'ZeroDivisionError'],
      3,
      l('Dividir entre cero lanza `ZeroDivisionError`. Si capturas otra excepción, esa no coincide y el error sigue de largo: el programa se cae. Por eso capturas la **específica**.', 'Dividing by zero raises `ZeroDivisionError`. If you catch a different exception, it does not match and the error keeps going: the program crashes. That is why you catch the **specific** one.'),
      l('El `except` solo atrapa la excepción que nombra.', 'The `except` only catches the exception it names.')),
    P('eh-p-generic', 'medium',
      l('Hay un error de dedo en el código. ¿Qué imprime?', 'There is a typo in the code. What does it print?'),
      `def promedio(nums):
    try:
        return sum(nums) / len(numeros)    # error de dedo: numeros
    except Exception:
        return 0

print(promedio([4, 6]))`,
      '0',
      l('`numeros` no existe y lanza `NameError`, pero `except Exception` lo atrapa y devuelve 0 **en silencio**: parece que funciona y el error queda oculto. Con `except ZeroDivisionError` (lo que sí querías manejar) habrías visto el error de inmediato.', '`numeros` does not exist and raises `NameError`, but `except Exception` catches it and returns 0 **silently**: it looks like it works and the bug stays hidden. With `except ZeroDivisionError` (what you actually meant to handle) you would have seen the bug right away.'),
      l('`except Exception` atrapa casi cualquier error, también los que no esperabas.', '`except Exception` catches almost any error, including the ones you did not expect.')),
    P('eh-p-validate', 'medium',
      l('Se valida la entrada del usuario en el borde. ¿Qué imprime?', 'User input is validated at the edge. What does it print?'),
      `def leer_edad(texto):           # borde: entrada del usuario
    if not texto.isdigit():
        raise ValueError("edad inválida: " + texto)
    return int(texto)

validas = []
errores = []
for t in ["30", "abc", "7"]:
    try:
        validas.append(leer_edad(t))
    except ValueError as e:
        errores.append(str(e))
print(validas, errores)`,
      "[30, 7] ['edad inválida: abc']",
      l('"30" y "7" pasan y se convierten a número. "abc" falla la validación y el error se registra con un mensaje claro. El resto del programa solo recibe edades válidas.', '"30" and "7" pass and are converted to numbers. "abc" fails validation and the error is recorded with a clear message. The rest of the program only receives valid ages.'),
      l('`isdigit()` es `True` solo si el texto son puros dígitos. `str(e)` es el mensaje del error.', '`isdigit()` is `True` only if the text is all digits. `str(e)` is the error message.')),
    R('eh-p-swallow', 'medium',
      l('¿Qué tiene de malo un `except` que atrapa el error y no hace nada con él?', 'What is wrong with an `except` that catches the error and does nothing with it?'),
      l('**Se traga el error en silencio**: el programa sigue con datos malos y nadie se entera de qué falló ni dónde. Como mínimo hay que **registrarlo** (logging) o **propagarlo**.', 'It **swallows the error silently**: the program continues with bad data and nobody learns what failed or where. At the very least **log it** or **propagate it**.')),
    O('eh-p-config-flow', 'interview',
      l('En `leer_config` de la lección, el archivo existe pero tiene JSON inválido. Ordena lo que pasa.', 'In the lesson\'s `leer_config`, the file exists but contains invalid JSON. Order what happens.'),
      [
        l('Entra al `try` y abre el archivo con `with`.', 'It enters the `try` and opens the file with `with`.'),
        l('`json.load` lanza `JSONDecodeError`.', '`json.load` raises `JSONDecodeError`.'),
        l('El `with` cierra el archivo, aunque hubo error.', 'The `with` closes the file, even though there was an error.'),
        l('`except json.JSONDecodeError` lanza un `ValueError` con un mensaje claro.', '`except json.JSONDecodeError` raises a `ValueError` with a clear message.'),
      ],
      l('El `with` libera el recurso al salir de su bloque, también cuando sale por un error. Luego el `except` convierte el error técnico en uno claro y conserva la causa original con `from e`.', 'The `with` releases the resource when leaving its block, including when it leaves because of an error. Then the `except` turns the technical error into a clear one and keeps the original cause with `from e`.')),
    R('eh-p-http', 'interview',
      l('En una API: ¿qué código HTTP devuelves si el usuario manda datos inválidos, y cuál si se cae tu base de datos?', 'In an API: which HTTP code do you return when the user sends invalid data, and which when your database goes down?'),
      l('**400** para entrada inválida (es culpa del cliente) y **500** para un error del servidor. En ambos casos con un mensaje claro pero **sin filtrar detalles internos**.', '**400** for invalid input (the client\'s fault) and **500** for a server error. In both cases with a clear message but **without leaking internal details**.')),
  ],
};
