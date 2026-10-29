# Interview Hub

**Una aplicación web para prepararte de verdad para entrevistas de ingeniería de software.** No es una lista de preguntas: te enseña los conceptos, te hace practicarlos y se asegura de que no los olvides.

Está pensada para perfiles **junior o de primer empleo** y funciona en **español e inglés**.

> Aprende → Practica → Repasa → Simula la entrevista

---

## ¿Qué problema resuelve?

Prepararse para una entrevista técnica suele ser caótico: decenas de pestañas de LeetCode, apuntes sueltos y temas que estudiaste hace dos semanas y ya olvidaste. Interview Hub reúne todo en un solo lugar y decide por ti **qué estudiar cada día**.

---

## Funciones

### 📅 Hoy: tu plan diario automático
Al abrir la app ves cuántas tarjetas te tocan hoy. El sistema usa **repetición espaciada** (algoritmo SM-2, el mismo principio que Anki):

- Cada pregunta tiene una fecha de próximo repaso.
- Al responder te calificas: **Otra vez / Difícil / Bien / Fácil**.
- Lo que dominas aparece cada vez menos; lo que te cuesta vuelve pronto.
- Cada día se suman algunas tarjetas nuevas (la cantidad es configurable).

Siempre usas **recuerdo activo**: la respuesta está oculta hasta que intentas responder con tus propias palabras.

### 📚 Aprender: 5 rutas con 35 lecciones
Lecciones cortas que explican los temas desde cero, con ejemplos de código, consejos de "qué te preguntarán en la entrevista", **fuentes confiables** (documentación oficial, RFC, OWASP, universidades) y un **mini-quiz** al final.

| Ruta | Temas |
|---|---|
| Estructuras de datos y algoritmos | Big O y complejidad amortizada, arrays y hash maps, dos punteros, listas enlazadas, pilas y colas, recursión, ordenamiento, búsqueda binaria, árboles y tries, heaps, grafos, programación dinámica |
| Programación y diseño | OOP (composición, interfaces, sobrecarga), SOLID e inyección de dependencias, patrones de diseño, código limpio, testing, manejo de errores |
| Web y backend | HTTP, JavaScript esencial, APIs REST, SQL (ACID, normalización, N+1), NoSQL, autenticación (sesiones, JWT, OAuth), caché, seguridad web, introducción a system design |
| Sistemas y herramientas | Procesos e hilos, concurrencia, redes, Git (conflictos, reset vs revert), Linux, Docker y cloud, CI/CD |
| Preparación de entrevista | Entrevista conductual y método STAR |

Cada pregunta del repaso está ligada a la lección que la explica: **solo te aparece cuando ya aprobaste esa lección**. Al aprobar una lección, sus conceptos clave entran solos a tu repaso diario, y la lección te enlaza a los problemas de práctica relacionados.

### 🎬 Visualizaciones interactivas
Siete animaciones paso a paso (play, pausa, avanzar y retroceder) en las que **puedes cambiar los datos de entrada**:

- Ordenamientos: bubble, merge y quick sort
- Búsqueda binaria
- Ventana deslizante
- Pila vs cola
- Inserción y recorridos en un árbol binario de búsqueda
- BFS y DFS en un grafo
- Programación dinámica (cambio de monedas)

### 💪 Practicar
- **42 problemas de algoritmos** organizados por patrón. Escribes tu enfoque y tu complejidad, revelas pistas una a una, ves la solución explicada y lo programas en LeetCode.
- **Adivina el patrón**: lees solo el enunciado y eliges la técnica correcta. Entrena la habilidad más importante de una entrevista de código.
- **50 flashcards de fundamentos**: OOP, estructuras de datos, bases de datos, web, Git, sistemas operativos, testing y JavaScript.
- **System design básico**: 6 casos (acortador de URLs, rate limiter, chat…) con un marco guiado de 5 pasos y un checklist de autoevaluación.
- **Entrevista conductual**: escribes tus propias **historias STAR**, las etiquetas, y para cada pregunta la app te sugiere cuál usar.
- **Mis preguntas**: agrega las preguntas de tus entrevistas reales y entran al mismo sistema de repaso.
- **Sesiones personalizadas**: elige tipos, dificultad y modo (aleatorio, solo nuevas o tus puntos débiles primero).

### 🎤 Simulador de entrevista
Elige el tipo (técnica, conductual o mixta), la duración y el número de preguntas. Igual que en una entrevista real, las preguntas salen **al azar de todos los temas**, sin importar qué lecciones hayas completado, y corre con temporizador real. Al terminar revisas cada respuesta junto a la respuesta de referencia y te calificas; el resultado se guarda en tu historial de simulacros sin modificar tu repaso diario.

### 🤖 Inteligencia artificial con Claude (opcional)
- **Evaluación de respuestas**: Claude califica lo que escribiste (1 a 5), te dice tus fortalezas, qué mejorar y cómo sería una respuesta ideal. Funciona en algoritmos, conceptos, system design, conductuales y el simulador.
- **Tutor en cada lección**: un chat que conoce la lección que estás leyendo. Puedes pedirle que te lo explique más simple, que te dé otro ejemplo o que te haga una pregunta de entrevista.

Sin IA la app funciona completa con autoevaluación.

### 📈 Progreso
Racha de días, mapa de actividad, dominio por categoría, por patrón de algoritmos y por tema, tus 5 puntos más débiles, pronóstico de repasos para los próximos 7 días y la evolución de tus simulacros.

### ☁️ Cuentas y sincronización
Inicia sesión con **Google** y tu progreso se sincroniza entre tu computadora y tu celular. También puedes usarla **sin cuenta** (modo invitado): al iniciar sesión, lo que llevabas se sube y se combina con tu cuenta sin perder nada. Cada usuario solo puede ver su propio progreso.

### Otros detalles
- Español e inglés, con cambio instantáneo.
- Tema claro y oscuro.
- Diseño adaptado a celular.
- Atajos de teclado en el repaso: `espacio` para revelar y `1` a `4` para calificar.
- Funciona sin internet: el progreso se guarda en el navegador y se sube al reconectar. También puedes exportarlo o importarlo en JSON.

---

## Cómo usarla

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

Sin configurar nada, la app funciona completa en modo invitado. Para activar las cuentas y la IA, crea un archivo `.env` basado en `.env.example`:

- **Cuentas con Google:** sigue la guía [docs/supabase.md](docs/supabase.md).
- **IA:** agrega tu clave de [Anthropic](https://console.anthropic.com) en `ANTHROPIC_API_KEY`, y en `AI_ALLOWED_EMAILS` los correos que pueden usarla. La clave solo vive en el servidor y nunca llega al navegador.

## Tecnologías

React 18, TypeScript, Vite, Tailwind CSS v4, React Router, Supabase (Auth + Postgres) y la API de Claude (`@anthropic-ai/sdk`). Lista para desplegarse en Vercel.
