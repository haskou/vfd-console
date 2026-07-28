import { cp } from 'node:fs/promises';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

function preserveCssModules(): Plugin {
  return {
    name: 'preserve-css-modules',
    async writeBundle() {
      await cp(
        new URL('./src/css/', import.meta.url),
        new URL('./dist/css/', import.meta.url),
        { recursive: true },
      );
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      cssFileName: 'vfd-console',
      entry: 'src/index.ts',
      fileName: 'vfd-console',
      formats: ['es'],
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [
    preserveCssModules(),
    dts({
      include: ['src'],
    }),
  ],
});
