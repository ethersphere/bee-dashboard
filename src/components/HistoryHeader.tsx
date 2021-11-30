import { Box, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { ReactElement } from 'react'
import { useHistory } from 'react-router'

interface Props {
  children: string
}

const useStyles = makeStyles(() =>
  createStyles({
    pressable: {
      cursor: 'pointer',
    },
    icon: {
      color: '#242424',
    },
  }),
)

export function HistoryHeader({ children }: Props): ReactElement {
  const classes = useStyles()
  const history = useHistory()

  function goBack() {
    history.goBack()
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
