import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'tsup',
  target: 'node14',
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  entryPoints: ['src/index.ts', 'src/index.css'],
  define: {
    __DEV__: 'false',
  },
  bundle: true,
  external: [
    'vue',
    'lazy-js-utils',
  ],
  platform: 'node',
})
