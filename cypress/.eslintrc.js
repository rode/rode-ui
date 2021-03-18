// eslint-disable-next-line no-undef
module.exports = {
  "env": {
    "cypress/globals": true
  },
  "plugins": ["cypress"],
  "extends": ["plugin:cypress/recommended"],
  "rules": {
    "no-restricted-imports": "off"
  },
  "overrides": [
    {
      "files": ["plugins/index.js"],
      "rules": {
        "no-undef": "off",
        "no-unused-vars": "off"
      }
    }
  ]
};
