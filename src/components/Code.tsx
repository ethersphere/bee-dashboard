import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { ReactElement } from 'react'

interface Props {
  children: string
  prettify?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      overflow: 'scroll',
      background: '#ffffff',
    },
    pre: {
      maxHeight: '6em',
      padding: theme.spacing(2),
    },
  }),
)

function prettifyString(string: string): string {
  try {
    return JSON.stringify(JSON.parse(string), null, 4)
  } catch {
    return string
  }
}

export function Code({ children, prettify }: Props): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <pre className={classes.pre}>{prettify ? prettifyString(children) : children}</pre>
    </div>
  )
}
