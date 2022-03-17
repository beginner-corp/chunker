const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const CHUNK_MAX = 3e+6 // 3mb

module.exports = { chunk, unchunk }

async function chunk ({ src, dest, maxSize, write = true }) {
  maxSize = maxSize || CHUNK_MAX

  // read src to a buffer
  let raw = fs.readFileSync(src)
  let shasum = crypto.createHash('sha1').update(raw.toString('base64'))
  let guid = shasum.digest('hex')
  let chunks = {}

  // chunk le bytes
  let count = Math.ceil(raw.length / maxSize)
  let loop = new Array(count).fill(0)
  loop.forEach((zero, i) => {
    let name = `${guid}-${i}-${count}`
    let start = i * maxSize
    let end = (i + 1) * maxSize
    chunks[name] = raw.subarray(start, end)
  })

  if (write) {
    Object.entries(chunks).forEach(([ name, buf ]) => {
      fs.writeFileSync(path.join(dest, name), buf)
    })
  }
  else return chunks
}

async function unchunk ({ src, dest, write = true }) {
  let fmt = f => path.join(src, f.name)
  let chunks = fs.readdirSync(src, { withFileTypes: true }).map(fmt)
  let result = []
  for (let chunk of chunks) {
    result.push(fs.readFileSync(chunk))
  }
  let buf = Buffer.concat(result)
  if (write) {
    fs.writeFileSync(dest, buf)
  }
  else return buf
}
