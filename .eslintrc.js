const eslintConfig = {
  extends: ["@asl-19/eslint-config", "@asl-19/eslint-config/react"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": "off",
    "no-restricted-imports": "off",
  },
};

// eslint-disable-next-line functional/immutable-data
module.exports = eslintConfig;
