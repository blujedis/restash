module.exports = {
  "parser": "@typescript-eslint/parser",
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "@typescript-eslint",
    "react-hooks"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  "ignorePatterns": [
    "dist",
    "build",
    "temp.js"
  ],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  }
};