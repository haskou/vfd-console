import { createHaskouConfig } from '@haskou/eslint-config';

export default createHaskouConfig({
  ignores: [
    'coverage/**',
    'demo-dist/**',
    'dist/**',
    'docs/.vitepress/cache/**',
    'docs/.vitepress/dist/**',
    'docs/public/demo/**',
  ],
  tsconfigRootDir: import.meta.dirname,
});
