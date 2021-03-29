import React from 'react'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';

import EthereumAddress from '../components/EthereumAddress';
import { Skeleton } from '@material-ui/lab';

import type { ChequebookAddressResponse } from '@ethersphere/bee-js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginTop: '20px',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    status: {
        color: '#fff',
        backgroundColor: '#76a9fa',
    }
  }),
);  


interface NodeAddresses {
    overlay: string,
    underlay: string[],
    ethereum: string,
    public_key: string, 
    pss_public_key: string
}

interface IProps{
    nodeAddresses: NodeAddresses | null,
    isLoadingNodeAddresses: boolean,
    chequebookAddress: ChequebookAddressResponse | null,
    isLoadingChequebookAddress: boolean,
}

function EthereumAddressCard(props: IProps) {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.root}>
                {props.isLoadingNodeAddresses ? 
                <div style={{padding: '16px'}}>
                    <Skeleton width={300} height={30} animation="wave" />
                    <Skeleton width={300} height={50} animation="wave" />
                </div>
                :
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subtitle1" gutterBottom>Ethereum Address</Typography>
                        <EthereumAddress
                        address={props.nodeAddresses?.ethereum}
                        network={'goerli'}
                        />   
                    </CardContent>
                </div>}
                {props.isLoadingChequebookAddress ? 
                <div style={{padding: '16px'}}>
                    <Skeleton width={300} height={30} animation="wave" />
                    <Skeleton width={300} height={50} animation="wave" />
                </div>
                :
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subtitle1" gutterBottom>Chequebook Contract Address</Typography>
                        <EthereumAddress
                        address={props.chequebookAddress?.chequebookaddress}
                        network={'goerli'}
                        />   
                    </CardContent>
                </div>}
            </Card>
        </div>
    )
}

export default EthereumAddressCard
