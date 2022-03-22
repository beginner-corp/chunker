let test = require('tape')
let path = require('path')
let fs = require('fs')
let src = path.join(__dirname, 'arc-basic.zip')
let tmp = path.join(__dirname, 'tmp')
let newDest = () => path.join(tmp, `${Date.now()}`)
let baked = path.join(__dirname, 'baked.zip')
let { chunk, unchunk } = require('.')

let original = fs.readFileSync(src)
let maxSize = 1000 * 1000 // 1MB
let dest

function reset () {
  try { fs.rmSync(baked) }
  catch (e) { /* noop */ }
  try { fs.rmSync(tmp, { recursive: true, force: true }) }
  catch (e) { /* noop */ }
  fs.mkdirSync(dest, { recursive: true })
}

test('Chunk (default size of 3MB, written to disk)', async t => {
  t.plan(1)
  dest = newDest()
  reset()
  await chunk({ src, dest })
  let chunks = fs.readdirSync(dest, { withFileTypes: true })
  t.ok(chunks.length === 4, 'There are four chunks')
  console.log(chunks)
})

test('Unchunk (default size of 3MB, written to disk)', async t => {
  t.plan(1)
  await unchunk({
    src: dest,
    dest: baked,
  })
  let copy = fs.readFileSync(baked)
  t.deepEqual(original, copy, 'Unchunked file matches')
})

test('Unchunk (default size of 3MB, returned in buffer)', async t => {
  t.plan(1)
  let copy = await unchunk({
    src: dest,
    write: false,
  })
  t.deepEqual(original, copy, 'Unchunked buffer matches')
})

test('Chunk + unchunk (default size of 3MB, returned in an object + buffer)', async t => {
  t.plan(2)
  dest = newDest()
  reset()
  let chunks = await chunk({ src, write: false })
  t.equal(Object.keys(chunks).length, 4, 'There are four chunks')
  let unchunked = await unchunk({ chunks, write: false })
  t.deepEqual(original, unchunked, 'Unchunked / rechunked files match')
  console.log(chunks)
})

test('Chunk (specified size of 1MB, written to disk)', async t => {
  t.plan(1)
  dest = newDest()
  reset()
  await chunk({ src, dest, maxSize })
  let chunks = fs.readdirSync(dest, { withFileTypes: true })
  t.ok(chunks.length === 10, 'There are ten chunks')
  console.log(chunks)
})

test('Unchunk (specified size of 1MB, written to disk)', async t => {
  t.plan(1)
  await unchunk({
    src: dest,
    dest: baked,
  })
  let copy = fs.readFileSync(baked)
  t.deepEqual(original, copy, 'Unchunked file matches')
})

test('Unchunk (specified size of 1MB, returned in buffer)', async t => {
  t.plan(1)
  let copy = await unchunk({
    src: dest,
    write: false,
  })
  t.deepEqual(original, copy, 'Unchunked buffer matches')
})

test('Chunk + unchunk (specified size of 1MB, returned in an object + buffer)', async t => {
  t.plan(2)
  dest = newDest()
  reset()
  let chunks = await chunk({ src, maxSize, write: false })
  t.equal(Object.keys(chunks).length, 10, 'There are ten chunks')
  let unchunked = await unchunk({ chunks, write: false })
  t.deepEqual(original, unchunked, 'Unchunked / rechunked files match')
  console.log(chunks)
})

test('Chunk + unchunk a bunch of chunks (specified size of 50KB, returned in an object + buffer)', async t => {
  t.plan(2)
  dest = newDest()
  reset()
  let chunks = await chunk({ src, maxSize: 1000 * 50, write: false })
  t.equal(Object.keys(chunks).length, 195, 'There are 195 chunks')
  let unchunked = await unchunk({ chunks, write: false })
  t.deepEqual(original, unchunked, 'Unchunked / rechunked files match')
})

test('Teardown', t => {
  t.plan(1)
  reset()
  t.pass('Done!')
})
