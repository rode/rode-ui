module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  globals: {
    chance: "readonly",
    process: "writable",
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "jest"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-restricted-imports": [2, { patterns: ["../*"] }],
  },
  ignorePatterns: ["prism/prism.js"],
};
