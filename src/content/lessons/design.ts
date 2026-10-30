import type { Lesson } from '../../types';
import { code, concept, interview, l, md, q, tip, warn } from './helpers';

export const DESIGN_LESSONS: Lesson[] = [
  {
    id: 'oop-pillars',
    track: 'design',
    title: l('Los 4 pilares de la OOP', 'The 4 pillars of OOP'),
    summary: l('Clases y objetos desde cero, y luego encapsulamiento, abstracción, herencia y polimorfismo: qué problema resuelve cada uno.', 'Classes and objects from scratch, then encapsulation, abstraction, inheritance and polymorphism: what problem each one solves.'),
    minutes: 22,
    blocks: [
      md(
        `## Primero: ¿qué es una clase y qué es un objeto?
Imagina que programas una app de mascotas. Cada mascota tiene **datos** (nombre, edad) y **cosas que puede hacer** (saludar, comer).

- Una **clase** es el **molde**: describe qué datos y qué acciones tendrá cada mascota. Es como el plano de una casa: con un mismo plano construyes muchas casas.
- Un **objeto** es una mascota concreta hecha con ese molde, por ejemplo "Firulais, 3 años". Con una clase puedes crear todos los objetos que quieras.
- Un **atributo** es un dato que guarda el objeto (\`nombre\`, \`edad\`).
- Un **método** es una función que pertenece al objeto y trabaja con sus datos (\`saludar()\`).

La **programación orientada a objetos (OOP)** organiza el programa alrededor de objetos así. Sus **4 pilares** son cuatro ideas para hacerlo bien: encapsulamiento, abstracción, herencia y polimorfismo. Antes de verlas, así se ve una clase en Python:`,
        `## First: what is a class and what is an object?
Imagine you are building a pet app. Each pet has **data** (name, age) and **things it can do** (greet, eat).

- A **class** is the **mold**: it describes which data and which actions every pet will have. It is like the blueprint of a house: with one blueprint you build many houses.
- An **object** is a concrete pet made from that mold, for example "Rex, 3 years old". With one class you can create as many objects as you want.
- An **attribute** is a piece of data the object stores (\`nombre\`, \`edad\`).
- A **method** is a function that belongs to the object and works with its data (\`saludar()\`).

**Object-oriented programming (OOP)** organizes the program around objects like these. Its **4 pillars** are four ideas for doing it well: encapsulation, abstraction, inheritance and polymorphism. Before seeing them, this is what a class looks like in Python:`,
      ),
      code(`class Perro:                           # la clase: el molde
    def __init__(self, nombre, edad):   # se ejecuta al crear cada perro
        self.nombre = nombre            # atributo: un dato que guarda el objeto
        self.edad = edad

    def saludar(self):                  # método: algo que el perro sabe hacer
        return "Hola, soy " + self.nombre

firulais = Perro("Firulais", 3)         # objeto 1
luna = Perro("Luna", 5)                 # objeto 2, del mismo molde

print(firulais.saludar())   # imprime: Hola, soy Firulais
print(luna.edad)            # imprime: 5`),
      md(
        `**Cómo leerlo:**
- \`__init__\` se ejecuta **solo** cuando escribes \`Perro("Firulais", 3)\`: recibe los datos y los guarda en el objeto nuevo.
- \`self\` significa "**este** objeto". Con \`firulais.saludar()\`, dentro de \`saludar\` el \`self\` es \`firulais\`, así que \`self.nombre\` es "Firulais".
- \`firulais\` y \`luna\` salen del mismo molde, pero **cada uno guarda sus propios datos**.`,
        `**How to read it:**
- \`__init__\` runs **by itself** when you write \`Perro("Firulais", 3)\`: it receives the data and stores it in the new object.
- \`self\` means "**this** object". With \`firulais.saludar()\`, inside \`saludar\` the \`self\` is \`firulais\`, so \`self.nombre\` is "Firulais".
- \`firulais\` and \`luna\` come from the same mold, but **each one keeps its own data**.`,
      ),
      md(
        `## Pilar 1: Encapsulamiento, el objeto cuida sus propios datos
**El problema:** si cualquier parte del programa puede escribir \`cuenta.saldo = -500\`, nada impide dejar el objeto en un estado que no tiene sentido.

**La idea:** los datos del objeto no se cambian directamente desde fuera. Se cambian **pidiéndoselo al objeto con un método**, y ese método revisa las reglas.

**Analogía:** en un cajero automático no abres tú la caja fuerte. Pides "retirar 500" y el cajero revisa que tengas saldo antes de darte el dinero.`,
        `## Pillar 1: Encapsulation, the object looks after its own data
**The problem:** if any part of the program can write \`cuenta.saldo = -500\`, nothing stops the object from ending up in a state that makes no sense.

**The idea:** the object's data is not changed directly from outside. It is changed by **asking the object through a method**, and that method checks the rules.

**Analogy:** at an ATM you do not open the vault yourself. You ask to "withdraw 500" and the ATM checks you have the balance before giving you the money.`,
      ),
      code(`# ❌ Sin encapsulamiento: cualquiera cambia el saldo como quiera
class CuentaSinCuidar:
    def __init__(self):
        self.saldo = 0

c = CuentaSinCuidar()
c.saldo = -500        # nadie lo impide
print(c.saldo)        # imprime: -500

# ✅ Con encapsulamiento: el saldo solo cambia a través de métodos con reglas
class Cuenta:
    def __init__(self):
        self._saldo = 0               # el _ avisa: "esto es interno, no lo toques"

    def depositar(self, monto):
        if monto <= 0:
            return "El monto debe ser positivo"
        self._saldo += monto
        return "Depositado"

    def saldo(self):
        return self._saldo

cuenta = Cuenta()
print(cuenta.depositar(-500))   # imprime: El monto debe ser positivo
print(cuenta.depositar(200))    # imprime: Depositado
print(cuenta.saldo())           # imprime: 200`),
      md(
        `En Python el guion bajo de \`_saldo\` es una **convención**: el lenguaje no lo prohíbe, pero todo programador entiende "esto es interno, usa los métodos". En Java o C# se escribe \`private\` y el compilador sí impide tocarlo.`,
        `In Python the underscore in \`_saldo\` is a **convention**: the language does not forbid access, but every programmer reads it as "this is internal, use the methods". In Java or C# you write \`private\` and the compiler does block access.`,
      ),
      md(
        `## Pilar 2: Abstracción, usar algo sin saber cómo funciona por dentro
**El problema:** si para usar un objeto tuvieras que conocer todos sus pasos internos, sería difícil de usar y cualquier cambio interno te afectaría.

**La idea:** el objeto ofrece pocas acciones sencillas (**qué** hace) y esconde los pasos complicados (**cómo** lo hace).

**Analogía:** para manejar un auto usas el volante y los pedales; no necesitas saber cómo funciona el motor. Y si mañana le cambian el motor, sigues manejando igual.`,
        `## Pillar 2: Abstraction, using something without knowing how it works inside
**The problem:** if you had to know every internal step to use an object, it would be hard to use and any internal change would affect you.

**The idea:** the object offers a few simple actions (**what** it does) and hides the complicated steps (**how** it does them).

**Analogy:** to drive a car you use the wheel and the pedals; you do not need to know how the engine works. And if the engine is replaced tomorrow, you still drive the same way.`,
      ),
      code(`class Cafetera:
    def preparar_cafe(self):          # lo único que necesitas conocer
        self._calentar_agua()
        self._moler_granos()
        return "Café listo"

    def _calentar_agua(self):         # detalles escondidos
        print("calentando agua...")

    def _moler_granos(self):
        print("moliendo granos...")

maquina = Cafetera()
print(maquina.preparar_cafe())
# imprime:
# calentando agua...
# moliendo granos...
# Café listo`),
      md(
        `Quien usa la cafetera solo llama \`preparar_cafe()\`. Pasa lo mismo con \`lista.sort()\`: la usas sin saber qué algoritmo ordena por dentro.

**¿No es lo mismo que encapsulamiento?** Se parecen y suelen ir juntos, pero responden preguntas distintas:
- **Encapsulamiento:** ¿quién puede cambiar los datos? → Solo el objeto, a través de sus métodos.
- **Abstracción:** ¿qué necesita saber quien lo usa? → Solo qué hace, no cómo.`,
        `Whoever uses the coffee maker just calls \`preparar_cafe()\`. The same happens with \`list.sort()\`: you use it without knowing which algorithm sorts inside.

**Isn't that the same as encapsulation?** They are similar and usually go together, but they answer different questions:
- **Encapsulation:** who can change the data? → Only the object, through its methods.
- **Abstraction:** what does the user need to know? → Only what it does, not how.`,
      ),
      md(
        `## Pilar 3: Herencia, reutilizar una clase para crear otra
**El problema:** \`Perro\` y \`Gato\` tienen nombre y comen igual. Si copias ese código en las dos clases, cada cambio lo tienes que hacer dos veces.

**La idea:** escribes lo común **una sola vez** en una clase **padre** (\`Animal\`), y las clases **hijas** (\`Perro\`, \`Gato\`) lo reciben automáticamente. Cada hija puede **agregar** cosas nuevas o **cambiar** las que heredó.

**Úsala cuando la relación es "es un":** un perro *es un* animal. En Python se escribe \`class Perro(Animal):\`.`,
        `## Pillar 3: Inheritance, reusing a class to create another
**The problem:** \`Perro\` (dog) and \`Gato\` (cat) both have a name and eat the same way. If you copy that code into both classes, every change has to be made twice.

**The idea:** you write the common part **only once** in a **parent** class (\`Animal\`), and the **child** classes (\`Perro\`, \`Gato\`) get it automatically. Each child can **add** new things or **change** the ones it inherited.

**Use it when the relation is "is a":** a dog *is an* animal. In Python you write \`class Perro(Animal):\`.`,
      ),
      code(`class Animal:                          # clase padre: lo común
    def __init__(self, nombre):
        self.nombre = nombre
    def comer(self):
        return self.nombre + " está comiendo"
    def sonido(self):
        return "..."

class Perro(Animal):                   # Perro hereda todo lo de Animal
    def sonido(self):                  # ...y cambia sonido
        return "Guau"

class Gato(Animal):
    def sonido(self):
        return "Miau"
    def ronronear(self):               # ...y agrega algo nuevo
        return "rrrr"

luna = Gato("Luna")
print(luna.comer())       # imprime: Luna está comiendo   (heredado de Animal)
print(luna.sonido())      # imprime: Miau                 (su propia versión)
print(luna.ronronear())   # imprime: rrrr                 (solo los gatos)`),
      md(
        `Fíjate en dos cosas:
- Ni \`Perro\` ni \`Gato\` escriben \`__init__\`: usan el que heredaron de \`Animal\`.
- Cuando una hija vuelve a escribir un método que heredó (como \`sonido\`), se dice que lo **sobrescribe** (*override*). Si no lo sobrescribe, se usa el del padre.`,
        `Notice two things:
- Neither \`Perro\` nor \`Gato\` writes \`__init__\`: they use the one inherited from \`Animal\`.
- When a child writes again a method it inherited (like \`sonido\`), it **overrides** it. If it does not override it, the parent's version is used.`,
      ),
      md(
        `## Pilar 4: Polimorfismo, la misma orden y cada objeto la cumple a su manera
**El problema:** sin polimorfismo, el código que trabaja con objetos distintos se llena de preguntas: "si es perro haz esto, si es gato haz aquello". Cada tipo nuevo obliga a agregar otro \`if\`.

**La idea:** objetos de clases distintas tienen un método con **el mismo nombre**, y cada uno lo hace a su manera. Así el código puede llamar \`animal.sonido()\` **sin preguntar qué animal es**.

**Analogía:** el botón "reproducir" funciona con una canción, un video o un podcast. Tú aprietas lo mismo y cada uno sabe qué hacer. (*Poli* = muchas, *morfo* = formas.)`,
        `## Pillar 4: Polymorphism, the same command and each object carries it out its own way
**The problem:** without polymorphism, code that works with different objects fills up with questions: "if it is a dog do this, if it is a cat do that". Every new type forces another \`if\`.

**The idea:** objects of different classes have a method with **the same name**, and each one does it its own way. So the code can call \`animal.sonido()\` **without asking which animal it is**.

**Analogy:** the "play" button works with a song, a video or a podcast. You press the same thing and each one knows what to do. (*Poly* = many, *morph* = forms.)`,
      ),
      code(`# ❌ Sin polimorfismo: hay que preguntar por el tipo
def hacer_sonar(tipo):
    if tipo == "perro":
        return "Guau"
    elif tipo == "gato":
        return "Miau"
    # ...y otro elif por cada animal nuevo

# ✅ Con polimorfismo (usando las clases Perro y Gato de arriba)
animales = [Perro("Firulais"), Gato("Luna")]
for animal in animales:
    print(animal.sonido())
# imprime:
# Guau
# Miau`),
      md(
        `El ciclo **no sabe** si cada objeto es perro o gato: solo sabe que todos tienen \`sonido()\`. Si mañana agregas \`class Vaca(Animal)\` con su propio \`sonido\`, el ciclo funciona sin tocarlo. Por eso se dice que **la sobrescritura es la forma de lograr el polimorfismo**.`,
        `The loop **does not know** whether each object is a dog or a cat: it only knows they all have \`sonido()\`. If tomorrow you add \`class Vaca(Animal)\` (cow) with its own \`sonido\`, the loop works without changes. That is why **overriding is how polymorphism is achieved**.`,
      ),
      md(
        `## Clases abstractas: un molde que obliga a sus hijas
A veces la clase padre no tiene sentido por sí sola. ¿Cuál es el área de "una figura" en general? No hay respuesta: solo un círculo o un cuadrado concretos tienen área. Para eso sirve una **clase abstracta**:
- **No se pueden crear objetos** de ella directamente.
- Declara métodos **obligatorios**: toda hija tiene que escribirlos.

En Python se hace heredando de \`ABC\` y marcando cada método obligatorio con \`@abstractmethod\` (la línea con \`@\` va justo encima del método):`,
        `## Abstract classes: a mold that sets rules for its children
Sometimes the parent class makes no sense on its own. What is the area of "a shape" in general? There is no answer: only a concrete circle or square has an area. That is what an **abstract class** is for:
- You **cannot create objects** from it directly.
- It declares **required** methods: every child has to write them.

In Python you inherit from \`ABC\` and mark each required method with \`@abstractmethod\` (the line with \`@\` goes right above the method):`,
      ),
      code(`from abc import ABC, abstractmethod

class Figura(ABC):                 # ABC = clase abstracta
    @abstractmethod                # toda hija está obligada a escribir area
    def area(self):
        pass                       # pass = "aquí no hay código"

class Circulo(Figura):
    def __init__(self, radio):
        self._radio = radio
    def area(self):
        return 3.1416 * self._radio ** 2

class Cuadrado(Figura):
    def __init__(self, lado):
        self._lado = lado
    def area(self):
        return self._lado ** 2

for f in [Circulo(1), Cuadrado(2)]:
    print(f.area())
# imprime:
# 3.1416
# 4

# Escribir Figura() daría error: no se pueden crear objetos de una clase abstracta`),
      md(
        `Este ejemplo junta los cuatro pilares:
- **Abstracción:** \`Figura\` dice *qué* debe poder hacer toda figura (dar su área), sin decir cómo.
- **Herencia:** \`Circulo\` y \`Cuadrado\` heredan de \`Figura\`.
- **Encapsulamiento:** \`_radio\` y \`_lado\` son internos.
- **Polimorfismo:** el ciclo llama \`area()\` sin saber qué figura tiene.

**¿Y qué es una interfaz?** En lenguajes como Java también existen las **interfaces**: son como una clase abstracta pero **solo** con la lista de métodos obligatorios, sin datos ni código. Una clase puede cumplir varias interfaces pero heredar de una sola clase. Python no tiene una palabra especial para interfaces: usa \`ABC\` para las dos ideas.`,
        `This example brings the four pillars together:
- **Abstraction:** \`Figura\` says *what* every shape must be able to do (give its area), without saying how.
- **Inheritance:** \`Circulo\` and \`Cuadrado\` inherit from \`Figura\`.
- **Encapsulation:** \`_radio\` and \`_lado\` are internal.
- **Polymorphism:** the loop calls \`area()\` without knowing which shape it has.

**And what is an interface?** Languages like Java also have **interfaces**: they are like an abstract class but **only** with the list of required methods, no data or code. A class can fulfill several interfaces but inherit from only one class. Python has no special keyword for interfaces: it uses \`ABC\` for both ideas.`,
      ),
      md(
        `## Composición: "tiene un" en vez de "es un"
La herencia no es la única forma de reutilizar código. Con **composición**, un objeto **guarda otro objeto como atributo** y le pide que haga parte del trabajo (le **delega** el trabajo).
- Herencia → "**es un**": un perro *es un* animal.
- Composición → "**tiene un**": un celular *tiene una* batería. Un celular no *es* una batería.`,
        `## Composition: "has a" instead of "is a"
Inheritance is not the only way to reuse code. With **composition**, an object **stores another object as an attribute** and asks it to do part of the work (it **delegates** the work).
- Inheritance → "**is a**": a dog *is an* animal.
- Composition → "**has a**": a phone *has a* battery. A phone *is not* a battery.`,
      ),
      code(`class Bateria:
    def __init__(self, carga):
        self.carga = carga
    def estado(self):
        return str(self.carga) + "%"

class Celular:
    def __init__(self, bateria):
        self.bateria = bateria                    # el celular TIENE una batería
    def mostrar_bateria(self):
        return "Batería: " + self.bateria.estado()  # le delega el trabajo

mi_cel = Celular(Bateria(80))
print(mi_cel.mostrar_bateria())   # imprime: Batería: 80%

mi_cel.bateria = Bateria(100)     # cambias la pieza sin tocar ninguna clase
print(mi_cel.mostrar_bateria())   # imprime: Batería: 100%`),
      md(
        `**¿Por qué muchas veces se prefiere composición?** Con herencia, la hija queda muy **amarrada** a la padre: si cambias la padre, puedes romper a todas las hijas sin darte cuenta. Con composición cada pieza es independiente y la puedes **cambiar**, incluso con el programa corriendo, como la batería de arriba.

**Regla práctica:** usa herencia solo si de verdad "es un". Si "tiene un", usa composición.`,
        `**Why is composition often preferred?** With inheritance, the child is tightly **tied** to the parent: if you change the parent, you can break every child without noticing. With composition each part is independent and you can **swap** it, even while the program runs, like the battery above.

**Rule of thumb:** use inheritance only if it truly "is a". If it "has a", use composition.`,
      ),
      md(
        `## Sobrecarga vs sobrescritura (pregunta típica de entrevista)
Suenan parecido, pero son cosas distintas:

| | Sobrescritura (*override*) | Sobrecarga (*overload*) |
|---|---|---|
| Qué es | Una hija **vuelve a escribir** un método que heredó | Varios métodos con el **mismo nombre** y **distintos parámetros** en la misma clase |
| Ejemplo | \`sonido()\` en \`Perro\` y en \`Gato\` | En Java: \`sumar(int a, int b)\` y \`sumar(double a, double b)\` |
| ¿Python la tiene? | Sí | No de verdad: si escribes dos métodos con el mismo nombre, el segundo reemplaza al primero. Se imita con parámetros opcionales o con \`functools.singledispatch\`. |`,
        `## Overloading vs overriding (typical interview question)
They sound alike, but they are different things:

| | Overriding | Overloading |
|---|---|---|
| What it is | A child **writes again** a method it inherited | Several methods with the **same name** and **different parameters** in the same class |
| Example | \`sonido()\` in \`Perro\` and in \`Gato\` | In Java: \`sumar(int a, int b)\` and \`sumar(double a, double b)\` |
| Does Python have it? | Yes | Not really: if you write two methods with the same name, the second replaces the first. It is emulated with optional parameters or \`functools.singledispatch\`. |`,
      ),
      interview('No solo recites definiciones: da un ejemplo de algún proyecto tuyo donde aplicaste cada pilar. Eso diferencia a un candidato junior.', 'Do not just recite definitions: give an example from one of your projects where you applied each pillar. That sets a junior candidate apart.'),
      md(
        `## Resumen
| Pilar | En una frase | Pregúntate |
|---|---|---|
| **Encapsulamiento** | El objeto cuida sus datos: se cambian con métodos que revisan las reglas | ¿Quién puede cambiar esto? |
| **Abstracción** | Muestra qué hace y esconde cómo lo hace | ¿Qué necesita saber quien lo usa? |
| **Herencia** | Una clase hija reutiliza y extiende a la padre ("es un") | ¿De verdad X *es un* Y? |
| **Polimorfismo** | La misma llamada, y cada objeto responde a su manera | ¿Puedo evitar preguntar por el tipo? |`,
        `## Summary
| Pillar | In one sentence | Ask yourself |
|---|---|---|
| **Encapsulation** | The object looks after its data: it changes through methods that check the rules | Who can change this? |
| **Abstraction** | Shows what it does and hides how | What does the user need to know? |
| **Inheritance** | A child class reuses and extends the parent ("is a") | Is X truly *a* Y? |
| **Polymorphism** | The same call, and each object answers its own way | Can I avoid asking for the type? |`,
      ),
    ],
    quiz: [
      // Los índices de las preguntas identifican sus tarjetas de repaso: agrega nuevas al final
      q('Que los datos de un objeto solo cambien a través de sus métodos, que revisan las reglas, es…', 'An object\'s data changing only through its methods, which check the rules, is…', [['Herencia', 'Inheritance'], ['Encapsulamiento', 'Encapsulation'], ['Polimorfismo', 'Polymorphism'], ['Recursión', 'Recursion']], 1,
        'Como el cajero automático: no abres la caja fuerte, se lo pides y él revisa que tengas saldo.', 'Like the ATM: you do not open the vault, you ask and it checks your balance.'),
      q('Recorres una lista de figuras y llamas `f.area()`; cada figura calcula su área con su propia fórmula. Eso es…', 'You loop over a list of shapes calling `f.area()`; each shape computes its area with its own formula. That is…', [['Polimorfismo', 'Polymorphism'], ['Encapsulamiento', 'Encapsulation'], ['Composición', 'Composition'], ['Sobrecarga', 'Overloading']], 0,
        'La misma llamada y cada objeto responde a su manera, sin que el ciclo pregunte qué figura es.', 'The same call and each object answers its own way, without the loop asking which shape it is.'),
      q('¿Cuál es la diferencia entre una clase y un objeto?', 'What is the difference between a class and an object?', [['Son lo mismo con distinto nombre', 'They are the same thing with different names'], ['El objeto es el molde y la clase es la cosa concreta', 'The object is the mold and the class is the concrete thing'], ['La clase es el molde; el objeto es una cosa concreta hecha con ese molde', 'The class is the mold; the object is a concrete thing made from it'], ['La clase guarda solo datos y el objeto solo funciones', 'The class only holds data and the object only functions']], 2,
        'Como el plano de una casa (clase) y cada casa construida con él (objetos). `Perro` es la clase; `firulais` es un objeto.', 'Like a house blueprint (class) and each house built from it (objects). `Perro` is the class; `firulais` is an object.'),
      q('Dentro de un método, ¿qué es `self`?', 'Inside a method, what is `self`?', [['La clase completa', 'The whole class'], ['El objeto con el que se llamó al método', 'The object the method was called on'], ['Una variable global del programa', 'A global variable of the program'], ['El valor que devuelve el método', 'The value the method returns']], 1,
        'Con `firulais.saludar()`, dentro de `saludar` el `self` es `firulais`; por eso `self.nombre` es "Firulais".', 'With `firulais.saludar()`, inside `saludar` `self` is `firulais`; that is why `self.nombre` is "Firulais".'),
      q('¿Cuándo se ejecuta `__init__`?', 'When does `__init__` run?', [['Cada vez que llamas cualquier método', 'Every time you call any method'], ['Solo si lo llamas a mano', 'Only if you call it by hand'], ['Al terminar el programa', 'When the program ends'], ['Al crear un objeto, por ejemplo con `Perro("Luna", 5)`', 'When an object is created, e.g. with `Perro("Luna", 5)`']], 3,
        'Se ejecuta solo al crear el objeto: recibe los datos iniciales y los guarda en él.', 'It runs by itself when the object is created: it receives the initial data and stores it.'),
      q('En Python, ¿qué significa el guion bajo de `self._saldo`?', 'In Python, what does the underscore in `self._saldo` mean?', [['Que es interno y se debe usar a través de métodos; es una convención, el lenguaje no lo impide', 'That it is internal and should be used through methods; it is a convention, the language does not block it'], ['Que Python prohíbe usarlo desde fuera', 'That Python forbids using it from outside'], ['Que el atributo no se puede cambiar nunca', 'That the attribute can never change'], ['Nada: es obligatorio en todos los atributos', 'Nothing: it is required on every attribute']], 0,
        'Es un aviso para otros programadores. En Java o C# se usa `private` y ahí el compilador sí lo impide.', 'It is a warning for other programmers. Java or C# use `private`, and there the compiler does block it.'),
      q('Usas `preparar_cafe()` sin saber que por dentro calienta agua y muele granos. ¿Qué pilar es?', 'You call `preparar_cafe()` without knowing that inside it heats water and grinds beans. Which pillar is it?', [['Herencia', 'Inheritance'], ['Abstracción', 'Abstraction'], ['Composición', 'Composition'], ['Sobrecarga', 'Overloading']], 1,
        'Abstracción: muestra qué hace y esconde cómo lo hace, como el volante y los pedales de un auto.', 'Abstraction: it shows what it does and hides how, like a car\'s wheel and pedals.'),
      q('¿Qué pregunta responde el **encapsulamiento** (y no la abstracción)?', 'Which question does **encapsulation** answer (and not abstraction)?', [['¿Qué necesita saber quien lo usa?', 'What does the user need to know?'], ['¿De qué clase hereda?', 'Which class does it inherit from?'], ['¿Quién puede cambiar los datos?', 'Who can change the data?'], ['¿Cuántos objetos se pueden crear?', 'How many objects can be created?']], 2,
        'Encapsulamiento: quién puede cambiar los datos (solo el objeto). Abstracción: qué necesita saber quien lo usa (qué hace, no cómo).', 'Encapsulation: who can change the data (only the object). Abstraction: what the user needs to know (what it does, not how).'),
      q('`class Gato(Animal):` no escribe su propio `__init__`. Al crear `Gato("Luna")`…', '`class Gato(Animal):` does not write its own `__init__`. When you create `Gato("Luna")`…', [['Usa el `__init__` que heredó de `Animal` y guarda el nombre', 'It uses the `__init__` inherited from `Animal` and stores the name'], ['Da error porque `Gato` no tiene `__init__`', 'It fails because `Gato` has no `__init__`'], ['Crea el gato sin nombre', 'It creates the cat with no name'], ['Hay que copiar el `__init__` de `Animal` en `Gato`', 'You must copy `Animal`\'s `__init__` into `Gato`']], 0,
        'La hija recibe todo lo de la padre, incluido `__init__`. Por eso la herencia evita repetir código.', 'The child gets everything from the parent, including `__init__`. That is why inheritance avoids repeating code.'),
      q('`Perro` vuelve a escribir el método `sonido()` que heredó de `Animal`. Eso se llama…', '`Perro` writes again the `sonido()` method it inherited from `Animal`. That is called…', [['Sobrecarga (overload)', 'Overloading'], ['Composición', 'Composition'], ['Encapsulamiento', 'Encapsulation'], ['Sobrescritura (override)', 'Overriding']], 3,
        'Sobrescribir es redefinir en la hija un método heredado. Es la forma de lograr el polimorfismo.', 'Overriding is redefining an inherited method in the child. It is how polymorphism is achieved.'),
      q('¿Qué ganas con polimorfismo en vez de `if tipo == "perro": … elif tipo == "gato": …`?', 'What do you gain with polymorphism instead of `if tipo == "perro": … elif tipo == "gato": …`?', [['El programa corre más rápido', 'The program runs faster'], ['Agregar un tipo nuevo no obliga a tocar el código que usa los objetos', 'Adding a new type does not force you to touch the code that uses the objects'], ['Ya no hacen falta clases', 'Classes are no longer needed'], ['Los objetos ocupan menos memoria', 'Objects use less memory']], 1,
        'Si agregas `class Vaca(Animal)` con su `sonido`, el ciclo que llama `animal.sonido()` sigue funcionando sin cambios.', 'If you add `class Vaca(Animal)` with its `sonido`, the loop that calls `animal.sonido()` keeps working unchanged.'),
      q('`Figura` hereda de `ABC` y tiene `area` marcado con `@abstractmethod`. ¿Qué pasa si escribes `Figura()`?', '`Figura` inherits from `ABC` and has `area` marked with `@abstractmethod`. What happens if you write `Figura()`?', [['Crea una figura con área 0', 'It creates a shape with area 0'], ['Crea la figura, pero `area()` devuelve `None`', 'It creates the shape, but `area()` returns `None`'], ['Da error: no se pueden crear objetos de una clase abstracta', 'It fails: you cannot create objects from an abstract class'], ['Nada especial: `ABC` es solo un comentario', 'Nothing special: `ABC` is just a comment']], 2,
        'Una clase abstracta es un molde que obliga a sus hijas: solo se crean objetos de hijas concretas como `Circulo` o `Cuadrado`.', 'An abstract class is a mold that sets rules for its children: you only create objects of concrete children like `Circulo` or `Cuadrado`.'),
      q('¿Qué distingue a una **interfaz** (como las de Java) de una clase abstracta?', 'What sets an **interface** (like Java\'s) apart from an abstract class?', [['Solo lista métodos obligatorios, sin datos ni código', 'It only lists required methods, with no data or code'], ['Se pueden crear objetos de ella', 'You can create objects from it'], ['Solo puede tener un método', 'It can only have one method'], ['Solo existe en Python', 'It only exists in Python']], 0,
        'La clase abstracta puede tener datos y código; la interfaz es solo el contrato. Una clase puede cumplir varias interfaces pero heredar de una sola clase.', 'An abstract class can have data and code; an interface is only the contract. A class can fulfill several interfaces but inherit from only one class.'),
      q('Un `Celular` guarda una `Bateria` en `self.bateria` y le pide su estado. ¿Qué relación es?', 'A `Celular` (phone) stores a `Bateria` (battery) in `self.bateria` and asks it for its status. Which relation is it?', [['Herencia: el celular es una batería', 'Inheritance: the phone is a battery'], ['Polimorfismo', 'Polymorphism'], ['Sobrecarga', 'Overloading'], ['Composición: el celular tiene una batería', 'Composition: the phone has a battery']], 3,
        '"Tiene un" → composición: guarda el objeto como atributo y le delega trabajo.', '"Has a" → composition: it stores the object as an attribute and delegates work to it.'),
      q('¿Por qué muchas veces se prefiere composición sobre herencia?', 'Why is composition often preferred over inheritance?', [['La composición hace el programa más rápido', 'Composition makes the program faster'], ['Python no permite heredar más de una vez', 'Python does not allow inheriting more than once'], ['La herencia amarra a las hijas con la padre; con composición cambias piezas fácilmente', 'Inheritance ties children to the parent; with composition you swap parts easily'], ['Con composición no hacen falta métodos', 'With composition you do not need methods']], 2,
        'Un cambio en la clase padre puede romper a todas las hijas. Con composición cambias una pieza (como la batería) sin tocar las clases.', 'A change in the parent can break every child. With composition you swap a part (like the battery) without touching the classes.'),
      q('En una clase de Python escribes dos métodos `sumar` con distinta cantidad de parámetros. ¿Qué pasa?', 'In a Python class you write two `sumar` methods with a different number of parameters. What happens?', [['Python elige el correcto según los argumentos', 'Python picks the right one by the arguments'], ['El segundo reemplaza al primero: Python no tiene sobrecarga real', 'The second replaces the first: Python has no real overloading'], ['Da error al definir la clase', 'It fails when the class is defined'], ['Se combinan en un solo método', 'They merge into a single method']], 1,
        'Elegir según los parámetros es la sobrecarga de Java o C++. En Python se imita con parámetros opcionales o `functools.singledispatch`.', 'Picking by parameters is Java or C++ overloading. In Python it is emulated with optional parameters or `functools.singledispatch`.'),
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
    summary: l('Cinco principios para escribir código fácil de cambiar, cada uno con el problema que evita, un ejemplo y cómo reconocer cuando se rompe.', 'Five principles for code that is easy to change, each with the problem it prevents, an example and how to spot when it is broken.'),
    minutes: 24,
    blocks: [
      md(
        `## ¿Para qué sirve SOLID?
Hay código que funciona hoy pero es una pesadilla de cambiar: tocas una cosa y se rompe otra que no tenía nada que ver. **SOLID** son cinco principios, propuestos por Robert C. Martin, para escribir código **fácil de cambiar y de probar**. Cada letra es un principio.

Son **guías, no leyes**: sirven para detectar problemas de diseño, no para aplicarse a ciegas.

Un detalle de Python que vas a ver en los ejemplos: \`f"Total: {x}"\` es un **f-string**, un texto que mete el valor de \`x\` donde están las llaves.

## S — Responsabilidad única
**La idea:** una clase debe tener **una sola razón para cambiar**, es decir, un solo trabajo.

**El problema que evita:** si una clase calcula, da formato y guarda, cualquier cambio en cualquiera de esas tres cosas la toca, y es fácil romper una al arreglar otra.

**Analogía:** una navaja suiza es práctica, pero si se rompe la tijera tienes que mandar a arreglar toda la navaja.

**Señal de alerta:** para describir lo que hace la clase necesitas la palabra "y" ("calcula el total **y** lo imprime **y** lo guarda").`,
        `## What is SOLID for?
Some code works today but is a nightmare to change: you touch one thing and something unrelated breaks. **SOLID** is five principles, proposed by Robert C. Martin, for writing code that is **easy to change and to test**. Each letter is a principle.

They are **guidelines, not laws**: they help you spot design problems, not to be applied blindly.

A Python detail you will see in the examples: \`f"Total: {x}"\` is an **f-string**, a text that inserts the value of \`x\` where the braces are.

## S — Single responsibility
**The idea:** a class should have **only one reason to change**, that is, a single job.

**The problem it prevents:** if a class computes, formats and saves, any change to any of those three things touches it, and it is easy to break one while fixing another.

**Analogy:** a Swiss army knife is handy, but if the scissors break you have to send the whole knife for repair.

**Warning sign:** to describe what the class does you need the word "and" ("it computes the total **and** prints it **and** saves it").`,
      ),
      code(`# ❌ Una clase con tres razones para cambiar
class Reporte:
    def __init__(self, ventas):
        self.ventas = ventas
    def total(self):                      # cálculo
        return sum(self.ventas)
    def como_texto(self):                 # formato
        return f"Total: {self.total()}"
    def guardar(self, ruta):              # almacenamiento
        pass                              # aquí escribiría un archivo

# ✅ Cada clase con un solo trabajo
class Ventas:
    def __init__(self, montos):
        self.montos = montos
    def total(self):
        return sum(self.montos)

class FormatoTexto:
    def mostrar(self, ventas):
        return f"Total: {ventas.total()}"

print(FormatoTexto().mostrar(Ventas([100, 250])))   # imprime: Total: 350`),
      md(
        `## O — Abierto/cerrado
**La idea:** el código debe estar **abierto a extensión** pero **cerrado a modificación**: para agregar comportamiento nuevo, **agregas código nuevo** (por ejemplo, una clase) en vez de editar el que ya funciona.

**El problema que evita:** una función con un \`if/elif\` por cada caso. Cada caso nuevo obliga a abrirla y editarla, con el riesgo de romper los que ya servían.

**Cómo se logra:** con **polimorfismo** (lo viste en OOP). Una clase base define el método y cada caso es una subclase con su propia versión. En la clase base, \`raise NotImplementedError\` significa "las hijas deben escribir este método": si alguien llama a la versión de la base, Python lanza un error.

**Analogía:** una regleta de enchufes. Para conectar un aparato nuevo no recableas la casa: lo conectas a un enchufe libre.`,
        `## O — Open/closed
**The idea:** code should be **open for extension** but **closed for modification**: to add new behavior, you **add new code** (for example, a class) instead of editing code that already works.

**The problem it prevents:** a function with an \`if/elif\` for each case. Every new case forces you to open and edit it, risking breaking the ones that already worked.

**How it is done:** with **polymorphism** (you saw it in OOP). A base class defines the method and each case is a subclass with its own version. In the base class, \`raise NotImplementedError\` means "the children must write this method": if someone calls the base version, Python raises an error.

**Analogy:** a power strip. To plug in a new appliance you do not rewire the house: you plug it into a free socket.`,
      ),
      code(`# ❌ Cada método de pago nuevo obliga a editar esta función
def pagar(tipo, monto):
    if tipo == "tarjeta":
        return f"Cobrando {monto} a tarjeta"
    elif tipo == "paypal":
        return f"Cobrando {monto} vía PayPal"

# ✅ Abierto a extensión: un método de pago nuevo es una clase nueva
class MetodoPago:
    def pagar(self, monto):
        raise NotImplementedError         # cada hija debe escribir su propio pagar

class Tarjeta(MetodoPago):
    def pagar(self, monto):
        return f"Cobrando {monto} a tarjeta"

class Cripto(MetodoPago):                  # nuevo: no hubo que tocar procesar
    def pagar(self, monto):
        return f"Cobrando {monto} en cripto"

def procesar(metodo, monto):
    return metodo.pagar(monto)

print(procesar(Tarjeta(), 100))            # imprime: Cobrando 100 a tarjeta
print(procesar(Cripto(), 30))              # imprime: Cobrando 30 en cripto`),
      md(
        `## L — Sustitución de Liskov
**La idea:** una subclase debe poder usarse **en cualquier lugar donde se espera su clase padre**, sin que el código que la usa se lleve sorpresas. La hija debe cumplir las mismas promesas que el padre.

**El ejemplo clásico:** \`Cuadrado\` heredando de \`Rectangulo\`. Suena lógico ("un cuadrado *es un* rectángulo"), pero:
- De un rectángulo esperas que, si cambias su **base**, la **altura siga igual**. Una función que pone la base en 10 espera que el área sea 10 × altura.
- Un cuadrado no puede cumplir eso: si cambias su base, para seguir siendo cuadrado tiene que cambiar también la altura. La función recibe un área distinta a la que esperaba.

La subclase no se comporta como su padre: **viola Liskov**. La solución es no forzar esa herencia; la relación "es un" debe cumplirse en el **comportamiento**, no solo en el nombre.

**Señales de alerta:** una subclase que lanza un error en un método que el padre sí hacía, o que lo sobrescribe para hacer algo muy distinto.`,
        `## L — Liskov substitution
**The idea:** a subclass must be usable **anywhere its parent class is expected**, without surprising the code that uses it. The child must keep the same promises as the parent.

**The classic example:** \`Cuadrado\` (square) inheriting from \`Rectangulo\` (rectangle). It sounds logical ("a square *is a* rectangle"), but:
- From a rectangle you expect that, if you change its **base**, the **height stays the same**. A function that sets the base to 10 expects the area to be 10 × height.
- A square cannot keep that promise: if you change its base, to stay a square it must change the height too. The function gets a different area from the one it expected.

The subclass does not behave like its parent: it **violates Liskov**. The fix is not to force that inheritance; the "is a" relation must hold in **behavior**, not just in name.

**Warning signs:** a subclass that raises an error in a method the parent did support, or that overrides it to do something very different.`,
      ),
      md(
        `## I — Segregación de interfaces
**La idea:** es mejor tener **varias interfaces pequeñas** que una enorme. Ninguna clase debería verse obligada a escribir métodos que no usa.

**Ejemplo:** una interfaz \`Trabajador\` con \`trabajar()\` y \`comer()\`. Una clase \`Robot\` trabaja pero no come, y aun así tendría que escribir un \`comer()\` que no tiene sentido. Mejor dos interfaces: \`Trabajador\` (con \`trabajar\`) y \`Comensal\` (con \`comer\`); cada clase cumple solo las que le corresponden.

**Analogía:** un control remoto con 80 botones cuando solo usas 5. Mejor un control sencillo para lo que de verdad necesitas.

## D — Inversión de dependencias
**La idea:** depende de **abstracciones** (lo que algo sabe hacer), no de clases concretas. Las reglas importantes de tu programa no deberían depender de detalles como qué base de datos o qué servicio de correo usas.

**Cómo se aplica en la práctica: inyección de dependencias.** En vez de que una clase **cree** sus dependencias por dentro, **se las pasas desde fuera**, normalmente por el constructor. Así puedes cambiarlas sin tocar la clase, por ejemplo, pasarle una versión **falsa** en las pruebas para no enviar correos de verdad.

**Analogía:** un celular depende del **puerto USB**, no de una marca de cargador: cualquier cargador que cumpla con USB sirve.`,
        `## I — Interface segregation
**The idea:** it is better to have **several small interfaces** than one huge one. No class should be forced to write methods it does not use.

**Example:** a \`Worker\` interface with \`work()\` and \`eat()\`. A \`Robot\` class works but does not eat, and still it would have to write an \`eat()\` that makes no sense. Better two interfaces: \`Worker\` (with \`work\`) and \`Eater\` (with \`eat\`); each class fulfills only the ones that apply.

**Analogy:** a remote control with 80 buttons when you only use 5. Better a simple remote for what you really need.

## D — Dependency inversion
**The idea:** depend on **abstractions** (what something can do), not on concrete classes. Your program's important rules should not depend on details like which database or which email service you use.

**How it is applied in practice: dependency injection.** Instead of a class **creating** its dependencies inside, **you pass them in from outside**, usually through the constructor. That way you can swap them without touching the class, for example passing a **fake** version in tests so no real emails are sent.

**Analogy:** a phone depends on the **USB port**, not on a charger brand: any charger that follows USB works.`,
      ),
      code(`class CorreoReal:
    def enviar(self, msg):
        return "enviando correo: " + msg   # en la vida real se conectaría a un servidor

class CorreoFalso:                          # para pruebas: no envía nada, solo guarda
    def __init__(self):
        self.enviados = []
    def enviar(self, msg):
        self.enviados.append(msg)
        return "guardado"

class Registro:
    def __init__(self, correo):             # la dependencia llega desde fuera
        self.correo = correo
    def registrar(self, nombre):
        return self.correo.enviar("Bienvenida, " + nombre)

print(Registro(CorreoReal()).registrar("Ana"))   # imprime: enviando correo: Bienvenida, Ana

falso = CorreoFalso()
Registro(falso).registrar("Luis")
print(falso.enviados)                            # imprime: ['Bienvenida, Luis']`),
      tip('No apliques SOLID a ciegas: en código pequeño, demasiadas clases y abstracciones también son un problema (**sobreingeniería**). Úsalo cuando el código de verdad va a crecer o cambiar.', 'Do not apply SOLID blindly: in small code, too many classes and abstractions are a problem too (**over-engineering**). Use it when the code is really going to grow or change.'),
      md(
        `## Resumen
| Letra | Principio | En una frase | Señal de que se rompe |
|---|---|---|---|
| **S** | Responsabilidad única | Una sola razón para cambiar | Describirla necesita "y… y…" |
| **O** | Abierto/cerrado | Extender agregando código, sin editar el que funciona | Un \`if/elif\` que crece con cada caso nuevo |
| **L** | Sustitución de Liskov | La hija sirve donde se espera al padre | La hija lanza errores o cambia lo que el padre prometía |
| **I** | Segregación de interfaces | Varias interfaces pequeñas mejor que una enorme | Clases obligadas a escribir métodos que no usan |
| **D** | Inversión de dependencias | Depender de abstracciones; recibir las dependencias desde fuera | Una clase que crea por dentro su base de datos o su servicio |`,
        `## Summary
| Letter | Principle | In one sentence | Sign it is broken |
|---|---|---|---|
| **S** | Single responsibility | Only one reason to change | Describing it needs "and… and…" |
| **O** | Open/closed | Extend by adding code, without editing working code | An \`if/elif\` that grows with every new case |
| **L** | Liskov substitution | The child works wherever the parent is expected | The child raises errors or changes what the parent promised |
| **I** | Interface segregation | Several small interfaces beat one huge one | Classes forced to write methods they do not use |
| **D** | Dependency inversion | Depend on abstractions; receive dependencies from outside | A class that creates its database or service inside |`,
      ),
    ],
    quiz: [
      q('"Una clase debe tener una sola razón para cambiar" es…', '"A class should have one reason to change" is…', [['S', 'S'], ['O', 'O'], ['L', 'L'], ['D', 'D']], 0, 'Responsabilidad única.', 'Single responsibility.'),
      q('Recibir dependencias por el constructor en lugar de crearlas dentro aplica…', 'Receiving dependencies through the constructor instead of creating them inside applies…', [['Liskov', 'Liskov'], ['Inversión de dependencias', 'Dependency inversion'], ['Segregación de interfaces', 'Interface segregation'], ['Abierto/cerrado', 'Open/closed']], 1,
        'Dependes de una abstracción que te pasan desde fuera.', 'You depend on an abstraction passed in from outside.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué imprime `nombre = "Ana"; print(f"Hola, {nombre}")`?', 'What does `nombre = "Ana"; print(f"Hola, {nombre}")` print?', [['Hola, {nombre}', 'Hola, {nombre}'], ['Hola, Ana', 'Hola, Ana'], ['f"Hola, Ana"', 'f"Hola, Ana"'], ['Da error', 'It fails']], 1,
        'Un f-string mete el valor de la variable donde están las llaves.', 'An f-string inserts the variable\'s value where the braces are.'),
      q('Una clase `Usuario` valida los datos, los guarda en la base de datos y manda el correo de bienvenida. ¿Qué principio rompe?', 'A `User` class validates data, saves it to the database and sends the welcome email. Which principle does it break?', [['Liskov', 'Liskov'], ['Abierto/cerrado', 'Open/closed'], ['Responsabilidad única', 'Single responsibility'], ['Segregación de interfaces', 'Interface segregation']], 2,
        'Tiene tres razones para cambiar. Se separa en clases con un trabajo cada una.', 'It has three reasons to change. Split it into classes with one job each.'),
      q('Agregas un método de pago nuevo creando la clase `Cripto`, sin tocar la función `procesar`. ¿Qué principio estás cumpliendo?', 'You add a new payment method by creating the `Cripto` class, without touching `procesar`. Which principle are you following?', [['Abierto/cerrado', 'Open/closed'], ['Responsabilidad única', 'Single responsibility'], ['Liskov', 'Liskov'], ['Ninguno', 'None']], 0,
        'Extiendes agregando código nuevo, sin modificar el que ya funciona.', 'You extend by adding new code, without modifying code that already works.'),
      q('¿Qué significa `raise NotImplementedError` en un método de una clase base?', 'What does `raise NotImplementedError` mean in a base class method?', [['Que el método ya funciona', 'That the method already works'], ['Que las hijas deben escribir su propia versión; si se usa la de la base, lanza un error', 'That the children must write their own version; if the base one is used, it raises an error'], ['Que el método se borra', 'That the method is deleted'], ['Que Python lo ignora', 'That Python ignores it']], 1,
        'Es una forma de marcar un método que cada subclase debe completar.', 'It is a way to mark a method that each subclass must complete.'),
      q('¿Qué pide el principio de sustitución de Liskov?', 'What does the Liskov substitution principle require?', [['Que toda clase tenga hijas', 'That every class has children'], ['Que una subclase pueda usarse donde se espera a su padre sin sorpresas', 'That a subclass can be used wherever its parent is expected without surprises'], ['Que no se use herencia', 'That inheritance is not used'], ['Que los métodos sean cortos', 'That methods are short']], 1,
        'La hija debe cumplir las mismas promesas que el padre.', 'The child must keep the same promises as the parent.'),
      q('¿Por qué `Cuadrado` heredando de `Rectangulo` viola Liskov?', 'Why does `Cuadrado` inheriting from `Rectangulo` violate Liskov?', [['Porque los cuadrados no tienen área', 'Because squares have no area'], ['Porque al cambiar la base de un cuadrado también cambia su altura, y el código que esperaba un rectángulo se lleva una sorpresa', 'Because changing a square\'s base also changes its height, and code expecting a rectangle is surprised'], ['Porque Python no permite esa herencia', 'Because Python does not allow that inheritance'], ['No la viola', 'It does not violate it']], 1,
        'De un rectángulo esperas que cambiar la base deje la altura igual.', 'From a rectangle you expect changing the base to leave the height the same.'),
      q('Una clase `Robot` está obligada a escribir un método `comer()` que no tiene sentido para ella. ¿Qué principio se rompe?', 'A `Robot` class is forced to write an `eat()` method that makes no sense for it. Which principle is broken?', [['Segregación de interfaces', 'Interface segregation'], ['Abierto/cerrado', 'Open/closed'], ['Responsabilidad única', 'Single responsibility'], ['Inversión de dependencias', 'Dependency inversion']], 0,
        'La interfaz es demasiado grande: se divide en interfaces pequeñas.', 'The interface is too big: split it into small interfaces.'),
      q('¿Qué ventaja da la inyección de dependencias en las pruebas?', 'What advantage does dependency injection give in tests?', [['Que las pruebas no hacen falta', 'That tests are not needed'], ['Que puedes pasarle a la clase una versión falsa (sin base de datos ni correos reales)', 'That you can pass the class a fake version (no real database or emails)'], ['Que el código corre más rápido en producción', 'That the code runs faster in production'], ['Ninguna', 'None']], 1,
        'Como `CorreoFalso`, que guarda los mensajes en vez de enviarlos.', 'Like `CorreoFalso`, which stores messages instead of sending them.'),
      q('¿Cuál de estas clases **no** sigue la inversión de dependencias?', 'Which of these classes does **not** follow dependency inversion?', [['Una que recibe su repositorio en el constructor', 'One that receives its repository in the constructor'], ['Una que crea `PostgresRepo()` dentro de su `__init__`', 'One that creates `PostgresRepo()` inside its `__init__`'], ['Una que recibe una función para enviar mensajes', 'One that receives a function to send messages'], ['Una sin dependencias', 'One with no dependencies']], 1,
        'Queda amarrada a una base de datos concreta y no la puedes cambiar en las pruebas.', 'It is tied to a concrete database and you cannot swap it in tests.'),
      q('¿Siempre conviene aplicar SOLID al pie de la letra?', 'Should you always apply SOLID to the letter?', [['Sí, en todo el código', 'Yes, in all code'], ['No: en código pequeño, demasiadas abstracciones son sobreingeniería', 'No: in small code, too many abstractions are over-engineering'], ['Solo en Python', 'Only in Python'], ['Solo en pruebas', 'Only in tests']], 1,
        'Son guías para código que va a crecer o cambiar.', 'They are guidelines for code that is going to grow or change.'),
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
    summary: l('Qué es un patrón de diseño y cinco de los más preguntados (Strategy, Observer, Factory, Adapter y Singleton): el problema que resuelve cada uno y un ejemplo.', 'What a design pattern is and five of the most asked about (Strategy, Observer, Factory, Adapter and Singleton): the problem each solves and an example.'),
    minutes: 24,
    blocks: [
      md(
        `## ¿Qué es un patrón de diseño?
Un **patrón de diseño** es una **solución conocida, con nombre**, para un problema de diseño que aparece una y otra vez. No es código para copiar: es una forma probada de organizar clases y objetos. El libro que los hizo famosos (*Design Patterns*, de 1994, del grupo conocido como *Gang of Four*) describe 23.

**Por qué importan:** dan un **vocabulario común**. Decir "aquí usé Observer" le explica a otro programador en dos palabras cómo está armado tu código.

Se agrupan en tres familias:
| Familia | De qué trata | Ejemplos de esta lección |
|---|---|---|
| **Creacionales** | Cómo **crear** objetos | Factory, Singleton |
| **Estructurales** | Cómo **combinar** objetos | Adapter |
| **De comportamiento** | Cómo se **comunican** y reparten el trabajo | Strategy, Observer |`,
        `## What is a design pattern?
A **design pattern** is a **known, named solution** to a design problem that shows up again and again. It is not code to copy: it is a proven way to organize classes and objects. The book that made them famous (*Design Patterns*, from 1994, by the group known as the *Gang of Four*) describes 23.

**Why they matter:** they give a **common vocabulary**. Saying "I used Observer here" explains to another programmer in two words how your code is put together.

They are grouped into three families:
| Family | What it is about | Examples in this lesson |
|---|---|---|
| **Creational** | How to **create** objects | Factory, Singleton |
| **Structural** | How to **combine** objects | Adapter |
| **Behavioral** | How objects **communicate** and share work | Strategy, Observer |`,
      ),
      md(
        `## Strategy: algoritmos intercambiables
**El problema:** hay varias formas de hacer lo mismo (cobrar con precio normal o con descuento, calcular un envío normal o express) y hay que elegir una mientras el programa corre. Si lo resuelves con \`if\`s, terminan repetidos por todo el código.

**La idea:** cada forma es una **pieza intercambiable** con la misma interfaz. El objeto guarda la pieza que le dieron y la usa sin saber cuál es. Para cambiar de comportamiento, cambias la pieza.

En Python la pieza puede ser simplemente una **función**: las funciones se pueden guardar en una variable y llamar después. **Sin paréntesis** (\`precio_normal\`) es la función misma; **con paréntesis** (\`precio_normal(100)\`) es el resultado de ejecutarla.

**Analogía:** la app de mapas: "calcular ruta" es siempre el mismo botón, pero eliges la estrategia: en auto, a pie o en bici.`,
        `## Strategy: interchangeable algorithms
**The problem:** there are several ways to do the same thing (charging at normal price or with a discount, computing normal or express shipping) and one must be chosen while the program runs. If you solve it with \`if\`s, they end up repeated all over the code.

**The idea:** each way is an **interchangeable piece** with the same interface. The object keeps the piece it was given and uses it without knowing which one it is. To change behavior, you swap the piece.

In Python the piece can simply be a **function**: functions can be stored in a variable and called later. **Without parentheses** (\`precio_normal\`) it is the function itself; **with parentheses** (\`precio_normal(100)\`) it is the result of running it.

**Analogy:** a maps app: "get directions" is always the same button, but you choose the strategy: by car, on foot or by bike.`,
      ),
      code(`def precio_normal(p):
    return p

def precio_oferta(p):
    return p * 0.7                          # 30% de descuento

class Caja:
    def __init__(self, estrategia):
        self.estrategia = estrategia        # guarda la función, sin paréntesis
    def cobrar(self, precio):
        return self.estrategia(precio)      # la llama cuando la necesita

caja = Caja(precio_normal)
print(caja.cobrar(100))                     # imprime: 100
caja.estrategia = precio_oferta             # cambia la estrategia mientras corre
print(caja.cobrar(100))                     # imprime: 70.0`),
      md(
        `## Observer: avisar a todos los interesados
**El problema:** cuando se crea un pedido, varias partes deben reaccionar: mandar un correo, descontar inventario, actualizar estadísticas. Si el código del pedido llama a cada una directamente, cada reacción nueva obliga a editarlo.

**La idea:** el **publicador** (el evento "pedido creado") guarda una **lista de suscriptores**: funciones que quieren enterarse. Cuando algo pasa, **los llama a todos** con el dato. El publicador no sabe qué hace cada uno; solo avisa. Para agregar una reacción nueva, solo se suscribe otra función.

**Analogía:** suscribirte a un canal de videos: cuando sube uno, todos los suscriptores reciben el aviso, y el canal no necesita conocer a cada uno.

Un detalle: un suscriptor que llega **después** no recibe los avisos que ya pasaron. (\`lambda p: …\` es una función corta, como viste en ordenamiento).`,
        `## Observer: notifying everyone interested
**The problem:** when an order is created, several parts must react: send an email, update inventory, refresh statistics. If the order code calls each one directly, every new reaction forces you to edit it.

**The idea:** the **publisher** (the "order created" event) keeps a **list of subscribers**: functions that want to know. When something happens, it **calls them all** with the data. The publisher does not know what each one does; it just notifies. To add a new reaction, another function just subscribes.

**Analogy:** subscribing to a video channel: when it uploads one, every subscriber gets notified, and the channel does not need to know each of them.

One detail: a subscriber that arrives **later** does not receive the notifications that already happened. (\`lambda p: …\` is a short function, as you saw in sorting.)`,
      ),
      code(`class Evento:
    def __init__(self):
        self._suscriptores = []
    def suscribir(self, fn):
        self._suscriptores.append(fn)        # guarda la función para después
    def emitir(self, dato):
        for fn in self._suscriptores:        # avisa a todos
            fn(dato)

pedido_creado = Evento()
pedido_creado.suscribir(lambda p: print("Enviar correo del pedido", p))
pedido_creado.suscribir(lambda p: print("Descontar inventario del pedido", p))
pedido_creado.emitir(42)
# imprime:
# Enviar correo del pedido 42
# Descontar inventario del pedido 42`),
      md(
        `## Factory: un solo lugar que sabe crear
**El problema:** el código que crea objetos queda regado por todos lados (\`if tipo == "push": Push() else: Correo()\`), y todo ese código queda amarrado a las clases concretas.

**La idea:** una función (o clase) **se encarga de crear**. Quien la usa pide un tipo y recibe un objeto listo, con una interfaz común, **sin mencionar la clase concreta**. Si mañana agregas un tipo, cambias solo la fábrica.

**Analogía:** pides "un café" en el mostrador; no necesitas saber qué máquina usan ni cómo se prepara.`,
        `## Factory: a single place that knows how to create
**The problem:** object-creation code ends up scattered everywhere (\`if kind == "push": Push() else: Email()\`), and all that code is tied to the concrete classes.

**The idea:** a function (or class) **is in charge of creating**. Whoever uses it asks for a type and gets a ready object, with a common interface, **without naming the concrete class**. If you add a type tomorrow, you change only the factory.

**Analogy:** you order "a coffee" at the counter; you do not need to know which machine they use or how it is made.`,
      ),
      code(`class Correo:
    def enviar(self, msg):
        return "correo: " + msg

class Push:
    def enviar(self, msg):
        return "push: " + msg

def crear_notificador(tipo):           # el único lugar que conoce las clases concretas
    if tipo == "push":
        return Push()
    return Correo()

n = crear_notificador("push")
print(n.enviar("tu pedido llegó"))     # imprime: push: tu pedido llegó`),
      md(
        `## Adapter: hacer compatibles dos interfaces
**El problema:** usas una librería externa cuya interfaz no coincide con la que espera tu código (por ejemplo, mide en Fahrenheit y tu app trabaja en Celsius, o cobra en centavos y tu app en pesos). No puedes cambiar la librería, y no quieres cambiar todo tu código.

**La idea:** creas una clase **adaptadora** que tiene la interfaz que tu código espera y, por dentro, **traduce** cada llamada a la de la librería. Guarda el objeto externo como atributo: es **composición**.

**Analogía:** el adaptador de enchufe que llevas de viaje: no cambias tu cargador ni la pared, solo pones algo en medio.`,
        `## Adapter: making two interfaces compatible
**The problem:** you use an external library whose interface does not match what your code expects (for example, it measures in Fahrenheit and your app works in Celsius, or it charges in cents and your app in pesos). You cannot change the library, and you do not want to change all your code.

**The idea:** you create an **adapter** class that has the interface your code expects and, inside, **translates** each call into the library's. It stores the external object as an attribute: that is **composition**.

**Analogy:** the plug adapter you take on a trip: you change neither your charger nor the wall, you just put something in between.`,
      ),
      code(`class SensorExterno:                   # librería externa: mide en Fahrenheit
    def leer_f(self):
        return 212

class AdaptadorSensor:                  # tu app espera leer_celsius()
    def __init__(self, sensor):
        self.sensor = sensor            # guarda el objeto externo (composición)
    def leer_celsius(self):
        return (self.sensor.leer_f() - 32) * 5 / 9   # traduce la llamada

print(AdaptadorSensor(SensorExterno()).leer_celsius())   # imprime: 100.0`),
      md(
        `## Singleton: una sola instancia
**El problema:** de algunas cosas debe existir **exactamente una** en todo el programa, como la configuración o el registro de mensajes (*logger*).

**La idea:** la clase se asegura de que solo exista una instancia y da acceso global a ella.

**Por qué muchos lo consideran un antipatrón:** es **estado global escondido**. Cualquier parte del programa puede leerlo y cambiarlo, así que el código queda acoplado. En las pruebas es peor: lo que una prueba deja en el singleton lo ve la siguiente, y no puedes sustituirlo fácilmente por una versión falsa.

**Alternativa común:** crea **un solo objeto** al arrancar y **pásalo** a quien lo necesite (inyección de dependencias, de la lección de SOLID). Sigue habiendo uno solo, pero sin estado global. En Python, además, un módulo se carga una sola vez, así que ya funciona como un singleton.`,
        `## Singleton: a single instance
**The problem:** some things must exist **exactly once** in the whole program, like the configuration or the message log (*logger*).

**The idea:** the class makes sure only one instance exists and gives global access to it.

**Why many consider it an anti-pattern:** it is **hidden global state**. Any part of the program can read and change it, so the code becomes coupled. In tests it is worse: what one test leaves in the singleton the next one sees, and you cannot easily swap it for a fake.

**Common alternative:** create **a single object** at startup and **pass it** to whoever needs it (dependency injection, from the SOLID lesson). There is still only one, but without global state. In Python, also, a module is loaded only once, so it already works like a singleton.`,
      ),
      interview('Pregunta común: "¿Qué patrón has usado en un proyecto?". Ten una historia lista con el problema, el patrón y el resultado, por ejemplo: "Usé Strategy para soportar varios métodos de pago sin llenar el código de if/else; agregar uno nuevo era crear una clase".', 'Common question: "Which pattern have you used in a project?". Have a story ready with the problem, the pattern and the result, e.g. "I used Strategy to support several payment methods without filling the code with if/else; adding a new one meant creating a class".'),
      md(
        `## Resumen
| Patrón | Familia | Úsalo cuando… |
|---|---|---|
| **Strategy** | Comportamiento | Hay varias formas de hacer lo mismo y se elige una mientras corre el programa |
| **Observer** | Comportamiento | Varias partes deben reaccionar cuando algo pasa, sin que el que avisa las conozca |
| **Factory** | Creacional | Quieres un solo lugar que sepa qué clase concreta crear |
| **Adapter** | Estructural | Una librería tiene otra interfaz y necesitas traducirla a la tuya |
| **Singleton** | Creacional | Debe existir una sola instancia (con cuidado: es estado global) |

**Pista:** un \`if tipo == …\` repetido en muchos lugares suele pedir **Strategy** (para el comportamiento) y una **Factory** (para elegir la clase en un solo lugar).`,
        `## Summary
| Pattern | Family | Use it when… |
|---|---|---|
| **Strategy** | Behavioral | There are several ways to do the same thing and one is chosen at runtime |
| **Observer** | Behavioral | Several parts must react when something happens, without the notifier knowing them |
| **Factory** | Creational | You want a single place that knows which concrete class to create |
| **Adapter** | Structural | A library has a different interface and you need to translate it to yours |
| **Singleton** | Creational | There must be only one instance (carefully: it is global state) |

**Hint:** an \`if kind == …\` repeated in many places usually calls for **Strategy** (for the behavior) and a **Factory** (to choose the class in one place).`,
      ),
    ],
    quiz: [
      q('Un sistema de eventos donde varios oyentes reaccionan a un cambio es…', 'An event system where several listeners react to a change is…', [['Factory', 'Factory'], ['Observer', 'Observer'], ['Adapter', 'Adapter'], ['Singleton', 'Singleton']], 1, 'Publicador y suscriptores.', 'Publisher and subscribers.'),
      q('Envolver una librería externa para que cumpla tu interfaz es…', 'Wrapping an external library so it matches your interface is…', [['Adapter', 'Adapter'], ['Strategy', 'Strategy'], ['Observer', 'Observer'], ['Factory', 'Factory']], 0, 'Traduce una interfaz a otra.', 'It translates one interface into another.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué es un patrón de diseño?', 'What is a design pattern?', [['Una librería que se instala', 'A library you install'], ['Una solución conocida y con nombre para un problema de diseño que se repite', 'A known, named solution to a recurring design problem'], ['Un lenguaje de programación', 'A programming language'], ['Una regla de estilo para nombrar variables', 'A style rule for naming variables']], 1,
        'No es código para copiar, sino una forma probada de organizar clases y objetos.', 'It is not code to copy, but a proven way to organize classes and objects.'),
      q('¿Cuáles son las tres familias de patrones?', 'What are the three families of patterns?', [['Rápidos, lentos y medios', 'Fast, slow and medium'], ['Creacionales, estructurales y de comportamiento', 'Creational, structural and behavioral'], ['Simples, dobles y triples', 'Simple, double and triple'], ['Públicos, privados y protegidos', 'Public, private and protected']], 1,
        'Crear objetos, combinarlos y cómo se comunican.', 'Creating objects, combining them and how they communicate.'),
      q('¿Qué problema resuelve **Strategy**?', 'What problem does **Strategy** solve?', [['Crear una sola instancia', 'Creating a single instance'], ['Elegir mientras corre el programa entre varias formas de hacer lo mismo, sin `if`s repetidos', 'Choosing at runtime between several ways to do the same thing, without repeated `if`s'], ['Avisar a varios suscriptores', 'Notifying several subscribers'], ['Traducir una interfaz', 'Translating an interface']], 1,
        'Cada forma es una pieza intercambiable con la misma interfaz.', 'Each way is an interchangeable piece with the same interface.'),
      q('`caja.estrategia = precio_oferta` frente a `caja.estrategia = precio_oferta(100)`: ¿cuál guarda la función?', '`caja.estrategia = precio_oferta` versus `caja.estrategia = precio_oferta(100)`: which one stores the function?', [['La segunda', 'The second'], ['Las dos', 'Both'], ['La primera, sin paréntesis; la segunda guarda el resultado (un número)', 'The first, without parentheses; the second stores the result (a number)'], ['Ninguna', 'Neither']], 2,
        'Con paréntesis la función se ejecuta en ese momento.', 'With parentheses the function runs right then.'),
      q('En Observer, ¿qué sabe el publicador sobre lo que hace cada suscriptor?', 'In Observer, what does the publisher know about what each subscriber does?', [['Todo: llama a cada uno por su nombre', 'Everything: it calls each by name'], ['Nada: solo los llama a todos con el dato', 'Nothing: it just calls them all with the data'], ['Solo sabe del primero', 'It only knows about the first'], ['Depende del dato', 'It depends on the data']], 1,
        'Por eso puedes agregar reacciones nuevas sin tocar el publicador.', 'That is why you can add new reactions without touching the publisher.'),
      q('Un suscriptor se agrega **después** de que el evento ya se emitió una vez. ¿Recibe ese aviso?', 'A subscriber is added **after** the event was already emitted once. Does it get that notification?', [['Sí, lo recibe al suscribirse', 'Yes, it gets it when subscribing'], ['No, solo recibe los que se emitan desde ahora', 'No, it only gets the ones emitted from now on'], ['Lo recibe dos veces', 'It gets it twice'], ['Da error', 'It fails']], 1,
        '`emitir` solo recorre la lista de suscriptores que hay en ese momento.', '`emitir` only walks the subscribers there at that moment.'),
      q('¿Para qué sirve una **Factory**?', 'What is a **Factory** for?', [['Para que haya un solo lugar que decida qué clase concreta crear', 'So there is a single place that decides which concrete class to create'], ['Para borrar objetos', 'To delete objects'], ['Para ordenar objetos', 'To sort objects'], ['Para avisar cambios', 'To notify changes']], 0,
        'Quien la usa pide un tipo y recibe el objeto sin mencionar su clase.', 'Whoever uses it asks for a type and gets the object without naming its class.'),
      q('¿Cómo se relaciona el **Adapter** con la librería que adapta?', 'How does the **Adapter** relate to the library it adapts?', [['Hereda de ella', 'It inherits from it'], ['La modifica por dentro', 'It modifies it internally'], ['La guarda como atributo (composición) y traduce las llamadas', 'It stores it as an attribute (composition) and translates the calls'], ['La copia', 'It copies it']], 2,
        'Como un adaptador de enchufe: se pone en medio sin cambiar ninguno de los dos lados.', 'Like a plug adapter: it goes in between without changing either side.'),
      q('Tu `Logger` es un Singleton y las pruebas empiezan a afectarse entre sí. ¿Por qué?', 'Your `Logger` is a Singleton and your tests start affecting each other. Why?', [['Porque el logger es lento', 'Because the logger is slow'], ['Porque la única instancia es estado global: lo que deja una prueba lo ve la siguiente', 'Because the single instance is global state: what one test leaves, the next sees'], ['Porque Python no permite singletons', 'Because Python does not allow singletons'], ['No se afectan', 'They do not']], 1,
        'Además no puedes sustituirlo fácilmente por una versión falsa.', 'Also you cannot easily swap it for a fake version.'),
      q('¿Cuál es una alternativa común al Singleton?', 'What is a common alternative to Singleton?', [['Crear un objeto nuevo en cada función', 'Creating a new object in every function'], ['Crear un solo objeto al arrancar y pasarlo a quien lo necesite (inyección de dependencias)', 'Creating a single object at startup and passing it to whoever needs it (dependency injection)'], ['Usar más variables globales', 'Using more global variables'], ['Usar herencia', 'Using inheritance']], 1,
        'Sigue habiendo uno solo, pero sin estado global escondido.', 'There is still only one, but without hidden global state.'),
      q('Tienes `if tipo == "tarjeta": … elif tipo == "paypal": …` repetido en cinco lugares. ¿Qué aplicas?', 'You have `if kind == "card": … elif kind == "paypal": …` repeated in five places. What do you apply?', [['Singleton', 'Singleton'], ['Strategy (una clase por método de pago) y una Factory para elegirla en un solo lugar', 'Strategy (a class per payment method) and a Factory to choose it in one place'], ['Adapter', 'Adapter'], ['Nada', 'Nothing']], 1,
        'Agregar un método nuevo ya no obliga a editar cinco `if`s.', 'Adding a new method no longer forces editing five `if`s.'),
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
    summary: l('Cómo escribir código que otros entiendan y puedan cambiar: nombres, funciones pequeñas, retornos tempranos, DRY, KISS, YAGNI y buenos comentarios.', 'How to write code others can understand and change: names, small functions, early returns, DRY, KISS, YAGNI and good comments.'),
    minutes: 18,
    blocks: [
      md(
        `## ¿Qué es código limpio?
El código se **lee muchas más veces de las que se escribe**: lo leen tus compañeros, quien lo revisa y tú mismo dentro de seis meses. **Código limpio** es el que se entiende rápido y se puede cambiar sin miedo. No se trata de ser ingenioso, sino de ser **claro**.

## Nombres que revelan intención
Un buen nombre dice **qué es o qué hace** sin necesitar un comentario.
- **Malos:** \`d\`, \`lst2\`, \`datos\`, \`hacer()\`. Obligan a leer todo el código para adivinar.
- **Buenos:** \`dias_desde_ultimo_login\`, \`contar_adultos()\`, \`es_valido\`.

Reglas prácticas:
- Variables con **sustantivos**; funciones con **verbos**; los valores verdadero/falso como **pregunta** (\`es_valido\`, \`tiene_saldo\`).
- Evita abreviaturas que solo tú entiendes.
- Cambia los **números mágicos** (un 18 suelto en el código) por una **constante con nombre**. Por convención, las constantes se escriben en MAYÚSCULAS.
- En Python, la guía oficial de estilo (**PEP 8**) usa \`snake_case\` para variables y funciones y \`CamelCase\` para clases.`,
        `## What is clean code?
Code is **read many more times than it is written**: by your teammates, by whoever reviews it and by you six months from now. **Clean code** is code that is quick to understand and safe to change. It is not about being clever, but about being **clear**.

## Intention-revealing names
A good name says **what something is or does** without needing a comment.
- **Bad:** \`d\`, \`lst2\`, \`data\`, \`do()\`. They force you to read all the code to guess.
- **Good:** \`days_since_last_login\`, \`count_adults()\`, \`is_valid\`.

Practical rules:
- Variables with **nouns**; functions with **verbs**; true/false values as a **question** (\`is_valid\`, \`has_balance\`).
- Avoid abbreviations only you understand.
- Replace **magic numbers** (a loose 18 in the code) with a **named constant**. By convention, constants are written in UPPERCASE.
- In Python, the official style guide (**PEP 8**) uses \`snake_case\` for variables and functions and \`CamelCase\` for classes.`,
      ),
      code(`# ❌ ¿Qué es d? ¿Qué hace f? ¿Por qué 18?
def f(l):
    d = 0
    for x in l:
        if x >= 18:
            d += 1
    return d

# ✅ Se entiende sin comentarios
EDAD_ADULTA = 18

def contar_adultos(edades):
    adultos = 0
    for edad in edades:
        if edad >= EDAD_ADULTA:
            adultos += 1
    return adultos

print(f([20, 15, 30]), contar_adultos([20, 15, 30]))   # imprime: 2 2   (mismo resultado, mucho más claro)`),
      md(
        `## Funciones pequeñas que hacen una sola cosa
Si para describir una función necesitas la palabra "y" ("valida los datos **y** calcula el total **y** guarda en la base de datos"), sepárala en varias: \`validar\`, \`calcular_total\`, \`guardar\`. Cada una se entiende, se prueba y se reutiliza por separado.

## Retornos tempranos en vez de \`if\`s anidados
Los \`if\` dentro de \`if\` dentro de \`if\` obligan a llevar la cuenta de todas las condiciones a la vez. Con **retornos tempranos** (también llamados *cláusulas de guarda*):
1. Primero atiendes los **casos especiales o inválidos**, cada uno con su \`return\` inmediato.
2. Al final queda el **caso principal**, sin anidar.`,
        `## Small functions that do one thing
If to describe a function you need the word "and" ("it validates the data **and** computes the total **and** saves to the database"), split it into several: \`validate\`, \`compute_total\`, \`save\`. Each one can be understood, tested and reused on its own.

## Early returns instead of nested \`if\`s
\`if\` inside \`if\` inside \`if\` forces you to keep track of every condition at once. With **early returns** (also called *guard clauses*):
1. First you handle the **special or invalid cases**, each with its own immediate \`return\`.
2. At the end the **main case** remains, without nesting.`,
      ),
      code(`# ❌ Anidado: hay que leer hasta el fondo para entender
def envio(peso, destino):
    if peso > 0:
        if destino == "local":
            return 50
        else:
            if peso < 10:
                return 120
            else:
                return 200
    else:
        return None

# ✅ Retornos tempranos: los casos especiales salen primero
def envio_limpio(peso, destino):
    if peso <= 0:
        return None            # dato inválido: sale de inmediato
    if destino == "local":
        return 50
    if peso < 10:
        return 120
    return 200                 # el caso que queda

print(envio(5, "lejos"), envio_limpio(5, "lejos"), envio_limpio(-1, "local"))   # imprime: 120 120 None`),
      md(
        `## DRY: no te repitas
**DRY** (*Don't Repeat Yourself*): cada regla debe vivir en **un solo lugar**.

**El problema:** si la misma lógica está copiada en dos lugares, un día corriges un error en una copia y te olvidas de la otra. Ahora tu programa hace dos cosas distintas para lo mismo.

**La solución:** saca esa lógica a una función y úsala en los dos lugares. Ojo: no todo código que se *parece* es duplicado; solo lo es si representa **la misma regla**.`,
        `## DRY: do not repeat yourself
**DRY** (*Don't Repeat Yourself*): every rule should live in **a single place**.

**The problem:** if the same logic is copied in two places, one day you fix a bug in one copy and forget the other. Now your program does two different things for the same case.

**The fix:** extract that logic into a function and use it in both places. Careful: not all code that *looks* alike is duplicated; it only is if it represents **the same rule**.`,
      ),
      code(`# ❌ La misma regla de descuento escrita dos veces
precio_camisa = 300 - 300 * 10 // 100
precio_zapatos = 900 - 900 * 10 // 100

# ✅ La regla vive en un solo lugar: si el descuento cambia, cambias una línea
def con_descuento(precio):
    return precio - precio * 10 // 100

print(precio_camisa, con_descuento(300), con_descuento(900))   # imprime: 270 270 810`),
      md(
        `## KISS y YAGNI
- **KISS** (*Keep It Simple*): para lo que sí necesitas, elige **la solución más simple** que funcione. Una línea "ingeniosa" que nadie entiende no es mejor que tres líneas claras.
- **YAGNI** (*You Aren't Gonna Need It*, "no lo vas a necesitar"): **no construyas lo que todavía no necesitas**, aunque sea "por si acaso". Cuesta tiempo, agrega código que hay que mantener y muchas veces la necesidad nunca llega, o llega distinta.

**La diferencia:** KISS habla de **cómo** haces algo; YAGNI, de **si** lo haces.`,
        `## KISS and YAGNI
- **KISS** (*Keep It Simple*): for what you do need, choose **the simplest solution** that works. A "clever" line nobody understands is not better than three clear lines.
- **YAGNI** (*You Aren't Gonna Need It*): **do not build what you do not need yet**, even "just in case". It costs time, adds code to maintain, and often the need never comes, or comes differently.

**The difference:** KISS is about **how** you do something; YAGNI, about **whether** you do it.`,
      ),
      md(
        `## Comentarios: el porqué, no el qué
- **Malo:** \`i += 1  # suma 1 a i\`. Repite lo que el código ya dice.
- **Bueno:** \`# reintentamos 3 veces porque la API a veces falla al arrancar\`. Explica una **decisión** que el código no puede contar.

Si sientes que un código necesita un comentario para explicar **qué** hace, primero intenta mejorar los nombres o extraer una función con un buen nombre. Un comentario desactualizado es peor que no tener comentario.`,
        `## Comments: the why, not the what
- **Bad:** \`i += 1  # add 1 to i\`. It repeats what the code already says.
- **Good:** \`# we retry 3 times because the API sometimes fails at startup\`. It explains a **decision** the code cannot tell.

If you feel some code needs a comment to explain **what** it does, first try improving the names or extracting a well-named function. An outdated comment is worse than no comment.`,
      ),
      interview('En entrevistas de código, usar buenos nombres y extraer funciones auxiliares **suma puntos** aunque el algoritmo sea el mismo: muestra que escribes código que otros pueden mantener.', 'In coding interviews, good names and extracting helper functions **earn points** even if the algorithm is the same: it shows you write code others can maintain.'),
      md(
        `## Resumen
| Práctica | En una frase |
|---|---|
| Nombres | Que digan qué es o qué hace; constantes con nombre en vez de números mágicos |
| Funciones pequeñas | Si necesitas "y" para describirla, sepárala |
| Retornos tempranos | Casos especiales primero con \`return\`; el caso principal al final, sin anidar |
| DRY | Cada regla en un solo lugar |
| KISS | La solución más simple que funcione |
| YAGNI | No construyas lo que todavía no necesitas |
| Comentarios | Explican el porqué, no el qué |`,
        `## Summary
| Practice | In one sentence |
|---|---|
| Names | They say what something is or does; named constants instead of magic numbers |
| Small functions | If you need "and" to describe it, split it |
| Early returns | Special cases first with \`return\`; the main case last, without nesting |
| DRY | Every rule in a single place |
| KISS | The simplest solution that works |
| YAGNI | Do not build what you do not need yet |
| Comments | They explain the why, not the what |`,
      ),
    ],
    quiz: [
      q('YAGNI significa…', 'YAGNI means…', [['Escribe pruebas primero', 'Write tests first'], ['No construyas lo que aún no necesitas', 'Do not build what you do not need yet'], ['No repitas código', 'Do not repeat code'], ['Usa patrones siempre', 'Always use patterns']], 1, "You Aren't Gonna Need It.", "You Aren't Gonna Need It."),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué nombre es mejor para guardar cuántos días pasaron desde el último inicio de sesión?', 'Which name is best for storing how many days passed since the last login?', [['`d`', '`d`'], ['`dias_desde_ultimo_login`', '`days_since_last_login`'], ['`datos`', '`data`'], ['`x2`', '`x2`']], 1,
        'Un buen nombre dice qué es sin necesitar un comentario.', 'A good name says what it is without needing a comment.'),
      q('¿Cómo conviene nombrar una variable que vale verdadero o falso?', 'How should you name a variable that holds true or false?', [['Como una pregunta: `es_valido`, `tiene_saldo`', 'As a question: `is_valid`, `has_balance`'], ['Con una sola letra', 'With a single letter'], ['Con un número', 'With a number'], ['Con un verbo: `validar`', 'With a verb: `validate`']], 0,
        'Los verbos son para funciones; los valores verdadero/falso se leen como pregunta.', 'Verbs are for functions; true/false values read as questions.'),
      q('En tu código aparece un `18` suelto (la edad adulta). ¿Qué haces?', 'A loose `18` (the adult age) appears in your code. What do you do?', [['Lo dejas así', 'Leave it'], ['Le pones un comentario', 'Add a comment'], ['Lo cambias por una constante con nombre, como `EDAD_ADULTA = 18`', 'Replace it with a named constant, like `ADULT_AGE = 18`'], ['Lo cambias por 17 + 1', 'Replace it with 17 + 1']], 2,
        'Un número mágico obliga a adivinar qué significa; una constante con nombre lo explica y vive en un solo lugar.', 'A magic number forces guessing what it means; a named constant explains it and lives in one place.'),
      q('Para describir una función dices: "valida los datos y calcula el total y guarda en la base de datos". ¿Qué significa?', 'Describing a function you say: "it validates the data and computes the total and saves to the database". What does that mean?', [['Que está bien hecha', 'That it is well made'], ['Que hace demasiado: conviene separarla en funciones pequeñas', 'That it does too much: split it into small functions'], ['Que le faltan comentarios', 'That it lacks comments'], ['Que es muy rápida', 'That it is very fast']], 1,
        'Cada función debería hacer una sola cosa.', 'Each function should do one thing.'),
      q('¿Qué son los **retornos tempranos**?', 'What are **early returns**?', [['Devolver el resultado antes de calcularlo', 'Returning the result before computing it'], ['Atender primero los casos especiales o inválidos con `return`, y dejar el caso principal al final sin anidar', 'Handling special or invalid cases first with `return`, leaving the main case last without nesting'], ['Usar `return` solo una vez', 'Using `return` only once'], ['Terminar el programa', 'Ending the program']], 1,
        'Evitan los `if` dentro de `if` dentro de `if`.', 'They avoid `if` inside `if` inside `if`.'),
      q('¿Qué problema evita DRY?', 'What problem does DRY prevent?', [['Que el código sea lento', 'Code being slow'], ['Que al corregir una regla copiada en dos lugares se te olvide una copia', 'Fixing a rule copied in two places and forgetting one copy'], ['Que haya muchas funciones', 'Having many functions'], ['Que falten pruebas', 'Missing tests']], 1,
        'Con la regla en una sola función, un cambio llega a todos lados.', 'With the rule in a single function, a change reaches everywhere.'),
      q('Dos fragmentos de código se **parecen**. ¿Siempre hay que unirlos por DRY?', 'Two pieces of code **look alike**. Must you always merge them because of DRY?', [['Sí, siempre', 'Yes, always'], ['Solo si representan la misma regla', 'Only if they represent the same rule'], ['Nunca', 'Never'], ['Solo si están en el mismo archivo', 'Only if they are in the same file']], 1,
        'Si son reglas distintas que hoy coinciden, unirlas las amarra y cambiar una rompería la otra.', 'If they are different rules that happen to match today, merging them ties them together and changing one would break the other.'),
      q('¿Qué pide **KISS**?', 'What does **KISS** ask for?', [['No construir lo que no necesitas', 'Not building what you do not need'], ['Elegir la solución más simple que funcione', 'Choosing the simplest solution that works'], ['No repetir código', 'Not repeating code'], ['Escribir pruebas primero', 'Writing tests first']], 1,
        'Keep It Simple: tres líneas claras valen más que una "ingeniosa".', 'Keep It Simple: three clear lines beat one "clever" line.'),
      q('¿En qué se diferencian KISS y YAGNI?', 'How do KISS and YAGNI differ?', [['Son lo mismo', 'They are the same'], ['KISS habla de cómo haces algo (simple); YAGNI, de si lo haces (solo si hace falta)', 'KISS is about how you do something (simply); YAGNI, about whether you do it (only if needed)'], ['KISS es para pruebas y YAGNI para clases', 'KISS is for tests and YAGNI for classes'], ['YAGNI es la versión en español', 'YAGNI is the Spanish version']], 1,
        'Construir un sistema de plugins "por si acaso" rompe YAGNI aunque esté escrito de forma simple.', 'Building a plugin system "just in case" breaks YAGNI even if written simply.'),
      q('¿Qué debe explicar un comentario?', 'What should a comment explain?', [['Qué hace cada línea', 'What each line does'], ['El porqué de una decisión que el código no puede contar', 'The why of a decision the code cannot tell'], ['El nombre del autor', 'The author\'s name'], ['Nada: nunca hay que comentar', 'Nothing: never comment']], 1,
        'Por ejemplo: "reintentamos 3 veces porque la API a veces falla al arrancar".', 'For example: "we retry 3 times because the API sometimes fails at startup".'),
      q('¿Qué tiene de malo `i += 1  # suma 1 a i`?', 'What is wrong with `i += 1  # add 1 to i`?', [['Nada', 'Nothing'], ['Repite lo que el código ya dice y no aporta nada', 'It repeats what the code already says and adds nothing'], ['Hace el código más lento', 'It makes the code slower'], ['Python no permite comentarios así', 'Python does not allow such comments']], 1,
        'Si el código necesita explicar el qué, mejor cambia los nombres.', 'If the code needs to explain the what, better change the names.'),
      q('Según PEP 8, ¿cómo se nombran las funciones y las clases en Python?', 'According to PEP 8, how are functions and classes named in Python?', [['Funciones en `snake_case` y clases en `CamelCase`', 'Functions in `snake_case` and classes in `CamelCase`'], ['Todo en MAYÚSCULAS', 'Everything in UPPERCASE'], ['Funciones en `CamelCase` y clases en `snake_case`', 'Functions in `CamelCase` and classes in `snake_case`'], ['Como quieras', 'However you like']], 0,
        'Por ejemplo `contar_adultos()` y `class CuentaBancaria`.', 'For example `count_adults()` and `class BankAccount`.'),
    ],
    concepts: [concept('DRY, KISS y YAGNI', 'DRY, KISS and YAGNI', 'No repetir lógica; mantenerlo simple; no construir lo que aún no se necesita.', 'Do not repeat logic; keep it simple; do not build what is not needed yet.')],
  },
  {
    id: 'testing',
    track: 'design',
    title: l('Testing: unitarias, integración y TDD', 'Testing: unit, integration and TDD'),
    summary: l('Qué es una prueba, cómo se escribe con assert y la estructura AAA, qué casos probar, los tipos de pruebas, los dobles de prueba y TDD.', 'What a test is, how to write one with assert and the AAA structure, which cases to test, the kinds of tests, test doubles and TDD.'),
    minutes: 22,
    blocks: [
      md(
        `## ¿Por qué escribir pruebas?
Una **prueba** es código que **revisa que tu código haga lo que debe**. Para qué sirven:
- **Encontrar errores** antes de que los encuentren los usuarios.
- **Cambiar el código sin miedo:** si al mejorar algo rompes otra cosa, una prueba te avisa. A eso se le llama detectar una **regresión**.
- **Documentar:** una prueba muestra con un ejemplo cómo se usa una función y qué debe devolver.

**Analogía:** la lista de revisión de un piloto antes de despegar. Cada punto se revisa siempre, aunque "seguro está bien".

## Cómo se escribe una prueba: \`assert\`
\`assert condicion\` **no hace nada** si la condición es verdadera. Si es falsa, lanza un error (\`AssertionError\`) y la prueba **falla** en esa línea.

Con **pytest** (la herramienta de pruebas más usada en Python), cada prueba es una función cuyo nombre empieza con \`test_\`. Al ejecutar el comando \`pytest\`, encuentra y corre todas esas funciones y te dice cuáles fallaron. \`x is True\` revisa que \`x\` sea exactamente \`True\`.`,
        `## Why write tests?
A **test** is code that **checks your code does what it should**. What they are for:
- **Finding bugs** before users find them.
- **Changing code without fear:** if improving something breaks something else, a test warns you. That is called catching a **regression**.
- **Documenting:** a test shows with an example how a function is used and what it should return.

**Analogy:** a pilot's checklist before takeoff. Every item is checked every time, even if "it is surely fine".

## How a test is written: \`assert\`
\`assert condition\` **does nothing** if the condition is true. If it is false, it raises an error (\`AssertionError\`) and the test **fails** on that line.

With **pytest** (the most used testing tool in Python), each test is a function whose name starts with \`test_\`. When you run the \`pytest\` command, it finds and runs all those functions and tells you which failed. \`x is True\` checks that \`x\` is exactly \`True\`.`,
      ),
      code(`def es_par(n):
    return n % 2 == 0

def test_es_par():
    assert es_par(4) is True         # si fuera falso, la prueba fallaría aquí
    assert es_par(7) is False

test_es_par()                        # pytest las ejecuta solas; aquí la llamamos a mano
print("todas las pruebas pasaron")   # imprime: todas las pruebas pasaron`),
      md(
        `## La estructura AAA
Una buena prueba tiene tres partes, en este orden:
1. **Arrange** (preparar): los datos de entrada.
2. **Act** (actuar): llamas a lo que estás probando.
3. **Assert** (verificar): revisas el resultado.

Cada prueba revisa **un solo comportamiento** y su nombre lo dice: \`test_palindromo_con_espacios\` te cuenta exactamente qué falló cuando falla.`,
        `## The AAA structure
A good test has three parts, in this order:
1. **Arrange:** the input data.
2. **Act:** you call what you are testing.
3. **Assert:** you check the result.

Each test checks **a single behavior** and its name says so: \`test_palindromo_con_espacios\` tells you exactly what failed when it fails.`,
      ),
      code(`def es_palindromo(s):
    limpio = ""
    for c in s:
        if c.isalnum():                # solo letras y números
            limpio += c.lower()        # en minúscula
    return limpio == limpio[::-1]      # [::-1] es el texto al revés

def test_palindromo_con_espacios():
    texto = "Anita lava la tina"       # Arrange: prepara los datos
    resultado = es_palindromo(texto)   # Act: ejecuta lo que pruebas
    assert resultado is True           # Assert: verifica el resultado

def test_cadena_vacia():
    assert es_palindromo("") is True

test_palindromo_con_espacios()
test_cadena_vacia()
print("ok")                            # imprime: ok`),
      md(
        `## Qué casos probar: los casos borde
El caso "normal" casi siempre funciona. Los errores se esconden en los **casos borde**, las entradas en los extremos:
- Entrada **vacía** (lista o texto vacío).
- **Un solo** elemento.
- **Duplicados.**
- **Negativos** y **cero**.
- Valores **muy grandes**.
- Entradas **inválidas** (un texto donde esperabas un número).

Por ejemplo, un \`promedio(nums)\` que divide entre \`len(nums)\` funciona con [2, 4], pero con una lista **vacía** divide entre 0 y falla. Solo lo descubres si pruebas el caso vacío.`,
        `## Which cases to test: edge cases
The "normal" case almost always works. Bugs hide in **edge cases**, the inputs at the extremes:
- **Empty** input (empty list or text).
- **A single** element.
- **Duplicates.**
- **Negatives** and **zero**.
- **Very large** values.
- **Invalid** inputs (text where you expected a number).

For example, an \`average(nums)\` that divides by \`len(nums)\` works with [2, 4], but with an **empty** list it divides by 0 and fails. You only find out if you test the empty case.`,
      ),
      md(
        `## Tipos de pruebas y la pirámide
- **Unitarias:** prueban **una función o clase aislada**. Son rápidas (milisegundos) y, cuando fallan, te dicen exactamente dónde está el problema.
- **De integración:** prueban **varias piezas juntas**, por ejemplo tu API con una base de datos de verdad.
- **End-to-end (E2E):** prueban el **flujo completo** como lo haría un usuario, abriendo el navegador y dando clics (con herramientas como Playwright o Cypress). Son lentas y más frágiles.

**La pirámide de pruebas:** muchas unitarias en la base, menos de integración en medio y pocas E2E en la punta. Así la mayoría de tus pruebas son rápidas y precisas, y unas pocas confirman que todo junto funciona.

**Analogía:** en una fábrica de autos se revisa cada pieza por separado (unitarias), luego que el motor encaje con la transmisión (integración) y al final se maneja el auto completo en una pista (E2E).`,
        `## Kinds of tests and the pyramid
- **Unit:** they test **a single function or class in isolation**. They are fast (milliseconds) and, when they fail, they tell you exactly where the problem is.
- **Integration:** they test **several pieces together**, for example your API with a real database.
- **End-to-end (E2E):** they test the **whole flow** like a user would, opening the browser and clicking (with tools like Playwright or Cypress). They are slow and more brittle.

**The testing pyramid:** many unit tests at the base, fewer integration tests in the middle and few E2E tests at the top. That way most of your tests are fast and precise, and a few confirm everything works together.

**Analogy:** in a car factory each part is checked on its own (unit), then that the engine fits the transmission (integration) and finally the whole car is driven on a track (E2E).`,
      ),
      md(
        `## Dobles de prueba
Si tu función usa una base de datos, una API externa, el correo o el reloj, la prueba sería lenta y podría dar resultados distintos cada vez. Un **doble de prueba** reemplaza esa dependencia por una versión de mentira, para que la prueba sea **rápida** y **determinista** (que siempre dé el mismo resultado).
- **Stub:** devuelve respuestas fijas ("la temperatura es 35").
- **Mock:** además revisa **cómo** lo usaron ("¿se llamó a \`enviar\` una vez?").
- **Fake:** una versión sencilla que sí funciona, como una "base de datos" en un diccionario.

Para poder pasar un doble, tu código debe **recibir** sus dependencias desde fuera: es la inyección de dependencias de la lección de SOLID.`,
        `## Test doubles
If your function uses a database, an external API, email or the clock, the test would be slow and could give different results each time. A **test double** replaces that dependency with a pretend version, so the test is **fast** and **deterministic** (it always gives the same result).
- **Stub:** returns fixed answers ("the temperature is 35").
- **Mock:** also checks **how** it was used ("was \`send\` called once?").
- **Fake:** a simple version that does work, like a "database" in a dictionary.

To be able to pass a double, your code must **receive** its dependencies from outside: that is the dependency injection from the SOLID lesson.`,
      ),
      code(`class ClimaFalso:                       # reemplaza a la API real: siempre responde lo mismo
    def temperatura(self, ciudad):
        return 35

def recomendar(clima, ciudad):          # recibe el clima desde fuera
    if clima.temperatura(ciudad) > 30:
        return "lleva agua"
    return "todo bien"

def test_recomienda_agua_con_calor():
    assert recomendar(ClimaFalso(), "Monterrey") == "lleva agua"

test_recomienda_agua_con_calor()
print("ok")                             # imprime: ok      (sin internet y siempre igual)`),
      md(
        `## TDD: primero la prueba
**TDD** (*Test-Driven Development*, desarrollo guiado por pruebas) invierte el orden habitual. Se repite un ciclo corto:
1. 🔴 **Rojo:** escribe una prueba para algo que tu código **todavía no hace**. Córrela y confirma que **falla** (así sabes que la prueba de verdad detecta el error).
2. 🟢 **Verde:** escribe el **código mínimo** para que pase. Puede parecer incompleto a propósito: la siguiente prueba roja te obligará a completarlo.
3. 🔵 **Refactor:** mejora el código (nombres, duplicados) **sin cambiar lo que hace**; las pruebas confirman que sigue funcionando.

Y vuelves a empezar con la siguiente prueba.`,
        `## TDD: the test first
**TDD** (*Test-Driven Development*) flips the usual order. A short cycle repeats:
1. 🔴 **Red:** write a test for something your code **does not do yet**. Run it and confirm it **fails** (so you know the test really catches the bug).
2. 🟢 **Green:** write the **minimum code** to make it pass. It may look incomplete on purpose: the next red test will force you to complete it.
3. 🔵 **Refactor:** improve the code (names, duplication) **without changing what it does**; the tests confirm it still works.

And you start again with the next test.`,
      ),
      tip('En entrevistas de código, al terminar **propón casos de prueba** y recorre tu código con ellos: vacío, un elemento, duplicados, negativos y valores grandes. Muestra mentalidad de ingeniero y muchas veces destapa un error antes de que lo encuentre el entrevistador.', 'In coding interviews, when you finish **propose test cases** and walk your code through them: empty, one element, duplicates, negatives and large values. It shows an engineering mindset and often uncovers a bug before the interviewer finds it.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| \`assert\` | No hace nada si es verdadero; si es falso, la prueba falla |
| pytest | Corre todas las funciones \`test_…\` con el comando \`pytest\` |
| AAA | Arrange (preparar) → Act (ejecutar) → Assert (verificar) |
| Casos borde | Vacío, uno, duplicados, negativos/cero, muy grandes, inválidos |
| Unitarias / integración / E2E | Una pieza aislada / varias juntas / el flujo completo |
| Pirámide | Muchas unitarias, menos de integración, pocas E2E |
| Dobles (stub, mock, fake) | Reemplazan dependencias externas: pruebas rápidas y deterministas |
| TDD | 🔴 prueba que falla → 🟢 código mínimo → 🔵 refactor |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| \`assert\` | Does nothing if true; if false, the test fails |
| pytest | Runs every \`test_…\` function with the \`pytest\` command |
| AAA | Arrange → Act → Assert |
| Edge cases | Empty, one, duplicates, negatives/zero, very large, invalid |
| Unit / integration / E2E | One piece in isolation / several together / the whole flow |
| Pyramid | Many unit, fewer integration, few E2E |
| Doubles (stub, mock, fake) | Replace external dependencies: fast, deterministic tests |
| TDD | 🔴 failing test → 🟢 minimum code → 🔵 refactor |`,
      ),
    ],
    quiz: [
      q('¿Qué tipo de prueba debería ser la más numerosa?', 'Which type of test should be the most numerous?', [['E2E', 'E2E'], ['Integración', 'Integration'], ['Unitarias', 'Unit'], ['Manuales', 'Manual']], 2, 'La base de la pirámide.', 'The base of the pyramid.'),
      q('El ciclo de TDD es…', 'The TDD cycle is…', [['Verde → Rojo → Refactor', 'Green → Red → Refactor'], ['Rojo → Verde → Refactor', 'Red → Green → Refactor'], ['Refactor → Rojo → Verde', 'Refactor → Red → Green'], ['Código → Prueba → Deploy', 'Code → Test → Deploy']], 1, 'Primero la prueba que falla.', 'The failing test comes first.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué pasa cuando la condición de un `assert` es falsa?', 'What happens when an `assert` condition is false?', [['No pasa nada', 'Nothing happens'], ['Lanza un `AssertionError` y la prueba falla', 'It raises an `AssertionError` and the test fails'], ['Imprime un aviso y sigue', 'It prints a warning and continues'], ['Devuelve False', 'It returns False']], 1,
        'Si es verdadera no hace nada.', 'If it is true it does nothing.'),
      q('¿Cómo sabe pytest qué funciones son pruebas?', 'How does pytest know which functions are tests?', [['Porque tienen un comentario', 'Because they have a comment'], ['Porque su nombre empieza con `test_`', 'Because their name starts with `test_`'], ['Porque devuelven True', 'Because they return True'], ['Porque están al final del archivo', 'Because they are at the end of the file']], 1,
        'Al ejecutar `pytest`, encuentra y corre todas esas funciones.', 'When you run `pytest`, it finds and runs all those functions.'),
      q('¿Cuál es el orden de la estructura AAA?', 'What is the order of the AAA structure?', [['Assert → Act → Arrange', 'Assert → Act → Arrange'], ['Act → Arrange → Assert', 'Act → Arrange → Assert'], ['Arrange (preparar) → Act (ejecutar) → Assert (verificar)', 'Arrange → Act → Assert'], ['Arrange → Assert → Act', 'Arrange → Assert → Act']], 2,
        'Preparas los datos, llamas a lo que pruebas y revisas el resultado.', 'You prepare the data, call what you test and check the result.'),
      q('¿Cuál de estos **no** es un caso borde típico para probar una función que recibe una lista?', 'Which of these is **not** a typical edge case for a function taking a list?', [['La lista vacía', 'The empty list'], ['Una lista con un solo elemento', 'A list with a single element'], ['Una lista de tamaño mediano y valores normales', 'A medium-sized list with normal values'], ['Una lista con negativos', 'A list with negatives']], 2,
        'Ese es el caso normal. Los bordes son los extremos: vacío, uno, duplicados, negativos, muy grandes, inválidos.', 'That is the normal case. Edges are the extremes: empty, one, duplicates, negatives, very large, invalid.'),
      q('Una prueba que levanta tu API con una base de datos real y revisa que guarden juntas un pedido es…', 'A test that starts your API with a real database and checks they save an order together is…', [['Unitaria', 'Unit'], ['De integración', 'Integration'], ['E2E', 'E2E'], ['Manual', 'Manual']], 1,
        'Prueba varias piezas juntas, sin llegar al flujo completo del usuario en el navegador.', 'It tests several pieces together, without the user\'s full flow in the browser.'),
      q('¿Por qué conviene tener pocas pruebas E2E?', 'Why should you have few E2E tests?', [['Porque no sirven', 'Because they are useless'], ['Porque son lentas y frágiles, y cuando fallan no dicen exactamente dónde está el error', 'Because they are slow and brittle, and when they fail they do not say exactly where the bug is'], ['Porque son ilegales', 'Because they are illegal'], ['Porque solo prueban una función', 'Because they only test one function']], 1,
        'Unas pocas confirman que todo junto funciona; el detalle lo cubren las unitarias.', 'A few confirm everything works together; the unit tests cover the details.'),
      q('¿Para qué sirve un doble de prueba (mock, stub o fake)?', 'What is a test double (mock, stub or fake) for?', [['Para duplicar las pruebas', 'To duplicate tests'], ['Para reemplazar dependencias externas y que la prueba sea rápida y determinista', 'To replace external dependencies so the test is fast and deterministic'], ['Para probar en producción', 'To test in production'], ['Para que el código sea más rápido', 'To make the code faster']], 1,
        'Por ejemplo, `ClimaFalso` en vez de la API real del clima.', 'For example, `ClimaFalso` instead of the real weather API.'),
      q('¿Qué significa que una prueba sea **determinista**?', 'What does it mean for a test to be **deterministic**?', [['Que siempre da el mismo resultado', 'That it always gives the same result'], ['Que es muy rápida', 'That it is very fast'], ['Que la escribió un experto', 'That an expert wrote it'], ['Que nunca falla', 'That it never fails']], 0,
        'Una prueba que depende de internet o de la hora puede pasar hoy y fallar mañana sin cambiar el código.', 'A test depending on the internet or the time can pass today and fail tomorrow without code changes.'),
      q('¿En qué se diferencia un **mock** de un **stub**?', 'How does a **mock** differ from a **stub**?', [['Son lo mismo', 'They are the same'], ['El stub devuelve respuestas fijas; el mock además revisa cómo lo usaron', 'The stub returns fixed answers; the mock also checks how it was used'], ['El mock es más lento', 'The mock is slower'], ['El stub solo existe en Java', 'The stub only exists in Java']], 1,
        'Y un fake es una versión sencilla que sí funciona, como una base de datos en un diccionario.', 'And a fake is a simple version that does work, like a database in a dictionary.'),
      q('¿Qué necesita tu código para poder usar un doble de prueba?', 'What does your code need in order to use a test double?', [['Recibir sus dependencias desde fuera (inyección de dependencias)', 'To receive its dependencies from outside (dependency injection)'], ['Ser muy corto', 'To be very short'], ['No usar clases', 'Not to use classes'], ['Nada', 'Nothing']], 0,
        'Si la clase crea su base de datos por dentro, no tienes cómo darle la falsa.', 'If the class creates its database inside, you have no way to give it the fake one.'),
      q('En TDD, ¿qué código escribes en el paso verde?', 'In TDD, what code do you write in the green step?', [['El programa completo', 'The complete program'], ['El código mínimo para que pase la prueba', 'The minimum code to make the test pass'], ['Más pruebas', 'More tests'], ['Nada', 'Nothing']], 1,
        'La siguiente prueba roja te obligará a completarlo.', 'The next red test will force you to complete it.'),
      q('En TDD, ¿qué se hace en el paso de **refactor**?', 'In TDD, what is done in the **refactor** step?', [['Agregar funciones nuevas', 'Adding new features'], ['Borrar las pruebas', 'Deleting the tests'], ['Mejorar el código sin cambiar lo que hace, con las pruebas como red de seguridad', 'Improving the code without changing what it does, with the tests as a safety net'], ['Escribir la prueba que falla', 'Writing the failing test']], 2,
        'Si las pruebas siguen en verde, el refactor no rompió nada.', 'If the tests stay green, the refactor broke nothing.'),
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
    summary: l('Qué es una excepción, cómo atraparla con try/except, por qué capturar solo la específica, cómo lanzar las tuyas, liberar recursos y responder errores en una API.', 'What an exception is, how to catch it with try/except, why to catch only the specific one, how to raise your own, release resources and answer errors in an API.'),
    minutes: 20,
    blocks: [
      md(
        `## ¿Qué es una excepción?
Cuando algo sale mal mientras el programa corre (dividir entre cero, buscar una clave que no existe, abrir un archivo que no está), Python **lanza una excepción**: detiene lo que estaba haciendo. Si nadie la atrapa, el programa **termina** y muestra un mensaje de error con el detalle de dónde pasó (el *traceback*).

Las que más vas a ver:
| Excepción | Cuándo pasa | Ejemplo |
|---|---|---|
| \`ZeroDivisionError\` | Dividir entre cero | \`1 / 0\` |
| \`KeyError\` | Una clave que no está en un diccionario | \`{"a": 1}["b"]\` |
| \`ValueError\` | Un valor del tipo correcto pero inválido | \`int("hola")\` |
| \`TypeError\` | Una operación con el tipo equivocado | \`"5" + 3\` |
| \`NameError\` | Una variable que no existe (muchas veces, un error de dedo) | \`print(totl)\` |
| \`FileNotFoundError\` | Un archivo que no existe | \`open("no_existe.txt")\` |`,
        `## What is an exception?
When something goes wrong while the program runs (dividing by zero, looking up a missing key, opening a file that is not there), Python **raises an exception**: it stops what it was doing. If nobody catches it, the program **ends** and shows an error message detailing where it happened (the *traceback*).

The ones you will see the most:
| Exception | When it happens | Example |
|---|---|---|
| \`ZeroDivisionError\` | Dividing by zero | \`1 / 0\` |
| \`KeyError\` | A key that is not in a dictionary | \`{"a": 1}["b"]\` |
| \`ValueError\` | A value of the right type but invalid | \`int("hola")\` |
| \`TypeError\` | An operation with the wrong type | \`"5" + 3\` |
| \`NameError\` | A variable that does not exist (often a typo) | \`print(totl)\` |
| \`FileNotFoundError\` | A file that does not exist | \`open("missing.txt")\` |`,
      ),
      md(
        `## Atrapar excepciones: \`try\` / \`except\`
- Pones el código que puede fallar dentro de \`try:\`.
- Si ahí se lanza una excepción **del tipo que nombra** el \`except\`, Python salta a ese bloque en vez de detener el programa.
- Si no pasa nada malo, el \`except\` **se salta**.
- Con \`except ValueError as e:\`, \`e\` es la excepción misma y \`str(e)\` es su mensaje.`,
        `## Catching exceptions: \`try\` / \`except\`
- You put the code that may fail inside \`try:\`.
- If an exception **of the type named** by the \`except\` is raised there, Python jumps to that block instead of stopping the program.
- If nothing goes wrong, the \`except\` is **skipped**.
- With \`except ValueError as e:\`, \`e\` is the exception itself and \`str(e)\` is its message.`,
      ),
      code(`def convertir_edad(texto):
    try:
        return int(texto)              # int("hola") lanza ValueError
    except ValueError as e:
        print("no es un número:", e)
        return None

print(convertir_edad("25"))
print(convertir_edad("hola"))
# imprime:
# 25
# no es un número: invalid literal for int() with base 10: 'hola'
# None`),
      md(
        `## Captura solo la excepción que sabes manejar
\`except Exception:\` atrapa **casi cualquier error**, también los que no esperabas, como un \`NameError\` por un error de dedo. El programa sigue como si nada y el error queda **escondido**: puede tardar días en notarse, y cuando se nota ya no sabes dónde empezó.

Por eso:
- Captura la **excepción específica** que sabes manejar (\`KeyError\`, \`ValueError\`…). Las demás, déjalas pasar: es mejor que el programa falle con un mensaje claro.
- **Nunca "te tragues" un error en silencio** con un \`except\` que no hace nada. Como mínimo, **regístralo** (con \`logging\`) o vuelve a lanzarlo.`,
        `## Catch only the exception you know how to handle
\`except Exception:\` catches **almost any error**, including the ones you did not expect, like a \`NameError\` from a typo. The program carries on as if nothing happened and the bug stays **hidden**: it can take days to notice, and by then you do not know where it started.

So:
- Catch the **specific exception** you know how to handle (\`KeyError\`, \`ValueError\`…). Let the others through: it is better for the program to fail with a clear message.
- **Never "swallow" an error silently** with an \`except\` that does nothing. At the very least, **log it** (with \`logging\`) or raise it again.`,
      ),
      code(`precios = {"pan": 20, "leche": 30}

def precio(producto):
    try:
        return precios[producto]
    except KeyError:               # solo el error que sabes manejar: el producto no existe
        return 0

print(precio("pan"), precio("queso"))   # imprime: 20 0`),
      md(
        `## Lanzar tus propias excepciones: fallar rápido
Con \`raise\` lanzas una excepción tú mismo: \`raise ValueError("el monto debe ser positivo")\`. La función se detiene ahí y el error sube hasta quien la llamó.

**Falla rápido** (*fail fast*): si los datos son inválidos, detéctalo **lo antes posible** y avisa con un **mensaje claro**, en vez de seguir trabajando con datos malos y fallar después en un lugar que no tiene nada que ver.

**Valida en los bordes:** revisa los datos **donde entran** al sistema (lo que escribe el usuario, lo que llega de una API externa) y, ya validados, confía en ellos dentro del sistema. Por ejemplo, \`texto.isdigit()\` es \`True\` solo si el texto son puros dígitos.`,
        `## Raising your own exceptions: fail fast
With \`raise\` you throw an exception yourself: \`raise ValueError("the amount must be positive")\`. The function stops there and the error travels up to whoever called it.

**Fail fast:** if the data is invalid, detect it **as early as possible** and report it with a **clear message**, instead of continuing with bad data and failing later somewhere unrelated.

**Validate at the edges:** check data **where it enters** the system (what the user types, what comes from an external API) and, once validated, trust it inside the system. For example, \`text.isdigit()\` is \`True\` only if the text is all digits.`,
      ),
      code(`def retirar(saldo, monto):
    if monto <= 0:
        raise ValueError("el monto debe ser positivo")    # falla rápido, con un mensaje claro
    if monto > saldo:
        raise ValueError("saldo insuficiente")
    return saldo - monto

for monto in [30, -5, 500]:
    try:
        print("nuevo saldo:", retirar(100, monto))
    except ValueError as e:
        print("error:", e)
# imprime:
# nuevo saldo: 70
# error: el monto debe ser positivo
# error: saldo insuficiente`),
      md(
        `## Liberar recursos: \`with\` y \`finally\`
Los archivos y las conexiones hay que **cerrarlos siempre**, aunque haya un error en medio.
- \`with open(ruta) as f:\` abre el archivo y lo **cierra solo** al salir del bloque, tanto si todo salió bien como si hubo una excepción.
- Un bloque \`finally:\` después de \`try\` se ejecuta **siempre**, haya error o no. Sirve para limpiar cuando no hay un \`with\`.

**Convertir un error técnico en uno claro:** \`raise ValueError("mensaje claro") from e\` lanza un error nuevo que explica el problema y **conserva el original** (\`e\`) como causa, para que no se pierda el detalle.

Este ejemplo junta todo: lee un archivo de configuración en formato JSON. Si no existe, usa valores por defecto y lo registra; si tiene JSON inválido, lanza un error claro.`,
        `## Releasing resources: \`with\` and \`finally\`
Files and connections must **always be closed**, even if an error happens in between.
- \`with open(path) as f:\` opens the file and **closes it by itself** when leaving the block, whether everything went well or an exception happened.
- A \`finally:\` block after \`try\` runs **always**, error or not. It is for cleaning up when there is no \`with\`.

**Turning a technical error into a clear one:** \`raise ValueError("clear message") from e\` raises a new error explaining the problem and **keeps the original** (\`e\`) as its cause, so the detail is not lost.

This example puts it all together: it reads a configuration file in JSON format. If it does not exist, it uses default values and logs it; if it has invalid JSON, it raises a clear error.`,
      ),
      code(`import json
import logging

logger = logging.getLogger(__name__)

def leer_config(ruta):
    try:
        with open(ruta) as f:          # cierra el archivo siempre, aunque haya error
            return json.load(f)        # json.load lanza JSONDecodeError si el JSON es inválido
    except FileNotFoundError:
        logger.warning("Sin config en %s, usando valores por defecto", ruta)
        return {}
    except json.JSONDecodeError as e:
        raise ValueError(f"Config inválida en {ruta}: {e}") from e   # error claro + causa original`),
      md(
        `## Errores en una API
Cuando tu servidor responde a otra aplicación, el **código de estado HTTP** dice qué pasó:
- **400** (*Bad Request*): el cliente mandó datos inválidos. Es culpa de quien llamó.
- **500** (*Internal Server Error*): falló algo en tu servidor, por ejemplo se cayó la base de datos.

En ambos casos responde con un **mensaje claro pero general**. Los detalles técnicos van a tus **logs**, no al usuario.`,
        `## Errors in an API
When your server answers another application, the **HTTP status code** says what happened:
- **400** (*Bad Request*): the client sent invalid data. It is the caller's fault.
- **500** (*Internal Server Error*): something failed on your server, for example the database went down.

In both cases answer with a **clear but general message**. The technical details go to your **logs**, not to the user.`,
      ),
      warn('Nunca muestres stack traces ni mensajes de la base de datos al usuario final: revelan cómo está hecho tu sistema (rutas, tablas, versiones), información útil para un atacante.', 'Never show stack traces or database messages to end users: they reveal how your system is built (paths, tables, versions), information useful to an attacker.'),
      md(
        `## Resumen
| Concepto | En una frase |
|---|---|
| Excepción | Python detiene el flujo normal cuando algo falla; sin atraparla, el programa termina |
| \`try\` / \`except\` | Si en el \`try\` se lanza la excepción que nombra el \`except\`, salta ahí; si no, lo salta |
| Específica, no genérica | \`except Exception\` esconde errores inesperados; nunca te tragues uno en silencio |
| \`raise\` y fallar rápido | Detecta datos inválidos lo antes posible con un mensaje claro |
| Validar en los bordes | Revisa los datos donde entran; luego confía en ellos |
| \`with\` / \`finally\` | Liberan recursos siempre, haya error o no |
| \`raise … from e\` | Error claro que conserva la causa original |
| API | 400 si el cliente mandó algo inválido, 500 si falló el servidor; sin detalles internos |`,
        `## Summary
| Concept | In one sentence |
|---|---|
| Exception | Python stops the normal flow when something fails; if uncaught, the program ends |
| \`try\` / \`except\` | If the exception named by the \`except\` is raised in the \`try\`, it jumps there; otherwise it is skipped |
| Specific, not generic | \`except Exception\` hides unexpected bugs; never swallow one silently |
| \`raise\` and failing fast | Detect invalid data as early as possible with a clear message |
| Validate at the edges | Check data where it enters; then trust it |
| \`with\` / \`finally\` | Release resources always, error or not |
| \`raise … from e\` | A clear error that keeps the original cause |
| API | 400 if the client sent something invalid, 500 if the server failed; no internal details |`,
      ),
    ],
    quiz: [
      q('¿Por qué evitar `except Exception:` genérico?', 'Why avoid a generic `except Exception:`?', [['Es más lento', 'It is slower'], ['Oculta errores inesperados', 'It hides unexpected errors'], ['No existe en Python', 'It does not exist in Python'], ['Consume más memoria', 'It uses more memory']], 1, 'Atrapas cosas que no sabías manejar, como un error de dedo.', 'You catch things you did not know how to handle, like a typo.'),
      // Los índices identifican las tarjetas de repaso: agrega preguntas nuevas al final
      q('¿Qué pasa si se lanza una excepción y nadie la atrapa?', 'What happens if an exception is raised and nobody catches it?', [['El programa sigue como si nada', 'The program continues as if nothing happened'], ['El programa termina y muestra el error', 'The program ends and shows the error'], ['Python la ignora', 'Python ignores it'], ['Se reinicia el programa', 'The program restarts']], 1,
        'El mensaje (traceback) dice qué excepción fue y en qué línea pasó.', 'The message (traceback) says which exception it was and on which line.'),
      q('¿Qué excepción lanza `int("hola")`?', 'Which exception does `int("hola")` raise?', [['`ValueError`', '`ValueError`'], ['`TypeError`', '`TypeError`'], ['`KeyError`', '`KeyError`'], ['Ninguna: devuelve 0', 'None: it returns 0']], 0,
        'Es un texto (el tipo correcto para `int`), pero no representa un número válido.', 'It is a text (the right type for `int`), but it does not represent a valid number.'),
      q('Buscas `config["host"]` y el diccionario no tiene esa clave. ¿Qué excepción se lanza?', 'You look up `config["host"]` and the dictionary does not have that key. Which exception is raised?', [['`ValueError`', '`ValueError`'], ['`NameError`', '`NameError`'], ['`KeyError`', '`KeyError`'], ['`FileNotFoundError`', '`FileNotFoundError`']], 2,
        'Para evitarla también puedes usar `config.get("host")`.', 'To avoid it you can also use `config.get("host")`.'),
      q('Si dentro del `try` no pasa ningún error, ¿qué pasa con el bloque `except`?', 'If no error happens inside the `try`, what happens to the `except` block?', [['Se ejecuta igual', 'It runs anyway'], ['Se salta', 'It is skipped'], ['Da error', 'It fails'], ['Se ejecuta dos veces', 'It runs twice']], 1,
        'El `except` solo corre si se lanzó la excepción que nombra.', 'The `except` only runs if the exception it names was raised.'),
      q('En `except ValueError as e:`, ¿qué es `e`?', 'In `except ValueError as e:`, what is `e`?', [['El valor que se quería convertir', 'The value that was being converted'], ['La excepción misma; `str(e)` es su mensaje', 'The exception itself; `str(e)` is its message'], ['Un número de error', 'An error number'], ['La línea donde falló', 'The line where it failed']], 1,
        'Sirve para mostrar o registrar qué pasó.', 'It is useful to show or log what happened.'),
      q('¿Para qué sirve `raise ValueError("saldo insuficiente")`?', 'What is `raise ValueError("saldo insuficiente")` for?', [['Para imprimir un mensaje y seguir', 'To print a message and continue'], ['Para lanzar una excepción tú mismo: la función se detiene y avisa a quien la llamó', 'To raise an exception yourself: the function stops and alerts its caller'], ['Para atrapar un error', 'To catch an error'], ['Para cerrar un archivo', 'To close a file']], 1,
        'Quien la llamó puede atraparla con `except ValueError`.', 'The caller can catch it with `except ValueError`.'),
      q('¿Qué significa **fallar rápido**?', 'What does **fail fast** mean?', [['Que el programa termine lo antes posible', 'That the program ends as soon as possible'], ['Detectar los datos inválidos lo antes posible y avisar con un mensaje claro, en vez de seguir con datos malos', 'Detecting invalid data as early as possible and reporting it clearly, instead of continuing with bad data'], ['Escribir código rápido', 'Writing code quickly'], ['No validar nada', 'Not validating anything']], 1,
        'Si sigues con datos malos, el error aparece después en un lugar que no tiene nada que ver.', 'If you continue with bad data, the error shows up later somewhere unrelated.'),
      q('¿Dónde conviene validar los datos?', 'Where should data be validated?', [['En cada función del sistema', 'In every function of the system'], ['En los bordes: donde entran al sistema (usuario, APIs externas)', 'At the edges: where they enter the system (users, external APIs)'], ['Solo en la base de datos', 'Only in the database'], ['En ningún lado', 'Nowhere']], 1,
        'Ya validados, dentro del sistema puedes confiar en ellos.', 'Once validated, you can trust them inside the system.'),
      q('¿Qué tiene de malo un `except` que atrapa el error y no hace nada?', 'What is wrong with an `except` that catches the error and does nothing?', [['Nada', 'Nothing'], ['Se traga el error en silencio: el programa sigue con datos malos y nadie se entera', 'It swallows the error silently: the program continues with bad data and nobody finds out'], ['Hace el código más lento', 'It makes the code slower'], ['Python no lo permite', 'Python does not allow it']], 1,
        'Como mínimo, registra el error o vuelve a lanzarlo.', 'At the very least, log the error or raise it again.'),
      q('¿Qué garantiza `with open(ruta) as f:`?', 'What does `with open(path) as f:` guarantee?', [['Que el archivo existe', 'That the file exists'], ['Que el archivo se cierra al salir del bloque, aunque haya un error', 'That the file is closed when leaving the block, even if there is an error'], ['Que el archivo se lee más rápido', 'That the file is read faster'], ['Que no hay errores', 'That there are no errors']], 1,
        'Libera el recurso siempre, salga bien o mal.', 'It always releases the resource, whether things go well or not.'),
      q('¿Cuándo se ejecuta un bloque `finally`?', 'When does a `finally` block run?', [['Solo si hubo error', 'Only if there was an error'], ['Solo si no hubo error', 'Only if there was no error'], ['Siempre, haya error o no', 'Always, error or not'], ['Nunca', 'Never']], 2,
        'Sirve para limpiar cuando no hay un `with`.', 'It is for cleaning up when there is no `with`.'),
      q('¿Qué aporta escribir `raise ValueError("Config inválida") from e`?', 'What does writing `raise ValueError("Invalid config") from e` add?', [['Nada distinto a `raise ValueError(...)`', 'Nothing different from `raise ValueError(...)`'], ['Lanza un error claro y conserva el original (`e`) como causa', 'It raises a clear error and keeps the original (`e`) as its cause'], ['Atrapa el error', 'It catches the error'], ['Borra el error original', 'It deletes the original error']], 1,
        'Así no pierdes el detalle técnico al dar un mensaje más claro.', 'That way you do not lose the technical detail while giving a clearer message.'),
      q('En una API, el usuario manda un JSON inválido. ¿Qué código HTTP devuelves?', 'In an API, the user sends invalid JSON. Which HTTP code do you return?', [['200', '200'], ['400', '400'], ['500', '500'], ['404', '404']], 1,
        'Es un error del cliente. Si fallara tu servidor (por ejemplo, la base de datos), sería 500.', 'It is a client error. If your server failed (for example, the database), it would be 500.'),
      q('¿Por qué no debes mostrar el stack trace al usuario final?', 'Why should you not show the stack trace to end users?', [['Porque es muy largo', 'Because it is too long'], ['Porque revela cómo está hecho tu sistema, información útil para un atacante', 'Because it reveals how your system is built, information useful to an attacker'], ['Porque está en inglés', 'Because it is in English'], ['No hay problema en mostrarlo', 'There is no problem showing it']], 1,
        'Los detalles van a tus logs; al usuario, un mensaje claro y general.', 'The details go to your logs; the user gets a clear, general message.'),
    ],
    concepts: [concept('"Falla rápido" (fail fast)', '"Fail fast"', 'Detectar y reportar errores lo antes posible con un mensaje claro, en vez de continuar con datos inválidos.', 'Detect and report errors as early as possible with a clear message instead of continuing with invalid data.')],
  },
];
