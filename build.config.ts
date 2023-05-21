import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: [
    // default
    './src/index',
  ],

  // Change outDir, default is 'dist'
  outDir: 'dist',

  externals: ['vue', '*.css'],

  // Generates .d.ts declaration file
  declaration: true,
})
