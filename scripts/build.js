const { build } = require("esbuild");
const fg = require("fast-glob");
const { copy } = require('esbuild-plugin-copy');

async function run() {
  const entryPoints = await fg(["src/**/*.ts"]);

  return build({
    entryPoints,
    format: "cjs",
    target: "es2022",
    platform: "node",
    sourcemap: 'inline',
    tsconfig: "./tsconfig.json",
    outdir: "dist",
    plugins: [
      copy({
        assets: {
          from: ['src/templates/*'],
          to: ['templates'],
        },
      }),
    ],
    watch: Boolean(process.env.WATCH ?? 0),
  });
}

run();
