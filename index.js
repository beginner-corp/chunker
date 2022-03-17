const { readdir, readFile, writeFile } = require('fs/promises')
const crypto = require('crypto')
const { join } = require('path')
const CHUNK_MAX = 3e+6 // 3MB

module.exports = { chunk, unchunk }

async function chunk ({ data, src, dest, maxSize, write = true }) {
  maxSize = maxSize || CHUNK_MAX

  // read src to a buffer
  let raw = data || await readFile(src)
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
    for (let [ name, buf ] of Object.entries(chunks)) {
      await writeFile(join(dest, name), buf)
    }
  }
  else return chunks
}

async function unchunk ({ chunks, src, dest, write = true }) {
  let result = []
  if (chunks) {
    Object.keys(chunks).sort().forEach(k => {
      result.push(chunks[k])
    })
  }
  else {
    let fmt = f => join(src, f.name)
    let chunks = await readdir(src, { withFileTypes: true })
    chunks = chunks.map(fmt).sort()
    for (let chunk of chunks) {
      result.push(await readFile(chunk))
    }
  }

  let buf = Buffer.concat(result)
  if (write) {
    await writeFile(dest, buf)
  }
  else return buf
}
