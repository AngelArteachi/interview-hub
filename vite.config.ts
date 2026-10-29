import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * En desarrollo monta las funciones de /api (las mismas que usa Vercel en producción),
 * así la API key de Anthropic se queda en el servidor y nunca llega al navegador.
 */
function apiDevServer(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/(evaluate|tutor|status)(\?|$)/);
        if (!match) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`);
          await mod.default(req, res);
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'dev api error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Carga .env (incluidas variables sin prefijo VITE_) solo en el proceso del servidor
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            markdown: ['react-markdown', 'remark-gfm'],
            content: ['./src/content/lessons/index.ts', './src/data/algorithms.ts', './src/data/fundamentals.ts'],
          },
        },
      },
    },
  };
});
