import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, ReactNode } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      height: '100%',
    },
  }),
)

interface Props {
  children: ReactNode
  maxHeight?: string
  textAlign?: 'left' | 'right' | 'center'
}

export default function Container(props: Props): ReactElement {
  const classes = useStyles()

  const inlineStyles: Record<string, string> = {}

  props.maxHeight && (inlineStyles.maxHeight = props.maxHeight)
  props.textAlign && (inlineStyles.textAlign = props.textAlign)

  return (
    <div className={classes.container} style={inlineStyles}>
      {props.children}
    </div>
  )
}
