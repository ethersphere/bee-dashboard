import { createStyles, makeStyles } from '@material-ui/core'
import { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  }),
)

interface VideoProps {
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitVideo(props: VideoProps): ReactElement {
  const classes = useStyles()

  const inlineStyles: Record<string, string> = {}

  props.maxHeight && (inlineStyles.maxHeight = props.maxHeight)
  props.maxWidth && (inlineStyles.maxWidth = props.maxWidth)

  return <video className={classes.video} src={props.src} style={inlineStyles} controls autoPlay loop />
}
