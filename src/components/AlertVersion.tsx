import { ReactElement, useState, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { Context } from '../providers/Bee'
import { SUPPORTED_BEE_VERSION_EXACT } from '@ethersphere/bee-js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  }),
)

export default function VersionAlert(): ReactElement | null {
  const classes = useStyles()
  const { isLoading, latestUserVersionExact } = useContext(Context)
  const [open, setOpen] = useState<boolean>(true)

  const isExactlySupportedBeeVersion = SUPPORTED_BEE_VERSION_EXACT === latestUserVersionExact

  if (isLoading || !latestUserVersionExact) return null

  return (
    <Collapse in={!isExactlySupportedBeeVersion && open}>
      <div className={classes.root}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Warning</AlertTitle>
          Your Bee node version (<code>{latestUserVersionExact}</code>) does not exactly match the Bee version we tested
          the Bee Dashboard against (<code>{SUPPORTED_BEE_VERSION_EXACT}</code>). Please note that some functionality
          may not work properly.
        </Alert>
      </div>
    </Collapse>
  )
}
