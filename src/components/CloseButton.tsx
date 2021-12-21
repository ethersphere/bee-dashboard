import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { ReactElement } from 'react'

interface Props {
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(1),
      cursor: 'pointer',
    },
  }),
)

export function CloseButton({ onClose }: Props): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.wrapper} onClick={onClose}>
      <Close />
    </div>
  )
}
