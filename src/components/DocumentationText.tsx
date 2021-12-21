import { createStyles, makeStyles, Typography } from '@material-ui/core'
import { ReactElement } from 'react'

interface Props {
  children: (string | ReactElement)[] | (string | ReactElement)
}

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      color: '#606060',
      fontSize: '0.9rem',
    },
  }),
)

export function DocumentationText({ children }: Props): ReactElement {
  const classes = useStyles()

  return <Typography className={classes.text}>{children}</Typography>
}
