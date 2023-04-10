import fsp from 'fs/promises'
(async() => {
  console.log('css building...')
  const css = await fsp.readFile('./src/index.css', 'utf-8')
  await fsp.writeFile('./dist/index.css', css.replace(/\n/g, '').replace(/\s+/g, ' '))
  console.log('css build success')
  process.exit(0)
})()
