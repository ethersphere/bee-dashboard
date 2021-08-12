import { Card, CardContent, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import type { ReactElement } from 'react'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 16,
  },
  details: {
    marginTop: 12,
  },
})

interface Props {
  label: string
  statistic?: string
  loading?: boolean
  details?: string
}

export default function StatCard({ loading, label, statistic, details }: Props): ReactElement {
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
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h5" component="h2">
              {statistic}
            </Typography>
            <Typography variant="body2" component="p" className={classes.details}>
              {details}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}
