import { makeStyles } from '@material-ui/core/styles'
import type { ReactElement } from 'react'

interface Props {
  children: ReactElement | ReactElement[]
}

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rowBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
})

/**
 * Elements within a row are vertically aligned to the center.
 */
export function Row({ children }: Props): ReactElement {
  const classes = useStyles()

  return <div className={classes.row}>{children}</div>
}

/**
 * Elements within a row are vertically aligned to the center.
 *
 * Horizontal alignment is done by adding the maximum possible space between the elements.
 */
export function RowBetween({ children }: Props): ReactElement {
  const classes = useStyles()

  return <div className={classes.rowBetween}>{children}</div>
}
