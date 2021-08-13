import { Card, CardContent, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import type { ReactElement } from 'react'
import { Title, TooltipTitle } from './Title'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
})

interface Props {
  label: string
  statistic?: string
  loading?: boolean
  tooltip?: string
}

export default function StatCard({ loading, label, statistic, tooltip }: Props): ReactElement {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        {loading && (
          <>
            <Skeleton width={180} height={25} animation="wave" />
            <Skeleton width={180} height={35} animation="wave" />
          </>
        )}
        {!loading && (
          <>
            {tooltip && <TooltipTitle label={label} tooltip={tooltip} />}
            {!tooltip && <Title label={label} />}
            <Typography variant="h5" component="h2">
              {statistic}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}
