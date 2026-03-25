import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    // public/ contains static assets (images, CNAME, vendor JS) that should
    // never be linted. scripts/ are plain Node.js ESM files that don't go
    // through the Next.js/TypeScript build pipeline.
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**', 'scripts/**'],
  },
];

export default config;
