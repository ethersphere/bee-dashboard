import { createStyles, makeStyles } from '@material-ui/core'
import { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  }),
)

interface Props {
  alt: string
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitImage(props: Props): ReactElement {
  const classes = useStyles()

  const inlineStyles: Record<string, string> = {}

  props.maxHeight && (inlineStyles.maxHeight = props.maxHeight)
  props.maxWidth && (inlineStyles.maxWidth = props.maxWidth)

  return <img className={classes.image} alt={props.alt} src={props.src} style={inlineStyles} />
}
