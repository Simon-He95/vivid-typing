import fs from 'fs'

async function readFile() {
  const content = await fs.readFileSync('./dist/index.js', 'utf-8')
  const content1 = await fs.readFileSync('./dist/index.mjs', 'utf-8')
  fs.writeFile('./dist/index.js', `// @unocss-include \n${content}`, (err) => {
    if (err)
      throw err
  })
  fs.writeFile('./dist/index.mjs', `// @unocss-include \n${content1}`, (err) => {
    if (err)
      throw err
  })
}
readFile()
