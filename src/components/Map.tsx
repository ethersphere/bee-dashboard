import type { Peer } from '@upcoming/bee-js'
import DottedMap, { DottedMapWithoutCountriesLib } from 'dotted-map/without-countries'
import { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react'
import mapData from '../assets/data/map-data.json'
import nodesDb from '../assets/data/nodes-db.json'
import { Context } from '../providers/Bee'

interface Props {
  style?: CSSProperties
  error?: boolean
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
const mapNoPins = new DottedMap({ map: JSON.parse(mapData) })
addPins(mapPrecomputed, deduplicatedRecords, '#303030')

const mapSvgOptions: DottedMapWithoutCountriesLib.SvgSettings = { shape: 'hexagon', radius: 0.21, color: '#dadada' }

export default function Card({ style, error }: Props): ReactElement {
  const { peers } = useContext(Context)
  const [map, setMap] = useState<string>(mapPrecomputed.getSVG(mapSvgOptions))

  useEffect(() => {
    // Display error map
    if (error) setMap(mapNoPins.getSVG({ ...mapSvgOptions, color: '#eaeaea' }))

    // Display just the base map without any connections
    if (!peers) return

    const points = findIntersection(fullMapDb, peers)
    const mapNew = Object.create(mapPrecomputed)
    addPins(mapNew, points, '#09CA6C')
    setMap(mapNew.getSVG(mapSvgOptions))
  }, [peers, error])

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
        position: 'relative',
      })}
    >
      <img
        alt="world map"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(map)}`}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', flex: 1 }}
      />
      {error && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="#f44336"
          strokeWidth="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.25 }}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line stroke="#f3f3f3" strokeWidth="2" x1="12" y1="9" x2="12" y2="13"></line>
          <line stroke="#f3f3f3" strokeWidth="2" x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )}
    </div>
  )
}
