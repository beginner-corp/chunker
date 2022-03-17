let test = require('tape')
let path = require('path')
let fs = require('fs')
let src = path.join(__dirname, 'arc-basic.zip')
let newDest = () => path.join(__dirname, 'tmp', `${Date.now()}`)
let baked = path.join(__dirname, 'baked.zip')
let { chunk, unchunk } = require('.')
let dest

function reset () {
  try { fs.rmSync(baked) }
  catch (e) { /* noop */ }
  try { fs.rmSync(dest, { recursive: true, force: true }) }
  catch (e) { /* noop */ }
  fs.mkdirSync(dest, { recursive: true })
}

test('chunk (default size of 3MB)', async t => {
  t.plan(1)
  dest = newDest()
  reset()
  await chunk({ src, dest })
  let chunks = fs.readdirSync(dest, { withFileTypes: true })
  t.ok(chunks.length === 4, 'there are four chunks')
  console.log(chunks)
})

test('unchunk', async t => {
  t.plan(1)
  await unchunk({
    src: dest,
    dest: baked,
  })
  let original = fs.readFileSync(src)
  let copy = fs.readFileSync(baked)
  t.deepEqual(original, copy, 'Unchunked / rechunked files match')
})

test('chunk (custom size of 1MB)', async t => {
  t.plan(1)
  dest = newDest()
  reset()
  await chunk({ src, dest, maxSize: (1000 * 1000) })
  let chunks = fs.readdirSync(dest, { withFileTypes: true })
  t.ok(chunks.length === 10, 'there are ten chunks')
  console.log(chunks)
})

test('unchunk', async t => {
  t.plan(1)
  await unchunk({
    src: dest,
    dest: baked,
  })
  let original = fs.readFileSync(src)
  let copy = fs.readFileSync(baked)
  t.deepEqual(original, copy, 'Unchunked / rechunked files match')
})

test('teardown', t => {
  t.plan(1)
  reset()
  t.pass('Done!')
})
