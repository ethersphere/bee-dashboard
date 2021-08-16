import { Grid, Tooltip, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { Info } from '@material-ui/icons'
import type { ReactElement } from 'react'

interface TitleProps {
  label: string
  tooltip?: string
}

const useStyles = makeStyles({
  title: {
    fontSize: 16,
  },
})

export function Title({ label, tooltip }: TitleProps): ReactElement {
  const classes = useStyles()

  if (!tooltip) {
    return (
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {label}
      </Typography>
    )
  }

  // span is needed as Tooltip expects a non-functional element!
  return (
    <Tooltip title={tooltip}>
      <span>
        <Grid container direction="row" justify="space-between">
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {label}
          </Typography>
          <Info />
        </Grid>
      </span>
    </Tooltip>
  )
}
