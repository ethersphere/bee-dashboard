import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography } from '@material-ui/core/'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
})

interface IProps {
  label: string
  statistic?: string
  loading?: boolean
}

export default function StatCard({ loading, label, statistic }: IProps) {
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
