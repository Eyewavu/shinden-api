import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

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
    json(),
    typescript({
      declaration: true
    }),
    resolve({
      browser: false
    })
  ]
}]