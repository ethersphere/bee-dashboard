import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

interface Props {
  children: (string | ReactElement)[] | (string | ReactElement)
}

const useStyles = makeStyles()(() => ({
  text: {
    color: '#606060',
    fontSize: '0.9rem',
  },
}))

export function DocumentationText({ children }: Props): ReactElement {
  const { classes } = useStyles()

  return <Typography className={classes.text}>{children}</Typography>
}
