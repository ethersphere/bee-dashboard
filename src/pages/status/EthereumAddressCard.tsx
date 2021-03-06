import React from 'react'

import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Chip } from '@material-ui/core/';
import { OpenInNewSharp } from '@material-ui/icons';

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
                    <Typography component="p" variant="subtitle1">
                        <span>Ethereum Address</span>
                    </Typography>
                    <a 
                    href={`https://${'goerli'}.${process.env.REACT_APP_ETHERSCAN_HOST}/address/${props.nodeAddresses.ethereum}`}
                    target='_blank'
                    >
                        { props.nodeAddresses.ethereum }
                    </a>
                    <OpenInNewSharp fontSize="small" />
                    </CardContent>
                </div>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="p" variant="subtitle1">
                        <span>Contract Address</span>
                    </Typography>
                    <a 
                    href={`https://${'goerli'}.${process.env.REACT_APP_ETHERSCAN_HOST}/address/${props.chequebookAddress.chequebookaddress}`}
                    target='_blank'
                    >
                        { props.chequebookAddress.chequebookaddress }
                    </a>
                    <OpenInNewSharp fontSize="small" />
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default EthereumAddressCard
