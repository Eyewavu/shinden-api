import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

/** @type {import('rollup').RollupOptions} */
export default [{
  input: "./src/index.ts",
  output: {
    name:"index",
    format: "es",
    sourcemap: true,
    file:"./lib/index.js",
  },
  external: ["node-fetch","cheerio","request"],
  plugins: [
    terser({
      compress: true,
      mangle: true
    }),
    typescript({
      declaration: true
    }),
    resolve({
      browser: false
    })
  ]
}]