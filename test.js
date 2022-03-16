let test = require('tape')
let path = require('path')
let fs = require('fs')
let src = path.join(__dirname, 'arc-basic.zip')
let dest = path.join(__dirname, 'tmp')
let baked = path.join(__dirname, 'baked.zip')

let { chunk, unchunk } = require('.')

test('clobber', async t=> {
  t.plan(1)
  try { fs.rmSync(baked) } catch(e) {}
  try { fs.rmdirSync(dest, {recursive: true}) } catch(e) {}
  t.pass('clobbered tmp')
})

test('chunk', async t=> {
  t.plan(1)
  fs.mkdirSync(dest, {recursive: true})
  let result = await chunk({src, dest}) 
  let chunks = fs.readdirSync(dest, { withFileTypes: true })
  t.ok(chunks.length === 4, 'there are four chunks')
  console.log(chunks)
})

test('unchunk', async t=> {
  t.plan(1)
  await unchunk({
    src: dest,
    dest: baked, 
  })
  let original = fs.readFileSync(src)
  let copy = fs.readFileSync(baked)
  t.deepEqual(original, copy)
})
