import { Button, Grid, Link as MuiLink, Typography } from '@material-ui/core/'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import type { ReactElement } from 'react'
import { Activity } from 'react-feather'
import { Link } from 'react-router-dom'
import { config } from '../config'
import { ROUTES } from '../routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
)

export default function TroubleshootConnectionCard(): ReactElement {
  const classes = useStyles()

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.root}>
      <Grid item className={classes.content}>
        <Typography variant="h1" align="center">
          Uh oh, it looks like your node is not connected.
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Typography align="center">
          Please check your node status to fix the problem. You can also check out the{' '}
          <MuiLink href={config.BEE_DOCS_HOST} target="_blank" rel="noreferrer">
            Swarm Bee Docs
          </MuiLink>{' '}
          or ask for support on the{' '}
          <MuiLink href={config.BEE_DISCORD_HOST} target="_blank" rel="noreferrer">
            Ethereum Swarm Discord
          </MuiLink>
          .
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
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
