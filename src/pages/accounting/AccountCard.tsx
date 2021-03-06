import React from 'react'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Button } from '@material-ui/core/';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
    },
    address: {
        color: 'grey',
        fontWeight: 400,
      },
    content: {
        flexGrow: 1,
    },
    status: {
        color: '#fff',
        backgroundColor: '#76a9fa',
    }
  }),
);  

interface ChequebookAddress {
    chequebookaddress: string,
}

interface ChequebookBalance {
    totalBalance: number,
    availableBalance: number
}

interface IProps{
    chequebookAddress: ChequebookAddress,
    loadingChequebookAddress: boolean,
    chequebookBalance: ChequebookBalance,
    loadingChequebookBalance: boolean,
}

const ConvertBalanceToBZZ = (amount: number) =>  {
    return amount / (10 ^ 16)
}

function AccountCard(props: IProps) {
    const classes = useStyles();

    return (
        <div>
            <div style={{justifyContent: 'space-between', display: 'flex'}}>
                <h2 style={{ marginTop: '0px' }}>Contract <span className={classes.address}>{ props.chequebookAddress.chequebookaddress }</span></h2>
                <div>
                    <Button variant="outlined" color="primary" style={{marginRight:'7px'}}>Deposit</Button>
                    <Button variant="outlined" color="primary">Withdrawl</Button>
                </div>
            </div>
            
            <Card className={classes.root}>
                { !props.loadingChequebookBalance && props.chequebookBalance ? 
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Grid container spacing={5}>
                            <Grid item>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Total Balance
                                </Typography>
                                <Typography component="p" variant="h5">
                                    {ConvertBalanceToBZZ(props.chequebookBalance.totalBalance)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Available Balance
                                </Typography>
                                <Typography component="p" variant="h5">
                                    {ConvertBalanceToBZZ(props.chequebookBalance.availableBalance)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </div>
                :
                <div className={classes.details}>
                    <Skeleton width={180} height={110} animation="wave" style={{ marginLeft: '12px', marginRight: '12px'}} />
                    <Skeleton width={180} height={110} animation="wave" />
                </div>
                }
            </Card>
        </div>
    )
}

export default AccountCard;
