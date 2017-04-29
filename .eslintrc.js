module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'max-len': [
      2,
      {
        code: 90,
      },
    ],
  },
  plugins: ['react'],
  extends: ['google', 'plugin:react/recommended'],
};
