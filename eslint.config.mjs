import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      /**
       * This app restores a lot of state that only exists on the client:
       * progress from IndexedDB, the saved theme, the last playground draft,
       * a URL hash, an IntersectionObserver deciding when to boot Python.
       *
       * None of that can be read during render without breaking SSR
       * hydration, so "set state in an effect after mount" is the correct
       * shape for it. Downgraded to a warning so a genuinely accidental
       * render loop is still visible in review.
       */
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
