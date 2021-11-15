import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, ReactNode } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      height: '100%',
    },
  }),
)

interface Props {
  children: ReactNode[]
  maxHeight?: string
}

export default function Container(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.container} style={props.maxHeight ? { maxHeight: props.maxHeight } : undefined}>
      {props.children}
    </div>
  )
}
