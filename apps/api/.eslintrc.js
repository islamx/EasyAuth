module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: {
    jest: true,
  },
  overrides: [
    {
      files: ['**/*.spec.ts', 'test/**/*.ts'],
      env: {
        jest: true,
      },
    },
  ],
};
