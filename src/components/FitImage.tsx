import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}))

interface Props {
  alt: string
  src: string | undefined
  maxHeight?: string
  maxWidth?: string
}

export function FitImage(props: Props): ReactElement {
  const { classes } = useStyles()

  const inlineStyles: Record<string, string> = {}

  if (props.maxHeight) {
    inlineStyles.maxHeight = props.maxHeight
  }

  if (props.maxWidth) {
    inlineStyles.maxWidth = props.maxWidth
  }

  return <img className={classes.image} alt={props.alt} src={props.src} style={inlineStyles} />
}
