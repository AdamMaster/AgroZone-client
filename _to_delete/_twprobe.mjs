import postcss from 'postcss'
import tw from '@tailwindcss/postcss'
import fs from 'fs'

const css = fs.readFileSync('/tmp/twtest/in.css', 'utf8')
const result = await postcss([tw()]).process(css, { from: '/tmp/twtest/in.css' })
fs.writeFileSync('/tmp/twtest/out.css', result.css)
console.log('DONE, bytes:', result.css.length)
