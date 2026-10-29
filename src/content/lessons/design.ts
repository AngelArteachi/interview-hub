import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

export const DESIGN_LESSONS: Lesson[] = [
  {
    id: 'oop-pillars',
    track: 'design',
    title: l('Los 4 pilares de la OOP', 'The 4 pillars of OOP'),
    summary: l('Encapsulamiento, abstracción, herencia y polimorfismo con ejemplos.', 'Encapsulation, abstraction, inheritance and polymorphism with examples.'),
    minutes: 14,
    blocks: [
      md(
        `## Encapsulamiento
Agrupar datos y comportamiento en una clase y **proteger el estado interno**. Los demás interactúan mediante métodos, no tocando atributos directamente.

## Abstracción
Exponer **qué** hace algo y ocultar **cómo** lo hace. Cuando usas \`lista.sort()\` no necesitas saber que es Timsort.

## Herencia
Una clase hija **reutiliza y extiende** una clase padre (relación "es un": un \`Perro\` es un \`Animal\`).

## Polimorfismo
El mismo mensaje produce comportamientos distintos según el objeto. Tu código depende de la interfaz, no de la clase concreta.`,
        `## Encapsulation
Bundle data and behavior in a class and **protect the internal state**. Others interact through methods, not by touching attributes directly.

## Abstraction
Expose **what** something does and hide **how**. When you call \`list.sort()\` you do not need to know it is Timsort.

## Inheritance
A child class **reuses and extends** a parent class ("is a" relation: a \`Dog\` is an \`Animal\`).

## Polymorphism
The same message produces different behavior depending on the object. Your code depends on the interface, not the concrete class.`,
      ),
      code(`from abc import ABC, abstractmethod

class Figura(ABC):                     # abstracción
    @abstractmethod
    def area(self) -> float: ...

class Circulo(Figura):                 # herencia
    def __init__(self, r):
        self._r = r                    # encapsulamiento (convención _)
    def area(self):
        return 3.1416 * self._r ** 2

class Cuadrado(Figura):
    def __init__(self, lado):
        self._lado = lado
    def area(self):
        return self._lado ** 2

figuras = [Circulo(1), Cuadrado(2)]
total = sum(f.area() for f in figuras)  # polimorfismo`),
      interview('No solo recites definiciones: da un ejemplo de algún proyecto tuyo donde aplicaste cada pilar. Eso diferencia a un candidato junior.', 'Do not just recite definitions: give an example from one of your projects where you applied each pillar. That sets a junior candidate apart.'),
    ],
    quiz: [
      q('Ocultar los atributos y exponer métodos es…', 'Hiding attributes and exposing methods is…', [['Herencia', 'Inheritance'], ['Encapsulamiento', 'Encapsulation'], ['Polimorfismo', 'Polymorphism'], ['Recursión', 'Recursion']], 1, 'Protege el estado interno.', 'It protects the internal state.'),
      q('Una lista de `Figura` donde cada una calcula `area()` distinto es un ejemplo de…', 'A list of `Shape` where each computes `area()` differently is an example of…', [['Polimorfismo', 'Polymorphism'], ['Encapsulamiento', 'Encapsulation'], ['Composición', 'Composition'], ['Abstracción de datos', 'Data abstraction']], 0, 'Mismo mensaje, distintas implementaciones.', 'Same message, different implementations.'),
    ],
    concepts: [
      concept('Define polimorfismo con un ejemplo', 'Define polymorphism with an example', 'Mismo mensaje, distinto comportamiento según el objeto: `figura.area()` funciona para Círculo y Cuadrado.', 'Same message, different behavior per object: `shape.area()` works for Circle and Square.'),
      concept('Relación "es un" vs "tiene un"', '"Is a" vs "has a" relation', '"Es un" → herencia (Perro es Animal). "Tiene un" → composición (Auto tiene Motor).', '"Is a" → inheritance (Dog is Animal). "Has a" → composition (Car has Engine).'),
    ],
  },
  {
    id: 'solid',
    track: 'design',
    title: l('Principios SOLID', 'SOLID principles'),
    summary: l('Cinco principios para escribir código fácil de mantener.', 'Five principles for maintainable code.'),
    minutes: 16,
    blocks: [
      md(
        `- **S — Responsabilidad única**: una clase debe tener **una sola razón para cambiar**. \`Factura\` calcula totales; \`FacturaPDF\` la imprime.
- **O — Abierto/cerrado**: abierto a extensión y cerrado a modificación. Agregas comportamiento con nuevas clases en vez de editar \`if\`s.
- **L — Sustitución de Liskov**: una subclase debe poder usarse donde se espera la clase padre sin romper nada. (El clásico: \`Cuadrado\` heredando de \`Rectángulo\` viola LSP.)
- **I — Segregación de interfaces**: mejor varias interfaces pequeñas que una enorme; nadie debe implementar métodos que no usa.
- **D — Inversión de dependencias**: depende de **abstracciones**, no de implementaciones concretas. Recibe un \`Repositorio\` en vez de crear un \`PostgresRepo\` dentro.`,
        `- **S — Single responsibility**: a class should have **one reason to change**. \`Invoice\` computes totals; \`InvoicePDF\` prints it.
- **O — Open/closed**: open for extension, closed for modification. Add behavior with new classes instead of editing \`if\`s.
- **L — Liskov substitution**: a subclass must be usable wherever the parent is expected without breaking anything. (The classic: \`Square\` inheriting from \`Rectangle\` violates LSP.)
- **I — Interface segregation**: several small interfaces beat one huge one; nobody should implement methods they do not use.
- **D — Dependency inversion**: depend on **abstractions**, not concrete implementations. Receive a \`Repository\` instead of creating a \`PostgresRepo\` inside.`,
      ),
      code(`# ❌ Viola O/C: cada nuevo método de pago obliga a editar esta función
def pagar(tipo, monto):
    if tipo == "tarjeta": ...
    elif tipo == "paypal": ...

# ✅ Abierto a extensión: agrega una clase nueva y listo
class MetodoPago:
    def pagar(self, monto): raise NotImplementedError

class Tarjeta(MetodoPago):
    def pagar(self, monto): print(f"Cobrando {monto} a tarjeta")

class PayPal(MetodoPago):
    def pagar(self, monto): print(f"Cobrando {monto} vía PayPal")

def procesar(metodo: MetodoPago, monto):   # D: depende de la abstracción
    metodo.pagar(monto)`),
      tip('No apliques SOLID a ciegas: en código pequeño, demasiadas abstracciones también es un problema (sobreingeniería).', 'Do not apply SOLID blindly: in small code, too many abstractions is a problem too (over-engineering).'),
    ],
    quiz: [
      q('"Una clase debe tener una sola razón para cambiar" es…', '"A class should have one reason to change" is…', [['S', 'S'], ['O', 'O'], ['L', 'L'], ['D', 'D']], 0, 'Single responsibility.', 'Single responsibility.'),
      q('Recibir dependencias por el constructor en lugar de crearlas dentro aplica…', 'Receiving dependencies through the constructor instead of creating them inside applies…', [['Liskov', 'Liskov'], ['Inversión de dependencias', 'Dependency inversion'], ['Segregación de interfaces', 'Interface segregation'], ['Abierto/cerrado', 'Open/closed']], 1,
        'Dependes de una abstracción inyectada.', 'You depend on an injected abstraction.'),
    ],
    concepts: [
      concept('Principio abierto/cerrado', 'Open/closed principle', 'Extender comportamiento agregando código nuevo (clases), sin modificar el que ya funciona.', 'Extend behavior by adding new code (classes) without modifying working code.'),
      concept('Sustitución de Liskov', 'Liskov substitution', 'Las subclases deben poder reemplazar a su clase padre sin cambiar el comportamiento esperado.', 'Subclasses must be able to replace their parent without changing expected behavior.'),
    ],
  },
  {
    id: 'design-patterns',
    track: 'design',
    title: l('Patrones de diseño esenciales', 'Essential design patterns'),
    summary: l('Singleton, Factory, Strategy, Observer y Adapter.', 'Singleton, Factory, Strategy, Observer and Adapter.'),
    minutes: 18,
    blocks: [
      md(
        `| Patrón | Tipo | Problema que resuelve |
|---|---|---|
| **Singleton** | Creacional | Una sola instancia global (config, logger). ⚠️ Dificulta el testing. |
| **Factory** | Creacional | Crear objetos sin acoplarte a la clase concreta. |
| **Strategy** | Comportamiento | Intercambiar algoritmos en tiempo de ejecución (métodos de pago, ordenamientos). |
| **Observer** | Comportamiento | Notificar a suscriptores cuando algo cambia (eventos, UI reactiva). |
| **Adapter** | Estructural | Hacer compatible una interfaz con otra (envolver una librería externa). |`,
        `| Pattern | Type | Problem it solves |
|---|---|---|
| **Singleton** | Creational | A single global instance (config, logger). ⚠️ Hurts testability. |
| **Factory** | Creational | Create objects without coupling to the concrete class. |
| **Strategy** | Behavioral | Swap algorithms at runtime (payment methods, sorting). |
| **Observer** | Behavioral | Notify subscribers when something changes (events, reactive UI). |
| **Adapter** | Structural | Make one interface compatible with another (wrapping an external library). |`,
      ),
      code(`# Observer
class Evento:
    def __init__(self):
        self._suscriptores = []
    def suscribir(self, fn):
        self._suscriptores.append(fn)
    def emitir(self, dato):
        for fn in self._suscriptores:
            fn(dato)

pedido_creado = Evento()
pedido_creado.suscribir(lambda p: print("Enviar correo", p))
pedido_creado.suscribir(lambda p: print("Actualizar inventario", p))
pedido_creado.emitir({"id": 42})`),
      interview('Pregunta común: "¿Qué patrón has usado en un proyecto?". Ten una historia lista, por ejemplo: "Usé Strategy para soportar varios métodos de pago sin llenar el código de if/else".', 'Common question: "Which pattern have you used in a project?". Have a story ready, e.g. "I used Strategy to support several payment methods without filling the code with if/else".'),
    ],
    quiz: [
      q('Un sistema de eventos donde varios oyentes reaccionan a un cambio es…', 'An event system where several listeners react to a change is…', [['Factory', 'Factory'], ['Observer', 'Observer'], ['Adapter', 'Adapter'], ['Singleton', 'Singleton']], 1, 'Publicador/suscriptor.', 'Publisher/subscriber.'),
      q('Envolver una librería externa para que cumpla tu interfaz es…', 'Wrapping an external library so it matches your interface is…', [['Adapter', 'Adapter'], ['Strategy', 'Strategy'], ['Observer', 'Observer'], ['Factory', 'Factory']], 0, 'Adapta una interfaz a otra.', 'It adapts one interface to another.'),
    ],
    concepts: [
      concept('Patrón Strategy', 'Strategy pattern', 'Encapsula algoritmos intercambiables detrás de una interfaz común y elige uno en tiempo de ejecución.', 'Encapsulates interchangeable algorithms behind a common interface and picks one at runtime.'),
      concept('¿Por qué Singleton se considera un antipatrón a veces?', 'Why is Singleton sometimes considered an anti-pattern?', 'Es estado global oculto: acopla el código y dificulta las pruebas (no puedes sustituirlo fácilmente).', 'It is hidden global state: it couples code and makes testing hard (you cannot easily substitute it).'),
    ],
  },
  {
    id: 'clean-code',
    track: 'design',
    title: l('Código limpio', 'Clean code'),
    summary: l('Nombres, funciones pequeñas, DRY, KISS y YAGNI.', 'Names, small functions, DRY, KISS and YAGNI.'),
    minutes: 10,
    blocks: [
      md(
        `## Principios prácticos
- **Nombres que revelan intención**: \`dias_desde_ultimo_login\`, no \`d\`.
- **Funciones pequeñas** que hacen una sola cosa.
- **DRY** (*Don't Repeat Yourself*): extrae la lógica duplicada.
- **KISS** (*Keep It Simple*): la solución más simple que funcione.
- **YAGNI** (*You Aren't Gonna Need It*): no construyas lo que aún no necesitas.
- **Retornos tempranos** en lugar de \`if\`s anidados.
- Los comentarios explican el **porqué**, no el **qué**.`,
        `## Practical principles
- **Intention-revealing names**: \`days_since_last_login\`, not \`d\`.
- **Small functions** that do one thing.
- **DRY** (*Don't Repeat Yourself*): extract duplicated logic.
- **KISS** (*Keep It Simple*): the simplest solution that works.
- **YAGNI** (*You Aren't Gonna Need It*): do not build what you do not need yet.
- **Early returns** instead of nested \`if\`s.
- Comments explain **why**, not **what**.`,
      ),
      code(`# ❌
def p(u):
    if u:
        if u.activo:
            if u.saldo > 0:
                return True
    return False

# ✅
def puede_comprar(usuario):
    if not usuario or not usuario.activo:
        return False
    return usuario.saldo > 0`),
      interview('En entrevistas de código, usar buenos nombres y extraer funciones auxiliares **suma puntos** aunque el algoritmo sea el mismo.', 'In coding interviews, good names and extracting helper functions **earn points** even if the algorithm is the same.'),
    ],
    quiz: [
      q('YAGNI significa…', 'YAGNI means…', [['Escribe pruebas primero', 'Write tests first'], ['No construyas lo que aún no necesitas', 'Do not build what you do not need yet'], ['No repitas código', 'Do not repeat code'], ['Usa patrones siempre', 'Always use patterns']], 1, "You Aren't Gonna Need It.", "You Aren't Gonna Need It."),
    ],
    concepts: [concept('DRY, KISS y YAGNI', 'DRY, KISS and YAGNI', 'No repetir lógica; mantenerlo simple; no construir lo que aún no se necesita.', 'Do not repeat logic; keep it simple; do not build what is not needed yet.')],
  },
  {
    id: 'testing',
    track: 'design',
    title: l('Testing: unitarias, integración y TDD', 'Testing: unit, integration and TDD'),
    summary: l('Qué probar, cómo y la pirámide de pruebas.', 'What to test, how, and the testing pyramid.'),
    minutes: 14,
    blocks: [
      md(
        `## Tipos de pruebas
- **Unitarias**: una función o clase aislada. Rápidas y muchas.
- **Integración**: varios componentes juntos (API + BD).
- **End-to-end (E2E)**: el flujo completo como el usuario (Playwright, Cypress). Lentas y pocas.

## Estructura AAA
**Arrange** (preparar) → **Act** (ejecutar) → **Assert** (verificar).

## Dobles de prueba
**Mock**, **stub** o **fake**: reemplazan dependencias externas (BD, APIs, reloj) para que la prueba sea rápida y determinista.

## TDD
🔴 Escribe una prueba que falle → 🟢 haz el código mínimo para pasarla → 🔵 refactoriza.`,
        `## Types of tests
- **Unit**: one function or class in isolation. Fast and many.
- **Integration**: several components together (API + DB).
- **End-to-end (E2E)**: the full flow like a user (Playwright, Cypress). Slow and few.

## AAA structure
**Arrange** → **Act** → **Assert**.

## Test doubles
A **mock**, **stub** or **fake** replaces external dependencies (DB, APIs, clock) so the test is fast and deterministic.

## TDD
🔴 Write a failing test → 🟢 write the minimum code to pass → 🔵 refactor.`,
      ),
      code(`# pytest
def es_palindromo(s: str) -> bool:
    s = "".join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]

def test_palindromo_con_espacios():
    # Arrange
    texto = "Anita lava la tina"
    # Act
    resultado = es_palindromo(texto)
    # Assert
    assert resultado is True

def test_cadena_vacia():
    assert es_palindromo("") is True`),
      tip('En entrevistas de código, al terminar **propón casos de prueba**: vacío, un elemento, duplicados, negativos y valores grandes. Muestra mentalidad de ingeniero.', 'In coding interviews, when you finish **propose test cases**: empty, one element, duplicates, negatives and large values. It shows an engineering mindset.'),
    ],
    quiz: [
      q('¿Qué tipo de prueba debería ser la más numerosa?', 'Which type of test should be the most numerous?', [['E2E', 'E2E'], ['Integración', 'Integration'], ['Unitarias', 'Unit'], ['Manuales', 'Manual']], 2, 'La base de la pirámide.', 'The base of the pyramid.'),
      q('El ciclo de TDD es…', 'The TDD cycle is…', [['Verde → Rojo → Refactor', 'Green → Red → Refactor'], ['Rojo → Verde → Refactor', 'Red → Green → Refactor'], ['Refactor → Rojo → Verde', 'Refactor → Red → Green'], ['Código → Prueba → Deploy', 'Code → Test → Deploy']], 1, 'Primero la prueba que falla.', 'The failing test comes first.'),
    ],
    concepts: [
      concept('Estructura AAA de una prueba', 'AAA test structure', 'Arrange (preparar), Act (ejecutar), Assert (verificar).', 'Arrange, Act, Assert.'),
      concept('Casos borde que siempre debes probar', 'Edge cases you should always test', 'Entrada vacía, un elemento, duplicados, negativos/cero, valores muy grandes, entradas inválidas.', 'Empty input, one element, duplicates, negatives/zero, very large values, invalid inputs.'),
    ],
  },
  {
    id: 'error-handling',
    track: 'design',
    title: l('Manejo de errores', 'Error handling'),
    summary: l('Excepciones, validación y cómo fallar de forma segura.', 'Exceptions, validation and failing safely.'),
    minutes: 8,
    blocks: [
      md(
        `## Buenas prácticas
- **Valida en los bordes** (entrada del usuario, APIs externas) y confía en los datos ya validados dentro del sistema.
- **Falla rápido**: detecta el error lo antes posible con un mensaje claro.
- Captura **excepciones específicas**, no \`except Exception\` de todo.
- No "tragues" errores en silencio: regístralos (logging) o propágalos.
- Usa \`finally\` o context managers (\`with\`) para liberar recursos.
- En APIs, devuelve códigos HTTP correctos (400 para entrada inválida, 500 para errores del servidor) **sin filtrar detalles internos**.`,
        `## Good practices
- **Validate at the edges** (user input, external APIs) and trust already-validated data inside the system.
- **Fail fast**: detect the error as early as possible with a clear message.
- Catch **specific exceptions**, not a blanket \`except Exception\`.
- Do not swallow errors silently: log them or propagate them.
- Use \`finally\` or context managers (\`with\`) to release resources.
- In APIs, return correct HTTP codes (400 for invalid input, 500 for server errors) **without leaking internal details**.`,
      ),
      code(`import json
import logging

logger = logging.getLogger(__name__)

def leer_config(ruta):
    try:
        with open(ruta) as f:          # cierra el archivo siempre
            return json.load(f)
    except FileNotFoundError:
        logger.warning("Sin config en %s, usando valores por defecto", ruta)
        return {}
    except json.JSONDecodeError as e:
        raise ValueError(f"Config inválida en {ruta}: {e}") from e`),
      warn('Nunca muestres stack traces ni mensajes de la BD al usuario final: revelan información útil para un atacante.', 'Never show stack traces or DB messages to end users: they reveal information useful to an attacker.'),
    ],
    quiz: [
      q('¿Por qué evitar `except Exception:` genérico?', 'Why avoid a generic `except Exception:`?', [['Es más lento', 'It is slower'], ['Oculta errores inesperados', 'It hides unexpected errors'], ['No existe en Python', 'It does not exist in Python'], ['Consume más memoria', 'It uses more memory']], 1, 'Capturas cosas que no sabías manejar.', 'You catch things you did not know how to handle.'),
    ],
    concepts: [concept('"Falla rápido" (fail fast)', '"Fail fast"', 'Detectar y reportar errores lo antes posible con un mensaje claro, en vez de continuar con datos inválidos.', 'Detect and report errors as early as possible with a clear message instead of continuing with invalid data.')],
  },
];
