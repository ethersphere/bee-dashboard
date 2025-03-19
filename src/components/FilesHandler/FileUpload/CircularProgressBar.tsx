import { CircularProgress, CircularProgressProps, createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

interface Props {
  value: number
  size: number
  customColor?: string
}
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      position: 'relative',
      '.MuiCircularProgress-root': {
        width: '10px',
      },
    },
  }),
)

const CircularProgressBar = ({
  value,
  size,
  customColor,
  ...circularProgressProps
}: CircularProgressProps & Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <CircularProgress
        variant="determinate"
        value={value}
        {...circularProgressProps}
        style={{ width: size, height: size, color: customColor }}
      />
    </div>
  )
}

export default CircularProgressBar
