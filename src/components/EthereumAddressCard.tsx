import React from 'react'

import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';
import { OpenInNewSharp } from '@material-ui/icons';

import EthereumAddress from '../components/EthereumAddress';
import QRCodeModal from './QRCodeModal';
import ClipboardCopy from './ClipboardCopy';

// @ts-ignore
import Identicon from 'react-identicons';

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

interface ChequebookAddress {
    chequebookaddress: string,
}

interface NodeAddresses {
    overlay: string,
    underlay: string[],
    ethereum: string,
    public_key: string, 
    pss_public_key: string
}

interface IProps{
    nodeAddresses: NodeAddresses,
    loadingNodeAddresses: boolean,
    chequebookAddress: ChequebookAddress,
    loadingChequebookAddress: boolean,
}

function EthereumAddressCard(props: IProps) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Card className={classes.root}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subtitle1" gutterBottom>
                            <span>Ethereum Address</span>
                        </Typography>
                        <EthereumAddress
                        address={props.nodeAddresses.ethereum}
                        network={'goerli'}
                        />   
                    </CardContent>
                </div>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subtitle1" gutterBottom>
                            <span>Contract Address</span>
                        </Typography>
                        <EthereumAddress
                        address={props.chequebookAddress.chequebookaddress}
                        network={'goerli'}
                        />   
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default EthereumAddressCard
