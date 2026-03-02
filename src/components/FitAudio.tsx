import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  audio: {
    width: '100%',
    maxWidth: '250px',
  },
}))

interface AudioProps {
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitAudio(props: AudioProps): ReactElement {
  const { classes } = useStyles()

  const inlineStyles: Record<string, string> = {}

  if (props.maxHeight) {
    inlineStyles.maxHeight = props.maxHeight
  }

  if (props.maxWidth) {
    inlineStyles.maxWidth = props.maxWidth
  }

  return <audio className={classes.audio} src={props.src} style={inlineStyles} controls />
}
