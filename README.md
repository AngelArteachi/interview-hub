# Interview Hub

Tu centro para preparar entrevistas de ingeniería de software (nivel junior): **lecciones**, **repaso espaciado**, **práctica** y **simulador de entrevistas** con evaluación por IA (Claude). Bilingüe ES/EN, con tema claro y oscuro.

## Qué incluye

| Sección | Ruta | Qué hace |
|---|---|---|
| Hoy | `/` | Cola diaria de repaso espaciado (SM-2): lo vencido más N tarjetas nuevas |
| Aprender | `/learn` | 4 rutas y 32 lecciones con quiz, visualizaciones interactivas y tutor IA |
| Practicar | `/practice` | 39 algoritmos, "adivina el patrón", 50 flashcards, system design, historias STAR, tarjetas propias |
| Simulador | `/mock` | Entrevista con tiempo real; las preguntas priorizan tus puntos débiles |
| Progreso | `/stats` | Racha, heatmap, dominio por tema, puntos débiles, pronóstico |
| Ajustes | `/settings` | Exportar/importar progreso, tarjetas nuevas por día, estado de la IA |

El progreso se guarda en el navegador (`localStorage`). Usa **Ajustes → Exportar** para respaldarlo.

## Empezar

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

## Activar la IA (opcional)

La evaluación de respuestas y el tutor llaman a la API de Claude **desde el servidor**, así que tu API key nunca llega al navegador. Copia `.env.example` como `.env` y agrega tu clave de https://console.anthropic.com:

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-opus-5-5   # opcional
```

Después reinicia `npm run dev`. Sin la clave, la app funciona igual con autoevaluación.

## Agregar contenido

- Algoritmos: `src/data/algorithms.ts`
- Flashcards: `src/data/fundamentals.ts`
- Conductuales: `src/data/behavioral.ts`
- System design: `src/data/systemDesign.ts`
- Lecciones: `src/content/lessons/*.ts`. Cada lección se arma con bloques (`md`, `code`, `viz`, callouts), un quiz y los conceptos que entran al repaso.

## Desplegar en Vercel

1. Sube el proyecto a GitHub e impórtalo en Vercel (detecta Vite solo).
2. En *Project Settings → Environment Variables*, agrega `ANTHROPIC_API_KEY`.
3. Las funciones de `api/` se despliegan como serverless functions, y `vercel.json` se encarga de las rutas de la SPA.

## Stack

React 18, TypeScript, Vite, Tailwind CSS v4, React Router, react-markdown, lucide-react y `@anthropic-ai/sdk`.
