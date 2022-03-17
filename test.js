let test = require('tape')
let path = require('path')
let fs = require('fs')
let src = path.join(__dirname, 'arc-basic.zip')
let dest = path.join(__dirname, 'tmp')
let baked = path.join(__dirname, 'baked.zip')

let { chunk, unchunk } = require('.')

test('clobber', async t => {
  t.plan(1)
  try { fs.rmSync(baked) }
  catch (e) { /* noop */ }
  try { fs.rmSync(dest, { recursive: true, force: true }) }
  catch (e) { /* noop */ }
  t.pass('clobbered tmp')
})

test('chunk', async t => {
  t.plan(1)
  fs.mkdirSync(dest, { recursive: true })
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
  t.deepEqual(original, copy)
})

test('sort', t => {
  t.plan(1)
  let data = [
    'b85b49ab6fba97223597c4d9b576d05f35da2144-2-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-1-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-0-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-3-4',
  ].sort()
  console.log(data)
  t.deepEqual(data, [
    'b85b49ab6fba97223597c4d9b576d05f35da2144-0-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-1-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-2-4',
    'b85b49ab6fba97223597c4d9b576d05f35da2144-3-4',
  ])
})
