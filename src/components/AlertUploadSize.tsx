import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import { ReactElement } from 'react'

const LIMIT = 100_000_000 // 100 megabytes

interface Props {
  files: File[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
)

export default function UploadSizeAlert(props: Props): ReactElement | null {
  const classes = useStyles()

  const totalSize = props.files.reduce((previous, current) => previous + current.size, 0)

  const aboveLimit = totalSize >= LIMIT

  return (
    <Collapse in={aboveLimit}>
      <div className={classes.root}>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          The files you are trying to upload are above the recommended size. The chunks may not be synchronised properly
          over the network.
        </Alert>
      </div>
    </Collapse>
  )
}
