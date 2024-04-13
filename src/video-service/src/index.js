const express = require('express')
const http = require('http')
const debug = require('debug')('video-service:server')
const appname = 'video-service'

const environment = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const videoStorageHost = process.env.VIDEO_STORAGE_HOST || 'localhost'
const videoStoragePort = parseInt((process.env.VIDEO_STORAGE_PORT || 3001).toString())

debug('Environment is %o', environment)
debug('Video storage host is %o', videoStorageHost)
debug('Video storage port is %o', videoStoragePort)
debug('Booting %o...', appname)

const app = express()

app.get('/video', async (req, res) => {
  const key = 'path'
  const value = req.query.path
  debug('req.query.path is %o', req.query.path)
  if (!value) {
    res.status(404).send('Not Found')
    return
  }
  const path = `/video?${key}=${value}`
  const forwardOptions = {
    method: 'GET',
    headers: req.headers,
    host: videoStorageHost,
    port: videoStoragePort,
    path: path
  }
  debug('Forwarding options is %o', {
    ...forwardOptions,
    headers: '<<omitted>>'
  })
  const forwardRequest = http.request(forwardOptions, forwardResponse => {
    res.writeHead(forwardResponse.statusCode || 200, forwardResponse.headers)
    forwardResponse.pipe(res)
  })
  req.pipe(forwardRequest)
})

app.get('/', (req, res) => {
  const content = `
    <h1>Hello World!</h1>
    <p>Welcome to ${appname}! Go to <a href="/video?path=sample.mp4">Video</a></p>
  `
  res.writeHead(200, {
    'Content-Type': 'text/html'
  }).end(content)
})

app.listen(port, () => {
  const message = `${appname} listening at http://localhost:${port}`
  debug(message)
  if (!debug.enabled) {
    console.log(message)
  }
})
