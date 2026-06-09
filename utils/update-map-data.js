#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */

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
  if (!data || !Array.isArray(data.nodes) || data.nodes.length === 0) {
    throw new Error(
      `Invalid API response: expected a non-empty nodes array, got ${JSON.stringify(data)?.slice(0, 200)}`,
    )
  }

  const db = new Map()
  data.nodes.forEach(node => {
    if (node.location) {
      db.set(node.overlay, { lat: node.location.latitude, lng: node.location.longitude })
    }
  })

  console.log(`Nodes with location: ${db.size} / ${data.nodes.length} total`)

  return Object.fromEntries([...db.entries()].sort())
}

function saveFile(db, path) {
  const tmp = `${path}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2))
  fs.renameSync(tmp, path)
}

function preComputeMap() {
  return getMapJSON({ height: MAP_HEIGHT, grid: 'diagonal' })
}

async function main() {
  console.log('Fetching DB data')
  const dataDump = await getData(DATA_SOURCE)

  console.log('Processing DB data')
  const db = processData(dataDump)

  const existingCount = Object.keys(JSON.parse(fs.readFileSync(DATA_DESTINATION, 'utf8'))).length
  const fetchedCount = Object.keys(db).length
  console.log(`Committed nodes: ${existingCount}, fetched nodes: ${fetchedCount}`)

  if (fetchedCount < existingCount) {
    console.warn(
      `WARNING: fetched node count (${fetchedCount}) is less than committed (${existingCount}). Consider whether this data is safe to commit.`,
    )
  }

  console.log('Saving DB data')
  saveFile(db, DATA_DESTINATION)

  console.log('Pre-computing the word map')
  const map = preComputeMap()

  console.log('Saving map data')
  saveFile(map, MAP_DESTINATION)

  console.log('Done')
}

main().catch(err => {
  console.error('update-map-data failed:', err.message)
  process.exit(1)
})
