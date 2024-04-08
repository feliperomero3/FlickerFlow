const express = require('express')
const fs = require('fs')
const debug = require('debug')('flicker-flow:server')
const appname = 'FlickerFlow'

const environment = process.env.NODE_ENV || 'development'
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

debug('Environment is %o', environment)
debug('booting %o...', appname)

const app = express()

app.get('/video', async (req, res) => {
  const path = 'src/assets/sample.mp4'

  // Note that we're using "fs.promises" instead of "fs" to
  // gain access to filesystem functions that are compatible
  // with JavaScript's async/await keywords.
  const stats = await fs.promises.stat(path)
  res.writeHead(200, {
    'Content-Length': stats.size,
    'Content-Type': 'video/mp4'
  })
  fs.createReadStream(path).pipe(res)
})

app.get('/', (req, res) => {
  const content = `
    <h1>Hello World!</h1>
    <p>Welcome to FlickerFlow! Go to <a href="/video">Video</a></p>
  `
  res.writeHead(200, {
    'Content-Type': 'text/html'
  }).end(content)
})

app.listen(port, host, () => {
  debug(`FlickerFlow listening at http://${host}:${port}`)
  if (!debug.enabled) {
    console.log(`FlickerFlow listening at http://${host}:${port}`)
  }
})
