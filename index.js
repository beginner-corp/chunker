const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const CHUNK_MAX = 3e+6 // 3mb

module.exports = { chunk, unchunk }

async function chunk({src, dest}) {

  // read src to a buffer
  let raw = fs.readFileSync(src) 
  let shasum = crypto.createHash('sha1').update(src)
  let guid = shasum.digest('hex')
  let chunks = []
  let index = 0

  // iterate the bytes
  for (const [i, byte] of raw.entries()) {

    // if the current chunk is full increment the index
    if (chunks[index] && chunks[index].length >= CHUNK_MAX)
      index += 1

    // init current chunk index to an array
    if (!chunks[index])
      chunks[index] = []

    // push byte into chunk
    chunks[index].push(byte)
  }
  
  // chunk src into 3mb chunks 
  let count = chunks.length 
  for (let index = 0; index < count; index++) {
    let name = `${guid}-${index}-${count}`
    let b = Buffer.from(chunks[index])
    fs.writeFileSync(path.join(dest, name), b)
  }
}

async function unchunk({src, dest}) {
  let fmt = f=> path.join(src, f.name) 
  let chunks = fs.readdirSync(src, { withFileTypes: true }).map(fmt)
  let result = []
  for (let chunk of chunks)
    for (const [i, b] of fs.readFileSync(chunk).entries())
      result.push(b)
  fs.writeFileSync(dest, Buffer.from(result))
}
