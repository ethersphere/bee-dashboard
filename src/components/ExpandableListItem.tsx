import { ReactElement, ReactNode } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton, Tooltip } from '@material-ui/core'
import { Info } from 'react-feather'
import ListItem from '@material-ui/core/ListItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(0.25),
      wordBreak: 'break-word',
    },
    copyValue: {
      cursor: 'pointer',
      padding: theme.spacing(1),
      borderRadius: 0,
      '&:hover': {
        backgroundColor: '#fcf2e8',
        color: theme.palette.primary.main,
      },
    },
  }),
)

interface Props {
  label?: ReactNode
  value?: ReactNode
  tooltip?: string
}

export default function ExpandableListItem({ label, value, tooltip }: Props): ReactElement | null {
  const classes = useStyles()

  return (
    <ListItem className={classes.header}>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        {label && <Typography variant="body1">{label}</Typography>}
        {value && (
          <Typography variant="body2">
            {value}
            {tooltip && (
              <Tooltip title={tooltip} placement="top" arrow>
                <IconButton size="small" className={classes.copyValue}>
                  <Info strokeWidth={1} />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
        )}
      </Grid>
    </ListItem>
  )
}
