import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {applyLoadedEnvToProcess} from './scripts/vite-api-dev/env.mjs';
import {createViteApiMiddleware} from './scripts/vite-api-dev/middleware.mjs';
import {loadProjectDevEnv} from './scripts/vite-api-dev/project-env.mjs';

export default defineConfig(() => {
  applyLoadedEnvToProcess(loadProjectDevEnv(process.cwd(), process.env));

  const localApiPlugin = {
    name: 'local-api-middleware',
    configureServer(server: {middlewares: {use: (middleware: unknown) => void}}) {
      server.middlewares.use(createViteApiMiddleware(__dirname));
    },
  };

  return {
    plugins: [react(), tailwindcss(), localApiPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
