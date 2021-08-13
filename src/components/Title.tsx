import { Tooltip, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { Info } from '@material-ui/icons'
import type { ReactElement } from 'react'
import { RowBetween } from './Row'

interface TitleProps {
  label: string
}

interface TooltipTitleProps extends TitleProps {
  tooltip: string
}

const useStyles = makeStyles({
  title: {
    fontSize: 16,
  },
})

export function Title({ label }: TitleProps): ReactElement {
  const classes = useStyles()

  return (
    <Typography className={classes.title} color="textSecondary" gutterBottom>
      {label}
    </Typography>
  )
}

export function TooltipTitle({ label, tooltip }: TooltipTitleProps): ReactElement {
  const classes = useStyles()

  // span is needed as Tooltip expects a non-functional element!
  return (
    <Tooltip title={tooltip}>
      <span>
        <RowBetween>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {label}
          </Typography>
          <Info />
        </RowBetween>
      </span>
    </Tooltip>
  )
}
