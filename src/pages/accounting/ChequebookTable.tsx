import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip } from '@material-ui/core';
import { Cancel, Autorenew } from '@material-ui/icons';

import { beeDebugApi } from '../../services/bee';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface ChequeEvent {
    beneficiary: string,
    chequebook: string,
    payout: number,
}

interface PeerCheque {
    lastreceived?: ChequeEvent,
    lastsent?: ChequeEvent,
    peer: string,
}

interface PeerCheques {
    lastcheques: Array<PeerCheque>
}

interface IProps {
    peerCheques: PeerCheques,
    loadingPeerCheques: boolean,
}
  
function ChequebookTable(props: IProps) {
    const classes = useStyles();

    return (
        <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell>Last Received</TableCell>
                        <TableCell>Last Sent</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.peerCheques.lastcheques.map((peerCheque: PeerCheque, idx: number) => (
                        <TableRow key={peerCheque.peer}>
                        <TableCell>
                            {peerCheque.peer}
                        </TableCell>
                        <TableCell>
                            <p style={{marginBottom: '0px'}}><small>{peerCheque.lastreceived?.beneficiary}</small></p>
                            <span>{peerCheque.lastreceived?.payout}</span>
                        </TableCell>
                        <TableCell>
                            <p  style={{marginBottom: '0px'}}><small>{peerCheque.lastsent?.beneficiary}</small></p>
                            <span>{peerCheque.lastsent?.payout}</span>
                        </TableCell>
                        <TableCell align="right">
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ChequebookTable;
