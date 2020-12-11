module.exports = {
  extends: ["@deloitte-digital-au/eslint-config-react", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks", "prettier"],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    "react/prop-types": 0,
    "react-hooks/rules-of-hooks": "error",
    "react/no-multi-comp": [1, { ignoreStateless: true }],
    "react-hooks/exhaustive-deps": "warn",
    "import/prefer-default-export": 0,
    camelcase: 0,
    "jsx-a11y/no-redundant-roles": [
      "error",
      {
        ul: ["list"],
        ol: ["list"],
      },
    ],
    "object-curly-spacing": ["warn", "always"],

    // FIXME: https://github.com/typescript-eslint/typescript-eslint/issues/2502
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": 1,
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".js", ".tsx"],
      },
    ],

    // unused vars should error unless we use '_'
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_$",
        varsIgnorePattern: "^_$",
      },
    ],

    "react/require-default-props": 0,
    "react-hooks/exhaustive-deps": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
}
