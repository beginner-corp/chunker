# `@begin/chunker`

Chunk + unchunk binary files into smaller pieces, either on disk or in-memory.


## Usage

### Chunking

Chunk a file on the filesystem:

```javascript
let src = '/path/to/file.zip'
let dest = '/path/to/dir'
/* create 3MB chunks in /path/to/dir */
await chunk({ src, dest })
```

Chunk a buffer (instead of a file):

```javascript
let data = await zip('/some/dir')
let dest = '/path/to/dir'
/* create 3MB chunks in /path/to/dir */
await chunk({ data, dest })
```

Get a chunk object from a file on the filesystem:

```javascript
let src = '/path/to/file.zip'
/* returns a chunk object instead of writing to disk */
let chunks = await chunk({ src, write: false })
```

Get a chunk object from a buffer (instead of a file):

```javascript
let data = await zip('/some/dir')
/* returns a chunk object instead of writing to disk */
let chunks = await chunk({ data, write: false })
```


### Unchunking

Unchunk a directory of file chunks:

> Note: directory must contain *only* chunks created by `@begin/chunker`

```javascript
let src = '/path/to/dir'
let dest = '/path/to/file.zip'
/* writes /path/to/file.zip */
await unchunk({ src, dest })
```

Unchunk a directory of file chunks, return the buffer (instead of writing the unchunked file to disk):

```javascript
let src = '/path/to/dir'
/* returns buffer from chunked source dir */
let file = await unchunk({ src, write: false })
```


Unchunk a chunk object, return the buffer (instead of writing unchunked file to disk):

```javascript
let data = await zip('/some/dir')
let chunks = await chunk({ data, write: false })
/* returns buffer from chunk object */
let file = await unchunk({ chunks, write: false })
```
