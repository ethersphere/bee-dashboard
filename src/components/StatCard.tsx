import React from 'react'

import { makeStyles, } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

interface IProps {
    label: string,
    statistic: string
}

export default function StatCard(props: IProps) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                {props.label}
                </Typography>
                <Typography variant="h5" component="h2">
                {props.statistic}
                </Typography>
            </CardContent>
        </Card>
    )
}
