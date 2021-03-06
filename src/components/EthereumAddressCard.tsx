import React from 'react'

import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';
import { OpenInNewSharp } from '@material-ui/icons';

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
                        <Typography component="p" variant="subtitle1">
                            <div style={{display:'flex'}}>
                                <span style={{marginRight:'7px'}}>Ethereum Address</span>
                                <QRCodeModal
                                value={ props.nodeAddresses.ethereum }
                                label={'Ethereum Address'}
                                />
                                <ClipboardCopy
                                value={ props.nodeAddresses.ethereum }
                                />
                            </div>
                        </Typography>
                        <Identicon size='20' string={props.nodeAddresses.ethereum} />
                        <a 
                        style={{ marginLeft: '7px'}}
                        href={`https://${'goerli'}.${process.env.REACT_APP_ETHERSCAN_HOST}/address/${props.nodeAddresses.ethereum}`}
                        target='_blank'
                        >
                            { props.nodeAddresses.ethereum }
                        </a>                        
                    </CardContent>
                </div>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="p" variant="subtitle1">
                        <div style={{display:'flex'}}>
                            <span style={{marginRight:'7px'}}>Contract Address</span>
                            <QRCodeModal
                            value={ props.chequebookAddress.chequebookaddress }
                            label={'Contract Address'}
                            />
                            <ClipboardCopy
                            value={ props.chequebookAddress.chequebookaddress }
                            />
                        </div>
                    </Typography>
                    <Identicon size='20' string={props.chequebookAddress.chequebookaddress} />
                    <a 
                    style={{ marginLeft: '7px'}}
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
