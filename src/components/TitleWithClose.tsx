import { Grid, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

import { CloseButton } from './CloseButton'

interface Props {
  children: string
  onClose: () => void
}

const useStyles = makeStyles()(() => ({
  text: {
    color: '#606060',
    fontWeight: 'bold',
  },
}))

export function TitleWithClose({ children, onClose }: Props): ReactElement {
  const { classes } = useStyles()

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <span>&nbsp;</span>
      <Typography className={classes.text} align="center">
        {children}
      </Typography>
      <CloseButton onClose={onClose} />
    </Grid>
  )
}
