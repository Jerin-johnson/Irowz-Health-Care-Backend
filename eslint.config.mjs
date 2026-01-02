import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  prettier,

  {
    rules: {
      "no-console": "off",
      "no-debugger": "error",

      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
