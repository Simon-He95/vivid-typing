import fsp from 'fs/promises'
import { jsShell } from 'lazy-js-utils'
(async() => {
  console.log('css building...')
  const css = await fsp.readFile('./src/index.css', 'utf-8')
  await fsp.writeFile('./dist/index.css', css.replace(/\n/g, '').replace(/\s+/g, ' '))
  console.log('css build success')
  // build:js
  setTimeout(async() => {
    console.log('js building...')
    await jsShell('unbuild')
    console.log('js build success')
  })

  process.exit(0)
})()