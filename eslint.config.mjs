// import js from "@eslint/js";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
//   tseslint.configs.recommended,
// ]);

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import nodePlugin from "eslint-plugin-node";
import promisePlugin from "eslint-plugin-promise";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "commonjs",
      },
    },

    plugins: {
      import: importPlugin,
      node: nodePlugin,
      promise: promisePlugin,
    },

    rules: {
      "no-console": "off",
      "no-debugger": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/explicit-function-return-type": "off",

      "import/order": "off",

      "node/no-process-exit": "off",
      "promise/always-return": "off",
    },
  },

  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.*"],
  },
];
