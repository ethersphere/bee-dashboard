import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core'

function truncStringPortion(str: string, firstCharCount = 10, endCharCount = 10) {
  return `${str.substring(0, firstCharCount)}...${str.substring(str.length - endCharCount, str.length)}`
}

interface Props {
  peerId: string
  characterLength?: number
}

export default function PeerDetail({ peerId, characterLength }: Props): ReactElement {
  return (
    <Typography
      variant="button"
      style={{
        fontFamily: 'monospace, monospace',
      }}
    >
      {truncStringPortion(peerId, characterLength, characterLength)}
    </Typography>
  )
}
