import { createStyles, makeStyles } from '@material-ui/core'
import { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    audio: {
      width: '100%',
      maxWidth: '250px',
    },
  }),
)

interface AudioProps {
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitAudio(props: AudioProps): ReactElement {
  const classes = useStyles()

  const inlineStyles: Record<string, string> = {}

  props.maxHeight && (inlineStyles.maxHeight = props.maxHeight)
  props.maxWidth && (inlineStyles.maxWidth = props.maxWidth)

  return <audio className={classes.audio} src={props.src} style={inlineStyles} controls />
}
