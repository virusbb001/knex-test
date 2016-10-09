module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase" : 1
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ]
  }
};
