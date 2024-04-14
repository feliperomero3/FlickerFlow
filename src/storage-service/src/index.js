const express = require('express')
const fs = require('fs')
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const debug = require('debug')('storage-service:server')
const appname = 'storage-service'
const seedVideo = 'sample.mp4'

const environment = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3001
const storageContainerName = process.env.STORAGE_CONTAINER_NAME || 'videos'
const storageHost = process.env.STORAGE_HOST || 'localhost'
const storagePort = parseInt((process.env.STORAGE_PORT || 10000).toString())
const storageEndpoint = process.env.STORAGE_ENDPOINT || `http://${storageHost}:${storagePort}/devstoreaccount1`
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME || 'devstoreaccount1'
const storageAccessKey = process.env.STORAGE_ACCESS_KEY || 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='

debug('Environment is %o', environment)
debug('Azure storage endpoint is %o', storageEndpoint)
debug('Azure storage account is %o.', storageAccountName)
debug('Azure storage blob container is %o.', storageContainerName)
debug('Booting %o...', appname)

/**
 * Create the Blob service API client to communicate with Azure storage.
 * @param {string} storageEndpoint The Azure storage endpoint.
 * @param {string} storageAccountName The Azure storage account name.
 * @param {string} storageAccessKey The Azure storage access key.
 * @returns {BlobServiceClient} The Blob service API.
 */
function createBlobStorageService(storageEndpoint, storageAccountName, storageAccessKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccessKey)
  const blobService = new BlobServiceClient(storageEndpoint, sharedKeyCredential)
  return blobService
}

/**
 * Get the seed video data for the application.
 * @param {string} seedVideoFileName The video file name (e. g. sample.mp4).
 * @returns {Promise<fs.ReadStream>} The video stream.
 */
async function getSeedVideo(seedVideoFileName) {
  const videoPath = `../assets/${seedVideoFileName}`
  const exists = fs.existsSync(videoPath)
  if (!exists) {
    debug('Getting seed video from the file system %o', videoPath)
    const videoStream = fs.createReadStream(videoPath)
    return videoStream
  }
  throw new Error(`Seed video ${videoPath} not found`)
}

const app = express()

app.get('/video', async (req, res) => {
  if (!req.query.path) {
    throw new Error('Missing "path" query string key')
  }
  debug('Requesting video %o', req.query.path)

  const path = req.query.path.toString()
  const blobService = createBlobStorageService(storageEndpoint, storageAccountName, storageAccessKey)
  const containerClient = blobService.getContainerClient(storageContainerName)
  const blobClient = containerClient.getBlobClient(path)
  const exists = await blobClient.exists()

  if (!exists) {
    if (path === seedVideo) {
      const videoStream = await getSeedVideo(seedVideo)
      const videoSize = fs.statSync(videoStream.path).size
      res.writeHead(200, {
        'Content-Length': videoSize,
        'Content-Type': 'video/mp4'
      })
      videoStream.pipe(res)
      return
    }
    res.status(404).send('Blob not found')
    return
  }
  const blob = await blobClient.download()
  const properties = await blobClient.getProperties()

  if (!blob.readableStreamBody) {
    throw new Error('"readableStreamBody" is undefined')
  }

  res.writeHead(200, {
    'Content-Length': properties.contentLength,
    'Content-Type': 'video/mp4'
  })
  blob.readableStreamBody.pipe(res)
})

app.get('/', (req, res) => {
  const path = seedVideo
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
