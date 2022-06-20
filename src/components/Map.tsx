import { ReactElement, CSSProperties, useContext, useState, useEffect } from 'react'
import type { Peer } from '@ethersphere/bee-js'
import DottedMap, { DottedMapWithoutCountriesLib } from 'dotted-map/without-countries'
import nodesDb from '../assets/data/nodes-db.json'
import { Context } from '../providers/Bee'
import mapData from '../assets/data/map-data.json'

interface Props {
  style?: CSSProperties
}

interface MapRecord {
  lat: number
  lng: number
}

type MapDB = Record<string, MapRecord>

const fullMapDb = nodesDb as unknown as MapDB
const deduplicatedRecords = deduplicate(fullMapDb)

function deduplicate(db: MapDB): MapRecord[] {
  const noDuplicates: Record<string, MapRecord> = {}

  Object.entries(fullMapDb).forEach(([key, record]) => {
    noDuplicates[`${record.lat} ${record.lng}`] = record
  })

  return Object.values(noDuplicates)
}

function findIntersection(db: MapDB, peers: Peer[]): MapRecord[] {
  const noDuplicates: Record<string, MapRecord> = {}
  peers.forEach(({ address }) => {
    const record = db[address]

    if (record) noDuplicates[`${record.lat} ${record.lng}`] = record
  })

  return Object.values(noDuplicates)
}

function addPins(map: DottedMap, pins: MapRecord[], color: string) {
  pins.forEach(({ lat, lng }) => {
    map.addPin({ lat, lng, svgOptions: { color } })
  })
}

const mapPrecomputed = new DottedMap({ map: JSON.parse(mapData) })
addPins(mapPrecomputed, deduplicatedRecords, '#dd7200')

const mapSvgOptions: DottedMapWithoutCountriesLib.SvgSettings = { shape: 'hexagon', radius: 0.21, color: '#dadada' }

export default function Card({ style }: Props): ReactElement {
  const { peers } = useContext(Context)
  const [map, setMap] = useState<string>(mapPrecomputed.getSVG(mapSvgOptions))

  useEffect(() => {
    if (!peers) return

    const points = findIntersection(fullMapDb, peers)
    const mapNew = Object.create(mapPrecomputed)
    addPins(mapNew, points, '#67BE68')
    setMap(mapNew.getSVG(mapSvgOptions))
  }, [peers])

  return (
    <div
      style={Object.assign({}, style, {
        width: '100%',
        height: '380px',
        backgroundColor: '#f3f3f3',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <img
        alt="world map"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(map)}`}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
