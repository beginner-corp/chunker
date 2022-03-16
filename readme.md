# `@begin/chunker`

Chunk binary files into smaller chunks.

## Usage

Chunk a file.

```javascript
let src = '/path/to/file.zip'
let dest = '/path/to/dir'
/** create 3mb chunks in /path/to/dir */
await chunk({src, dest}) 
```

Unchunk a directory of file chunks.

```javascript
let src = '/path/to/dir'
let dest = '/path/to/file.zip'
/** writes /path/to/file.zip */
await unchunk({src, dest}) 
```
