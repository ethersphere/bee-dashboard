import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core'

function truncStringPortion(str: string, firstCharCount = 10, endCharCount = 10) {
  return `${str.substring(0, firstCharCount)}...${str.substring(str.length - endCharCount, str.length)}`
}

interface Props {
  peerId: string
}

export default function PeerDetail(props: Props): ReactElement {
  return (
    <Typography
      variant="button"
      style={{
        fontFamily: 'monospace, monospace',
      }}
    >
      {truncStringPortion(props.peerId)}
    </Typography>
  )
}
