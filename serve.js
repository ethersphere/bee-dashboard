#!/usr/bin/env node

const path = require('path')
const handler = require('serve-handler');
const http = require('http');
const opener = require('opener')

const serverConfig = {
  public: path.join(__dirname, 'build'),
  trailingSlash: false,
  rewrites: [
    { source: "**", destination: "/index.html" },
  ],
  headers: [
      {
        source: "*",
        headers: [{
          key: "Cache-Control",
          value: "max-age=3600"
        }]
      }
  ]
}

const server = http.createServer((request, response) => {

  return handler(request, response, serverConfig);
})
 
server.listen(8080, () => {
  console.log('Starting up Bee Dashboard on address http://localhost:8080')
  console.log('Hit CTRL-C to stop the server')
  opener('http://localhost:8080')
})
