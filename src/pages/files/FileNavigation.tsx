import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../routes'

interface Props {
  active: 'UPLOAD' | 'DOWNLOAD'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(4),
    },
    leftTab: {
      marginRight: theme.spacing(0.5),
    },
    rightTab: {
      marginLeft: theme.spacing(0.5),
    },
  }),
)

export function FileNavigation({ active }: Props): ReactElement {
  const classes = useStyles()
  const history = useHistory()

  function onChange(event: React.ChangeEvent<Record<string, never>>, newValue: number) {
    history.push(newValue === 1 ? ROUTES.DOWNLOAD : ROUTES.UPLOAD)
  }

  return (
    <div className={classes.root}>
      <Tabs value={active === 'UPLOAD' ? 0 : 1} onChange={onChange} variant="fullWidth">
        <Tab className={classes.leftTab} key="UPLOAD" label="Upload" />
        <Tab className={classes.rightTab} key="DOWNLOAD" label="Download" />
      </Tabs>
    </div>
  )
}
