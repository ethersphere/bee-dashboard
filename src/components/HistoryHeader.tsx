import { ArrowBack } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

interface Props {
  children: string
}

const useStyles = makeStyles()(() => ({
  pressable: {
    cursor: 'pointer',
  },
  icon: {
    color: '#242424',
  },
}))

export function HistoryHeader({ children }: Props): ReactElement {
  const { classes } = useStyles()
  const navigate = useNavigate()

  function goBack() {
    navigate(-1)
  }

  return (
    <Box mb={4}>
      <Grid container direction="row">
        <Box mr={2}>
          <div className={classes.pressable} onClick={goBack}>
            <ArrowBack className={classes.icon} />
          </div>
        </Box>
        <Typography variant="h1">{children}</Typography>
      </Grid>
    </Box>
  )
}
