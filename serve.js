#!/usr/bin/env node

const path = require('path')
const serve = require('http-serve')
const opener = require('opener')

const {getAvailablePort} = require('./getPort.js')

const server = serve.createServer({
  root: path.join(__dirname, 'build')

})

async function main() {
  const port = await getAvailablePort()
  server.listen(port, '127.0.0.1', function () {
    console.log(`Starting up Bee Dashboard on address http://localhost:${port}`)
    console.log('Hit CTRL-C to stop the server')
    opener(`http://localhost:${port}`)
  })
}

main();
