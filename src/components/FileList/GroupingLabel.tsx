import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    labelContainer: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '12px',
      backgroundColor: '#FFFFFF',
      padding: '5px',
    },
    lineContainer: {
      width: '100%',
      '& hr': {
        borderTop: '1px solid ##33333333',
      },
    },
  }),
)

interface Props {
  label?: string
}

const GroupingLabel = ({ label }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.labelContainer}>{label}</div>
      <div className={classes.lineContainer}>
        <hr />
      </div>
    </div>
  )
}

export default GroupingLabel
