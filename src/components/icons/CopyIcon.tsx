import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
    },
  }),
)

interface Props {
  color?: string
}

const CopyIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.2227 2.22217H8.44488C7.58699 2.22217 6.88932 2.91983 6.88932 3.77772V6.88883H3.77821C2.92032 6.88883 2.22266 7.5865 2.22266 8.44439V16.2222C2.22266 17.0801 2.92032 17.7777 3.77821 17.7777H11.556C12.4139 17.7777 13.1115 17.0801 13.1115 16.2222V13.1111H16.2227C17.0805 13.1111 17.7782 12.4134 17.7782 11.5555V3.77772C17.7782 2.91983 17.0805 2.22217 16.2227 2.22217ZM3.77821 16.2222V8.44439H11.556L11.5575 16.2222H3.77821ZM16.2227 11.5555H13.1115V8.44439C13.1115 7.5865 12.4139 6.88883 11.556 6.88883H8.44488V3.77772H16.2227V11.5555Z"
          fill={color ? color : '#333333'}
        />
      </svg>
    </div>
  )
}

export default CopyIcon
