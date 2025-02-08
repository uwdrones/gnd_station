export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // Prevent overuse of `any`
    '@typescript-eslint/no-unused-vars': 'warn', // Warn unused variables
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit return types
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        endOfLine: 'lf',
      },
    ], // Enforce Prettier rules
  },
};
