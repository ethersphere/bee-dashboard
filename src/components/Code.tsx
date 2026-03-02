import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

interface Props {
  children: string
  prettify?: boolean
}

const useStyles = makeStyles()(theme => ({
  wrapper: {
    overflow: 'scroll',
    background: '#ffffff',
  },
  pre: {
    maxHeight: '6em',
    padding: theme.spacing(2),
  },
}))

function prettifyString(string: string): string {
  try {
    return JSON.stringify(JSON.parse(string), null, 4)
  } catch {
    return string
  }
}

export function Code({ children, prettify }: Props): ReactElement {
  const { classes } = useStyles()

  return (
    <div className={classes.wrapper}>
      <pre className={classes.pre}>{prettify ? prettifyString(children) : children}</pre>
    </div>
  )
}
