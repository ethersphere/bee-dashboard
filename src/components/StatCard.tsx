import React from 'react'

import { makeStyles, } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';
import { Skeleton } from '@material-ui/lab';

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
  });

interface IProps {
    label: string,
    statistic: string,
    loading?: boolean,
}

export default function StatCard(props: IProps) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
            {props.loading ? 
                <div>
                    <Skeleton width={180} height={25} animation="wave" />
                    <Skeleton width={180} height={35} animation="wave" />
                </div>
                :
                <div>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.label}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {props.statistic}
                  </Typography>
                </div>
            }
            </CardContent>
        </Card>
    )
}
