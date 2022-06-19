#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')

const DATA_SOURCE = 'https://swarmscan-api.resenje.org/v1/network/dump'
const DATA_DESTINATION = './src/assets/data/nodes-db.json'

async function getData(url) {
  const res = await axios.get(url)

  return res.data
}

function processData(data) {
  const db = {}
  data.nodes.forEach(node => {
    db[node.overlay] = { latitude: node.location.latitude, longitude: node.location.longitude }
  })

  return db
}

function saveDb(db, path) {
  return fs.writeFileSync(path, JSON.stringify(db, null, 2))
}

async function main() {
  console.log('Fetching data')
  const dataDump = await getData(DATA_SOURCE)

  console.log('Processing data')
  const db = processData(dataDump)

  console.log('Saving data')
  await saveDb(db, DATA_DESTINATION)

  console.log('Done')
}

main()
