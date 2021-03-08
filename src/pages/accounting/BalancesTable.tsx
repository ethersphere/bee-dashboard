import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip, Container, CircularProgress } from '@material-ui/core';

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
    loading?: boolean,
}
  
function BalancesTable(props: IProps) {
    const classes = useStyles();

    return (
        <div>
            {props.loading ? 
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
            :
             <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="simple table">
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
            </TableContainer>}
        </div>
    )
}

export default BalancesTable;
