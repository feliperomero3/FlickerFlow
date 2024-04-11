const express = require('express')
const http = require('http')
const debug = require('debug')('flicker-flow:server')
const appname = 'FlickerFlow'

const environment = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const videoStorageHost = process.env.VIDEO_STORAGE_HOST || 'http://localhost'
const videoStoragePort = parseInt((process.env.VIDEO_STORAGE_PORT || 3001).toString())

debug('Environment is %o', environment)
debug('Video storage host is %o', videoStorageHost)
debug('Video storage port is %o', videoStoragePort)
debug('Booting %o...', appname)

const app = express()

app.get('/video', async (req, res) => {
  const forwardOptions = {
    method: 'GET',
    path: '/video?path=sample.mp4',
    headers: req.headers,
    host: videoStorageHost,
    port: videoStoragePort
  }
  debug('Forwarding options is %o', forwardOptions)
  const forwardRequest = http.request(forwardOptions, forwardResponse => {
    res.writeHead(forwardResponse.statusCode || 200, forwardResponse.headers)
    forwardResponse.pipe(res)
  })
  req.pipe(forwardRequest)
})

app.get('/', (req, res) => {
  const content = `
    <h1>Hello World!</h1>
    <p>Welcome to ${appname}! Go to <a href="/video">Video</a></p>
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
