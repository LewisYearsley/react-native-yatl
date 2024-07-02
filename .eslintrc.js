/**
 * @type {import("eslint/lib/shared/types").ConfigData}
 */
module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
