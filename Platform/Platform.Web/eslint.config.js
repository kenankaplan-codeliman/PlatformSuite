import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Sayfa ve feature kodunda antd doğrudan import'u yasak —
      // shared/ui/ altındaki wrapper'lar üzerinden tüketilir.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'antd',
              message: "antd'yi doğrudan kullanma — shared/ui/ altındaki wrapper'ı kullan.",
            },
          ],
          patterns: ['antd/*'],
        },
      ],
    },
  },
  {
    // shared/ui wrapper'ları ve uygulama iskeletini saran widget'lar antd'yi
    // doğrudan kullanabilir (Layout, Sider, Menu vb. composition primitive'leri).
    files: [
      'src/shared/ui/**/*.{ts,tsx}',
      'src/app/providers/**/*.{ts,tsx}',
      'src/widgets/app-shell/**/*.{ts,tsx}',
      'src/widgets/app-header/**/*.{ts,tsx}',
      'src/widgets/app-sidebar/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
