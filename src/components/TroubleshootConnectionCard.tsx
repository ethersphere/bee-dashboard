import { Button, Grid, Link as MuiLink, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Activity from 'remixicon-react/PulseLineIcon'
import { makeStyles } from 'tss-react/mui'

import { BEE_DISCORD_HOST, BEE_DOCS_HOST } from '../constants'
import { ROUTES } from '../routes'

const useStyles = makeStyles()(theme => ({
  root: {
    height: '100%',
  },
  content: {
    maxWidth: 500,
    marginBottom: theme.spacing(4),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  icon: {
    height: '1rem',
  },
}))

export default function TroubleshootConnectionCard(): ReactElement {
  const { classes } = useStyles()

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.root}>
      <Grid className={classes.content}>
        <Typography variant="h1" align="center">
          Uh oh, it looks like your node is not connected.
        </Typography>
      </Grid>
      <Grid className={classes.content}>
        <Typography align="center">
          Please check your node status to fix the problem. You can also check out the{' '}
          <MuiLink href={BEE_DOCS_HOST} target="_blank" rel="noreferrer">
            Swarm Bee Docs
          </MuiLink>{' '}
          or ask for support on the{' '}
          <MuiLink href={BEE_DISCORD_HOST} target="_blank" rel="noreferrer">
            Ethereum Swarm Discord
          </MuiLink>
          .
        </Typography>
      </Grid>
      <Grid className={classes.content}>
        <Typography align="center">
          <Button
            component={Link}
            variant="contained"
            startIcon={<Activity className={classes.icon} />}
            to={ROUTES.STATUS}
          >
            Check node status
          </Button>
        </Typography>
      </Grid>
    </Grid>
  )
}
