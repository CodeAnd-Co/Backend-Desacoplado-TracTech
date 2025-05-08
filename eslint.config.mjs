import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist", "node_modules"] },

  // Reglas comunes para todo el proyecto
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        ecmaFeatures: { jsx: false },
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // Buenas prácticas generales
      "object-shorthand": "error",
      "no-new-object": "error",
      "default-param-last": "error",
      "no-new-func": "error",
      "function-paren-newline": ["error", "consistent"],
      "no-duplicate-imports": "error",
      "object-curly-newline": ["error", { consistent: true }],
      "no-undef": "error",
      "prefer-const": "error",
      "one-var": ["error", "never"],
      "no-multi-assign": "error",
      "no-plusplus": "error",
      "operator-linebreak": ["error", "before"],
      "new-cap": ["error", { "newIsCap": true, "capIsNew": false }],
      camelcase: [
        "error",
        {
          properties: "never",
          allow: ["exec_mode"],
        },
      ],
      "id-length": ["error", { min: 2 }],
      "nonblock-statement-body-position": ["error", "beside"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "no-iterator": "error",
      "no-restricted-syntax": "error",
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "no-array-constructor": "error",
      "template-curly-spacing": ["error", "never"],
      "prefer-template": "error",
      "no-eval": "error",
      "no-useless-constructor": "error",
      "no-dupe-class-members": "error",
      "class-methods-use-this": "error",
      "dot-notation": "error",
      "prefer-exponentiation-operator": "error",
    },
  },

  // Entorno Node.js (main process, preload, etc.)
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Configuración para las pruebas con Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
