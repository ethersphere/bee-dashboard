import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Grid, Typography, Link as MuiLink } from '@material-ui/core/'
import { ROUTES } from '../routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    content: {
      maxWidth: 500,
      marginBottom: theme.spacing(2),
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
          <MuiLink href={process.env.REACT_APP_BEE_DOCS_HOST} target="_blank" rel="noreferrer">
            Swarm Bee Docs
          </MuiLink>{' '}
          or ask for support on the{' '}
          <a href={process.env.REACT_APP_BEE_DISCORD_HOST} target="_blank" rel="noreferrer">
            Ethereum Swarm Discord
          </a>
          .
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Typography align="center">
          <Link to={ROUTES.STATUS}>Check node status</Link>
        </Typography>
      </Grid>
    </Grid>
  )
}
