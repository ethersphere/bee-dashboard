#!/usr/bin/env node

const path = require('path')
const serve = require('http-serve')
const opener = require('opener')

const server = serve.createServer({
  root: path.join(__dirname, 'build')

})

server.listen(8080, '127.0.0.1', function () {
  console.log('Starting up Bee Dashboard on address http://localhost:8080')
  console.log('Hit CTRL-C to stop the server')
  opener('http://localhost:8080')
})
