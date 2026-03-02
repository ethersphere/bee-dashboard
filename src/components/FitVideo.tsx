import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}))

interface VideoProps {
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitVideo(props: VideoProps): ReactElement {
  const { classes } = useStyles()

  const inlineStyles: Record<string, string> = {}

  if (props.maxHeight) {
    inlineStyles.maxHeight = props.maxHeight
  }

  if (props.maxWidth) {
    inlineStyles.maxWidth = props.maxWidth
  }

  return <video className={classes.video} src={props.src} style={inlineStyles} controls />
}
