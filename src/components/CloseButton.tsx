import { Close } from '@mui/icons-material'
import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

interface Props {
  onClose: () => void
}

const useStyles = makeStyles()(theme => ({
  wrapper: {
    padding: theme.spacing(1),
    cursor: 'pointer',
  },
}))

export function CloseButton({ onClose }: Props): ReactElement {
  const { classes } = useStyles()

  return (
    <div className={classes.wrapper} onClick={onClose}>
      <Close />
    </div>
  )
}
