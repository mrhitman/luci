const {build} = require("esbuild")
const fg = require("fast-glob")

async function run() {
  const entryPoints = await fg(["src/**/*.ts"]);

  return build({
    entryPoints,
    format: "cjs",
    target: "es2022",
    platform: "node",
    outdir: "dist",
    watch: true,
  });
}

run();
