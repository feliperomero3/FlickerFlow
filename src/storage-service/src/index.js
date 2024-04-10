const express = require('express')
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const debug = require('debug')('storage-service:server')

const appname = 'StorageService'
const environment = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3001
const storageContainerName = process.env.STORAGE_CONTAINER_NAME || 'videos'
const storageEndpoint = process.env.STORAGE_ENDPOINT || 'http://0.0.0.0:10000/devstoreaccount1'
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME || 'devstoreaccount1'
const storageAccessKey = process.env.STORAGE_ACCESS_KEY || 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='

debug('Environment is %o', environment)
debug('Azure storage endpoint is %o', storageEndpoint)
debug('Azure storage account is %o.', storageAccountName)
debug('Azure storage blob container is %o.', storageContainerName)
debug('Booting %o...', appname)

/**
 * Create the Blob service API client to communicate with Azure storage.
 * @returns {BlobServiceClient} The Blob service API.
 */
function createBlobService() {
  const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccessKey)
  const blobService = new BlobServiceClient(storageEndpoint, sharedKeyCredential)
  return blobService
}

const app = express()

app.get('/video', async (req, res) => {
  if (!req.query.path && typeof req.query.path !== 'string') {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    }).end('Missing "path" query parameter')
    return
  }
  const path = req.query.path.toString()
  debug('Requesting video %o', path)

  const blobService = createBlobService()
  const containerClient = blobService.getContainerClient(storageContainerName)
  const blobClient = containerClient.getBlobClient(path)

  const blob = await blobClient.download()
  const properties = await blobClient.getProperties()

  if (!blob.readableStreamBody) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    }).end('"readableStreamBody" is undefined')
    return
  }

  res.writeHead(200, {
    'Content-Length': properties.contentLength,
    'Content-Type': 'video/mp4'
  })
  blob.readableStreamBody.pipe(res)
})

app.get('/', (req, res) => {
  const path = 'sample.mp4'
  const content = `
    <h1>Hello Video!</h1>
    <p>Welcome to ${appname}! Go to <a href="/video?path=${path}">Video</a></p>
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
