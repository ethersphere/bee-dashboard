import React from 'react'

import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Chip } from '@material-ui/core/';
import { Check } from '@material-ui/icons/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    status: {
        color: '#b24c4c'
    }
  }),
);  

function StatusCard() {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Card className={classes.root}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                    <Chip
                    icon={<Check />}
                    label=''
                    variant="outlined"
                    className={classes.status}
                    />
                        <span>Connected to Bee Node</span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Mac Miller
                    </Typography>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default StatusCard
