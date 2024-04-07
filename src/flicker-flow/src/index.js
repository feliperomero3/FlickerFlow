const express = require('express')
const fs = require('fs')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const app = express()
app.set('appname', 'FlickerFlow')
app.set('port', port)
app.set('host', host)

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
  res.send('Hello World!')
})

app.listen(port, host, () => {
  console.log(`FlickerFlow listening at http://${host}:${port}`)
})
