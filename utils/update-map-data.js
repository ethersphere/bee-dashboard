#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')
const getMapJSON = require('dotted-map').getMapJSON

const DATA_SOURCE = 'https://swarmscan-api.resenje.org/v1/network/dump'
const DATA_DESTINATION = './src/assets/data/nodes-db.json'
const MAP_HEIGHT = 50
const MAP_DESTINATION = './src/assets/data/map-data.json'

async function getData(url) {
  const res = await axios.get(url)

  return res.data
}

function processData(data) {
  const db = new Map()
  data.nodes.forEach(node => {
    if (node.location) {
      db.set(node.overlay, { lat: node.location.latitude, lng: node.location.longitude })
    }
  })

  return Object.fromEntries([...db.entries()].sort())
}

function saveFile(db, path) {
  return fs.writeFileSync(path, JSON.stringify(db, null, 2))
}

function preComputeMap() {
  return getMapJSON({ height: MAP_HEIGHT, grid: 'diagonal' })
}

async function main() {
  console.log('Fetching DB data')
  const dataDump = await getData(DATA_SOURCE)

  console.log('Processing DB data')
  const db = processData(dataDump)

  console.log('Saving DB data')
  saveFile(db, DATA_DESTINATION)

  console.log('Pre-computing the word map')
  const map = preComputeMap()

  console.log('Saving map data')
  saveFile(map, MAP_DESTINATION)

  console.log('Done')
}

main()
