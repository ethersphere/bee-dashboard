import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface PeerBalance {
    balance: number,
    peer: string,
}

interface PeerBalances {
    balances: Array<PeerBalance>
}

interface IProps {
    peerBalances: PeerBalances,
    loadingPeerBalances: boolean,
}
  
function BalancesTable(props: IProps) {
    const classes = useStyles();

    return (
        <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.peerBalances.balances.map((peerBalance: PeerBalance, idx: number) => (
                        <TableRow key={peerBalance.peer}>
                        <TableCell>{peerBalance.peer}</TableCell>
                        <TableCell>{peerBalance.balance}</TableCell>
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

export default BalancesTable;
