import React, { useState } from 'react'
import { Paper, Container, Drawer, Button, Typography, CircularProgress, Grid } from '@material-ui/core';
import ClipboardCopy from '../../components/ClipboardCopy';
import { beeDebugApi } from '../../services/bee';
import EthereumAddress from '../../components/EthereumAddress';

function truncStringPortion(str: string, firstCharCount=10, endCharCount=10) {
	var convertedStr="";
	convertedStr+=str.substring(0, firstCharCount);
	convertedStr += ".".repeat(3);
	convertedStr+=str.substring(str.length-endCharCount, str.length);
	return convertedStr;
}

export default function Index(props: any) {
    const [open, setOpen] = useState(false);
    const [peerCashout, setPeerCashout] = useState({ "peer": "",
    "chequebook": "",
    "cumulativePayout": 0,
    "beneficiary": "",
    "transactionHash": "",
    "result": {
    "recipient": "",
    "lastPayout": 0,
    "bounced": false
    }});

    const [peerCheque, setPeerCheque] = useState({
        lastreceived: { beneficiary: "", payout: 0, chequebook: "" },
        lastsent: { beneficiary: "", payout: 0, chequebook: "" },
        peer: ""
    })

    const [isLoadingPeerCheque, setIsLoadingPeerCheque] = useState<boolean>(false)
    const [isLoadingPeerCashout, setIsLoadingPeerCashout] = useState<boolean>(false);


    const handleClickOpen = (peerId: string) => {
        setIsLoadingPeerCashout(true)
        beeDebugApi.chequebook.getPeerLastCashout(peerId)
        .then(res => {
            setPeerCashout(res.data)
        })
        .catch(error => {
        })
        .finally(() => {
            setIsLoadingPeerCashout(false)
        })

        setIsLoadingPeerCheque(true)
        beeDebugApi.chequebook.getPeerLastCheques(peerId)
        .then(res => {
            setPeerCheque(res.data)
        })
        .catch(error => {
        })
        .finally(() => {
            setIsLoadingPeerCheque(false)
        })

        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
    };
    

    return (
        <div>
            <Button color="primary" onClick={() => handleClickOpen(props.peerId)}>{truncStringPortion(props.peerId)}</Button>
            <Drawer anchor={'right'} open={open} onClose={handleClose}>
                <div style={{padding:'20px'}}>
                    <Typography variant="h5" gutterBottom style={{display:'flex'}}>
                        <span>Peer: { truncStringPortion(props.peerId) }</span>
                        <ClipboardCopy value={props.peerId} />
                    </Typography>
                    <Paper>
                        {  isLoadingPeerCashout || isLoadingPeerCheque ?
                        <Container style={{textAlign:'center', padding:'50px'}}>
                            <CircularProgress />
                        </Container>
                        : 
                        <div style={{textAlign:'left', padding:'10px'}}>
                            <h3>Last Cheque</h3>
                            <Grid container spacing={1}>
                                <Grid key={1} item xs={12} sm={12} xl={6}>
                                    <h5>Last Sent</h5>
                                    <p>Payout: {peerCheque.lastsent?.payout}</p>
                                    <p>Beneficiary: 
                                        <EthereumAddress
                                        network={'goerli'}
                                        hideBlockie
                                        address={peerCheque.lastsent?.beneficiary}
                                        />
                                    </p>
                                    <p>Chequebook: 
                                        <EthereumAddress
                                        network={'goerli'}
                                        hideBlockie
                                        address={peerCheque.lastsent?.chequebook}
                                        />
                                    </p>
                                </Grid>
                                <Grid key={1} item xs={12} sm={12} xl={6}>
                                    <h5>Last Received</h5>
                                    <p>Payout: {peerCheque.lastreceived?.payout}</p>
                                    <p>Beneficiary: 
                                        <EthereumAddress
                                        network={'goerli'}
                                        hideBlockie
                                        address={peerCheque.lastreceived?.beneficiary}
                                        />
                                    </p>
                                    <p>Chequebook: 
                                        <EthereumAddress
                                        network={'goerli'}
                                        hideBlockie
                                        address={peerCheque.lastreceived?.chequebook}
                                        />
                                    </p>
                                </Grid>
                            </Grid>
                            <h3>Last Cashout</h3>
                            {peerCashout.cumulativePayout  > 0 ? 
                            <div>
                                <p>Cumulative Payout: {peerCashout.cumulativePayout}</p>
                                <p>
                                    <span>Last Payout: {peerCashout.result.lastPayout}</span>
                                    <span> {peerCashout.result.bounced ? 'Bounced' : ''}</span>
                                </p>
                                <p>Beneficiary: 
                                    <EthereumAddress
                                    network={'goerli'}
                                    hideBlockie
                                    address={peerCashout.beneficiary}
                                    />
                                </p>
                                <p>Chequebook:
                                    <EthereumAddress
                                    network={'goerli'}
                                    hideBlockie
                                    address={peerCashout.chequebook}
                                    />
                                </p>
                                <p>Recipient: 
                                    <EthereumAddress
                                    network={'goerli'}
                                    hideBlockie
                                    address={peerCashout.result.recipient}
                                    />
                                </p>
                                <p>Transaction: 
                                    <EthereumAddress
                                    transaction
                                    network={'goerli'}
                                    hideBlockie
                                    address={peerCashout.transactionHash}
                                    />
                                </p>
                            </div>
                            : 'None'}
                        </div>
                        }
                    </Paper>
                </div>
            </Drawer>
        </div>
    )
}
