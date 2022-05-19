#!/usr/bin/env node

const path = require('path')
const handler = require('serve-handler')
const http = require('http')
const opener = require('opener')

const port = process.env.PORT || 8080

const serverConfig = {
  public: path.join(__dirname, 'build'),
  trailingSlash: false,
  rewrites: [{ source: '**', destination: '/index.html' }],
  headers: [
    {
      source: '*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'max-age=3600',
        },
      ],
    },
  ],
}

const server = http.createServer((request, response) => {
  return handler(request, response, serverConfig)
})

server.listen(port, () => {
  console.log(`Starting up Bee Dashboard on address http://localhost:${port}`)
  console.log('Hit CTRL-C to stop the server')
  opener(`http://localhost:${port}`)
})
