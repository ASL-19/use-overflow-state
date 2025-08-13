import asl19 from "@asl-19/eslint-config";
import { defineConfig } from "eslint/config";

const typedAsl19 = /** @type {import("@asl-19/eslint-config")["default"]} */ (
  asl19
);

const eslintConfig = defineConfig([
  {
    ignores: ["dist/", "types/", ".yalc/"],
  },
  {
    extends: [
      typedAsl19.base, // (for all projects)
      typedAsl19.typescript, // (for TypeScript projects)
    ],
    rules: {
      // https://github.com/eslint-community/eslint-plugin-security/issues/21
      "security/detect-object-injection": "off",
    },
  },
]);

export default eslintConfig;
